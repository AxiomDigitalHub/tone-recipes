/**
 * One-shot: reorder the settings keys on every `block_category: "Amp Type"`
 * block in src/lib/data/index.ts to match the real Katana front-panel
 * order: Gain → Volume → Bass → Middle → Treble → Presence → Master.
 *
 * The print page renders knobs in `Object.entries()` order (insertion-
 * preserving since ES2015), so the source-file order IS the rendered
 * order. Daniel 2026-05-06: "the boss katana amp knobs are out of
 * order to the device."
 *
 * Run once: `npx tsx scripts/reorder-katana-amp-knobs.ts`. Idempotent
 * — running it twice on already-reordered data is a no-op. Delete this
 * script after the data has migrated.
 *
 * Strictness: the script ONLY rewrites settings inside an "Amp Type"
 * block and ONLY when every key it sees is already in the canonical
 * set. If a block has unknown keys it leaves it alone (no silent loss).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const KATANA_AMP_ORDER = [
  "Gain",
  "Volume",
  "Bass",
  "Middle",
  "Treble",
  "Presence",
  "Master",
];

const KNOWN_KEYS = new Set(KATANA_AMP_ORDER);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, "..", "src", "lib", "data", "index.ts");

const src = readFileSync(dataPath, "utf8");
const lines = src.split("\n");

let blocksFound = 0;
let blocksRewritten = 0;
let blocksSkipped = 0;

for (let i = 0; i < lines.length; i++) {
  if (!lines[i].includes('block_category: "Amp Type"')) continue;
  blocksFound += 1;

  // Find the `settings: {` line inside this block (within ~6 lines).
  let settingsStart = -1;
  for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
    if (lines[j].match(/^\s*settings:\s*\{/)) {
      settingsStart = j;
      break;
    }
  }
  if (settingsStart < 0) {
    blocksSkipped += 1;
    continue;
  }

  // Single-line settings? `settings: { Gain: 8, ... },`
  const singleLineMatch = lines[settingsStart].match(
    /^(\s*)settings:\s*\{\s*(.+?)\s*\}\s*,?\s*$/,
  );
  if (singleLineMatch) {
    const indent = singleLineMatch[1];
    const inner = singleLineMatch[2];
    // Parse "Key: value" pairs, comma-separated.
    const pairs = parseInline(inner);
    if (!pairs) {
      blocksSkipped += 1;
      continue;
    }
    if (!allKnown(pairs)) {
      blocksSkipped += 1;
      continue;
    }
    const reordered = reorderPairs(pairs);
    if (sameOrder(pairs, reordered)) continue; // already canonical
    const innerOut = reordered.map(([k, v]) => `${k}: ${v}`).join(", ");
    lines[settingsStart] = `${indent}settings: { ${innerOut} },`;
    blocksRewritten += 1;
    continue;
  }

  // Multi-line settings: each key on its own line until `}`.
  let settingsEnd = -1;
  for (let j = settingsStart + 1; j < Math.min(settingsStart + 30, lines.length); j++) {
    if (lines[j].match(/^\s*\}\s*,?\s*$/)) {
      settingsEnd = j;
      break;
    }
  }
  if (settingsEnd < 0) {
    blocksSkipped += 1;
    continue;
  }

  const keyLines = lines.slice(settingsStart + 1, settingsEnd);
  const parsed: Array<{ key: string; line: string }> = [];
  let bail = false;
  for (const ln of keyLines) {
    const m = ln.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*.+,?\s*$/);
    if (!m) {
      bail = true;
      break;
    }
    parsed.push({ key: m[1], line: ln });
  }
  if (bail) {
    blocksSkipped += 1;
    continue;
  }
  if (!parsed.every((p) => KNOWN_KEYS.has(p.key))) {
    blocksSkipped += 1;
    continue;
  }

  const present = new Set(parsed.map((p) => p.key));
  const reordered = KATANA_AMP_ORDER.filter((k) => present.has(k)).map(
    (k) => parsed.find((p) => p.key === k)!.line,
  );

  // Already in canonical order? Skip.
  if (
    reordered.length === parsed.length &&
    reordered.every((ln, idx) => ln === parsed[idx].line)
  ) {
    continue;
  }

  // Splice the reordered lines back in.
  lines.splice(settingsStart + 1, parsed.length, ...reordered);
  blocksRewritten += 1;
}

writeFileSync(dataPath, lines.join("\n"), "utf8");

console.log(`Katana amp blocks found:     ${blocksFound}`);
console.log(`Reordered to canonical:      ${blocksRewritten}`);
console.log(`Skipped (already / unknown): ${blocksFound - blocksRewritten}`);
if (blocksSkipped > 0) {
  console.log(`  (of which ${blocksSkipped} had unknown keys or unparseable structure)`);
}

// -----------------------------------------------------------------------------
//  helpers
// -----------------------------------------------------------------------------

function parseInline(inner: string): Array<[string, string]> | null {
  // Split on commas at depth-0. The values are simple (numbers, strings,
  // bools) so this is safe.
  const out: Array<[string, string]> = [];
  let depth = 0;
  let inStr: string | null = null;
  let buf = "";
  for (const ch of inner + ",") {
    if (inStr) {
      if (ch === inStr) inStr = null;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      buf += ch;
      continue;
    }
    if (ch === "{" || ch === "[") depth += 1;
    if (ch === "}" || ch === "]") depth -= 1;
    if (ch === "," && depth === 0) {
      const piece = buf.trim();
      if (!piece) {
        buf = "";
        continue;
      }
      const m = piece.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+)$/);
      if (!m) return null;
      out.push([m[1], m[2].trim()]);
      buf = "";
      continue;
    }
    buf += ch;
  }
  return out;
}

function allKnown(pairs: Array<[string, string]>): boolean {
  return pairs.every(([k]) => KNOWN_KEYS.has(k));
}

function reorderPairs(
  pairs: Array<[string, string]>,
): Array<[string, string]> {
  const map = new Map(pairs);
  const out: Array<[string, string]> = [];
  for (const k of KATANA_AMP_ORDER) {
    const v = map.get(k);
    if (v !== undefined) out.push([k, v]);
  }
  return out;
}

function sameOrder(
  a: Array<[string, string]>,
  b: Array<[string, string]>,
): boolean {
  if (a.length !== b.length) return false;
  return a.every((pair, i) => pair[0] === b[i][0]);
}
