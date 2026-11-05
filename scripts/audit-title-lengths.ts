/**
 * Reports news and gear pages whose rendered <title> exceeds 70 characters
 * (Bing Webmaster's "Title too long"). Mirrors the generateMetadata logic in
 * src/app/news/[slug]/page.tsx and src/app/gear/[slug]/page.tsx.
 *
 * Fix a news hit by adding `seo_title:` (≤55 chars) to its frontmatter.
 *
 *   npx tsx scripts/audit-title-lengths.ts
 */
import { getAllNewsPosts } from "../src/lib/news";
import { gearItems } from "../src/lib/data";
import { fitTitle, firstClause, MAX_TITLE_LENGTH } from "../src/lib/seo-title";

function rendered(t: ReturnType<typeof fitTitle>): string {
  if (typeof t === "string") return `${t} | Fader & Knob`;
  if (t && typeof t === "object" && "absolute" in t) return t.absolute;
  return "";
}

const hits: string[] = [];
for (const p of getAllNewsPosts()) {
  const t = rendered(fitTitle([p.seo_title, p.title, firstClause(p.title)]));
  if (t.length > MAX_TITLE_LENGTH) hits.push(`${t.length}\t/news/${p.slug}\t${t}`);
}
for (const g of gearItems) {
  const t = rendered(
    fitTitle([`${g.name} — Recipes & modeler equivalents`, `${g.name} — Modeler equivalents`, g.name]),
  );
  if (t.length > MAX_TITLE_LENGTH) hits.push(`${t.length}\t/gear/${g.slug}\t${t}`);
}

if (hits.length) {
  console.log(`${hits.length} title(s) over ${MAX_TITLE_LENGTH} characters:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log(`All news and gear titles are ≤${MAX_TITLE_LENGTH} characters.`);
