import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview · Log in — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="container">
      <section className="auth-page">
        <div className="auth-card">
          <header className="auth-card-head">
            <h1 className="display auth-title">Welcome back</h1>
            <p className="auth-sub">
              Sign in to your Fader &amp; Knob account.
            </p>
          </header>

          <form className="auth-form" action="/api/auth/login" method="post">
            <label className="auth-field">
              <span className="auth-label">Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="auth-input"
              />
            </label>
            <label className="auth-field">
              <span className="auth-label">Password</span>
              <input
                type="password"
                name="password"
                required
                className="auth-input"
              />
            </label>
            <button type="submit" className="hero-cta hero-cta-primary auth-submit">
              Sign in
            </button>
          </form>

          <div className="auth-foot">
            <span>
              No account?{" "}
              <Link href="/preview/signup" className="auth-link auth-link-strong">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
