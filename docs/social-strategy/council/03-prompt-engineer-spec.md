# Round 3: Prompt Engineer responses and unified v1 build spec (Theo Lindqvist)

**Date:** 2026-10-25. Builds on `00`, `01-*` and `02-*`. Spec only: no code was changed, nothing was posted, no paid API was called. The inventory numbers below come from running `npx tsx` over `src/lib/data` and grepping `content/blog`.

---

## PART 1: Responses

**Numbers never touch the LLM.** Code builds a fact sheet in which every value has an ID and a source path (`f07` = Adriatic Delay Time, `549 ms`). Templates render slides 2 onward from it. The LLM writes only the headline, the caption lines and block notes, and it must cite a `fact_id` for every digit it writes.
- The gate pulls every numeric token out of the LLM text, and a token that doesn't match a cited fact **blocks** the post.
- After rendering, a second check compares every slide value to the fact sheet by ID.
- Sasha's "Key of Ab" appears nowhere in the source, so it would fail.

**Dedupe key.** `fkKey = sha256(platform:slotId:entityKey:format)`.
- It's written to the ledger as `publishing` *before* the HTTP call, and it's sent as Zernio's `Idempotency-Key`. Zernio returns 422 when a key is reused with a different body.
- `publishing` and `unknown` rows are never auto-resent. The next run reconciles them by `metadata.fkKey`.
- No random UUID and no retry-tomorrow path, so the triple-retry incident can't recur.

**Saves and shares.** `PostAnalytics` has per-post `saves`, `shares`, `reach`, `profileViews` and `follows`. **There's no separate "sends" field.** Meta's `shares` includes DM sends, so the digest labels the column that way.
- Ranking by (saves+shares)/1k reach runs automatically.
- The week-4 reallocation only fires once each format has ≥3 synced posts and ≥500 reach. Below that, the digest says "insufficient data."

**UTM link page.** One route, `/ig`, revalidated hourly, reading the last 12 Zernio posts server-side and reusing `NewsletterSignup`. That's about 2–3 hours, one deploy, and `ZERNIO_API_KEY` added to prod. Pinterest links go straight to pages. Both channels share `utm_content={slotId}`.

**Worship share: 40%.** The inventory decides it.
- There are 11 distinct worship song or artist entities: 5 recipes, `holy-forever` and 5 artist posts. Blog posts about the same song as a recipe collapse into one entity.
- There are about 20+ worship-rig settings posts.
- One song-based Sunday Sound a week lasts 11 weeks, and a worship-rig Knob Card slot lasts all 90 days. A 50% share would push gear-lab physics into worship slots.
- **Mix:** 2 worship, 2 Knob Card, 1 Fix-It. From Nov 30, Monday becomes C2 "Just unwrapped."
- The digest prints runway every week, and the share goes to 50% as worship recipes ship.

**Five a week vs a daily cap.** Both hold. The plan is 5 weekday slots, and code enforces at most 1 feed post per platform per day.

**Threads and Pinterest.** Pinterest renders in v1 and publishes as soon as Daniel connects it and sets `boardId`. It needs no link page and no replies. Threads moves to v1.1 (week 2), because it needs a human replying.

**Pause.** This is Daniel's call. I recommend pausing the current task today: every run spends trial reach on 12–13-hashtag teasers. The v1 routine plans, writes, gates and renders, but won't publish until `profileReady: true` is set in `scripts/social/config.json`.

---

## PART 2: Unified v1 build spec

Everything new lives in `scripts/social/`, which is script-only. Puppeteer must never reach the Next bundle. Runtime state lives in `docs/social-queue/v2/`, which is uncommitted, matching how `promoted.log` works today. The old `scripts/social-post.ts` and `src/lib/social/*` are left untouched and are retired by the SKILL.md swap.

### 1. Inventory and slot scheduler

