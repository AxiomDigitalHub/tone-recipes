import { getRecipesBySongSlug } from "@/lib/data";

/**
 * Where a link to a song should point, or null when it shouldn't be a link.
 *
 * /song/{slug} is only a real page when the song has 2+ recipes. With one
 * recipe it 308-redirects to that recipe, and with none it is a thin
 * "awaiting translation" stub. Linking either one from the recipe or artist
 * page sends Google a second URL for the same content, so callers render
 * the song name as plain text when this returns null.
 */
export function songHref(songSlug: string): string | null {
  return getRecipesBySongSlug(songSlug).length >= 2 ? `/song/${songSlug}` : null;
}
