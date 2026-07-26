# The Moat & The Cloning Threat — Where Tone Acquisition Goes by Mid-2028

**Date:** 2026-07-25
**Author:** strategy research pass (web + internal corpus)
**Question asked:** the preset file is depreciating toward free. Where does this market go in 24 months, and what is actually defensible?
**Status:** research memo. Not committed. Supersedes the "cross-platform + recipes = moat" framing in `COMPETITIVE_TEARDOWN.md` (Apr 2026) and the build plan in `TONETRACE_ROADMAP.md` (Apr 2026).

> **Warning to the reader:** this document reaches two conclusions that contradict standing plans. (1) Cross-platform coverage is no longer a differentiator — it is table stakes, and our competitors already have it. (2) ToneTrace as specified should not be built. Both are argued from evidence below. If you disagree, argue with §2 and §6, not with the summary.

---

## 0. The five facts that changed the board

Everything in this memo follows from five things that shipped between September 2025 and June 2026. They are worth stating flatly before any analysis.

| # | Event | Date | Why it matters |
|---|---|---|---|
| 1 | **NAM Architecture 2 (A2)** — MIT-licensed, free-for-commercial-use capture engine. TONE3000's own benchmark ranks it above Neural DSP V2, IK ToneX V2 and Line 6 Proxy on ESR/Elo and in a 1,000-participant / 100,000-rating MUSHRA test; A2-Lite runs at 50% CPU on a **$3 ARM Cortex-M7**. Shipping or committed in Blackstar (Beam Mini), Darkglass Anagram, HeadRush Prime/Core/Flex (summer 2026), Dimehead, Lava, Chaos Audio, Sonulab. | 2026-06-02 | Capture quality is now a **free, open-source, embeddable component**. Nobody can charge for capture fidelity again. *(Caveat: the comparative numbers are a vendor benchmark of its own product, unreplicated by any third party. The commoditization conclusion does not depend on A2 actually winning — only on it being free, good enough, and adopted.)* |
| 2 | **Every major vendor shipped a capture upgrade in the same three quarters** — Neural Capture V2 (2025-11-26, moved to Cortex Cloud), Kemper Profiling 2.0 / OS 14.0 (2026-03-05, profile *creation* pushed down to the cheap Player), Line 6 Proxy (2026-03-24, cloud-trained), TONEX Modeler standalone (2025-08-29, local GPU training up to 87% faster, ~2 min). | Nov 2025 – Jun 2026 | Capture is table stakes on every platform simultaneously. There is no capture-quality market position left to take. Note that **Line 6 and Neural DSP both moved training into their own clouds** — capture became a service feature of owning the device. |
| 3 | **Positive Grid BIAS X** ships *Music-To-Tone* (drop in a song → AI reconstructs a matching preset) and conversational text-to-tone, $149, trained on "over a million tones." | 2025-09-26 | **This is ToneTrace's product, shipped, by a company with distribution.** |
| 4 | **A cohort of free AI preset generators emits real `.hlx` files** — ToneBuilder.ai, PatchMint Studio, DialMyTone, HelAIx, StompBox.ai, ai-tone.tech — plus a custom GPT posted *on Line 6's own forum* (2026-05-01) that produces importable Helix presets. | 2025–2026 | Generating a plausible signal chain costs ~$0. Any business whose product is "a plausible signal chain" is already dead. |
| 5 | **Helix Stadium "Showcase"** (firmware 1.2) is an on-device live automation engine: a *Song* holds audio tracks plus flags that **automate preset and snapshot recall, looper functions, MIDI, and tempo sync** along a timeline. | 2025–2026 | Line 6 built the **execution surface for song-level tone maps**. The player exists. **Nobody has built the library.** |

Fact 5 is the one nobody is talking about, and it is the most important thing in this document.

---

## 1. The 24-month market thesis: what tone acquisition looks like in mid-2028

**Tone acquisition splits into three layers. Two of them are worth $0. One of them is the entire business.**

### Layer 1 — The model/capture layer → free, open, embedded (already there)

By mid-2028, a "capture" is a commodity component in the same way an MP3 decoder is. A2 is MIT-licensed, at minimum competitive with every proprietary engine, and runs on hardware that costs less than a pack of picks. TONE3000 hosts free tones at a scale it reports inconsistently (its own FAQ says 100K+; press coverage says 350,000+ — **do not cite a precise figure**), and is being integrated *directly into hardware browse-and-load UIs* — Blackstar's Beam Mini ships with native NAM, Darkglass Anagram runs A2-Full, HeadRush adds it across Prime/Core/Flex in summer 2026, and Sonulab's StompStation browses TONE3000 in-device. Line 6 and Neural DSP both moved capture training into their own clouds, which makes capture a *service feature of owning the device*, not a product you buy.

Note the one structural counter-current: **Line 6 and Neural DSP do not support NAM.** Proxy clones are Stadium-only and Quad Cortex captures remain a closed format. So there are two futures fighting: an open commodity layer (A2 + TONE3000 + budget hardware) and closed cloud gardens (Proxy, Cortex Cloud). **Either way the capture is free to the guitarist** — the fight is over who owns the account, not over who charges for the file. That distinction matters for us: it means the durable scarcity is never in the artifact, it is in the relationship and the knowledge.

Prediction for mid-2028: every modeler above ~$400 captures; captures are browsed and loaded from a free cloud inside the device; nobody sells a capture as a standalone product except as a bundled convenience. **The residual paid capture market is a curation and packaging business, not a technology business.**

### Layer 2 — The generation layer → free, abundant, and unverifiable

