import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { FREE_DOWNLOAD_LIMIT } from "@/lib/permissions";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * GET /api/preset/[slug]?format=hlx
 *
 * Auth-gated preset download. Replaces the old static `/presets/<slug>.hlx`
 * route — files now live outside `public/` so they can't be hot-linked.
 *
 * Flow:
 *   - anon          → 401 with { error, redirect: "/login" }
 *   - free, < quota → counts against recipe_downloads (max 10), streams file
 *   - free, ≥ quota → 402 with { error, upgrade: "/pricing" }
 *   - premium/creator/admin → unlimited, still logged for analytics
 */

const PRESETS_DIR = path.join(process.cwd(), "presets");

function parseFormat(input: string | null): "hlx" | "tsl" | null {
  if (input === "hlx" || input === "tsl") return input;
  return null;
}

function getAnonClient(req: Request) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("authorization") ?? "",
        },
      },
    },
  );
}

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  // Rate limit per IP: 30 preset downloads per minute is plenty for a
  // legitimate user clicking around, low enough to make scrape-via-API
  // harder than worth.
  const { limited } = rateLimit(`preset:${getClientIp(req)}`, 30, 60_000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429 },
    );
  }

  const { slug } = await params;
  const url = new URL(req.url);
  const format = parseFormat(url.searchParams.get("format")) ?? "hlx";

  // Auth check — accept Bearer access token from the client.
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Sign in to download presets.", redirect: "/login" },
      { status: 401 },
    );
  }

  const supabase = getAnonClient(req);
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json(
      { error: "Session expired. Sign in again.", redirect: "/login" },
      { status: 401 },
    );
  }

  // Quota check — only free users have a cap.
  const admin = getAdminClient();
  const { data: profileRow } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = ((profileRow as { role?: string } | null)?.role ?? "free") as
    | "free"
    | "premium"
    | "creator"
    | "admin"
    | "super_admin";

  if (role === "free") {
    const { count, error: countError } = await admin
      .from("recipe_downloads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("download_type", "preset");

    if (countError) {
      console.error("[preset] count error:", countError);
      return NextResponse.json(
        { error: "Couldn't check quota. Try again." },
        { status: 500 },
      );
    }

    if ((count ?? 0) >= FREE_DOWNLOAD_LIMIT) {
      return NextResponse.json(
        {
          error: `You've used all ${FREE_DOWNLOAD_LIMIT} free preset downloads.`,
          upgrade: "/pricing?from=preset-quota",
          used: count,
          limit: FREE_DOWNLOAD_LIMIT,
        },
        { status: 402 },
      );
    }
  }

  // Resolve the file. The slug is constrained to safe chars to defend
  // against ../escape attempts; we also confirm the resolved path stays
  // within PRESETS_DIR.
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  const filename = `${slug}.${format}`;
  const filePath = path.join(PRESETS_DIR, filename);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(PRESETS_DIR + path.sep)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  let file: Buffer;
  try {
    file = fs.readFileSync(resolved);
  } catch {
    return NextResponse.json(
      { error: `No ${format.toUpperCase()} preset for ${slug}.` },
      { status: 404 },
    );
  }

  // Log the download (always — even paid users, for analytics).
  await admin.from("recipe_downloads").insert({
    user_id: user.id,
    email: user.email,
    recipe_slug: slug,
    download_type: "preset",
    platform: format === "hlx" ? "helix" : "katana",
  } as never);

  // Compute new remaining count (if free) so the UI can render a toast
  // like "Downloaded — 3 of 10 free this month left."
  let remaining: number | null = null;
  if (role === "free") {
    const { count: after } = await admin
      .from("recipe_downloads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("download_type", "preset");
    remaining = Math.max(0, FREE_DOWNLOAD_LIMIT - (after ?? 0));
  }

  return new NextResponse(file as unknown as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(file.byteLength),
      "Cache-Control": "no-store",
      "X-Preset-Remaining": remaining === null ? "unlimited" : String(remaining),
    },
  });
}
