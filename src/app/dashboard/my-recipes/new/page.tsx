"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Plus, Trash2, GripVertical, ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type NodeCategory =
  | "guitar"
  | "effect"
  | "preamp"
  | "wet_effect"
  | "power_amp"
  | "cabinet"
  | "microphone";

interface SettingPair {
  key: string;
  value: string;
}

interface SignalChainNode {
  id: string;
  category: NodeCategory;
  gear_name: string;
  settings: SettingPair[];
}

interface GuitarSpecs {
  model_name: string;
  pickup_config: string;
  pickup_position: string;
  tuning: string;
  string_gauge: string;
  notable_mods: string;
}

const NODE_CATEGORIES: { value: NodeCategory; label: string }[] = [
  { value: "guitar", label: "Guitar" },
  { value: "effect", label: "Effect" },
  { value: "preamp", label: "Preamp" },
  { value: "wet_effect", label: "Wet Effect" },
  { value: "power_amp", label: "Power Amp" },
  { value: "cabinet", label: "Cabinet" },
  { value: "microphone", label: "Microphone" },
];

/* -------------------------------------------------------------------------- */
/*  Supabase client                                                           */
/* -------------------------------------------------------------------------- */

let _client: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

let nodeCounter = 0;
function newNodeId(): string {
  nodeCounter += 1;
  return `node-${Date.now()}-${nodeCounter}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function NewRecipePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [guitarSpecs, setGuitarSpecs] = useState<GuitarSpecs>({
    model_name: "",
    pickup_config: "",
    pickup_position: "",
    tuning: "",
    string_gauge: "",
    notable_mods: "",
  });

  const [signalChain, setSignalChain] = useState<SignalChainNode[]>([
    {
      id: newNodeId(),
      category: "guitar",
      gear_name: "",
      settings: [],
    },
  ]);

  /* ---- Auth guard -------------------------------------------------------- */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  /* ---- Signal chain management ------------------------------------------ */

  const addNode = useCallback(() => {
    setSignalChain((prev) => [
      ...prev,
      {
        id: newNodeId(),
        category: "effect",
        gear_name: "",
        settings: [],
      },
    ]);
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setSignalChain((prev) => prev.filter((n) => n.id !== nodeId));
  }, []);

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<SignalChainNode>) => {
      setSignalChain((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
      );
    },
    [],
  );

  const addSetting = useCallback((nodeId: string) => {
    setSignalChain((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, settings: [...n.settings, { key: "", value: "" }] }
          : n,
      ),
    );
  }, []);

  const removeSetting = useCallback((nodeId: string, index: number) => {
    setSignalChain((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, settings: n.settings.filter((_, i) => i !== index) }
          : n,
      ),
    );
  }, []);

  const updateSetting = useCallback(
    (nodeId: string, index: number, field: "key" | "value", val: string) => {
      setSignalChain((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                settings: n.settings.map((s, i) =>
                  i === index ? { ...s, [field]: val } : s,
                ),
              }
            : n,
        ),
      );
    },
    [],
  );

  /* ---- Submit ----------------------------------------------------------- */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!isSupabaseConfigured()) {
      setError("Database is not configured.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = getClient();

      const slug = slugify(title) + "-" + Date.now().toString(36);
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // Build signal chain object
      const chainData = signalChain
        .filter((n) => n.gear_name.trim())
        .map((n) => ({
          category: n.category,
          gear_name: n.gear_name,
          settings: Object.fromEntries(
            n.settings
              .filter((s) => s.key.trim())
              .map((s) => [s.key, s.value]),
          ),
        }));

      // Build guitar specs (only include non-empty fields)
      const specsData: Record<string, string> = {};
      for (const [key, value] of Object.entries(guitarSpecs)) {
        if (value.trim()) specsData[key] = value.trim();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from("user_recipes") as any)
        .insert({
          user_id: user.id,
          title: title.trim(),
          slug,
          description: description.trim() || null,
          guitar_specs: Object.keys(specsData).length > 0 ? specsData : null,
          signal_chain: { nodes: chainData },
          tags: parsedTags,
          status: "pending",
        });

      if (dbError) throw dbError;
      router.push("/dashboard/my-recipes");
    } catch {
      setError("Failed to submit recipe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Render ----------------------------------------------------------- */

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground">
        Submit a Tone Recipe
      </h1>
      <p className="mt-1 text-sm text-muted">
        Share your tone recipe with the community. It will be reviewed by a
        moderator before going live.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* ---- Basic Info ---- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Basic Info</h2>

          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Edge of Breakup Blues"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the tone you're going for..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="blues, clean, breakup (comma-separated)"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </section>

        {/* ---- Guitar Specs ---- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Guitar Specs
          </h2>
          <p className="text-sm text-muted">
            Describe the guitar used for this tone (all optional).
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["model_name", "Model Name", "e.g. Fender Stratocaster"],
                ["pickup_config", "Pickup Config", "e.g. SSS, HSH"],
                ["pickup_position", "Pickup Position", "e.g. Neck, Bridge"],
                ["tuning", "Tuning", "e.g. Standard, Drop D"],
                ["string_gauge", "String Gauge", "e.g. 10-46"],
                ["notable_mods", "Notable Mods", "e.g. Locking tuners"],
              ] as [keyof GuitarSpecs, string, string][]
            ).map(([key, label, placeholder]) => (
              <div key={key}>
                <label
                  htmlFor={`spec-${key}`}
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  {label}
                </label>
                <input
                  id={`spec-${key}`}
                  type="text"
                  value={guitarSpecs[key]}
                  onChange={(e) =>
                    setGuitarSpecs((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ---- Signal Chain ---- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Signal Chain
              </h2>
              <p className="text-sm text-muted">
                Build the signal chain from guitar to speaker.
              </p>
            </div>
            <button
              type="button"
              onClick={addNode}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Node
            </button>
          </div>

          <div className="space-y-3">
            {signalChain.map((node, nodeIndex) => (
              <div
                key={node.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted" />

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex gap-3">
                      {/* Category */}
                      <div className="relative w-40 shrink-0">
                        <select
                          value={node.category}
                          onChange={(e) =>
                            updateNode(node.id, {
                              category: e.target.value as NodeCategory,
                            })
                          }
                          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          {NODE_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      </div>

                      {/* Gear name */}
                      <input
                        type="text"
                        value={node.gear_name}
                        onChange={(e) =>
                          updateNode(node.id, { gear_name: e.target.value })
                        }
                        placeholder="Gear name..."
                        className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Settings key-value pairs */}
                    {node.settings.length > 0 && (
                      <div className="space-y-2">
                        {node.settings.map((setting, settingIndex) => (
                          <div
                            key={settingIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={setting.key}
                              onChange={(e) =>
                                updateSetting(
                                  node.id,
                                  settingIndex,
                                  "key",
                                  e.target.value,
                                )
                              }
                              placeholder="Parameter"
                              className="w-1/3 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <input
                              type="text"
                              value={setting.value}
                              onChange={(e) =>
                                updateSetting(
                                  node.id,
                                  settingIndex,
                                  "value",
                                  e.target.value,
                                )
                              }
                              placeholder="Value"
                              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeSetting(node.id, settingIndex)
                              }
                              className="shrink-0 rounded p-1 text-muted transition-colors hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => addSetting(node.id)}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      + Add Setting
                    </button>
                  </div>

                  {/* Remove node */}
                  {signalChain.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNode(node.id)}
                      className="shrink-0 rounded p-1.5 text-muted transition-colors hover:text-red-400"
                      title="Remove node"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Chain connector */}
                {nodeIndex < signalChain.length - 1 && (
                  <div className="mt-3 flex justify-center">
                    <div className="h-4 w-px bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---- Error & Submit ---- */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for Review"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/my-recipes")}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
