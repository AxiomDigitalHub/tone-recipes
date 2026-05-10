/**
 * Bulk backfill of <SaveThisTone /> CTAs across all blog posts that are
 * still missing one after `scripts/apply-save-this-tone.ts` ran. Where
 * that script uses hand-curated per-post mappings (30+ posts), this one
 * handles the long tail (~125+ posts) by classifying via frontmatter
 * tags + category.
 *
 * Classification cascade — first match wins:
 *   1. Artist tag matches a single-recipe artist → link to that recipe
 *   2. Artist tag matches a multi-recipe artist → /browse?artist=<slug>
 *   3. Platform tag (helix, katana, tonex, quad-cortex, fractal, kemper)
 *      → /browse?platform=<slug>
 *   4. Tone-character tag (fuzz, high-gain, clean, ambient, jangly)
 *      → /browse?tag=<character>
 *   5. Genre tag (blues, metal, country, shoegaze, ...)
 *      → /browse?genre=<slug>
 *   6. Fallback → /browse
 *
 * Run:
 *   npx tsx scripts/backfill-save-this-tone-bulk.ts          # dry-run + CSV
 *   npx tsx scripts/backfill-save-this-tone-bulk.ts --apply  # write
 *
 * The CSV is written to docs/SAVE_THIS_TONE_BACKFILL.csv for review.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { toneRecipes, songs, artists } from "../src/lib/data";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const APPLY = process.argv.includes("--apply");

type Cta =
  | { kind: "recipe"; slug: string; reason: string }
  | {
      kind: "freeform";
      title: string;
      description: string;
      href: string;
      ctaLabel: string;
      reason: string;
    };

// Build artist → recipes index from the live catalog.
const artistToRecipes = new Map<string, string[]>();
for (const r of toneRecipes) {
  const song = songs.find((s) => s.slug === r.song_slug);
  if (!song?.artist_slug) continue;
  const list = artistToRecipes.get(song.artist_slug) ?? [];
  list.push(r.slug);
  artistToRecipes.set(song.artist_slug, list);
}
const artistName = (slug: string) =>
  artists.find((a) => a.slug === slug)?.name ?? slug;

// Tag → /browse filter mappings.
const PLATFORM_TAGS: Record<string, { slug: string; label: string }> = {
  helix: { slug: "helix", label: "Helix" },
  "line-6-helix": { slug: "helix", label: "Helix" },
  "hx-stomp": { slug: "helix", label: "Helix / HX Stomp" },
  katana: { slug: "katana", label: "Katana" },
  "boss-katana": { slug: "katana", label: "Katana" },
  tonex: { slug: "tonex", label: "TONEX" },
  "quad-cortex": { slug: "quad_cortex", label: "Quad Cortex" },
  fractal: { slug: "fractal", label: "Fractal" },
  kemper: { slug: "kemper", label: "Kemper" },
};

const TONE_TAGS: Record<string, { tag: string; label: string }> = {
  fuzz: { tag: "fuzz", label: "fuzz" },
  "big-muff": { tag: "fuzz", label: "fuzz" },
  "fuzz-face": { tag: "fuzz", label: "fuzz" },
  "high-gain": { tag: "high-gain", label: "high-gain" },
  djent: { tag: "high-gain", label: "high-gain" },
  metal: { tag: "high-gain", label: "high-gain" },
  clean: { tag: "clean", label: "clean" },
  ambient: { tag: "clean", label: "ambient / clean" },
  jangly: { tag: "clean", label: "jangly clean" },
  shoegaze: { tag: "fuzz", label: "shoegaze fuzz" },
  worship: { tag: "clean", label: "worship clean" },
  blues: { tag: "blues", label: "blues" },
  country: { tag: "clean", label: "country / clean" },
  funk: { tag: "clean", label: "funk / clean" },
};

const GENRE_TAGS = new Set([
  "blues",
  "metal",
  "rock",
  "punk",
  "grunge",
  "country",
  "shoegaze",
  "jazz",
  "funk",
  "indie",
  "classic-rock",
]);

interface Post {
  slug: string;
  filePath: string;
  raw: string;
  data: Record<string, unknown>;
  tags: string[];
}

function loadPosts(): Post[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const filePath = path.join(BLOG_DIR, f);
      const raw = fs.readFileSync(filePath, "utf-8");
      const fm = matter(raw);
      const tagsRaw = fm.data.tags;
      const tags: string[] = Array.isArray(tagsRaw)
        ? tagsRaw.map(String)
        : typeof tagsRaw === "string"
          ? [tagsRaw]
          : [];
      return {
        slug: f.replace(/\.mdx$/, ""),
        filePath,
        raw,
        data: fm.data as Record<string, unknown>,
        tags: tags.map((t) => t.toLowerCase()),
      };
    });
}

function classify(post: Post): Cta {
  // 1. Artist tag match
  for (const tag of post.tags) {
    const recipes = artistToRecipes.get(tag);
    if (!recipes || recipes.length === 0) continue;
    if (recipes.length === 1) {
      return {
        kind: "recipe",
        slug: recipes[0],
        reason: `artist tag '${tag}' → single recipe`,
      };
    }
    return {
      kind: "freeform",
      title: `${artistName(tag)} presets in the library`,
      description: `Every ${artistName(tag)} recipe we've published — signal chain, exact settings, downloadable presets.`,
      href: `/browse?artist=${encodeURIComponent(tag)}`,
      ctaLabel: `Browse ${artistName(tag)} recipes`,
      reason: `artist tag '${tag}' → ${recipes.length} recipes`,
    };
  }

  // 2. Platform tag match
  for (const tag of post.tags) {
    const p = PLATFORM_TAGS[tag];
    if (!p) continue;
    return {
      kind: "freeform",
      title: `Browse ${p.label} presets`,
      description: `Every recipe in our library translated for ${p.label} — signal chain, exact settings, ready to load.`,
      href: `/browse?platform=${p.slug}`,
      ctaLabel: `Browse ${p.label} presets`,
      reason: `platform tag '${tag}'`,
    };
  }

  // 3. Tone-character tag
  for (const tag of post.tags) {
    const t = TONE_TAGS[tag];
    if (!t) continue;
    return {
      kind: "freeform",
      title: `Start with a ${t.label} recipe`,
      description: `Pick a recipe close to the tone in this post and tweak from there — faster than building from a blank patch.`,
      href: `/browse?tag=${t.tag}`,
      ctaLabel: `Browse ${t.label} presets`,
      reason: `tone tag '${tag}'`,
    };
  }

  // 4. Genre tag
  for (const tag of post.tags) {
    if (!GENRE_TAGS.has(tag)) continue;
    return {
      kind: "freeform",
      title: `Browse ${tag.replace(/-/g, " ")} presets`,
      description: `Every ${tag.replace(/-/g, " ")} recipe in the library — exact settings, downloadable presets, no guessing.`,
      href: `/browse?genre=${encodeURIComponent(tag)}`,
      ctaLabel: `Browse ${tag.replace(/-/g, " ")} presets`,
      reason: `genre tag '${tag}'`,
    };
  }

  // 5. Fallback
  return {
    kind: "freeform",
    title: "Browse the recipe library",
    description:
      "Every recipe has the signal chain, exact settings, and downloadable presets — across Helix, Katana, Quad Cortex, and more.",
    href: "/browse",
    ctaLabel: "Browse all recipes",
    reason: "fallback (no matching tag)",
  };
}

function buildCtaBlock(cta: Cta): string {
  if (cta.kind === "recipe") {
    return `\n\n<SaveThisTone recipeSlug="${cta.slug}" />\n`;
  }
  const escape = (s: string) => s.replace(/"/g, "&quot;");
  return `\n\n<SaveThisTone\n  title="${escape(cta.title)}"\n  description="${escape(cta.description)}"\n  href="${cta.href}"\n  ctaLabel="${escape(cta.ctaLabel)}"\n/>\n`;
}

function main() {
  const posts = loadPosts();
  const missing = posts.filter((p) => !p.raw.includes("<SaveThisTone"));

  let recipeCount = 0;
  let freeformCount = 0;
  const csvRows: string[] = [
    "slug,kind,target,reason",
  ];

  for (const post of missing) {
    const cta = classify(post);
    const target = cta.kind === "recipe" ? `/recipe/${cta.slug}` : cta.href;
    csvRows.push(
      [
        post.slug,
        cta.kind,
        target,
        cta.reason.replace(/,/g, ";"),
      ].join(","),
    );
    if (cta.kind === "recipe") recipeCount++;
    else freeformCount++;

    if (APPLY) {
      const block = buildCtaBlock(cta);
      fs.writeFileSync(post.filePath, post.raw.trimEnd() + block);
    }
  }

  const csvOut = path.join(process.cwd(), "docs", "SAVE_THIS_TONE_BACKFILL.csv");
  fs.writeFileSync(csvOut, csvRows.join("\n") + "\n");

  console.log(`Posts missing SaveThisTone: ${missing.length}`);
  console.log(`  → recipe-linked: ${recipeCount}`);
  console.log(`  → freeform:      ${freeformCount}`);
  console.log(`CSV written to ${csvOut}`);
  console.log(
    APPLY ? "✓ Applied to all posts." : "Dry run. Re-run with --apply to write.",
  );
}

main();
