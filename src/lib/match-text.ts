/**
 * Text-normalization helpers shared by the cross-linking matchers
 * (blog→recipe in related-recipes.ts, recipe→blog in related-posts.ts).
 */

/** "John-Mayer" / "john-mayer" / "John Mayer" → "john mayer" */
export function norm(s: string): string {
  return s.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Two-word phrases from a gear name, e.g. "Ibanez TS808 Tube Screamer" →
 * ["ibanez ts808", "ts808 tube", "tube screamer"]. Bigrams are specific
 * enough to avoid single-word false positives ("delay", "fuzz").
 */
export function gearBigrams(name: string): string[] {
  const words = norm(name).split(" ").filter((w) => w.length >= 2);
  const out: string[] = [];
  for (let i = 0; i < words.length - 1; i++) out.push(`${words[i]} ${words[i + 1]}`);
  return out;
}
