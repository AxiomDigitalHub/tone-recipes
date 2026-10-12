# NAM (Neural Amp Modeler) — What It Is and What We Should Do About It

**Created:** 2026-08-15
**Status:** Research + recommendation. No build committed yet.
**Related:** `TARGET_SEGMENT_AND_SEO_STRATEGY.md`, `TONETRACE_ROADMAP.md`, `AI_TRANSPARENCY_STRATEGY.md`, `docs/research/MOAT_AND_CLONING_THREAT_2026-07.md`

---

## TL;DR

NAM is becoming the MP3 of amp captures — open, free, format-portable, and as of A2 (June 2026) cheap enough to run on a $3 ARM chip. The traction is real and it is not going away.

But we should **not** get into the capture business, and NAM is **not** an addition to our Helix line. Three facts set the whole strategy:

1. **Line 6 does not support NAM**, and shipped a competing proprietary system (Proxy) instead. Our primary ICP literally cannot load a NAM file.
2. **Making captures requires physical amps.** We don't have them, and 10,000+ free captures already exist.
3. **NAM's actual pain is curation, not supply.** Nobody maps a capture to *a song*. That is precisely our existing muscle.

**Recommendation: build the layer that tells people which capture to load and what to put around it. Start with content, then a `nam` pointer platform. Treat capturing our own Helix presets as a separate, legally-gated decision.**

---

## 1. What actually happened

| | |
|---|---|
| **NAM A1** | Open-source neural amp capture by Steve Atkinson. Free plugin, free trainer, community library. Great sound, heavy CPU — DAW-only in practice. |
| **NAM A2** (2 June 2026) | Built by TONE3000 with Atkinson. 30–40% less CPU than A1 at *better* fidelity. Fully open source — architecture, training code, and inference engine are free to use, modify, and **commercialize**. |
| **The unlock** | One `.nam` file now contains two resolutions: **A2-Full** (DAW / high-power hardware) and **A2-Lite** (same capture, runs at 50% CPU on a $3 600MHz Cortex-M7). One file, every device. |
| **Why it matters** | That killed the porting cost. A dozen manufacturers added native NAM at once instead of one at a time. It beat several commercial systems in a blind listening test. It is free. |

### Who supports it (Aug 2026)

- **A2-Full:** Dimehead NAM Player, Darkglass Anagram, Sonulab Stompstation Pro, HeadRush Prime / Core / Flex (v5.1)
- **A2-Lite:** Mooer GE300 / GE1000 / GS1000, Hotone Ampero II, NUX MG-30 / MG-400 / MG-300 MkII, Valeton GP (Aug 2026)
- **Also announced:** Blackstar, Lava Music, Chaos Audio
- **Software:** Gateway plugin (free, VST3/AU, loads A1 + A2)
- **Not supported:** **Line 6 Helix / HX Stomp / Stadium**, Quad Cortex, Fractal, Kemper, TONEX

### The Line 6 problem — read this carefully

Line 6 shipped **Proxy** on Helix Stadium: cloud-based capture where you sweep locally, the cloud trains, and it syncs back. It is deliberately tuned to Stadium hardware, which they argue beats NAM's have-to-run-anywhere constraint. Public line on NAM compatibility is *"a maybe — let Proxy run its course first."*

Translation: **Line 6 has a competing format and a reason to stall.** Do not plan around Helix gaining NAM. If it lands, it's upside, not a dependency.

---

## 2. Where we actually have leverage

Our assets are song-level tone knowledge, a translation layer across 7 platforms, a curation/QC system, and a content pipeline. Our non-assets are an amp collection and a capture rig for real gear.

NAM's shape maps onto that almost perfectly, because **the library is huge and unsorted**. 10,000+ community captures, quality varying enormously, organized by *gear* — "Marshall JCM800", "ProCo Rat" — and never by *song*. A worship guitarist who wants the Hillsong lead sound has no path from "the sound in my head" to "this specific file out of 10,000."

That gap is the whole opportunity. It is a data and curation problem, which is what we are, not a hardware problem, which is what we aren't.

---

## 3. The three plays, ranked

### Play 1 — Add `nam` as a 7th platform translation (do this first)

A NAM translation is not a preset file. It's a **pointer**: which specific TONE3000 capture to load, plus the surrounding chain (drive / delay / reverb / EQ) and settings.

**We already built this machinery.** `src/lib/recipe-verification.ts:417` defines `POINTER_PLATFORMS = ["tonex", "kemper", "fractal"]` — platforms we translate but emit no file for, with honest "nothing was built or checked for this" disclosure already wired into `notChecked`. And `src/lib/data/index.ts` already emits exactly this shape for TONEX (`"Search ToneNET for 'TS808' (Tone Model capture)"`). NAM slots in identically:

- `Platform` union in `src/types/recipe.ts:75` → add `"nam"`
- `POINTER_PLATFORMS` → add `"nam"`
- `platformLabel()` → `nam: "NAM"`
- `PLATFORMS` in `src/lib/constants.ts` → add entry
- `DISPLAYED_PLATFORM_IDS` → decide whether to surface it (currently only pedalboard / helix / katana are displayed)

**Cost:** roughly the same as adding TONEX was. **Reach:** every NAM-capable device at once — HeadRush, Mooer, Hotone, NUX, Darkglass, Dimehead, Blackstar, Lava — *plus* every DAW user with the free Gateway plugin. Best reach-per-unit-of-work available to us right now.

### Play 2 — Own the budget NAM-capable multi-FX segment

Look at the A2-Lite device list again: Mooer GE300, Hotone Ampero II, NUX MG-30, Valeton GP. That is **the same player as our declared secondary ICP** — the Boss Katana intermediate. We already chose that segment because it's a large audience with *no premium content ecosystem* (Worship Tutorials and Tone Junkie both ignore it). The NAM budget-pedal tier has the identical property, and now has a free universal tone format on top.

