import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

/**
 * GET /api/health-check/stripe
 *
 * Diagnostic endpoint for verifying the Stripe + Supabase integration is
 * configured correctly. Reports:
 *   - Which env vars are present (never the values)
 *   - Whether the Stripe secret key is a live or test key
 *   - The `role` claim on the Supabase service key (to catch anon-key swaps)
 *   - Whether a Stripe handshake succeeds
 *   - Whether a Supabase admin query succeeds
 *
 * Protected by a `token` query parameter matched against HEALTH_CHECK_TOKEN
 * env var, so it's not accidentally public. Set that env var in Vercel to
 * any long random string before using.
 *
 * Example: GET /api/health-check/stripe?token=YOUR_SECRET
 */

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

  const report: Record<string, unknown> = {
    env: {
      STRIPE_SECRET_KEY: describeKeyPrefix(stripeKey),
      STRIPE_WEBHOOK_SECRET: describeKeyPrefix(webhookSecret),
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl
        ? new URL(supabaseUrl).host
        : "absent",
      SUPABASE_SERVICE_ROLE_KEY_role: decodeJwtRole(supabaseServiceKey),
      NEXT_PUBLIC_SUPABASE_ANON_KEY_role: decodeJwtRole(supabaseAnonKey),
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
