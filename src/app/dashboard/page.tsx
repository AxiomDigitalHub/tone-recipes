"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getProfile, getUserGear } from "@/lib/db/profile";
import { toneRecipes, getRecipeBySlug, getSongBySlug } from "@/lib/data";
import type { ToneRecipe, Platform } from "@/types/recipe";
import { BookOpen, Guitar, Settings, Sparkles, CircleCheckBig, Circle } from "lucide-react";
import { TIERS } from "@/lib/permissions";
import { classifyTonePersonality, getTimeGreeting } from "@/lib/tone-personality";
import ContinueHero from "@/components/dashboard/ContinueHero";
import RecipeRail from "@/components/dashboard/RecipeRail";

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
  physical: "Pedalboard",
};

/** Editorial picks for new users with no saves or history */
const STARTER_PICKS = [
  "srv-pride-and-joy-rhythm",
  "gilmour-comfortably-numb-solo",
  "hendrix-voodoo-child-wah",
  "edge-where-streets-have-no-name",
  "mayer-slow-dancing-clean",
  "slash-sweet-child-lead",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const favoritesHydrate = useFavoritesStore((s) => s.hydrate);
  const favoritesSet = useFavoritesStore((s) => s.favorites);
  const recentHydrate = useRecentlyViewedStore((s) => s.hydrate);
  const recentSlugs = useRecentlyViewedStore((s) => s.slugs);

  const [hydrated, setHydrated] = useState(false);
  const [primaryPlatform, setPrimaryPlatform] = useState<string | null>(null);
  const [gearCount, setGearCount] = useState(0);

  useEffect(() => {
    favoritesHydrate();
    recentHydrate();
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
        try {
          const stored = localStorage.getItem("tone-recipes-user-settings");
          if (stored) {
            const settings = JSON.parse(stored);
            if (settings.primaryPlatform) setPrimaryPlatform(settings.primaryPlatform);
          }
        } catch {
          /* empty */
        }
        try {
          const gearRaw = localStorage.getItem("tone-recipes-user-gear");
          if (gearRaw) {
            const gearArr = JSON.parse(gearRaw);
            if (Array.isArray(gearArr)) setGearCount(gearArr.length);
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
  }, [favoritesHydrate, recentHydrate, user]);

  /* ---- Derived data ----------------------------------------------------- */

  const savedRecipes = useMemo<ToneRecipe[]>(() => {
    if (!hydrated) return [];
    return [...favoritesSet]
      .map((slug) => getRecipeBySlug(slug))
      .filter((r): r is ToneRecipe => Boolean(r));
  }, [favoritesSet, hydrated]);

  const recentRecipes = useMemo<ToneRecipe[]>(() => {
    return recentSlugs
      .map((slug) => getRecipeBySlug(slug))
      .filter((r): r is ToneRecipe => Boolean(r));
  }, [recentSlugs]);

  // "Continue where you left off" — most recently viewed or fall back to a popular recipe
  const heroRecipe = useMemo<ToneRecipe | null>(() => {
    if (recentRecipes.length > 0) return recentRecipes[0];
    if (savedRecipes.length > 0) return savedRecipes[0];
    // Fallback to first starter pick for new users
    for (const slug of STARTER_PICKS) {
      const r = getRecipeBySlug(slug);
      if (r) return r;
    }
    // Ultimate fallback — just grab the first recipe
    return toneRecipes[0] ?? null;
  }, [recentRecipes, savedRecipes]);

  // "Matches your rig" — filter recipes by the user's primary platform
  const rigMatchRecipes = useMemo<ToneRecipe[]>(() => {
    if (!primaryPlatform) return [];
    const platform = primaryPlatform as Platform;
    // Recipes that have a translation for the user's platform
    return toneRecipes
      .filter((r) => r.platform_translations?.[platform])
      .slice(0, 12);
  }, [primaryPlatform]);

  // Starter picks for new users with empty everything
  const starterPicks = useMemo<ToneRecipe[]>(() => {
    return STARTER_PICKS.map((slug) => getRecipeBySlug(slug)).filter(
      (r): r is ToneRecipe => Boolean(r),
    );
  }, []);

  // Derived tone personality from saved recipes
  const personality = useMemo(
    () => classifyTonePersonality(savedRecipes),
    [savedRecipes],
  );

  /* ---- UI values -------------------------------------------------------- */

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "there";
  const greeting = `${hydrated ? getTimeGreeting() : "Welcome back"}, ${displayName}`;
  const tierLabel = user ? TIERS[user.role]?.label ?? "Free" : "Free";
  const isPaid = user?.role === "premium" || user?.role === "creator" || user?.role === "admin";

  // Activation checklist for new users
  const activationSteps = [
    {
      id: "platform",
      label: "Set your primary modeler",
      done: !!primaryPlatform,
      href: "/dashboard/settings",
    },
    {
      id: "gear",
      label: "Add a guitar or pedal to your gear",
      done: gearCount > 0,
      href: "/dashboard/my-gear",
    },
    {
      id: "save",
      label: "Save your first recipe",
      done: savedRecipes.length > 0,
      href: "/browse",
    },
  ];
  const activationComplete = activationSteps.every((s) => s.done);
  const showActivation = hydrated && !activationComplete;

  // Stats strip (demoted from giant cards to a compact row)
  const stats = [
    { label: "Plan", value: tierLabel, highlight: isPaid },
    { label: "Saved", value: String(savedRecipes.length) },
    { label: "Gear", value: String(gearCount) },
    {
      label: "Modeler",
      value: primaryPlatform
        ? PLATFORM_LABELS[primaryPlatform] ?? primaryPlatform
        : "Not set",
    },
  ];

  /* ---- Render ----------------------------------------------------------- */

  return (
    <div className="space-y-10">
      {/* ── Greeting + hero ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {greeting}
          </h1>
          {savedRecipes.length >= 3 ? (
            <p className="mt-1 text-sm text-muted">
              You&apos;re a{" "}
              <span className="font-semibold text-accent">
                {personality.label}
              </span>
              {" — "}
              {personality.description}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">
              Tone recipes from the songs you love.
            </p>
          )}
        </div>

        {heroRecipe && (
          <ContinueHero
            recipe={heroRecipe}
            eyebrow={recentRecipes.length > 0 ? "CONTINUE" : "START HERE"}
          />
        )}
      </section>

      {/* ── Activation checklist (new users only) ──────────────────────── */}
      {showActivation && (
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
                GET STARTED
              </p>
              <h2 className="mt-1 text-lg font-bold text-foreground">
                Activate your dashboard
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Three quick steps to make Fader &amp; Knob feel like yours.
              </p>
            </div>
            <p className="shrink-0 text-xs font-semibold text-muted">
              {activationSteps.filter((s) => s.done).length}/{activationSteps.length}
            </p>
          </div>

          <ul className="space-y-2">
            {activationSteps.map((step) => (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                    step.done
                      ? "border-border/50 bg-[#0b0f1a]/60 text-muted"
                      : "border-border bg-[#0b0f1a] text-foreground hover:border-accent/40 hover:bg-surface"
                  }`}
                >
                  {step.done ? (
                    <CircleCheckBig className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted" />
                  )}
                  <span className="flex-1 font-medium">{step.label}</span>
                  {!step.done && (
                    <span className="text-xs font-semibold text-accent">
                      Start →
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Your saved recipes rail ────────────────────────────────────── */}
      {savedRecipes.length > 0 ? (
        <RecipeRail
          eyebrow="YOUR LIBRARY"
          title="Saved recipes"
          subtitle="The tones you&apos;ve bookmarked for later"
          recipes={savedRecipes.slice(0, 12)}
          viewAllHref="/dashboard/saved"
        />
      ) : hydrated && !showActivation ? (
        <RecipeRail
          eyebrow="YOUR LIBRARY"
          title="Saved recipes"
          recipes={[]}
          emptyMessage="Save a recipe to see it here. Hit the heart icon on any recipe to bookmark it."
        />
      ) : null}

      {/* ── Matches your rig rail ──────────────────────────────────────── */}
      {primaryPlatform && rigMatchRecipes.length > 0 && (
        <RecipeRail
          eyebrow="PERSONALIZED"
          title={`Matches your ${PLATFORM_LABELS[primaryPlatform] ?? primaryPlatform}`}
          subtitle="Recipes with translations ready for your rig"
          recipes={rigMatchRecipes}
          viewAllHref={`/platforms/${primaryPlatform}`}
        />
      )}

      {/* ── Recently viewed rail (only if more than 1 recent) ─────────── */}
      {recentRecipes.length > 1 && (
        <RecipeRail
          eyebrow="JUMP BACK IN"
          title="Recently viewed"
          recipes={recentRecipes.slice(1, 13)}
        />
      )}

      {/* ── Starter picks for new users with no library yet ────────────── */}
      {hydrated && savedRecipes.length === 0 && recentRecipes.length === 0 && (
        <RecipeRail
          eyebrow="EDITORS' PICKS"
          title="Start with these"
          subtitle="Iconic tones to bookmark and build from"
          recipes={starterPicks}
          viewAllHref="/browse"
        />
      )}

      {/* ── Stats strip (demoted from giant cards) ─────────────────────── */}
      <section>
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted/70">
            YOUR ACCOUNT
          </p>
        </div>
        <div className="grid gap-3 rounded-xl border border-[#1e2840] bg-[#0b0f1a] p-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                {stat.label}
              </p>
              <div className="flex items-center gap-1.5">
                <p
                  className={`text-sm font-bold ${
                    stat.highlight ? "text-accent" : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
                {stat.highlight && <Sparkles className="h-3 w-3 text-accent" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Upgrade CTA for free users ─────────────────────────────────── */}
      {!isPaid && hydrated && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Unlock unlimited preset downloads
            </p>
            <p className="mt-1 text-xs text-muted">
              Tone Pass is $7/mo. Cancel anytime.
            </p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Upgrade
          </Link>
        </section>
      )}

      {/* ── Quick actions footer ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Browse recipes", href: "/browse", icon: BookOpen },
            { label: "My gear", href: "/dashboard/my-gear", icon: Guitar },
            { label: "Settings", href: "/dashboard/settings", icon: Settings },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-[#1e2840] bg-[#0b0f1a] p-4 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <Icon className="h-5 w-5 text-accent" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
