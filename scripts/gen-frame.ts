/**
 * Reusable: generate a high-quality still via nano-banana-pro from one or more
 * reference images + a prompt. Pairs with animate-frame.ts (gen-frame → review →
 * animate-frame).
 *
 *   npx tsx scripts/gen-frame.ts "<ref1.png[,ref2.png,...]>" <out.png> "<prompt>"
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
const [REFS, OUT, PROMPT] = [process.argv[2], process.argv[3], process.argv[4]];
const NANO = "google/nano-banana-pro";

const toDataURI = (file: string) => {
  const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
  return `data:image/${ext};base64,${fs.readFileSync(file.trim()).toString("base64")}`;
};

async function run(): Promise<string> {
  const images = REFS.split(",").map(toDataURI);
  const res = await fetch(`https://api.replicate.com/v1/models/${NANO}/predictions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: { prompt: PROMPT, image_input: images, aspect_ratio: "16:9", output_format: "png" } }),
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
  if (!REFS || !OUT || !PROMPT) throw new Error('usage: gen-frame.ts "<ref1[,ref2]>" <out.png> "<prompt>"');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const url = await run();
  fs.writeFileSync(OUT, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log(`✓ ${OUT}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
