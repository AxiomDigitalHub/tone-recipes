import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/** Pillar II — Pedal Settings Guides. */

export const metadata: Metadata = {
  title: "Pedal Settings Guides — Every Canonical Pedal, Dialed In",
  description:
    "Exact settings for Klon Centaur, Tube Screamer, Big Muff, RAT, DS-1, Blues Driver, and every other canonical pedal — with the reasoning for each knob position.",
  openGraph: {
    title: "Pedal Settings Guides | Fader & Knob",
    description: "How to dial every canonical pedal from clean boost to wall of fuzz.",
  },
};

const DRIVE = [
  { title: "Klon Centaur Settings Guide", href: "/blog/klon-centaur-settings-guide", blurb: "Hank Presswood cuts through the mythology with specific clock positions. The Treble knob is a high-pass filter for harshness, not a tone control.", tag: "Transparent" },
  { title: "Tube Screamer Settings Guide", href: "/blog/tube-screamer-settings-guide", blurb: "The mid-bump overdrive. Why Drive at 0 / Level at max through a cranked amp is the SRV and Eddie Van Halen-at-the-DL go-to.", tag: "Mid boost" },
  { title: "Blues Driver (BD-2) Settings Guide", href: "/blog/blues-driver-bd2-settings-guide", blurb: "The Boss that replaces a pushed Fender. Settings for vintage Fender breakup, light grit, and as a gain stack under the Klon.", tag: "Fender-style" },
  { title: "BD-2 vs BD-2W Waza Craft", href: "/blog/bd2-vs-bd2w-waza-craft", blurb: "Is the Waza mod worth it? A-B tested with specific differences in breakup character and EQ profile.", tag: "Comparison" },
  { title: "Tumnus Deluxe vs Klon KTR", href: "/blog/tumnus-deluxe-vs-klon-ktr", blurb: "Can a $150 clone hold up against a $300 boutique? Side-by-side with measurements.", tag: "Comparison" },
];

const DISTORTION = [
  { title: "Boss DS-1 Settings Guide", href: "/blog/boss-ds1-settings-guide", blurb: "The $50 pedal on Kurt Cobain's board. Why it works, what the Keeley mod actually does, and why it's still standard on metal boards.", tag: "Distortion" },
  { title: "RAT Pedal Settings Guide", href: "/blog/rat-pedal-settings-guide", blurb: "From Jeff Beck to Thom Yorke to Peter Koppes. Distortion/fuzz hybrid — the Filter knob is where the magic lives.", tag: "Distortion" },
  { title: "Big Muff Settings Guide", href: "/blog/big-muff-settings-guide", blurb: "The wall-of-fuzz classic. Ram's Head vs NYC reissue vs Sovtek tonal differences, and why Sustain at 25–35% beats maxed.", tag: "Fuzz" },
  { title: "Big Muff vs Fuzz Face", href: "/blog/big-muff-vs-fuzz-face", blurb: "Different fuzz circuits producing different sounds. When to reach for which, and why one cleans up with volume knob and the other doesn't.", tag: "Fuzz" },
  { title: "Germanium vs Silicon Fuzz", href: "/blog/germanium-vs-silicon-fuzz", blurb: "What the transistor material actually changes. Temperature sensitivity, dynamic response, and the cleanup-with-volume question.", tag: "Theory" },
];

