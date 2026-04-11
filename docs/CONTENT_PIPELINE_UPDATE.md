# Content pipeline update — image generation has moved to moodboards

**Written:** April 11, 2026
**Audience:** the Claude session producing daily blog posts
**TL;DR:** `scripts/generate-blog-images.ts` is stale and needs to be updated before the next batch of posts ships. The replacement approach is cheaper, more consistent, and driven by the post's `author_slug` — so every new post MUST have an `author_slug` in frontmatter for the pipeline to work.

---

## What changed since you last looked

1. **All 116 existing blog posts now use local images.** Every `.mdx` in `content/blog/` has an `image:` field pointing to `/images/blog/<slug>.jpg` (or a `blog-comparison/` alternate). No more Unsplash URLs. If you see a post with `images.unsplash.com`, you're looking at a branch that's behind main.

2. **There's a moodboard system now** at `scripts/moodboards.json`. Nine distinct visual styles (`nocturnal_studio`, `editorial_white`, `stage_haze`, `brand_pop`, `vintage_film`, `bedroom_producer`, `cathedral_ambient`, `neon_noir`, `tech_bench`), each with:
   - A `style_profile` (lighting, composition, palette, vibe)
   - A `prompt_template` with a `SUBJECT_PLACEHOLDER` string to fill in
   - An `authors` array mapping writer slugs to the moods they "shoot in"
   - `best_for` recipe/content tags

3. **Each of the 10 writers is mapped to 1–3 moodboards.** Rick Dalton shoots in `nocturnal_studio` and `vintage_film`. Jess Kowalski is `brand_pop`/`editorial_white`/`stage_haze`. The full map is in `moodboards.json` under each mood's `authors` array. When you generate an image for a post, look up the post's `author_slug`, find the first moodboard that lists that author, and use that mood's `prompt_template`.

4. **We moved the default model from Flux 1.1 Pro → Flux 2 Pro.** Cost per image dropped from $0.055 → ~$0.055 (similar) but quality improved noticeably and composition rules (wide 16:9, 40% subject, negative space) land better. The bash script `scripts/gen-images-moodboards.sh` already reads `FK_MODEL` env var defaulting to `black-forest-labs/flux-2-pro`.

5. **Fallback rule: use `google/nano-banana-pro` for `editorial_white` only.** Flux's safety classifier trips on high-key white-background product photography. Every other mood works on Flux 2 Pro and should stay there for the cost savings.

6. **Nano Banana Pro direct via Google AI Studio is ~4× cheaper than Replicate** if you ever need to drop Replicate entirely. See `docs/IMAGE_API_ALTERNATIVES.md`. For now, stay on Replicate — the hybrid (Flux-by-default, Nano-Banana-for-editorial-white) works.

---

## What to update in `scripts/generate-blog-images.ts`

The existing file has four problems:

| Problem | Current | Fix |
|---|---|---|
| Wrong model | `black-forest-labs/flux-1.1-pro` | `black-forest-labs/flux-2-pro` (or read `process.env.FK_MODEL`) |
| Wrong extension | `.webp` | `.jpg` (matches existing 51 files; the blog reads `.jpg`) |
| Ignores moodboards | Flat `POST_PROMPTS` dict | Read `scripts/moodboards.json`, look up by `author_slug` |
| Ignores author | `data.author` only | Require `data.author_slug` to pick the moodboard |

### Skeleton of the updated logic

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const MODEL = process.env.FK_MODEL ?? "black-forest-labs/flux-2-pro";
const MOODBOARDS = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts/moodboards.json"), "utf-8")
);

// Build a reverse map: author_slug -> first moodboard key that lists them
const AUTHOR_TO_MOOD: Record<string, string> = {};
for (const [moodKey, mood] of Object.entries(MOODBOARDS) as any) {
  if (moodKey.startsWith("_")) continue;
  for (const author of mood.authors ?? []) {
    if (!AUTHOR_TO_MOOD[author]) AUTHOR_TO_MOOD[author] = moodKey;
  }
}

// Subjects — short noun phrases describing what's in frame.
// Keep these to 15–25 words. The moodboard template supplies lighting,
// composition, and style. The subject only needs to name the gear.
const SUBJECTS: Record<string, string> = {
  "big-muff-vs-fuzz-face": "a Big Muff fuzz pedal and a round Fuzz Face pedal side by side on a dark surface",
  "tube-screamer-vs-klon-vs-blues-driver": "three overdrive pedals arranged in a row — a green Tube Screamer, a gold Klon clone, and a blue Boss Blues Driver",
  // ...one line per slug you're generating for
};

function subjectFor(slug: string, title: string): string {
  if (SUBJECTS[slug]) return SUBJECTS[slug];
  // Fallback: use the post title minus any colons/dashes.
  // The moodboard still owns the visual direction, so this is fine.
  return `a composition illustrating "${title.split(/[:—–-]/)[0].trim()}"`;
}

