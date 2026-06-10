/**
 * JSON-LD shape builders.
 *
 * Centralized so every consumer page emits structurally-identical schema
 * and the audit story stays consistent. See
 * audits/schema-audit-2026-05-12.md for the full coverage map.
 *
 * URLs are emitted as the production canonical paths
 * (https://faderandknob.com/...) regardless of which route renders the
 * JSON-LD.
 */

import type {
  Artist,
  Song,
  ToneRecipe,
  GearItem,
} from "@/types/recipe";
import type { Writer } from "@/lib/writers";
import type { PlatformMeta } from "@/lib/data/platforms";

const SITE = "https://faderandknob.com";

export type JsonLdNode = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/*  Recipe — HowTo + MusicRecording + Breadcrumb + optional AggregateRating   */
/* -------------------------------------------------------------------------- */

export interface RecipeRatingStats {
  /** Mean rating, 1-5. Ignored if count === 0. */
  average: number;
  /** Number of ratings the average is computed from. */
  count: number;
}

export function recipeJsonLdSet(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
  /** Optional aggregated ratings for AggregateRating emission. */
  stats?: RecipeRatingStats,
): {
  howTo: JsonLdNode;
  musicRecording: JsonLdNode | null;
  breadcrumb: JsonLdNode;
} {
  const howTo: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: recipe.title,
    description: recipe.description,
    author: { "@type": "Organization", name: "Fader & Knob" },
    step: recipe.signal_chain.map((node, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: node.gear_name,
      // Concise per Google's HowTo guidance. Full settings live in the
      // recipe page UI; this is the schema summary.
      text:
        Object.keys(node.settings).length > 0
          ? `Set ${node.gear_name} per the recipe page settings.`
          : `Add ${node.gear_name} to the chain.`,
    })),
    tool: recipe.signal_chain.map((n) => ({
      "@type": "HowToTool",
      name: n.gear_name,
    })),
  };

  // AggregateRating belongs ON the HowTo block (Google reads it there
  // and surfaces stars in the SERP).
  if (stats && stats.count > 0) {
    howTo.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(stats.average.toFixed(1)),
      reviewCount: stats.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const musicRecording: JsonLdNode | null = song
    ? songMusicRecordingNode(song, artist)
    : null;

  const breadcrumb: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Browse", item: `${SITE}/browse` },
      ...(artist
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: artist.name,
              item: `${SITE}/artist/${artist.slug}`,
            },
          ]
        : []),
      ...(song
        ? [{ "@type": "ListItem", position: artist ? 3 : 2, name: song.title }]
        : []),
    ],
  };

  return { howTo, musicRecording, breadcrumb };
}

/* -------------------------------------------------------------------------- */
/*  Song — MusicRecording + Breadcrumb                                         */
/* -------------------------------------------------------------------------- */

/**
 * Internal MusicRecording node builder. Reused by recipeJsonLdSet so the
 * shape stays in sync.
 */
function songMusicRecordingNode(
  song: Song,
  artist: Artist | undefined,
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    ...(artist
      ? {
          byArtist: {
            "@type": "MusicGroup",
            name: artist.name,
            url: `${SITE}/artist/${artist.slug}`,
          },
        }
      : {}),
    inAlbum: { "@type": "MusicAlbum", name: song.album },
    ...(song.album_art_url ? { image: song.album_art_url } : {}),
    ...(song.year ? { datePublished: String(song.year) } : {}),
    ...(song.genres && song.genres.length > 0 ? { genre: song.genres } : {}),
  };
}

export function songJsonLdSet(
  song: Song,
  artist: Artist | undefined,
): { musicRecording: JsonLdNode; breadcrumb: JsonLdNode } {
  const musicRecording = songMusicRecordingNode(song, artist);

  const breadcrumb: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Browse", item: `${SITE}/browse` },
      ...(artist
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: artist.name,
              item: `${SITE}/artist/${artist.slug}`,
            },
          ]
        : []),
      { "@type": "ListItem", position: artist ? 3 : 2, name: song.title },
    ],
  };

  return { musicRecording, breadcrumb };
}

/* -------------------------------------------------------------------------- */
/*  Artist — MusicGroup + Breadcrumb (+ optional sameAs)                       */
/* -------------------------------------------------------------------------- */

