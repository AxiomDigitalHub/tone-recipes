/**
 * Experiment stats generator
 * --------------------------
 * Derives the /experiment dashboard numbers from the actual record —
 * git history + content on disk — and writes src/data/experiment-stats.json.
 *
 * Run: `npx tsx scripts/generate-experiment-stats.mts`
 *
 * Nothing in here is hand-typed or aspirational: every number is counted
 * from the repo at generation time. That's the point — the experiment page
 * shows its work. Re-run after content drops (or wire into CI) to keep the
 * dashboard honest.
 */

import { execSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { toneRecipes } from "../src/lib/data";
import { getAllWriters } from "../src/lib/writers";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/experiment-stats.json");

const git = (args: string) =>
  execSync(`git ${args}`, { cwd: ROOT }).toString().trim();

/* ---- git-derived ---- */
const commitCount = Number(git("rev-list --count HEAD"));
const firstCommitDate = git("log --reverse --date=short --pretty=format:%ad")
  .split("\n")[0];
const latestCommitDate = git("log -1 --date=short --pretty=format:%ad");
const subjects = git("log --pretty=format:%s").split("\n");

const dailyContentRuns = subjects.filter((s) =>
  /daily content/i.test(s),
).length;

// Public corrections: commits that fixed recipe/preset accuracy after the
// fact. Counted, not hidden — the correction loop is the experiment.
const correctionCommits = subjects.filter((s) =>
  /fix.*(recipe|preset|accuracy|model id|settings|factual)|audit.*(fix|issue)|fact-check/i.test(
    s,
  ),
).length;

/* ---- content-derived ---- */
const blogPosts = readdirSync(resolve(ROOT, "content/blog")).filter((f) =>
  f.endsWith(".mdx"),
).length;
const presetFiles = readdirSync(resolve(ROOT, "presets")).filter((f) =>
  f.endsWith(".hlx"),
).length;

const recipes = toneRecipes.length;
const platformsCovered = new Set(
  toneRecipes.flatMap((r) => Object.keys(r.platform_translations ?? {})),
).size;
const aiWriters = getAllWriters().length;

const stats = {
  generated_at: new Date().toISOString().slice(0, 10),
  first_commit: firstCommitDate,
  latest_commit: latestCommitDate,
  commits: commitCount,
  recipes,
  platforms_covered: platformsCovered,
  presets_downloadable: presetFiles,
  blog_posts: blogPosts,
  ai_writers: aiWriters,
  autonomous_daily_runs: dailyContentRuns,
  public_corrections: correctionCommits,
};

writeFileSync(OUT, JSON.stringify(stats, null, 2) + "\n");
console.log(`✓ ${OUT}`);
console.table(stats);
