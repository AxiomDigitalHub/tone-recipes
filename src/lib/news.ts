import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const NEWS_DIR = path.join(process.cwd(), "content", "news");

export type NewsCategory =
  | "firmware-update"
  | "new-gear"
  | "industry"
  | "tips";

export interface NewsPost {
  slug: string;
  title: string;
  date: string; // ISO date
  category: NewsCategory;
  excerpt: string;
  source_url: string;
  image_url: string;
  readingTime: string;
}

export interface NewsPostWithContent extends NewsPost {
  content: string; // raw markdown content (without frontmatter)
}

/**
 * Returns all .md file slugs in the news content directory.
 */
export function getNewsSlugs(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

/**
 * Reads a single news post by slug.
 * Returns parsed frontmatter + raw markdown content.
 */
export function getNewsPostBySlug(slug: string): NewsPostWithContent | null {
  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug: data.slug ?? slug,
    title: data.title ?? "",
    date: data.date ?? "",
    category: data.category ?? "industry",
    excerpt: data.excerpt ?? "",
    source_url: data.source_url ?? "",
    image_url: data.image_url ?? "",
    readingTime: stats.text,
    content,
  };
}

/**
 * Returns all news posts sorted by date descending.
 */
export function getAllNewsPosts(): NewsPost[] {
  const slugs = getNewsSlugs();

  const posts = slugs
    .map((slug) => {
      const post = getNewsPostBySlug(slug);
      if (!post) return null;
      // Strip the raw content for the listing
      const { content: _, ...meta } = post;
      return meta;
    })
    .filter((p): p is NewsPost => p !== null);

  // Sort by date descending
  posts.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });

  return posts;
}

/** All valid news categories with display labels */
export const NEWS_CATEGORIES: Record<NewsCategory, string> = {
  "firmware-update": "Firmware Updates",
  "new-gear": "New Gear",
  industry: "Industry",
  tips: "Tips",
};

/** Category badge colour map */
export const NEWS_CATEGORY_COLORS: Record<string, string> = {
  "firmware-update": "bg-blue-500/15 text-blue-400",
  "new-gear": "bg-emerald-500/15 text-emerald-400",
  industry: "bg-purple-500/15 text-purple-400",
  tips: "bg-amber-500/15 text-amber-400",
};
