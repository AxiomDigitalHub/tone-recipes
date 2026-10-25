/**
 * Deterministic gate — Sasha's spec (02-social-manager.md §c) + 04 must-fixes.
 * Blocking: D0–D7, C1 (stranger), C2 (≠ none, Sasha #3), C5 (honest). Advisory: C3, C4.
 * A non-independent critic forces requiresApproval for the slot (Mara #3).
 */
import { composeCaption, composeSlides } from "./render/compose";
import { keyMentions, numberTokens, tokenLicensed, type NumToken } from "./tokens";
import type { Check, Copy, Critic, Fact, FactSheet, GateReport, LedgerRow, SlideSpec, TextItem } from "./types";

export const BANNED_PATTERNS: RegExp[] = [
  /here'?s (what|why|how)/i,
  /here (is|are) the/i,
  /you won'?t believe/i,
  /the answer (might|will) surprise/i,
  /game.?changer/i,
  /next level/i,
  /\bunlock/i,
  /\belevate/i,
  /\bdelve/i,
  /\bseamless/i,
  /\blush\b/i,
  /\bmagic/i,
  /whether you'?re/i,
  /when it comes to/i,
  /not just .* it'?s/i,
  /\bI\b.*\b(tested|own|owned|tried)\b/,
  /\bwe tested\b/i,
  /in my experience/i,
  /players (love|swear)/i,
];
/** Escalator test: slide1_headline + caption_line1 only. */
export const ESCALATOR_PATTERNS: RegExp[] = [/tone recipe/i, /\bpresets?\b/i, /\bsnapshots?\b/i, /signal chain/i, /\bIRs?\b/, /\bDSP\b/i, /\bblocks?\b/i];

const EMOJI_RE = /\p{Extended_Pictographic}/gu;

