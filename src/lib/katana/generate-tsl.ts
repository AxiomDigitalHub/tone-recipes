import type { PlatformTranslation } from "@/types/recipe";
import {
  resolveKatanaAmp,
  resolveKatanaEffect,
  isAmpCategory,
  isCabCategory,
} from "./model-map";

/**
 * Parse a setting value to a 0-100 integer range for TSL parameters.
 */
function parseParamToTSL(key: string, value: string | number | boolean): number {
  const lower = key.toLowerCase();

  if (typeof value === "boolean") return value ? 100 : 0;

  let num: number;
  if (typeof value === "string") {
    if (value.endsWith("%")) {
      return Math.round(Math.max(0, Math.min(100, parseFloat(value) || 0)));
    }
    if (value.toLowerCase() === "on" || value.toLowerCase() === "true") return 100;
    if (value.toLowerCase() === "off" || value.toLowerCase() === "false") return 0;
    num = parseFloat(value);
    if (isNaN(num)) return 50;
  } else {
    num = value;
  }

  // Time/BPM params: keep as-is (capped at 2000ms)
  if (lower.includes("time") || lower.includes("bpm") || lower.includes("tempo")) {
    return Math.round(Math.max(0, Math.min(2000, num)));
  }

  // Values already 0-100 (mix, level percentages)
  if (lower.includes("mix") || lower.includes("wet")) {
    return Math.round(Math.max(0, Math.min(100, num)));
  }

  // Default: assume 0-10 scale -> map to 0-100
  if (num <= 10) {
    return Math.round(Math.max(0, Math.min(100, num * 10)));
  }

  return Math.round(Math.max(0, Math.min(100, num)));
}

/**
 * Escape a string for safe inclusion in XML.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build XML for a single Katana effect slot.
 */
function buildEffectXml(
  slotName: string,
  blockName: string,
  settings: Record<string, string | number | boolean>,
  enabled: boolean,
): string {
  const effect = resolveKatanaEffect(blockName);

  const paramLines: string[] = [];
  for (const [key, value] of Object.entries(settings)) {
    const tslValue = parseParamToTSL(key, value);
    paramLines.push(`        <Parameter name="${escapeXml(key)}" value="${tslValue}" />`);
  }

  return `    <${slotName} enabled="${enabled ? "ON" : "OFF"}" type="${escapeXml(effect.type)}" category="${escapeXml(effect.category)}">
${paramLines.length > 0 ? paramLines.join("\n") + "\n" : ""}    </${slotName}>`;
}

/**
 * Generate a valid Boss Katana .tsl (Tone Studio Liveset) XML string
 * from a PlatformTranslation and a preset name.
 *
 * The TSL format is an XML document used by Boss Tone Studio to store
 * and transfer presets to the Katana amplifier.
 *
 * The Katana has a fixed signal chain: Booster -> Mod -> FX -> Delay -> Reverb
 * with a single amp section. We map chain blocks into the appropriate slots.
 */
export function generateKatanaTSL(
  translation: PlatformTranslation,
  presetName: string,
): string {
  // Find the amp block to determine amp type settings
  const ampBlock = translation.chain_blocks.find((b) => isAmpCategory(b.block_category));
  const ampInfo = ampBlock
    ? resolveKatanaAmp(ampBlock.block_name)
    : { type: "CRUNCH", variation: "Vintage" };

  // Extract amp EQ settings from the amp block
  const ampSettings = ampBlock?.settings || {};
  const gain = parseParamToTSL("gain", ampSettings.Gain ?? ampSettings.gain ?? 5);
  const bass = parseParamToTSL("bass", ampSettings.Bass ?? ampSettings.bass ?? 5);
  const mid = parseParamToTSL("mid", ampSettings.Mid ?? ampSettings.mid ?? ampSettings.Middle ?? ampSettings.middle ?? 5);
  const treble = parseParamToTSL("treble", ampSettings.Treble ?? ampSettings.treble ?? 5);
  const presence = parseParamToTSL("presence", ampSettings.Presence ?? ampSettings.presence ?? 5);
  const volume = parseParamToTSL("volume", ampSettings.Volume ?? ampSettings.volume ?? ampSettings.Level ?? ampSettings.level ?? 5);

  // Collect non-amp, non-cab effects
  const effectBlocks = translation.chain_blocks.filter(
    (b) => !isAmpCategory(b.block_category) && !isCabCategory(b.block_category),
  );

  // Katana has fixed effect slots. Map our effects into them.
  // Slots: Booster, Mod, FX, Delay, Reverb (plus EQ which is in the amp)
  const slotAssignments: Record<string, typeof effectBlocks[number] | undefined> = {
    Booster: undefined,
    Mod: undefined,
    FX: undefined,
    Delay: undefined,
    Reverb: undefined,
  };

  for (const block of effectBlocks) {
    const effect = resolveKatanaEffect(block.block_name);
    const cat = effect.category.toUpperCase();

    if ((cat.includes("OD") || cat.includes("DS") || cat.includes("COMP") || cat.includes("BOOST")) && !slotAssignments.Booster) {
      slotAssignments.Booster = block;
    } else if ((cat.includes("MOD") || cat.includes("PEDAL")) && !slotAssignments.Mod) {
      slotAssignments.Mod = block;
    } else if (cat.includes("DELAY") && !slotAssignments.Delay) {
      slotAssignments.Delay = block;
    } else if (cat.includes("REVERB") && !slotAssignments.Reverb) {
      slotAssignments.Reverb = block;
    } else if (!slotAssignments.FX) {
      slotAssignments.FX = block;
    }
  }

  // Build effect slot XML
  const effectSlots: string[] = [];
  for (const [slotName, block] of Object.entries(slotAssignments)) {
    if (block) {
      effectSlots.push(buildEffectXml(slotName, block.block_name, block.settings, true));
    } else {
      effectSlots.push(`    <${slotName} enabled="OFF" type="" category="" />`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ToneStudioLiveSet version="1.0">
  <LiveSet name="${escapeXml(presetName.slice(0, 16))}">
    <Patch name="${escapeXml(presetName.slice(0, 16))}">
      <Amp type="${escapeXml(ampInfo.type)}" variation="${escapeXml(ampInfo.variation)}">
        <Parameter name="Gain" value="${gain}" />
        <Parameter name="Bass" value="${bass}" />
        <Parameter name="Middle" value="${mid}" />
        <Parameter name="Treble" value="${treble}" />
        <Parameter name="Presence" value="${presence}" />
        <Parameter name="Volume" value="${volume}" />
      </Amp>
${effectSlots.join("\n")}
      <Global>
        <Parameter name="BPM" value="120" />
      </Global>
    </Patch>
  </LiveSet>
</ToneStudioLiveSet>`;

  return xml;
}

/**
 * Slugify a preset name into a safe filename.
 */
export function slugifyPresetName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
