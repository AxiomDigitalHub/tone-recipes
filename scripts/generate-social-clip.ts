/**
 * Blog hero image → vertical social clip for TikTok / YouTube Shorts.
 *
 * Grok Imagine i2v animates the hero at its native 16:9 (the model tracks the
 * input's aspect ratio, and these heroes are all landscape studio shots), then
 * ffmpeg builds the 1080x1920 vertical: a blurred, zoomed copy fills the frame
 * behind the sharp 16:9 clip. Hard-cropping to 9:16 would cut the gear in half.
 *
 *   npx tsx scripts/generate-social-clip.ts --slug <slug>   # one clip
 *   npx tsx scripts/generate-social-clip.ts --auto          # next unpromoted post
 *   npx tsx scripts/generate-social-clip.ts --auto --dry-run
 *
 * Writes public/videos/blog/<slug>.mp4, which serves at
 * https://faderandknob.com/videos/blog/<slug>.mp4 once deployed. social-post.ts
 * only attaches the video after that URL answers 200, so a clip generated today
 * posts on the next run after it ships. ~$0.30/clip.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
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
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "blog");
const VIDEO_DIR = path.join(process.cwd(), "public", "videos", "blog");
const TMP_DIR = path.join(process.cwd(), ".next", "cache", "social-clips");
const PROMOTED_LOG = path.join(process.cwd(), "docs", "social-queue", "promoted.log");
const FFMPEG = fs.existsSync("/opt/homebrew/bin/ffmpeg") ? "/opt/homebrew/bin/ffmpeg" : "ffmpeg";
const GROK = "xai/grok-imagine-video";
const DURATION = 6;
const GROK_PER_SEC = 0.05;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`);

/**
 * One prompt serves every post. These heroes are model-generated product shots
 * whose brand marks are already imaginary lettering — motion is what makes them
 * visibly melt, so the prompt spends most of its length pinning things down and
 * asks for ambient life only.
 */
function promptFor(title: string): string {
  return (
    `Subtle cinematic motion on a still photograph of guitar gear. A slow, steady push-in, nothing else. ` +
    `Every piece of equipment keeps its exact shape: the cabinet, knobs, switches, cables and all printed text, ` +
    `logos and panel lettering stay EXACTLY as they are — no re-lettering, no warping, no morphing, no shifting. ` +
    `No new objects, hands, people or equipment appear or materialize. Only ambient life: faint dust drifting in ` +
    `the light, a soft steady glow from indicator LEDs, gentle light falloff. ` +
    `Photorealistic, stable framing, locked composition, no warping. (${title})`
  );
}

function slugsByDateDesc(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
      return { slug, date: String(data.date ?? "") };
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((x) => x.slug);
}

/** Mirrors social-post.ts --auto so the clip lands on the post that posts next. */
function autoPickSlug(): string | null {
  let done = new Set<string>();
  try {
    done = new Set(
      fs.readFileSync(PROMOTED_LOG, "utf-8").split("\n").map((l) => l.split("\t")[0].trim()).filter(Boolean),
    );
  } catch {
    /* no log yet — nothing promoted */
  }
  return slugsByDateDesc().find((s) => !done.has(s)) ?? null;
}

