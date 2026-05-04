import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  songs,
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
  getRecipesBySongSlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { songJsonLdSet } from "@/lib/seo/preview-jsonld";

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
  if (!s) {
    return { title: "Preview — Fader & Knob", robots: { index: false, follow: false } };
  }
  const artist = getArtistBySlug(s.artist_slug);
  const title = `${s.title}${artist ? ` by ${artist.name}` : ""} — Tone Recipes`;
  const description = `Tone recipes for "${s.title}"${artist ? ` by ${artist.name}` : ""}. Signal chains across Helix, Quad Cortex, TONEX, Fractal, Kemper, and pedalboard.`;
  return {
    title,
    description,
    keywords: [s.title, artist?.name, ...(s.genres ?? []), "tone recipe", "guitar tone"].filter(
      Boolean,
    ) as string[],
    openGraph: {
      title,
      description,
      type: "music.song",
      ...(s.album_art_url
        ? { images: [{ url: s.album_art_url, alt: `${s.album} album art` }] }
        : {}),
    },
    twitter: {
      card: s.album_art_url ? "summary_large_image" : "summary",
      title,
      description,
      ...(s.album_art_url ? { images: [s.album_art_url] } : {}),
    },
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

  // When a song has exactly one recipe, the song page is just a one-link
  // detour. Send the user straight to the recipe — the Listen/Tab CTAs
  // and album art now live on the recipe head, so nothing is lost.
  if (recipes.length === 1) {
    redirect(`/recipe/${recipes[0].slug}`);
  }
  const songIdx = songs.findIndex((s) => s.slug === slug) + 1;

  const { musicRecording, breadcrumb } = songJsonLdSet(song, artist);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicRecording) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="song-detail">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/browse">Archive</Link>
          {artist && (
            <>
              <span className="sep">/</span>
              <Link href={`/artist/${artist.slug}`}>
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
              {song.year && <span>{song.year}</span>}
              {song.genres?.[0] && (
                <>
                  {song.year && <span>·</span>}
                  <span>{song.genres[0]}</span>
                </>
              )}
            </div>
            <h1 className="recipe-title display">{song.title}</h1>
            <div className="recipe-credits">
              {artist && (
                <Link
                  href={`/artist/${artist.slug}`}
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
            </div>
            <div className="audition-grid">
              {recipes.map((r) => {
                const rIdx =
                  toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
                const rBlocks = recipeToBlocks(r, "helix");
                return (
                  <Link
                    key={r.slug}
                    href={`/recipe/${r.slug}`}
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
