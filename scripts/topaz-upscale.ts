/**
 * Topaz AI upscale (Replicate topazlabs/video-upscale) for the watermark-removed
 * opening clip. Uploads the clean 720p source via the Files API, upscales to
 * 1080p at the native 24fps (no frame interpolation), downloads the result.
 *
 *   npx tsx scripts/topaz-upscale.ts <input.mp4> <output.mp4>
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
const INPUT = process.argv[2];
const OUTPUT = process.argv[3];
const MODEL = "topazlabs/video-upscale";

function toVideoDataURI(file: string): string {
  const b64 = fs.readFileSync(file).toString("base64");
  console.log(`  inlining ${(b64.length / 1e6).toFixed(1)}MB data URI`);
  return `data:video/mp4;base64,${b64}`;
}

async function runPrediction(input: Record<string, unknown>): Promise<string> {
  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  const body = await res.json();
  if (res.status === 402) throw new Error(`PAYMENT REQUIRED: ${JSON.stringify(body)}`);
  if (!body.id) throw new Error(`start failed (${res.status}): ${JSON.stringify(body)}`);
  console.log(`  prediction ${body.id} started, polling…`);
  for (let i = 0; i < 600; i++) {           // up to ~30 min
    await new Promise((r) => setTimeout(r, 3000));
    const s = await (await fetch(`https://api.replicate.com/v1/predictions/${body.id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })).json();
    if (i % 10 === 0) console.log(`    [${i * 3}s] ${s.status}`);
    if (s.status === "succeeded") { const o = s.output; return Array.isArray(o) ? o[0] : o; }
    if (s.status === "failed" || s.status === "canceled") throw new Error(`${s.status}: ${s.error}`);
  }
  throw new Error("timed out");
}

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");
  if (!INPUT || !OUTPUT) throw new Error("usage: topaz-upscale.ts <in.mp4> <out.mp4>");
  console.log(`Topaz upscale: ${INPUT} → ${OUTPUT} (1080p, 24fps)`);
  const url = toVideoDataURI(INPUT);
  const out = await runPrediction({ video: url, target_resolution: "1080p", target_fps: 24 });
  fs.writeFileSync(OUTPUT, Buffer.from(await (await fetch(out)).arrayBuffer()));
  console.log(`✓ saved → ${OUTPUT}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
