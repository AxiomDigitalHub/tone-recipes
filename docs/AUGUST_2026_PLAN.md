# Fader & Knob — August 2026 Plan

**Written:** 2026-08-05
**Supersedes:** `~/Downloads/faderandknob-august-2026-plan.md` (written without repo access; four of its five premises are wrong — see §1)
**Inherits from:** `docs/GAME_THEORY_2026-07-30.md` (the strategy), `docs/DISTRIBUTION_AUTOMATION_OS.md` (the cadence), `docs/index-health-log.md` (the constraint)
**Verified against:** live site, `src/lib/data/index.ts`, `docs/RECIPE_AUDIT_REPORT.md` (2026-08-03), `docs/CORPUS_QC_SCORECARD.md` (2026-07-25), git HEAD `0016119`

---

## 0. The one-paragraph read

The infrastructure is not broken and the corpus is not unindexed. What's actually true after 140 days: 200 recipes pass a 200/200 clean audit, the sitemap serves valid XML with all 200 recipe URLs in it, GA4 and Clarity have been recording for 90 days, and every recipe generates a real preset on demand for three platforms. The site produced 6,119 views and **zero purchases** in that window, and it has **zero referring domains**. Four months of the strongest content engine available did not move authority one inch, and the repo's own index-health log has said so for three consecutive weeks with the standing rule attached: *do not respond by publishing more pages.* So August is not a fixing month or a publishing month. It is the month the site stops behaving like a publisher and starts behaving like a source — by moving the one signal it owns and nobody can fake (its own measured defect record) onto the page where people decide, and by spending Daniel-hours on the two things machines cannot do: hiring the audio contractor and earning the first ten links.

---

## 1. Corrections to the earlier plan

The Downloads plan was written from the outside. Its top-priority items are mostly artifacts of audit tooling that couldn't decompress responses or execute JS.

| Claim | Reality |
|---|---|
| "Vercel Web Analytics 404s — zero traffic visibility" | GA4 `G-PZLWYT7VMP` + Microsoft Clarity `w3jxns38n6` are live on every page and have 90 days of data. `_vercel/insights` 404s because **the site left Vercel** (see `docs/MIGRATION.md`, `docs/VERCEL_DECOMMISSION_SPRINT.md`) — it's self-hosted behind Caddy + Cloudflare. Nothing to fix. |
| "Sitemap and feed return unparseable binary" | Both return `200` / `content-type: application/xml` / valid XML. `curl` confirms. The auditor read a compressed body. |
| "Zero `/recipe/` URLs discovered; sitemap is the biggest SEO unlock" | The sitemap contains **837 URLs including all 200 recipes**. Discovery is gated by **0 backlinks**, documented weekly since 2026-07-21. |
| "SRV 'Pride and Joy' listed as standard tuning" | Corpus says `tuning: "eb_standard"`, `.013-.058`, with the Eb note in `notable_mods` and `original_gear`. Correct as written. |
| "`/song/` pages are full duplicates" | They `308` to `/recipe/`. No duplication. |
| "`/about` presents AI personas as humans" | `/about` carries 20 explicit "AI writer" labels. Partly stale — see §5.4 for what genuinely remains. |
| "Compressor times off by 1000×" | **Correct — I was wrong to dismiss this.** I first called it unreproducible because the cited recipe slug doesn't exist. It reproduces on recipes that do: `/recipe/bb-king-thrill-is-gone` renders **"Attack 60s, Release 910s"** on its compressor. The scope is larger than the original plan claimed — see §3.3. |
| "Reprice Set Pack $19 → $29" | Premature. You cannot price-test at 0 purchases / 6,119 views. `docs/GAME_THEORY_2026-07-30.md` §5 has the power math: a *doubling* of conversion needs 15.8 months to detect. Repricing this month is guessing with extra steps. |

What the earlier plan got right and is worth keeping: **audio is the biggest conversion gap**, **the engineer's note is duplicated boilerplate**, **genre/era hubs don't exist**, **`/newsletter` 404s**, and **the catalog is a 1980s metal magazine aimed at a worship audience**. Those survive into this plan.

