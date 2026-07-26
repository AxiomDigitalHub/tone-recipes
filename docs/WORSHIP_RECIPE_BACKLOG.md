# Worship Recipe Backlog — The Prioritized 50

**Created:** 2026-07-25
**Owner of this gap:** the whole content strategy. `docs/TARGET_SEGMENT_AND_SEO_STRATEGY.md` names the worship guitarist on a Helix/HX Stomp as the ICP; the corpus does not serve them.
**Parent docs:** `TARGET_SEGMENT_AND_SEO_STRATEGY.md`, `WORSHIP_HELIX_CONTENT_CLUSTER.md`, `RECIPE_STANDARD.md`, `research/SET_PATCH_STRATEGY.md`, `research/WORSHIP_GUITARIST_RIGS.md`, `research/WORSHIP_PRODUCTION_NOTES.md`, `research/LINCOLN_BREWSTER_DEEP_DIVE.md`.
**Status:** research complete, build queue ready. Nothing here is committed to `RECIPE_BACKLOG.md` yet — see "How to load this into the pipeline."

---

## Executive summary

**Where we are.** The corpus has **390 song entries and exactly 5 worship recipes** (1.3%), against a strategy whose entire ICP is the worship guitarist on a Line 6 Helix or HX Stomp. The five that exist are good — they're the shape everything below should copy:

| Recipe slug | Song | Artist | Guitarist | Attribution quality |
|---|---|---|---|---|
| `hendroff-what-a-beautiful-name` | What a Beautiful Name | Hillsong Worship | Nigel Hendroff | Documented rig; per-track credit inferred from his MD role |
| `hislop-goodness-of-god` | Goodness of God | Bethel Music | David Hislop | Documented rig; community-consensus per-track |
| `moore-living-hope` | Living Hope | Phil Wickham | Casey Moore (session) | Per-track credit verified |
| `moore-way-maker` | Way Maker | Leeland | Casey Moore | Verified as Leeland's lead player |
| `garrard-great-are-you-lord` | Great Are You Lord | All Sons & Daughters | Stu Garrard | Verified via Discogs credits |

**The real blocker is not song selection — it's attribution.** The 2026-06-12 pass through `RECIPE_BACKLOG.md` tried five more CCLI-top songs (#1003 Graves Into Gardens, #1005 Build My Life, #1006 King of Kings, #1008 Battle Belongs, #1010 House of the Lord) and **skipped all five** because no published per-track electric-guitar credit exists. That verdict was correct and it will repeat on roughly half of modern worship if we keep demanding studio liner-note credits that the genre simply does not publish. Worship records credit *songwriters and producers*; the electric guitar is usually a collective album-level credit across four to six players.

