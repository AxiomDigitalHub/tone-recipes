/**
 * "No Limits" variations from DBBV_S20_NoLimits.png.
 * Two new clips, each with a TABLET in her hand showing an upward business-
 * growth chart. (i2v starts at the input frame, so the device + chart must be
 * baked into a start frame first via nano-banana, then animated by Grok.)
 *   A = nolimits_calm  : same framing, minimal movement
 *   B = nolimits_angle : a different camera angle
 *
 * Gated:
 *   --stage=frames   nano-banana edits → start frames (review before animating)
 *   --stage=animate  Grok i2v from each start frame → upscale 1080p
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
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1];
const TAG = (process.argv.find((a) => a.startsWith("--tag=")) || "").split("=")[1] || "";
const stage = (process.argv.find((a) => a.startsWith("--stage=")) || "--stage=frames").split("=")[1];

const SRC = "/Users/daniellivengood/Downloads/Assets V1/DBBV_S20_NoLimits.png";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "v1");
const HD_DIR = path.join(OUT_DIR, "1080");
const VAR_DIR = path.join(OUT_DIR, "_variations");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const NANO = "google/nano-banana-pro";
const GROK = "xai/grok-imagine-video";
const NOWARP = "photorealistic, no warping faces or hands";

interface Variation { label: string; framePrompt: string; animatePrompt: string; }

const GROWTH = "she holds a tablet in her hands; on the tablet screen is a clean business dashboard with a clearly upward-trending revenue growth line chart (rising up and to the right) and a green positive percentage";

const VARIATIONS: Variation[] = [
  {
    label: "nolimits_calm",
    framePrompt: `Keep this exact scene, the same woman in the navy blouse, the same colleague, the same bright modern open office, lighting and composition — but now ${GROWTH}. She holds the tablet naturally at chest height as if proudly showing it, a confident smile. Same framing. Photorealistic, realistic tablet UI.`,
    animatePrompt: `Near-locked-off shot, minimal movement. The woman holds the tablet showing the upward growth chart and glances down at it with a confident smile, a slight nod and a natural blink. The chart stays legible. Barely any camera motion, background coworkers move faintly. ${NOWARP}.`,
  },
  {
    label: "nolimits_angle",
    framePrompt: `The same woman in the navy blouse in the same bright modern open office, same wardrobe and lighting, but from a DIFFERENT camera angle: an over-the-shoulder three-quarter view from beside and slightly behind her so the tablet she holds is clearly facing the viewer, and ${GROWTH}. A colleague faces her across the frame. Photorealistic, realistic tablet UI.`,
    animatePrompt: `Gentle slow push-in from this over-the-shoulder angle as the woman presents the tablet; the upward growth chart is clearly visible on screen and ticks slightly higher. She gestures subtly toward her colleague with a confident smile, soft office light, background activity. The chart stays legible. ${NOWARP}.`,
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
  fs.mkdirSync(VAR_DIR, { recursive: true });
  fs.mkdirSync(HD_DIR, { recursive: true });
  const base = path.join(VAR_DIR, "_nolimits_base16x9.png");
  cropTo16x9(SRC, base);

  if (stage === "frames") {
    for (const v of VARIATIONS) {
      console.log(`▶ frame: ${v.label}`);
      const out = await runPrediction(NANO, {
        prompt: v.framePrompt, image_input: [toDataURI(base)],
        aspect_ratio: "16:9", output_format: "png",
      });
      await download(out, path.join(VAR_DIR, `${v.label}_start.png`));
      console.log(`    ✓ ${v.label}_start.png`);
    }
    console.log(`\nReview frames in ${VAR_DIR}, then: npx tsx scripts/nolimits-variations.ts --stage=animate`);
    return;
  }

  if (stage === "animate") {
    for (const v of VARIATIONS) {
      if (ONLY && v.label !== ONLY) continue;
      const start = path.join(VAR_DIR, `${v.label}_start.png`);
      if (!fs.existsSync(start)) { console.error(`  missing ${v.label}_start.png — run --stage=frames`); continue; }
      console.log(`▶ animate: ${v.label}${TAG}`);
      const out = await runPrediction(GROK, {
        image: toDataURI(start), prompt: v.animatePrompt,
        duration: 6, aspect_ratio: "16:9", resolution: "720p",
      });
      const raw = path.join(OUT_DIR, `${v.label}${TAG}_grok.mp4`);
      await download(out, raw);
      upscale(raw, path.join(HD_DIR, `${v.label}${TAG}_1080.mp4`));
      console.log(`    ✓ ${v.label}${TAG}_1080.mp4`);
    }
    return;
  }
  throw new Error(`unknown --stage=${stage}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
