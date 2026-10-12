/**
 * switchmobile.com site photos → motion clips via Grok Imagine Video + ffmpeg upscale.
 * Source: ~/Downloads/switchmobile_images/originals (crawled 2026-09-16 from the 41 sitemap pages
 * + Elementor CSS backgrounds). Skips logos, 160px avatars, phone product cutouts, exact dupes.
 * Grok i2v @720p, native aspect (banners centre-cropped to 16:9) → Lanczos upscale, longest side 1920.
 *
 *   npx tsx scripts/switchmobile-clips.ts [--dry-run] [--only=label1,label2]
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
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1];

const BASE = path.join(os.homedir(), "Downloads", "switchmobile_images");
const ASSETS = path.join(BASE, "originals");
const OUT_DIR = path.join(BASE, "clips");
const HD_DIR = path.join(OUT_DIR, "1080");
const TMP_DIR = path.join(OUT_DIR, "_prepped");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const GROK = "xai/grok-imagine-video";
const DURATION = 6;
const GROK_PER_SEC = 0.05;
const NOWARP = "photorealistic, stable framing, no warping of faces, hands or phones, mouths stay closed, no speaking";
const PUSH = `Gentle slow cinematic push-in, ${NOWARP}.`;

interface Shot { file: string; label: string; prompt: string; crop169?: boolean }

const SHOTS: Shot[] = [
  { file: "2026_01_Frame-141-scaled.jpg", label: "couple_pink_phone_orange", prompt: `A young couple lean together smiling at a pink phone; she scrolls with a thumb, he glances at her and back to the screen, hair moves in a light breeze. ${PUSH}` },
  { file: "2026_01_Img-Vector.jpg", label: "couple_field_teal", prompt: `A couple laugh together in a sunny green field, she holds a phone up between them; gentle sway, sunlight flickers through leaves, hair lifts in the breeze. ${PUSH}` },
  { file: "2026_01_Rectangle-9.jpg", label: "senior_couple_laughing", prompt: `An older couple laugh warmly together outdoors, he holds a phone; soft shoulder movement, eyes crinkle, leaves move softly behind, golden light. ${PUSH}` },
  { file: "2026_01_Vector.png", label: "couple_selfie_pink", prompt: `A young couple smile at a phone held between them, the phone tilts slightly as they lean in; subtle natural head movement and blinks. ${PUSH}` },
  { file: "2026_01_plan-bg.png", label: "three_friends_cafe", prompt: `Three friends huddle over a phone at a cafe table, laughing quietly; one points at the screen, drinks and warm light, subtle natural movement. ${PUSH}` },
  { file: "2026_02_Rectangle-13@3x.jpg", label: "mother_daughter_pink", prompt: `A mother and daughter smile down at a phone together in a bright room; the phone tilts slightly, hair moves, soft window light. ${PUSH}` },
  { file: "2026_02_Rectangle-9.jpg", label: "picnic_topdown", prompt: `Top-down view of three friends lying on a picnic blanket in the sun holding phones; they shift slightly, one laughs, the blanket edge flutters in a breeze. Slow gentle overhead drift, ${NOWARP}.` },
  { file: "2026_02_bg-2.png", label: "woman_beret_phone_grey", prompt: `A smiling young woman in a beret and glasses holds a phone, she glances at the screen and back up with a soft smile; hair moves gently. ${PUSH}` },
  { file: "2026_03_06c3f1af17359d97de5cb26eb44f70d9d0907153.jpg", label: "woman_city_texting", prompt: `A young woman texts on her phone on a sunny city street, she looks down at the screen then glances up; trees sway softly behind, warm light. ${PUSH}` },
  { file: "2026_03_17b1a84337fc38d29794bab83f4e749b46e79471-1.jpg", label: "three_women_cafe", prompt: `Three women friends lean in over a phone at a cafe table, smiling; one gestures at the screen, subtle head movement, warm ambient light. ${PUSH}` },
  { file: "2026_03_2a21e0707d688ad46039c144e2fab5bc32b63d51.jpg", label: "woman_call_dark", prompt: `A woman in a striped top talks on the phone against a dark wall, a slight smile, small head tilt and blink; subtle shadow play. Very gentle push-in, ${NOWARP}.` },
  { file: "2026_03_5d0a070f6861e59b2ed600ecedf84b5c82645b82.jpg", label: "woman_call_cafe", prompt: `A woman with curly hair smiles on a phone call in a cafe, she leans slightly and blinks; soft bokeh lights shimmer behind. ${PUSH}` },
  { file: "2026_03_78c3d0c5672ec8c409ac5fe4887fb7c7ffa120f8.jpg", label: "couple_walking_phones", prompt: `A couple walk slowly along a sunny street each looking at their phones, natural stride; cars and trees drift past behind. Gentle dolly following them, ${NOWARP}.` },
  { file: "2026_03_7b9e68de4f309aaf60d4402ddaec4f269410c35a.jpg", label: "two_women_laughing_dark", prompt: `Two women laugh together holding phones and a coffee cup, shoulders shake gently, hair moves; dark wall behind. ${PUSH}` },
  { file: "2026_03_8a8730846ae8382501e79a8825cdfca2c53b194e.jpg", label: "coworkers_atrium", prompt: `Three coworkers in a bright glass atrium look at a phone together, one nods; soft daylight, subtle natural movement. ${PUSH}` },
  { file: "2026_03_8e8796cfdde12cb27f013d4d353af46d0a6a34a1.jpg", label: "two_women_city_phone", prompt: `Two women smile at a phone together on a city street, one points at the screen; hair moves in a breeze, background pedestrians drift past. ${PUSH}` },
  { file: "2026_03_Square-Image-Text-Opt-1.jpg", label: "two_women_plants", prompt: `Two women smile down at a phone in a bright room with plants; the phone tilts, soft blinks and head movement, leaves sway gently. ${PUSH}` },
  { file: "2026_03_Vector-3.png", label: "woman_call_excited", prompt: `A woman in glasses and a brown blazer reacts with delight on a phone call, a small excited gesture with her free hand, eyes bright. Very gentle push-in, ${NOWARP}.` },
  { file: "2026_03_Vector-4.png", label: "woman_call_teal", prompt: `A woman in a grey top smiles on a phone call, a soft head tilt and blink; background softly out of focus. ${PUSH}` },
  { file: "2026_03_Vector-5.png", label: "couple_curly_laughing_teal", prompt: `Two friends with curly hair laugh together over a phone, shoulders shake gently, hair bounces; bright daylight. ${PUSH}` },
  { file: "2026_03_Vector1.png", label: "friends_group_phone_yellow", prompt: `A group of friends crowd around one phone laughing, subtle movement as they lean in, one points at the screen; warm daylight. ${PUSH}` },
  { file: "2026_03_Vector3.png", label: "couple_pink_laughing", prompt: `A couple smile at a pink phone, he laughs softly and she scrolls; subtle blinks and hair movement. ${PUSH}` },
  { file: "2026_03_b566936b8ea4bc0e708232a75f9c343d74831873.jpg", label: "man_speakerphone_river", prompt: `A young man smiles holding his phone up on speaker by a river, a light laugh, hair moves in the wind; water glints and the far shore drifts. ${PUSH}` },
  { file: "2026_03_c0a77c2bdc812d3396e6227b87e49bc67505aca8.png", label: "phone_product_blue", prompt: `Product shot of a blue smartphone lying on a white surface; a slow elegant orbit with light gliding across the glossy camera lenses and edges, clean studio reflections. Slow smooth camera move, ${NOWARP}.` },
  { file: "2026_03_c45423f93967f298ec5743b617244e0de098bc5b-1.jpg", label: "friends_bench_phones", prompt: `Four friends sit on a bench outdoors laughing at their phones, one shows the others her screen; trees sway, warm sunlight. ${PUSH}` },
  { file: "2026_03_ce5bc43c4e77b62dec8829de0ffd78945a6c3bd3.jpg", label: "friends_bikes_city", prompt: `Three friends with bikes chat on a city sidewalk holding phones, natural gestures and smiles; light breeze, building behind. ${PUSH}` },
  { file: "2026_03_d1770d5cb7aaa9e05dcd3379a76c4fd1ca5686ac-1.jpg", label: "woman_beret_street", prompt: `A woman in a beret holds up her phone on a city street with a bright smile, hair lifts in the breeze; pedestrians drift softly behind. ${PUSH}` },
  { file: "2026_03_f1a230db5d3829259eb75a096960f7f71e9424d6.jpg", label: "three_friends_steps", prompt: `Three friends sit on outdoor steps smiling at their phones, one leans over to look at another's screen; sunlight and gentle movement. ${PUSH}` },
  { file: "2026_03_f601d360c867dffd3b89bf76a104b4f0972de1b3.jpg", label: "man_call_headphones", prompt: `A man with headphones around his neck laughs on a phone call in the city, small head movement; brick buildings and traffic soft behind. ${PUSH}` },
  { file: "2026_03_hero.jpg", label: "man_white_studio", prompt: `A smiling man in glasses looks down at his phone against a clean white studio background, a small nod and blink; subtle natural movement. Very gentle push-in, ${NOWARP}.` },
  { file: "2026_05_Frame-351-scaled.jpg", label: "banner_group_selfie", crop169: true, prompt: `A group of young friends cheer and laugh together for a selfie outdoors, arms raised, gentle movement; warm sunlight. ${PUSH}` },
  { file: "2026_05_Frame-355-scaled.jpg", label: "banner_friends_talking", crop169: true, prompt: `A group of friends chat and laugh together outdoors, natural gestures; soft daylight and breeze. ${PUSH}` },
  { file: "2026_05_Frame-356-scaled.jpg", label: "banner_friends_phones", crop169: true, prompt: `Friends in a row look at their phones and smile, subtle movement; bright daylight. ${PUSH}` },
  { file: "2026_05_Frame-357-scaled.jpg", label: "banner_couple_couch", crop169: true, prompt: `A couple on a couch look at a phone together, she smiles and points; soft indoor light, subtle movement. ${PUSH}` },
  { file: "2026_05_Frame-360-scaled.jpg", label: "banner_senior_couple_phone", crop169: true, prompt: `An older couple smile at a phone together, gentle nod and blink; soft indoor light. ${PUSH}` },
  { file: "2026_05_Janice.jpg", label: "interview_janice", prompt: `A woman being interviewed on a sunny street holds a phone and smiles, small head movement and blink; light traffic drifts behind. ${PUSH}` },
  { file: "2026_05_Joey-Full.jpg", label: "interview_joey", prompt: `A man in sunglasses and a cap talks casually outdoors, a slight nod and grin; sunlight and chain-link fence behind. ${PUSH}` },
  { file: "2026_05_Liz.jpg", label: "interview_liz", prompt: `A woman reacts with surprise on a city street, eyebrows lift and she blinks; sunlight, pedestrians soft behind. ${PUSH}` },
  { file: "2026_05_Stacey-Medium.jpg", label: "interview_stacey", prompt: `A woman at her front door smiles and accepts something from a visitor, a small nod; warm afternoon light. ${PUSH}` },
  { file: "2026_05_Switch-Mature.jpg", label: "senior_couple_selfie", prompt: `An older couple take a selfie together laughing, the phone held out at arm's length; hair moves in a light breeze, sunny background. ${PUSH}` },
  { file: "2026_05_Switch-Mobile-Home-Hero-scaled.jpg", label: "home_hero_friends", prompt: `Three friends sit on outdoor steps looking at a phone together and laughing; one leans in, hair moves in a breeze, warm daylight. ${PUSH}` },
  { file: "2026_05_Vector-3.jpg", label: "couple_curly_laughing_alt", prompt: `Two friends with curly hair laugh together over a phone, shoulders shake gently, hair bounces; bright daylight. ${PUSH}` },
  { file: "2026_06_plan_02.jpg", label: "man_call_shirt", prompt: `A smiling man in a white shirt talks on the phone, a small nod and blink; bright soft background. Very gentle push-in, ${NOWARP}.` },
  { file: "2026_07_campus-what-you-get.png", label: "campus_students_walking", prompt: `A group of college students walk together across campus chatting, natural stride and gestures; trees sway. Gentle dolly following them, ${NOWARP}.` },
  { file: "2026_07_four-students-chatting-studying-together-outside-2026-01-09-11-08-00-utc.jpg", label: "campus_students_bench", prompt: `Four students sit together outside on campus studying and chatting, one laughs; sunlight and leaves move softly. ${PUSH}` },
  { file: "2026_07_group-of-happy-multicultural-students-spending-tim-2026-03-12-22-46-41-utc.jpg", label: "campus_students_lawn", prompt: `A group of students walk across a sunny campus lawn laughing together; trees sway, warm light. Gentle dolly, ${NOWARP}.` },
  { file: "2026_07_selfie-sports-and-portrait-of-women-friends-on-fi-2026-01-09-10-34-44-utc-copy.png", label: "campus_women_selfie", prompt: `Two young women with backpacks smile close together for a selfie on a sports field, hair moves in a breeze; bright daylight. ${PUSH}` },
  { file: "2026_08_Need-More-Extras-Image-2.png", label: "squirrel_mascot", prompt: `A cute 3D cartoon squirrel mascot holds a smartphone and grins; it blinks and its tail twitches, ears wiggle, subtle bounce. Soft studio light, character stays consistent, ${NOWARP}.` },
  { file: "2026_09_TwoMonthsFreeImage.png", label: "friends_steps_teal", prompt: `Three friends on outdoor steps laugh over a phone, one leans in; hair moves gently, warm daylight. ${PUSH}` },
];

function prep(src: string, dest: string, crop169: boolean): void {
  // flatten transparency onto white, optionally centre-crop to 16:9, output png
  // flatten alpha onto WHITE (transparent regions hide dark/green RGB that Grok would otherwise animate)
  const fc = "[0:v]format=rgba" + (crop169 ? ",crop=ih*16/9:ih" : "") + ",scale='min(2048,iw)':-2[img];" +
    "color=white[c];[c][img]scale2ref[bg][fg];[bg][fg]overlay=shortest=1,format=rgb24";
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", src, "-filter_complex", fc, "-frames:v", "1", dest]);
}
const toDataURI = (file: string) => `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;

async function runPrediction(model: string, input: Record<string, unknown>): Promise<string> {
  let id = "";
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST", headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
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
    const s = await (await fetch(`https://api.replicate.com/v1/predictions/${id}`, { headers: { Authorization: `Bearer ${API_TOKEN}` } })).json();
    if (s.status === "succeeded") { const o = s.output; return Array.isArray(o) ? o[0] : o; }
    if (s.status === "failed" || s.status === "canceled") throw new Error(`${s.status}: ${s.error}`);
  }
  throw new Error("timed out");
}
async function download(url: string, dest: string) { fs.writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer())); }
function upscale(src: string, dest: string): void {
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", src,
    "-vf", "scale='if(gte(iw,ih),1920,-2)':'if(gte(iw,ih),-2,1920)':flags=lanczos",
    "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", dest]);
}

async function main() {
  if (!API_TOKEN) throw new Error("REPLICATE_API_TOKEN not set");
  fs.mkdirSync(TMP_DIR, { recursive: true }); fs.mkdirSync(HD_DIR, { recursive: true });
  const only = ONLY ? new Set(ONLY.split(",")) : null;
  const shots = only ? SHOTS.filter((s) => only.has(s.label)) : SHOTS;
  let est = 0, ok = 0, fail = 0, skipped = 0;
  console.log(`\nswitchmobile → ${OUT_DIR}\n${shots.length} shots | ${GROK} @720p → 1920 longest side | ${DURATION}s\n`);
  for (const shot of shots) {
    const src = path.join(ASSETS, shot.file);
    if (!fs.existsSync(src)) { console.error(`  MISSING: ${shot.file}`); fail++; continue; }
    const hd = path.join(HD_DIR, `${shot.label}_1080.mp4`);
    if (fs.existsSync(hd) && !only) { skipped++; continue; }   // resumable
    const prepped = path.join(TMP_DIR, `${shot.label}.png`);
    prep(src, prepped, !!shot.crop169);
    console.log(`▶ ${shot.label}`);
    if (DRY_RUN) { est += GROK_PER_SEC * DURATION; continue; }
    try {
      const out = await runPrediction(GROK, { image: toDataURI(prepped), prompt: shot.prompt, duration: DURATION, aspect_ratio: shot.crop169 ? "16:9" : "auto", resolution: "720p" });
      const raw = path.join(OUT_DIR, `${shot.label}_grok.mp4`);
      await download(out, raw); upscale(raw, hd);
      est += GROK_PER_SEC * DURATION; ok++;
      console.log(`    ✓ ${shot.label}_1080.mp4`);
    } catch (e) { console.error(`    ✗ ${shot.label} failed: ${(e as Error).message}`); fail++; }
  }
  console.log(`\nDone. ok=${ok} fail=${fail} skipped(existing)=${skipped} | est ≈ $${est.toFixed(2)} | ${OUT_DIR}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
