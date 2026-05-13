import Link from "next/link";
import type { ReactNode } from "react";

/**
 * <PillarHub> — shared editorial layout for the 8 pillar guide pages
 * under /guides/. Built from the same set of v3 chrome classes the
 * blog index uses (archive-masthead, section-head + mark + title +
 * rule + meta, recipe-crumbs) so the whole /guides/* tree reads as
 * one editorial sub-publication rather than 8 different SaaS card
 * grids.
 *
 * The pages just supply data; this component handles all layout,
 * typography, hover states, and structure. To add a new pillar:
 *
 *   <PillarHub
 *     crumb="Modeler"
 *     kicker={["Pillar Guide", "Volume 04"]}
 *     title="Modeler Mastery"
 *     lede="…"
 *     intro={<>...</>}
 *     sections={[
 *       { mark: "¤", title: "...", meta: "...", entries: [...] },
 *     ]}
 *     cta={{ kicker, title, body, button: { href, label } }}
 *     related={[{ href, title, blurb }]}
 *   />
 *
 * Editorial choices encoded here:
 *   - serif display headings (.archive-title, .section-title, .display)
 *   - hairline-divided guide-list rows, not card grids
 *   - mono-uppercase eyebrows + section-meta
 *   - square ink-bordered chips for tags, not pill-shaped tag clouds
 *   - one editorial CTA, not stacked sign-up pushes
 *   - end-of-file ▪ ▪ ▪ mark
 */

export interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

export interface PillarSection {
  mark: string; // ¤ § ▪ ¶ etc — section glyph
  title: string;
  meta?: string; // small right-aligned mono label
  entries: GuideEntry[];
}

export interface PillarCta {
  kicker: string;
  title: string;
  body: string;
  button: { href: string; label: string };
}

export interface RelatedPillar {
  href: string;
  title: string;
  blurb: string;
}

export interface PillarHubProps {
  /** Last segment of the breadcrumb trail under "Guides". */
  crumb: string;
  /** Mono-uppercase kicker labels, e.g. ["Pillar Guide", "Volume 04"]. */
  kicker?: string[];
  /** Display-serif page title. */
  title: string;
  /** Italic-serif lede paragraph under the title. */
  lede: string;
  /** Optional intro body (1-3 paragraphs) before the first section. */
  intro?: ReactNode;
  sections: PillarSection[];
  /** Single editorial CTA (a Set Pack callout, newsletter push, etc.). */
  cta?: PillarCta;
  /** "Adjacent pillars" rail at the bottom. */
  related?: RelatedPillar[];
}

/* -------------------------------------------------------------------- */
/*  Building blocks                                                      */
/* -------------------------------------------------------------------- */

function GuideRow({ entry }: { entry: GuideEntry }) {
  return (
    <li
      className="border-t group"
      style={{ borderColor: "rgba(10,9,8,0.18)" }}
    >
      <Link href={entry.href} className="block py-6">
        <div className="flex items-baseline justify-between gap-6">
          <h3
            className="display text-xl md:text-2xl group-hover:underline"
            style={{
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              textDecorationThickness: "1px",
              textUnderlineOffset: "4px",
            }}
          >
            {entry.title}
          </h3>
          <span
            className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              border: "1px solid var(--ink)",
              padding: "3px 8px 2px",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {entry.tag}
          </span>
        </div>
        <p
          className="mt-2 max-w-[58ch] text-sm leading-relaxed md:text-base"
          style={{ color: "var(--ink-muted)" }}
        >
          {entry.blurb}
        </p>
      </Link>
    </li>
  );
}

function GuideSection({ mark, title, meta, entries }: PillarSection) {
  return (
    <section className="mt-16 md:mt-20">
      <div className="section-head">
        <span className="section-mark">{mark}</span>
        <h2 className="section-title">{title}</h2>
        <span className="section-rule" aria-hidden="true" />
        {meta && <span className="section-meta">{meta}</span>}
      </div>
      <ul
        className="border-b"
        style={{ borderColor: "rgba(10,9,8,0.18)" }}
      >
        {entries.map((entry) => (
          <GuideRow key={entry.href} entry={entry} />
        ))}
      </ul>
    </section>
  );
}

function CtaAside({ cta }: { cta: PillarCta }) {
  return (
    <aside
      className="mt-20"
      style={{
        borderTop: "3px solid var(--ink)",
        borderBottom: "1px solid rgba(10,9,8,0.12)",
        paddingTop: "22px",
        paddingBottom: "26px",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.22em]"
        style={{
          color: "var(--amber-2)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {cta.kicker}
      </p>
      <h2
        className="display mt-2 text-3xl md:text-4xl"
        style={{ color: "var(--ink)", letterSpacing: "-0.015em" }}
      >
        {cta.title}
      </h2>
      <p
        className="mt-3 max-w-[56ch] text-base leading-relaxed"
        style={{ color: "var(--ink-muted)" }}
      >
        {cta.body}
      </p>
      <div className="mt-6">
        <Link
          href={cta.button.href}
          className="inline-flex items-center px-5 py-2.5 text-sm font-semibold no-underline transition-opacity hover:opacity-90"
          style={{
            background: "var(--amber)",
            color: "var(--ink)",
            border: "1px solid var(--ink)",
            letterSpacing: "0.02em",
          }}
        >
          {cta.button.label} →
        </Link>
      </div>
    </aside>
  );
}

function RelatedRail({ items }: { items: RelatedPillar[] }) {
  return (
    <section className="mt-20">
      <div className="section-head">
        <span className="section-mark">▪</span>
        <h2 className="section-title">Adjacent pillars</h2>
        <span className="section-rule" aria-hidden="true" />
      </div>
      <ul
        className="border-b"
        style={{ borderColor: "rgba(10,9,8,0.18)" }}
      >
        {items.map((p) => (
          <li
            key={p.href}
            className="border-t group"
            style={{ borderColor: "rgba(10,9,8,0.18)" }}
          >
            <Link href={p.href} className="block py-5">
              <h3
                className="display text-lg group-hover:underline md:text-xl"
                style={{
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "4px",
                }}
              >
                {p.title}
              </h3>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: "var(--ink-muted)" }}
              >
                {p.blurb}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/*  Main                                                                 */
/* -------------------------------------------------------------------- */

export default function PillarHub({
  crumb,
  kicker,
  title,
  lede,
  intro,
  sections,
  cta,
  related,
}: PillarHubProps) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="recipe-crumbs">
        <Link href="/guides">Guides</Link>
        <span className="sep">/</span>
        <span style={{ color: "var(--ink)" }}>{crumb}</span>
      </div>

      <header className="archive-masthead">
        {kicker && kicker.length > 0 && (
          <div className="archive-kicker">
            {kicker.map((k, i) => (
              <span key={i} className="contents">
                {i > 0 && <span style={{ opacity: 0.4 }}>·</span>}
                <span>{k}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="archive-title">{title}</h1>
        <p className="archive-lede">{lede}</p>
      </header>

      {intro && <section className="mt-10">{intro}</section>}

      {sections.map((s) => (
        <GuideSection key={s.title} {...s} />
      ))}

      {cta && <CtaAside cta={cta} />}

      {related && related.length > 0 && <RelatedRail items={related} />}

      <div
        className="mt-16 text-center text-[10px] tracking-[0.4em]"
        style={{ color: "var(--ink-faint)" }}
        aria-hidden="true"
      >
        ▪ ▪ ▪
      </div>
    </article>
  );
}
