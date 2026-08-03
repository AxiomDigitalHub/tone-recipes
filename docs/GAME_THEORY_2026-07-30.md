# The Board — a game-theoretic read of Fader & Knob, July 2026

**Date:** 2026-07-30
**Inputs:** git history 2026-03-16 → 2026-07-30 · GA4 property 530356341 (90d, read 2026-07-29) · Microsoft Clarity `w3jxns38n6` (30d) · `docs/index-health-log.md` · `docs/research/MOAT_AND_CLONING_THREAT_2026-07.md` · `docs/research/VOICE_OF_CUSTOMER_2026-07.md` · `docs/CORPUS_QC_SCORECARD.md` · `docs/AFFILIATE_EXPERIMENTS.md`
**Status:** analysis. Recommends, does not decide.

---

## 0. The one-paragraph version

Four months built a working publishing engine and a measured quality baseline. What it has not built is a **name** or a **link** — and both are the currency of every game we are actually playing. Meanwhile the two things we set out to sell (preset files, AI tone generation) have been driven to zero by free, open-source, vendor-shipped substitutes. The board that remains has exactly one uncontested square on it: **verification is scarce precisely because generation became free.** The strategic error available to us right now is to keep publishing into an authority gate. The strategic move available to us is to convert our private knowledge of our own defects into the only signal in this market that cannot be faked.

---

## 1. What the last four months actually produced

**Built and working:**
- An autonomous content engine (71 daily runs, publishing without a human press of a button)
- 200 recipes, 379 posts, every recipe generating a valid preset for three platforms on demand
- A live payment path (checkout verified with a real purchase + refund)
- An agent-readable surface: MCP server, markdown renditions, OAuth discovery, Content Signals — before most publishers had any of it
- A measured quality baseline (the QC scorecard) — the first time anything here was counted rather than asserted
- A correction discipline that is now structural, not aspirational

**Not built:**
- Authority. **0 backlinks.** 4 of 5 worship posts still unindexed 32 days after submission.
- Retention. ~2,400 new users in 90 days; returning users run ~17% of new arrivals.
- Revenue. 0 purchases recorded across the 90-day window.
- A name. The VOC study ranks named reputation as the #2 trust signal in this market and states flatly: *we have no name — this is our single biggest deficit.*

The asymmetry is the whole story. **Production is solved; distribution and trust are not.** Four months of the strongest available engine produced 6,119 views. That is not a content problem.

---

## 2. Core problem we actually solve

Not "we have tone settings." Three problems, in the order the market feels them:

1. **"It sounded great at home and terrible at church."** The #1 pain in the corpus, and the field's consensus answer is learned helplessness.
2. **"I have 60–90 minutes the night before, on a setlist that isn't final."** The buyer's own purchase justification is *time and curation*, not accuracy.
3. **"There are thousands of free presets and not one of them survived my first attempt."** Abundance without curation is the pain free content creates.

All three are **verification and deployment** problems. None of them is a "we need more tones" problem. This matters because our reflex — publish more — addresses none of them and actively damages the first.

---

## 3. The games, and what each one implies

### Game 1 — Supplying artifacts: Bertrand competition against zero

Capture is now free (NAM A2, MIT-licensed, running on a $3 chip). Generation is free (ToneBuilder.ai, BIAS X, six others emitting real `.hlx`). When a competitor has zero marginal cost and no capacity constraint, the Nash equilibrium price of the artifact is **zero**. There is no clever play inside this game — there is only exiting it.

> **Implication:** any plan whose payoff depends on us supplying more/better preset files is dominated. This is already the correct reading — it is why ToneTrace was cut — but it should also govern how we talk about the library. The file is the receipt, not the product.

### Game 2 — The lemons market, and the only signal that survives it

A preset is a credence good: you cannot evaluate it until you plug in, and often not until Sunday. AI just flooded this market with artifacts of unobservable quality. Akerlof's result applies directly — buyers discount everything toward the average, and honest sellers get punished alongside the dishonest.

The escape from a lemons market is a **costly-to-fake signal** (Spence). Sort the available signals by how expensive they are to fake:

| Signal | Cost to fake | Worth |
|---|---|---|
| "AI-powered" | zero | zero — every vendor says it |
| "Trusted by guitarists" | zero | zero |
| A demo video | low, and *actively distrusted* in this market | negative |
| Publishing your own errors, with dates | **very high for a bad actor** | **high** |
| Publishing a measured defect rate on your own catalogue | **very high** | **high** |
| Per-recipe DSP cost, level-match measurement, test-import result | high (requires real machinery) | high |

We already own the two expensive ones and are storing them in the wrong place. The QC scorecard found **11 honesty annotations on recipe pages and 130 in blog posts** — the signal is filed where nobody is deciding whether to trust us.

