/**
 * Display helpers for `GuitarSpecs`. The catalog stores tuning two ways —
 * admin-form enums ("eb_standard", "drop_c_sharp") and hand-written prose
 * ("Drop D (D-A-D-G-B-E)") — and some model names carry provenance notes
 * ("Gibson Les Paul Junior (likely his 1956, 'Floyd')"). Spec cards show
 * neither raw. Shared by the recipe page and the social cards.
 */
import type { GuitarSpecs } from "@/types/recipe";

const TUNING_ENUM: Record<string, string> = {
  standard: "Standard",
  eb_standard: "Eb standard",
  d_standard: "D standard",
  c_standard: "C standard",
  b_standard: "B standard",
  drop_d: "Drop D",
  drop_c: "Drop C",
  drop_c_sharp: "Drop C#",
  drop_b: "Drop B",
  open_g: "Open G",
  open_d: "Open D",
  open_e: "Open E",
  dadgad: "DADGAD",
  a_standard_7: "A standard (7-string)",
};

/** Trailing "(…)" or " -- …" note on a hand-written value. */
const TRAILING_NOTE = /\s*(\([^()]*\)|--.*)\s*$/;

/** Short tuning label for a spec card: "Eb standard", "Drop D", "C standard". */
export function formatTuning(specs: Pick<GuitarSpecs, "tuning" | "tuning_custom">): string {
  const raw = (specs.tuning === "custom" ? specs.tuning_custom || "Custom" : specs.tuning || "").trim();
  if (TUNING_ENUM[raw]) return TUNING_ENUM[raw];
  if (/^[a-z0-9_]+$/.test(raw)) {
    // Unknown enum: "f_sharp_standard" → "F sharp standard"
    const s = raw.replace(/_/g, " ");
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // Hand-written: keep the name, drop the string-by-string note and anything after it
  // ("D standard (D-G-C-F-A-D), whole step down" → "D standard").
  let s = raw.split(/\s+\(/)[0].trim() || raw;
  while (TRAILING_NOTE.test(s) && s.replace(TRAILING_NOTE, "").trim()) s = s.replace(TRAILING_NOTE, "").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Hedged ownership/provenance wording — the note says *whose* guitar it probably was, not what it is. */
const PROVENANCE = /\b(likely|probably|possibly|perhaps|reportedly|believed|presumably|assumed|his|her|their|not (documented|confirmed|verified)|unverified|unconfirmed)\b/i;

/**
 * The guitar's name without a hedged provenance note: "Gibson Les Paul Junior
 * (likely his 1956, 'Floyd')" → "Gibson Les Paul Junior". Descriptive notes
 * stay — "(Black Strat)" and "(#1 / 'Number One')" are what the guitar is.
 */
export function guitarModelName(specs: Pick<GuitarSpecs, "model_name">): string {
  const name = (specs.model_name || "").trim();
  const m = name.match(/\s*\(([^()]*)\)\s*$/);
  if (!m || !PROVENANCE.test(m[1])) return name;
  return name.slice(0, m.index).trim() || name;
}

/** "HH (neck)" — one token, so it can't collide with a " · " separated spec line. */
export function formatPickups(specs: Pick<GuitarSpecs, "pickup_config" | "pickup_position">): string {
  if (!specs.pickup_config) return "";
  return specs.pickup_position ? `${specs.pickup_config} (${specs.pickup_position})` : specs.pickup_config;
}
