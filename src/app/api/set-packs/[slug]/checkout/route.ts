import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  stripe,
  ensureSetPackPrice,
  SET_PACKS,
  type SetPackSlug,
} from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/set-packs/[slug]/checkout
 *
 * Creates a one-time Stripe Checkout session for the requested Set Pack.
 * Requires Bearer auth — anon users see the sign-in prompt on the
 * pack page before they get this far. The webhook handler grants
 * ownership in `set_pack_purchases` on `checkout.session.completed`.
 *
 * If the user already owns the pack, returns 200 with `already_owned: true`
 * so the client can redirect them straight to the pack content.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { limited } = rateLimit(`pack-checkout:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await params;
  if (!(slug in SET_PACKS)) {
    return NextResponse.json({ error: "Unknown set pack." }, { status: 404 });
  }
  const packSlug = slug as SetPackSlug;
  const pack = SET_PACKS[packSlug];

  // Auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Sign in to buy this Set Pack.", redirect: "/login" },
      { status: 401 },
    );
  }
  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  // Already-owned short-circuit. Uses admin client to bypass RLS
  // (the user's anon client can also read their own row, but we want
  // a single deterministic path).
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data: existing } = await admin
    .from("set_pack_purchases")
    .select("id, refunded_at")
    .eq("user_id", user.id)
    .eq("pack_slug", packSlug)
    .maybeSingle();
  if (existing && !(existing as { refunded_at?: string | null }).refunded_at) {
    return NextResponse.json({
      already_owned: true,
      redirect: `/set-packs/${packSlug}`,
    });
  }

  try {
    const priceId = await ensureSetPackPrice(packSlug);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/set-packs/${packSlug}?purchased=true`,
      cancel_url: `${req.nextUrl.origin}/set-packs/${packSlug}`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        supabase_user_id: user.id,
        fk_set_pack: packSlug,
      },
      payment_intent_data: {
        metadata: {
          supabase_user_id: user.id,
          fk_set_pack: packSlug,
        },
        description: pack.name,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[set-pack-checkout] error:", err);
    return NextResponse.json(
      { error: "Couldn't create checkout session. Try again." },
      { status: 500 },
    );
  }
}
