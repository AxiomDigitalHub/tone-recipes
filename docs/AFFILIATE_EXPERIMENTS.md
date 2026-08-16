# Affiliate placement: learnings, enhancements, and experiment set

**Written:** 2026-07-29
**Data sources:** GA4 property `faderandknob` (530356341), last 90 days ·
Microsoft Clarity project `w3jxns38n6`, last 30 days · direct DOM
measurement of rendered pages.

This document exists because the first pass at this problem ranked the work
by *structural leverage* (pages × intent) and got it wrong. The traffic and
scroll data say something different, and the difference is large enough to
change what gets built.

---

## 1. What the data actually says

### Traffic is concentrated in blog posts, not recipes

| Surface | Volume | Share |
|---|---|---|
| Whole site | 6,119 views / 90d · 2,780 users | — |
| The 10 recipe pages in the top 100 | 216 views / 90d | ~3.5% |
| Settings-guide cluster (12 posts) | ~746 views / 90d | ~12% |
| `/browse` (single top page) | 532 views / 90d | ~8.7% |

Recipe pages are ~3.5% of views. Any affiliate module scoped to recipe
pages is therefore a long-term asset, not a near-term earner, regardless of
how well it converts.

### Depth is the binding constraint, not copy

Scroll curve for `/blog/fender-deluxe-reverb-settings` (Clarity, 54 page
views, 30d) — the site's top blog page:

| Depth | 5% | 25% | 45% | 50% | 70% | 80% | 95% | 100% |
|---|---|---|---|---|---|---|---|---|
| Still reading | 98% | 67% | 48% | **41%** | 22% | 18.5% | 13% | 1.9% |

Site-wide average scroll depth is **50.75%**, which corroborates the curve
rather than contradicting it. The cliff is at the halfway mark.

Measured depths of existing affiliate blocks (real DOM positions, not line
estimates):

| Block | Depth | ≈ readers reached |
|---|---|---|
| `helix-vs-quad-cortex-vs-kemper` GearPicks | 69.1% / 75.0% / 81.2% | ~18–22% |
| `marshall-st20h-vs-sc20c` GearPicks | ~92% / ~95% (line est.) | ~13–18% |
| `fender-deluxe-reverb-settings` GearPick | ~70% (line est.) | ~22% |
| `cab-ir-library-roundup-2026` GearPicks | ~51–76% (line est.) | ~19–41% |
| `best-frfr-speakers-for-modelers` GearPicks | ~21–64% (line est.) | ~28–70% |
| **New** `GearShortlist` (helix post) | **9.2%** | **~84%** |
| **New** `RecipeMicPick` (SRV recipe) | **47.9%** | **~45%** |

The two best-placed posts (`best-frfr`, `cab-ir`) are also the two best
performers — `cab-ir` alone produces 14 of the site's 74 key events (18.9%)
off 79–113 visits. That is the strongest available evidence that the
attribution-box format works when readers actually reach it.

### Reader intent differs by page type — and dictates the offer

This is the learning that overturned the original plan. A settings guide's
reader **already owns the gear**. `fender-deluxe-reverb-settings` carried a
single `<GearPick>` for a **$1,750 '65 Deluxe Reverb Reissue** — the wrong
offer for that audience *and* the wrong economics for Amazon (3%, 24-hour
cookie). Hoisting it to high-reach depth would have amplified a mismatch.

| Page type | Reader state | Right offer | Right depth | Right retailer |
|---|---|---|---|---|
| Settings guide (`*-settings*`) | Owns the gear | Companions: mic, attenuator, tubes, pairing pedal | ~25–30% | Amazon (cheap, Prime, cart-wide) |
| Roundup (`best-*`, `*-roundup`) | Shopping, undecided | The gear itself, spread through | from ~20% | Mixed by price point |
| Head-to-head (`x-vs-y`) | Shortlisted 2–3 items | Those items | orient early, verdict late | Sweetwater (big-ticket) |

### Measurement was blind

