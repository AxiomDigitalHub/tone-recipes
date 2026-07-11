import { toneRecipes } from "@/lib/data";
import { generateHelixPreset } from "@/lib/helix/generate-hlx";
import { resolveModelId } from "@/lib/helix/model-map";

// Find a helix translation that authors a lowercase-d `Predelay` on a
// model expected to use `Predelay` (e.g. HD2_ReverbSpring), and one that
// authors `PreDelay` on a VIC "Dyn" model expected to use `PreDelay`.
function findBlockWithPredelay(wantCapital: boolean) {
  for (const recipe of toneRecipes) {
    const helix = recipe.platform_translations.helix;
    if (!helix) continue;
    for (const block of helix.chain_blocks) {
      const keys = Object.keys(block.settings ?? {});
      const hasPre = keys.some((k) => k.toLowerCase() === "predelay");
      if (!hasPre) continue;
      const modelId = resolveModelId(block.block_name);
      if (!modelId) continue;
      const isVicDyn = ["VIC_DynPlate", "VIC_ReverbDynAmbience", "VIC_ReverbDynRoom"].includes(modelId);
      if (wantCapital === isVicDyn) {
        return { recipe, block, modelId };
      }
    }
  }
  return null;
}

function report(label: string, wantCapital: boolean) {
  const found = findBlockWithPredelay(wantCapital);
  if (!found) {
    console.log(`\n[${label}] NO recipe found exercising this case.`);
    return;
  }
  const { recipe, block, modelId } = found;
  const preKeyIn = Object.keys(block.settings).find((k) => k.toLowerCase() === "predelay")!;
  const rawVal = (block.settings as Record<string, unknown>)[preKeyIn];
  const expectedKey = wantCapital ? "PreDelay" : "Predelay";

  const json = generateHelixPreset(recipe.platform_translations.helix!, recipe.title);
  const parsed = JSON.parse(json);

  // Search both DSPs for the emitted block matching this model + its predelay key.
  let emittedKey: string | null = null;
  let emittedVal: unknown = null;
  for (const dspName of ["dsp0", "dsp1"]) {
    const dsp = parsed.data.tone[dspName] ?? {};
    for (const [k, v] of Object.entries<Record<string, unknown>>(dsp)) {
      if (!k.startsWith("block")) continue;
      if (v["@model"] !== modelId) continue;
      for (const pk of Object.keys(v)) {
        if (pk.toLowerCase() === "predelay") {
          emittedKey = pk;
          emittedVal = v[pk];
        }
      }
    }
  }

  console.log(`\n[${label}] recipe="${recipe.title}"  block="${block.block_name}"  model=${modelId}`);
  console.log(`  INPUT      : { ${preKeyIn}: ${JSON.stringify(rawVal)} }`);
  console.log(`  EXPECTED   : key "${expectedKey}" present, value converted (not dropped)`);
  console.log(`  BEFORE fix : global map forced "PreDelay" -> HX Edit drops it on a "${expectedKey}" model` +
    (wantCapital ? " (this case was already correct)" : ""));
  console.log(`  AFTER fix  : emitted key = ${emittedKey === null ? "<<DROPPED / NOT FOUND>>" : `"${emittedKey}"`}, value = ${JSON.stringify(emittedVal)}`);
  const ok = emittedKey === expectedKey;
  console.log(`  RESULT     : ${ok ? "PASS ✅ correct casing emitted" : "FAIL ❌"}`);
}

report("Predelay (lowercase-d model, e.g. Spring)", false);
report("PreDelay (VIC Dyn model)", true);
