import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/billing/portal
 * Creates a Stripe Customer Portal session for the authenticated user.
 * Returns the portal URL for the client to redirect to.
 *
 * Users can cancel subscriptions, update payment methods, and download
 * invoices through the Stripe-hosted portal. Required for compliance with
 * FTC Click-to-Cancel and California SB 313.
 */
export async function POST(req: NextRequest) {
  // Rate limit: 5 portal sessions per minute per IP
  const { limited } = rateLimit(`portal:${getClientIp(req)}`, 5, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    // Authenticate user via Bearer token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You must be signed in to manage billing." },
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

    // Fetch the user's Stripe customer ID from their profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json(
        {
          error:
            "No billing account found. If you have an active subscription, please contact support.",
        },
        { status: 404 },
      );
    }

    // Create the billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id as string,
      return_url: `${req.nextUrl.origin}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    return NextResponse.json(
      { error: "Failed to open billing portal." },
      { status: 500 },
    );
  }
}
