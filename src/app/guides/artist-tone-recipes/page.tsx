import type { Metadata } from "next";
import Link from "next/link";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
  artists,
} from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";
import RecipeCard from "@/components/recipe/RecipeCard";

/**
 * Pillar hub #1: Artist Tone Recipes.
 *
 * First of eight pillar hubs called for by the 2026-04 content-authority
 * strategy. A hub page's job is threefold:
 *   1. Rank for the pillar's canonical query ("artist tone recipes",
 *      "how to get any guitar tone", etc.) via deep on-page content.
 *   2. Serve as the internal-linking backbone for every leaf post in the
 *      pillar — recipes, settings guides, artist profiles.
 *   3. Signal to Google that this site owns this topical cluster.
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

/** JSON-LD for the pillar hub — helps Google understand this as a
 *  canonical topical page, not just another blog post. */
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

/** Group recipes by artist and return a sorted array, most-covered first. */
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
    (a, b) => b.recipes.length - a.recipes.length ||
      a.artistName.localeCompare(b.artistName),
  );
}

/** Curated "eras" buckets. Each bucket's slug list is hand-picked so the
 *  hub reads as editorially curated, not auto-generated. Missing artists
 *  fall into the alphabetical master list further down. */
const ERAS: Array<{
  title: string;
  blurb: string;
  artistSlugs: string[];
}> = [
  {
    title: "The classic rock canon",
    blurb:
      "The tones that defined a generation of arena rock — Marshall stacks, Les Pauls, and the power chord. If you want to understand how modern rock guitar got here, start here.",
    artistSlugs: [
      "jimmy-page",
      "david-gilmour",
      "eddie-van-halen",
      "angus-young",
      "slash",
      "brian-may",
      "pete-townshend",
      "keith-richards",
    ],
  },
  {
    title: "Blues and blues-rock",
    blurb:
      "The roots of every lead tone in popular music. Strat-into-Fender for most; Gibson-into-Marshall for the blues-rock lineage. Expression lives in the pick, the volume knob, and the tube amp's breakup.",
    artistSlugs: [
      "stevie-ray-vaughan",
      "bb-king",
      "eric-clapton",
      "john-mayer",
      "joe-bonamassa",
      "billy-gibbons",
      "gary-clark-jr",
      "carlos-santana",
    ],
  },
  {
    title: "Metal and high-gain",
    blurb:
      "From Randy Rhoads' neo-classical through Hetfield's down-picking, Dimebag's Randall chainsaw, and modern djent. Scooped mids, tight low end, and the pick-to-speaker relationship under extreme gain.",
    artistSlugs: [
      "james-hetfield",
      "dimebag-darrell",
      "randy-rhoads",
      "dave-murray",
      "kirk-hammett",
      "adam-jones",
      "josh-homme",
    ],
  },
  {
    title: "Indie, alternative, and shoegaze",
    blurb:
      "Where gain became texture and effects became composition. Fender offsets, Big Muffs and Tonebenders, delay and reverb used structurally rather than decoratively.",
    artistSlugs: [
      "kurt-cobain",
      "jonny-greenwood",
      "matt-bellamy",
      "alex-turner",
      "jack-white",
      "johnny-marr",
      "dan-auerbach",
      "noel-gallagher",
      "john-frusciante",
    ],
  },
  {
    title: "Innovators and outliers",
    blurb:
      "Players whose signal chains are so specific that understanding them teaches you the grammar of guitar tone itself.",
    artistSlugs: [
      "jimi-hendrix",
      "joe-satriani",
      "alex-lifeson",
      "jerry-garcia",
      "mark-knopfler",
    ],
  },
];

