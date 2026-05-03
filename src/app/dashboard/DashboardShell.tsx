"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { TIERS } from "@/lib/permissions";
import type { UserRole } from "@/lib/auth/auth-context";
import type { ReactNode } from "react";

/**
 * v3 dashboard shell — editorial chrome for the logged-in surface.
 *
 * Sidebar: 7 nav items mirroring the production /dashboard tree.
 * Top bar: identity tile (initials + name + tier pill) plus a
 * sign-out trigger via auth-context. When no user is signed in,
 * the shell shows a "Sign in to personalize" prompt rather than
 * crashing — handy for design preview without real auth state.
 *
 * The visual language matches /blog (left sticky sidebar,
 * paper/ink contrast, mono-cap labels, amber active-state border).
 */

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/saved", label: "Saved" },
  { href: "/dashboard/my-gear", label: "My gear" },
  { href: "/dashboard/my-recipes", label: "My recipes" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/settings", label: "Settings" },
] as const;

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

function initialsFrom(name: string | null | undefined, email: string | null | undefined): string {
  const source = (name ?? email ?? "").trim();
  if (!source) return "FK";
  const parts = source.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function tierLabelFor(role: UserRole | null | undefined): { label: string; isPaid: boolean } {
  const r = role ?? "free";
  const label = TIERS[r]?.label ?? "Free";
  const isPaid = r !== "free";
  return { label, isPaid };
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const displayName = user?.displayName ?? user?.email ?? null;
  const tier = tierLabelFor(user?.role);
  const isAdmin = user?.role && ADMIN_ROLES.has(user.role);
  const initials = initialsFrom(user?.displayName, user?.email);

  return (
    <div className="container">
      <div className="dashboard-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Dashboard</span>
        </div>

        <header className="dashboard-identity">
          <div className="dashboard-avatar" aria-hidden>
            {initials}
          </div>
          <div className="dashboard-identity-text">
            <div className="dashboard-identity-meta">
              <span className={`dashboard-tier dashboard-tier-${tier.label.toLowerCase().replace(/\s+/g, "-")}`}>
                {tier.label}
              </span>
              {loading && <span className="dashboard-identity-status">Loading…</span>}
              {!loading && !user && (
                <span className="dashboard-identity-status">
                  Not signed in — design preview mode
                </span>
              )}
            </div>
            <h1 className="display dashboard-name">
              {displayName ? `Welcome back, ${displayName.split(/[@\s]/)[0]}` : "Your dashboard"}
            </h1>
          </div>
          {user && (
            <button
              type="button"
              onClick={() => signOut()}
              className="dashboard-signout"
              title="Sign out"
            >
              Sign out
            </button>
          )}
          {!user && !loading && (
            <Link href="/login" className="hero-cta hero-cta-primary dashboard-signin">
              Sign in
            </Link>
          )}
        </header>

        <div className="dashboard-grid">
          <aside className="dashboard-sidebar" aria-label="Account navigation">
            <ul className="dept-list">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`dept-link dashboard-nav-link ${active ? "is-active" : ""}`}
                    >
                      <span className="dept-link-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <Link
                    href="/dashboard/admin"
                    className={`dept-link dashboard-nav-link dashboard-nav-admin ${
                      pathname.startsWith("/dashboard/admin") ? "is-active" : ""
                    }`}
                  >
                    <span className="dept-link-label">Super admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </aside>

          <section className="dashboard-content">{children}</section>
        </div>
      </div>
    </div>
  );
}
