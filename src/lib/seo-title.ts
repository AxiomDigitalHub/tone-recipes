import type { Metadata } from "next";

// Must match the root layout's title template ("%s | Fader & Knob").
const SUFFIX = " | Fader & Knob";
// Bing Webmaster flags titles over 70 characters as "Title too long".
export const MAX_TITLE_LENGTH = 70;

/**
 * Picks the first candidate that fits under MAX_TITLE_LENGTH with the brand
 * suffix; failing that, the first that fits on its own (suffix dropped via
 * `absolute`). If none fit, falls back to the last candidate so the page still
 * has a title — scripts/audit-title-lengths.ts reports those.
 */
export function fitTitle(candidates: (string | undefined)[]): Metadata["title"] {
  const list = candidates.map((c) => c?.trim()).filter((c): c is string => !!c);
  const withSuffix = list.find((c) => c.length + SUFFIX.length <= MAX_TITLE_LENGTH);
  if (withSuffix) return withSuffix;
  const bare = list.find((c) => c.length <= MAX_TITLE_LENGTH);
  if (bare) return { absolute: bare };
  return list[list.length - 1] ?? "";
}

/**
 * The headline up to its first " — ", ": " or ". " break, or undefined when
 * that clause is too short to stand alone ("It's Official", "Hotone's Pulze Jr").
 * Those posts need an explicit seo_title; the audit flags them.
 */
export function firstClause(headline: string): string | undefined {
  const clause = headline.split(/ — |: |\. /)[0];
  return clause.length >= 30 ? clause : undefined;
}
