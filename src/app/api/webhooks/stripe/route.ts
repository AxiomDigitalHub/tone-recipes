import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { sendPurchaseWelcome, sendOwnerAlert } from "@/lib/email";
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

  // Diagnostics from the 2026-04 live-mode debug session, now scoped to the
  // failure path only — a healthy webhook no longer logs key shape on
  // every event.
  if (!serviceKey || decodeJwtRole(serviceKey) !== "service_role") {
    console.error(
      "[stripe-webhook] supabase env problem:",
      "url_present=", Boolean(url),
      "service_key_present=", Boolean(serviceKey),
      "service_key_length=", serviceKey?.length ?? 0,
      // Log only the role claim from the JWT, never the full key
      "service_key_role=", decodeJwtRole(serviceKey),
    );
  }

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Roles that billing events must never overwrite.
 *
 * Staff accounts get full entitlement from src/lib/permissions.ts — every
 * TIERS limit unlocked, setPackAccess() true, unlimited downloads and tone
 * requests — with no subscription involved. So a staff account never needs
 * to pay, and the owner's own account shouldn't be on a paid plan just to
 * use the site.
 *
 * Without this guard, cancelling that subscription in Stripe fires
 * customer.subscription.deleted, which wrote `role: "free"` unconditionally
 * and locked the owner out of their own admin. The upgrade path had the
 * mirror bug: testing checkout on a staff account would overwrite
 * super_admin with "pass".
 */
const PROTECTED_ROLES = new Set(["admin", "super_admin"]);

/** True when the profile holds a staff role that billing must not touch. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isProtectedRole(
  supabase: any,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (error) {
    // Fail safe: if we can't read the role, don't touch it.
    console.error("[stripe-webhook] role lookup failed:", error.message);
    return true;
  }
  return PROTECTED_ROLES.has((data as { role?: string } | null)?.role ?? "");
}

/**
 * Revoke Set Pack access purchased with the given PaymentIntent by stamping
 * `refunded_at`. Every access gate (set-pack checkout short-circuit, worship
 * download route, SetPackAccess client, admin revenue) already filters on
 * refunded_at — this was the missing WRITE side: before it existed, a
 * refunded or charged-back customer kept the pack forever.
 *
 * Returns the number of rows revoked (0 = the charge wasn't a set pack,
 * e.g. a subscription invoice — nothing to do).
 */
