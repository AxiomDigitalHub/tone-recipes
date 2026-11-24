"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getUserGear } from "@/lib/db/profile";
import { countCardMatches } from "@/lib/gear-match";

/**
 * Sidebar toggle that hides browse cards client-side when their
 * `data-rig-tokens` doesn't match the viewer's My Rig. The browse page
 * server-renders the cards with `data-rig-tokens` (joined token string
 * from the recipe's signal_chain); this component walks the DOM on
 * toggle and flips a `data-rig-hidden` attribute that CSS uses to hide
 * non-matching cards.
 *
 * Filter is purely visual — sort and the server-side facets still
 * operate on the full catalog; we just hide cards that don't match.
 * Anon users with no localStorage gear see a disabled toggle linking to
 * /dashboard/my-gear.
 *
 * SCOPE: this walks the DOM, so since /browse paginated it can only see
 * the cards on the CURRENT page — matches on other pages stay hidden
 * from the count. The copy below says so rather than implying the
 * number is catalog-wide. Making it catalog-wide would mean a
 * server-side facet, which anon users can't have: their gear lives in
 * localStorage and never reaches the server.
 */

const STORAGE_KEY = "tone-recipes-user-gear";
const MIN_MATCHES_DEFAULT = 1;

interface LocalGear {
  id: string;
  name: string;
  type: string;
  notes: string;
}

function loadFromStorage(): LocalGear[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function BrowseRigFilter() {
  const { user } = useAuth();
  const [userGear, setUserGear] = useState<string[] | null>(null);
  const [active, setActive] = useState(false);
  const [matchedCount, setMatchedCount] = useState<number | null>(null);
  const useSupabase = isSupabaseConfigured() && !!user?.id;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (useSupabase) {
        const items = await getUserGear(user!.id);
        if (!cancelled) setUserGear(items.map((i) => i.gear_name));
      } else {
        const items = loadFromStorage();
        if (!cancelled) setUserGear(items.map((i) => i.name));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [useSupabase, user]);

  const applyFilter = useCallback(
    (on: boolean, gearNames: string[]) => {
      const cards = document.querySelectorAll<HTMLElement>(
        "[data-rig-tokens]",
      );
      let visible = 0;
      cards.forEach((card) => {
        // Hide the list item, not the link inside it, so the grid closes up.
        const cell = card.closest<HTMLElement>("li") ?? card;
        if (!on) {
          cell.style.display = "";
          visible++;
          return;
        }
        const tokens = card.getAttribute("data-rig-tokens") ?? "";
        const matches = countCardMatches(tokens, gearNames);
        if (matches >= MIN_MATCHES_DEFAULT) {
          cell.style.display = "";
          visible++;
        } else {
          cell.style.display = "none";
        }
      });
      setMatchedCount(on ? visible : null);
    },
    [],
  );

  const onToggle = useCallback(() => {
    if (!userGear || userGear.length === 0) return;
    const next = !active;
    setActive(next);
    applyFilter(next, userGear);
  }, [active, userGear, applyFilter]);

  // Re-apply filter when route navigation re-renders the grid (e.g. user
  // toggles era/platform). The DOM has fresh cards, our state still says
  // "active" — re-walk so the new cards inherit the same visibility.
  useEffect(() => {
    if (active && userGear && userGear.length > 0) {
      applyFilter(true, userGear);
    }
  });

  if (userGear === null) {
    // Loading: hold the tile's space so the rail doesn't jump.
    return <div className="fk-tile fk-rigtile is-loading" aria-hidden="true" />;
  }

  if (userGear.length === 0) {
    return (
      <Link href="/dashboard/my-gear" className="fk-tile fk-rigtile">
        <span className="fk-rigtile-head">
          Your rig
          <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
        </span>
        <span className="fk-caption">
          Tell us what you own and each recipe shows what matches.
        </span>
      </Link>
    );
  }

  return (
    <div className="fk-tile fk-rigtile">
      <span className="fk-rigtile-head">Your rig</span>
      <button type="button" onClick={onToggle} className="fk-chip" aria-pressed={active}>
        {active ? "Showing rig matches" : "Match my rig"}
        {active && matchedCount !== null && <span className="fk-data fk-rigtile-count">{matchedCount}</span>}
      </button>
      {active && (
        <span className="fk-caption">
          {matchedCount === 0
            ? "No recipes on this page share gear with your rig. Try the next page, or press again to show all."
            : "Hiding recipes that don\u2019t share gear with your rig. Counts this page only. Press again to show all."}
        </span>
      )}
    </div>
  );
}
