import React from "react";

/**
 * <FAQ> — renders an FAQ block with accordion-style rendering AND emits
 * FAQPage JSON-LD structured data for Answer Engine Optimization (AEO).
 *
 * Why this exists: per the Phase 4 content audit (2026-04-17), 7 of 12
 * audited posts had FAQ blocks in the rendered prose, but zero posts emitted
 * FAQPage JSON-LD. That means the FAQ content was invisible to Google's
 * "People also ask" and to AI answer engines. This component closes the gap:
 * one tag in MDX, both the human-readable output and the structured data.
 *
 * Usage in MDX:
 *
 *   <FAQ
 *     questions={[
 *       {
 *         q: "Does humbucker size matter for tone?",
 *         a: "No. The magnet, coil winding, and output impedance dominate."
 *       },
 *       {
 *         q: "Can I hardwire the 5-way switch?",
 *         a: "Yes. Solder a fixed jumper between the lugs you want combined."
 *       }
 *     ]}
 *   />
 *
 * The `a` answer field supports basic Markdown-style line breaks (\n\n).
 * For richer content, use JSX children instead (see advanced usage below).
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
  /** Optional section title. Defaults to "Frequently Asked Questions". */
  title?: string;
}

export default function FAQ({
  questions,
  children,
  title = "Frequently Asked Questions",
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
      className="mx-auto my-10 max-w-3xl rounded-2xl border border-border bg-surface/40 p-6 md:p-8"
      aria-labelledby="faq-heading"
    >
      {/* Structured data — invisible to readers, visible to Google / AI */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2
        id="faq-heading"
        className="mb-6 text-xl font-bold text-foreground md:text-2xl"
      >
        {title}
      </h2>

      {children ? (
        // If the author passes rich children, use those — the schema still
        // reflects `questions`. Useful for rendered examples, links, etc.
        <div className="prose-dark">{children}</div>
      ) : (
        <dl className="space-y-5">
          {safeQuestions.map((item) => (
            <div key={item.q} className="border-b border-border/50 pb-5 last:border-0 last:pb-0">
              <dt className="text-base font-semibold text-foreground md:text-lg">
                {item.q}
              </dt>
              <dd className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