/**
 * Curated `sameAs` URLs (Wikipedia, official site, Spotify) per artist.
 * Strongest authority signal for MusicGroup schema. Keyed by artist slug.
 *
 * Hand-curated, not generated. Add new entries as artists are added to
 * the catalog; missing entries are fine — sameAs just gets omitted.
 */
export const ARTIST_SAME_AS: Record<string, string[]> = {
  "stevie-ray-vaughan": [
    "https://en.wikipedia.org/wiki/Stevie_Ray_Vaughan",
  ],
  "david-gilmour": ["https://en.wikipedia.org/wiki/David_Gilmour"],
  "jimi-hendrix": ["https://en.wikipedia.org/wiki/Jimi_Hendrix"],
  "kurt-cobain": ["https://en.wikipedia.org/wiki/Kurt_Cobain"],
  "jimmy-page": ["https://en.wikipedia.org/wiki/Jimmy_Page"],
  "eddie-van-halen": ["https://en.wikipedia.org/wiki/Eddie_Van_Halen"],
  "angus-young": ["https://en.wikipedia.org/wiki/Angus_Young"],
  "slash": ["https://en.wikipedia.org/wiki/Slash_(musician)"],
  "james-hetfield": ["https://en.wikipedia.org/wiki/James_Hetfield"],
  "kirk-hammett": ["https://en.wikipedia.org/wiki/Kirk_Hammett"],
  "dimebag-darrell": ["https://en.wikipedia.org/wiki/Dimebag_Darrell"],
  "randy-rhoads": ["https://en.wikipedia.org/wiki/Randy_Rhoads"],
  "bb-king": ["https://en.wikipedia.org/wiki/B.B._King"],
  "eric-clapton": ["https://en.wikipedia.org/wiki/Eric_Clapton"],
  "john-mayer": ["https://en.wikipedia.org/wiki/John_Mayer"],
  "joe-bonamassa": ["https://en.wikipedia.org/wiki/Joe_Bonamassa"],
  "billy-gibbons": ["https://en.wikipedia.org/wiki/Billy_Gibbons"],
  "carlos-santana": ["https://en.wikipedia.org/wiki/Carlos_Santana"],
  "brian-may": ["https://en.wikipedia.org/wiki/Brian_May"],
  "pete-townshend": ["https://en.wikipedia.org/wiki/Pete_Townshend"],
  "keith-richards": ["https://en.wikipedia.org/wiki/Keith_Richards"],
  "tony-iommi": ["https://en.wikipedia.org/wiki/Tony_Iommi"],
  "joe-satriani": ["https://en.wikipedia.org/wiki/Joe_Satriani"],
  "alex-lifeson": ["https://en.wikipedia.org/wiki/Alex_Lifeson"],
  "jerry-garcia": ["https://en.wikipedia.org/wiki/Jerry_Garcia"],
  "mark-knopfler": ["https://en.wikipedia.org/wiki/Mark_Knopfler"],
  "jonny-greenwood": ["https://en.wikipedia.org/wiki/Jonny_Greenwood"],
  "matt-bellamy": ["https://en.wikipedia.org/wiki/Matt_Bellamy"],
  "alex-turner": ["https://en.wikipedia.org/wiki/Alex_Turner_(musician)"],
  "jack-white": ["https://en.wikipedia.org/wiki/Jack_White"],
  "johnny-marr": ["https://en.wikipedia.org/wiki/Johnny_Marr"],
  "noel-gallagher": ["https://en.wikipedia.org/wiki/Noel_Gallagher"],
  "john-frusciante": ["https://en.wikipedia.org/wiki/John_Frusciante"],
  "tom-morello": ["https://en.wikipedia.org/wiki/Tom_Morello"],
  "the-edge": ["https://en.wikipedia.org/wiki/The_Edge"],
  "josh-homme": ["https://en.wikipedia.org/wiki/Josh_Homme"],
  "adam-jones": ["https://en.wikipedia.org/wiki/Adam_Jones_(musician)"],
  "gary-clark-jr": ["https://en.wikipedia.org/wiki/Gary_Clark_Jr."],
  "dave-murray": ["https://en.wikipedia.org/wiki/Dave_Murray_(guitarist)"],
  "auerbach-": ["https://en.wikipedia.org/wiki/Dan_Auerbach"],
  "dan-auerbach": ["https://en.wikipedia.org/wiki/Dan_Auerbach"],
};

