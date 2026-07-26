import type { MetadataRoute } from "next";
import { toneRecipes, artists, gearItems, songs } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";
import { getAllWriters } from "@/lib/writers";
import { getAllPlatforms } from "@/lib/data/platforms";
import { getAllNewsPosts } from "@/lib/news";
import type { Platform } from "@/types/recipe";

/** Newest date in the list, or `fallback` when the list is empty. */
function maxDate(dates: Date[], fallback: Date): Date {
  return dates.reduce((max, d) => (d > max ? d : max), fallback);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://faderandknob.com";

  // Use the most recent blog post date as a proxy for "last updated" on
  // dynamic listing pages. Static pages use a fixed launch date.
  const allPosts = getAllPosts();
  const allNews = getAllNewsPosts();
  const latestBlogDate = allPosts.length > 0 ? new Date(allPosts[0].date) : new Date("2026-03-31");
  const latestNewsDate = allNews.length > 0 ? new Date(allNews[0].date) : new Date("2026-03-31");
  const launchDate = new Date("2026-03-15");

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/browse`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: latestNewsDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/gear`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/compare`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/how-it-works`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/how-we-work`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.5 },
    // The open-experiment running log — updated as stats regenerate.
    { url: `${baseUrl}/experiment`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/request`, lastModified: launchDate, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: launchDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/platforms`, lastModified: latestBlogDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.6 },
    // Indexable pages that were missing from the sitemap entirely.
    { url: `${baseUrl}/about`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/tone-chat`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/set-packs`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/set-packs/worship`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: launchDate, changeFrequency: "yearly", priority: 0.3 },
    // Pillar hubs — topical authority anchors. Indexed at high priority since
    // they're the internal-linking backbone for every leaf tone-recipe post.
    { url: `${baseUrl}/guides`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/artist-tone-recipes`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/pedal-settings-guides`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/amp-settings-and-tone`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/modeler-mastery`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/signal-chain-fundamentals`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/worship-guitar`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/bedroom-and-home-recording`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides/tone-troubleshooting`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: launchDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/affiliate-disclosure`, lastModified: launchDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Recipes carry real publication/edit dates (created_at backfilled from git
  // history 2026-06-10; updated_at stamped by the weekly audit on meaningful
  // edits). Without these every recipe looked frozen at launch.
  const recipeDate = (r: (typeof toneRecipes)[number]) =>
    r.updated_at ? new Date(r.updated_at) : r.created_at ? new Date(r.created_at) : launchDate;

  const recipePages: MetadataRoute.Sitemap = toneRecipes.map((recipe) => ({
    url: `${baseUrl}/recipe/${recipe.slug}`,
    lastModified: recipeDate(recipe),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // An artist page changes when a recipe for that artist is added or edited,
  // so its lastmod is the max date across the artist's recipes.
  const artistSlugBySong = new Map(songs.map((s) => [s.slug, s.artist_slug]));
  const latestByArtist = new Map<string, Date>();
  for (const recipe of toneRecipes) {
    const artistSlug = artistSlugBySong.get(recipe.song_slug);
    if (!artistSlug) continue;
    const d = recipeDate(recipe);
    const prev = latestByArtist.get(artistSlug);
    if (!prev || d > prev) latestByArtist.set(artistSlug, d);
  }

  const artistPages: MetadataRoute.Sitemap = artists.map((artist) => ({
    url: `${baseUrl}/artist/${artist.slug}`,
    lastModified: latestByArtist.get(artist.slug) ?? launchDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Song hub pages. Only songs with 2+ recipes: /song/<slug> redirects
  // straight to the recipe when there's exactly one, so listing those
  // would put a redirect in the sitemap. These were missing entirely
  // even though every recipe breadcrumb links to them.
  const recipesBySong = new Map<string, typeof toneRecipes>();
  for (const recipe of toneRecipes) {
    const list = recipesBySong.get(recipe.song_slug);
    if (list) list.push(recipe);
    else recipesBySong.set(recipe.song_slug, [recipe]);
  }

  const songPages: MetadataRoute.Sitemap = songs
    .filter((s) => (recipesBySong.get(s.slug)?.length ?? 0) > 1)
    .map((s) => ({
      url: `${baseUrl}/song/${s.slug}`,
      lastModified: maxDate(
        (recipesBySong.get(s.slug) ?? []).map(recipeDate),
        launchDate,
      ),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // Gear lastmod = newest recipe referencing that gear. It was frozen at
  // launchDate forever, which trains crawlers to ignore our lastmods.
  const latestByGear = new Map<string, Date>();
  for (const recipe of toneRecipes) {
    const d = recipeDate(recipe);
    for (const node of recipe.signal_chain ?? []) {
      if (!node.gear_slug) continue;
      const prev = latestByGear.get(node.gear_slug);
      if (!prev || d > prev) latestByGear.set(node.gear_slug, d);
    }
  }

  const gearPages: MetadataRoute.Sitemap = gearItems.map((gear) => ({
    url: `${baseUrl}/gear/${gear.slug}`,
    lastModified: latestByGear.get(gear.slug) ?? launchDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    // `updated` is set by the daily refresh track (update + redate). It must
    // surface here — the sitemap is what tells crawlers a proven URL changed.
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const newsPages: MetadataRoute.Sitemap = allNews.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Writer profile pages — built 2026-05-12 to back the Article.author.url
  // emitted on every blog post. fader-and-knob is the editorial-neutral
  // catch-all byline; we don't index that one.
  const writerPages: MetadataRoute.Sitemap = getAllWriters()
    .filter((w) => w.slug !== "fader-and-knob")
    .map((w) => ({
      url: `${baseUrl}/writers/${w.slug}`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Platform lastmod = newest recipe carrying a translation for it, not
  // "whenever we last published any blog post".
  const platformPages: MetadataRoute.Sitemap = getAllPlatforms().map((p) => ({
    url: `${baseUrl}/platforms/${p.id}`,
    lastModified: maxDate(
      toneRecipes
        .filter((r) => r.platform_translations?.[p.id as Platform])
        .map(recipeDate),
      launchDate,
    ),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...recipePages, ...artistPages, ...songPages, ...gearPages, ...blogPages, ...newsPages, ...platformPages, ...writerPages];
}