const COMP_AMP = [
  { title: "Compressor Pedal Settings Guide", href: "/blog/compressor-pedal-settings-guide", blurb: "Ratio, threshold, attack, release — what each control actually does to your signal, and settings for country pickin', always-on, and parallel compression.", tag: "Compression" },
  { title: "Chicken Pickin Compressor Settings", href: "/blog/chicken-pickin-compressor-settings", blurb: "Carl Beckett's Nashville framework: fast attack, slow release, ratio around 4:1. Keep the snap, control the sustain.", tag: "Country" },
  { title: "JCM800 Settings Guide", href: "/blog/jcm800-settings-guide", blurb: "The 80s metal and hard rock backbone. Why gain at 4 with master cranked is a different sound than gain at 8 with master low.", tag: "Marshall" },
  { title: "Peavey 5150 Settings Guide", href: "/blog/peavey-5150-settings-guide", blurb: "The metal amp. Pre gain, post gain, and why scooping the mids in isolation sounds great and fails in a mix.", tag: "Metal" },
  { title: "Vox AC30 Settings Guide", href: "/blog/vox-ac30-settings-guide", blurb: "The chime. Why Cut is backwards (turning it up cuts treble, not boosts), Top Boost vs Normal channels, and the Tom Petty rhythm sound.", tag: "Vox" },
  { title: "Fender Deluxe Reverb Settings", href: "/blog/fender-deluxe-reverb-settings", blurb: "The studio amp that doesn't need a pedal. Where the sweet spot is, and why a Deluxe with a Klon is still the most reached-for clean lead rig in recording.", tag: "Fender" },
  { title: "Roland JC-120 Settings Guide", href: "/blog/roland-jc-120-settings-guide", blurb: "The transistor amp that worked. Chorus settings, why Andy Summers's clean tone only happens here, and how to stop it from sounding sterile.", tag: "Roland" },
];

const TIME_MOD = [
  { title: "Delay Pedal Settings Guide", href: "/blog/delay-pedal-settings-guide", blurb: "Time, feedback, mix — and why dotted eighth vs quarter note vs 3:4 polyrhythm is the difference between Edge, Gilmour, and a session guitarist.", tag: "Delay" },
  { title: "The Edge's Delay Settings", href: "/blog/the-edge-delay-settings", blurb: "Dotted eighth tempo-locked to the song. Three delays stacked. Where it comes from and the specific pedals he actually uses live.", tag: "Delay" },
  { title: "Stacking Reverbs Guide", href: "/blog/stacking-reverbs-guide", blurb: "Plate into hall into shimmer. When each reverb block contributes something, when they're fighting, and how to build an ambient rig that doesn't wash.", tag: "Reverb" },
];

export default function PedalSettingsGuidesPillarPage() {
  const allGuides = [...DRIVE, ...DISTORTION, ...COMP_AMP, ...TIME_MOD];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pedal Settings Guides",
    description:
      "Fader & Knob's canonical index of pedal settings guides — overdrive, distortion, fuzz, compression, delay, reverb — with the reasoning behind each setting.",
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
        crumb="Pedals"
        kicker={["Pillar Guide", "Volume 02"]}
        title="Pedal Settings Guides"
        lede="Every canonical pedal, broken down to exactly what each knob does and where to set it. No 'start at noon and taste.' Specific settings for specific outcomes, with the reasoning."
        intro={
          <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--ink)" }}>
            Every pedal guide on the site follows the same structure: what the pedal actually
            does to your signal (circuit-level), what each knob controls, starting settings for
            three or four use cases (clean boost, always-on, solo lift, etc.), and notes on how
            the pedal interacts with common amp and pickup combinations. Opinionated but
            specific — &ldquo;Drive at about 1 o&apos;clock&rdquo; not &ldquo;medium drive.&rdquo;
          </p>
        }
        sections={[
          { mark: "¤", title: "Drive & overdrive", meta: "Klon · TS · BD-2", entries: DRIVE },
          { mark: "§", title: "Distortion & fuzz", meta: "DS-1 · RAT · Big Muff", entries: DISTORTION },
          { mark: "¶", title: "Compression & amps", meta: "Comp · Marshall · AC30", entries: COMP_AMP },
          { mark: "▪", title: "Time & modulation", meta: "Delay · reverb · stacking", entries: TIME_MOD },
        ]}
        related={[
          { href: "/guides/amp-settings-and-tone", title: "Amp settings & tone", blurb: "The amp is half the tone. The pedal-stack is the other half. The amp pillar covers the back end of the chain." },
          { href: "/guides/signal-chain-fundamentals", title: "Signal chain fundamentals", blurb: "Where each pedal sits in the chain — drives before mods before reverb — and why the order matters." },
          { href: "/guides/modeler-mastery", title: "Modeler mastery", blurb: "Most of these pedals live as blocks inside a Helix or Quad Cortex. The modeler pillar covers them on the digital side." },
        ]}
      />
    </>
  );
}
