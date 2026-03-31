/**
 * Unsplash image helpers for news articles.
 *
 * Two modes:
 * 1. If UNSPLASH_ACCESS_KEY is set → fetch from API at build time
 * 2. Fallback → curated Unsplash URLs by category (no API key needed)
 *
 * Unsplash allows hotlinking via their CDN (images.unsplash.com) as long
 * as you provide attribution. Their license is very permissive for this use.
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/** Curated fallback images per news category — hand-picked, high quality */
const CATEGORY_IMAGES: Record<string, string[]> = {
  "firmware-update": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", // circuit board
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80", // code on screen
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // tech macro
  ],
  "new-gear": [
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80", // guitar gear
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", // concert/guitar
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", // studio gear
  ],
  industry: [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80", // music production
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80", // vinyl/music
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80", // concert crowd
  ],
  tips: [
    "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80", // guitar close-up
    "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&q=80", // hands on guitar
    "https://images.unsplash.com/photo-1596003906949-67221c37965c?w=800&q=80", // amp knobs
  ],
};

/** Generic fallbacks if category not matched */
const GENERIC_IMAGES = [
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
];

/**
 * Get a deterministic image for a news post.
 * Uses the slug hash to pick consistently from the pool.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns the best image URL for a news post.
 * Priority: frontmatter image_url > Unsplash API > curated fallback
 */
export async function getNewsImage(
  slug: string,
  category: string,
  imageUrl?: string,
  searchQuery?: string,
): Promise<{ url: string; credit?: string }> {
  // 1. Frontmatter image takes priority
  if (imageUrl) {
    return { url: imageUrl };
  }

  // 2. Unsplash API (if key is configured)
  if (UNSPLASH_ACCESS_KEY && searchQuery) {
    try {
      const query = encodeURIComponent(searchQuery);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          next: { revalidate: 86400 }, // cache 24h
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results?.[0]) {
          const photo = data.results[0];
          return {
            url: `${photo.urls.regular}&w=800&q=80`,
            credit: `Photo by ${photo.user.name} on Unsplash`,
          };
        }
      }
    } catch {
      // Fall through to curated
    }
  }

  // 3. Curated fallback — deterministic by slug
  const pool = CATEGORY_IMAGES[category] ?? GENERIC_IMAGES;
  const index = hashCode(slug) % pool.length;
  return { url: pool[index], credit: "Photo via Unsplash" };
}

/**
 * Synchronous version for build-time use when you don't need the API.
 * Always uses curated fallbacks.
 */
export function getNewsImageSync(
  slug: string,
  category: string,
  imageUrl?: string,
): string {
  if (imageUrl) return imageUrl;
  const pool = CATEGORY_IMAGES[category] ?? GENERIC_IMAGES;
  const index = hashCode(slug) % pool.length;
  return pool[index];
}