async function revokeSetPackByPaymentIntent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  paymentIntentId: string,
  reason: "refund" | "dispute",
): Promise<number> {
  const { data, error } = await supabase
    .from("set_pack_purchases")
    .update({ refunded_at: new Date().toISOString() })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .is("refunded_at", null)
    .select("id, pack_slug, user_id");

  if (error) {
    console.error(
      `[stripe-webhook] refunded_at write failed (${reason}):`,
      error.message,
    );
    return 0;
  }
  const rows = (data ?? []) as { pack_slug: string }[];
  if (rows.length > 0) {
    console.log(
      `[stripe-webhook] set pack access revoked (${reason}):`,
      rows.map((r) => r.pack_slug).join(", "),
    );
  }
  return rows.length;
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

  // ---- Idempotency claim (migration 027) ----
  // Stripe retries on non-2xx AND on timeout; without a dedupe a retry
  // re-sends welcome/owner emails and double-counts checkout_complete.
  // Claim the event.id up front; a unique violation = duplicate delivery.
  // Failure paths that WANT a retry must releaseClaim() before their 500,
  // or the retry would be skipped as a duplicate.
  let claimed = false;
  {
    const claim = await supabase
      .from("stripe_webhook_events")
      .insert({ event_id: event.id, type: event.type } as never);
    if (!claim.error) {
      claimed = true;
    } else if (claim.error.code === "23505") {
      console.log("[stripe-webhook] duplicate delivery, skipping:", event.id);
      return NextResponse.json({ received: true, duplicate: true });
    } else {
      // Table missing (migration not applied) or transient — proceed
      // without dedupe, same behavior as before migration 027.
      console.error(
        "[stripe-webhook] idempotency claim failed (continuing without dedupe):",
        claim.error.message,
      );
    }
  }
  const releaseClaim = async () => {
    if (!claimed) return;
    const { error } = await supabase
      .from("stripe_webhook_events")
      .delete()
      .eq("event_id", event.id);
    if (error) {
      console.error("[stripe-webhook] claim release failed:", error.message);
    }
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      // "pass" and "pro" are the live tiers (docs/PRICING_MODEL.md,
      // 2026-06-15). "premium" and "creator" are kept in the union so a
      // stale webhook for a pre-retirement subscription still parses and
      // routes correctly (the application layer aliases those legacy
      // roles to free + grandfather; see src/lib/permissions.ts).
      const plan = session.metadata?.plan as
        | "pass"
        | "pro"
        | "premium"
        | "creator"
        | undefined;
      const setPackSlug = session.metadata?.fk_set_pack;
      const customerEmail =
        session.customer_details?.email ?? session.customer_email ?? undefined;

      console.log(
        "[stripe-webhook] checkout.session.completed parsed:",
        "session_id=", session.id,
        "mode=", session.mode,
        "customer=", session.customer,
        "subscription=", session.subscription,
        "metadata_userId=", userId ?? "MISSING",
        "metadata_plan=", plan ?? "—",
        "metadata_set_pack=", setPackSlug ?? "—",
      );

      // Branch A: one-time Set Pack purchase. Insert ownership row and
      // log the event. Subscription plans are no longer sold but the
      // existing branch is kept for any in-flight subscription events.
      if (session.mode === "payment" && setPackSlug && userId) {
        const amount = session.amount_total ?? 0;
        const currency = session.currency ?? "usd";

        const purchaseInsert = await supabase
          .from("set_pack_purchases")
          .upsert(
            {
              user_id: userId,
              pack_slug: setPackSlug,
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string | null,
              amount_paid_cents: amount,
              currency,
            } as never,
            { onConflict: "user_id,pack_slug" },
          );

        if (purchaseInsert.error) {
          console.error(
            "[stripe-webhook] set_pack_purchases upsert error:",
            purchaseInsert.error,
          );
          // Fire-and-forget: don't let a slow Resend push us past Stripe's
          // delivery timeout (which would itself trigger a retry).
          void sendOwnerAlert({
            urgent: true,
            subject: "PAID BUT NO ACCESS — set pack DB write failed",
            heading: "Customer paid but did not get access",
            rows: [
              ["Pack", setPackSlug],
              ["Customer", customerEmail ?? userId],
              ["Stripe session", session.id],
              ["Error", purchaseInsert.error.message ?? "unknown"],
              ["Action", "Grant access manually, then fix the write"],
            ],
          }).catch(() => {});
          // We WANT Stripe to retry this one — release the claim so the
          // retry isn't skipped as a duplicate.
          await releaseClaim();
          return NextResponse.json(
            { error: "Database error" },
            { status: 500 },
          );
        }
        console.log(
          "[stripe-webhook] SUCCESS: set pack granted",
          "userId=", userId,
          "pack=", setPackSlug,
        );

        // Server-side conversion event.
        await supabase.from("events").insert({
          name: "set_pack_purchase_complete",
          user_id: userId,
          params: {
            pack_slug: setPackSlug,
            amount_cents: amount,
            currency,
            stripe_session_id: session.id,
            livemode: event.livemode,
          },
        } as never);

        // Notify the customer (welcome) and the owner (sale). Fire-and-
        // forget: entitlement is already written, and awaiting email I/O
        // here risks Stripe's timeout → a retry → duplicate emails (the
        // exact failure the idempotency claim exists to stop).
        if (customerEmail) {
          void sendPurchaseWelcome({
            to: customerEmail,
            kind: "set_pack",
            label: `${setPackSlug} set pack`,
            amountCents: amount,
          }).catch((e) =>
            console.error("[stripe-webhook] purchase welcome failed:", e),
          );
        }
        void sendOwnerAlert({
          subject: `Set Pack sold: ${setPackSlug}`,
          heading: "💰 New Set Pack purchase",
          rows: [
            ["Pack", setPackSlug],
            [
              "Amount",
              `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`,
            ],
            ["Customer", customerEmail ?? userId],
            ["Mode", event.livemode ? "LIVE" : "test"],
          ],
        }).catch((e) =>
          console.error("[stripe-webhook] owner alert failed:", e),
        );
        break;
      }

      if (!userId || !plan) {
        console.error(
          "[stripe-webhook] skipping update: metadata missing",
          "userId=", userId,
          "plan=", plan,
        );
        break;
      }

      if (await isProtectedRole(supabase, userId)) {
        console.log(
          "[stripe-webhook] skipping role upgrade: protected staff role",
          "userId=", userId,
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
        void sendOwnerAlert({
          urgent: true,
          subject: "PAID BUT NO ACCESS — subscription DB write failed",
          heading: "Customer paid but was not upgraded",
          rows: [
            ["Plan", plan],
            ["Customer", customerEmail ?? userId],
            ["Stripe session", session.id],
            ["Error", updateRes.error.message ?? "unknown"],
            ["Action", "Upgrade the profile manually, then fix the write"],
          ],
        }).catch(() => {});
        // Release so Stripe's retry re-attempts the profile write.
        await releaseClaim();
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
        await sendOwnerAlert({
          urgent: true,
          subject: "PAID BUT NO ACCESS — profile not found",
          heading: "Customer paid but no matching profile (0 rows)",
          rows: [
            ["Plan", plan],
            ["Customer", customerEmail ?? userId],
            ["metadata user_id", userId],
            ["Stripe session", session.id],
            ["Action", "Find the account and upgrade it manually"],
          ],
        });
        // Still return 200 so Stripe doesn't retry; this is a data issue,
        // not a transient error. Log is loud so we can triage.
        break;
      }

      console.log(
        "[stripe-webhook] SUCCESS: user upgraded",
        "userId=", userId,
        "plan=", plan,
      );

      // Server-side conversion event so the funnel dashboard can
      // pair `checkout_complete` with the client-side `checkout_start`
      // without depending on the user reaching `/dashboard?upgraded=true`
      // (Stripe's redirect can be skipped or blocked).
      const eventInsert = await supabase.from("events").insert({
        name: "checkout_complete",
        user_id: userId,
        params: {
          plan,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer as string,
          livemode: event.livemode,
        },
      } as any);
      if (eventInsert.error) {
        console.error(
          "[stripe-webhook] events insert failed:",
          eventInsert.error,
        );
      }

      // Notify the customer (welcome) and the owner (sale). Fire-and-forget
      // — see the set-pack branch for why these never block the ACK.
      if (customerEmail) {
        void sendPurchaseWelcome({
          to: customerEmail,
          kind: "subscription",
          label: plan === "pro" ? "Pro" : plan === "pass" ? "Pass" : plan,
        }).catch((e) =>
          console.error("[stripe-webhook] purchase welcome failed:", e),
        );
      }
      void sendOwnerAlert({
        subject: `New subscriber: ${plan}`,
        heading: "💰 New Pass/Pro subscriber",
        rows: [
          ["Plan", plan],
          ["Customer", customerEmail ?? userId],
          ["Mode", event.livemode ? "LIVE" : "test"],
        ],
      }).catch((e) =>
        console.error("[stripe-webhook] owner alert failed:", e),
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

      if (await isProtectedRole(supabase, userId)) {
        console.log(
          "[stripe-webhook] skipping downgrade: protected staff role",
          "userId=", userId,
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
        // Release so Stripe's retry re-attempts the downgrade.
        await releaseClaim();
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 },
        );
      }

      void sendOwnerAlert({
        subject: "Subscriber canceled",
        heading: "🟠 Subscription canceled",
        rows: [
          ["User", userId],
          ["Customer", subscription.customer as string],
        ],
      }).catch(() => {});
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      void sendOwnerAlert({
        urgent: true,
        subject: "Payment failed",
        heading: "🔴 A payment failed",
        rows: [
          [
            "Customer",
            invoice.customer_email ?? (invoice.customer as string) ?? "unknown",
          ],
          ["Amount due", `$${((invoice.amount_due ?? 0) / 100).toFixed(2)}`],
          ["Attempt", String(invoice.attempt_count ?? "")],
          ["Action", "Stripe retries (dunning); watch for churn"],
        ],
      }).catch(() => {});
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;

      // Revoke set-pack access immediately on a chargeback — the money is
      // already frozen, so keeping access open is pure loss.
      const disputePi =
        typeof dispute.payment_intent === "string"
          ? dispute.payment_intent
          : dispute.payment_intent?.id;
      const disputeRevoked = disputePi
        ? await revokeSetPackByPaymentIntent(supabase, disputePi, "dispute")
        : 0;

      void sendOwnerAlert({
        urgent: true,
        subject: "Dispute / chargeback opened",
        heading: "🔴 Chargeback — respond fast",
        rows: [
          ["Amount", `$${((dispute.amount ?? 0) / 100).toFixed(2)}`],
          ["Reason", dispute.reason ?? "unknown"],
          ["Charge", dispute.charge as string],
          [
            "Access",
            disputeRevoked > 0
              ? `Set pack access revoked (${disputeRevoked})`
              : "No set pack matched (subscription charge?)",
          ],
          ["Action", "Submit evidence in Stripe before the deadline"],
        ],
      }).catch(() => {});
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;

      // Only revoke on a FULL refund (charge.refunded flag). Partial refunds
      // (goodwill credits) keep access. Subscription-invoice refunds match
      // no set_pack_purchases row and are a no-op here — role downgrades
      // stay with customer.subscription.deleted.
      const refundPi =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      const refundRevoked =
        charge.refunded && refundPi
          ? await revokeSetPackByPaymentIntent(supabase, refundPi, "refund")
          : 0;

      void sendOwnerAlert({
        subject: "Refund issued",
        heading: "🟠 A charge was refunded",
        rows: [
          [
            "Amount",
            `$${((charge.amount_refunded ?? 0) / 100).toFixed(2)}`,
          ],
          [
            "Customer",
            charge.billing_details?.email ??
              (charge.customer as string) ??
              "unknown",
          ],
          [
            "Access",
            refundRevoked > 0
              ? `Set pack access revoked (${refundRevoked})`
              : charge.refunded
                ? "No set pack matched (subscription charge?)"
                : "Partial refund — access kept",
          ],
        ],
      }).catch(() => {});
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
