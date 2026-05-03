"use client";

import { useMemo } from "react";
import PreviewKnob from "./PreviewKnob";
import { BlockIcon } from "./BlockIcon";

/**
 * Block renderers for the preview recipe page. Mirrors the Claude Design
 * prototype's Pedal / AmpBlock / SourceBlock trio, ported to React with
 * props shaped for our actual recipe data.
 *
 * Every block takes a `PreviewBlockData` shape that the page-level mapper
 * produces from the real `signal_chain[]` + `platform_translations[]`
 * data. This isolation means the visual can be redesigned without touching
 * our data model.
 */

export interface PreviewBlockData {
  /** Display name, e.g. "Hiwatt DR103" or "Ibanez TS808". */
  name: string;
  /** Spec-sheet subtitle, e.g. "100W · Master on 4, channels jumped". */
  sub: string;
  /** Which block variant to render. */
  variant: "source" | "pedal" | "amp" | "cab";
  /** Block color — driven by effect CATEGORY (Helix convention), not by
   *  physical gear chassis. So every drive renders yellow, every delay
   *  green, every reverb blue, etc. — which matches how Line 6 Helix /
   *  HX Edit color-codes blocks in the signal path. */
  color?:
    | "black"
    | "green" // Delay
    | "red" // Amp
    | "orange" // EQ
    | "cream"
    | "silver" // Volume / Pan / Utility (grey)
    | "blue" // Reverb
    | "purple" // Modulation
    | "yellow" // Distortion / Drive / Fuzz / Boost
    | "teal" // Compressor / Dynamics / Wah / Filter
    | "magenta"; // Cab / IR / Pitch / Synth
  /** Knob labels in the order they should display. */
  controls: string[];
  /** Keyed by knob label — current value for the active platform. */
  values: Record<string, number>;
  /** Optional per-control metadata. `neutral` is the "recommended /
   *  center detent" value — used for bipolar knobs (e.g. Cab Level's 0-dB
   *  center) and to place a subtle recommended-position tick. */
  ranges?: Record<
    string,
    { min?: number; max?: number; neutral?: number; unit?: string }
  >;
  /** Optional serial string for pedal labels. */
  serial?: string;
  /** Optional eyebrow for source/cab blocks. */
  kind?: string;
  /** Per-block engineer note, if the recipe has one. */
  notes?: string;
}

/* ── Pedal chassis ────────────────────────────────────────────────────── */
export function PreviewPedal({ block }: { block: PreviewBlockData }) {
  const lightChassis =
    block.color === "cream" ||
    block.color === "silver" ||
    block.color === "yellow";
  return (
    <div className={`pedal pedal-${block.color ?? "black"} ${lightChassis ? "on-light" : ""}`}>
      <div className="pedal-header">
        <div>
          <div className="pedal-name">{block.name}</div>
          <div className="pedal-sub">{block.sub}</div>
        </div>
        <div>
          <div className="pedal-led" />
          {block.serial && (
            <div className="pedal-serial" style={{ marginTop: 6, textAlign: "right" }}>
              {block.serial}
            </div>
          )}
        </div>
      </div>
      <div className="pedal-knobs">
        {block.controls.map((c) => {
          const range = block.ranges?.[c];
          return (
            <PreviewKnob
              key={c}
              label={c}
              value={block.values[c] ?? 5}
              min={range?.min}
              max={range?.max ?? 10}
              size={40}
              interactive={false}
              onLight={lightChassis}
              onDark={!lightChassis}
            />
          );
        })}
      </div>
      <div className="pedal-footswitch" aria-hidden="true" />
    </div>
  );
}

