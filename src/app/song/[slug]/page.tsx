import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import {
  songs,
  getSongBySlug,
  getArtistBySlug,
  getRecipesBySongSlug,
} from "@/lib/data";
import { monogramFor } from "@/components/v3/LpArt";
import { songJsonLdSet } from "@/lib/seo/jsonld";

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
    alternates: { canonical: `/song/${slug}` },
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
  // detour. Send the user straight to the recipe: the Listen/Tab CTAs
  // and album art now live on the recipe head, so nothing is lost.
  if (recipes.length === 1) {
    // 308, not 307: this alias is permanent and is linked from every
    // recipe breadcrumb, so link equity must consolidate on the recipe.
    permanentRedirect(`/recipe/${recipes[0].slug}`);
  }

  const { musicRecording, breadcrumb } = songJsonLdSet(song, artist);
  const meta = [song.year, song.genres?.[0]].filter(Boolean).join(" · ");

  return (
    <div className="fk-wrap fkp-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicRecording) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/browse">Tones</Link>
        {artist && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/artist/${artist.slug}`}>{artist.name}</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{song.title}</span>
      </nav>

      <header className="fk-recipe-intro">
        <div className="fk-recipe-titlerow">
          <div className="fk-recipe-cover r-md">
            {song.album_art_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={song.album_art_url}
                alt={`${song.album ?? song.title} cover`}
                width={132}
                height={132}
              />
            ) : (
              <span className="fk-t2" aria-hidden="true">
                {monogramFor(artist?.name)}
              </span>
            )}
          </div>
          <div className="fk-recipe-titles">
            <h1 className="fk-display">{song.title}</h1>
            {(artist || song.album) && (
              <p className="fk-lead">
                {artist && <Link href={`/artist/${artist.slug}`}>{artist.name}</Link>}
                {artist && song.album ? ", " : ""}
                {song.album}
              </p>
            )}
            {meta && <p className="fk-card-meta">{meta}</p>}
          </div>
        </div>
        {(song.external_video_url || song.external_tab_url) && (
          <div className="fk-recipe-actions">
            {song.external_video_url && (
              <a
                href={song.external_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="fk-btn"
              >
                Listen on YouTube
                <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />
              </a>
            )}
            {song.external_tab_url && (
              <a
                href={song.external_tab_url}
                target="_blank"
                rel="noopener noreferrer"
                className="fk-btn fk-btn-secondary"
              >
                Tab on Songsterr
                <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />
              </a>
            )}
          </div>
        )}
      </header>

      {recipes.length > 0 && (
        <section className="fkp-section">
          <h2 className="fk-t2">
            {recipes.length === 1 ? "The tone" : "Tone variants on this song"}
          </h2>
          <div className="fk-card-grid">
            {recipes.map((r) => {
              const blocks = r.signal_chain?.length ?? 0;
              return (
                <Link key={r.slug} href={`/recipe/${r.slug}`} className="fk-card">
                  <div className="fk-card-art">
                    {song.album_art_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={song.album_art_url} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="fk-t2" aria-hidden="true">
                        {monogramFor(artist?.name)}
                      </span>
                    )}
                  </div>
                  <div className="fk-card-body">
                    <div className="fk-card-head">
                      <h3 className="fk-t3">{r.title}</h3>
                      <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
                    </div>
                    {r.description && (
                      <p className="fk-body-sm">
                        {r.description.slice(0, 80)}
                        {r.description.length > 80 ? "…" : ""}
                      </p>
                    )}
                    {blocks > 0 && <p className="fk-card-meta">{blocks} blocks</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
