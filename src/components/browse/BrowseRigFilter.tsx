"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
 * Filter is purely visual — pagination/sort still operate on the full
 * server-rendered list; we just dim/hide cards that don't match. Anon
 * users with no localStorage gear see a disabled toggle linking to
 * /dashboard/my-gear.
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
        ".audition-card[data-rig-tokens]",
      );
      let visible = 0;
      cards.forEach((card) => {
        if (!on) {
          card.style.display = "";
          visible++;
          return;
        }
        const tokens = card.getAttribute("data-rig-tokens") ?? "";
        const matches = countCardMatches(tokens, gearNames);
        if (matches >= MIN_MATCHES_DEFAULT) {
          card.style.display = "";
          visible++;
        } else {
          card.style.display = "none";
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
    // Loading — render a placeholder shell so layout doesn't jump.
    return (
      <div className="browse-filter-group">
        <h3 className="browse-filter-label">Your rig</h3>
        <div className="browse-rigfilter-placeholder" aria-hidden="true">
          {" "}
        </div>
      </div>
    );
  }

  if (userGear.length === 0) {
    return (
      <div className="browse-filter-group">
        <h3 className="browse-filter-label">Your rig</h3>
        <div className="browse-rigfilter-empty">
          <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 8 }}>
            Add gear to filter recipes by what you own.
          </p>
          <Link
            href="/dashboard/my-gear"
            className="browse-filter-link"
            style={{ display: "inline-block" }}
          >
            Set up My Rig →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-filter-group">
      <h3 className="browse-filter-label">Your rig</h3>
      <button
        type="button"
        onClick={onToggle}
        className={`browse-filter-link browse-rigfilter-toggle ${active ? "is-active" : ""}`}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        aria-pressed={active}
      >
        <span>{active ? "Showing rig matches" : "Match my rig"}</span>
        {active && matchedCount !== null && (
          <span className="browse-filter-count">{matchedCount}</span>
        )}
      </button>
      {active && (
        <p
          style={{
            fontSize: 11,
            color: "var(--ink-faint)",
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Hiding recipes that don&apos;t share gear with your rig. Click again
          to show all.
        </p>
      )}
    </div>
  );
}
