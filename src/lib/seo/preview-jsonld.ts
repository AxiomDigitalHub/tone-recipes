/**
 * JSON-LD shape builders for /preview/* routes.
 *
 * Mirrors the inline JSON-LD already shipped on production routes
 * (src/app/recipe/[slug]/page.tsx, src/app/blog/[slug]/page.tsx,
 * src/app/artist/[slug]/page.tsx). Kept under src/lib/seo/ instead of
 * src/app/preview/ so that production routes can adopt the same helpers
 * at cutover without a refactor.
 *
 * URLs are emitted as the production canonical paths (e.g.
 * https://faderandknob.com/recipe/<slug>) regardless of which route
 * renders the JSON-LD. After cutover, /preview/* renames to /*, so
 * the URLs are already correct; while /preview/* exists with noindex,
 * the JSON-LD is harmless because the page won't be crawled into the
 * search index anyway.
 */

import type { Artist, Song, ToneRecipe } from "@/types/recipe";
import type { BlogPost } from "@/lib/blog";

const SITE = "https://faderandknob.com";

export type JsonLdNode = Record<string, unknown>;

export function recipeJsonLdSet(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
): { howTo: JsonLdNode; musicRecording: JsonLdNode | null; breadcrumb: JsonLdNode } {
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
      text: `Set ${node.gear_name}: ${Object.entries(node.settings)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}`,
    })),
    tool: recipe.signal_chain.map((n) => ({ "@type": "HowToTool", name: n.gear_name })),
  };

  const musicRecording: JsonLdNode | null = song
    ? {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        name: song.title,
        ...(artist ? { byArtist: { "@type": "MusicGroup", name: artist.name } } : {}),
        inAlbum: { "@type": "MusicAlbum", name: song.album },
        ...(song.album_art_url ? { image: song.album_art_url } : {}),
      }
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

export function blogPostJsonLdSet(
  post: BlogPost & { content?: string },
  slug: string,
  h2Headings: string[],
  faqItems: Array<{ question: string; answer: string }>,
): { article: JsonLdNode; howTo: JsonLdNode | null; faq: JsonLdNode | null } {
  const article: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Fader & Knob", url: SITE },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${slug}` },
  };

  const isHowTo =
    post.category === "tone-recipes" || post.category === "settings-guides";
  const howTo: JsonLdNode | null = isHowTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.title,
        description: post.description,
        step: h2Headings.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: text,
        })),
      }
    : null;

  const faq: JsonLdNode | null = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return { article, howTo, faq };
}

export function artistJsonLdSet(
  artist: Artist,
): { musicGroup: JsonLdNode; breadcrumb: JsonLdNode } {
  const musicGroup: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    description: artist.bio,
    genre: artist.genres,
    ...(artist.image_url ? { image: artist.image_url } : {}),
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

export function songJsonLdSet(
  song: Song,
  artist: Artist | undefined,
): { musicRecording: JsonLdNode; breadcrumb: JsonLdNode } {
  const musicRecording: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    ...(artist ? { byArtist: { "@type": "MusicGroup", name: artist.name } } : {}),
    inAlbum: { "@type": "MusicAlbum", name: song.album },
    ...(song.album_art_url ? { image: song.album_art_url } : {}),
  };

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
