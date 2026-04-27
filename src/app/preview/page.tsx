import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  artists,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "./_components/recipe-to-blocks";
import { PreviewSignalChain } from "./_components/PreviewBlocks";

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
  const recipeCount = toneRecipes.length;
  const playerCount = artists.length;

  // Featured recipe for the hero chain. First entry is typically a
  // flagship tone; swap by reordering the data file or wiring a flag later.
  const featured = toneRecipes[0];
  const featuredSong = featured ? getSongBySlug(featured.song_slug) : undefined;
  const featuredArtist = featuredSong
    ? getArtistBySlug(featuredSong.artist_slug)
    : undefined;
  // Prefer Helix for the hero since it's the most-supported platform.
  const heroPlatform = featured?.platform_translations?.helix
    ? "helix"
    : "pedalboard";
  const heroBlocks = featured ? recipeToBlocks(featured, heroPlatform) : [];
  const heroPlatformLabel =
    heroPlatform === "helix" ? "Line 6 Helix" : "Pedalboard";

  return (
    <>
      {/* Hero — production tagline + live signal-chain showcase */}
      <section className="hero">
        <div className="container">
          <div className="hero-headline-grid">
            <div>
              <div className="hero-issue">
                <span className="pill">Issue No. 014</span>
                <span>Live archive</span>
                <span>·</span>
                <span>{recipeCount.toLocaleString()} recipes</span>
                <span>·</span>
                <span>{playerCount} players</span>
              </div>
              <h1 className="display">
                Tone recipes from
                <br />
                <span className="amp">the songs you love.</span>
              </h1>
            </div>
            <p className="hero-sub">
              <span className="lede-first">How this works</span>
              We take an iconic recording and map the full signal chain —
              the guitar, the drive, the amp, the cab, the effects — wired
              in order. Then we translate every setting into the exact
              numbers for <b>your</b> Helix, Quad Cortex, TONEX, Fractal,
              Kemper, Katana, or physical rig.
            </p>
          </div>

          {/* Featured hero chain */}
          {featured && heroBlocks.length > 0 && (
            <div className="hero-chain">
              <div className="hero-chain-head">
                <div>
                  <div className="hero-chain-kicker">
                    <span className="rec">
                      <span className="rec-dot" />
                      Featured recipe
                    </span>
                    <span className="sep">·</span>
                    <span>Signal path</span>
                    <span className="sep">·</span>
                    <span>{heroBlocks.length} blocks</span>
                  </div>
                  <div className="hero-chain-title">
                    {featuredSong?.title ?? featured.title}
                  </div>
                  <div className="hero-chain-meta">
                    <em>{featuredArtist?.name ?? "Unknown"}</em>
                    {featuredSong?.album && (
                      <>
                        <span className="sep">—</span>
                        <span>{featuredSong.album}</span>
                      </>
                    )}
                    {featuredSong?.year && (
                      <>
                        <span className="sep">·</span>
                        <span>{featuredSong.year}</span>
                      </>
                    )}
                    <span className="sep">·</span>
                    <span>Built for {heroPlatformLabel}</span>
                  </div>
                </div>
                <Link
                  href={`/preview/recipe/${featured.slug}?platform=${heroPlatform}`}
                  className="hero-chain-cta"
                >
                  Open full recipe <span aria-hidden="true">→</span>
                </Link>
              </div>
              <PreviewSignalChain blocks={heroBlocks} />
            </div>
          )}
        </div>
      </section>

      {/* Audition picker — kept below the hero for navigation */}
      <div className="container" style={{ padding: "40px 28px 80px" }}>
        <div
          className="eyebrow"
          style={{ marginBottom: 12 }}
        >
          Visual direction audition · 2026-04-18
        </div>
        <h2
          className="display"
          style={{
            fontSize: 28,
            margin: "0 0 12px",
            fontWeight: 400,
            letterSpacing: "-0.015em",
          }}
        >
          Pick a recipe to audition
        </h2>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--ink-2)",
            maxWidth: "62ch",
            margin: "0 0 24px",
          }}
        >
          Each of these loads the real recipe through the new visual
          system. Switch platforms on the recipe page with{" "}
          <code>?platform=helix</code> or <code>?platform=katana</code>.
          The players listed are {playerCount} total; recipes total{" "}
          {recipeCount.toLocaleString()}.
        </p>

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
      </div>
    </>
  );
}
