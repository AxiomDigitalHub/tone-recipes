import { create } from "zustand";

/**
 * Tracks the recipes a user has recently viewed, ordered most-recent-first.
 * Persisted to localStorage so it survives across sessions without requiring
 * a database round-trip.
 *
 * Used by the dashboard "Pick up where you left off" hero card and rail.
 */

const STORAGE_KEY = "tone-recipes-recently-viewed";
const MAX_ITEMS = 20;

interface RecentlyViewedState {
  /** Recipe slugs, most recent first */
  slugs: string[];
  /** Hydrate from localStorage (client-only) */
  hydrate: () => void;
  /** Record a recipe view. Moves to front if already present. */
  record: (slug: string) => void;
  /** Clear all recently viewed items */
  clear: () => void;
  /** Get the most recently viewed slug, or null if none */
  getLatest: () => string | null;
}

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function saveToStorage(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX_ITEMS)));
  } catch {
    /* ignore quota or private-mode errors */
  }
}

export const useRecentlyViewedStore = create<RecentlyViewedState>((set, get) => ({
  slugs: [],
  hydrate: () => {
    set({ slugs: loadFromStorage() });
  },
  record: (slug: string) => {
    if (!slug) return;
    const current = get().slugs;
    // Move to front, dedupe
    const next = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
    set({ slugs: next });
    saveToStorage(next);
  },
  clear: () => {
    set({ slugs: [] });
    saveToStorage([]);
  },
  getLatest: () => {
    const slugs = get().slugs;
    return slugs.length > 0 ? slugs[0] : null;
  },
}));