function frontmatter(slug: string): Record<string, unknown> {
  return matter(fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8")).data;
}

/** Frontmatter `image` is the source of truth; the slug guesses are a fallback. */
function heroFor(slug: string, data: Record<string, unknown>): string | null {
  const declared = data.image ? String(data.image) : null;
  if (declared) {
    const p = path.join(process.cwd(), "public", declared.replace(/^\//, ""));
    if (fs.existsSync(p)) return p;
    console.log(`    (frontmatter image ${declared} missing on disk — trying slug match)`);
  }
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const p = path.join(IMAGE_DIR, `${slug}${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const toDataURI = (file: string) => {
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
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

/**
 * Render the title to a transparent 1080x1920 PNG with PIL. Homebrew's ffmpeg
 * here is built without libfreetype, so `drawtext` does not exist — and going
 * through an image also keeps apostrophes and colons in post titles away from
 * the filter parser entirely.
 */
function renderTitlePng(title: string, dest: string): boolean {
  const font = ["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/System/Library/Fonts/Supplemental/Arial.ttf"]
    .find((f) => fs.existsSync(f));
  if (!font) return false;
  const py = `
import json, sys
from PIL import Image, ImageDraw, ImageFont
title, font_path, dest = json.loads(sys.argv[1])
W, H, SIZE, MARGIN = 1080, 1920, 62, 70
font = ImageFont.truetype(font_path, SIZE)
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Greedy wrap on measured width, not character count — "Which Amps It Works On"
# and "A 1960s AC30" are nowhere near the same pixel length.
words, lines, line = title.split(), [], ""
for w in words:
    trial = (line + " " + w).strip()
    if d.textlength(trial, font=font) > W - 2 * MARGIN and line:
        lines.append(line); line = w
    else:
        line = trial
if line: lines.append(line)
lines = lines[:4]
y = 250
for ln in lines:
    x = (W - d.textlength(ln, font=font)) / 2
    d.text((x, y), ln, font=font, fill=(255, 255, 255, 255),
           stroke_width=4, stroke_fill=(0, 0, 0, 220))
    y += SIZE + 14
img.save(dest)
`;
  execFileSync("python3", ["-c", py, JSON.stringify([title, font, dest])], { stdio: "pipe" });
  return true;
}

/**
 * 720p 16:9 → 1080x1920. A blurred, zoomed copy fills the frame behind the
 * sharp contained clip, with the title card composited over the upper band.
 */
function toVertical(src: string, dest: string, title: string, tmpBase: string): void {
  const titlePng = `${tmpBase}.title.png`;
  let hasTitle = false;
  try {
    hasTitle = renderTitlePng(title, titlePng);
  } catch (e) {
    console.log(`    (title overlay skipped: ${(e as Error).message.split("\n")[0]})`);
  }
  if (!hasTitle) console.log("    (no usable font — rendering without a title card)");

  const base =
    `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=28,eq=brightness=-0.12[bg];` +
    `[0:v]scale=1080:-2:flags=lanczos[fg];`;
  const filter = hasTitle
    ? `${base}[bg][fg]overlay=(W-w)/2:(H-h)/2[base];[base][1:v]overlay=0:0[v]`
    : `${base}[bg][fg]overlay=(W-w)/2:(H-h)/2[v]`;

  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error", "-i", src,
    ...(hasTitle ? ["-i", titlePng] : []),
    "-filter_complex", filter,
    "-map", "[v]", "-c:v", "libx264", "-crf", "20", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart", dest,
  ]);
  fs.rmSync(titlePng, { force: true });
}

async function main() {
  const dryRun = hasFlag("dry-run");
  const force = hasFlag("force");
  const slug = hasFlag("auto") ? autoPickSlug() : arg("slug");
  if (!slug) throw new Error("No slug. Pass --slug <slug> or --auto.");
  if (!API_TOKEN && !dryRun) throw new Error("REPLICATE_API_TOKEN not set");

  const data = frontmatter(slug);
  const hero = heroFor(slug, data);
  if (!hero) throw new Error(`No hero image for ${slug} in public/images/blog/`);
  const title = String(data.title ?? slug);
  const dest = path.join(VIDEO_DIR, `${slug}.mp4`);

  console.log(`\n=== social clip: ${title}`);
  console.log(`  hero  ${path.relative(process.cwd(), hero)}`);
  console.log(`  out   ${path.relative(process.cwd(), dest)}`);
  console.log(`  ${GROK} @720p 16:9 ${DURATION}s → 1080x1920 vertical | est $${(GROK_PER_SEC * DURATION).toFixed(2)}`);

  if (fs.existsSync(dest) && !force) {
    console.log(`\n  ✓ already exists — pass --force to regenerate.\n`);
    return;
  }
  if (dryRun) {
    console.log(`\n  (dry run — nothing generated)\n  prompt: ${promptFor(title)}\n`);
    return;
  }

  fs.mkdirSync(VIDEO_DIR, { recursive: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const raw = path.join(TMP_DIR, `${slug}_16x9.mp4`);

  // The generated 16:9 is cached: the vertical composite is free to redo, the
  // Grok call is not. Only --force re-bills.
  if (fs.existsSync(raw) && !force) {
    console.log(`    reusing cached 16:9 render (no new Grok charge)`);
  } else {
    const out = await runPrediction(GROK, {
      image: toDataURI(hero),
      prompt: promptFor(title),
      duration: DURATION,
      aspect_ratio: "16:9",
      resolution: "720p",
    });
    await download(out, raw);
  }
  toVertical(raw, dest, title, path.join(TMP_DIR, slug));

  const mb = (fs.statSync(dest).size / 1_000_000).toFixed(1);
  console.log(`\n  ✓ ${path.relative(process.cwd(), dest)} (${mb} MB)`);
  console.log(`  Commit + deploy it, then the next --auto run will attach it to TikTok/YouTube.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
