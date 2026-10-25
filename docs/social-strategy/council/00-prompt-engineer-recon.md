# 00 — Prompt Engineer recon (Theo Lindqvist)

Implementation recon for the social-autopost rebuild. Read-only pass, 2026-10-25. Nothing was posted, committed, or sent to any paid API.

## 1. What the pipeline is today

| Piece | Path | Notes |
|---|---|---|
| Entry | `scripts/social-post.ts` | `--auto` picks the newest blog slug that isn't in `docs/social-queue/promoted.log` (`slug\t<iso>`). It only marks a slug once a publish returns `ok:true`. |
| Generator | `src/lib/social/generate.ts` | Pure template, no LLM. IG caption = title + description + "link in bio" + 15 hashtags. X is gated behind `SOCIAL_X_ENABLED=1`. |
| Seam | `src/lib/social/types.ts`, `index.ts` | `Publisher` interface, `GeneratedPost { platform, content, hashtags, media[{kind,url}], title?, thread?, blockedReason? }`. `Platform` is only `x \| instagram \| tiktok \| youtube`. |
| Zernio | `src/lib/social/publishers/zernio.ts` | `POST /v1/posts` with `publishNow:true`, one platform per call, `Idempotency-Key` = a random UUID per call. That makes retries non-idempotent, so the key should be derived from the content. 207 is handled correctly. |
| Queue | `src/lib/social/publishers/queue.ts` | Appends to `docs/social-queue/queue.jsonl`. TikTok and YT land here forever. |
| Clip | `scripts/generate-social-clip.ts` | Grok i2v of the hero image (~$0.30) written to `public/videos/blog/<slug>.mp4`. Unusable until it's deployed, because `social-post.ts` HEAD-checks the live URL. |
| Task | `~/.claude/scheduled-tasks/faderandknob-social-autopost/SKILL.md` | Exports only `ZERNIO_API_KEY` from `.env.local`. No git. One post per run. |

## 2. Zernio capability map (from `zernio.yaml`)

**Media upload removes the deploy blocker.** `POST /v1/media/presign` takes `{filename, contentType, size?}` and returns `{uploadUrl, publicUrl, key, expiresIn:3600}`. You PUT the bytes to `uploadUrl` and use `publicUrl` (served from `media.zernio.com/temp/...`) in `mediaItems`. The limit is 5 GB. `contentType` has to be in the `MediaContentType` enum (png, jpeg, webp, mp4, srt, vtt…), and `application/octet-stream` is rejected. There's also `POST /v1/media/upload-direct` (multipart, about 4.5 MB in practice), whose files auto-delete after 7 days. **Gotcha:** retention for presigned uploads isn't documented, and the path is `/temp/`. So schedule within a few days, and keep our own copy of every rendered asset locally.

**Post body (`POST /v1/posts`):** `content`, `mediaItems[]`, `platforms[{platform, accountId, platformSpecificData, scheduledFor?}]`, plus:
- Timing: `scheduledFor` (ISO with Z/offset) + `timezone`, OR `publishNow`, OR `queuedFromProfile` (next queue slot). `isDraft` wins over all of them. A past `scheduledFor` publishes immediately.
- `requiresApproval: true` saves the post as `pending_approval` until `POST /v1/posts/{postId}/review`. It needs `scheduledFor`. This is a ready-made hook for a human-in-the-loop step.
- `metadata` (free-form, echoed on reads and webhooks) and `tags[]`. **`GET /v1/analytics?tags=` filters by tag**, which gives us experiment-variant labelling for free.
- `POST /v1/tools/validate/post` takes the same body and dry-runs validation: missing media, hashtag limits, char limits.
- One post can target several platforms. Per-platform caption overrides go through `platformSpecificData` / `threadItems`.

**MediaItem:** `{type: image|video|gif|document, url, altText, title, thumbnail, instagramThumbnail, subtitles[{url, language}]}`. **`altText` is per image** and applies on IG feed (not Reels), Threads, Bluesky, Pinterest (≤500), X, LinkedIn and FB.

**Instagram (`InstagramPlatformData`):** a carousel is just multiple `mediaItems`, **up to 20**, with feed aspect 0.5625–1.91, so 1080×1350 works. A single video becomes a Reel. Fields:
- `firstComment`
- `shareToFeed`
- `collaborators` (≤3)
- **`trialParams.graduationStrategy: MANUAL|SS_PERFORMANCE`**. Trial Reels are shown to non-followers first, which matters a lot for an account with 0 followers.
- `instagramThumbnail` / `reelCover`, `thumbOffset`
- `audioConfiguration{audioId}` for catalog music. It needs an IG account connected via Facebook Login.
- `muteAudio`
- `isAiGenerated`, which is for AI *media*, not AI captions
- `userTags[{username, x, y, mediaIndex}]`, `commentsEnabled`, `locationId`

