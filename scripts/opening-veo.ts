/**
 * Opening shot — fresh Veo 3.1 Fast takes of the two beats (walk-in, wave),
 * animated from start frames pulled out of the existing v5 opening clip.
 * Veo is the strongest engine for human walking/waving. Native 1080p, 6s, audio off.
 *
 *   npx tsx scripts/opening-veo.ts [--only=walkin|wave]
 */

import fs from "fs";
import path from "path";

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
const VEO = "google/veo-3.1-fast";
const NEG = "warped face, distorted hands, unnatural gait, morphing, extra limbs, floating, stiff robotic motion";

interface Shot { label: string; frame: string; prompt: string; }
const SHOTS: Shot[] = [
  { label: "open_walkin_veo", frame: "walkin.png",
    prompt: "A man in a blue sweater with a leather messenger bag walks forward and pushes through the glass office doors into a bright modern lobby, a relaxed confident stride toward the camera. Natural human walking motion, the door swings gently, soft daylight, plants and glass-walled offices behind. Subtle handheld camera, photorealistic, no warping." },
  { label: "open_wave_veo", frame: "wave.png",
    prompt: "A man in a blue sweater with a messenger bag walks up to the reception desk and raises his hand in a friendly wave hello, smiling warmly at the receptionist in the foreground. The wave gesture rises and completes naturally and smoothly. Bright modern open office with desks behind. Photorealistic, natural human motion, no warping." },
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

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");
  fs.mkdirSync(HD_DIR, { recursive: true });
  const shots = ONLY ? SHOTS.filter((s) => s.label.includes(ONLY)) : SHOTS;
  for (const shot of shots) {
    console.log(`▶ ${shot.label}`);
    try {
      const out = await runPrediction(VEO, {
        image: toDataURI(path.join(FRAMES, shot.frame)),
        prompt: shot.prompt, duration: 6, resolution: "1080p",
        aspect_ratio: "16:9", generate_audio: false, negative_prompt: NEG,
      });
      await download(out, path.join(HD_DIR, `${shot.label}_1080.mp4`));
      console.log(`    ✓ ${shot.label}_1080.mp4`);
    } catch (e) { console.error(`    ✗ ${shot.label} failed: ${(e as Error).message}`); }
  }
  console.log("Done.");
}
main().catch((e) => { console.error(e); process.exit(1); });
