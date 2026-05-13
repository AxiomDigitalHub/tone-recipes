/**
 * The blog frontmatter contract.
 *
 * This file is the single source of truth for what a blog post must contain.
 * Everything else derives from it:
 *
 *   - The TypeScript `BlogPost` type (src/lib/blog.ts re-exports `z.infer`).
 *   - The MDX preflight validator (scripts/validate-mdx.mts) treats schema
 *     failures as errors and missing recommended fields as warnings.
 *   - The daily content routine (`.claude/scheduled-tasks/daily-content-
 *     production/SKILL.md`) requires authors to populate every required
 *     field at write time.
 *
 * The principle: if a field is in the schema, it's because schema.org or an
 * answer engine wants it. Schema = content checklist.
 *
 * When you add a field here, also:
 *   1. Update `src/lib/blog.ts:getPostBySlug` to read it from gray-matter.
 *   2. Update `src/app/blog/[slug]/page.tsx` if it should render or feed JSON-LD.
 *   3. Update the routine SKILL.md so authors know to provide it.
 *   4. Update existing posts via a backfill commit (or note as a soft warning).
 */

import { z } from "zod";

/** Q&A pair — drives the on-page FAQ block AND the FAQPage JSON-LD. */
export const BlogFaqSchema = z.object({
  q: z
    .string()
    .min(10, "FAQ question is too short — write a real question, not a phrase")
    .max(200, "FAQ question is too long — split into multiple Q&A pairs"),
  a: z
    .string()
    .min(40, "FAQ answer is too short — answer engines need 1-3 sentences")
    .max(1200, "FAQ answer is too long — split into multiple Q&A pairs"),
});

export type BlogFaq = z.infer<typeof BlogFaqSchema>;

/**
 * All recognised blog categories. Keep in sync with BLOG_CATEGORIES in
 * src/lib/blog.ts. Values match URL slugs.
 *
 * Some are HowTo-eligible (tone-recipes, settings-guides) — the page route
 * emits HowTo schema for those automatically.
 */
export const BLOG_CATEGORY_SLUGS = [
  "signal-chain",
  "platform-guide",
  "artist-tone",
  "tone-recipes",
  "settings-guides",
  "quick-fixes",
  "modeler-masterclass",
  "gear-lab",
  "gear",
  "effects",
  "workflow",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORY_SLUGS)[number];

/**
 * All recognised author slugs. Keep in sync with WRITERS in src/lib/writers.ts
 * (plus the editorial-neutral `fk-staff` byline).
 *
 * Validated as an enum so a typo in `author_slug:` fails preflight instead of
 * silently falling back to the generic "Fader & Knob" byline.
 */
export const AUTHOR_SLUGS = [
  "rick-dalton",
  "jess-kowalski",
  "sean-nakamura",
  "margot-thiessen",
  "carl-beckett",
  "dev-okonkwo",
  "nathan-cross",
  "viktor-kessler",
  "hank-presswood",
  "elena-ruiz",
  "fk-staff",
] as const;

export type AuthorSlug = (typeof AUTHOR_SLUGS)[number];

/**
 * The frontmatter schema.
 *
 * Required fields are unconditional — preflight FAILS if any are missing or
 * malformed. These are the fields that drive E-E-A-T signals (author,
 * dates, category) and Article schema (headline, description, image).
 *
 * Optional fields are validated when present, but absence is reported as a
 * warning (preflight still exits 0). These are the AEO surfaces — takeaways
 * and FAQ — that we strongly want on every post but don't want to retroactively
 * require for the 200+ existing posts.
 *
 * The validator emits warnings that say "this post is missing X — your
 * answer-engine surface is smaller than it could be." Treat warnings as
 * "fix before you ship if you have time," errors as "fix or your post breaks."
 */
