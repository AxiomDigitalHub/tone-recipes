import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #6: Worship Guitar.
 *
 * Editorial v3 rewrite (2026-05-11) — moved away from the rounded-card SaaS
 * layout to hairline rules, serif display titles, mono eyebrows, and ink-on-
 * paper guide-list rows. Reads like the table-of-contents spine of a
 * magazine, not a dashboard.
 */

export const metadata: Metadata = {
  title: "Worship Guitar — Live Rigs, Sunday Mornings, and Analog Warmth",
  description:
    "Worship guitar tone from first principles. AC30 + Klon + delays + shimmer. Live rigs, in-ear mix workflow, pedalboard organization, and how to dial the Hillsong/Bethel/Elevation sound on whatever gear you own.",
};

interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

const TONE_FOUNDATIONS: GuideEntry[] = [
  {
    title: "Modern Worship Guitar Tone (Helix)",
    href: "/blog/modern-worship-guitar-tone-helix",
    blurb:
      "The three-tone-states-in-one-preset framework: clean ambient, light crunch, full drive. How to dial each and transition between them mid-song.",
    tag: "Modeler",
  },
  {
    title: "Worship Guitar Tone (Helix)",
    href: "/blog/worship-guitar-tone-helix",
    blurb:
      "The foundational worship tone stack — AC30 amp model, Klon-style transparent OD, dotted-eighth delay, shimmer reverb. Helix-specific blocks and settings.",
    tag: "Modeler",
  },
];

const LIVE_RIG: GuideEntry[] = [
  {
    title: "HX Stomp vs Helix LT for Worship",
    href: "/blog/hx-stomp-vs-helix-lt-worship",
    blurb:
      "The two most common worship modelers. Which one fits which rig — pedalboard real estate, DSP headroom, footswitch count, and stage workflow.",
    tag: "Gear choice",
  },
  {
    title: "Worship Pedalboard Guide",
    href: "/blog/worship-pedalboard-guide",
    blurb:
      "Building an analog worship pedalboard that covers clean ambient, light crunch, lead, and pad territory without overflowing the board.",
    tag: "Pedalboard",
  },
  {
    title: "IEM Mix + Guitar Compression",
    href: "/blog/iem-mix-guitar-compression",
    blurb:
      "Why your guitar sits different in an in-ear mix than through a wedge. Compression, EQ, and the one routing trick that fixes the &lsquo;floating on top&rsquo; problem.",
    tag: "In-ear mix",
  },
];

/**
 * Editorial guide-list row: hairline-divided, ink-typography, tag on the
 * right. Mirrors the rhythm of a newspaper department index — no cards,
 * no rounded corners, no hover-tinted backgrounds.
 */
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

interface SectionProps {
  mark: string;
  title: string;
  meta: string;
  entries: GuideEntry[];
}

function GuideSection({ mark, title, meta, entries }: SectionProps) {
  return (
    <section className="mt-16 md:mt-20">
      <div className="section-head">
        <span className="section-mark">{mark}</span>
        <h2 className="section-title">{title}</h2>
        <span className="section-rule" aria-hidden="true" />
        <span className="section-meta">{meta}</span>
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

export default function WorshipPillarPage() {
  const allGuides = [...TONE_FOUNDATIONS, ...LIVE_RIG];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Worship Guitar",
    description:
      "Fader & Knob's worship guitar hub — tone foundations, live rigs, pedalboard organization, and in-ear mix workflow for Sunday morning.",
    hasPart: allGuides.map((g) => ({
      "@type": "Article",
      headline: g.title,
      url: `https://faderandknob.com${g.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="recipe-crumbs">
          <Link href="/guides">Guides</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Worship</span>
        </div>

        <header className="archive-masthead">
          <div className="archive-kicker">
            <span>Pillar Guide</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Volume 06</span>
          </div>
          <h1 className="archive-title">Worship Guitar</h1>
          <p className="archive-lede">
            The Sunday morning rig — present without being prominent, dynamic
            without being distracting, big without being loud.
          </p>
        </header>

        {/* The formula — editorial intro, no card */}
        <section className="mt-10">
          <p
            className="text-base leading-relaxed md:text-lg"
            style={{ color: "var(--ink)" }}
          >
            Modern worship guitar sounds like it does because a handful of
            elements show up across almost every church and record. A Vox AC30
            or AC30-adjacent amp model. A transparent boost — Klon, Tumnus, or
            similar. A dotted-eighth-note delay, tempo-locked. Plate reverb. A
            shimmer effect for pads. Those five elements handle 90% of what you
            hear from Elevation, Hillsong, Bethel, Passion, and most A/B-tier
            worship songs.
          </p>
          <p
            className="mt-4 text-base leading-relaxed md:text-lg"
            style={{ color: "var(--ink)" }}
          >
            What separates a great worship guitarist isn&apos;t the pedals.
            It&apos;s the knob positions (the Klon at 7 o&apos;clock, not noon;
            the Muff Sustain at 30%, not maxed), the structural use of delay
            (rhythmic, not decorative), and the live-mix awareness that keeps
            the guitar present without fighting the band.
          </p>
          <p
            className="mt-4 text-sm italic md:text-base"
            style={{
              color: "var(--ink-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            Nathan Cross — who writes most of our worship content — is a
            working worship guitarist in mid-sized churches. The guides here
            reflect a Sunday morning reality, not a bedroom studio.
          </p>
        </section>

        <GuideSection
          mark="¤"
          title="Tone foundations"
          meta="Amp · OD · delay · reverb"
          entries={TONE_FOUNDATIONS}
        />

        <GuideSection
          mark="§"
          title="Live rig & workflow"
          meta="Pedalboard · modeler · in-ears"
          entries={LIVE_RIG}
        />

        {/* The Worship Set Pack — single editorial aside, not a duplicated CTA */}
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
            From the catalog
          </p>
          <h2
            className="display mt-2 text-3xl md:text-4xl"
            style={{ color: "var(--ink)", letterSpacing: "-0.015em" }}
          >
            The Worship Set Pack
          </h2>
          <p
            className="mt-3 max-w-[56ch] text-base leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
          >
            One Helix preset, 8 snapshots, 30 worship songs mapped to
            snapshots. AC30 + Klon + delays + shimmer, dialed and ready. One-
            time $19, yours to keep.
          </p>
          <div className="mt-6">
            <Link
              href="/set-packs/worship"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold no-underline transition-opacity hover:opacity-90"
              style={{
                background: "var(--amber)",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                letterSpacing: "0.02em",
              }}
            >
              See the Set Pack →
            </Link>
          </div>
        </aside>

        {/* Related pillars — editorial three-up, hairline-divided */}
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
            {[
              {
                href: "/guides/pedal-settings-guides",
                title: "Pedal settings guides",
                blurb:
                  "Klon, delay, reverb — the settings guides for every pedal in the worship stack.",
              },
              {
                href: "/guides/amp-settings-and-tone",
                title: "Amp settings & tone",
                blurb:
                  "The AC30 breakdown and its modeler equivalents. The amp that makes worship guitar sound like worship guitar.",
              },
              {
                href: "/guides/modeler-mastery",
                title: "Modeler mastery",
                blurb:
                  "Most worship rigs are Helix- or HX Stomp-based. The modeler pillar covers them all.",
              },
            ].map((p) => (
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

        {/* End-of-file mark, matches the blog */}
        <div
          className="mt-16 text-center text-[10px] tracking-[0.4em]"
          style={{ color: "var(--ink-faint)" }}
          aria-hidden="true"
        >
          ▪ ▪ ▪
        </div>
      </article>
    </>
  );
}
