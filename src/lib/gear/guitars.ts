/**
 * The 13 guitar drawings, shared with Diagram Wiring (its Guitars asset
 * group: SVG, 400 by 316, neck to the right). Files live in public/guitars.
 * Use them whole. The drawings have a short neck, which is why the recipe
 * card tilts the guitar only 10 degrees.
 */
import type { GuitarSpecs } from "@/types/recipe";

export type GuitarKey =
  | "strat" | "tele" | "les-paul" | "sg" | "335" | "hss" | "offset"
  | "junior" | "prs" | "firebird" | "flying-v" | "rg" | "explorer";

export const GUITARS: Record<GuitarKey, string> = {
  strat: "Strat style guitar in fiesta red",
  tele: "Tele style guitar in butterscotch blonde",
  "les-paul": "Les Paul style guitar in gold top",
  sg: "SG style guitar in cherry",
  "335": "335 style semi-hollow guitar in natural blonde",
  hss: "HSS superstrat guitar in green",
  offset: "Offset guitar in surf green",
  junior: "Single-cut P-90 guitar in TV yellow",
  prs: "PRS style guitar in blue",
  firebird: "Firebird style guitar in tobacco sunburst",
  "flying-v": "Flying V style guitar in natural korina",
  rg: "RG style guitar in purple",
  explorer: "Explorer style guitar in black",
};

export const guitarSrc = (key: GuitarKey) => `/guitars/${key}.svg`;

const BY_NAME: [RegExp, GuitarKey][] = [
  [/firebird/i, "firebird"],
  [/flying ?v|\bv-?type\b|rhoads/i, "flying-v"],
  [/explorer|\bex-?\d|kelly/i, "explorer"],
  [/\bprs\b|paul reed|custom 2[24]|silver sky/i, "prs"],
  [/jazzmaster|jaguar|mustang|offset|duo-?sonic|bass vi/i, "offset"],
  [/\b3[3-5]5\b|es-?3\d\d|casino|sheraton|riviera|gretsch|hollow|rickenbacker|country gentleman|falcon|dot\b/i, "335"],
  [/\bsg\b/i, "sg"],
  [/junior|\bjr\b|special|p-?90|melody maker/i, "junior"],
  [/les paul|\blp\b|single-?cut|eclipse|\bec-?\d/i, "les-paul"],
  [/tele|esquire|nocaster|broadcaster/i, "tele"],
  [/ibanez|\brg\b|\bjem\b|jackson|charvel|kramer|\besp\b|soloist|dinky|superstrat|super strat|music ?man|schecter|floyd|7-?string|wolfgang|frankenstrat|frankenstein|\bevh\b/i, "rg"],
  [/strat/i, "strat"],
];

/** The drawing that matches a recipe's guitar: by model name, then by pickups. */
export function guitarFor(specs: Pick<GuitarSpecs, "model_name" | "pickup_config" | "body_type"> | undefined): GuitarKey {
  if (!specs) return "strat";
  const name = specs.model_name || "";
  for (const [re, key] of BY_NAME) {
    if (re.test(name)) {
      // A Strat with a bridge humbucker is the HSS drawing.
      if (key === "strat" && (specs.pickup_config === "HSS" || specs.pickup_config === "HSH")) return "hss";
      return key;
    }
  }
  if (specs.body_type === "semi_hollow" || specs.body_type === "hollow") return "335";
  switch (specs.pickup_config) {
    case "SSS": return "strat";
    case "SS":
    case "single": return "tele";
    case "HSS": return "hss";
    case "HSH": return "rg";
    case "P90":
    case "H": return "junior";
    default: return "les-paul";
  }
}