**`scripts/social/config.json`** (committed; Daniel's only knobs):
```json
{
  "timezone": "America/Chicago",
  "profileReady": false,
  "approvalMode": true,
  "platforms": { "instagram": true, "pinterest": false },
  "pinterestBoardId": null,
  "postTime": "11:30",
  "slots": {
    "mon": "knob_card", "tue": "sunday_sound", "wed": "fix_it",
    "thu": "knob_card", "fri": "worship_rig"
  },
  "seasonal": [{ "from": "2026-11-30", "to": "2027-01-15", "day": "mon", "format": "knob_card", "filter": "unwrapped" }],
  "cooldownDays": { "entity": 56, "sourceSameFormat": 99999 },
  "hashtagPools": {
    "sunday_sound": ["worshipguitar", "line6helix", "worshipleader"],
    "worship_rig":  ["worshipguitar", "line6helix", "hxstomp"],
    "knob_card":    ["line6helix", "helixtone", "guitartone"],
    "fix_it":       ["guitartone", "line6helix", "hxstomp"]
  },
  "fixItAllowlist": [],
  "unwrappedGear": ["hx-stomp", "katana", "pod-go", "helix-lt"]
}
```
Notes on the config:
- `worship_rig` is a Knob Card fed from worship-tagged settings posts.
- `fixItAllowlist` holds blog slugs that a human or coding session has reviewed. Quick-fix posts have no verification field, so nothing outside this list is eligible for Fix-It. The digest proposes candidates.

**`scripts/social/inventory.ts`**
```ts
export type Format = "knob_card" | "sunday_sound" | "worship_rig" | "fix_it";
export interface InventoryItem {
  sourceKind: "recipe" | "blog";
  slug: string;
  url: string;                 // SITE_URL + path, never req origin
  entityKey: string;           // "song:goodness-of-god-bethel-music" | "post:<slug>" | "amp:<slug>"
  formats: Format[];           // eligible formats
  worship: boolean;
  attribution: "documented" | "pool" | "tribute" | "unset";
  excluded?: string;           // reason; excluded items are never picked
}
export function buildInventory(cfg: Config): InventoryItem[];
```
Eligibility rules:
- **sunday_sound:** worship recipes (song genres match `/worship|ccm|christian/`), plus `category: tone-recipes` blog posts tagged worship. A blog post whose song matches a recipe gets the recipe's `entityKey` via `scripts/social/entity-map.json` (5 entries today).
- **worship_rig:** blog posts tagged worship that have a `SettingsGrid` or a markdown table and aren't `sunday_sound`.
- **knob_card:** `settings-guides` and `modeler-masterclass` posts with a table or `SettingsGrid` that mention Helix or HX Stomp.
- **fix_it:** posts in `cfg.fixItAllowlist` only.
- **Always excluded:**
  - posts matching `/I tested|we tested|I've owned|in my studio|I tried/i` (fabricated persona testing)
  - AI-meta slugs (`/ai-|axl/`)
  - posts that yield fewer than 6 numeric facts

**`scripts/social/scheduler.ts`**
```ts
export interface SlotPlan { slotId: string; date: string; weekday: string; format: Format;
  item: InventoryItem; hookStyle: "H1" | "H2"; scheduledFor: string /* ISO with offset */ }
export function planWeek(weekStart: string, inv: InventoryItem[], ledger: LedgerRow[], cfg: Config): SlotPlan[];
```
- `slotId = "{date}-{format}"`, e.g. `2026-11-03-sunday_sound`.
- **Picker:** among eligible items, drop any whose `entityKey` appeared in the ledger in the last `cooldownDays.entity` days, and any whose `(slug, format)` has ever been used. Then sort, worship first for worship slots, preferring `documented > pool > tribute > unset` and newest `updated`/`created_at`. Take the first. If nothing remains, the slot is `skipped: "inventory_exhausted"` and goes in the digest.
- `hookStyle` alternates H1/H2 per format, read from the ledger.

**`scripts/social/ledger.ts`.** The ledger is `docs/social-queue/v2/ledger.jsonl`, append-only, where the last row per `fkKey` wins.
```ts
export type LedgerState = "planned" | "gated" | "gate_failed" | "rendered" | "publishing"
  | "scheduled" | "pending_approval" | "published" | "failed_permanent" | "unknown" | "skipped";
export interface LedgerRow { fkKey: string; slotId: string; platform: "instagram" | "pinterest";
  format: Format; entityKey: string; sourceSlug: string; hookStyle: "H1" | "H2";
  hook?: string; captionLine1?: string; state: LedgerState; zernioPostId?: string;
  platformPostUrl?: string; detail?: string; at: string }
export function fkKey(platform: string, slotId: string, entityKey: string, format: Format): string;
// sha256 hex, first 40 chars
export function readLedger(): LedgerRow[]; export function append(row: LedgerRow): void;
export function latest(fkKey: string): LedgerRow | undefined;
```

### 2. Fact sheet (`scripts/social/factsheet.ts`, `scripts/social/blog-parse.ts`)

```ts
export function buildFactSheet(plan: SlotPlan, ledger: LedgerRow[], cfg: Config): FactSheet;
export function parseBlog(slug: string): { frontmatter: any; tables: Table[]; grids: Grid[] };
// Table = {heading: string|null, header: string[], rows: string[][]}; parsed from GFM pipes
// Grid  = {title, subtitle, knobs: {name, value, display}[]} from <SettingsGrid>/<Knob> regex
```
**Schema `fk.factsheet.v1`**, written to `docs/social-queue/v2/weeks/{weekStart}/{slotId}/factsheet.json`:
```json
{
  "schema": "fk.factsheet.v1",
  "slotId": "2026-11-03-sunday_sound",
  "format": "sunday_sound",
  "hookStyle": "H1",
  "source": { "kind": "recipe", "slug": "hislop-goodness-of-god",
              "url": "https://faderandknob.com/recipe/hislop-goodness-of-god" },
  "entityKey": "song:goodness-of-god-bethel-music",
  "display": { "song": "Goodness of God", "band": "Bethel Music", "album": "Victory (Live)",
               "year": 2019, "platformLabel": "Helix", "gearTitle": null,
               "otherPlatforms": ["Quad Cortex", "Katana", "Kemper", "Fractal", "TONEX", "Pedalboard"] },
  "attribution": { "confidence": "pool",
                   "line": "Victory (Live) credits electric guitar to a pool of players, not per song. Rebuilt from the recording.",
                   "bannedNames": ["David Hislop", "Hislop", "Ed Cash", "Scott Cash", "Jonathan Lee", "Michael Pope"] },
  "facts": [
    { "id": "f07", "kind": "setting", "blockId": "b07", "label": "Time", "value": 549,
      "display": "549 ms", "sourcePath": "recipe.platform_translations.helix.chain_blocks[6].settings.Time" },
    { "id": "t01", "kind": "text", "text": "82 BPM", "numbers": ["82"],
      "sourcePath": "recipe.platform_translations.helix.chain_blocks[6].notes" }
  ],
  "blocks": [
    { "blockId": "b07", "name": "Adriatic Delay", "category": "Delay", "enabled": true,
      "factIds": ["f07", "f08", "f09", "f10"], "notes": "<verbatim recipe note, for the LLM to condense>" }
  ],
  "recentHooks": ["...last 10 hooks from ledger..."],
  "recentLine1s": ["...last 10 caption_line1..."],
  "hashtags": ["worshipguitar", "line6helix", "worshipleader", "goodnessofgod", "bethelmusic"],
  "cta": "Send this to whoever runs your Sunday rig.",
  "disclosure": "Settings researched and written by AI. Corrections are published on the site."
}
```
Rules:
- **Display formatting:** `display` comes from `lookupParam(label, category)` in `src/lib/parameters/registry.ts`. The unit suffix is taken from `ParamMeta` and the raw value is never rounded.
- **Hidden params:** `Bias, BiasX, Hum, Ripple, Pan, Delay, Angle, Resonance` and `Level` when it's `0` don't get slide rows. They stay in the fact sheet.
- **Blog sources:** each table cell becomes a setting fact with `sourcePath: "blog.tables[3].rows[1][2]"`. Each `takeaways[i]` becomes a text fact, with `numbers` extracted by regex.
- **Prose numbers:** BPM, key and similar values are text facts only if a regex matches the source. They are never inferred.
- **Banned names:** `bannedNames` holds the recipe artist's name whenever `confidence !== "documented"`, plus every `author` persona name in `src/lib/writers.ts`, always.
- **Block order on worship slides:** Delay, Reverb, Amp, Cab, Drive, Comp, Volume, with at most 5 block slides.

### 3. Copy step

**v1, no API key:** the scheduled Claude agent writes `copy.json` in-session. Then a **separate subagent** (Agent tool, fresh context) writes `critic.json`. The agent session is the LLM. Code makes every decision that blocks a post.

`npx tsx scripts/social/run.ts plan --week` writes `copy-request.md` beside each fact sheet. Its text is fixed in `scripts/social/prompts/copy.md`, with `{{...}}` filled by code:

```markdown
You are writing the words for ONE Fader & Knob Instagram carousel. Code renders every number,
gear name, credit, CTA, disclosure and hashtag. You write four short fields and nothing else.

INPUT: factsheet.json at {{path}}. Read it fully. Format: {{format}}. Hook style: {{hookStyle}}.
  H1 Recognition = name a problem this reader already has ("Your swells sound choppy on Sunday.")
  H2 Revelation  = one concrete fact they didn't know, taken from a fact in the sheet.

READER: a volunteer guitarist at a church or a hobbyist on a Line 6 Helix or HX Stomp who has
never heard of us. Slide 1 must make sense to them with no caption.

WRITE copy.json at {{outPath}}, exactly this JSON (no prose around it):
{ "schema":"fk.copy.v1", "slotId":"{{slotId}}", "hook_style":"{{hookStyle}}",
  "slide1_headline": "<=12 words",
  "slide1_fact_ids": ["1 to 3 fact ids code will print under the headline"],
  "caption_line1": "<=110 chars, must differ from every recentLine1s entry",
  "caption_body": "<=60 words, 1-2 sentences of practical use (how to adapt it to their band/room)",
  "block_notes": [{"blockId":"b07","line":"<=14 words, condensed from that block's notes"}],
  "cited_facts": [{"fact_id":"f07","text":"exact display string as it appears in your text"}] }

HARD RULES (code rejects violations; you get the reasons and two more tries):
1. Any digit you write must be the exact `display` (or a `numbers` entry) of a fact you list in
   cited_facts. Never compute, round, convert or invent a number. If no fact has it, don't say it.
2. Slide-1 headline and caption_line1: none of these words: tone recipe, preset, snapshot,
   signal chain, IR, DSP, block. Use the reader's words (sound, settings, knobs, swells, Sunday).
3. Never write any name in attribution.bannedNames. Never imply anyone tested, owns, or played
   anything. No "players love", no community claims.
4. Banned: here's what/why/how, here is/are the, you won't believe, game-changer, next level,
   unlock, elevate, delve, seamless, lush, magic, whether you're, when it comes to,
   "not just ... it's", in my experience. No hashtags, no URLs, at most one emoji, don't open
   with "link in bio".
5. Don't repeat the first five words of any recentHooks entry.
6. Don't write the CTA, disclosure, credit line or hashtags. Code adds them.
```

**Critic prompt** (`scripts/social/prompts/critic.md`, run by the subagent, which sees only `factsheet.json` and `copy.json`):
```markdown
Score this carousel copy. Output critic.json only:
{ "schema":"fk.critic.v1","slotId":"...",
  "C1_stranger":0|1, "C2_question":"Q1|Q2|Q3|Q4|Q5|Q6|none", "C3_specific":0|1,
  "C4_hook_style_match":0|1, "C5_honest":0|1, "reasons":["one line per 0"] }
C1: slide1_headline alone makes sense to a guitarist who has never heard of Fader & Knob.
C2: which visitor question slide 1 answers without the caption (none = fail).
C3: names a number, a gear model, or a song. C4: matches hook_style definition.
C5: no implied human testing, no invented community, no player named against attribution.
```

**Optional SDK path, once `ANTHROPIC_API_KEY` exists** (`scripts/social/llm.ts`):
```ts
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://api.anthropic.com" });    // Claude Code shell sets ANTHROPIC_BASE_URL — override it
export async function writeCopy(fs: FactSheet, feedback?: string[]): Promise<Copy>;
//  model "claude-sonnet-5-5"; system = prompts/copy.md (static, cache_control: ephemeral);
//  user = JSON.stringify(fs) + feedback; tools=[{name:"write_copy", input_schema: COPY_SCHEMA}],
//  tool_choice {type:"tool", name:"write_copy"}; max_tokens 1024.
export async function critique(fs: FactSheet, copy: Copy): Promise<Critic>;
//  model "claude-haiku-5-5", same pattern with CRITIC_SCHEMA.
```
The flag is `--llm sdk|agent`, with `agent` as the default. It costs about 5 posts × ~4k cached input tokens a week, so cents. Batch API isn't worth it at this volume.

### 4. Deterministic gate (`scripts/social/gate.ts`)

```ts
export interface GateReport { slotId: string; pass: boolean; blocking: Check[]; advisory: Check[] }
export interface Check { id: string; pass: boolean; detail?: string }
export function runGate(fs: FactSheet, copy: Copy, critic: Critic | null, ledger: LedgerRow[]): GateReport;
export function verifyRendered(fs: FactSheet, slides: SlideSpec[]): Check;  // post-render D1b
```
**Blocking checks:**

| ID | Check |
|---|---|
| D0 | `copy.json` and `critic.json` match their schemas (hand-written validator, no new deps). `slotId` and `hook_style` equal the fact sheet's. |
| D1 | **Number fidelity.** `tokens = /\d+(?:[.,]\d+)?\s?(?:k|ms|hz|khz|db|%|bpm)?/gi` over every LLM string. Each token, normalized (lowercase, no space), must equal a normalized `display`/`numbers` entry of a fact listed in `cited_facts`. Every `fact_id` must exist in the fact sheet. `slide1_fact_ids` must exist, number 1–3, and be `kind: setting` or text facts with numbers. |
| D1b | **Rendered fidelity.** Every value cell in `SlideSpec[]` carries a `factId`, and its string must be `===` to `facts[id].display`. Runs after compose and before upload. |
| D2 | **Banned patterns.** Sasha's list, verbatim (case-insensitive). The escalator list applies to `slide1_headline` and `caption_line1` only. `bannedNames` is matched as whole words in all fields. |
| D3 | **Lengths.** Headline ≤12 words, line1 ≤110 chars, body ≤60 words, block note ≤14 words. Assembled caption ≤2,200 chars. |
| D4 | **Novelty.** The first 5 words of the headline don't match any of the last 10 hooks. Word-trigram Jaccard of `caption_line1` against each of the last 10 is <0.5. |
| D5 | **Hygiene.** No `#`, no `http`, at most 1 emoji in LLM fields. Assembled hashtags ≤5. |
| D6 | **Attribution.** If `confidence !== "documented"`, the assembled caption and the closing slide contain `attribution.line`. |
| D7 | **Source policy.** The item isn't excluded. Fix-It items are in the allowlist. |
| C1, C5 | Critic stranger test and honesty must be 1. Ambiguity here is a trust risk, so these block. |
| D8 | `--live` only: `POST /v1/tools/validate/post` with the real body returns no errors. |

**Advisory, logged for the A/B data, not blocking:** C2 (must not be `none`, warn only), C3 (D1 already forces a number on slide 1), C4. This splits Sasha's 5/5 rule along Mara's line: anything about facts or honesty blocks; anything about style is logged.

**Loop:** on failure, the agent gets `gate.json` reasons and rewrites `copy.json`, at most twice. After that, the ledger row is `gate_failed` and the item goes in the digest. **There is no fallback publish.**

### 5. Renderer (`scripts/social/render/`)

```ts
// compose.ts — pure; no I/O
export interface SlideSpec { kind: "cover" | "fact" | "block" | "rule" | "close" | "pin";
  index: number; total: number; title: string; lines: { text: string; factId?: string }[];
  rows?: { label: string; value: string; factId: string; min?: number; max?: number; neutral?: number }[];
  altText: string }
export function composeSlides(fs: FactSheet, copy: Copy): SlideSpec[];   // IG 4:5
export function composePin(fs: FactSheet, copy: Copy): SlideSpec;        // 2:3 tall card
export function composeCaption(fs: FactSheet, copy: Copy): string;
// render.ts
export async function renderSlides(specs: SlideSpec[], outDir: string,
  size: { w: 1080; h: 1350 } | { w: 1000; h: 1500 }): Promise<string[]>;  // JPEG paths
```
**Slide plans:**
- **sunday_sound** (≤7 slides): cover (headline + fact line + "{song} · {band}") → ≤5 block slides (block name, ≤8 rows, condensed note) → close (attribution line + CTA + "Also for {otherPlatforms}: faderandknob.com, link in profile"). The close is Mara's merge of "Same Sound."
- **knob_card / worship_rig** (≤6 slides): cover → rule slide (one takeaway text fact) → up to 3 table or grid slides → close.
- **fix_it** (3 slides): symptom (headline) → cause (text fact) → exact move (table row facts) → plus close.

**Caption assembly** (template, not LLM):
```
caption_line1

caption_body

{attribution.line, if confidence != documented}
{cta}
Full settings for Helix and 6 other rigs: link in profile.
{disclosure}

#t1 #t2 #t3 #t4 #t5
```

**Alt text** is deterministic, e.g. `"Slide 3 of 7. Adriatic Delay settings on Helix: Time 549 ms, Feedback 35, Mix 28, High Cut 5500 Hz."` It's built from rows, so it's covered by D1b.

**Templates** (`render/templates.ts`) return full HTML strings: `cover(spec)`, `block(spec)`, `fact(spec)`, `rule(spec)`, `close(spec)`, `pin(spec)`.
- **Tokens:** copied from `src/app/v3.css`. Paper `#EDEAE4` background, ink `#0A0908` text, amber `#E4A235` for values and knob arcs, `--panel #0A0908` block-slide header bar with paper text, `--tape #D8342B` for the slide index chip, radius 0.
- **Knobs:** each knob is an inline SVG 270° arc using `min/max/neutral` from `lookupParam`. A neutral tick sits on the body. Rows without a range show the value only.
- **Brand mark:** "FADER & KNOB" in Oswald/condensed, bottom-left, on every slide, with "n/N" bottom-right.
- **Fonts:** `<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Geist:wght@400;600&family=Geist+Mono&family=Oswald:wght@500&display=block">`. Fraunces is for headlines, Geist for body, Geist Mono for values.
- **Render:**
  - Launch `puppeteer-core`, using the executable logic from `src/lib/pdf/render-print-pdf.ts`: `LOCAL_CHROME_PATH`, else the darwin default. Copy that logic; don't import the module, because it imports `server-only`.
  - Set the viewport to exactly w×h at `deviceScaleFactor: 1`, call `setContent(html, {waitUntil:"networkidle0"})`, then `await document.fonts.ready`.
  - **Fail closed** unless `document.fonts.check('700 64px Fraunces') && document.fonts.check('400 32px Geist')`.
  - Take a PNG screenshot, then run `sharp(...).jpeg({quality: 90, mozjpeg: true})` with a ≤1 MB target.
- **Overflow guard:** after layout, if any `[data-fit]` element has `scrollHeight > clientHeight`, throw. The slot fails as `render_overflow` rather than shipping clipped text.
- **Outputs:** `slides/01.jpg…`, `pin.jpg`, and a weekly `contact-sheet.jpg` (sharp composite, 5 rows) for Daniel's Monday review.
- **AI labeling:** these are typeset data cards with no generated imagery, so `isAiGenerated: false`. The AI-written copy is disclosed in the caption and the bio.

### 6. Publisher (`scripts/social/zernio.ts`, `scripts/social/publish.ts`)

```ts
const BASE = "https://zernio.com/api/v1";
export async function uploadMedia(file: string, ttlNeededHours: number): Promise<string>;
//  ttl <= 20h: POST /media/presign {filename, contentType:"image/jpeg", size} → PUT uploadUrl → publicUrl
//  ttl  > 20h: POST /media/upload-direct (multipart, documented 7-day retention, ≤4.5 MB) → url
//  Reason: presigned /temp/ retention is undocumented; weekly batches schedule up to 4 days out.
export async function accountId(platform: "instagram" | "pinterest"): Promise<string>;  // GET /accounts, `_id`
export async function createPost(body: object, idemKey: string): Promise<CreateResult>;
export async function listPosts(fromDate: string): Promise<ZPost[]>;   // GET /posts?fromDate=&limit=50
export async function validatePost(body: object): Promise<string[]>;   // POST /tools/validate/post
export async function publishSlot(slotDir: string, opts: { live: boolean }): Promise<LedgerRow[]>;
```
**Instagram body:**
```json
{
  "content": "<composeCaption()>",
  "mediaItems": [{ "type": "image", "url": "<publicUrl 01>", "altText": "<spec.altText>" }],
  "platforms": [{ "platform": "instagram", "accountId": "<_id>",
                  "platformSpecificData": { "isAiGenerated": false } }],
  "scheduledFor": "2026-11-03T11:30:00-06:00",
  "timezone": "America/Chicago",
  "requiresApproval": true,
  "tags": ["fk-v2", "fmt:sunday_sound", "hook:H1", "wk:2026-11-02"],
  "metadata": { "fkKey": "<40 hex>", "slotId": "2026-11-03-sunday_sound", "format": "sunday_sound",
                "hookStyle": "H1", "entityKey": "song:goodness-of-god-bethel-music",
                "sourcePath": "/recipe/hislop-goodness-of-god", "utmContent": "2026-11-03-sunday_sound" }
}
```
The example shows one media item, but the real body carries 3–7 items, one per slide in order. `requiresApproval` mirrors `cfg.approvalMode`.

**Pinterest** is a separate post with its own `fkKey`, never a cross-post of the IG media. `mediaItems: [pin.jpg + altText]` and `platformSpecificData: { title: headline≤100, boardId, link: "{url}?utm_source=pinterest&utm_medium=social&utm_campaign={format}&utm_content={slotId}", isAiGenerated: false }`.

**Publish algorithm per slot and platform:**
1. Compute `fkKey`. If `latest(fkKey)` is in any state other than `planned/gated/rendered`, **stop**. It's already attempted, or it's reconciling.
2. **Daily cap:** if any ledger row or Zernio post has the same platform and the same local `date` in state `scheduled|pending_approval|published|publishing`, stop with `skipped: daily_cap`.
3. Without `--live`, print the body and exit.
4. Upload the media, then append `publishing`, then `createPost(body, fkKey)`.
5. Map the response:
   - 201 → `scheduled` / `pending_approval` / `published`
   - 207 → as handled in today's adapter (`post.status=scheduled` = `scheduled`, otherwise `failed_permanent`)
   - 409 → `unknown`
   - 422 (key reused with a different body) → `failed_permanent: idempotency_conflict`
   - 4xx → `failed_permanent`
   - 5xx or timeout → `unknown`
6. **Reconcile** at the start of every run: for rows in `publishing|unknown|scheduled|pending_approval`, `listPosts` and match `metadata.fkKey`, then update the state and `zernioPostId`. Nothing is re-sent automatically. An `unknown` with no match after 48h goes to the digest.

### 7. Analytics pull and Monday digest

```ts
// scripts/social/metrics.ts
export async function pullMetrics(days = 21): Promise<MetricRow[]>;
//  GET /analytics?source=late&fromDate=&toDate=&limit=50&page=n ; match rows to ledger via zernioPostId
//  then GET /analytics/instagram/account-insights for the account line.
export interface MetricRow { date: string; zernioPostId: string; fkKey: string; platform: string;
  format: Format; hookStyle: "H1" | "H2"; syncStatus: "synced" | "pending" | "unavailable";
  reach: number; impressions: number; views: number; saves: number; shares: number;
  likes: number; comments: number; profileViews: number; follows: number | null }
// appended to docs/social-queue/v2/metrics.jsonl; latest snapshot per post wins
// scripts/social/digest.ts
export function buildDigest(today: string): string;  // → docs/social-queue/v2/digests/{date}.md
```
The score is always computed ourselves, never taken from Zernio's `engagementRate`: `score = (saves + shares) / reach × 1000`.

**Digest layout** (one screen):
```
## Social digest 2026-11-09 (trailing 14 days)
| Format | Posts | Median reach | Saves | Shares (incl. DM sends) | (Saves+Shares)/1k reach | H1 / H2 score | Gate fails |
|---|---|---|---|---|---|---|---|
Account: followers {n} (Δ{d}), profile views {n}. Social sessions / email signups: not wired in v1 (GA4 manual).
Top post: … · Bottom post: …
Runway: sunday_sound {k} entities left ≈ {k} weeks · worship_rig … · fix_it allowlist {n} left
Decisions applied: {week≥4 reallocation | "insufficient data (needs ≥3 synced posts and ≥500 reach per format)"}
Day-45 check (from 2026-12-09): median non-follower carousel reach {n} vs 150; score vs account median.
Needs Daniel: gate_failed slots · unknown publishes · Fix-It allowlist candidates (5) · approve this week's posts in Zernio
```
**Week-4+ rule:** if every format has ≥3 synced posts and ≥500 reach, the lowest-scoring format gives its next weekly slot to the highest-scoring one. This is written to `docs/social-queue/v2/slot-overrides.json`, which `planWeek` reads, so the committed config is never edited. A format below 0.5× the account median for 2 digests in a row is dropped from slots, and the digest flags this for Daniel.

### 8. Layout, CLI and the new SKILL.md

```
scripts/social/
  run.ts               CLI entry
  config.json          committed knobs
  entity-map.json      blog slug → recipe entityKey
  inventory.ts  scheduler.ts  ledger.ts  factsheet.ts  blog-parse.ts
  gate.ts  llm.ts  zernio.ts  publish.ts  metrics.ts  digest.ts
  prompts/copy.md  prompts/critic.md
  render/compose.ts  render/templates.ts  render/render.ts
  __tests__/gate.test.ts  __tests__/blog-parse.test.ts  __tests__/compose.test.ts   (vitest)
docs/social-queue/v2/   ledger.jsonl  metrics.jsonl  slot-overrides.json  digests/
                        weeks/{weekStart}/contact-sheet.jpg
                        weeks/{weekStart}/{slotId}/ factsheet.json copy-request.md copy.json
                                                    critic.json gate.json slides/*.jpg pin.jpg body.*.json
```
**CLI** (`npx tsx scripts/social/run.ts <cmd> [flags]`). Without `--live`, nothing is ever written to Zernio.

| Command | Does |
|---|---|
| `plan --week [--start YYYY-MM-DD]` | Reconcile, inventory, `planWeek`, write fact sheets and copy-requests, append `planned` rows. |
| `gate --slot <id>` or `--week` | Run the gate and write `gate.json`. Exit code 1 if any slot fails. |
| `render --week [--render-only]` | Compose and render. `--render-only` also accepts a hand-written `copy.json` and makes no network calls. |
| `publish --week [--dry-run]` | Print bodies only; this is the default. |
| `publish --week --live` | Upload and create posts; requires `config.profileReady === true`. |
| `metrics` | Read-only Zernio analytics pull. |
| `digest` | Write the Monday digest. |
| `status` | Print this week's ledger states. |

Global flags: `--llm agent|sdk` (default `agent`), `--platforms instagram,pinterest`.

**Rewritten `~/.claude/scheduled-tasks/faderandknob-social-autopost/SKILL.md`:**
```markdown
---
name: faderandknob-social-autopost
description: Fader & Knob social v2 — Monday: digest + plan/write/gate/render/schedule the week's 5 carousels; other days: reconcile + metrics
---
Working dir: /Users/daniellivengood/Documents/Claude/tone-recipes

0. If scripts/social/run.ts is missing, STOP and report "social v2 not present". Do not run
   scripts/social-post.ts (retired).
1. export $(grep -E '^ZERNIO_API_KEY=' .env.local | xargs)
2. Every day: `npx tsx scripts/social/run.ts metrics` then `npx tsx scripts/social/run.ts status`.
3. Mondays only (America/Chicago):
   a. `npx tsx scripts/social/run.ts digest`
   b. `npx tsx scripts/social/run.ts plan --week`
   c. For EACH slot dir listed: read copy-request.md and factsheet.json, then write copy.json
      exactly as copy-request.md specifies. Do not edit factsheet.json, config, code or the ledger.
   d. For EACH slot, launch a fresh subagent with ONLY prompts/critic.md + factsheet.json +
      copy.json; it writes critic.json. (If subagents are unavailable, write critic.json yourself
      and add "independent": false; the gate then treats C1/C5 as advisory for that run and the
      digest says so.)
   e. `npx tsx scripts/social/run.ts gate --week`. For each failing slot, read gate.json reasons,
      rewrite copy.json and re-run the critic + gate — at most 2 retries; then leave it failed.
   f. `npx tsx scripts/social/run.ts render --week`
   g. `npx tsx scripts/social/run.ts publish --week --live`. The script refuses to post unless
      config.profileReady is true; that refusal is expected, not an error.
4. Report: digest headline numbers, each slot's state (scheduled / pending_approval / gate_failed /
   skipped + reason), the contact sheet path, and anything under "Needs Daniel".

Guardrails: never retry a publish by hand; never edit config.json, the ledger or code; never
post to Reddit, X or Facebook groups; never commit or touch git; never add audio to anything;
never call any image/video model. One feed post per platform per day is enforced in code;
do not work around it.
```

### 9. Out of v1

- **Reels:** silent knob-turn Trial Reels (`trialParams`) wait for v1.2, after day 30. No audio until real DI renders populate `src/data/audio-demos.json`.
- **Other platforms:** TikTok photo carousels, Threads (v1.1, week 2, needs a human replying), Bluesky, X, YouTube Shorts. The old TikTok/YT queue path is retired.
- **Formats:** Verdict (v1.1, week 3), 48-Hour News (Threads only, v1.1), and the monthly "What we got wrong" corrections carousel (v1.2).
- **Link page:** the `/ig` page is a separate coding-session build with one deploy. Until it ships, the bio links to the homepage with UTMs.
- **Attribution data:** GA4/UTM sessions and email-signup attribution in the digest (needs GA4 API credentials). The digest says "manual" until then.
- **Optimization:** hook bandits beyond H1/H2 alternation, and best-time scheduling from `/v1/analytics/best-time` (no data yet, so a fixed 11:30).
- **Engagement:** `firstComment`, collaborators, and automated replies or DMs. The last is never planned.
- **Fonts:** vendoring font TTFs into the repo. The Google Fonts link plus the fail-closed font check covers v1.

---

**Summary**
1. **Facts and gate:** the LLM writes only the slide-1 headline, caption lines and block notes, each tied to a fact ID. Code renders every number, name, credit and hashtag. Number fidelity, banned patterns, length, novelty, attribution, critic stranger and honesty checks all block; Sasha's "Key of Ab" fails it, as it should.
2. **Dedupe:** a content-derived `fkKey` is written to the ledger before posting and doubles as Zernio's Idempotency-Key, with no auto-resend and reconciliation by `metadata.fkKey`. Zernio gives per-post `saves` and `shares` (DM sends are folded into shares), and the digest ranks by (saves+shares)/1k reach, gated on enough data.
3. **Mix and cadence:** inventory sustains 40% worship (11 song entities plus ~20 worship-rig posts over 90 days), so the plan is 2 worship / 2 Knob Card / 1 Fix-It. That's 5 slots a week under a 1-per-day code cap. Pinterest is built in v1 and Threads comes in v1.1.
4. **v1 build:** a Monday batch has the scheduled agent write `copy.json` in-session and a subagent critique it. Code renders 1080×1350 and 1000×1500 cards via puppeteer and Chrome, then schedules through Zernio (presign or upload-direct) with alt text, ≤5 hashtags, tags and metadata.
5. **Pause:** I recommend Daniel pause today's autopost now. The new SKILL.md refuses to publish until he sets `profileReady: true`. Approval mode covers weeks 1–2, and the `/ig` link page is a separate one-deploy build.
