import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/** Pillar VII — Bedroom & Home Recording. */

export const metadata: Metadata = {
  title: "Bedroom & Home Recording — Great Tone in Small Spaces",
  description:
    "Headphone rigs, direct recording, quiet pedalboards, parent-player practice frameworks, and bedroom-volume tone guides for players who don't have two hours and a dedicated music room.",
};

const CONSTRAINT_TONE = [
  { title: "20-Minute Practice Session", href: "/blog/20-minute-practice-session", blurb: "Elena Ruiz's framework for players with kids, jobs, and limited time. One-change-per-session, structured listening, and the audible-improvement principle.", tag: "Practice" },
  { title: "Peavey 5150 at Bedroom Volume", href: "/blog/peavey-5150-bedroom-volume", blurb: "How to dial a 120W metal amp so it doesn't sound embarrassing at apartment-friendly volumes. Three use-case settings with knob positions.", tag: "Low volume" },
];

const DIRECT_AND_HEADPHONE = [
  { title: "Best FRFR Speakers for Modelers", href: "/blog/best-frfr-speakers-for-modelers", blurb: "FRFR (full-range flat-response) speakers for home use. What to look for at each budget tier, and why a good FRFR matters for bedroom tone with a modeler.", tag: "Speakers" },
  { title: "FRFR vs Guitar Cab for Modelers", href: "/blog/frfr-vs-guitar-cab-for-modelers", blurb: "The home-use tradeoff: FRFR gives you the accurate sound you dialed; a guitar cab gives you the amp-in-the-room feel. When each one is right.", tag: "Speakers" },
  { title: "Fix Thin Modeler Tone", href: "/blog/fix-thin-modeler-tone", blurb: "The 'sounds fizzy in headphones' complaint, solved. Where the thinness comes from and the five changes that fix it.", tag: "Headphones" },
];

const HOME_PRODUCTION = [
  { title: "My Bloody Valentine Loveless Tone", href: "/blog/my-bloody-valentine-loveless-tone", blurb: "The original bedroom-recording masterclass. Four-track layering, glide guitar technique, stereo panning, and how to approach it with modern tools.", tag: "Production" },
  { title: "Shoegaze Wall of Sound Recipe", href: "/blog/shoegaze-wall-of-sound-recipe", blurb: "How to build the shoegaze tone from first principles — reverb, fuzz, tremolo arm, volume swells, and the stereo field.", tag: "Production" },
  { title: "Neo-Shoegaze Tone", href: "/blog/neo-shoegaze-tone", blurb: "Nothing, Whirr, Deafheaven-adjacent — the updated shoegaze palette with modern production context. Dev Okonkwo's home-recording framework.", tag: "Production" },
  { title: "Nothing Band Guitar Tone", href: "/blog/nothing-band-guitar-tone", blurb: "Will Yip production deconstructed. Drop tunings, specific fuzz placement, and why the room compression you can't replicate at home is the 10% that doesn't matter.", tag: "Production" },
  { title: "Jack White Lo-Fi Garage Tone", href: "/blog/jack-white-lo-fi-garage-tone", blurb: "Getting the White Stripes sound with one guitar, no drummer, and a small room. Lo-fi as an aesthetic decision, not an accident.", tag: "Lo-fi" },
];

export default function BedroomPillarPage() {
  const allGuides = [...CONSTRAINT_TONE, ...DIRECT_AND_HEADPHONE, ...HOME_PRODUCTION];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bedroom & Home Recording",
    description:
      "Fader & Knob's home-setup pillar — constraint-based tone, headphone and FRFR rigs, bedroom-volume techniques, and home production workflows.",
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
        crumb="Bedroom"
        kicker={["Pillar Guide", "Volume 07"]}
        title="Bedroom & Home Recording"
        lede="Headphone rigs, direct recording, quiet pedalboards, and bedroom-volume tone for players who don't have two hours and a dedicated music room."
        sections={[
          { mark: "¤", title: "Constraint-based tone", meta: "Time · volume · space", entries: CONSTRAINT_TONE },
          { mark: "§", title: "Direct & headphone rigs", meta: "FRFR · IRs · cans", entries: DIRECT_AND_HEADPHONE },
          { mark: "▪", title: "Home production", meta: "Shoegaze · lo-fi · DAW", entries: HOME_PRODUCTION },
        ]}
        related={[
          { href: "/guides/modeler-mastery", title: "Modeler mastery", blurb: "Bedroom tone almost always means modeler + headphones. The modeler pillar covers the platforms in depth." },
          { href: "/guides/tone-troubleshooting", title: "Tone troubleshooting", blurb: "Most bedroom tone problems are diagnosable — fizz, mud, lack of body. The troubleshooting pillar has the fixes." },
          { href: "/guides/signal-chain-fundamentals", title: "Signal chain fundamentals", blurb: "Why a recording-friendly signal chain is different from a stage-friendly one." },
        ]}
      />
    </>
  );
}
