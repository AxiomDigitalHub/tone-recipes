/**
 * DBBV storyboard → 1080p motion clips (image-to-video) via Replicate.
 *
 * Test batch: 5 stills → Veo 3.1 Fast (google/veo-3.1-fast), 6s, 1080p, 16:9,
 * audio off. Two of the five (S27 office, S41 timelapse) ALSO run on
 * Grok Imagine Video (xai/grok-imagine-video) for a quality/cost comparison.
 *
 * Usage:
 *   npx tsx scripts/generate-clips.ts            # run the batch
 *   npx tsx scripts/generate-clips.ts --dry-run  # crop + print plan, no API calls
 *
 * Cost (audio off):
 *   Veo 3.1 Fast  ~$0.15/s → 6s ≈ $0.90/clip  (5 clips ≈ $4.50)
 *   Grok Imagine  ~$0.05/s → 6s ≈ $0.30/clip  (2 clips ≈ $0.60)
 *   Test batch total ≈ $5.
 *
 * Env: REPLICATE_API_TOKEN (loaded from .env.local).
 */

import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";

// --- Load .env.local (same approach as generate-blog-images.ts) -------------
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  // Last-non-empty-wins, matching `source .env.local`. (The file has a stale
  // duplicate REPLICATE_API_TOKEN on an earlier line; the later one is valid.)
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (!m) continue;
    const val = m[2].replace(/^["']|["']$/g, "");
    if (val) process.env[m[1]] = val;
  }
}

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

const ASSETS = "/Users/daniellivengood/Downloads/Assets V2";
const OUT_DIR = path.join(os.homedir(), "Downloads", "DBBV_clips", "test");
const TMP_DIR = path.join(OUT_DIR, "_cropped16x9");

const VEO = "google/veo-3.1-fast";
const GROK = "xai/grok-imagine-video";

const VEO_PER_SEC = 0.15;
const GROK_PER_SEC = 0.05;
const DURATION = 6;

const NEG = "warped faces, distorted hands, morphing, extra limbs, text artifacts, flickering, jitter, camera shake";

interface Shot {
  file: string;   // source PNG (no path)
  label: string;  // short name for output files
  prompt: string;
  grok?: boolean;  // also run on Grok for comparison
}

const SHOTS: Shot[] = [
  {
    file: "DBBV_V2_S27_AwardTeam_RealOffice_openai.png",
    label: "S27_office",
    grok: true,
    prompt:
      "Subtle slow cinematic push-in toward the team gathered at the desk. Gentle, almost imperceptible dolly-in. Natural micro-movements: people shift their weight slightly, the man with the lanyard writes on his tablet, faint glow flickers on the monitors, a coworker in the background walks past. Locked-off, stabilized framing, realistic modern office, photorealistic, no camera shake.",
  },
  {
    file: "DBBV_V2_S28_NotJustPlatform_OTSZoom.png",
    label: "S28_videocall",
    prompt:
      "Gentle, nearly imperceptible push-in over the shoulder toward the laptop. The woman on the video call gestures warmly and smiles, with slight natural head movement. Thin steam rises from the coffee mug. Shallow depth of field, soft window light, stable framing, photorealistic.",
  },
  {
    file: "DBBV_V2_S32_TeamAction_OfficeSolved.png",
    label: "S32_gridcall",
    prompt:
      "Slow subtle dolly-in toward the woman at the laptop. She smiles and nods slightly as she listens; the small video tiles on her screen show faint motion. Steam drifts gently from the ceramic mug. Warm natural light from the window, photorealistic, no warping.",
  },
  {
    file: "DBBV_V2_S39_Environments_Manufacturing.png",
    label: "S39_factory",
    prompt:
      "Slow cinematic dolly slowly following the worker as he walks forward through the bottling line looking at his tablet. Machinery runs in the background, the conveyor moves and bottles advance steadily. Industrial overhead light, gentle camera glide, photorealistic, no warping.",
  },
  {
    file: "DBBV_V2_S41_Decades_Construction.png",
    label: "S41_timelapse",
    grok: true,
    prompt:
      "Timelapse of the finished glass office building at golden hour. Clouds streak rapidly across the sky, the low sun shifts and shadows sweep across the glass facade, warm light changing. People and vehicles move quickly past on the street below in fast time-lapse motion. The two hi-vis workers stay in place looking up at the building. Cinematic time-lapse, smooth, photorealistic, the building stays structurally fixed and unchanged.",
  },
];

