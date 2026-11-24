"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { loginHref } from "@/lib/auth/redirect";
import { Wordmark } from "@/components/brand/Logo";

/**
 * Site header (redesign, build order step 1). Styles: src/app/redesign.css.
 *
 * Desktop: logo · 4 nav links · search · auth slot · "My rig" pill.
 * Mobile (≤820px): logo · search · menu button. The menu button opens a
 * full-screen drawer with the nav links stacked. The drawer closes on
 * route change and on Escape.
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
// itself "Field Notes"; the nav says "Learn".
//
// Redesign structure change 1: "Blog" is "Learn" in the nav. The URL stays
// /blog (every /blog/... URL keeps working; /learn already 301s to /blog).
// Structure change 2: Platforms is not in the top nav. It becomes a section
// of Learn in step 6, so /platforms highlights "Learn" here.
const NAV_LINKS = [
  { href: "/browse", label: "Tones" },
  { href: "/blog", label: "Learn" },
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
    return (
      pathname === "/blog" ||
      pathname.startsWith("/blog/") ||
      pathname === "/platforms" ||
      pathname.startsWith("/platforms/") ||
      pathname.startsWith("/guides/")
    );
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

  const drawerLink = (active: boolean, quiet = false) =>
    `fk-header-drawer-link${active ? " is-active" : ""}${quiet ? " is-quiet" : ""}`;

  return (
    <header className={`fk-header${open ? " is-open" : ""}`}>
      <div className="fk-header-inner">
        <div className="fk-header-left">
          <Link href="/" className="fk-header-brand" aria-label="Fader & Knob home">
            <Wordmark tone="ink" title="" className="fk-header-logo" />
          </Link>
          <nav aria-label="Main" className="fk-header-nav">
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
          </nav>
        </div>

        <div className="fk-header-right">
          <button
            type="button"
            className="fk-iconbtn"
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            aria-label="Search tones"
            title="Search (⌘K)"
          >
            <Search size={20} strokeWidth={1.75} aria-hidden />
          </button>
          {loading ? (
            <span className="fk-header-loading" aria-hidden />
          ) : user ? (
            <div className="fk-header-account" ref={accountRef}>
              <button
                type="button"
                ref={avatarRef}
                onClick={() => setMenuOpen((v) => !v)}
                className="fk-header-avatar"
                aria-label="Account menu"
                aria-expanded={menuOpen}
                aria-controls="fk-header-account-menu"
              >
                {initials}
              </button>
              {menuOpen && (
                <div id="fk-header-account-menu" className="fk-header-menu">
                  <div className="fk-header-menu-id">
                    {user.displayName && (
                      <span className="fk-header-menu-name">{user.displayName}</span>
                    )}
                    {user.email && (
                      <span className="fk-header-menu-email">{user.email}</span>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    className="fk-header-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="fk-header-menu-item"
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
            <Link href={loginHref(pathname)} className="fk-header-login">
              Log in
            </Link>
          )}
          <Link href="/dashboard/my-gear" className="fk-header-pill">
            My rig
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="fk-iconbtn fk-header-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="fk-header-drawer"
          >
            <Menu size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>

      {/* Mobile drawer: full-screen fixed overlay. Hidden on desktop via CSS. */}
      <div
        id="fk-header-drawer"
        className="fk-header-drawer"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="fk-header-drawer-head">
          <Link
            href="/"
            className="fk-header-brand"
            onClick={() => setOpen(false)}
            aria-label="Fader & Knob home"
          >
            <Wordmark tone="ink" title="" className="fk-header-logo" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fk-iconbtn"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <ul className="fk-header-drawer-list">
          {NAV_LINKS.map((l) => {
            const active = isNavActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={drawerLink(active)}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/dashboard/my-gear"
              className={drawerLink(false)}
              onClick={() => setOpen(false)}
            >
              My rig
            </Link>
          </li>
          <li className="fk-header-drawer-sep" aria-hidden />
          {!user && !loading && (
            <>
              <li>
                <Link
                  href={loginHref(pathname)}
                  className={drawerLink(false, true)}
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className={drawerLink(false, true)}
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link
                  href="/dashboard"
                  className={drawerLink(false, true)}
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
                  className={drawerLink(false, true)}
                >
                  Sign out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
