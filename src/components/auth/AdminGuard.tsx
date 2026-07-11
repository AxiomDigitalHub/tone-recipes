"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

/**
 * Role-only guard for admin pages that live INSIDE /dashboard.
 *
 * The parent DashboardShell already handles:
 * - Loading spinner while auth hydrates
 * - Redirect to /login if no user after grace period
 *
 * So this component does NOT show its own spinner or redirect to
 * /login. It only checks the role once the user is available and
 * redirects non-admins to /dashboard.
 */
// Admin access = an admin role OR the is_moderator flag (decoupled from
// subscription tier — see AuthUser.isModerator).
function hasAdminAccess(user: { role: string; isModerator?: boolean }): boolean {
  return ADMIN_ROLES.has(user.role) || user.isModerator === true;
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = user && hasAdminAccess(user);

  useEffect(() => {
    // Don't do anything while auth is still loading — DashboardShell
    // handles the loading state and login redirect.
    if (loading || !user) return;

    // User is authenticated but not an admin — bounce to dashboard.
    if (!hasAdminAccess(user)) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // While loading or no user yet, render nothing — DashboardShell
  // is already showing a spinner. No duplicate spinners, no
  // competing redirects.
  if (loading || !user) return null;

  // User exists but wrong role — will redirect via useEffect above.
  if (!isAdmin) return null;

  return <>{children}</>;
}
