import { gearForChain, type GearPick } from "@/lib/gear/recipe-gear";
import { guitarFor, type GuitarKey } from "@/lib/gear/guitars";
import type { PreviewBlockData } from "@/components/v3/preview-helpers";
import type { GearItem } from "@/types/recipe";

export type GearDrawing =
  | { type: "gear"; pick: GearPick }
  | { type: "guitar"; guitar: GuitarKey };

/**
 * The drawing for one gear item: pedals, amps, cabs and mics take the same
 * gear drawing a recipe chain gives them (knobs at the item's default
 * settings); guitars take the guitar drawing for their shape.
 */
export function drawingFor(gear: GearItem): GearDrawing | null {
  if (gear.type === "guitar") {
    // Shape by model name; the gear record keeps no pickup layout, so an
    // unknown name falls back to the solid-body default.
    const name = `${gear.manufacturer} ${gear.name}`;
    return { type: "guitar", guitar: guitarFor({ model_name: name, body_type: "solid", pickup_config: "HH" }) };
  }
  if (gear.type === "microphone") return { type: "gear", pick: { kind: "mic" } };
  const variant: PreviewBlockData["variant"] | null =
    gear.type === "amp"
      ? "amp"
      : gear.type === "cabinet"
        ? "cab"
        : gear.type === "effect"
          ? "pedal"
          : null;
  if (!variant) return null;
  const values: Record<string, number> = {};
  for (const [k, v] of Object.entries(gear.default_settings ?? {})) {
    if (typeof v === "number" && Number.isFinite(v)) values[k] = v;
  }
  // Match on the model, not the maker: "Marshall" reads as a hall reverb and
  // "Electro-Harmonix" as a harmonizer.
  const model = gear.name.replace(new RegExp(`^${escapeRe(gear.manufacturer)}\\s+`, "i"), "");
  const block: PreviewBlockData = {
    name: model,
    sub: gear.subcategory ?? "",
    variant,
    category: gear.subcategory,
    controls: Object.keys(values),
    values,
  };
  const pick = gearForChain([block])[0];
  return pick ? { type: "gear", pick } : null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
