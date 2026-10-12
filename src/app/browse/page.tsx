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
import { PLATFORMS, platformLabel } from "@/lib/constants";
import type { Platform } from "@/types/recipe";
import { buildRigTokens } from "@/lib/gear-match";
import { getBandName } from "@/lib/song-band";
import { parsePageParam, pageWindow, paginate } from "@/lib/pagination";
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
 *
 * ?page IS part of the canonical (unlike ?sort): each page holds a
 * different slice of the catalog, so pointing them all at /browse would
 * tell Google the deeper pages are duplicates and strip the only crawl
 * path to the recipes on them. Page 1 canonicals to the bare URL — never
 * ?page=1 — so the default view keeps one address.
 */
// Platform labels come from the canonical list in @/lib/constants
// (platformLabel). isKnownPlatform guards against junk ?platform values
// leaking into the page title.
const isKnownPlatform = (id: string) => PLATFORMS.some((p) => p.id === id);

/** Cards per page. Multiple of 3 so the 3-wide grid never ends ragged. */
const PAGE_SIZE = 48;

/**
 * Catalog ordinal (1-based) per recipe slug, built ONCE at module load.
 *
 * The card loop used to recover this with
 * `toneRecipes.findIndex((tr) => tr.slug === r.slug)` — a full linear
 * scan per card, i.e. O(n²) per request, on a route that renders
 * uncached on every single view. A Map matches how the data layer
 * already resolves slugs (getSongBySlug/getArtistBySlug are Map gets).
 *
 * It must stay keyed on catalog position, not the position within the
 * filtered/sorted page, because it feeds LpArt's `hue` — deriving the
 * hue from the page index would recolour a recipe's art every time the
 * viewer sorted or filtered.
 */
const catalogOrdinalBySlug = new Map<string, number>(
  toneRecipes.map((r, i) => [r.slug, i + 1]),
);

