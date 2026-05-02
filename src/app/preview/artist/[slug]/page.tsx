import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  artists,
  toneRecipes,
  songs,
  getArtistBySlug,
  getSongBySlug,
  getSongsByArtistSlug,
} from "@/lib/data";
import { recipeToBlocks } from "../../_components/recipe-to-blocks";
import { LpArt, monogramFor } from "../../_components/LpArt";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtistBySlug(slug);
  return {
    title: a ? `Preview · ${a.name} — Fader & Knob` : "Preview — Fader & Knob",
    robots: { index: false, follow: false },
  };
}

export default async function PreviewArtistDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const artistSongs = getSongsByArtistSlug(slug);
  const recipes = toneRecipes.filter((r) => {
    const s = getSongBySlug(r.song_slug);
    return s?.artist_slug === slug;
  });
  const artistIdx = artists.findIndex((a) => a.slug === slug) + 1;

  return (
    <div className="container">
      <div className="artist-detail">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/browse">Archive</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{artist.name}</span>
        </div>

        <header className="artist-head">
          <div className="artist-head-text">
            <div className="recipe-issue">
              <span className="pill">
                Player No. {String(artistIdx).padStart(3, "0")}
              </span>
              {artist.genres?.[0] && <span>{artist.genres[0]}</span>}
              <span>·</span>
              <span>{artistSongs.length} songs</span>
              <span>·</span>
              <span>{recipes.length} recipes</span>
            </div>
            <h1 className="artist-title display">{artist.name}</h1>
            <p className="artist-bio">{artist.bio}</p>
            <div className="artist-genres">
              {artist.genres?.map((g) => (
                <span key={g} className="artist-genre-chip">
                  {g.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>
          <div className="artist-portrait">
            {artist.image_url ? (
              <Image
                src={artist.image_url}
                alt={artist.name}
                fill
                sizes="(max-width: 720px) 100vw, 360px"
                className="artist-portrait-img"
              />
            ) : (
              <div className="artist-portrait-fallback" aria-hidden="true">
                {monogramFor(artist.name)}
              </div>
            )}
            <div className="artist-portrait-label">
              <span>{artist.name.split(" ").slice(-1)[0]}</span>
              <span>FILE {String(artistIdx).padStart(3, "0")}</span>
            </div>
          </div>
        </header>

        {recipes.length > 0 && (
          <section className="platform-section">
            <div className="how-head">
              <span className="how-mark">§</span>
              <h2 className="display">
                The {artist.name.split(" ").slice(-1)[0]} catalogue.
              </h2>
              <span className="section-rule" aria-hidden="true" />
              <span className="section-meta">
                {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="audition-grid">
              {recipes.map((r) => {
                const rSong = getSongBySlug(r.song_slug);
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
                        monogram={monogramFor(artist.name)}
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
                        {rSong?.album ?? "Unknown album"}
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
        )}

        {/* Songs without recipes — flagged */}
        {artistSongs.filter((s) => !recipes.some((r) => r.song_slug === s.slug)).length > 0 && (
          <section className="platform-section">
            <div className="how-head">
              <span className="how-mark">¶</span>
              <h2 className="display">Songs in the queue.</h2>
              <span className="section-rule" aria-hidden="true" />
              <span className="section-meta">awaiting translation</span>
            </div>
            <div className="archive-side">
              {artistSongs
                .filter((s) => !recipes.some((r) => r.song_slug === s.slug))
                .map((s) => {
                  const sIdx = songs.findIndex((x) => x.slug === s.slug) + 1;
                  return (
                    <Link
                      key={s.slug}
                      href={`/preview/song/${s.slug}`}
                      className="archive-item"
                    >
                      <div className="archive-item-num">
                        No.<br />
                        {String(sIdx).padStart(3, "0")}
                      </div>
                      <div>
                        <div className="archive-item-title">{s.title}</div>
                        <div className="archive-byline">
                          <em>{s.album}</em>
                          {s.year ? ` · ${s.year}` : ""}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
