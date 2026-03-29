import Link from "next/link";
import { gearItems, toneRecipes } from "@/lib/data";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";
import { Guitar, Zap, Volume2, Speaker, Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Gear Database",
  description:
    "Browse guitars, effects pedals, amps, cabinets, and microphones used in our tone recipes. See modeler equivalents across Helix, Quad Cortex, TONEX, and more.",
  openGraph: {
    title: "Gear Database | Fader & Knob",
    description:
      "Browse guitars, effects pedals, amps, cabinets, and microphones used in our tone recipes.",
    type: "website",
  },
  keywords: ["guitar gear", "effects pedals", "amps", "cabinets", "microphones", "modeler equivalents"],
};

/** Count how many recipes reference a given gear slug */
function recipeCount(slug: string): number {
  return toneRecipes.filter((r) =>
    r.signal_chain.some((n) => n.gear_slug === slug)
  ).length;
}

const CATEGORIES = [
  {
    type: "effect",
    label: "Effects Pedals",
    description: "Drive, modulation, delay, reverb, and more",
    icon: Zap,
    color: "#22c55e",
  },
  {
    type: "amp",
    label: "Amps",
    description: "Fender, Marshall, Vox, Mesa, and beyond",
    icon: Volume2,
    color: "#ef4444",
  },
  {
    type: "guitar",
    label: "Guitars",
    description: "The instruments behind the tones",
    icon: Guitar,
    color: "#f59e0b",
  },
  {
    type: "cabinet",
    label: "Cabinets",
    description: "Speaker configurations and voicings",
    icon: Speaker,
    color: "#a855f7",
  },
  {
    type: "microphone",
    label: "Microphones",
    description: "Mic choices that shape the final tone",
    icon: Mic,
    color: "#6b7280",
  },
] as const;

const EFFECT_SUBCATEGORIES: Array<{ sub: string; label: string }> = [
  { sub: "overdrive", label: "Overdrive" },
  { sub: "distortion", label: "Distortion" },
  { sub: "fuzz", label: "Fuzz" },
  { sub: "wah", label: "Wah" },
  { sub: "chorus", label: "Chorus" },
  { sub: "modulation", label: "Modulation" },
  { sub: "tremolo", label: "Tremolo" },
  { sub: "delay", label: "Delay" },
  { sub: "reverb", label: "Reverb" },
  { sub: "reverb_spring", label: "Spring Reverb" },
];

function GearCard({ gear }: { gear: (typeof gearItems)[number] }) {
  const count = recipeCount(gear.slug);
  return (
    <Link
      href={`/gear/${gear.slug}`}
      className="group flex rounded-xl border border-border bg-surface transition-all hover:border-accent/40 hover:bg-surface-hover"
      style={{ borderLeftWidth: "4px", borderLeftColor: gear.icon_color }}
    >
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-accent">{gear.manufacturer}</p>
        <h3 className="mt-0.5 text-base font-semibold text-foreground group-hover:text-accent transition-colors">
          {gear.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
          {gear.description}
        </p>
        <div className="mt-3 flex items-center gap-3">
          {gear.modeler_equivalents && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
              {Object.keys(gear.modeler_equivalents).length} platforms
            </span>
          )}
          {count > 0 && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
              {count} {count === 1 ? "recipe" : "recipes"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function GearBrowsePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Gear Database",
    "description": "Browse guitars, effects pedals, amps, cabinets, and microphones used in our tone recipes.",
    "url": "https://faderandknob.com/gear",
    "isPartOf": { "@type": "WebSite", "name": "Fader & Knob", "url": "https://faderandknob.com" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold md:text-4xl">Gear Database</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Every pedal, amp, cab, and mic referenced in our tone recipes — with modeler equivalents across all major platforms.
        </p>
      </div>

      {/* Category hero cards */}
      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const items = gearItems.filter((g) => g.type === cat.type);
          return (
            <a
              key={cat.type}
              href={`#${cat.type}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:bg-surface-hover"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: cat.color + "18" }}
              >
                <cat.icon className="h-6 w-6" style={{ color: cat.color }} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {cat.label}
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {items.length} items &middot; {cat.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Effects — grouped by subcategory */}
      <section id="effect" className="mb-16">
        <h2 className="mb-2 text-2xl font-bold">Effects Pedals</h2>
        <p className="mb-8 text-sm text-muted">
          The building blocks of every signal chain. Click any pedal to see its controls, modeler equivalents, and the recipes that use it.
        </p>

        {EFFECT_SUBCATEGORIES.map((sub) => {
          const items = gearItems.filter(
            (g) => g.type === "effect" && g.subcategory === sub.sub
          );
          if (items.length === 0) return null;
          return (
            <div key={sub.sub} className="mb-10">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
                {sub.label}
                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium">
                  {items.length}
                </span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((gear) => (
                  <GearCard key={gear.slug} gear={gear} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Non-effect categories */}
      {CATEGORIES.filter((c) => c.type !== "effect").map((cat) => {
        const items = gearItems.filter((g) => g.type === cat.type);
        if (items.length === 0) return null;

        return (
          <section key={cat.type} id={cat.type} className="mb-16">
            <h2 className="mb-2 text-2xl font-bold">{cat.label}</h2>
            <p className="mb-8 text-sm text-muted">
              {cat.type === "amp" &&
                "The heart of every tone. See exact settings and what each amp maps to on your modeler."}
              {cat.type === "guitar" &&
                "Pickup configuration and body type shape the raw signal before anything else in the chain."}
              {cat.type === "cabinet" &&
                "Speaker size, configuration, and voicing shape the final character of the tone."}
              {cat.type === "microphone" &&
                "Mic choice and placement are the last link in the chain — they determine what the audience actually hears."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((gear) => (
                <GearCard key={gear.slug} gear={gear} />
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA back to recipes */}
      <section className="rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold">
          See this gear in action.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Every piece of gear in this database is used in at least one tone recipe. Browse recipes to see exact settings on your platform.
        </p>
        <div className="mt-6">
          <Link
            href="/browse"
            className="inline-block rounded-xl bg-accent px-10 py-4 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Browse Recipes
          </Link>
        </div>
      </section>
    </div>
  );
}
