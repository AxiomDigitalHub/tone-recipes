"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";

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
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

interface UserSettings {
  displayName: string;
  primaryPlatform: string;
}

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* empty */
  }
  return { displayName: "", primaryPlatform: "" };
}

function saveSettings(settings: UserSettings) {
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
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    setDisplayName(
      settings.displayName || user?.displayName || user?.email?.split("@")[0] || "",
    );
    setPrimaryPlatform(settings.primaryPlatform || "");
  }, [user]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveSettings({ displayName, primaryPlatform });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
    </div>
  );
}
