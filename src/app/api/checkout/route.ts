import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/constants";

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for a subscription tier.
 *
 * Body: { tier?: "pass" | "pro"; interval: "annual" | "monthly" }
 * (`tier` defaults to "pass" if omitted, so older callers keep working.)
 *
 * Two-tier model (docs/PRICING_MODEL.md, 2026-06-15):
 *   - Pass — annual ($49) / monthly ($4.99)
 *   - Pro  — annual ($79) / monthly ($7.99); adds all Set Packs bundled
 *   (Team ships later and is not sold here yet.)
 *   - Reads Price IDs from env vars (STRIPE_{PASS,PRO}_PRICE_ID_{ANNUAL,
 *     MONTHLY}) rather than auto-creating products. The previous
 *     auto-create helper was deleted as a footgun — it would silently
 *     spawn duplicate products in live Stripe if env was misconfigured.
 *   - Tags every session with metadata.plan = tier so the webhook can
 *     route the upgrade to role='pass'|'pro'. Mirrors set-packs flow.
 *
 * Requires authentication via Bearer token.
 */

type Tier = "pass" | "pro";
type Interval = "annual" | "monthly";

const PRICE_IDS: Record<Tier, Record<Interval, string | undefined>> = {
  pass: {
    annual: process.env.STRIPE_PASS_PRICE_ID_ANNUAL,
    monthly: process.env.STRIPE_PASS_PRICE_ID_MONTHLY,
  },
  pro: {
    annual: process.env.STRIPE_PRO_PRICE_ID_ANNUAL,
    monthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY,
  },
};

export async function POST(req: NextRequest) {
  // 10 checkout attempts per minute per IP — keeps a stolen anon token
  // from spamming session creation, but generous enough that a user
  // toggling annual/monthly several times doesn't get throttled.
  const { limited } = rateLimit(`checkout:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { interval, tier = "pass" } = body as {
      interval?: Interval;
      tier?: Tier;
    };

    if (!interval || !["annual", "monthly"].includes(interval)) {
      return NextResponse.json(
        { error: "Invalid interval. Must be 'annual' or 'monthly'." },
        { status: 400 },
      );
    }
    if (!["pass", "pro"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier. Must be 'pass' or 'pro'." },
        { status: 400 },
      );
    }

    // ---- Auth (before env check so unauthenticated callers can't
    // probe whether env vars are configured) ----
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Sign in to start your Pass subscription.",
          redirect: "/login?next=/pricing",
        },
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

    // ---- Pricing env config (after auth so we don't leak env state) ----
    const priceId = PRICE_IDS[tier][interval];
    if (!priceId) {
      // Misconfigured env — this is what you see during a live-mode
      // rollout if STRIPE_{tier}_PRICE_ID_* is missing from the runtime
      // env (droplet .env.production). Honest error so the caller's
      // button surfaces "Pricing not configured" rather than a generic 500.
      console.error(
        `[checkout] STRIPE_${tier.toUpperCase()}_PRICE_ID_${interval.toUpperCase()} not set`,
      );
      return NextResponse.json(
        { error: "Pricing not configured. Please contact support." },
        { status: 503 },
      );
    }

    // ---- Already on the requested tier? Short-circuit to dashboard. ----
    //
    // Bypasses Stripe entirely so we don't create a duplicate
    // subscription if the user double-clicks the upgrade button. Only
    // short-circuits when the user is already on the SAME tier — a Pass
    // subscriber buying Pro should still proceed (it's a real upgrade).
    // The webhook is the source of truth for role assignment but this
    // quick check avoids a needless round trip.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, stripe_subscription_id")
      .eq("id", user.id)
      .single();
    if (
      profile &&
      (profile as { role?: string }).role === tier &&
      (profile as { stripe_subscription_id?: string }).stripe_subscription_id
    ) {
      return NextResponse.json({
        already_subscribed: true,
        redirect: "/dashboard?already_subscribed=true",
      });
    }

    // ---- Create Checkout Session ----
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/dashboard?upgraded=${tier}`,
      cancel_url: `${SITE_URL}/pricing`,
      client_reference_id: user.id,
      customer_email: user.email,
      // Allow Stripe's automatic tax calc + promo codes on the hosted
      // checkout. Users who bring an existing promo code (we run them
      // occasionally for affiliate launches) can enter it without us
      // having to re-host the payment form.
      allow_promotion_codes: true,
      metadata: {
        supabase_user_id: user.id,
        plan: tier,
        interval,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: tier,
          interval,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { error: "Couldn't start checkout. Try again." },
      { status: 500 },
    );
  }
}
