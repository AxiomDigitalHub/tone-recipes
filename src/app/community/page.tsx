import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "Join the Fader & Knob community. Discuss gear, share tone recipes, get help dialing in your sound, and connect with other guitarists.",
  openGraph: {
    title: "Community | Fader & Knob",
    description:
      "Discuss gear, share tone recipes, get help dialing in your sound, and connect with fellow guitarists.",
    type: "website",
  },
};

const sections = [
  {
    title: "Field notes",
    description:
      "Gear guides, signal-chain theory, and the stories behind the recipes.",
    href: "/blog",
  },
  {
    title: "Tone recipes",
    description:
      "The full catalog. Signal chains, exact settings, presets for Helix, Quad Cortex, and Katana.",
    href: "/browse",
  },
  {
    title: "Submit a recipe",
    description:
      "Got a tone dialed in? Share your signal chain and settings with the community.",
    href: "/dashboard/my-recipes/new",
  },
];

export default function CommunityPage() {
  return (
    <div className="fk-wrap fkp-page">
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Community</span>
      </nav>

      <header className="fkp-head">
        <h1 className="fk-display">Community</h1>
        <p className="fk-lead fkp-measure">
          Request a tone, publish your own chain, or tell us what we got
          wrong.
        </p>
      </header>

      <div className="fkp-tiles fkp-pad-top">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="fk-tile fkp-linktile">
            <span className="fkp-linktile-head">
              <h2 className="fk-t3">{section.title}</h2>
              <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <p className="fk-body-sm">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Three link cards and ~30 words was thin enough to get flagged.
          Keep this factual: no invented member counts, no activity
          claims, and the retired forum stated plainly rather than
          quietly dropped. */}
      <section className="fkp-section fkp-prose" aria-labelledby="community-how-head">
        <h2 id="community-how-head" className="fk-t2">
          How this one works
        </h2>

        <p>
          There isn&apos;t a forum here. There was one; it ran for months
          without meaningful discussion and was retired in May 2026, and
          pretending otherwise would waste your time. What&apos;s left gets
          used: ways to add something to the archive, or to correct
          what&apos;s already in it.
        </p>

        <h3 className="fk-t3">Ask for a tone</h3>
        <p>
          If a song isn&apos;t covered,{" "}
          <Link href="/request">request it</Link>. Requests are researched
          against interviews, gear lists, and live footage, then published
          as a full recipe with its sources attached. It goes through the
          same pipeline as everything else in the archive.
        </p>

        <h3 className="fk-t3">Publish your own chain</h3>
        <p>
          <Link href="/dashboard/my-recipes/new">Submitting a recipe</Link>{" "}
          gives you the same editor the site&apos;s own recipes use:
          blocks in order, settings in real units, and the platform
          translations generated from what you enter. Useful if
          you&apos;ve already done the work of dialling something in and
          want it somewhere you won&apos;t lose it.
        </p>

        <h3 className="fk-t3">Report something wrong</h3>
        <p>
          Corrections matter most. Recipes here are researched and
          generated, not played into a mic by a session engineer, so errors
          happen: a wrong pickup position, a model that doesn&apos;t exist
          on your firmware, a value outside the block&apos;s range. Reported mistakes get fixed as public
          commits and counted on{" "}
          <Link href="/experiment">the experiment page</Link>, next to
          everything else.
        </p>
      </section>
    </div>
  );
}
