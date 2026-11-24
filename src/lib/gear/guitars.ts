/**
 * The 13 guitar drawings, shared with Diagram Wiring (its Guitars asset
 * group: SVG, 400 by 316, neck to the right). Files live in public/guitars.
 * Use them whole. The drawings have a short neck, which is why the recipe
 * card tilts the guitar only 10 degrees.
 */
import type { GuitarSpecs } from "@/types/recipe";
import finishes from "@/data/guitar-finishes.json";
import { FINISHES, isFinish } from "./guitar-finish";

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

/**
 * The drawing for a recipe, painted the colour of the real instrument when
 * src/data/guitar-finishes.json has a sourced finish for that recipe.
 */
const SHAPE_NAME: Record<GuitarKey, string> = {
  strat: "Strat style guitar",
  tele: "Tele style guitar",
  "les-paul": "Les Paul style guitar",
  sg: "SG style guitar",
  "335": "335 style semi-hollow guitar",
  hss: "HSS superstrat guitar",
  offset: "Offset guitar",
  junior: "Single-cut P-90 guitar",
  prs: "PRS style guitar",
  firebird: "Firebird style guitar",
  "flying-v": "Flying V style guitar",
  rg: "RG style guitar",
  explorer: "Explorer style guitar",
};

export function guitarArt(
  slug: string,
  specs: Pick<GuitarSpecs, "model_name" | "pickup_config" | "body_type"> | undefined,
): { key: GuitarKey; src: string; alt: string } {
  const key = guitarFor(specs);
  const entry = (finishes as Record<string, { finish?: string }>)[slug];
  if (entry && isFinish(entry.finish)) {
    return {
      key,
      src: `/guitar-art/${key}.${entry.finish}.svg`,
      alt: `${SHAPE_NAME[key]} in ${FINISHES[entry.finish].label}`,
    };
  }
  return { key, src: guitarSrc(key), alt: GUITARS[key] };
}

/**
 * Sister-site cross-link: the stock wiring diagram for this style of guitar
 * on Diagram Wiring. Every target was checked to exist. Shapes with no
 * matching stock diagram get no link.
 */
const WIRING: Partial<Record<GuitarKey, { slug: string; label: string }>> = {
  strat: { slug: "stock-strat-style", label: "a Strat" },
  tele: { slug: "stock-tele-style", label: "a Tele" },
  "les-paul": { slug: "stock-les-paul-style", label: "a Les Paul" },
  sg: { slug: "stock-sg-style", label: "an SG" },
  "335": { slug: "stock-es-335-style", label: "a 335" },
  hss: { slug: "stock-hss", label: "an HSS guitar" },
  offset: { slug: "stock-jazzmaster-style", label: "a Jazzmaster" },
  junior: { slug: "one-p-90", label: "a single P-90 guitar" },
  rg: { slug: "hsh-on-a-5-way-super-switch", label: "an HSH guitar" },
};

export function wiringLink(key: GuitarKey): { href: string; label: string } | null {
  const w = WIRING[key];
  return w ? { href: `https://diagramwiring.com/diagrams/${w.slug}`, label: w.label } : null;
}
