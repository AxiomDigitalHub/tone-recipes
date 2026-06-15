/**
 * Brand "money shot" options — animate the DATABASICS hand+phone+construction
 * still with BOTH Veo 3.1 Fast (native 1080p) and Grok (720p→upscale) so we can
 * compare against the existing v5 take. 6s, 16:9, audio off.
 *
 * The phone's app UI is the whole shot — prompts keep it crisp/locked while the
 * construction background carries the motion.
 *
 *   npx tsx scripts/moneyshot-options.ts [--dry-run] [--only=veo|grok]
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
const DRY = process.argv.includes("--dry-run");

const V5 = "/Users/daniellivengood/Downloads/DBBV_clips/v5";
const SRC = path.join(V5, "Gemini_Generated_Image_3ynpmr3ynpmr3ynp copy.jpg");
const HD_DIR = path.join(V5, "1080");
const CROP = path.join(V5, "_moneyshot16x9.png");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";

const VEO = "google/veo-3.1-fast";
const GROK = "xai/grok-imagine-video";

const PROMPT =
  "Cinematic brand hero shot: a hand holds a smartphone displaying a crisp app dashboard, in front of an out-of-focus steel-frame construction site at golden hour. Subtle handheld float and a very gentle push-in. Behind the phone, construction workers move, a crane turns slowly, warm sunset light flares softly and fine dust drifts through the air. The phone and its on-screen app interface stay perfectly sharp, legible, and unchanged — do not alter or warp the screen UI. Shallow depth of field, premium commercial look, photorealistic, no warping of the hand or phone.";

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
const toDataURI = (file: string) => {
  const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
  return `data:image/${ext};base64,${fs.readFileSync(file).toString("base64")}`;
};

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
  cropTo16x9(SRC, CROP);
  const img = toDataURI(CROP);
  console.log(`Money-shot options → ${HD_DIR}\n`);

  if (ONLY !== "grok") {
    console.log("▶ Veo 3.1 Fast (native 1080p)");
    if (!DRY) try {
      const out = await runPrediction(VEO, {
        image: img, prompt: PROMPT, duration: 6, resolution: "1080p",
        aspect_ratio: "16:9", generate_audio: false,
        negative_prompt: "warped phone screen, distorted UI, morphing text, melting interface, warped hand",
      });
      await download(out, path.join(HD_DIR, "moneyshot_veo_1080.mp4"));
      console.log("    ✓ moneyshot_veo_1080.mp4");
    } catch (e) { console.error(`    ✗ Veo failed: ${(e as Error).message}`); }
  }

  if (ONLY !== "veo") {
    console.log("▶ Grok (720p → upscale)");
    if (!DRY) try {
      const out = await runPrediction(GROK, {
        image: img, prompt: PROMPT, duration: 6, aspect_ratio: "16:9", resolution: "720p",
      });
      const raw = path.join(V5, "moneyshot_grok.mp4");
      await download(out, raw);
      upscale(raw, path.join(HD_DIR, "moneyshot_grok_1080.mp4"));
      console.log("    ✓ moneyshot_grok_1080.mp4");
    } catch (e) { console.error(`    ✗ Grok failed: ${(e as Error).message}`); }
  }
  console.log("\nDone.");
}
main().catch((e) => { console.error(e); process.exit(1); });
