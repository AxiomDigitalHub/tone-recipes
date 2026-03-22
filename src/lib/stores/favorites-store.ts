import { create } from "zustand";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface FavoritesState {
  /** Set of favorited recipe slugs */
  favorites: Set<string>;
  /** Toggle a recipe slug in/out of favorites */
  toggleFavorite: (slug: string) => void;
  /** Check if a slug is favorited */
  isFavorite: (slug: string) => boolean;
  /** Get all favorite slugs as an array */
  getFavorites: () => string[];
  /** Hydrate from localStorage (call once on mount) */
  hydrate: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Persistence helpers                                                       */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "tone-recipes-favorites";

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    /* empty */
  }
  return new Set();
}

function saveToStorage(favorites: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  } catch {
    /* empty */
  }
}

/* -------------------------------------------------------------------------- */
/*  Store                                                                     */
/* -------------------------------------------------------------------------- */

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: new Set<string>(),

  toggleFavorite: (slug: string) => {
    const current = new Set(get().favorites);
    if (current.has(slug)) {
      current.delete(slug);
    } else {
      current.add(slug);
    }
    saveToStorage(current);
    set({ favorites: current });
  },

  isFavorite: (slug: string) => get().favorites.has(slug),

  getFavorites: () => [...get().favorites],

  hydrate: () => {
    set({ favorites: loadFromStorage() });
  },
}));
