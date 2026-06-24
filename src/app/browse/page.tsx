import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { getAllPlatforms } from "@/lib/data/platforms";
import type { Platform } from "@/types/recipe";
import { buildRigTokens } from "@/lib/gear-match";
import { getBandName } from "@/lib/song-band";
import BrowseRigFilter from "@/components/browse/BrowseRigFilter";

/**
 * Per-facet metadata. The browse filters (?era, ?genre, ?platform,
 * ?artist, ?sort) previously all shared one static title + description,
 * producing the duplicate-title / duplicate-meta cluster in the
 * 2026-06-16 audit (and the static title double-branded via the layout
 * template). Strategy (per Daniel): make the meaningful facets rankable
 * with unique titles/descriptions, and canonical the no-value param
 * (?sort) away.
 *
 * Canonical is built from era/genre/platform/artist in a FIXED key order
 * (so ?genre=rock&platform=helix and ?platform=helix&genre=rock resolve
 * to the same URL) and deliberately omits ?sort — sort variants carry no
 * search value and would otherwise each be a distinct indexable page.
 */
const PLATFORM_LABELS: Record<string, string> = {
  helix: "Helix",
  quad_cortex: "Quad Cortex",
  tonex: "TONEX",
  fractal: "Fractal",
  kemper: "Kemper",
  katana: "Boss Katana",
  pedalboard: "Pedalboard",
};

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    era?: string;
    platform?: string;
    genre?: string;
    artist?: string;
    sort?: string;
  }>;
}): Promise<Metadata> {
  const sp = await searchParams;

  // Canonical: meaningful facets only, fixed order, ?sort excluded.
  const canon = new URLSearchParams();
  if (sp.era) canon.set("era", sp.era);
  if (sp.genre) canon.set("genre", sp.genre);
  if (sp.platform) canon.set("platform", sp.platform);
  if (sp.artist) canon.set("artist", sp.artist);
  const qs = canon.toString();
  const canonical = qs ? `/browse?${qs}` : "/browse";

  // Human-readable facet phrase for the title/description.
  const parts: string[] = [];
  if (sp.era) parts.push(`${sp.era}s`);
  if (sp.genre) parts.push(titleCaseSlug(sp.genre));
  if (sp.platform && PLATFORM_LABELS[sp.platform]) {
    parts.push(PLATFORM_LABELS[sp.platform]);
  }
  if (sp.artist) parts.push(titleCaseSlug(sp.artist));

  if (parts.length === 0) {
    return {
      title: "Browse Tones",
      description:
        "The full archive of verified tone recipes. Filter by era, platform, or genre — every recipe with full signal chains and settings.",
      alternates: { canonical: "/browse" },
      openGraph: {
        title: "Browse Tones — Fader & Knob",
        description:
          "Every recipe in the archive, filterable by era, platform, and genre.",
        type: "website",
      },
    };
  }

  const facet = parts.join(" ");
  const title = `${facet} Tone Recipes`;
  const description = `Verified ${facet} tone recipes with full signal chains and exact settings for Helix, Quad Cortex, Fractal, Kemper, and more — from the Fader & Knob archive.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} — Fader & Knob`, description, type: "website" },
  };
}

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
    return s ? `/browse?${s}` : `/browse`;
  };

  const hasFilters = Boolean(era || platformFilter || genreFilter || artistFilter);

  return (
    <div className="container">
      <section className="archive-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Browse</span>
        </div>

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">Browse Tones</h1>
        </header>

        {/* Two-column layout: filter sidebar on the left, results on the right.
            Sidebar is sticky so it stays in view as the grid scrolls. */}
        <div className="browse-layout">
          <aside className="browse-sidebar" aria-label="Filters">
            {hasFilters && (
              <div className="browse-sidebar-clear">
                <Link href="/browse" className="browse-filter-clear">
                  Clear filters ✕
                </Link>
              </div>
            )}

            <BrowseRigFilter />

            <div className="browse-filter-group">
              <h3 className="browse-filter-label">Era</h3>
              <ul className="browse-filter-list">
                <li>
                  <Link
                    href={buildHref({ era: undefined })}
                    className={`browse-filter-link ${!era ? "is-active" : ""}`}
                  >
                    <span>All eras</span>
                    <span className="browse-filter-count">{totalRecipes}</span>
                  </Link>
                </li>
                {DECADES.map((d) => {
                  const count = decadeCounts.get(d) ?? 0;
                  if (count === 0) return null;
                  return (
                    <li key={d}>
                      <Link
                        href={buildHref({ era: String(d) })}
                        className={`browse-filter-link ${era === String(d) ? "is-active" : ""}`}
                      >
                        <span>The {d}s</span>
                        <span className="browse-filter-count">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="browse-filter-group">
              <h3 className="browse-filter-label">Platform</h3>
              <ul className="browse-filter-list">
                <li>
                  <Link
                    href={buildHref({ platform: undefined })}
                    className={`browse-filter-link ${!platformFilter ? "is-active" : ""}`}
                  >
                    <span>All platforms</span>
                    <span className="browse-filter-count">{totalRecipes}</span>
                  </Link>
                </li>
                {allPlatforms.map((p) => {
                  const count = platformCounts.get(p.id) ?? 0;
                  return (
                    <li key={p.id}>
                      <Link
                        href={buildHref({ platform: p.id })}
                        className={`browse-filter-link ${platformFilter === p.id ? "is-active" : ""}`}
                      >
                        <span>{p.label}</span>
                        <span className="browse-filter-count">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="browse-filter-group">
              <h3 className="browse-filter-label">Genre</h3>
              <ul className="browse-filter-list">
                <li>
                  <Link
                    href={buildHref({ genre: undefined })}
                    className={`browse-filter-link ${!genreFilter ? "is-active" : ""}`}
                  >
                    <span>All genres</span>
                    <span className="browse-filter-count">{totalRecipes}</span>
                  </Link>
                </li>
                {topGenres.map((g) => (
                  <li key={g}>
                    <Link
                      href={buildHref({ genre: g })}
                      className={`browse-filter-link ${genreFilter === g ? "is-active" : ""}`}
                    >
                      <span style={{ textTransform: "capitalize" }}>
                        {g.replace(/-/g, " ")}
                      </span>
                      <span className="browse-filter-count">
                        {genreCounts.get(g) ?? 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="browse-results">
            <div className="browse-results-head">
              <div className="browse-result-meta">
                {sorted.length === totalRecipes
                  ? `Showing all ${totalRecipes.toLocaleString()} recipes`
                  : `${sorted.length} of ${totalRecipes.toLocaleString()} recipes`}
              </div>
              <div className="browse-sort">
                <span className="browse-filter-label browse-sort-label">Sort</span>
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

            {sorted.length === 0 ? (
              <div className="browse-empty">
                <p>No recipes match these filters.</p>
                <Link href="/browse" className="browse-filter-clear">
                  Clear filters and start over →
                </Link>
              </div>
            ) : (
              <div className="audition-grid browse-grid">
                {sorted.map((r) => {
                  const rSong = getSongBySlug(r.song_slug);
                  const rArtist = rSong
                    ? getArtistBySlug(rSong.artist_slug)
                    : undefined;
                  const rIdx =
                    toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
                  const rBlocks = recipeToBlocks(r, "helix");
                  const rigTokens = buildRigTokens(r.signal_chain);
                  const rBand = rSong ? getBandName(rSong, rArtist) : null;
                  return (
                    <Link
                      key={r.slug}
                      href={`/recipe/${r.slug}`}
                      className="audition-card"
                      data-rig-tokens={rigTokens}
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
                          {rBand ? (
                            <>
                              {rBand}
                              <span className="audition-artist-sep" aria-hidden="true"> / </span>
                              <em>{rArtist?.name ?? "Unknown"}</em>
                            </>
                          ) : (
                            <em>{rArtist?.name ?? "Unknown"}</em>
                          )}
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
          </div>
        </div>
      </section>
    </div>
  );
}
