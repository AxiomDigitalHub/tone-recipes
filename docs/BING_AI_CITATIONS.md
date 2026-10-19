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

### 2026-08-24 — SKIPPED (blocked, no data)
Dashboard never reached. **Identical blocker to 2026-08-19, second consecutive week**: the Claude-in-Chrome layer reports **two connected Chrome browsers with none selected for the session** (Browser 1 `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`, Browser 2 `b89db820-bd49-45cb-b08c-b65da091b763`) and mandates an interactive pick before any browser action. An unattended run cannot choose, and picking one unilaterally is explicitly disallowed. Again **a browser-selection block, not a Microsoft sign-in block** — nothing can be said about the Microsoft session state.

That this repeated byte-for-byte confirms it is **not a transient glitch but a standing condition** of this machine: two Chrome extension instances stay connected, so every unattended run will stall here until one is disconnected or the task is pinned to a device. This is a ~30-second fix that is now costing a weekly data point indefinitely — it should be treated as the highest-value action in this whole pulse.

Cost of the gap: this would have been the **third** run-log entry and the first genuinely independent window from the 07-23 collection start. **Two consecutive missed weeks** now sit between entry 2 and any future entry 3, so the next capture will have a ~3-week jump rather than a clean weekly step. Trend still **not readable**, and the rolling window means neither 08-19 nor 08-24 can be backfilled.

### 2026-09-05 — SKIPPED (blocked, no data) — **new blocker: Microsoft session expired**
Dashboard **reached** for the first time in three weeks, then blocked at the door. Two things changed this week:

1. **The browser-selection blocker has cleared.** Only **one** Chrome extension instance is connected now (`b89db820-bd49-45cb-b08c-b65da091b763`; the second, `c0f2daee-…`, is gone). It selected without an interactive prompt and browser automation worked normally. The standing machine condition flagged on 08-19 and 08-24 is **resolved** — that fix does not need doing again.
2. **A different wall replaced it.** Navigating to `https://www.bing.com/webmasters/aiperformance?siteUrl=https://faderandknob.com/` **redirected to `https://www.bing.com/webmasters/about?siteUrl=https://faderandknob.com/&from=aiperformance`** — the signed-out marketing/signup page ("Sign Up to see more insights"), with no dashboard chrome and no citation data. **The Microsoft session in this browser has expired.** No sign-in was attempted, per task rules.

So unlike the prior two weeks, this run *can* say something about session state: it is **logged out**, and the fix is a genuine re-login by Daniel, not a device pick. Worth doing in a browser session that will persist — the session survived from 08-03 to at least 08-12 and then lapsed sometime during the two blind weeks, so expiry appears to be on the order of a few weeks and will recur.

**Cost of the gap:** this would still have been the **third** run-log entry and the first genuinely independent window from the 07-23 collection start. **Three consecutive missed weeks** (08-19, 08-24, 09-05) now sit between entry 2 and any future entry 3, so the next capture will land as a ~4-week jump from 08-10 rather than a clean weekly step. Trend still **not readable** — and worse than before, because a 4-week gap makes the next entry a coarse before/after rather than a step in a series. The rolling window means none of the three can be backfilled; whatever days have aged out of retention are permanently gone.

**One structural note for whoever captures next:** the two-browser condition and the session expiry were *both* silent to the alerting until a run tried. Consider capturing the AI Performance `Download all` CSVs on the next successful read and committing them, so a future gap costs interpretation rather than raw data.

### 2026-09-27 — SKIPPED (blocked, no data) — **regression: browser-selection blocker is back**
Dashboard never reached. The blocker that 09-05 recorded as **resolved** has **returned**, and this is the headline finding of the run: the Claude-in-Chrome layer again reports **two connected Chrome extensions with none selected for the session**, mandating an interactive pick that an unattended run cannot make and is explicitly forbidden from making unilaterally.

The device ids matter here:

- **Browser 1 — `fe28ff9d-d492-48d5-b5be-06bb72bcb745`** — a **new** id. Not the `c0f2daee-…` that paired with b89db820 on 08-19 and 08-24.
- **Browser 2 — `b89db820-bd49-45cb-b08c-b65da091b763`** — the long-lived instance, and the one that selected cleanly on 09-05.

