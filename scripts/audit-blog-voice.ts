/**
 * Programmatic voice/persona audit for every published blog post.
 *
 * Catches the failure modes the persona-self-audit (Gate 2, 5, 6) is
 * supposed to catch — a backstop for when the writer agent's introspection
 * misses something. Reports per-post counts of:
 *
 *   - Unqualified generic tone descriptors ("warm", "musical", "transparent",
 *     "lush", "rich" with no specific qualifier following). Gate 6 failure.
 *   - Explicit writer-vs-writer disagreement patterns ("I respect Sean, but",
 *     "Rick would say", etc). Gate 2 failure.
 *   - Signature-phrase overuse (loaded from `content/writers.md`). Gate 2.
 *   - Self-reference density via a heuristic ("I've been gigging since",
 *     "as someone who", "in my [n] years"). Gate 2.
 *
 * Writes a report to `docs/BLOG_VOICE_AUDIT.md`. Exit code is 0 even if
 * issues are found — this is signal, not a build gate. Wire into CI only
 * after the agent has demonstrated it can hit zero on a fresh batch.
 *
 * Run:
 *   npx tsx scripts/audit-blog-voice.ts
 *   npx tsx scripts/audit-blog-voice.ts --json
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const WRITERS_MD = path.join(process.cwd(), "content", "writers.md");
const OUT = path.join(process.cwd(), "docs", "BLOG_VOICE_AUDIT.md");
const JSON_MODE = process.argv.includes("--json");

// Generic tone descriptors that need a specific qualifier. The regex
// requires a word boundary and looks ahead for a qualifier within the
// next 60 chars. "warm in the way a tweed Deluxe breaks up" → OK.
// "warm overdrive" → flagged. Heuristic, not exact, but tight enough
// to be useful.
const GENERIC_TONE_WORDS = ["warm", "musical", "transparent", "lush", "rich"];

// Qualifier signals — if any of these appear within ~80 chars after the
// generic word, treat the use as qualified. Order-dependent inside the
// 80-char window.
const QUALIFIER_SIGNALS = [
  /\b(like|reminiscent of|in the way|the way that|the kind of|akin to)\b/i,
  /\b(Marshall|Fender|Vox|Mesa|Boogie|Tweed|AC30|Bassman|Deluxe|Twin)\b/,
  // a song name in title case after the word also counts as qualified
];

// Explicit cross-writer disagreement patterns. The voice doc bans these.
const CROSS_WRITER_PATTERNS = [
  /I respect (Rick|Jess|Sean|Margot|Carl|Dev|Nathan|Viktor|Hank|Elena),?\s+but\b/i,
  /(Rick|Jess|Sean|Margot|Carl|Dev|Nathan|Viktor|Hank|Elena) would (say|disagree|argue)/i,
  /(my colleague|my fellow writer)\b/i,
  /\b(over at the Fader & Knob desk|over at the staff)\b/i,
];

// Self-reference heuristic — phrases that announce the writer's identity
// or backstory. Imprecise but useful as a count.
const SELF_REFERENCE_PATTERNS = [
  /\bas someone who\b/i,
  /\bin my (\d+|over \d+|more than \d+) years\b/i,
  /\bI've been (gigging|playing|touring|recording) (for|since)\b/i,
  /\bI've spent \d+\b/i,
  /\b(?:I)\s+(?:gig|tour|record|play) (in|with|through)\b/i,
];

interface WriterSig {
  slug: string;
  signaturePhrases: string[];
}

// Parse writers.md to extract each writer's signature phrases. Format
// in the doc: `**Signature phrases (use sparingly — once per article
// max, some articles zero):** "Phrase A." / "Phrase B."`
function loadSignaturePhrases(): WriterSig[] {
  const md = fs.readFileSync(WRITERS_MD, "utf-8");
  const result: WriterSig[] = [];
  // Split on writer sections (## n. Name — "Title")
  const sections = md.split(/^## \d+\.\s+/m).slice(1);
  for (const section of sections) {
    // First line is "Name — \"Title\""
    const firstLine = section.split("\n", 1)[0];
    const name = firstLine.split("—")[0].trim();
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const sigMatch = section.match(/\*\*Signature phrases[^:]*:\*\*\s*(.+)/);
    if (!sigMatch) continue;

    // Extract quoted phrases.
    const phrases = Array.from(sigMatch[1].matchAll(/"([^"]+?)"/g)).map(
      (m) => m[1].replace(/[.!?]$/, "").trim(),
    );
    if (phrases.length > 0) result.push({ slug, signaturePhrases: phrases });
  }
  return result;
}

interface Finding {
  rule: string;
  detail: string;
}

function auditPost(body: string, sigs: WriterSig[], authorSlug?: string): Finding[] {
  const findings: Finding[] = [];

  // Gate 6: unqualified generic tone descriptors.
  for (const word of GENERIC_TONE_WORDS) {
    const re = new RegExp(`\\b${word}\\b`, "gi");
    for (const m of body.matchAll(re)) {
      const start = m.index ?? 0;
      const after = body.slice(start, start + 100);
      const before = body.slice(Math.max(0, start - 40), start);

      // Skip "warm up / warming up / warm-up" (verb).
      if (word === "warm" && /^warm[\s-]?(up|ed|ing)\b/i.test(after)) continue;

      // Skip if preceded by an -ly adverb (harmonically rich, musically chimey).
      if (/\b[a-z]+ly\s+$/i.test(before)) continue;

      // Skip if part of a multi-adjective list ("warm and dark", "warm, round, vintage").
      // Look at the next ~30 chars for an adjective list pattern.
      const listPattern = new RegExp(
        `^${word}[,\\s]+(and\\s+)?(dark|bright|round|chimey|scooped|aggressive|tight|loose|sparkly|smooth|gritty|crunchy|articulate|punchy|spongy|airy|present|focused|saturated|compressed|vintage|modern|fender-?like|marshall-?like|vox-?like)\\b`,
        "i",
      );
      if (listPattern.test(after)) continue;

      // Skip if it's clearly a comparison ("more transparent", "less rich").
      if (/\b(more|less|too|very|extremely)\s+$/i.test(before)) continue;

      const window = body.slice(start, start + 100);
      const qualified = QUALIFIER_SIGNALS.some((q) => q.test(window));
      if (!qualified) {
        const context = body
          .slice(Math.max(0, start - 25), start + 60)
          .replace(/\s+/g, " ");
        findings.push({
          rule: "gate-6-unqualified-tone-word",
          detail: `"${word}" without qualifier — …${context}…`,
        });
      }
    }
  }

  // Gate 2: explicit cross-writer disagreements.
  for (const pat of CROSS_WRITER_PATTERNS) {
    const m = body.match(pat);
    if (m) {
      findings.push({
        rule: "gate-2-explicit-cross-writer",
        detail: `Matched: "${m[0]}"`,
      });
    }
  }

  // Gate 2: self-reference density.
  let selfRefCount = 0;
  for (const pat of SELF_REFERENCE_PATTERNS) {
    selfRefCount += (body.match(new RegExp(pat.source, pat.flags + "g")) ?? []).length;
  }
  // Threshold: 0-2 per article (the standard). Flag >2.
  if (selfRefCount > 2) {
    findings.push({
      rule: "gate-2-self-reference-density",
      detail: `${selfRefCount} self-reference patterns (target 0-2)`,
    });
  }

  // Gate 2: signature-phrase overuse for this writer's signature phrases.
  if (authorSlug) {
    const sig = sigs.find((s) => s.slug === authorSlug);
    if (sig) {
      for (const phrase of sig.signaturePhrases) {
        const re = new RegExp(escapeRegex(phrase), "gi");
        const count = (body.match(re) ?? []).length;
        if (count > 1) {
          findings.push({
            rule: "gate-2-signature-phrase-overuse",
            detail: `"${phrase}" appears ${count}× (max 1 per article)`,
          });
        }
      }
    }
  }

  return findings;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface PostAudit {
  slug: string;
  authorSlug: string;
  findings: Finding[];
}

function main() {
  const sigs = loadSignaturePhrases();
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const audits: PostAudit[] = [];
  for (const f of files) {
    const filePath = path.join(BLOG_DIR, f);
    const raw = fs.readFileSync(filePath, "utf-8");
    const fm = matter(raw);
    const body = fm.content;
    const authorSlug = (fm.data.author_slug as string | undefined) ?? "";
    const findings = auditPost(body, sigs, authorSlug);
    if (findings.length > 0) {
      audits.push({
        slug: f.replace(/\.mdx$/, ""),
        authorSlug,
        findings,
      });
    }
  }

  if (JSON_MODE) {
    console.log(JSON.stringify(audits, null, 2));
    return;
  }

  // Group by rule for the summary header.
  const byRule = new Map<string, number>();
  for (const a of audits) {
    for (const f of a.findings) {
      byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
    }
  }

  let md = `# Blog Voice Audit\n\n`;
  md += `**Generated:** ${new Date().toISOString().slice(0, 10)}\n`;
  md += `**Posts audited:** ${files.length}\n`;
  md += `**Posts with findings:** ${audits.length}\n\n`;
  md += `## Findings by rule\n\n`;
  md += `| Rule | Count |\n|---|---|\n`;
  for (const [rule, count] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) {
    md += `| \`${rule}\` | ${count} |\n`;
  }
  md += `\n## Per-post findings\n\n`;
  for (const a of audits) {
    md += `### ${a.slug} _(${a.authorSlug || "—"})_\n\n`;
    for (const f of a.findings) {
      md += `- **${f.rule}** — ${f.detail}\n`;
    }
    md += `\n`;
  }
  if (audits.length === 0) {
    md += `No findings — every post passes the audit.\n`;
  }

  fs.writeFileSync(OUT, md);

  const totalFindings = [...byRule.values()].reduce((a, b) => a + b, 0);
  console.log(`Audited ${files.length} posts.`);
  console.log(`Posts with findings: ${audits.length} / ${files.length}`);
  console.log(`Total findings: ${totalFindings}`);
  console.log(`Report: ${OUT}`);
}

main();