---

## 2. The actual constraint

Three scarce resources, in order:

1. **Referring domains: 0.** Gates Google indexation (4 of 5 worship posts stuck 39 days), gates AI citation (we are named zero times on the discovery prompt across two SOV runs), and gates every content plan downstream. Nothing about this is solved by writing.
2. **Daniel-hours.** The design target in `DISTRIBUTION_AUTOMATION_OS.md` is one ~20-minute approval window per week plus occasional capital events. This plan respects that. Every item below is tagged **[machine]** (no Daniel time), **[20-min]** (fits the weekly window), or **[capital]** (a real one-time decision or spend).
3. **Trust at the moment of decision.** The one costly-to-fake signal we own — a published defect record — is filed in `/docs` and blog posts, not on the page where a skeptic decides. 11 honesty annotations on recipe pages vs 130 in blog posts.

Content production is not on this list. It is solved and it is currently the wrong thing to add more of.

---

## 3. Week 1 (Aug 5–11): Move the signal to the point of decision

This is `GAME_THEORY` recommended move #1, and it is still unshipped. It is the highest payoff-per-hour item on the board and it costs no Daniel time.

### 3.1 Ship the verification band on recipe pages **[machine]** — ✅ shipped 2026-08-05

Under the chain on `/recipe/[slug]`, server-rendered on all 205 recipes:

- **Preset build result** per platform, computed by actually generating the file
- **Blocks that don't survive** — named, split into *dropped* (absent from the file) and *substituted* (silently replaced with a stand-in that loads fine and sounds wrong)
- **DSP cost** — worst-path percentage on a Helix LT, with unknown-cost blocks disclosed
- **Source tier** — primary gear journalism vs aggregator-only, per recipe
- **Attribution confidence** — `documented` / `pool` / `tribute`, backfilled on the worship five
- **What we didn't check** — always visible, never collapsed

Constraint from `GAME_THEORY` §7 held: "verified" means only the machine-executable set. No hardware claims.

Implementation notes worth carrying forward:

- `planHelixChain()` was extracted from `generateHelixPreset()` so the band reads the *same* plan the downloadable file is emitted from. A parallel reimplementation would drift, and a published claim that drifts from the artifact is worse than no claim. Verified byte-identical output across all 205 recipes before and after the extraction.
- The old `is_editorial` → "Editor Verified · Manually reviewed and verified by our editorial team" badge is **gone**; there is no editorial team, and `is_editorial` is `true` on all 205 recipes so every card earned the check automatically. Correcting my first report of this: it rendered via `RecipeCard` on `/v2`, `/v3`, `/v4` and the signed-in `/dashboard` — all publicly reachable — **not** on `/browse`, which uses its own card markup and never showed it. Replaced by preset-completeness, recomputed from a real build.
- Recipe pages compute live (server components, no bundle cost, no staleness). Browse cards read a precomputed `src/data/recipe-verification.json`, regenerated by `scripts/audit-recipes.ts` so the two cannot disagree. Confirmed zero generator/DSP bytes reach the client.

### 3.6 What the band exposed — decide before promoting anything **[capital: a judgment call]**

Running the checks across the corpus produced numbers nobody had:

| Platform | Recipes with a complete preset | Failure mode |
|---|---|---|
| **Helix** | **147 / 205** | 58 drop ≥1 block. Matches the QC scorecard's 28%. |
| **Quad Cortex** | **0 / 205** | Every QC preset substitutes ≥1 block. `Studio Comp` → `TS808 OD` in 175 recipes — a compressor becoming an overdrive. |
| **Katana** | **0 / 205** | 205 substitute, 64 also drop. `Reverb` is unmapped in 108 recipes, resolves to the default overdrive category, takes the Booster slot, and a real reverb later in the chain then has nowhere to go. |

