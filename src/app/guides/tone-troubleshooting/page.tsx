import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #8: Tone Troubleshooting.
 *
 * Per the content-authority research, this category is undersupplied
 * relative to reader intent. Competitors rank for "why does my modeler
 * sound bad" with thin content; F&K can own it with specific diagnostic
 * guides.
 */

export const metadata: Metadata = {
  title: "Tone Troubleshooting — Why Your Rig Sounds Wrong (and How to Fix It)",
  description:
    "Diagnostic guides for the tone problems every player hits — fizzy highs, thin sound, muddy delays, 60-cycle hum, pedal hiss, volume drops, washed-out reverb.",
};

interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

const NOISE_AND_HUM: GuideEntry[] = [
  {
    title: "How to Remove 60-Cycle Hum (Without a Noise Gate)",
    href: "/blog/how-to-remove-60-cycle-hum",
    blurb:
      "The five causes of 60-cycle hum, with a diagnostic flow. A noise gate treats the symptom; this guide finds the source.",
    tag: "Hum",
  },
  {
    title: "How to Stop Pedal Hiss",
    href: "/blog/how-to-stop-pedal-hiss",
    blurb:
      "Hiss that rides under the signal is different from hum — different cause, different fix. How to isolate and eliminate it.",
    tag: "Noise",
  },
  {
    title: "Cavity Shielding Test",
    href: "/blog/cavity-shielding-test",
    blurb:
      "Measurable hum reduction from copper-foil cavity shielding. When it helps and by how much — with the data.",
    tag: "Guitar shielding",
  },
];

const TONE_PROBLEMS: GuideEntry[] = [
  {
    title: "Why Modeler Tone Sounds Fizzy",
    href: "/blog/why-modeler-tone-sounds-fizzy",
    blurb:
      "The #1 complaint about digital amps. Five specific causes — IR mismatch, gain staging, upper-harmonic content, cab placement — and the fixes for each.",
    tag: "Modeler",
  },
  {
    title: "Fix Fizzy High-Gain",
    href: "/blog/fix-fizzy-high-gain",
    blurb:
      "Even real amps get fizzy under too much gain. What&apos;s causing it at the circuit level, and the EQ moves that restore clarity without losing aggression.",
    tag: "High-gain",
  },
  {
    title: "Fix Thin Modeler Tone",
    href: "/blog/fix-thin-modeler-tone",
    blurb:
      "When your modeler sounds like a DI with reverb on it. The missing elements that make a modeler feel &ldquo;amp-in-the-room&rdquo; instead of &ldquo;through a pane of glass.&rdquo;",
    tag: "Modeler",
  },
  {
    title: "Why Delay Sounds Muddy",
    href: "/blog/why-delay-sounds-muddy",
    blurb:
      "Delay muddiness isn&apos;t the delay — it&apos;s frequency stacking and feedback runaway. The two settings that fix 90% of muddy-delay complaints.",
    tag: "Delay",
  },
  {
    title: "Reverb Sounds Washed Out",
    href: "/blog/reverb-sounds-washed-out",
    blurb:
      "The classic &ldquo;too much reverb&rdquo; problem is actually a mix problem. Pre-delay, high-frequency damping, and where reverb sits in the signal chain.",
    tag: "Reverb",
  },
];

const LEVEL_MATCHING: GuideEntry[] = [
  {
    title: "Solo Patch Volume Drop Fix",
    href: "/blog/solo-patch-volume-drop-fix",
    blurb:
      "Your solo patch sounds killer in your bedroom and disappears in the mix. The four places where the volume drop is actually happening, and the correct fix for each.",
    tag: "Live",
  },
  {
    title: "Level Match Modeler Presets",
    href: "/blog/level-match-modeler-presets",
    blurb:
      "The single biggest mistake in preset tweaking. If your presets aren&apos;t level-matched, your ears are lying to you about which one sounds better.",
    tag: "Mixing",
  },
  {
    title: "Modeler Preset Sounds Different Live",
    href: "/blog/modeler-preset-sounds-different-live",
    blurb:
      "Why your home-dialed preset betrays you at the gig. Five environmental factors and the five preset-side adjustments that compensate.",
    tag: "Live",
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

export default function TroubleshootingPillarPage() {
  const allGuides = [...NOISE_AND_HUM, ...TONE_PROBLEMS, ...LEVEL_MATCHING];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tone Troubleshooting",
    description:
      "Diagnostic guides for guitar tone problems — hum, hiss, fizzy high-gain, thin modeler tone, muddy delays, washed-out reverb, volume drops, and preset level matching.",
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
            Tone Troubleshooting
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            If your rig sounds wrong, the fix is almost always knowable.
            Fizzy highs, thin sound, muddy delays, hum that won&apos;t
            leave — every tone problem has a diagnostic path and a
            specific fix.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">Diagnose first, fix second</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The single biggest mistake in troubleshooting tone is jumping
            to a fix before you&apos;ve identified the cause. &ldquo;My
            tone sounds muddy&rdquo; might be a gain-staging problem, a
            cab IR problem, a room acoustics problem, a level-mismatch
            problem with the reference you&apos;re comparing against, or a
            pickup height problem. Five different causes, five different
            fixes, only one of them right for your specific situation.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Every guide in this pillar follows the same structure: what
            the symptom actually is, the possible causes (ranked by
            likelihood), the diagnostic test for each, and the specific
            fix once you&apos;ve isolated the cause. No &ldquo;try
            everything and see what helps&rdquo; — that&apos;s how you
            spend three hours and learn nothing.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            These are the posts to bookmark and return to when something
            sounds wrong.
          </p>
        </section>

        <Section
          title="Noise and hum"
          blurb="Hum, buzz, hiss — three different problems with three different causes. Diagnose which one you have first."
          guides={NOISE_AND_HUM}
        />

        <Section
          title="Tone problems"
          blurb="The tone sounds wrong and you can&apos;t name why. These guides isolate the actual cause for each of the common complaints."
          guides={TONE_PROBLEMS}
        />

        <Section
          title="Level and mix problems"
          blurb="Your tone changes when you play with others or in a different room. Usually a level-matching or environmental issue, not a gear issue."
          guides={LEVEL_MATCHING}
        />

        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/guides/signal-chain-fundamentals"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Signal chain fundamentals</h3>
              <p className="mt-2 text-xs text-muted">
                Most tone problems are signal-chain problems. Understanding gain staging and impedance matching eliminates most of the diagnostic work.
              </p>
            </Link>
            <Link
              href="/guides/modeler-mastery"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Modeler mastery</h3>
              <p className="mt-2 text-xs text-muted">
                Many of the specific troubleshooting questions are modeler-specific. Platform guides cover the workflow side.
              </p>
            </Link>
            <Link
              href="/guides/amp-settings-and-tone"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Amp settings & tone</h3>
              <p className="mt-2 text-xs text-muted">
                Real-amp tone problems — sag, compression, frequency response — usually trace back to how the amp is being operated.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            Fix one tone problem a week
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Tone of the Week delivers one diagnostic guide, one recipe,
            and one quick tip every Friday. Free.
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
