import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getWriter } from "./writers";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  author: string; // display name (legacy field, kept for compatibility)
  authorSlug: string; // writer slug for looking up full writer profile
  category: string; // "signal-chain" | "platform-guide" | "artist-tone" | "gear" | "effects" | "workflow"
  tags: string[];
  readingTime: string; // "8 min read"
  featured?: boolean;
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
    author: authorName,
    authorSlug: authorSlug || "fader-and-knob",
    category: data.category ?? "",
    tags: data.tags ?? [],
    readingTime: stats.text,
    featured: data.featured ?? false,
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

/** All valid categories with display labels */
export const BLOG_CATEGORIES: Record<string, string> = {
  "signal-chain": "Signal Chain",
  "platform-guide": "Platform Guide",
  "artist-tone": "Artist Tone",
  "tone-recipes": "Tone Recipes",
  "settings-guides": "Settings Guides",
  "quick-fixes": "Quick Fixes",
  gear: "Gear",
  effects: "Effects",
  workflow: "Workflow",
};