So this is not the old condition persisting; it is the **same failure mode recurring with a different second device**. That reframes the fix. 08-19/08-24 read like a one-time tidy-up ("disconnect the spare extension, ~30 seconds"). Three data points now say otherwise: spare extensions keep appearing on this machine, and each new one re-breaks unattended capture. **The durable fix is to pin this task to device `b89db820-…`, not to disconnect whatever spare is connected this week** — disconnecting only buys until the next one appears, as 09-27 demonstrates.

**Session state:** unknown this week — the dashboard was never reached, so no statement can be made. But 09-05 established the Microsoft session in `b89db820-…` had **expired**, and nothing since could have renewed it. Assume **two** blockers stack: a device pick *and* a re-login. Whoever unblocks this should plan on both in one sitting, or the next run will clear the pick and stall on the sign-in wall exactly as 09-05 did.

**Cost of the gap:** this would *still* have been the **third** run-log entry and the first genuinely independent window from the 07-23 collection start. **Four consecutive misses** (08-19, 08-24, 09-05, 09-27) now sit between entry 2 and any future entry 3. With 09-27 landing 22 days after 09-05, the next capture will be a **~7-week jump from 08-10**, not a weekly step. Trend is **not readable**, and the gap has crossed from "delayed" into "the series is broken": entry 3 will be a coarse before/after against a window that ended in early August, with no way to tell when any change occurred inside it. The rolling window means none of the four can be backfilled — days aged out of retention are permanently gone.

**Standing recommendation, unchanged and now overdue:** on the next successful read, capture the AI Performance `Download all` CSVs and commit them, so a future gap costs interpretation rather than raw data. Four blind weeks is exactly the scenario that recommendation was written for.

**What has not changed:** nothing in this run touches the canonical reading of the 08-10 data — citation share still tracks **original measurement** (pages carrying a test we ran ourselves hold 57–83% share; generic head terms 13–25%), and **zero** worship or song-preset queries had appeared as of the last successful capture. Note one cross-signal worth carrying into the next capture: Google newly indexed `elevation-worship-guitar-tone-helix` this week, joining `hillsong-guitar-tone-helix` (indexed 8 weeks, still drawing zero AI citations as of 08-10). If entry 3 shows Hillsong *still* at zero citations despite two months of Google indexing, that further confirms indexing is necessary but not sufficient for AI citation — the split first flagged in the 08-10 entry.

### 2026-10-10 — SKIPPED (blocked, no data) — **fifth consecutive miss; device ids churned again**
Dashboard never reached. Same failure mode as 09-27: the Claude-in-Chrome layer reports **two connected Chrome extensions with none selected for the session**, mandating an interactive pick that an unattended run cannot make and is explicitly forbidden from making unilaterally.

The device ids moved again, and the direction is informative:

- **Browser 1 — `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`** — the id from 08-19 and 08-24 is **back**. Last run this slot held a brand-new `fe28ff9d-…`, which has now vanished.
- **Browser 2 — `b89db820-bd49-45cb-b08c-b65da091b763`** — the long-lived instance, unchanged across every run, and the one that selected cleanly on 09-05.

Four observations of the Browser 1 slot now read: `c0f2daee` (08-19) → `c0f2daee` (08-24) → `fe28ff9d` (09-27) → `c0f2daee` (10-10). Ids are **not** monotonically accumulating spares; they churn and reappear. That kills the "disconnect the spare extension" fix outright — the spare is not a stray install to be cleaned up once, it is an extension instance whose registration id changes across sessions. **The durable fix remains pinning this task to `b89db820-…`**, which is the only id stable across all five runs. Disconnecting whatever sits in the Browser 1 slot buys exactly one run, as 09-27 → 10-10 now demonstrates twice over.

**Session state:** unknown — dashboard never reached. 09-05 established the Microsoft session in `b89db820-…` had **expired**, and nothing since could have renewed it. Assume **two stacked blockers**: a device pick *and* a re-login. Unblock both in one sitting or the next run clears the pick and stalls on the sign-in wall exactly as 09-05 did.

