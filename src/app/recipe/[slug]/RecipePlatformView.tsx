"use client";

import { useCallback, useEffect, useState } from "react";
import type { Platform } from "@/types/recipe";
import type { PreviewBlockData } from "@/components/v3/preview-helpers";
import { PreviewRecipeClient } from "@/components/v3/PreviewRecipeClient";
import PresetDownloadButton from "@/components/recipe/PresetDownloadButton";
import RecipePdfButton from "@/components/v3/RecipePdfButton";
import RecipeDownloadChip from "@/components/v3/RecipeDownloadChip";

export type PlatformOption = { id: Platform; short: string; name: string };

/**
 * <RecipePlatformView> — owns platform selection for a recipe page.
 *
 * WHY THIS IS A CLIENT COMPONENT (do not move this back to the server):
 * reading `searchParams` in the server component opted the whole
 * `/recipe/[slug]` route into dynamic rendering. That silently killed the
 * `revalidate = 3600` ISR config — every request re-rendered the page AND
 * re-hit Supabase for rating stats, giving 3–5s TTFB and `cache-control:
 * private, no-store` on the site's most valuable pages (28 of them flagged
 * "slow page load" in the Aug 2026 audit, up from 1 in June).
 *
 * The server now renders the DEFAULT platform's chain into static HTML —
 * which is what crawlers read — and this component swaps in another
 * platform's blocks on the client. All valid platforms' blocks ship in the
 * payload (~12KB extra, mostly repeated keys, so a few KB over the wire).
 *
 * The URL param is read from `window.location` inside an effect rather than
 * via `useSearchParams()` on purpose: `useSearchParams()` in a statically
 * rendered route forces client-side rendering up to the nearest Suspense
 * boundary, which would pull the signal chain — the page's entire indexable
 * body — out of the server HTML. That trade is not worth making.
 */
export default function RecipePlatformView({
  slug,
  platforms,
  blocksByPlatform,
  defaultPlatform,
  children,
}: {
  slug: string;
  platforms: PlatformOption[];
  blocksByPlatform: Partial<Record<Platform, PreviewBlockData[]>>;
  defaultPlatform: Platform;
  children?: React.ReactNode;
}) {
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);

  // Deep links (`/recipe/x?platform=helix`, still used by the homepage hero
  // and the /platforms/[slug] pages) and browser back/forward.
  useEffect(() => {
    const sync = () => {
      const param = new URLSearchParams(window.location.search).get("platform");
      const match = platforms.find((p) => p.id === param)?.id;
      setPlatform(match ?? defaultPlatform);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [platforms, defaultPlatform]);

  const select = useCallback(
    (next: Platform) => {
      setPlatform(next);
      // Keep the URL shareable without a server round-trip. Next.js
      // supports history.replaceState for search-param-only updates.
      const url = new URL(window.location.href);
      if (next === defaultPlatform) url.searchParams.delete("platform");
      else url.searchParams.set("platform", next);
      window.history.replaceState(null, "", url.toString());
    },
    [defaultPlatform],
  );

  const active = platforms.find((p) => p.id === platform);
  const blocks = blocksByPlatform[platform] ?? [];

  return (
    <>
      {/* Platform switcher. These are buttons, not links, deliberately:
          as <a href="?platform=…"> they generated 7 crawlable duplicates of
          every recipe (all canonicalised back here, so all crawl budget and
          no index value). Deep links still work — see the effect above. */}
      <div id="recipe-platform-switcher" className="platform-switcher">
        <span className="label">Settings for</span>
        <div className="tabs" role="tablist" aria-label="Platform">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={platform === p.id}
              onClick={() => select(p.id)}
              className={`tab ${platform === p.id ? "on" : ""}`}
            >
              {p.short}
            </button>
          ))}
        </div>
        <div className="platform-switcher-exports">
          {(platform === "helix" ||
            platform === "quad_cortex" ||
            platform === "katana") && (
            <PresetDownloadButton
              recipeSlug={slug}
              platform={platform}
              source="platform_switcher"
              className="export"
            />
          )}
          <RecipePdfButton slug={slug} />
        </div>
      </div>
      <RecipeDownloadChip slug={slug} platform={platform} />

      {children}

      {/* Interactive schematic + sticky detail panel. Click a tile,
          the detail swaps in place (no scroll). */}
      <PreviewRecipeClient
        blocks={blocks}
        platformLabel={active?.name ?? platform}
      />
    </>
  );
}
