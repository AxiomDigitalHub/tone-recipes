/**
 * Text helpers for metadata and listings (redesign SEO pass).
 *
 * Front matter descriptions and news excerpts were written long (blog
 * median 180 characters, news median 409). Search results cut a
 * description at roughly 155 to 160, mid-sentence. These trim at a
 * sentence or word boundary instead, so nothing ends in a broken clause.
 */

/** Whole sentences up to `max` characters; else a clean cut at a word. */
export function clampText(text: string, max: number): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  // Lazy match so a decimal ("1.2 kg") or "v2.0" does not end a sentence.
  const sentences = t.match(/.+?[.!?]+(?=\s|$)\s*/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  if (out.length >= max * 0.5) return out;
  const cut = t.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[,;:—-]+$/, "").trim() + "…";
}

/** A meta description: at most 155 characters. */
export const metaDescription = (text: string) => clampText(text, 155);
