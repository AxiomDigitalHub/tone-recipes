import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe, ensureProducts } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for premium or creator plan.
 * Requires authentication via Bearer token.
 */
export async function POST(req: NextRequest) {
  // Rate limit: 10 checkout attempts per minute per IP
  const { limited } = rateLimit(`checkout:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { plan } = body as { plan: "premium" | "creator" };

    if (!plan || !["premium", "creator"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'premium' or 'creator'." },
        { status: 400 },
      );
    }

    // Get authenticated user
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You must be signed in to upgrade." },
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

    // Get or create Stripe products/prices
    const prices = await ensureProducts();
    const priceId = plan === "premium" ? prices.premium : prices.creator;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/dashboard?upgraded=true`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
