/**
 * Shared fuzzy-match helpers between user_gear (My Rig) and recipe
 * signal-chain gear_name strings. Used by:
 *   - components/recipe/RecipeCompatibility.tsx (single-recipe match)
 *   - components/browse/BrowseRigFilter.tsx (filter the browse grid)
 *
 * user_gear doesn't reliably store gear_id (the my-gear UI accepts free-form
 * text), so name-token overlap is the only join available.
 */

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "guitar",
  "pedal",
  "amp",
  "cab",
  "cabinet",
  "channel",
  "model",
  "style",
  "edition",
  "version",
  "vintage",
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

export function tokenSet(s: string): Set<string> {
  return new Set(tokens(s));
}

/**
 * Returns the first user-gear name that overlaps the block by enough
 * meaningful tokens, or null if no match. Threshold tightens with longer
 * names to reduce false positives (e.g. "amp" alone wouldn't match a
 * 5-token block name).
 */
export function matchesUserGear(
  blockName: string,
  userGearNames: string[],
): string | null {
  const blockTokens = tokenSet(blockName);
  if (blockTokens.size === 0) return null;
  for (const u of userGearNames) {
    const uTokens = tokenSet(u);
    if (uTokens.size === 0) continue;
    let overlap = 0;
    for (const t of uTokens) if (blockTokens.has(t)) overlap++;
    const minOverlap = blockTokens.size <= 2 || uTokens.size <= 2 ? 1 : 2;
    if (overlap >= minOverlap) return u;
  }
  return null;
}

/**
 * For browse-card filtering: build a single space-joined token string
 * for a recipe's signal_chain. Emit on the card as a data attribute so
 * the client filter can compare against user_gear without re-walking
 * recipe data on the client.
 */
export function buildRigTokens(
  signalChain: { gear_name?: string | null }[] | null | undefined,
): string {
  const all = new Set<string>();
  for (const b of signalChain ?? []) {
    if (!b.gear_name) continue;
    for (const t of tokens(b.gear_name)) all.add(t);
  }
  return [...all].join(" ");
}

/**
 * Given a card's `data-rig-tokens` value and the viewer's gear names,
 * count how many user-gear items are matched. Used by BrowseRigFilter
 * to decide which cards to keep visible.
 */
export function countCardMatches(
  cardTokens: string,
  userGearNames: string[],
): number {
  if (!cardTokens) return 0;
  const cardSet = new Set(cardTokens.split(" ").filter(Boolean));
  let matched = 0;
  for (const u of userGearNames) {
    const uTokens = tokens(u);
    if (uTokens.length === 0) continue;
    const minOverlap = uTokens.length <= 2 ? 1 : 2;
    let overlap = 0;
    for (const t of uTokens) if (cardSet.has(t)) overlap++;
    if (overlap >= minOverlap) matched++;
  }
  return matched;
}
