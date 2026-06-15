/**
 * Assets V1 → 1080p motion clips via Grok Imagine Video + ffmpeg upscale.
 * The protagonist arc: timesheets → frustration → no-limits → the difference.
 * Grok i2v @720p → Lanczos 1080p, 6s, 16:9. 4 clips ≈ $1.20.
 *
 *   npx tsx scripts/generate-clips-v1.ts [--dry-run] [--only=label,label]
 */

import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (!m) continue;
    const val = m[2].replace(/^["']|["']$/g, "");
    if (val) process.env[m[1]] = val;
  }
}

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1];

const ASSETS = "/Users/daniellivengood/Downloads/Assets V1";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "v1");
const HD_DIR = path.join(OUT_DIR, "1080");
const TMP_DIR = path.join(OUT_DIR, "_cropped16x9");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const GROK = "xai/grok-imagine-video";
const DURATION = 6;
const GROK_PER_SEC = 0.05;
const NOWARP = "photorealistic, stable framing, no warping faces or hands";

interface Shot { file: string; label: string; prompt: string; }

const SHOTS: Shot[] = [
  { file: "DBBV_S02_Timesheets.png", label: "timesheets",
    prompt: `A woman at her home desk fills out a paper timesheet by hand next to a laptop showing a spreadsheet, focused and a little weary; she writes and glances at the screen which glows softly, steam drifts from her mug, soft daylight and a plant behind. Subtle slow push-in, ${NOWARP}.` },
  { file: "DBBV_S08_DIYFrustration.png", label: "diy_frustration",
    prompt: `A woman at her laptop presses a hand to her forehead with eyes closed, a frustrated sigh and slight slump; the screen glows, warm sunset light through the window behind, a mug on the desk. Subtle slow push-in, somber mood, ${NOWARP}.` },
  { file: "DBBV_S20_NoLimits.png", label: "nolimits",
    prompt: `A confident woman stands in a bright modern open office talking with a colleague, gesturing warmly with a smile; background coworkers move at their desks, sunlight through large windows, plants. Gentle slow push-in, ${NOWARP}.` },
  { file: "DBBV_S21_TheDifference.png", label: "thedifference",
    prompt: `A woman at her home desk holds a coffee mug and smiles contentedly toward the camera, relaxed with a natural blink and slight movement; beside her a laptop shows a clean dashboard glowing softly, soft daylight, plant and window behind. Very gentle slow push-in, ${NOWARP}.` },
];

function cropTo16x9(src: string, dest: string): void {
  const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", src], { encoding: "utf-8" });
  const w = Number(dims.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const h = Number(dims.match(/pixelHeight:\s*(\d+)/)?.[1]);
  const targetW = Math.round((h * 16) / 9);
  const cropW = Math.min(w, targetW);
  const cropH = cropW === w ? Math.round((w * 9) / 16) : h;
  fs.copyFileSync(src, dest);
  execFileSync("sips", ["-c", String(cropH), String(cropW), dest], { stdio: "ignore" });
}

const toDataURI = (file: string) => `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;

async function runPrediction(model: string, input: Record<string, unknown>): Promise<string> {
  let id = "";
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const body = await res.json();
    if (body.id) { id = body.id; break; }
    if (res.status === 402) throw new Error(`PAYMENT REQUIRED: ${JSON.stringify(body)}`);
    const wait = body.retry_after ?? 10;
    console.log(`    ...throttled/err (${res.status}), waiting ${wait}s (${attempt + 1}/8)`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
  if (!id) throw new Error("Failed to start prediction");
  console.log(`    prediction ${id} started, polling…`);
  for (let i = 0; i < 240; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const s = await (await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })).json();
    if (s.status === "succeeded") { const o = s.output; return Array.isArray(o) ? o[0] : o; }
    if (s.status === "failed" || s.status === "canceled") throw new Error(`${s.status}: ${s.error}`);
  }
  throw new Error("timed out");
}

async function download(url: string, dest: string): Promise<void> {
  fs.writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
}

function upscale(src: string, dest: string): void {
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", src,
    "-vf", "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-crf", "18",
    "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", dest]);
}

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(HD_DIR, { recursive: true });
  const only = ONLY ? new Set(ONLY.split(",")) : null;
  const shots = only ? SHOTS.filter((s) => only.has(s.label)) : SHOTS;
  let est = 0, ok = 0, fail = 0;
  console.log(`\nAssets V1 → ${OUT_DIR}`);
  console.log(`${shots.length} shots | ${GROK} @720p → 1080p | ${DURATION}s | 16:9\n`);

  for (const shot of shots) {
    const src = path.join(ASSETS, shot.file);
    if (!fs.existsSync(src)) { console.error(`  MISSING: ${shot.file}`); fail++; continue; }
    const cropped = path.join(TMP_DIR, `${shot.label}.png`);
    cropTo16x9(src, cropped);
    console.log(`▶ ${shot.label}`);
    if (DRY_RUN) { est += GROK_PER_SEC * DURATION; continue; }
    try {
      const out = await runPrediction(GROK, {
        image: toDataURI(cropped), prompt: shot.prompt,
        duration: DURATION, aspect_ratio: "16:9", resolution: "720p",
      });
      const raw = path.join(OUT_DIR, `${shot.label}_grok.mp4`);
      const hd = path.join(HD_DIR, `${shot.label}_1080.mp4`);
      await download(out, raw);
      upscale(raw, hd);
      est += GROK_PER_SEC * DURATION; ok++;
      console.log(`    ✓ ${shot.label}_1080.mp4`);
    } catch (e) {
      console.error(`    ✗ ${shot.label} failed: ${(e as Error).message}`); fail++;
    }
  }
  console.log(`\nDone. ok=${ok} fail=${fail} | est ≈ $${est.toFixed(2)} | ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
