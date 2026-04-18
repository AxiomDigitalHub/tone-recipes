import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #5: Signal Chain Fundamentals.
 *
 * Why pedal order, impedance, gain staging, and buffered-vs-true-bypass
 * matter — with the reasoning that generalizes across any rig.
 */

export const metadata: Metadata = {
  title: "Signal Chain Fundamentals — The Engineering Behind Your Tone",
  description:
    "Pedal order, gain staging, impedance, true bypass vs buffered, parallel routing — the engineering principles that shape every guitar tone.",
};

interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

const ORDER_AND_STAGING: GuideEntry[] = [
  {
    title: "Signal Chain Order Guide",
    href: "/blog/signal-chain-order-guide",
    blurb:
      "Why the order of pedals matters. The canonical ordering (dynamics → gain → mod → time) explained from the circuit level — not just as a rule.",
    tag: "Order",
  },
  {
    title: "Beginner Signal Chains",
    href: "/blog/beginner-signal-chains",
    blurb:
      "The first five-pedal signal chain every player should understand before expanding. Why this starter chain is the template for everything that comes later.",
    tag: "Beginner",
  },
  {
    title: "Gain Staging for Drop Tunings",
    href: "/blog/gain-staging-drop-tunings",
    blurb:
      "Gain staging is the practice of controlling where your signal clips. In drop tunings with heavier strings, the stages need to be managed differently. Here's how.",
    tag: "Gain staging",
  },
  {
    title: "Tube Screamer Before a High-Gain Amp",
    href: "/blog/tube-screamer-before-high-gain-amp",
    blurb:
      "The gain-stacking technique. Why the TS in front of a cranked Marshall works, what the pedal is doing that the amp can't do alone, and how to set each.",
    tag: "Gain stacking",
  },
];

const IMPEDANCE_BUFFERS: GuideEntry[] = [
  {
    title: "Impedance, Buffers, and Fuzz",
    href: "/blog/impedance-buffers-fuzz",
    blurb:
      "Why a Fuzz Face wants to see your guitar's actual output impedance, and why a buffer in front kills it. The circuit relationship between pickup, pedal, and amp input.",
    tag: "Impedance",
  },
  {
    title: "Buffer Myth: Buffered Bypass",
    href: "/blog/buffer-myth-buffered-bypass",
    blurb:
      "The Boss / Ibanez / Line 6 buffered bypass reputation problem. What buffering actually does to your signal, and when it's a feature vs a bug.",
    tag: "Buffers",
  },
  {
    title: "Buffer vs True Bypass Looper",
    href: "/blog/buffer-vs-true-bypass-looper",
    blurb:
      "Adding a buffer pedal vs a true-bypass loop. When each approach fits a specific pedalboard, with the measurements.",
    tag: "Buffers",
  },
  {
    title: "Does Cable Length Affect Tone?",
    href: "/blog/does-cable-length-affect-tone",
    blurb:
      "The measurable way a 25-foot cable darkens tone vs a 10-foot cable. Capacitance, pickup inductance, and the resonant peak that shifts with cable length.",
    tag: "Cables",
  },
];

const INTEGRATION: GuideEntry[] = [
  {
    title: "4-Wire Method Explained",
    href: "/blog/4-wire-method-explained",
    blurb:
      "How to loop your modeler's time-based effects into a real tube amp's effects loop so the amp's preamp-AND-power-amp stay in the signal path.",
    tag: "Modeler + amp",
  },
  {
    title: "Looper + Delay + Reverb Signal Chain",
    href: "/blog/looper-delay-reverb-signal-chain",
    blurb:
      "The ambient player's signal chain. Why the looper sits after the delay and before the reverb — unless you want the opposite sound, which is also valid.",
    tag: "Ambient",
  },
  {
    title: "Volume Pedal Dynamics Control",
    href: "/blog/volume-pedal-dynamics-control",
    blurb:
      "Where to put the volume pedal and why. Expression control, volume swells, and why the placement changes how the swell sounds.",
    tag: "Routing",
  },
  {
    title: "EQ Pedal Placement",
    href: "/blog/eq-pedal-placement",
    blurb:
      "Before the amp, in the effects loop, or at the end of the chain? The three placements do three different things — and only one is what most players think they want.",
    tag: "EQ routing",
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

export default function SignalChainPillarPage() {
  const allGuides = [...ORDER_AND_STAGING, ...IMPEDANCE_BUFFERS, ...INTEGRATION];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Signal Chain Fundamentals",
    description:
      "The engineering behind guitar tone — pedal order, gain staging, impedance matching, buffers, and routing principles that apply to every rig.",
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
            Signal Chain Fundamentals
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            Every guitar tone is a sequence of electrical interactions. When
            you understand what&apos;s happening between each pedal, amp, and
            speaker — not just what goes where — you stop copying signal
            chains and start building them.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">
            The engineering, not the mythology
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            Most signal-chain advice is pattern-matching: &ldquo;put your
            overdrive before the modulation, put the modulation in the
            effects loop, never put reverb before distortion.&rdquo; These
            rules are usually correct, but the reader who only knows the
            rules can&apos;t tell when to break them.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Signal-chain reasoning is about what each stage does to the
            signal: what frequencies get amplified, what impedance gets
            presented to the next stage, where clipping happens, what gets
            preserved vs lost. Once you have that framework, the rules
            become obvious — and the exceptions become obvious too.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            The guides below are first-principles. They explain the
            &ldquo;why&rdquo; behind every rule in the canonical signal
            chain.
          </p>
        </section>

        <Section
          title="Order and gain staging"
          blurb="Where each pedal lives in the chain and why. How clipping at one stage affects the stages downstream."
          guides={ORDER_AND_STAGING}
        />

        <Section
          title="Impedance, buffers, and cables"
          blurb="The electrical side. What your pickup actually is (high-impedance source), what it wants to see, and where the mismatches happen."
          guides={IMPEDANCE_BUFFERS}
        />

        <Section
          title="Integration and routing"
          blurb="Modern rigs — modeler into amp, effects-loop placement, volume-pedal placement, EQ-pedal placement. The routing decisions that don't fit in a bullet list."
          guides={INTEGRATION}
        />

        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/guides/pedal-settings-guides"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Pedal settings guides</h3>
              <p className="mt-2 text-xs text-muted">
                The pedals themselves. Signal chain rules tell you where each one goes; the settings guides tell you how to dial them.
              </p>
            </Link>
            <Link
              href="/guides/amp-settings-and-tone"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Amp settings & tone</h3>
              <p className="mt-2 text-xs text-muted">
                The platform the signal chain runs into. Every amp has its own gain-staging preference.
              </p>
            </Link>
            <Link
              href="/guides/modeler-mastery"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Modeler mastery</h3>
              <p className="mt-2 text-xs text-muted">
                Digital signal chains have their own rules — buffered by default, parallel routing cheap, impedance irrelevant.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            One signal-chain deep dive every week
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Tone of the Week — free, every Friday. One new signal-chain
            breakdown, one tone recipe, one quick tip.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              How recipes are built
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
