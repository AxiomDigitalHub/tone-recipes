import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #3: Amp Settings & Tone.
 *
 * Canonical amp reference — blackface cleans, British crunch, American
 * high-gain, modern metal. One page that anchors the pillar and links to
 * every amp-specific settings guide on the site.
 */

export const metadata: Metadata = {
  title: "Amp Settings Guide — From Blackface to 5150",
  description:
    "How to dial every canonical amp — Plexi, JCM800, AC30, Deluxe Reverb, Twin, Bassman, 5150 — for its signature voice. Settings, reasoning, and why each amp sounds like itself.",
};

interface AmpEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

const CLEAN_CRUNCH: AmpEntry[] = [
  {
    title: "Fender Deluxe Reverb Settings",
    href: "/blog/fender-deluxe-reverb-settings",
    blurb:
      "The studio amp. Where the sweet spot lives, why the vibrato channel isn't actually tremolo, and the rig that Mayer built a career on.",
    tag: "Blackface",
  },
  {
    title: "Fender Deluxe Reverb vs. Tonemaster",
    href: "/blog/fender-deluxe-reverb-vs-tonemaster",
    blurb:
      "Does the solid-state Tonemaster actually beat the tube original for studio work? We did the A/B.",
    tag: "Comparison",
  },
  {
    title: "Vox AC30 Settings Guide",
    href: "/blog/vox-ac30-settings-guide",
    blurb:
      "The chime. Why Cut is backwards (up cuts treble), Top Boost vs Normal channel choice, and the Tom Petty rhythm sound.",
    tag: "British class A",
  },
  {
    title: "Vox AC30 Cut Knob Explained",
    href: "/blog/vox-ac30-cut-knob-explained",
    blurb:
      "A deeper dive on the single most misunderstood knob on the British clean amp.",
    tag: "Single-knob deep dive",
  },
  {
    title: "Roland JC-120 Settings Guide",
    href: "/blog/roland-jc-120-settings-guide",
    blurb:
      "The transistor amp that actually worked. Chorus settings, why it's Andy Summers's only amp, and how to stop it from sounding sterile.",
    tag: "Solid state clean",
  },
];

const BRITISH_HIGH_GAIN: AmpEntry[] = [
  {
    title: "JCM800 Settings Guide",
    href: "/blog/jcm800-settings-guide",
    blurb:
      "The 80s metal and hard rock backbone. Why gain at 4 with master cranked sounds different from gain at 8 with master low.",
    tag: "Master volume Marshall",
  },
  {
    title: "Peavey 5150 Settings Guide",
    href: "/blog/peavey-5150-settings-guide",
    blurb:
      "The metal amp. Pre gain vs post gain, why scooping mids in isolation kills you in a mix.",
    tag: "Metal high-gain",
  },
  {
    title: "Peavey 5150 at Bedroom Volume",
    href: "/blog/peavey-5150-bedroom-volume",
    blurb:
      "How to get a 120W head to sound right at apartment-friendly volumes. Three use-case settings with knob positions.",
    tag: "Bedroom-friendly",
  },
  {
    title: "Power Tube Saturation Explained",
    href: "/blog/power-tube-saturation-explained",
    blurb:
      "What class AB push-pull does to harmonics, where the 'warmth' of a cranked Plexi actually comes from, and why every guitar amp sounds different at volume.",
    tag: "Theory",
  },
];

const ATTEN_UTIL: AmpEntry[] = [
  {
    title: "Reactive vs Resistive Attenuators",
    href: "/blog/reactive-vs-resistive-attenuators",
    blurb:
      "Why the attenuator you pick shapes the tone. How a real speaker cab's impedance curve differs from a dummy load, and what that does to the output transformer.",
    tag: "Attenuators",
  },
  {
    title: "Tube Amp Attenuator Limits (Lower Wattage)",
    href: "/blog/tube-amp-attenuator-limits-lower-wattage",
    blurb:
      "The hidden costs of running a low-wattage amp through an attenuator. At some point you're better off with the power soak removed.",
    tag: "Attenuators",
  },
  {
    title: "4-Wire Method Explained",
    href: "/blog/4-wire-method-explained",
    blurb:
      "How to loop your modeler's effects into a real tube amp so your amp's preamp-AND-power-amp stay in the signal path.",
    tag: "Integration",
  },
  {
    title: "Amp Gain, Volume, Master Controls",
    href: "/blog/amp-gain-volume-master-controls",
    blurb:
      "The three volume knobs and what each one actually controls — Channel Volume, Master Volume, and Output Volume on modern amps.",
    tag: "Theory",
  },
];