/* ── Amp chassis ──────────────────────────────────────────────────────── */
export function PreviewAmpBlock({ block }: { block: PreviewBlockData }) {
  return (
    <div className="amp-block">
      <div className="pedal-header" style={{ marginBottom: 8, paddingBottom: 12 }}>
        <div>
          <div className="pedal-sub" style={{ marginTop: 0, marginBottom: 4 }}>
            Amplifier
          </div>
          <div className="pedal-name" style={{ fontSize: 16, maxWidth: 260 }}>
            {block.name}
          </div>
          <div className="pedal-sub">{block.sub}</div>
        </div>
      </div>
      <div className="amp-knobs">
        {block.controls.map((c) => {
          const range = block.ranges?.[c];
          return (
            <PreviewKnob
              key={c}
              label={c}
              value={block.values[c] ?? 5}
              min={range?.min}
              max={range?.max ?? 10}
              size={44}
              interactive={false}
              onDark
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Source / cab block (dashed outline, no knobs) ────────────────────── */
export function PreviewSourceBlock({ block }: { block: PreviewBlockData }) {
  return (
    <div className="source-block">
      <div className="eyebrow">{block.kind ?? block.variant}</div>
      <div className="src-name">{block.name}</div>
      <div className="src-sub">{block.sub}</div>
    </div>
  );
}

/* ── Signal chain — horizontal row of blocks with patch-cable connectors ── */
export function PreviewSignalChain({ blocks }: { blocks: PreviewBlockData[] }) {
  return (
    <div className="sigchain on-dark">
      {blocks.map((b, i) => {
        const el = (() => {
          if (b.variant === "source" || b.variant === "cab") return <PreviewSourceBlock block={b} />;
          if (b.variant === "amp") return <PreviewAmpBlock block={b} />;
          return <PreviewPedal block={b} />;
        })();
        return (
          <div key={`${b.name}-${i}`} style={{ display: "contents" }}>
            {i > 0 && <div className="chain-wire" aria-hidden="true" />}
            <div style={{ flexShrink: 0 }}>{el}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Per-block settings card (for the "broken out" section below the chain) ──
   Clean editorial spec-sheet card. Paper background, hairline divider,
   type-chip at top-right, then: horizontal faders (frequency-style
   controls — Low/High Cut, Early Reflections), then a knob grid for the
   rest. Volume-style pedals short-circuit to a vertical fader. */
export function PreviewBlockDetail({
  block,
  isSelected = false,
  onClick,
}: {
  block: PreviewBlockData;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const visibleControls = useMemo(
    () => block.controls.filter((c) => block.values[c] !== undefined),
    [block],
  );

  const asFader = isFaderBlock(block);

  // Split controls: horizontal faders for frequency/sweep-style controls,
  // knobs for everything else. Keeps original order within each group.
  const hfaderControls = visibleControls.filter(isHFaderControl);
  const knobControls = visibleControls.filter((c) => !isHFaderControl(c));

  const className = [
    "block-detail",
    block.color ? `node-color-${block.color}` : "",
    isSelected ? "is-selected" : "",
    onClick ? "is-clickable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="block-detail-head">
        <div className="head-icon" aria-hidden="true">
          <BlockIcon block={block} size={22} />
        </div>
        <div className="head-title">
          <div className="name">{block.name}</div>
          {block.sub && <div className="sub">{block.sub}</div>}
        </div>
        <span className="kind">{helixCategory(block)}</span>
      </div>
      {asFader ? (
        <PreviewFader
          value={faderValue(block)}
          label={visibleControls[0] ?? "Level"}
        />
      ) : (
        <>
          {hfaderControls.length > 0 && (
            <div className="block-hfaders">
              {hfaderControls.map((c) => {
                const range = block.ranges?.[c];
                return (
                  <PreviewHFader
                    key={c}
                    label={c}
                    value={block.values[c] ?? 0}
                    min={range?.min ?? 0}
                    max={range?.max ?? 100}
                    unit={range?.unit}
                  />
                );
              })}
            </div>
          )}
          {knobControls.length > 0 && (
            <div className="block-settings">
              {knobControls.map((c) => {
                const range = block.ranges?.[c];
                return (
                  <PreviewKnob
                    key={c}
                    label={c}
                    value={block.values[c] ?? 5}
                    min={range?.min}
                    max={range?.max ?? 10}
                    neutral={range?.neutral}
                    unit={range?.unit}
                    size={52}
                    interactive={false}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Human-readable Helix-style category label for the block.
 *  Maps the block's name/sub onto Line 6 Helix's block taxonomy so the
 *  chip reads "Distortion" / "Dynamics" / "Modulation" / etc. instead
 *  of "pedal". */
export function helixCategory(block: PreviewBlockData): string {
  if (block.variant === "amp") return "Amp";
  if (block.variant === "cab") return "Cab";
  if (block.variant === "source") return "Input";
  const hay = `${block.name} ${block.sub}`.toLowerCase();
  if (/comp(ressor)?|dynamic/.test(hay)) return "Dynamics";
  if (/volume|expression|\bpan\b|gain block/.test(hay)) return "Volume/Pan";
  if (/fuzz|muff|tonebender|fuzzface/.test(hay)) return "Distortion";
  if (/dist(ortion)?|overdriv|drive|screamer|808|klon|rat|bd-?2|blues|boost|booster/.test(hay))
    return "Distortion";
  if (/delay|echo/.test(hay)) return "Delay";
  if (/reverb|hall|plate|spring|room|verb/.test(hay)) return "Reverb";
  if (/chorus|flang|phase|trem|vibe|rotary|leslie|mod /.test(hay))
    return "Modulation";
  if (/wah|auto\s*wah|cry\s*baby/.test(hay)) return "Wah";
  if (/filter|envelope/.test(hay)) return "Filter";
  if (/\beq\b|graphic|parametric/.test(hay)) return "EQ";
  if (/pitch|octav|whammy|harmon|synth/.test(hay)) return "Pitch/Synth";
  return "Effect";
}

/** Controls that read as "frequency sweep" or "send amount" — render as
 *  a horizontal fader instead of a rotary knob. Matches Helix's cab block
 *  parameters plus common reverb/delay names. */
function isHFaderControl(name: string): boolean {
  const n = name.toLowerCase().replace(/[-_]/g, " ");
  return (
    /low\s*cut|lo\s*cut|hi(gh)?\s*cut|early\s*ref(lections)?|\ber(\b|\s|$)/.test(
      n,
    )
  );
}

/* ── Horizontal fader (for Low/High Cut, Early Reflections, etc.) ───────
   A linear slider metaphor — appropriate for frequency or amount
   parameters. Values displayed in mono, matching the knob language. */
export function PreviewHFader({
  value,
  min = 0,
  max = 100,
  label,
  unit,
}: {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
}) {
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const printed = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return (
    <div className="hfader">
      <div className="hfader-top">
        <span className="hfader-label">{label}</span>
        <span className="hfader-value">
          {printed}
          {unit && <span className="hfader-unit">{unit}</span>}
        </span>
      </div>
      <div className="hfader-track" aria-hidden="true">
        <div className="hfader-rail" />
        <div
          className="hfader-fill"
          style={{ width: `${norm * 100}%` }}
        />
        <div
          className="hfader-cap"
          style={{ left: `${norm * 100}%` }}
        />
      </div>
    </div>
  );
}

/** Volume Pedal / expression-style blocks render as a fader, not knobs. */
export function isFaderBlock(block: PreviewBlockData): boolean {
  if (block.variant !== "pedal") return false;
  const hay = `${block.name} ${block.sub}`.toLowerCase();
  if (!/volume|expression|fader|wah pedal/.test(hay)) return false;
  // Guard: if it has multiple knob-style controls (not just position/level),
  // it's probably a volume-boost pedal with its own tone stack — keep knobs.
  return block.controls.length <= 1;
}

/** Normalize the block's single control into a 0–100 percentage. */
export function faderValue(block: PreviewBlockData): number {
  const control = block.controls[0];
  if (!control) return 100; // sensible default for a volume pedal at full
  const raw = block.values[control];
  if (raw === undefined) return 100;
  const range = block.ranges?.[control];
  const min = range?.min ?? 0;
  const max = range?.max ?? 10;
  return Math.round(((raw - min) / (max - min || 1)) * 100);
}

/* ── Fader RAMP (for the interactive detail panel only) ─────────────────
   Volume pedals sweep from silent → full. This visualizes that as a
   rising wedge — the filled triangle grows to the current % position.
   Paired with a dark card background, it reads as "pedal up-front,
   illuminated" — distinct from the compact grid card below. */
export function PreviewFaderRamp({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const W = 160;
  const H = 80;
  const x = (W * pct) / 100;
  const y = H - (H * pct) / 100;
  return (
    <div className="fader-ramp">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="fader-ramp-svg"
        aria-hidden="true"
      >
        {/* Full sweep outline — ghost guide showing max potential */}
        <polygon
          points={`0,${H} ${W},${H} ${W},0`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={0.75}
        />
        {/* Filled wedge proportional to current value */}
        <polygon
          points={`0,${H} ${x},${H} ${x},${y}`}
          fill="currentColor"
          fillOpacity={0.92}
        />
        {/* Amber tick along the hypotenuse — matches knob indicator color */}
        <line
          x1="0"
          y1={H}
          x2={x}
          y2={y}
          stroke="var(--amber)"
          strokeWidth={1.4}
        />
      </svg>
      <div className="fader-ramp-label">{label}</div>
      <div
        className="fader-ramp-value"
        aria-label={`${label}: ${pct}%`}
      >
        {pct}%
      </div>
    </div>
  );
}

/* ── Fader VERTICAL (for the compact spec-sheet card in the grid) ───────
   Mirrors the knob's dial / label / value stack so it feels like part
   of the same instrument, just vertical. */
export function PreviewFader({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="fader">
      <div className="fader-track" aria-hidden="true">
        <div className="fader-rail" />
        <div className="fader-cap" style={{ bottom: `${pct}%` }} />
      </div>
      <div className="fader-label">{label}</div>
      <div
        className="fader-value"
        aria-label={`${label}: ${pct}%`}
      >
        {pct}%
      </div>
    </div>
  );
}
