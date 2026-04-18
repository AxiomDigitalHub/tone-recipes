import type { Metadata } from "next";
import Link from "next/link";

/**
 * Pillar hub #7: Bedroom + Home Recording.
 *
 * Whitespace territory per the content-authority research. The market
 * underserves players with limited time, quiet practice constraints, and
 * small-space setups. Elena Ruiz + Dev Okonkwo own this lane editorially.
 */

export const metadata: Metadata = {
  title: "Bedroom & Home Recording — Great Tone in Small Spaces",
  description:
    "Headphone rigs, direct recording, quiet pedalboards, parent-player practice frameworks, and bedroom-volume tone guides for players who don't have two hours and a dedicated music room.",
};

interface GuideEntry {
  title: string;
  href: string;
  blurb: string;
  tag: string;
}

const CONSTRAINT_TONE: GuideEntry[] = [
  {
    title: "20-Minute Practice Session",
    href: "/blog/20-minute-practice-session",
    blurb:
      "Elena Ruiz's framework for players with kids, jobs, and limited time. One-change-per-session, structured listening, and the audible-improvement principle.",
    tag: "Practice",
  },
  {
    title: "Peavey 5150 at Bedroom Volume",
    href: "/blog/peavey-5150-bedroom-volume",
    blurb:
      "How to dial a 120W metal amp so it doesn't sound embarrassing at apartment-friendly volumes. Three use-case settings with knob positions.",
    tag: "Amp at low volume",
  },
];

const DIRECT_AND_HEADPHONE: GuideEntry[] = [
  {
    title: "Best FRFR Speakers for Modelers",
    href: "/blog/best-frfr-speakers-for-modelers",
    blurb:
      "FRFR (full-range flat-response) speakers for home use. What to look for at each budget tier, and why a good FRFR matters for bedroom tone with a modeler.",
    tag: "Speakers",
  },
  {
    title: "FRFR vs Guitar Cab for Modelers",
    href: "/blog/frfr-vs-guitar-cab-for-modelers",
    blurb:
      "The home-use tradeoff: FRFR gives you the accurate sound you dialed; a guitar cab gives you the amp-in-the-room feel. When each one is right.",
    tag: "Speakers",
  },
  {
    title: "Fix Thin Modeler Tone",
    href: "/blog/fix-thin-modeler-tone",
    blurb:
      "The &ldquo;sounds fizzy in headphones&rdquo; complaint, solved. Where the thinness comes from and the five changes that fix it.",
    tag: "Troubleshooting",
  },
];

const HOME_PRODUCTION: GuideEntry[] = [
  {
    title: "My Bloody Valentine Loveless Tone",
    href: "/blog/my-bloody-valentine-loveless-tone",
    blurb:
      "The original bedroom-recording masterclass. Four-track layering, glide guitar technique, stereo panning, and how to approach it with modern tools.",
    tag: "Production",
  },
  {
    title: "Shoegaze Wall of Sound Recipe",
    href: "/blog/shoegaze-wall-of-sound-recipe",
    blurb:
      "How to build the shoegaze tone from first principles — reverb, fuzz, tremolo arm, volume swells, and the stereo field.",
    tag: "Production",
  },
  {
    title: "Neo-Shoegaze Tone",
    href: "/blog/neo-shoegaze-tone",
    blurb:
      "Nothing, Whirr, Deafheaven-adjacent — the updated shoegaze palette with modern production context. Dev Okonkwo's home-recording framework.",
    tag: "Production",
  },
  {
    title: "Nothing Band Guitar Tone",
    href: "/blog/nothing-band-guitar-tone",
    blurb:
      "Will Yip production deconstructed. Drop tunings, specific fuzz placement, and why the room compression you can't replicate at home is the 10% that doesn't matter.",
    tag: "Production",
  },
  {
    title: "Jack White Lo-Fi Garage Tone",
    href: "/blog/jack-white-lo-fi-garage-tone",
    blurb:
      "Getting the White Stripes sound with one guitar, no drummer, and a small room. Lo-fi as an aesthetic decision, not an accident.",
    tag: "Lo-fi",
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

export default function BedroomPillarPage() {
  const allGuides = [...CONSTRAINT_TONE, ...DIRECT_AND_HEADPHONE, ...HOME_PRODUCTION];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bedroom & Home Recording",
    description:
      "Fader & Knob's home-setup pillar — constraint-based tone, headphone and FRFR rigs, bedroom-volume techniques, and home production workflows.",
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
            Pillar guide · {allGuides.length} guides · Growing weekly
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Bedroom & Home Recording
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            Great guitar tone in small spaces, short sessions, and quiet
            rooms. The constraint-based rig — headphone amps, direct
            recording, couch-sized practice — built to work for the player
            who has 20 minutes on a Tuesday, not a dedicated studio.
          </p>
        </header>

        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">
            Constraints aren&apos;t the enemy of tone
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            Most guitar content assumes you have two hours, a dedicated
            music room, and the volume freedom to crank an amp. If you
            don&apos;t — and most players don&apos;t — the standard advice
            stops applying. A Fender Twin at 9 o&apos;clock sounds bad for
            the same reason a Marshall Plexi at bedroom volume sounds bad:
            those amps need air to move before they sound like themselves.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            The answer isn&apos;t to buy a worse amp. It&apos;s to use
            gear that was designed for the constraints you actually have.
            Modelers through headphones. Low-wattage tube amps with
            attenuators. FRFR speakers at conversation volume. The
            bedroom-volume rig is a different species from the gig rig —
            and when you commit to that, your tone gets better, not worse.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Elena Ruiz and Dev Okonkwo, the two writers with the most
            experience in this territory, own this pillar editorially.
            Elena is the parent-player voice; Dev is the bedroom-producer
            voice. Different constraints, same honesty about what
            works.
          </p>
        </section>

        <Section
          title="Constraint-based tone"
          blurb="When time and volume are fixed, the tone approach changes. Practice frameworks and bedroom-volume amp techniques."
          guides={CONSTRAINT_TONE}
        />

        <Section
          title="Direct recording and headphone rigs"
          blurb="The speaker-free signal chain. FRFR setups for home use, headphone-only rigs, and the modeler settings that actually translate without a speaker in the room."
          guides={DIRECT_AND_HEADPHONE}
        />

        <Section
          title="Home production and bedroom aesthetics"
          blurb="Artists who built their sound in bedrooms and small rooms on purpose — and the techniques that produce those sounds deliberately rather than as a compromise."
          guides={HOME_PRODUCTION}
        />

        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/guides/modeler-mastery"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Modeler mastery</h3>
              <p className="mt-2 text-xs text-muted">
                The modeler is the key to every bedroom rig. Platform comparisons, workflow guides, IR choice.
              </p>
            </Link>
            <Link
              href="/guides/tone-troubleshooting"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Tone troubleshooting</h3>
              <p className="mt-2 text-xs text-muted">
                Most bedroom-tone complaints — fizzy highs, thin sound, no air — have known fixes.
              </p>
            </Link>
            <Link
              href="/guides/pedal-settings-guides"
              className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <h3 className="text-sm font-bold text-foreground">Pedal settings guides</h3>
              <p className="mt-2 text-xs text-muted">
                Pedals translate fine at bedroom volume. Here&apos;s how to set them to get gig tone at whisper volume.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            Made for 20 minutes on a Tuesday
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Tone of the Week — one email Friday, one new recipe, one bedroom-friendly tip. Free.
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
