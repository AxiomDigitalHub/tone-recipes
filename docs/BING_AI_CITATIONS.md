# Bing AI Performance — what actually gets cited, and how to move it

**First read:** 2026-08-03
**Source:** Bing Webmaster Tools → AI Performance (BETA), `faderandknob.com`
**Window available:** 2026-07-23 → 2026-08-02. **The 6 M view returns the same 11 days**, so collection began 2026-07-23. There is no baseline yet.
**Caveats Bing states on the page:** the data is *a sample of overall activity*, "results may be refined as additional data is processed," and intent/topic labels are AI-generated. Citation ≠ click ≠ customer.

This is the first real AI-surface measurement we have. `docs/ai-sov-runs/*.csv` is not — it is a model introspecting about whether it *would* cite us, and it has returned "unchanged" twice in a row, which is what an instrument reads when it is measuring nothing. Demote it; log this instead.

---

## 1. The headline numbers

| Metric | Value |
|---|---|
| Total citations (11 days) | **~2,000** |
| Avg. cited pages/day | 44 |
| Distinct pages cited | **111** |
| Grounding queries in the sample | 28 |

Daily: 235 · 290 · 325 · 362 · 108 · 167 · 116 · 83 · 103 · 71 · 151.

**Do not read the drop after Jul 26 as a decline.** Eleven days, sampled, with a stated refinement lag, and no prior period to compare against. Log four more weeks before drawing any trend. (Checked the obvious culprit anyway: `robots.txt` is clean — `Allow: /`, `Content-Signal: search=yes, ai-input=yes, ai-train=yes`, no AI agent blocked.)

---

## 2. The finding that matters: we are cited as a hardware reference, not as a tone library

Top cited pages:

| Page | Citations |
|---|---|
| `/blog/bone-vs-tusq-vs-graph-tech-nut-materials` | **248** |
| `/blog/guitar-eq-guide` | **110** |
| `/blog/locking-tuners-slip-test-hipshot-sperzel-schaller-gotoh` | **64** |
| `/blog/the-edge-delay-settings` | 59 |
| `/news/fender-tone-master-pro-firmware-1-8-45-evh-5150` | 47 |
| `/blog/amp-gain-volume-master-controls` | 34 |
| `/blog/quad-cortex-capture-tutorial` | 33 |
| `/blog/best-frfr-speakers-for-modelers` | 31 |
| `/blog/4-wire-method-explained` | 26 |

Three pages carry **~21% of all citations**, and all three are Gear Lab reference work — nut materials, a tuner slip test, and a definitional EQ explainer.

**What is almost entirely absent: worship, and song-specific presets.** One recipe page appears (`the-edge-delay-settings`, 59) plus `andy-timmons-lead-tone-recipe` (16). Zero worship queries in the 28-query sample. The AI layer is citing us for the thing we treat as a side project, and ignoring the thing the strategy is built on.

## 3. The lever: citation share tracks original measurement almost perfectly

Where we ran a test nobody else ran, we own the answer:

| Query | Share |
|---|---|
| best guitar tuning machines retrofit stability smooth operation | **83.3%** |
| most reliable locking tuners for bass guitars | **71.4%** |
| best guitar nut materials intonation comfortable action | **64.7%** |
| graphite vs silicone lubricant guitar tuning pegs nut slots | **64.7%** |
| choosing nut material for mandolin build | **57.1%** |

Where we are one voice among many, we lose:

| Query | Share |
|---|---|
| tusq nut | **12.8%** |
| tonex modeler | **15.7%** |
| qc capture | **18.8%** |
| 6v6 vs 6l6 | **21.0%** |
| quad cortex vs kemper | **23.8%** |
| fender tone master pro update | **25.0%** |

The split is clean, and it is the moat thesis with numbers attached: **generation is free, measurement is scarce, and the retrieval layer rewards the measurement.** The locking-tuner slip test is a literal A/B we ran; it wins 71–83% of its queries. "tusq nut" — a head term anyone can write about — returns 12.8%.

Two secondary patterns:

- **Specific beats short.** The high-share queries are long and exact ("nut slot file size 1 11/16 inch acoustic guitar", "graphite vs silicone lubricant … nut slots"). The low-share ones are head terms. Assistants ground long questions in whoever answered *that* question; head terms go to whoever has authority, which is not us.
- **Definitions are a large, cheap surface.** The single biggest grounding query is `eq profile for guitar meaning` — 88 citations, purely definitional. Models constantly need a term defined.
- **News is a working citation channel.** Four news posts appear in the top 25 (Tone Master Pro firmware 47, NAM A2 25, Eventide H90 23, Mooer GE100 16). Being fast and accurate on firmware/product news earns grounding without authority.

---

## 4. How to learn — the loop, in order

**1. Build the baseline that doesn't exist.** Weekly: *Download all* from both tabs (Grounding Queries + Pages), commit the CSVs to `docs/ai-citation-runs/`, append a dated entry here — exactly the pattern `index-health-log.md` uses. Needs a browser session, so it belongs in the weekly human window. Nothing below is trustworthy until ~4 weeks of this exist.

**2. Join citations to outcomes before believing they matter.** A citation is not a visit and a visit is not a tone deployed. `MEASUREMENT_PLAN.md` is right that AI share-of-voice is not a business outcome. The join to run: for the top 10 cited pages, pull GA4 sessions with an AI/Copilot referrer and check downstream behaviour against the north star. If 2,000 citations produce no measurable sessions, this dashboard is a vanity surface and should be treated as one.

**3. Run one controlled test, since the split is already visible.** The hypothesis this data generates: *pages carrying original measurement get cited at multiples of pages that don't.* We have the natural experiment — publish two comparable pages, one with a measured test and one without, and compare citations at 30 days. n=1 per arm is weak, but it beats the alternative, which at 2,000 visits/month cannot resolve anything (see `AFFILIATE_EXPERIMENTS.md` §3).

**4. Watch share, not volume.** Volume moves with Bing's sampling and with how many people ask. Share is the competitive number and the one we control.

---

## 5. How to increase usefulness — ranked

1. **Publish the preset level-matching standard.** Named in the VOC study as the thing "everybody does it differently" and nobody has documented. It is simultaneously original measurement (high share), a definitional query, and the linkable asset the backlink problem needs. Highest-value single artifact available.
2. **More original tests, in the Gear Lab shape that is already winning.** The unit is "we measured N things and published the numbers" — nut materials, tuner slip, lubricants. Cheap, permanent, and the only format strangers cite.
3. **Own the vocabulary.** One clean definitional page per term we use constantly — snapshot vs preset vs stomp, capture vs profile vs model, DSP budget, IR, cab block, level matching. `eq profile for guitar meaning` at 88 citations is the proof of demand.
4. **Keep the news engine pointed at firmware and spec changes.** It earns citations with zero authority, and it is already automated.
5. **Do not chase head terms.** "tusq nut" at 12.8% against our own comparison page at 45.8% says the decision framing is winnable and the head term is not.
6. **Resolve the worship absence deliberately.** Zero worship citations is either (a) our worship content is unindexed — consistent with 4 of 5 posts still missing after 32 days — or (b) that audience doesn't ask assistants this, they ask YouTube. Those imply opposite strategies. The cheap probe: search the full 111-page and query lists for any worship URL, and re-check after the indexing gap closes.

---

## 6. The uncomfortable read

The strategy says worship guitarists on Line 6 Helix. The AI layer says we are a guitar-hardware reference desk — nuts, tuners, tubes, EQ, capture workflows — and it says so with 2,000 citations and a handful of 70–83% shares.

That is not proof the strategy is wrong. Citations are not customers, the sample is 11 days, and the hardware pages may be earning citations precisely because they answer questions no one monetises. But it is the first evidence we have about where this site is genuinely the best answer on the internet, and it points somewhere the plan does not.

Worth holding both: keep building the worship thesis, and stop treating the Gear Lab as the side project. It is currently the only part of the site the machines consider authoritative.

---

## Run log

### 2026-08-03 — first read
Window 07-23 → 08-02 (all data that exists). ~2,000 citations, 44 avg cited pages/day, 111 distinct pages, 28 queries sampled. Top page `bone-vs-tusq-vs-graph-tech-nut-materials` (248). Highest share `best guitar tuning machines retrofit stability` (83.3%). No worship queries present. robots.txt verified open to AI crawlers. No baseline — do not infer trend.