**TikTok:** **photo carousels of up to 35 images**, so TikTok no longer needs video. Use `description` (≤4000) for the photo caption, because photo titles are truncated at 90 chars. Other fields: `photoCoverIndex`, `autoAddMusic` (photos only), `privacyLevel`, `contentPreviewConfirmed`, `expressConsentGiven`. **Gotcha:** `videoMadeWithAi:true` on a Business-app *photo* post is rejected at creation.

**Threads:** up to 10-image carousel, `topic_tag` (1–50 chars, no `.` or `&`), `firstComment` (≤500), `threadItems[]` (item 0 is the root; top-level `content` is not published).

**Bluesky:** ≤4 images or 1 video, `threadItems`, `langs:["en"]`. Set `langs`, or the post won't appear in language feeds.

**Pinterest:** `title` (≤100), `boardId`, **`link`** (a real clickable URL, which no other platform here gives us), `isAiGenerated`.

**Analytics (feedback loop):**
- `GET /v1/analytics?postId=` returns a single post. The list form takes `platform, accountId, source=late, fromDate, toDate, sortBy, tags`.
- `PostAnalytics` fields: `impressions, reach, likes, comments, shares, saves, clicks, views, follows, profileViews, igReelsAvgWatchTime, reelsSkipRate, engagementRate`, plus `syncStatus` (`pending` comes back with HTTP 202).
- **Gotcha:** `engagementRate`'s denominator varies from post to post, so compute (saves+shares)/reach ourselves.
- Also available: `/v1/analytics/best-time`, `/content-decay`, `/post-timeline`, `/v1/analytics/instagram/account-insights`, `/follower-history`.
- Analytics needs the add-on on legacy plans (403 otherwise). IG analytics evidently works on our plan already.

## 3. Recipe data access: correction to the brief

**Recipes are not in Supabase.** They're static TS in `src/lib/data/index.ts` (78.7k lines; `toneRecipes`, `getRecipeBySlug`, `getSongBySlug`). Supabase (`src/lib/db/*`, anon key) only holds community data: ratings, comments, follows, tone_requests. A tsx script can read the full chain with no Next runtime and no env at all. I verified this by running `npx tsx` with `import { toneRecipes } from "@/lib/data"` (tsconfig `@/*` paths resolve). `scripts/verify-predelay-fix.ts` already does the same.

- Shape: `platform_translations[platform].chain_blocks[] = {position, block_name, block_category, original_gear, settings{Param:value}, notes, enabled?, cabSibling?}`. `src/components/v3/recipe-to-blocks.ts` already maps this to `PreviewBlockData` (Helix colour buckets, ranges via `@/lib/parameters/registry`). **Reuse that mapping, don't rewrite it.**
- Counts: 255 recipes, all 255 with Helix. **Only 5 are worship recipes** (hendroff-what-a-beautiful-name, hislop-goodness-of-god, moore-living-hope, moore-way-maker, garrard-great-are-you-lord). `attribution_confidence` is set on only 20 of 255 (17 documented, 3 pool).
- Most of the worship/Helix target content is blog. **56 blog MDX posts embed `<SettingsGrid title subtitle><Knob name value display/></SettingsGrid>`**, which is regex-parsable structured settings data. 33 posts are `category: settings-guides`, the best discovery format.
- `src/data/audio-demos.json` is empty, so there's no real recipe audio yet.
- `.env.local` key names: `STRIPE_SECRET_KEY REPLICATE_API_TOKEN OPENAI_API_KEY ZERNIO_API_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY RESEND_API_KEY CLOUDFLARE_API_TOKEN`.

## 4. Rendering

- **`puppeteer-core` ^25 plus local Chrome** (`/Applications/Google Chrome.app`, path map in `src/lib/pdf/render-print-pdf.ts`) is the best renderer. It handles full CSS, real fonts, and `page.screenshot` at 1080×1350, followed by `sharp` (^0.35) to optimise the output. The PDF module imports `server-only`, so copy its launch logic into the script rather than importing the module.
- Satori/resvg is only available compiled inside `next/dist/compiled/@vercel/og`. It's flexbox-only and ships only Geist-Regular. Fine as a fallback, not as the main renderer.
- Visual identity lives in `src/app/v3.css`, scoped to `.fk-preview`:
  - colours: `--paper #EDEAE4`, `--paper-2 #E2DED6`, `--ink #0A0908`, `--ink-muted #5F5A52`, `--panel #0A0908`, `--amber #E4A235`, `--amber-2 #B37A1D`, `--tape #D8342B`, `--spec-green #5F7A4C`
  - fonts: display **Fraunces**, body **Geist** (both via `next/font/google` in `src/app/layout.tsx`), condensed Oswald, system mono, `--radius: 0`
