/**
 * Conversion-event shim. Wraps GA4 (gtag) and Vercel Analytics (va.track)
 * so callsites don't need to know which provider is wired up. Fire from
 * client components only — gtag/va are loaded in src/app/layout.tsx and
 * only exist in the browser.
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
  | "newsletter_submit"
  | "signup_start"
  | "checkout_start"
  | "checkout_complete"
  | "upgrade_prompt_view"
  | "upgrade_prompt_click";

type EventParams = Record<string, string | number | boolean | undefined>;

interface WindowWithAnalytics {
  gtag?: (command: "event", name: string, params?: EventParams) => void;
  va?: (cmd: "track", name: string, params?: EventParams) => void;
}

export function track(event: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as WindowWithAnalytics;

  try {
    w.gtag?.("event", event, params);
  } catch {
    // analytics never break the app
  }

  try {
    w.va?.("track", event, params);
  } catch {
    // analytics never break the app
  }
}