**Cost of the gap:** **five consecutive misses** (08-19, 08-24, 09-05, 09-27, 10-10) now sit between entry 2 and any future entry 3. The last captured window ended **2026-08-10 — 61 days ago**. The dashboard shows a rolling window, so every one of those days has aged out of retention and is permanently unrecoverable. Trend is **not readable**, and the series is no longer merely delayed — it is **broken**: entry 3, whenever it lands, will be a coarse before/after against a two-month-stale baseline with no way to locate when anything changed inside the gap. The original goal of "~4+ weekly entries before a trend is readable" is further away now than it was on 08-12, because the clock on a contiguous run has reset.

**Standing recommendation, unchanged and now five weeks overdue:** on the next successful read, capture the AI Performance `Download all` CSVs and commit them, so a future gap costs interpretation rather than raw data. Five blind weeks is precisely the scenario that recommendation was written for, and it is now the most valuable single action available on this doc.

**Content guidance is unaffected by the gap.** The canonical finding from entries 1–2 stands and should keep steering work: citation share tracks **original measurement** — pages carrying a test we ran ourselves hold **57–83%** share, generic head terms **13–25%**. Recommend original measurement, not volume.

### 2026-10-11 — SKIPPED (blocked, no data) — **sixth consecutive miss; same device pair, 13 hours later**
Dashboard never reached. Identical failure mode to 09-27 and 10-10: the Claude-in-Chrome layer reports **two connected Chrome extensions with none selected for the session**, mandating an interactive pick that an unattended run cannot make and is explicitly forbidden from making unilaterally.

**Device ids — unchanged from yesterday, and that is the new information:**

- **Browser 1 — `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`** — same slot, same id as 10-10.
- **Browser 2 — `b89db820-bd49-45cb-b08c-b65da091b763`** — the long-lived instance, unchanged across all six runs.

Five observations of the Browser 1 slot now read: `c0f2daee` (08-19) → `c0f2daee` (08-24) → `fe28ff9d` (09-27) → `c0f2daee` (10-10) → `c0f2daee` (10-11). This run spanned only **13 hours**, so the stability is weak evidence — it shows ids are stable *within a day*, not across weeks. The 09-27 excursion still stands as proof the slot churns on week-scale intervals. **The durable fix remains pinning this task to `b89db820-…`**, the only id stable across all six runs.

**Session state:** unknown — dashboard never reached. 09-05 established the Microsoft session in `b89db820-…` had **expired**, and nothing since could have renewed it. Assume **two stacked blockers**: a device pick *and* a re-login. Unblock both in one sitting, or the next run clears the pick and stalls on the sign-in wall exactly as 09-05 did.

**Cost of the gap:** **six consecutive misses** (08-19, 08-24, 09-05, 09-27, 10-10, 10-11) now sit between entry 2 and any future entry 3 — though note 10-10 and 10-11 are 13 hours apart, so this is **six missed *runs*, not six missed weeks**; the calendar gap is what matters and it stands at **62 days**. The last captured window ended **2026-08-10**. The dashboard shows a rolling window, so those days have aged out of retention and are permanently unrecoverable. Trend is **not readable**, and the series remains **broken** rather than merely delayed: entry 3, whenever it lands, will be a coarse before/after against a two-month-stale baseline with no way to locate when anything changed inside the gap.

**Standing recommendation, unchanged and now six runs overdue:** on the next successful read, capture the AI Performance `Download all` CSVs and commit them, so a future gap costs interpretation rather than raw data. This is still the single most valuable action available on this doc.

**Cross-signal to carry into the next capture (updated):** Google has now confirmed `hillsong-guitar-tone-helix` indexed across **10** reads and `elevation-worship-guitar-tone-helix` across **3**. As of the last successful Bing capture (08-10), Hillsong was drawing **zero** AI citations despite being indexed. If entry 3 shows Hillsong *still* at zero with Elevation also at zero, that is strong confirmation that Google indexing is **necessary but not sufficient** for AI citation — the split first flagged in the 08-10 entry, and by then testable against two indexed worship posts instead of one.

