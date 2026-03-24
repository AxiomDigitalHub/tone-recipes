import Link from "next/link";
import { gearItems } from "@/lib/data";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gear Database",
  description:
    "Browse guitars, effects pedals, amps, cabinets, and microphones used in our tone recipes. Compare real gear to modeler equivalents.",
  openGraph: {
    title: "Gear Database | ToneRecipes",
    description:
      "Browse guitars, effects pedals, amps, cabinets, and microphones used in our tone recipes.",
    type: "website",
  },
  keywords: ["guitar gear", "effects pedals", "amps", "cabinets", "microphones", "modeler equivalents"],
};

const TYPE_ORDER: Array<{
  type: string;
  label: string;
}> = [
  { type: "guitar", label: "Guitars" },
  { type: "effect", label: "Effects" },
  { type: "amp", label: "Amps" },
  { type: "cabinet", label: "Cabinets" },
  { type: "microphone", label: "Microphones" },
];

function getTypeLabel(gear: { type: string; subcategory?: string }): string {
  const typeLabels: Record<string, string> = {
    guitar: "Guitar",
    effect: "Effect",
    amp: "Amp",
    cabinet: "Cabinet",
    microphone: "Microphone",
  };
  const base = typeLabels[gear.type] || gear.type;
  if (gear.subcategory) {
    const sub =
      gear.subcategory.charAt(0).toUpperCase() + gear.subcategory.slice(1);
    return `${base} - ${sub}`;
  }
  return base;
}

export default function GearBrowsePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span>/</span>
        <span className="text-foreground">Gear</span>
      </nav>

      <h1 className="mb-12 text-3xl font-bold md:text-4xl">Gear Database</h1>

      {TYPE_ORDER.map((group) => {
        const items = gearItems.filter((g) => g.type === group.type);
        if (items.length === 0) return null;

        return (
          <section key={group.type} className="mb-14">
            <h2 className="mb-6 text-xl font-bold">{group.label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((gear) => (
                <Link
                  key={gear.slug}
                  href={`/gear/${gear.slug}`}
                  className="group flex rounded-xl border border-border bg-surface transition-all hover:border-accent/40 hover:bg-surface-hover"
                  style={{ borderLeftWidth: "4px", borderLeftColor: gear.icon_color }}
                >
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-accent">
                      {gear.manufacturer}
                    </p>
                    <h3 className="mt-0.5 text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                      {gear.name}
                    </h3>
                    <div className="mt-2">
                      <Badge>{getTypeLabel(gear)}</Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
                      {gear.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
