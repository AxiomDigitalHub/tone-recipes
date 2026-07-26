# Overnight Research, Wave Two — Artifacts, Bugs, and a Strategy Correction

**Date:** 2026-07-26
**Method:** eight research agents producing *artifacts* (working code, computed datasets, authored reference docs) rather than briefs, plus an independent verification pass in which every load-bearing claim was re-checked against the code and data by hand. Where an agent and a measurement disagreed, the measurement wins and the disagreement is recorded.
**Predecessor:** [Wave One](OVERNIGHT_RESEARCH_2026-07-25_CORPUS_SET_LEVEL_MISSION.md). Two of its claims are corrected below.

---

## The five things that matter

1. **We are shipping a preset generator that silently drops blocks, and a reference doc that names six amps which do not exist.** Together these produce confidently-broken presets. This is the highest-priority fix on the board and it is measured, not suspected.
2. **Preset downloads bypass the paywall.** The 5/month cap is enforced on recipe PDFs and explicitly skipped on `.hlx` downloads, while the UI and welcome email tell users the cap is real. The headline paid benefit is currently free.
3. **The Set Builder blocker is gone.** 395 Helix models are costed, device capacities and the 64-controller cap are encoded, and `pickBaseAmp()` works. Set compilation is now an engineering task, not a research question.
4. **Line 6 built the execution surface we should be feeding.** Helix Stadium's *Showcase* automates preset and snapshot recall along a song timeline via flags authored in the desktop app. Nobody has built the library. Our biggest corpus gap (no section-level tone maps), the Set Builder's required input, and Stadium's native format are the *same missing artifact*.
5. **Our worship coverage is 5 songs, and 22 queued backlog entries are fabricated provenance.** Fixing the convention must precede building the fifty.

---

## 1. Bugs found (verified by hand)

### 1a. Phantom amps in the Helix reference doc — severity: high

`docs/platform-knowledge/line6-helix.md` lists six amps that do not exist on any Helix:

| Listed | Reality |
|---|---|
| Essex A30 TB (line 111) | Not a Helix model |
| Brit Jub Rhyth / Clip / Nrm (129–131) | Silver Jubilee — a Fractal/QC model |
| Cali 2C+ Nrm / Lead (145–146) | Mark IIC+ — a Fractal/QC model |

None appear among the 439 models harvested from real presets in `data/helix-inventory.json`. This doc is the reference our recipe generator writes against, and HX Edit rejects unknown model IDs by refusing the **entire preset** — so a recipe built on one of these produces a file that will not load at all. Remove them and add a guard.

### 1b. The generator drops blocks silently — severity: high

Dry-running `scripts/ship-all-presets.ts` writes all 195 presets with zero failures, but **54 recipes (28%) lose at least one block** — 42 distinct unresolved names, 62 drops. Some lose the amp *and* cab (`3's & 7's` loses `US Double Brt` and `4x12 Mash V30`), producing a preset that cannot sound like its recipe. Causes and the full alias table: [PRESET_BACKFILL_BLOCKERS.md](../PRESET_BACKFILL_BLOCKERS.md). The fix is ~42 strings plus making a dropped amp or cab a hard failure instead of a warning.

**Do not ship the 145 missing presets until 1a and 1b are both fixed.** The gap is a naming bug, not a content backlog — which is good news, but shipping it blind would put broken files on players' boards.

### 1c. Preset downloads bypass the quota — severity: high (commercial)

- `src/app/api/recipes/[slug]/download/route.ts` → calls `canDownload()`, meters free users at 5/month.
- `src/app/api/preset/[slug]/route.ts` → comment reads "the catalog is free — sign-in required, no quota" and there is **no quota check**.

Meanwhile `FREE_DOWNLOAD_LIMIT = 5` is live in `permissions.ts`, the UI advertises the cap, and Sequence A emails it. A free account can take every preset on the site. Either the policy changed and the copy is stale, or the route regressed — but the two cannot both be right, and Pass's core value proposition depends on the answer. **Decide this before instrumenting anything**, because every download metric sits on top of two different gating regimes.

### 1d. The shipped Set Pack generator is over budget — severity: medium

`generate-set-pack.ts` computes to **100.07% of one DSP**, in mono, with path 2 empty, because it uses the legacy cab format (9.60 units) instead of the 3.50+ equivalent (3.33). A stereo two-path layout brings it to 54.71% / 61.87%. This is a live product.

### 1e. Data hygiene (mechanical, scriptable)

