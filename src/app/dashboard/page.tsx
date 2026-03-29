"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getProfile, getUserGear } from "@/lib/db/profile";
import { BookOpen, Guitar, Settings } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Dashboard overview                                                        */
/* -------------------------------------------------------------------------- */

const PLATFORM_LABELS: Record<string, string> = {
  helix: "Helix",
  quad_cortex: "Quad Cortex",
  tonex: "TONEX",
  fractal: "Fractal",
  kemper: "Kemper",
  katana: "Boss Katana",
  physical: "Physical",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { getFavorites, hydrate } = useFavoritesStore();
  const [hydrated, setHydrated] = useState(false);
  const [primaryPlatform, setPrimaryPlatform] = useState<string | null>(null);
  const [gearCount, setGearCount] = useState(0);

  useEffect(() => {
    hydrate();
    setHydrated(true);

    let cancelled = false;

    async function load() {
      if (isSupabaseConfigured() && user?.id) {
        const [profile, gear] = await Promise.all([
          getProfile(user.id),
          getUserGear(user.id),
        ]);
        if (!cancelled) {
          setPrimaryPlatform(profile?.primary_platform || null);
          setGearCount(gear.length);
        }
      } else {
        // localStorage fallback
        try {
          const stored = localStorage.getItem("tone-recipes-user-settings");
          if (stored) {
            const settings = JSON.parse(stored);
            if (settings.primaryPlatform) {
              setPrimaryPlatform(settings.primaryPlatform);
            }
          }
        } catch {
          /* empty */
        }
        try {
          const gearRaw = localStorage.getItem("tone-recipes-user-gear");
          if (gearRaw) {
            const gearArr = JSON.parse(gearRaw);
            if (Array.isArray(gearArr)) {
              setGearCount(gearArr.length);
            }
          }
        } catch {
          /* empty */
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [hydrate, user]);

  const savedCount = hydrated ? getFavorites().length : 0;
  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "there";

  const stats = [
    {
      label: "Saved Recipes",
      value: String(savedCount),
    },
    {
      label: "My Gear",
      value: String(gearCount),
    },
    {
      label: "Platform",
      value: primaryPlatform
        ? PLATFORM_LABELS[primaryPlatform] ?? primaryPlatform
        : "Not set",
    },
  ];

  const quickActions = [
    {
      label: "Browse Recipes",
      href: "/browse",
      icon: BookOpen,
    },
    {
      label: "My Gear",
      href: "/dashboard/my-gear",
      icon: Guitar,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        Welcome back, {displayName}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Here is an overview of your account.
      </p>

      {/* Stats grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mt-10 text-lg font-semibold text-foreground">
        Quick Actions
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-hover"
          >
            <Icon className="h-5 w-5 text-accent" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
