import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getWriter } from "./writers";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Optional Q&A pair, used for the article FAQ block + FAQPage schema. */
export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date — first publish
  updated?: string; // ISO date — last meaningful edit (optional)
  author: string; // display name (legacy field, kept for compatibility)
  authorSlug: string; // writer slug for looking up full writer profile
  category: string; // "signal-chain" | "platform-guide" | "artist-tone" | "gear" | "effects" | "workflow"
  tags: string[];
  readingTime: string; // "8 min read"
  wordCount: number;
  featured?: boolean;
  image?: string; // hero image URL (Unsplash)
  imageAlt?: string; // alt text for hero image
  /**
   * AEO-friendly 3–5-bullet summary. Rendered as a boxed "Key takeaways"
   * list above the body so answer engines have a pre-chunked summary to
   * quote from. Optional — posts without this still render cleanly.
   */
  takeaways?: string[];
  /**
   * Q&A pairs rendered at the bottom of the post and emitted as
   * FAQPage JSON-LD. Drives AI-overview citations.
   */
  faq?: BlogFaq[];
}

export interface BlogPostWithContent extends BlogPost {
  content: string; // raw MDX content (without frontmatter)
}

/**
 * Returns all .mdx file slugs in the blog content directory.
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Reads a single post by slug.
 * Returns parsed frontmatter + raw MDX content.
 */
export function getPostBySlug(slug: string): BlogPostWithContent | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  // Support both author_slug (new) and author (legacy) frontmatter
  const authorSlug: string = data.author_slug ?? "";
  const writer = authorSlug ? getWriter(authorSlug) : null;
  const authorName = writer?.name ?? data.author ?? "Fader & Knob";

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    updated: data.updated ?? undefined,
    author: authorName,
    authorSlug: authorSlug || "fader-and-knob",
    category: data.category ?? "",
    tags: data.tags ?? [],
    readingTime: stats.text,
    wordCount: stats.words,
    featured: data.featured ?? false,
    image: data.image ?? undefined,
    imageAlt: data.image_alt ?? undefined,
    takeaways: Array.isArray(data.takeaways) ? data.takeaways : undefined,
    faq: Array.isArray(data.faq)
      ? (data.faq as BlogFaq[]).filter((f) => f && f.q && f.a)
      : undefined,
    content,
  };
}

/**
 * Returns all posts sorted by date descending.
 */
export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();

  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      // Strip the raw content for the listing
      const { content: _, ...meta } = post;
      return meta;
    })
    .filter((p): p is BlogPost => p !== null);

  // Sort by date descending
  posts.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });

  return posts;
}

/**
 * Permanent call-number map — every post gets a zero-padded 3-digit
 * ordinal assigned by publish date (oldest = "001", newest = the total
 * count). Stable across the site so a post always carries the same
 * number on the index, in the ledger, and on its detail page.
 *
 * Memoised so repeated callers don't rescan the filesystem or resort.
 * Next.js module scope is per-request during SSR, which is fine for
 * our usage — this is a cheap computation either way.
 */
let _callNumberCache: Map<string, string> | null = null;
export function getCallNumbers(): Map<string, string> {
  if (_callNumberCache) return _callNumberCache;
  const all = getAllPosts();
  // getAllPosts() returns newest → oldest; reverse for chronological.
  const chronological = [...all].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const map = new Map<string, string>();
  chronological.forEach((p, i) => {
    map.set(p.slug, String(i + 1).padStart(3, "0"));
  });
  _callNumberCache = map;
  return map;
}

/** Convenience — returns "001" for a given slug, or "000" if not found. */
export function getCallNumber(slug: string): string {
  return getCallNumbers().get(slug) ?? "000";
}

/** All valid categories with display labels */
export const BLOG_CATEGORIES: Record<string, string> = {
  "signal-chain": "Signal Chain",
  "platform-guide": "Platform Guide",
  "artist-tone": "Artist Tone",
  "tone-recipes": "Tone Recipes",
  "settings-guides": "Settings Guides",
  "quick-fixes": "Quick Fixes",
  "modeler-masterclass": "Modeler Masterclass",
  "gear-lab": "Gear Lab",
  gear: "Gear",
  effects: "Effects",
  workflow: "Workflow",
};
