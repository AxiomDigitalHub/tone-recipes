"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getProfile, updateProfile } from "@/lib/db/profile";
import { TIERS } from "@/lib/permissions";
import ManageBillingButton from "@/components/checkout/ManageBillingButton";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "tone-recipes-user-settings";

const PLATFORM_OPTIONS = [
  { value: "", label: "Select a platform" },
  { value: "helix", label: "Helix" },
  { value: "quad_cortex", label: "Quad Cortex" },
  { value: "tonex", label: "TONEX" },
  { value: "fractal", label: "Fractal" },
  { value: "kemper", label: "Kemper" },
  { value: "katana", label: "Boss Katana" },
  { value: "physical", label: "Physical" },
] as const;

/* -------------------------------------------------------------------------- */
/*  localStorage fallback helpers                                             */
/* -------------------------------------------------------------------------- */

interface UserSettings {
  displayName: string;
  primaryPlatform: string;
}

function loadSettingsFromStorage(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* empty */
  }
  return { displayName: "", primaryPlatform: "" };
}

function saveSettingsToStorage(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* empty */
  }
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function DashboardSettingsPage() {
  const { user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [billingRefreshing, setBillingRefreshing] = useState(false);

  const tierLabel = user ? TIERS[user.role]?.label ?? "Free" : "Free";
  const isPaid = user?.role === "premium" || user?.role === "creator";
  const tierPrice = user ? TIERS[user.role]?.price : null;

  // Detect ?billing_updated=true in the URL — user just came back from
  // Stripe Customer Portal. Poll refreshProfile a few times (webhook can lag
  // by a few seconds), then clean up the query param.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("billing_updated") !== "true") return;

    let cancelled = false;
    setBillingRefreshing(true);

    (async () => {
      // Poll up to 5 times with a 1s gap — webhook usually fires within 1-2s
      for (let i = 0; i < 5; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 1000));
        await refreshProfile();
      }
      if (!cancelled) {
        setBillingRefreshing(false);
        // Remove the query param so a refresh doesn't loop
        const url = new URL(window.location.href);
        url.searchParams.delete("billing_updated");
        window.history.replaceState({}, "", url.toString());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const fallbackName = user?.displayName || user?.email?.split("@")[0] || "";

      if (isSupabaseConfigured() && user?.id) {
        const profile = await getProfile(user.id);
        if (!cancelled) {
          setDisplayName(profile?.display_name || fallbackName);
          setPrimaryPlatform(profile?.primary_platform || "");
          setLoading(false);
        }
      } else {
        const settings = loadSettingsFromStorage();
        if (!cancelled) {
          setDisplayName(settings.displayName || fallbackName);
          setPrimaryPlatform(settings.primaryPlatform || "");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (isSupabaseConfigured() && user?.id) {
      await updateProfile(user.id, {
        display_name: displayName,
        primary_platform: primaryPlatform,
      });
    }

    // Always keep localStorage in sync as a fallback
    saveSettingsToStorage({ displayName, primaryPlatform });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Manage your profile and preferences.
      </p>

      <form onSubmit={handleSave} className="mt-8 max-w-lg space-y-6">
        {/* Display name */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-foreground"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your name"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email ?? ""}
            readOnly
            className="mt-1.5 w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-muted cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-muted">
            Email cannot be changed here.
          </p>
        </div>

        {/* Primary platform */}
        <div>
          <label
            htmlFor="primaryPlatform"
            className="block text-sm font-medium text-foreground"
          >
            Primary Platform
          </label>
          <select
            id="primaryPlatform"
            value={primaryPlatform}
            onChange={(e) => setPrimaryPlatform(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {PLATFORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            We will default to showing translations for this platform.
          </p>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-400">
              Settings saved
            </span>
          )}
        </div>
      </form>

      {/* Billing section */}
      <div className="mt-12 max-w-lg border-t border-border pt-8">
        <h2 className="text-lg font-semibold text-foreground">Billing</h2>
        <p className="mt-1 text-sm text-muted">
          Manage your subscription, payment method, and invoices.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Current Plan
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className={`text-xl font-bold ${isPaid ? "text-accent" : "text-foreground"}`}>
                  {tierLabel}
                </p>
                {billingRefreshing && (
                  <span
                    className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent"
                    aria-label="Refreshing subscription status"
                  />
                )}
              </div>
              {tierPrice !== null && (
                <p className="mt-0.5 text-xs text-muted">${tierPrice}/month</p>
              )}
              {billingRefreshing && (
                <p className="mt-2 text-xs text-muted">
                  Syncing latest subscription status...
                </p>
              )}
            </div>
            {isPaid ? (
              <ManageBillingButton />
            ) : (
              <Link
                href="/pricing"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                Upgrade
              </Link>
            )}
          </div>

          {isPaid && (
            <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted">
              Click &quot;Manage Subscription&quot; to cancel, update your payment method,
              change your plan, or download invoices. Cancellations take effect at
              the end of your current billing period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
