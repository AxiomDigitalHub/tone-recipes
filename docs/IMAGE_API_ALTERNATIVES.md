# Image generation API alternatives to Replicate Nano Banana Pro

**Written:** April 11, 2026
**Problem:** Replicate charges $0.15 per Nano Banana Pro image. Regenerating 55 recipes + moodboard samples routinely becomes unsustainable. We need cheaper options without giving up the quality that the JSON + prompt-block approach unlocked.

---

## The math

| Volume | Replicate (Nano Banana Pro) | Notes |
|--------|---------------------------:|-------|
| 55 recipe hero images | $8.25 | One full pass |
| 9-mood sample set | $1.35 | Every time we tweak a moodboard |
| Single preset/Set Pack hero image | $0.15 | Per one-off |
| Monthly budget (realistic) | $30-60 | Routine regeneration + experiments |

At $0.15 per image, the act of **iterating** (which is how we landed on the moodboard system in the first place) becomes the expensive part. The moment we want to try a new subject phrasing, we pay $0.15 to find out whether it works.

---

## Alternatives, ranked

### Option A — Google AI Studio direct (recommended for hero images)

Replicate is a reseller. Google publishes Nano Banana Pro via their own `google.generativeai` API at roughly **4× cheaper** than Replicate's markup. Same exact model, same quality.

- **Price:** ~$0.039 per 2K image (vs Replicate's $0.15)
- **Quality:** Identical — it's literally the same model
- **Setup:** Get a Google AI Studio API key, install `google-genai` Python package, swap the endpoint in our script
- **Tradeoff:** Google manages quota differently (they burst higher but cap daily), and the API is less mature than Replicate's
- **For F&K:** Use this as the **premium tier** for recipe hero images, Set Pack covers, and anything that ships to a customer

**Bash snippet (roughly):**
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateImage?key=$GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "...", "imageConfig": {"aspectRatio": "16:9", "resolution": "2K"}}'
```

### Option B — fal.ai (recommended for fast iteration)

fal.ai hosts Flux 1.1 Pro, Flux 2 Pro, and a growing library of image models at **1/4 to 1/5** Replicate's prices, with much faster cold-starts and better batching.

- **Price (Flux 1.1 Pro):** ~$0.04 per image
- **Price (Flux 2 Pro):** ~$0.055 per image
- **Quality:** Flux 1.1 Pro produced our first (disappointing) batch, but that was with the flattened preamble. The JSON + prompt-block approach we proved with Nano Banana Pro will likely produce good Flux results too, because prompt structure matters more than model choice for this kind of subject
- **Setup:** fal.ai API key, HTTP POST that looks almost identical to Replicate, install nothing
- **For F&K:** Use this as the **iteration tier** — moodboard samples, draft recipe images, anything where we're experimenting with prompts

### Option C — Together AI (for bulk drafts)

Together hosts Flux Schnell (the fast variant) at absolute rock-bottom pricing.

- **Price:** ~$0.003 per image — **50× cheaper** than Replicate Nano Banana Pro
- **Quality:** Noticeably lower than Flux 1.1 Pro or Nano Banana Pro, but usable for thumbnails and drafts
- **Setup:** Together API key, single HTTP call
- **For F&K:** Use this as a **draft tier** — generate 3-5 variants of a prompt for pennies, pick the best one, then regenerate that one through Google AI Studio for final quality

### Option D — Pollinations.ai (free + gated)

Pollinations offers a free Flux tier with aggressive rate limiting. Useful for tinkering, not for production.

- **Price:** Free
- **Quality:** Flux (decent)
- **Catch:** Rate limits, slow, occasionally just doesn't respond
- **For F&K:** Not a production option, but worth knowing exists

---

## Recommended stack

**Three-tier setup:**

1. **Drafts & moodboard exploration** → fal.ai Flux 1.1 Pro at $0.04/image
2. **Hero images for the site** → Google AI Studio Nano Banana Pro at $0.039/image
3. **Premium one-offs** (Set Pack covers, homepage art) → Google AI Studio at 4K resolution (about $0.08/image)

**Realistic monthly cost at that stack:**
- 60 draft/iteration images at $0.04 = $2.40
- 55 hero images at $0.039 = $2.15
- 10 premium one-offs at $0.08 = $0.80
- **Total: ~$5.35/month** (vs $60+ at Replicate pricing)

---

## What to build next

**Immediate (half a day):**
- Add a `GOOGLE_API_KEY` env var branch to `scripts/gen-images-moodboards.sh`
- Keep the Replicate path as a fallback
- Add a `FK_IMAGE_PROVIDER` env var that routes: `replicate` | `google` | `fal` | `together`

**Later (when we want bulk content):**
- Port `scripts/gen-images-simple.sh` to the new provider abstraction
- Add a `--draft` flag that uses the Together tier
- Add a `--premium` flag that uses Google at 4K

---

## What this does NOT change

The moodboards themselves work for any provider. The JSON + prompt-block approach is model-agnostic. We can swap providers freely without rewriting a single moodboard.

The Nano Banana Pro images already generated (in `public/images/blog/`) are fine — they're what they are. This research is about **future** image runs, not retroactive replacement.
