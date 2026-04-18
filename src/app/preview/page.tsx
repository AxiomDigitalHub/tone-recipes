import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview — Fader & Knob visual direction",
  robots: { index: false, follow: false },
};

const SAMPLE_RECIPES = [
  {
    slug: "srv-pride-and-joy-rhythm",
    song: "Pride and Joy",
    artist: "Stevie Ray Vaughan",
  },
  {
    slug: "gilmour-comfortably-numb-solo",
    song: "Comfortably Numb (solo)",
    artist: "David Gilmour",
  },
  {
    slug: "hendrix-voodoo-child-wah",
    song: "Voodoo Child (Slight Return)",
    artist: "Jimi Hendrix",
  },
  {
    slug: "evh-eruption-brown-sound",
    song: "Eruption",
    artist: "Eddie Van Halen",
  },
  {
    slug: "hetfield-master-of-puppets-rhythm",
    song: "Master of Puppets (rhythm)",
    artist: "James Hetfield",
  },
  {
    slug: "mayer-slow-dancing-burning-room",
    song: "Slow Dancing in a Burning Room",
    artist: "John Mayer",
  },
];

export default function PreviewIndex() {
  return (
    <div className="container" style={{ padding: "40px 28px 80px" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          marginBottom: 12,
        }}
      >
        Visual direction audition · 2026-04-18
      </p>
      <h1
        className="display"
        style={{
          fontSize: "clamp(42px, 6vw, 84px)",
          margin: "0 0 24px",
          letterSpacing: "-0.025em",
          lineHeight: 0.92,
          fontWeight: 400,
          maxWidth: "24ch",
        }}
      >
        A new visual direction for Fader &amp; Knob.
      </h1>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.6,
          color: "var(--ink-2)",
          maxWidth: "62ch",
          margin: "0 0 28px",
        }}
      >
        This is a preview route hosting the editorial / hardware-catalog
        aesthetic from the 2026-04-18 Claude Design prototype. Same recipe
        data, same signal-chain &rarr; block-detail UX. Only the visual
        treatment is new.
      </p>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--ink-2)",
          maxWidth: "62ch",
          margin: "0 0 40px",
        }}
      >
        Production at{" "}
        <Link
          href="/"
          style={{ color: "var(--ink)", textDecoration: "underline" }}
        >
          faderandknob.com
        </Link>{" "}
        is unchanged. Nothing here is indexed. Share with anyone you want a
        gut reaction from.
      </p>

      <div className="rule" style={{ margin: "24px 0 32px" }} />

      <h2
        className="display"
        style={{
          fontSize: 28,
          margin: "0 0 20px",
          fontWeight: 400,
          letterSpacing: "-0.015em",
        }}
      >
        Pick a recipe to audition
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
          background: "var(--ink)",
          padding: 2,
        }}
      >
        {SAMPLE_RECIPES.map((r, i) => (
          <Link
            key={r.slug}
            href={`/preview/recipe/${r.slug}`}
            style={{
              background: "var(--paper)",
              padding: "18px 16px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.22em",
                color: "var(--ink-muted)",
                textTransform: "uppercase",
              }}
            >
              No. {String(i + 1).padStart(3, "0")}
            </span>
            <span
              className="cond"
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginTop: 4,
              }}
            >
              {r.song}
            </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--ink-muted)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.06em",
              }}
            >
              {r.artist}
            </span>
          </Link>
        ))}
      </div>

      <div className="rule" style={{ margin: "40px 0 24px" }} />

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.08em",
          lineHeight: 1.7,
          color: "var(--ink-muted)",
          maxWidth: "62ch",
        }}
      >
        You can also visit <code>/preview/recipe/[any-recipe-slug]</code>{" "}
        directly. To switch platforms on a recipe, append{" "}
        <code>?platform=helix</code> or <code>?platform=katana</code> etc.
      </p>
    </div>
  );
}