All 615 files build without error, so nothing here shows up as a failure — the presets load cleanly and are wrong. This is the 28%-block-drop problem from July, except the QC and Katana halves were never measured and are far worse than the Helix half.

**These are cheap to fix and the fix is mostly lookup-table entries:**

| Platform | Map top-N missing names | Dirty recipes that go clean |
|---|---|---|
| Katana | 10 | 115 / 205 |
| Katana | 20 | **172 / 205** |
| Helix | 10 | 28 / 58 |
| Quad Cortex | 15 | 50 / 205 |
| Quad Cortex | 30 | 75 / 205 |

Katana's top 10 are `Reverb`, `Crunch`, `Booster`, `Lead`, `Plate`, `Noise Gate`, `Delay`, `Brown`, `Clean`, `Spring`. Each needs a real tone judgment (what *is* the Katana equivalent of a Plate?), which is why this is a decision rather than a sweep — see `feedback_helix_preset_quality`.

**The sequencing question this raises:** the band now prints "0 of 3 complete" on most pages. That is the honest number and publishing it is the separating move the strategy doc argues for. But §4.1's plan is to pitch a canonical reference to ten places in Week 2, which sends strangers to pages currently advertising their own defects. Either spend a day on the model maps first, or lead the pitch with the defect record itself. Both are defensible; drifting into the second by accident is not.

**Acceptance (met):** every `/recipe/` page renders the band server-side; numbers come from the generators, not prose; `curl` of any recipe page returns the DSP figure.

### 3.2 Kill the duplicated engineer's note **[machine]**

`src/app/recipe/[slug]/page.tsx:388` — the code comment admits it: *"Uses the recipe description as a proxy until we get real per-recipe engineer notes."* Every recipe page prints its intro paragraph twice, roughly halving unique word count across 200 pages.

Two options, pick one and ship it this week: generate a genuine per-recipe engineer's note (one non-obvious build decision — why the Drive is at 1, why the LowCut is at 80), or delete the block. **Deleting is fine.** A shorter honest page beats a padded one, and the verification band from 3.1 now occupies that slot with something a reader actually wants.

### 3.3 Fix the out-of-range parameter values **[machine]** — ✅ compressor fixed 2026-08-05; the rest is a ledger

It was worse than a display bug. `scaleParamValue()` had no rule for `Attack` or `Release`, so every value above 10 fell through to a closing `Math.min(1, num)` clamp: **`Attack: 60` and `Release: 910` were emitted as `1.0`.** Every compressor in every generated Helix preset shipped with maximum attack and maximum release — a compressor doing close to nothing. The "Attack 60s" on the page was the visible half of a bug whose real damage was in the file.

Ground truth came from `data/helix-corpus/models.json` (256 real presets): `HD2_CompressorDeluxeComp` runs `Attack 0.0001..0.072` and `Release 0.064..2.009` — **seconds as a float**. So the corpus's millisecond values were the human-readable form and only the plumbing was wrong.

Shipped:

- `scripts/migrate-comp-time-units.ts` — AST migration normalising all Attack/Release to milliseconds. 176 seconds-scale values converted, 1,243 already correct. Every converted value lands on a plausible time (20, 40, 60 ms; 200, 500, 910 ms). Report: `docs/COMP_TIME_UNIT_MIGRATION.md`.
- `scaleParamValue()` converts ms → seconds and no longer clamps to 1. Verified across the corpus: **408 emitted values, none pinned to 1.0, all within 0.012–0.91 s.**
- Registry declares `Attack`/`Release` in `ms`. The page now reads **"Attack 60ms, Release 910ms"**.
- Helix amp internals (`Sag`, `Bias`, `BiasX`, `Hum`, `Ripple`) corrected from 0–1 to 0–10 — stale since `migrate-helix-amp-scale.ts` moved the data and the registry didn't follow.

**The audit rule found a much larger problem.** Enforcing "value inside declared range" turned the audit 205/205 red, because **2,666 corpus values sit outside their declared range** — and almost none are bad data. The registry was written Helix-first and never made platform-aware: a Katana Gain of 90 is correct on a unit that runs 0–100 and only looks wrong against an entry saying 0–10.