export function artistJsonLdSet(
  artist: Artist,
): { musicGroup: JsonLdNode; breadcrumb: JsonLdNode } {
  const sameAs = ARTIST_SAME_AS[artist.slug];

  const musicGroup: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: `${SITE}/artist/${artist.slug}`,
    description: artist.bio,
    ...(artist.genres && artist.genres.length > 0
      ? { genre: artist.genres }
      : {}),
    ...(artist.image_url ? { image: artist.image_url } : {}),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
  };

  const breadcrumb: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Browse", item: `${SITE}/browse` },
      { "@type": "ListItem", position: 2, name: artist.name },
    ],
  };

  return { musicGroup, breadcrumb };
}

/* -------------------------------------------------------------------------- */
/*  Gear — Product schema                                                      */
/* -------------------------------------------------------------------------- */

/** Map our gear `type` to a more SERP-friendly Product category string. */
function gearCategory(type: string): string {
  const m: Record<string, string> = {
    guitar: "Electric guitar",
    bass: "Bass guitar",
    amp: "Guitar amplifier",
    pedal: "Guitar effects pedal",
    drive: "Overdrive pedal",
    distortion: "Distortion pedal",
    fuzz: "Fuzz pedal",
    delay: "Delay pedal",
    reverb: "Reverb pedal",
    modulation: "Modulation pedal",
    compressor: "Compressor pedal",
    eq: "EQ pedal",
    wah: "Wah pedal",
    boost: "Boost pedal",
    modeler: "Guitar amp modeler",
    cab: "Guitar speaker cabinet",
    speaker: "Guitar speaker",
    mic: "Microphone",
  };
  return m[type] ?? "Guitar gear";
}

export function gearJsonLdSet(
  gear: GearItem,
): { product: JsonLdNode; breadcrumb: JsonLdNode } {
  const product: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: gear.name,
    description: gear.description,
    category: gearCategory(gear.type),
    ...(gear.manufacturer
      ? { brand: { "@type": "Brand", name: gear.manufacturer } }
      : {}),
    url: `${SITE}/gear/${gear.slug}`,
  };

  const breadcrumb: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Gear", item: `${SITE}/gear` },
      { "@type": "ListItem", position: 2, name: gear.name },
    ],
  };

  return { product, breadcrumb };
}

/* -------------------------------------------------------------------------- */
/*  Platform — Product schema for modeler platforms                            */
/* -------------------------------------------------------------------------- */

export function platformJsonLdSet(
  platform: PlatformMeta,
): { product: JsonLdNode; breadcrumb: JsonLdNode } {
  const product: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: platform.label,
    description: platform.tagline,
    category: "Guitar amp modeler",
    brand: { "@type": "Brand", name: platform.manufacturer },
    url: `${SITE}/platforms/${platform.id}`,
  };

  const breadcrumb: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Platforms",
        item: `${SITE}/platforms`,
      },
      { "@type": "ListItem", position: 2, name: platform.label },
    ],
  };

  return { product, breadcrumb };
}

/* -------------------------------------------------------------------------- */
/*  Writer — Person schema for /writers/[slug] profile pages                   */
/* -------------------------------------------------------------------------- */

export function writerJsonLdSet(
  writer: Writer,
): { person: JsonLdNode; breadcrumb: JsonLdNode } {
  const person: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: writer.name,
    url: `${SITE}/writers/${writer.slug}`,
    description: writer.bio,
    jobTitle: writer.title,
    worksFor: {
      "@type": "Organization",
      name: "Fader & Knob",
      url: SITE,
    },
    ...(writer.image
      ? { image: writer.image.startsWith("http") ? writer.image : `${SITE}${writer.image}` }
      : {}),
  };

  const breadcrumb: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Field Notes", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 2, name: "Writers", item: `${SITE}/writers` },
      { "@type": "ListItem", position: 3, name: writer.name },
    ],
  };

  return { person, breadcrumb };
}

/* -------------------------------------------------------------------------- */
/*  Index pages — CollectionPage + ItemList                                    */
/* -------------------------------------------------------------------------- */

export interface CollectionItem {
  url: string;
  name: string;
  description?: string;
}

export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  items: CollectionItem[];
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: { "@id": `${SITE}#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: item.url,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      })),
    },
  };
}