const AMP_TYPES: AmpEntry[] = [
  {
    title: "Complete Guide to Guitar Amp Types",
    href: "/blog/complete-guide-guitar-amp-types",
    blurb:
      "Tube vs solid state, class A vs class AB, single-ended vs push-pull. What the labels actually mean and how they shape tone.",
    tag: "Primer",
  },
  {
    title: "Best Helix Amp Models (Blues)",
    href: "/blog/best-helix-amp-models-blues",
    blurb:
      "Sean Nakamura's top picks for blues tone on the Helix. Underrated amp models and why they work for blues specifically.",
    tag: "Modeler",
  },
  {
    title: "10 Helix Amp Models (Underrated)",
    href: "/blog/10-helix-amp-models-underrated",
    blurb:
      "Helix has 40+ amp models and most players use the same 5. Here are 10 you should open up today.",
    tag: "Modeler",
  },
];

function Section({
  title,
  blurb,
  amps,
}: {
  title: string;
  blurb: string;
  amps: AmpEntry[];
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mb-6 max-w-2xl text-sm text-muted md:text-base">{blurb}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {amps.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex flex-col rounded-xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/40 hover:bg-surface"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-accent">
                {a.title}
              </h3>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted">
                {a.tag}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{a.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function AmpSettingsPillarPage() {
  const allAmps = [...CLEAN_CRUNCH, ...BRITISH_HIGH_GAIN, ...ATTEN_UTIL, ...AMP_TYPES];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Amp Settings & Tone",
    description:
      "Fader & Knob's canonical amp reference — blackface Fender, British Vox and Marshall, American high-gain, solid-state, attenuators, and the theory behind each amp's voice.",
    hasPart: allAmps.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `https://faderandknob.com${a.href}`,
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
            Pillar guide · {allAmps.length} guides
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Amp Settings & Tone
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            The amp is the platform. Every tone on the site sits on top of one
            of these — or a modeled version of it. Here&apos;s how each
            canonical amp actually sounds like itself, and the settings that
            get you there.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">
            What makes an amp sound like that amp
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            Four variables: the preamp topology (single-ended triode, push-pull,
            cascaded gain stages), the power-amp topology (class A, class AB,
            single-ended, push-pull), the output transformer (saturation
            behavior, frequency response), and the speaker + cab (impedance
            curve, resonance, breakup). Every canonical amp is some specific
            combination of those four, and the settings that flatter one amp
            will push another into territory it wasn&apos;t designed for.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            The guides below treat each amp as its own instrument. Settings
            are specific because the amps are specific. &ldquo;Start at noon
            and tweak&rdquo; isn&apos;t a real answer for the JCM800 or the
            AC30; the right settings depend on what you&apos;re trying to do
            with that amp&apos;s personality.
          </p>
        </section>

        <Section
          title="Clean and edge-of-breakup"
          blurb="The amps that sit down in a mix and let pedals do the coloring — or handle their own saturation at the top of the volume range."
          amps={CLEAN_CRUNCH}
        />

        <Section
          title="British crunch and high-gain"
          blurb="From the Plexi's open-circuit growl through the 5150's modern metal tightness. The master-volume and preamp-stack lineage."
          amps={BRITISH_HIGH_GAIN}
        />

        <Section
          title="Attenuators, integration, and volume controls"
          blurb="The practical side — how to run these amps at non-venue volumes, and how to integrate them with modelers, effects loops, and modern rigs."
          amps={ATTEN_UTIL}
        />

        <Section
          title="Amp types and modeler choices"
          blurb="Primers on amp topology (what tube vs solid-state and class A vs AB actually mean) and modeler picks for players who've committed to the digital platform."
          amps={AMP_TYPES}
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
                Every artist in the catalog runs one of the amps in this pillar. Use them as pairing targets.
              </p>
            </Link>
            <Link
              href="/guides/pedal-settings-guides"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Pedal settings guides</h3>
              <p className="mt-2 text-xs text-muted">
                What runs into the amp. Every canonical pedal, dialed for each amp family.
              </p>
            </Link>
            <Link
              href="/platforms"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Modeler platforms</h3>
              <p className="mt-2 text-xs text-muted">
                The digital versions. Which Helix model matches which amp, and where the differences actually matter.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            New amp breakdown every week
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Tone of the Week — free, every Friday. One amp deep dive, one
            recipe to dial in, one quick tip.
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
