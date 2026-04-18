import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #4: Modeler Mastery.
 *
 * Platform-specific deep dives for Helix, Quad Cortex, TONEX, Fractal,
 * Kemper, and Boss Katana. Covers the choice (which modeler for whom),
 * the workflow (building presets from scratch, matching amp captures),
 * and the integration (modeler into tube amp, FRFR speakers, IRs).
 */

export const metadata: Metadata = {
  title: "Modeler Mastery — Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana",
  description:
    "Deep dives on every major modeler platform: amp model picks, preset-building workflow, cab IRs, capture fundamentals, and how to get real tone out of digital.",
};

interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

const CHOICE: GuideEntry[] = [
  {
    title: "Helix vs Quad Cortex",
    href: "/blog/helix-vs-quad-cortex",
    blurb:
      "The head-to-head. Where each platform actually wins, where they're indistinguishable, and which one you should buy based on how you work.",
    tag: "Comparison",
  },
  {
    title: "Helix vs Quad Cortex vs Kemper",
    href: "/blog/helix-vs-quad-cortex-vs-kemper",
    blurb:
      "Adding Kemper to the fight. Capture-based vs model-based, and why the distinction matters for workflow more than tone.",
    tag: "Comparison",
  },
  {
    title: "Kemper Profiles vs Helix Models",
    href: "/blog/kemper-profiles-vs-helix-models",
    blurb:
      "Captures of specific amps (Kemper) vs algorithmic models of amp types (Helix). Which one fits your tone-finding process?",
    tag: "Comparison",
  },
  {
    title: "Line 6 Helix Family Compared",
    href: "/blog/line-6-helix-family-compared",
    blurb:
      "HX Stomp vs HX Effects vs Helix LT vs Helix Floor vs Helix Rack. What you're buying, what you're leaving on the table.",
    tag: "Helix lineup",
  },
  {
    title: "HX Stomp vs Helix LT for Worship",
    href: "/blog/hx-stomp-vs-helix-lt-worship",
    blurb:
      "The two most common worship modelers. Nathan Cross on which is better for Sunday morning.",
    tag: "Worship",
  },
  {
    title: "Best Modeler Under $500",
    href: "/blog/best-modeler-under-500",
    blurb:
      "The tier where most players actually shop. Budget modeler comparison with honest tradeoffs.",
    tag: "Budget",
  },
  {
    title: "Modeler vs Tube Amp Shootout",
    href: "/blog/modeler-vs-tube-amp-shootout",
    blurb:
      "Can a good modeler actually replace a tube amp? Spec-level analysis plus the listening test.",
    tag: "Theory",
  },
];

const WORKFLOW: GuideEntry[] = [
  {
    title: "How to Dial In Modeler Tone",
    href: "/blog/how-to-dial-in-modeler-tone",
    blurb:
      "The process. Where to start, what to tweak first, what almost never moves, and the order of operations that gets you to a finished preset fastest.",
    tag: "Workflow",
  },
  {
    title: "Quad Cortex Preset from Scratch",
    href: "/blog/quad-cortex-preset-from-scratch",
    blurb:
      "Sean Nakamura builds a usable preset on a blank patch. Input metering, cab IR choice, reference-track A/B comparison.",
    tag: "QC workflow",
  },
  {
    title: "Level Match Modeler Presets",
    href: "/blog/level-match-modeler-presets",
    blurb:
      "The single biggest mistake in preset tweaking: comparing unequal volumes. How to level-match so your ears aren't lying to you.",
    tag: "Workflow",
  },
  {
    title: "Modeler Preset Sounds Different Live",
    href: "/blog/modeler-preset-sounds-different-live",
    blurb:
      "Why the preset you dialed at home doesn't translate at the gig — and the five changes that fix it.",
    tag: "Live",
  },
  {
    title: "Fix Thin Modeler Tone",
    href: "/blog/fix-thin-modeler-tone",
    blurb:
      "The \"sounds fizzy\" complaint, solved. Cab IRs, gain staging, EQ cuts, and the one Helix global setting most players miss.",
    tag: "Troubleshooting",
  },
  {
    title: "Modeler EQ Guide",
    href: "/blog/modeler-eq-guide",
    blurb:
      "Post-amp parametric EQ on a modeler — what each band does, where to cut, and the curves that salvage a difficult room.",
    tag: "EQ",
  },
];

const IR_SPEAKER: GuideEntry[] = [
  {
    title: "Helix IR Shootout",
    href: "/blog/helix-ir-shootout",
    blurb:
      "Ownhammer vs ML Sound Lab vs Mesa official vs stock Helix cabs. Honest A/B comparison with the spectrograms.",
    tag: "IRs",
  },
  {
    title: "Helix Cab IR Pairings",
    href: "/blog/helix-cab-ir-pairings",
    blurb:
      "Which IRs pair best with which Helix amp models. The Essex A30 needs a different cab than the Fortin NTS.",
    tag: "IRs",
  },
  {
    title: "Impulse Response (IR) Guide",
    href: "/blog/impulse-response-ir-guide",
    blurb:
      "What an IR actually is, why they work, and where they fall short. The theory, without the marketing.",
    tag: "IR theory",
  },
  {
    title: "TONEX Tone Models Guide",
    href: "/blog/tonex-tone-models-guide",
    blurb:
      "IK Multimedia's capture platform. What makes the TONEX capture approach different, and the best Tone Models to start with.",
    tag: "TONEX",
  },
  {
    title: "Best FRFR Speakers for Modelers",
    href: "/blog/best-frfr-speakers-for-modelers",
    blurb:
      "The speaker side of the modeler equation. Full-range flat-response options reviewed for home, stage, and studio.",
    tag: "FRFR",
  },
  {
    title: "FRFR vs Guitar Cab for Modelers",
    href: "/blog/frfr-vs-guitar-cab-for-modelers",
    blurb:
      "When an FRFR speaker works best vs when you should go 4-cable-method into a real guitar cab. Workflow-dependent.",
    tag: "FRFR",
  },
];

