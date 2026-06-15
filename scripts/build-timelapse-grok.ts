/**
 * S41 construction build-up timelapse (1 story → 3 stories) via Grok.
 *
 * Two gated stages (image-to-video starts at the input frame, so we must first
 * fabricate an early-construction START frame, then animate the rise):
 *
 *   Stage 1:  npx tsx scripts/build-timelapse-grok.ts --stage=start
 *             flux-kontext-pro edits finished S41 → 1-story under-construction
 *             start frame. Review it before spending on video.
 *
 *   Stage 2:  npx tsx scripts/build-timelapse-grok.ts --stage=animate
 *             Grok image-to-video from the start frame with a build-up prompt,
 *             then ffmpeg upscale 720p → 1080p.
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
const stage = (process.argv.find((a) => a.startsWith("--stage=")) || "--stage=start").split("=")[1];
const editor = (process.argv.find((a) => a.startsWith("--editor=")) || "--editor=nano").split("=")[1];

const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "test");
const SRC_FRAME = path.join(OUT_DIR, "_cropped16x9", "S41_timelapse.png"); // 16:9 finished building
const START_FRAME = path.join(OUT_DIR, "S41_start_1story.png");
const GROK_OUT = path.join(OUT_DIR, "S41_buildup_grok.mp4");
const GROK_1080 = path.join(OUT_DIR, "S41_buildup_grok_1080.mp4");

const KONTEXT = "black-forest-labs/flux-kontext-pro";
const NANO = "google/nano-banana-pro";
const GROK = "xai/grok-imagine-video";

const START_PROMPT =
  "Edit this photo so the building is only ONE single story tall. Completely erase the second and third floors so there is open golden-hour sky above a single ground-floor level. That one story is mid-construction: exposed steel framing, concrete columns, and scaffolding around the ground floor only. Keep the identical camera angle and composition, the same two construction workers in orange hi-vis vests in the foreground looking up, the same anchor-logo banner on the site fence, the same sunset sky, lighting, street, and surroundings. Photorealistic active construction site, low single-story structure.";

const ANIMATE_PROMPT =
  "Construction time-lapse: the building rises floor by floor from one story up to three full stories. Steel framing goes up and blue-tinted glass panels are installed upward, scaffolding climbs the structure, a crane swings overhead, workers move quickly. Fast time-lapse construction motion; clouds streak across the golden-hour sky and shadows shift. The two hi-vis workers stay in the foreground looking up. Photorealistic cinematic construction time-lapse.";

function toDataURI(file: string): string {
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
}

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
    if (s.status === "succeeded") {
      const o = s.output;
      return Array.isArray(o) ? o[0] : o;
    }
    if (s.status === "failed" || s.status === "canceled") throw new Error(`${s.status}: ${s.error}`);
  }
  throw new Error("timed out");
}

async function download(url: string, dest: string): Promise<void> {
  fs.writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
}

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");

  if (stage === "start") {
    console.log(`Stage 1: generating 1-story start frame via ${editor === "nano" ? NANO : KONTEXT}…`);
    const input = editor === "nano"
      ? { prompt: START_PROMPT, image_input: [toDataURI(SRC_FRAME)], aspect_ratio: "16:9", output_format: "png" }
      : { prompt: START_PROMPT, input_image: toDataURI(SRC_FRAME), aspect_ratio: "match_input_image", output_format: "png", safety_tolerance: 2 };
    const out = await runPrediction(editor === "nano" ? NANO : KONTEXT, input);
    await download(out, START_FRAME);
    console.log(`✓ start frame → ${START_FRAME}`);
    console.log("Review it, then run:  npx tsx scripts/build-timelapse-grok.ts --stage=animate");
    return;
  }

  if (stage === "animate") {
    if (!fs.existsSync(START_FRAME)) throw new Error(`start frame missing — run --stage=start first`);
    console.log("Stage 2: Grok image-to-video build-up from start frame…");
    const out = await runPrediction(GROK, {
      image: toDataURI(START_FRAME),
      prompt: ANIMATE_PROMPT,
      duration: 6,
      aspect_ratio: "16:9",
      resolution: "720p",
    });
    await download(out, GROK_OUT);
    console.log(`✓ grok clip → ${GROK_OUT}`);
    // Upscale 720p → 1080p
    const ff = "/opt/homebrew/bin/ffmpeg";
    const bin = fs.existsSync(ff) ? ff : "ffmpeg";
    execFileSync(bin, ["-y", "-loglevel", "error", "-i", GROK_OUT,
      "-vf", "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-crf", "18",
      "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", GROK_1080]);
    console.log(`✓ upscaled → ${GROK_1080}`);
    return;
  }

  throw new Error(`unknown --stage=${stage}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
