import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { canDownload } from "@/lib/downloads";
import { generateHelixPreset, slugifyPresetName } from "@/lib/helix/generate-hlx";
import { generateQCPreset, slugifyPresetName as slugifyQC } from "@/lib/quadcortex/generate-qc";
import { generateKatanaTSL, slugifyPresetName as slugifyKatana } from "@/lib/katana/generate-tsl";
import type { PlatformTranslation, Platform } from "@/types/recipe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------------------------------------------------- */
/*  Platform preset generators                                                 */
/* -------------------------------------------------------------------------- */

const PLATFORM_CONFIG: Record<
  string,
  {
    generate: (t: PlatformTranslation, name: string) => string;
    slugify: (name: string) => string;
    extension: string;
    mimeType: string;
  }
> = {
  helix: {
    generate: generateHelixPreset,
    slugify: slugifyPresetName,
    extension: ".hlx",
    mimeType: "application/json",
  },
  quad_cortex: {
    generate: generateQCPreset,
    slugify: slugifyQC,
    extension: ".json",
    mimeType: "application/json",
  },
  katana: {
    generate: generateKatanaTSL,
    slugify: slugifyKatana,
    extension: ".tsl",
    mimeType: "application/xml",
  },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function getAuthenticatedSupabase(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
}

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const supabase = getAuthenticatedSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get role from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    role: (profile?.role as string) || "free",
    token,
  };
}

async function logDownload(opts: {
  userId?: string;
  email?: string;
  recipeSlug: string;
  downloadType: "pdf" | "preset";
  platform?: string;
}) {
  const supabase = getSupabase();
  await supabase.from("recipe_downloads").insert({
    user_id: opts.userId ?? null,
    email: opts.email ?? null,
    recipe_slug: opts.recipeSlug,
    download_type: opts.downloadType,
    platform: opts.platform ?? null,
  } as any);
}

/* -------------------------------------------------------------------------- */
/*  POST handler                                                               */
/* -------------------------------------------------------------------------- */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { type, platform, email } = body as {
      type: "pdf" | "preset";
      platform?: string;
      email?: string;
    };

    if (!type || !["pdf", "preset"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid download type. Must be 'pdf' or 'preset'." },
        { status: 400 },
      );
    }

    // ---- Fetch recipe data ----
    const recipe = getRecipeBySlug(slug);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    const song = getSongBySlug(recipe.song_slug);
    const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
    const user = await getUserFromRequest(req);

    // ======================================================================
    // PDF download
    // ======================================================================
    if (type === "pdf") {
      // Email required if not authenticated
      if (!user && (!email || !EMAIL_RE.test(email))) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 400 },
        );
      }

      // Subscribe to newsletter if email provided (on conflict do nothing)
      if (email) {
        const supabase = getSupabase();
        await supabase
          .from("newsletter_subscribers")
          .insert({ email: email.toLowerCase(), source: "pdf_download" } as any);
        // Ignore unique constraint errors — already subscribed
      }

      // Generate PDF
      const { generateRecipePDF } = await import("@/lib/pdf/generate-recipe-pdf");
      const pdfBuffer = generateRecipePDF({
        recipe,
        songTitle: song?.title ?? "",
        artistName: artist?.name ?? "",
        artistGenres: artist?.genres ?? [],
      });

      // Log download
      await logDownload({
        userId: user?.id,
        email: email ?? user?.email,
        recipeSlug: slug,
        downloadType: "pdf",
      });

      // Send welcome email (non-blocking)
      if (email) {
        import("@/lib/email").then(({ sendWelcomeEmail }) => {
          sendWelcomeEmail(email, recipe.title).catch(() => {});
        });
      }

      const filename = `${slug}-tone-recipe.pdf`;
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // ======================================================================
    // Preset download
    // ======================================================================
    if (type === "preset") {
      if (!user) {
        return NextResponse.json(
          { error: "You must be signed in to download presets." },
          { status: 401 },
        );
      }

      if (!platform || !PLATFORM_CONFIG[platform]) {
        return NextResponse.json(
          { error: "Invalid or missing platform." },
          { status: 400 },
        );
      }

      // Check download limit for free users
      const { allowed, remaining } = await canDownload(user.id, user.role);
      if (!allowed) {
        return NextResponse.json(
          {
            error: "You've used all your free downloads. Upgrade to Premium for unlimited downloads.",
            remaining: 0,
          },
          { status: 403 },
        );
      }

      const translations = recipe.platform_translations as Partial<
        Record<Platform, PlatformTranslation>
      >;
      const translation = translations[platform as Platform];

      if (!translation) {
        return NextResponse.json(
          { error: `No ${platform} translation available for this recipe.` },
          { status: 404 },
        );
      }

      const config = PLATFORM_CONFIG[platform];
      const content = config.generate(translation, recipe.title);
      const filename = `${config.slugify(recipe.title)}${config.extension}`;

      // Log download
      await logDownload({
        userId: user.id,
        email: user.email,
        recipeSlug: slug,
        downloadType: "preset",
        platform,
      });

      return new NextResponse(content, {
        headers: {
          "Content-Type": config.mimeType,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  } catch (err) {
    console.error("Download route error:", err);
    return NextResponse.json(
      { error: "Unable to process download. Please try again later." },
      { status: 500 },
    );
  }
}
