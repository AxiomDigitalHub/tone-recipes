/**
 * Canonical public origin, no trailing slash.
 *
 * Use this for any absolute URL that leaves the server — Stripe
 * success/cancel URLs, emails, redirects. Do NOT derive these from
 * `req.nextUrl.origin` / `request.url`: behind the production reverse
 * proxy (Caddy) those resolve to the container's internal bind address
 * (http://0.0.0.0:3000), which is how a live Stripe checkout redirect
 * once landed on a dead 0.0.0.0:3000 page after the Vercel→self-hosted
 * migration. Overridable via NEXT_PUBLIC_SITE_URL for preview/staging.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://faderandknob.com";

export const PLATFORMS = [
  { id: "pedalboard", label: "Pedalboard", color: "#a1a1aa" },
  { id: "helix", label: "Helix", color: "#cc0000" },
  { id: "quad_cortex", label: "Quad Cortex", color: "#00b4d8" },
  { id: "tonex", label: "TONEX", color: "#ff6b00" },
  { id: "fractal", label: "Fractal", color: "#10b981" },
  { id: "kemper", label: "Kemper", color: "#8b5cf6" },
  { id: "katana", label: "Boss Katana", color: "#e11d48" },
] as const;

/**
 * Full display label for a platform id, from the canonical PLATFORMS list.
 * Use this instead of re-declaring a `{ helix: "Helix", ... }` map (the
 * codebase had ~10 copies; the full-label ones now call this). Note some
 * surfaces intentionally use SHORT labels ("Katana" not "Boss Katana") —
 * those keep their own maps on purpose.
 */
export function platformLabel(id: string): string {
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

/** Platform IDs shown in recipe UI (tabs, browse filters). All platform data remains in the database. */
export const DISPLAYED_PLATFORM_IDS: ReadonlySet<string> = new Set([
  "pedalboard",
  "helix",
  "katana",
]);

export const GENRES = [
  "blues",
  "blues-rock",
  "texas-blues",
  "classic-rock",
  "hard-rock",
  "metal",
  "progressive-rock",
  "alternative",
  "grunge",
  "punk",
  "funk-rock",
  "country",
  "psychedelic",
  "shoegaze",
  "post-rock",
] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

export const CHAIN_CATEGORIES = [
  "guitar",
  "effect",
  "preamp",
  "wet_effect",
  "power_amp",
  "cabinet",
  "microphone",
] as const;
