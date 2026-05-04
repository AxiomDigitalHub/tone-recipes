"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import {
  getUserGear,
  addUserGear,
  deleteUserGear,
  type UserGearItem,
} from "@/lib/db/profile";

interface GearItem {
  id: string;
  name: string;
  type: string;
  notes: string;
}

const GEAR_TYPES = [
  "guitar",
  "effect",
  "amp",
  "cabinet",
  "microphone",
  "modeler",
] as const;

type GearType = (typeof GEAR_TYPES)[number];

const TYPE_LABELS: Record<GearType, string> = {
  guitar: "Guitars",
  effect: "Effects",
  amp: "Amps",
  cabinet: "Cabinets",
  microphone: "Microphones",
  modeler: "Modelers",
};

const TYPE_LABELS_SINGULAR: Record<GearType, string> = {
  guitar: "Guitar",
  effect: "Effect",
  amp: "Amp",
  cabinet: "Cabinet",
  microphone: "Mic",
  modeler: "Modeler",
};

const STORAGE_KEY = "tone-recipes-user-gear";

/* -------------------------------------------------------------------------- */
/*  localStorage fallback helpers                                             */
/* -------------------------------------------------------------------------- */

function loadGearFromStorage(): GearItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGearToStorage(gear: GearItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gear));
}

/* -------------------------------------------------------------------------- */
/*  Converters between local shape and Supabase shape                         */
/* -------------------------------------------------------------------------- */

function fromSupabase(item: UserGearItem): GearItem {
  return {
    id: item.id,
    name: item.gear_name,
    type: item.gear_type,
    notes: item.notes,
  };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function MyGearPage() {
  const { user } = useAuth();
  const [gear, setGear] = useState<GearItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<GearType>("guitar");
  const [notes, setNotes] = useState("");

  const useSupabase = isSupabaseConfigured() && !!user?.id;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (useSupabase) {
        const items = await getUserGear(user!.id);
        if (!cancelled) {
          setGear(items.map(fromSupabase));
          setHydrated(true);
        }
      } else {
        if (!cancelled) {
          setGear(loadGearFromStorage());
          setHydrated(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [useSupabase, user]);

  const addGear = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (useSupabase) {
      const created = await addUserGear(user!.id, {
        gear_name: trimmed,
        gear_type: type,
        notes: notes.trim(),
      });
      if (created) {
        setGear((prev) => [...prev, fromSupabase(created)]);
      }
    } else {
      const newItem: GearItem = {
        id: crypto.randomUUID(),
        name: trimmed,
        type,
        notes: notes.trim(),
      };
      const updated = [...gear, newItem];
      setGear(updated);
      saveGearToStorage(updated);
    }

    setName("");
    setNotes("");
  }, [name, type, notes, gear, useSupabase, user]);

  const removeGear = useCallback(
    async (id: string) => {
      if (useSupabase) {
        const ok = await deleteUserGear(id);
        if (ok) {
          setGear((prev) => prev.filter((g) => g.id !== id));
        }
      } else {
        const updated = gear.filter((g) => g.id !== id);
        setGear(updated);
        saveGearToStorage(updated);
      }
    },
    [gear, useSupabase],
  );

  const grouped = GEAR_TYPES.reduce(
    (acc, t) => {
      const items = gear.filter((g) => g.type === t);
      if (items.length > 0) acc[t] = items;
      return acc;
    },
    {} as Partial<Record<GearType, GearItem[]>>,
  );

  const groupKeys = Object.keys(grouped) as GearType[];

  if (!hydrated) {
    return (
      <div>
        <h1 className="page-title page-title-sm">My Gear</h1>
        <p className="dashboard-inner-dek">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title page-title-sm">My Gear</h1>
      <p className="dashboard-inner-dek">
        Your guitars, pedals, amps, and modelers.
      </p>

      {/* Add gear */}
      <section className="dashboard-section">
        <header className="dashboard-section-head">
          <div>
            <span className="dashboard-eyebrow">Add</span>
            <h2 className="display">Add a piece of gear</h2>
          </div>
        </header>
        <div className="dashboard-paper-card">
          <div className="dashboard-gear-form-grid">
            <div className="auth-field">
              <label htmlFor="gear-name" className="auth-label">
                Gear name
              </label>
              <input
                id="gear-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGear();
                }}
                placeholder="e.g. Fender Stratocaster"
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="gear-type" className="auth-label">
                Type
              </label>
              <select
                id="gear-type"
                value={type}
                onChange={(e) => setType(e.target.value as GearType)}
                className="auth-input"
              >
                {GEAR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS_SINGULAR[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="auth-field dashboard-gear-form-notes">
              <label htmlFor="gear-notes" className="auth-label">
                Notes (optional)
              </label>
              <input
                id="gear-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGear();
                }}
                placeholder="e.g. SSS pickups, maple neck"
                className="auth-input"
              />
            </div>
          </div>
          <div className="dashboard-inner-form-actions">
            <button
              type="button"
              onClick={addGear}
              disabled={!name.trim()}
              className="hero-cta hero-cta-primary"
            >
              Add to my gear
            </button>
          </div>
        </div>
      </section>

      {/* Gear list */}
      {gear.length === 0 ? (
        <section className="dashboard-section">
          <div className="dashboard-notif-empty">
            <p className="dashboard-notif-empty-title">No gear yet</p>
            <p className="dashboard-notif-empty-dek">
              Add a guitar, a pedal, an amp — anything you actually play.
              The rest of the site personalizes around what&apos;s here.
            </p>
          </div>
        </section>
      ) : (
        groupKeys.map((gType) => (
          <section key={gType} className="dashboard-section">
            <header className="dashboard-section-head">
              <div>
                <span className="dashboard-eyebrow">
                  {TYPE_LABELS[gType]}
                </span>
                <h2 className="display">{TYPE_LABELS[gType]}</h2>
              </div>
            </header>
            <ul className="dashboard-gear-list">
              {grouped[gType]!.map((item) => (
                <li key={item.id} className="dashboard-gear-row">
                  <div className="dashboard-gear-row-body">
                    <div className="dashboard-gear-row-top">
                      <span className="dashboard-gear-name">{item.name}</span>
                      <span className="dashboard-gear-type">
                        {TYPE_LABELS_SINGULAR[gType]}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="dashboard-gear-notes">
                        <em>{item.notes}</em>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGear(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="dashboard-gear-remove"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