There is a sharper version of this. In disclosure games, voluntarily revealing *unfavourable* private information is the strongest credibility move that exists, because silence is rationally read as bad news. We currently hold private information about our own defects (the 28% block-drop rate, the 145 unshipped presets, the download button that lied) that no competitor holds about theirs. Publishing it is not humility. **It is the only separating move on the board.**

> **Implication:** the correction record, the QC scorecard, and per-recipe verification data belong **on the recipe page, above the fold**, in the moment of decision. This is the highest-value, lowest-cost move available, and the asset is already written.

### Game 3 — The incumbent is harvesting, which is a commitment we can exploit

Signal Theory Audio (the Worship Tutorials preset business, spun out of the worship brand) prices Tone Pass 2026 at **$249.99**. Its flagship Bethel Helix patch shows **"Version 5.0 (January 1, 2021)"** and no reviews. A customer's public complaint: *"often uses the same Amp/Cab and effects chains in many different songs."*

That is the signature of an incumbent extracting rent from a depreciating reputation asset. And a $249 anchor across ~970,000 downloads of catalogue is a **commitment they cannot reverse cheaply**:

- They cannot drop to free without destroying the anchor and the brand equity that supports it.
- They cannot retrofit a verification standard across a decade of catalogue at acceptable cost.
- Our 200 recipes *can* be re-verified. **Our small catalogue is an advantage in exactly one game — the one where every item must carry a fresh, checkable claim.**

> **Implication:** pick the battlefield where their size is a liability. Publish a per-item verification standard and meet it on everything. If buyers start asking "what's your level-match spec?", the incumbent either eats a retrofit cost or looks evasive. That is a change to *their* payoff matrix, not just ours.

### Game 4 — Distribution: don't fight a war of attrition on a front you can't win

Two channels, very different structures:

**Google** is a war of attrition against entrenched positions, gated by authority we do not have. Our own index-health log is unambiguous: coverage is gated by **backlinks (0)**, not page volume, and the standing rule is *do not respond by publishing more pages*. Publishing into an authority gate is spending real resources for zero marginal return — the definition of a losing attrition game.

