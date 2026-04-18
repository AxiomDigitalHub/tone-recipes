/**
 * Persona velocity audit.
 *
 * Counts posts per author_slug over the last N days. Used by the
 * daily-content-production task to avoid exceeding the per-persona cap set
 * by the 2026-04-17 content-authority strategy (3 posts per persona per
 * week). If a persona is at or over cap, new content should be assigned to
 * a different author or to the "Fader & Knob Staff" byline instead.
 *
 * Usage:
 *
 *   npx tsx scripts/persona-velocity.ts         # last 7 days (default)
 *   npx tsx scripts/persona-velocity.ts 14      # custom window
 *
 * Reads post frontmatter directly — no DB round-trip, fast enough to run at
 * the top of every daily-content session.
 */

import fs from "node:fs";
import path from "node:path";

const CAP_PER_WEEK = 3;
const BLOG_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "content",
  "blog",
);

function parseFrontmatter(content: string): Record<string, string> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([a-z_]+):\s*['"]?(.*?)['"]?$/i);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function main() {
  const windowDays = Number(process.argv[2]) || 7;
  const now = new Date();

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const counts: Record<string, number> = {};
  const recent: Array<{ date: string; slug: string; author: string }> = [];

  for (const f of files) {
    const full = path.join(BLOG_DIR, f);
    const raw = fs.readFileSync(full, "utf-8");
    const fm = parseFrontmatter(raw);
    if (!fm) continue;
    const dateStr = fm.date;
    const author = fm.author_slug || fm.author || "unknown";
    if (!dateStr) continue;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) continue;
    if (daysBetween(d, now) > windowDays) continue;
    counts[author] = (counts[author] || 0) + 1;
    recent.push({ date: dateStr, slug: f.replace(".mdx", ""), author });
  }

  console.log(
    `Persona velocity — posts per author in the last ${windowDays} days (cap: ${CAP_PER_WEEK}/week):`,
  );
  console.log("-".repeat(70));

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  for (const [author, n] of sorted) {
    const perWeek = (n * 7) / windowDays;
    const flag =
      perWeek > CAP_PER_WEEK
        ? " ⚠ OVER CAP"
        : perWeek >= CAP_PER_WEEK
          ? " ← at cap"
          : "";
    console.log(
      `  ${author.padEnd(22)} ${String(n).padStart(3)} posts   (~${perWeek.toFixed(1)}/wk)${flag}`,
    );
  }

  console.log();
  console.log(
    `Total: ${Object.values(counts).reduce((a, b) => a + b, 0)} posts in ${windowDays} days across ${sorted.length} authors`,
  );

  const overCap = sorted.filter(([, n]) => (n * 7) / windowDays > CAP_PER_WEEK);
  if (overCap.length > 0) {
    console.log();
    console.log(
      `${overCap.length} persona(s) over cap. For the next content run, assign topics to:`,
    );
    const under = sorted.filter(([, n]) => (n * 7) / windowDays < CAP_PER_WEEK);
    for (const [author, n] of under) {
      const remaining = CAP_PER_WEEK - (n * 7) / windowDays;
      console.log(
        `  • ${author} (${remaining.toFixed(1)} more posts available this week)`,
      );
    }
    console.log(
      `  • Or use "Fader & Knob Staff" byline for overflow topics.`,
    );
  }
}

main();
