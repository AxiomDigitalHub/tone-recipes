import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
  getRecipeBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { getBandName } from "@/lib/song-band";
import { PreviewSchematicChain } from "@/components/v3/PreviewSchematicChain";
import { LpArt, monogramFor } from "@/components/v3/LpArt";

export const metadata: Metadata = {
  title: "Fader & Knob — Tone recipes for modeler players",
  description:
    "Verified signal chains for the songs you love, ported across Helix, Quad Cortex, TONEX, Fractal, Kemper, and pedalboard. Stop tweaking. Start playing.",
  openGraph: {
    title: "Fader & Knob — Tone recipes for modeler players",
    description:
      "Verified signal chains for the songs you love, ported across every modeler.",
    type: "website",
  },
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
  // Featured recipe for the hero chain. First entry is typically a
  // flagship tone; swap by reordering the data file or wiring a flag later.
  const featured = toneRecipes[0];
  const featuredSong = featured ? getSongBySlug(featured.song_slug) : undefined;
  const featuredArtist = featuredSong
    ? getArtistBySlug(featuredSong.artist_slug)
    : undefined;
  const heroPlatform = featured?.platform_translations?.helix
    ? "helix"
    : "pedalboard";
  const heroBlocks = featured ? recipeToBlocks(featured, heroPlatform) : [];

  return (
    <>
      {/* Hero — production tagline + live signal-chain showcase */}
      <section className="hero">
        <div className="container">
          <div className="hero-headline-grid">
            <div>
              <h1 className="display hero-title">
                Tone recipes from{" "}
                <span className="amp">the songs you love</span>
              </h1>
              <div className="hero-cta-row">
                <Link href="/browse" className="hero-cta hero-cta-primary">
                  Browse recipes
                </Link>
                <Link href="/#how-it-works" className="hero-cta hero-cta-secondary">
                  How it works <span aria-hidden="true">↓</span>
                </Link>
              </div>
            </div>
            <p className="hero-sub">
              <span className="lede-first">How this works</span>
              We take an iconic recording, map the full signal chain, and
              translate every setting into the exact numbers for{" "}
              <b>your</b> Helix, Quad Cortex, TONEX, Fractal, Kemper,
              Katana, or pedalboard.
            </p>
          </div>

          {/* Featured hero chain — schematic icon overview, not chassis */}
          {featured && heroBlocks.length > 0 && (
            <div className="hero-chain hero-chain-light">
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
                  </div>
                </div>
                <Link
                  href={`/recipe/${featured.slug}?platform=${heroPlatform}`}
                  className="hero-chain-cta"
                >
                  Open full recipe <span aria-hidden="true">→</span>
                </Link>
              </div>
              <PreviewSchematicChain
                blocks={heroBlocks}
                selectedIndex={null}
                interactive={false}
              />
            </div>
          )}
        </div>
      </section>

      {/* How this works — three-step editorial feature */}
      <section className="how container" id="how-it-works">
        <div className="how-head">
          <h2 className="display">
            Three steps from your favorite song to your rig
          </h2>
          <span className="section-rule" aria-hidden="true" />
        </div>
        <ol className="how-steps">
          <li className="how-step">
            <span className="how-step-no" aria-hidden="true">1</span>
            <h3 className="how-step-title">We chase the tone</h3>
            <p className="how-step-body">
              Listen, isolate, A/B against rigs we know. Our editors are
              tone nerds who will spend a whole afternoon on a delay tail.
            </p>
          </li>
          <li className="how-step">
            <span className="how-step-no" aria-hidden="true">2</span>
            <h3 className="how-step-title">We map the chain</h3>
            <p className="how-step-body">
              Every block. Every knob. Every tap-tempo. Documented like a
              service manual.
            </p>
          </li>
          <li className="how-step">
            <span className="how-step-no" aria-hidden="true">3</span>
            <h3 className="how-step-title">You get the numbers</h3>
            <p className="how-step-body">
              Translated for your Helix, Quad Cortex, TONEX, Fractal,
              Kemper, Katana — or your pedalboard. One click, import, play.
            </p>
          </li>
        </ol>
      </section>

      {/* Audition picker — LP rack of real recipes */}
      <section className="audition container">
        <div className="audition-head">
          <h2 className="display">The opening shelf</h2>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <div className="audition-grid">
          {SAMPLE_SLUGS.map((slug) => {
            const r = getRecipeBySlug(slug);
            if (!r) return null;
            const rSong = getSongBySlug(r.song_slug);
            const rArtist = rSong
              ? getArtistBySlug(rSong.artist_slug)
              : undefined;
            const rIdx =
              toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
            const rBlocks = recipeToBlocks(r, "helix");
            const rBand = rSong ? getBandName(rSong, rArtist) : null;
            return (
              <Link
                key={r.slug}
                href={`/recipe/${r.slug}`}
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
                  <span className="audition-song">
                    {rSong?.title ?? r.title}
                  </span>
                  <span className="audition-artist">
                    {rBand ? (
                      <>
                        {rBand}
                        <span className="audition-artist-sep" aria-hidden="true"> / </span>
                        <em>{rArtist?.name ?? "Unknown"}</em>
                      </>
                    ) : (
                      <em>{rArtist?.name ?? "Unknown"}</em>
                    )}
                  </span>
                  {rSong?.album && (
                    <span className="audition-album">
                      {rSong.album}
                      {rSong.year ? ` · ${rSong.year}` : ""}
                    </span>
                  )}
                  <span className="audition-cta">
                    See the chain <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="audition-foot">
          <Link href="/browse" className="audition-foot-cta">
            Browse all recipes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Newsletter signup — one piece carried over from production */}
      <section className="newsletter container">
        <div className="newsletter-row">
          <div className="newsletter-text">
            <span className="newsletter-kicker">The Friday Send</span>
            <h2 className="display newsletter-title">
              One free tone recipe, every Friday
            </h2>
            <p className="newsletter-body">
              One recipe, one quick tip, one short read · no spam ·
              unsubscribe anytime.
            </p>
          </div>
          <form
            className="newsletter-form"
            action="/api/newsletter"
            method="post"
          >
            <label htmlFor="newsletter-email" className="newsletter-label sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
