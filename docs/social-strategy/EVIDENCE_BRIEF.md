# Social Autopost — Evidence Brief (2026-10-25)

Shared fact base for the three-agent council (Marketing Lead, Social Media Manager, Prompt Engineer).
Repo: /Users/daniellivengood/Documents/Claude/tone-recipes (Next.js site faderandknob.com).

## What runs today
- Scheduled task `faderandknob-social-autopost` runs daily: `npx tsx scripts/social-post.ts --auto --live`.
- Picks the newest blog post (content/blog/*.mdx, 438 posts) not yet in `docs/social-queue/promoted.log`.
- `src/lib/social/generate.ts` is a deterministic template, no LLM: caption = title + frontmatter `description` + "Full walkthrough — link in bio → faderandknob.com" + up to 15 hashtags (post tags + a fixed tail: guitarist ampsim tonequest guitartone helix line6helix worshipguitar).
- Media = the blog's single 16:9 AI-generated hero image (studio gear shot). No carousel, no Reel.
- Only blog posts are ever promoted. Artist tone recipes (200+, the actual product, stored in Supabase; type at src/types/recipe.ts), news (content/news), settings data and .hlx presets are never used.
- Publisher: Zernio API (`src/lib/social/publishers/zernio.ts`). Only Instagram (`faderandknobb`) is connected. X is deliberately OFF (Zernio charges extra). TikTok/YouTube Shorts need video; `scripts/generate-social-clip.ts` makes a ~6s Grok animated clip of the hero (~$0.30) but clips must be committed+deployed before posting, so in practice TikTok/YT just queue forever.
- Zernio also supports Threads, Pinterest, Bluesky, Facebook, LinkedIn, Discord, Telegram (each needs a one-time dashboard OAuth connection by Daniel; check pricing before assuming free). Zernio exposes IG analytics endpoints (`/v1/analytics`, `/v1/analytics/instagram/account-insights`, follower-history, online-followers).

## Results so far (Instagram, last 30 days, Zernio insights)
- 7 posts published since 2026-10-13. **Followers: 0. Reach: 1. Views: 22. Interactions: 0.** Profile picture: null.
- Sample captions: see `docs/social-strategy/published_posts.txt` (exact text of every post).

## Brand / audience constraints (canonical docs — read them)
- `docs/MESSAGING_FRAMEWORK.md` — six visitor questions every piece must answer; the **escalator test** for first-touch copy (no native vocab: "tone recipe", "preset", "snapshot", "signal chain", "IR"...); voice non-negotiables; banned filler.
- `project memory`: SEO/target segment = **worship guitarists on Line 6 Helix / HX Stomp** (TARGET_SEGMENT_AND_SEO_STRATEGY.md, WORSHIP_HELIX_CONTENT_CLUSTER.md). Settings guides ("what do I set the knobs to on my Deluxe Reverb") are the best discovery format on the site (17 users/page) vs artist recipes (2.9).
- Honest-authorship rules (`/experiment` page, docs/AI_SEARCH_PLAYBOOK.md): AI personas are labeled; no fabricated testing, no fake community, no invented numbers; **no synthetic guitar audio** ever (credibility killer — see docs/SHORTS_PIPELINE.md, which designs a "60-second tone recipe" Short blocked on real contractor audio). Media is model-generated → AI-disclosure flags.
- Worship attribution: album-level credits only for worship songs (memory: Grade A/B attribution).
- No "X recipes / X songs" volume-count flexing.
- Reddit/forums stay human-only. One post per run guardrail currently; no git commits from the daily task.
- Distribution plan: `docs/DISTRIBUTION_AUTOMATION_OS.md` §4 (Reach engine), `docs/HEADLESS_DISTRIBUTION_PLAYBOOK.md`, `docs/SEASONAL_CAMPAIGN_CALENDAR.md` (C2 Holiday Gift Engine Oct 2026–Jan 2027 is live now).
- Weekly human budget ≈ 20 minutes (Monday digest). Daniel prefers fully autonomous, but judgment calls go in the digest.

## Tooling available for a rebuild
- Node/TS + `tsx`, `sharp` installed; Homebrew ffmpeg (no drawtext; text is rendered via Python PIL). Replicate key for image/video models (flux-2-pro preferred for images). Anthropic API usable for caption generation (use latest models; Batch API exists).
- Recipe data includes real model names, block order and knob values per platform (Helix, Katana, QC, TONEX, Fractal, Kemper, pedalboard) — perfect raw material for settings-card carousels that are 100% data-derived (no fabrication risk).
