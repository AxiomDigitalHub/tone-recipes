"use client";

import { useEffect, useState, useCallback } from "react";

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

const TYPE_BADGE_CLASSES: Record<GearType, string> = {
  guitar: "bg-amber-500/20 text-amber-400",
  effect: "bg-emerald-500/20 text-emerald-400",
  amp: "bg-red-500/20 text-red-400",
  cabinet: "bg-purple-500/20 text-purple-400",
  microphone: "bg-gray-500/20 text-gray-400",
  modeler: "bg-blue-500/20 text-blue-400",
};

const STORAGE_KEY = "tone-recipes-user-gear";

function loadGear(): GearItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGear(gear: GearItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gear));
}

export default function MyGearPage() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<GearType>("guitar");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setGear(loadGear());
    setHydrated(true);
  }, []);

  const addGear = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newItem: GearItem = {
      id: crypto.randomUUID(),
      name: trimmed,
      type,
      notes: notes.trim(),
    };

    const updated = [...gear, newItem];
    setGear(updated);
    saveGear(updated);
    setName("");
    setNotes("");
  }, [name, type, notes, gear]);

  const removeGear = useCallback(
    (id: string) => {
      const updated = gear.filter((g) => g.id !== id);
      setGear(updated);
      saveGear(updated);
    },
    [gear]
  );

  const grouped = GEAR_TYPES.reduce(
    (acc, t) => {
      const items = gear.filter((g) => g.type === t);
      if (items.length > 0) acc[t] = items;
      return acc;
    },
    {} as Partial<Record<GearType, GearItem[]>>
  );

  const groupKeys = Object.keys(grouped) as GearType[];

  if (!hydrated) {
    return (
      <div>
        <h1 className="text-2xl font-bold">My Gear</h1>
        <p className="mt-2 text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Gear</h1>
      <p className="mt-2 text-muted">
        Manage your guitars, pedals, amps, and modelers.
      </p>

      {/* Add Gear Form */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Add Gear</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="gear-name"
              className="mb-1.5 block text-sm font-medium text-muted"
            >
              Gear Name
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="gear-type"
              className="mb-1.5 block text-sm font-medium text-muted"
            >
              Type
            </label>
            <select
              id="gear-type"
              value={type}
              onChange={(e) => setType(e.target.value as GearType)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {GEAR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="gear-notes"
              className="mb-1.5 block text-sm font-medium text-muted"
            >
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
        <button
          onClick={addGear}
          disabled={!name.trim()}
          className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to My Gear
        </button>
      </div>

      {/* Gear List */}
      {gear.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <svg
            className="mb-6 h-16 w-16 text-border"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-lg font-medium text-muted">No gear added yet</p>
          <p className="mt-2 max-w-md text-sm text-muted">
            Add your guitars, pedals, amps, and modelers to personalize your
            experience.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {groupKeys.map((gType) => (
            <section key={gType}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                {TYPE_LABELS[gType]}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {grouped[gType]!.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start justify-between rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {item.name}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASSES[gType]}`}
                        >
                          {gType}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="mt-1 truncate text-sm text-muted">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeGear(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="ml-3 shrink-0 rounded-lg p-1 text-muted opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
