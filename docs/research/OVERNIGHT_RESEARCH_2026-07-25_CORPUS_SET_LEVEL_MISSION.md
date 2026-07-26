# Overnight Research — Corpus Audit, Set-Level Tones, and Mission Advancement

**Date:** 2026-07-25
**Method:** Six parallel research agents (corpus audit, set-level architecture, routing/mix, resource acquisition, gear-comparison strategy, business/customer strategy) + synthesis. Grounded in the live corpus (195 recipes, all passing audit), docs/, and current web research.
**Voice:** hyper-curious tone tech, responsible for getting players great tone in less time.

---

## TL;DR — the ten moves that matter

1. **The corpus is a metal library serving a worship strategy.** 5 worship recipes vs 67 hard-rock / 52 metal. The single highest-leverage content move: 30–50 modern worship recipes.
2. **A recipe without a file is commodity content.** 145/195 recipes have no .hlx; 0 .tsl exist (API supports them); the Fractal page promises .syx downloads that don't exist. Ship or retract.
3. **Set-level tones are buildable now** — a compression problem (shared block topology + per-song snapshot deltas) with one missing knowledge artifact: a per-model DSP cost table. Worship-only, Helix-only v1. The 195 audited recipes are the ingredient library nobody else has.
4. **We have a silent cross-platform correctness bug:** "Mix 30%" means different loudness on Fractal vs Helix vs QC (different mix laws). Fix in the Bible + translation rules.
5. **Mono-sum survival is our ICP's most painful unaddressed problem** — stereo presets die on small-church mono PAs. Add a mono-safe doctrine + recipe flag.
6. **Gear comparison is winnable only as a decision engine**: computed "fit reports" (which recipes fit an HX Stomp), a songs-first modeler quiz, and evidence-backed comparison pages. Spec-sheet comparison is commoditized and being eaten by AI answers.
7. **North star: Weekly Tones Deployed** (downloads + PDFs by signed-in users). Everything else hangs off it.
8. **Product order: fulfillment pipeline → audio previews → Christmas Set Pack + email sequences.** Churn is the lever, not price; packs are the fastest path to first $500 months.
9. **A hired pro musician should produce evidence, not content**: verification passes, DI/reamp audio previews, one real Sunday field test of a Set Pack, and named Kemper/ToneNET picks.
10. **The strategic risk nobody's asking about:** Helix Stadium's Proxy cloud-cloning is the beginning of "clone any tone instantly" — the recipe (the *why* and the *how to deploy*) must be the product, because the preset file itself is depreciating.

---

## 1. Corpus: strongest, weakest, missing, most useful

*(Full audit data: agent sweep of src/lib/data/index.ts — 61,700 lines, recipes at lines 4,590–61,700.)*

### Strongest
- **The 6×195 translation matrix** (1,170 cells) with real per-platform model names. No competitor does cross-platform at all.
- **Why-explaining block notes** — 1,519 notes across 1,324 Helix blocks; the ≥75%-why rule (H3) is enforced by audit.
- **Source honesty** — 156 CORRECTION/unverified/tribute-tier annotations (Strokes "Crate VC30" myth debunked, November Rain lore corrected, Hendroff "Klon KTR" flagged). This is the most defensible editorial asset we have.
- **Machine-audited consistency**: 195/195 clean against RECIPE_STANDARD.md; canonical knob order; the 1,259-line HLX exemplar spec distilled from 305 real presets.
- **Gain-staging pedagogy** (TS-as-clean-boost, drive-stacking budgets, Bible §1.4).

### Weakest
- **Platform depth is a staircase, not a floor**: Helix avg 6.8 blocks/3,525 chars per translation → Katana 3.4/1,535 → TONEX 1.0/713. Kemper leans on "search Rig Exchange" 352 times — a homework assignment, not a recipe. Specific named rigs/captures appear ~8 times total.
- **Tone-context is riff-heavy**: riff 97 / full_song 48 / solo 15; verse/chorus/outro ≈ 5 total. Song-section dynamics (the thing snapshots exist for) are barely modeled — snapshots/scenes get 9 mentions in 57K lines.
- **Tuning field is free-form chaos**: 30+ variants of "Drop D." Tuning-based filtering — the most natural browse path for the 40% of the corpus that is metal — is currently impossible.

