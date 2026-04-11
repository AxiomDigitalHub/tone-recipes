"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";

interface CheckoutButtonProps {
  plan: "premium" | "creator";
  label: string;
  highlight?: boolean;
  className?: string;
}

const PENDING_CHECKOUT_KEY = "fk_pending_checkout";

export default function CheckoutButton({
  plan,
  label,
  highlight = false,
  className = "",
}: CheckoutButtonProps) {
  const { user, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = useCallback(async () => {
    setError("");
    setLoading(true);

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
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.url) {
        // Clear pending flag before redirecting to Stripe
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
        }
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong.");
        setLoading(false);
      }
    } catch {
      setError("Failed to start checkout.");
      setLoading(false);
    }
  }, [plan]);

  // Auto-continue checkout after returning from OAuth
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) return;
    const pending = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
    if (pending === plan) {
      sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      startCheckout();
    }
  }, [user, plan, startCheckout]);

  async function handleClick() {
    setError("");

    // If not logged in, set pending checkout flag and sign in
    if (!user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(PENDING_CHECKOUT_KEY, plan);
        sessionStorage.setItem("returnTo", "/pricing");
      }
      await signInWithGoogle();
      return;
    }

    await startCheckout();
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
          highlight
            ? "bg-accent text-background hover:bg-accent-hover"
            : "border border-border bg-surface text-foreground hover:border-accent/40 hover:bg-surface-hover"
        } disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
