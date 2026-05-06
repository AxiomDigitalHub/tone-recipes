"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getUserGear } from "@/lib/db/profile";
import { matchesUserGear } from "@/lib/gear-match";

/**
 * Recipe-page compatibility check.
 *
 * Reads the viewer's My Rig (Supabase user_gear when signed-in, localStorage
 * fallback for anon — same store key as /dashboard/my-gear) and reports
 * "X/N blocks match your rig" against the recipe's signal_chain. Match
 * helpers live in @/lib/gear-match (shared with BrowseRigFilter).
 */

interface SignalChainBlock {
  gear_name: string;
  gear_slug: string | null;
  category: string;
}

interface Props {
  signalChain: SignalChainBlock[];
}

const STORAGE_KEY = "tone-recipes-user-gear";

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

export default function RecipeCompatibility({ signalChain }: Props) {
  const { user } = useAuth();
  const [userGear, setUserGear] = useState<string[] | null>(null);
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

  if (userGear === null) return null; // loading — render nothing

  if (userGear.length === 0) {
    return (
      <div className="recipe-compat recipe-compat-empty">
        <span className="recipe-compat-empty-label">Want this for your rig?</span>
        <Link href="/dashboard/my-gear" className="recipe-compat-empty-cta">
          Set up My Rig →
        </Link>
      </div>
    );
  }

  const matches = signalChain.map((b) => ({
    block: b,
    matched: matchesUserGear(b.gear_name, userGear),
  }));
  const matchCount = matches.filter((m) => m.matched).length;
  const total = signalChain.length;
  const missing = matches.filter((m) => !m.matched);

  return (
    <div className="recipe-compat">
      <div className="recipe-compat-summary">
        <span className="recipe-compat-num">
          <strong>{matchCount}</strong>
          <span className="recipe-compat-num-sep">/</span>
          <span>{total}</span>
        </span>
        <span className="recipe-compat-label">
          {matchCount === total
            ? "blocks match your rig — you're set"
            : `blocks match your rig`}
        </span>
      </div>
      {missing.length > 0 && (
        <details className="recipe-compat-details">
          <summary>
            Missing {missing.length}{" "}
            {missing.length === 1 ? "piece" : "pieces"}
          </summary>
          <ul className="recipe-compat-missing">
            {missing.map((m, i) => (
              <li key={`${m.block.gear_name}-${i}`}>
                <span className="recipe-compat-missing-name">
                  {m.block.gear_name}
                </span>
                <em className="recipe-compat-missing-cat">
                  {" — "}
                  {m.block.category.replace(/_/g, " ")}
                </em>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/my-gear"
            className="recipe-compat-add-link"
          >
            Update My Rig →
          </Link>
        </details>
      )}
    </div>
  );
}
