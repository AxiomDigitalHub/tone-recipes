/**
 * Prints every recipe's SEO title, H1 and meta description with lengths, and
 * flags titles over 60 characters, descriptions over 150, and any two
 * recipes that share a title. Mirrors generateMetadata in
 * src/app/recipe/[slug]/page.tsx (both use src/lib/recipe-seo.ts).
 *
 *   npx tsx scripts/audit-recipe-seo.ts          # full table + flags
 *   npx tsx scripts/audit-recipe-seo.ts --flags  # flags only
 *
 * Exits 1 when anything is flagged.
 */
import { toneRecipes, getSongBySlug, getArtistBySlug } from "../src/lib/data";
import {
  RECIPE_DESCRIPTION_MAX,
  RECIPE_TITLE_MAX,
  recipeH1Text,
  recipeSeoDescription,
  recipeSeoTitle,
} from "../src/lib/recipe-seo";

const flagsOnly = process.argv.includes("--flags");
const flags: string[] = [];
const byTitle = new Map<string, string[]>();

for (const r of toneRecipes) {
  const song = getSongBySlug(r.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const title = recipeSeoTitle(r, song, artist);
  const h1 = recipeH1Text(r, song, artist);
  const description = recipeSeoDescription(r, song, artist);

  if (!flagsOnly) {
    console.log(`/recipe/${r.slug}`);
    console.log(`  title (${title.length}): ${title}`);
    console.log(`  h1    (${h1.length}): ${h1}`);
    console.log(`  desc  (${description.length}): ${description}`);
  }
  if (title.length > RECIPE_TITLE_MAX) flags.push(`title ${title.length} > ${RECIPE_TITLE_MAX}\t/recipe/${r.slug}\t${title}`);
  if (description.length > RECIPE_DESCRIPTION_MAX)
    flags.push(`desc ${description.length} > ${RECIPE_DESCRIPTION_MAX}\t/recipe/${r.slug}\t${description}`);
  byTitle.set(title, [...(byTitle.get(title) ?? []), r.slug]);
}

for (const [title, slugs] of byTitle) {
  if (slugs.length > 1) flags.push(`duplicate title\t${slugs.join(", ")}\t${title}`);
}

console.log(`\n${toneRecipes.length} recipes checked, ${flags.length} flagged.`);
for (const f of flags) console.log(`  ${f}`);
process.exit(flags.length ? 1 : 0);
