import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { getAllPlatforms } from "@/lib/data/platforms";
import { PLATFORMS, platformLabel } from "@/lib/constants";
import type { Platform } from "@/types/recipe";
import { buildRigTokens } from "@/lib/gear-match";
import { getBandName } from "@/lib/song-band";
import { parsePageParam, pageWindow, paginate } from "@/lib/pagination";
import BrowseRigFilter from "@/components/browse/BrowseRigFilter";
import ToneCard from "@/components/recipe/redesign/ToneCard";
import BrowseSort from "@/components/browse/BrowseSort";
import { Search } from "lucide-react";

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

/** Shared by generateMetadata and the page — keep the two in step. */
type BrowseSearchParams = {
  era?: string;
  platform?: string;
  genre?: string;
  artist?: string;
  sort?: string;
  page?: string;
  /** Free-text search: song, artist, band, album. */
  q?: string;
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

  // A search result page is a view, not a landing page: it canonicals to
  // the facet URL (q is left out above) and stays out of the index.
  const robots = sp.q ? { index: false, follow: true } : undefined;

  if (parts.length === 0) {
    const title = `Browse Tones${pageSuffixTitle}`;
    return {
      title,
      robots,
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
    robots,
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
  { key: "song-az", label: "Song A to Z" },
  { key: "artist-az", label: "Artist A to Z" },
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
  const q = (sp.q ?? "").trim().slice(0, 80);

  // Filter cascade
  let filtered = toneRecipes;
  if (q) {
    // Every word must appear somewhere in the song, artist, band, album or
    // recipe title. Same field set the site-wide SearchAction promises.
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    filtered = filtered.filter((r) => {
      const s = getSongBySlug(r.song_slug);
      const a = s ? getArtistBySlug(s.artist_slug) : undefined;
      const text = [s?.title, a?.name, s ? getBandName(s, a) : null, s?.album, r.title]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }
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
      "artist" in next || "sort" in next || "q" in next;
    const nextPage = next.page ?? (changesResultSet ? undefined : (page > 1 ? String(page) : undefined));
    const merged: Record<string, string | undefined> = {
      era,
      genre: genreFilter,
      platform: platformFilter,
      artist: artistFilter,
      sort: sort === "newest" ? undefined : sort,
      q: q || undefined,
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

  const hasFilters = Boolean(era || platformFilter || genreFilter || artistFilter || q);
  const genreLabel = (g: string) => {
    const t = g.replace(/-/g, " ");
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  const rail = (title: string, rows: { href: string; label: string; count: number; on: boolean }[]) => (
    <nav className="fk-rail-group" aria-label={title}>
      <h2 className="fk-rail-title">{title}</h2>
      <ul>
        {rows.map((row) => (
          <li key={row.label}>
            <Link
              href={row.href}
              className={`fk-rail-link r-md${row.on ? " is-on" : ""}`}
              aria-current={row.on ? "true" : undefined}
            >
              <span>{row.label}</span>
              <span className="fk-data">{row.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="fk-browse">
      <section className="fk-wrap fk-browse-head">
        <div className="fk-browse-headcopy">
          <h1 className="fk-display">Browse tones</h1>
          <p className="fk-lead">Tone recipes with full signal chains. Filter by era, platform or genre.</p>
        </div>
        <form role="search" action="/browse" method="get" className="fk-search fk-browse-search">
          <Search size={20} strokeWidth={1.75} aria-hidden />
          <label htmlFor="browse-q" className="fk-sr">
            Search tones
          </label>
          <input
            id="browse-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Try a song, artist or guitarist"
          />
          {/* Carry the active facets through a search. */}
          {era && <input type="hidden" name="era" value={era} />}
          {genreFilter && <input type="hidden" name="genre" value={genreFilter} />}
          {platformFilter && <input type="hidden" name="platform" value={platformFilter} />}
          {artistFilter && <input type="hidden" name="artist" value={artistFilter} />}
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="fk-wrap fk-browse-layout">
        <aside className="fk-rail" aria-label="Filters">
          <BrowseRigFilter />

          {rail("Era", [
            { href: buildHref({ era: undefined }), label: "All eras", count: totalRecipes, on: !era },
            ...DECADES.filter((d) => (decadeCounts.get(d) ?? 0) > 0).map((d) => ({
              href: buildHref({ era: String(d) }),
              label: `${d}s`,
              count: decadeCounts.get(d) ?? 0,
              on: era === String(d),
            })),
          ])}

          {rail("Platform", [
            { href: buildHref({ platform: undefined }), label: "All platforms", count: totalRecipes, on: !platformFilter },
            ...allPlatforms.map((p) => ({
              href: buildHref({ platform: p.id }),
              label: p.label,
              count: platformCounts.get(p.id) ?? 0,
              on: platformFilter === p.id,
            })),
          ])}

          {rail("Genre", [
            { href: buildHref({ genre: undefined }), label: "All genres", count: totalRecipes, on: !genreFilter },
            ...topGenres.map((g) => ({
              href: buildHref({ genre: g }),
              label: genreLabel(g),
              count: genreCounts.get(g) ?? 0,
              on: genreFilter === g,
            })),
          ])}
        </aside>

        <div className="fk-browse-results">
          <div className="fk-browse-bar">
            <p className="fk-body-sm">
              {sorted.length === 0
                ? "No matches"
                : `Showing ${rangeFrom.toLocaleString()} to ${rangeTo.toLocaleString()} of ${sorted.length.toLocaleString()}`}
              {q && <> for &ldquo;{q}&rdquo;</>}
              {hasFilters && (
                <>
                  {" "}
                  <Link href="/browse" className="fk-link">
                    Clear filters
                  </Link>
                </>
              )}
            </p>
            {/* A select, not six links: sort variants only reorder the same
                set, and as links they multiplied the crawlable space. */}
            <BrowseSort
              value={sort}
              options={SORT_OPTIONS.map((s) => ({
                key: s.key,
                label: s.label,
                href: buildHref({ sort: s.key === "newest" ? undefined : s.key }),
              }))}
            />
          </div>

          {sorted.length === 0 ? (
            <div className="fk-tile fk-browse-empty">
              <p className="fk-body">No recipes match {q ? "that search" : "these filters"}.</p>
              <Link href="/browse" className="fk-link fk-label">
                Clear filters and start over
              </Link>
            </div>
          ) : (
            /* A results list is a list: real structure for assistive tech
               and parsers. */
            <ul className="fk-card-grid fk-browse-grid">
              {pageItems.map((r, i) => (
                <li key={r.slug}>
                  {/* browse_card_click makes click-through from the catalog
                      to a recipe measurable. */}
                  <ToneCard
                    recipe={r}
                    eager={i < 4}
                    rigTokens={buildRigTokens(r.signal_chain)}
                    track={{ event: "browse_card_click", params: { recipe_slug: r.slug, page } }}
                  />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav className="fk-pages" aria-label="Pages">
              {page > 1 ? (
                <Link href={buildHref({ page: String(page - 1) })} className="fk-pages-step" rel="prev">
                  Previous
                </Link>
              ) : (
                <span className="fk-pages-step is-disabled">Previous</span>
              )}
              <ul>
                {pageWindow(page, totalPages).map((p, i) =>
                  p === "gap" ? (
                    <li key={`gap-${i}`} className="fk-pages-gap" aria-hidden="true">
                      …
                    </li>
                  ) : (
                    <li key={p}>
                      <Link
                        href={buildHref({ page: String(p) })}
                        className={`fk-pages-num${p === page ? " is-on" : ""}`}
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
                <Link href={buildHref({ page: String(page + 1) })} className="fk-pages-step" rel="next">
                  Next
                </Link>
              ) : (
                <span className="fk-pages-step is-disabled">Next</span>
              )}
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