Before this pass, `<GearPick>` emitted a `data-analytics` attribute that
**nothing read**. The only signal was Clarity's "Outbound click" smart
event — 16 sessions/30d — which also counts source citations and every
other external link. Affiliate CTR was not measurable at all.

---

## 2. What shipped (high confidence, all traffic, no split)

These were treated as enhancements rather than experiments because the
mechanism is understood and the downside is bounded.

1. **`affiliate_click` is now a real GA4 event**, fired from
   `src/components/ui/AffiliateCta.tsx`, with `retailer`, `placement`,
   `gear_slug`, `page_slug`, and `depth_bucket`. `<GearPick>` and
   `<RecipeMicPick>` both route through it. `depth_bucket` is measured from
   the DOM at click time rather than declared by the author, because
   rendered position does not track MDX line position (images and tables
   render far taller than their source) and any hand-maintained number goes
   stale on the next edit.

2. **`<GearShortlist>` + `<GearShortlistItem>`** — an early-placement
   primitive. The reason this exists instead of simply moving GearPicks up:
   in every vs/roundup post the picks sit inside a "Buy the X If…" or "So
   Which One Should You Buy" section, which is editorially *correct*. A
   verdict block at 30% depth would recommend a product before the article
   has argued its case. The shortlist **orients rather than recommends** —
   no pick mark, no verdict, no pros/cons, and a disclosure that explicitly
   says the verdict is further down. Verdict blocks stay where the prose
   earns them.

3. **Deployed to the two posts whose only CTAs sat at 90%+ depth** —
   `helix-vs-quad-cortex-vs-kemper` (measured 9.2%, ~84% reach) and
   `marshall-st20h-vs-sc20c-jtm-vs-plexi`.

4. **Left alone deliberately:** `best-frfr-speakers-for-modelers` (already
   spans 21–64%) and `delay-types-analog-digital-tape` (29–61%). Both are
   already well placed; changing them risks a regression for no expected
   gain.

---

## 2b. The confound that invalidates any "before" baseline

Found 2026-07-29 while placing the E1 blocks, on a post nobody had touched:
**every `<GearPick>` buy button on the site was rendering black text on a
black background.** `.fk-preview .post-body a` (specificity 0,2,1)
out-specifies `.fk-preview .gear-pick-cta` (0,2,0), so inside a blog post
the buttons inherited `var(--ink)` on a `var(--ink)` fill, plus a red prose
underline. Measured contrast ratio: **1.0:1**. Fixed by raising the
selector to (0,3,1); now 16.57:1, WCAG AA pass, underline removed.

This had been live on all six GearPick posts — including
`cab-ir-library-roundup-2026`, which produced 18.9% of all site key events
*with unreadable buy buttons*, and `best-frfr-speakers-for-modelers`, the
#2 blog page.

**Consequences for everything above:**

1. All historical affiliate-click behaviour is a **floor, not a baseline**.
   Whatever those pages earned, they earned with invisible CTAs.
2. E0 and E1 cannot be read as clean before/after. The contrast fix alone
   may lift clicks independent of placement or offer, and it shipped in the
   same change. Do not attribute a lift to placement.
3. The honest reading window starts **after** this fix is deployed. Treat
   the first 30 days post-deploy as the new baseline and compare forward
   from there, not backward.
4. It also means the depth analysis in §1 understates the opportunity: those
   blocks were competing at a disadvantage no scroll curve captures.

---

## 3. The constraint that shapes every experiment below

Two-proportion test, 80% power, α = 0.05:

| Baseline → target | Visits per arm | Total |
|---|---|---|
| 2% → 6% (+200%) | 372 | 745 |
| 2% → 4% (+100%) | 1,137 | 2,274 |
| 2% → 3% (+50%) | 3,818 | 7,636 |

Against available traffic, for a **doubling** (the most optimistic case):

| Unit | Traffic | Time to resolve |
|---|---|---|
| One page (`vox-ac30`, 144/mo) | 144/mo | **15.8 months** |
| Settings cluster pooled (12 posts) | ~249/mo | **9.1 months** |
| Whole site | ~2,039/mo | 1.1 months |

