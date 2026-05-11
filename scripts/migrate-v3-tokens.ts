/**
 * One-shot migration: convert leaky dark-theme Tailwind tokens to v3
 * editorial paper/ink/amber CSS-var arbitrary classes.
 *
 * Run on individual files only — the codebase has a few legitimate
 * dark-theme contexts (dashboard pages, version preview pages) that
 * should NOT be migrated. Run audit-v3-tokens.ts first to see the
 * priority list.
 *
 * Usage:
 *   npx tsx scripts/migrate-v3-tokens.ts <file1> [file2 ...]
 *   npx tsx scripts/migrate-v3-tokens.ts --dry-run <files...>   # preview
 *
 * Replacements (longest-first ordering so e.g. bg-accent-hover is
 * matched before bg-accent):
 *
 *   bg-accent-hover           → bg-[var(--amber-2)]
 *   bg-surface-hover          → bg-[var(--paper)]
 *   bg-accent/<n>             → bg-[var(--amber)]/<n>
 *   border-accent/<n>         → border-[var(--amber)]/<n>
 *   text-accent/<n>           → text-[var(--amber-2)]/<n>
 *   text-muted/<n>            → text-[var(--ink-faint)]
 *   bg-accent                 → bg-[var(--amber)]
 *   text-accent               → text-[var(--amber-2)]
 *   bg-surface                → bg-[var(--paper-2)]
 *   bg-background             → bg-[var(--paper)]
 *   text-foreground           → text-[var(--ink)]
 *   text-muted                → text-[var(--ink-muted)]
 *   border-border             → border-[var(--ink)]/15
 *
 * Won't touch: imports, file paths, comments containing the literal
 * token, or string literals — Tailwind classes only appear inside
 * className attributes, and these regexes use word boundaries (\b).
 */

import fs from "node:fs";

interface Rule {
  from: RegExp;
  to: string;
}

