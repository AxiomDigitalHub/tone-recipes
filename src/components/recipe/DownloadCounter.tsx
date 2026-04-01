"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import { FREE_DOWNLOAD_LIMIT } from "@/lib/permissions";

interface DownloadCounterProps {
  className?: string;
}

export default function DownloadCounter({ className }: DownloadCounterProps) {
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Premium / creator / admin — unlimited
    if (user.role !== "free") {
      setCount(null);
      return;
    }

    let cancelled = false;

    async function fetchCount() {
      setLoading(true);
      try {
        const supabase = createBrowserClient();
        const { count: total, error } = await supabase
          .from("recipe_downloads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user!.id)
          .eq("download_type", "preset");

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
  }, [user]);

  // Don't render for unauthenticated users
  if (!user) return null;

  // Premium / creator / admin
  if (user.role !== "free") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent ${className ?? ""}`}
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
          ? "border-border text-muted"
          : remaining > 0
            ? "border-amber-500/30 text-amber-400"
            : "border-red-500/30 text-red-400"
      } ${className ?? ""}`}
    >
      {remaining}/{FREE_DOWNLOAD_LIMIT} free downloads
    </span>
  );
}
