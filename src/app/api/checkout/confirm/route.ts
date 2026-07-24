import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * GET /api/checkout/confirm?session_id=cs_...
 *
 * Post-checkout purchase confirmation for client-side analytics. The
 * success_url on both checkout flows carries Stripe's
 * {CHECKOUT_SESSION_ID} template; PurchaseTracker (mounted in the root
 * layout) calls this to get the real amount, then fires the GA4
 * `purchase` event — which is what the leads report's converted-lead
 * column derives from (close_convert_lead ← purchase).
 *
 * Security: session IDs are unguessable bearer-ish tokens, and the
 * response is limited to amount/currency/mode — no email, no customer
 * data. Rate limited by IP. Nothing here mutates state; provisioning
 * stays exclusively in the Stripe webhook.
 */

export const runtime = "nodejs";

const SESSION_ID_RE = /^cs_(live|test)_[a-zA-Z0-9]+$/;

export async function GET(req: NextRequest) {
  const { limited } = rateLimit(`checkout-confirm:${getClientIp(req)}`, 20, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id") ?? "";
  if (!SESSION_ID_RE.test(sessionId)) {
    return NextResponse.json({ error: "Invalid session id." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false }, { status: 200 });
    }

    return NextResponse.json({
      paid: true,
      id: session.id,
      amount_total: session.amount_total ?? 0,
      currency: (session.currency ?? "usd").toUpperCase(),
      mode: session.mode, // "subscription" | "payment"
    });
  } catch (err) {
    // Unknown/expired session ids land here (Stripe resource_missing).
    const code = (err as { code?: string })?.code;
    if (code === "resource_missing") {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }
    console.error("[checkout/confirm] error:", err);
    return NextResponse.json(
      { error: "Unable to confirm purchase." },
      { status: 500 },
    );
  }
}
