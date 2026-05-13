import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/** Pillar III — Amp Settings & Tone. */

export const metadata: Metadata = {
  title: "Amp Settings Guide — From Blackface to 5150",
  description:
    "How to dial every canonical amp — Plexi, JCM800, AC30, Deluxe Reverb, Twin, Bassman, 5150 — for its signature voice. Settings, reasoning, and why each amp sounds like itself.",
};

const CLEAN_CRUNCH = [
  { title: "Fender Deluxe Reverb Settings", href: "/blog/fender-deluxe-reverb-settings", blurb: "The studio amp. Where the sweet spot lives, why the vibrato channel isn't actually tremolo, and the rig that Mayer built a career on.", tag: "Blackface" },
  { title: "Fender Deluxe Reverb vs. Tonemaster", href: "/blog/fender-deluxe-reverb-vs-tonemaster", blurb: "Does the solid-state Tonemaster actually beat the tube original for studio work? We did the A/B.", tag: "Comparison" },
  { title: "Vox AC30 Settings Guide", href: "/blog/vox-ac30-settings-guide", blurb: "The chime. Why Cut is backwards (up cuts treble), Top Boost vs Normal channel choice, and the Tom Petty rhythm sound.", tag: "British class A" },
  { title: "Vox AC30 Cut Knob Explained", href: "/blog/vox-ac30-cut-knob-explained", blurb: "A deeper dive on the single most misunderstood knob on the British clean amp.", tag: "Deep dive" },
  { title: "Roland JC-120 Settings Guide", href: "/blog/roland-jc-120-settings-guide", blurb: "The transistor amp that actually worked. Chorus settings, why it's Andy Summers's only amp, and how to stop it from sounding sterile.", tag: "Solid state" },
];

const BRITISH_HIGH_GAIN = [
  { title: "JCM800 Settings Guide", href: "/blog/jcm800-settings-guide", blurb: "The 80s metal and hard rock backbone. Why gain at 4 with master cranked sounds different from gain at 8 with master low.", tag: "Marshall" },
  { title: "Peavey 5150 Settings Guide", href: "/blog/peavey-5150-settings-guide", blurb: "The metal amp. Pre gain vs post gain, why scooping mids in isolation kills you in a mix.", tag: "Metal" },
  { title: "Peavey 5150 at Bedroom Volume", href: "/blog/peavey-5150-bedroom-volume", blurb: "How to get a 120W head to sound right at apartment-friendly volumes. Three use-case settings with knob positions.", tag: "Bedroom" },
  { title: "Power Tube Saturation Explained", href: "/blog/power-tube-saturation-explained", blurb: "What class AB push-pull does to harmonics, where the 'warmth' of a cranked Plexi actually comes from, and why every guitar amp sounds different at volume.", tag: "Theory" },
];

const ATTEN_UTIL = [
  { title: "Reactive vs Resistive Attenuators", href: "/blog/reactive-vs-resistive-attenuators", blurb: "Why the attenuator you pick shapes the tone. How a real speaker cab's impedance curve differs from a dummy load, and what that does to the output transformer.", tag: "Attenuators" },
  { title: "Tube Amp Attenuator Limits (Lower Wattage)", href: "/blog/tube-amp-attenuator-limits-lower-wattage", blurb: "The hidden costs of running a low-wattage amp through an attenuator. At some point you're better off with the power soak removed.", tag: "Attenuators" },
  { title: "4-Wire Method Explained", href: "/blog/4-wire-method-explained", blurb: "How to loop your modeler's effects into a real tube amp so your amp's preamp-AND-power-amp stay in the signal path.", tag: "Integration" },
  { title: "Amp Gain, Volume, Master Controls", href: "/blog/amp-gain-volume-master-controls", blurb: "The three volume knobs and what each one actually controls — Channel Volume, Master Volume, and Output Volume on modern amps.", tag: "Theory" },
];

const AMP_TYPES = [
  { title: "Complete Guide to Guitar Amp Types", href: "/blog/complete-guide-guitar-amp-types", blurb: "Tube vs solid state, class A vs class AB, single-ended vs push-pull. What the labels actually mean and how they shape tone.", tag: "Primer" },
  { title: "Best Helix Amp Models (Blues)", href: "/blog/best-helix-amp-models-blues", blurb: "Sean Nakamura's top picks for blues tone on the Helix. Underrated amp models and why they work for blues specifically.", tag: "Modeler" },
  { title: "10 Helix Amp Models (Underrated)", href: "/blog/10-helix-amp-models-underrated", blurb: "Helix has 40+ amp models and most players use the same 5. Here are 10 you should open up today.", tag: "Modeler" },
];

export default function AmpSettingsPillarPage() {
  const allAmps = [...CLEAN_CRUNCH, ...BRITISH_HIGH_GAIN, ...ATTEN_UTIL, ...AMP_TYPES];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Amp Settings & Tone",
    description:
      "Fader & Knob's canonical amp reference — blackface Fender, British Vox and Marshall, American high-gain, solid-state, attenuators, and the theory behind each amp's voice.",
    hasPart: allAmps.map((a) => ({ "@type": "Article", headline: a.title, url: `https://faderandknob.com${a.href}` })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PillarHub
        crumb="Amps"
        kicker={["Pillar Guide", "Volume 03"]}
        title="Amp Settings & Tone"
        lede="The canonical amps — Plexi, JCM800, AC30, Deluxe Reverb, Twin, Bassman, 5150 — and how to dial each one for the voice it was built to make."
        sections={[
          { mark: "¤", title: "Clean & crunch", meta: "Blackface · British · solid state", entries: CLEAN_CRUNCH },
          { mark: "§", title: "Marshall & high-gain", meta: "JCM800 · 5150 · theory", entries: BRITISH_HIGH_GAIN },
          { mark: "¶", title: "Attenuators & integration", meta: "Power soak · 4CM · gain knobs", entries: ATTEN_UTIL },
          { mark: "▪", title: "Amp types & modeler picks", meta: "Theory · Helix models", entries: AMP_TYPES },
        ]}
        related={[
          { href: "/guides/pedal-settings-guides", title: "Pedal settings guides", blurb: "The drives, fuzzes, and modulations that sit in front of these amps. The amp is half the tone — the pedal stack is the other half." },
          { href: "/guides/modeler-mastery", title: "Modeler mastery", blurb: "Every amp on this page is in your Helix or Quad Cortex. The modeler pillar covers how to find them." },
          { href: "/guides/signal-chain-fundamentals", title: "Signal chain fundamentals", blurb: "Why order matters. Where the amp sits in the chain and what feeds it determines the rest." },
        ]}
      />
    </>
  );
}