So `ParamMeta` now carries `rangeVerified`, and the audit splits in two: `settings-within-verified-range` (**error**, currently 0/205 failing) and `settings-outside-unverified-range` (**info**, a ledger). Ranges graduate as they're checked, and a real regression can't hide in the noise. Full breakdown in **`docs/PARAM_RANGE_AUDIT.md`**; the fix order is Katana platform ranges → `Mix`/`Feedback` to percent → `Threshold` → the tail.

Note this corrects §3.3 as first written: `Mix` is a *display* problem only. The generator's `PERCENT_SCALE_PARAMS` already divides it correctly, so emitted presets were never wrong on Mix. Attack/Release were the ones corrupting files.

### 3.4 Publish the sweep as corrections **[machine]** — ✅ three entries added 2026-08-05

`src/data/experiment-log.ts` gained three entries: the false "Editor Verified" badge, the compressor units, and the QC/Katana substitutions. The `public_corrections` stat counts commit subjects, so it moves when this work is committed with a matching subject line — it still reads 26 until then.

### 3.5 Fix the platform-count honesty gap **[machine]** — ✅ partly done; smaller than scoped

Half of this was already right. `SystemMap`'s alt text on `/experiment` has always drawn the distinction precisely: *"translates the tone to six platforms. Three of those produce a downloadable file … Kemper and Fractal are given as on-page settings only, and TONEX is a single ToneNET capture-search query by design."*

What was blurry was the dashboard tile above it, reading "205 Tone recipes / across 6 platforms". `generate-experiment-stats.mts` now emits `platforms_with_preset_files` alongside `platforms_covered`, and the tile reads **"3 platforms get a preset file, 3 get settings only."** The Downloadable tile now says "tones that build you a Helix preset on request" rather than the ambiguous "a preset file".

Still open: `/browse` counts 205 recipes under a TONEX filter that yields capture pointers rather than chains. Worth relabelling the facet, not dropping it.

### 3.7 Remove the duplicated engineer's note **[machine]** — ✅ done 2026-08-05

Bigger than "duplicate text". The block reprinted `recipe.description` verbatim — the same paragraph already rendered as `.recipe-summary` directly above — and then signed it `— {artist.name}`, so an AI-written summary appeared as a quotation from B.B. King, Kurt Cobain, or Stevie Ray Vaughan. Removed along with its now-dead CSS. The verification band occupies the slot.

---

## 4. Week 2 (Aug 12–18): One linkable asset, and the audio decision

### 4.1 Publish the level-matching standard as a reference **[machine]** + **[20-min]** to pitch

`GAME_THEORY` move #3, and the strongest candidate in the repo: *"levelling the presets — everybody does it differently"* and **nobody has published the method.** We already have `content/blog/level-match-modeler-presets.mdx` — but as a blog post, not as a reference.

Repackage it as a canonical, citable standard: the exact method, the dB targets, the measurement procedure, the per-recipe results across all 200, and a permanent URL that looks like a spec rather than an article. Then pitch it to ten places — r/Line6Helix, TGP, the Helix Facebook groups, the modeler newsletters, the gear writers already covering IR/level topics.

Original data is the only thing strangers link to. One asset pitched ten times beats a month of publishing, and it moves the binding constraint from §2.

### 4.2 Hire the audio contractor **[capital — the decision of the month]**

`docs/AUDIO_PREVIEWS_CONTRACTOR_BRIEF.md` is complete: the job post, the budget ($8–15/clip), the deliverable spec, the QC loop, where to post. `src/data/audio-demos.json` is `{}`. `RecipeAudioDemo` is already wired into the recipe page and renders nothing.

