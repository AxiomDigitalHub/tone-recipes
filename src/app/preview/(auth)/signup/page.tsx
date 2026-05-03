import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview · Sign up — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="container">
      <section className="auth-page">
        <div className="auth-card">
          <header className="auth-card-head">
            <h1 className="display auth-title">Create your account</h1>
            <p className="auth-sub">
              Free forever. Upgrade later for unlimited preset downloads.
            </p>
          </header>

          <form className="auth-form" action="/api/auth/signup" method="post">
            <label className="auth-field">
              <span className="auth-label">Display name</span>
              <input
                type="text"
                name="name"
                required
                placeholder="What you go by"
                className="auth-input"
              />
            </label>
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
                minLength={8}
                className="auth-input"
              />
              <span className="auth-hint">
                8+ characters, anything you can remember.
              </span>
            </label>
            <button type="submit" className="hero-cta hero-cta-primary auth-submit">
              Create account
            </button>
          </form>

          <div className="auth-foot">
            <span>
              Already have one?{" "}
              <Link href="/preview/login" className="auth-link auth-link-strong">
                Log in
              </Link>
            </span>
          </div>

          <p className="auth-fineprint">
            By signing up you agree to our{" "}
            <Link href="/preview/terms" className="auth-link">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/preview/privacy" className="auth-link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
