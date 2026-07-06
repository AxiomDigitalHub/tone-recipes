#!/usr/bin/env node
/**
 * render-recipe-audio.mjs — turn rendered tone clips into web assets + schema.
 *
 * THE HONEST CONSTRAINT (read scripts/AUDIO_PIPELINE.md):
 *   Our presets are .hlx (Line 6 Helix). Helix amp/cab/effect models are
 *   proprietary DSP — there is NO open-source way to render a .hlx tone. The
 *   one step that needs Helix Native (the $99 plugin) or the hardware is
 *   getting a DI through each preset into a raw WAV. That is the only manual
 *   step, and you do it once per preset, ever.
 *
 * THIS SCRIPT automates everything downstream of that — the parts that don't
 * need the plugin and are pure tooling:
 *   1. loudness-normalize each raw render (ffmpeg loudnorm)
 *   2. encode a web MP3                -> public/audio/<slug>.mp3
 *   3. render a waveform video         -> public/audio/<slug>.mp4   (--no-video to skip)
 *   4. probe duration                  (ffprobe)
 *   5. upsert the manifest the site reads -> src/data/audio-demos.json
 *
 * INPUT:  audio/raw/<slug>.wav         (you produce these via Helix Native)
 * USAGE:
 *   node scripts/render-recipe-audio.mjs                 # all raw clips
 *   node scripts/render-recipe-audio.mjs --slug=cobain-teen-spirit-grunge
 *   node scripts/render-recipe-audio.mjs --no-video
 *   node scripts/render-recipe-audio.mjs --caption="Strat DI, clean verse into the chorus hook"
 *
 * Requires ffmpeg + ffprobe on PATH (`brew install ffmpeg`). Existing caption /
 * source_note in the manifest are preserved across re-runs.
 */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = join(ROOT, "audio", "raw");
const OUT_DIR = join(ROOT, "public", "audio");
const MANIFEST = join(ROOT, "src", "data", "audio-demos.json");

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const has = (name) => args.includes(`--${name}`);
const onlySlug = flag("slug");
const captionArg = flag("caption");
const makeVideo = !has("no-video");

function assertTool(tool) {
  const r = spawnSync(tool, ["-version"], { stdio: "ignore" });
  if (r.status !== 0) {
    console.error(`✗ ${tool} not found on PATH. Install it (brew install ffmpeg) and retry.`);
    process.exit(1);
  }
}

function probeDuration(file) {
  try {
    const out = execFileSync("ffprobe", [
      "-v", "error", "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1", file,
    ]).toString().trim();
    const n = Number(out);
    return Number.isFinite(n) ? Math.round(n) : undefined;
  } catch {
    return undefined;
  }
}

function todayUTC() {
  // No Date.now() shenanigans needed at runtime; this is a build-time CLI.
  return new Date().toISOString().slice(0, 10);
}

function loadManifest() {
  if (!existsSync(MANIFEST)) return {};
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8")) || {};
  } catch {
    console.warn("! manifest unreadable, starting fresh");
    return {};
  }
}

function main() {
  assertTool("ffmpeg");
  assertTool("ffprobe");

  if (!existsSync(RAW_DIR)) {
    console.error(`✗ No raw renders found at ${RAW_DIR}`);
    console.error("  Produce audio/raw/<slug>.wav first — see scripts/AUDIO_PIPELINE.md");
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const raws = readdirSync(RAW_DIR)
    .filter((f) => f.toLowerCase().endsWith(".wav"))
    .map((f) => basename(f, ".wav"))
    .filter((slug) => !onlySlug || slug === onlySlug);

  if (raws.length === 0) {
    console.error("✗ Nothing to render (no matching .wav in audio/raw/).");
    process.exit(1);
  }

  const manifest = loadManifest();
  let done = 0;

  for (const slug of raws) {
    const raw = join(RAW_DIR, `${slug}.wav`);
    const mp3 = join(OUT_DIR, `${slug}.mp3`);
    const mp4 = join(OUT_DIR, `${slug}.mp4`);
    console.log(`\n▶ ${slug}`);

    // 1+2: loudness-normalize to a streaming-friendly target and encode MP3.
    execFileSync("ffmpeg", [
      "-y", "-i", raw,
      "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
      "-codec:a", "libmp3lame", "-q:a", "2",
      mp3,
    ], { stdio: "inherit" });
    console.log(`  ✓ ${mp3.replace(ROOT + "/", "")}`);

    // 3: waveform video (cheap, no filming). Skipped with --no-video.
    let videoUrl;
    if (makeVideo) {
      execFileSync("ffmpeg", [
        "-y", "-i", mp3,
        "-filter_complex",
        "[0:a]showwaves=s=1280x320:mode=cline:colors=0xE8A33D:rate=30[v]",
        "-map", "[v]", "-map", "0:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
        "-shortest", mp4,
      ], { stdio: "inherit" });
      videoUrl = `/audio/${slug}.mp4`;
      console.log(`  ✓ ${mp4.replace(ROOT + "/", "")}`);
    }

    // 4: duration for AudioObject/VideoObject schema.
    const duration = probeDuration(mp3);

    // 5: upsert manifest, preserving human-authored caption/source_note.
    const prev = manifest[slug] ?? {};
    manifest[slug] = {
      audio_url: `/audio/${slug}.mp3`,
      ...(videoUrl ? { video_url: videoUrl } : prev.video_url ? { video_url: prev.video_url } : {}),
      caption: captionArg ?? prev.caption ?? "Self-produced demo — DI run through this recipe's preset.",
      rendered_at: todayUTC(),
      ...(duration ? { duration_sec: duration } : {}),
      ...(prev.source_note ? { source_note: prev.source_note } : {}),
    };
    done++;
  }

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✓ Wrote ${done} demo(s) to ${MANIFEST.replace(ROOT + "/", "")}`);
  console.log("  Review captions/source_note, then commit public/audio + the manifest.");
}

main();
