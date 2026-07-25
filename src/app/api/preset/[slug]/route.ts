import { NextResponse } from "next/server";
import { unauthorized } from "@/lib/oauth-discovery";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * GET /api/preset/[slug]?format=hlx
 *
 * Auth-gated preset download. Files live outside `public/` so they
 * can't be hot-linked.
 *
 * As of 2026-05-10 the catalog is free — sign-in required, no quota.
 * Sign-in exists to capture an email for ToneTrace targeting and to
 * rate-limit abuse. Every download is logged to `recipe_downloads`
 * for analytics.
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
    return unauthorized({ error: "Sign in to download presets.", redirect: "/login" });
  }

  const supabase = getAnonClient(req);
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return unauthorized({ error: "Session expired. Sign in again.", redirect: "/login" });
  }

  // The recipe catalog is free as of 2026-05-10. Any signed-in user
  // can download any preset, unlimited. We still require sign-in so we
  // (a) have an email for ToneTrace launch and (b) can rate-limit abuse
  // and analyze which presets get traction. No quota check.
  const admin = getAdminClient();

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

  // Log the download for analytics + future ToneTrace targeting.
  await admin.from("recipe_downloads").insert({
    user_id: user.id,
    email: user.email,
    recipe_slug: slug,
    download_type: "preset",
    platform: format === "hlx" ? "helix" : "katana",
  } as never);

  return new NextResponse(file as unknown as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(file.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
