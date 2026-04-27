"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { songs as staticSongs, gearItems as staticGear } from "@/lib/data";
import { PLATFORMS, CHAIN_CATEGORIES } from "@/lib/constants";
import type {
  GuitarSpecs,
  SignalChainNode,
  OriginalGear,
  PlatformBlock,
  PlatformTranslation,
  Platform,
  ToneRecipe,
} from "@/types/recipe";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const STORAGE_KEY = "tone-recipes-admin-draft";

function loadDraft(): Partial<FormState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(state: FormState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  // Step 1 - basic info
  title: string;
  slug: string;
  description: string;
  tone_context: string;
  tags: string;
  sources: string;
  is_editorial: boolean;

  // Step 2 - song
  song_slug: string;

  // Step 3 - guitar specs
  guitar_specs: GuitarSpecs;

  // Step 4 - original gear summary
  original_gear: OriginalGear;

  // Step 5 - signal chain
  signal_chain: SignalChainNode[];

  // Step 6 - platform translations
  platform_translations: Record<string, { notes: string; chain_blocks: PlatformBlock[] }>;
}

const defaultGuitarSpecs: GuitarSpecs = {
  body_type: "solid",
  model_name: "",
  pickup_config: "SSS",
  pickup_position: "neck",
  string_count: 6,
  scale_length: "25.5",
  tuning: "standard",
  string_gauge: ".010-.046",
};

const defaultOriginalGear: OriginalGear = {
  guitar: "",
  effects: [],
  amp: "",
  cabinet: "",
  microphone: "",
};

function emptyFormState(): FormState {
  return {
    title: "",
    slug: "",
    description: "",
    tone_context: "full_song",
    tags: "",
    sources: "",
    is_editorial: true,
    song_slug: "",
    guitar_specs: { ...defaultGuitarSpecs },
    original_gear: { ...defaultOriginalGear },
    signal_chain: [],
    platform_translations: {},
  };
}

// ---------------------------------------------------------------------------
// Shared input styling
// ---------------------------------------------------------------------------

const inputCls =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-accent/50";
const selectCls = inputCls;
const labelCls = "block text-xs font-medium text-muted mb-1";
const btnSecondary =
  "rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover";
const btnDanger =
  "rounded-lg border border-red-800 bg-red-900/30 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/50";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const STEPS = [
  "Basic Info",
  "Song",
  "Guitar Specs",
  "Original Gear",
  "Signal Chain",
  "Platforms",
  "Review",
];

