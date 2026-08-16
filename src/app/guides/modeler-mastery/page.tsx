import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/**
 * Pillar IV — Modeler Mastery.
 */

export const metadata: Metadata = {
  alternates: { canonical: "/guides/modeler-mastery" },
  title: "Modeler Mastery — Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana",
  description:
    "Deep dives on every major modeler platform: amp model picks, preset-building workflow, cab IRs, capture fundamentals, and how to get real tone out of digital.",
};

const CHOICE = [
  { title: "Helix vs Quad Cortex", href: "/blog/helix-vs-quad-cortex", blurb: "The head-to-head. Where each platform actually wins, where they're indistinguishable, and which one you should buy based on how you work.", tag: "Comparison" },
  { title: "Helix vs Quad Cortex vs Kemper", href: "/blog/helix-vs-quad-cortex-vs-kemper", blurb: "Adding Kemper to the fight. Capture-based vs model-based, and why the distinction matters for workflow more than tone.", tag: "Comparison" },
  { title: "Kemper Profiles vs Helix Models", href: "/blog/kemper-profiles-vs-helix-models", blurb: "Captures of specific amps (Kemper) vs algorithmic models of amp types (Helix). Which one fits your tone-finding process?", tag: "Comparison" },
  { title: "Line 6 Helix Family Compared", href: "/blog/line-6-helix-family-compared", blurb: "HX Stomp vs HX Effects vs Helix LT vs Helix Floor vs Helix Rack. What you're buying, what you're leaving on the table.", tag: "Helix lineup" },
  { title: "HX Stomp vs Helix LT for Worship", href: "/blog/hx-stomp-vs-helix-lt-worship", blurb: "The two most common worship modelers. Nathan Cross on which is better for Sunday morning.", tag: "Worship" },
  { title: "Best Modeler Under $500", href: "/blog/best-modeler-under-500", blurb: "The tier where most players actually shop. Budget modeler comparison with honest tradeoffs.", tag: "Budget" },
  { title: "Modeler vs Tube Amp Shootout", href: "/blog/modeler-vs-tube-amp-shootout", blurb: "Can a good modeler actually replace a tube amp? Spec-level analysis plus the listening test.", tag: "Theory" },
];

const WORKFLOW = [
  { title: "How to Dial In Modeler Tone", href: "/blog/how-to-dial-in-modeler-tone", blurb: "The process. Where to start, what to tweak first, what almost never moves, and the order of operations that gets you to a finished preset fastest.", tag: "Workflow" },
  { title: "Quad Cortex Preset from Scratch", href: "/blog/quad-cortex-preset-from-scratch", blurb: "Sean Nakamura builds a usable preset on a blank patch. Input metering, cab IR choice, reference-track A/B comparison.", tag: "QC workflow" },
  { title: "Level Match Modeler Presets", href: "/blog/level-match-modeler-presets", blurb: "The single biggest mistake in preset tweaking: comparing unequal volumes. How to level-match so your ears aren't lying to you.", tag: "Workflow" },
  { title: "Modeler Preset Sounds Different Live", href: "/blog/modeler-preset-sounds-different-live", blurb: "Why the preset you dialed at home doesn't translate at the gig — and the five changes that fix it.", tag: "Live" },
  { title: "Fix Thin Modeler Tone", href: "/blog/fix-thin-modeler-tone", blurb: 'The "sounds fizzy" complaint, solved. Cab IRs, gain staging, EQ cuts, and the one Helix global setting most players miss.', tag: "Troubleshooting" },
  { title: "Modeler EQ Guide", href: "/blog/modeler-eq-guide", blurb: "Post-amp parametric EQ on a modeler — what each band does, where to cut, and the curves that salvage a difficult room.", tag: "EQ" },
];

const IR_SPEAKER = [
  { title: "Helix IR Shootout", href: "/blog/helix-ir-shootout", blurb: "Ownhammer vs ML Sound Lab vs Mesa official vs stock Helix cabs. Honest A/B comparison with the spectrograms.", tag: "IRs" },
  { title: "Helix Cab IR Pairings", href: "/blog/helix-cab-ir-pairings", blurb: "Which IRs pair best with which Helix amp models. The Essex A30 needs a different cab than the Fortin NTS.", tag: "IRs" },
  { title: "Impulse Response (IR) Guide", href: "/blog/impulse-response-ir-guide", blurb: "What an IR actually is, why they work, and where they fall short. The theory, without the marketing.", tag: "IR theory" },
  { title: "TONEX Tone Models Guide", href: "/blog/tonex-tone-models-guide", blurb: "IK Multimedia's capture platform. What makes the TONEX capture approach different, and the best Tone Models to start with.", tag: "TONEX" },
  { title: "Best FRFR Speakers for Modelers", href: "/blog/best-frfr-speakers-for-modelers", blurb: "The speaker side of the modeler equation. Full-range flat-response options reviewed for home, stage, and studio.", tag: "FRFR" },
  { title: "FRFR vs Guitar Cab for Modelers", href: "/blog/frfr-vs-guitar-cab-for-modelers", blurb: "When an FRFR speaker works best vs when you should go 4-cable-method into a real guitar cab. Workflow-dependent.", tag: "FRFR" },
];