- **Mix units:** 1,013 integer-style vs 585 decimal-style values. The *identical* Studio Comp block appears as `Mix: 50` in one recipe and `Mix: 0.5` in another, with the note text mirroring each.
- **Tuning:** 31 distinct strings collapsing to ~12 real tunings across two data-entry conventions (`drop_d` vs `Drop D (D-A-D-G-B-E)`). Tuning filters are impossible until this is normalised — and metal is 40% of the corpus.
- **Inventory alias collision:** "Chorus" and "70s Chorus" both map to `HD2_Chorus70sChorus`.
- **Five blocks are filed under contradicting categories** (a Compressor and a Noise Gate under Katana's Booster slot; a Cry Baby under Fractal's Drive).

---

## 2. Artifacts now in the repo

| Artifact | What it unblocks | Confidence |
|---|---|---|
| `src/lib/helix/dsp-costs.ts` — 395 models, device capacities, 64-controller cap, `fitsOnDevice()` | Set Builder; honest fit verdicts | Structural limits quoted from official 3.80 manuals (hard). Per-model costs from Ben Vesco's allocation table, all marked `reported` — **nothing faked as measured** |
| `src/lib/helix/amp-families.ts` — 16 families, affinity matrix, `pickBaseAmp()` | Base-amp selection for set compilation | Verified working: a Vox-leaning set correctly returns Essex A30 with covered/compromised splits and a rationale |
| `scripts/compute-fit-reports.ts` + `src/data/fit-reports.json` — 1,755 verdicts | The gear-decision engine | Block arithmetic exact; DSP estimated. Kemper honestly refused (195 `not_applicable`) |
| `src/lib/traffic-source.ts` + `scripts/weekly-metrics.ts` | North-star measurement; AI attribution | Smoke-tested on 16 cases |
| `docs/WORSHIP_RECIPE_BACKLOG.md` — 50 songs, 7 archetypes, seasonal blocks | The #1 content gap | Grade A/B attribution convention |
| `docs/HELIX_DSP_BUDGET.md`, `docs/ROUTING_SPEC_ADDITIONS.md`, `docs/MEASUREMENT_PLAN.md`, `docs/FIT_REPORT_*.md` | Reference + specs | — |

Smoke test, for confidence: a realistic worship chain (comp, drive, Essex A30 amp+cab, stereo Ganymede, stereo Glitz, two delays) reports **88.4% of one DSP** — matching the player-known fact that big stereo reverbs are what actually eat the budget.

---

## 3. Fit reports — the real numbers

195 recipes × 9 devices:

| Device | fits | tight | doesn't fit | n/a |
|---|---|---|---|---|
| Helix Floor / LT / Rack | 195 | 0 | 0 | – |
| **HX Stomp** | **154** | **41** | **0** | – |
| HX Stomp XL | 154 | 41 | 0 | – |
| POD Go | 91 | 102 | 2 | – |
| Quad Cortex | 195 | 0 | 0 | – |
| Fractal FM3 | 190 | 5 | 0 | – |
| Fractal FM9 | 195 | 0 | 0 | – |
| Katana Gen 3 | 195 | 0 | 0 | – |
| Kemper | – | – | – | 195 |

Two findings worth publishing: **HX Stomp and Stomp XL return identical verdicts on all 195** — the XL buys switches, not headroom. And of the 41 "tight," 26 fill all eight blocks exactly while 13 need only a bypassed alternate removed.

**The honesty caveat, which must shape the page.** Every recipe fits an HX Stomp partly because *our chains are lean*: Helix chains average 6.8 blocks (median 7, max 10), and exactly one recipe needs more than 8 active blocks. "Every Fader & Knob recipe fits an HX Stomp" invites the reply "then your recipes are simpler than my rig." Publish the block count per recipe and let players compare against what they run. The number is the proof; the bare claim is the risk.

Related open question a machine cannot answer: **48% of recipes land at exactly 6 blocks.** It is partly genre-honest (heavy-metal recipes never sit at 6), but someone should A/B a few against the records. If the corpus is systematically under-building, no audit we own would ever detect it — every rule we have checks structure, not sound.

---

## 4. Strategy: what the moat work changed

**Thesis:** by mid-2028 the tone file and the tone *idea* are both free. What stays scarce is (a) evidence a tone was verified on real hardware and (b) a compiled, deployable answer to "what do I load for this setlist." F&K currently sells the two things going to zero and gives away the two that appreciate.

**Verified independently:**
- **Helix Stadium "Showcase" is real and is the opportunity.** Line 6's own Song View manual describes authoring songs with markers and flags that automate preset recall, snapshot recall, looper functions, MIDI, and tempo sync, built in the desktop app and pushed over Wi-Fi. This is the execution surface for song-level tone maps, and the library that feeds it does not exist. Caveat: Stadium-only, so it's a 24–36 month bet — but it validates the data model *now*, and our ICP's legacy Helix window stays open meanwhile.
- **MultiTracks.com — threat real, timeline softer than reported.** They sell Helix, HX Stomp, Kemper and NAM presets and already own the setlist relationship. But their products are **generic** ("HX Stomp – Worship Rig"), not song-specific. Song-specific is exactly our gap; they would have to choose to close it. Watch quarterly.

