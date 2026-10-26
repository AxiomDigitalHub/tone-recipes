/**
 * Regenerates every static brand asset from src/components/brand/logo-paths.ts
 * so the favicon, app icons, JSON-LD logo and downloadable SVGs never drift
 * from the <Wordmark>/<Monogram> components.
 *
 *   npx tsx scripts/generate-brand-assets.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  WORDMARK_VIEWBOX,
  WORDMARK_F,
  WORDMARK_REST,
  MONOGRAM_VIEWBOX,
  MONOGRAM_F,
  MONOGRAM_REST,
} from "../src/components/brand/logo-paths";

const INK = "#0A0908";
const PAPER = "#EDEAE4";
const SUNBURST = ["#D8342B", "#E4A235", "#F3C871"];

type Tone = "ink" | "paper" | "sunburst";

const root = path.resolve(__dirname, "..");
const out = (p: string) => path.join(root, p);

function grad(x2: number) {
  return `<linearGradient id="sb" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${x2}" y2="0">${SUNBURST.map(
    (c, i) => `<stop offset="${i / (SUNBURST.length - 1)}" stop-color="${c}"/>`
  ).join("")}</linearGradient>`;
}

/** Inner markup (defs + paths) for a mark in its own viewBox coordinates. */
function markBody(kind: "wordmark" | "monogram", tone: Tone) {
  const [f, rest, full] =
    kind === "wordmark" ? [WORDMARK_F, WORDMARK_REST, 1068] : [MONOGRAM_F, MONOGRAM_REST, 494];
  const fill = tone === "sunburst" ? "url(#sb)" : tone === "paper" ? PAPER : INK;
  return (
    (tone === "sunburst" ? `<defs>${grad(full)}</defs>` : "") +
    [...f, ...rest].map((d) => `<path fill="${fill}" d="${d}"/>`).join("")
  );
}

function markSvg(kind: "wordmark" | "monogram", tone: Tone) {
  const vb = kind === "wordmark" ? WORDMARK_VIEWBOX : MONOGRAM_VIEWBOX;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${markBody(kind, tone)}</svg>\n`;
}

/** Paper monogram centered on a rounded ink tile — favicon / app icon. */
function iconSvg(size: number, radius: number, pad: number) {
  const [, , w, h] = MONOGRAM_VIEWBOX.split(" ").map(Number);
  const inner = size - pad * 2;
  const scale = Math.min(inner / w, inner / h);
  const tx = (size - w * scale) / 2;
  const ty = (size - h * scale) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${INK}"/>` +
    `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})">${markBody("monogram", "paper")}</g>` +
    `</svg>\n`
  );
}

/** Minimal ICO container wrapping PNG frames (supported by every modern browser). */
function ico(pngs: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const png = (svg: string, w: number, h?: number) =>
  sharp(Buffer.from(svg), { density: 300 }).resize(w, h ?? w, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

async function main() {
  fs.mkdirSync(out("public/brand"), { recursive: true });
  for (const kind of ["wordmark", "monogram"] as const) {
    for (const tone of ["ink", "paper", "sunburst"] as const) {
      fs.writeFileSync(out(`public/brand/fnk-${kind}-${tone}.svg`), markSvg(kind, tone));
    }
  }

  fs.writeFileSync(out("public/favicon.svg"), iconSvg(32, 6, 3));
  fs.writeFileSync(out("src/app/icon.svg"), iconSvg(32, 6, 3));
  fs.writeFileSync(out("src/app/apple-icon.png"), await png(iconSvg(180, 0, 26), 180));
  fs.writeFileSync(out("public/logo-square.png"), await png(iconSvg(512, 96, 72), 512));

  const frames = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, data: await png(iconSvg(size, size / 5, size / 10), size) }))
  );
  fs.writeFileSync(out("src/app/favicon.ico"), ico(frames));

  // Google's publisher-logo spec: fits within 600x60, transparent background.
  fs.writeFileSync(out("public/logo.png"), await png(markSvg("wordmark", "ink"), 600, 60));

  console.log("Brand assets written.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