Text-to-tone and audio-to-tone both shipped in 2025–26. The interesting fact is not that they exist but that **not one of them has a review, a benchmark, or any public accuracy claim.** The KVR review of BIAS X — the most credible implementation, from the vendor with the largest tone dataset — describes text-to-tone as "hit and miss," notes isolated guitar tracks give the best results, and concludes the AI is "a launch pad… rather than a final destination."

By 2028, generation will be better and *completely free*. It will also still be unverifiable at the point of use, because the entire failure mode of a generated preset is that it sounds fine in the demo and wrong in the room. Generation floods the world with plausible artifacts whose quality cannot be assessed without plugging in.

**This is not a tragedy. It is the whole opportunity.** Abundance of unverified artifacts makes verification the scarce good. (This is exactly what happened in photography: AI editing cut post-production 80–90% and 68% of pro wedding/portrait photographers adopted AI culling/editing by early 2026 — and the surviving paid preset business is explicitly sold on *consistency across conditions*, i.e. verification, not on the files.)

### Layer 3 — The deployment/verification layer → scarce, and getting scarcer

Two questions survive the flood, and no amount of model improvement answers either:

1. **"Did this actually work?"** — on real hardware, at real volume, in a real room, on current firmware. A language model cannot plug into a Helix. This is a physical-world claim, and physical-world claims are the only claims that stay expensive.
2. **"What do I load, and when?"** — for the specific 5 songs I have to play on Sunday, on the rig I actually own, with the switching I can execute with my feet while singing.

Question 2 now has a **first-party execution surface**: Showcase recalls presets and snapshots against a song timeline. Whoever supplies the per-song, per-section tone data becomes the content layer for a hardware automation platform. That is a structurally better position than "preset store."

### The one-line thesis

> **By mid-2028, the tone file is free, the tone *idea* is free, and the only things anyone pays for are (a) evidence that a tone was actually verified, and (b) a compiled, deployable answer to "what do I load for this setlist." F&K is currently structured to sell the two things going to zero and gives away the two things that appreciate.**

---

## 1.5 The technical floor: what capture provably cannot do

This section exists because the whole thesis rests on it. If capture technology can eventually absorb arrangement, the strategy below is wrong. It can't, and here is why — stated precisely, because the loose version of this argument is refutable and we should not ship a refutable argument.

**The common formulation — "captures are static snapshots that don't capture playing dynamics" — is wrong on the dynamics clause and should not be used.** Captures *do* respond to picking force and guitar volume: a nonlinear network's output depends on input amplitude, and Neural Capture V2 was built specifically to capture "the dynamic cleanup behavior of a vintage fuzz, the natural bloom of a sagging power amp." Saying otherwise gets us correctly dunked on by anyone who has used one.

The defensible version, in three parts:

**(a) Captures respond to what your hands do to the *strings*, not to what your hands do to the device's *controls*.**
A capture block's gain/EQ/level knobs are post-processing on the network's output — they do not drive virtual preamp tubes harder. Vendors concede this in their own marketing: Kemper, selling Liquid Profiling, describes its own pre-Liquid product as giving "a generalized amp EQ for further tweaking" where "tonal subtleties of increased or decreased levels of gain were not completely authentic," and frames Liquid as making a profile "interactive rather than remaining a static capture."

**Kemper is the only vendor that has shipped a partial fix**, and its limits are instructive: Liquid Profiling grafts one of 40 pre-modelled amps' real tone-stack and gain-stage topology onto your profile, using a rising-amplitude training signal so Gain can be interpolated. It covers Gain/Bass/Mid/Treble/Presence only, not power-amp/speaker interaction, and retrofitting an old profile **requires knowing the exact knob positions used when it was made**. NAM, ToneX, Neural Capture and Proxy have shipped nothing equivalent. So: one capture ≈ one knob setting, everywhere except a partial exception on one closed platform.

**(b) Time-based effects are excluded by architecture, not by product decision.**
Line 6's manual instructs users to keep compression, modulation and time-based effects out of the signal path and to disable the amp's onboard reverb/tremolo. Neural Capture V2's supported list is amps, cabs, drives, fuzzes, compressors. A2's is amps, cabs, pedals, pedal chains, outboard, signal chains. None include delay, reverb, or modulation.

The reason is a hard ceiling: these are causal nonlinear networks with a **finite receptive field — A2's is ~6,350 samples ≈ 132 ms at 48 kHz**, already ~50% larger than A1. A network that can only see 132 ms of history cannot represent a 400 ms delay repeat, a reverb tail, or an LFO whose period exceeds its memory. The corroborating tell: Neural DSP admits accuracy degrades on *compressors* with long release times — the same wall, seen from the near side. This is not a tuning problem that more compute fixes.

**(c) Capture has largely solved *interaction*. It has made essentially zero progress on *arrangement*.**
Interaction — how a drive pedal loads an amp's input, how a power amp sags — is genuinely captured now. Proxy's Amp+Cab mode includes drive pedals in front of the amp; A2 claims full pedal chains including octave fuzzes; ToneX captures whole rigs. But every one of these freezes the chain into **one opaque, unreorderable, mono block of time-invariant elements**. You cannot change the drive's level, move it, bypass it, or add the delay. Proxy caps you at four mono clone blocks per preset. A second sound requires a second capture.

**And nothing on the market captures parameter automation, snapshot/scene changes, or which tone belongs to which part of a song.**

**The industry has already conceded this, and its concession is the best evidence in this document.** IK Multimedia draws the line explicitly in its own product copy: *"A TONEX **Tone Model** captures the exact sound of a specific amp, pedal, or rig. A TONEX **preset** combines that Tone Model with effects, routing, and settings to create a fully playable sound."* Having drawn that line, IK's response was not better capture — it was to launch a **separate distribution layer** (ToneNET preset sharing, 2026-04-02) and to make it browsable **by song, artist, genre and playing style**, because the capture carries none of that. Line 6's response was the same shape: clones ship inside CustomTone presets.

