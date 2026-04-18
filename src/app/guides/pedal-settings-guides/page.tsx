import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #2: Pedal Settings Guides.
 *
 * Curated index of every canonical-pedal settings guide on the site, plus
 * the reasoning framework for dialing any pedal in from scratch. Organized
 * into circuit families (drive, distortion, fuzz, comp, delay, reverb, mod)
 * because most players shop and think in those categories rather than by
 * manufacturer.
 */

export const metadata: Metadata = {
  title: "Pedal Settings Guides — Every Canonical Pedal, Dialed In",
  description:
    "Exact settings for Klon Centaur, Tube Screamer, Big Muff, RAT, DS-1, Blues Driver, and every other canonical pedal — with the reasoning for each knob position.",
  openGraph: {
    title: "Pedal Settings Guides | Fader & Knob",
    description:
      "How to dial every canonical pedal from clean boost to wall of fuzz.",
  },
};

interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag?: string;
}

const DRIVE: GuideEntry[] = [
  {
    title: "Klon Centaur Settings Guide",
    href: "/blog/klon-centaur-settings-guide",
    blurb:
      "Hank Presswood cuts through the mythology with specific clock positions. The Treble knob is a high-pass filter for harshness, not a tone control.",
    tag: "Transparent boost",
  },
  {
    title: "Tube Screamer Settings Guide",
    href: "/blog/tube-screamer-settings-guide",
    blurb:
      "The mid-bump overdrive. Why Drive at 0 / Level at max through a cranked amp is the SRV and Eddie Van Halen-at-the-DL go-to.",
    tag: "Mid boost",
  },
  {
    title: "Blues Driver (BD-2) Settings Guide",
    href: "/blog/blues-driver-bd2-settings-guide",
    blurb:
      "The Boss that replaces a pushed Fender. Settings for vintage Fender breakup, light grit, and as a gain stack under the Klon.",
    tag: "Fender-style",
  },
  {
    title: "BD-2 vs BD-2W Waza Craft",
    href: "/blog/bd2-vs-bd2w-waza-craft",
    blurb:
      "Is the Waza mod worth it? A-B tested with specific differences in breakup character and EQ profile.",
    tag: "Comparison",
  },
  {
    title: "Tumnus Deluxe vs Klon KTR",
    href: "/blog/tumnus-deluxe-vs-klon-ktr",
    blurb:
      "Can a $150 clone hold up against a $300 boutique? Side-by-side with measurements.",
    tag: "Comparison",
  },
];

const DISTORTION: GuideEntry[] = [
  {
    title: "Boss DS-1 Settings Guide",
    href: "/blog/boss-ds1-settings-guide",
    blurb:
      "The $50 pedal on Kurt Cobain's board. Why it works, what the Keeley mod actually does, and why it's still standard on metal boards.",
    tag: "Classic distortion",
  },
  {
    title: "RAT Pedal Settings Guide",
    href: "/blog/rat-pedal-settings-guide",
    blurb:
      "From Jeff Beck to Thom Yorke to Peter Koppes. Distortion/fuzz hybrid — the Filter knob is where the magic lives.",
    tag: "Versatile distortion",
  },
  {
    title: "Big Muff Settings Guide",
    href: "/blog/big-muff-settings-guide",
    blurb:
      "The wall-of-fuzz classic. Ram's Head vs NYC reissue vs Sovtek tonal differences, and why Sustain at 25–35% beats maxed.",
    tag: "Fuzz wall",
  },
  {
    title: "Big Muff vs Fuzz Face",
    href: "/blog/big-muff-vs-fuzz-face",
    blurb:
      "Different fuzz circuits producing different sounds. When to reach for which, and why one cleans up with volume knob and the other doesn't.",
    tag: "Fuzz comparison",
  },
  {
    title: "Germanium vs Silicon Fuzz",
    href: "/blog/germanium-vs-silicon-fuzz",
    blurb:
      "What the transistor material actually changes. Temperature sensitivity, dynamic response, and the cleanup-with-volume question.",
    tag: "Fuzz theory",
  },
];

const COMP_AMP: GuideEntry[] = [
  {
    title: "Compressor Pedal Settings Guide",
    href: "/blog/compressor-pedal-settings-guide",
    blurb:
      "Ratio, threshold, attack, release — what each control actually does to your signal, and settings for country pickin', always-on, and parallel compression.",
    tag: "Compression",
  },
  {
    title: "Chicken Pickin Compressor Settings",
    href: "/blog/chicken-pickin-compressor-settings",
    blurb:
      "Carl Beckett's Nashville framework: fast attack, slow release, ratio around 4:1. Keep the snap, control the sustain.",
    tag: "Country",
  },
  {
    title: "JCM800 Settings Guide",
    href: "/blog/jcm800-settings-guide",
    blurb:
      "The 80s metal and hard rock backbone. Why gain at 4 with master cranked is a different sound than gain at 8 with master low.",
    tag: "British high-gain",
  },
  {
    title: "Peavey 5150 Settings Guide",
    href: "/blog/peavey-5150-settings-guide",
    blurb:
      "The metal amp. Pre gain, post gain, and why scooping the mids in isolation sounds great and fails in a mix.",
    tag: "Metal",
  },
  {
    title: "Vox AC30 Settings Guide",
    href: "/blog/vox-ac30-settings-guide",
    blurb:
      "The chime. Why Cut is backwards (turning it up cuts treble, not boosts), Top Boost vs Normal channels, and the Tom Petty rhythm sound.",
    tag: "British clean",
  },
  {
    title: "Fender Deluxe Reverb Settings",
    href: "/blog/fender-deluxe-reverb-settings",
    blurb:
      "The studio amp that doesn't need a pedal. Where the sweet spot is, and why a Deluxe with a Klon is still the most reached-for clean lead rig in recording.",
    tag: "American clean",
  },
  {
    title: "Roland JC-120 Settings Guide",
    href: "/blog/roland-jc-120-settings-guide",
    blurb:
      "The transistor amp that worked. Chorus settings, why Andy Summers's clean tone only happens here, and how to stop it from sounding sterile.",
    tag: "Solid state clean",
  },
];

