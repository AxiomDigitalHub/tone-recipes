import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  artists,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "../_components/recipe-to-blocks";
import { LpArt, monogramFor } from "../_components/LpArt";

export const metadata: Metadata = {
  title: "Preview · The Archive — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function PreviewBrowse() {
  const recipes = toneRecipes;
  const decadeBuckets = new Map<number, typeof toneRecipes>();
  for (const r of recipes) {
    const song = getSongBySlug(r.song_slug);
    const decade = song?.year ? Math.floor(song.year / 10) * 10 : 1980;
    if (!decadeBuckets.has(decade)) decadeBuckets.set(decade, []);
    decadeBuckets.get(decade)!.push(r);
  }
  const sortedDecades = [...decadeBuckets.keys()].sort((a, b) => b - a);

  return (
    <div className="container">
      <section className="archive-page">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>The Archive</span>
        </div>

        <header className="archive-page-head">
          <div className="archive-kicker">
            <span>The Archive</span>
            <span>·</span>
            <span>Vol. IV</span>
            <span>·</span>
            <span>{recipes.length.toLocaleString()} recipes</span>
            <span>·</span>
            <span>{artists.length} players</span>
          </div>
          <h1 className="archive-title">
            Every tone we&apos;ve mapped, by <em>era</em>
          </h1>
          <p className="archive-lede">
            Browse the full library — from the Strats and Plexis of the late
            sixties to the offset-and-Stomp pedalboards of last week. Each
            sleeve opens onto the chain, the knobs, and the numbers.
          </p>
          <nav className="archive-decade-pills" aria-label="Jump to era">
            {sortedDecades.map((d) => (
              <a key={d} href={`#decade-${d}`} className="archive-decade-pill">
                The {d}s
                <span className="archive-decade-pill-count">
                  {decadeBuckets.get(d)!.length}
                </span>
              </a>
            ))}
          </nav>
        </header>

        {sortedDecades.map((decade) => {
          const list = decadeBuckets.get(decade)!;
          return (
            <div key={decade} className="archive-decade" id={`decade-${decade}`}>
              <div className="how-head">
                <h2 className="display">The {decade}s</h2>
                <span className="section-rule" aria-hidden="true" />
                <span className="section-meta">{list.length} files</span>
              </div>
              <div className="audition-grid">
                {list.map((r) => {
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
                        <span className="audition-song">
                          {rSong?.title ?? r.title}
                        </span>
                        <span className="audition-artist">
                          <em>{rArtist?.name ?? "Unknown"}</em>
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
            </div>
          );
        })}
      </section>
    </div>
  );
}
