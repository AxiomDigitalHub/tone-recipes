/**
 * Assets V3 → 1080p motion clips via Grok Imagine Video + ffmpeg upscale.
 *
 * Pipeline (the chosen direction): Grok i2v @ 720p → Lanczos upscale to 1080p.
 * 6s, 16:9, subtle natural motion. ~$0.30/clip → 7 clips ≈ $2.10.
 *
 *   npx tsx scripts/generate-clips-v3.ts            # run
 *   npx tsx scripts/generate-clips-v3.ts --dry-run  # crop + plan only
 *
 * Env: REPLICATE_API_TOKEN (from .env.local).
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

const ASSETS = "/Users/daniellivengood/Downloads/Assets V3";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "v3");
const HD_DIR = path.join(OUT_DIR, "1080");        // final 1080p deliverables
const TMP_DIR = path.join(OUT_DIR, "_cropped16x9");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";

const GROK = "xai/grok-imagine-video";
const DURATION = 6;
const GROK_PER_SEC = 0.05;

interface Shot { file: string; label: string; prompt: string; }

const SHOTS: Shot[] = [
  {
    file: "DBBV_v3_buying lunch 1.png",
    label: "lunch1_laughing",
    prompt:
      "Subtle slow push-in on two businesswomen enjoying lunch at a restaurant. They laugh and chat naturally with slight head and hand movements as they eat, one lifts her fork. Background diners move softly, warm window light. Gentle stabilized camera, photorealistic, no warping faces.",
  },
  {
    file: "DBBV_v3_buying lunch 2.png",
    label: "lunch2_payment",
    prompt:
      "Gentle push-in as the seated businesswoman hands a payment card on a check presenter to the waiter. Natural hand motion completing the handoff, she smiles warmly; the waiter's arm steadies the bill folder. Soft restaurant bokeh behind, warm light, photorealistic, no warping.",
  },
  {
    file: "DBBV_v3_buying lunch 3.png",
    label: "lunch3_handshake",
    prompt:
      "Two businesswomen share a warm congratulatory handshake across the lunch table, hands clasping and shaking naturally as they smile and make eye contact. Subtle background diner movement, warm window light. Slow gentle push-in, photorealistic, stable, no warping.",
  },
  {
    file: "DBBV_v3_buying lunch 4.png",
    label: "lunch4_handshake",
    prompt:
      "Warm handshake between two businesswomen across a restaurant table, hands clasping naturally, both smiling. Pendant lights glow softly, background patrons move faintly. Slow cinematic push-in, photorealistic, no warping faces.",
  },
  {
    file: "DBBV_V2_S02_Manufacture-before.png",
    label: "mfg_before_portrait",
    prompt:
      "Quiet near-still portrait of the seated workshop foreman. He breathes and shifts slightly with a soft natural smile and a gentle blink; faint steam rises from the mug, soft window light. Very gentle slow push-in, locked-off feel, photorealistic, no warping.",
  },
  {
    file: "DBBV_V2_S02_Manufacture-during.png",
    label: "mfg_during_handshake",
    prompt:
      "The foreman shakes hands with a young mechanic in a busy auto repair shop, a friendly handshake completing naturally as both smile. In the background, workers move around a vehicle and a woman with a clipboard walks in. Gentle camera glide, daylight from the open bay doors, photorealistic, no warping.",
  },
  {
    file: "ChatGPT Image May 31, 2026, 07_18_34 PM.png",
    label: "overload_stress",
    prompt:
      "A woman seen from behind clutches her head in frustration at her desk, shoulders rising with a heavy sigh and slight movement. The laptop screen glows and flickers faintly, steam drifts from the mug, soft daylight through the window. Subtle slow push-in, somber mood, photorealistic, no warping.",
  },
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
  let est = 0;
  console.log(`\nAssets V3 → ${OUT_DIR}`);
  console.log(`Model: ${GROK} @ 720p → ffmpeg upscale 1080p | ${DURATION}s | 16:9\n`);

  for (const shot of SHOTS) {
    const src = path.join(ASSETS, shot.file);
    if (!fs.existsSync(src)) { console.error(`  MISSING: ${src}`); continue; }
    const cropped = path.join(TMP_DIR, `${shot.label}.png`);
    cropTo16x9(src, cropped);
    console.log(`▶ ${shot.label}  (${shot.file})`);
    if (DRY_RUN) { console.log(`    [dry-run] ${shot.prompt.slice(0, 70)}…`); est += GROK_PER_SEC * DURATION; continue; }
    try {
      const out = await runPrediction(GROK, {
        image: toDataURI(cropped), prompt: shot.prompt,
        duration: DURATION, aspect_ratio: "16:9", resolution: "720p",
      });
      const raw = path.join(OUT_DIR, `${shot.label}_grok.mp4`);
      const hd = path.join(HD_DIR, `${shot.label}_1080.mp4`);
      await download(out, raw);
      upscale(raw, hd);
      est += GROK_PER_SEC * DURATION;
      console.log(`    ✓ ${path.basename(hd)}`);
    } catch (e) {
      console.error(`    ✗ ${shot.label} failed: ${(e as Error).message}`);
    }
  }
  console.log(`\nDone. Estimated spend ≈ $${est.toFixed(2)}  |  clips in ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
