"use client";

import { useEffect } from "react";
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

  // Grace period before redirecting to /login.
  // Prevents a brief loading-false + user-null race from bouncing users
  // off the dashboard when they return from external redirects (Stripe, OAuth).
  useEffect(() => {
    if (loading || user) return;
    const timer = setTimeout(() => {
      // Re-check inside the timer — if user arrived during the grace period, bail
      if (!user) {
        router.replace("/login");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.displayName ?? user.email)
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row md:gap-8 md:px-4 md:py-10">
      {/* ---- Sidebar (desktop) ---- */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 flex flex-col gap-6">
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.displayName ?? user.email.split("@")[0]}
              </p>
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
      <div className="flex-1 px-4 py-8 md:px-0 md:py-0">{children}</div>
    </div>
  );
}