This one decision unblocks three things at once: audible proof on recipe pages (the #1 conversion trust gap), the YouTube Shorts pipeline (blocked on exactly this), and the Set Pack demos. Start with the **paid test batch of 5** the brief specifies — ~$50–75 and 30 minutes of your time to hire.

Caveat worth holding: `GAME_THEORY` §3 ranks demo videos as *actively distrusted* in this market. That's about slick marketing demos. A raw DI + wet pair with no editing is evidence, not marketing — which is why the brief specifies "no editing, no mixing." Ship them that way.

### 4.3 Ship the newsletter that's already drafted **[20-min]**

`content/newsletters/sunday-setlist-2026-08-04.md` is written, in voice, and uncommitted. `src/lib/email.ts` has +178 lines of uncommitted sequence machinery. `docs/WELCOME_SEQUENCE.md` has the full spec.

Per `project_recipe_run_isolate_bug`: **verify and ship the stranded work, don't rewrite it.** Review the draft, send it, commit the sequence code. Retention is 17% of new arrivals; the newsletter is the only thing that follows anyone home.

Then build `/newsletter` — it 404s today. A landing page with a **public archive** is indexable content and proof the thing exists.

---

## 5. Week 3 (Aug 19–25): Earn the first links

This is the week that moves the actual constraint. It is mostly your hours, not the machine's.

### 5.1 The directory circuit **[capital, ~15 min each]**

From `DISTRIBUTION_AUTOMATION_OS.md` §3, drafts ready on request: There's An AI For That, Ben's Bites, Uneed, MicroLaunch, BetaList, SaaSHub, TinyLaunch. Permanent backlinks, the story is hot, and "an AI-run guitar site that publishes every mistake it makes" is a genuinely good listing.

### 5.2 CustomTone + guitarpatches uploads **[20-min/week, recurring]**

Best-matched audience on the internet: every visitor owns a Helix. Build `customtone-batch.ts`, export 2–3 presets a week with descriptions and UTM'd recipe URLs. ToS requires a human upload — that's the weekly window.

### 5.3 Close the funnel leaks **[machine]**

12–24% dead clicks against a 2–5% healthy baseline. When acquisition is authority-gated and slow, not wasting the traffic you already have is the only fast lever.

- **105 of 385 blog posts still have no `SaveThisTone` CTA.** Down from 159 — finish it.
- The auth-aware download modal and the return path (`GAME_THEORY` move #2)
- Set Packs "Notify me when available" is still plain text with no capture

### 5.4 Finish the disclosure cleanup **[machine, 30 min]**

`/about` already labels all 10 personas "AI writer" — the contradiction the earlier plan described is mostly fixed. What remains is smaller and still worth doing: the bios carry fabricated human biography (Berklee training, "gigging since 1978," "two kids ages 6 and 4") sitting inside an AI-writer label. That's an odd hybrid — labeled honestly, then decorated with a life that didn't happen.

Strip the invented biographical detail. Keep the labels, keep the stated musical taste and voice (which are real design parameters), drop the human history. `project_experiment_page`'s honest-authorship rules already point here.

Also: **audit `/pricing` for the ToneTrace promise.** Pro sells "priority access to ToneTrace at launch" and ToneTrace was cancelled 2026-07-26 (`project_tonetrace`). Selling priority access to a cancelled feature is a refund and a forum thread. Remove it or replace it with something Pro actually gets.

---

## 6. Week 4 (Aug 26–31): Take the time-boxed square

### 6.1 The Helix Stadium migration guide **[machine]**

`GAME_THEORY` move #4, and the best square on the board: new platform, one-way preset conversion, cabs that load different-sounding equivalents, IRs that don't auto-map — and a cohort that just spent ~$2,500 and can't import what they own. Every competitor is shipping "Stadium versions" of their existing catalogue. **Nobody has published the migration knowledge.**

The corpus has one blog post mentioning Stadium (`line-6-helix-family-compared.mdx`). Ship the guide: what breaks, the cab-equivalence table, the IR remapping path, what to check after conversion. Knowledge first, artifacts second.

This window closes. It's ours only if we move in it.

### 6.2 Genre, era, and gear hubs **[machine]**

`/browse` exposes the facet data with real counts; `/genre/metal` 404s. Build genre (12), era (6), and genre×platform hubs — 300–600 words of genuine editorial framing each, not filtered lists. Raise recipe-to-recipe linking from 3 to 8–12 across multiple axes.

**Sequenced here deliberately, not in Week 1.** Hub pages are how link equity gets *distributed*; they compound only once there is equity to distribute. Building them in week one, before a single referring domain exists, is publishing into the authority gate the index-health log warns about.

### 6.3 Twenty 2020s recipes, worship-weighted **[machine]**

The catalog is **1 song from the 2020s and 5 worship songs** out of 200, against a stated worship-first strategy (`project_seo_target_segment`). Correction #14 caught this and nothing changed. Meanwhile the request queue's top three (Eruption, Crazy Train, Cliffs of Dover) are four months old — a 1980s library trains a 1980s audience to ask for 1980s songs.

Ship 20 recipes from 2020–2026 weighted toward worship, modern prog, modern country, and pop-punk. Add the 2020s era filter. **Verify each song and its attribution before researching gear** — `project_recipe_backlog_entries_unreliable`: RECIPE_BACKLOG.md rows contain phantom songs and wrong guitarists.

Clear the top 10 requests in the same pass and put a visible SLA on new ones.

---

## 7. What to check on August 31

Baseline is the 90-day GA4 window already in hand (6,119 views · 2,780 users · 0 purchases · 0 referring domains), so this month is measurable against something real from day one.

| Metric | Aug 5 | Aug 31 target |
|---|---|---|
| **Referring domains** | 0 | **5+** — the only metric that unlocks the others |
| Recipes with the verification band | 0 | 200 |
| Recipes with audio | 0 | 5 (test batch shipped and published) |
| Worship-cluster URLs indexed | 1 of 5 | 3 of 5 — and if links landed and this didn't move, that's a finding |
| Newsletter subscribers | (read from Supabase Aug 5) | trending, with 2+ issues actually sent |
| Blog posts with a CTA | 280 / 385 | 385 / 385 |
| Dead-click rate (Clarity) | 12–24% | under 8% |
| Corrections published | 26 | 28+ |
| Purchases | 0 | 1 — one real purchase from a stranger tells you more than any A/B test at this traffic |

Deliberately **not** on this list: pageviews, recipe count, blog post count, "AI citations / SOV." The first three reward the behavior the index-health log tells us to stop; the fourth is unfalsifiable and swung 60%→10% in weeks.

---

## 8. Sequencing rationale

1. **Verification band first** because it's the separating move in a lemons market, it costs zero Daniel-hours, and the asset is already written and filed on the wrong surface.
2. **Data honesty before promotion** because the correction log is quotable ammunition the first time this reaches r/Helix — it only reads as integrity if the current state is clean.
3. **One reference asset before more content** because referring domains gate both Google and AI citation simultaneously, and original data is the only thing strangers link to.
4. **Audio before any pricing move** because a price change without audible proof is the fastest path to refunds, and because it unblocks Shorts and Set Pack demos in the same purchase.
5. **Hubs and new recipes last** because they distribute authority rather than create it, and distribution machinery built before there's anything to distribute is the exact trap the index-health log names.

## 9. What this plan deliberately does not do

- **No repricing.** Zero purchases across 90 days means there is no signal to price against. Revisit when there are 10 transactions.
- **No A/B tests.** The power math says 15.8 months to detect a doubling on a single page. Use Clarity recordings (n=5) and leading indicators instead.
- **No affiliate expansion.** `docs/AFFILIATE_EXPERIMENTS.md` (2026-07-29) already re-ranked this against real data; the uncommitted `GearPick` / `RecipeMicPick` work is the current experiment. Let it run and read it, don't stack another on top.
- **No new content velocity.** 5 posts + 5 recipes/day already runs on cron. The 20 recipes in §6.3 are a *retarget* of that existing capacity, not an addition to it.
