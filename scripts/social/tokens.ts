/**
 * Number and musical-key tokenizers shared by the fact sheet and the gate.
 *
 * Must-fix (Sasha #2): handle the Unicode minus. "Threshold −32" must match a
 * fact displayed as "-32 dB". A sign is only captured when it is not glued to
 * a preceding digit, so the range "3-4" yields 3 and 4, not 3 and -4.
 */

// sign? digits (decimal or thousands) optional-unit. Unit must not run into a word ("5 knobs" ≠ "5k").
const NUM_RE =
  /(?<![\d.,])([-−]?)(\d+(?:[.,]\d+)*)(?:\s?(khz|ms|hz|db|bpm|k)(?![a-z])|(%))?/gi;

export interface NumToken {
  raw: string;
  /** Canonical: "-32", "549", "6.8", "5500" (thousands separators removed). */
  num: string;
  unit: string; // "", "ms", "hz", "khz", "db", "bpm", "k", "%"
  /** num + unit, e.g. "549ms", "6.8k", "-32db" */
  norm: string;
}

function canonNumber(sign: string, digits: string): string {
  let d = digits;
  // "5,500" / "45,000" → thousands; "5,5" → decimal comma
  if (/^\d{1,3}(,\d{3})+$/.test(d)) d = d.replace(/,/g, "");
  else d = d.replace(",", ".");
  if (d.includes(".")) d = d.replace(/0+$/, "").replace(/\.$/, "");
  d = d.replace(/^0+(?=\d)/, "");
  const s = sign ? "-" : "";
  return d === "0" ? "0" : s + d;
}

export function numberTokens(text: string): NumToken[] {
  const out: NumToken[] = [];
  for (const m of text.normalize("NFKC").matchAll(NUM_RE)) {
    const num = canonNumber(m[1], m[2]);
    const unit = (m[3] ?? m[4] ?? "").toLowerCase();
    out.push({ raw: m[0], num, unit, norm: num + unit });
  }
  return out;
}

/**
 * A token is licensed if a fact token has the same number and the same unit,
 * or the token carries no unit. Adding a unit the fact doesn't have ("5500" →
 * "5500 ms") is NOT licensed.
 */
export function tokenLicensed(tok: NumToken, licensed: NumToken[]): boolean {
  return licensed.some((l) => l.num === tok.num && (tok.unit === "" || tok.unit === l.unit));
}

/**
 * Musical keys. Sasha's rule: any "key of X" / "in X" in LLM text must equal a
 * cited key fact. The note letter is matched CASE-SENSITIVELY (only the "key of"
 * words are case-insensitive): with /i, "in a small room" would parse as key "a".
 */
const KEY_RE = /\b(?:[Kk]ey of|in) ([A-G](?:b|#|♭|♯)?m?)(?![\w'’])/g;

export function canonKey(k: string): string {
  return k.replace("♭", "b").replace("♯", "#");
}

export function keyMentions(text: string): string[] {
  return [...text.matchAll(KEY_RE)].map((m) => canonKey(m[1]));
}

/** Extraction from source prose (Sasha #1). Never inferred. */
export const SOURCE_KEY_RE = /\bKey of ([A-G][b#]?m?)\b/g;
export const SOURCE_BPM_RE = /\b(\d{2,3}) BPM\b/g;
