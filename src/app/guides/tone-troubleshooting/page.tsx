import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/** Pillar VIII — Tone Troubleshooting. */

export const metadata: Metadata = {
  title: "Tone Troubleshooting — Why Your Rig Sounds Wrong (and How to Fix It)",
  description:
    "Diagnostic guides for the tone problems every player hits — fizzy highs, thin sound, muddy delays, 60-cycle hum, pedal hiss, volume drops, washed-out reverb.",
};

const NOISE_AND_HUM = [
  { title: "How to Remove 60-Cycle Hum (Without a Noise Gate)", href: "/blog/how-to-remove-60-cycle-hum", blurb: "The five causes of 60-cycle hum, with a diagnostic flow. A noise gate treats the symptom; this guide finds the source.", tag: "Hum" },
  { title: "How to Stop Pedal Hiss", href: "/blog/how-to-stop-pedal-hiss", blurb: "Hiss that rides under the signal is different from hum — different cause, different fix. How to isolate and eliminate it.", tag: "Noise" },
  { title: "Cavity Shielding Test", href: "/blog/cavity-shielding-test", blurb: "Measurable hum reduction from copper-foil cavity shielding. When it helps and by how much — with the data.", tag: "Guitar" },
];

const TONE_PROBLEMS = [
  { title: "Why Modeler Tone Sounds Fizzy", href: "/blog/why-modeler-tone-sounds-fizzy", blurb: "The #1 complaint about digital amps. Five specific causes — IR mismatch, gain staging, upper-harmonic content, cab placement — and the fixes for each.", tag: "Modeler" },
  { title: "Fix Fizzy High-Gain", href: "/blog/fix-fizzy-high-gain", blurb: "Even real amps get fizzy under too much gain. What's causing it at the circuit level, and the EQ moves that restore clarity without losing aggression.", tag: "High-gain" },
  { title: "Fix Thin Modeler Tone", href: "/blog/fix-thin-modeler-tone", blurb: "When your modeler sounds like a DI with reverb on it. The missing elements that make a modeler feel 'amp-in-the-room' instead of 'through a pane of glass.'", tag: "Modeler" },
  { title: "Why Delay Sounds Muddy", href: "/blog/why-delay-sounds-muddy", blurb: "Delay muddiness isn't the delay — it's frequency stacking and feedback runaway. The two settings that fix 90% of muddy-delay complaints.", tag: "Delay" },
  { title: "Reverb Sounds Washed Out", href: "/blog/reverb-sounds-washed-out", blurb: "The classic 'too much reverb' problem is actually a mix problem. Pre-delay, high-frequency damping, and where reverb sits in the signal chain.", tag: "Reverb" },
];

const LEVEL_MATCHING = [
  { title: "Solo Patch Volume Drop Fix", href: "/blog/solo-patch-volume-drop-fix", blurb: "Your solo patch sounds killer in your bedroom and disappears in the mix. The four places where the volume drop is actually happening, and the correct fix for each.", tag: "Live" },
  { title: "Level Match Modeler Presets", href: "/blog/level-match-modeler-presets", blurb: "The single biggest mistake in preset tweaking. If your presets aren't level-matched, your ears are lying to you about which one sounds better.", tag: "Mixing" },
  { title: "Modeler Preset Sounds Different Live", href: "/blog/modeler-preset-sounds-different-live", blurb: "Why your home-dialed preset betrays you at the gig. Five environmental factors and the five preset-side adjustments that compensate.", tag: "Live" },
];

export default function TroubleshootingPillarPage() {
  const allGuides = [...NOISE_AND_HUM, ...TONE_PROBLEMS, ...LEVEL_MATCHING];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tone Troubleshooting",
    description:
      "Fader & Knob's diagnostic pillar — hum, hiss, fizz, mud, volume drops, washed reverb. Symptom-to-cause-to-fix for the tone problems every player hits.",
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
        crumb="Troubleshooting"
        kicker={["Pillar Guide", "Volume 08"]}
        title="Tone Troubleshooting"
        lede="Why your rig sounds wrong, and where to look. Symptom → cause → fix, structured as diagnostic flows rather than vague tone-tip lists."
        sections={[
          { mark: "¤", title: "Noise & hum", meta: "60Hz · hiss · shielding", entries: NOISE_AND_HUM },
          { mark: "§", title: "Tone problems", meta: "Fizz · thin · mud · wash", entries: TONE_PROBLEMS },
          { mark: "▪", title: "Levels & live", meta: "Volume drops · mixing", entries: LEVEL_MATCHING },
        ]}
        related={[
          { href: "/guides/signal-chain-fundamentals", title: "Signal chain fundamentals", blurb: "Most tone problems are signal-chain problems. This pillar is the diagnostic toolkit." },
          { href: "/guides/modeler-mastery", title: "Modeler mastery", blurb: "Fizz, thinness, and mismatch problems live on modelers specifically. The modeler pillar covers the platform-side fixes." },
          { href: "/guides/bedroom-and-home-recording", title: "Bedroom & home recording", blurb: "Small-room tone problems are their own category — close walls, headphone listening, low volume." },
        ]}
      />
    </>
  );
}
