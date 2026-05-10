/**
 * Audit leaky dark-theme Tailwind tokens that don't survive the v3
 * editorial cream palette.
 *
 * Background: most of faderandknob.com renders inside `.fk-preview`
 * but only `.fk-preview .post-body` remaps the Tailwind color tokens
 * (`bg-surface`, `text-foreground`, `text-muted`, `border-border`,
 * `bg-background`, `bg-accent`, `text-accent`, `*-hover`) to the
 * paper/ink/amber palette. Everywhere else those tokens render against
 * the dark global theme — which looks broken on cream pages.
 *
 * This script lists every file using those tokens, categorizes by
 * likely context (v3 cream visible vs legacy dark dashboard vs MDX
 * post-body OK), and writes docs/V3_TOKEN_AUDIT.md. Use it to triage
 * a sweep without grep-ing manually.
 *
 * Run:
 *   npx tsx scripts/audit-v3-tokens.ts
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const OUT = path.join(process.cwd(), "docs", "V3_TOKEN_AUDIT.md");

const LEAKY = [
  "bg-surface",
  "bg-surface-hover",
  "bg-background",
  "text-foreground",
  "text-muted",
  "border-border",
  "bg-accent",
  "bg-accent-hover",
  "text-accent",
] as const;

// Path patterns that indicate the file is OK to keep dark tokens
// (legacy dashboard chrome, version preview pages, MDX-rendered blog
// components that live inside .post-body).
const DARK_OK = [
  /\/dashboard\//,
  /\/v[0-9]+\/page\.tsx$/, // /v2/page, /v3/page, /v4/page — version previews
  /\/v3\.css$/,
];

// Path patterns that are clearly user-facing v3 cream surfaces.
const V3_PRIORITY = [
  /\/components\/layout\//,
  /\/components\/search\//,
  /\/components\/newsletter\//,
  /\/components\/auth\//,
  /\/components\/community\//,
  /\/components\/set-packs\//,
  /\/app\/page\.tsx$/,
  /\/app\/recipe\//,
  /\/app\/blog\//,
  /\/app\/browse\//,
  /\/app\/set-packs\//,
  /\/app\/pricing\//,
  /\/app\/guides\//,
  /\/app\/news\//,
  /\/app\/about\//,
  /\/app\/profile\//,
  /\/app\/gear\//,
  /\/app\/invite\//,
  /\/app\/how-we-work\//,
  /\/app\/community\//,
];

interface FileHit {
  file: string;
  count: number;
  bucket: "priority" | "ok-dark" | "review";
  matches: Array<{ line: number; token: string; snippet: string }>;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (
      entry.name.endsWith(".tsx") ||
      entry.name.endsWith(".ts") ||
      entry.name.endsWith(".css")
    ) {
      out.push(full);
    }
  }
  return out;
}

function scanFile(filePath: string): FileHit | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");
  const matches: FileHit["matches"] = [];

  for (let i = 0; i < lines.length; i++) {
    for (const token of LEAKY) {
      // Word-boundary match so `bg-accent` doesn't also match `bg-accent-hover`
      const re = new RegExp(`\\b${token}\\b(?!-)`);
      if (re.test(lines[i])) {
        matches.push({
          line: i + 1,
          token,
          snippet: lines[i].trim().slice(0, 100),
        });
      }
    }
  }

  if (matches.length === 0) return null;

  const rel = path.relative(process.cwd(), filePath);
  const bucket: FileHit["bucket"] = DARK_OK.some((re) => re.test(rel))
    ? "ok-dark"
    : V3_PRIORITY.some((re) => re.test(rel))
      ? "priority"
      : "review";

  return { file: rel, count: matches.length, bucket, matches };
}

function main() {
  const files = walk(ROOT);
  const hits: FileHit[] = [];
  for (const f of files) {
    const h = scanFile(f);
    if (h) hits.push(h);
  }

  const byBucket = {
    priority: hits.filter((h) => h.bucket === "priority").sort((a, b) => b.count - a.count),
    review: hits.filter((h) => h.bucket === "review").sort((a, b) => b.count - a.count),
    "ok-dark": hits.filter((h) => h.bucket === "ok-dark").sort((a, b) => b.count - a.count),
  };

  let md = `# V3 Token Leakage Audit\n\n`;
  md += `**Generated:** ${new Date().toISOString().slice(0, 10)}\n`;
  md += `**Files scanned:** ${files.length}\n`;
  md += `**Files with leaky tokens:** ${hits.length}\n`;
  md += `**Total occurrences:** ${hits.reduce((a, b) => a + b.count, 0)}\n\n`;
  md += `## Background\n\n`;
  md += `These Tailwind tokens resolve to the **dark global palette** unless they're inside \`.fk-preview .post-body\`:\n\n`;
  md += LEAKY.map((t) => `- \`${t}\``).join("\n") + "\n\n";
  md += `On v3 cream pages (which is most of the site) they render as dark navy / white-on-dark, clashing with the editorial palette. Convert to raw CSS vars instead: \`var(--paper-2)\`, \`var(--ink)\`, \`var(--ink-muted)\`, \`var(--amber)\`, etc.\n\n`;

  function renderBucket(name: string, list: FileHit[]) {
    md += `## ${name} (${list.length})\n\n`;
    if (list.length === 0) {
      md += `_clean_\n\n`;
      return;
    }
    md += `| File | Count |\n|---|---|\n`;
    for (const h of list) {
      md += `| \`${h.file}\` | ${h.count} |\n`;
    }
    md += `\n`;
  }

  renderBucket("Priority — fix these (v3 cream surfaces)", byBucket.priority);
  renderBucket("Review — context unclear, eyeball each", byBucket.review);
  renderBucket("Likely OK — legacy dark dashboard / version previews", byBucket["ok-dark"]);

  fs.writeFileSync(OUT, md);

  // Console summary.
  console.log(`Files with leaky tokens: ${hits.length}`);
  console.log(`  Priority (v3 cream):     ${byBucket.priority.length}`);
  console.log(`  Review (unclear):        ${byBucket.review.length}`);
  console.log(`  OK (dark dashboard):     ${byBucket["ok-dark"].length}`);
  console.log(`Report: ${OUT}`);
}

main();
