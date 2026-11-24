import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getSongBySlug, getArtistBySlug } from "@/lib/data";
import { pickHomepageRecipes } from "@/lib/homepage-pool";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { getBandName } from "@/lib/song-band";
import { getAllPosts, BLOG_CATEGORIES } from "@/lib/blog";
import Gear from "@/components/gear/Gear";
import { DialCell } from "@/components/gear/Dial";
import ToneCard from "@/components/recipe/redesign/ToneCard";
import { dialsFor, gearForChain } from "@/lib/gear/recipe-gear";
import type { GearKind } from "@/lib/gear/draw";
import FridaySendForm from "@/components/newsletter/FridaySendForm";

export const metadata: Metadata = {
  title: "Fader & Knob: Tone recipes for modeler players",
  description:
    "Exact signal chains for the songs you love, ported across Helix, Quad Cortex, TONEX, Fractal, Kemper, and pedalboard. Stop tweaking. Start playing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fader & Knob: Tone recipes for modeler players",
    description:
      "Exact signal chains for the songs you love, ported across every modeler.",
    type: "website",
  },
};

// Rotate the homepage via ISR: the page stays statically cached (good for SEO
// and speed) but regenerates hourly, and each regeneration draws a fresh hero +
// set of popular tones from the curated flagship pool. See
// src/lib/homepage-pool.ts for the pool itself.
export const revalidate = 3600;

/** The drawing for a guide's row card, from what the guide is about. */
function gearForPost(text: string): GearKind {
  const t = text.toLowerCase();
  if (/delay|echo/.test(t)) return "delay";
  if (/reverb/.test(t)) return "reverb";
  if (/\bir\b|impulse|cab(inet)?s?\b|speaker/.test(t)) return "cab";
  if (/\bmic\b|microphone/.test(t)) return "mic";
  if (/compress/.test(t)) return "comp";
  if (/fuzz/.test(t)) return "fuzz";
  if (/chorus|flang|phas|tremolo|modulat|vibe/.test(t)) return "mod";
  if (/volume pedal|expression/.test(t)) return "vol";
  if (/\beq\b|equali/.test(t)) return "eq";
  if (/overdrive|distortion|drive|boost|screamer|klon/.test(t)) return "drive";
  if (/preamp/.test(t)) return "preamp";
  if (/amp|helix|quad cortex|kemper|fractal|tonex|katana|modeler/.test(t)) return "head";
  return "drive2";
}