**Two prior beliefs to retire:**
- **"Cross-platform is unmatched"** — no longer true; Signal Theory ships five platforms including Proxy.
- **"ToneTrace is the 10x product"** — Positive Grid's BIAS X shipped Music-To-Tone in September 2025. Do not build it as specified. Salvage the data and feedback layers; the request pipeline remains its best market research.

**The recommendation:** stop supplying tone *files* and become the verified performance-data layer — the library of what to play, on what tone, at which moment, on a specific rig, in a form hardware and agents can execute. Knowledge free and fully fetchable; compiled artifacts behind an account. On the open question from Wave One: exposing recipes to agents is **correct** — disintermediation happens regardless, and blocking retrieval costs citations while recovering no clicks. Draw the line at the compiled artifact, and only there.

---

## 5. Worship: the plan, and the landmine

**The gap, measured:** exactly **5 worship songs of 195 (2.6%)** — *What a Beautiful Name*, *Goodness of God*, *Living Hope*, *Way Maker*, *Great Are You Lord*. (An agent reported 1.3% by double-counting; 2.6% is correct.)

**The landmine:** `RECIPE_BACKLOG.md` carries **22 queued worship entries whose guitarist field literally reads "worship guitarist"** and whose gear sketch is a copy-pasted "Strat → AC30 + Timeline + BigSky." That is genre stereotype dressed as research. Entry #882 is *Reckless Love* — which is not a Bethel-band record at all, but a Nashville session cut with Dwayne Larring on electric. Nothing automated consumes this file, so it is a stale planning doc rather than a live injection — but anyone told to "work the backlog" would publish fabricated provenance at scale, into the one asset that differentiates us. **Delete or rewrite those 22 entries before any worship build wave.**

**The unlock:** Elevation publishes its own signal chains — their MD posts per-song in-ear mix videos with the chain in the description, and they pair buyers with the musicians who played the record. That is per-track attribution from the band, for the most-played catalogue in America. 12 of the proposed 50 songs are Elevation; 8 reach Grade A because of it.

**The attribution problem, stated properly.** Worship records publish songwriter and producer credits, not per-track instrument credits. Hillsong's *Zion* lists six electric guitarists and never says who played "Oceans." Hillsong's own credit pages are now login-gated, so *Wonder* and *Awake* credits are unavailable at any price. This is why a two-grade convention is mandatory, not optional:

- **Grade A — attributed:** a named player from credits or a first-person interview.
- **Grade B — tribute-tier:** a plausible reconstruction, disclosed in the visible description.

**Apply it to what we already have.** Our *Goodness of God* recipe names David Hislop; *Victory*'s electric credits are an unordered pool (Ed Cash, Scott Cash, Hislop, Jonathan Lee, Michael Pope). Hislop is plausible — he is a credited *Victory* guitarist with the best-documented rig in worship guitar — but plausible-from-the-pool is not documented, and this corpus debunks exactly that kind of assumption elsewhere by name. Add `attribution_confidence` (`documented` | `pool` | `tribute`) and set the convention on the five existing recipes **before** building fifty more.

Also: *What a Beautiful Name* is piano-driven. Its electric part is clean arpeggio texture plus a final-chorus swell, with no signature lead hook. Our recipe should be framed as a texture recipe with that stated, not as a lead tone. The songs with genuinely identifiable electric parts are *Another in the Fire*, *Hosanna*, *From the Inside Out*, *Mighty to Save*, and *Highlands*; the best ambient candidates are *Oceans* and *Whole Heart*.

**Seasonal timing is earlier than we assumed.** Teams choose Christmas material in August–September, so the Christmas pack ships **15 September**, not November. Easter 2027 falls 28 March with Ash Wednesday on 10 February, so Easter ships **early January**. A "six weeks out" rule misses both decisions entirely.

**Methodology caveat with a shelf life:** CCLI changed what "Top 100" measures in September 2024 — it now reflects SongSelect downloads rather than church usage. Re-pull rankings before each build wave.

**One correction we owe ourselves:** `docs/research/WORSHIP_GUITARIST_RIGS.md` states Nigel Hendroff's "Matchless Spitfire 15" as documented fact. MultiTracks' own copy for his Spitfire pack pointedly never names the manufacturer; the identification traces to a 2009 community gear list. It is community-consensus, not first-party — the same class of claim as the "Klon KTR" we already debunked. Label it accordingly.

