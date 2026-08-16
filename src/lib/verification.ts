import type { ToneRecipe } from "@/types/recipe";
import { verifyRecipe } from "@/lib/recipe-verification";

/**
 * Card-level verification summary.
 *
 * This file used to grade recipes as `editor_verified` ("Manually reviewed and
 * verified by our editorial team") whenever `is_editorial` was set — which is
 * every recipe in the corpus, and there is no editorial team. It also had a
 * `community_verified` tier keyed on ratings, which were seeded and then
 * deleted (correction #12). Both were claims nothing could check and nobody
 * had earned.
 *
 * What replaces them is the same machine-computed evidence the recipe page's
 * verification band shows, compressed to a single word: does the preset we
 * hand you contain the chain we printed? That is falsifiable, it is recomputed
 * on every build, and it is the only thing here we can actually stand behind.
 *
 * See `docs/GAME_THEORY_2026-07-30.md` §7 for why the honest, narrower claim
 * is worth more than the flattering one.
 */

export type VerificationLevel = "complete" | "partial" | "unbuilt";

export interface VerificationInfo {
  level: VerificationLevel;
  label: string;
  description: string;
}

/**
 * Grade a recipe by building its presets. Server/script only — this pulls in
 * all three generators and the DSP cost table. Client components should read
 * the precomputed map via {@link lookupVerificationLevel} instead.
 */
export function getVerificationLevel(recipe: ToneRecipe): VerificationLevel {
  const { presets } = verifyRecipe(recipe);
  if (presets.length === 0) return "unbuilt";

  const anyComplete = presets.some(
    (p) => p.built && p.droppedBlocks.length === 0 && p.substitutedBlocks.length === 0,
  );
  if (anyComplete) return "complete";
  return presets.some((p) => p.built) ? "partial" : "unbuilt";
}

/* The client-safe lookup lives in `verification-lookup.ts` so that importing
   it from a browser bundle cannot drag the preset generators along. */

const verificationData: Record<VerificationLevel, Omit<VerificationInfo, "level">> = {
  complete: {
    label: "Preset complete",
    description:
      "At least one platform's preset file contains every block in this chain. Checked by building the file, not by review.",
  },
  partial: {
    label: "Preset partial",
    description:
      "The preset builds, but on every platform at least one block is missing or replaced with a stand-in. The recipe page lists which.",
  },
  unbuilt: {
    label: "No preset",
    description: "We can't generate a preset file for this recipe yet — the settings are the deliverable.",
  },
};

export function getVerificationInfo(level: VerificationLevel): VerificationInfo {
  return { level, ...verificationData[level] };
}
