import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateWorshipSetPack } from "@/lib/helix/generate-set-pack";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * GET /api/set-packs/worship
 *
 * Downloads the Worship Set Pack .hlx file.
 *
 * Gating model (as of 2026-04 launch):
 *   - Free-with-signup: any authenticated user can download.
 *   - Stripe is not yet wired for one-time Set Pack purchases, so the
 *     pack is effectively free while it builds email list + demand
 *     signal.
 *   - Rate-limited by IP to curb scraping.
 *   - Every successful download is logged to `recipe_downloads` so we
 *     can count installs per pack and gauge conversion of
 *     browse → signup → download.
 *
 * When Stripe one-time purchases are ready, upgrade this route to
 * check a `set_pack_purchases` or similar entitlement table before
 * returning the file.
 */

const PACK_SLUG = "set-pack-worship";

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return { id: user.id, email: user.email ?? "" };
}

async function logDownload(userId: string, email: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  await supabase.from("recipe_downloads").insert({
    user_id: userId,
    email,
    recipe_slug: PACK_SLUG,
    download_type: "preset",
    platform: "helix",
  } as never);
}

export async function GET(req: NextRequest) {
  // Rate limit: 10 pack downloads per minute per IP (same as single-recipe
  // route). Trivial cost on the server side but deters zip-bomb clients.
  const { limited } = rateLimit(`setpack:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    );
  }

  // Require an authenticated user. Unauthenticated callers get a 401
  // with a pointer to the signup page; the /set-packs/worship front end
  // intercepts the click before the request is made, so users shouldn't
  // hit this path in practice — this is just the safety net.
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to download the Worship Set Pack." },
      { status: 401 },
    );
  }

  const hlxContent = generateWorshipSetPack("FK Worship");
  const filename = "FK-Worship.hlx";

  // Log the download — fire-and-forget, but await so the response isn't
  // sent until the write succeeds. On a 15-day-old product the latency
  // cost is worth the data accuracy.
  try {
    await logDownload(user.id, user.email);
  } catch {
    // Don't fail the download if logging fails.
  }

  return new NextResponse(hlxContent, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
