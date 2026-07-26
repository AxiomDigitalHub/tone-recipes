"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { loginHref } from "@/lib/auth/redirect";

/**
 * v3 sub-nav — editorial chrome under the masthead bar.
 *
 * Desktop: brand · 6 nav links · auth slot, all in one row.
 * Mobile (≤720px): brand · auth slot · hamburger. Tap the hamburger
 * to open a slide-down drawer with the 6 nav links stacked. The
 * drawer closes automatically on route change and on Escape.
 *
 * Auth slot is state-aware:
 *   - Loading or anonymous → "Log in" / "Sign up" buttons.
 *   - Signed in → initials avatar opening a disclosure menu
 *     (identity · Dashboard · Sign out). Sign out lives one level
 *     down on purpose: it's a rare, session-destroying action and
 *     doesn't earn permanent top-level placement next to the avatar,
 *     where a misclick logs you out mid-flow.
 */

// Minimal on purpose (2026-07-08, Daniel's call): the top nav carries only
// the words a first-time visitor parses instantly — everything else lives in
// the footer. Labels are wayfaring, not branding: the blog page can call
// itself "Field Notes"; the nav says "Blog".
const NAV_LINKS = [
  { href: "/browse", label: "Tones" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/pricing", label: "Pricing" },
];

/**
 * Whether `pathname` should highlight `linkHref` as the active page.
 * `/recipe/<slug>` highlights "Recipes" (since /browse is the catalog
 * landing). `/blog/<slug>` highlights "Field Notes". Everywhere else
 * is exact-match on the prefix.
 */
function isNavActive(pathname: string, linkHref: string): boolean {
  if (linkHref === "/browse") {
    return (
      pathname === "/browse" ||
      pathname.startsWith("/browse/") ||
      pathname.startsWith("/recipe/") ||
      pathname.startsWith("/song/") ||
      pathname.startsWith("/artist/") ||
      pathname.startsWith("/gear/")
    );
  }
  if (linkHref === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }
  if (linkHref === "/news") {
    return pathname === "/news" || pathname.startsWith("/news/");
  }
  if (linkHref === "/platforms") {
    return pathname === "/platforms" || pathname.startsWith("/platforms/");
  }
  if (linkHref === "/request") {
    return pathname === "/request" || pathname.startsWith("/request/");
  }
  if (linkHref === "/pricing") {
    return pathname === "/pricing";
  }
  return pathname === linkHref;
}

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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const initials = user ? initialsFor(user.displayName, user.email) : "";

  // Close drawer + account menu on route change.
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Account menu: close on Escape (returning focus to the avatar) and
  // on any pointer press outside the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        avatarRef.current?.focus();
      }
    };
    const onPress = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [menuOpen]);

  // Close drawer on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <nav
      className={`preview-subnav ${open ? "is-open" : ""}${menuOpen ? " account-open" : ""}`}
    >
      <div className="preview-subnav-inner">
        <Link href="/" className="preview-subnav-brand">
          Fader &amp; Knob
        </Link>

        <div className="preview-subnav-links">
          {NAV_LINKS.map((l) => {
            const active = isNavActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="preview-subnav-auth">
          {/* Inside the auth group, not a fourth flex sibling — a fourth
              child overflowed the row and wrapped LOG IN / SIGN UP onto a
              second line at desktop widths. */}
          <button
            type="button"
            className="preview-subnav-search"
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            aria-label="Search tones"
            title="Search (⌘K)"
          >
            <Search size={16} aria-hidden />
          </button>
          {loading ? (
            <span className="preview-subnav-loading" aria-hidden>
              ···
            </span>
          ) : user ? (
            <div className="preview-subnav-account" ref={accountRef}>
              <button
                type="button"
                ref={avatarRef}
                onClick={() => setMenuOpen((v) => !v)}
                className="preview-subnav-avatar"
                aria-label="Account menu"
                aria-expanded={menuOpen}
                aria-controls="preview-subnav-account-menu"
              >
                {initials}
              </button>
              {menuOpen && (
                <div
                  id="preview-subnav-account-menu"
                  className="preview-subnav-account-menu"
                >
                  <div className="preview-subnav-account-id">
                    {user.displayName && (
                      <span className="preview-subnav-account-name">
                        {user.displayName}
                      </span>
                    )}
                    {user.email && (
                      <span className="preview-subnav-account-email">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    className="preview-subnav-account-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="preview-subnav-account-item preview-subnav-account-signout"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href={loginHref(pathname)} className="preview-subnav-login">
                Log in
              </Link>
              <Link href="/signup" className="preview-subnav-signup">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="preview-subnav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="preview-subnav-drawer"
        >
          <span className="preview-subnav-burger-bar" />
          <span className="preview-subnav-burger-bar" />
          <span className="preview-subnav-burger-bar" />
        </button>
      </div>

      {/* Mobile drawer — full-screen fixed overlay. Hidden on desktop via CSS. */}
      <div
        id="preview-subnav-drawer"
        className="preview-subnav-drawer"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        <div className="preview-subnav-drawer-head">
          <Link
            href="/"
            className="preview-subnav-drawer-brand"
            onClick={() => setOpen(false)}
          >
            Fader &amp; Knob
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="preview-subnav-drawer-close"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <ul className="preview-subnav-drawer-list">
          <li>
            <button
              type="button"
              className="preview-subnav-drawer-link preview-subnav-drawer-search"
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("open-search"));
              }}
            >
              <Search size={16} aria-hidden /> Search tones
            </button>
          </li>
          {NAV_LINKS.map((l) => {
            const active = isNavActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`preview-subnav-drawer-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          {!user && !loading && (
            <>
              <li className="preview-subnav-drawer-sep" aria-hidden />
              <li>
                <Link
                  href={loginHref(pathname)}
                  className="preview-subnav-drawer-link"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="preview-subnav-drawer-link preview-subnav-drawer-link-cta"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li className="preview-subnav-drawer-sep" aria-hidden />
              <li>
                <Link
                  href="/dashboard"
                  className="preview-subnav-drawer-link"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="preview-subnav-drawer-link preview-subnav-drawer-signout"
                >
                  Sign out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