### Missing
- **Worship.** 5 worship + 5 CCM + 4 ambient-worship recipes against a strategy whose entire ICP is worship guitarists. July's new recipes were Judas Priest and Iron Maiden.
- **The modern era**: 1 song from the 2020s, 18 from the 2010s. Corpus median ≈ 1998.
- **Structured technique and mix-context fields**: pick attack is mentioned 132 times in prose, `playing_technique` field exists 0 times. Double-tracking 220 mentions, `mix_context` field 0.
- **Parallel routing as structure**: two-amp records (Pearl Jam "Black," November Rain, Tool "Vicarious") are flattened to serial chains and narrated in prose.
- **Budget pathways** ("if you have" appears twice in 57K lines), output calibration (headphones vs FRFR vs PA), audio previews (brief exists, nothing ships), jazz, shoegaze, djent, 8-string anything.

### Most useful (to players, per unit of effort)
1. Downloadable files where they exist (50 .hlx)
2. The correction/honesty annotations
3. Multi-drive default-ON/alternates-OFF pedagogy (teaches choice, 538 mentions)
4. The dual-mic cab discipline (59 recipes with cabSibling)
5. The platform-knowledge docs (Helix/Fractal/Katana rated deep; Kemper moderate; TONEX thinnest at 366 lines)

---

## 2. Making the knowledge more practical and accessible

The pattern across every finding: **we are rich in prose and poor in structure, and structure is what players (and our own compilers, filters, and agents) can actually use.**

