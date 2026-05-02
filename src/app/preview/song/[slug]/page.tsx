import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  songs,
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
  getRecipesBySongSlug,
} from "@/lib/data";
import { recipeToBlocks } from "../../_components/recipe-to-blocks";
import { LpArt, monogramFor } from "../../_components/LpArt";

export function generateStaticParams() {
  return songs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSongBySlug(slug);
  return {
    title: s
      ? `Preview · ${s.title} — Fader & Knob`
      : "Preview — Fader & Knob",
    robots: { index: false, follow: false },
  };
}

export default async function PreviewSongDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) notFound();
  const artist = getArtistBySlug(song.artist_slug);
  const recipes = getRecipesBySongSlug(slug);
  const songIdx = songs.findIndex((s) => s.slug === slug) + 1;

  return (
    <div className="container">
      <div className="song-detail">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/browse">Archive</Link>
          {artist && (
            <>
              <span className="sep">/</span>
              <Link href={`/preview/artist/${artist.slug}`}>
                {artist.name}
              </Link>
            </>
          )}
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{song.title}</span>
        </div>

        <header className="recipe-head song-head">
          <div>
            <div className="recipe-issue">
              <span className="pill">
                Song No. {String(songIdx).padStart(3, "0")}
              </span>
              {song.year && <span>{song.year}</span>}
              {song.genres?.[0] && (
                <>
                  <span>·</span>
                  <span>{song.genres[0]}</span>
                </>
              )}
              <span>·</span>
              <span>{recipes.length} tone variant{recipes.length === 1 ? "" : "s"}</span>
            </div>
            <h1 className="recipe-title display">{song.title}</h1>
            <div className="recipe-credits">
              {artist && (
                <Link
                  href={`/preview/artist/${artist.slug}`}
                  className="song-artist-link"
                >
                  <em>{artist.name}</em>
                </Link>
              )}
              {song.album && (
                <>
                  <br />
                  <span style={{ marginTop: 6, display: "inline-block" }}>
                    {song.album}
                    {song.year ? ` · ${song.year}` : ""}
                  </span>
                </>
              )}
            </div>
            {song.external_video_url && (
              <a
                href={song.external_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="song-listen-cta"
              >
                Listen on YouTube <span aria-hidden="true">↗</span>
              </a>
            )}
            {song.external_tab_url && (
              <a
                href={song.external_tab_url}
                target="_blank"
                rel="noopener noreferrer"
                className="song-listen-cta song-listen-cta-secondary"
              >
                Tab on Songsterr <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <div className="song-cover">
            <LpArt
              cover={song.album_art_url}
              monogram={monogramFor(artist?.name)}
              meta={song.album}
              hue={songIdx}
              alt={`${song.album ?? song.title} cover`}
            />
          </div>
        </header>

        {recipes.length > 0 && (
          <section className="platform-section">
            <div className="how-head">
              <h2 className="display">
                {recipes.length === 1
                  ? "The tone"
                  : "Tone variants on this song"}
              </h2>
              <span className="section-rule" aria-hidden="true" />
              <span className="section-meta">
                {recipes.length} translation{recipes.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="audition-grid">
              {recipes.map((r) => {
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
                        cover={song.album_art_url}
                        monogram={monogramFor(artist?.name)}
                        meta={`${rBlocks.length} blocks`}
                        hue={rIdx}
                        alt=""
                      />
                    </div>
                    <div className="audition-meta">
                      <span className="audition-no">
                        Variant · {r.title.replace(`${artist?.name ?? ""}'s `, "").replace(song.title, "").trim() || "Default"}
                      </span>
                      <span className="audition-song">{r.title}</span>
                      <span className="audition-artist">
                        {r.description?.slice(0, 80)}
                        {r.description && r.description.length > 80 ? "…" : ""}
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
      </div>
    </div>
  );
}
