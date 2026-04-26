import GithubSlugger from "github-slugger";

/**
 * Table of Contents extractor — pulls h2/h3 headings out of a raw MDX
 * string and slugifies them with the same algorithm rehype-slug uses
 * (github-slugger). That guarantees the ToC's anchor hrefs match the
 * `id=""` attributes rehype-slug writes onto the rendered headings.
 *
 * We deliberately skip headings inside fenced code blocks — a ``` line
 * with a `## ` comment inside the block would otherwise pollute the
 * ToC. The fenced-code tracker is a simple boolean toggle since MDX
 * code fences are always 3 backticks on a line of their own.
 */

export interface TocEntry {
  level: 2 | 3;
  text: string;
  slug: string;
}

export function extractToc(mdx: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  const lines = mdx.split("\n");
  let inFence = false;

  for (const raw of lines) {
    const line = raw.trimStart();

    // Track ``` fences — anything between them is code, not prose.
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length === 2 ? 2 : 3;
    // Strip inline markdown — bold, italic, inline code, links — so the
    // ToC label reads cleanly. github-slugger handles the id itself,
    // but the display text should be the reader's version.
    const text = m[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    entries.push({
      level,
      text,
      slug: slugger.slug(text),
    });
  }

  return entries;
}