- **Gotcha:** there are no local TTFs in the repo. Templates have to load Google Fonts over the network, or we vendor the TTFs once into `scripts/social/fonts/`.
- Existing components worth porting: `PreviewKnob.tsx`, `PreviewSchematicChain.tsx`, `BlockIcon.tsx`.

## 5. LLM availability

- `@anthropic-ai/sdk` ^0.104.1 is installed. The only TS caller is `src/app/api/tone-chat/route.ts` (streaming, `cache_control: ephemeral` on the system prompt). Its model IDs are stale: `claude-haiku-4-5` and `claude-sonnet-5`.
- **There is no `ANTHROPIC_API_KEY` in `.env.local`**; it lives in prod env only. Daniel must add it, or the task must export it.
- **Gotcha:** the Claude Code shell sets `ANTHROPIC_BASE_URL`, and the SDK reads it. Construct the client with an explicit `baseURL: "https://api.anthropic.com"`.
- Batch API: there's no existing TS code for it. `scripts/ai-sov-audit.py` and `generate-blog-images.ts` are the only other LLM/model callers.

## 6. Proposed architecture (first sketch)

The principle: **numbers come only from data; the LLM writes words, never values.**

```
S0 SELECT     (code)  pool = 56 SettingsGrid posts + 255 recipe Helix chains + settings-guides;
                       rotation by format mix + seasonal calendar (C2) + dedupe ledger
                       docs/social-queue/ledger.jsonl (uncommitted, like promoted.log)
S1 FACTSHEET  (code)  typed JSON: blocks/knobs with stable fact IDs (f12 = "Deluxe Comp.Ratio=3"),
                       attribution_confidence, worship flag, source URL. No LLM.
S2 WRITE      (Sonnet 5.5, structured output / tool schema; system prompt = MESSAGING_FRAMEWORK
                       + voice rules + format spec, prompt-cached)
                       → slidePlan[{template, factIds[], headline≤8w}], caption, firstComment,
                         altText per slide, 2 hook variants. It may only reference factIds.
S3 GATE       (code first) every rendered number ∈ FactSheet; escalator-test banned vocab on slide 1
                       and the hook; no count-flexing regex; hashtag/char limits; worship → album-level
                       credit only; then POST /v1/tools/validate/post.
              (Haiku 5.5 critic) rubric = six visitor questions + honesty rules, JSON score;
                       one repair pass, then fail → Monday digest, not post.
S4 RENDER     (code)  HTML templates (v3 tokens) → puppeteer 1080×1350 PNG → sharp;
                       Reel/TikTok = ffmpeg slideshow of the same PNGs, silent or IG catalog audio,
                       NEVER synthetic guitar audio.
S5 PUBLISH    (code)  presign+PUT → one multi-platform post (IG carousel, TikTok photo carousel,
                       Threads ≤10, Bluesky ≤4, Pinterest w/ link); scheduledFor from best-time;
                       metadata{format,variant,source}; tags for analytics; altText on every image;
                       isAiGenerated only when the post includes AI imagery (data cards aren't);
                       deterministic Idempotency-Key = hash(source+format+date).
S6 LEARN      (code)  daily pull GET /v1/analytics?source=late → metrics.jsonl;
                       score = (saves+shares)/reach; weekly Thompson-sampling over format weights;
                       Opus 5.5 writes the Monday digest (wins, failures, gate rejects, next-week plan).
```

**Cadence and cost:** run a weekly Monday batch through the Batch API that writes 7 days of posts, each with `scheduledFor`. Optionally set `requiresApproval` for the first 2–3 weeks, which fits inside Daniel's 20-minute review. The daily task then only pulls metrics. Expected LLM cost is cents per post. Rendering is free and local.

**v0 fallback with no API key:** the scheduled task is itself a Claude agent. It can do S2 in-session against the same JSON schema, with the S3 code gates still enforced.

**Honest caveat:** at reach ≈ 1, S6 has no signal for weeks. Start the format weights from priors set by Mara and Sasha, and lean on trial Reels and TikTok photo carousels for non-follower distribution.
