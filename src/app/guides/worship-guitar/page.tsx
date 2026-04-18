import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #6: Worship Guitar.
 *
 * Whitespace pillar per the content-authority research. Worship Tutorials is
 * the direct competitor but is modeler-centric; Fader & Knob's lane here is
 * analog + modeler + live workflow, not just preset sales.
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
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
                {g.tag}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{g.blurb}</p>
          </Link>
        ))}
      </div>
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

      <article className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <header className="mb-12 md:mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-accent">
            Pillar guide · {allGuides.length} guides · Growing weekly
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Worship Guitar
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            The Sunday morning rig — present without being prominent, dynamic
            without being distracting, big without being loud. The worship
            tone formula decoded, with live-workflow details most guides
            skip.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">The worship tone formula</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            Modern worship guitar sounds like it does because a handful of
            elements show up across almost every church and record. A Vox
            AC30 or AC30-adjacent amp model. A transparent boost — Klon,
            Tumnus, or similar. A dotted-eighth-note delay, tempo-locked.
            Plate reverb. A shimmer effect for pads. Those five elements
            handle 90% of what you hear from Elevation, Hillsong, Bethel,
            Passion, and most A/B-tier worship songs.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            What separates a great worship guitarist isn&apos;t the pedals.
            It&apos;s the knob positions (the Klon at 7 o&apos;clock, not
            noon; the Muff Sustain at 30%, not maxed), the structural use of
            delay (rhythmic, not decorative), and the live-mix awareness
            that keeps the guitar present without fighting the band.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Nathan Cross — who writes most of our worship content — is a
            working worship guitarist in mid-sized churches. The guides here
            reflect a Sunday morning reality, not a bedroom studio.
          </p>
        </section>

        <Section
          title="Tone foundations"
          blurb="The core worship tone — amp, OD, delay, reverb — built on Helix and translatable to any modeler or analog rig."
          guides={TONE_FOUNDATIONS}
        />

        <Section
          title="Live rig and workflow"
          blurb="What makes the worship rig different from a general-purpose pedalboard — pedalboard organization, modeler choice, and in-ear mixing for guitar."
          guides={LIVE_RIG}
        />

        <section className="mb-14 rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
          <h2 className="mb-3 text-xl font-bold md:text-2xl">
            Worship Set Pack — live now
          </h2>
          <p className="mb-4 max-w-2xl text-sm text-muted md:text-base">
            One Helix preset, 8 snapshots, 30 top worship songs mapped to
            snapshots. Clean, Drive, Drive+, Lead, Clean Ambient, Ambient
            Drive, Rock, Swells. Free with sign-up.
          </p>
          <Link
            href="/set-packs/worship"
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Open the Worship Set Pack
          </Link>
        </section>

        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/guides/pedal-settings-guides"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Pedal settings guides</h3>
              <p className="mt-2 text-xs text-muted">
                Klon, delay, reverb — the settings guides for every pedal in the worship stack.
              </p>
            </Link>
            <Link
              href="/guides/amp-settings-and-tone"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Amp settings & tone</h3>
              <p className="mt-2 text-xs text-muted">
                The AC30 breakdown and its modeler equivalents. The amp that makes worship guitar sound like worship guitar.
              </p>
            </Link>
            <Link
              href="/guides/modeler-mastery"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Modeler mastery</h3>
              <p className="mt-2 text-xs text-muted">
                Most worship rigs are Helix- or HX Stomp-based. The modeler pillar covers them all.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            Sunday Setlist delivered to your inbox
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Every Friday: worship tone of the week, a deep-dive blog post,
            and a quick tip you can use at Sunday&apos;s rehearsal. Free.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/set-packs/worship"
              className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Download Worship Set Pack
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
