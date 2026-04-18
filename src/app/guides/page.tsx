import type { Metadata } from "next";
import Link from "next/link";

/**
 * /guides — Pillar-hub index.
 *
 * Eight pillars identified by the 2026-04 content-authority audit. One hub
 * page per pillar, rolled out one per session. This index exists from day 1
 * so the hubs that ARE live have a canonical home; pillars not yet built
 * are shown as "coming soon" so the visitor knows what to expect.
 */

export const metadata: Metadata = {
  title: "Guides — Tone, Gear, and Signal Chain Fundamentals",
  description:
    "Pillar guides from Fader & Knob: artist tone recipes, pedal settings, amp settings, modeler mastery, signal chain theory, worship guitar, bedroom tone, and tone troubleshooting.",
};

const PILLARS = [
  {
    slug: "artist-tone-recipes",
    title: "Artist Tone Recipes",
    blurb: "Reproduce Gilmour, Page, SRV, Hetfield, Van Halen, and more — with exact signal chains and cross-platform presets.",
    live: true,
  },
  {
    slug: "pedal-settings-guides",
    title: "Pedal Settings Guides",
    blurb: "Klon, Tube Screamer, Big Muff, RAT, DS-1 — how to dial every canonical pedal, with clone comparisons.",
    live: false,
  },
  {
    slug: "amp-settings-and-tone",
    title: "Amp Settings & Tone",
    blurb: "Plexi, JCM800, AC30, Twin Reverb, 5150 — settings for each amp's signature voice and why they work.",
    live: false,
  },
  {
    slug: "modeler-mastery",
    title: "Modeler Mastery",
    blurb: "Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana — deep dives on each platform's model library and workflow.",
    live: false,
  },
  {
    slug: "signal-chain-fundamentals",
    title: "Signal Chain Fundamentals",
    blurb: "Why the order of pedals matters. Gain staging, impedance, true bypass, buffered pedals, parallel routing.",
    live: false,
  },
  {
    slug: "worship-guitar",
    title: "Worship Guitar",
    blurb: "Sunday morning setup, live expression-pedal dynamics, in-ear mix for guitar, analog-plus-digital worship rigs.",
    live: false,
  },
  {
    slug: "bedroom-and-home-recording",
    title: "Bedroom & Home Recording",
    blurb: "Getting great tone in small spaces — headphone rigs, direct recording, quiet pedalboards, parent-player practice.",
    live: false,
  },
  {
    slug: "tone-troubleshooting",
    title: "Tone Troubleshooting",
    blurb: "Why your rig sounds wrong. Fixing muddy bass, fizzy highs, noise floor, ground loops, and tone-suck.",
    live: false,
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <header className="mb-12">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-accent">
          Pillar guides
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Tone, gear, and signal chain — broken down to first principles
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
          Each pillar is the canonical reference for its topic — a curated
          collection of our deepest posts, organized into a single teaching
          arc. Start with any pillar and work outward through the linked
          posts.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {PILLARS.map((p) =>
          p.live ? (
            <Link
              key={p.slug}
              href={`/guides/${p.slug}`}
              className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:bg-surface-hover"
            >
              <h2 className="text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              <span className="mt-4 text-xs font-semibold text-accent">
                Open the guide →
              </span>
            </Link>
          ) : (
            <div
              key={p.slug}
              className="flex flex-col rounded-2xl border border-border/50 bg-surface/40 p-6 opacity-60"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{p.title}</h2>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Coming soon
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
