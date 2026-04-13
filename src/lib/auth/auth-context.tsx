"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, createBrowserClient } from "@/lib/db/client";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type UserRole = "free" | "premium" | "creator" | "admin" | "super_admin";

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** true when running without Supabase (localStorage-only demo user) */
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  /** Force a re-fetch of the current user's profile row (role, display name, avatar) */
  refreshProfile: () => Promise<void>;
  /** Demo mode helper: create a fake local user so favorites work */
  signInDemo: (email: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const DEMO_USER_KEY = "tone-recipes-demo-user";

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

// Build a user object from raw Supabase user — synchronous, no DB call.
function buildBaseUser(supabaseUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    displayName: supabaseUser.user_metadata?.display_name as string | undefined,
    avatarUrl: supabaseUser.user_metadata?.avatar_url as string | undefined,
    role: "free",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const demoMode = !isSupabaseConfigured();

  /* ---- Profile enrichment (callable externally via refreshProfile) ------- */

  // Enrich the user with profile data from the DB. Merges with existing user
  // state — does not block or replace the initial session hydration.
  const enrichProfile = useCallback(async (supabaseUserId: string) => {
    if (demoMode) return;
    const supabase = createBrowserClient();
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role, display_name, avatar_url")
        .eq("id", supabaseUserId)
        .single();
      if (data) {
        const row = data as Record<string, unknown>;
        setUser((prev) => {
          if (!prev || prev.id !== supabaseUserId) return prev;
          return {
            ...prev,
            role: (row.role as UserRole) || prev.role,
            displayName: (row.display_name as string) || prev.displayName,
            avatarUrl: (row.avatar_url as string) || prev.avatarUrl,
          };
        });
      }
    } catch {
      // Profile fetch failed — keep existing user state
    }
  }, [demoMode]);

  // Public refresh helper: re-fetches the current user's profile row
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await enrichProfile(user.id);
  }, [user?.id, enrichProfile]);

  /* ---- Bootstrap --------------------------------------------------------- */

  useEffect(() => {
    if (demoMode) {
      // Restore demo user from localStorage
      try {
        const stored = localStorage.getItem(DEMO_USER_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {
        /* empty */
      }
      setLoading(false);
      return;
    }

    // Real Supabase session
    const supabase = createBrowserClient();

    // Timeout: if getSession takes too long, show login buttons anyway
    const timeout = setTimeout(() => setLoading(false), 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(buildBaseUser(session.user));
        // Enrich profile async — do not block initial hydration
        void enrichProfile(session.user.id);
      }
      setLoading(false);
      clearTimeout(timeout);
    }).catch(() => {
      setLoading(false);
      clearTimeout(timeout);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(buildBaseUser(session.user));
        void enrichProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [demoMode, enrichProfile]);

  /* ---- Auth actions ------------------------------------------------------ */

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (demoMode) {
        const demoUser: AuthUser = {
          id: "demo-" + email,
          email,
          displayName: email.split("@")[0],
          role: "free",
        };
        setUser(demoUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        return {};
      }

      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return {};
    },
    [demoMode],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (demoMode) {
        const demoUser: AuthUser = {
          id: "demo-" + email,
          email,
          displayName: email.split("@")[0],
          role: "free",
        };
        setUser(demoUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        return {};
      }

      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      return {};
    },
    [demoMode],
  );

  const signOut = useCallback(async () => {
    if (demoMode) {
      setUser(null);
      localStorage.removeItem(DEMO_USER_KEY);
      return;
    }

    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
  }, [demoMode]);

  const signInWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    if (demoMode) {
      return { error: "Google sign-in is not available in demo mode." };
    }

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { error: error.message };
    return {};
  }, [demoMode]);

  const signInDemo = useCallback((email: string) => {
    const demoUser: AuthUser = {
      id: "demo-" + email,
      email,
      displayName: email.split("@")[0],
      role: "free",
    };
    setUser(demoUser);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
  }, []);

  /* ---- Render ------------------------------------------------------------ */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode: demoMode,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
        signInDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
