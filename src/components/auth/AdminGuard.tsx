"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Wraps admin pages with a real role check. Redirects to /login if
 * not authenticated, and to / if authenticated but not admin.
 *
 * The middleware already blocks unauthenticated requests from loading
 * admin pages, but that's a cookie-existence check (necessary but not
 * sufficient). This component enforces the actual role === "admin"
 * requirement after the auth context has hydrated.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
