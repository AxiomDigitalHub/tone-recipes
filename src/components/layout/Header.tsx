"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Search, Bell } from "lucide-react";
import PlatformPicker from "./PlatformPicker";
import NotificationBell from "@/components/community/NotificationBell";

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/platforms", label: "Platforms" },
  { href: "/guides", label: "Guides" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, signOut } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await signOut();
  };

  /** Initials for avatar circle */
  const initials = user
    ? (user.displayName || user.email)
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink)]/15 bg-[var(--paper)]/80 backdrop-blur-md">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-[60] focus:rounded-lg focus:bg-[var(--amber)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--ink)]">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[var(--amber-2)]" style={{ letterSpacing: "-0.02em" }}>Fader &amp; Knob</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Platform picker + Search button + Auth area */}
        <div className="hidden items-center gap-3 md:flex">
          <PlatformPicker />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
            className="flex items-center gap-2 rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] px-3 py-1.5 text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search</span>
            <kbd className="rounded border border-[var(--ink)]/15 bg-[var(--paper)] px-1.5 py-0.5 text-xs">
              &#8984;K
            </kbd>
          </button>

          {/* Auth: notification bell + avatar dropdown or sign-in links */}
          {!loading && user && <NotificationBell />}
          {loading ? (
            // Skeleton that reserves the same horizontal space as the
            // real auth UI so there's no content shift when auth hydrates.
            // Width matches "Log in" + "Sign up" button + gap at md+ screens.
            <div
              className="flex items-center gap-3"
              aria-hidden="true"
              aria-busy="true"
            >
              <div className="h-4 w-12 animate-pulse rounded bg-[var(--paper-2)]" />
              <div className="h-9 w-[74px] animate-pulse rounded-lg bg-[var(--paper-2)]" />
            </div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--amber)] text-xs font-bold text-[var(--ink)] transition-opacity hover:opacity-90"
                aria-label="User menu"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] py-1 shadow-xl">
                  <p className="truncate px-4 py-2 text-xs text-[var(--ink-muted)]">
                    {user.email}
                  </p>
                  <hr className="border-[var(--ink)]/15" />
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)]"
                  >
                    Saved Recipes
                  </Link>
                  <Link
                    href="/dashboard/my-gear"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)]"
                  >
                    My Gear
                  </Link>
                  <Link
                    href="/dashboard/my-tones"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)]"
                  >
                    Your Tones
                  </Link>
                  <Link
                    href="/dashboard/my-recipes"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)]"
                  >
                    My Recipes
                  </Link>
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)]"
                  >
                    Notifications
                  </Link>
                  <hr className="border-[var(--ink)]/15" />
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--amber)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile search + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] active:bg-[var(--paper)]"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
          <svg
            className="h-6 w-6 text-[var(--ink)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--ink)]/15 bg-[var(--paper)] px-4 pb-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--ink-muted)]">My Platform:</span>
              <PlatformPicker />
            </div>
            <hr className="border-[var(--ink)]/15" />

            {loading ? (
              <div className="flex flex-col gap-2" aria-hidden="true" aria-busy="true">
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--paper-2)]" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--paper-2)]" />
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--amber)] text-xs font-bold text-[var(--ink)]">
                    {initials}
                  </div>
                  <span className="truncate text-sm text-[var(--ink-muted)]">
                    {user.email}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[var(--ink-muted)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/saved"
                  className="text-sm font-medium text-[var(--ink-muted)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Saved Recipes
                </Link>
                <Link
                  href="/dashboard/my-tones"
                  className="text-sm font-medium text-[var(--ink-muted)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Your Tones
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm font-medium text-[var(--ink-muted)]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[var(--ink-muted)]" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[var(--amber)] px-4 py-2 text-center text-sm font-semibold text-[var(--ink)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