export default function HomePage() {
  // Hero + popular tones are drawn from the curated flagship pool on each ISR
  // regeneration, so the homepage rotates over time without per-request cost.
  const { hero: featured, shelf } = pickHomepageRecipes(8);
  const song = featured ? getSongBySlug(featured.song_slug) : undefined;
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const band = song ? getBandName(song, artist) : null;
  const heroPlatform = featured?.platform_translations?.helix ? "helix" : "pedalboard";
  const heroBlocks = featured ? recipeToBlocks(featured, heroPlatform) : [];
  const picks = gearForChain(heroBlocks);
  const chain = heroBlocks
    .map((block, i) => ({ block, pick: picks[i] }))
    .filter((x) => x.pick !== null) as { block: (typeof heroBlocks)[number]; pick: NonNullable<(typeof picks)[number]> }[];

  // The card shows up to four pieces: the pedals in front of the amp, then
  // the amp itself. Real data, drawn at the recipe's settings.
  const ampItem = chain.find((x) => x.block.variant === "amp");
  const pedals = chain.filter(
    (x) => x.block.variant === "pedal" && !["vol", "eq", "amp", "head"].includes(x.pick.kind),
  );
  const showcase = [...pedals.slice(0, ampItem ? 3 : 4), ...(ampItem ? [ampItem] : [])];
  const ampDials = ampItem ? dialsFor(ampItem.block).slice(0, 6) : [];
  const blockCount = chain.length;

  const guides = getAllPosts().slice(0, 3);

  return (
    <div className="fk-home">
      {/* The one dark band at the top of the home page. */}
      <section className="fk-home-hero">
        <div className="fk-band">
          <div className="fk-wrap fk-home-hero-grid">
            <div className="fk-home-hero-copy">
              <h1 className="fk-home-h1">Tone recipes from the songs you love</h1>
              <p className="fk-lead">
                We map the full signal chain of an iconic recording and give you the exact
                numbers for your Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana or pedalboard.
              </p>
              <form role="search" action="/browse" method="get" className="fk-search fk-home-search">
                <Search size={20} strokeWidth={1.75} aria-hidden />
                <label htmlFor="home-q" className="fk-sr">
                  Search tones
                </label>
                <input id="home-q" name="q" type="search" placeholder="Try a song, artist or guitarist" />
                <button type="submit" aria-label="Search">
                  <span className="fk-home-search-text">Search</span>
                  <Search className="fk-home-search-go" size={20} strokeWidth={2} aria-hidden />
                </button>
              </form>
              <div className="fk-home-hero-cta">
                <Link href="/browse" className="fk-btn fk-btn-light">
                  Browse the tones
                </Link>
                <Link href="/#how-it-works" className="fk-btn fk-btn-ghost">
                  How it works
                </Link>
              </div>
              <p className="fk-body-sm">
                The whole site is an open AI experiment. <Link href="/experiment">Watch it run</Link>.
              </p>
            </div>

            {featured && showcase.length > 0 && (
              <div className="fk-home-hero-side">
                <Link
                  href={`/recipe/${featured.slug}${heroPlatform === "helix" ? "" : `?platform=${heroPlatform}`}`}
                  className="fk-panel fk-home-card"
                >
                  <div className="fk-home-card-head">
                    <div>
                      <h2 className="fk-t3">{song?.title ?? featured.title}</h2>
                      <p className="fk-body-sm">
                        {[artist?.name, band, song?.year].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <span className="fk-data fk-home-card-count">{blockCount} blocks</span>
                  </div>
                  <div className="fk-home-card-gear">
                    {showcase.map(({ block, pick }, i) => (
                      <Gear
                        key={`${block.name}-${i}`}
                        kind={pick.kind}
                        height={132}
                        vals={pick.vals}
                        title={pick.title}
                        disp={pick.disp}
                        label={block.name}
                      />
                    ))}
                  </div>
                  {ampItem && ampDials.length > 0 && (
                    <div className="fk-home-card-amp">
                      <p className="fk-body-sm fk-home-card-ampname">{ampItem.block.name} amp</p>
                      <div className="fk-home-card-dials">
                        {ampDials.map((d) => (
                          <DialCell key={d.key} label={d.label} display={d.display} value={d.frac} min={0} max={1} size={52} />
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
                <p className="fk-caption">
                  A real recipe{song ? `: ${song.title}` : ""}. Knobs sit where the recipe sets them.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="fk-home-section">
        <div className="fk-wrap fk-home-stack">
          <div className="fk-home-sectionhead">
            <h2 className="fk-t2">Popular tones</h2>
            <Link href="/browse" className="fk-link fk-label">
              See all recipes
            </Link>
          </div>
          <div className="fk-card-grid fk-home-tones">
            {shelf.map((r) => (
              <ToneCard key={r.slug} recipe={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="fk-home-section" id="how-it-works">
        <div className="fk-wrap fk-home-stack">
          <h2 className="fk-t2">Three steps from your favorite song to your rig</h2>
          <ol className="fk-home-steps">
            <li>
              <span className="fk-step-num" aria-hidden="true">1</span>
              <h3 className="fk-t3">Find your tone</h3>
              <p className="fk-body fk-muted">
                Search by song, artist or guitarist. Every recipe is built from the original
                recording: the gear, the chain, the sources.
              </p>
            </li>
            <li>
              <span className="fk-step-num" aria-hidden="true">2</span>
              <h3 className="fk-t3">Download it</h3>
              <p className="fk-body fk-muted">
                Grab the preset for Helix, Quad Cortex or Katana. On TONEX, Fractal, Kemper or
                pedalboards, dial it in by hand.
              </p>
            </li>
            <li>
              <span className="fk-step-num" aria-hidden="true">3</span>
              <h3 className="fk-t3">Rock on</h3>
              <p className="fk-body fk-muted">
                Plug in and play along with the record. Tweak to taste from there. Then turn it
                right up to 11.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {guides.length > 0 && (
        <section className="fk-home-section">
          <div className="fk-home-wash">
            <div className="fk-wrap fk-home-stack">
              <div className="fk-home-sectionhead">
                <div className="fk-home-sectionintro">
                  <h2 className="fk-t2">Learn how tone works</h2>
                  <p className="fk-body fk-muted">
                    Guides on signal chains, modeler blocks and the gear behind the records.
                  </p>
                </div>
                <Link href="/blog" className="fk-link fk-label">
                  Open the learning center
                </Link>
              </div>
              <div className="fk-home-guides">
                {guides.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="fk-rowcard">
                    <div className="fk-rowcard-art fk-home-guide-art">
                      <Gear kind={gearForPost(`${post.title} ${post.tags.join(" ")}`)} height={86} label="" />
                    </div>
                    <div>
                      <h3 className="fk-rowcard-title">{post.headline}</h3>
                      <p className="fk-caption">
                        {[BLOG_CATEGORIES[post.category] ?? null, post.readingTime].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="fk-home-news">
        <div className="fk-band">
          <div className="fk-wrap fk-home-news-row">
            <div className="fk-home-news-copy">
              <h2 className="fk-t2">Get tone recipes and news</h2>
              <p className="fk-body">
                The sounds behind your favorite songs, plus all that&rsquo;s new in guitar tone.
              </p>
            </div>
            <FridaySendForm />
          </div>
        </div>
      </section>
    </div>
  );
}
