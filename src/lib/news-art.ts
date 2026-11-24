/**
 * What picture, if any, a news story gets (redesign step 7).
 *
 * Three tiers, in this order (handoff "News images"):
 *   1. The maker's press photo, with a credit line. Only from the maker's
 *      own site or press release, never from another publication. In front
 *      matter that is `image_url` plus `image_credit`; without the credit
 *      the photo does not run.
 *   2. No image. The row is text only.
 *   3. Our drawings, only for firmware, tips and industry items.
 * Guitar stories may use the matching guitar style drawing.
 */
import { thumbFor, classify, type ThumbSpec } from "@/lib/gear/thumbs";
import { type GuitarKey } from "@/lib/gear/guitars";
import type { NewsPost } from "@/lib/news";

export type NewsArt =
  | { kind: "photo"; src: string; credit: string }
  | { kind: "thumb"; spec: ThumbSpec }
  | { kind: "guitar"; guitar: GuitarKey; spec: ThumbSpec }
  | { kind: "none" };

const GUITAR_STORY: [RegExp, GuitarKey][] = [
  [/firebird/i, "firebird"],
  [/flying v/i, "flying-v"],
  [/explorer/i, "explorer"],
  [/\bprs\b|silver sky/i, "prs"],
  [/jazzmaster|jaguar|mustang|offset/i, "offset"],
  [/\bes-?3\d\d\b|semi-?hollow|casino|sheraton/i, "335"],
  [/\bsg\b/i, "sg"],
  [/les paul junior|lp junior|\bjunior\b/i, "junior"],
  [/les paul/i, "les-paul"],
  [/telecaster|\btele\b|t-style/i, "tele"],
  [/\brg\b|superstrat|soloist|dinky/i, "rg"],
  [/stratocaster|\bstrat\b|s-style/i, "strat"],
];

export function newsArt(post: NewsPost): NewsArt {
  if (post.image_url && post.image_credit) {
    return { kind: "photo", src: post.image_url, credit: post.image_credit };
  }
  const base = { slug: post.slug, title: post.title, tags: [] as string[] };
  const drawn = post.category === "firmware-update" || post.category === "tips" || post.category === "industry";
  if (drawn) {
    const spec = thumbFor(base);
    // A firmware story with no gear in the headline is about a modeler.
    if (classify(base).topic === "other") spec.gear = "preamp";
    return { kind: "thumb", spec };
  }
  for (const [re, guitar] of GUITAR_STORY) {
    if (re.test(post.title)) return { kind: "guitar", guitar, spec: { ...thumbFor(base), pattern: "plain", frame: "front" } };
  }
  return { kind: "none" };
}

/** "guitarworld.com" for a source link, or null for our own pages. */
export function sourceHost(url: string): string | null {
  if (!url || url.includes("faderandknob")) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