**Content guidance is unaffected by the gap.** The canonical finding from entries 1–2 stands and should keep steering work: citation share tracks **original measurement** — pages carrying a test we ran ourselves hold **57–83%** share, generic head terms **13–25%**. Recommend original measurement, not volume.

### 2026-10-12 — third read (✅ data captured — first successful read since 08-12)
**Unblocked.** The Chrome layer had a browser already settled for the session (`c0f2daee-…`, "Browser 2" on this computer) and the Microsoft session was live — no device pick, no sign-in wall. Dashboard loaded directly.

Window **07-23 → 10-10** (80 days; the date tab reported as selected was `30 D`, but the chart and totals span the full series from 07-23 — treat as cumulative, same as 08-12). **36.4K** citations (36,339 by day-sum), **78** avg cited pages/day, **361** distinct pages (was 160), **101** grounding queries in the sample (was 36).

The 19 days captured on 08-12 (07-23 → 08-10) came back **byte-identical** again, so the history is stable and this read can be diffed against the old one.

**Daily series, the 62 days missed (08-11 → 10-10):** 187 · 289 · 236 · 236 · 196 · 217 · 244 · 275 · 269 · 176 · 344 · 234 · 294 · 368 · 510 · 443 · 461 · 433 · 370 · 423 · 564 · 486 · 533 · 508 · 491 · 354 · 472 · 429 · 436 · 410 · 397 · 493 · 389 · 408 · 448 · 544 · 429 · 358 · **1.4K · 1.5K · 1.3K · 1.4K · 1.4K · 1.5K** · 673 · 503 · 540 · 458 · 565 · 666 · 786 · 540 · 567 · 488 · 504 · 603 · 497 · 603 · 691 · 571 · 606.
- The 7-day average went from **208/day** (08-04 → 08-10) to **582/day** (10-04 → 10-10), about **2.8×**. The last two weeks are flat against each other (581 vs 582).
- Avg cited pages/day went from roughly 28–80 in early August to **87–107** now.
- **A 6-day spike, 09-18 → 09-23 (1.3–1.5K/day),** then a step down to a new plateau of about 500–700. The top query and page below are the likely cause: `master volume` drew **6.0K** citations at only 8.74% share, and `/blog/amp-gain-volume-master-controls` drew **6.4K**. A single generic head term accounts for about **17%** of all citations in the window.