export default function NewRecipePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => {
    const draft = loadDraft();
    return draft ? { ...emptyFormState(), ...draft } : emptyFormState();
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const updateGuitarSpec = useCallback(
    <K extends keyof GuitarSpecs>(key: K, value: GuitarSpecs[K]) => {
      setForm((prev) => {
        const next = {
          ...prev,
          guitar_specs: { ...prev.guitar_specs, [key]: value },
        };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const updateOriginalGear = useCallback(
    <K extends keyof OriginalGear>(key: K, value: OriginalGear[K]) => {
      setForm((prev) => {
        const next = {
          ...prev,
          original_gear: { ...prev.original_gear, [key]: value },
        };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  // ---- Signal chain helpers ----
  const addNode = useCallback(() => {
    setForm((prev) => {
      const node: SignalChainNode = {
        position: prev.signal_chain.length + 1,
        category: "effect",
        subcategory: null,
        gear_slug: null,
        gear_name: "",
        icon_type: "boss_compact",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "",
      };
      const next = { ...prev, signal_chain: [...prev.signal_chain, node] };
      saveDraft(next);
      return next;
    });
  }, []);

  const updateNode = useCallback(
    (index: number, partial: Partial<SignalChainNode>) => {
      setForm((prev) => {
        const chain = [...prev.signal_chain];
        chain[index] = { ...chain[index], ...partial };
        const next = { ...prev, signal_chain: chain };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const removeNode = useCallback((index: number) => {
    setForm((prev) => {
      const chain = prev.signal_chain
        .filter((_, i) => i !== index)
        .map((n, i) => ({ ...n, position: i + 1 }));
      const next = { ...prev, signal_chain: chain };
      saveDraft(next);
      return next;
    });
  }, []);

  const moveNode = useCallback((index: number, dir: -1 | 1) => {
    setForm((prev) => {
      const chain = [...prev.signal_chain];
      const target = index + dir;
      if (target < 0 || target >= chain.length) return prev;
      [chain[index], chain[target]] = [chain[target], chain[index]];
      const reindexed = chain.map((n, i) => ({ ...n, position: i + 1 }));
      const next = { ...prev, signal_chain: reindexed };
      saveDraft(next);
      return next;
    });
  }, []);

  const updateNodeSetting = useCallback(
    (nodeIndex: number, key: string, value: string | number) => {
      setForm((prev) => {
        const chain = [...prev.signal_chain];
        chain[nodeIndex] = {
          ...chain[nodeIndex],
          settings: { ...chain[nodeIndex].settings, [key]: value },
        };
        const next = { ...prev, signal_chain: chain };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const removeNodeSetting = useCallback(
    (nodeIndex: number, key: string) => {
      setForm((prev) => {
        const chain = [...prev.signal_chain];
        const settings = { ...chain[nodeIndex].settings };
        delete settings[key];
        chain[nodeIndex] = { ...chain[nodeIndex], settings };
        const next = { ...prev, signal_chain: chain };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  // ---- Platform translation helpers ----
  const addPlatform = useCallback((platformId: string) => {
    setForm((prev) => {
      if (prev.platform_translations[platformId]) return prev;
      const next = {
        ...prev,
        platform_translations: {
          ...prev.platform_translations,
          [platformId]: { notes: "", chain_blocks: [] },
        },
      };
      saveDraft(next);
      return next;
    });
  }, []);

  const removePlatform = useCallback((platformId: string) => {
    setForm((prev) => {
      const translations = { ...prev.platform_translations };
      delete translations[platformId];
      const next = { ...prev, platform_translations: translations };
      saveDraft(next);
      return next;
    });
  }, []);

  const updatePlatformNotes = useCallback(
    (platformId: string, notes: string) => {
      setForm((prev) => {
        const translations = { ...prev.platform_translations };
        translations[platformId] = {
          ...translations[platformId],
          notes,
        };
        const next = { ...prev, platform_translations: translations };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const addPlatformBlock = useCallback((platformId: string) => {
    setForm((prev) => {
      const translations = { ...prev.platform_translations };
      const t = translations[platformId];
      if (!t) return prev;
      const block: PlatformBlock = {
        position: t.chain_blocks.length + 1,
        block_name: "",
        block_category: "",
        original_gear: "",
        settings: {},
        notes: "",
      };
      translations[platformId] = {
        ...t,
        chain_blocks: [...t.chain_blocks, block],
      };
      const next = { ...prev, platform_translations: translations };
      saveDraft(next);
      return next;
    });
  }, []);

  const updatePlatformBlock = useCallback(
    (platformId: string, blockIndex: number, partial: Partial<PlatformBlock>) => {
      setForm((prev) => {
        const translations = { ...prev.platform_translations };
        const t = translations[platformId];
        if (!t) return prev;
        const blocks = [...t.chain_blocks];
        blocks[blockIndex] = { ...blocks[blockIndex], ...partial };
        translations[platformId] = { ...t, chain_blocks: blocks };
        const next = { ...prev, platform_translations: translations };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const removePlatformBlock = useCallback(
    (platformId: string, blockIndex: number) => {
      setForm((prev) => {
        const translations = { ...prev.platform_translations };
        const t = translations[platformId];
        if (!t) return prev;
        const blocks = t.chain_blocks
          .filter((_, i) => i !== blockIndex)
          .map((b, i) => ({ ...b, position: i + 1 }));
        translations[platformId] = { ...t, chain_blocks: blocks };
        const next = { ...prev, platform_translations: translations };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  // ---- Build final recipe JSON ----
  const buildRecipeJson = useCallback((): ToneRecipe => {
    const platformTranslations: Partial<Record<Platform, PlatformTranslation>> = {};
    for (const [key, value] of Object.entries(form.platform_translations)) {
      platformTranslations[key as Platform] = {
        notes: value.notes,
        chain_blocks: value.chain_blocks,
      };
    }

    return {
      id: `seed-${form.slug || "untitled"}`,
      song_slug: form.song_slug,
      title: form.title,
      slug: form.slug,
      description: form.description,
      tone_context: form.tone_context,
      guitar_specs: form.guitar_specs,
      signal_chain: form.signal_chain,
      original_gear: form.original_gear,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sources: form.sources
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      platform_translations: platformTranslations,
      is_editorial: form.is_editorial,
      view_count: 0,
      rating_avg: 0,
      rating_count: 0,
    };
  }, [form]);

  const handleCopyJson = useCallback(() => {
    const json = JSON.stringify(buildRecipeJson(), null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }, [buildRecipeJson]);

  const handleSaveToLocalStorage = useCallback(() => {
    const recipe = buildRecipeJson();
    const stored = localStorage.getItem("tone-recipes-saved") || "[]";
    const arr = JSON.parse(stored);
    // Replace existing by slug or append
    const idx = arr.findIndex((r: ToneRecipe) => r.slug === recipe.slug);
    if (idx >= 0) arr[idx] = recipe;
    else arr.push(recipe);
    localStorage.setItem("tone-recipes-saved", JSON.stringify(arr));
    // Clear draft
    localStorage.removeItem(STORAGE_KEY);
    alert("Recipe saved to localStorage!");
  }, [buildRecipeJson]);

  const handleClearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setForm(emptyFormState());
    setStep(0);
  }, []);

  // ---- Populate from gear item ----
  const populateFromGear = useCallback(
    (index: number, gearSlug: string) => {
      const gear = staticGear.find((g) => g.slug === gearSlug);
      if (!gear) return;
      updateNode(index, {
        gear_slug: gear.slug,
        gear_name: gear.name,
        icon_type: gear.icon_type,
        icon_color: gear.icon_color,
        subcategory: gear.subcategory ?? null,
      });
    },
    [updateNode],
  );

  // ---- Render helpers ----
  function renderStepIndicator() {
    return (
      <div className="mb-8 flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              i === step
                ? "bg-accent text-background"
                : i < step
                  ? "bg-surface text-accent"
                  : "bg-surface text-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                i === step
                  ? "bg-background text-accent"
                  : i < step
                    ? "bg-accent/20 text-accent"
                    : "bg-border text-muted"
              }`}
            >
              {i < step ? "\u2713" : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  // ===== Step 1: Basic Info =====
  function renderStep1() {
    return (
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => {
              update("title", e.target.value);
              update("slug", slugify(e.target.value));
            }}
            placeholder="e.g. SRV's Pride and Joy Rhythm Tone"
          />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className={inputCls + " min-h-[100px]"}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe the tone and what makes it special..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tone Context</label>
            <select
              className={selectCls}
              value={form.tone_context}
              onChange={(e) => update("tone_context", e.target.value)}
            >
              <option value="full_song">Full Song</option>
              <option value="solo">Solo</option>
              <option value="rhythm">Rhythm</option>
              <option value="intro">Intro</option>
              <option value="verse">Verse</option>
              <option value="chorus">Chorus</option>
              <option value="bridge">Bridge</option>
              <option value="clean_section">Clean Section</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Editorial?</label>
            <label className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={form.is_editorial}
                onChange={(e) => update("is_editorial", e.target.checked)}
                className="h-4 w-4 rounded border-border bg-background accent-accent"
              />
              <span className="text-sm text-foreground">Mark as editorial content</span>
            </label>
          </div>
        </div>
        <div>
          <label className={labelCls}>Tags (comma-separated)</label>
          <input
            className={inputCls}
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="blues, overdrive, srv, texas-blues"
          />
        </div>
        <div>
          <label className={labelCls}>Sources (one URL per line)</label>
          <textarea
            className={inputCls + " min-h-[80px]"}
            value={form.sources}
            onChange={(e) => update("sources", e.target.value)}
            placeholder={"https://equipboard.com/...\nhttps://www.gilmourish.com/..."}
          />
        </div>
      </div>
    );
  }

  // ===== Step 2: Song =====
  function renderStep2() {
    return (
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Select Song</label>
          <select
            className={selectCls}
            value={form.song_slug}
            onChange={(e) => update("song_slug", e.target.value)}
          >
            <option value="">-- Choose a song --</option>
            {staticSongs.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title} ({s.album}, {s.year})
              </option>
            ))}
          </select>
        </div>
        {form.song_slug && (
          <div className="rounded-lg border border-border bg-surface p-4 text-sm">
            {(() => {
              const song = staticSongs.find((s) => s.slug === form.song_slug);
              if (!song) return null;
              return (
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{song.title}</p>
                  <p className="text-muted">
                    Album: {song.album} &middot; Year: {song.year} &middot;
                    Difficulty: {song.difficulty}
                  </p>
                  <p className="text-muted">
                    Genres: {song.genres.join(", ")}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  // ===== Step 3: Guitar Specs =====
  function renderStep3() {
    const gs = form.guitar_specs;
    return (
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Guitar Model Name</label>
          <input
            className={inputCls}
            value={gs.model_name}
            onChange={(e) => updateGuitarSpec("model_name", e.target.value)}
            placeholder="e.g. Fender Stratocaster #1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Body Type</label>
            <select
              className={selectCls}
              value={gs.body_type}
              onChange={(e) =>
                updateGuitarSpec(
                  "body_type",
                  e.target.value as GuitarSpecs["body_type"],
                )
              }
            >
              <option value="solid">Solid</option>
              <option value="semi_hollow">Semi-Hollow</option>
              <option value="hollow">Hollow</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Pickup Config</label>
            <select
              className={selectCls}
              value={gs.pickup_config}
              onChange={(e) =>
                updateGuitarSpec(
                  "pickup_config",
                  e.target.value as GuitarSpecs["pickup_config"],
                )
              }
            >
              {["SSS", "HSS", "HH", "HSH", "SS", "P90", "single"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Pickup Position</label>
            <input
              className={inputCls}
              value={gs.pickup_position}
              onChange={(e) =>
                updateGuitarSpec("pickup_position", e.target.value)
              }
              placeholder="e.g. neck, bridge, middle"
            />
          </div>
          <div>
            <label className={labelCls}>Tuning</label>
            <select
              className={selectCls}
              value={gs.tuning}
              onChange={(e) => updateGuitarSpec("tuning", e.target.value)}
            >
              {[
                "standard",
                "eb_standard",
                "d_standard",
                "drop_d",
                "drop_c",
                "open_g",
                "open_d",
                "open_e",
                "dadgad",
                "custom",
              ].map((v) => (
                <option key={v} value={v}>
                  {v.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>String Gauge</label>
            <input
              className={inputCls}
              value={gs.string_gauge}
              onChange={(e) =>
                updateGuitarSpec("string_gauge", e.target.value)
              }
              placeholder=".010-.046"
            />
          </div>
          <div>
            <label className={labelCls}>Scale Length</label>
            <input
              className={inputCls}
              value={gs.scale_length}
              onChange={(e) =>
                updateGuitarSpec("scale_length", e.target.value)
              }
              placeholder="25.5"
            />
          </div>
          <div>
            <label className={labelCls}>String Count</label>
            <input
              className={inputCls}
              type="number"
              value={gs.string_count}
              onChange={(e) =>
                updateGuitarSpec("string_count", parseInt(e.target.value) || 6)
              }
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Notable Mods</label>
          <textarea
            className={inputCls + " min-h-[60px]"}
            value={gs.notable_mods ?? ""}
            onChange={(e) =>
              updateGuitarSpec("notable_mods", e.target.value || undefined)
            }
            placeholder="Describe any modifications..."
          />
        </div>
      </div>
    );
  }

  // ===== Step 4: Original Gear =====
  function renderStep4() {
    const og = form.original_gear;
    return (
      <div className="space-y-5">
        <p className="text-sm text-muted">
          Provide a brief human-readable summary of the original gear used. The
          signal chain (next step) captures the detailed settings.
        </p>
        <div>
          <label className={labelCls}>Guitar</label>
          <input
            className={inputCls}
            value={og.guitar}
            onChange={(e) => updateOriginalGear("guitar", e.target.value)}
            placeholder="Fender Stratocaster #1 with .013-.058 strings"
          />
        </div>
        <div>
          <label className={labelCls}>Effects (comma-separated)</label>
          <input
            className={inputCls}
            value={og.effects.join(", ")}
            onChange={(e) =>
              updateOriginalGear(
                "effects",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder="Ibanez TS808, Boss DS-1"
          />
        </div>
        <div>
          <label className={labelCls}>Amp</label>
          <input
            className={inputCls}
            value={og.amp}
            onChange={(e) => updateOriginalGear("amp", e.target.value)}
            placeholder="Fender Vibroverb (1964 Blackface)"
          />
        </div>
        <div>
          <label className={labelCls}>Cabinet</label>
          <input
            className={inputCls}
            value={og.cabinet}
            onChange={(e) => updateOriginalGear("cabinet", e.target.value)}
            placeholder="Built-in 1x15 JBL D130F"
          />
        </div>
        <div>
          <label className={labelCls}>Microphone</label>
          <input
            className={inputCls}
            value={og.microphone}
            onChange={(e) => updateOriginalGear("microphone", e.target.value)}
            placeholder="Shure SM57"
          />
        </div>
        <div>
          <label className={labelCls}>Other Notes</label>
          <textarea
            className={inputCls + " min-h-[60px]"}
            value={og.other_notes ?? ""}
            onChange={(e) =>
              updateOriginalGear("other_notes", e.target.value || undefined)
            }
            placeholder="Any other relevant notes about the gear..."
          />
        </div>
      </div>
    );
  }

  // ===== Step 5: Signal Chain =====
  function renderStep5() {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Build the signal chain in order. Each node represents a piece of gear.
          </p>
          <button className={btnSecondary} onClick={addNode}>
            + Add Node
          </button>
        </div>

        {form.signal_chain.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted">
            No nodes yet. Click &quot;Add Node&quot; to start building the signal chain.
          </div>
        )}

        {form.signal_chain.map((node, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-accent">
                Node {node.position}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="rounded p-1 text-muted hover:text-foreground disabled:opacity-30"
                  onClick={() => moveNode(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  className="rounded p-1 text-muted hover:text-foreground disabled:opacity-30"
                  onClick={() => moveNode(i, 1)}
                  disabled={i === form.signal_chain.length - 1}
                  title="Move down"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  className={btnDanger + " ml-2"}
                  onClick={() => removeNode(i)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Gear Item (optional)</label>
                <select
                  className={selectCls}
                  value={node.gear_slug ?? ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      populateFromGear(i, e.target.value);
                    } else {
                      updateNode(i, { gear_slug: null });
                    }
                  }}
                >
                  <option value="">Custom / Manual</option>
                  {staticGear.map((g) => (
                    <option key={g.slug} value={g.slug}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Gear Name</label>
                <input
                  className={inputCls}
                  value={node.gear_name}
                  onChange={(e) => updateNode(i, { gear_name: e.target.value })}
                  placeholder="Pedal / Amp name"
                />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  className={selectCls}
                  value={node.category}
                  onChange={(e) =>
                    updateNode(i, {
                      category: e.target.value as SignalChainNode["category"],
                    })
                  }
                >
                  {CHAIN_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Subcategory</label>
                <input
                  className={inputCls}
                  value={node.subcategory ?? ""}
                  onChange={(e) =>
                    updateNode(i, {
                      subcategory: e.target.value || null,
                    })
                  }
                  placeholder="e.g. overdrive, fuzz, delay"
                />
              </div>
              <div>
                <label className={labelCls}>Icon Type</label>
                <input
                  className={inputCls}
                  value={node.icon_type}
                  onChange={(e) => updateNode(i, { icon_type: e.target.value })}
                  placeholder="boss_compact"
                />
              </div>
              <div>
                <label className={labelCls}>Icon Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={node.icon_color}
                    onChange={(e) =>
                      updateNode(i, { icon_color: e.target.value })
                    }
                    className="h-9 w-9 cursor-pointer rounded border border-border bg-background"
                  />
                  <input
                    className={inputCls}
                    value={node.icon_color}
                    onChange={(e) =>
                      updateNode(i, { icon_color: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={node.is_in_effects_loop}
                  onChange={(e) =>
                    updateNode(i, { is_in_effects_loop: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border bg-background accent-accent"
                />
                <span className="text-xs text-muted">In effects loop</span>
              </label>
            </div>

            {/* Settings key-value pairs */}
            <div className="mt-3">
              <label className={labelCls}>Settings</label>
              <div className="space-y-1">
                {Object.entries(node.settings).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      className={inputCls + " w-32"}
                      value={key}
                      readOnly
                    />
                    <input
                      className={inputCls + " w-32"}
                      value={typeof val === "boolean" ? String(val) : val}
                      onChange={(e) => {
                        const v = e.target.value;
                        updateNodeSetting(
                          i,
                          key,
                          isNaN(Number(v)) ? v : Number(v),
                        );
                      }}
                    />
                    <button
                      className="text-xs text-red-400 hover:text-red-300"
                      onClick={() => removeNodeSetting(i, key)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-1 text-xs text-accent hover:underline"
                onClick={() => {
                  const key = prompt("Setting name (e.g. Drive, Volume):");
                  if (key) updateNodeSetting(i, key, 5);
                }}
              >
                + Add setting
              </button>
            </div>

            <div className="mt-3">
              <label className={labelCls}>Notes</label>
              <textarea
                className={inputCls + " min-h-[50px]"}
                value={node.notes}
                onChange={(e) => updateNode(i, { notes: e.target.value })}
                placeholder="Explain why these settings work..."
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ===== Step 6: Platforms =====
  function renderStep6() {
    const activePlatforms = Object.keys(form.platform_translations);
    const availablePlatforms = PLATFORMS.filter(
      (p) => p.id !== "pedalboard" && !activePlatforms.includes(p.id),
    );

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Add platform:</span>
          {availablePlatforms.map((p) => (
            <button
              key={p.id}
              className={btnSecondary}
              onClick={() => addPlatform(p.id)}
            >
              + {p.label}
            </button>
          ))}
          {availablePlatforms.length === 0 && (
            <span className="text-xs text-muted">All platforms added</span>
          )}
        </div>

        {activePlatforms.map((platformId) => {
          const platform = PLATFORMS.find((p) => p.id === platformId);
          const translation = form.platform_translations[platformId];
          if (!translation) return null;

          return (
            <div
              key={platformId}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="text-sm font-bold"
                  style={{ color: platform?.color ?? "#a1a1aa" }}
                >
                  {platform?.label ?? platformId}
                </span>
                <button
                  className={btnDanger}
                  onClick={() => removePlatform(platformId)}
                >
                  Remove Platform
                </button>
              </div>

              <div className="mb-3">
                <label className={labelCls}>Platform Notes</label>
                <textarea
                  className={inputCls + " min-h-[50px]"}
                  value={translation.notes}
                  onChange={(e) =>
                    updatePlatformNotes(platformId, e.target.value)
                  }
                  placeholder="General notes about recreating this tone on this platform..."
                />
              </div>

              <div className="mb-2 flex items-center justify-between">
                <label className={labelCls}>Blocks</label>
                <button
                  className="text-xs text-accent hover:underline"
                  onClick={() => addPlatformBlock(platformId)}
                >
                  + Add Block
                </button>
              </div>

              {translation.chain_blocks.map((block, bi) => (
                <div
                  key={bi}
                  className="mb-2 rounded border border-border bg-background p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">
                      Block {block.position}
                    </span>
                    <button
                      className="text-xs text-red-400 hover:text-red-300"
                      onClick={() => removePlatformBlock(platformId, bi)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div>
                      <label className={labelCls}>Block Name</label>
                      <input
                        className={inputCls}
                        value={block.block_name}
                        onChange={(e) =>
                          updatePlatformBlock(platformId, bi, {
                            block_name: e.target.value,
                          })
                        }
                        placeholder="Scream 808"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <input
                        className={inputCls}
                        value={block.block_category}
                        onChange={(e) =>
                          updatePlatformBlock(platformId, bi, {
                            block_category: e.target.value,
                          })
                        }
                        placeholder="Distortion"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Original Gear</label>
                      <input
                        className={inputCls}
                        value={block.original_gear}
                        onChange={(e) =>
                          updatePlatformBlock(platformId, bi, {
                            original_gear: e.target.value,
                          })
                        }
                        placeholder="Ibanez TS808"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className={labelCls}>Notes</label>
                    <input
                      className={inputCls}
                      value={block.notes}
                      onChange={(e) =>
                        updatePlatformBlock(platformId, bi, {
                          notes: e.target.value,
                        })
                      }
                      placeholder="Where to find this block, tips..."
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // ===== Step 7: Review =====
  function renderStep7() {
    const recipe = buildRecipeJson();
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Recipe Summary
          </h3>
          <div className="space-y-1 text-sm text-muted">
            <p>
              <span className="text-foreground">Title:</span> {recipe.title || "(empty)"}
            </p>
            <p>
              <span className="text-foreground">Song:</span> {recipe.song_slug || "(none)"}
            </p>
            <p>
              <span className="text-foreground">Context:</span> {recipe.tone_context}
            </p>
            <p>
              <span className="text-foreground">Guitar:</span>{" "}
              {recipe.guitar_specs.model_name || "(empty)"}
            </p>
            <p>
              <span className="text-foreground">Signal Chain:</span>{" "}
              {recipe.signal_chain.length} node(s)
            </p>
            <p>
              <span className="text-foreground">Platforms:</span>{" "}
              {Object.keys(recipe.platform_translations).join(", ") || "(none)"}
            </p>
            <p>
              <span className="text-foreground">Tags:</span>{" "}
              {recipe.tags.join(", ") || "(none)"}
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>JSON Preview</label>
          <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-background p-3 text-xs text-muted">
            {JSON.stringify(recipe, null, 2)}
          </pre>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            onClick={handleSaveToLocalStorage}
          >
            Save to localStorage
          </button>
          <button
            className={btnSecondary}
            onClick={handleCopyJson}
          >
            {copySuccess ? "Copied!" : "Copy JSON"}
          </button>
          <button
            className={btnDanger}
            onClick={handleClearDraft}
          >
            Clear Draft
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/recipes"
          className="text-sm text-muted hover:text-foreground"
        >
          &larr; Back to Recipes
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-foreground">New Recipe</h1>
      <p className="mb-6 text-sm text-muted">
        Fill out each step, then copy the JSON or save to localStorage.
      </p>

      {renderStepIndicator()}

      <div className="rounded-lg border border-border bg-surface/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {STEPS[step]}
        </h2>

        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}
        {step === 2 && renderStep3()}
        {step === 3 && renderStep4()}
        {step === 4 && renderStep5()}
        {step === 5 && renderStep6()}
        {step === 6 && renderStep7()}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          className={btnSecondary}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          &larr; Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next &rarr;
          </button>
        ) : (
          <span className="text-xs text-muted">
            Use the buttons above to save or copy.
          </span>
        )}
      </div>
    </div>
  );
}
