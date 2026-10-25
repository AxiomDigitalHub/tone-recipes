/**
 * Headless Chrome renderer (puppeteer-core + the locally installed Chrome).
 * Launch logic mirrors src/lib/pdf/render-print-pdf.ts (not imported: that
 * module is `server-only`). Fails closed if fonts didn't load or text overflows.
 */
import fs from "fs";
import path from "path";
import puppeteer, { type Browser } from "puppeteer-core";
import sharp, { type OverlayOptions } from "sharp";
import { slideHtml } from "./templates";
import type { SlideSpec } from "../types";

const PLATFORM_CHROME: Record<string, string> = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
};

export const CAROUSEL = { w: 1080, h: 1350 } as const;
export const PIN = { w: 1000, h: 1500 } as const;

export async function launch(): Promise<Browser> {
  const executablePath = process.env.LOCAL_CHROME_PATH || PLATFORM_CHROME[process.platform];
  if (!executablePath || !fs.existsSync(executablePath)) throw new Error(`Chrome not found (set LOCAL_CHROME_PATH). Tried: ${executablePath}`);
  return puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--font-render-hinting=none"] });
}

export interface RenderedFile {
  png: string;
  jpg: string;
}

export async function renderSpecs(
  browser: Browser,
  specs: SlideSpec[],
  outDir: string,
  size: { w: number; h: number },
  baseName: (s: SlideSpec, i: number) => string,
): Promise<RenderedFile[]> {
  fs.mkdirSync(outDir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 });
  const out: RenderedFile[] = [];
  try {
    for (const [i, s] of specs.entries()) {
      await page.setContent(slideHtml(s, size.w, size.h), { waitUntil: "load", timeout: 30_000 });
      const fontsOk = await page.evaluate(async () => {
        // Faces load lazily (only when used); force every family so the check is meaningful.
        const specs = ["700 64px Fraunces", "400 32px Geist", "500 32px 'Geist Mono'", "600 32px Oswald"];
        await Promise.all(specs.map((s) => document.fonts.load(s).catch(() => [])));
        await document.fonts.ready;
        return document.fonts.check("700 64px Fraunces") && document.fonts.check("400 32px Geist") && document.fonts.check("500 32px 'Geist Mono'");
      });
      if (!fontsOk) throw new Error("render_fonts_missing: Fraunces/Geist did not load (network?) — refusing to ship fallback fonts");
      const overflow = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("[data-fit]"))
          .filter((el) => {
            // Content must end above the footer band (bottom 100px).
            const kids = Array.from(el.querySelectorAll<HTMLElement>("*"));
            const bottom = Math.max(el.getBoundingClientRect().top, ...kids.map((k) => k.getBoundingClientRect().bottom));
            const textBottom = el.children.length ? bottom : el.getBoundingClientRect().bottom;
            // Clipping only matters on containers that hide overflow (glyph descenders on a 1.0
            // line-height headline report a few px of "overflow" that is fully visible).
            const clips = getComputedStyle(el).overflow === "hidden";
            return (clips && el.scrollHeight > el.clientHeight + 2) || textBottom > window.innerHeight - 100;
          })
          .map((el) => el.className || el.tagName),
      );
      if (overflow.length) throw new Error(`render_overflow on ${s.kind} slide ${s.index}: ${overflow.join(", ")}`);
      const base = path.join(outDir, baseName(s, i));
      const png = `${base}.png`;
      await page.screenshot({ path: png as `${string}.png`, type: "png", clip: { x: 0, y: 0, width: size.w, height: size.h } });
      const jpg = `${base}.jpg`;
      await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(jpg);
      out.push({ png, jpg });
    }
  } finally {
    await page.close();
  }
  return out;
}

/** Weekly review sheet: one row per slot, thumbnails at 1/5 scale. */
export async function contactSheet(rows: string[][], outFile: string): Promise<string> {
  const tw = 216;
  const th = 270;
  const gap = 12;
  const cols = Math.max(1, ...rows.map((r) => r.length));
  const width = cols * (tw + gap) + gap;
  const height = rows.length * (th + gap) + gap;
  const composites: OverlayOptions[] = [];
  for (const [ri, r] of rows.entries()) {
    for (const [ci, file] of r.entries()) {
      const buf = await sharp(file).resize(tw, th, { fit: "contain", background: "#E2DED6" }).toBuffer();
      composites.push({ input: buf, left: gap + ci * (tw + gap), top: gap + ri * (th + gap) });
    }
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp({ create: { width, height, channels: 3, background: "#0A0908" } }).composite(composites).jpeg({ quality: 85 }).toFile(outFile);
  return outFile;
}
