/**
 * Assets V4 → 1080p motion clips via Grok Imagine Video + ffmpeg upscale.
 * Smart batch: 27 fresh (skips S39 + Manufacture before/during already done,
 * and the lower-res S10 dupe). Grok i2v @ 720p → Lanczos 1080p, 6s, 16:9.
 * ~$0.30/clip → ~$8.
 *
 *   npx tsx scripts/generate-clips-v4.ts [--dry-run]
 *
 * Screen/phone shots carry the highest text-warp risk — QC those first.
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
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1]; // comma labels

const ASSETS = "/Users/daniellivengood/Downloads/V4";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "v4");
const HD_DIR = path.join(OUT_DIR, "1080");        // final 1080p deliverables
const TMP_DIR = path.join(OUT_DIR, "_cropped16x9");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const GROK = "xai/grok-imagine-video";
const DURATION = 6;
const GROK_PER_SEC = 0.05;
const NOWARP = "photorealistic, stable framing, no warping faces or hands";
const SCREEN = "Very subtle motion; the on-screen text stays legible and unchanged. ";

interface Shot { file: string; label: string; prompt: string; }

const SHOTS: Shot[] = [
  { file: "DBBV_V2_S07_Grow_Construction.png", label: "grow_construction",
    prompt: `Two construction workers review plans at a steel-frame build site at sunset; they gesture and glance up at the structure, a crane moves slowly behind, warm golden light and dust drift. Gentle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S08_Complications_Construction.png", label: "comp_construction",
    prompt: `A hi-vis construction worker studies his tablet at a timber-frame site, brow furrowed, glancing up with slight concern; background workers move, dust drifts in daylight. Subtle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S09_Complications_Healthcare_openai.png", label: "comp_healthcare",
    prompt: `Two nurses at a hospital station quietly read a clipboard together, both looking down at the page with slight concern. They do NOT talk — mouths stay closed, no speaking or dialogue. Only subtle motion: a small head tilt, a page settling, hallway staff moving softly behind. Gentle slow push-in, ${NOWARP}, mouths closed, not speaking.` },
  { file: "DBBV_V2_S10_Complications_Manufacturing_openai.png", label: "comp_manufacturing",
    prompt: `A manufacturing worker in a red hard hat types on a laptop at a metal desk on the factory floor, focused with a slight frown; the laptop glows faintly, machinery and a coworker move softly behind. Subtle slow push-in, ${NOWARP}.` },
  { file: "ChatGPT Image May 31, 2026, 07_40_28 PM.png", label: "construction_handshake_hero",
    prompt: `Two construction workers shake hands in front of a steel-frame building at golden-hour sunset, the handshake completing naturally as both stand confidently; clouds drift, a crane rests behind, warm rim light. Slow cinematic push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S15_SubList_VisaCard.png", label: "contactless_payment",
    prompt: `A hand taps a blue contactless card on a payment terminal; the card lowers to the reader and the terminal screen glows with a confirmation, soft cafe bokeh behind. Subtle close-up motion, ${NOWARP}.` },
  { file: "DBBV_V2_S17_Frustration_KB0Results_openai.png", label: "frustration_0results",
    prompt: `${SCREEN}A laptop shows a help-center search returning '0 results found' with a sad-face icon; the screen glows steadily, the cursor blinks, a hand rests near the trackpad, warm window light. ${NOWARP}.` },
  { file: "DBBV_V2_S18_Frustration_LoginLocked_openai.png", label: "frustration_login",
    prompt: `${SCREEN}A laptop screen shows an 'Account Locked' red banner above a sign-in form; the screen glows and a hand hesitates over the keyboard, warm desk light. ${NOWARP}.` },
  { file: "DBBV_V2_S19_Frustration_AIChatbot_openai.png", label: "frustration_chatbot",
    prompt: `${SCREEN}A monitor shows a support chatbot replying 'I don't have information about that'; the screen glows and a typing cursor blinks in the message box, soft office bokeh behind. ${NOWARP}.` },
  { file: "DBBV_V2_S20_Frustration_OnHold_openai.png", label: "frustration_onhold",
    prompt: `${SCREEN}A hand holds a phone showing 'On Hold — wait 47 minutes' with a spinning loader and a support auto-reply; the loader spins and the screen glows, steam drifts from a mug behind. ${NOWARP}.` },
  { file: "ChatGPT Image May 31, 2026, 07_41_50 PM.png", label: "frustration_onhold_alt",
    prompt: `${SCREEN}A hand holds a phone showing a support auto-reply '4 business days' and an 'On Hold — 47 minutes' notification with a spinning loader; the loader spins and the screen glows, a coffee mug behind. ${NOWARP}.` },
  { file: "DBBV_V2_S25_Flexible_ConstructionLogin.png", label: "flexible_construction",
    prompt: `A construction worker at a timber-frame site taps his phone to log in with a satisfied nod; the phone screen glows, background site activity and dust drift in warm daylight. Subtle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S26_Flexible_HealthcareLog.png", label: "flexible_healthcare",
    prompt: `A nurse walks slowly down a hospital hallway checking her phone, natural stride and slight smile; background staff move, soft corridor light. Gentle dolly following her, ${NOWARP}.` },
  { file: "DBBV_V2_S29_TeamAction_Construction.png", label: "team_construction",
    prompt: `A construction worker at a site-office desk talks to a colleague on a laptop video call, nodding and gesturing naturally; the laptop shows the caller, warm window light, hard hat on the desk. Subtle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S30_TeamAction_Healthcare_openai.png", label: "team_healthcare",
    prompt: `A nurse at a clinic desk speaks with a man on a laptop video call, nodding warmly; the on-screen caller gestures, background clinical activity, soft daylight. Subtle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S31_TeamAction_Manufacturing.png", label: "team_manufacturing",
    prompt: `A manufacturing worker in a red hard hat holds a tablet showing a video call with a colleague on the factory floor; he nods and listens, the caller moves on screen, machinery runs softly behind. Subtle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S31_TeamAction_Manufacturing.png", label: "team_manufacturing_walking",
    prompt: `A manufacturing worker in a red hard hat walks forward through the factory floor while holding a tablet up in front of him on a video call, talking and nodding to the colleague on the tablet screen as he strides past the machinery and bottling line. Natural confident walking motion, the caller moves on screen, conveyor and machinery running behind, gentle camera following him. Photorealistic, ${NOWARP}.` },
  { file: "DBBV_V2_S33_Reframe_FrustrationSetup_openai.png", label: "reframe_frustration",
    prompt: `A man at his laptop rubs his forehead in frustration, a heavy exhale and slight slump; the dashboard glows on screen, a coworker passes behind, warm office light. Subtle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S34_Reframe_WorkingTransition_openai.png", label: "reframe_transition",
    prompt: `A man works calmly and confidently at his laptop, a small satisfied nod as he scrolls; the dashboard glows on screen, soft daylight and plants behind, coffee mug nearby. Gentle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S36_Reframe_ConstructionHero_openai.png", label: "reframe_construction_hero",
    prompt: `A lone construction worker walks across a steel-frame site at sunset checking her phone, confident stride; warm golden light, dust and a crane in the background. Slow cinematic dolly, ${NOWARP}.` },
  { file: "DBBV_V2_S37_Environments_Construction.png", label: "env_construction",
    prompt: `A construction worker reviews his tablet at a steel-frame site at golden hour with a slight nod of approval; cranes and workers move behind, warm light and dust drift. Subtle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S38_Environments_Healthcare.png", label: "env_healthcare",
    prompt: `A nurse pauses in a hospital corridor glancing at her phone, calm focused expression; background staff move between rooms, soft overhead light. Gentle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S40_Decades_Office.png", label: "decades_office",
    prompt: `A bright open-plan office where colleagues stand and chat by the desks with natural gestures, one walks past; large windows, plants, warm daylight. Slow gentle push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S42_Decades_Healthcare.png", label: "decades_healthcare",
    prompt: `A nurse reads a document at a hospital station, eyes scanning the page with a slight nod; background monitors glow and staff move, soft light. Subtle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S43_WereThere_Requirements.png", label: "werethere_construction",
    prompt: `A confident construction worker in hi-vis and hard hat stands at a building site facing camera, a subtle nod and slight smile, gentle breathing; background structure, warm daylight, dust drifting. Very gentle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S44_WereThere_Regulations.png", label: "werethere_healthcare",
    prompt: `A nurse in scrubs stands in a hospital hallway facing camera, calm confident expression with a slight smile and natural blink; soft corridor light, faint background activity. Very gentle slow push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S46_Quote_SuccessConstruction_openai.png", label: "success_construction",
    prompt: `Two construction workers shake hands at a steel-frame site at sunset, the handshake completing as both smile; warm golden light, crane and dust behind. Slow cinematic push-in, ${NOWARP}.` },
  { file: "DBBV_V2_S48_Quote_SuccessHealthcare_openai.png", label: "success_healthcare",
    prompt: `A nurse and a doctor walk together down a bright hospital corridor, talking and smiling naturally with an easy stride; large windows and greenery behind, soft daylight. Gentle dolly following them, ${NOWARP}.` },
  // Grok redo of S39 (the Veo take hallucinated bottles popping into the foreground)
  { file: "DBBV_V2_S39_Environments_Manufacturing.png", label: "env_manufacturing",
    prompt: `Slow cinematic dolly gliding forward as the worker walks through the bottling line studying his tablet. The conveyor and bottles are ALREADY present from the first frame and only move steadily along the existing line; machinery runs in the background. The foreground stays consistent — no new objects, bottles, or equipment appear, materialize, or pop into frame; nothing spawns. Industrial overhead light, gentle steady camera glide, ${NOWARP}.` },
];

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
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(HD_DIR, { recursive: true });
  const only = ONLY ? new Set(ONLY.split(",")) : null;
  const shots = only ? SHOTS.filter((s) => only.has(s.label)) : SHOTS;
  let est = 0, ok = 0, fail = 0;
  console.log(`\nAssets V4 → ${OUT_DIR}`);
  console.log(`${shots.length} shots | ${GROK} @720p → 1080p | ${DURATION}s | 16:9\n`);

  for (const shot of shots) {
    const src = path.join(ASSETS, shot.file);
    if (!fs.existsSync(src)) { console.error(`  MISSING: ${shot.file}`); fail++; continue; }
    const cropped = path.join(TMP_DIR, `${shot.label}.png`);
    cropTo16x9(src, cropped);
    console.log(`▶ ${shot.label}`);
    if (DRY_RUN) { est += GROK_PER_SEC * DURATION; continue; }
    try {
      const out = await runPrediction(GROK, {
        image: toDataURI(cropped), prompt: shot.prompt,
        duration: DURATION, aspect_ratio: "16:9", resolution: "720p",
      });
      const raw = path.join(OUT_DIR, `${shot.label}_grok.mp4`);
      const hd = path.join(HD_DIR, `${shot.label}_1080.mp4`);
      await download(out, raw);
      upscale(raw, hd);
      est += GROK_PER_SEC * DURATION; ok++;
      console.log(`    ✓ ${shot.label}_1080.mp4`);
    } catch (e) {
      console.error(`    ✗ ${shot.label} failed: ${(e as Error).message}`); fail++;
    }
  }
  console.log(`\nDone. ok=${ok} fail=${fail} | est ≈ $${est.toFixed(2)} | ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
