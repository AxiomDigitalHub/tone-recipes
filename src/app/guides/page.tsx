import type { Metadata } from "next";
import Link from "next/link";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";

/**
 * /guides — Pillar-hub index.
 *
 * Editorial v3 rewrite (2026-05-12). Reads like the table-of-contents
 * spine of a magazine: archive masthead, mono-uppercase kicker, serif
 * display title, then a single column of hairline-divided pillar rows
 * — not a card grid.
 */

export const metadata: Metadata = {
  title: "Guides — Tone, Gear, and Signal Chain Fundamentals",
  description:
    "Pillar guides from Fader & Knob: artist tone recipes, pedal settings, amp settings, modeler mastery, signal chain theory, worship guitar, bedroom tone, and tone troubleshooting.",
};

interface Pillar {
  slug: string;
  number: string; // "I", "II", … — gives each pillar a stable issue-number identity
  title: string;
  blurb: string;
  meta: string; // small right-side label, e.g. "Modeler · Helix · QC"
}

const PILLARS: Pillar[] = [
  {
    slug: "artist-tone-recipes",
    number: "I",
    title: "Artist Tone Recipes",
    blurb:
      "Reproduce Gilmour, Page, SRV, Hetfield, Van Halen, and more — with exact signal chains and cross-platform presets.",
    meta: "Gilmour · SRV · Hetfield",
  },
  {
    slug: "pedal-settings-guides",
    number: "II",
    title: "Pedal Settings Guides",
    blurb:
      "Klon, Tube Screamer, Big Muff, RAT, DS-1 — how to dial every canonical pedal, with clone comparisons.",
    meta: "Klon · TS · Muff · RAT",
  },
  {
    slug: "amp-settings-and-tone",
    number: "III",
    title: "Amp Settings & Tone",
    blurb:
      "Plexi, JCM800, AC30, Twin Reverb, 5150 — settings for each amp's signature voice and why they work.",
    meta: "Plexi · AC30 · 5150",
  },
  {
    slug: "modeler-mastery",
    number: "IV",
    title: "Modeler Mastery",
    blurb:
      "Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana — deep dives on each platform's model library and workflow.",
    meta: "Helix · QC · TONEX · Fractal",
  },
  {
    slug: "signal-chain-fundamentals",
    number: "V",
    title: "Signal Chain Fundamentals",
    blurb:
      "Why the order of pedals matters. Gain staging, impedance, true bypass, buffered pedals, parallel routing.",
    meta: "Theory · routing · gain",
  },
  {
    slug: "worship-guitar",
    number: "VI",
    title: "Worship Guitar",
    blurb:
      "Sunday morning setup, live expression-pedal dynamics, in-ear mix for guitar, analog-plus-digital worship rigs.",
    meta: "AC30 · Klon · shimmer",
  },
  {
    slug: "bedroom-and-home-recording",
    number: "VII",
    title: "Bedroom & Home Recording",
    blurb:
      "Getting great tone in small spaces — headphone rigs, direct recording, quiet pedalboards, parent-player practice.",
    meta: "Headphones · DI · quiet",
  },
  {
    slug: "tone-troubleshooting",
    number: "VIII",
    title: "Tone Troubleshooting",
    blurb:
      "Why your rig sounds wrong. Fixing muddy bass, fizzy highs, noise floor, ground loops, and tone-suck.",
    meta: "Diagnostics · fixes",
  },
];

export default function GuidesIndexPage() {
  const collectionLd = collectionPageJsonLd({
    name: "Guides — Fader & Knob",
    description:
      "Pillar guides from Fader & Knob: artist tone recipes, pedal settings, amp settings, modeler mastery, signal chain theory, worship guitar, bedroom tone, and tone troubleshooting.",
    url: "https://faderandknob.com/guides",
    items: PILLARS.map((p) => ({
      url: `https://faderandknob.com/guides/${p.slug}`,
      name: p.title,
      description: p.blurb,
    })),
  });

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <div className="recipe-crumbs">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <span style={{ color: "var(--ink)" }}>Guides</span>
      </div>

      <header className="archive-masthead">
        <div className="archive-kicker">
          <span>The Pillars</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Eight Departments</span>
        </div>
        <h1 className="archive-title">
          The reference shelf for guitar tone.
        </h1>
        <p className="archive-lede">
          Eight pillar guides. Each one a canonical reference for its topic —
          a curated collection of our deepest posts, organized into a single
          teaching arc.
        </p>
      </header>

      <ul
        className="mt-12 border-b"
        style={{ borderColor: "rgba(10,9,8,0.18)" }}
      >
        {PILLARS.map((p) => (
          <li
            key={p.slug}
            className="border-t group"
            style={{ borderColor: "rgba(10,9,8,0.18)" }}
          >
            <Link href={`/guides/${p.slug}`} className="block py-7 md:py-8">
              <div className="flex items-baseline gap-5 md:gap-7">
                <span
                  className="shrink-0 text-2xl md:text-3xl"
                  style={{
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                    opacity: 0.55,
                    letterSpacing: "0.05em",
                    minWidth: "2.5ch",
                  }}
                  aria-hidden="true"
                >
                  {p.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h2
                      className="display text-2xl group-hover:underline md:text-3xl"
                      style={{
                        color: "var(--ink)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.05,
                        textDecorationThickness: "1px",
                        textUnderlineOffset: "4px",
                      }}
                    >
                      {p.title}
                    </h2>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap"
                      style={{
                        color: "var(--ink-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {p.meta}
                    </span>
                  </div>
                  <p
                    className="mt-3 max-w-[58ch] text-base leading-relaxed"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {p.blurb}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* End-of-file mark */}
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