---

## 6. Measurement

**North star — Weekly Tones Deployed:**

```sql
SELECT count(*)                                         AS tones_deployed,
       count(DISTINCT user_id)                          AS active_users,
       count(*) FILTER (WHERE download_type = 'preset') AS presets,
       count(*) FILTER (WHERE download_type = 'pdf')    AS pdfs
FROM recipe_downloads
WHERE created_at >= date_trunc('week', now() AT TIME ZONE 'utc')
  AND user_id IS NOT NULL
  AND download_type IN ('preset','pdf');
```

`user_id IS NOT NULL` is load-bearing — anonymous email-gated PDFs share the table and cannot join to a plan.

**Top instrumentation gaps, by decision value:**

1. **No traffic source on any conversion row.** This blocks the actual question — keep investing in the agent surface (MCP, DNS-AID, auth.md, well-knowns) or redirect that effort? A multi-month allocation decision currently made on vibes. Fix: first-touch cookie in the existing middleware plus two columns stamped at four write sites.
2. **Quota refusals are never logged.** We can count who *reached* five downloads, never who wanted a sixth. That refusal count is the demand curve behind both the price and the cap. One insert into `events`; an afternoon's work. (Blocked on resolving 1c first.)
3. **No server-side AI-crawler log.** GA4 structurally cannot see crawlers. This is the early warning for the exact failure that already happened twice — the Vercel firewall challenging all bots, and Cloudflare Bot Fight Mode blocking PerplexityBot. Both were caught by luck, months late.
4. **Client-only funnel events** are ad-blocked at an unknown rate and unjoinable to `user_id`, so every funnel rate has a soft denominator.
5. **No first-touch persistence** — discovery and conversion are weeks apart here, so last-click systematically undercounts AI and overcounts branded search.

The crawler-versus-referral distinction is the one that makes these numbers mean anything: an AI *crawler* is a bot indexing us (no human, no conversion); an AI *assistant referral* is a human arriving from a chat answer, and those convert well. Conflating them produces a number that looks like insight and isn't.

---

## 7. Corrections to Wave One

1. **Honesty annotations: 11, not ~156.** Measured: 6 CORRECTION, 4 unverified, 1 tribute-tier inside the recipes; the other 130 live in blog posts. The discipline is real but it sits where buyers never look. Surface corrections on recipe pages.
2. **"Cross-platform is unmatched" is retired** (see §4).
3. **Tone-request fulfillment is manual, not broken.** Intake, quotas, and an admin moderation UI with a "your tone request is ready" notification all exist; there is no fulfillment cron. The pricing page does not advertise requests, so nothing is oversold. The automated pipeline is genuinely unbuilt — that is the bottleneck.
4. Source quality is better than feared: **138 of 195 recipes (71%) cite primary gear journalism**; 57 rest only on aggregators, tabs, video, or wiki; none have empty sources.

---

## 8. Build order

**This week — stop-the-line fixes.** Remove the six phantom amps and guard against re-adding them. Add the 42-entry alias table and make a dropped amp or cab a hard failure. Resolve the preset-quota policy question. Fix the Set Pack's DSP overage. *Then* ship all 195 presets and spot-check ten in HX Edit.

**Next two weeks — foundations.** `attribution_confidence` on the five worship recipes. Delete or rewrite the 22 fabricated backlog entries. Tuning enum and Mix normalisation. First-touch traffic source plus quota-refusal logging. The six proposed audit rules, shipped with their spec.

**Weeks 3–8 — the wedge.** Tier-1 worship recipes, Elevation-first (Grade A attribution available). Christmas pack **by 15 September**. Set Builder v1 on the now-unblocked DSP model. The HX Stomp fit page, framed honestly. Audio previews on the top 20.

**The 24-month bet.** Section-level tone maps — the artifact that is simultaneously our biggest corpus gap, the Set Builder's input, and Showcase's native format. Build the library Line 6 just built the player for.

---

*Verification note: every number in §1, §3, §5 and §7 was re-checked by hand against the repository. Two agents' figures were corrected in the process (worship percentage, honesty-annotation count) and one agent's competitive claim was softened after direct checking (MultiTracks sells generic, not song-specific, presets). Two agents did not finish within the window — the Routing & Mix Architecture module (its spec companion `ROUTING_SPEC_ADDITIONS.md` did land) and the voice-of-customer study. The session's web-search budget was exhausted late in the run, so the worship rig research for Tomlin, Wickham, Cody Carnes, and Brandon Lake is documented as a known gap rather than papered over.*
