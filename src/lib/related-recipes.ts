import { toneRecipes, songs, artists } from "@/lib/data";
import { norm, gearBigrams } from "@/lib/match-text";
import type { ToneRecipe } from "@/types/recipe";

/**
 * Matches blog posts to recipe pages so every post links into the recipe
 * catalog (the non-commodity moat — see docs/AI_SEARCH_PLAYBOOK.md).
 * Before this existed only 13 of ~311 posts linked to any /recipe/ page,
 * leaving the blog cluster and the catalog almost disconnected.
 *
 * Pure data matching, no LLM: artist-name and song-title hits in the post
 * title/tags score high; shared tags score low. Threshold filters out
 * coincidental single-tag overlap ("blues" alone never matches).
 */

export interface RelatedRecipeMatch {
  recipe: ToneRecipe;
  songTitle: string;
  artistName: string;
  albumArtUrl?: string;
  score: number;
}

const songBySlug = new Map(songs.map((s) => [s.slug, s]));
const artistBySlug = new Map(artists.map((a) => [a.slug, a]));

export function findRelatedRecipes(
  postTitle: string,
  postTags: string[],
  limit = 3,
): RelatedRecipeMatch[] {
  const title = norm(postTitle);
  const tags = new Set(postTags.map(norm));
  const haystack = `${title} ${Array.from(tags).join(" ")}`;

  const matches: RelatedRecipeMatch[] = [];
  for (const recipe of toneRecipes) {
    const song = songBySlug.get(recipe.song_slug);
    const artist = song ? artistBySlug.get(song.artist_slug) : undefined;

    let score = 0;
    const artistName = artist ? norm(artist.name) : "";
    if (artistName && haystack.includes(artistName)) score += 6;

    const songTitle = song ? norm(song.title) : "";
    // Short titles ("Creep") only count in the post title, not tag soup.
    if (songTitle.length >= 6 && title.includes(songTitle)) score += 5;

    for (const rt of recipe.tags) {
      if (tags.has(norm(rt))) score += 2;
    }

    // Gear hit: a post about specific gear links to recipes that use it
    // ("Tube Screamer settings" → SRV, who runs a TS808). Bigram match on
    // amp + effects names from the recipe's original gear, against the
    // post TITLE only — tags are too generic for gear matching.
    const gearNames = [
      recipe.original_gear?.amp ?? "",
      ...(recipe.original_gear?.effects ?? []),
    ];
    let gearHit = false;
    for (const g of gearNames) {
      if (gearBigrams(g).some((b) => title.includes(b))) {
        gearHit = true;
        break;
      }
    }
    if (gearHit) score += 4;

    // Genre overlap (song genres vs post tags), capped — flavor, not driver.
    if (song) {
      let g = 0;
      for (const genre of song.genres) if (tags.has(norm(genre))) g++;
      score += Math.min(g, 2);
    }

    // 5+ = an artist/song hit, a gear hit + any overlap, or ≥3 shared tags.
    // Two generic shared tags ("blues" + "overdrive") stay below the line.
    if (score >= 5) {
      matches.push({
        recipe,
        songTitle: song?.title ?? recipe.title,
        artistName: artist?.name ?? "",
        albumArtUrl: song?.album_art_url,
        score,
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  // Prefer variety: at most two recipes per artist in the shortlist.
  const perArtist = new Map<string, number>();
  const out: RelatedRecipeMatch[] = [];
  for (const m of matches) {
    const n = perArtist.get(m.artistName) ?? 0;
    if (n >= 2) continue;
    perArtist.set(m.artistName, n + 1);
    out.push(m);
    if (out.length >= limit) break;
  }
  return out;
}
