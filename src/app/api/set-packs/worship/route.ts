import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "@/lib/oauth-discovery";
import { createClient } from "@supabase/supabase-js";
import { generateWorshipSetPack } from "@/lib/helix/generate-set-pack";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { setPackAccess } from "@/lib/permissions";
import type { UserRole } from "@/lib/auth/auth-context";

/**
 * GET /api/set-packs/worship
 *
 * Downloads the Worship Set Pack .hlx file. As of 2026-05-10 this
 * requires:
 *   - A valid Bearer auth token (signed-in user), and
 *   - A row in `set_pack_purchases` for (user_id, pack_slug='worship')
 *     that is not refunded.
 *
 * Anyone hitting the unowned path gets a 402 with redirect to the pack
 * page, where they can complete checkout. Downloads are logged to
 * `recipe_downloads` for analytics + ToneTrace targeting.
 *
 * The preset content is generated at request time from the canonical
 * pack definition in `@/lib/helix/generate-set-pack` — there is no
 * file on disk.
 */

const PACK_SLUG_DB = "worship";
const PACK_SLUG_DOWNLOAD = "set-pack-worship";

function getAnonClient(authHeader: string | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader ?? "" } } },
  );
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function GET(req: NextRequest) {
  const { limited } = rateLimit(`setpack:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return unauthorized({ error: "Sign in to download.", redirect: "/login" });
  }
  const supabase = getAnonClient(authHeader);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return unauthorized({ error: "Invalid session." });
  }

  // Access check. Pro subscribers (and admins) get every Set Pack
  // bundled, so they download without a per-pack purchase row
  // (docs/PRICING_MODEL.md). Everyone else needs an unrefunded
  // `set_pack_purchases` row for this pack.
  const admin = getAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const role = (profile as { role?: UserRole } | null)?.role ?? "free";

  let owned = setPackAccess(role);
  if (!owned) {
    const { data: purchase } = await admin
      .from("set_pack_purchases")
      .select("id, refunded_at")
      .eq("user_id", user.id)
      .eq("pack_slug", PACK_SLUG_DB)
      .maybeSingle();
    owned =
      Boolean(purchase) &&
      !(purchase as { refunded_at?: string | null } | null)?.refunded_at;
  }
  if (!owned) {
    return NextResponse.json(
      {
        error: "You don't own the Worship Set Pack yet.",
        redirect: `/set-packs/${PACK_SLUG_DB}`,
      },
      { status: 402 },
    );
  }

  const hlxContent = generateWorshipSetPack("FK Worship");
  const filename = "FK-Worship.hlx";

  await admin.from("recipe_downloads").insert({
    user_id: user.id,
    email: user.email ?? "",
    recipe_slug: PACK_SLUG_DOWNLOAD,
    download_type: "preset",
    platform: "helix",
  } as never);

  return new NextResponse(hlxContent, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
