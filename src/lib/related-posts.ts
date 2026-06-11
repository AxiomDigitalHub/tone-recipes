import { getAllPosts, type BlogPost } from "@/lib/blog";
import { getSongBySlug, getArtistBySlug } from "@/lib/data";
import { norm, gearBigrams } from "@/lib/match-text";
import type { ToneRecipe } from "@/types/recipe";

/**
 * Matches blog posts to a recipe page — the reverse of related-recipes.ts
 * (which links blog posts into the recipe catalog). Same signals, same
 * precision-first philosophy: a recipe page should only link to posts
 * that are genuinely about its tone, not "also mentions overdrive".
 *
 * Pure data matching, no LLM. Threshold 5 means a single artist or song
 * hit qualifies; tag overlap alone needs ≥3 shared tags.
 *
 * Server-only (getAllPosts reads the filesystem) — call from server
 * components / route handlers, never client code.
 */

export interface RelatedPostMatch {
  post: BlogPost;
  score: number;
}

export function findRelatedPosts(
  recipe: ToneRecipe,
  limit = 3,
): RelatedPostMatch[] {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

  const artistName = artist ? norm(artist.name) : "";
  const songTitle = song ? norm(song.title) : "";
  const recipeTags = new Set((recipe.tags ?? []).map(norm));

  // Bigrams from the recipe's original gear (amp + effects), matched
  // against post titles — a Big Muff recipe links the Big Muff post.
  const gearNames = [
    recipe.original_gear?.amp ?? "",
    ...(recipe.original_gear?.effects ?? []),
  ];
  const bigrams = gearNames.flatMap(gearBigrams);

  const matches: RelatedPostMatch[] = [];
  for (const post of getAllPosts()) {
    const title = norm(post.title ?? "");
    if (!title) continue;
    // Defensive String() — some agent-edited posts carry non-string tags
    // (see the same guard in components/v3/findRelatedPosts.ts).
    const postTags = (Array.isArray(post.tags) ? post.tags : []).map((t) =>
      norm(String(t ?? "")),
    );
    const haystack = `${title} ${postTags.join(" ")}`;

    let score = 0;
    if (artistName && haystack.includes(artistName)) score += 6;

    // Short titles ("Creep") only count in the post title, not tag soup —
    // and the ≥6 guard keeps them out of accidental substring hits.
    if (songTitle.length >= 6 && title.includes(songTitle)) score += 5;

    if (bigrams.some((b) => title.includes(b))) score += 4;

    for (const t of postTags) {
      if (t && recipeTags.has(t)) score += 2;
    }

    // 5+ = an artist/song hit, a gear hit + any tag overlap, or ≥3 shared
    // tags. Two generic shared tags ("blues" + "overdrive") stay below.
    if (score >= 5) matches.push({ post, score });
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });
  return matches.slice(0, limit);
}
