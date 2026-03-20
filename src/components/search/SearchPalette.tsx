"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toneRecipes, artists, songs, gearItems } from "@/lib/data";

interface SearchResult {
  type: "recipe" | "artist" | "song" | "gear";
  label: string;
  description: string;
  href: string;
}

function searchAll(query: string): SearchResult[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  const results: SearchResult[] = [];

  // Recipes
  const matchedRecipes = toneRecipes
    .filter((r) => {
      const haystack = [r.title, r.description, ...r.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(lower);
    })
    .slice(0, 5);
  for (const r of matchedRecipes) {
    results.push({
      type: "recipe",
      label: r.title,
      description: r.tags.slice(0, 3).join(", "),
      href: `/recipe/${r.slug}`,
    });
  }

  // Artists
  const matchedArtists = artists
    .filter((a) => a.name.toLowerCase().includes(lower))
    .slice(0, 5);
  for (const a of matchedArtists) {
    results.push({
      type: "artist",
      label: a.name,
      description: a.genres.slice(0, 3).join(", "),
      href: `/artist/${a.slug}`,
    });
  }

  // Songs
  const matchedSongs = songs
    .filter((s) => s.title.toLowerCase().includes(lower))
    .slice(0, 5);
  for (const s of matchedSongs) {
    const artist = artists.find((a) => a.slug === s.artist_slug);
    results.push({
      type: "song",
      label: s.title,
      description: artist ? artist.name : s.artist_slug,
      href: `/artist/${s.artist_slug}`,
    });
  }

  // Gear
  const matchedGear = gearItems
    .filter((g) => {
      const haystack = [g.name, g.manufacturer].join(" ").toLowerCase();
      return haystack.includes(lower);
    })
    .slice(0, 5);
  for (const g of matchedGear) {
    results.push({
      type: "gear",
      label: g.name,
      description: g.manufacturer,
      href: `/gear/${g.slug}`,
    });
  }

  return results;
}

const sectionLabels: Record<SearchResult["type"], string> = {
  recipe: "Recipes",
  artist: "Artists",
  song: "Songs",
  gear: "Gear",
};

const sectionIcons: Record<SearchResult["type"], React.ReactNode> = {
  recipe: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  artist: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  song: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
    </svg>
  ),
  gear: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchAll(query), [query]);

  // Group results by type, preserving order
  const grouped = useMemo(() => {
    const map = new Map<SearchResult["type"], SearchResult[]>();
    for (const r of results) {
      if (!map.has(r.type)) map.set(r.type, []);
      map.get(r.type)!.push(r);
    }
    return map;
  }, [results]);

  const flatResults = results;

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Global keyboard listener for Cmd+K / Ctrl+K and custom event
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) {
          setQuery("");
          setActiveIndex(0);
        }
      }
    }

    function handleOpenSearch() {
      setOpen(true);
      setQuery("");
      setActiveIndex(0);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, [open]);

  // Autofocus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  // Scroll active result into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const activeEl = resultsRef.current.querySelector("[data-active='true']");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Keyboard navigation within modal
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(flatResults.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + flatResults.length) % Math.max(flatResults.length, 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatResults[activeIndex]) {
        router.push(flatResults[activeIndex].href);
        closeModal();
      }
    }
  }

  if (!open) return null;

  // Build a flat index counter so we can map grouped rendering to flatResults index
  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[100]" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-start justify-center pt-[15vh]">
        <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl">
          {/* Search input */}
          <div className="flex items-center border-b border-border px-4">
            <svg
              className="h-5 w-5 shrink-0 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes, artists, gear..."
              className="w-full bg-transparent p-4 text-lg text-foreground placeholder:text-muted outline-none"
            />
            <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-xs text-muted">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-80 overflow-y-auto p-2">
            {query.trim() === "" && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                Type to search recipes, artists, gear...
              </div>
            )}

            {query.trim() !== "" && flatResults.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                No results for &lsquo;{query}&rsquo;
              </div>
            )}

            {Array.from(grouped.entries()).map(([type, items]) => {
              const startIndex = flatIndex;
              const section = (
                <div key={type}>
                  <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {sectionLabels[type]}
                  </div>
                  {items.map((item, i) => {
                    const currentIndex = startIndex + i;
                    const isActive = currentIndex === activeIndex;
                    return (
                      <Link
                        key={`${type}-${i}`}
                        href={item.href}
                        onClick={closeModal}
                        data-active={isActive}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          isActive
                            ? "border-l-2 border-accent bg-surface-hover"
                            : "border-l-2 border-transparent hover:bg-surface-hover"
                        }`}
                      >
                        <span className="shrink-0 text-muted">
                          {sectionIcons[item.type]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">
                            {item.label}
                          </div>
                          <div className="truncate text-xs text-muted">
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">
                            Enter
                          </kbd>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
              flatIndex += items.length;
              return section;
            })}
          </div>

          {/* Footer hint */}
          {flatResults.length > 0 && (
            <div className="border-t border-border px-4 py-2 text-center text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span>
                  <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">
                    &uarr;
                  </kbd>
                  <kbd className="ml-0.5 rounded border border-border px-1 py-0.5 text-[10px]">
                    &darr;
                  </kbd>{" "}
                  to navigate
                </span>
                <span>
                  <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">
                    Enter
                  </kbd>{" "}
                  to select
                </span>
                <span>
                  <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">
                    Esc
                  </kbd>{" "}
                  to close
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
