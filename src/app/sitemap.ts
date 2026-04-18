import type { MetadataRoute } from "next";
import { toneRecipes, artists, gearItems } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";
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
    { url: `${baseUrl}/request`, lastModified: launchDate, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: launchDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/community/forum`, lastModified: launchDate, changeFrequency: "daily", priority: 0.7 },
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

  const recipePages: MetadataRoute.Sitemap = toneRecipes.map((recipe) => ({
    url: `${baseUrl}/recipe/${recipe.slug}`,
    lastModified: launchDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const artistPages: MetadataRoute.Sitemap = artists.map((artist) => ({
    url: `${baseUrl}/artist/${artist.slug}`,
    lastModified: launchDate,
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
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const newsPages: MetadataRoute.Sitemap = allNews.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const platformPages: MetadataRoute.Sitemap = getAllPlatforms().map((p) => ({
    url: `${baseUrl}/platforms/${p.id}`,
    lastModified: latestBlogDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...recipePages, ...artistPages, ...gearPages, ...blogPages, ...newsPages, ...platformPages];
}
