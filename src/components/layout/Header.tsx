"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/gear", label: "Gear" },
  { href: "/compare", label: "Compare" },
  { href: "/learn", label: "Learn" },
  { href: "/blog", label: "Blog" },
  { href: "/admin", label: "Admin" },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-accent">ToneRecipes</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search button + Auth area */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
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
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-xs">
              &#8984;K
            </kbd>
          </button>

          {/* Auth: avatar dropdown or sign-in links */}
          {!loading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-background transition-opacity hover:opacity-90"
                aria-label="User menu"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface py-1 shadow-xl">
                  <p className="truncate px-4 py-2 text-xs text-muted">
                    {user.email}
                  </p>
                  <hr className="border-border" />
                  <Link
                    href="/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
                  >
                    Saved Recipes
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                Sign up
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg
            className="h-6 w-6 text-foreground"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border" />

            {!loading && user ? (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-background">
                    {initials}
                  </div>
                  <span className="truncate text-sm text-muted">
                    {user.email}
                  </span>
                </div>
                <Link
                  href="/saved"
                  className="text-sm font-medium text-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  Saved Recipes
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm font-medium text-muted"
                >
                  Sign Out
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className="text-sm font-medium text-muted" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-background"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
