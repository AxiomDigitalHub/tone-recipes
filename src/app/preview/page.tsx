import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  artists,
  getSongBySlug,
  getArtistBySlug,
  getRecipeBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "./_components/recipe-to-blocks";
import { PreviewSignalChain } from "./_components/PreviewBlocks";
import { LpArt, monogramFor } from "./_components/LpArt";

export const metadata: Metadata = {
  title: "Preview — Fader & Knob visual direction",
  robots: { index: false, follow: false },
};

const SAMPLE_SLUGS = [
  "srv-pride-and-joy-rhythm",
  "gilmour-comfortably-numb-solo",
  "hendrix-voodoo-child-wah",
  "evh-eruption-brown-sound",
  "hetfield-master-of-puppets-rhythm",
  "mayer-slow-dancing-burning-room",
  "page-whole-lotta-love-heavy-riff",
  "angus-young-back-in-black-rhythm",
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

      {/* §02 — How this works · three-step editorial feature */}
      <section className="how container">
        <div className="how-head">
          <span className="how-mark">§02</span>
          <h2 className="display">Three steps from
            {" "}<em>that solo</em>{" "}to your rig.</h2>
          <span className="section-rule" aria-hidden="true" />
          <span className="section-meta">No tweaking required</span>
        </div>
        <ol className="how-steps">
          <li className="how-step">
            <span className="how-step-no">01</span>
            <h3 className="how-step-title">We chase the tone.</h3>
            <p className="how-step-body">
              Listen, isolate, A/B against rigs we know. Our editors are
              tone nerds who will spend a whole afternoon on a delay tail.
            </p>
            <span className="how-step-tag">Editorial</span>
          </li>
          <li className="how-step">
            <span className="how-step-no">02</span>
            <h3 className="how-step-title">We map the chain.</h3>
            <p className="how-step-body">
              Guitar, drive, amp, cab, mic, post. Every block. Every knob.
              Every tap-tempo. Documented like a service manual.
            </p>
            <span className="how-step-tag">Schematic</span>
          </li>
          <li className="how-step">
            <span className="how-step-no">03</span>
            <h3 className="how-step-title">You get the numbers.</h3>
            <p className="how-step-body">
              Translated for your Helix, Quad Cortex, TONEX, Fractal,
              Kemper, Katana — or your physical pedalboard. One click,
              import, play.
            </p>
            <span className="how-step-tag">For your rig</span>
          </li>
        </ol>
      </section>

      {/* §03 — Audition picker · LP rack of real recipes */}
      <section className="audition container">
        <div className="audition-head">
          <span className="how-mark">§03</span>
          <h2 className="display">The opening shelf.</h2>
          <span className="section-rule" aria-hidden="true" />
          <span className="section-meta">
            {recipeCount.toLocaleString()} recipes · {playerCount} players
          </span>
        </div>
        <p className="audition-lede">
          Eight tones to start. Click a sleeve to see the chain, the knobs,
          and the numbers — translated for your rig.
        </p>

        <div className="audition-grid">
          {SAMPLE_SLUGS.map((slug, i) => {
            const r = getRecipeBySlug(slug);
            if (!r) return null;
            const rSong = getSongBySlug(r.song_slug);
            const rArtist = rSong
              ? getArtistBySlug(rSong.artist_slug)
              : undefined;
            const rIdx =
              toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
            const rBlocks = recipeToBlocks(r, "helix");
            return (
              <Link
                key={r.slug}
                href={`/preview/recipe/${r.slug}`}
                className="audition-card"
              >
                <div className="audition-art">
                  <LpArt
                    cover={rSong?.album_art_url}
                    monogram={monogramFor(rArtist?.name)}
                    meta={`${rBlocks.length} blocks`}
                    hue={rIdx}
                    alt={`${rSong?.album ?? rSong?.title ?? r.title} cover`}
                  />
                </div>
                <div className="audition-meta">
                  <span className="audition-no">
                    No. {String(rIdx).padStart(3, "0")}
                    {rSong?.year ? ` · ${rSong.year}` : ""}
                  </span>
                  <span className="audition-song">
                    {rSong?.title ?? r.title}
                  </span>
                  <span className="audition-artist">
                    {rArtist?.name ?? "Unknown"}
                  </span>
                  <span className="audition-cta">
                    See the chain <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
