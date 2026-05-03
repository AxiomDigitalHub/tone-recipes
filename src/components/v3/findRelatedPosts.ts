import { getAllPosts, type BlogPost } from "@/lib/blog";

/**
 * Score-and-rank blog posts against a set of keywords / tags. Used to
 * pull "Related Field Notes" rails onto recipe / platform / artist
 * pages without hand-curating the mapping.
 *
 * Scoring is intentionally cheap: each keyword that appears in the
 * post's title / description / tags / category is worth one point, with
 * tags weighted highest. Ties broken by newer post first.
 */
export function findRelatedPosts(opts: {
  /** Keywords to match (artist names, gear names, platform labels, etc.). */
  keywords?: string[];
  /** Specific tags to prefer — direct hits weight 3x. */
  tags?: string[];
  /** Specific blog categories to prefer (e.g. "platform-guide"). */
  categories?: string[];
  /** How many posts to return. Default 3. */
  limit?: number;
}): BlogPost[] {
  const limit = opts.limit ?? 3;
  const kw = (opts.keywords ?? [])
    .filter(Boolean)
    .map((k) => k.toLowerCase().trim());
  const wantTags = new Set(
    (opts.tags ?? []).map((t) => t.toLowerCase().trim()),
  );
  const wantCats = new Set(
    (opts.categories ?? []).map((c) => c.toLowerCase().trim()),
  );

  if (kw.length === 0 && wantTags.size === 0 && wantCats.size === 0) {
    return [];
  }

  type Scored = { post: BlogPost; score: number };
  const scored: Scored[] = [];

  for (const post of getAllPosts()) {
    let score = 0;

    if (wantCats.has(post.category.toLowerCase())) score += 5;

    for (const tag of post.tags) {
      const t = tag.toLowerCase();
      if (wantTags.has(t)) score += 3;
      for (const k of kw) {
        if (t.includes(k) || k.includes(t)) score += 1;
      }
    }

    const hay = `${post.title} ${post.description}`.toLowerCase();
    for (const k of kw) {
      if (hay.includes(k)) score += 2;
    }

    if (score > 0) scored.push({ post, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  return scored.slice(0, limit).map((s) => s.post);
}
