"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getProfile, getUserGear } from "@/lib/db/profile";
import { toneRecipes, getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";
import type { ToneRecipe, Platform } from "@/types/recipe";
import { TIERS } from "@/lib/permissions";
import { classifyTonePersonality, getTimeGreeting } from "@/lib/tone-personality";
import { track } from "@/lib/analytics";
import { LpArt, monogramFor } from "@/components/v3/LpArt";

const PLATFORM_LABELS: Record<string, string> = {
  helix: "Helix",
  quad_cortex: "Quad Cortex",
  tonex: "TONEX",
  fractal: "Fractal",
  kemper: "Kemper",
  katana: "Boss Katana",
  physical: "Pedalboard",
};

const STARTER_PICKS = [
  "srv-pride-and-joy-rhythm",
  "gilmour-comfortably-numb-solo",
  "hendrix-voodoo-child-wah",
  "evh-eruption-brown-sound",
  "hetfield-master-of-puppets-rhythm",
  "mayer-slow-dancing-burning-room",
];

function RecipeCard({ recipe, hue }: { recipe: ToneRecipe; hue: number }) {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  return (
    <Link href={`/recipe/${recipe.slug}`} className="dashboard-card">
      <LpArt
        cover={song?.album_art_url}
        monogram={monogramFor(song?.title ?? recipe.title)}
        hue={hue}
        shape="square"
      />
      <div className="dashboard-card-body">
        <div className="dashboard-card-title">{song?.title ?? recipe.title}</div>
        {artist && (
          <div className="dashboard-card-artist">
            <em>{artist.name}</em>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const favoritesHydrate = useFavoritesStore((s) => s.hydrate);
  const favoritesSet = useFavoritesStore((s) => s.favorites);
  const recentHydrate = useRecentlyViewedStore((s) => s.hydrate);
  const recentSlugs = useRecentlyViewedStore((s) => s.slugs);

  const [hydrated, setHydrated] = useState(false);
  const [primaryPlatform, setPrimaryPlatform] = useState<string | null>(null);
  const [gearCount, setGearCount] = useState(0);

  // Stripe redirects here with ?upgraded=<tier> after a successful checkout
  // (see /api/checkout success_url). Fire the conversion once, then strip
  // the param so a refresh/bookmark doesn't double-count.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("upgraded");
    if (!tier) return;
    track("checkout_complete", { tier });
    params.delete("upgraded");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : ""),
    );
  }, []);

  useEffect(() => {
    favoritesHydrate(user?.id);
    recentHydrate();
    setHydrated(true);

    let cancelled = false;
    (async () => {
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
    })();
    return () => {
      cancelled = true;
    };
  }, [favoritesHydrate, recentHydrate, user]);

  const savedRecipes = useMemo<ToneRecipe[]>(() => {
    if (!hydrated) return [];
    return [...favoritesSet]
      .map((slug) => getRecipeBySlug(slug))
      .filter((r): r is ToneRecipe => Boolean(r));
  }, [favoritesSet, hydrated]);

  const recentRecipes = useMemo<ToneRecipe[]>(
    () =>
      recentSlugs
        .map((slug) => getRecipeBySlug(slug))
        .filter((r): r is ToneRecipe => Boolean(r)),
    [recentSlugs],
  );

  const heroRecipe = useMemo<ToneRecipe | null>(() => {
    if (recentRecipes[0]) return recentRecipes[0];
    if (savedRecipes[0]) return savedRecipes[0];
    for (const slug of STARTER_PICKS) {
      const r = getRecipeBySlug(slug);
      if (r) return r;
    }
    return toneRecipes[0] ?? null;
  }, [recentRecipes, savedRecipes]);

  const rigMatchRecipes = useMemo<ToneRecipe[]>(() => {
    if (!primaryPlatform) return [];
    const platform = primaryPlatform as Platform;
    return toneRecipes
      .filter((r) => r.platform_translations?.[platform])
      .slice(0, 12);
  }, [primaryPlatform]);

  const starterPicks = useMemo<ToneRecipe[]>(
    () =>
      STARTER_PICKS.map((s) => getRecipeBySlug(s)).filter(
        (r): r is ToneRecipe => Boolean(r),
      ),
    [],
  );

  const personality = useMemo(
    () => classifyTonePersonality(savedRecipes),
    [savedRecipes],
  );

  const heroSong = heroRecipe ? getSongBySlug(heroRecipe.song_slug) : undefined;
  const heroArtist = heroSong ? getArtistBySlug(heroSong.artist_slug) : undefined;

  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "there";
  const greeting = `${hydrated ? getTimeGreeting() : "Welcome back"}, ${displayName}`;
  const tierLabel = user ? TIERS[user.role]?.label ?? "Free" : "Free";
  const isPaid =
    user?.role === "premium" ||
    user?.role === "creator" ||
    user?.role === "admin" ||
    user?.role === "super_admin";

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
  const activationDone = activationSteps.filter((s) => s.done).length;
  const showActivation = hydrated && activationDone < activationSteps.length;

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

  return (
    <>
      {/* Greeting */}
      <header className="dashboard-greeting">
        <h2 className="display dashboard-greeting-title">{greeting}</h2>
        {savedRecipes.length >= 3 ? (
          <p className="dashboard-greeting-dek">
            You&apos;re a{" "}
            <span className="dashboard-personality">{personality.label}</span>
            {" — "}
            {personality.description}
          </p>
        ) : (
          <p className="dashboard-greeting-dek">
            Tone recipes from the songs you love.
          </p>
        )}
      </header>

      {/* Continue hero */}
      {heroRecipe && (
        <section className="dashboard-hero">
          <div className="dashboard-hero-art">
            <LpArt
              cover={heroSong?.album_art_url}
              monogram={monogramFor(heroSong?.title ?? heroRecipe.title)}
              hue={1}
              shape="square"
            />
          </div>
          <div className="dashboard-hero-body">
            <div className="recipe-issue">
              <span className="pill">
                {recentRecipes[0]
                  ? "Continue where you left off"
                  : savedRecipes[0]
                    ? "From your saves"
                    : "Editor's pick"}
              </span>
              {heroSong?.year && <span>·</span>}
              {heroSong?.year && <span>{heroSong.year}</span>}
            </div>
            <h2 className="display dashboard-hero-title">
              {heroSong?.title ?? heroRecipe.title}
            </h2>
            {heroArtist && (
              <p className="dashboard-hero-artist">
                <em>{heroArtist.name}</em>
                {heroSong?.album && (
                  <>
                    {" — "}
                    <span>{heroSong.album}</span>
                  </>
                )}
              </p>
            )}
            {heroRecipe.description && (
              <p className="dashboard-hero-dek">{heroRecipe.description}</p>
            )}
            <div className="dashboard-hero-cta-row">
              <Link
                href={`/recipe/${heroRecipe.slug}`}
                className="hero-cta hero-cta-primary"
              >
                Open recipe
              </Link>
              <Link href="/browse" className="dashboard-hero-cta-secondary">
                Browse more →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Activation checklist */}
      {showActivation && (
        <section className="dashboard-activation">
          <header className="dashboard-activation-head">
            <div>
              <span className="dashboard-eyebrow">Get started</span>
              <h2 className="display dashboard-activation-title">
                Activate your dashboard
              </h2>
              <p className="dashboard-activation-dek">
                Three quick steps to make Fader &amp; Knob feel like yours.
              </p>
            </div>
            <span className="dashboard-activation-progress">
              {activationDone}/{activationSteps.length}
            </span>
          </header>
          <ul className="dashboard-activation-list">
            {activationSteps.map((step) => (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className={`dashboard-activation-step ${step.done ? "is-done" : ""}`}
                >
                  <span className="dashboard-activation-mark" aria-hidden>
                    {step.done ? "●" : "○"}
                  </span>
                  <span className="dashboard-activation-label">{step.label}</span>
                  {!step.done && (
                    <span className="dashboard-activation-cta">Start →</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Saved rail */}
      {savedRecipes.length > 0 ? (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">Your library</span>
              <h2 className="display">Saved recipes</h2>
            </div>
            <Link href="/dashboard/saved" className="dashboard-section-all">
              See all →
            </Link>
          </header>
          <div className="dashboard-rail">
            {savedRecipes.slice(0, 6).map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={(i % 6) + 1} />
            ))}
          </div>
        </section>
      ) : hydrated && !showActivation ? (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">Your library</span>
              <h2 className="display">Saved recipes</h2>
            </div>
          </header>
          <div className="dashboard-empty">
            <p>You haven&apos;t saved any recipes yet.</p>
            <p className="dashboard-empty-hint">
              Tap the heart on any recipe to keep it here.
            </p>
          </div>
        </section>
      ) : null}

      {/* Matches your rig */}
      {primaryPlatform && rigMatchRecipes.length > 0 && (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">Personalized</span>
              <h2 className="display">
                Matches your{" "}
                {PLATFORM_LABELS[primaryPlatform] ?? primaryPlatform}
              </h2>
              <p className="dashboard-section-dek">
                Recipes with translations ready for your rig.
              </p>
            </div>
            <Link
              href={`/platforms/${primaryPlatform}`}
              className="dashboard-section-all"
            >
              See all →
            </Link>
          </header>
          <div className="dashboard-rail">
            {rigMatchRecipes.slice(0, 6).map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={((i + 3) % 6) + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recentRecipes.length > 1 && (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">Jump back in</span>
              <h2 className="display">Recently viewed</h2>
            </div>
          </header>
          <div className="dashboard-rail">
            {recentRecipes.slice(1, 7).map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={((i + 2) % 6) + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Starter picks for empty users */}
      {hydrated && savedRecipes.length === 0 && recentRecipes.length === 0 && (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">Editors&apos; picks</span>
              <h2 className="display">Start with these</h2>
              <p className="dashboard-section-dek">
                Iconic tones to bookmark and build from.
              </p>
            </div>
            <Link href="/browse" className="dashboard-section-all">
              Browse all →
            </Link>
          </header>
          <div className="dashboard-rail">
            {starterPicks.map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={(i % 6) + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Account stats strip */}
      <section className="dashboard-section dashboard-stats-section">
        <header className="dashboard-section-head">
          <div>
            <span className="dashboard-eyebrow">Your account</span>
          </div>
        </header>
        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="dashboard-stat">
              <span className="dashboard-stat-label">{stat.label}</span>
              <span
                className={`dashboard-stat-value ${stat.highlight ? "is-paid" : ""}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade banner — free tier only */}
      {!isPaid && hydrated && (
        <section className="dashboard-upgrade">
          <div>
            <h3 className="display dashboard-upgrade-title">
              Unlock unlimited preset downloads
            </h3>
            <p className="dashboard-upgrade-dek">
              Tone Pass is $7/mo. Cancel anytime.
            </p>
          </div>
          <Link href="/pricing" className="hero-cta hero-cta-primary">
            Upgrade
          </Link>
        </section>
      )}

      {/* Quick actions */}
      <section className="dashboard-section">
        <header className="dashboard-section-head">
          <div>
            <span className="dashboard-eyebrow">Quick actions</span>
          </div>
        </header>
        <div className="dashboard-quick-actions">
          {[
            { label: "Browse tones", href: "/browse" },
            { label: "My gear", href: "/dashboard/my-gear" },
            { label: "Settings", href: "/dashboard/settings" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="dashboard-quick-action">
              <span>{label}</span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
