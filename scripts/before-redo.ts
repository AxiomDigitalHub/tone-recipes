/**
 * Redo the "before" beat (Manufacture-before) — small business, simple tools
 * working fine (VO: "simple tools work until you grow"). Reimagine the seated
 * portrait as the owner MID-TASK on manual tools (paper timesheet + calculator),
 * which both serves the line and gives purposeful motion to kill the AI tell.
 *
 *   --stage=frame    nano-banana reimagined start frame (review first)
 *   --stage=animate  Grok animate the action → upscale 1080p
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
const stage = (process.argv.find((a) => a.startsWith("--stage=")) || "--stage=frame").split("=")[1];

const SRC = "/Users/daniellivengood/Downloads/Assets V3/DBBV_V2_S02_Manufacture-before.png";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "v3");
const HD_DIR = path.join(OUT_DIR, "1080");
const VAR_DIR = path.join(OUT_DIR, "_variations");
const START = path.join(VAR_DIR, "mfg_before_redo_start.png");
const RAW = path.join(OUT_DIR, "mfg_before_redo_grok.mp4");
const HD = path.join(HD_DIR, "mfg_before_redo_1080.mp4");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const NANO = "google/nano-banana-pro";
const GROK = "xai/grok-imagine-video";

const FRAME_PROMPT =
  "Keep the same workshop foreman — the mustached man in navy coveralls — and the same small workshop with his red hard hat, mug and pegboard of tools. Reframe him actively mid-task doing simple manual record-keeping at his bench: a paper timesheet and ledger laid out, a desktop calculator, a clipboard and a couple of paper forms; he holds a pen and is writing entries, focused and content, a small-business owner comfortably keeping his books by hand. Slightly wider framing that shows the bench and the simple paper tools. Photorealistic, warm natural workshop light.";

const ANIMATE_PROMPT =
  "The workshop foreman writes figures on a paper timesheet at his bench and taps numbers into a desk calculator with his other hand, then glances up with a small satisfied nod — calmly keeping his books with simple tools. Natural purposeful hand movements, relaxed and in control. Gentle slow push-in, warm workshop light, photorealistic, no warping of the face or hands.";

const toDataURI = (file: string) => {
  const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
  return `data:image/${ext};base64,${fs.readFileSync(file).toString("base64")}`;
};

async function run(model: string, input: Record<string, unknown>): Promise<string> {
  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  const body = await res.json();
  if (!body.id) throw new Error(`start failed: ${JSON.stringify(body)}`);
  console.log(`  prediction ${body.id} started…`);
  for (let i = 0; i < 240; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const s = await (await fetch(`https://api.replicate.com/v1/predictions/${body.id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })).json();
    if (s.status === "succeeded") { const o = s.output; return Array.isArray(o) ? o[0] : o; }
    if (s.status === "failed" || s.status === "canceled") throw new Error(`${s.status}: ${s.error}`);
  }
  throw new Error("timed out");
}
async function download(url: string, dest: string) {
  fs.writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
}

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");
  fs.mkdirSync(VAR_DIR, { recursive: true });
  fs.mkdirSync(HD_DIR, { recursive: true });
  if (stage === "frame") {
    const out = await run(NANO, { prompt: FRAME_PROMPT, image_input: [toDataURI(SRC)], aspect_ratio: "16:9", output_format: "png" });
    await download(out, START);
    console.log(`✓ ${START}\nReview, then: npx tsx scripts/before-redo.ts --stage=animate`);
    return;
  }
  if (stage === "animate") {
    if (!fs.existsSync(START)) throw new Error("run --stage=frame first");
    const out = await run(GROK, { image: toDataURI(START), prompt: ANIMATE_PROMPT, duration: 6, aspect_ratio: "16:9", resolution: "720p" });
    await download(out, RAW);
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", RAW, "-vf", "scale=1920:1080:flags=lanczos",
      "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", HD]);
    console.log(`✓ ${HD}`);
    return;
  }
  throw new Error(`unknown stage ${stage}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
