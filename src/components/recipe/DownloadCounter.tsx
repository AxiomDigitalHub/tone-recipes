"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import { FREE_DOWNLOAD_LIMIT } from "@/lib/permissions";

interface DownloadCounterProps {
  className?: string;
}

/**
 * Tiny pill that tells a user how many preset downloads they have left
 * this month, or "Unlimited downloads" if they're on Pass / Pro / staff.
 *
 * The count is per calendar month (UTC), matching the server-side enforcement
 * in src/lib/downloads.ts. Mismatch between these two would let a user see
 * "2/5 free downloads" while the server denies them, which is the kind of
 * thing that produces angry tickets — so keep both in sync if the quota
 * window ever changes.
 */
export default function DownloadCounter({ className }: DownloadCounterProps) {
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Pass / Pro subscribers and staff are unlimited; free accounts are metered.
  const isUnlimited = user != null && user.role !== "free";

  useEffect(() => {
    if (!user || isUnlimited) {
      setCount(null);
      return;
    }

    let cancelled = false;

    async function fetchCount() {
      setLoading(true);
      try {
        const supabase = createBrowserClient();
        // First of the current month in UTC. Matches the server-side
        // quota window in src/lib/downloads.ts → getDownloadCount().
        const now = new Date();
        const monthStart = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
        ).toISOString();

        const { count: total, error } = await supabase
          .from("recipe_downloads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user!.id)
          .eq("download_type", "preset")
          .gte("created_at", monthStart);

        if (!cancelled && !error) {
          setCount(total ?? 0);
        }
      } catch {
        // Silently fail — counter is non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCount();
    return () => {
      cancelled = true;
    };
  }, [user, isUnlimited]);

  // Don't render for unauthenticated users
  if (!user) return null;

  // Pass / Pro / staff
  if (isUnlimited) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-[var(--amber)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--amber-2)] ${className ?? ""}`}
      >
        Unlimited downloads
      </span>
    );
  }

  // Free tier — show remaining count
  if (loading || count === null) return null;

  const remaining = Math.max(0, FREE_DOWNLOAD_LIMIT - count);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        remaining > 3
          ? "border-[var(--ink)]/15 text-[var(--ink-muted)]"
          : remaining > 0
            ? "border-amber-500/30 text-amber-400"
            : "border-red-500/30 text-red-400"
      } ${className ?? ""}`}
    >
      {remaining}/{FREE_DOWNLOAD_LIMIT} free downloads this month
    </span>
  );
}
