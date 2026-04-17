import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for subscription lifecycle.
 *
 * DIAGNOSTIC LOGGING: every branch prefixes with [stripe-webhook] for easy
 * grep. Remove or reduce after the 2026-04 live-mode debug session stabilizes.
 */

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function lookupUserByCustomerId(
  supabase: any,
  customerId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return (data as { id: string } | null)?.id ?? null;
}

function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  console.log(
    "[stripe-webhook] supabase env:",
    "url_present=", Boolean(url),
    "service_key_present=", Boolean(serviceKey),
    "service_key_length=", serviceKey?.length ?? 0,
    // Log only the role claim from the JWT, never the full key
    "service_key_role=", decodeJwtRole(serviceKey),
  );

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Decode the `role` claim from a Supabase JWT without exposing the key. */
function decodeJwtRole(jwt: string | undefined): string {
  if (!jwt) return "absent";
  const parts = jwt.split(".");
  if (parts.length !== 3) return "not_a_jwt";
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );
    return payload.role ?? "no_role_claim";
  } catch {
    return "decode_error";
  }
}

/* -------------------------------------------------------------------------- */
/*  POST handler                                                               */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  console.log("[stripe-webhook] received POST");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  if (!sig) {
    console.error("[stripe-webhook] missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(
    "[stripe-webhook] verified event:",
    "type=", event.type,
    "id=", event.id,
    "livemode=", event.livemode,
  );

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error("[stripe-webhook] supabase admin init failed:", err);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan as
        | "premium"
        | "creator"
        | undefined;

      console.log(
        "[stripe-webhook] checkout.session.completed parsed:",
        "session_id=", session.id,
        "customer=", session.customer,
        "subscription=", session.subscription,
        "metadata_userId=", userId ?? "MISSING",
        "metadata_plan=", plan ?? "MISSING",
      );

      if (!userId || !plan) {
        console.error(
          "[stripe-webhook] skipping update: metadata missing",
          "userId=", userId,
          "plan=", plan,
        );
        break;
      }

      // Do the update and capture both error and row count for diagnosis.
      // `.select()` on an update returns the affected rows, letting us
      // distinguish "error" from "zero rows matched" — the silent failure
      // mode we hit in 2026-04.
      const updateRes = await supabase
        .from("profiles")
        .update({
          role: plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("id", userId)
        .select();

      console.log(
        "[stripe-webhook] profiles update response:",
        "error=", updateRes.error?.message ?? "none",
        "error_code=", updateRes.error?.code ?? "none",
        "rows_updated=", updateRes.data?.length ?? 0,
        "status=", updateRes.status,
      );

      if (updateRes.error) {
        console.error(
          "[stripe-webhook] DB error during upgrade:",
          updateRes.error,
        );
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 },
        );
      }

      if (!updateRes.data || updateRes.data.length === 0) {
        console.error(
          "[stripe-webhook] upgrade matched ZERO rows — user_id did not match any profile",
          "userId=", userId,
        );
        // Still return 200 so Stripe doesn't retry; this is a data issue,
        // not a transient error. Log is loud so we can triage.
        break;
      }

      console.log(
        "[stripe-webhook] SUCCESS: user upgraded",
        "userId=", userId,
        "plan=", plan,
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId =
        subscription.metadata?.supabase_user_id ??
        (await lookupUserByCustomerId(
          supabase,
          subscription.customer as string,
        ));

      console.log(
        "[stripe-webhook] subscription.updated:",
        "userId=", userId ?? "UNKNOWN",
        "cancel_at_period_end=", subscription.cancel_at_period_end,
      );

      if (userId && subscription.cancel_at_period_end) {
        console.log(
          "[stripe-webhook] subscription will cancel at period end for",
          userId,
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId =
        subscription.metadata?.supabase_user_id ??
        (await lookupUserByCustomerId(
          supabase,
          subscription.customer as string,
        ));

      console.log(
        "[stripe-webhook] subscription.deleted:",
        "userId=", userId ?? "UNKNOWN",
      );

      if (!userId) {
        console.error(
          "[stripe-webhook] subscription.deleted: no userId in metadata and no profile with stripe_customer_id",
          subscription.customer,
        );
        break;
      }

      const updateRes = await supabase
        .from("profiles")
        .update({ role: "free" })
        .eq("id", userId)
        .select();

      console.log(
        "[stripe-webhook] downgrade response:",
        "error=", updateRes.error?.message ?? "none",
        "rows_updated=", updateRes.data?.length ?? 0,
      );

      if (updateRes.error) {
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 },
        );
      }
      break;
    }

    default:
      console.log(
        "[stripe-webhook] ignoring event type:",
        event.type,
      );
      break;
  }

  return NextResponse.json({ received: true });
}
