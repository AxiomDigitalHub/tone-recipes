"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SearchPalette = dynamic(
  () => import("@/components/search/SearchPalette"),
  { ssr: false },
);

/**
 * Gatekeeper for the search palette.
 *
 * SearchPalette imports the whole recipe corpus (`@/lib/data`) to search
 * it client-side. Rendering the dynamic component unconditionally still
 * *fetches* that chunk on every page for every visitor — 2.8 MB raw /
 * 532 KB gzip, downloaded and parsed right when the page becomes
 * interactive, for a UI most people never open.
 *
 * So this component ships only the trigger: a keydown listener for
 * Cmd/Ctrl+K and the `open-search` custom event (dispatched by the
 * search button in SiteSubnav). The corpus chunk is requested the first
 * time one of those fires, and `defaultOpen` makes the palette appear
 * as soon as it loads.
 */
export default function LazySearchPalette() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (armed) return;

    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setArmed(true);
      }
    }
    function onOpenSearch() {
      setArmed(true);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-search", onOpenSearch);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-search", onOpenSearch);
    };
  }, [armed]);

  if (!armed) return null;
  return <SearchPalette defaultOpen />;
}
