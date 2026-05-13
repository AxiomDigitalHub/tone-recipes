import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/** Pillar V — Signal Chain Fundamentals. */

export const metadata: Metadata = {
  title: "Signal Chain Fundamentals — The Engineering Behind Your Tone",
  description:
    "Pedal order, gain staging, impedance, true bypass vs buffered, parallel routing — the engineering principles that shape every guitar tone.",
};

const ORDER_AND_STAGING = [
  { title: "Signal Chain Order Guide", href: "/blog/signal-chain-order-guide", blurb: "Why the order of pedals matters. The canonical ordering (dynamics → gain → mod → time) explained from the circuit level — not just as a rule.", tag: "Order" },
  { title: "Beginner Signal Chains", href: "/blog/beginner-signal-chains", blurb: "The first five-pedal signal chain every player should understand before expanding. Why this starter chain is the template for everything that comes later.", tag: "Beginner" },
  { title: "Gain Staging for Drop Tunings", href: "/blog/gain-staging-drop-tunings", blurb: "Gain staging is the practice of controlling where your signal clips. In drop tunings with heavier strings, the stages need to be managed differently. Here's how.", tag: "Gain staging" },
  { title: "Tube Screamer Before a High-Gain Amp", href: "/blog/tube-screamer-before-high-gain-amp", blurb: "The gain-stacking technique. Why the TS in front of a cranked Marshall works, what the pedal is doing that the amp can't do alone, and how to set each.", tag: "Stacking" },
];

const IMPEDANCE_BUFFERS = [
  { title: "Impedance, Buffers, and Fuzz", href: "/blog/impedance-buffers-fuzz", blurb: "Why a Fuzz Face wants to see your guitar's actual output impedance, and why a buffer in front kills it. The circuit relationship between pickup, pedal, and amp input.", tag: "Impedance" },
  { title: "Buffer Myth: Buffered Bypass", href: "/blog/buffer-myth-buffered-bypass", blurb: "The Boss / Ibanez / Line 6 buffered bypass reputation problem. What buffering actually does to your signal, and when it's a feature vs a bug.", tag: "Buffers" },
  { title: "Buffer vs True Bypass Looper", href: "/blog/buffer-vs-true-bypass-looper", blurb: "Adding a buffer pedal vs a true-bypass loop. When each approach fits a specific pedalboard, with the measurements.", tag: "Buffers" },
  { title: "Does Cable Length Affect Tone?", href: "/blog/does-cable-length-affect-tone", blurb: "The measurable way a 25-foot cable darkens tone vs a 10-foot cable. Capacitance, pickup inductance, and the resonant peak that shifts with cable length.", tag: "Cables" },
];

const INTEGRATION = [
  { title: "4-Wire Method Explained", href: "/blog/4-wire-method-explained", blurb: "How to loop your modeler's time-based effects into a real tube amp's effects loop so the amp's preamp-AND-power-amp stay in the signal path.", tag: "Modeler + amp" },
  { title: "Looper + Delay + Reverb Signal Chain", href: "/blog/looper-delay-reverb-signal-chain", blurb: "The ambient player's signal chain. Why the looper sits after the delay and before the reverb — unless you want the opposite sound, which is also valid.", tag: "Ambient" },
  { title: "Volume Pedal Dynamics Control", href: "/blog/volume-pedal-dynamics-control", blurb: "Where to put the volume pedal and why. Expression control, volume swells, and why the placement changes how the swell sounds.", tag: "Routing" },
  { title: "EQ Pedal Placement", href: "/blog/eq-pedal-placement", blurb: "Before the amp, in the effects loop, or at the end of the chain? The three placements do three different things — and only one is what most players think they want.", tag: "EQ" },
];

export default function SignalChainPillarPage() {
  const allGuides = [...ORDER_AND_STAGING, ...IMPEDANCE_BUFFERS, ...INTEGRATION];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Signal Chain Fundamentals",
    description:
      "Fader & Knob's first-principles signal chain reference — pedal order, gain staging, impedance, buffers, and integration techniques.",
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
        crumb="Signal chain"
        kicker={["Pillar Guide", "Volume 05"]}
        title="Signal Chain Fundamentals"
        lede="Pedal order, gain staging, impedance, true bypass vs buffered. The engineering principles that shape every tone — and the ones that explain why your rig sounds the way it does."
        sections={[
          { mark: "¤", title: "Order & gain staging", meta: "Pedal order · stacking", entries: ORDER_AND_STAGING },
          { mark: "§", title: "Impedance & buffers", meta: "Pickup · cable · pedal", entries: IMPEDANCE_BUFFERS },
          { mark: "▪", title: "Integration & routing", meta: "4CM · loops · placement", entries: INTEGRATION },
        ]}
        related={[
          { href: "/guides/pedal-settings-guides", title: "Pedal settings guides", blurb: "Settings for individual pedals. This pillar is the theory; that one is the practice." },
          { href: "/guides/amp-settings-and-tone", title: "Amp settings & tone", blurb: "Where the signal chain ends. Amp behavior depends on what feeds it." },
          { href: "/guides/tone-troubleshooting", title: "Tone troubleshooting", blurb: "Most tone problems are signal-chain problems. The troubleshooting pillar is signal-chain debugging." },
        ]}
      />
    </>
  );
}
