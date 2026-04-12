import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * Fallback: look up a user's ID by their stripe_customer_id in the
 * profiles table. Used when subscription.metadata.supabase_user_id
 * is missing (e.g. subscription created from Stripe dashboard).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function lookupUserByCustomerId(
  supabase: any,
  customerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return (data as { id: string } | null)?.id ?? null;
}

/**
 * Supabase admin client (bypasses RLS) for role upgrades.
 * REQUIRES SUPABASE_SERVICE_ROLE_KEY in production.
 */
function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for webhook processing. " +
      "Set it in your Vercel environment variables."
    );
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
  );
}

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for subscription lifecycle.
 *
 * SECURITY: Signature verification is REQUIRED in production.
 * Set STRIPE_WEBHOOK_SECRET from your Stripe Dashboard webhook endpoint.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // SECURITY: Require webhook signature verification in production
  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not set. Webhook events will be rejected. " +
      "Configure it in your Vercel environment variables."
    );
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error("Supabase admin client error:", err);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan as "premium" | "creator" | undefined;

      if (userId && plan) {
        const { error } = await supabase
          .from("profiles")
          .update({
            role: plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);

        if (error) {
          console.error("Failed to upgrade user role:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        console.log(`User ${userId} upgraded to ${plan}`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id
        ?? await lookupUserByCustomerId(supabase, subscription.customer as string);

      if (userId && subscription.cancel_at_period_end) {
        console.log(`User ${userId} subscription will cancel at period end`);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id
        ?? await lookupUserByCustomerId(supabase, subscription.customer as string);

      if (userId) {
        const { error } = await supabase
          .from("profiles")
          .update({ role: "free" })
          .eq("id", userId);

        if (error) {
          console.error("Failed to downgrade user:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        console.log(`User ${userId} downgraded to free (subscription ended)`);
      } else {
        console.error(
          "subscription.deleted: no userId in metadata and no profile with stripe_customer_id",
          subscription.customer
        );
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
