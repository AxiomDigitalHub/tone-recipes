import type { Metadata } from "next";
import Link from "next/link";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";

/**
 * Pillar I — Artist Tone Recipes.
 *
 * This pillar is shape-different from the others: the section content is
 * built from the live recipe catalog (50+ recipes grouped into eras),
 * not a static guide list. So it uses the editorial v3 chrome directly
 * rather than the <PillarHub> component.
 */

export const metadata: Metadata = {
  title: "Artist Tone Recipes — Reproduce Any Guitar Tone on Any Rig",
  description:
    "How to get the exact guitar tone of the artists who defined rock, blues, metal, and pop — with signal chains, exact settings, and presets for Helix, Quad Cortex, TONEX, Fractal, Kemper, and Boss Katana.",
  openGraph: {
    title: "Artist Tone Recipes — Fader & Knob",
    description:
      "Signal chains, exact settings, and presets for iconic guitar tones. Reproduce Gilmour, SRV, Page, Van Halen, Hendrix, Hetfield, and more on any rig.",
  },
};

function PillarJsonLd({ recipes }: { recipes: ToneRecipe[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Artist Tone Recipes",
    description:
      "Fader & Knob's pillar collection of tone recipes from the artists who shaped modern guitar — with signal chains, exact settings, and cross-platform presets.",
    hasPart: recipes.slice(0, 25).map((r) => {
      const song = getSongBySlug(r.song_slug);
      const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
      return {
        "@type": "Article",
        headline: r.title,
        about: artist?.name ?? undefined,
        url: `https://faderandknob.com/recipe/${r.slug}`,
      };
    }),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function groupByArtist(): Array<{
  artistName: string;
  artistSlug: string;
  recipes: ToneRecipe[];
}> {
  const map: Record<
    string,
    { artistName: string; artistSlug: string; recipes: ToneRecipe[] }
  > = {};
  for (const r of toneRecipes) {
    const song = getSongBySlug(r.song_slug);
    const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
    if (!artist) continue;
    if (!map[artist.slug]) {
      map[artist.slug] = {
        artistName: artist.name,
        artistSlug: artist.slug,
        recipes: [],
      };
    }
    map[artist.slug].recipes.push(r);
  }
  return Object.values(map).sort(
    (a, b) =>
      b.recipes.length - a.recipes.length ||
      a.artistName.localeCompare(b.artistName),
  );
}

const ERAS: Array<{
  mark: string;
  title: string;
  blurb: string;
  artistSlugs: string[];
}> = [
  {
    mark: "¤",
    title: "Classic rock canon",
    blurb:
      "The tones that defined a generation of arena rock — Marshall stacks, Les Pauls, and the power chord. Where modern rock guitar got its grammar.",
    artistSlugs: ["jimmy-page", "david-gilmour", "eddie-van-halen", "angus-young", "slash", "brian-may", "pete-townshend", "keith-richards"],
  },
  {
    mark: "§",
    title: "Blues & blues-rock",
    blurb:
      "The roots of every lead tone in popular music. Strat-into-Fender for most; Gibson-into-Marshall for the blues-rock lineage. Expression lives in the pick, the volume knob, and the tube amp's breakup.",
    artistSlugs: ["stevie-ray-vaughan", "bb-king", "eric-clapton", "john-mayer", "joe-bonamassa", "billy-gibbons", "gary-clark-jr", "carlos-santana"],
  },
  {
    mark: "¶",
    title: "Metal & high-gain",
    blurb:
      "From Randy Rhoads' neo-classical through Hetfield's down-picking, Dimebag's Randall chainsaw, and modern djent. Scooped mids, tight low end, the pick-to-speaker relationship under extreme gain.",
    artistSlugs: ["james-hetfield", "dimebag-darrell", "randy-rhoads", "dave-murray", "kirk-hammett", "adam-jones", "josh-homme"],
  },
  {
    mark: "▪",
    title: "Indie, alt, shoegaze",
    blurb:
      "Where gain became texture and effects became composition. Fender offsets, Big Muffs and Tonebenders, delay and reverb used structurally rather than decoratively.",
    artistSlugs: ["kurt-cobain", "jonny-greenwood", "matt-bellamy", "alex-turner", "jack-white", "johnny-marr", "dan-auerbach", "noel-gallagher", "john-frusciante"],
  },
  {
    mark: "‡",
    title: "Innovators & outliers",
    blurb:
      "Players whose signal chains are so specific that understanding them teaches you the grammar of guitar tone itself.",
    artistSlugs: ["jimi-hendrix", "joe-satriani", "alex-lifeson", "jerry-garcia", "mark-knopfler"],
  },
];

export default function ArtistToneRecipesPillarPage() {
  const grouped = groupByArtist();
  const byArtistSlug = Object.fromEntries(grouped.map((g) => [g.artistSlug, g]));

  return (
    <>
      <PillarJsonLd recipes={toneRecipes} />

      <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="recipe-crumbs">
          <Link href="/guides">Guides</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Artist recipes</span>
        </div>

        <header className="archive-masthead">
          <div className="archive-kicker">
            <span>Pillar Guide</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Volume 01</span>
          </div>
          <h1 className="archive-title">Artist Tone Recipes</h1>
          <p className="archive-lede">
            Every iconic guitar tone breaks down into gear, signal chain, and
            knob positions. This is the library of the ones that defined a
            genre — reproduced on whatever rig you own.
          </p>
        </header>

        <section className="mt-10">
          <p
            className="text-base leading-relaxed md:text-lg"
            style={{ color: "var(--ink)" }}
          >
            A tone recipe is the complete answer to &ldquo;how do I get this
            sound on my rig.&rdquo; Not a vibes-based gear list. An exact
            signal chain, with every block&apos;s settings, the guitar the
            artist used (pickup, tuning, strings), and the plain-English
            reasoning for why each piece matters.
          </p>
          <p
            className="mt-4 text-base leading-relaxed md:text-lg"
            style={{ color: "var(--ink)" }}
          >
            Every recipe is translated for Helix, Quad Cortex, TONEX, Fractal,
            Kemper, and Boss Katana. Helix and Katana users can download the{" "}
            <code style={{ background: "var(--paper-2)", padding: "1px 5px" }}>
              .hlx
            </code>{" "}
            or{" "}
            <code style={{ background: "var(--paper-2)", padding: "1px 5px" }}>
              .tsl
            </code>{" "}
            file directly from the recipe page. Free with a sign-up.
          </p>
        </section>

        {ERAS.map((era) => {
          const recipes = era.artistSlugs
            .map((slug) => byArtistSlug[slug])
            .filter(Boolean);
          if (recipes.length === 0) return null;
          return (
            <section key={era.title} className="mt-16 md:mt-20">
              <div className="section-head">
                <span className="section-mark">{era.mark}</span>
                <h2 className="section-title">{era.title}</h2>
                <span className="section-rule" aria-hidden="true" />
                <span className="section-meta">
                  {recipes.reduce((n, g) => n + g.recipes.length, 0)} recipes
                </span>
              </div>
              <p
                className="mt-2 max-w-[58ch] text-base leading-relaxed"
                style={{ color: "var(--ink-muted)" }}
              >
                {era.blurb}
              </p>
              <ul
                className="mt-6 border-b"
                style={{ borderColor: "rgba(10,9,8,0.18)" }}
              >
                {recipes.map((g) => (
                  <li
                    key={g.artistSlug}
                    className="border-t group"
                    style={{ borderColor: "rgba(10,9,8,0.18)" }}
                  >
                    <Link
                      href={`/artist/${g.artistSlug}`}
                      className="block py-5"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <h3
                          className="display text-lg group-hover:underline md:text-xl"
                          style={{
                            color: "var(--ink)",
                            letterSpacing: "-0.01em",
                            textDecorationThickness: "1px",
                            textUnderlineOffset: "4px",
                          }}
                        >
                          {g.artistName}
                        </h3>
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.18em]"
                          style={{
                            color: "var(--ink-muted)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {g.recipes
                            .slice(0, 2)
                            .map((r) => {
                              const song = getSongBySlug(r.song_slug);
                              return song?.title ?? "";
                            })
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-20">
          <div className="section-head">
            <span className="section-mark">·</span>
            <h2 className="section-title">Every artist</h2>
            <span className="section-rule" aria-hidden="true" />
            <span className="section-meta">A–Z · {grouped.length} total</span>
          </div>
          <div
            className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3"
            style={{ color: "var(--ink)" }}
          >
            {[...grouped]
              .sort((a, b) => a.artistName.localeCompare(b.artistName))
              .map((g) => (
                <Link
                  key={g.artistSlug}
                  href={`/artist/${g.artistSlug}`}
                  className="flex items-baseline justify-between py-1 hover:underline"
                  style={{ color: "var(--ink)" }}
                >
                  <span>{g.artistName}</span>
                </Link>
              ))}
          </div>
        </section>

        <aside
          className="mt-20"
          style={{
            borderTop: "3px solid var(--ink)",
            borderBottom: "1px solid rgba(10,9,8,0.12)",
            paddingTop: "22px",
            paddingBottom: "26px",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{
              color: "var(--amber-2)",
              fontFamily: "var(--font-mono)",
            }}
          >
            How to use a recipe
          </p>
          <h2
            className="display mt-2 text-3xl md:text-4xl"
            style={{ color: "var(--ink)", letterSpacing: "-0.015em" }}
          >
            Find the tone. Pick your platform. Load the preset.
          </h2>
          <p
            className="mt-3 max-w-[58ch] text-base leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
          >
            Every recipe page has tabs for Helix, Quad Cortex, TONEX, Fractal,
            Kemper, and Boss Katana. Block-by-block settings, with the
            reasoning under each. Helix and Katana users can download the
            preset file directly. The settings are starting points — your
            guitar, pickups, and cab will push some frequencies where the
            original didn&apos;t, and that&apos;s where the notes under each
            block earn their keep.
          </p>
          <div className="mt-6">
            <Link
              href="/browse"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold no-underline transition-opacity hover:opacity-90"
              style={{
                background: "var(--amber)",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                letterSpacing: "0.02em",
              }}
            >
              Browse all recipes →
            </Link>
          </div>
        </aside>

        <div
          className="mt-16 text-center text-[10px] tracking-[0.4em]"
          style={{ color: "var(--ink-faint)" }}
          aria-hidden="true"
        >
          ▪ ▪ ▪
        </div>
      </article>
    </>
  );
}
