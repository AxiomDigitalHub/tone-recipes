import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "@/lib/oauth-discovery";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { canDownload } from "@/lib/downloads";
import { generateHelixPreset, slugifyPresetName } from "@/lib/helix/generate-hlx";
import { generateQCPreset, slugifyPresetName as slugifyQC } from "@/lib/quadcortex/generate-qc";
import { generateKatanaTSL, slugifyPresetName as slugifyKatana } from "@/lib/katana/generate-tsl";
import JSZip from "jszip";
import {
  buildToneNotes,
  buildInstallGuide,
  buildTroubleshooter,
} from "@/lib/downloads/sidecar";
import type { PlatformTranslation, Platform, ToneRecipe } from "@/types/recipe";

// PDF generation launches headless Chrome — needs the Node.js runtime (not
// Edge) and extra time for cold-start + render.
export const runtime = "nodejs";
export const maxDuration = 60;

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
  // Service role: migration 026 revoked recipe_downloads INSERT from the
  // anon/authenticated roles (quota-burning attack surface), so download
  // logging — and the quota count it feeds — must run privileged.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
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

  // Role drives the download quota: free = metered, paid = unlimited.
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
  // Rate limit: 30 downloads per minute per IP
  const { limited } = rateLimit(`download:${getClientIp(req)}`, 30, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many download requests. Please try again later." }, { status: 429 });
  }

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

      // Subscribe to newsletter if email provided (on conflict do nothing).
      // Best-effort: a Supabase hiccup (or missing env in local dev) must
      // NOT block the PDF the user asked for — the email gate is already
      // enforced above; persistence is a side effect.
      if (email) {
        try {
          const supabase = getSupabase();
          await supabase
            .from("newsletter_subscribers")
            .insert({ email: email.toLowerCase(), source: "pdf_download" } as any);
          // Ignore unique constraint errors — already subscribed
        } catch (e) {
          console.error("[download] newsletter insert failed (non-fatal):", e);
        }
      }

      // Render the beautiful HTML print view to PDF via headless Chrome, so
      // the download matches the web design exactly (replaces the old
      // hand-drawn jsPDF generator). song/artist are looked up by the print
      // route itself from the slug, so we only need the URL here.
      void song;
      void artist;
      const { renderUrlToPdf } = await import("@/lib/pdf/render-print-pdf");
      const printUrl = `${req.nextUrl.origin}/recipe/${slug}/print`;
      const pdfBuffer = await renderUrlToPdf(printUrl);

      // Log download (best-effort — analytics must not block the download).
      try {
        await logDownload({
          userId: user?.id,
          email: email ?? user?.email,
          recipeSlug: slug,
          downloadType: "pdf",
        });
      } catch (e) {
        console.error("[download] logDownload failed (non-fatal):", e);
      }

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
        return unauthorized({ error: "You must be signed in to download presets." });
      }

      if (!platform || !PLATFORM_CONFIG[platform]) {
        return NextResponse.json(
          { error: "Invalid or missing platform." },
          { status: 400 },
        );
      }

      // Quota gate. Paid accounts (pass/pro) are unlimited; free accounts
      // get 5 preset downloads per calendar month. The 402 status signals
      // "payment required" to the client, which maps to an upgrade prompt
      // rather than a generic error.
      const { allowed, remaining } = await canDownload(user.id, user.role);
      if (!allowed) {
        return NextResponse.json(
          {
            error:
              "You've used your 5 free preset downloads this month. Upgrade to Pass for unlimited downloads.",
            remaining: 0,
            upgrade_url: "/pricing",
          },
          { status: 402 },
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
      const baseName = config.slugify(recipe.title);

      // Log download
      await logDownload({
        userId: user.id,
        email: user.email,
        recipeSlug: slug,
        downloadType: "preset",
        platform,
      });

      // The download pack: preset + sidecar guides (tone notes, install,
      // rig-translation troubleshooter). Presets fail on rig translation,
      // not tone — the sidecars are the adaptation layer (see
      // docs/research/REDDIT_SERVICE_RESEARCH_2026-07-08.md).
      const platformLabel =
        platform === "quad_cortex"
          ? "Quad Cortex"
          : platform === "katana"
            ? "Boss Katana"
            : "Helix";
      const zip = new JSZip();
      zip.file(`${baseName}${config.extension}`, content);
      zip.file(
        "TONE-NOTES.txt",
        buildToneNotes(recipe as ToneRecipe, translation, platformLabel),
      );
      zip.file("INSTALL.txt", buildInstallGuide(platform));
      zip.file("IF-IT-SOUNDS-WRONG.txt", buildTroubleshooter(platform));
      const zipped = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
      });

      return new NextResponse(new Uint8Array(zipped), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${baseName}-pack.zip"`,
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
