/**
 * Server-safe pure helpers for preview blocks. Lives outside
 * PreviewBlocks.tsx (which is a "use client" file) so server
 * components can call these functions directly. The Next.js 16
 * boundary check forbids calling functions exported from "use client"
 * files in server code — only components and props are allowed
 * across the boundary.
 *
 * If you find yourself adding a stateful or React-using helper here,
 * it belongs in PreviewBlocks.tsx (or another client module), not
 * this file.
 */

/* ── Type ────────────────────────────────────────────────────────── */

export interface PreviewBlockData {
  /** Display name, e.g. "Hiwatt DR103" or "Ibanez TS808". */
  name: string;
  /** Spec-sheet subtitle, e.g. "100W · Master on 4, channels jumped". */
  sub: string;
  /** Which block variant to render. */
  variant: "source" | "pedal" | "amp" | "cab";
  /** Block color — driven by effect CATEGORY (Helix convention), not by
   *  physical gear chassis. */
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
  /** Optional per-control metadata. */
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

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Controls that read as "frequency sweep" or "send amount" — render as
 *  a horizontal fader instead of a rotary knob. Matches Helix's cab
 *  block parameters plus common reverb/delay names. */
export function isHFaderControl(name: string): boolean {
  const n = name.toLowerCase().replace(/[-_]/g, " ");
  return (
    /low\s*cut|lo\s*cut|hi(gh)?\s*cut|early\s*ref(lections)?|\ber(\b|\s|$)/.test(
      n,
    )
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

/** Human-readable Helix-style category label for the block. Maps the
 *  block's name/sub onto Line 6 Helix's block taxonomy so the chip
 *  reads "Distortion" / "Dynamics" / "Modulation" / etc. */
export function helixCategory(block: PreviewBlockData): string {
  if (block.variant === "amp") return "Amp";
  if (block.variant === "cab") return "Cab";
  if (block.variant === "source") return "Input";
  const hay = `${block.name} ${block.sub}`.toLowerCase();
  if (/comp(ressor)?|dynamic/.test(hay)) return "Dynamics";
  if (/volume|expression|\bpan\b|gain block/.test(hay)) return "Volume/Pan";
  if (/fuzz|muff|tonebender|fuzzface/.test(hay)) return "Distortion";
  if (
    /dist(ortion)?|overdriv|drive|screamer|808|klon|rat|bd-?2|blues|boost|booster/.test(
      hay,
    )
  )
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