**Top 5 pages (of 361):**
| Page | Citations | vs 08-12 |
|---|---|---|
| `/blog/amp-gain-volume-master-controls` | **6.4K** | **new**, not in the prior top 5 |
| `/blog/bone-vs-tusq-vs-graph-tech-nut-materials` | **1.5K** | 427 → 1.5K, now #2 (was #1) |
| `/blog/boss-katana-settings-guide-every-genre` | **773** | **new to top 5** |
| `/blog/best-frfr-speakers-for-modelers` | **638** | 79 → 638 (#4 → #4) |
| `/blog/signal-chain-order-guide` | **629** | 85 → 629 (#3 → #5) |

Pages 6–10: diy-pedal-starter-guide 501 · guitar-eq-guide 495 (was #2) · line-6-helix-family-compared 468 · boss-katana-hidden-settings 402 · reverb-before-or-after-delay-chain-order 364. Pages 11–15: jcm800-settings-guide 331 · impulse-response-ir-guide 297 · news/fender-tone-master-pro-firmware-1-8-45-evh-5150 296 · 4-wire-method-explained 264 · open-back-vs-closed-back-cab-tone 258. The-edge-delay-settings fell from #5 to #16 (256). Nut and tuner luthiery pages hold several top-25 slots: nut-slot-geometry 254, nut-slot-width-by-string-gauge 235, locking-tuner-installation 205, how-to-recut-binding-guitar-nut 194.

**Top 15 grounding queries (citations · share):** master volume 6.0K · 8.74% · 5 things your guitar must get right file the nut 319 · 52.38% · fender tone master pro update 268 · 24.50% · best frfr speakers for guitar 165 · 33.00% · diy guitar pedals 159 · 19.37% · nut slot file size 1 11/16 inch acoustic guitar 126 · 43.90% · hipshot locking tuners 124 · 25.05% · best material for guitar nut 121 · 32.35% · sustainiac pickup 106 · 14.62% · ir files 105 · 33.76% · 4 cable method 92 · 21.55% · eq profile for guitar meaning 88 · 33.33% · best guitar nut materials intonation action 87 · 44.39% · Gotoh vs Grover guitar tuners comparison 67 · 20.36% · bone nut vs TUSQ nut guitar comparison 61 · 32.45%.

**3 highest shares (top 25 by citations):** are behringer pedals good **61.54%** · graphite vs silicone lubricant guitar tuning pegs nut slots **57.01%** · 5 things your guitar must get right file the nut **52.38%**.
**3 lowest:** darkglass anagram guitar essentials **7.51%** · master volume **8.74%** · sustainiac pickup **14.62%**.

**Share movers vs 08-12 (queries present in both reads):** graphite vs silicone lubricant 51.52% → **57.01%** (+5.5) · tonex modeler 15.65% → 15.43% · qc capture 18.75% → 18.35%. **No share moved more than ~15 points.** The two flagship measured queries from 08-12 (tuning machines 83.3%, bass locking tuners 71.4%) are no longer in the top 25 by volume. Their shares were not checked because pagination was not walked.

**Thesis check (§3):** it holds, and the extremes are now sharper. Nut-material, nut-slot and lubricant queries, where we publish our own measurements and specs, sit at **32–57%**. Generic head terms sit at **7–25%**: master volume 8.7%, darkglass 7.5%, sustainiac 14.6%, tonex 15.4%, diy pedals 19.4%. The biggest volume win of the window is the lowest-share query on the board. Volume came from a generic head term. Share came from measurement.

**Worship:** a server-side search of grounding queries for `worship` returned **"No data available"**. That makes **zero worship queries** across 101, the third read in a row with none. The page-list search for `worship` / `tone-helix` did **not** apply: the result count stayed at 361 and the filter needs the Search button, not Return. So whether the 5 artist posts or the evergreen worship pages are cited **was not established this run**. None appear in the top 25 pages. No song-preset query appears in the top 25 queries.

**Trend readable yet? Partially.** The daily series is now 80 days long and its history has been stable across reads, which supports one directional statement: **citations rose about 2.8× from early August to early October and have held flat for the last two weeks.** Share trends are **not** readable. This is only the third snapshot, with a 61-day hole between snapshots 2 and 3, and only the top 25 queries were captured. Weekly share entries need to resume before share-level movement can be read.

**Capture caveats:** top 25 of 101 queries and top 25 of 361 pages were captured through the UI, without walking pagination. `Download all` CSVs were **not** committed again this run. That is still the most valuable fix: next run, download and commit them.

### 2026-10-19 — fourth read (✅ data captured, first on-cadence weekly read)
The Chrome layer already had `c0f2daee-…` settled for the session and the Microsoft session was live. No device pick and no sign-in were needed.

Window **07-23 → 10-17** (87 days, cumulative as before). **41.6K** citations (was 36.4K, so +5.2K in the 7 new days). **79** avg cited pages/day (was 78). **390** distinct pages (was 361). **103** grounding queries in the sample (was 101). History through 10-10 came back identical to the 10-12 read.

**New days (10-11 → 10-17):** 753 · 688 · 779 · 776 · 727 · 884 · 588. That averages **742/day**, against 582/day for 10-04 → 10-10, so **+27% week over week** and the end of the two-week plateau noted on 10-12. 10-16 (884) is the highest day outside the 09-18 → 09-23 spike. Avg cited pages/day ran 80–103.

**Top 5 pages (of 390):** same five pages, same order as 10-12.
| Page | Citations | vs 10-12 |
|---|---|---|
| `/blog/amp-gain-volume-master-controls` | **6.5K** | 6.4K |
| `/blog/bone-vs-tusq-vs-graph-tech-nut-materials` | **1.7K** | 1.5K |
| `/blog/boss-katana-settings-guide-every-genre` | **1.2K** | 773 (+55%, fastest grower in the top 5) |
| `/blog/best-frfr-speakers-for-modelers` | **775** | 638 |
| `/blog/signal-chain-order-guide` | **694** | 629 |

Pages 6–15: guitar-eq-guide 623 (back up from #7) · diy-pedal-starter-guide 547 · boss-katana-hidden-settings 501 · line-6-helix-family-compared 472 · reverb-before-or-after-delay-chain-order 416 · jcm800-settings-guide 394 · news/fender-tone-master-pro-firmware-1-8-45-evh-5150 356 · impulse-response-ir-guide 351 · the-edge-delay-settings 312 (back into the top 15 from #16) · eq-pedal-placement 286 (new to the top 15). Luthiery pages are still in the top 25: nut-slot-geometry 284, nut-slot-width-by-string-gauge 264, locking-tuner-installation 212, plus floyd-rose-setup-guide 207.

**Top 15 grounding queries (citations · share):** master volume 6.0K · 6.94% · 5 things your guitar must get right file the nut 352 · 52.38% · fender tone master pro update 296 · 24.61% · best frfr speakers for guitar 186 · 32.01% · diy guitar pedals 159 · 19.37% · nut slot file size 1 11/16 inch acoustic guitar 134 · 43.51% · hipshot locking tuners 131 · 25.29% · best material for guitar nut 129 · 31.85% · sustainiac pickup 106 · 14.62% · ir files 105 · 33.76% · 4 cable method 101 · 21.31% · melofty axom max 101 · 22.39% (new to the top 15) · best guitar nut materials intonation action 95 · 43.78% · eq profile for guitar meaning 88 · 33.33% · fender tonemaster pro firmware update 71 · 23.05%.

**3 highest shares (top 25 by citations):** are behringer pedals good **61.54%** · graphite vs silicone lubricant guitar tuning pegs nut slots **57.01%** · 5 things your guitar must get right file the nut **52.38%**. These are the same three as 10-12 with identical values.
**3 lowest:** master volume **6.94%** · darkglass anagram guitar essentials **7.86%** · sustainiac pickup **14.62%**.

**Share movers vs 10-12:** master volume 8.74% → **6.94%** (−1.8). Its citation count held at 6.0K, so the competing pool grew around it. Everything else moved by less than 1 point: darkglass +0.35, frfr −0.99, gotoh −0.80, best guitar nut materials −0.61. **No share moved more than ~15 points.** The high- and low-share sets are unchanged.

**Thesis check (§3):** it still holds. Measured nut, slot and lubricant queries sit at **31–57%**, and generic head terms sit at **7–25%**. The biggest-volume query is still the lowest-share one on the board, and it slipped further.

**Worship: first time established.** A page-list search for `worship`, applied with the Search button, returned **10 cited pages, 414 citations total**. That is about 1% of the window: guides/worship-guitar 135 · blog/worship-guitar-tone-helix 91 · worship-pedalboard-guide 57 · hx-stomp-vs-helix-lt-worship 45 · helix-worship-snapshots-sunday-morning 36 · pod-go-worship-setup-snapshots-presets 27 · worship-guitar-tone-boss-katana 8 · **elevation-worship-guitar-tone-helix 7** · single-coil-vs-humbucker-worship-ambient-tone 6 · walrus-slo-vs-strymon-bluesky-worship-reverb 2. **Of the 5 artist posts, only Elevation is cited at all.** Hillsong does not appear in this filter, although its slug lacks "worship", so a `tone-helix` search would be needed to rule it out. Lincoln Brewster, Bethel and Phil Wickham do not appear either and would need the same check. The evergreen worship hub and how-to pages outdraw the artist posts by an order of magnitude. Worship grounding queries were not re-searched this run. None appear in the top 25, and no song-preset query appears in the top 25.

**Trend readable yet? Volume yes, share not yet.** The 87-day daily series has stayed stable across four reads. Citations rose about 2.8× from early August to early October and then **rose another ~27% this week after a two-week plateau**. This is the first adjacent-week pair of share snapshots (10-12 → 10-19), and it is flat. One stable pair is not a trend. Readable share movement needs two to three more consecutive weekly reads.

**Capture caveats:** only the top 25 of 103 queries and the top 25 of 390 pages were captured, without walking pagination. `Download all` CSVs were still **not** committed. That remains the fix for the next run.