**AI answer surfaces** already deliver ~57% of first-touch users (Bing/DDG/assistants; Clarity's Edge over-representation corroborates it). Position there is not fully allocated. But be honest about the caveat our own playbook insists on: AEO = SEO, and the entry fee is still *being cited by sources models already trust*. **AI-first is not an escape from the authority problem; it is the same problem with a shorter queue.**

The AI share-of-voice runs make the deficit concrete. On the discovery prompt — *"Best site for exact Helix block settings for worship songs"* — we are named **zero times**, unchanged between the 2026-07-03 and 2026-07-21 runs. The assistants name CustomTone, r/Line6Helix, Worship Tutorials, Sunday Sounds, Hislop. **That prompt is the scoreboard.**

> **Implication:** the binding constraint is referring domains, and the only thing strangers link to is **original data**. We already have linkable assets (cable-length measurements, delay-time BPM tables, the 60-cycle-hum decision tree, A/B pedal tests) and have never packaged one as a reference. This is the unlock for both channels at once.

### Game 5 — The complementor position, and its hold-up risk

Line 6 shipped Showcase: an on-device engine that recalls presets and snapshots along a song timeline. **Line 6 built the player and nobody built the library.** Supplying per-song, per-section tone data makes us a complementor to a platform whose adoption we increase — structurally far better than "preset store."

The risk is standard complementor hold-up: Line 6 already absorbed the capture layer (Proxy) and can absorb this one. The mitigation is to own what a platform cannot absorb — the **relationship** (email, account, request queue) and the **verification record** — and to stay multi-platform enough not to be a hostage.

### Game 6 — Pricing against a market with a moral objection to price

This market contains a real, non-hypothetical friction: volunteers in a ministry context who find monetising worship tone uncomfortable, alongside a loud "free is enough" faction. Charging per file collides with both. But the *same people* pay for tooling — the Katana segment buys a $12 librarian app to reach **free** patches.

> **Implication:** never price the file. Price the Sunday. "One pass, the night before, done" is the thing they already say they'd pay for.

---

## 4. The customers who don't know we exist

Ranked by how attractive the square is, not by size.

**Tier 3a — Helix Stadium migrators. The best square on the board.**
New platform, one-way preset conversion, cabs that load different-sounding equivalents, IRs that don't auto-map — and a cohort that just spent ~$2,500 and cannot import what they own. Every competitor is shipping "Stadium versions" of their catalogue (harvesting); **nobody has published the migration knowledge.** This is a *time-boxed disequilibrium*: acute pain, dated, no incumbent answer, and the artifact is knowledge (free, fetchable, linkable) rather than a file. Being first here earns links and name at the moment of maximum pain. It expires — which is exactly why it's ours if we move.

**Tier 3b — The Boss Katana population.** r/BossKatana is ~37k, larger than r/Line6Helix (26k) and r/worshipleaders (9k) combined-ish. Self-identified as underserved. But: they pay for tooling, not tone, and they do **not** have the home-vs-room pain, so our strongest Helix pitch does not transfer. Their named gap is dotted-eighth delay and ambient swells. **Enter free, win the name, monetise elsewhere. Do not port the Helix price.**

**Tier 2 — The "free is enough" refusers.** Large, vocal, and never buying a file. Not a lost audience: they are the *distribution* for the name game. Free work aimed at them is an acquisition channel, not charity.

**Tier 1 — Dissatisfied free-patch users.** Already searching, already burned (*"not a one survived my initial attempts at using"*). They convert on curation and verification, which is precisely the signal we're not showing them. They are gated by Game 4, not by product.

**The adjacent one nobody is serving: "what am I supposed to play?"** Chord charts don't tell a volunteer the part; MDs hand-render part-isolated MP3s to compensate. Only one small competitor bundles tabs + presets. This outranks tone as a pain and sits adjacent to everything we already do. It is the largest unclaimed square in the whole VOC study — and the one furthest from our current build.

---

## 5. What the analytics say we should stop doing

**Stop publishing to fix indexing.** Sitemap grew 769 → 816 URLs across four weeks while 4 of 5 target pages stayed unindexed. The correlation is zero and the doctrine is already written down.

**Stop planning split tests.** Our own power math: a *doubling* of conversion needs 15.8 months on a single page, 9.1 months pooled across the settings cluster. A realistic +50% is 3.4× longer. Any plan containing "we'll A/B it" is a plan to learn nothing before the market moves. Leading-indicator readouts and n=5 recordings are the correct instruments at this traffic.

**Stop optimising recipe pages for near-term revenue.** Recipe pages are ~3.5% of views. Blog settings guides are ~12% and `/browse` alone is ~8.7%. Recipes are a long-term asset; the traffic is in the guides.

**Start treating funnel leaks as acquisition.** 12–24% dead clicks (healthy is 2–5%). A download button that 404'd for ~145 recipes and every Katana user, behind a signup wall we asked them to pass. A newsletter form that 500'd. A 17% return rate. When acquisition is authority-gated and slow, **the only fast lever is not wasting the traffic we already buy with four months of work.** Every one of these is a visitor who reached the moment of value and hit a wall — the most expensive failure mode there is, and invisible in every dashboard we own.

---

## 6. Recommended moves, in order

Ordered by *payoff per unit of scarce resource*, where the scarce resources are Daniel-hours and authority.

**1. Move the verification signal to the point of decision.** Corrections, per-recipe DSP cost, level-match measurement, attribution confidence (`documented` / `pool` / `tribute`), test-import result — on the recipe page, visible without scrolling. The asset exists; it is filed on the wrong surface. *Cost: low. This is the separating equilibrium in Game 2.*

**2. Close the leaks.** Dead clicks on `/recipe` and `/browse`, the auth-aware download modal, the return path. Nothing else compounds until the funnel holds water.

**3. Publish one canonical reference and pitch it.** The level-matching standard is the strongest candidate: *"levelling the presets — everybody does it differently"* and **nobody has published the method.** Whoever does owns a permanent citation. Original data is the only thing strangers link to, and referring domains gate Games 4 and 5 simultaneously. One asset, pitched to ten places, is worth more than a month of publishing.

**4. Take the Stadium migration square before it closes.** Knowledge first (migration guide, what breaks, the cab-equivalence table), artifacts second. Acute pain + no incumbent answer + a dated window.

**5. Commit publicly to a verification standard and meet it on all 200.** Per-recipe: DSP cost, level-match dB, test-import pass, model-ID validation, source tier, attribution confidence. Publish the spec *and* the current failure rate. Small catalogue is an advantage here and nowhere else.

**6. Enter Katana free, with the one thing the amp can't do.** Dotted-eighth delay and ambient swells. Name-building in the biggest cheap room. No pricing experiment attached.

**7. Run the request queue as the demand oracle.** In a market with no survey data, revealed preference from real requests beats every research doc we have — including this one.

---

## 7. The constraint that governs all of it

Our verification claim must stay inside what we can actually do. There is no human plugging into a Helix here, and the honest-authorship rules correctly ban implying otherwise. So "verified" must mean the machine-executable set — test-import, DSP budget, level measurement, model-ID resolution, source tier, attribution confidence — stated precisely, with the gaps named.

That is not a weakness in the position. **"AI-assisted, and here is exactly what we checked and exactly what we didn't"** is a costly, checkable, falsifiable signal in a market where every competitor's claim is unfalsifiable. "Hardware-tested" would be a cheap lie that hands back the only advantage we have.

The market is drowning in confident, unverifiable answers. Being the one source that publishes its own defect rate is a smaller business than the one we sketched in March, and a far more defensible one.
