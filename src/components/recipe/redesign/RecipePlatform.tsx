"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Platform } from "@/types/recipe";

export type PlatformOption = { id: Platform; short: string; name: string };

/**
 * Platform selection for a recipe page, shared by the buttons at the top
 * and the chain below.
 *
 * WHY THIS LIVES ON THE CLIENT (do not read `searchParams` on the server):
 * doing so opts /recipe/[slug] into per-request rendering, which discards
 * its ISR config and puts a Supabase call on the hot path. The server
 * renders the default platform, which is what crawlers read, and this
 * swaps platforms in the browser. `?platform=` deep links are read from
 * window.location in an effect, not via useSearchParams(), which would pull
 * the chain out of the server HTML.
 */
interface Ctx {
  platform: Platform;
  platforms: PlatformOption[];
  defaultPlatform: Platform;
  active: PlatformOption | undefined;
  select: (p: Platform) => void;
}
const PlatformContext = createContext<Ctx | null>(null);

export function useRecipePlatform(): Ctx {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("useRecipePlatform must be used inside <RecipePlatformProvider>");
  return ctx;
}

export function RecipePlatformProvider({
  platforms,
  defaultPlatform,
  children,
}: {
  platforms: PlatformOption[];
  defaultPlatform: Platform;
  children: React.ReactNode;
}) {
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);

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
      // Keep the URL shareable without a server round-trip.
      const url = new URL(window.location.href);
      if (next === defaultPlatform) url.searchParams.delete("platform");
      else url.searchParams.set("platform", next);
      window.history.replaceState(null, "", url.toString());
    },
    [defaultPlatform],
  );

  const value = useMemo(
    () => ({ platform, platforms, defaultPlatform, select, active: platforms.find((p) => p.id === platform) }),
    [platform, platforms, defaultPlatform, select],
  );
  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}
