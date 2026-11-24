/**
 * Guitar finishes: paint a guitar drawing the colour of the real instrument.
 *
 * The 13 drawings in public/guitars each have one body colour. A recipe
 * about Clapton's "Brownie" should show a sunburst Strat, not a red one.
 * `paintGuitar` takes a drawing's SVG and returns it in another finish. The
 * route /guitar-art/<shape>.<finish>.svg serves the result, generated at
 * build time.
 *
 * Which recipe gets which finish lives in src/data/guitar-finishes.json,
 * each entry with the source that documents it. A recipe with no entry
 * keeps the drawing's own finish. Do not add a finish without a source.
 *
 * Only the body is repainted. Pickguards, binding, necks and hardware stay
 * as drawn, and striped or graphic finishes are shown as their base colour.
 */

export interface FinishSpec {
  label: string;
  /** Body colour (the centre of a burst). */
  body: string;
  /** Edge shading for a solid finish. */
  edge: string;
  /** For a burst: colours from the mid ring to the outer edge. */
  burst?: [string, string];
}

export const FINISHES = {
  black: { label: "black", body: "#1b1c1e", edge: "#000000" },
  white: { label: "white", body: "#f1efe8", edge: "#8d8a80" },
  cream: { label: "cream", body: "#eadfbf", edge: "#8c7c4e" },
  sunburst: { label: "sunburst", body: "#dba23c", edge: "#5a2410", burst: ["#9a3516", "#170b07"] },
  "tobacco-burst": { label: "tobacco sunburst", body: "#c08a3a", edge: "#3b1f0e", burst: ["#5e3114", "#120a06"] },
  "cherry-burst": { label: "cherry sunburst", body: "#e0a646", edge: "#7c1b14", burst: ["#b22a1c", "#5e120e"] },
  cherry: { label: "cherry", body: "#8f1d1b", edge: "#3a0808" },
  red: { label: "red", body: "#d9482f", edge: "#4d1206" },
  blue: { label: "blue", body: "#2f5f98", edge: "#10233d" },
  "sonic-blue": { label: "sonic blue", body: "#a9cbdc", edge: "#4a6f83" },
  "surf-green": { label: "surf green", body: "#a8d5c2", edge: "#4a7a68" },
  green: { label: "green", body: "#2f6b4a", edge: "#0f2a1c" },
  yellow: { label: "yellow", body: "#e3c456", edge: "#7d6418" },
  butterscotch: { label: "butterscotch blonde", body: "#dcb261", edge: "#7c5a18" },
  natural: { label: "natural", body: "#d7b071", edge: "#7b5626" },
  walnut: { label: "walnut", body: "#5b3a22", edge: "#1e120a" },
  goldtop: { label: "gold top", body: "#d1a53e", edge: "#7a5a10" },
  silver: { label: "silver", body: "#b9bec3", edge: "#565c62" },
  silverburst: { label: "silverburst", body: "#c9cdd1", edge: "#1c1d1f", burst: ["#6a6f75", "#0b0b0c"] },
  purple: { label: "purple", body: "#6a4a9c", edge: "#26163f" },
  pink: { label: "pink", body: "#e7a6b4", edge: "#8a4a5a" },
  orange: { label: "orange", body: "#dd7a28", edge: "#6b300b" },
} satisfies Record<string, FinishSpec>;

export type Finish = keyof typeof FINISHES;
export const isFinish = (v: unknown): v is Finish => typeof v === "string" && v in FINISHES;

function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a);
  const B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

/**
 * Repaint a guitar drawing. Relies on the shared structure of the Diagram
 * Wiring drawings: after <defs>, a blurred shadow path, then the body path
 * with a plain fill, then a group clipped to the body that holds the edge
 * shading and a soft highlight.
 */
export function paintGuitar(svg: string, finish: Finish): string {
  const spec: FinishSpec = FINISHES[finish];
  const cut = svg.indexOf("</defs>");
  if (cut < 0) return svg;
  let head = svg.slice(0, cut);
  let rest = svg.slice(cut);

  // 1. The body: the first path with a plain hex fill and no opacity or filter.
  const bodyRe = /<path\b(?![^>]*\b(?:opacity|filter)=)[^>]*\bd="([^"]+)"[^>]*\bfill="(#[0-9a-fA-F]{3,6})"[^>]*>/;
  const body = rest.match(bodyRe);
  if (!body) return svg;
  const d = body[1];
  rest = rest.replace(bodyRe, (m) => m.replace(/fill="#[0-9a-fA-F]{3,6}"/, `fill="${spec.body}"`));

  // 2. The shading group clipped to the body: rebuild it for this finish.
  const groupRe = /<g clip-path="url\(#body\)">([\s\S]*?)<\/g>/;
  const group = rest.match(groupRe);
  if (!group) return head + rest;
  const highlight = (group[1].match(/<ellipse\b[^>]*>(?:<\/ellipse>)?/) || [""])[0];
  let shade: string;
  if (spec.burst) {
    const [mid, outer] = spec.burst;
    const widths = [162, 139, 117, 95, 75, 56, 38, 22];
    shade = widths
      .map((w, i) => {
        const t = i / (widths.length - 1);
        const colour = mix(mid, outer, t);
        const opacity = (0.22 + t * 0.34).toFixed(2);
        return `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${w}" opacity="${opacity}" filter="url(#blur18)"></path>`;
      })
      .join("");
  } else {
    shade = `<path d="${d}" fill="none" stroke="${spec.edge}" stroke-width="20" opacity="0.5" filter="url(#blur6)"></path>`;
  }
  rest = rest.replace(groupRe, `<g clip-path="url(#body)">${shade}${highlight}</g>`);

  // A drawing without the blur a finish needs gets it added.
  const need = spec.burst ? "blur18" : "blur6";
  if (!head.includes(`id="${need}"`)) {
    const dev = need === "blur18" ? 16 : 6;
    head += `<filter id="${need}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${dev}"></feGaussianBlur></filter>`;
  }
  return (head + rest).replace(/aria-label="[^"]*"/, `aria-label="guitar in ${spec.label}"`);
}