// --- Crop a source image to an exact 16:9 frame via macOS `sips` ------------
function cropTo16x9(src: string, dest: string): void {
  const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", src], { encoding: "utf-8" });
  const w = Number(dims.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const h = Number(dims.match(/pixelHeight:\s*(\d+)/)?.[1]);
  // Target 16:9: keep height, compute width (or vice-versa), center-crop.
  const targetW = Math.round((h * 16) / 9);
  const cropW = Math.min(w, targetW);
  const cropH = cropW === w ? Math.round((w * 9) / 16) : h;
  fs.copyFileSync(src, dest);
  // sips -c expects HEIGHT then WIDTH; it center-crops.
  execFileSync("sips", ["-c", String(cropH), String(cropW), dest], { stdio: "ignore" });
}

function toDataURI(file: string): string {
  const b64 = fs.readFileSync(file).toString("base64");
  return `data:image/png;base64,${b64}`;
}

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
    if (res.status === 402) throw new Error(`PAYMENT REQUIRED — account unfunded: ${JSON.stringify(body)}`);
    const wait = body.retry_after ?? 10;
    console.log(`    ...throttled/err (${res.status}), waiting ${wait}s (attempt ${attempt + 1}/8): ${body.detail ?? ""}`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
  if (!id) throw new Error("Failed to start prediction after 8 attempts");
  console.log(`    prediction ${id} started, polling…`);

  // Video gen is slow — poll up to ~12 min.
  for (let i = 0; i < 240; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const check = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    const s = await check.json();
    if (s.status === "succeeded") {
      const o = s.output;
      if (Array.isArray(o)) return o[0];
      if (typeof o === "string") return o;
      throw new Error(`Unexpected output: ${JSON.stringify(o)}`);
    }
    if (s.status === "failed" || s.status === "canceled") {
      throw new Error(`Prediction ${s.status}: ${s.error}`);
    }
  }
  throw new Error("Prediction timed out after ~12 min");
}

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set (expected in .env.local)");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });

  let estCost = 0;
  console.log(`\nDBBV test batch → ${OUT_DIR}`);
  console.log(`Model: ${VEO} (all 5) + ${GROK} (compare on 2) | ${DURATION}s | 1080p | 16:9 | audio off\n`);

  for (const shot of SHOTS) {
    const src = path.join(ASSETS, shot.file);
    if (!fs.existsSync(src)) { console.error(`  MISSING: ${src}`); continue; }
    const cropped = path.join(TMP_DIR, `${shot.label}.png`);
    cropTo16x9(src, cropped);
    console.log(`▶ ${shot.label}  (${shot.file})`);

    if (DRY_RUN) {
      console.log(`    [dry-run] cropped → ${cropped}`);
      console.log(`    [dry-run] Veo prompt: ${shot.prompt.slice(0, 80)}…`);
      estCost += VEO_PER_SEC * DURATION + (shot.grok ? GROK_PER_SEC * DURATION : 0);
      continue;
    }

    const imageURI = toDataURI(cropped);

    // --- Veo 3.1 Fast ---
    try {
      const veoOut = await runPrediction(VEO, {
        image: imageURI,
        prompt: shot.prompt,
        duration: DURATION,
        resolution: "1080p",
        aspect_ratio: "16:9",
        generate_audio: false,
        negative_prompt: NEG,
      });
      const dest = path.join(OUT_DIR, `${shot.label}_veo.mp4`);
      await download(veoOut, dest);
      estCost += VEO_PER_SEC * DURATION;
      console.log(`    ✓ Veo  → ${dest}`);
    } catch (e) {
      console.error(`    ✗ Veo failed: ${(e as Error).message}`);
    }

    // --- Grok comparison (2 shots) ---
    if (shot.grok) {
      try {
        const grokOut = await runPrediction(GROK, {
          image: imageURI,
          prompt: shot.prompt,
          duration: DURATION,
          aspect_ratio: "16:9",
        });
        const dest = path.join(OUT_DIR, `${shot.label}_grok.mp4`);
        await download(grokOut, dest);
        estCost += GROK_PER_SEC * DURATION;
        console.log(`    ✓ Grok → ${dest}`);
      } catch (e) {
        console.error(`    ✗ Grok failed: ${(e as Error).message}`);
      }
    }
  }

  console.log(`\nDone. Estimated spend ≈ $${estCost.toFixed(2)}`);
  console.log(`Clips in: ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