async function generateImage(prompt: string): Promise<string> {
  const res = await fetch(
    `https://api.replicate.com/v1/models/${MODEL}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: MODEL.startsWith("black-forest-labs/flux")
          ? { prompt, aspect_ratio: "16:9", output_format: "jpg", safety_tolerance: 2 }
          : { prompt, aspect_ratio: "16:9", resolution: "2K", output_format: "jpg", allow_fallback_model: true },
      }),
    }
  );
  const prediction = await res.json();
  // ...poll for completion (unchanged from current file)
}

async function main() {
  // for each .mdx in content/blog/
  //   parse frontmatter, read data.author_slug
  //   if no author_slug: skip and warn
  //   moodKey = AUTHOR_TO_MOOD[data.author_slug] ?? "nocturnal_studio"
  //   template = MOODBOARDS[moodKey].prompt_template
  //   subject = subjectFor(slug, data.title)
  //   prompt = template.replaceAll("SUBJECT_PLACEHOLDER", subject)
  //   if editorial_white mood: override model to google/nano-banana-pro for this call
  //   generateImage(prompt), save to public/images/blog/<slug>.jpg
  //   write data.image = `/images/blog/${slug}.jpg` and data.image_alt
}
```

The shell version (`scripts/gen-images-moodboards.sh`) already does all of this. Compare against it when you're wiring the TS version — the logic is 1:1.

---

## Frontmatter requirements for new blog posts

Every new post in `content/blog/*.mdx` MUST have:

```yaml
---
title: "Whatever the post is called"
description: "..."
date: "2026-04-12"
author: "Jess Kowalski"        # display name, keep for legacy
author_slug: "jess-kowalski"    # REQUIRED — this picks the moodboard
category: "signal-chain"
tags: ["..."]
readingTime: "8 min"
---
```

The `author_slug` is now load-bearing. If it's missing, the image pipeline falls back to `nocturnal_studio` as a default, which works but isn't ideal — every author has a moodboard that was chosen for a reason.

**Author slugs and their assigned moods** (copy from `moodboards.json`):

| author_slug | moods |
|---|---|
| carl-beckett | tech_bench, vintage_film |
| dev-okonkwo | bedroom_producer, brand_pop |
| elena-ruiz | bedroom_producer, brand_pop |
| hank-presswood | nocturnal_studio, tech_bench, vintage_film |
| jess-kowalski | brand_pop, editorial_white, stage_haze |
| margot-thiessen | editorial_white, nocturnal_studio |
| nathan-cross | cathedral_ambient, stage_haze |
| rick-dalton | nocturnal_studio, vintage_film |
| sean-nakamura | bedroom_producer, editorial_white |
| viktor-kessler | neon_noir |

---

## Running the pipeline

Two equivalent paths:

### Option A — the shell script (fast, one post at a time)
```bash
# Regenerates for a specific author + slug + subject
bash scripts/gen-images-moodboards.sh author <author-slug> <post-slug> "<subject phrase>"

# Example:
bash scripts/gen-images-moodboards.sh author jess-kowalski bd2-vs-bd2w-waza-craft "a blue Boss BD-2 Blues Driver next to a black BD-2W Waza Craft pedal on a color backdrop"

# Writes to: public/images/blog-moodboards/<mood>/<post-slug>.jpg
# Note: writes to blog-moodboards/, NOT blog/ — move/symlink if you want it to be the blog hero.
```

### Option B — updated `generate-blog-images.ts` (batch, preferred for daily)
```bash
npx tsx scripts/generate-blog-images.ts

# Walks content/blog/*.mdx, skips any post that already has a file at
# public/images/blog/<slug>.jpg, and generates the rest.
# Writes directly to public/images/blog/<slug>.jpg so the frontmatter
# can reference it immediately.
```

**Daily pipeline happy path:**
1. Write 5 new `.mdx` files in `content/blog/` (with `author_slug` set)
2. `npx tsx scripts/generate-blog-images.ts`
3. Commit the new posts + the new .jpg files

---

## Cost expectations

- Flux 2 Pro: ~$0.055/image → **$0.275 for 5 posts**
- Nano Banana Pro (Replicate): $0.15/image → $0.75 for 5 posts
- Nano Banana Pro (Google direct): ~$0.039/image → $0.195 for 5 posts

Daily budget at 5 posts/day on Flux 2 Pro: **~$8.25/month**. That's sustainable. If you ever need to run a full 55-recipe regeneration, budget ~$3.

Don't run batch regens against Replicate without checking account credit first. Replicate throttles to 6 req/min with a burst of 1 when balance drops below $5 — and because the throttle returns HTTP 429, a naive script will just fail on every request. The shell script in `gen-images-moodboards.sh` already has retry-with-backoff logic, but the TS version currently does not.

---

## What to do if a mood trips the safety filter

If a Flux 2 Pro prediction comes back with `E005 — input/output flagged sensitive`:

1. Try once with `FK_MODEL=google/nano-banana-pro` as an override for just that post
2. If that also fails, the subject phrasing is the problem — reword the subject (drop brand names, drop "clinical"/"seamless"/"high-key")
3. Don't fight the classifier — the cost of a single Nano Banana fallback ($0.15) is less than the cost of iterating Flux prompts

Known: `editorial_white` mood trips E005 reliably on Flux 2 Pro. Always route `editorial_white` through Nano Banana.

---

## Related docs

- `docs/IMAGE_API_ALTERNATIVES.md` — provider comparison, when to swap off Replicate
- `docs/EMAIL_INFRASTRUCTURE.md` — unrelated, but lives next door
- `scripts/moodboards.json` — source of truth for mood prompts and author mapping
- `scripts/gen-images-moodboards.sh` — working reference implementation in bash