const PLATFORM_SPECIFIC = [
  { title: "Best Helix Amp Models (Blues)", href: "/blog/best-helix-amp-models-blues", blurb: "Top Helix amp models for blues, including underrated ones. Specific starter settings for each.", tag: "Helix picks" },
  { title: "10 Helix Amp Models (Underrated)", href: "/blog/10-helix-amp-models-underrated", blurb: "Helix has 40+ amp models and most players use 5. Here are 10 that deserve more stage time.", tag: "Helix picks" },
  { title: "Best Katana Settings (Tube Amp-Like)", href: "/blog/best-katana-settings-tube-amp", blurb: "How to dial the Boss Katana so it doesn't sound like a Boss Katana. Tube-amp-adjacent settings and the effect chain you need.", tag: "Katana" },
  { title: "Boss Katana Hidden Settings", href: "/blog/boss-katana-hidden-settings", blurb: "The settings Boss didn't put on the front panel — deep-menu tweaks that change how the amp feels and sounds.", tag: "Katana" },
];

export default function ModelerMasteryPillarPage() {
  const allGuides = [...CHOICE, ...WORKFLOW, ...IR_SPEAKER, ...PLATFORM_SPECIFIC];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modeler Mastery",
    description:
      "Fader & Knob's complete guide to digital amp modelers — Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana. Platform comparisons, workflow, IRs, and real-world integration.",
    hasPart: allGuides.map((g) => ({ "@type": "Article", headline: g.title, url: `https://faderandknob.com${g.href}` })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PillarHub
        crumb="Modeler"
        kicker={["Pillar Guide", "Volume 04"]}
        title="Modeler Mastery"
        lede="Helix, Quad Cortex, TONEX, Fractal, Kemper, and Boss Katana. Which to buy, how to build presets that sound like the target, and how to make a modeler work in rooms, on stages, and in recording sessions."
        intro={
          <>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--ink)" }}>
              The modeler market has consolidated around three philosophies. Algorithmic modeling
              (Helix, Fractal, IK AmpliTube) simulates the circuit topology of a reference amp;
              you get a model of a type. Capture-based platforms (Kemper, Quad Cortex, TONEX)
              record the impulse response of a specific amp in a specific room; you get a
              snapshot of one amp. Hybrid (Quad Cortex) combines both.
            </p>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "var(--ink)" }}>
              The right choice depends less on raw sound quality — all the top platforms are past
              the &ldquo;indistinguishable in a mix&rdquo; threshold — and more on workflow. Do you
              want to dial amps like an engineer or swap captures like a DJ? Do you need the
              modeler to be the whole rig or just the preamp into your tube amp? Do you gig or
              only record? The guides below address each.
            </p>
          </>
        }
        sections={[
          { mark: "¤", title: "Picking a modeler", meta: "Comparisons · budget · workflow", entries: CHOICE },
          { mark: "§", title: "Preset-building", meta: "Process · level · EQ", entries: WORKFLOW },
          { mark: "¶", title: "IRs & speakers", meta: "Cab IRs · FRFR · pairings", entries: IR_SPEAKER },
          { mark: "▪", title: "Platform-specific", meta: "Helix · Katana picks", entries: PLATFORM_SPECIFIC },
        ]}
        related={[
          { href: "/guides/artist-tone-recipes", title: "Artist tone recipes", blurb: "Every recipe ships the Helix / QC / TONEX / Fractal / Kemper / Katana translation for that tone." },
          { href: "/guides/amp-settings-and-tone", title: "Amp settings & tone", blurb: "The amps the modelers are modeling. Understanding the source makes the model choices obvious." },
          { href: "/platforms", title: "Platform pages", blurb: "Platform-specific landing pages with the full recipe-to-amp-model mappings." },
        ]}
      />
    </>
  );
}
