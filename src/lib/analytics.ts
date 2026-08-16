/**
 * Conversion-event shim. Wraps GA4 (gtag) so callsites don't need to know
 * which provider is wired up. Fire from client components only — gtag is
 * loaded in src/app/layout.tsx and only exists in the browser.
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track("save_this_tone_click", { recipe_slug, source: "blog" });
 *
 * To add a new event, add it to EventName below. Server-side events
 * (e.g. Stripe webhooks) write to the `events` Supabase table instead.
 */

export type EventName =
  | "save_this_tone_click"
  | "browse_card_click"
  | "recipe_save_click"
  | "recipe_download_click"
  | "set_pack_notify_submit"
  | "set_pack_purchase_click"
  | "set_pack_purchase_complete"
  | "set_pack_download_click"
  | "newsletter_submit"
  | "signup_start"
  | "checkout_start"
  | "checkout_complete"
  | "purchase"
  | "upgrade_prompt_view"
  | "upgrade_prompt_click"
  // Affiliate outbound clicks. Params: retailer, gear_slug, placement,
  // recipe_slug? — without these, affiliate CTR is invisible in GA4 and
  // there's no way to tell which placements actually earn.
  | "affiliate_click";

type EventParams = Record<
  string,
  string | number | boolean | undefined | Array<Record<string, string | number>>
>;

interface WindowWithAnalytics {
  gtag?: (command: "event", name: string, params?: EventParams) => void;
}

export function track(event: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as WindowWithAnalytics;

  try {
    w.gtag?.("event", event, params);
  } catch {
    // analytics never break the app
  }
}
