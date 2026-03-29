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

export type UserRole = "free" | "premium" | "creator" | "admin";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const demoMode = !isSupabaseConfigured();

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

    async function buildUser(supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): Promise<AuthUser> {
      const base: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email ?? "",
        displayName: supabaseUser.user_metadata?.display_name as string | undefined,
        avatarUrl: supabaseUser.user_metadata?.avatar_url as string | undefined,
        role: "free",
      };
      // Fetch role + display_name from profile
      try {
        const { data } = await supabase.from("profiles").select("role, display_name, avatar_url").eq("id", supabaseUser.id).single();
        if (data) {
          const row = data as Record<string, unknown>;
          base.role = (row.role as UserRole) || "free";
          if (row.display_name) base.displayName = row.display_name as string;
          if (row.avatar_url) base.avatarUrl = row.avatar_url as string;
        }
      } catch {
        // Profile fetch failed — default to free
      }
      return base;
    }

    // Timeout: if getSession takes too long, show login buttons anyway
    const timeout = setTimeout(() => setLoading(false), 3000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(await buildUser(session.user));
      }
      setLoading(false);
      clearTimeout(timeout);
    }).catch(() => {
      setLoading(false);
      clearTimeout(timeout);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(await buildUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [demoMode]);

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