/** Shared by generateMetadata and the page — keep the two in step. */
type BrowseSearchParams = {
  era?: string;
  platform?: string;
  genre?: string;
  artist?: string;
  sort?: string;
  page?: string;
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
  searchParams: Promise<BrowseSearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePageParam(sp.page);

  // Canonical: meaningful facets only, fixed order, ?sort excluded,
  // ?page last and only past page 1.
  const canon = new URLSearchParams();
  if (sp.era) canon.set("era", sp.era);
  if (sp.genre) canon.set("genre", sp.genre);
  if (sp.platform) canon.set("platform", sp.platform);
  if (sp.artist) canon.set("artist", sp.artist);
  if (page > 1) canon.set("page", String(page));
  const qs = canon.toString();
  const canonical = qs ? `/browse?${qs}` : "/browse";

  // Page 2+ needs its own title/description or it re-opens the
  // duplicate-title cluster the 2026-06-16 audit flagged. The total page
  // count is deliberately NOT quoted here — generateMetadata would have
  // to replay the whole filter cascade to learn it, doubling the work on
  // an uncached route for a string nobody searches for.
  const pageSuffixTitle = page > 1 ? ` — Page ${page}` : "";
  const pageSuffixDesc = page > 1 ? ` Page ${page}.` : "";

  // Human-readable facet phrase for the title/description.
  const parts: string[] = [];
  if (sp.era) parts.push(`${sp.era}s`);
  if (sp.genre) parts.push(titleCaseSlug(sp.genre));
  if (sp.platform && isKnownPlatform(sp.platform)) {
    parts.push(platformLabel(sp.platform));
  }
  if (sp.artist) parts.push(titleCaseSlug(sp.artist));

  if (parts.length === 0) {
    const title = `Browse Tones${pageSuffixTitle}`;
    return {
      title,
      description:
        "The full archive of tone recipes. Filter by era, platform, or genre — every recipe with full signal chains and exact settings." +
        pageSuffixDesc,
      alternates: { canonical },
      openGraph: {
        title: `${title} — Fader & Knob`,
        description:
          "Every recipe in the archive, filterable by era, platform, and genre." +
          pageSuffixDesc,
        type: "website",
      },
    };
  }

  const facet = parts.join(" ");
  const title = `${facet} Tone Recipes${pageSuffixTitle}`;
  const description =
    `Verified ${facet} tone recipes with full signal chains and exact settings for Helix, Quad Cortex, Fractal, Kemper, and more — from the Fader & Knob archive.` +
    pageSuffixDesc;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} — Fader & Knob`, description, type: "website" },
  };
}

type SortKey =
  | "newest"
  | "oldest"
  | "song-az"
  | "artist-az"
  | "blocks-desc"
  | "song-year";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "song-year", label: "Song year" },
  { key: "song-az", label: "Song A–Z" },
  { key: "artist-az", label: "Artist A–Z" },
  { key: "blocks-desc", label: "Most blocks" },
];

const DECADES = [2010, 2000, 1990, 1980, 1970, 1960];

export default async function PreviewBrowse({
  searchParams,
}: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const sp = await searchParams;
  const era = sp.era;
  const platformFilter = sp.platform;
  const genreFilter = sp.genre;
  const artistFilter = sp.artist;
  const sort: SortKey = (SORT_OPTIONS.find((s) => s.key === sp.sort)?.key) ?? "newest";
  const requestedPage = parsePageParam(sp.page);

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

  // Sort. Resolve song/artist ONCE per recipe before sorting — the old
  // comparator did the lookups inside sort(), i.e. O(n log n) times per
  // uncached page view (and /browse renders per-request; it reads
  // searchParams).
  const decorated = filtered.map((r) => {
    const song = getSongBySlug(r.song_slug);
    const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
    return { r, song, artist };
  });
  decorated.sort((a, b) => {
    switch (sort) {
      // "Newest"/"Oldest" mean newest RECIPE (created_at, 100% coverage),
      // not oldest song — sorting by song year buried every recipe the
      // daily pipeline publishes behind 1970s classics, which made the
      // catalog look frozen. Song year is its own option now.
      case "oldest":
        return (a.r.created_at ?? "").localeCompare(b.r.created_at ?? "");
      case "song-year":
        return (b.song?.year ?? 0) - (a.song?.year ?? 0);
      case "song-az":
        return (a.song?.title ?? a.r.title).localeCompare(b.song?.title ?? b.r.title);
      case "artist-az":
        return (a.artist?.name ?? "").localeCompare(b.artist?.name ?? "");
      case "blocks-desc":
        return (
          (b.r.signal_chain?.length ?? 0) - (a.r.signal_chain?.length ?? 0)
        );
      case "newest":
      default:
        return (b.r.created_at ?? "").localeCompare(a.r.created_at ?? "");
    }
  });
  const sorted = decorated.map((d) => d.r);

  // Paginate. Rendering the whole catalog in one document was ~800KB of
  // HTML per request on a route that never caches, and the cost scales
  // with the card count, so this is the fix that actually moves TTFB.
  const { page, totalPages, pageItems, rangeFrom, rangeTo } = paginate(
    sorted,
    requestedPage,
    PAGE_SIZE,
  );

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

  // URL builder — preserves other filters when toggling one.
  //
  // Any facet or sort change RESETS the page: changing the era while on
  // page 6 of the unfiltered catalog would otherwise ask for page 6 of a
  // 2-page result set. Pass `page` explicitly (the pagination nav does)
  // to move within the current result set instead.
  const buildHref = (next: Partial<BrowseSearchParams>) => {
    // Key order here MUST match the canonical builder in generateMetadata
    // (era, genre, platform, artist, then page). It used to emit platform
    // before genre, so every link carrying both facets pointed at a URL
    // whose own canonical was a different string — Google filed all 11
    // two-facet combinations it had found under "Alternate page with
    // proper canonical tag" purely because of the key order.
    const changesResultSet =
      "era" in next || "genre" in next || "platform" in next ||
      "artist" in next || "sort" in next;
    const nextPage = next.page ?? (changesResultSet ? undefined : (page > 1 ? String(page) : undefined));
    const merged: Record<string, string | undefined> = {
      era,
      genre: genreFilter,
      platform: platformFilter,
      artist: artistFilter,
      sort: sort === "newest" ? undefined : sort,
      ...next,
      page: nextPage === "1" ? undefined : nextPage,
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
                {sorted.length === 0
                  ? "No matches"
                  : `Showing ${rangeFrom.toLocaleString()}–${rangeTo.toLocaleString()} of ${sorted.length.toLocaleString()}${
                      sorted.length === totalRecipes ? "" : ` (filtered)`
                    }`}
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
              /* A results list is a list. <ul>/<li> gives the grid real
                 structure for assistive tech and parsers instead of ~700
                 undifferentiated <div>s (the "low semantic HTML" flag). */
              <ul className="audition-grid browse-grid">
                {pageItems.map((r) => {
                  const rSong = getSongBySlug(r.song_slug);
                  const rArtist = rSong
                    ? getArtistBySlug(rSong.artist_slug)
                    : undefined;
                  const rIdx = catalogOrdinalBySlug.get(r.slug) ?? 1;
                  const rBlocks = recipeToBlocks(r, "helix");
                  const rigTokens = buildRigTokens(r.signal_chain);
                  const rBand = rSong ? getBandName(rSong, rArtist) : null;
                  return (
                    <li key={r.slug} className="audition-card-item">
                    <Link
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
                    </li>
                  );
                })}
              </ul>
            )}

            {totalPages > 1 && (
              <nav className="browse-pagination" aria-label="Browse pages">
                {page > 1 ? (
                  <Link
                    href={buildHref({ page: String(page - 1) })}
                    className="browse-page-link browse-page-step"
                    rel="prev"
                  >
                    <span aria-hidden="true">←</span> Prev
                  </Link>
                ) : (
                  <span className="browse-page-link browse-page-step is-disabled">
                    <span aria-hidden="true">←</span> Prev
                  </span>
                )}

                <ul className="browse-page-list">
                  {pageWindow(page, totalPages).map((p, i) =>
                    p === "gap" ? (
                      <li key={`gap-${i}`} className="browse-page-gap" aria-hidden="true">
                        …
                      </li>
                    ) : (
                      <li key={p}>
                        <Link
                          href={buildHref({ page: String(p) })}
                          className={`browse-page-link ${p === page ? "is-active" : ""}`}
                          aria-label={`Page ${p}`}
                          aria-current={p === page ? "page" : undefined}
                        >
                          {p}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>

                {page < totalPages ? (
                  <Link
                    href={buildHref({ page: String(page + 1) })}
                    className="browse-page-link browse-page-step"
                    rel="next"
                  >
                    Next <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <span className="browse-page-link browse-page-step is-disabled">
                    Next <span aria-hidden="true">→</span>
                  </span>
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
