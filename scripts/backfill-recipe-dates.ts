/**
 * backfill-recipe-dates.ts — one-off migration (2026-06-10)
 *
 * Adds `created_at: "YYYY-MM-DD"` to every recipe in src/lib/data/index.ts,
 * derived from git history: the date of the first commit in which the
 * recipe's slug appears in the file. Recipes added before history began fall
 * back to the earliest commit date.
 *
 * Idempotent: recipes that already have a created_at line are skipped.
 * updated_at is NOT backfilled — it starts unset and gets stamped by the
 * weekly audit when a recipe is meaningfully edited.
 *
 * Run: npx tsx scripts/backfill-recipe-dates.ts
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src/lib/data/index.ts");
const REL_DATA_FILE = "src/lib/data/index.ts";

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

// 1. Collect current recipe slugs from the live data module.
//    (Import via require of tsx-transpiled module is messy here; instead parse
//    the toneRecipes section textually — recipe objects are the only ones with
//    an `id:` field, and their `slug:` line follows within the same object.)
const source = readFileSync(DATA_FILE, "utf8");
const lines = source.split("\n");

const recipesStart = lines.findIndex((l) => l.includes("export const toneRecipes"));
if (recipesStart === -1) throw new Error("toneRecipes array not found");

// Recipe slugs: every `    slug: "..."` line after the toneRecipes declaration.
const recipeSlugLine = /^    slug: "([^"]+)",$/;
const recipeSlugs: string[] = [];
for (let i = recipesStart; i < lines.length; i++) {
  const m = lines[i].match(recipeSlugLine);
  if (m) recipeSlugs.push(m[1]);
}
console.log(`Found ${recipeSlugs.length} recipe slugs after line ${recipesStart + 1}`);

// Sanity: no overlap with song/artist slugs declared BEFORE toneRecipes.
const preSlugs = new Set<string>();
for (let i = 0; i < recipesStart; i++) {
  const m = lines[i].match(recipeSlugLine);
  if (m) preSlugs.add(m[1]);
}
const collisions = recipeSlugs.filter((s) => preSlugs.has(s));
if (collisions.length) {
  throw new Error(`Recipe slugs collide with song/artist slugs: ${collisions.join(", ")}`);
}

// 2. Walk history oldest → newest, record first commit date containing each slug.
const history = git(["log", "--reverse", "--format=%H %ad", "--date=short", "--", REL_DATA_FILE])
  .trim()
  .split("\n")
  .map((l) => {
    const [sha, date] = l.split(" ");
    return { sha, date };
  });
console.log(`Walking ${history.length} commits of ${REL_DATA_FILE}...`);

const firstSeen = new Map<string, string>();
const remaining = new Set(recipeSlugs);
for (const { sha, date } of history) {
  if (remaining.size === 0) break;
  let content: string;
  try {
    content = git(["show", `${sha}:${REL_DATA_FILE}`]);
  } catch {
    continue; // file absent at this commit
  }
  for (const slug of Array.from(remaining)) {
    if (content.includes(`slug: "${slug}"`)) {
      firstSeen.set(slug, date);
      remaining.delete(slug);
    }
  }
}
// Anything not found in history (added in uncommitted work) gets today — but
// flag it loudly since this script is meant to run on a committed file.
for (const slug of remaining) {
  console.warn(`WARN: ${slug} not found in any commit — using earliest history date`);
  firstSeen.set(slug, history[0].date);
}

// 3. Rewrite: insert created_at after each recipe slug line (skip if present).
const out: string[] = [];
let inserted = 0;
let skipped = 0;
for (let i = 0; i < lines.length; i++) {
  out.push(lines[i]);
  if (i < recipesStart) continue;
  const m = lines[i].match(recipeSlugLine);
  if (!m) continue;
  const slug = m[1];
  const date = firstSeen.get(slug);
  if (!date) continue;
  if (lines[i + 1]?.trim().startsWith("created_at:")) {
    skipped++;
    continue;
  }
  out.push(`    created_at: "${date}",`);
  inserted++;
}

writeFileSync(DATA_FILE, out.join("\n"));
console.log(`Inserted created_at on ${inserted} recipes (${skipped} already had it).`);

// 4. Distribution summary
const byDate = new Map<string, number>();
for (const d of firstSeen.values()) byDate.set(d, (byDate.get(d) ?? 0) + 1);
console.log("created_at distribution:");
for (const [d, n] of Array.from(byDate.entries()).sort()) console.log(`  ${d}: ${n}`);