const TIME_MOD: GuideEntry[] = [
  {
    title: "Delay Pedal Settings Guide",
    href: "/blog/delay-pedal-settings-guide",
    blurb:
      "Time, feedback, mix — and why dotted eighth vs quarter note vs 3:4 polyrhythm is the difference between Edge, Gilmour, and a session guitarist.",
    tag: "Delay",
  },
  {
    title: "The Edge's Delay Settings",
    href: "/blog/the-edge-delay-settings",
    blurb:
      "Dotted eighth tempo-locked to the song. Three delays stacked. Where it comes from and the specific pedals he actually uses live.",
    tag: "Delay artist",
  },
  {
    title: "Stacking Reverbs Guide",
    href: "/blog/stacking-reverbs-guide",
    blurb:
      "Plate into hall into shimmer. When each reverb block contributes something, when they're fighting, and how to build an ambient rig that doesn't wash.",
    tag: "Reverb",
  },
];

function Section({
  title,
  blurb,
  guides,
}: {
  title: string;
  blurb: string;
  guides: GuideEntry[];
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mb-6 max-w-2xl text-sm text-muted md:text-base">{blurb}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="group flex flex-col rounded-xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/40 hover:bg-surface"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-accent">
                {g.title}
              </h3>
              {g.tag && (
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
                  {g.tag}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{g.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function PedalSettingsGuidesPillarPage() {
  const allGuides = [...DRIVE, ...DISTORTION, ...COMP_AMP, ...TIME_MOD];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pedal Settings Guides",
    description:
      "Fader & Knob's canonical index of pedal settings guides — overdrive, distortion, fuzz, compression, delay, reverb — with the reasoning behind each setting.",
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

      <article className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <header className="mb-12 md:mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-accent">
            Pillar guide · {allGuides.length} guides
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Pedal Settings Guides
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            Every canonical pedal, broken down to exactly what each knob does
            and where to set it. No &ldquo;start at noon and taste.&rdquo; Specific
            settings for specific outcomes, with the reasoning.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">
            How to read a pedal settings guide
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            Every pedal guide on Fader & Knob follows the same structure:
            what the pedal actually does to your signal (circuit-level),
            what each knob controls, starting settings for three or four use
            cases (clean boost, always-on, solo lift, etc.), and notes on how
            the pedal interacts with common amp and pickup combinations. The
            guides are opinionated but specific — &ldquo;Drive at about 1
            o&apos;clock&rdquo; not &ldquo;medium drive.&rdquo;
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            If you&apos;re new to the pedal, start with the &ldquo;always-on&rdquo;
            setting and play unplugged-level volume for a minute. Your ears
            calibrate fast. Then move to the use case closest to what you
            want and tune from there. Our knob positions are starting points
            — your guitar, amp, and signal chain will push some frequencies
            where the originals didn&apos;t.
          </p>
        </section>

        <Section
          title="Overdrive and clean boost"
          blurb="The gain-stacking pedals. What runs into the amp to push it or shape it, not to replace it."
          guides={DRIVE}
        />

        <Section
          title="Distortion and fuzz"
          blurb="Pedals that produce the gain themselves — typically into a clean-ish amp. Different circuits, wildly different sounds."
          guides={DISTORTION}
        />

        <Section
          title="Compression and amps"
          blurb="The foundation. Compression under everything, amps as the platform. Each amp here is the canonical reference for a genre."
          guides={COMP_AMP}
        />

        <Section
          title="Time and modulation"
          blurb="Delay and reverb turn a signal chain into a composition. These guides cover the pedals that do it well and how to keep them out of each other's way."
          guides={TIME_MOD}
        />

        {/* Related guides / cross-pillar links */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/guides/artist-tone-recipes"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Artist Tone Recipes</h3>
              <p className="mt-2 text-xs text-muted">
                Use any pedal guide here to reproduce a specific artist&apos;s tone.
              </p>
            </Link>
            <Link
              href="/platforms"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Modeler deep dives</h3>
              <p className="mt-2 text-xs text-muted">
                Every pedal in the guides has a modeler equivalent. Cross-reference them here.
              </p>
            </Link>
            <Link
              href="/how-it-works"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Signal chain fundamentals</h3>
              <p className="mt-2 text-xs text-muted">
                Why pedal order matters. Gain staging, buffered vs true bypass, parallel routing.
              </p>
            </Link>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            One new pedal guide per week, free
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Tone of the Week goes out every Friday with one new pedal or tone
            guide, one recipe to dial in, and one quick tip. Join free.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Browse all recipes
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
            >
              See other pillar guides
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
