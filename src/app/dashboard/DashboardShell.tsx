"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import {
  LayoutDashboard,
  Heart,
  Guitar,
  Settings,
  LogOut,
  ChefHat,
  Bell,
  Shield,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Nav items                                                                 */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/saved", label: "Saved Recipes", icon: Heart },
  { href: "/dashboard/my-gear", label: "My Gear", icon: Guitar },
  { href: "/dashboard/my-recipes", label: "My Recipes", icon: ChefHat },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

const ADMIN_NAV = { href: "/dashboard/admin", label: "Super Admin", icon: Shield };
const ADMIN_ROLES = new Set(["admin", "super_admin"]);

/* -------------------------------------------------------------------------- */
/*  Shell                                                                     */
/* -------------------------------------------------------------------------- */

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [justUpgraded, setJustUpgraded] = useState(false);

  // Read ?upgraded=true from URL on client only (avoids Suspense prerender issue)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setJustUpgraded(
      new URLSearchParams(window.location.search).get("upgraded") === "true",
    );
  }, []);

  // Grace period before redirecting to /login.
  // Prevents a brief loading-false + user-null race from bouncing users
  // off the dashboard when they return from external redirects (Stripe, OAuth).
  // Extended to 6 seconds when ?upgraded=true is present — the user just paid us
  // and deserves to wait for auth hydration before we bounce them to /login.
  useEffect(() => {
    if (loading || user) return;
    const graceMs = justUpgraded ? 6000 : 3000;
    const timer = setTimeout(() => {
      router.replace("/login");
    }, graceMs);
    return () => clearTimeout(timer);
  }, [loading, user, router, justUpgraded]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-muted">
          {justUpgraded ? "Activating your account..." : "Loading..."}
        </p>
      </div>
    );
  }

  const initials = (user.displayName ?? user.email)
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8 md:px-4 md:py-10">
      {/* ---- Sidebar (desktop) ---- */}
      <aside className="hidden md:block">
        <div className="sticky top-24 flex flex-col gap-6">
          {/* User info + tier badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.displayName ?? user.email.split("@")[0]}
                </p>
                <TierBadge role={user.role} />
              </div>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}

            {/* Super Admin link — only visible to admin/super_admin roles */}
            {user && ADMIN_ROLES.has(user.role) && (
              <Link
                href={ADMIN_NAV.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith(ADMIN_NAV.href)
                    ? "bg-red-500/15 text-red-400"
                    : "text-red-400/60 hover:bg-surface-hover hover:text-red-400"
                }`}
              >
                <ADMIN_NAV.icon className="h-4 w-4 shrink-0" />
                {ADMIN_NAV.label}
              </Link>
            )}
          </nav>

          {/* Sign out */}
          <button
            onClick={() => signOut()}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ---- Mobile tabs ---- */}
      <nav className="flex border-b border-border md:hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 text-[11px] font-medium transition-colors ${
                active
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ---- Content ---- */}
      <div className="min-h-[70vh] px-4 py-8 md:px-0 md:py-0">{children}</div>
    </div>
  );
}

/* ── Tier badge ── */

function TierBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; className: string }> = {
    super_admin: { label: "Admin", className: "bg-red-500/20 text-red-400" },
    admin: { label: "Admin", className: "bg-red-500/20 text-red-400" },
    creator: { label: "Pro", className: "bg-purple-500/20 text-purple-400" },
    premium: { label: "Pass", className: "bg-accent/20 text-accent" },
    free: { label: "Free", className: "bg-surface text-muted" },
  };
  const c = config[role] ?? config.free;
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${c.className}`}>
      {c.label}
    </span>
  );
}
