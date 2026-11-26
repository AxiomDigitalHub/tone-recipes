import type { Platform, ToneRecipe } from "@/types/recipe";

export type BrowseFacets = {
  era?: string;
  genre?: string;
  platform?: string;
  artist?: string;
};

/**
 * Canonical URL and robots rule for a /browse view (SEO fix 5).
 *
 * - Canonical keeps era/genre/platform/artist in a fixed order, drops
 *   ?sort, and adds ?page only past page 1.
 * - A platform-only view whose platform covers every recipe lists the same
 *   recipes as /browse, so it canonicals to /browse. If that platform ever
 *   covers fewer, it keeps its own canonical.
 * - 2+ facets, or page 2 and beyond, is noindex,follow. The sitemap lists
 *   every recipe, so deep pages are no longer needed as a crawl path.
 */
export function browseIndexing(
  sp: BrowseFacets,
  page: number,
  recipes: Pick<ToneRecipe, "platform_translations">[],
): { canonical: string; robots?: { index: false; follow: true } } {
  const canon = new URLSearchParams();
  if (sp.era) canon.set("era", sp.era);
  if (sp.genre) canon.set("genre", sp.genre);
  if (sp.platform) canon.set("platform", sp.platform);
  if (sp.artist) canon.set("artist", sp.artist);

  const facetCount = [sp.era, sp.genre, sp.platform, sp.artist].filter(Boolean).length;
  const platformCoversAll =
    facetCount === 1 &&
    !!sp.platform &&
    recipes.length > 0 &&
    recipes.every((r) => Boolean(r.platform_translations?.[sp.platform as Platform]));
  if (platformCoversAll) canon.delete("platform");

  if (page > 1) canon.set("page", String(page));
  const qs = canon.toString();
  const canonical = qs ? `/browse?${qs}` : "/browse";
  const noindex = page > 1 || facetCount >= 2;
  return noindex ? { canonical, robots: { index: false, follow: true } } : { canonical };
}
