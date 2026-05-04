"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";

/**
 * v3 sub-nav — editorial chrome under the masthead bar.
 *
 * Public links live in the middle. The auth slot on the right is
 * state-aware:
 *   - Loading or anonymous → "Log in" / "Sign up" buttons.
 *   - Signed in → initials avatar that links to /dashboard,
 *     plus a Sign out text link.
 *
 * Avatar initials come from displayName (first + last initials)
 * or the email local part as a fallback.
 */

function initialsFor(name: string | null | undefined, email: string | null | undefined): string {
  const source = (name ?? email ?? "").trim();
  if (!source) return "FK";
  const parts = source.split(/[\s@]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function SiteSubnav() {
  const { user, loading, signOut } = useAuth();
  const initials = user ? initialsFor(user.displayName, user.email) : "";

  return (
    <nav className="preview-subnav">
      <div className="preview-subnav-inner">
        <Link href="/" className="preview-subnav-brand">
          Fader &amp; Knob
        </Link>

        <div className="preview-subnav-links">
          <Link href="/browse">Archive</Link>
          <Link href="/platforms">Platforms</Link>
          <Link href="/blog">Field Notes</Link>
          <Link href="/news">News</Link>
          <Link href="/request">Request</Link>
          <Link href="/pricing">Pricing</Link>
        </div>

        <div className="preview-subnav-auth">
          {loading ? (
            <span className="preview-subnav-loading" aria-hidden>
              ···
            </span>
          ) : user ? (
            <>
              <button
                type="button"
                onClick={() => signOut()}
                className="preview-subnav-signout"
                aria-label="Sign out"
              >
                Sign out
              </button>
              <Link
                href="/dashboard"
                className="preview-subnav-avatar"
                aria-label="Open dashboard"
                title={user.displayName ?? user.email ?? "Dashboard"}
              >
                {initials}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="preview-subnav-login">
                Log in
              </Link>
              <Link href="/signup" className="preview-subnav-signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