const PLATFORM_SPECIFIC: GuideEntry[] = [
  {
    title: "Best Helix Amp Models (Blues)",
    href: "/blog/best-helix-amp-models-blues",
    blurb:
      "Top Helix amp models for blues, including underrated ones. Specific starter settings for each.",
    tag: "Helix picks",
  },
  {
    title: "10 Helix Amp Models (Underrated)",
    href: "/blog/10-helix-amp-models-underrated",
    blurb:
      "Helix has 40+ amp models and most players use 5. Here are 10 that deserve more stage time.",
    tag: "Helix picks",
  },
  {
    title: "Best Katana Settings (Tube Amp-Like)",
    href: "/blog/best-katana-settings-tube-amp",
    blurb:
      "How to dial the Boss Katana so it doesn't sound like a Boss Katana. Tube-amp-adjacent settings and the effect chain you need.",
    tag: "Katana",
  },
  {
    title: "Boss Katana Hidden Settings",
    href: "/blog/boss-katana-hidden-settings",
    blurb:
      "The settings Boss didn't put on the front panel — deep-menu tweaks that change how the amp feels and sounds.",
    tag: "Katana",
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

export default function ModelerMasteryPillarPage() {
  const allGuides = [...CHOICE, ...WORKFLOW, ...IR_SPEAKER, ...PLATFORM_SPECIFIC];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modeler Mastery",
    description:
      "Fader & Knob's complete guide to digital amp modelers — Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana. Platform comparisons, workflow, IRs, and real-world integration.",
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
            Modeler Mastery
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            Helix, Quad Cortex, TONEX, Fractal, Kemper, and Boss Katana.
            Which to buy, how to build presets that actually sound like the
            target, and how to make a modeler work in rooms, stages, and
            recording sessions.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">
            Modelers in 2026 — where each platform lives
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The modeler market has consolidated around three philosophies.
            <strong className="text-foreground">
              {" "}
              Algorithmic modeling
            </strong>{" "}
            (Helix, Fractal, IK AmpliTube) simulates the circuit topology of a
            reference amp; you get a model of a type.{" "}
            <strong className="text-foreground">Capture-based</strong> platforms
            (Kemper, Quad Cortex, TONEX) record the impulse response of a
            specific amp in a specific room; you get a snapshot of one amp.{" "}
            <strong className="text-foreground">Hybrid</strong> (Quad Cortex)
            combines both — use a capture or use the algorithmic model.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            The right choice depends less on raw sound quality (all the top
            platforms are past &ldquo;indistinguishable in a mix&rdquo;
            territory) and more on workflow. Do you want to dial amps like an
            engineer or swap captures like a DJ? Do you need the modeler to
            be the whole rig or just the preamp into your tube amp? Do you
            gig or only record? The guides below address each question.
          </p>
        </section>

        <Section
          title="Picking a modeler"
          blurb="Head-to-head comparisons, buying-decision guides, and honest takes on what each platform is actually good at."
          guides={CHOICE}
        />

        <Section
          title="Workflow and preset-building"
          blurb="How to actually dial in a modeler — not &ldquo;which amp model sounds best&rdquo; but &ldquo;which knob do I touch first, and when do I stop.&rdquo;"
          guides={WORKFLOW}
        />

        <Section
          title="IRs and speakers"
          blurb="The cab side of the signal chain. Which IRs pair with which amps, and the FRFR-vs-guitar-cab decision for live and home use."
          guides={IR_SPEAKER}
        />

        <Section
          title="Platform-specific picks"
          blurb="Deep dives on individual platforms — favorite amp models, hidden settings, and platform-specific pro tips."
          guides={PLATFORM_SPECIFIC}
        />

        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/guides/artist-tone-recipes"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Artist tone recipes</h3>
              <p className="mt-2 text-xs text-muted">
                Every recipe on the site includes the specific Helix / QC / TONEX / Fractal / Kemper / Katana translation for that tone.
              </p>
            </Link>
            <Link
              href="/guides/amp-settings-and-tone"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Amp settings & tone</h3>
              <p className="mt-2 text-xs text-muted">
                The amps that the modelers are modeling. Understanding the source makes the model choices obvious.
              </p>
            </Link>
            <Link
              href="/platforms"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Platform pages</h3>
              <p className="mt-2 text-xs text-muted">
                Platform-specific landing pages with the full recipe-to-amp-model mappings.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            New modeler guide every week
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Tone of the Week — free, every Friday. Helix, Quad Cortex, TONEX,
            Kemper — one new tutorial, one recipe, one tip.
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
