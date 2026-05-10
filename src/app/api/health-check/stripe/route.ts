import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

/**
 * GET /api/health-check/stripe
 *
 * Diagnostic endpoint for verifying the Stripe + Supabase + newsletter
 * integration is configured correctly. Reports:
 *   - Stripe secret key format (sk_live_ vs sk_test_) and webhook secret
 *   - Supabase key formats — both legacy JWT and new sb_publishable_/
 *     sb_secret_ formats are recognized
 *   - RESEND_API_KEY presence (outbound newsletter / welcome email)
 *   - NEWSLETTER_UNSUBSCRIBE_SECRET presence + length sanity check —
 *     without it, /api/unsubscribe throws on every click
 *   - Live Stripe handshake (account_id + livemode + email_set)
 *   - Live Supabase admin query (profiles_count proves service role works)
 *
 * Protected by a `token` query parameter matched against HEALTH_CHECK_TOKEN
 * env var, so it's not accidentally public. Set that env var in Vercel to
 * any long random string before using.
 *
 * Example: GET /api/health-check/stripe?token=YOUR_SECRET
 */

/**
 * Describe a Supabase API key without leaking its value. Supabase ships
 * two key formats in 2025+:
 *   - Legacy JWT format (`eyJhbGc...`) — decode the `role` claim
 *   - New opaque format (`sb_publishable_...` / `sb_secret_...`) — just
 *     report the prefix; these aren't JWTs and won't decode
 * Mixed environments are common during the migration window; both work.
 */
function describeSupabaseKey(key: string | undefined): string {
  if (!key) return "absent";
  if (key.startsWith("sb_publishable_")) return "sb_publishable_... (new anon format)";
  if (key.startsWith("sb_secret_")) return "sb_secret_... (new secret format)";
  const parts = key.split(".");
  if (parts.length !== 3) return "unknown_format";
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );
    const role = payload.role ?? "no_role_claim";
    return `${role} (JWT)`;
  } catch {
    return "decode_error";
  }
}

function describeKeyPrefix(key: string | undefined): string {
  if (!key) return "absent";
  if (key.startsWith("sk_live_")) return "sk_live_...";
  if (key.startsWith("sk_test_")) return "sk_test_...";
  if (key.startsWith("pk_live_")) return "pk_live_ (WRONG: publishable key)";
  if (key.startsWith("pk_test_")) return "pk_test_ (WRONG: publishable key)";
  if (key.startsWith("rk_live_")) return "rk_live_ (restricted key)";
  if (key.startsWith("whsec_")) return "whsec_...";
  return `unknown_prefix (${key.slice(0, 8)}...)`;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const expected = process.env.HEALTH_CHECK_TOKEN;

  if (!expected) {
    return NextResponse.json(
      {
        error:
          "HEALTH_CHECK_TOKEN env var is not configured. Set it in Vercel to enable this endpoint.",
      },
      { status: 503 },
    );
  }

  if (token !== expected) {
    // Don't reveal whether the endpoint exists to random callers
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const unsubscribeSecret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
  const resendKey = process.env.RESEND_API_KEY;

  const report: Record<string, unknown> = {
    env: {
      STRIPE_SECRET_KEY: describeKeyPrefix(stripeKey),
      STRIPE_WEBHOOK_SECRET: describeKeyPrefix(webhookSecret),
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl
        ? new URL(supabaseUrl).host
        : "absent",
      SUPABASE_SERVICE_ROLE_KEY: describeSupabaseKey(supabaseServiceKey),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: describeSupabaseKey(supabaseAnonKey),
      RESEND_API_KEY: resendKey ? "set" : "absent",
      NEWSLETTER_UNSUBSCRIBE_SECRET: unsubscribeSecret
        ? unsubscribeSecret.length >= 32
          ? "set (>=32 chars)"
          : "set (TOO SHORT — use 32+ chars)"
        : "absent (newsletter unsubscribe will throw)",
    },
  };

  // Stripe handshake
  if (stripeKey) {
    try {
      const s = new Stripe(stripeKey);
      // Calling retrieve() with no id returns the account making the request,
      // but the type signature requires an id. Use an empty object cast to
      // satisfy TypeScript while still getting the current-account behavior.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const acct = await (s.accounts as any).retrieve();
      // Account email is redacted — if the token is ever compromised, the
      // email becomes useful for phishing. account_id + livemode are enough
      // to confirm the Stripe handshake works and the right account is wired.
      report.stripe_handshake = {
        ok: true,
        account_id: acct.id,
        livemode: acct.charges_enabled ? "live-eligible" : "test-or-restricted",
        email_set: Boolean(acct.email),
      };
    } catch (err) {
      report.stripe_handshake = {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Supabase admin query
  if (supabaseServiceKey && supabaseUrl) {
    try {
      const sb = createClient(supabaseUrl, supabaseServiceKey);
      const { error, count } = await sb
        .from("profiles")
        .select("id", { count: "exact", head: true });
      report.supabase_admin = {
        ok: !error,
        error: error?.message,
        profiles_count: count,
      };
    } catch (err) {
      report.supabase_admin = {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return NextResponse.json(report, { status: 200 });
}
