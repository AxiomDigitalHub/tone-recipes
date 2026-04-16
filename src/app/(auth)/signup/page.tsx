"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

const MIN_PASSWORD_LENGTH = 10;

/**
 * Signup page — conversion-optimized.
 *
 * Design decisions (commit: "Signup rebuild: Google-first, value bullets,
 * drop confirm password"):
 *
 * - Google OAuth is the primary CTA. Highest-converting path; one click.
 * - Email/password is collapsed behind "…or use email". Still available,
 *   but doesn't dominate attention.
 * - Password field only — confirm-password dropped. Browser password
 *   managers (and the users who don't use them) handle typo risk fine
 *   with a visibility toggle.
 * - Min length bumped from 6 → 10 (matches the Supabase policy bump that
 *   lives alongside this change in the 2026-04 pricing/signup work).
 * - Email confirmation is disabled in Supabase, so on success we go
 *   straight to /dashboard — not to a "check your email" dead-end.
 * - Three value bullets above the form set expectations before asking for
 *   anything.
 */
export default function SignupPage() {
  const { signUp, signInWithGoogle, isDemoMode } = useAuth();
  const router = useRouter();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignup() {
    setError("");
    const result = await signInWithGoogle();
    if (result.error) setError(result.error);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!isDemoMode) {
      if (!password.trim()) {
        setError("Password is required.");
        return;
      }
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        return;
      }
    }

    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Success — onAuthStateChange has set the Supabase session; send the
    // user into the product. Email confirmation is disabled, so this is
    // the real landing zone (not a "check your email" detour).
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 md:py-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Start building your tone library
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join Fader &amp; Knob — it takes 20 seconds.
          </p>
        </div>

        {/* Value bullets — set expectations before asking for credentials */}
        <ul className="mb-6 space-y-2 rounded-xl border border-border bg-surface/60 px-5 py-4 text-sm">
          {[
            "10 free preset downloads (Helix & Katana)",
            "Signal chains for 6 platforms, free to view",
            "Save recipes for later and join the community",
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-border bg-surface p-6">
          {isDemoMode && (
            <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-xs text-accent">
              Demo mode — Supabase not configured. Enter any email to create a
              local account.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Primary CTA: Google OAuth (hidden in demo mode) */}
          {!isDemoMode && (
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-[#0b0f1a] py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface-hover"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          )}

          {/* Secondary path: email/password — collapsed by default */}
          {!isDemoMode && !showEmailForm && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Use email instead
              </button>
            </>
          )}

          {/* Email form — inline when user opts in, or always in demo mode */}
          {(isDemoMode || showEmailForm) && (
            <form
              onSubmit={handleEmailSubmit}
              className={isDemoMode ? "space-y-4" : "mt-4 space-y-4"}
            >
              {!isDemoMode && showEmailForm && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted">or with email</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-muted"
                >
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
                  autoFocus={showEmailForm}
                />
              </div>

              {!isDemoMode && (
                <div>
                  <label
                    htmlFor="password"
                    className="flex items-center justify-between text-xs font-medium text-muted"
                  >
                    <span>Password</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-muted hover:text-accent"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
