"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBrowserClient } from "@/lib/db/client";
import { useAuth } from "@/lib/auth/auth-context";
import { track } from "@/lib/analytics";

/**
 * <CheckoutButton tier="pro" interval="annual" /> — kicks off checkout.
 *
 * Three states the user can hit:
 *   1. Not signed in           → redirect to /login?next=/pricing
 *   2. Signed in, lower tier   → POST /api/checkout → redirect to Stripe
 *   3. Already on this tier    → redirect to dashboard
 *
 * Errors surface inline below the button. The most common one during a
 * go-live will be "Pricing not configured" — that's a 503 from the API
 * when STRIPE_{TIER}_PRICE_ID_{ANNUAL,MONTHLY} hasn't been set in the
 * runtime env yet.
 */

interface CheckoutButtonProps {
  interval: "annual" | "monthly";
  tier?: "pass" | "pro";
  label?: string;
  className?: string;
}

const TIER_LABEL: Record<"pass" | "pro", string> = {
  pass: "Pass",
  pro: "Pro",
};
const TIER_PRICE: Record<"pass" | "pro", { annual: string; monthly: string }> = {
  pass: { annual: "$49/yr", monthly: "$4.99/mo" },
  pro: { annual: "$79/yr", monthly: "$7.99/mo" },
};

export default function CheckoutButton({
  interval,
  tier = "pass",
  label,
  className,
}: CheckoutButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultLabel = `Start ${TIER_LABEL[tier]} — ${TIER_PRICE[tier][interval]}`;

  async function handleClick() {
    setError("");
    setLoading(true);
    track("checkout_start", { tier, interval, signed_in: Boolean(user) });

    // Signed-out users go to login, with a return-to-pricing hint so
    // they land back here after auth.
    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }

    try {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Please sign in again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ interval, tier }),
      });

      const data = await res.json();

      if (data.already_subscribed && data.redirect) {
        router.push(data.redirect);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Couldn't start checkout. Try again.");
      setLoading(false);
    } catch {
      setError("Couldn't reach checkout. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="pricing-cta"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        <span>{label ?? defaultLabel}</span>
      </button>
      {error && (
        <p className="pricing-cta-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
