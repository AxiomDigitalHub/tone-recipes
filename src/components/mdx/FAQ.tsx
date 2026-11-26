import React from "react";

/**
 * <FAQ> — renders an FAQ block AND emits FAQPage JSON-LD.
 *
 * ⚠️ PREFER FRONTMATTER `faq:` FOR NEW POSTS (added 2026-05-10).
 *
 * The page route at `src/app/blog/[slug]/page.tsx` reads `faq:` from
 * frontmatter, renders the on-page FAQ block, AND emits FAQPage JSON-LD.
 * That's the single-source-of-truth path. The Zod schema in
 * `src/lib/blog.schema.ts` validates the contract.
 *
 * The MDX preflight (`scripts/validate-mdx.mts`) treats the combination of
 * `faq:` frontmatter AND `<FAQ>` body as a warning — it would emit FAQPage
 * JSON-LD twice. Pick one.
 *
 * This component remains for:
 *   - The 90+ historical posts that already use it (no need to migrate
 *     all of them in one commit).
 *   - Edge cases where the FAQ answer needs JSX (links, code blocks,
 *     embedded images) that frontmatter strings can't express.
 *
 * For everything else: put the FAQ in frontmatter. It's queryable, it's
 * lintable, and it doesn't require body-level escaping for inch marks
 * or `<` characters.
 *
 * Why this component existed: per the Phase 4 content audit (2026-04-17),
 * 7 of 12 audited posts had FAQ blocks in the rendered prose but zero
 * posts emitted FAQPage JSON-LD. This component closed that gap before
 * the frontmatter pathway was wired up.
 *
 * Legacy usage in MDX (still supported):
 *
 *   <FAQ
 *     questions={[
 *       {
 *         q: "Does humbucker size matter for tone?",
 *         a: "No. The magnet, coil winding, and output impedance dominate."
 *       }
 *     ]}
 *   />
 */

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQProps {
  /** Plain-data questions. Simpler; recommended for most uses. */
  questions?: FAQItem[];
  /** Alternative: render JSX children as the visible FAQ. You must still pass
   *  `questions` for the schema to emit. */
  children?: React.ReactNode;
  /** Optional section title. Defaults to "Questions". */
  title?: string;
}

export default function FAQ({
  questions,
  children,
  title = "Questions",
}: FAQProps) {
  // Defensive: MDX can pass a non-array if the JSX prop serialization hits
  // an edge case during RSC rendering. Filter to valid {q, a} items.
  const safeQuestions: FAQItem[] = Array.isArray(questions)
    ? questions.filter(
        (item): item is FAQItem =>
          !!item && typeof item.q === "string" && typeof item.a === "string",
      )
    : [];

  if (safeQuestions.length === 0) {
    // If the author forgot to pass structured data, render children as-is
    // with no schema. Better to render nothing special than to emit broken
    // JSON-LD.
    return <>{children}</>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: safeQuestions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section
      className="fk-mdx-faq"
      aria-labelledby="faq-heading"
    >
      {/* Structured data — invisible to readers, visible to Google / AI */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 id="faq-heading" className="fk-mdx-faq-title">
        {title}
      </h2>

      {children ? (
        // If the author passes rich children, use those — the schema still
        // reflects `questions`. Useful for rendered examples, links, etc.
        <div className="fk-mdx-faq-rich">{children}</div>
      ) : (
        <dl className="fk-mdx-faq-list">
          {safeQuestions.map((item) => (
            <div key={item.q}>
              <dt>{item.q}</dt>
              <dd className="whitespace-pre-line">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