export const BlogFrontmatterSchema = z.object({
  // ── REQUIRED ─────────────────────────────────────────────────────────────

  title: z
    .string()
    .min(20, "Title is too short — aim for 40-100 characters for SEO")
    .max(140, "Title is too long — Google truncates at ~60 chars; keep under 110"),

  description: z
    .string()
    .min(80, "Description is too short — aim for 120-180 characters")
    // Hard cap is permissive (350) because Article schema has no length limit
    // and many legacy posts run long. The validator emits a soft warning when
    // description > 200 chars (where Google starts truncating snippets).
    .max(350, "Description is excessive — over 350 chars suggests it's the lede, not a meta description"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),

  // Legacy display name. We keep it for the prior 200 posts. New posts
  // can omit it — author_slug is the load-bearing field. If both are
  // present, author_slug wins.
  author: z.string().min(2).optional(),

  author_slug: z.enum(AUTHOR_SLUGS, {
    message: `author_slug must be one of: ${AUTHOR_SLUGS.join(", ")}`,
  }),

  category: z.enum(BLOG_CATEGORY_SLUGS, {
    message: `category must be one of: ${BLOG_CATEGORY_SLUGS.join(", ")}`,
  }),

  tags: z
    .array(z.string().min(2))
    .min(3, "Need at least 3 tags for clustering")
    .max(10, "More than 10 tags dilutes topical signal"),

  image: z
    .string()
    .regex(
      /^\/images\/blog\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/,
      "image must be a local path like /images/blog/<slug>.jpg",
    ),

  image_alt: z
    .string()
    .min(20, "image_alt is too short — describe what the image shows for accessibility")
    .max(250, "image_alt is too long — keep alt text under 200 chars"),

  // ── STRONGLY RECOMMENDED (warnings, not errors) ──────────────────────────

  /**
   * 3-5 bullet "Key Takeaways" — the most-extractable surface for AI answer
   * engines. Rendered as a boxed callout above the post body. Skipping this
   * means leaving the AEO surface on the table.
   */
  takeaways: z
    .array(
      z
        .string()
        .min(20, "Takeaway is too short — write a complete sentence")
        .max(300, "Takeaway is too long — keep each bullet under 250 chars"),
    )
    .min(3, "Need at least 3 takeaways")
    .max(6, "More than 6 takeaways isn't a takeaway list — it's the whole post")
    .optional(),

  /**
   * 3-6 Q&A pairs that drive both the on-page FAQ block AND the FAQPage
   * JSON-LD. Preferred over the `<FAQ>` MDX component because frontmatter
   * is queryable, lintable, and doesn't require body-level escaping for
   * inch marks / `<` characters.
   */
  faq: z
    .array(BlogFaqSchema)
    .min(3, "FAQ needs at least 3 Q&A pairs to be worth emitting")
    .max(8, "More than 8 FAQs dilutes the schema — pick the most useful")
    .optional(),

  // ── OPTIONAL (no warning if absent) ──────────────────────────────────────

  /**
   * ISO date of last meaningful edit. When set, drives Article schema
   * dateModified AND sitemap lastmod (preferred over `date`). Omit on
   * first publish.
   */
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "updated must be YYYY-MM-DD")
    .optional(),

  /** Image dimensions for Article schema ImageObject. Default values match
   *  the gpt-image-2 / Flux-2-Pro output dimensions (1536×1024). */
  image_width: z.number().int().positive().optional(),
  image_height: z.number().int().positive().optional(),

  /** Featured flag for the homepage carousel. */
  featured: z.boolean().optional(),

  /**
   * Reading-time hint — accepted as either a number ("8") or a string
   * ("8 min read"). Legacy posts (200+) used the string form; new posts
   * may write the bare integer. The runtime always overrides this with
   * the computed value from `reading-time` regardless of what's in
   * frontmatter, so this is purely an authoring-discipline field.
   */
  readingTime: z.union([z.number().int().positive(), z.string()]).optional(),
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

/**
 * The list of fields we treat as "warnings" rather than "errors" — present in
 * the schema as `.optional()` but the validator emits a soft warning when
 * absent on new posts. Centralised here so the validator and the SKILL.md
 * stay in sync about what counts as "should have."
 */
export const RECOMMENDED_FIELDS: (keyof BlogFrontmatter)[] = ["takeaways", "faq"];

/**
 * Categories where the post should *also* either contain `<FAQ>` in the body
 * OR provide `faq:` in frontmatter. Currently we recommend FAQ on every
 * category, but separating the rule lets us tune it later without rewriting
 * the validator.
 */
export const FAQ_REQUIRED_CATEGORIES: BlogCategory[] = [
  "tone-recipes",
  "settings-guides",
  "modeler-masterclass",
  "gear-lab",
  "quick-fixes",
  "signal-chain",
];
