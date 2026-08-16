/**
 * Reusable: animate ONE start frame with Grok + a given prompt, then upscale 1080p.
 * Raw goes next to the input; 1080p goes in <input dir>/1080/.
 *
 *   npx tsx scripts/animate-frame.ts <input.png> <outLabel> "<prompt>"
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
const [INPUT, LABEL, PROMPT] = [process.argv[2], process.argv[3], process.argv[4]];
const GROK = "xai/grok-imagine-video";
const VEO = "google/veo-3.1-fast";
const USE_VEO = process.argv.includes("--veo"); // native 1080p, no upscale
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";

const toDataURI = (file: string) => {
  const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
  return `data:image/${ext};base64,${fs.readFileSync(file).toString("base64")}`;
};

async function run(): Promise<string> {
  const model = USE_VEO ? VEO : GROK;
  const input = USE_VEO
    ? { image: toDataURI(INPUT), prompt: PROMPT, duration: 6, resolution: "1080p", aspect_ratio: "16:9", generate_audio: false, negative_prompt: "warped hand or phone, morphing, screen reflections, glare, content on the green screen" }
    : { image: toDataURI(INPUT), prompt: PROMPT, duration: 6, aspect_ratio: "16:9", resolution: "720p" };
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

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");
  if (!INPUT || !LABEL || !PROMPT) throw new Error('usage: animate-frame.ts <input.png> <label> "<prompt>"');
  const dir = path.dirname(INPUT);
  const hdDir = path.join(dir, "1080");
  fs.mkdirSync(hdDir, { recursive: true });
  const hd = path.join(hdDir, `${LABEL}_1080.mp4`);
  const out = await run();
  if (USE_VEO) {
    // Veo is native 1080p — download straight to the HD path, no upscale.
    fs.writeFileSync(hd, Buffer.from(await (await fetch(out)).arrayBuffer()));
  } else {
    const raw = path.join(dir, `${LABEL}_grok.mp4`);
    fs.writeFileSync(raw, Buffer.from(await (await fetch(out)).arrayBuffer()));
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", raw, "-vf", "scale=1920:1080:flags=lanczos",
      "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", hd]);
  }
  console.log(`✓ ${hd}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
