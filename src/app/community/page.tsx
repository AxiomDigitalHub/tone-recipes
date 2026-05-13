import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
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
      </div>
    </div>
  );
}
