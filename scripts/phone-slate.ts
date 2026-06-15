/**
 * Generate a clean "phone + UI" slate on greenscreen for compositing the
 * money-shot fly-in. Isolates the phone (with its real DATABASICS UI) from the
 * money-shot still and places it on a chroma-key green background — keyable,
 * so the UI is composited (never regenerated) and stays pixel-perfect.
 *
 *   npx tsx scripts/phone-slate.ts
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
const NANO = "google/nano-banana-pro";
const V5 = "/Users/daniellivengood/Downloads/DBBV_clips/v5";
const SRC = path.join(V5, "Gemini_Generated_Image_3ynpmr3ynpmr3ynp copy.jpg");
const OUT = path.join(V5, "_slates", "phone_greenscreen.png");

const PROMPT =
  "Isolate ONLY the smartphone from this image and place it centered on a solid, uniform, bright chroma-key green background (#00b140), nothing else in frame — no hand, no construction, no other objects. Keep the phone's screen showing the exact same DATABASICS app dashboard, clean, sharp and legible, identical UI. Show the full phone at a slight three-quarter angle with even soft studio lighting and a subtle drop shadow on the green. The green must be flat and uniform for chroma keying.";

const toDataURI = (file: string) => {
  const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
  return `data:image/${ext};base64,${fs.readFileSync(file).toString("base64")}`;
};

async function run(): Promise<string> {
  const res = await fetch(`https://api.replicate.com/v1/models/${NANO}/predictions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: { prompt: PROMPT, image_input: [toDataURI(SRC)], aspect_ratio: "16:9", output_format: "png" } }),
  });
  const body = await res.json();
  if (!body.id) throw new Error(`start failed: ${JSON.stringify(body)}`);
  console.log(`  prediction ${body.id} started…`);
  for (let i = 0; i < 120; i++) {
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
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const url = await run();
  fs.writeFileSync(OUT, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log(`✓ ${OUT}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