The SEO is virgin. `worship tone NAM`, `NAM captures for [song]`, `best NAM capture for [amp]`, `does the Helix support NAM` — no incumbent. Tone Junkie and Worship Tutorials are Helix/QC shops; TONE3000 itself organizes by gear, not song or genre.

This does **not** dilute the Helix ICP. It extends the *secondary* lane we already picked, using content we already generate.

### Play 3 — Capture our own Helix presets as NAM files (needs a legal read first)

The interesting one. **The capture rig already exists and costs nothing.**

Helix LT is a multi-channel USB interface with native reamping: set a preset's input block to USB 3/4, record the return on USB 1/2 in the DAW (Sweetwater documents this workflow). Run TONE3000's capture sweep through one of our Helix presets, upload, get a `.nam` back from the free cloud trainer. No interface, no reamp box, no amps, no new spend.

That converts our 50 existing Helix recipes into NAM captures playable on every NAM device — a genuinely differentiated product, since nobody is publishing song-targeted worship captures.

**It also solves a positioning problem.** Every recipe page currently carries: *"Nobody played this through a real amp. There is no human listening test behind any number on this page."* A NAM capture is a physically-measured artifact of a real signal path. It would be the first thing on the site with a legitimate **measured, not generated** claim — a real asset given the AI-transparency posture.

**But three risks, and the first is a hard gate:**

1. **Legal / EULA grey zone — resolve before shipping anything.** Capturing a Line 6 modeled amp (itself a model of a Fender or Marshall) and selling the result implicates both the Line 6 EULA and third-party trademark. This is contested territory across the whole capture industry. Get a read *before* the work, not after.
2. **Copy discipline.** The honest claim is *"captured from our Helix preset."* It is **not** *"captured from a 1965 Deluxe Reverb."* Getting sloppy here would torch the transparency position that took us a year to build — worse than not shipping.
3. **It's manual labor.** ~5–10 min per capture, not automatable. 50 recipes ≈ 1–2 days of real work.

---

## 4. What not to do

- **Don't build a capture business against physical amps.** No collection, no advantage, 10,000+ free captures already exist. We'd lose on supply and have nothing left over.
- **Don't pivot the Helix roadmap toward NAM.** Line 6 can't load it and has a competing format. Our primary ICP is unaffected by any of this.
- **Don't build a public product on the TONE3000 Search API.** The free tier is explicitly non-commercial and `/tones/search` is "heavily rate-limited by default"; commercial use requires a signed agreement reviewed by TONE3000 before public launch, and rate limits start at 100 req/min. Use the **Select OAuth flow** (their hosted browser, zero auth UI to build) or plain deep links to tone pages. If we ever want real search, open the commercial conversation first.
- **Don't redistribute community capture files.** Point to them. Ownership and licensing on user uploads is not clearly documented, and linking costs us nothing.

---

## 5. Suggested sequence

**Now (this week, near-zero cost) — content beachhead.** Test demand before building anything. Three or four posts through the existing daily pipeline:

- *"Does the Line 6 Helix support NAM?"* — our own audience is actively asking this; the Line 6 forum thread is live and unanswered. High intent, we're the natural answerer, and it converts a NAM searcher into a Helix-content reader.
- *"NAM A2 vs TONEX vs Kemper: what actually changed in 2026"*
- *"Free NAM captures for worship tone"* — the Play 2 wedge
- *"What NAM A2 means if you're on a budget multi-FX"* — Mooer / NUX / Hotone / Ampero

**Next (small build).** Add `nam` as a pointer platform. Backfill the top ~20 worship recipes with capture pointers + surrounding chain. Measure whether the NAM posts pull traffic before backfilling all 50.

**Then (gated).** Legal read on Play 3. If clear, prototype **three** captures from existing Helix presets, publish free, and measure download and referral behavior before committing to the full 50.

---

## 6. Open questions

- Line 6's actual position on NAM support — worth watching the Stadium firmware notes each release.
- Licensing terms on TONE3000 user-uploaded captures (redistribution, commercial packs) — undocumented publicly; ask support directly if Play 2 grows.
- Whether the NAM audience overlaps our worship ICP at all, or is a distinct (metal/bedroom-producer) crowd. **The content beachhead is designed to answer exactly this before we spend build time.**

---

## Sources

- [NAM A2 announcement — TONE3000](https://www.tone3000.com/blog/introducing-neural-amp-modeler-nam-architecture-2-a2)
- [NAM A2 hardware & software support guide — Gearnews](https://www.gearnews.com/neural-amp-modeler-guide-guitar/)
- [TONE3000 A2 blind listening test coverage — Guitar World](https://www.guitarworld.com/gear/amp-modeler-pedals/tone3000-nam-architecture-2)
- [TONE3000 API documentation](https://www.tone3000.com/api) · [example repo](https://github.com/tone-3000/api)
- [Helix Stadium Proxy vs. the capture arms race](https://ilikekillnerds.com/2026/03/07/helix-stadium-proxy-might-be-smarter-than-the-capture-arms-race/)
- [Line 6 forum: native NAM A2 + TONE3000 API support for Helix/HX?](https://line6.com/support/topic/72032-future-native-nam-a2-tone3000-api-support-for-helixhx-family/)
- [Re-amping with Line 6 Helix — Sweetwater](https://www.sweetwater.com/insync/re-amping-with-line-6-helix/)
- [TONE3000 capture instructions](https://www.tone3000.com/capture/instructions)
- [neural-amp-modeler on GitHub](https://github.com/sdatkinson/neural-amp-modeler)