function words(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
}
function trigrams(s: string): Set<string> {
  const w = words(s);
  const out = new Set<string>();
  for (let i = 0; i + 2 < w.length; i++) out.add(w.slice(i, i + 3).join(" "));
  return out;
}
export function jaccard(a: string, b: string): number {
  const A = trigrams(a);
  const B = trigrams(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

function llmFields(copy: Copy): { name: string; text: string }[] {
  return [
    { name: "slide1_headline", text: copy.slide1_headline ?? "" },
    { name: "caption_line1", text: copy.caption_line1 ?? "" },
    { name: "caption_body", text: copy.caption_body ?? "" },
    ...(copy.block_notes ?? []).map((n, i) => ({ name: `block_notes[${i}]`, text: n.line ?? "" })),
  ];
}

function factTokens(f: Fact): NumToken[] {
  return numberTokens(f.display);
}

// ── D0 schema ───────────────────────────────────────────────────────────────
export function checkSchema(fs: FactSheet, copy: Copy, critic: Critic | null): Check {
  const errs: string[] = [];
  const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;
  if (copy?.schema !== "fk.copy.v1") errs.push("copy.schema");
  if (copy?.slotId !== fs.slotId) errs.push("copy.slotId mismatch");
  if (copy?.hook_style !== fs.hookStyle) errs.push(`hook_style must be ${fs.hookStyle}`);
  for (const k of ["slide1_headline", "caption_line1", "caption_body"] as const) if (!str(copy?.[k])) errs.push(`${k} missing`);
  if (!Array.isArray(copy?.slide1_fact_ids)) errs.push("slide1_fact_ids not array");
  if (!Array.isArray(copy?.cited_facts)) errs.push("cited_facts not array");
  if (copy?.block_notes !== undefined && !Array.isArray(copy.block_notes)) errs.push("block_notes not array");
  if (critic) {
    if (critic.schema !== "fk.critic.v1") errs.push("critic.schema");
    if (critic.slotId !== fs.slotId) errs.push("critic.slotId mismatch");
    if (typeof critic.independent !== "boolean") errs.push("critic.independent must be boolean");
  } else errs.push("critic.json missing");
  return { id: "D0", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D1 number + key fidelity ────────────────────────────────────────────────
export function checkNumbers(fs: FactSheet, copy: Copy): Check {
  const errs: string[] = [];
  const facts = new Map(fs.facts.map((f) => [f.id, f]));
  const cited: Fact[] = [];
  for (const c of copy.cited_facts ?? []) {
    const f = facts.get(c.fact_id);
    if (!f) errs.push(`cited fact ${c.fact_id} does not exist`);
    else cited.push(f);
  }
  const ids = copy.slide1_fact_ids ?? [];
  if (ids.length < 1 || ids.length > 3) errs.push("slide1_fact_ids must have 1–3 ids");
  for (const id of ids) {
    const f = facts.get(id);
    if (!f) errs.push(`slide1 fact ${id} does not exist`);
    else if (!f.numbers.length && f.kind !== "key") errs.push(`slide1 fact ${id} has no number`);
  }
  const licensed = cited.flatMap(factTokens);
  const citedKeys = new Set(cited.filter((f) => f.kind === "key").map((f) => String(f.value)));
  for (const { name, text } of llmFields(copy)) {
    for (const tok of numberTokens(text)) {
      if (!tokenLicensed(tok, licensed)) errs.push(`${name}: "${tok.raw.trim()}" is not a cited fact`);
    }
    for (const k of keyMentions(text)) {
      if (!citedKeys.has(k)) errs.push(`${name}: key "${k}" is not a cited key fact`);
    }
  }
  return { id: "D1", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D1b rendered fidelity (covers template text too, Mara #4) ───────────────
export function verifyRendered(fs: FactSheet, slides: SlideSpec[], caption: string): Check {
  const errs: string[] = [];
  const facts = new Map(fs.facts.map((f) => [f.id, f]));
  const all = fs.facts.flatMap(factTokens);
  const items: { where: string; item: TextItem }[] = [];
  for (const s of slides) {
    const w = `slide ${s.index}`;
    if (s.kicker) items.push({ where: w, item: s.kicker });
    items.push({ where: w, item: s.title });
    s.lines.forEach((l) => items.push({ where: w, item: l }));
    s.footer.forEach((l) => items.push({ where: w, item: l }));
    for (const g of s.groups ?? []) {
      items.push({ where: w, item: g.title });
      if (g.subtitle) items.push({ where: w, item: g.subtitle });
      if (g.note) items.push({ where: w, item: g.note });
      for (const c of g.cells) {
        const f = facts.get(c.factId);
        if (!f || f.display !== c.value) errs.push(`${w}: cell ${c.label}="${c.value}" ≠ fact ${c.factId}`);
        // A label that IS the fact's source parameter name ("125Hz" on an EQ band) is data, not template text.
        if (f?.label !== c.label) items.push({ where: w, item: { text: c.label } });
      }
    }
    if (s.table) [...s.table.header, ...s.table.rows.flatMap((r) => r.cells), ...s.table.notes].forEach((i) => items.push({ where: w, item: i }));
    for (const g of s.groups ?? []) if (g.tag) items.push({ where: w, item: g.tag });
    (s.eyebrow ?? []).forEach((i) => items.push({ where: w, item: i }));
    if (s.chain) {
      s.chain.meta.forEach((i) => items.push({ where: w, item: i }));
      if (s.chain.guitar) [s.chain.guitar.name, ...s.chain.guitar.specs.flatMap((x) => [x.label, x.value])].forEach((i) => items.push({ where: w, item: i }));
      for (const n of s.chain.nodes) [n.kind, n.name, ...(n.gear ? [n.gear] : [])].forEach((i) => items.push({ where: w, item: i }));
    }
  }
  for (const { where, item } of items) {
    if (item.structural) continue;
    if (item.factId) {
      const f = facts.get(item.factId);
      if (!f || !item.text.includes(f.display)) {
        errs.push(`${where}: "${item.text}" ≠ fact ${item.factId}`);
        continue;
      }
      // Anything around the fact (a label) is still number-checked.
      for (const tok of numberTokens(item.text.replace(f.display, " "))) if (!tokenLicensed(tok, all)) errs.push(`${where}: "${item.text}" has unlicensed "${tok.raw.trim()}"`);
      continue;
    }
    for (const tok of numberTokens(item.text)) if (!tokenLicensed(tok, all)) errs.push(`${where}: template text "${item.text}" has unlicensed "${tok.raw.trim()}"`);
  }
  // Caption: every number must be licensed by SOME fact (LLM lines were already held to cited facts in D1).
  for (const tok of numberTokens(caption.replace(/#\S+/g, ""))) if (!tokenLicensed(tok, all)) errs.push(`caption: unlicensed "${tok.raw.trim()}"`);
  return { id: "D1b", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D2 banned patterns ──────────────────────────────────────────────────────
export function checkBanned(fs: FactSheet, copy: Copy): Check {
  const errs: string[] = [];
  for (const { name, text } of llmFields(copy)) {
    for (const re of BANNED_PATTERNS) if (re.test(text)) errs.push(`${name}: banned /${re.source}/`);
    for (const n of fs.attribution.bannedNames) {
      if (n && new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) errs.push(`${name}: banned name "${n}"`);
    }
  }
  for (const name of ["slide1_headline", "caption_line1"] as const) {
    const text = copy[name] ?? "";
    for (const re of ESCALATOR_PATTERNS) if (re.test(text)) errs.push(`${name}: escalator-test word /${re.source}/`);
    if (name === "caption_line1" && /^\s*link in bio/i.test(text)) errs.push("caption_line1 starts with link in bio");
  }
  return { id: "D2", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D3 lengths ──────────────────────────────────────────────────────────────
export function checkLengths(copy: Copy, caption: string): Check {
  const errs: string[] = [];
  if (words(copy.slide1_headline).length > 12) errs.push("slide1_headline > 12 words");
  if ((copy.caption_line1 ?? "").length > 110) errs.push("caption_line1 > 110 chars");
  if (words(copy.caption_body).length > 60) errs.push("caption_body > 60 words");
  (copy.block_notes ?? []).forEach((n, i) => {
    if (words(n.line).length > 14) errs.push(`block_notes[${i}] > 14 words`);
  });
  if (caption.length > 2200) errs.push("caption > 2200 chars");
  return { id: "D3", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D4 novelty ──────────────────────────────────────────────────────────────
export function checkNovelty(fs: FactSheet, copy: Copy): Check {
  const errs: string[] = [];
  const first5 = words(copy.slide1_headline).slice(0, 5).join(" ");
  for (const h of fs.recentHooks.slice(0, 10)) if (words(h).slice(0, 5).join(" ") === first5) errs.push(`hook opens like recent hook "${h}"`);
  for (const l of fs.recentLine1s.slice(0, 10)) {
    const j = jaccard(copy.caption_line1, l);
    if (j >= 0.5) errs.push(`caption_line1 trigram Jaccard ${j.toFixed(2)} vs "${l}"`);
  }
  return { id: "D4", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D5 hygiene ──────────────────────────────────────────────────────────────
export function checkHygiene(fs: FactSheet, copy: Copy): Check {
  const errs: string[] = [];
  let emoji = 0;
  for (const { name, text } of llmFields(copy)) {
    if (/#\w/.test(text)) errs.push(`${name}: hashtag`);
    if (/https?:|www\.|\.com\b/i.test(text)) errs.push(`${name}: URL`);
    emoji += (text.match(EMOJI_RE) ?? []).length;
  }
  if (emoji > 1) errs.push(`${emoji} emoji (max 1)`);
  if (fs.hashtags.length > 5) errs.push("more than 5 hashtags");
  return { id: "D5", pass: errs.length === 0, detail: errs.join("; ") || undefined };
}

// ── D6 attribution ──────────────────────────────────────────────────────────
export function checkAttribution(fs: FactSheet, slides: SlideSpec[], caption: string): Check {
  if (fs.attribution.confidence === "documented") return { id: "D6", pass: true };
  // Data strings (real-gear names, guitar notes) reach the slides too: no undocumented player name anywhere.
  const rendered = JSON.stringify(slides, (k, v) => (k === "iconSvg" ? undefined : v));
  const leaked = fs.attribution.bannedNames.filter((n) => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(rendered));
  if (leaked.length) return { id: "D6", pass: false, detail: `undocumented player named on a slide: ${leaked.join(", ")}` };
  if (!fs.attribution.line) return { id: "D6", pass: true };
  const line = fs.attribution.line;
  const close = slides[slides.length - 1];
  const onClose = close?.lines.some((l) => l.text.includes(line));
  const ok = caption.includes(line) && onClose;
  return { id: "D6", pass: !!ok, detail: ok ? undefined : "attribution line missing from caption or closing slide" };
}

// ── D7 source policy ────────────────────────────────────────────────────────
export function checkSource(fs: FactSheet, fixItAllowlist: string[], excluded?: string): Check {
  if (excluded) return { id: "D7", pass: false, detail: `source excluded: ${excluded}` };
  if (fs.format === "fix_it" && !fixItAllowlist.includes(fs.source.slug)) return { id: "D7", pass: false, detail: "fix_it source not in allowlist" };
  return { id: "D7", pass: true };
}

export function runGate(
  fs: FactSheet,
  copy: Copy,
  critic: Critic | null,
  _ledger: LedgerRow[],
  opts: { fixItAllowlist: string[]; excluded?: string },
): GateReport {
  const blocking: Check[] = [];
  const advisory: Check[] = [];
  const d0 = checkSchema(fs, copy, critic);
  blocking.push(d0);
  if (copy && Array.isArray(copy.cited_facts) && Array.isArray(copy.slide1_fact_ids)) {
    const slides = composeSlides(fs, copy);
    const caption = composeCaption(fs, copy);
    blocking.push(
      checkNumbers(fs, copy),
      verifyRendered(fs, slides, caption),
      checkBanned(fs, copy),
      checkLengths(copy, caption),
      checkNovelty(fs, copy),
      checkHygiene(fs, copy),
      checkAttribution(fs, slides, caption),
      checkSource(fs, opts.fixItAllowlist, opts.excluded),
    );
  }
  if (critic && critic.schema === "fk.critic.v1") {
    blocking.push({ id: "C1", pass: critic.C1_stranger === 1, detail: critic.C1_stranger === 1 ? undefined : critic.reasons.join("; ") });
    blocking.push({ id: "C2", pass: critic.C2_question !== "none", detail: critic.C2_question === "none" ? "answers no visitor question" : critic.C2_question });
    blocking.push({ id: "C5", pass: critic.C5_honest === 1, detail: critic.C5_honest === 1 ? undefined : critic.reasons.join("; ") });
    advisory.push({ id: "C3", pass: critic.C3_specific === 1 });
    advisory.push({ id: "C4", pass: critic.C4_hook_style_match === 1 });
  }
  return {
    schema: "fk.gate.v1",
    slotId: fs.slotId,
    pass: blocking.every((c) => c.pass),
    forceApproval: !critic || critic.independent !== true,
    blocking,
    advisory,
  };
}
