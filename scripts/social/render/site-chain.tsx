/**
 * Site chain chrome for the new_tone format: the same tile kind labels, Helix color
 * buckets and line-art icons the recipe page draws (src/components/v3/), rendered to
 * static SVG strings so the social templates can print them without React.
 *
 * Data path is the site's own adapter (recipeToBlocks), so a card and the live
 * recipe page can't disagree about which icon or color a block gets.
 */
import fs from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { BlockIcon, guitarAssetFor } from "@/components/v3/BlockIcon";
import type { PreviewBlockData } from "@/components/v3/PreviewBlocks";
import type { ToneRecipe } from "@/types/recipe";

/**
 * Mirrors kindLabel() in src/components/v3/PreviewSchematicChain.tsx (not exported there),
 * with the Helix block category added to the haystack plus Gate/room rules: on the site the
 * caption under the tile names the block, but on a card a wrong label ("FX" on a Room reverb)
 * is a reader's only cue.
 */
function kindLabel(block: PreviewBlockData, category: string): string {
  if (block.variant === "amp") return "Amp";
  if (block.variant === "cab") return "Cab·Mic";
  const hay = `${block.name} ${block.sub} ${category}`.toLowerCase();
  if (/gate/.test(hay)) return "Gate";
  if (/comp/.test(hay)) return "Comp";
  if (/volume|vol |pan/.test(hay)) return "Vol/Pan";
  if (/fuzz/.test(hay)) return "Fuzz";
  if (/dist/.test(hay)) return "Dist";
  if (/drive|screamer|808|overdrive|klon|bd-?2|blues|rat/.test(hay)) return "Drive";
  if (/delay|echo/.test(hay)) return "Delay";
  if (/reverb|hall|plate|spring|room/.test(hay)) return "Verb";
  if (/chorus|flang|phase|trem|vibe/.test(hay)) return "Mod";
  if (/wah|filter/.test(hay)) return "Wah";
  if (/eq|graphic|parametric/.test(hay)) return "EQ";
  if (/pitch|octav|whammy/.test(hay)) return "Pitch";
  return "FX";
}

/** The guitar silhouettes are <img src="/images/guitars/…"> on the site; inline the file for the card. */
function guitarSvg(name: string): string {
  const file = path.join(process.cwd(), "public", "images", "guitars", guitarAssetFor(name));
  try {
    const svg = fs.readFileSync(file, "utf-8").replace(/<\?xml[^>]*>\s*/, "");
    return `<img alt="" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"/>`;
  } catch {
    return "";
  }
}

export interface SiteTile {
  kind: string;
  color?: string;
  iconSvg: string;
}

/** Helix chain tiles, index-aligned with recipe.platform_translations.helix.chain_blocks. */
export function helixTiles(recipe: ToneRecipe): { guitarIconSvg: string; tiles: SiteTile[] } {
  const blocks = recipeToBlocks(recipe, "helix");
  const source = blocks.find((b) => b.variant === "source");
  const chain = blocks.filter((b) => b.variant !== "source");
  return {
    guitarIconSvg: source ? guitarSvg(source.name) : "",
    tiles: chain.map((b, i) => {
      const category = recipe.platform_translations.helix?.chain_blocks[i]?.block_category ?? "";
      // Icon keys read name+sub; give them the category too so "Room ← Studio room" gets the reverb glyph.
      const forIcon = { ...b, sub: `${b.sub} ${category}` };
      return { kind: kindLabel(b, category), color: b.color, iconSvg: renderToStaticMarkup(<BlockIcon block={forIcon} size={56} />) };
    }),
  };
}
