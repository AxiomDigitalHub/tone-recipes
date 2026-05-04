"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { createBrowserClient } from "@/lib/db/client";

interface ManageBillingButtonProps {
  className?: string;
}

export default function ManageBillingButton({
  className = "",
}: ManageBillingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
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

      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to open billing portal.");
        setLoading(false);
      }
    } catch {
      setError("Failed to open billing portal.");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={loading}
        className="hero-cta hero-cta-secondary"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        Manage Subscription
      </button>
      {error && <p className="dashboard-paper-plan-note">{error}</p>}
    </div>
  );
}
