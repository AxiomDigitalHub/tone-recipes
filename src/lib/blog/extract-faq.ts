/**
 * extractFAQFromMarkdown — scan MDX/Markdown post content and pull Q/A pairs
 * out of the conventional FAQ section.
 *
 * Purpose: emit FAQPage JSON-LD for every blog post that already has an
 * "## FAQ" section written in prose, without touching the post body. Closes
 * the 2026-04 Phase 4 audit finding that ~20 posts have FAQ content but
 * zero structured data.
 *
 * Recognized formats:
 *
 *   ## FAQ                                            (or Frequently Asked Questions)
 *
 *   **Question text?**
 *   Answer paragraph possibly spanning multiple lines, ends at blank line.
 *
 *   **Q: Another question?**
 *   A: Another answer.
 *
 *   ### Another question?
 *   Answer under H3.
 *
 * Returns an empty array for posts without an FAQ section — safe to always
 * call and conditionally emit JSON-LD only when the array is non-empty.
 */

export interface FAQItem {
  q: string;
  a: string;
}

export function extractFAQFromMarkdown(content: string): FAQItem[] {
  if (!content) return [];

  // Find the FAQ heading — multiline so ^ matches line start, but we only
  // use this to locate the heading. The section body slice comes from
  // indexOf math below so the multiline $ ambiguity doesn't interfere.
  const headingRegex =
    /^##\s+(FAQ|Frequently Asked Questions|Common Questions)[^\n]*$/im;
  const headingMatch = headingRegex.exec(content);
  if (!headingMatch) return [];

  const afterHeading =
    headingMatch.index + headingMatch[0].length;
  // End of FAQ section = next "## " at line start, or end of content.
  const remainder = content.slice(afterHeading);
  const nextH2 = remainder.search(/\n##\s/);
  const section = nextH2 === -1 ? remainder : remainder.slice(0, nextH2);

  // Walk line-by-line. A question is a line that starts and ends with `**`
  // and ends with `?`. The answer is every non-empty line after that until
  // the next question line, the next heading, or an MDX component tag like
  // <SaveThisTone />.
  const lines = section.split("\n");
  const items: FAQItem[] = [];

  let currentQ: string | null = null;
  let currentA: string[] = [];

  const flush = () => {
    if (currentQ && currentA.length > 0) {
      const a = stripMarkdown(
        currentA.join(" ").replace(/^A[:.]?\s*/i, "").trim(),
      );
      if (a) items.push({ q: currentQ, a });
    }
    currentQ = null;
    currentA = [];
  };

  const boldQuestionRegex = /^\*\*(?:Q[:.]?\s*)?([^*\n]+?\?)\s*\*\*\s*$/;
  const h3QuestionRegex = /^###\s+(.+?\?)\s*$/;

  for (const raw of lines) {
    const line = raw.trim();
    // Skip blank lines — they separate Q/A pairs but don't start/end either.
    if (line === "") continue;

    // MDX component tags or new section break the FAQ processing.
    if (line.startsWith("<") || /^##\s/.test(line)) {
      flush();
      currentQ = null;
      // An MDX tag inside the FAQ section (e.g. <SaveThisTone />) ends
      // the FAQ even without a ##. Stop parsing.
      break;
    }

    const boldMatch = boldQuestionRegex.exec(line);
    const h3Match = h3QuestionRegex.exec(line);

    if (boldMatch) {
      flush();
      currentQ = boldMatch[1].trim();
      continue;
    }
    if (h3Match) {
      flush();
      currentQ = h3Match[1].replace(/\*\*/g, "").replace(/`/g, "").trim();
      continue;
    }

    // Otherwise it's part of the current answer (if we have a question open).
    if (currentQ) {
      currentA.push(line);
    }
  }
  flush();

  return items;
}

function stripMarkdown(text: string): string {
  return text
    // Links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Bold / italic: **text** → text, *text* → text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    // Inline code: `text` → text
    .replace(/`([^`]+)`/g, "$1")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/** Build the FAQPage JSON-LD string for a set of Q/A items. Returns null if
 *  the items array is empty (caller skips emitting a <script> tag). */
export function buildFAQSchema(items: FAQItem[]): string | null {
  if (items.length === 0) return null;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  });
}
