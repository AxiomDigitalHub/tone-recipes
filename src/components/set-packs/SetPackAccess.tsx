"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import { toast } from "@/lib/stores/toast-store";
import { track } from "@/lib/analytics";

interface Props {
  packSlug: string;
  packName: string;
  priceDisplay: string; // e.g. "$19"
  /** Stripe `pack` slug used for analytics + checkout (same as packSlug). */
  format?: "hlx" | "tsl";
}

type State =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "owned" }
  | { kind: "buy" };

/**
 * Conditional buy / download UI for a Set Pack page.
 *
 *   - anon  → "Sign in to buy" → /login?return=...
 *   - signed in, no purchase → "Buy {name} — $19" → POST /api/set-packs/{slug}/checkout
 *   - signed in, owned → "Download .hlx" → POST /api/set-packs/{slug}/download
 *
 * Reads `?purchased=true` after Stripe success-redirect, shows a celebratory
 * toast, and short-circuits the ownership check (the webhook may not have
 * landed yet, but the user just paid).
 */
export default function SetPackAccess({
  packSlug,
  packName,
  priceDisplay,
  format = "hlx",
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const justPurchased = params.get("purchased") === "true";

  const [state, setState] = useState<State>({ kind: "loading" });
  const [busy, setBusy] = useState(false);

  // Resolve ownership.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        if (!cancelled) setState({ kind: "anon" });
        return;
      }
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("set_pack_purchases")
        .select("id, refunded_at")
        .eq("user_id", user.id)
        .eq("pack_slug", packSlug)
        .maybeSingle();
      if (cancelled) return;
      const owned =
        Boolean(data) &&
        !(data as { refunded_at?: string | null } | null)?.refunded_at;
      // If the user just came back from Stripe success, treat them as
      // owners even if the webhook hasn't landed — they'll see the
      // download button immediately, the webhook will catch up.
      setState({ kind: owned || justPurchased ? "owned" : "buy" });
      if (justPurchased) {
        toast.success(`Welcome to the ${packName} Set Pack. Download below.`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, packSlug, packName, justPurchased]);

  const handleBuy = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    track("set_pack_purchase_click", { pack_slug: packSlug });

    try {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Session expired. Sign in again.");
        router.push(`/login?return=/set-packs/${packSlug}`);
        return;
      }

      const res = await fetch(`/api/set-packs/${packSlug}/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = (await res.json()) as {
        url?: string;
        already_owned?: boolean;
        redirect?: string;
        error?: string;
      };

      if (data.already_owned) {
        setState({ kind: "owned" });
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error(data.error ?? "Couldn't start checkout. Try again.");
    } catch (err) {
      console.error("set pack checkout failed:", err);
      toast.error("Couldn't start checkout. Try again.");
    } finally {
      setBusy(false);
    }
  }, [busy, packSlug, router]);

  const handleDownload = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    track("set_pack_download_click", { pack_slug: packSlug, format });

    try {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Session expired. Sign in again.");
        router.push("/login");
        return;
      }
      // The Worship pack has its own runtime-generator endpoint; other
      // packs (when they ship) will use the generic /download route.
      const downloadUrl =
        packSlug === "worship"
          ? `/api/set-packs/worship`
          : `/api/set-packs/${packSlug}/download?format=${format}`;
      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error ?? "Couldn't download. Try again.");
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `FK-${packSlug}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast.success(`Downloaded FK-${packSlug}.${format}.`);
    } catch (err) {
      console.error("set pack download failed:", err);
      toast.error("Couldn't download. Try again.");
    } finally {
      setBusy(false);
    }
  }, [busy, packSlug, format, router]);

  if (state.kind === "loading") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-muted"
      >
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </button>
    );
  }

  if (state.kind === "anon") {
    return (
      <button
        type="button"
        onClick={() => {
          track("set_pack_purchase_click", { pack_slug: packSlug, anon: true });
          router.push(`/login?return=/set-packs/${packSlug}`);
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
      >
        Sign in to buy — {priceDisplay}
      </button>
    );
  }

  if (state.kind === "buy") {
    return (
      <button
        type="button"
        onClick={handleBuy}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>Buy {packName} Set Pack — {priceDisplay}</>
        )}
      </button>
    );
  }

  // owned
  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download FK-{packSlug}.{format}
        </>
      )}
    </button>
  );
}
