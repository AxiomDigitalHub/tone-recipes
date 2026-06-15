/**
 * Redo the V1 "timesheets" beat per client note: she must be USING her computer
 * in Excel, not pen & paper. Reimagine the frame (hands on keyboard, eyes on the
 * Excel screen, no pen/paper) → Grok-animate the typing. Same 2-stage approach as
 * before-redo.ts.
 *
 *   --stage=frame    nano-banana reimagined start frame (review first)
 *   --stage=animate  Grok animate → upscale 1080p
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

const SRC = "/Users/daniellivengood/Downloads/Assets V1/DBBV_S02_Timesheets.png";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "v1");
const HD_DIR = path.join(OUT_DIR, "1080");
const VAR_DIR = path.join(OUT_DIR, "_variations");
const START = path.join(VAR_DIR, "timesheets_excel_start.png");
const RAW = path.join(OUT_DIR, "timesheets_excel_grok.mp4");
const HD = path.join(HD_DIR, "timesheets_excel_1080.mp4");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const NANO = "google/nano-banana-pro";
const GROK = "xai/grok-imagine-video";

const FRAME_PROMPT =
  "Keep the same woman (brown hair, navy cardigan) at the same home desk by the window, with the coffee mug, plant and laptop. Reframe her actively WORKING ON THE LAPTOP: both hands on the laptop's keyboard and trackpad, eyes on the screen, which clearly shows a Microsoft Excel spreadsheet timesheet. Remove the pen from her hand and remove the paper timesheet she was writing on — she is now doing her time tracking on the computer in Excel, not on paper. Focused, engaged posture, warm natural window light, photorealistic.";

const ANIMATE_PROMPT =
  "The woman works in the Excel spreadsheet on her laptop — fingers typing on the keyboard and using the trackpad, eyes scanning across the screen, a small focused nod as she reviews and enters the timesheet data. Natural computer-work hand and finger motion, warm window light. Gentle slow push-in, photorealistic, no warping; she is using the computer, not writing on paper.";

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
    console.log(`✓ ${START}\nReview, then: npx tsx scripts/timesheets-redo.ts --stage=animate`);
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