1. **Close the file gap** (see TL;DR #2). Every recipe page should end in a file, not a table.
2. **Audio previews on the top 20** (CCLI Top-10 + top-10-by-views). Flagged the #1 trust gap since April; TONE3000 proved in-browser preview is the conversion moment.
3. **Promote prose to fields**: `playing_technique`, `mix_context`, `tuning` (enum), `mono_safe`, `snapshot_map` (verse/chorus/solo states). Each becomes a filter, a rendered section, and QC-checkable.
4. **Five-minute-deploy page order**: download → calibrate output (FRFR/headphones/PA — currently absent entirely) → per-song tweaks → technique. Time-to-tone is the product promise; the page should be shaped like it.
5. **Fit badges** ("Fits HX Stomp · Tight on POD Go") computed from block counts — recipe metadata becomes buying guidance for free.
6. **Kemper/TONEX determinism**: name the exact free Rig Exchange rig (author + name) and exact ToneNET capture per recipe. Converts our two weakest platforms from homework into recipes.
7. **Normalize Mix units** (`Mix: 50` vs `Mix: 0.5` both live in the corpus — lines ~4791 vs ~4952) and add the mix-law context (§5 below).

---

## 3. Set-level tones: yes — and it's our most defensible product

**The engineering frame:** a snapshot can toggle bypass and change parameters of blocks that already exist; it cannot swap models. So a set preset = **fixed topology (union of all songs' block needs, under a DSP budget) + per-song delta vectors (bypass + param overrides)**. That's a constrained compression problem, and it should be solved by a deterministic compiler, not freehand by an LLM.

Key constraints discovered:
- **DSP/block budgets**: Helix Floor/LT 2 DSPs; HX Stomp 8 blocks (needs an explicitly degraded "Stomp cut"); QC 2 cores; Kemper performances are 5 whole rigs (no shared chain — flip the model there).
- **Snapshot arithmetic**: 5 songs × 3 sections ≈ 15 states > 8 snapshots ⇒ **snapshots are roles, not songs** (CLEAN→SWELLS worship layout), and the **Setlist Mapper is the join table (song, section) → role. The mapper is the product.**
- **The hidden cap nobody discusses**: Helix allows **64 controller assignments** per preset; snapshot-varying params consume them fast. Must be a counted, audited budget.
- **Tempo**: all delays tempo-synced to note values + a taught tap moment per song ("tap on the hi-hat count-in"); sets ≤4 songs can use per-snapshot tempo with a baked BPM map.
- **FOH consistency**: one shared cab across all snapshots (FOH EQs one channel once — the argument that wins tech directors); leveling rides ChVol only, LEAD +2–3 dB, audited window.

**What already exists:** `src/lib/helix/generate-set-pack.ts` emits a hard-coded worship .hlx with exactly the right structure (10 blocks, 8 snapshots, per-snapshot blockOverrides). Promote its constants to data, and it becomes `generateSetHlx(setRecipe)`.

**What's missing:** (a) a per-model **DSP cost table** — the single biggest new knowledge artifact required; (b) an **amp-family taxonomy** (~40 rows: model → Vox/Fender/Marshall/Recto family) so the compiler can pick a base amp by weighted vote.

**Honesty layer:** every song in a set carries `fidelity: native | close | compromise`; every compromise gets a mandatory note + link to its exact song recipe. The compromise disclosure is simultaneously the trust mechanism and the upsell loop.

**v1 scope: "Worship Set Builder" — Helix only, worship only, 4–6 songs.** Worship dodges the amp-compromise problem because the palette is codified (AC30 + Klon + dotted-8th); a set spanning BB King and Soundgarden through one amp would be a lie. Kemper ships as a performance shopping list, QC as a scene build sheet, Katana excluded.

## 4. How set-level changes the AI models and agents

- **Generation splits in two**: a deterministic set compiler (block union, merge, snapshot allocation, budget checks, degradation ladder when over budget) + LLM judgment layer (is a Deluxe-Reverb song passable through an AC30? param blending for merged blocks, all mapper/transition/compromise prose).
- **New generator knowledge needed**: snapshot semantics per platform, the 64-controller cap, DSP cost intuition, ChVol-not-Drive leveling, tempo-sync doctrine, worship arrangement conventions (already researched in WORSHIP_PRODUCTION_NOTES.md).
- **New audit rules** (spec + audit ship in the same commit, per standing discipline): `set-dsp-budget-fits`, `set-snapshot-count`, `set-controller-budget`, `set-no-orphan-blocks`, `set-every-song-mapped`, `set-delay-tempo-sync`, `set-level-window`, `set-snapshot-name-length` (≤8 chars), `set-tuning-conflict`, and — as an **error**, not warn — `set-compromise-disclosed`.
- **Song recipes are unchanged.** They become the ingredient library; the RECIPE_STANDARD discipline is what makes them machine-composable. Nobody else — Worship Tutorials included — can compile a per-church setlist into a preset, because nobody else has structured ingredient data.
- **Pipeline tie-in**: "setlist Tuesday → tones by Sunday" becomes literal — paste your setlist, download Sunday's preset. Design SetSongRef so a Planning Center importer slots in later.

---

## 5. Routing & mix %: the learning agenda

**What we have:** strong block-level mix values in series chains (1,699 `Mix:` params, genre delay/reverb tables in TONE_SCIENCE_RESEARCH.md), good gain-staging math. **What we lack: topology.** All 195 recipes are straight lines; "wet/dry/wet," "kill dry," "FOH," "mono sum," and "global EQ" essentially don't appear.

Ranked gaps (by player impact):
1. **Mix-law divergence (correctness bug)**: Fractal delay follows a 50/50 mix law (dry constant below 50%), reverb attenuates dry; Helix differs; parallel convention flips to Mix 100% + kill-dry with level via input gain. Our cross-platform tables port numbers without flagging this.
2. **Mono-sum survival**: phase-inverted stereo delays can cancel *completely* summed to mono; ping-pong dies hard-panned. Rules: one side out beats summing; mono modulation, stereo only at time FX; test summed before Sunday. Add `mono_safe` to the spec.
3. **FOH/stage split routing**: Path A with cab → XLR to FOH, Path B pre-cab → stage amp; per-platform mechanics differ (Kemper Monitor Cab Off is global; QC *lacks* per-output cab disable — differentiating cross-platform content nobody aggregates). Global EQ live starting points: low cut ~80 Hz (72–100), high cut ~8 kHz (7–10k).
4. **Parallel path level mechanics**: an even split-merge adds ~+3 dB; every "add a parallel path" instruction needs a mixer compensation note.
5. **True parallel compression vs the Mix-knob shortcut** (when a real split earns it: EQ/drive on the compressed branch only).
6. **W/D/W and 100%-wet discipline** (also how trails survive scene changes).
7. **When splits earn their DSP** — honest gimmick-vs-audible table (fuzz clean-blend: audible; stacking two mid-gain ODs in parallel: usually not).

**Action:** add a "Routing & Mix Architecture" module to the Tone Engineering Bible (§X.1 Three Mix Laws → §X.7 When Splits Earn Their DSP, full outline + sources in the agent brief). Highest-leverage: §X.1 + mono-sum checklist — they retroactively improve every recipe.

---

## 6. Manuals & free resources to ingest (prioritized)

**P0 (do first):**
- **Fractal Blocks Guide** (official PDF) + **Yek's Guide to the Amp Models** (~300-pg community canon: per-model real-amp history, which knobs matter) — the single highest-value ingest for cross-platform translation accuracy.
- **helixhelp.com/models** as the Helix model↔real-gear diff source (official line6.com/helix-models as the legal-safe citation).
- **Helix 3.80 + HX Stomp 3.80 manuals** (3.80 still current); **Helix Stadium online manual** — Stadium is on FW 1.3 with the **Proxy cloud-cloning engine** live; our doc gives it one sentence. Fastest-moving surface in the space.
- **QC HTML manual + PCOM** (plugin compatibility — re-check quarterly), CorOS 4.0.1.
- **ToneNET preset sharing (Apr 2026)** — full signal-chain presets by song/artist now exist; our TONEX doc predates this and doesn't mention TONEX Plug hardware. **Most stale doc.**
- **Celestion Cabinet Handbook + official mic-position guides** — first-party citation source for every cab/mic claim we make.
- **NAM / TONE3000** (former ToneHunt; NAM Architecture 2 claims QC-level quality at half the CPU; open-source = quotable). **Consider a 7th platform-knowledge doc** — it's the free-capture world ToneTrace will be compared against.

**P1:** POD Go 2.0 manual (no doc exists; cheapest Line 6 funnel widening), Katana BTS Gen 3 parameter PDF, Kemper manual/OS pages (doc already current), Rob Robinette + Aiken (Class A myths) summarized-with-citation, York/OwnHammer naming conventions, Sadites methodology notes (via Line 6's own KB).

**Licensing ground rules:** manuals are copyrighted — ingest → synthesize into our own prose → cite by name/page; facts (param names, ranges) aren't copyrightable, expression is. Use "based on/inspired by" trademark framing. Never link mirror sites publicly. NAM is the one ecosystem we can quote liberally.

**Doc refresh order:** TONEX (most stale) → Helix (Stadium section) → Fractal (32.02→32.06 table fix) → QC (4.0.1) → Kemper/Katana (current).

---

## 7. F&K as a gear-decision engine

**Thesis:** spec-sheet comparison is commoditized and being absorbed by AI answers (AI Overviews cost publishers 10–25% of traffic; LLM referrals are few but convert 31–42% better). Our unfair asset: **every recipe is a machine-checkable compatibility proof.** We can *compute* answers no one else can: "51 of our 60 worship recipes fit in the HX Stomp's 8 blocks; the 9 that don't all need dual amps — here's the workaround per song."

**Three primitives:**
1. **Fit Reports** — scripted recipe × device matrix (fits / tight / no + reason), badges on recipes, evidence tables on comparisons.
2. **"Which modeler for your songs" quiz** (`/which-modeler`) — pick 5 songs → recommendation + per-song proof + buy links + email capture (assessment funnels convert 30–50%).
3. **Gear pages as buy pages** — add `modeler` to the GearItem type union (the 7 devices people actually buy have no product pages today); street-price *bands* (never scraped live prices), retailer links, alternatives strip; `src/lib/affiliate-map.ts` was built for this and is unused.

**Top comparison pages** (by volume × ICP fit): HX Stomp vs Helix LT for worship (the 8-block-anxiety page only we can write) → upgrade existing Helix-vs-QC post → HX Stomp vs POD Go → **Helix Stadium vs Floor/LT: should a worship player upgrade?** (first-mover window, honest anti-upsell) → best-modeler-for-worship hub → Stomp vs Stomp XL → Katana-outgrowers bridge → Katana vs Spark → Helix Native vs Stomp → programmatic "Can the Katana do this tone?" per-recipe index.

**Affiliate sequence:** Sweetwater + zZounds (6%, 45-day cookie) applications now; Amazon for accessories only (3%/24h is wrong for $600–1,700 boxes); Plugin Boutique month 2 (15–20% — Helix Native). Honest expectations: $50–300/mo early; the bigger prize is comparison → quiz → email → Set Packs.

**Do NOT:** generic "best modeler 2026" listicles, Equipboard cloning, live price scraping, aggregate ratings/fake testers, ad-farming recipe pages, net-new QC/Fractal comparison chasing. Disclosure on every page: AI-analyzed, corpus-grounded, hardware-verified on Helix LT only.

---

## 8. Mission, KPIs, products

**North star: Weekly Tones Deployed** (preset + recipe-PDF downloads by signed-in users; countable today from the events table). It's the closest proxy for helpfulness, it's the metered paywall action so it mechanically correlates with revenue, and it matches the Sunday cadence. Full KPI tree in the strategy brief (acquisition: worship-cluster GSC clicks, email captures; activation: signup→first-download ≥60%, <10 min; retention: 4-week return ≥20%, Sunday Setlist opens; revenue: MRR, free→paid 3–7%, pack attach; efficiency: ≤$0.50/recipe).

**90-day targets:** WTD 150–250/wk · 100–150 accounts/mo · MRR $300–500 on 60–100 subs · 25–50 cumulative pack sales · worship GSC clicks 3× · fulfillment pipeline draining ≥3 requests/night.

**Product stack (ranked):**
1. **Ship the request-fulfillment pipeline** (design done; highest ratio on the board — makes the paid quota real, only structural differentiator, feeds catalog at ~$0.30–0.50/song, bridge to ToneTrace)
2. **Audio previews top 20**
3. **Set Pack expansion + attach machinery** — Christmas pack built by November, Easter in Feb; Sequence E; pack CTA on every worship recipe
4. **Email funnels 2 → 4 → 3** per EMAIL_FUNNEL_MAP.md
5. **Affiliate layer, lightweight** ($30–200/mo cap on expectations)
6. **PWA Gig Mode** (after north star ~250/wk)
7. **Planning Center** (gate: ~200 worship-tagged accounts or Team tier; do the cheap precursor now — paste-your-setlist matcher)
8. **ToneTrace** (stays a vision doc; the request pipeline is its labeled training data)

**Kill/defer:** net-new QC content, Discord/gamification, native mobile, Team tier (sequenced later), budget-brand presets, merch/courses, homepage polish.

**Unit economics honestly:** blended ARPU ~$5.50; at 10% monthly churn LTV ≈ $50 (Pass)/$80 (Pro). $500 MRR ≈ 90–100 subs; $2K ≈ 350–400; $5K ≈ 900–1,000 — a year-two number requiring Team tier or ToneTrace. **Churn is the lever:** annual plans (2.4× LTV), request quota (recurring utility), Sunday Setlist habit loop. Packs change the math fastest: one $19 pack = ~3.5 months of Pass revenue, zero churn; 50 Christmas-window sales ≈ 170 subscriber-months. Composite path: $500/mo total by ~day 90 → $2K/mo months 9–12 → $5K year two.

**Serve-without-diluting tests (every feature must pass):**
1. **Sunday Test** — helps a Helix/HX Stomp worship guitarist between Tuesday and Sunday?
2. **Recipe Gate** — deepens the core artifact vs adding a new surface?
3. **Honest-AI Test** — shippable under /experiment authorship rules?
4. **Solo-Operator Test** — runs on <1 hr/week with a kill-switch flag?
5. **One-Season Payback** — a sub, a pack sale, or measurable list growth within 90 days?
Tie-break: build the worship version first, generalize later.

---

## 9. The professional-musician brief (if we hire one)

The rule: **they produce evidence, not content.** The site's one absolutely unfakeable asset is honesty; a pro's job is to make "verified by guitarists" literally true and generate the artifacts only hands can make.

1. **Verification passes (week 1–2):** play the top 20 recipes (CCLI overlap + top views) through real hardware. Grade each 1–5 against the record, note exactly which knob was wrong. Every miss becomes a public correction — corrections are our trust signature (23 published so far) and each one is proof a human played it.
2. **DI + reamp audio-preview library (week 2–4):** record clean DI performances per recipe section (verse/chorus/solo riffs), reamp through the Helix preset, ship 15–30s previews for the top 20. The DI library is a compounding asset: re-reampable for every future preset revision *and* labeled training data for ToneTrace.
3. **One real Sunday (week 3):** take the Worship Set Pack into an actual service. Document: FOH interaction, mono-sum surprises, snapshot workflow under pressure, what broke at rehearsal. This single field test validates the set-level product thesis and produces the mono-safe/FOH knowledge module empirically instead of from forums.
4. **HX Stomp fit validation:** load the computed "fits in 8 blocks" claims on a real Stomp; verify DSP headroom, not just block count. This is the data integrity behind the entire gear-decision engine.
5. **Kemper/ToneNET curation with ears:** pick the named Rig Exchange rig and ToneNET capture per top-30 recipe (the determinism fix from §1). This requires listening, not specs — exactly what a pro is for.
6. **Technique capture:** while playing verification passes, dictate the `playing_technique` field content (pick position, attack, dynamics) for each recipe. Cheap to capture in the same session, impossible to fake.

Explicitly not their job: on-camera personality content, testimonials, "our expert says" marketing copy. That would spend the honesty asset instead of compounding it.

---

## 10. Customers: serve deeper without diluting

Four types that form **a funnel, not four products** — every build dollar should move someone one step left:

| | Segment | JTBD | WTP | Serve with | Dilution risk |
|---|---|---|---|---|---|
| A | Sunday-deadline worship guitarist | "Setlist Tuesday, tones by Thursday rehearsal" | Highest ($50–300/yr; churches buy for teams) | CCLI Top-30 coverage, Sunday Setlist email, Set Packs, reliable request fulfillment, seasonal packs | LOW — but don't over-church the brand; worship lives in /worship + packs, plan names stay neutral |
| B | Tone-chasing hobbyist (Helix/Katana) | "Make my rig sound like this record" | $0–60/yr, Pass converts, exhaustion churn | Catalog, .tsl generation, request quota as the retention hook | MEDIUM — enforce the off-tree rule (requester pages noindex) |
| C | Gear-buyer in research mode | "De-risk a purchase, get day-one knobs" | ~$0 direct; affiliate + email capture | Existing guides + fit reports + quiz; harvest, don't invest | HIGH if chased (already dragged SEO toward QC once) |
| D | AI-curious observer + AI agents | "Show me honest AI commerce" | $0; value = links/citations/credibility | /experiment log, MCP, agent surface — nothing more | MEDIUM — cap investment; meta-content serves no guitarist |

Deep-serve moves for A that don't dilute: request-a-tone SLA framing ("filed Tuesday, live Wednesday"), paste-your-setlist matcher (Planning Center precursor), the Set Builder, mono-safe/FOH guidance (their actual pain), Team tier later (the church buys, 4.5× ARPU, institutional low churn).

---

## 11. Questions we should be asking (and aren't)

1. **Did the tone actually get used on Sunday?** We measure downloads, not deployment. A 1-question post-download email ("did this make it to your board?") would turn the north star from proxy to truth and generate testimonial-grade feedback we're allowed to use (it's real).
2. **What's our answer to Proxy?** Helix Stadium's cloud cloning (and NAM A2, and ToneNET preset sharing) all point one direction: *the preset file is depreciating toward free.* Our moat must be the recipe layer — the why, the deploy workflow, the set compilation, the honesty. Are we investing accordingly? (Set Builder and fit reports: yes. Backfilling 145 .hlx files: necessary but not sufficient.)
3. **Is $4.99 the right kind of cheap?** At LTV ≈ $50 we're priced like a commodity while building a workflow product. The moment Set Builder or Planning Center ships, the value metric changes from "downloads" to "Sundays covered" — should pricing change with it (e.g., annual-first, or per-team)?
4. **Who is the actual buyer for worship?** Volunteers pay from pocket; worship leaders have church cards and buy for teams. Our funnel treats them identically. One "buying for your team?" branch could double ARPU on the same traffic.
5. **Are AI citations converting?** We built the whole agent surface (MCP, DNS-AID, auth.md, content signals, ai-sov-runs). Do we have a dashboard row that ties AI-referred sessions → signups? If not, we're flying the strategy blind.
6. **What does the corpus become as licensable data?** 195→500 structured, audited, cross-platform recipes is a dataset gear makers, DAW makers, and AI shopping agents may want. An API/licensing lane could dwarf affiliate revenue — and the MCP endpoint is already the demo.
7. **Where's the feedback loop from failed tones?** Requests tell us what people want; nothing tells us where existing recipes disappoint (wrong pickup assumptions, too-hot output levels). A per-recipe "this didn't sound right" report button feeds the correction engine — our best asset — with zero-cost leads.
8. **Bus factor and boredom factor:** the whole machine assumes one operator's continued attention. Which crons/pipelines fail silently if Daniel takes August off? (The kill-switch-flag discipline helps; an explicit "unattended mode" checklist would finish the job.)
9. **Are beginners bouncing off our vocabulary?** The corpus assumes the reader knows what a tonestack is. One glossary layer (tooltips on ~40 terms) may be the cheapest activation lift available.
10. **What would we do with a second verified device?** Everything is "verified on Helix LT only." The single highest-trust-per-dollar hardware purchase is probably a used HX Stomp — it's the ICP's #1 device and the fit-report validator.

---

## Cross-cutting build order (synthesis of all six briefs)

**Now (weeks 1–4):** fulfillment pipeline live → audio previews top 20 → mix-law + mono-sum modules in the Bible → tuning enum + Mix-unit normalization → TONEX/Stadium doc refreshes → affiliate applications (Sweetwater, zZounds).
**Next (months 2–3):** 30–50 worship recipes (compounds with everything) → .hlx/.tsl backfill on top 50 → DSP cost table + amp-family taxonomy → Set Builder v1 (Helix, worship) + SET_RECIPE_STANDARD + audit → Christmas pack + Sequence E → HX Stomp vs Helix LT fit-report page + /which-modeler quiz.
**Later (months 4–6):** modeler gear pages + remaining comparison pages → PWA Gig Mode → paste-your-setlist matcher → Planning Center + Team tier when gates hit.

*Full agent briefs (set-level data model, audit rule specs, routing module outline with sources, complete resource URLs, KPI tree, comparison-page list) are preserved in the session transcript and can be split into standalone docs on request.*
