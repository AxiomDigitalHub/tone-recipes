import type { MetadataRoute } from "next";
import { toneRecipes, artists, gearItems, songs } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";
import { getAllWriters } from "@/lib/writers";
import { getAllPlatforms } from "@/lib/data/platforms";
import { getAllNewsPosts } from "@/lib/news";

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
    // The open-experiment running log — updated as stats regenerate.
    { url: `${baseUrl}/experiment`, lastModified: latestBlogDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/request`, lastModified: launchDate, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: launchDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/platforms`, lastModified: latestBlogDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: launchDate, changeFrequency: "monthly", priority: 0.6 },
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

  const gearPages: MetadataRoute.Sitemap = gearItems.map((gear) => ({
    url: `${baseUrl}/gear/${gear.slug}`,
    lastModified: launchDate,
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

  const platformPages: MetadataRoute.Sitemap = getAllPlatforms().map((p) => ({
    url: `${baseUrl}/platforms/${p.id}`,
    lastModified: latestBlogDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...recipePages, ...artistPages, ...gearPages, ...blogPages, ...newsPages, ...platformPages, ...writerPages];
}