**Conclusion: do not run 50/50 split tests on individual pages.** They
cannot resolve. A realistic +50% effect is 3.4× longer again.

So the experiment set below uses three designs that *do* work at this
traffic:

- **Leading-indicator readout.** Ship to all traffic, then read the
  *distribution* of `affiliate_click` by `depth_bucket` and `placement`.
  Answering "do early placements get clicked at all, and in what
  proportion" needs ~30–50 clicks, not thousands of visits.
- **Pooled before/after across a page cluster.** Accepts seasonality as a
  confound in exchange for usable n. Requires a stated baseline window.
- **Qualitative n=5.** For questions about *why* users behave a certain
  way, five Clarity session recordings beat a test that never resolves.

---

## 4. Experiment set

### E0 — Early shortlist placement (leading-indicator readout) · LIVE

- **Question:** do readers click an orienting shortlist at ~9% depth, and
  how does that volume compare with verdict blocks at 70–81%?
- **Design:** shipped to all traffic on two posts. No split.
- **Metric:** `affiliate_click` counts split by `placement`
  (`gear_shortlist` vs `gear_pick`) and `depth_bucket`.
- **Decision rule:** if `gear_shortlist` earns ≥40% of affiliate clicks on
  those two posts, roll the pattern out to the remaining vs/roundup posts.
  If it earns <10%, the depth theory is wrong for this audience and the
  effort should move to `/browse` instead.
- **Readout:** at 40 total affiliate clicks across both posts, or 90 days,
  whichever comes first.
- **Risk:** the shortlist could cannibalise verdict-block clicks rather than
  add to them. Watch the *total*, not just the split.

### E1 — Settings-guide companion offer (pooled before/after) · LIVE

- **Question:** does an accessory/companion offer convert on a page whose
  reader already owns the gear?
- **Why not a split test:** 9.1 months minimum even pooled. Ship to all.
- **Design:** one companion block on each of the three largest settings
  guides, placed at the hook the post itself already argues rather than at
  a fixed depth target. Shipped 2026-07-29 with measured positions:

  | Post | Companion | Post's own hook | Depth | ≈ reach | Retailer order |
  |---|---|---|---|---|---|
  | `fender-deluxe-reverb-settings` (156/30d) | Fryette Power Station PS-2 (~$499) | "the sweet spot is 5–7, where the 6V6s sag" — loud for 22 W | **28.5%** | ~63% | Sweetwater first |
  | `vox-ac30-settings-guide` (144/30d) | Two Notes Captor X (~$599) | "Volume up into territory most players are hesitant to explore"; no master volume | **34.0%** | ~57% | Sweetwater first |
  | `big-muff-settings-guide` (47/30d) | Ibanez Tube Screamer TS9 (~$110) | its own remedy #3, "stack a mild overdrive before the Muff" | **19.4%** | ~70% | **Amazon first** |

  Every recommendation is one the post already makes in prose, and the two
  attenuator picks are consistent with
  `/blog/reactive-load-box-vs-attenuator`, which calls the Fryette the
  benchmark and whose author says they use a Captor on an AC30
  specifically. Nothing new was invented to sell.

- **Note the retailer split, which corrects §1's taxonomy.** "Settings
  guides are Amazon's sweet spot" is only half right. The *product*
  strategy (companions, not the gear itself) holds. But attenuators are
  $499–599, so by E4's rule they are **Sweetwater** offers. Only the
  sub-$200 companions — overdrives, mics, tubes, cables — are Amazon plays.
  Two of these three companion blocks earn nothing for the Associates
  account.
- **Baseline to capture first:** 30 days of `affiliate_click` with the
  current blocks, so before/after has a floor to compare against.
- **Metric:** `affiliate_click` where `placement=settings_companion`, plus
  Clarity scroll depth on those three pages (to detect the block pushing
  readers away rather than converting them).
- **Decision rule:** keep if companion clicks exceed the existing
  amp-offer clicks on the same pages **and** average scroll depth does not
  drop more than 5 points.