> **Every major vendor's 2026 answer to the arrangement problem was to ship a preset marketplace, not a better capture.** That is the market telling us, in unison, where the unsolved problem is — and none of them has solved the marketplace's actual hard part, which is knowing which of the fifty tones is right for the bridge.

---

## 2. What depreciates to zero vs. what appreciates

### Depreciating to zero

| Asset | Status | Evidence |
|---|---|---|
| **The preset file (.hlx)** | Already free at the margin | CustomTone (tens of thousands, now including Stadium presets *and* Proxy clones), Cortex Cloud, ToneNET, Rig Exchange, AxeChange |
| **Captures / profiles / IRs** | Free and at least competitive with paid | NAM A2 MIT-licensed and embedded in shipping hardware; six-figure free tone library on TONE3000; every platform now captures natively |
| **"A plausible signal chain for song X"** | ~$0 marginal cost | 6+ shipped AI preset generators; BIAS X; custom GPTs |
| **Cross-platform coverage** | **Commoditized — this is a loss for us** | Signal Theory (Worship Tutorials' tone arm) now covers Line 6 Stadium+Proxy, HX/Helix/Stomp/POD Go, Fractal, TONEX, Kemper. Tone Junkie: 5 platforms. LivePlayRock: 8. ChopTones: 9+. |
| **Generic tone education** | Answered free by any LLM | "what does a compressor do before vs after distortion" is a solved query |
| **SEO organic traffic as a growth engine** | Structurally declining | AI Overviews cut top-rank CTR ~58%; publisher organic erosion widely reported at 30–40%; Nieman Lab (Jul 2026) documents publishers considering opting out of Google entirely |
| **Recipe/post *volume* as a quality signal** | Actively a liability | Google's scaled-content-abuse policy; our own Non-Commodity Gate exists because of this |

**The uncomfortable one:** cross-platform translation was claimed as F&K differentiator #2 in `COMPETITIVE_TEARDOWN.md`. It isn't one anymore. The dominant worship vendor rebuilt itself as a five-platform capture-and-preset shop between April and July 2026. Keep the translations because the promise is made and they cost little; **stop selling them as the reason to choose us.**

### Appreciating

| Asset | Why it appreciates |
|---|---|
| **Verified-on-hardware provenance** | The only claim a generator structurally cannot make. Value rises in direct proportion to how much unverified content exists — i.e. fast. |
| **A public correction record** | 23 public corrections + the `/experiment` log. In a market where everyone's content is AI-assisted and nobody admits it, being the party that publishes its own errors is a rare, checkable trust signal. |
| **Song→section→snapshot maps (structured, timeline-addressable)** | Has a first-party execution surface (Showcase) and no supplier. |
| **Set/setlist compilation as *software*** | Solves the recurring, deadline-driven job. Not solved by anyone. Not solvable by a file. |
| **The corpus *as machine-readable supply*** | Agents will fetch and act. Being fetchable, structured, and correct is a supply position, not a traffic position. |
| **Discipline artifacts (RECIPE_STANDARD + audit script)** | The corpus is replaceable; the *process that keeps 195/195 recipes clean against a written, machine-checked spec* is not. This is what makes the data usable by machines instead of being 195 blog posts. |

---

## 3. Threat matrix

Six threats. The brief asked for five; the sixth is the one I think is most underrated and it isn't in the brief.

---

### T1 — Line 6 ships a first-party song/setlist tone service

**Likelihood: MEDIUM-HIGH (~55% by mid-2028) · Timeline: 12–30 months · Severity if it lands: HIGH**

They already have every component except content:
- Cloud infrastructure and account system (Proxy training is server-side and requires a Line6.com login)
- A distribution surface (CustomTone, now carrying Stadium presets *and* clones)
- **An execution engine (Showcase) that automates preset and snapshot recall along a song timeline** — the exact runtime for the product we want to sell
- A commercial channel (Line 6 Marketplace with existing partners: Sadites, Fremen, ChopTones, Glenn DeLaune, Celestion, 3 Sigma, OwnHammer)

What they lack is editorial and licensing: per-song tone data at scale, and the appetite to make musical claims about copyrighted songs. Hardware manufacturers historically avoid this and push it to partners. **The most likely form is therefore a Showcase content partner program, not a first-party editorial product** — which is an *opportunity* for us, not a death sentence, provided we are early.

Evidence that the partner path is the live one: a third-party Proxy market formed within weeks of the feature shipping. Signal Theory Audio's *Proxy Amp Collection 2* — 14 amp+cab clones (1964 AC30 Top Boost, 1967 Vibrolux, Matchless Chieftain) — sells at **$29.99**, with reviews dated April–July 2026, and Glenn DeLaune is selling Stadium presets and Proxy clones too. Line 6 built the engine and let partners monetize it. There is no reason to expect a different pattern for Showcase.

**The mitigating structural fact:** Proxy and Showcase are **Stadium-only** ($1,799.99 Floor / $2,199.99 XL). Our ICP — the volunteer worship guitarist on a Helix Floor/LT, HX Stomp, or POD Go — does not get either, and older Helix prices have *dropped* since Stadium launched, which is pushing more budget players onto exactly the hardware we serve. Our window is roughly as wide as Stadium's adoption curve among volunteers: call it 24–36 months, not indefinite.

**Early warning signals (quarterly):**
- `line6.com/customtone/` gains a Song / Showcase category, or a "Songs" filter
- Line 6 announces Showcase content partners, or publishes a Showcase song file format/spec
- Marketplace listings for "Songs" or setlist products
- Showcase or Proxy backported to Helix Floor/LT/HX Stomp (would collapse our window fast)
- Yamaha Guitar Group hiring for content/licensing/music-data roles

**Counter:** do not fight the platform — **become its best supplier.** Publish for the Showcase song format the week it opens. Our corpus is already the closest thing in existence to a Showcase content library. Second counter: keep our centre of gravity on the legacy Helix/HX Stomp install base, which is growing on the used market and is structurally excluded from Stadium features.

---

### T2 — Worship Tutorials / Signal Theory adds a setlist compiler

**Likelihood: MEDIUM (~40%) · Timeline: 12–24 months · Severity: HIGH (they own the audience)**

They have already done the hard strategic move: split the tone business into **Signal Theory Audio**, gone fully cross-platform (Line 6 Stadium + Proxy, HX line, Fractal, TONEX, Kemper — explicitly *not* Quad Cortex or HeadRush), started selling Proxy Amp Collections for Stadium, and kept the subscription (**Tone Pass 2026 at $249.99/yr for "at least 14" tone-match patches**, plus 3 catalog presets and 50% off other 2026 releases; site claims 970,000+ downloads).

Two readings of that price. Our April 2026 teardown recorded Tone Pass at **$319.99/yr with a minimum of 16 patches**; it is now **$249.99 with a minimum of 14**. That is ~22% less money for ~12% less content. It may be a promotion — but the direction (down on price, down on commitment, up on platform breadth) is what a saturating market looks like from the inside. **Treat as a signal, verify next quarter.**

What they still do not have: a structured per-song database. Their product is a file plus a YouTube video. A setlist compiler is a software and data discipline, not a preset-making discipline, and their entire operating muscle is video-and-file.

**Early warning signals:**
- `signaltheoryaudio.com` or `worshiptutorials.com` ships anything named "setlist," "song planner," or "service builder"
- A Worship Tutorials app, or a Planning Center / MultiTracks integration
- Software engineering job posts
- Tone Pass 2027 pricing and patch commitment (compare to $249.99/14)

**Counter:** ship set compilation as **software with an API**, not as a PDF. Our current Setlist Mapper is a PDF — and a PDF is copyable in a weekend by anyone with a YouTube channel. The defensible object is the per-song database and the compiler that reads it, not the document it renders.

---

### T3 — A general AI assistant just answers the question well enough

**Likelihood: ~85% — it is already happening · Timeline: now, worsening through 2028 · Severity: HIGH for traffic, LOW for product**

This is misframed as a content-quality threat. It isn't. The assistant will answer "how do I get the Elevation lead tone on Helix" whether or not our answer is better, and increasingly it will answer it *using our page* without sending the reader. AI Overviews cut top-rank CTR by ~58%; organic erosion of 30–40% is the reported norm; ChatGPT is ~92% of AI referral traffic and its retrieval leans on Bing.

There is no counter that preserves the traffic. There are only three counters that preserve the *business*:

1. **Be the cited source** — Bing top-20 retrievability, substantive freshness, answer block in the top third. Already the playbook; keep executing; do not expect it to replace lost clicks.
2. **Own a transaction the assistant cannot complete** — a compiled artifact, an account, a device-ready file. An answer is free; a loadable compiled set is not.
3. **Own the verification the model cannot fabricate** — the model can restate our settings; it cannot claim it tested them.

**Say it plainly: SEO traffic is not F&K's growth engine in 2028.** It works today. Keep it, harvest it, and stop building strategy on it.

---

### T4 — TONE3000 / ToneNET adds curation

**Likelihood of *any* curation: HIGH. Likelihood of *good* curation: MEDIUM-LOW (~30%) · Timeline: 12–24 months · Severity: MEDIUM**

The underrated half of this threat already landed: **ToneNET's April 2026 preset-sharing launch (TONEX v1.11.0, free) lets users upload and browse *full-rig* presets — Tone Model plus effects, routing and settings — indexed by song, artist, genre, and playing style.** IK's own framing is that users can now jump "straight into performance-ready rigs inspired by their favorite music." That is IK indexing tone along the *musical* axis, which is the axis we thought was ours, backed by a hardware install base and official Tone Partners. TONE3000 meanwhile has an API, verified-creator leaderboards, comments, and in-device integrations.

Two things blunt it. ToneNET is locked to the IK ecosystem, so it cannot serve the Helix/HX Stomp player who is our ICP. And its unit is still a preset — one sound — not a song map: it tells you which rig, never which rig *when*.

Why I still rate good curation as unlikely: community platforms are incentivized on upload volume, and the quality complaints are already there in the open ("super boxy sounding and lose the picking definition"). Curation requires someone to say *no*, and free-upload platforms structurally cannot.

**Early warning signals:**
- ToneNET adds verified/official/"as played on" badges or curated per-song collections
- TONE3000 ships ratings, editorial collections, or a paid tier (**any paid tier on a free platform is a major signal — it means they found value worth charging for**)
- Either publishes song-level metadata in their API

**Counter:** move one level up the stack. Our unit is not "which capture" — it is "which chain, at which moment, on which rig." A file-sharing site cannot follow there because the answer isn't a file.

---

### T5 — An AI agent generates presets on demand, for free

**Likelihood: 100% — this has already happened · Timeline: now · Severity: HIGH for preset sales, LOW for us if we reposition**

Shipped and free: ToneBuilder.ai, PatchMint Studio, DialMyTone, HelAIx, StompBox.ai, ai-tone.tech, plus a custom GPT on Line 6's own support forum (2026-05-01) that emits importable `.hlx` files, plus BIAS X's Music-To-Tone and text-to-tone since 2025-09-26.

What none of them have: a single review, benchmark, or accuracy claim. Not one. Even the tool's own author frames it as "a fast creative starting point, then fine-tuning by ear."

**Counter — and this is the pivot of the whole memo:** stop competing on generation. Compete on **verification**. Generation going to zero is not a threat to a verification business; it is the demand-creation event for one. The more plausible-but-unverified presets exist, the more a checkable "we plugged this in, on this firmware, on this date, and here is what we got wrong last time" is worth.

---

### T6 — MultiTracks.com deepens guitar tone *(not in the brief; I think it's the most dangerous)*

**Likelihood: ~60% · Timeline: 12–24 months · Severity: SEVERE for the worship ICP**

MultiTracks already sells **song-specific Helix and HX Stomp presets** (e.g. Tyler Logan's *Helix Song-Specific Patches Volume 1*), Kemper profiles, and artist patches with worship-guitarist partnerships including Nigel Hendroff and Brian Carl. They also own **the setlist itself** — charts, RehearsalMix, original master stems, and the workflow a worship team already lives inside every week.

Everyone else on this list has to *acquire* the worship guitarist and *learn* the setlist. MultiTracks has both already. The only thing they lack is catalog depth on guitar tone — which is the cheapest gap on this entire list to close, and the one an incumbent closes by writing a check.

**Early warning signals:**
- MultiTracks adds a guitar-tone browse axis, a "patches for this setlist" bundle, or a Helix/HX section at the setlist level
- Any acquisition of a preset vendor by MultiTracks, Planning Center, or a worship-media parent
- Planning Center Services surfacing instrument-patch metadata

**Counter:** two options and they are not exclusive. (1) **Be the supply** — get indexed by / partner with the setlist owner rather than competing for the setlist relationship. (2) **Own what they won't** — non-CCLI and non-worship repertoire, the HX Stomp/POD Go budget tier, older gear, and the "I have to figure this out myself" long tail. Do not bet the company on out-worshipping MultiTracks.

---

### Threat summary

| # | Threat | Likelihood | Timeline | Severity | Our leverage |
|---|---|---|---|---|---|
| T5 | Free AI preset generation | **Already happened** | Now | High → Low if repositioned | Reposition to verification |
| T3 | AI assistants answer directly | ~85% | Now → 2028 | High (traffic) | Citation + transaction + verification |
| T6 | MultiTracks deepens guitar tone | ~60% | 12–24 mo | **Severe** | Be supply, or own the tail |
| T1 | Line 6 first-party song service | ~55% | 12–30 mo | High | Be the Showcase content supplier |
| T2 | Signal Theory ships a setlist compiler | ~40% | 12–24 mo | High | Ship the compiler first, as software |
| T4 | TONE3000/ToneNET curation | ~30% (good) | 12–24 mo | Medium | Move up the stack |

---

## 4. Defensibility ranking of F&K's assets

Ranked most → least defensible. "Defensible" = hard to replicate *even by someone with money, an audience, and an LLM*.

---

**1. The recipe corpus's *structure and enforcement discipline* — `RECIPE_STANDARD.md` + `audit-recipes.mts` (195/195 clean)**

Not defensible because 195 recipes is a lot — it isn't; an LLM could emit 195 plausible recipes tonight and six startups already are. Defensible because a **written, versioned, machine-checked spec that every recipe passes** is an operating system for producing consistently *addressable* data, and that is what makes the corpus usable as machine input rather than as prose. It is what turns "we have content" into "we have a data product that can compile into a Showcase song, an agent tool response, or a set."

**Load-bearing caveat:** structure without verification is worthless. A perfectly-schema'd corpus of unverified AI output is worth exactly what free generator output is worth. **This asset's defensibility is entirely contingent on asset #2.**

---

**2. Verification: the honesty/corrections record (23 public corrections, `/experiment`, hardware testing)**

Ranked second not because it is currently strong — it is thin and mostly narrative — but because it is the **only asset on this list whose value is rising because of the threats**, and because no competitor can retroactively acquire it. A correction ledger is a time-series; you cannot buy one.

Today it is a trust asset with no revenue attached. That is the gap to close. Turn it into a *field* (verified\_on / firmware / by / what changed) rather than a *page*, and the corpus stops being commodity output.

---

**3. Set compilation — the song→snapshot map**

Highest upside on the list, currently the weakest packaging. It is the only asset that has (i) a first-party execution surface being built for it (Showcase automates preset and snapshot recall on a timeline), (ii) no supplier, and (iii) a recurring, deadline-driven purchase trigger (Tuesday setlist → Sunday service).

**But the Setlist Mapper is a PDF, and a PDF is not defensible.** Any YouTuber can produce a song→snapshot table in a weekend. The defensible object is the **database plus the compiler**. Rank 3 as packaged; rank 1 if rebuilt as software.

---

**4. Brand ("Researched by AI, verified by guitarists")**

Real, distinctive, small. Its only genuinely differentiated claim is the honesty positioning — which means the brand is a *derivative* of asset #2, not an independent moat. If verification lapses, the brand is a preset site with a nice name.

---

**5. SEO / AI-citation position**

The current traffic engine, structurally depreciating (T3), and pointed at the wrong audience by its own admission (top query "best frfr for quad cortex," an off-ICP page). Worth maintaining as a **distribution channel**; not worth defending as a moat, and not a base to build 2028 strategy on. The fan-out dynamic genuinely favors our long tail — that's a real tailwind on a shrinking channel.

---

**6. Cross-platform matrix**

**Commoditized.** Signal Theory, Tone Junkie, ChopTones, and LivePlayRock all ship 5–9 platforms. Keep the translations (promise made, low cost, completes the recipe). Stop marketing it. Stop spending net-new effort on Quad Cortex — already decided in `TARGET_SEGMENT_AND_SEO_STRATEGY.md`, now doubly justified.

---

**7. ToneTrace, as specified in `TONETRACE_ROADMAP.md` — least defensible. Do not build it.**

I want to be unambiguous, because this is the plank the brief warned might be doomed, and it is.

*The product already shipped, from someone bigger.* BIAS X's Music-To-Tone (2025-09-26, $149) is the ToneTrace vision with a million-tone training set and Positive Grid's distribution. Five-plus free web tools do the lighter version. We would be entering a race already in progress, on the axis deflating fastest, against the best-funded participant.

*The hard version is not solvable by 2028.* The honest technical ceiling, from the literature:
- Blind audio-effect-chain estimation state of the art (arXiv 2604.22276, 2026-04-24) reports macro-F1 **0.958** on effect-type classification and parameter MAE **0.0885** — but only on **synthetic chains of at most 3 effects** drawn from {chorus, distortion, reverb}, with the dry signal recoverable. The authors explicitly name "restricted diversity of the effects handled" and "longer effect chains" as unsolved.
- The FX-graph literature (WildFX, arXiv 2507.10534) states plainly that identifying *which* effects, in *what order*, with *what parameters* remains open, with poor transfer beyond the training configuration.
- From a **finished mix** you must additionally solve guitar source separation. htdemucs tops out around **9.0–9.2 dB SDR** overall on MUSDB-HQ, and the 6-stem variant that isolates guitar is the weak one, with documented bleed in complex arrangements.
- Then you must invert mixing/mastering, then map to a *specific device's* parameter space — neither of which has a credible published solution.
- And the one-to-many problem is not an engineering problem but a mathematical one: a clean Fender Twin and an AC30 with treble rolled back are near-indistinguishable in the spectrum. Our own roadmap already flags this as Risk #2. It does not get better with more compute.

*The MVP's critical path is the wrong investment.* Phase 1 is blocked on recording reference audio for every recipe to a consistent standard — a large, slow, capital-and-time expense whose product is the **least differentiated layer of the stack**.

*Salvage:* two pieces of the roadmap are good and belong to the new strategy. **Layer 2** (structured signal-chain DB with real schema) is asset #1 above. **Layer 6** (the feedback loop capturing user corrections) is the machine that manufactures asset #2. Keep both. Drop Layers 1, 3, 4, and 5 — the matching engine.

---

## 5. The strategic recommendation

> **Fader & Knob should stop supplying tone *files* and become the verified performance-data layer for songs: the library of what to play, on what tone, at which moment, on a specific rig — published in a form that hardware, apps, and agents can execute directly.** The bet is that captures, presets, and AI-generated chains all fall to zero (they largely have), while two things become scarcer: proof that a tone was actually tried on real hardware, and a machine-readable map from a song's structure to a rig's controls. Line 6 has already built the execution surface for the second — Showcase recalls presets and snapshots along a song timeline — and nobody has built the library that feeds it. F&K should be that library, charge for the compiler that turns a setlist into a loadable rig and for the verification that says it will actually work, and treat the preset file, the blog traffic, and the platform matrix as free distribution for it.

### The three bets that follow

**Bet 1 — Sell the set, not the preset. Turn the Setlist Mapper into a compiler.**
A user pastes or imports a setlist; the system returns a compiled artifact — a preset/setlist file with snapshots assigned per song *and per section*, volume-matched, plus the printable map. Price the **compilation**, not the file. Target the Showcase Song format explicitly and be first to publish for it when Line 6 opens it; in the meantime target Helix setlists/snapshots, which is where our ICP actually is. Success test: a worship guitarist can go from a Planning Center setlist to a loadable rig in under five minutes without opening HX Edit.

**Bet 2 — Make verification a first-class product feature, not a brand adjective.**
Add `verified_on`, `firmware`, `verified_by`, and `changed` as schema fields enforced by the audit script. Render verification state on every recipe, including "unverified" honestly. Publish the correction ledger as a feature with its own URL, not a paragraph on an About page. Every recipe should be able to answer "when was this last actually plugged in?" This is the only claim that survives free generation, and it is the thing that keeps our structured corpus from being indistinguishable from a generator's output.

**Bet 3 — Be agent-readable *supply*, not agent-competing *content*.**
Keep robots open, keep the MCP endpoint, and extend it from read-only browsing into a real tool surface: search recipes, compile a set, fetch a preset for a device. Gate the **compiled artifact** behind an account, never the knowledge. Assume the reader-arrives funnel keeps shrinking (T3) and convert to agent-fetches-and-user-accounts-for-the-artifact. Watch agentic checkout (OpenAI/Stripe ACP, Instant Checkout at 4% merchant fee since Feb 2026, Visa integration June 2026, Google UCP) and be transactable when the guitarist's assistant is doing the buying.

### On the direct question: is exposing structured recipes to agents smart or self-cannibalizing?

**Smart. Not close.** Both sides are not equally weighted and I won't pretend they are.

The disintermediation has already happened and does not depend on our consent — engines cite our pages whether or not we run an MCP endpoint, and blocking the retrieval crawlers costs us citation eligibility while recovering approximately none of the lost clicks. Given that, the only live question is whether we prefer to be *the source the agent uses* or *a source the agent paraphrases from a competitor's summary*. Being fetchable, structured, and correct is the position that keeps our name attached and puts us in the path of the transaction. The self-cannibalization risk is real in exactly one place: **if the free layer contains the compiled artifact, agents will take it and we get nothing.** So draw the line there and only there. Knowledge free and fully agent-readable; compiled sets, preset files, and verification history behind an account. That line is the whole business model.

---

## 6. What to STOP doing, because it is on the depreciating side

1. **Stop building ToneTrace as specified.** Specifically: do not start the reference-audio recording program. It is the critical path to a matching engine we should not build, and it consumes the scarcest resource (Daniel's hardware time) that Bet 2 needs.
2. **Stop marketing cross-platform coverage as a differentiator.** Maintain translations as table stakes. Zero net-new QC effort (already policy). Remove "every platform" from positioning copy — the incumbents have it.
3. **Stop optimizing for publishing volume.** 376 blog posts against a 3/week/persona cap was a reasonable bet when generic answers were scarce; they aren't. Cut velocity hard and reallocate to verification passes and set compilation. Fewer, verified, refreshed pages beat more pages, and at scale thin pages are a spam-policy liability for the whole domain.
4. **Stop planning to sell individual preset files as the primary paid unit.** The file is the free sample. The compiled set and the verification subscription are the products.
5. **Stop producing generic tone education.** "What a compressor does," "delay types explained," "FRFR buying guides" — LLM-answered, off-ICP, and failing the Non-Commodity Gate. The FRFR page can keep its authority and pass it inward; don't write more like it.
6. **Stop the "AllRecipes of guitar tone" framing.** Recipes-as-prose is the depreciating half of the recipe. Recipes-as-executable-data is the appreciating half. The framing determines which one we invest in.
7. **Stop treating the Setlist Mapper PDF as the product.** It is a rendering of the product. Ship the database and the compiler, then render whatever documents you like.

---

## 7. Monitoring plan — quarterly

Run every quarter (suggest first Sunday of Jan/Apr/Jul/Oct, alongside the existing monthly audit step). Log results in this file's changelog section.

### A. Capture/model commoditization
| Check | URL | What would change our mind |
|---|---|---|
| NAM A2 adoption | `tone3000.com/blog`, `tone3000.com` | A2 shipping inside Helix/QC/Kemper firmware (= capture is a solved commodity everywhere) |
| TONE3000 scale + monetization | `tone3000.com`, `tone3000.com/changelog` | **Any paid tier, marketplace, or revenue share = they found a value layer worth charging for** |
| Kemper / Neural DSP / IK capture releases | `kemper-amps.com/news`, `neuraldsp.com/news`, `ikmultimedia.com/news` | **Two §1.5-invalidating events:** (i) any vendor shipping *time-based* capture (delay/reverb/mod), which would mean the receptive-field ceiling was beaten; (ii) Liquid-Profiling-style knob interactivity spreading beyond Kemper to NAM/ToneX/Proxy, which would erode the "one capture = one knob setting" argument |
| A2 independent replication | search for any non-TONE3000 benchmark | A credible third-party test either way — we currently have none |

### B. Line 6 platform (T1 — highest-value watch)
| Check | URL | Trigger |
|---|---|---|
| Showcase spec & sharing | `manuals.line6.com/en/helix-stadium/live/song-view` | A documented Song file format, export, or import = **act immediately, publish for it** |
| CustomTone structure | `line6.com/customtone/` | A Song/Showcase category or per-song browse = T1 is live |
| Line 6 announcements | `line6.com/support/announcement/` | Showcase content partner program; Proxy/Showcase backported to Helix Floor/LT/HX Stomp (**window-closing event**) |
| Marketplace | `line6.com` → Web Shop / Marketplace | "Songs" or setlist SKUs |

### C. Competitive (T2, T6)
| Check | URL | Trigger |
|---|---|---|
| Signal Theory / Worship Tutorials | `signaltheoryaudio.com`, `worshiptutorials.com` | Tone Pass 2027 price & patch commitment vs. $249.99/14 (2026) and $319.99/16 (early 2026). Any "setlist"/"service planner" product. |
| MultiTracks guitar depth | `multitracks.com/sounds/`, `multitracks.com/products/patches/` | Guitar-tone browse at the setlist level; new Helix partnerships; any preset-vendor acquisition |
| ToneNET song/artist index | `tone.net` | Verified/"as played on" badges, curated per-song collections, official artist rigs |
| AI preset generators | `tonebuilder.ai`, `patchmint.studio`, `dialmytone.com`, `ai-tone.tech` | Any of them acquiring real traction, reviews, or a *verification* claim (that's the one that hits us) |

### D. AI-answer & agentic commerce (T3, Bet 3)
| Check | Source | Trigger |
|---|---|---|
| Bing AI Performance report | Bing Webmaster Tools | The only first-party AI-citation dataset — track monthly, not quarterly |
| AI referral sessions | GA4 (`chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`) | Trend, not volume |
| Crawler hits | server/Cloudflare logs: OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot | Any drop = an edge-config regression (this has bitten us twice) |
| Agentic checkout standards | OpenAI/Stripe ACP docs, Google UCP | When our SKUs can be transacted by an agent, wire it |

### E. Our own leading indicators
- % of recipes with a `verified_on` date newer than 12 months (target: rising; this is Bet 2's scoreboard)
- Public corrections count (23 at 2026-07-25) — a *flat* number means we stopped checking, not that we stopped being wrong
- Set Pack / compiler conversions vs. individual preset downloads (the mix shift is the strategy working)

---

## 8. Open items this pass could not close

Stated so nobody mistakes absence for evidence.

- **Independent capture-quality benchmarks do not exist.** Line 6 publishes no accuracy claim for Proxy. Every A2-vs-competitors number originates with TONE3000, benchmarking its own product — and it benchmarked Proxy within ~2 months of Proxy's v1.0 release. MusicTech ran the claims unchallenged. The raw MUSHRA data and test code are public on GitHub, which is more than anyone else offers, but that is not replication. **Nothing in this memo's conclusions depends on A2 winning; they depend only on capture being free and good enough, which is not in dispute.**
- **Forum-level Proxy sentiment is thin.** The Gear Page, Fractal's forum and Gearspace all 403 automated fetch, and no r/Line6Helix threads surfaced. What we have: one Guitar.com review (8/10, cloning "works really well," but slow and with "strange noises" on full amp+cab+mic), and one Line 6 Community thread where a bad-sounding clone turned out to be a misleading in-unit A/B preview rather than a bad capture. Not enough to characterize reception.
- **Proxy Phase 2.** Line 6's wording ("phase one") and pre-launch hints suggest more capture types are coming, but there is **no dated commitment to modulation/delay/reverb cloning**, and §1.5(b) argues the architecture forbids it. If Line 6 ever ships time-based cloning, re-open §1.5.
- **Whether Tone Pass's $319.99 → $249.99 move is a promotion or a real price cut.** Re-check at the 2027 rollover. Material to T2.
- **Actual revenue direction for paid preset vendors.** No vendor publishes numbers; no shutdown posts surfaced. The saturation read here is inferred from price/bundle structure and platform-breadth behavior, not from financials. Treat as a hypothesis with supporting circumstantial evidence, not a fact.
- **Forum sentiment.** Reddit and several forums were not directly fetchable this pass. The "are presets dead" sentiment question is unanswered from primary sources.
- **Whether Showcase Song files are shareable.** The manual does not say. This is the single highest-value unknown in the document — if they are shareable/importable, Bet 1 has a concrete first-mover target; if they are not, Bet 1 targets Helix setlists instead. **Resolve this first.**

---

## Sources

**Capture / cloning:** Line 6 Clones manual (`manuals.line6.com/en/helix-stadium/live/clones`) · Sweetwater Proxy guide & Stadium 1.3 announcement · MusicPlayers / guitarbomb coverage of firmware 1.3 (2026-03-24) · Guitar.com Stadium XL review (2026-04-17, 8/10) · I Like Kill Nerds Proxy analysis (2026-03-07) · Line 6 Community thread 71770 (2026-04-05) · Six String Lab Proxy and NAM-hardware pieces · TONE3000 "Introducing NAM Architecture 2 (A2)" (2026-06-02), "Announcing A2" (2026-01-20), and *NAM A2: The Complete Guide* · MusicTech and Guitar World A2 coverage · Kemper Profiling Technology 2.0 / OS 14.0 (2026-03-05; Premier Guitar, Sonicstate, Studio Economik) · Kemper Liquid Profiling announcement (2023-05-03) and forum technical thread (Sept 2024) · Neural DSP "Introducing Neural Capture Version 2" (2025-11-26) · Quad Cortex mini, NAMM 2026 (Sound On Sound) · IK Multimedia TONEX Modeler launch (2025-08-29, Sound On Sound) · IK AI Machine Modeling
*Not verifiable this pass (HTTP 403 to automated fetch): thegearpage.net, forum.fractalaudio.com, gearspace.com, reddit.com. TGP-attributed claims above are search-summary secondhand and are labeled as such.*

**AI tone matching:** Positive Grid BIAS X product page · KVR Audio BIAS X review (price $149, released 2025-09-26) · Guitar World BIAS X coverage · tonematcher.com, tonesmatch.com, ai-tone.tech, toneadapt.com, GuitarAI · ToneBuilder.ai, PatchMint Studio, DialMyTone, HelAIx, StompBox.ai · Line 6 forum thread "Finally — AI That Builds Actual Helix .hlx Files" (2026-05-01)

**Academic ceiling:** arXiv 2604.22276 "Audio Effect Estimation with DNN-Based Prediction and Search Algorithm" (2026-04-24) · arXiv 2507.10534 "WildFX" (Jul 2025) · arXiv 2504.04751 "Unsupervised Estimation of Nonlinear Audio Effects" (DAFx25) · Hinrichs et al., EURASIP JASMP, blind extraction of guitar effects · Comunità et al., guitar effects recognition & parameter estimation · facebookresearch/demucs (htdemucs, htdemucs\_6s)

**Preset economy:** signaltheoryaudio.com (Tone Pass 2026, $249.99) · worshiptutorials.com · multitracks.com (Patches, Kemper profiles, Helix song-specific patches) · tone3000.com · IK Multimedia ToneNET preset sharing launch (2026-04-02; Sound On Sound, MusicPlayers, rekkerd) · line6.com/customtone · stadiumdepot.com · glenndelaune.com · Mastin Labs / Imagen AI on the Lightroom-preset analogue

**Platform / market:** Line 6 Showcase & Song View manual · Sweetwater Showcase guide · Guitar World Showcase coverage · Helix Stadium pricing ($1,799.99 / $2,199.99, announced 2025-06-11)

**AI search & agentic commerce:** internal `docs/AI_SEARCH_PLAYBOOK.md` and `docs/research/AI_CITATION_RESEARCH_2026-07-17.md` · Nieman Lab (2026-07) on publisher search decline · zero-click / AI Overview CTR studies (2026) · OpenAI + Stripe Agentic Commerce Protocol; Instant Checkout (2026-02-16, 4% fee); Visa/ChatGPT integration (2026-06-10); Google UCP

**Internal:** `COMPETITIVE_TEARDOWN.md` · `MONETIZATION_RESEARCH.md` · `TONETRACE_ROADMAP.md` · `TARGET_SEGMENT_AND_SEO_STRATEGY.md` · `SET_PATCH_STRATEGY.md` · `RECIPE_STANDARD.md` · `RECIPE_AUDIT_REPORT.md` (195/195 clean, 2026-07-25) · `src/data/experiment-stats.json` (23 public corrections)
