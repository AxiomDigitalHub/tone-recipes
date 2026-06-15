/**
 * Opening shot — Grok takes of the two beats (walk-in, wave) from the same
 * start frames used for the Veo run. Grok @720p → ffmpeg upscale 1080p, 6s, 16:9.
 *
 *   npx tsx scripts/opening-grok.ts [--only=walkin|wave]
 */

import fs from "fs";
import path from "path";
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

const V5 = "/Users/daniellivengood/Downloads/DBBV_clips/v5";
const FRAMES = path.join(V5, "_openframes");
const HD_DIR = path.join(V5, "1080");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const GROK = "xai/grok-imagine-video";

interface Shot { label: string; frame: string; prompt: string; }
const SHOTS: Shot[] = [
  { label: "open_walkin_grok", frame: "walkin.png",
    prompt: "A man in a blue sweater with a leather messenger bag walks forward and pushes through the glass office doors into a bright modern lobby, a relaxed confident stride toward the camera. Natural human walking motion, the door swings gently, soft daylight, plants and glass-walled offices behind. Subtle handheld camera, photorealistic, no warping." },
  { label: "open_walkin2_grok", frame: "walkin2.png",
    prompt: "A man in a blue sweater with a leather messenger bag walks into work — stepping through the glass office doors into the bright modern lobby with a relaxed, confident stride, heading in to start his day. Natural human walking motion, the door swings gently, soft daylight, plants and glass-walled offices around him. Subtle handheld camera, photorealistic, no warping." },
  { label: "open_wave_grok", frame: "wave.png",
    prompt: "A man in a blue sweater with a messenger bag walks up to the reception desk and clearly raises his free hand to wave hello — a friendly hand wave, palm open, moving side to side — smiling warmly at the receptionist in the foreground. The wave is obvious and completes naturally. Bright modern open office with desks behind. Photorealistic, natural human motion, no warping." },
];

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
  fs.mkdirSync(HD_DIR, { recursive: true });
  const shots = ONLY ? SHOTS.filter((s) => s.label.includes(ONLY)) : SHOTS;
  for (const shot of shots) {
    console.log(`▶ ${shot.label}`);
    try {
      const out = await runPrediction(GROK, {
        image: toDataURI(path.join(FRAMES, shot.frame)),
        prompt: shot.prompt, duration: 6, aspect_ratio: "16:9", resolution: "720p",
      });
      const raw = path.join(V5, `${shot.label}.mp4`);
      await download(out, raw);
      upscale(raw, path.join(HD_DIR, `${shot.label}_1080.mp4`));
      console.log(`    ✓ ${shot.label}_1080.mp4`);
    } catch (e) { console.error(`    ✗ ${shot.label} failed: ${(e as Error).message}`); }
  }
  console.log("Done.");
}
main().catch((e) => { console.error(e); process.exit(1); });
