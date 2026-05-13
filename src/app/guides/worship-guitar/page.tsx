import type { Metadata } from "next";
import PillarHub from "@/components/guides/PillarHub";

/**
 * Pillar VI — Worship Guitar.
 */

export const metadata: Metadata = {
  title: "Worship Guitar — Live Rigs, Sunday Mornings, and Analog Warmth",
  description:
    "Worship guitar tone from first principles. AC30 + Klon + delays + shimmer. Live rigs, in-ear mix workflow, pedalboard organization, and how to dial the Hillsong/Bethel/Elevation sound on whatever gear you own.",
};

const TONE_FOUNDATIONS = [
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

const LIVE_RIG = [
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
      <PillarHub
        crumb="Worship"
        kicker={["Pillar Guide", "Volume 06"]}
        title="Worship Guitar"
        lede="The Sunday morning rig — present without being prominent, dynamic without being distracting, big without being loud."
        intro={
          <>
            <p
              className="text-base leading-relaxed md:text-lg"
              style={{ color: "var(--ink)" }}
            >
              Modern worship guitar sounds like it does because a handful of
              elements show up across almost every church and record. A Vox
              AC30 or AC30-adjacent amp model. A transparent boost — Klon,
              Tumnus, or similar. A dotted-eighth-note delay, tempo-locked.
              Plate reverb. A shimmer effect for pads. Those five elements
              handle 90% of what you hear from Elevation, Hillsong, Bethel,
              Passion, and most A/B-tier worship songs.
            </p>
            <p
              className="mt-4 text-base leading-relaxed md:text-lg"
              style={{ color: "var(--ink)" }}
            >
              What separates a great worship guitarist isn&apos;t the pedals.
              It&apos;s the knob positions, the structural use of delay
              (rhythmic, not decorative), and the live-mix awareness that
              keeps the guitar present without fighting the band.
            </p>
            <p
              className="mt-4 text-sm italic md:text-base"
              style={{
                color: "var(--ink-muted)",
                fontFamily: "var(--font-display)",
              }}
            >
              Nathan Cross — who writes most of our worship content — is a
              working worship guitarist in mid-sized churches. The guides
              here reflect a Sunday morning reality, not a bedroom studio.
            </p>
          </>
        }
        sections={[
          {
            mark: "¤",
            title: "Tone foundations",
            meta: "Amp · OD · delay · reverb",
            entries: TONE_FOUNDATIONS,
          },
          {
            mark: "§",
            title: "Live rig & workflow",
            meta: "Pedalboard · modeler · in-ears",
            entries: LIVE_RIG,
          },
        ]}
        cta={{
          kicker: "From the catalog",
          title: "The Worship Set Pack",
          body: "One Helix preset, 8 snapshots, 30 worship songs mapped to snapshots. AC30 + Klon + delays + shimmer, dialed and ready. One-time $19, yours to keep.",
          button: { href: "/set-packs/worship", label: "See the Set Pack" },
        }}
        related={[
          {
            href: "/guides/pedal-settings-guides",
            title: "Pedal settings guides",
            blurb:
              "Klon, delay, reverb — the settings guides for every pedal in the worship stack.",
          },
          {
            href: "/guides/amp-settings-and-tone",
            title: "Amp settings & tone",
            blurb:
              "The AC30 breakdown and its modeler equivalents. The amp that makes worship guitar sound like worship guitar.",
          },
          {
            href: "/guides/modeler-mastery",
            title: "Modeler mastery",
            blurb:
              "Most worship rigs are Helix- or HX Stomp-based. The modeler pillar covers them all.",
          },
        ]}
      />
    </>
  );
}