- **Leave `fender`'s existing 70%-depth reissue GearPick in place.** It
  serves the minority who don't own the amp yet, and it is contextually
  correct where it sits.

### E2 — `cab-ir-library-roundup-2026` placement · HOLD, DO NOT TOUCH

- **Question:** would moving its first block from ~51% to ~30% improve on
  18.9% of all site key events?
- **Design:** none. **This is the control.** It is the single
  best-converting page on the site and a test on it cannot resolve inside a
  year, so changing it risks the one thing demonstrably working in exchange
  for an answer that won't arrive.
- **What to do instead:** treat it as the benchmark E0 and E1 are measured
  against. Revisit only if E0 shows a strong early-placement effect
  elsewhere.

### E3 — Inline gear links vs dead clicks (qualitative n=5) · NOT STARTED

- **Question:** Clarity shows **12.14% dead clicks across 330 sessions**.
  On the fender page the most-clicked elements were body text and headings,
  not links — "The Normal channel has lower input imp…", "Both channels
  share the same EQ section…". Are readers tapping gear/spec prose
  expecting it to do something?
- **Why qualitative first:** if this is text selection or mobile mis-taps,
  building the feature is wasted work. Five recordings answer it; no
  quantitative test needed to decide whether to proceed.
- **Design:** watch 5 Clarity recordings filtered to dead clicks on
  `/blog/*-settings*`. Classify each: (a) tapping a gear name, (b) text
  selection, (c) mis-tap, (d) other.
- **Decision rule:** if ≥3 of 5 are (a), wire up the already-built but
  entirely unused `<AffiliateGearLink>` on gear-name mentions in the
  settings cluster, then measure via E1's readout. Otherwise close it.

### E4 — Retailer order · DECIDE BY ECONOMICS, DO NOT TEST

- **Question:** Amazon-first or Sweetwater-first?
- **Why not test:** the expected effect is small, and a small effect needs
  7,600+ visits per comparison. It will never resolve, and the answer is
  already determined by commission structure.
- **Decision rule (adopt, don't test):** Amazon first below ~$200 — the
  24-hour cookie is survivable on an impulse purchase, Prime friction is
  lowest, and cart-wide attribution pays on everything else in the basket.
  Sweetwater first above ~$200 — 3–8% versus Amazon's 3%, a 14–30 day
  cookie for gear people deliberate over, and the buyer is more likely to
  be there anyway.
- **Already applied:** `RecipeMicPick` puts Amazon first (an SM57 is ~$99).
  `GearShortlist` puts Sweetwater first (modelers and amps are $1,000+).

---

## 5. What is deliberately not being measured

- **Revenue per placement.** The Associates and Sweetwater dashboards are
  the source of truth for earnings; GA4 measures clicks. Don't rebuild
  revenue attribution in GA4 off a 3% commission on ~16 outbound
  clicks/month.
- **Statistical significance on any single page.** See §3. Report
  directional counts with the n attached, and resist calling a 3-click
  difference a result.

---

## 6. Open bug found while doing this work

**57 blog posts contain `<FAQ questions={[…]}>` blocks that render
nothing**, and none of them has a frontmatter `faq:` fallback — so that FAQ
content is invisible to readers *and* absent from the FAQPage JSON-LD the
AEO strategy depends on.

Diagnosis so far: not an MDX compile failure. `@mdx-js/mdx` compiles all
the relevant JSX shapes without error, and a server-side probe on a fresh
build showed a string attribute (`label`) arriving correctly while an
array/object attribute (`items={[…]}`) arrived as `undefined` in the same
element. `<EQCurve bands={[…]}>` does work, so the loss is conditional
rather than universal. Both `FAQ.tsx` and `EQCurve.tsx` already carry
defensive `Array.isArray()` guards, so this has been encountered before
without being traced.

Workaround adopted here: `<GearShortlist>` passes data as child elements
with string-only props, the shape that always survives (cf. `<GearPick>`'s
long comma-laden `verdict`). The FAQ bug itself is untouched — it needs its
own fix, and it is a bigger SEO issue than anything in this document.
