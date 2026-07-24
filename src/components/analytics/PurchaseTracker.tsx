"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * Fires the GA4 `purchase` event after a completed Stripe checkout.
 *
 * Both checkout success_urls carry ?session_id={CHECKOUT_SESSION_ID}.
 * This mounts globally (root layout, inside Suspense — useSearchParams
 * requirement), does nothing unless the param is present, confirms the
 * real amount via /api/checkout/confirm, fires `purchase` with the
 * Stripe session id as transaction_id (GA4 dedupes on it), then strips
 * the param from the URL so refresh/share doesn't re-run the flow.
 * A sessionStorage flag belts-and-suspenders the dedupe within the tab.
 *
 * The leads report's converted column derives from this event
 * (close_convert_lead ← purchase, wired in GA4 admin 2026-07-22).
 */
export default function PurchaseTracker() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId || !/^cs_(live|test)_/.test(sessionId)) return;

    const dedupeKey = `fk_purchase_${sessionId}`;
    const stripParam = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    };

    try {
      if (sessionStorage.getItem(dedupeKey)) {
        stripParam();
        return;
      }
    } catch {
      // storage unavailable (private mode) — GA's transaction_id dedupe
      // still protects against double counting.
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          paid?: boolean;
          id?: string;
          amount_total?: number;
          currency?: string;
          mode?: string;
        };
        if (!data.paid || !data.id) return;

        track("purchase", {
          transaction_id: data.id,
          value: (data.amount_total ?? 0) / 100,
          currency: data.currency ?? "USD",
          items: [
            {
              item_name:
                data.mode === "subscription" ? "membership" : "set_pack",
            },
          ],
        });
        try {
          sessionStorage.setItem(dedupeKey, "1");
        } catch {
          /* see above */
        }
      } catch {
        // analytics never break the app
      } finally {
        if (!cancelled) stripParam();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return null;
}
