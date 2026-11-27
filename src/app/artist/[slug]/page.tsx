import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  artists,
  toneRecipes,
  getArtistBySlug,
  getSongBySlug,
  getSongsByArtistSlug,
} from "@/lib/data";
import { monogramFor } from "@/components/v3/LpArt";
import ToneCard from "@/components/recipe/redesign/ToneCard";
import PostsRail from "@/app/_pages/PostsRail";
import { findRelatedPosts } from "@/components/v3/findRelatedPosts";
import { artistJsonLdSet } from "@/lib/seo/jsonld";
import {
  getArtistPhoto,
  photoSrc,
  photoPage,
  licenseUrl,
} from "@/lib/data/artist-photos";

// Hard-404 unknown slugs. The segment's loading.tsx starts streaming a 200
// before notFound() can throw, so garbage slugs were soft-404s; with
// dynamicParams=false, non-generated slugs 404 without rendering at all.
export const dynamicParams = false;

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
  if (!a) {
    return { title: "Preview | Fader & Knob", robots: { index: false, follow: false } };
  }
  // No brand suffix here: the root layout's title template appends
  // " | Fader & Knob" (src/app/layout.tsx). Spelling it out twice bloated
  // every artist SERP title past 60 chars.
  const title = `${a.name} Tone Recipes`;
  const description = (a.bio ?? "").slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/artist/${slug}` },
    keywords: [a.name, ...(a.genres ?? []), "tone recipe", "guitar tone"],
    openGraph: {
      title,
      description,
      type: "profile",
      ...(a.image_url ? { images: [{ url: a.image_url, alt: a.name }] } : {}),
    },
    twitter: {
      card: a.image_url ? "summary_large_image" : "summary",
      title,
      description,
      ...(a.image_url ? { images: [a.image_url] } : {}),
    },
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

  const photo = getArtistPhoto(slug);
  const photoLicense = photo ? licenseUrl(photo.license) : null;
  const artistSongs = getSongsByArtistSlug(slug);
  const recipes = toneRecipes.filter((r) => {
    const s = getSongBySlug(r.song_slug);
    return s?.artist_slug === slug;
  });

  // Field Notes that mention this artist or their songs
  const artistPosts = findRelatedPosts({
    keywords: [
      artist.name,
      // Last name is usually how a writer references them mid-paragraph
      artist.name.split(" ").slice(-1)[0],
      ...artistSongs.map((s) => s.title),
    ],
    tags: [artist.slug, ...(artist.genres ?? [])],
    categories: ["artist-tone"],
    limit: 3,
  });

  const { musicGroup, breadcrumb } = artistJsonLdSet(artist);
  const queue = artistSongs.filter((s) => !recipes.some((r) => r.song_slug === s.slug));

  return (
    <div className="fk-wrap fkp-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/browse">Tones</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{artist.name}</span>
      </nav>

      <header className="fkp-profile">
        <div className="fkp-profile-text">
          <h1 className="fk-display">{artist.name}</h1>
          {artist.bio && <p className="fk-lead">{artist.bio}</p>}
          {artist.genres && artist.genres.length > 0 && (
            <ul className="fkp-tags" aria-label="Genres">
              {artist.genres.map((g) => (
                <li key={g} className="fkp-tag">
                  {g.replace(/-/g, " ")}
                </li>
              ))}
            </ul>
          )}
        </div>
        {photo ? (
          <figure className="fkp-profile-figure">
            <div className="fkp-profile-art is-photo">
              {/* Plain img: Commons serves the sized file through a redirect. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc(photo)}
                alt={artist.name}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <figcaption className="fk-caption fkp-photo-credit">
              Photo: {photo.author},{" "}
              {photoLicense ? (
                <a href={photoLicense} rel="license noopener" target="_blank">
                  {photo.license}
                </a>
              ) : (
                photo.license.toLowerCase()
              )}
              , via{" "}
              <a href={photoPage(photo)} rel="noopener" target="_blank">
                Wikimedia Commons
              </a>
            </figcaption>
          </figure>
        ) : (
          <div className="fkp-profile-art">
            {artist.image_url ? (
              <Image
                src={artist.image_url}
                alt={artist.name}
                fill
                priority
                sizes="(max-width: 720px) 100vw, 360px"
              />
            ) : (
              <span className="fk-t1" aria-hidden="true">
                {monogramFor(artist.name)}
              </span>
            )}
          </div>
        )}
      </header>

      {recipes.length > 0 && (
        <section className="fkp-section">
          <h2 className="fk-t2">{artist.name} catalogue</h2>
          <div className="fk-card-grid">
            {recipes.map((r) => (
              <ToneCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      )}

      {/* Field notes that mention this artist */}
      <PostsRail title={`Field notes on ${artist.name}`} posts={artistPosts} />

      {/* Songs without recipes yet */}
      {queue.length > 0 && (
        <section className="fkp-section">
          <div className="fkp-sectionhead">
            <h2 className="fk-t2">Songs in the queue</h2>
            <p className="fk-caption">Awaiting translation</p>
          </div>
          <ul className="fkp-rows">
            {queue.map((s) => (
              <li key={s.slug}>
                <Link href={`/song/${s.slug}`} className="fkp-row">
                  <span className="fkp-row-main">
                    <span className="fk-rowcard-title">{s.title}</span>
                    <span className="fk-caption">
                      {s.album}
                      {s.year ? ` · ${s.year}` : ""}
                    </span>
                  </span>
                  <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