Meanwhile `RECIPE_BACKLOG.md` still carries ~40 queued worship entries (#874–#916) whose Guitarist column literally reads "worship guitarist" and whose gear sketch is a copy-pasted "Strat → AC30, Strymon Timeline + BigSky." Those would fail the same bar on contact. **This document replaces them.**

**The single biggest finding of this research pass reverses part of that verdict.** **Elevation Worship publishes its own signal chains.** Their MD and lead guitarist, **E Edwards**, posts per-song in-ear mix videos with the exact chain in the description, and Elevation's tutorial copy states they pair you with *"the musicians who played on the live album."* That is per-track attribution, from the band, for the most-played worship catalogue in America. **Twelve of the fifty songs below are Elevation, and eight of those are Grade A because of it** — including #1003 Graves Into Gardens, which we skipped in June. Details in "The unlock" below.

**The plan, in four moves.**

0. **Mine Elevation first.** It is a third of all current risers, it has the best evidence in the entire genre, and nobody is using it. If only one thing in this document gets done, do this.
1. **Split the corpus into two honest tiers.** *Attributed recipes* name a player and cite his rig. *Tribute-tier recipes* say plainly: "no per-track credit is published for this recording; here is the documented house rig of the band that cut it, and here is how the part on the record is actually built." We already have the convention (156 CORRECTION/unverified annotations, e.g. the Hendroff Klon myth and the November Rain lore) — this formalises it for worship, where it is the difference between 5 recipes and 50.
2. **Build by archetype, not by song.** Worship converges: **seven archetypes cover all 50 songs**, and the incumbent vendors' own snapshot naming independently confirms the same set. Each archetype has one canonical Helix chain; a song recipe is that chain plus a BPM, a key, a delay subdivision, and the specific thing that makes the record sound like itself. This is also exactly the input the Set Builder needs — archetypes are snapshot roles.
3. **Front-load the seasons — and both of our assumed deadlines were too late.** Easter 2027 falls on **28 March 2027**, eight days earlier than 2026, with Ash Wednesday on **10 February**. Teams plan Easter *before* Lent, so the "six weeks out" rule (which lands on 14 Feb) misses the decision entirely — **Easter block live by early January 2027.** Christmas is more urgent still: PraiseCharts' Christmas hub is live and selling **as of 24 July 2026**, teams choose Christmas material in **August–September** and rehearse Oct–Nov, so shipping in November arrives after the setlist is locked and gives Google no ramp — **Christmas block live by early-to-mid September 2026**, i.e. ~6 weeks from today. (Favourable wrinkle: Christmas Eve 2026 is a **Thursday**, a standalone mid-week service rather than one colliding with Sunday morning — historically that means bigger, more produced candlelight services, which is good for the ambient/swell angle.)

**What this unlocks.** 50 worship recipes × the existing 6-platform translation matrix is the only cross-platform worship tone library that exists. It feeds the Worship Set Pack directly (the archetype map below *is* the snapshot spec), it gives the Tier-2 song posts in `WORSHIP_HELIX_CONTENT_CLUSTER.md` something to link to, and it moves the corpus median year forward by two decades.

---

## Reading the rankings: a methodology caveat you need before the table

Anyone building a worship backlog off "the CCLI Top 100" in 2026 is probably reading the wrong chart.

**In September 2024 CCLI silently swapped what "CCLI Top 100" means.** The old list was six-month aggregated *church usage reporting*, weighted by church size and tied to royalty payouts. The new list under the same name is **weekly SongSelect download counts** — no church-size weighting, not tied to royalties, and it now includes public-domain hymns that were previously excluded. It behaves like a Billboard chart. ([Worship Leader Research](https://worshipleaderresearch.com/the-ccli-top-100-changed-and-nobody-is-talking-about-it/))

Practical consequence for us: the download-based chart **over-indexes brand-new songs and small churches** (a download happens once, when a church adopts a song), while the old usage chart better tracked *how many people are actually singing it*. Neither is wrong; they answer different questions. For a tone-recipe backlog we care about **what gets played on a Sunday for years**, so this ranking blends:

- CCLI usage-era rankings (the durable core),
- current SongSelect/PraiseCharts position (the adoption signal),
- **and — weighted heaviest — whether the record has a guitar part worth a recipe.**

A song can be #1 on every chart and still be a bad recipe. "I Speak Jesus" is top-10 everywhere and the electric guitar on it is a pad. We do not build that one. Ranking below is `(popularity × identifiable electric part × search demand)`, and the middle term is a **gate**, not a multiplier — if the electric part is inaudible, the song does not appear at any rank.

### The four charts this backlog is built on

| Signal | What it actually measures | Freshness | How we weight it |
|---|---|---|---|
| **CCLI weekly Top 20** ([Renewing Worship](https://www.renewingworshipnc.org/top20/), week of 2026-07-20) | Current SongSelect activity | Weekly, verified current | Adoption / riser detection |
| **CCLI usage Top 99** ([Worship Artistry](https://worshipartistry.com/greenroom/songs/lists/most-popular-worship-songs)) | Church-reported usage across small→large US churches | 2025 reporting | **The durable core. Heaviest weight.** |
| **PraiseCharts season/trending lists** (API-pulled 2026-07-24/25) | Sheet-music and multitrack **sales** | Live | Riser detection only; distorted by choral SATB |
| **PraiseCharts `line-6-helix-patches-for-top-christian-worship-songs`** (updated 2026-07-25) | **Which worship songs Helix players buy patches for** | Live | 🔑 **The single best demand proxy we have for this exact product.** |

That last row deserves its own paragraph. PraiseCharts maintains rig-specific song lists — Helix, HX Stomp, POD Go, Fractal FM3/FM9, Kemper, and `electric-guitar-patches-for-advent-worship-songs`. The Helix list is **a direct competitor's own ranked answer to "which worship songs do Helix players need patches for."** It is simultaneously a keyword map and a validated demand list, and it is the closest thing to ground truth for our ICP that exists publicly. Its top 20:

> 10,000 Reasons · Goodness of God · The Blessing · Raise a Hallelujah · In Christ Alone · Jesus Paid It All · Glorious Day · Reckless Love · Graves Into Gardens · I Speak Jesus · The Lion and the Lamb · Jireh · This Is Amazing Grace · What a Beautiful Name · Cornerstone · King of Kings · O Come to the Altar · Build My Life · Living Hope · Who You Say I Am

Note what that list tells you that the CCLI charts don't: **Cornerstone, The Lion and the Lamb, In Christ Alone and Jesus Paid It All** carry real Helix-patch demand despite mid-table CCLI ranks, and **Jireh** carries it despite Maverick City having contracted to two live songs. Those four are ranked higher below than a pure CCLI read would put them.

### Negative findings worth as much as the positive ones

- **Forrest Frank: zero appearances** across every PraiseCharts congregational and sales list pulled. He is a streaming/radio artist, not church repertoire. Do not build worship-guitar content around him on a "churches play this" premise, whatever his streaming numbers say.
- **Benjamin William Hastings** appears only as a **co-writer** (Gratitude, Take You at Your Word, O Praise the Name), never as a lead artist. Not an artist hub.
- **CAIN, Katy Nichole, Anne Wilson, Josiah Queen, Seph Schlueter** — radio artists, deep-tail congregational adoption. Skip.
- **Maverick City has contracted to two live songs**: "I Thank God" and "Jireh." The 2020–21 breadth is gone. Build those two, not a Maverick City cluster.
- **Elevation is the dominant force by a wide margin** — roughly a third of all 2025–26 risers are Elevation Worship or ELEVATION RHYTHM. If we can only solve one attribution problem, solve Elevation's.

---

## The tone archetypes (build order depends on these)

Seven archetypes cover all 50 songs. Every recipe below is tagged with one. The Helix chains use verified model names from `docs/platform-knowledge/line6-helix.md`. A1–A6 were derived from our own research corpus; **A7 was added after the vendor survey showed every incumbent gives octave its own snapshot** — see "The competitive picture" below for the snapshot-naming evidence that independently validates this whole list.

### A1 · Ambient Swell / Pad
*The volume-swell bed. No pick attack, no rhythm — the guitar is a synth pad. This is the single most-used worship archetype and the one volunteers get wrong most often (they swell too late).*

```
Volume Pedal (EXP1) → Deluxe Comp → Minotaur (off) → A30 Fawn Brt (Drive 3.5–4.5)
  → 2x12 Blue Bell → Transistor Tape (1/4, Mix 25) → Searchlights (Cloud, Mix 45–60, Decay 8–12s)
  → Plateaux (Shimmer, Mix 20–30) [stacked for the big moments]
```
- Reverb cuts non-negotiable: LowCut 140–200 Hz, HighCut 7–8 kHz (F5).
- Predelay 20–40 ms or the swell loses its front edge.
- Mono-PA warning: two long stereo reverbs summed to mono can partially cancel. Flag `mono_safe` on every A1 recipe.

### A2 · Dotted-Eighth Delay Lead
*The Edge lineage; the defining worship lead texture. Simple note choice, delay does the arithmetic.*

```
Volume Pedal → Deluxe Comp → Minotaur (ON, Gain 2–3, Level 6.5) → A30 Fawn Brt (Drive 5–6)
  → 2x12 Blue Bell → Vintage Digital (dotted-1/8, Mix 28–35, Fbk 35–40, LowCut 200, HighCut 6k)
  → Plate (Mix 20–25)
```
- **Dotted-eighth ms = (60000 / BPM) × 0.75.** Every A2 recipe states the ms for that song's BPM and says "tap it anyway."
- Feedback 35–40 = 3–4 repeats. Above 50 it becomes mud in a room.
- HighCut on the delay is what stops the repeats fighting the dry note.

### A3 · Clean Arpeggio / Chime Verse
*Filter'Tron or Tele into an AC30 barely breaking up. Quarter-note delay, small plate. The verse of half the catalogue.*

```
Deluxe Comp (Mix 60–70, keeps attack) → A30 Fawn Brt (Drive 3–4, Treble 7, Bass 4)
  → 2x12 Blue Bell (LowCut 90, HighCut 8.5k) → Transistor Tape (1/4, Mix 20)
  → Plate (Mix 18–22, Decay 2–3s)
```
- Compressor **mix**, not full-band squash — worship-pop tracks are heavily compressed (see `WORSHIP_PRODUCTION_NOTES.md`), live parts are not.
- This is the archetype where the guitar has to *disappear* under the vocal. Gentle 2–4 kHz scoop.

### A4 · Driven Anthem Chorus
*The chorus lift. Klon-into-AC30 plus a Tube Screamer on top. Still less gain than players expect — studio worship is a classic-rock rhythm tone, not a rock tone.*

```
Deluxe Comp → Minotaur (ON) → Scream 808 (ON for chorus only, Gain 3–4, Level 6)
  → A30 Fawn Brt (Drive 6–7) → 2x12 Blue Bell → Vintage Digital (dotted-1/8, Mix 22)
  → Plate (Mix 20)
```
- Two drives, one default-on, the other the snapshot delta (F6/G6).
- Level the chorus with **ChVol, not Drive** — FOH already EQ'd the channel.

### A5 · Gritty Modern-Rock Worship
*Elevation/Brandon Lake/Maverick City territory: the amp is not a Vox, the part is a riff, and the ambience is smaller than you'd think. Also where the modeler-native rigs live (Elevation's documented board is a Quad Cortex / HX Stomp, not an analog AC30 board).*

```
Noise Gate → Deluxe Comp → Compulsive Drv or Teemah! (ON) → Brit Plexi Brt or Matchstick Ch2 (Drive 6–7)
  → 4x12 Green 25W → Simple Delay (1/8 or dotted-1/8, Mix 18) → Room (Mix 15–20)
```
- Deliberately **less** reverb than A1/A2 — these records are drier and drum-forward.
- Greenbacks, not Blue Bells. The chime is not the point here.

### A6 · Brewster-Style Rock-Worship Lead
*The other tradition entirely. Plexi Variac, single-coil-voiced, mid-forward, controlled delay. Guitar is the lead instrument, not a texture. Full research: `research/LINCOLN_BREWSTER_DEEP_DIVE.md`.*

```
Deluxe Comp → Stupor OD / BD-2-style boost (lead only) → Plexi 100W High (Drive < 5, Mid boosted, Treble shelved)
  → 4x12 Greenback 25 (SM57 on-axis) → Simple Delay (1/4, Mix 15–20) → Room (Mix 12–18)
```
- **No dotted-eighth.** That is the tell that separates A6 from A2.
- Gain under 50%; the dynamics come from pick attack. Must clean up on the volume knob.

### A7 · Octave / POG Layer
*Added after the vendor survey: every incumbent gives octave its own snapshot in Hillsong and Elevation presets (`VB2+POG`, `POG OD`). It is not a modifier — players switch to it.*

```
Deluxe Comp → Poly Pitch (+1 oct, Mix 35–45, dry retained) → Minotaur (optional)
  → A30 Fawn Brt → 2x12 Blue Bell → Transistor Tape (1/4, Mix 20) → Searchlights (Mix 40)
```
- Already proven in our corpus: `moore-living-hope` uses an EHX Micro POG for exactly this.
- **DSP warning:** Poly pitch blocks are expensive. On HX Stomp this frequently forces the degraded "Stomp cut" — flag it.

**Why seven and not fifteen.** Anything finer stops being a snapshot role. Eight Helix snapshots map to: A3 (Clean) · A2 (Drive/dotted) · A4 (Drive+) · A2-lead (Lead) · A1 (Clean Ambi) · A1+drive (Ambi Drive) · A5 (Rock Rhythm) · A1-max (Swells) — which is exactly the standard worship layout already specified in `SET_PATCH_STRATEGY.md`. The archetype map and the snapshot layout are the same object.

---

## The attribution problem, and the tribute-tier convention

This is the section that decides whether we ship 50 recipes or 5. Read it before building anything.

**Worship records do not publish per-track instrument credits.** Hillsong publishes album-level credits (Zion lists six electric guitarists — Michael Guy Chislett, Jad Gillies, Joel Houston, Joel Hingston, Timon Klein, Dylan Thomas — and never says who played "Oceans"). Elevation credits a team. Bethel credits a team. Phil Wickham's *Hymn of Heaven* publishes songwriter and producer credits only. This is not an oversight we can research our way around; it is how the genre releases records.

So the corpus needs two grades, both honest, clearly distinguished on the page:

**Grade A — Attributed.** A named player, a documented rig with a source URL, and either a per-track credit or a role that makes the attribution safe (a band's sole/lead electric player on the record in question). Example: `moore-way-maker` — Casey Moore is verifiably Leeland's lead guitarist.
> Recipe voice: *"Casey Moore runs a Strat into an AC30 with a Klon-style drive and a Timeline."*

**Grade B — Tribute-tier.** No per-track credit exists. We name the collective, name the **documented house rig of that collective in that era**, and say so out loud. The recipe reconstructs the *part on the record* — which is knowable, it is right there in the audio — using gear the band demonstrably used.
> Recipe voice: *"Hillsong UNITED's* Zion *credits six electric guitarists and never says who played this track. Michael Guy Chislett produced it, and his documented rig — Jazzmaster and Gretsch White Falcon into a Matchless DC-30 — is the defensible reconstruction. This recipe builds the part from the record on that platform."*

**The rules that keep Grade B honest:**
1. The tribute-tier disclosure lives in `original_gear.notes` **and** in the visible `description` — not buried in a block note.
2. Never name a specific individual as the player without a source. "Elevation's guitar team" is honest; "played by [guy from Instagram]" is not.
3. The gear must be documented *for that band in that era*, not the genre-average AC30 assumption. **The generic "Strat → AC30 + Timeline + BigSky" sketch on backlog entries #874–#916 is exactly the failure mode** — it is a genre stereotype dressed as research, and for Elevation it is factually wrong.
4. Song facts (key, BPM, delay subdivision, arrangement) are always verifiable and always stated. Those carry the recipe's real value.
5. `sources` still requires ≥1 URL (A5) — for Grade B it points at the band's documented rig, not at a per-track credit that doesn't exist.

**Why this is defensible and not a cop-out.** Our differentiator per the corpus audit is *source honesty* — 156 CORRECTION/unverified annotations including debunking the Hendroff "Klon KTR" myth that every other worship site repeats. A tribute-tier label is the same asset applied prospectively. The alternative — quietly asserting a guitarist we can't source — is the one thing that would actually destroy the moat.

Every row in the table below carries an **Evidence** grade: **A** (attributed), **B** (tribute-tier), or **B+** (tribute-tier but the house rig is unusually well documented).

---

## How to load this into the pipeline

1. **Retire backlog entries #874–#916.** They are genre-stereotype sketches with "worship guitarist" in the Guitarist column. Mark them `superseded — see docs/WORSHIP_RECIPE_BACKLOG.md`, don't delete (reproducibility rule in `RECIPE_BACKLOG.md`).
2. **Unblock all five `needs-research` entries.** **#1003 Graves Into Gardens clears as Grade A** on the strength of the E Edwards in-ear mix — it needed a fact, and we found it. **#1005 Build My Life / #1006 King of Kings / #1008 Battle Belongs / #1010 House of the Lord** re-file as Grade B with the tribute-tier disclosure: the 2026-06-12 verdicts were right under the old single-grade rule and are resolved under the two-grade rule. Those four don't need new facts — they need a different, honest frame.
3. **Append Tier 1 to the top of the queue** in the rank order below, with the Evidence grade and archetype in the gear-sketch column so the builder agent inherits the frame.
4. **Seasonal blocks get date-stamped priority**, not rank priority — Christmas 10 jumps the queue in September regardless of CCLI rank.
5. Standard quality bar still applies: audit clean (zero errors, zero warns), all six platform translations, verified album art.
6. **Ship an HX Stomp cut with every worship recipe.** The market data makes this the cheapest differentiation available: Sunday Shred has **143 Helix SKUs and 2 HX Stomp SKUs**. Our ICP is defined as "Helix **or HX Stomp**," the 8-block ceiling is a known constraint, and no competitor is serving it. A documented degradation ladder (which block gets cut first, and what you lose) is content nobody else has — and it is exactly the *why* that a binary preset file can't carry.

---

## 🔑 The unlock: Elevation publishes its own signal chains

This is the most important research finding in the pass, and it inverts the 2026-06-12 verdict that Elevation was unbuildable.

**E Edwards** (@e__edwards) is Elevation Worship's Music Director and lead ("top") electric guitarist, and he publishes **per-song in-ear mix videos with the exact signal chain in the description.** Elevation's own tutorial copy states: *"we've paired you with the musicians who played on the live album."* That makes their tutorial credits functionally equivalent to record credits — which is the per-track attribution nobody else in worship provides.

**E Edwards — DOCUMENTED**
- **Guitars:** Elliott Guitars P40 Warhawk (main), Elliott Tonemaster, Elliott 135, Elliott Revelator (2025), PRS Silver Sky Nebula
- **Amps:** Elliott "Revenuer" (Shure 545) + **1965 Fender Bandmaster** (Sennheiser 421) in **stereo**; earlier a Fender Super Reverb. Quad Cortex captures of a **PRS JMOD 100** and a Blackface Super Reverb
- **Core chain:** Neural DSP Quad Cortex → **Line 6 HX Stomp** → Strymon BigSky → Selah Quartz Timer; Dunlop Mini X volume, Temple Audio Duo 24
- **Texture tools on nearly every song:** EBow, brass slide, G7th capo
- He **sells his own QC / HX Stomp / BigSky / TONEX presets and IRs** (JMP Super Lead, Super Reverb, JMOD) — effectively a published signal chain
- Sources: [gear rundown](https://www.youtube.com/watch?v=b7Tw6lcRs7c) · [rhythm rundown w/ full gear list](https://www.youtube.com/watch?v=V1RrL_t4zfI) · [2025 rundown](https://www.youtube.com/watch?v=PA_8_bBVp5Q) · [eedwardsmusic.com](https://www.eedwardsmusic.com/shop) · [in-ear mix series](https://www.youtube.com/watch?v=92dE2bEuidg)

**Joey Signa** (@joeysigna) — "bottom"/rhythm electric. **DOCUMENTED**, two rundowns. 2023 Elevation Nights chain: Goodwood Underfacer → Jackson Bloom → Morningstar ML5 → TS808 → Blackstone Mosfet OD → JHS Kilt V2 → J. Rockett Archer → Dunlop volume → Chase Bliss Tonal Recall → splitter → **2× IK TONEX (L/R)** → Eventide H9 → Walrus Mako D1 → Source Audio Collider. ([source](https://www.youtube.com/watch?v=NAq5sivcO_w))

**David Liotta** (2020–21) and **Kevin Smith** (2020) also have official rundowns. Also credited: Chris Gladden (2021), Tim Womble (2022) — no rig data.

**What this changes:** every Elevation song from 2019 onward with an in-ear mix becomes **Grade A**, not tribute-tier. Backlog #1003 (Graves Into Gardens) is unblocked with real evidence, not a downgrade. **Twelve of the fifty songs below are Elevation** — solve this one artist and a quarter of the backlog turns Grade A.

**Corrections this research forced — all three of these names circulate in worship-guitar forums and all three are wrong:**
- **Davide Mutendji** is an Elevation RHYTHM vocalist/songwriter/bassist, **not a guitarist**.
- **Jonsal Barrientes** is a vocalist (already recorded in `RECIPE_BACKLOG.md` #1003).
- **Simon Kobler** is Hillsong UNITED's **drummer**. **Jad Gillies** is credited "lead vocals, guitar" — a worship leader who plays guitar, not the lead electric player.

### Two more attribution unlocks

**Bethel *Victory* (2019) has full liner credits** — electric guitar: **Ed Cash** (also acoustic, keys, mandolin, producer — the primary guitar hand), **Scott Cash**, **David Hislop**, **Jonathan Lee**, **Michael Pope**. One album covers Goodness of God, Raise a Hallelujah, Stand in Your Love. Album-level, not per-track, so **Grade B+**.

***Reckless Love* has real album credits — and they're a surprise.** Electric guitar: **Dwayne Larring** and **Gabe Scott**; produced by Jason Ingram + Paul Mabury at Spencer Creek Studio, Franklin TN. **This is a Nashville session record, not the Bethel Redding house band.** Any recipe that frames it as "the Bethel sound" is wrong. **Grade A.**

### A correction we owe our own corpus

`docs/research/WORSHIP_GUITARIST_RIGS.md` lists a **"Matchless Spitfire 15"** in Hendroff's rig as documented. It isn't. MultiTracks' own copy for the **"Droff Spitfire"** profile pack describes an amp "in the family since 2009" and **pointedly never names the manufacturer**. The Matchless identification is community-consensus, not confirmed. What *is* first-party documented: **"Droff VX15" = an English-made Vox AC15**, his primary Hillsong album amp since 2004; the **"Droff Signature Combo"** is the two run together — *"essentially my live stereo rig for the last 10 years"*; and the always-on front end is **Jackson Audio Prism → Jackson Audio Bloom**. Also now verified: his signature **Selah Effects Scarlett Love** overdrive (V3) and the **Gretsch G6134TFM-NH Signature Penguin** (announced 31 Aug 2022). ([MultiTracks Hendroff collection](https://helpcenter.multitracks.com/en/collections/2808995-nigel-hendroff) · [Premier Guitar](https://www.premierguitar.com/news/gretsch-nigel-hendroff) · [Hillsong 2014 rundown](https://hillsong.com/collected/blog/2014/08/droffs-guitar-gear-rundown/))

**Add this to the CORRECTION annotations.** It is exactly the class of myth we already debunked with the Hendroff "Klon KTR" claim, and it is currently sitting in our own research doc as fact.

---

## The competitive picture (and why demand ≠ what we assumed)

Supply-side map, verified against vendor sitemaps and APIs:

| Vendor | Song-specific guitar patches | Price | Note |
|---|---|---|---|
| [Worship Tutorials](https://worshiptutorials.com/product-category/helix-patches/helix-song-patches/) | ~165 songs | $9.99 | Category leader; Tone Pass subscription **excludes** song patches |
| [Sunday Shred](https://sundayshred.com/collections/line-6-selector) | ~160 songs / 379 SKUs | $7.99 | Helix 143 · Kemper 137 · QC 79 · **HX Stomp 2** |
| PraiseCharts | ~74 songs | **$4.45** | Cheapest; patch bundled beside charts + stems |
| [Joey Cobra](https://www.joeycobra.com/) | ~100 songs × 4 formats | varies | Helix / HX Stomp / HX Effects / POD Go |
| [GuitarforHISGlory](https://guitarforhisglory.com/product/the-kitchen-sink-helix/) | 110+ in one bundle | $15–99 | Bundle-only |
| Worship Artistry | **0** patches / 802 song lessons | subscription | Teaches *what to play*, never *how to dial it* |

**Two corrections to our own competitive notes:** "Reformation Worship" is **not a patch vendor** — reformationworship.com is a book about 16th-century liturgies. And **Sunday Sounds is a keys company** — 578 song patches, **zero guitar products** across their full 677-SKU catalogue. The guitar vendor is **Sunday Shred**. Two vendors we weren't tracking matter more than either: **PraiseCharts** and **Joey Cobra**.

**Three exploitable gaps:**
1. **Nobody sells the explanation.** Every vendor ships a binary file plus a list of section labels. **Zero of them publish why the chain is built that way.** That is precisely the Non-Commodity Gate in `AI_SEARCH_PLAYBOOK.md`, and it is wide open.
2. **HX Stomp is systematically underserved** — Sunday Shred has **2 HX Stomp SKUs against 143 Helix**. Our ICP is defined as "Helix **or HX Stomp**." This is the thinnest-covered intersection in the market and we already know the block-budget problem it creates.
3. **High-demand / no-supply songs** — the arbitrage list: **Cornerstone** (476k tutorial views, **1** vendor) · **Reckless Love** (582k, 2) · **So Will I** (460k, 2) · **Great Are You Lord** (368k, 2 — *we already own this one*) · **No Longer Slaves** (304k, 2) · **Oceans** (286k, **1**) · **Promises** (73k, **0**).

**Snapshot-naming evidence (this validates the archetype map).** Worship Tutorials' "Praise" preset ships scenes: `V1/Br1` · `CH RIFF` · `V2/.8th` · `BR Build` · `BR/OUTRO Riff` · `RHY` · `Ambi Cln` · **`SWELLS`**. PraiseCharts states the convention outright: *"The first six scenes will be mapped to individual sections of the songs, whereas scenes 7 and 8 will **always be labeled 'clean' and 'swells'**."* Ambient swell is the last snapshot in **literally every preset from every vendor**, and is also sold standalone across all four Line 6 formats. Our A1 archetype is not a guess — it's the industry's own universal.

**One archetype we were missing:** vendors consistently give **octave/POG its own snapshot** in Hillsong and Elevation presets (`VB2+POG`, `POG OD`). Added as **A7** below.

---

## The prioritized 50

**All 50 are net-new** — the five already shipped (What a Beautiful Name, Goodness of God, Living Hope, Way Maker, Great Are You Lord) are excluded and should be *linked to*, not rebuilt. Worth noting that two of them sit on the arbitrage list anyway: **Way Maker** has 1.26M tutorial views and **Great Are You Lord** has 368k views against only 2 competing vendors. We already own high-demand, low-supply ground and aren't promoting it.

**Column key.**
`Arch` = archetype (A1–A7 above). `Ev` = evidence grade: **A** = attributed, per-track or sole-player; **B+** = tribute-tier with unusually well-documented house rig; **B** = tribute-tier. `Diff` = research difficulty to reach a buildable recipe. `Demand` = top YouTube electric-guitar tutorial/playthrough view count (live-scraped 2026-07-25) + number of the five patch vendors carrying it — **vendor count near zero against high views is the arbitrage signal.**

### Tier 1 — build first 15

Highest confidence × highest demand. Nine of these have either Grade A evidence or a demand/supply gap wide enough to rank on its own.

| # | Song | Artist | Yr | Guitarist | Arch | Rig evidence | Diff | Demand | Ev |
|--:|---|---|--:|---|:--:|---|:--:|---|:--:|
| 1 | **Praise** | Elevation Worship | 2023 | **E Edwards** (lead) + **Joey Signa** (rhythm) | A4→A5 | Per-song in-ear mix w/ full chain + official playthrough credits ([rundown](https://www.youtube.com/watch?v=b7Tw6lcRs7c), [in-ear series](https://www.youtube.com/watch?v=92dE2bEuidg)) | Easy | **1.37M** · 5 vendors | **A** |
| 2 | **Reckless Love** | Cory Asbury | 2017 | **Dwayne Larring** + **Gabe Scott** | A1→A2 | Full album credits; Ingram/Mabury, Spencer Creek Studio. **Nashville session record, not the Bethel house band** | Easy | **582k** · **2** ← gap | **A** |
| 3 | **This Is Amazing Grace** | Phil Wickham | 2013 | session (unverified) | A2 | No per-track credit. Signature intro riff is fully transcribable from the record | Med | **903k** · 4 · PC-Helix #13 | B |
| 4 | **Cornerstone** | Hillsong | 2012 | Hendroff era | A3→A4 | Hendroff's AC15/Spitfire stereo + Prism→Bloom front end is first-party documented | Med | **476k** (+155k WT) · **1** ← **biggest arbitrage in the catalogue** | B |
| 5 | **So Will I (100 Billion X)** | Hillsong UNITED | 2017 | Chislett / Hendroff era | A1 | Album-level credit only | Med | **460k** · **2** ← gap | B |
| 6 | **Gratitude** | Brandon Lake | 2020 | unverified | A1→A4 | Needs the artist-rig pass | Hard | **406k** · 4 · CCLI weekly #3 | B |
| 7 | **Raise a Hallelujah** | Bethel Music | 2019 | *Victory* pool: Ed Cash · Scott Cash · David Hislop · Jonathan Lee · Michael Pope | A4 | **Full *Victory* liner credits** (album-level). Driving electric, not a pad | Easy | **371k** (+215k WT) · 4 · **PC-Helix #4** | **B+** |
| 8 | **Another in the Fire** | Hillsong UNITED | 2019 | Dylan Thomas (likely) | A1→A2 | Credit exists, **rig entirely undocumented** | Hard | **317k** · 3 | B |
| 9 | **Oceans (Where Feet May Fail)** | Hillsong UNITED | 2013 | Chislett and/or Hendroff | A3→A1 | *Zion* lists six electric guitarists and never says who played it. Chislett produced the track; his Jazzmaster/White Falcon → Matchless DC-30 rig is documented | Med | **286k** · **1** ← gap | B |
| 10 | **O Come to the Altar** | Elevation Worship | 2016 | pre-documented era | A1→A4 | Predates the in-ear-mix series — this one really is tribute-tier | Med | **260k** · 4 · PC-Helix #17 | B |
| 11 | **Glorious Day** | Passion / Kristian Stanfill | 2017 | unverified | A4 | Needs the artist-rig pass | Med | **211k** (+110k WT) · **5** · PC-Helix #7 | B |
| 12 | **Holy Forever** | Chris Tomlin | 2022 | Daniel Carson (long-time Tomlin lead — verify) | A2→A4 | Needs the artist-rig pass | Med | **192k** (+117k WT) · 4 · **CCLI weekly #2** | B |
| 13 | **Graves Into Gardens** | Elevation Worship | 2020 | **E Edwards** + **Joey Signa** | A1→A4 | Dove Awards in-ear mix. **Unblocks backlog #1003 with evidence, not a downgrade** | Easy | 82k (+36k WT) · 4 · PC-Helix #9 | **A** |
| 14 | **Egypt** | Cory Asbury | 2020 | **David Hislop** | A5 | **Official Hislop tutorial + his own preset.** Board fully documented; he sells Helix/HX Stomp patches at [tonefactor.co](https://www.tonefactor.co/davidhislop) | **Easy** | 111k · 4 | **A** |
| 15 | **See a Victory** | Elevation Worship | 2019 | **E Edwards** + **Joey Signa** | A4 | Per-song in-ear mix w/ full chain | Easy | 105k · **5** | **A** |

### Tier 2 — next 20

Real demand and a real part; either the evidence needs one more hop or the demand is a tier lower.

| # | Song | Artist | Yr | Guitarist | Arch | Rig evidence | Diff | Demand | Ev |
|--:|---|---|--:|---|:--:|---|:--:|---|:--:|
| 16 | **No Longer Slaves** | Bethel Music | 2015 | unresolved | A1 | Predates *Victory* credits | Hard | 304k · **2** ← gap | B |
| 17 | **Who You Say I Am** | Hillsong Worship | 2018 | Hendroff | A3 | Piano-led song; the electric part is small but real — say so | Med | 193k (WT Helix) · 4 · PC-Helix #20 | B |
| 18 | **Rattle!** | Elevation Worship | 2020 | "Brad" per Worship Tutorials — custom part-caster **baritone** + stock Elliott Tonemaster, **board into Kemper** | A5 | Official "Electric Guitar Parts" video exists but names no player. Tremolo + phaser rhythm pair is the distinguishing detail | Med | 204k (official) · 3 | B |
| 19 | **Battle Belongs** | Phil Wickham | 2020 | session (unverified) | A2→A4 | **Unblocks #1008.** Key Db, ~72 BPM half-time | Med | 150k (WT Helix) · 4 | B |
| 20 | **Firm Foundation (He Won't)** | Cody Carnes | 2021 | Jordan Holt (Carnes' touring guitarist — verify) | A2→A4 | Holt has a documented Matchless-based rig | Med | 131k (WT) · **5** · CCLI weekly #9 | B |
| 21 | **King of Kings** | Hillsong Worship | 2019 | Hendroff (unconfirmed on the *Awake* master) | A2 | **Unblocks #1006.** 68 BPM, key D, **dotted-SIXTEENTH delay** — the teachable hook | Med | 122k · **5** · PC-Helix #16 | B |
| 22 | **Jireh** | Elevation × Maverick City | 2021 | **E Edwards** + **David Liotta** | A3 | In-ear mix shows **P40 Warhawk → HX Stomp only** — unusually simple, and directly relevant to our HX Stomp gap | Easy | 101k (official) · 3 · PC-Helix #12 | **A** |
| 23 | **Build My Life** | Housefires / Pat Barrett | 2016 | unresolved | A3→A1 | **Unblocks #1005.** Key G, 70 BPM | Hard | 114k · 3 · PC-Helix #18 | B |
| 24 | **Same God** | Elevation Worship | 2022 | presumed E Edwards + Signa | A1→A4 | In the in-ear-mix era but **no official credit located** — one hop from Grade A | Med | 110k (+104k WT) · 3 · CCLI usage #26 | B |
| 25 | **O Praise the Name (Anástasis)** | Hillsong Worship | 2015 | Hendroff era | A2→A4 | Album-level | Med | 108k · 3 · CCLI usage #36 | B |
| 26 | **Resurrecting** | Elevation Worship | 2016 | pre-documented era | A1→A4 | Predates in-ear mixes | Med | 124k · 2 | B |
| 27 | **Forever** | Kari Jobe | 2014 | unverified | A1→A4 | Needs the artist-rig pass | Hard | 112k (WT) · ~3 | B |
| 28 | **Great Things** | Phil Wickham | 2018 | session (unverified) | A4 | — | Med | 85k · 4 · CCLI usage #29 | B |
| 29 | **House of the Lord** | Phil Wickham | 2021 | session (unverified) | A4→A5 | **Unblocks #1010.** Key Bb, 86 BPM | Med | 79k · **5** · CCLI usage #12 | B |
| 30 | **Do It Again** | Elevation Worship | 2017 | **E Edwards** (Elliott 135) + **Joey Signa** | A1 | In-ear mix (2022 tour cut) | Easy | — · CCLI usage #75 | **A** |
| 31 | **Never Lost** | Elevation Worship | 2019 | **E Edwards** + **David Liotta** | A4 | Official tutorial + in-ear mix; a [QC preset breakdown](https://www.guitaremerge.com/store-home/p/elevation-worship-never-lost-quad-cortext-preset) exists | Easy | — | **A** |
| 32 | **LION** | Elevation Worship | 2022 | **E Edwards** | A5 | Official tutorial + in-ear mix | Easy | — | **A** |
| 33 | **Trust in God** | Elevation Worship | 2023 | **E Edwards** + **Joey Signa** | A4 | Official playthrough credits | Easy | 34k · 3 · **CCLI weekly #5** | **A** |
| 34 | **10,000 Reasons** | Matt Redman | 2011 | unverified | A3 | Low tone-specificity — an old song where the recipe is technique, not gear | Hard | 137k · **1** · **PC-Helix #1** | B |
| 35 | **The Blessing** | Elevation / Kari Jobe / Cody Carnes | 2020 | **E Edwards** | A1 | Gospel Revamp in-ear mix. **Part is genuinely thin — build as an honest pad recipe, not a lead** | Easy | 136k · 4 · **PC-Helix #3** | **A** (player) |

### Tier 3 — remaining 15, and why they're lower

| # | Song | Artist | Yr | Guitarist | Arch | Diff | Demand | Ev | Why Tier 3 |
|--:|---|---|--:|---|:--:|:--:|---|:--:|---|
| 36 | **Death Was Arrested** | North Point Worship | 2015 | unresolved | A3→A4 | Hard | 83k · 2 | B | No credit path found; Easter-only usage |
| 37 | **Surrounded (Fight My Battles)** | UPPERROOM | 2018 | unverified | A1 | Hard | 74k · 2 | B | Distinctive ambience but zero rig documentation |
| 38 | **Promises** | Maverick City Music | 2020 | unresolved | A3 | Hard | 73k · **0 vendors** | B | **Zero competing supply** — but Maverick City has contracted to two live songs and no rig data exists |
| 39 | **Everlasting God** | Lincoln Brewster | 2006 | **Lincoln Brewster** | A6 | **Easy** | low search · 0 | **A** | **Grade A and zero coverage** — but 2006 congregational usage is past peak. Ranked here on demand, not on quality. *The A6 archetype has no other representative; build it regardless.* |
| 40 | **Today Is the Day** | Lincoln Brewster | 2008 | **Lincoln Brewster** | A6 | Easy | low · 0 | **A** | Same |
| 41 | **Your Grace Is Enough** | Lincoln Brewster | 2008 | **Lincoln Brewster** | A6 | Easy | low · 0 | **A** | Same; CCLI usage #80 keeps it alive |
| 42 | **The Lion and the Lamb** | Big Daddy Weave / Leeland | 2016 | unverified | A4→A5 | Hard | mid · **PC-Helix #11** | B | Strong Helix-patch demand, no rig path |
| 43 | **Hosanna** | Hillsong UNITED | 2007 | Hendroff | A2 | Med | mid | B | Iconic intro riff, declining rotation |
| 44 | **Mighty to Save** | Hillsong Worship | 2006 | Hendroff | A2 | Med | mid · CCLI usage #81 | B | Rhythm/octave more than lead |
| 45 | **How Great Is Our God** | Chris Tomlin | 2004 | Daniel Carson (verify) | A2 | Med | mid · **CCLI weekly #8** | B | Very high usage, very low tone-specificity — the guitar isn't the point |
| 46 | **Yes I Will** | Vertical Worship | 2018 | unverified | A4 | Hard | 54k · 4 | B | Middling on every axis |
| 47 | **Holy Water** | We The Kingdom | 2019 | unverified | A5 | Hard | 34k · 2 | B | Real guitar content, soft demand |
| 48 | **Washed** | ELEVATION RHYTHM | 2025 | Elevation Rhythm band (not E Edwards) | A5 | Hard | riser · **CCLI weekly #16** | B | **Fastest riser in the data.** Tier 3 only because no rig documentation exists yet — re-rank the moment a 2026 rundown drops |
| 49 | **Who Else** | Gateway Worship / Abbie Gamboa | 2024 | unverified | A1→A4 | Hard | riser · **CCLI weekly #13** | B | Same: top-20 congregational, zero rig data |
| 50 | **I Know a Name** | Elevation / Chris Brown / Brandon Lake | 2025 | presumed E Edwards | A4 | Med | **PC New-2025 #1** | B | Newest Elevation entry; likely jumps to Tier 1 once an in-ear mix appears |

### Songs deliberately excluded (and why)

Not padding the list is the point. These are all top-100 CCLI songs that **fail the electric gate**:

| Song | Rank | Why excluded |
|---|---|---|
| **I Speak Jesus** | CCLI usage #10 | Electric is a pad. Top-10 everywhere. *Partial exception:* it's **PC-Helix #10**, so an honest A1-only recipe is defensible — but never sell it as a lead tone |
| **Thank You Jesus for the Blood** | CCLI #48, Easter #2–4 | Organ, vocal and gospel groove. **The clearest popularity-without-a-tone trap in worship** — it ranks top-5 on Easter lists and has essentially no guitar. It appears in `WORSHIP_HELIX_CONTENT_CLUSTER.md`'s Tier-2 list; it should stay a blog post and never become a recipe |
| **Lord I Need You** | CCLI weekly #12 | Piano ballad |
| **Good Good Father** | CCLI usage #47 | Acoustic-driven |
| **The Heart of Worship** · **Here I Am to Worship** · **Open the Eyes of My Heart** · **Revelation Song** | #58 / #42 / #50 / #41 | Legacy repertoire, no identifiable electric |
| **How Great Thou Art** · **In Christ Alone** · **Yet Not I But Through Christ** · **His Mercy Is More** · **Jesus Paid It All** | #23 / #27 / #39 / #54 / #62 | Modern-hymn tier — largely acoustic/orchestral. *Caveat:* In Christ Alone is PC-Helix #5 and Jesus Paid It All #6, so there **is** Helix demand. Revisit as a "modern hymns on Helix" cluster, not as song recipes |
| **I Thank God** | CCLI usage #9 | Gospel; guitar is comping |
| **Worthy of It All** | CCLI weekly #7 | Spontaneous-worship ambience — buildable as pure A1 only |
| **Mary Did You Know** · **O Holy Night** · **Sing We the Song of Emmanuel** | Christmas top 20 | See the Christmas SKIP list |
| Anything by **Forrest Frank** | streaming hit | **Zero appearances on any congregational chart.** Not church repertoire |

---

## Coverage check

| Artist / lane | Songs in the 50 | Grade A | Note |
|---|--:|--:|---|
| Elevation Worship (+ Rhythm) | **12** | **8** | The in-ear-mix series is the single highest-leverage source in worship guitar |
| Hillsong (Worship / UNITED) | 8 | 0 | All tribute-tier; Hendroff's *rig* is first-party, per-song attribution never is |
| Phil Wickham | 4 | 0 | No per-track credits published for any album |
| Bethel / Cory Asbury | 4 | 2 | *Victory* liners + *Reckless Love* credits carry it |
| Lincoln Brewster | 3 | **3** | Only A6 representation; **clearest open lane, zero competitor coverage** |
| Chris Tomlin / Passion | 3 | 0 | Daniel Carson attribution still unverified |
| Maverick City / UPPERROOM / Gateway / misc | 8 | 0 | Weakest evidence in the backlog |
| Housefires / Cody Carnes / North Point / We The Kingdom | 5 | 0 | — |

**Archetype coverage:** A1 ×13 · A2 ×10 · A3 ×7 · A4 ×15 · A5 ×7 · A6 ×3 · A7 ×2 (as secondary). Every archetype has at least three songs, so the Set Builder has a real ingredient library for each snapshot role.

---

## Seasonal blocks

### The seasonal trap: CCLI ranks the song, PraiseCharts ranks the arrangement

This matters more at Christmas than anywhere else in the catalogue. CCLI's Christmas Top 20 is dominated by public-domain carols — "O Come All Ye Faithful," "Joy to the World (Antioch)," "Silent Night," "Hark! The Herald" — because a church reports *the hymn*, regardless of whose recording the band is actually copying. **CCLI Christmas rank tells you what gets sung and nothing about which record the guitarist is chasing.** PraiseCharts sales rank does, and there Chris Tomlin dominates (18 of the top 40).

Build to the **arrangement**, never the song title. "O Come All Ye Faithful" is not one recipe — it's at least three, and only one of them has an electric guitar part.

Second warning, from the same data: a large share of the actual 2025–26 PraiseCharts Christmas chart is **choral/orchestral SATB** (the #1 and #5 slots are both Travis Cottrell arrangements). That is the real Christmas worship market and it is **not our customer**. The addressable slice is much narrower than the raw chart implies — which is why the Christmas block below is 10 and not 15.

Third warning, and it catches most blogs: PraiseCharts' list slugged `top-100-christmas-worship-songs` is **not Christmas repertoire** — it is a season-window sales list whose top five are King of Kings, Goodness of God, Holy Forever, Worthy of It All and What a Beautiful Name. It measures what churches bought during Advent. Don't build a Christmas pack off it.

The best available *repertoire universe* (not a rank order) is CCLI's own [Top Christmas Worship Songs](https://open.spotify.com/playlist/4poQ3KR8O0yAXZsmMutfrS), described by CCLI as "the most popular Christmas worship songs as reported by licensed churches." The **membership is authoritative; the running order is not** (positions 1–8 are Spanish-language and niche tracks, which cannot be the most-used church Christmas songs). Treat it as the candidate pool the table below was filtered from.

### Christmas 10 — **build-by: live 15 September 2026**

The incumbent gap is real and worth naming: Worship Tutorials' Christmas catalogue is chords, multitracks and a **MainStage keys patch**. Their Christmas bundle is built for keyboard players. Nobody has shipped a Christmas *electric guitar* pack.

| # | Song / Arrangement | Artist (year) | Archetype | Electric verdict | Evidence |
|--:|---|---|---|---|---|
| C1 | **Joy to the World (Unspeakable Joy)** | Chris Tomlin (2009) | A4 → A6 | **STRONG** — driving rock treatment, genuine riff content. The Christmas anchor. | B+ |
| C2 | **Hark! The Herald Angels Sing (King of Heaven)** | Paul Baloche | A4 | **STRONG** — anthemic, electric-led | B |
| C3 | **O Come All Ye Faithful (His Name Shall Be)** | Passion / Melodie Malone | A4 + A2 | **STRONG** — Passion band is electric-forward | B |
| C4 | **Angels (Glory to God)** | Phil Wickham | A2 / A4 | **STRONG** | B |
| C5 | **Christmas Day** | Chris Tomlin ft. We The Kingdom (2020) | A5 | **STRONG** — modern pop-rock, driven electric | B |
| C6 | **Here Comes Heaven** | Elevation Worship (2018) | A5 / A1 | **STRONG** — Elevation's guitar language, Christmas-shaped | B |
| C7 | **Hope Has a Name** | Passion / Kristian Stanfill | A4 | **STRONG** | B |
| C8 | **Light of the World** | Lauren Daigle (2016) | A1 → A4 | **MODERATE** — ballad; the electric carries the lift | B |
| C9 | **Noel** | Chris Tomlin / Lauren Daigle (2015) | A1 | **MODERATE — ambient only.** Piano/vocal song; guitar is swell texture. Build it *as* the swell recipe, don't oversell a lead. | B |
| C10 | **Silent Night (candlelight/ambient arrangement)** | generic modern arrangement | A1 | **THIN as a record, ESSENTIAL as an archetype.** The single most-played Christmas Eve moment. Frame it explicitly as "how to build the candlelight pad," not as a cover of one recording. | B (arrangement-agnostic) |

**Bench (build only if the 10 land well):** He Shall Reign Forevermore (Tomlin) · Born Is the King (It's Christmas) (Hillsong) · Emmanuel (Hallowed Manger Ground) (Tomlin, ambient) · Go Tell It (Gloria) (Matt Maher / Zach Williams) · What a Glorious Night (Sidewalk Prophets).

**Christmas SKIP list — do not build these, the electric part is not there:** Mary Did You Know · O Holy Night · Away in a Manger · O Little Town of Bethlehem · What Child Is This · It Came Upon a Midnight Clear · Do You Hear What I Hear · Sing We the Song of Emmanuel (Getty/Boswell — orchestral-choral) · Come Thou Long Expected Jesus · the entire Travis Cottrell / Mason Brown SATB tier.

### Easter 10 — **build-by: live 8 January 2027** (Easter Sunday = 28 March 2027)

Easter is the stronger pack and the better first product: the repertoire comes from Elevation / Hillsong / Passion / Wickham, bands built around electric guitar.

**Two Easter signals, and they disagree — you need both.**
- **Editorial Easter lists** ([Worship Online](https://worshiponline.com/top-easter-worship-songs/), [Worship Artistry](https://worshipartistry.com/greenroom/songs/lists/top-worship-songs-for-easter), [Worship Leader](https://worshipleader.com/worship-culture/top-20-worship-songs-for-easter/)) converge tightly on resurrection repertoire. This is what a worship leader *searches for* in February, which makes it our SEO signal.
- **PraiseCharts' [Top 100 Easter Worship Songs](https://www.praisecharts.com/song-lists/top-100-easter-worship-songs)** (API-pulled, updated 2026-07-25) is a **season-window sales** list — it measures what churches bought during the Easter window, not what they sang on Easter morning. That's why its top 8 includes Washed, Holy Forever, Who Else and Trust In God, none of which are resurrection songs. Use it as a *supporting* signal only, on the resurrection titles.

The ranked ten below only includes songs that clear **both** filters plus the electric-guitar gate.

| # | Song | Artist (year) | Archetype | Electric verdict | Chart evidence | Grade |
|--:|---|---|---|---|---|---|
| E1 | **Living Hope** | Phil Wickham (2018) | A1 → A4 | **STRONG** — huge chorus build | CCLI usage #18; PC Easter #22 | ✅ **shipped** (`moore-living-hope`) — reuse, don't rebuild |
| E2 | **This Is Amazing Grace** | Phil Wickham (2013) | A2 | **STRONG** — signature intro riff; one of the most-searched worship guitar parts anywhere | CCLI usage #21; PC Easter #20; **PC Helix-patch list #13** | B |
| E3 | **Graves Into Gardens** | Elevation / Brandon Lake (2020) | A1 → A4 | **STRONG.** Unblocks backlog #1003 under the tribute-tier rule. | CCLI weekly #14, usage #13; PC Easter #31; **PC Helix-patch list #9** | B |
| E4 | **Glorious Day** | Passion / Kristian Stanfill (2017) | A4 | **STRONG** — driving electric throughout | CCLI usage #19; PC Easter #33; **PC Helix-patch list #7** | B |
| E5 | **O Praise the Name (Anástasis)** | Hillsong Worship (2015) | A2 → A4 | **STRONG** — soaring lead over a massive ambient bed | CCLI usage #36; editorial Easter #3 | B |
| E6 | **King of Kings** | Hillsong Worship (2019) | A2 (dotted-**16th** at 68 BPM) | **MODERATE** — anthemic but piano-anchored. The dotted-sixteenth is the teachable hook. | CCLI usage #20; PC Easter #28; **PC Helix-patch list #16** | B (unblocks #1006) |
| E7 | **The Blood** | Bethel / David Funk | A1 → A4 | **MODERATE** | PC Easter **#11** — highest-ranked genuine resurrection song on the sales list | B |
| E8 | **Death Was Arrested** | North Point Worship (2015) | A3 → A4 | **MODERATE–STRONG** — the quiet-to-huge dynamic *is* the recipe | CCLI usage #76; PC Easter #92; editorial #9 | B |
| E9 | **Forever** | Kari Jobe (2014) | A1 → A4 | **STRONG** — big resurrection build | PC #90; editorial #11 | B |
| E10 | **Christ Is Risen** | Matt Maher (2009) / Mack Brock | A4 | **MODERATE–STRONG** | editorial #13 | B |

**Bench:** Christus Victor (Amen) — Getty / Cochren & Co (PC Easter #30, rising) · He Arose — Tommee Profitt & Phil Wickham (PC 2026 #20, brand new) · Resurrecting (Elevation) · See a Victory (Elevation).

> **⚠️ Conflict flagged — RATTLE! (Elevation, 2020).** One research stream called it the Easter flagship on the strength of unusually well-documented guitar content (two distinct rhythm parts — one tremolo, one phaser — plus clean intro/verse and an ambient-swell-with-drive section; guitarist "Brad" on a custom part-caster baritone and a stock Elliott Tonemaster, board into a Kemper, per [Worship Tutorials](https://worshiptutorials.com/tutorials/rattle-elevation-worship/)). The chart stream found the opposite: **Rattle! does not appear in any current Easter or general top-50 list** — only at #93 in a stale snapshot. Both are true. It peaked 2020–22 and has fallen out of rotation, but it remains the single best-documented Elevation guitar part we have found. **Verdict: build it, but as an archetype showcase (A5) and a Brewster-adjacent rock-worship entry — not on a "churches are playing this now" premise.** Same caution applies to **Resurrecting** and **See a Victory**: real songs, no current Easter chart presence.

**Also Easter-eligible, already in the main 50:** Praise (Elevation), House of the Lord (Phil Wickham), Battle Belongs (PC Easter #21), Who You Say I Am (PC Easter #23), O Come to the Altar (PC Easter #24).

**Easter SKIP list — and one of these is a trap worth naming:**
- **Thank You Jesus for the Blood** (Charity Gayle) ranks **#2–#4** on Easter lists and the guitar is essentially absent — it is organ, vocal and gospel groove. This is the single clearest example of the popularity-without-a-tone trap. Do not let its CCLI rank pull it into a build queue.
- **Raise a Hallelujah** (Bethel) — ambient-forward, genuinely thin on discrete parts. Skip as a *song* recipe; it is fine as an A1 archetype demo.
- Also skip: Because He Lives (Amen) · Is He Worthy (orchestral-folk) · Glorious Day (Living He Loved Me) — Casting Crowns · Alive (Big Daddy Weave) · Hallelujah for the Cross.
- **What a Beautiful Name** is famous at Easter but the guitar is supporting, MODERATE at best. We already have it (`hendroff-what-a-beautiful-name`); don't build a second Easter-framed version.

### Seasonal build calendar

| Date | Action |
|---|---|
| **2026-08-01** | Christmas block research locked; arrangement chosen per song (this is the step that goes wrong) |
| **2026-09-15** | **Christmas 10 live** + Christmas Set Pack + IndexNow submit |
| 2026-10-01 → 11-30 | Christmas capture layer: newsletter, hub banner, r/worshipguitar (human-posted) |
| 2026-12-24 | Christmas Eve (**Thursday** — standalone candlelight service) |
| **2026-11-15** | Easter block research locked |
| **2027-01-08** | **Easter 10 live** + Easter Set Pack + IndexNow submit |
| 2027-02-10 | Ash Wednesday — teams have already chosen by now |
| 2027-03-21 / 03-28 | Palm Sunday / **Easter Sunday** |

---

## Set Pack candidates

Rules these were built against (from `research/SET_PATCH_STRATEGY.md` and the 2026-07-25 set-level findings): **one base amp per pack** (a set spanning a Vox and a Plexi through one amp block is a lie), 8 snapshots as **roles not songs**, the Setlist Mapper is the join table `(song, section) → role`, and every compromise gets a disclosed `fidelity: native | close | compromise` flag linking back to that song's own recipe.

Each pack below compiles cleanly because its songs share both a base amp **and** an archetype cluster.

### SP1 · "Elevation Sunday" — 6 songs
**Base amp:** `A30 Fawn Brt` with `Compulsive Drv` carrying the grit (see caveat).
**Songs:** Praise (#1) · Graves Into Gardens (#13) · See a Victory (#15) · Same God (#24) · Trust in God (#33) · O Come to the Altar (#10)
**Grade A on five of six** — the only Set Pack in the catalogue that can name the players and cite their chains.
**Archetype spread:** A1 (swells) → A4 (driven chorus) → A5 (rock rhythm). Uses 7 of 8 snapshots.
**Why it compiles:** one band, one production era, one guitar language. Also the highest-demand pack we could ship — Elevation is ~⅓ of all current risers.
**⚠️ Honest caveat that must ship with it:** Elevation's one *documented* board (E Edwards) is a **Quad Cortex / HX Stomp modeler rig, not an analog AC30 pedalboard**. The AC30 base is our *reconstruction* choice for a coherent set preset, not their gear. Say so in the setup guide, or we repeat the exact error that got backlog #1003 skipped.

### SP2 · "Ambient Worship Essentials" — 6 songs
**Base amp:** `A30 Fawn Brt` at Drive 3.5–4 (or `Essex A15` for smaller rooms).
**Songs:** Goodness of God ✅ · Raise a Hallelujah (#7) · No Longer Slaves (#16) · Do It Again (#30) · The Blessing (#35) · Surrounded (#37)
**Archetype spread:** almost pure A1/A3 — snapshots weight toward CLEAN AMBI, SWELLS and SHIMMER rather than the drive ladder.
**Why it compiles:** these are the same tone at different reverb depths. It is the easiest pack to build and the one that most directly answers "I'm the only guitarist and I need to sound like a record."
**Demand proof:** The Blessing is **#3** and Raise a Hallelujah **#4** on PraiseCharts' Helix-patch list — two of the four highest-demand Helix worship patches in existence are in this pack.
**Mono warning:** this pack is the highest mono-cancellation risk in the catalogue (stacked long stereo reverbs). Ship a mono-safe variant or a documented "one side out" instruction.

### SP3 · "Hillsong Standards" — 6 songs
**Base amp:** `A30 Fawn Brt` + `Minotaur` always-on (the Hendroff formula, with the Prism correction already documented in `hendroff-what-a-beautiful-name`).
**Songs:** What a Beautiful Name ✅ · Cornerstone (#4) · Oceans (#9) · Who You Say I Am (#17) · King of Kings (#21) · Mighty to Save (#44)
**Archetype spread:** A3 (clean arpeggio) and A2 (dotted-eighth) with one A4 lift. The cleanest archetype fit of any pack.
**Why it compiles:** genuinely one rig across two decades of records. The only per-song deltas that matter are BPM and delay subdivision — **and King of Kings is a dotted-*sixteenth* at 68 BPM, not a dotted-eighth**, which is exactly the kind of thing a Setlist Mapper exists to tell you.
**Demand proof:** four of the six are on PraiseCharts' Helix-patch top 20.

### SP4 · "Christmas Eve Service" — 6 songs — **ship by 15 Sep 2026**
**Base amp:** `A30 Fawn Brt`, low drive, ambience-forward.
**Songs:** Silent Night (candlelight arrangement) · Noel · O Come All Ye Faithful (His Name Shall Be) · Joy to the World (Unspeakable Joy) · Hark! The Herald (King of Heaven) · Light of the World
**Archetype spread:** A1-heavy with two A4 lifts. Snapshot layout should be re-weighted for the service, not the setlist: three swell/pad states, one clean, two driven.
**Why it's the commercial bet:** Worship Tutorials' entire Christmas offering is chords, multitracks and a **MainStage keys patch**. Nobody has shipped a Christmas electric guitar pack. Christmas Eve 2026 is a **Thursday** — a standalone, more-produced candlelight service.

### SP5 (stretch) · "Rock Worship" — 5 songs
**Base amp:** `Plexi 100W High` (Brewster) / `Brit Plexi Brt`, Greenback 4x12.
**Songs:** Rattle! (#18) · Everlasting God (#39) · Today Is the Day (#40) · Your Grace Is Enough (#41) · The Lion and the Lamb (#42)
**Archetype spread:** A6 + A5. **No dotted-eighth anywhere in this pack** — that is the tell.
**Why it exists:** it serves the half of the worship world the ambient packs ignore, and Lincoln Brewster is our **clearest open lane — zero coverage today, a full research doc already written**. It is also the only pack that can't be built on an AC30, which is precisely why it's a separate product rather than a snapshot inside SP1.

---

## Research seeds — where a builder should start

Sources already proven productive, plus the specific per-song starting points for Tier 1. **Do not let the pipeline start from a search engine on these — start here.**

### Standing sources (good across the whole backlog)
| Source | What it's good for |
|---|---|
| [Renewing Worship weekly CCLI Top 20](https://www.renewingworshipnc.org/top20/) | Current rank; refresh before each build wave |
| [Worship Artistry CCLI usage Top 99](https://worshipartistry.com/greenroom/songs/lists/most-popular-worship-songs) | The durable-core ranking |
| PraiseCharts `line-6-helix-patches-for-top-christian-worship-songs` | Demand proxy for exactly our product |
| [Worship Tutorials song pages](https://worshiptutorials.com/) | Per-song key/BPM/arrangement + occasional gear notes ("Brad's rig: board into Kemper") |
| [stompbox.sg — pedalboards you've heard in Christian music](https://www.stompbox.sg/single-post/guitar-pedalboards-youve-heard-in-christian-music) | Already cited in `hislop-goodness-of-god`; broad worship board coverage |
| Discogs release credits | The only reliable per-track credit source; how Stu Garrard got Grade A |
| Elevation Worship official **Gear Rundown** videos (David Liotta / E Edwards / Kevin Smith) | Touring-roster rigs — Grade B evidence, **not** per-track proof |
| [Worship Leader Research](https://worshipleaderresearch.com/) | Methodology, not charts. Read the Sept-2024 CCLI piece before citing any rank |

### Per-song seeds for the Tier 1 fifteen

| # | Song | Start here |
|--:|---|---|
| 1 | **Praise** | E Edwards [gear rundown](https://www.youtube.com/watch?v=b7Tw6lcRs7c) + his [in-ear mix series](https://www.youtube.com/watch?v=92dE2bEuidg) (chain in the description) · official Elevation playthrough (credits both players) · [Joey Signa 2023 rundown](https://www.youtube.com/watch?v=NAq5sivcO_w) for the rhythm side · Worship Tutorials' Praise preset scene list (`V1/Br1 · CH RIFF · V2/.8th · BR Build · BR/OUTRO Riff · RHY · Ambi Cln · SWELLS`) as the snapshot map |
| 2 | **Reckless Love** | Album credits (Dwayne Larring, Gabe Scott; Jason Ingram + Paul Mabury, Spencer Creek Studio) — search Larring's session credits and rig, **not** Bethel Redding's house rig |
| 3 | **This Is Amazing Grace** | No credit path — go straight to Grade B. [Worship Tutorials Helix video](https://worshiptutorials.com/) (361k views) for the arrangement; transcribe the intro riff from the record; key/BPM from PraiseCharts |
| 4 | **Cornerstone** | Hendroff first-party sources: [MultiTracks Droff collection](https://helpcenter.multitracks.com/en/collections/2808995-nigel-hendroff) (AC15 + "Spitfire", Prism→Bloom) · [Hillsong 2014 rundown](https://hillsong.com/collected/blog/2014/08/droffs-guitar-gear-rundown/) · [stompbox.sg](https://www.stompbox.sg/single-post/guitar-pedalboards-youve-heard-in-christian-music). **Do not repeat the "Matchless Spitfire" claim** |
| 5 | **So Will I** | Hillsong *Wonder* album credits (album-level) · Chislett's [Gretsch signature page](https://gretschguitars.com/features/michael-guy-chislett) + [Equipboard](https://equipboard.com/pros/michael-guy-chislett) for the Jazzmaster/White Falcon → Matchless DC-30 rig |
| 6 | **Gratitude** | ⚠️ Rig path unresolved — needs the Brandon Lake artist pass before building. Known: PRS Custom 24 w/ Lambertones, partscaster Tele, POD Go patches exist for his catalogue |
| 7 | **Raise a Hallelujah** | ***Victory* (2019) liner credits** — the single best Bethel anchor · [Jonathan Lee's board](https://www.jonathanleeguitar.com/) · [David Hislop patches](https://www.tonefactor.co/davidhislop) · [Gretsch on Hislop](https://blog.gretschguitars.com/2019/08/bethel-musics-david-hislop-chimes-in-on-the-expressive-gretsch-tone/) (already cited in our Goodness of God recipe) |
| 8 | **Another in the Fire** | ⚠️ Dylan Thomas is credited on *Empires* and *Are We There Yet?* but **has no rig documentation anywhere**. Build Grade B off the Hillsong UNITED house rig; do not invent his board |
| 9 | **Oceans** | *Zion* album credits (six electric guitarists, no per-track) · Chislett produced the track — his rig is the defensible reconstruction · our own `WORSHIP_PRODUCTION_NOTES.md` already has a layer-by-layer breakdown of this song |
| 10 | **O Come to the Altar** | Pre-dates Elevation's documented era. Grade B off the Elevation 2016 house sound; **do not** apply E Edwards' current QC/HX Stomp rig retroactively |
| 11 | **Glorious Day** | ⚠️ Passion guitarist unresolved · [Worship Tutorials Helix video](https://worshiptutorials.com/) (110k views) for arrangement · PC-Helix #7 confirms demand |
| 12 | **Holy Forever** | ⚠️ Verify Daniel Carson as Tomlin's lead player before naming him · Worship Tutorials tutorial (117k views) · CCLI weekly #2 |
| 13 | **Graves Into Gardens** | E Edwards' **Dove Awards in-ear mix** · read `RECIPE_BACKLOG.md` #1003 first — it records who *not* to credit (Jonsal Barrientes is a vocalist) |
| 14 | **Egypt** | **Easiest Grade A build in the whole backlog.** David Hislop's own tutorial + his own preset at [tonefactor.co/davidhislop](https://www.tonefactor.co/davidhislop); board at [stompbox.sg](https://www.stompbox.sg/single-post/guitar-pedalboards-youve-heard-in-christian-music). His amps are the one gap — say so |
| 15 | **See a Victory** | E Edwards per-song in-ear mix (full chain in description) + Joey Signa's rhythm rundown |

### Known dead ends — don't spend the pipeline's budget here
- **Per-track electric-guitar credits for Hillsong, Elevation, Bethel or Phil Wickham studio records.** They are not published. Hillsong's Zion lists six electric guitarists and never says who played Oceans. This was re-confirmed twice. Go straight to Grade B.
- `worshipflow.com/top-25-ccli` — returned a **different rank order** on two fetches days apart. Membership plausible, order fabricated. Don't cite for ranks.
- PraiseCharts' `ccli-top-100-united-states` page — self-reports "Last Updated: December 1, 2022."
- Live CCLI SongSelect Top 100 — JS SPA behind a Cloudflare-gated data host. Not fetchable.
- `worshipleader.com` — returns HTTP 403 to automated fetching. Open manually if needed.
- **Davide Mutendji** is an Elevation Rhythm member/songwriter, **not** a confirmed electric guitarist on these recordings. **Jonsal Barrientes is a vocalist.** Both names circulate in worship-guitar forums as Elevation's guitarist. Both are wrong. (The Jonsal error is already recorded in `RECIPE_BACKLOG.md` #1003.)

---

## Honesty notes — what is genuinely undocumented

Recorded here so the pipeline stops re-litigating them, and so the recipes say the right thing on the page.

**Permanently tribute-tier (no per-track credit will ever be found):**
- Every **Hillsong** song. Album-level credits only, by policy. Hendroff's *rig* is first-party and excellent; his *per-song presence* is inference from his MD role.
- Every **Phil Wickham** studio track except Living Hope (where Casey Moore is verified). *Hymn of Heaven* publishes songwriter and producer credits only.
- Every **pre-2019 Elevation** song — predates the in-ear-mix series.
- Every **Bethel** song at the per-track level. *Victory* gives us a five-name pool, which is Grade B+, not Grade A. **Two exceptions, both worth exploiting:** *Reckless Love* has real named session credits (Larring/Scott), and *Egypt* has David Hislop's own tutorial and his own commercial preset.
- **Housefires / Build My Life**, **North Point / Death Was Arrested**, **UPPERROOM / Surrounded**, **Maverick City / Promises**, **Gateway / Who Else**.

**Documented boards, undocumented amps** — a specific and recurring shape. Say "board documented, amp not" rather than inventing a Vox:
- **Jonathan Lee** (Bethel, current) — full pedalboard published, **amps found nowhere.**
- **David Hislop** — full board published (and he sells his own Helix patches), **amps not documented.**
- **Michael Pope** — board documented via stompbox.sg; the "AC30 in stereo with a Fender" claim is community-consensus from an interview summary, not a rundown.

**Zero documentation at all — pure reconstruction:**
- **Bobby Strand** (Bethel) — named as a primary Bethel electric player, co-wrote Ever Be and Have It All. **No rig data exists.**
- **Dylan Thomas**, **Marcus Beaumont**, **Chris Gladden**, **Tim Womble** — real credits, no gear.
- **Hillsong Young & Free** — no guitarist identified at all.

**Stale, not wrong:**
- **Hendroff's most recent solid documentation is 2019–2022.** Nothing current for 2024–26. Kemper remains his published platform; there is **no evidence he moved to Quad Cortex or Fractal**, and we should not imply one.
- **Michael Guy Chislett's** detailed pedalboard was not retrieved this pass — his guitars/amps are documented, the board isn't.
- **Elevation has no 2026 guitar rundown yet** (bass, drums and keys exist). Re-check in Q4; it would upgrade several Tier 2/3 rows.

**Where a recipe must say the part is thin.** These are high-demand songs whose electric guitar is genuinely minor. Building them is right — the demand is real and nobody explains them — but the recipe must open by saying so, and then teach *how one guitarist fills the space*, which is the actual question being asked:
> The Blessing · Who You Say I Am · Cornerstone (verse) · 10,000 Reasons · How Great Is Our God · I Speak Jesus (if built at all)

This is the same instinct as the Non-Commodity Gate. A recipe that admits "there are four notes here, and here is why the record still sounds huge" is worth more than one that fakes a lead part — and it is the only version of these six that a competitor is not already selling as a binary file.

---

## Open risks

1. **Attribution is the whole programme.** The two-grade convention is the load-bearing decision in this document. If we won't ship Grade B, the honest ceiling for worship is roughly **12 recipes**, not 50 — and eight of those twelve are Elevation.
2. **Christmas is 6 weeks out and the block isn't started.** Ship-by is 15 September 2026. It is also the harder of the two seasonal packs (thin electric content, choral-dominated market) and it competes with nothing, which is exactly why it's worth doing.
3. **The rankings themselves have a shelf life.** The CCLI chart changed meaning in Sept 2024, the current weekly data is a July 2026 snapshot, and roughly a third of risers are Elevation releases that didn't exist eighteen months ago. **Re-pull the weekly Top 20 and the PraiseCharts Helix-patch list before each build wave**, not once a year.

---

## Provenance and known limits of this research

Compiled 2026-07-25 from five parallel research streams (repertoire rankings · Elevation/Bethel/Hillsong rigs · other-artist rigs · supply-side and demand · seasonal), plus the existing corpus in `docs/research/`.

**What is verified:** all chart data cited (with source and reporting period); the CCLI methodology change; all vendor catalogue counts (sitemap/API-extracted); all YouTube view counts (live-scraped 2026-07-25); Elevation, Hendroff, Hislop and *Reckless Love* rig/credit claims; all calendar dates (computed).

**What is inferred and needs checking before publication:** release years in the riser tables · per-song archetype assignments where no breakdown exists (assigned from the recording, which is a judgement call) · the Christmas candlelight-technique characterisation, which is domain inference rather than a sourced claim.

**Known gaps, in priority order for the next research session:**
1. **Chris Tomlin / Daniel Carson attribution.** Carson is named as Tomlin's long-time lead guitarist throughout the worship-guitar world but was not verified this pass. Three songs in the 50 depend on it, including Holy Forever (CCLI weekly #2).
2. **Phil Wickham's session players.** Four songs in the 50; no per-track credit path found for any of them beyond Living Hope.
3. **Cody Carnes / Jordan Holt**, **Brandon Lake's band**, **Passion's guitarist** — each blocks a Tier 1 or Tier 2 row.
4. **Elevation's 2026 guitar rundown**, if and when it lands.

Two hard constraints shaped this pass and explain the gaps above: the session's **200-call WebSearch budget was exhausted** partway through, and the **subagent pool hit its cap**, so the later work was done via direct sitemap/API extraction rather than search. A fresh session with search budget could likely close items 1–3.
