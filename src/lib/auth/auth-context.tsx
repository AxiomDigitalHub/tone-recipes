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

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** true when running without Supabase (localStorage-only demo user) */
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          displayName: session.user.user_metadata?.display_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          displayName: session.user.user_metadata?.display_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
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

  const signInDemo = useCallback((email: string) => {
    const demoUser: AuthUser = {
      id: "demo-" + email,
      email,
      displayName: email.split("@")[0],
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
