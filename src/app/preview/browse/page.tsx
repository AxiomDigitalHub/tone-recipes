import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  artists,
  getSongBySlug,
  getArtistBySlug,
  getAllGenres,
} from "@/lib/data";
import { recipeToBlocks } from "../_components/recipe-to-blocks";
import { LpArt, monogramFor } from "../_components/LpArt";
import { getAllPlatforms } from "@/lib/data/platforms";
import type { Platform } from "@/types/recipe";

export const metadata: Metadata = {
  title: "Preview · Browse — Fader & Knob",
  robots: { index: false, follow: false },
};

type SortKey = "newest" | "oldest" | "song-az" | "artist-az" | "blocks-desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "song-az", label: "Song A–Z" },
  { key: "artist-az", label: "Artist A–Z" },
  { key: "blocks-desc", label: "Most blocks" },
];

const DECADES = [2010, 2000, 1990, 1980, 1970, 1960];

export default async function PreviewBrowse({
  searchParams,
}: {
  searchParams: Promise<{
    era?: string;
    platform?: string;
    genre?: string;
    artist?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  const era = sp.era;
  const platformFilter = sp.platform;
  const genreFilter = sp.genre;
  const artistFilter = sp.artist;
  const sort: SortKey = (SORT_OPTIONS.find((s) => s.key === sp.sort)?.key) ?? "newest";

  // Filter cascade
  let filtered = toneRecipes;
  if (era) {
    const decade = Number(era);
    filtered = filtered.filter((r) => {
      const s = getSongBySlug(r.song_slug);
      if (!s?.year) return false;
      return Math.floor(s.year / 10) * 10 === decade;
    });
  }
  if (platformFilter) {
    filtered = filtered.filter((r) =>
      Boolean(r.platform_translations?.[platformFilter as Platform]),
    );
  }
  if (genreFilter) {
    filtered = filtered.filter((r) => {
      const s = getSongBySlug(r.song_slug);
      return s?.genres?.includes(genreFilter);
    });
  }
  if (artistFilter) {
    filtered = filtered.filter((r) => {
      const s = getSongBySlug(r.song_slug);
      return s?.artist_slug === artistFilter;
    });
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const sA = getSongBySlug(a.song_slug);
    const sB = getSongBySlug(b.song_slug);
    switch (sort) {
      case "oldest":
        return (sA?.year ?? 9999) - (sB?.year ?? 9999);
      case "song-az":
        return (sA?.title ?? a.title).localeCompare(sB?.title ?? b.title);
      case "artist-az": {
        const aA = sA ? getArtistBySlug(sA.artist_slug) : undefined;
        const bA = sB ? getArtistBySlug(sB.artist_slug) : undefined;
        return (aA?.name ?? "").localeCompare(bA?.name ?? "");
      }
      case "blocks-desc":
        return (
          (b.signal_chain?.length ?? 0) - (a.signal_chain?.length ?? 0)
        );
      case "newest":
      default:
        return (sB?.year ?? 0) - (sA?.year ?? 0);
    }
  });

  const totalRecipes = toneRecipes.length;
  const allPlatforms = getAllPlatforms();

  // Top genres (by recipe count) — keep the rail tidy, hide the long tail
  const genreCounts = new Map<string, number>();
  for (const r of toneRecipes) {
    const s = getSongBySlug(r.song_slug);
    s?.genres?.forEach((g) => {
      genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1);
    });
  }
  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([g]) => g);

  // Decade counts
  const decadeCounts = new Map<number, number>();
  for (const r of toneRecipes) {
    const s = getSongBySlug(r.song_slug);
    if (!s?.year) continue;
    const d = Math.floor(s.year / 10) * 10;
    decadeCounts.set(d, (decadeCounts.get(d) ?? 0) + 1);
  }

  // Platform counts
  const platformCounts = new Map<string, number>();
  for (const p of allPlatforms) {
    platformCounts.set(
      p.id,
      toneRecipes.filter((r) => Boolean(r.platform_translations?.[p.id as Platform])).length,
    );
  }

  // URL builder — preserves other filters when toggling one
  const buildHref = (next: Partial<typeof sp>) => {
    const merged: Record<string, string | undefined> = {
      era,
      platform: platformFilter,
      genre: genreFilter,
      artist: artistFilter,
      sort: sort === "newest" ? undefined : sort,
      ...next,
    };
    const qs = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    const s = qs.toString();
    return s ? `/preview/browse?${s}` : `/preview/browse`;
  };

  const hasFilters = Boolean(era || platformFilter || genreFilter || artistFilter);

  return (
    <div className="container">
      <section className="archive-page">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Browse</span>
        </div>

        <header className="archive-page-head">
          <div className="archive-kicker">
            <span>Browse</span>
            <span>·</span>
            <span>{totalRecipes.toLocaleString()} recipes</span>
            <span>·</span>
            <span>{artists.length} players</span>
          </div>
          <h1 className="archive-title">
            Find a tone, your way
          </h1>
          <p className="archive-lede">
            Filter by era, platform, genre, or artist. Each sleeve opens onto
            the chain, the knobs, and the numbers.
          </p>
        </header>

        {/* Filter rails — server-rendered, URL-driven */}
        <div className="browse-filters">
          <div className="browse-filter-row">
            <span className="browse-filter-label">Era</span>
            <Link
              href={buildHref({ era: undefined })}
              className={`browse-filter-pill ${!era ? "is-active" : ""}`}
            >
              All
            </Link>
            {DECADES.map((d) => {
              const count = decadeCounts.get(d) ?? 0;
              if (count === 0) return null;
              return (
                <Link
                  key={d}
                  href={buildHref({ era: String(d) })}
                  className={`browse-filter-pill ${era === String(d) ? "is-active" : ""}`}
                >
                  {d}s
                  <span className="browse-filter-pill-count">{count}</span>
                </Link>
              );
            })}
          </div>

          <div className="browse-filter-row">
            <span className="browse-filter-label">Platform</span>
            <Link
              href={buildHref({ platform: undefined })}
              className={`browse-filter-pill ${!platformFilter ? "is-active" : ""}`}
            >
              All
            </Link>
            {allPlatforms.map((p) => {
              const count = platformCounts.get(p.id) ?? 0;
              return (
                <Link
                  key={p.id}
                  href={buildHref({ platform: p.id })}
                  className={`browse-filter-pill ${platformFilter === p.id ? "is-active" : ""}`}
                >
                  {p.label}
                  <span className="browse-filter-pill-count">{count}</span>
                </Link>
              );
            })}
          </div>

          <div className="browse-filter-row">
            <span className="browse-filter-label">Genre</span>
            <Link
              href={buildHref({ genre: undefined })}
              className={`browse-filter-pill ${!genreFilter ? "is-active" : ""}`}
            >
              All
            </Link>
            {topGenres.map((g) => (
              <Link
                key={g}
                href={buildHref({ genre: g })}
                className={`browse-filter-pill ${genreFilter === g ? "is-active" : ""}`}
              >
                {g.replace(/-/g, " ")}
                <span className="browse-filter-pill-count">
                  {genreCounts.get(g) ?? 0}
                </span>
              </Link>
            ))}
          </div>

          <div className="browse-filter-row browse-filter-row-controls">
            <div>
              {hasFilters && (
                <Link href="/preview/browse" className="browse-filter-clear">
                  Clear filters ✕
                </Link>
              )}
            </div>
            <div className="browse-sort">
              <span className="browse-filter-label">Sort</span>
              {SORT_OPTIONS.map((s) => (
                <Link
                  key={s.key}
                  href={buildHref({ sort: s.key === "newest" ? undefined : s.key })}
                  className={`browse-sort-link ${sort === s.key ? "is-active" : ""}`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="browse-result-meta">
          {sorted.length === totalRecipes ? (
            <span>
              Showing all {totalRecipes.toLocaleString()} recipes
            </span>
          ) : (
            <span>
              {sorted.length} of {totalRecipes.toLocaleString()} recipes
            </span>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="browse-empty">
            <p>No recipes match these filters.</p>
            <Link href="/preview/browse" className="browse-filter-clear">
              Clear filters and start over →
            </Link>
          </div>
        ) : (
          <div className="audition-grid">
            {sorted.map((r) => {
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
        )}
      </section>
    </div>
  );
}
