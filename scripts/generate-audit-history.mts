/**
 * Audit-history generator
 * -----------------------
 * Walks every committed revision of docs/RECIPE_AUDIT_REPORT.md and extracts
 * the header numbers, producing a time series for the /experiment chart:
 *
 *   date · recipes audited · recipes clean (no errors, no warns)
 *
 * Run: `npx tsx scripts/generate-audit-history.mts`
 *
 * Same rule as the rest of that page: nothing here is typed by hand. The
 * series is read back out of git, so the chart cannot drift from the record.
 * (It replaced a hardcoded "185 / 185 clean" that had gone stale.)
 *
 * Re-run after a weekly audit lands.
 */

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = "docs/RECIPE_AUDIT_REPORT.md";
const OUT = resolve(ROOT, "src/data/experiment-audit-history.json");

const git = (args: string) =>
  execSync(`git ${args}`, { cwd: ROOT, maxBuffer: 32 * 1024 * 1024 })
    .toString()
    .trim();

const field = (body: string, label: string): number | null => {
  const m = body.match(
    new RegExp(`^\\*\\*${label}[^*]*:\\*\\*\\s*(\\d+)\\s*$`, "m"),
  );
  return m ? Number(m[1]) : null;
};

const shas = git(`log --format=%H -- ${REPORT}`).split("\n").filter(Boolean);

/** date -> point. Later commits on the same day overwrite earlier ones. */
const byDate = new Map<string, { date: string; recipes: number; clean: number }>();

for (const sha of shas.reverse()) {
  let body: string;
  try {
    body = execSync(`git show ${sha}:${REPORT}`, {
      cwd: ROOT,
      maxBuffer: 32 * 1024 * 1024,
    }).toString();
  } catch {
    continue; // revision where the file didn't exist yet
  }

  const date = body.match(/^\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1];
  const recipes = field(body, "Recipes");
  const clean = field(body, "Clean");
  if (!date || recipes === null || clean === null) continue;

  byDate.set(date, { date, recipes, clean });
}

const series = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
if (series.length < 2) throw new Error("not enough audit history to chart");

const latest = series[series.length - 1];
const out = {
  generated_at: new Date().toLocaleDateString("en-CA"),
  source: REPORT,
  latest,
  series,
};

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`✓ ${OUT}`);
console.log(
  `  ${series.length} points · ${series[0].date} (${series[0].clean}/${series[0].recipes}) → ${latest.date} (${latest.clean}/${latest.recipes})`,
);
