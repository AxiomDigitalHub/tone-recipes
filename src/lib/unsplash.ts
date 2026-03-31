/**
 * News article image helpers.
 *
 * Image priority:
 * 1. Frontmatter `image_url` (manual override — always wins)
 * 2. Manufacturer product images (for gear/firmware articles — matched by slug keywords)
 * 3. Unsplash API search (if UNSPLASH_ACCESS_KEY is set)
 * 4. Curated Unsplash fallbacks by category
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/* -------------------------------------------------------------------------- */
/*  Manufacturer product images (official press/product page images)          */
/* -------------------------------------------------------------------------- */

/** Maps keyword patterns in slugs to curated Unsplash images of relevant gear.
 *  All images verified as landscape orientation and loading correctly. */
const MANUFACTURER_IMAGES: { pattern: RegExp; url: string; credit: string }[] =
  [
    // Line 6 Helix family — multi-effects unit close-up with knobs & LEDs
    {
      pattern: /helix|hx-stomp|hx-effects|hx-one/i,
      url: "https://images.unsplash.com/photo-1650048555068-5aa4bed8e4c8?w=800&q=80",
      credit: "Photo via Unsplash",
    },
    // Neural DSP Quad Cortex — guitar + pedalboard from above
    {
      pattern: /quad.?cortex|neural.?dsp|coros/i,
      url: "https://images.unsplash.com/photo-1560849898-d058f7d93b23?w=800&q=80",
      credit: "Photo via Unsplash",
    },
    // Kemper — boutique amp close-up with knobs
    {
      pattern: /kemper|profil(er|ing)/i,
      url: "https://images.unsplash.com/photo-1598488035175-04a5fa332d40?w=800&q=80",
      credit: "Photo via Unsplash",
    },
    // Fractal Audio — guitar rig / pedalboard collection
    {
      pattern: /fractal|axe.?fx|fm[39]/i,
      url: "https://images.unsplash.com/photo-1614413970863-2b4b38b30d7c?w=800&q=80",
      credit: "Photo via Unsplash",
    },
    // Boss Katana — amp close-up
    {
      pattern: /katana|boss/i,
      url: "https://images.unsplash.com/photo-1625801822528-376ebbaf1ad6?w=800&q=80",
      credit: "Photo via Unsplash",
    },
    // IK Multimedia TONEX — pedal on amp with guitar
    {
      pattern: /tonex|ik.?multi/i,
      url: "https://images.unsplash.com/photo-1609823791314-f7f966d11323?w=800&q=80",
      credit: "Photo via Unsplash",
    },
  ];

/**
 * Try to match a manufacturer product image based on slug keywords.
 * Only used for firmware-update and new-gear categories.
 */
function getManufacturerImage(
  slug: string,
  category: string,
): { url: string; credit: string } | null {
  if (category !== "firmware-update" && category !== "new-gear") return null;
  for (const entry of MANUFACTURER_IMAGES) {
    if (entry.pattern.test(slug)) {
      return { url: entry.url, credit: entry.credit };
    }
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Unsplash curated fallbacks (for industry + tips categories)               */
/* -------------------------------------------------------------------------- */

const CATEGORY_IMAGES: Record<string, string[]> = {
  "firmware-update": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  ],
  "new-gear": [
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  ],
  industry: [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  ],
  tips: [
    "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80",
    "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&q=80",
    "https://images.unsplash.com/photo-1596003906949-67221c37965c?w=800&q=80",
  ],
};

const GENERIC_IMAGES = [
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Async version — full priority chain:
 * frontmatter > manufacturer > Unsplash API > curated fallback
 */
export async function getNewsImage(
  slug: string,
  category: string,
  imageUrl?: string,
  searchQuery?: string,
): Promise<{ url: string; credit?: string }> {
  if (imageUrl) return { url: imageUrl };

  const mfr = getManufacturerImage(slug, category);
  if (mfr) return mfr;

  if (UNSPLASH_ACCESS_KEY && searchQuery) {
    try {
      const query = encodeURIComponent(searchQuery);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          next: { revalidate: 86400 },
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
      // Fall through
    }
  }

  const pool = CATEGORY_IMAGES[category] ?? GENERIC_IMAGES;
  const index = hashCode(slug) % pool.length;
  return { url: pool[index], credit: "Photo via Unsplash" };
}

/**
 * Sync version for build-time server components:
 * frontmatter > manufacturer > curated fallback
 */
export function getNewsImageSync(
  slug: string,
  category: string,
  imageUrl?: string,
): string {
  if (imageUrl) return imageUrl;

  const mfr = getManufacturerImage(slug, category);
  if (mfr) return mfr.url;

  const pool = CATEGORY_IMAGES[category] ?? GENERIC_IMAGES;
  const index = hashCode(slug) % pool.length;
  return pool[index];
}

/**
 * Get the credit/attribution string for a news image.
 * Useful for rendering "Image courtesy of..." below photos.
 */
export function getNewsImageCredit(
  slug: string,
  category: string,
  imageUrl?: string,
): string | null {
  if (imageUrl) return null; // manual images handle their own credit
  const mfr = getManufacturerImage(slug, category);
  if (mfr) return mfr.credit;
  return "Photo via Unsplash";
}
