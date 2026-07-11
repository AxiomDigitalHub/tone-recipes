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
  { value: "pedalboard", label: "Pedalboard" },
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
  // Paid = a subscription tier (drives "Manage subscription" vs "Upgrade").
  // Was a stale premium/creator check, which wrongly showed Pass/Pro users
  // the Upgrade button. Admin roles aren't subscribers → treated as unpaid.
  const PAID_TIERS = new Set(["pass", "pro", "premium", "creator"]);
  const isPaid = user ? PAID_TIERS.has(user.role) : false;
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
        <h1 className="page-title page-title-sm">Settings</h1>
        <p className="dashboard-inner-dek">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title page-title-sm">Settings</h1>
      <p className="dashboard-inner-dek">
        Manage your profile and preferences.
      </p>

      {/* Profile */}
      <section className="dashboard-section">
        <header className="dashboard-section-head">
          <div>
            <h2 className="display">Profile</h2>
          </div>
        </header>
        <form onSubmit={handleSave} className="auth-form dashboard-inner-form">
          <div className="auth-field">
            <label htmlFor="displayName" className="auth-label">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="auth-input"
              placeholder="Your name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="auth-input"
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
            <p className="auth-hint">Email can&apos;t be changed here.</p>
          </div>

          <div className="auth-field">
            <label htmlFor="primaryPlatform" className="auth-label">
              Primary platform
            </label>
            <select
              id="primaryPlatform"
              value={primaryPlatform}
              onChange={(e) => setPrimaryPlatform(e.target.value)}
              className="auth-input"
            >
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="auth-hint">
              We&apos;ll default to translations for this platform.
            </p>
          </div>

          <div className="dashboard-inner-form-actions">
            <button
              type="submit"
              className="hero-cta hero-cta-primary auth-submit"
            >
              Save changes
            </button>
            {saved && (
              <span className="dashboard-inner-form-saved">Settings saved</span>
            )}
          </div>
        </form>
      </section>

      {/* Billing */}
      <section className="dashboard-section">
        <header className="dashboard-section-head">
          <div>
            <h2 className="display">Billing</h2>
            <p className="dashboard-section-dek">
              Manage your subscription, payment method, and invoices.
            </p>
          </div>
        </header>
        <div className="dashboard-paper-card">
          <div className="dashboard-paper-card-row">
            <div>
              <span className="dashboard-eyebrow">Current plan</span>
              <div className="dashboard-paper-plan">
                <span
                  className={`dashboard-paper-plan-name ${isPaid ? "is-paid" : ""}`}
                >
                  {tierLabel}
                </span>
                {billingRefreshing && (
                  <span
                    className="dashboard-paper-spinner"
                    aria-label="Refreshing subscription status"
                  />
                )}
              </div>
              {tierPrice !== null && (
                <p className="dashboard-paper-plan-price">
                  ${tierPrice}/month
                </p>
              )}
              {billingRefreshing && (
                <p className="dashboard-paper-plan-note">
                  Syncing latest subscription status…
                </p>
              )}
            </div>
            {isPaid ? (
              <ManageBillingButton />
            ) : (
              <Link
                href="/pricing"
                className="hero-cta hero-cta-primary"
              >
                Upgrade
              </Link>
            )}
          </div>
          {isPaid && (
            <p className="dashboard-paper-card-foot">
              Click &quot;Manage Subscription&quot; to cancel, update your
              payment method, change your plan, or download invoices.
              Cancellations take effect at the end of your current billing
              period.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
