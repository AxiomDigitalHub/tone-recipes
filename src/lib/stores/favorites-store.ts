import { create } from "zustand";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/db/client";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface FavoritesState {
  /** Set of favorited recipe slugs */
  favorites: Set<string>;
  /** Authenticated user ID (null when logged out) */
  userId: string | null;
  /** Set the authenticated user ID (or null to log out) */
  setUserId: (userId: string | null) => void;
  /** Toggle a recipe slug in/out of favorites */
  toggleFavorite: (slug: string) => void;
  /** Check if a slug is favorited */
  isFavorite: (slug: string) => boolean;
  /** Get all favorite slugs as an array */
  getFavorites: () => string[];
  /** Hydrate from localStorage and optionally sync with Supabase */
  hydrate: (userId?: string) => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/*  Untyped Supabase client for saved_recipes table                           */
/* -------------------------------------------------------------------------- */

let _untypedClient: ReturnType<typeof createSupabaseClient> | null = null;

function getUntypedClient() {
  if (_untypedClient) return _untypedClient;
  _untypedClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _untypedClient;
}

/* -------------------------------------------------------------------------- */
/*  Persistence helpers (localStorage)                                        */
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

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* empty */
  }
}

/* -------------------------------------------------------------------------- */
/*  Supabase helpers                                                          */
/* -------------------------------------------------------------------------- */

async function fetchSupabaseFavorites(userId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured()) return new Set();
  const supabase = getUntypedClient();
  const { data, error } = await supabase
    .from("saved_recipes")
    .select("recipe_slug")
    .eq("user_id", userId);

  if (error || !data) return new Set();
  return new Set(
    (data as Array<{ recipe_slug: string }>).map((r) => r.recipe_slug),
  );
}

async function insertSupabaseFavorite(
  userId: string,
  slug: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getUntypedClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("saved_recipes") as any).insert({
    user_id: userId,
    recipe_slug: slug,
  });
}

async function deleteSupabaseFavorite(
  userId: string,
  slug: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getUntypedClient();
  await supabase
    .from("saved_recipes")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_slug", slug);
}

/* -------------------------------------------------------------------------- */
/*  Store                                                                     */
/* -------------------------------------------------------------------------- */

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: new Set<string>(),
  userId: null,

  setUserId: (userId: string | null) => {
    set({ userId });
    if (userId) {
      // Re-hydrate with the new user to sync with Supabase
      get().hydrate(userId);
    } else {
      // Logged out — fall back to localStorage
      set({ favorites: loadFromStorage() });
    }
  },

  toggleFavorite: (slug: string) => {
    const { userId } = get();
    const current = new Set(get().favorites);

    if (current.has(slug)) {
      current.delete(slug);
      // Sync removal to Supabase (fire-and-forget)
      if (userId && isSupabaseConfigured()) {
        deleteSupabaseFavorite(userId, slug);
      }
    } else {
      current.add(slug);
      // Sync addition to Supabase (fire-and-forget)
      if (userId && isSupabaseConfigured()) {
        insertSupabaseFavorite(userId, slug);
      }
    }

    // Always save to localStorage as fallback
    saveToStorage(current);
    set({ favorites: current });
  },

  isFavorite: (slug: string) => get().favorites.has(slug),

  getFavorites: () => [...get().favorites],

  hydrate: async (userId?: string) => {
    if (userId) {
      set({ userId });
    }

    const effectiveUserId = userId ?? get().userId;
    const localFavorites = loadFromStorage();

    // If no user or Supabase not configured, use localStorage only
    if (!effectiveUserId || !isSupabaseConfigured()) {
      set({ favorites: localFavorites });
      return;
    }

    // Fetch from Supabase
    const remoteFavorites = await fetchSupabaseFavorites(effectiveUserId);

    // Merge: union of local and remote
    const merged = new Set([...remoteFavorites, ...localFavorites]);

    // Push any localStorage-only favorites to Supabase
    const localOnly = [...localFavorites].filter((s) => !remoteFavorites.has(s));
    await Promise.all(
      localOnly.map((slug) => insertSupabaseFavorite(effectiveUserId, slug)),
    );

    // Clear localStorage — Supabase is now source of truth
    clearStorage();

    set({ favorites: merged });
  },
}));
