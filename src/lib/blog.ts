import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getWriter } from "./writers";
import { BlogFrontmatterSchema, type BlogFaq } from "./blog.schema";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Re-export the FAQ type so existing call sites keep working.
export type { BlogFaq };

/**
 * The runtime BlogPost shape. Derived in spirit from `BlogFrontmatterSchema`
 * in `./blog.schema.ts` (which is the authoritative contract — see that file).
 *
 * The schema validates raw frontmatter; this type adds:
 *   - `slug` (derived from filename)
 *   - `author` (display name, resolved from author_slug → writer profile)
 *   - `authorSlug` (camelCase alias for author_slug)
 *   - `imageAlt` (camelCase alias for image_alt)
 *   - `readingTime` / `wordCount` (computed from MDX body length)
 *
 * Schema fields NOT in this type yet: `image_width`, `image_height` — those
 * are validated but not consumed by render code today. Wire them through
 * when we upgrade Article schema to ImageObject.
 */
export interface BlogPost {
  slug: string;
  title: string;
  /**
   * Optional short <title> for the SERP, when the editorial headline is
   * longer than the ~60 chars Google renders. Falls back to `title`.
   * Set it via `seo_title:` in frontmatter; the H1 always uses `title`.
   */
  seoTitle?: string;
  description: string;
  date: string; // ISO date — first publish
  updated?: string; // ISO date — last meaningful edit (optional)
  author: string; // display name, resolved via author_slug → writers.ts
  authorSlug: string; // canonical writer slug (validated against AUTHOR_SLUGS)
  category: string; // validated against BLOG_CATEGORY_SLUGS
  tags: string[];
  readingTime: string; // "8 min read"
  wordCount: number;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  /** 3-5 takeaway bullets — drives the "Key Takeaways" callout for AEO. */
  takeaways?: string[];
  /** 3-6 Q&A pairs — drives the on-page FAQ AND FAQPage JSON-LD. */
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

  // In dev, surface schema violations to the terminal so the author sees
  // them without having to run the preflight script separately. In prod,
  // we trust that preflight ran on the build — degrading-but-rendering is
  // better than 500ing a post over a too-long description string.
  if (process.env.NODE_ENV === "development") {
    const result = BlogFrontmatterSchema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      console.warn(`[blog.schema] ${slug}.mdx fails Zod contract:\n${issues}`);
    }
  }

  // Support both author_slug (new) and author (legacy) frontmatter
  const authorSlug: string = data.author_slug ?? "";
  const writer = authorSlug ? getWriter(authorSlug) : null;
  const authorName = writer?.name ?? data.author ?? "Fader & Knob";

  return {
    slug,
    title: data.title ?? "",
    seoTitle: data.seo_title ?? undefined,
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
