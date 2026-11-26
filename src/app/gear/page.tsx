import Link from "next/link";
import { gearItems, toneRecipes } from "@/lib/data";
import type { Metadata } from "next";
import { Guitar, Zap, Volume2, Speaker, Mic } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/gear" },
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
    label: "Effects pedals",
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
  { sub: "reverb_spring", label: "Spring reverb" },
];

function GearCard({ gear }: { gear: (typeof gearItems)[number] }) {
  const count = recipeCount(gear.slug);
  return (
    <Link
      href={`/gear/${gear.slug}`}
      className="group flex rounded-xl border border-[var(--ink)]/15 bg-[var(--paper-2)] transition-all hover:border-[var(--ink)]/40 hover:bg-[var(--paper)]"
    >
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-[var(--ink-muted)]">{gear.manufacturer}</p>
        <h3 className="mt-0.5 text-base font-semibold text-[var(--ink)] group-hover:underline">
          {gear.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--ink-muted)]">
          {gear.description}
        </p>
        <div className="mt-3 flex items-center gap-3">
          {gear.modeler_equivalents && Object.keys(gear.modeler_equivalents).length > 0 && (
            <span className="text-xs text-[var(--ink-muted)]">
              {Object.keys(gear.modeler_equivalents).length} platforms
            </span>
          )}
          {count > 0 && (
            <span className="text-xs text-[var(--ink-muted)]">
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
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 fkx-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <div className="mb-12">
        <h1 className="page-title page-title-md">Gear database</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">
          Every pedal, amp, cab, and mic referenced in our tone recipes, with modeler equivalents across all major platforms.
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
              className="group flex items-center gap-4 rounded-xl border border-[var(--ink)]/15 bg-[var(--paper-2)] p-5 transition-all hover:border-[var(--ink)]/40 hover:bg-[var(--paper)]"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--fk-wash, #f6f6f4)" }}
              >
                <cat.icon className="h-6 w-6" style={{ color: "var(--fk-ink, #131416)" }} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-semibold text-[var(--ink)] group-hover:underline">
                  {cat.label}
                </h2>
                <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                  {items.length} items &middot; {cat.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Effects — grouped by subcategory */}
      <section id="effect" className="mb-16">
        <h2 className="mb-2 text-2xl font-bold">Effects pedals</h2>
        <p className="mb-8 text-sm text-[var(--ink-muted)]">
          The building blocks of every signal chain. Click any pedal to see its controls, modeler equivalents, and the recipes that use it.
        </p>

        {EFFECT_SUBCATEGORIES.map((sub) => {
          const items = gearItems.filter(
            (g) => g.type === "effect" && g.subcategory === sub.sub
          );
          if (items.length === 0) return null;
          return (
            <div key={sub.sub} className="mb-10">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--ink-muted)]">
                {sub.label}
                <span className="rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-[10px] font-medium">
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
            <p className="mb-8 text-sm text-[var(--ink-muted)]">
              {cat.type === "amp" &&
                "The heart of every tone. See exact settings and what each amp maps to on your modeler."}
              {cat.type === "guitar" &&
                "Pickup configuration and body type shape the raw signal before anything else in the chain."}
              {cat.type === "cabinet" &&
                "Speaker size, configuration, and voicing shape the final character of the tone."}
              {cat.type === "microphone" &&
                "Mic choice and placement are the last link in the chain. They determine what the audience actually hears."}
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
      <section className="rounded-2xl border border-[var(--ink)]/15 bg-[var(--paper-2)] p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold">
          See this gear in action.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[var(--ink-muted)]">
          Every piece of gear in this database is used in at least one tone. Browse the tones to see exact settings on your platform.
        </p>
        <div className="mt-6">
          <Link
            href="/browse"
            className="inline-block rounded-full bg-[var(--ink)] px-8 py-3 text-base font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
          >
            Browse the tones
          </Link>
        </div>
      </section>
    </div>
  );
}
