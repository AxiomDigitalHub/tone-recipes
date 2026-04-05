"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const { signIn, signInWithGoogle, isDemoMode } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isDemoMode && !password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-1 text-sm text-muted">Welcome back to Fader &amp; Knob.</p>

        {isDemoMode && (
          <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-xs text-accent">
            Demo mode — Supabase not configured. Enter any email to sign in
            locally.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>

          {!isDemoMode && (
            <div>
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                placeholder="********"
                autoComplete="current-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        {!isDemoMode && (
          <>
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={async () => {
                // Save current referrer so callback can return user to the right page
                if (typeof window !== "undefined" && document.referrer) {
                  try {
                    const ref = new URL(document.referrer);
                    if (ref.hostname === window.location.hostname) {
                      sessionStorage.setItem("returnTo", ref.pathname);
                    }
                  } catch { /* ignore */ }
                }
                const result = await signInWithGoogle();
                if (result.error) setError(result.error);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          No account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
