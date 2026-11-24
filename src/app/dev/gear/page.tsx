import type { Metadata } from "next";
import Gear from "@/components/gear/Gear";
import Dial, { DialCell } from "@/components/gear/Dial";
import { GEAR_KINDS, GEAR_NAMES, type GearKind } from "@/lib/gear/draw";

export const metadata: Metadata = {
  title: "Gear set",
  description: "Redesign step 2: the Gear and Dial components.",
  robots: { index: false, follow: false },
};

/**
 * /dev/gear: the whole gear set and the dial (build order step 2).
 * Mirrors reference/GearSet.html from the handoff. Not indexed.
 */

const TILE_HEIGHT: Partial<Record<GearKind, number>> = { amp: 148, head: 148, preamp: 148, cab: 168 };

// Sultans of Swing, from the live recipe page (the handoff's sample data).
const CHAIN: { kind: GearKind; type: string; name: string; vals?: number[] }[] = [
  { kind: "vol", type: "Volume", name: "Volume Pedal" },
  { kind: "comp", type: "Compressor", name: "Red Squeeze", vals: [6, 7] },
  { kind: "drive", type: "Drive", name: "Scream 808", vals: [1.5, 5, 7] },
  { kind: "drive2", type: "Drive", name: "Minotaur", vals: [2, 5.5, 7] },
  { kind: "amp", type: "Amp", name: "US Deluxe Vib", vals: [3.5, 5, 5.5, 6, 5, 5.5] },
  { kind: "cab", type: "Cab", name: "2x12 Double C12N" },
  { kind: "reverb", type: "Reverb", name: "Spring", vals: [1.8, 1.5, 2] },
  { kind: "eq", type: "EQ", name: "Tilt" },
];

const AMP_DIALS: [string, number][] = [
  ["Drive", 3.5], ["Bass", 5], ["Mid", 5.5], ["Treble", 6], ["Presence", 5], ["Ch vol", 5.5],
];

const tile: React.CSSProperties = {
  background: "var(--fk-wash)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24, borderTop: "1px solid var(--fk-line)", paddingTop: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h2 className="fk-t3">{title}</h2>
        {note && <p className="fk-body-sm fk-wrap-text">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function GearSetPage() {
  return (
    <div className="fk-wrap" style={{ paddingTop: 48, display: "flex", flexDirection: "column", gap: 48 }}>
      <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 className="fk-t1">The gear set</h1>
        <p className="fk-body fk-wrap-text" style={{ color: "var(--fk-ink-2)" }}>
          Original pedals, no maker&apos;s logos. Knobs, sliders and the delay
          readout take real recipe values.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "32px 20px" }}>
        {GEAR_KINDS.map((k) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="r-lg" style={{ ...tile, height: 260 }}>
              <Gear kind={k} height={TILE_HEIGHT[k] ?? 220} />
            </div>
            <p className="fk-label" style={{ margin: 0, padding: "0 4px", fontWeight: 600 }}>
              {GEAR_NAMES[k]}
            </p>
          </div>
        ))}
      </div>

      <Section
        title="The dial"
        note="The recipe card's signature. Amber arc shows the setting, the value sits under it in mono."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
          <DialCell label="Gain" display="1.5" value={1.5} size={72} />
          <DialCell label="Tone" display="5.0" value={5} size={72} />
          <DialCell label="Level" display="7.0" value={7} size={72} />
          <DialCell label="Master" display="10" value={10} size={72} />
          <DialCell label="Off" display="0" value={0} size={72} />
          <DialCell label="Time" display="480 ms" value={480} min={0} max={2000} size={72} />
          <DialCell label="Low cut" display="80 Hz" value={80} min={20} max={500} size={72} />
          <DialCell label="Level" display="-3.0 dB" value={-3} min={-12} max={12} size={72} />
        </div>
        <div className="fk-band" style={{ padding: 32, display: "flex", flexWrap: "wrap", gap: "14px 28px" }}>
          {AMP_DIALS.map(([label, v]) => (
            <DialCell key={label} label={label} display={v.toFixed(1)} value={v} size={52} inverse />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          {[24, 36, 52, 60, 72, 96].map((s) => (
            <Dial key={s} value={6.5} size={s} label={`Dial at ${s} pixels`} />
          ))}
        </div>
      </Section>

      <Section
        title="Driven by recipe values"
        note="Sultans of Swing. Every knob sits where the recipe sets it, and each face carries the block's name."
      >
        <div className="r-lg" style={{ ...tile, padding: 28, justifyContent: "flex-start", overflowX: "auto", gap: 8 }}>
          {CHAIN.map((b) => (
            <div key={b.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Gear kind={b.kind} height={200} vals={b.vals} label={b.name} />
              <span className="fk-caption">{b.type}</span>
              <span style={{ fontSize: 14, lineHeight: "18px", fontWeight: 600, textAlign: "center" }}>{b.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Options" note="Value extremes, a custom face name, the delay readout, colour and grille cloth overrides, and cable stubs.">
        <div className="r-lg" style={{ ...tile, padding: 28, flexWrap: "wrap", gap: 16 }}>
          <Gear kind="drive" height={200} vals={[0, 0, 0]} label="Overdrive, all knobs at 0" />
          <Gear kind="drive" height={200} vals={[10, 10, 10]} label="Overdrive, all knobs at 10" />
          <Gear kind="comp" height={200} title="RED SQUEEZE" vals={[6, 7]} />
          <Gear kind="delay" height={200} disp="480" vals={[4.8, 3, 2.5]} />
          <Gear kind="eq" height={200} vals={[0, 2.5, 5, 7.5, 10]} />
          <Gear kind="head" height={170} color="#D9CDB4" cloth="#6B5B45" />
          <Gear kind="fuzz" height={200} chain />
        </div>
      </Section>

      <Section title="Sizes" note="The same drawing from thumbnail to hero.">
        <div className="r-lg" style={{ ...tile, padding: 28, flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          {[86, 132, 200, 300].map((h) => (
            <Gear key={h} kind="mod" height={h} />
          ))}
        </div>
      </Section>
    </div>
  );
}
