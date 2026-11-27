import Link from "next/link";
import type { Metadata } from "next";
import { gearItems, toneRecipes } from "@/lib/data";
import Gear from "@/components/gear/Gear";
import { drawingFor } from "@/lib/gear/gear-drawing";
import { guitarSrc } from "@/lib/gear/guitars";
import type { GearItem } from "@/types/recipe";

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

/** How many recipes put each gear slug in their chain. */
const USE_COUNT = (() => {
  const m = new Map<string, number>();
  for (const r of toneRecipes) {
    const seen = new Set<string>();
    for (const n of r.signal_chain ?? []) {
      if (n.gear_slug && !seen.has(n.gear_slug)) {
        seen.add(n.gear_slug);
        m.set(n.gear_slug, (m.get(n.gear_slug) ?? 0) + 1);
      }
    }
  }
  return m;
})();
const uses = (slug: string) => USE_COUNT.get(slug) ?? 0;

const SECTIONS: { type: GearItem["type"]; id: string; label: string; blurb: string }[] = [
  { type: "effect", id: "pedals", label: "Pedals", blurb: "Drives, fuzzes, modulation, delay and the rest of the board." },
  { type: "amp", id: "amps", label: "Amps", blurb: "The heart of every tone, and what each one is called on your modeler." },
  { type: "cabinet", id: "cabs", label: "Cabinets", blurb: "Speaker size and voicing shape the final character." },
  { type: "microphone", id: "mics", label: "Microphones", blurb: "The last link in the chain: what the audience actually hears." },
  { type: "guitar", id: "guitars", label: "Guitars", blurb: "The instruments behind the tones." },
];

/** "overdrive" → "Overdrive", "reverb_spring" → "Spring reverb". */
function subLabel(gear: GearItem): string {
  const sub = gear.subcategory;
  if (!sub) {
    return { amp: "Amp", cabinet: "Cabinet", microphone: "Mic", guitar: "Guitar", effect: "Pedal" }[gear.type];
  }
  const words = sub.split("_");
  const ordered = words.length > 1 ? [...words.slice(1), words[0]] : words;
  const s = ordered.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Most-used first, then by name. */
const byUse = (a: GearItem, b: GearItem) => uses(b.slug) - uses(a.slug) || a.name.localeCompare(b.name);

function GearArt({ gear, height }: { gear: GearItem; height: number }) {
  const d = drawingFor(gear);
  if (!d) return null;
  if (d.type === "guitar") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={guitarSrc(d.guitar)} alt="" className="fkg-guitar" loading="lazy" />;
  }
  return (
    <Gear
      kind={d.pick.kind}
      height={height}
      vals={d.pick.vals}
      title={d.pick.title}
      disp={d.pick.disp}
      color={d.pick.color}
      label=""
    />
  );
}

function GearCard({ gear }: { gear: GearItem }) {
  const n = uses(gear.slug);
  return (
    <Link href={`/gear/${gear.slug}`} className="fk-card fkg-card">
      <div className="fk-card-art is-wide fkg-art" aria-hidden="true">
        <GearArt gear={gear} height={120} />
      </div>
      <div className="fk-card-body">
        <p className="fk-caption">{subLabel(gear)}</p>
        <h3 className="fk-t3">{gear.name}</h3>
        {n > 0 && <p className="fk-card-meta">{n === 1 ? "In 1 tone" : `In ${n} tones`}</p>}
      </div>
    </Link>
  );
}

export default function GearBrowsePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gear Database",
    description: "Browse guitars, effects pedals, amps, cabinets, and microphones used in our tone recipes.",
    url: "https://faderandknob.com/gear",
    isPartOf: { "@type": "WebSite", name: "Fader & Knob", url: "https://faderandknob.com" },
  };

  // The board up top: the most-used piece of each kind, left to right in
  // signal order, so the page opens on a picture of a rig.
  // Guitars carry no use counts, so the board opens on the Strat.
  const rig = (["guitar", "effect", "amp", "cabinet", "microphone"] as const)
    .map((t) =>
      t === "guitar"
        ? (gearItems.find((g) => g.slug === "fender-stratocaster") ?? gearItems.filter((g) => g.type === t).sort(byUse)[0])
        : gearItems.filter((g) => g.type === t).sort(byUse)[0],
    )
    .filter(Boolean);
  const mostUsed = [...gearItems].filter((g) => g.type !== "guitar").sort(byUse).slice(0, 4);

  return (
    <div className="fk-wrap fkp-page fkg-page">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Gear</span>
      </nav>

      <header className="fkg-head">
        <h1 className="fk-display">Gear</h1>
        <p className="fk-lead fkp-measure">
          Every guitar, pedal, amp, cab and mic behind our tones, and what each one is called on your modeler.
        </p>
        <nav aria-label="Gear types" className="fk-chips">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="fk-chip">
              {s.label} <span className="fkg-count">{gearItems.filter((g) => g.type === s.type).length}</span>
            </a>
          ))}
        </nav>
      </header>

      <ol className="fkg-rig" aria-label="A rig from the database, guitar to mic">
        {rig.map((g) => (
          <li key={g.slug}>
            <Link href={`/gear/${g.slug}`} className="fkg-rig-item">
              <span className="fkg-rig-art" aria-hidden="true">
                <GearArt gear={g} height={130} />
              </span>
              <span className="fk-caption">{subLabel(g)}</span>
              <span className="fk-label">{g.name}</span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="fkp-section" aria-labelledby="most-used">
        <h2 id="most-used" className="fk-t2">Most used</h2>
        <div className="fk-card-grid">
          {mostUsed.map((g) => (
            <GearCard key={g.slug} gear={g} />
          ))}
        </div>
      </section>

      {SECTIONS.map((s) => {
        const items = gearItems.filter((g) => g.type === s.type).sort(byUse);
        if (items.length === 0) return null;
        return (
          <section key={s.id} id={s.id} className="fkp-section fkg-section" aria-labelledby={`${s.id}-head`}>
            <div className="fkg-section-head">
              <h2 id={`${s.id}-head`} className="fk-t2">{s.label}</h2>
              <p className="fk-body fkp-muted">{s.blurb}</p>
            </div>
            <div className="fk-card-grid">
              {items.map((g) => (
                <GearCard key={g.slug} gear={g} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="fkp-section">
        <div className="fk-tile fkp-buy fkg-cta">
          <h2 className="fk-t2">See this gear in action</h2>
          <p className="fk-body fkp-measure">
            Every piece here is in at least one tone. Browse the tones to see the exact settings on your rig.
          </p>
          <div>
            <Link href="/browse" className="fk-btn">Browse the tones</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