// Order matters — longer/more-specific patterns first.
const RULES: Rule[] = [
  // hover variants
  { from: /\bbg-accent-hover\b/g, to: "bg-[var(--amber-2)]" },
  { from: /\bhover:bg-accent-hover\b/g, to: "hover:bg-[var(--amber-2)]" },
  { from: /\bbg-surface-hover\b/g, to: "bg-[var(--paper)]" },
  { from: /\bhover:bg-surface-hover\b/g, to: "hover:bg-[var(--paper)]" },
  { from: /\bhover:bg-surface\b/g, to: "hover:bg-[var(--paper-2)]" },
  { from: /\bhover:bg-accent\b/g, to: "hover:bg-[var(--amber)]" },
  { from: /\bhover:text-accent\b/g, to: "hover:text-[var(--amber-2)]" },
  { from: /\bhover:text-foreground\b/g, to: "hover:text-[var(--ink)]" },
  { from: /\bhover:border-accent\b/g, to: "hover:border-[var(--amber)]" },

  // alpha variants (e.g. bg-accent/5, border-accent/40, text-muted/60)
  { from: /\bbg-accent\/(\d+)\b/g, to: "bg-[var(--amber)]/$1" },
  { from: /\bborder-accent\/(\d+)\b/g, to: "border-[var(--amber)]/$1" },
  { from: /\btext-accent\/(\d+)\b/g, to: "text-[var(--amber-2)]/$1" },
  { from: /\btext-muted\/(\d+)\b/g, to: "text-[var(--ink-faint)]" },
  { from: /\bbg-surface\/(\d+)\b/g, to: "bg-[var(--paper-2)]/$1" },

  // gradient direction tokens (from-, via-, to-)
  { from: /\bfrom-accent\/(\d+)\b/g, to: "from-[var(--amber)]/$1" },
  { from: /\bvia-accent\/(\d+)\b/g, to: "via-[var(--amber)]/$1" },
  { from: /\bto-accent\/(\d+)\b/g, to: "to-[var(--amber)]/$1" },
  { from: /\bfrom-accent\b/g, to: "from-[var(--amber)]" },
  { from: /\bvia-accent\b/g, to: "via-[var(--amber)]" },
  { from: /\bto-accent\b/g, to: "to-[var(--amber)]" },
  // For surface gradients (typically album-art-overlay scrims), use ink
  // — those gradients want a dark fade for white-text legibility, which
  // var(--ink) preserves correctly.
  { from: /\bfrom-surface\/(\d+)\b/g, to: "from-[var(--ink)]/$1" },
  { from: /\bvia-surface\/(\d+)\b/g, to: "via-[var(--ink)]/$1" },
  { from: /\bto-surface\/(\d+)\b/g, to: "to-[var(--ink)]/$1" },
  { from: /\bfrom-surface\b/g, to: "from-[var(--ink)]" },
  { from: /\bvia-surface\b/g, to: "via-[var(--ink)]" },
  { from: /\bto-surface\b/g, to: "to-[var(--ink)]" },
  // Primary token — globally a dark navy. Used mostly as image-load
  // placeholders, which should still feel "dark behind the image" so
  // we map to ink (which is also dark) rather than paper.
  { from: /\bbg-primary\/(\d+)\b/g, to: "bg-[var(--ink)]/$1" },
  { from: /\bbg-primary-light\b/g, to: "bg-[var(--ink)]/20" },
  { from: /\bbg-primary\b/g, to: "bg-[var(--ink)]" },

  // base tokens
  { from: /\bbg-accent\b/g, to: "bg-[var(--amber)]" },
  { from: /\btext-accent\b/g, to: "text-[var(--amber-2)]" },
  { from: /\bborder-accent\b/g, to: "border-[var(--amber)]" },
  { from: /\bbg-surface\b/g, to: "bg-[var(--paper-2)]" },
  { from: /\bbg-background\b/g, to: "bg-[var(--paper)]" },
  { from: /\btext-background\b/g, to: "text-[var(--ink)]" },
  { from: /\btext-foreground\b/g, to: "text-[var(--ink)]" },
  { from: /\btext-muted\b/g, to: "text-[var(--ink-muted)]" },
  { from: /\bbg-border\b/g, to: "bg-[var(--ink)]/15" },
  { from: /\bborder-border\b/g, to: "border-[var(--ink)]/15" },

  // focus / placeholder / disabled etc. variants we picked up
  { from: /\bfocus:border-accent\b/g, to: "focus:border-[var(--amber)]" },
  { from: /\bfocus:ring-accent\b/g, to: "focus:ring-[var(--amber)]" },
  { from: /\bplaceholder:text-muted\b/g, to: "placeholder:text-[var(--ink-faint)]" },
];

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const FILES = args.filter((a) => !a.startsWith("--"));

if (FILES.length === 0) {
  console.error("Usage: npx tsx scripts/migrate-v3-tokens.ts [--dry-run] <files...>");
  process.exit(1);
}

let totalChanges = 0;
for (const file of FILES) {
  if (!fs.existsSync(file)) {
    console.error(`  ! ${file} — not found, skipped`);
    continue;
  }
  const before = fs.readFileSync(file, "utf-8");
  let after = before;
  let perFile = 0;
  for (const rule of RULES) {
    const matches = after.match(rule.from);
    if (!matches) continue;
    perFile += matches.length;
    after = after.replace(rule.from, rule.to);
  }
  if (perFile === 0) {
    console.log(`  · ${file} — no leaky tokens`);
    continue;
  }
  totalChanges += perFile;
  if (DRY) {
    console.log(`  → ${file} — would change ${perFile} occurrence(s)`);
  } else {
    fs.writeFileSync(file, after);
    console.log(`  ✓ ${file} — ${perFile} replacement(s)`);
  }
}

console.log(`\nTotal: ${totalChanges} replacement(s) across ${FILES.length} file(s).`);
if (DRY) console.log(`Dry run — re-run without --dry-run to write.`);
