import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "Join the Fader & Knob community — discuss gear, share tone recipes, get help dialing in your sound, and connect with other guitarists.",
  openGraph: {
    title: "Community | Fader & Knob",
    description:
      "Discuss gear, share tone recipes, get help dialing in your sound, and connect with fellow guitarists.",
    type: "website",
  },
};

const sections = [
  {
    eyebrow: "Read",
    title: "Field Notes",
    description:
      "Editorial blog with tone recipes, gear guides, signal-chain theory, and weekly new posts.",
    href: "/blog",
  },
  {
    eyebrow: "Browse",
    title: "Tone recipes",
    description:
      "The full catalog. Signal chains, exact settings, presets for Helix and Katana.",
    href: "/browse",
  },
  {
    eyebrow: "Share",
    title: "Submit a recipe",
    description:
      "Got a tone dialed in? Share your signal chain and settings with the community.",
    href: "/dashboard/my-recipes/new",
  },
];

export default function CommunityPage() {
  return (
    <div className="container">
      <div className="recipe">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Community</span>
        </div>

        <div className="archive-masthead archive-masthead-tight">
          <div className="recipe-issue">
            <span className="pill">Community</span>
          </div>
          <h1 className="recipe-title display">Community</h1>
          <p className="recipe-summary">
            Connect with other guitarists, share your tones, and level up
            together.
          </p>
        </div>

        <div className="community-grid">
          {sections.map((section, i) => (
            <Link
              key={section.href}
              href={section.href}
              className="community-card"
            >
              <span className="community-card-no" aria-hidden>
                {i + 1}
              </span>
              <div className="community-card-body">
                <span className="dashboard-eyebrow">{section.eyebrow}</span>
                <h2 className="display community-card-title">
                  {section.title}
                </h2>
                <p className="community-card-dek">
                  <em>{section.description}</em>
                </p>
                <span className="community-card-cta">Open →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Three link cards and ~30 words was thin enough to get flagged.
            Keep this factual: no invented member counts, no activity
            claims, and the retired forum stated plainly rather than
            quietly dropped. */}
        <section className="hub-prose" aria-labelledby="community-how-head">
          <div className="how-head">
            <h2 id="community-how-head" className="display">
              How this one works
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>

          <p>
            There isn&apos;t a forum here. There was one; it ran for months
            without meaningful discussion and was retired in May 2026, and
            pretending otherwise would waste your time. What&apos;s left is
            narrower and actually gets used: ways to put something into the
            archive, or to correct what&apos;s already in it.
          </p>

          <h3>Ask for a tone</h3>
          <p>
            If a song isn&apos;t covered,{" "}
            <Link href="/request">request it</Link>. Requests are researched
            against interviews, gear lists, and live footage, then published
            as a full recipe with its sources attached — the same pipeline
            everything else in the archive goes through, not a private
            reply.
          </p>

          <h3>Publish your own chain</h3>
          <p>
            <Link href="/dashboard/my-recipes/new">Submitting a recipe</Link>{" "}
            gives you the same editor the site&apos;s own recipes use:
            blocks in order, settings in real units, and the platform
            translations generated from what you enter. Useful if
            you&apos;ve already done the work of dialling something in and
            want it somewhere you won&apos;t lose it.
          </p>

          <h3>Report something wrong</h3>
          <p>
            Corrections are the part that matters most. Recipes here are
            researched and generated rather than played into a mic by a
            session engineer, so errors happen — a wrong pickup position, a
            model that doesn&apos;t exist on your firmware, a value outside
            the block&apos;s range. Reported mistakes get fixed as public
            commits and counted on{" "}
            <Link href="/experiment">the experiment page</Link>, next to
            everything else. Nothing is quietly swapped.
          </p>
        </section>
      </div>
    </div>
  );
}