export default function ArtistToneRecipesPillarPage() {
  const grouped = groupByArtist();

  // Build a lookup for the curated era buckets
  const byArtistSlug = Object.fromEntries(grouped.map((g) => [g.artistSlug, g]));

  return (
    <>
      <PillarJsonLd recipes={toneRecipes} />

      <article className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="mb-12 md:mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-accent">
            Pillar guide · {toneRecipes.length} recipes · {grouped.length} artists
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Artist Tone Recipes
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted md:text-xl">
            Every iconic guitar tone can be broken down into gear, signal
            chain, and knob positions. This is our library of the ones that
            defined a genre — reproduced on whatever rig you own.
          </p>
        </header>

        {/* ── What a tone recipe is ────────────────────────────────────── */}
        <section className="mb-12 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">What is a tone recipe?</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            A tone recipe is the complete answer to &ldquo;how do I get this
            sound on my rig.&rdquo; Not a vibes-based list of gear. An exact
            signal chain, with every block&apos;s settings, the guitar the
            artist was using (pickup, tuning, strings), and a plain-English
            explanation of why each piece matters.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Every recipe on the site is translated for every major platform —
            Line 6 Helix, Neural DSP Quad Cortex, IK TONEX, Fractal, Kemper,
            and Boss Katana — so you can dial it in whatever rig you own. For
            Helix and Katana, downloadable <code>.hlx</code> and <code>.tsl</code>{" "}
            files are available on the recipe page itself.
          </p>
        </section>

        {/* ── Eras — the curated buckets ───────────────────────────────── */}
        <section className="mb-14">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Browse by era</h2>
          <div className="space-y-10">
            {ERAS.map((era) => {
              const eraRecipes = era.artistSlugs
                .map((slug) => byArtistSlug[slug])
                .filter(Boolean)
                .flatMap((g) => g.recipes);
              if (eraRecipes.length === 0) return null;
              return (
                <div key={era.title}>
                  <h3 className="text-xl font-bold text-foreground">{era.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted md:text-base">
                    {era.blurb}
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {eraRecipes.slice(0, 6).map((r) => {
                      const song = getSongBySlug(r.song_slug);
                      const artist = song
                        ? getArtistBySlug(song.artist_slug)
                        : undefined;
                      return (
                        <RecipeCard
                          key={r.slug}
                          recipe={r}
                          song={song}
                          artist={artist}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Every artist (alphabetical) ─────────────────────────────── */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Every artist</h2>
          <p className="mb-6 max-w-2xl text-sm text-muted md:text-base">
            The full list, alphabetical. Click any artist for their recipes,
            gear profile, and tone analysis.
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {[...grouped]
              .sort((a, b) => a.artistName.localeCompare(b.artistName))
              .map((g) => (
                <Link
                  key={g.artistSlug}
                  href={`/artist/${g.artistSlug}`}
                  className="flex items-center justify-between rounded px-1 py-1 text-foreground transition-colors hover:text-accent"
                >
                  <span>{g.artistName}</span>
                  <span className="text-xs text-muted">{g.recipes.length}</span>
                </Link>
              ))}
          </div>
        </section>

        {/* ── How to use these recipes ─────────────────────────────────── */}
        <section className="mb-14 max-w-3xl prose-dark">
          <h2 className="mb-3 text-2xl font-bold">How to use a recipe</h2>
          <ol className="space-y-3 text-base leading-relaxed text-foreground/85">
            <li>
              <strong>Find the tone you want.</strong> Search by song, artist,
              or genre. Every recipe names the song and the specific
              performance it&apos;s reproducing (e.g. the 1980 Comfortably
              Numb solo is a different rig from the 1994 Pulse tour version).
            </li>
            <li>
              <strong>Pick your platform.</strong> Each recipe has tabs for
              Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana, and
              physical rigs. All are free to view.
            </li>
            <li>
              <strong>Load the settings.</strong> Work through the signal chain
              block by block. The block detail panel shows exact knob
              positions — amp knobs on our signature Fader & Knob visual
              controls — so there&apos;s no ambiguity about what &ldquo;mid
              at 6&rdquo; means.
            </li>
            <li>
              <strong>Or download the preset.</strong> Helix and Katana users
              can grab a <code>.hlx</code> or <code>.tsl</code> file directly
              from the recipe page. Free for the first 10 downloads per month;
              unlimited with Tone Pass.
            </li>
            <li>
              <strong>Tune to your rig.</strong> The recipes are starting
              points, not absolutes. Your guitar, pickups, and speaker cab
              will push some frequencies where the original didn&apos;t, and
              vice versa. Read the notes under each block — that&apos;s
              where the reasoning lives.
            </li>
          </ol>
        </section>

        {/* ── Related guides (internal linking) ───────────────────────── */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            Related guides
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Pedal settings guide",
                href: "/blog?category=gear-guides",
                desc: "Klon, Tube Screamer, Big Muff, RAT, DS-1 — exact settings from clean boost to wall-of-fuzz.",
              },
              {
                title: "Amp settings guide",
                href: "/blog?category=gear-guides",
                desc: "Plexi, JCM800, AC30, Twin Reverb, 5150 — how to dial each amp for its signature tone.",
              },
              {
                title: "Modeler deep dives",
                href: "/platforms",
                desc: "Platform-specific guides for Helix, Quad Cortex, TONEX, Fractal, Kemper, and Boss Katana.",
              },
              {
                title: "Worship guitar tone",
                href: "/blog?category=worship",
                desc: "AC30 + Klon + dotted eighth delay + shimmer. The Sunday morning rig, broken down.",
              },
              {
                title: "Signal chain fundamentals",
                href: "/how-it-works",
                desc: "Why the order of your pedals matters. Gain staging, impedance, true bypass vs buffered.",
              },
              {
                title: "Bedroom-volume tone",
                href: "/blog?category=home-recording",
                desc: "Getting real amp-in-the-room feel through headphones or a Mustang Micro. Parent-player approved.",
              },
            ].map((g) => (
              <Link
                key={g.href + g.title}
                href={g.href}
                className="block rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-surface"
              >
                <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                <p className="mt-2 text-xs text-muted">{g.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this pillar
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">
            Get a new tone recipe every Friday
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Sunday setlists, one-off inspiration, or just the next tone you
            want to dial in. Join Tone of the Week — free, one email on
            Friday, one killer recipe, one blog deep-dive, one quick tip you
            can use tonight.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Browse all recipes
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
            >
              See Tone Pass
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}

// Suppress unused-import warning for `artists` — kept in the import list so
// future edits that want to enumerate all artists (including ones without
// recipes yet) don't have to re-import it.
void artists;
