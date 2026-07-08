"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginClient() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Where to send the user after Google sign-in: back to the same-site page
  // they came from, else the dashboard. Captured at mount — document.referrer
  // is still the page that linked here.
  const returnToRef = useRef<string>("/dashboard");
  useEffect(() => {
    if (!document.referrer) return;
    try {
      const ref = new URL(document.referrer);
      if (
        ref.hostname === window.location.hostname &&
        ref.pathname !== window.location.pathname
      ) {
        returnToRef.current = ref.pathname;
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    if (typeof window !== "undefined" && document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.hostname === window.location.hostname) {
          sessionStorage.setItem("returnTo", ref.pathname);
        }
      } catch {
        /* ignore */
      }
    }
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <section className="auth-page">
        <div className="auth-card">
          <header className="auth-card-head">
            <h1 className="display auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to your Fader &amp; Knob account.</p>
          </header>

          <GoogleSignInButton
            text="continue_with"
            onClick={() => setError(null)}
            onSuccess={() => router.push(returnToRef.current)}
            onError={(msg) => setError(msg)}
            fallback={
              <button
                type="button"
                onClick={handleGoogle}
                disabled={submitting}
                className="auth-google"
              >
                <svg className="auth-google-icon" viewBox="0 0 24 24" aria-hidden>
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
            }
          />

          <div className="auth-divider" aria-hidden>
            <span className="auth-divider-rule" />
            <span className="auth-divider-label">or</span>
            <span className="auth-divider-rule" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span className="auth-label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="auth-input"
              />
            </label>
            <label className="auth-field">
              <span className="auth-label">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="auth-input"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="hero-cta hero-cta-primary auth-submit"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </form>

          <div className="auth-foot">
            <span>
              No account?{" "}
              <Link href="/signup" className="auth-link auth-link-strong">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
