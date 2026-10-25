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
import { chainKindLabel } from "@/components/v3/preview-helpers";
import type { ToneRecipe } from "@/types/recipe";


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
    tiles: chain.map((b) => ({ kind: chainKindLabel(b), color: b.color, iconSvg: renderToStaticMarkup(<BlockIcon block={b} size={56} />) })),
  };
}
