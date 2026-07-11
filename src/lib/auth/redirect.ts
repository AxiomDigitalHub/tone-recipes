/**
 * Post-login redirect resolution — ONE predictable rule for every sign-in
 * entry point (login page email + Google, the OAuth callback, signup).
 *
 * Before this existed, each path did its own thing: email login always went
 * to /dashboard, Google went to the referrer, and the OAuth callback fell
 * back to "/" (home) — so where you landed depended on how you happened to
 * sign in. That's the "I signed in on /browse and got sent home" bug.
 *
 * The rule, in priority order:
 *   1. an explicit ?next=<path> query param (checkout, gated actions)
 *   2. the page you came from (same-origin referrer)
 *   3. /dashboard
 *
 * Everything is validated as a same-origin ROOT-RELATIVE path, so a
 * crafted ?next can never open-redirect a user off-site (//evil.com, an
 * absolute URL, a backslash trick) or bounce them onto an auth page.
 */

const AUTH_PATHS = ["/login", "/signup", "/auth/callback"];
export const DEFAULT_POST_AUTH = "/dashboard";

/** True only for a safe same-origin path we're willing to redirect to. */
export function safeNextPath(raw: string | null | undefined): raw is string {
  if (!raw) return false;
  // Root-relative only: one leading slash, and not protocol-relative (//)
  // or a backslash trick (/\) that browsers can treat as a host.
  if (raw[0] !== "/") return false;
  if (raw[1] === "/" || raw[1] === "\\") return false;
  // Never land back on an auth page (avoids sign-in bounce loops).
  const path = raw.split(/[?#]/)[0];
  if (AUTH_PATHS.some((p) => path === p || path.startsWith(p + "/"))) {
    return false;
  }
  return true;
}

/**
 * Build a /login href that remembers the current page via ?next.
 *
 * This is the RELIABLE way to preserve where the user was: Next.js <Link>
 * client navigation does NOT update document.referrer (it's a pushState,
 * not a document load), so referrer alone misses in-app navigations. Pass
 * the current pathname here so login knows where to return.
 */
export function loginHref(currentPath: string | null | undefined): string {
  return safeNextPath(currentPath)
    ? `/login?next=${encodeURIComponent(currentPath)}`
    : "/login";
}

/**
 * Where to send the user after they authenticate. Client-only — reads the
 * current URL's ?next and document.referrer. Falls back to /dashboard.
 */
export function resolvePostAuthRedirect(): string {
  if (typeof window === "undefined") return DEFAULT_POST_AUTH;

  // 1. explicit ?next
  const next = new URLSearchParams(window.location.search).get("next");
  if (safeNextPath(next)) return next;

  // 2. the page they came from (same-origin referrer only)
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin && safeNextPath(ref.pathname)) {
        return ref.pathname + ref.search;
      }
    }
  } catch {
    /* malformed referrer — ignore */
  }

  // 3. default
  return DEFAULT_POST_AUTH;
}