### 2026-08-12 — second read
Window 07-23 → **08-10** (19 days, `3 M` selector — still returns the same start date, so collection began 07-23 and **this window overlaps the first read; it is cumulative, not an independent week**). **3.6K** citations (3,624 by day-sum), **47** avg cited pages/day, **160** distinct pages (was 111), **36** queries sampled (was 28).

New days since first read (Aug 03–10): 156 · 80 · 86 · 121 · **338 · 295 · 275 · 262**. The Aug 07–10 block is the highest sustained run since Jul 23–26. The 11 days from the first read came back **byte-identical**, so the historical series is stable and the refinement lag does not appear to rewrite past days.

**Top 5 pages:**
| Page | Citations | vs first read |
|---|---|---|
| `/blog/bone-vs-tusq-vs-graph-tech-nut-materials` | **427** | 248 → 427 |
| `/blog/guitar-eq-guide` | **137** | 110 → 137 |
| `/blog/signal-chain-order-guide` | **85** | **new to top 5** (absent from prior top 9) |
| `/blog/best-frfr-speakers-for-modelers` | **79** | 31 → 79 (#8 → #4) |
| `/blog/the-edge-delay-settings` | **68** | 59 → 68 |

**Notable movement:** `signal-chain-order-guide` is the new top-5 entrant. `best-frfr-speakers-for-modelers` more than doubled. Against that, `/blog/locking-tuners-slip-test-…` sat at **64 → 64 — zero new citations in 8 days**, falling #3 → #7; worth a second look, since it is one of the original-measurement pages the thesis leans on.

**3 highest citation shares:** best guitar tuning machines retrofit stability smooth operation **83.33%** · most reliable locking tuners for bass guitars **71.43%** · best guitar nut materials intonation comfortable action **58.62%**.
**3 lowest:** tonex modeler **15.65%** · qc capture **18.75%** · fixed bias vs cathode bias (video intent) **21.82%**.

**No share moved more than ~15 points.** Largest mover: `graphite vs silicone lubricant guitar tuning pegs nut slots` **64.7% → 51.52%** (−13.2). The two flagship measured queries (tuning machines 83.3%, bass locking tuners 71.4%) held flat to the decimal. §3's split — original measurement 57–83%, generic head terms 15–25% — **holds unchanged on a second read**.

**Worship — §6's open probe, now answered (partially).** Searching the full 160-page list for `worship` returns **4 cited pages, 26 citations total**: `/guides/worship-guitar` (9), `/blog/worship-guitar-tone-helix` (9), `/blog/hx-stomp-vs-helix-lt-worship` (5), `/blog/worship-pedalboard-guide` (3). So worship is **no longer entirely absent** — the generic/evergreen worship pages do get cited.

But searching for `tone-helix` returns **exactly one row** (`worship-guitar-tone-helix`, 9). **None of the 5 worship artist posts is cited at all** — not lincoln-brewster, hillsong, elevation-worship, bethel-music, or phil-wickham. Note that **hillsong-guitar-tone-helix has been indexed in Google for four consecutive weeks and still draws zero AI citations**, which splits §6's two hypotheses: this is not purely an indexing problem. Being crawlable is necessary but not sufficient. Still **zero worship queries** in the query sample (top 25 of 36 inspected).

**Trend readable yet? No.** Two run-log entries, and the second window *contains* the first — these are not independent weeks. The daily series is the only clean comparison available, and 8 new days with a 4-day surge at the end is not a trend. Need ~2 more weekly entries before reading direction. Watch share, not volume.

**Capture caveats:** top 25 of 36 queries and top 25 of 160 pages captured via the UI (pagination not walked); the worship findings above come from server-side search across the full lists, so they are complete for those terms. `Download all` CSVs were not committed this run.

### 2026-08-19 — SKIPPED (blocked, no data)
Dashboard never reached. The Claude-in-Chrome layer reported **two connected Chrome browsers with none selected for the session** (Browser 1 `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`, Browser 2 `b89db820-bd49-45cb-b08c-b65da091b763`) and requires an interactive pick before any browser action, which an unattended run cannot make. This is **a browser-selection block, not a Microsoft sign-in block** — nothing can be said about session state this week.

Cost of the gap: this would have been the **third** run-log entry and the first with a chance of being a genuinely independent window from the 07-23 collection start. Trend reading is pushed out another week — still **not readable**. The rolling window means this week cannot be backfilled; whatever days fall off the dashboard's retention are gone.
