# Helix DSP Budget — the constraint model behind Set Builder

> Firmware baseline: **Helix 3.80** (November 19, 2024), the last firmware for the
> classic SHARC line. Helix Stadium runs a different engine and is out of scope
> except where noted.
>
> Machine-readable companion: [`src/lib/helix/dsp-costs.ts`](../src/lib/helix/dsp-costs.ts)
> and [`src/lib/helix/amp-families.ts`](../src/lib/helix/amp-families.ts).

A Set Pack is a single preset that has to survive a whole setlist. Every design
decision in it — how many drives, whether the reverb is stereo, whether we can
afford a shimmer — is a negotiation with a DSP budget that Line 6 has never
published. This document is the budget.

---

## 1. How Helix DSP actually works

### It is an allocation, not a measurement

Every number in this document and in `dsp-costs.ts` is a **percentage of one
DSP**. It describes how much of the chip Line 6 *reserves* for a block, which is
what determines whether the block can be added — not how much silicon the block
actually needs:

> The values in the tables below are the upper limit of DSP reserved for each
> block. The numbers are not an indication of the processing horsepower required
> but only describe how much DSP is "blocked out" by Line 6 when determining how
> many blocks to allow in a preset.
> — Ben Vesco, *Helix DSP Allocations*

One DSP = 100 units. There is no partial credit and no borrowing.

### Two chips, two walls

Helix Floor, LT and Rack have **two SHARC DSPs**. Path 1 runs on one, Path 2 on
the other, and they do **not** pool:

> Each of Helix's two primary paths utilizes its own DSP. If all of your blocks
> are on paths 1A and 1B, you're only using half its horsepower! If you plan on
> creating tones with two or more amps and more than a handful of effects, expect
> to use both paths 1 and 2.
> — Helix 3.80 Owner's Manual, *Tips to Optimize DSP*

This is the single most commonly wasted resource on a Helix. A generated preset
that dumps everything on path 1 is using a $999 unit as a $599 one. Path 1B's
output can be routed into Path 2A to build one long serial chain across both
chips — the manual calls this out explicitly, "for one gigantic serial tone with
up to 32 block locations".

HX Stomp, HX Stomp XL and HX Effects have **one** SHARC. There is no second wall
to move blocks to. Line 6 forum staff confirm HX Effects and HX Stomp "have the
exact same processor and the same DSP allocation".

### What happens when you exceed it

Since firmware 2.x there is no "DSP LIMIT REACHED" dialog. The device silently
removes the option:

> To see which models can be added to the current path, press the joystick to
> open the Model List. **Grayed out items cannot be accommodated and are skipped
> over.**
> — Helix 3.80 Owner's Manual, *Dynamic DSP*

> If you encounter items in the list that are grayed out or unavailable, this
> means the current path (1 or 2) cannot accommodate that category, subcategory,
> or model.
> — Helix 3.80 Owner's Manual, *Selecting Blocks*

There are exactly two places you get a message instead of a grey-out:

- Pasting a block into a path that can't hold it: `Cannot Paste—Path 1 [or 2] DSP full!`
  (HX Stomp / Stomp XL: `DSP full!`)
- Exceeding controller assignments: `Too many controller assignments!` (see §5)

**Consequence for us:** a preset file we generate that exceeds DSP does not
produce a friendly error on hardware. Behaviour on load is not something we have
tested — do not ship an over-budget preset and assume the user will get a useful
message.

---

## 2. The constraint table

Every column here except the DSP budget is quoted from the 3.80 owner's manuals
and is a hard fact.

| | Helix Floor | Helix LT | Helix Rack | HX Stomp | HX Stomp XL | HX Effects |
|---|---|---|---|---|---|---|
| DSP chips | 2 | 2 | 2 | 1 | 1 | 1 |
| DSP budget | 100 per path | 100 per path | 100 per path | 100 | 100 | 100 |
| Primary paths | 2 (each A/B) | 2 (each A/B) | 2 (each A/B) | 1 (A/B) | 1 (A/B) | 1 (A/B) |
| Block locations | 32 total, 8 per sub-path | 32 | 32 | **8** | **8** | **9** |
| Amp / Amp+Cab / Preamp | 4 (2 per path) | 4 | 4 | 2 | 2 | **0** |
| Single Cab blocks | 4 (2 per path) | 4 | 4 | 2 | 2 | 0 |
| Dual Cab blocks | 2 (1 per path) | 2 | 2 | 1 | 1 | 0 |
| IR blocks | 4× 1024 (2/path), or 2× 2048 (1/path), or 2 Dual IR (1/path) | same | same | 2× 1024, 2× 2048, or 1 Dual IR | same | 4× 1024 (2/path) |
| Poly / high-DSP blocks | 1 **per path** (2 total) | same | same | 1 per preset | 1 per preset | 1 per path |
| Looper | 1 | 1 | 1 | 1 | 1 | 1 |
| Snapshots | 8 | 8 | 8 | **3** | 4 | 4 |
| Controller assignments | 64 | 64 | 64 | 64 | 64 | 64 |
| Presets | 1,024 (8 setlists × 32 banks × 4) | 1,024 | 1,024 | 126 (42×3) | 128 (32×4) | 128 (32×4) |
| Verified `.hlx` device ID | 2162689 | 2162692 | — | 2162694 | 2162696 | — |

The blocks Line 6 counts as "Polyphonic and high DSP", capped by count no matter
how much DSP is free: **Feedbacker** (Dynamics), **Poly Sustain** (Delay),
**Poly Detune** (Modulation), **Poly Pitch**, **Poly Wham**, **Poly Capo**,
**12 String** (Pitch/Synth).

### Two constraints that are not the same constraint

The HX Stomp's **8-block limit** and its **DSP limit** are independent, and
either can bite first. Both of these are real (numbers from `dsp-costs.ts`):

- **Block-limited, DSP to spare.** Comp → Kinky Boost → Scream 808 → Noise Gate →
  US Deluxe Amp+Cab → Simple EQ → Simple Delay → Plate. Eight blocks, and it is
  using **66.8%** of the DSP. You have a third of the chip free and nowhere to
  put it.
- **DSP-limited with slots empty.** US Double Amp+Cab → Poly Pitch (stereo) →
  Plateaux (stereo) → Simple EQ. Four blocks, **115.2%** — it will not build.
  Four of the eight slots are unused and unusable.

`fitsOnDevice()` reports which wall you hit as `limitingFactor`, and reports the
structural violation (block count, amp count, poly count) *before* the DSP
number, because "you used three amps" is more actionable than "you're at 140%".

---

## 3. What blows the budget

### The poly tier — half a DSP each

| Block | Mono | Stereo |
|---|---|---|
| Poly Sustain | 53.33 | 62.49 |
| Poly Pitch | 53.33 | 62.48 |
| Poly Wham | 53.33 | 62.48 |
| 12 String | 50.67 | 59.36 |
| Poly Capo | 48.00 | 56.23 |
| Poly Detune | 48.00 | 48.00 |
| Feedbacker | 29.33 | 35.79 |

One stereo Poly Pitch is 62% of an HX Stomp. Add any modern amp (30–49) and a
cab and you are over before you have added a delay. On a Helix, put the poly
block on its own path — that is what the second DSP is for.

Note the contrast: the *non-poly* pitch blocks are cheap. Twin Harmony is
8.80/17.07, Simple Pitch 7.07/13.33, Dual Pitch 9.47/18.67, Pitch Wham
6.13/8.80. "Pitch blocks are expensive" is only true of the polyphonic ones.

### Amps — 16 to 49, and the Preamp lever

Full amp block cost ranges from **16.12** (US Small Tweed) to **49.33** (EV
Panama Red, PV Vitriol Crunch/Lead). The complex modern high-gain circuits are
the expensive ones; small vintage combos and the solid-state Jazz Rivet 120
(17.15) are the cheap ones.

The **Preamp-only variant of the same model is typically 25–50% cheaper** (the
saving is largest on vintage amps, smallest on the modern high-gain ones) and is
the single biggest lever available when a chain doesn't fit:

| Amp | Full amp | Preamp only | Saved |
|---|---|---|---|
| EV Panama Red | 49.33 | 38.67 | 10.7 |
| Grammatico GSG | 41.33 | 29.33 | 12.0 |
| Brit Plexi Brt | 36.80 | 22.83 | 14.0 |
| Essex A30 | 30.32 | 16.05 | 14.3 |
| US Double Nrm | 30.99 | 16.01 | 15.0 |
| US Deluxe Nrm | 29.63 | 13.55 | 16.1 |
| Jazz Rivet 120 | 17.15 | 10.31 | 6.8 |

Preamp blocks drop the power-amp modelling. Into a real guitar amp's return that
is the *correct* choice anyway; into FRFR it is a compromise, and you should say
so to the user rather than silently downgrading their tone.

### Cabs — the 3.50 cliff

| Cab / IR | Mono | Stereo |
|---|---|---|
| Speaker cab, new engine (3.50+) | 3.33 | 6.67 |
| Speaker cab, **legacy** | 9.60 | 19.20 |
| IR 1024, new | 3.33 | 6.67 |
| IR 2048, new | 3.33 | 4.85 |
| IR 1024/2048, **legacy** | 9.33 | 17.33 |

Firmware 3.50's cab engine made cabs almost free — a **2.9× reduction**. A
legacy stereo cab costs as much as a whole overdrive plus a delay. Anything we
generate should use the new-format cabs (`HD2_CabMicIr_*` model IDs); the plain
`HD2_Cab*` IDs are the legacy format. Dual Cab costs roughly 2× Single.

Line 6's own advice is worth repeating verbatim: instead of a parallel path with
two Amp+Cab blocks, use **one Amp block into one Cab > Dual block**. Same tonal
result, a fraction of the cost.

### Reverbs — the HX tier is 2–4× the legacy tier

| Reverb | Mono | Stereo | Tier |
|---|---|---|---|
| Nonlinear | 30.67 | 34.00 | HX |
| Dynamic Bloom | 28.00 | 28.00 | HX |
| Dynamic Plate / Shimmer | 24.00 | 24.00 | HX |
| Dynamic Room | 21.33 | 21.33 | HX |
| Hot Springs | 21.33 | 21.33 | HX |
| Dynamic Hall | 20.67 | 20.67 | HX |
| Double Tank | 18.33 | 19.00 | HX |
| Searchlights | 16.67 | 17.33 | HX |
| Ganymede | 10.00 | 17.67 | HX |
| Plateaux | 13.33 | 16.67 | HX |
| Dynamic Ambience | 13.33 | 14.00 | HX |
| **Glitz** | 11.33 | 13.67 | HX |
| Spring / 63 Spring | 12.40–12.51 | 17.84–18.00 | Legacy |
| Particle Verb | 9.60 | 13.81 | Legacy |
| **Plate / Room / Hall / Chamber / Echo / Tile / Cave / Ducking / Octo** | 7.35 | 10.57 | Legacy |

Two things worth internalising:

1. **Glitz is cheap.** The shimmer people reach for costs 13.67 in stereo — less
   than a stereo 70s Chorus (12.56) plus change. Shimmer is not the budget
   problem people assume it is; the Dynamic and Nonlinear verbs are.
2. **The reverbs our recipes call "Plate", "Hall", "Room"** are the Legacy
   models (`HD2_ReverbPlate` etc.) at 7.35/10.57, and they are the cheapest
   reverbs in the box. Note the Dynamic family is priced identically in mono and
   stereo — there is nothing to save by going mono on those.

### Delays — mostly cheap, three exceptions

Simple Delay 4.43/6.07. Ping Pong 2.62/5.47. Ducked Delay 3.81/5.97. Transistor
Tape 8.25/15.55. The workhorses cost less than an overdrive.

The expensive end: **Poly Sustain** 53.33/62.49, **Heliosphere** 16/29.33,
**Cosmos Echo** 14.13/25.60, **ADT** 14.67/24.00, **Multitap 6** 9.43/19.64,
**Harmony Delay** 8.63/17.97.

### Drives — a 9× spread nobody expects

Overdrives are supposed to be trivial. Several are not:

| Drive | Mono | Stereo |
|---|---|---|
| Legendary Drive | 21.33 | 41.33 |
| Vital Dist | 20.67 | 40.00 |
| Tone Sovereign | 20.00 | 38.00 |
| **Prize Drive** | 20.00 | 38.00 |
| Clawthorn Drive | 17.87 | 34.33 |
| Ampeg Scrambler | 16.67 | 31.67 |
| Horizon Drive / Ballistic Fuzz | 16.00 | 29.33 |
| **Minotaur** (Klon) | 11.40 | 21.67 |
| **Scream 808** | 7.33 | 13.44 |
| Teemah! | 7.40 | 13.67 |
| Compulsive Drive | 5.95 | 10.77 |
| Vermin Dist | 5.99 | 10.79 |
| Kinky Boost | 6.80 | 12.13 |

A stereo Prize Drive costs more than a Fender Deluxe amp block. The newer models
(3.60+) are systematically pricier than the originals. **Keep drives mono** —
they are pre-amp blocks in a mono part of the chain anyway, and you save half.

### Compressors, EQ, wah, volume — effectively free

Deluxe Comp **2.33/3.96** (the cheapest useful block in the box). Hard Gate
1.55/2.91. Noise Gate 3.87. Simple EQ 1.71/2.17. 10-Band Graphic 2.43/3.55.
Parametric 3.25/3.36. All wahs 1.71–4.00. Vol/Pan 0.38–0.79.

The exceptions in these categories: **Feedbacker** 29.33 (it is really a poly
block), **Acoustic Sim** 9.33/16.67, **Red Squeeze** 11.96/16.31, **Asheville
Pattrn** 12.33/17.00.

### Modulation — flangers and rotaries cost, tremolos don't

Optical Trem 2.28/2.97, Tremolo 1.93/2.60, Script Mod Phase 3.07/4.69, Chorus
4.49/7.31. Then: **Poly Detune 48.00**, Double Take 17.07/18.80, Triple Rotary
17.33 (stereo only), 122/145 Rotary ~13.4 (stereo only), Ampeg Liquifier
12.00/22.67, Gray Flanger 9.93/18.31, PlastiChorus 7.33/13.67, 70s Chorus
6.92/12.56.

### The universal levers, ranked

1. **Move blocks to path 2** (dual-DSP units only). Free. Doubles your budget.
2. **Mono instead of stereo.** Roughly halves each effect block. Genuinely free
   if the rig runs into one amp or one wedge.
3. **Preamp instead of full Amp.** Saves 7–16 units.
4. **New-format cabs, not legacy.** Saves 6.3 mono / 12.5 stereo per cab.
5. **One Amp + one Dual Cab** instead of two Amp+Cab blocks.
6. **Legacy reverb instead of a Dynamic/Nonlinear one.** Saves 10–24.
7. **Snapshots instead of duplicate blocks.** Two amp blocks you switch between
   is the most expensive way to get two tones; one block with snapshot-varied
   Drive and Ch Vol is free.

---

## 4. Worked examples

Numbers generated by `fitsOnDevice()` from `dsp-costs.ts`. Reproduce with the
snippets below.

### A 10-block worship rig, Helix LT

Comp (Deluxe Comp) → Minotaur → Scream 808 → **Essex A30 Amp+Cab** → 70s Chorus
(st) → Transistor Tape (st) → Vintage Digital (st) → Plate (st) → Glitz (st) →
Simple EQ.

| Layout | Path 1 | Path 2 | Verdict |
|---|---|---|---|
| Everything on path 1 | **118.29%**, 10 blocks | 0%, 0 blocks | ✗ `dsp` — won't build |
| Vintage Digital + Plate + Glitz + EQ moved to path 2 | 82.82%, 6 blocks | 35.47%, 4 blocks | ✓ fits |

This is the whole argument for path-splitting in one table. The chain is
identical; only the routing changed. Note the LT was never short of *blocks* —
it had 6 of 16 free on path 1 the entire time.

### The same rig, degraded to an HX Stomp

| Step | Result |
|---|---|
| All 10 blocks as-is | ✗ `block_count` — 10 > 8. Cheaper models cannot fix this. |
| Cut chorus and EQ → 8 blocks, still all stereo | ✗ `dsp` — **104.02%**. So close it hurts. |
| Same 8 blocks, time-based effects **mono** | ✓ **86.88%** |
| Same 8, mono + **Preamp-only** Essex A30 | ✓ **69.28%** — 31% headroom for a bigger reverb |

The honest Stomp cut of this preset is: Comp → Minotaur → Scream 808 → Essex A30
Amp+Cab → Transistor Tape → Vintage Digital → Plate → Glitz, all mono after the
amp. You lose stereo width and the chorus. You keep the shimmer.

And you lose five snapshots: the Stomp has **3**, against the Helix's 8. For a
Set Pack that is a harder constraint than the DSP — it is the reason a Stomp set
pack has to be a different product, not a downscaled export.

```ts
import { fitsOnDevice, type BlockSpec } from "@/lib/helix/dsp-costs";

const chain: BlockSpec[] = [
  { model: "Deluxe Comp" },
  { model: "Minotaur" },
  { model: "Scream 808" },
  { model: "Essex A30", variant: "amp_cab" },
  { model: "Transistor Tape" },
  { model: "Vintage Digital" },
  { model: "Plate" },
  { model: "Glitz" },
];
fitsOnDevice(chain, "hx_stomp");
// { fits: true, limitingFactor: "none", headroomPercent: 13.12, ... }
```

### Audit: our own Set Pack generator is at the wall

Running the actual chain in
[`src/lib/helix/generate-set-pack.ts`](../src/lib/helix/generate-set-pack.ts)
through `fitsOnDevice()`:

| Block | Model ID | Mono cost |
|---|---|---|
| Deluxe Comp | `HD2_CompressorDeluxeComp` | 2.33 |
| Minotaur | `HD2_DistMinotaur` | 11.40 |
| Scream 808 | `HD2_DistScream808` | 7.33 |
| Essex A30 (amp) | `HD2_AmpEssexA30` | 30.32 |
| 2x12 Blue Bell | `HD2_Cab2x12BlueBell` | **9.60 (legacy format)** |
| 70s Chorus | `HD2_Chorus70sChorus` | 6.92 |
| Transistor Tape | `HD2_DelayTransistorTape` | 8.25 |
| Vintage Digital | `HD2_DelayVintageDigitalV2` | 5.24 |
| Plate | `HD2_ReverbPlate` | 7.35 |
| Glitz | `HD2_ReverbGlitz` | 11.33 |
| | **Total, all mono, all path 1** | **100.07%** |

That is over budget by a rounding error, in mono, with nothing in stereo and
path 2 completely empty. Two independent problems:

1. **It uses the legacy cab format.** `HD2_Cab2x12BlueBell` costs 9.60; the
   3.50+ equivalent `HD2_CabMicIr_2x12BlueBellWithPan` costs 3.33. Switching
   the cab alone brings the chain to **93.80%**.
2. **Everything is on path 1.** Half the LT is idle.

Fixed layout — new-format cab, ambient tail (chorus, both delays, both reverbs)
moved to path 2 and run in **stereo**:

| | Path 1 | Path 2 |
|---|---|---|
| Blocks | 5 (comp, klon, 808, amp, cab) | 5 (chorus, 2× delay, 2× reverb, stereo) |
| DSP | **54.71%** | **61.87%** |

Same tone, wider, and with 38% headroom on each chip for a bigger reverb or a
second amp. This is a real bug worth fixing in the generator, not a
hypothetical.

### Two amps on one Stomp — surprisingly fine

Essex A30 Amp+Cab → Brit Plexi Brt Amp+Cab → Simple Delay → Plate: **85.56%**,
4 blocks. Two full amps fit on a Stomp as long as you keep the time-based
section modest. It is the *ambient* section, not the amp count, that usually
kills a Stomp preset.

---

## 5. The 64-controller cap

**Verified in the Helix 3.80 Owner's Manual**, and it applies to every device in
the family:

> Each preset can have up to 64 controller assignments, including parameters
> controlled by Snapshots. If you attempt to add a 65th, "Too many controller
> assignments!" appears in the header. […] In this case, you must clear some
> controllers to free up assignments.

### How snapshots consume the 64 — and how they don't

This is the part people get wrong. From the manual's Snapshots section, each
snapshot stores:

> - **Block Bypass** — The bypass (on/off) state of all processing blocks
>   (except Looper), independent of any footswitch bypass assignments.
>   *NOTE: The bypass state of blocks is automatically stored and recalled per
>   snapshot.*
> - **Parameter Control** — The values of any parameters assigned to controllers
>   (up to 64 per preset).
> - Command Center values, and Tempo (if Tempo Select is Per Snapshot).

And, decisively:

> Each preset can have up to 64 **parameters** assigned to Snapshots; hence,
> eight octopuses with eight tentacles each.

So:

- **Block on/off per snapshot is FREE.** It costs zero assignments. All eight
  snapshots can flip all 32 blocks and you have spent nothing.
- **One parameter that varies across snapshots = ONE assignment**, not one per
  snapshot. A Drive knob that has eight different values across eight snapshots
  is a single assignment.
- Wah and Volume on EXP 1 / EXP 2 occupy assignments by default — "Clearing All
  Controller Assignments also removes the Wah and Volume assignments from EXP 1
  and EXP 2".
- Expression-pedal and footswitch parameter assignments draw from the same 64.

**What this means for Set Packs:** 64 snapshot-varying parameters across ~10
blocks is roughly 6 parameters per block — generous, but not unlimited. A
maximal Set Pack that varies Drive, Bass, Mid, Treble, Ch Vol on the amp (5),
Mix + Feedback + Time on two delays (6), Decay + Mix on two reverbs (4), Gain +
Level on three drives (6), and comp Mix (1) is at 22. You would have to be
trying to hit 64. The realistic failure mode is a generator that assigns a
controller to *every* parameter it writes; don't do that.

Spillover caveat from the manual: "If you want to max out your controller
assignments, best to eliminate them from path 2 blocks."

---

## 6. Helix Stadium — noted, deliberately excluded

Helix Stadium (Floor / XL Floor, 2025) replaces SHARC entirely with the **Agoura**
engine, and firmware **1.3** (March 24, 2026) added phase 1 of the **Proxy**
cloning engine. What Line 6 documents for it:

- **48 block locations** across **four paths** (vs 32 / two)
- Up to **4 amps** (2 per path) — same as Helix, on double the paths
- Up to **8 cab blocks** (4 per path) — double Helix
- **1 poly / high-DSP block per path**, 1 looper per preset
- Same "Dynamic DSP" grey-out behaviour, and — importantly — **still one DSP per
  primary path**, with the same "you're only using half its horsepower" warning
- Line 6 explicitly flags that "some models may use more DSP than others in the
  same category. This is especially true with **Agoura** Amp models" — i.e. the
  cost spread is *wider* than on the classic line, not narrower.

**No allocation table exists for Stadium.** None of the numbers in this document
transfer. `dsp-costs.ts` exports `HELIX_STADIUM_NOTE` with `supported: false`
precisely so nobody wires Stadium into the fit checker by accident.

Set Builder should keep targeting the classic line, which is the installed base
and will remain so for years. Revisit when someone publishes Agoura allocations.

---

## 7. Confidence — what is verified and what is not

### Hard facts (official Line 6 documentation)

- Block counts, amp/cab/IR/poly/looper caps, snapshot counts, preset counts
- The 64-controller cap and its exact error string
- Snapshots storing bypass for free; parameters counting once regardless of
  snapshot count
- Per-path DSP independence and the grey-out behaviour
- The relative statements: preamp < amp, dual cab ≈ 2× single, stereo ≈ 2× mono,
  new cab engine ≪ legacy, "Simple" blocks are cheaper, Legacy effects generally
  (but not always) cheaper

### Reported (community measurement — `confidence: "reported"`)

Every per-model number. They come from Ben Vesco's table, built by iterative
trial and error against real hardware, kept current through 3.80.0, and
acknowledged on the official Line 6 forum where a Line 6 admin hosted a
community spreadsheet to fill the gap Line 6 itself leaves. **This is the best
data that exists.** It is not first-party and it is not ours.

Treat individual values as good to about ±1 unit. Treat the *ordering* and the
*ratios* as solid.

### What we could not verify

1. **That a single-DSP unit's usable budget equals one Helix path's.** We assume
   100 units for both. The evidence is circumstantial but consistent: Ben Vesco
   publishes one "HX" cost column used for both; Line 6 staff confirm HX Stomp
   and HX Effects share a processor and allocation; the community consensus is
   "the Stomp is half a Helix". One forum poster claims "1/4 of the DSP power",
   which we believe is wrong (they were likely comparing 8 blocks to 32). **This
   is the assumption most worth testing on hardware.**
2. **The exact cost of an Amp+Cab block.** We model it as `full amp + one
   new-engine single cab (3.33)`. Plausible, unverified.
3. **What actually happens on load when an over-budget preset is imported** via
   HX Edit. Grey-out only prevents you from *building* one on the device.
4. **Nothing is marked `"measured"` in `dsp-costs.ts`.** Deliberately. When
   someone verifies a value on real hardware, upgrade that entry and cite how.

### Firmware drift

These allocations move between releases. Known shifts: **3.10** raised amp and
effect cost by increasing oversampling; **3.50** cut cab cost from 9.60 to 3.33
with the new cab engine; **3.10** raised Glitch Delay from 6.67 to 8.67. Re-check
this table after every major Line 6 firmware release.

---

## 8. Sources

**Official Line 6**

- Helix 3.80 Owner's Manual (English) — *Dynamic DSP* p. 22, *Controller Assign*,
  *Snapshots* p. 49 — https://line6.com/data/6/0a00051afda2673ccc1cc8e68/application/pdf/Helix%203.80%20Owner's%20Manual%20-%20English%20.pdf
- HX Stomp 3.80 Owner's Manual — *Dynamic DSP* p. 20 — https://line6.com/data/6/0a00051afdda673cccdb61c9c/application/pdf/HX%20Stomp%203.80%20Owner's%20Manual%20-%20English%20.pdf
- HX Stomp XL 3.80 Owner's Manual — *Dynamic DSP* p. 24 — https://line6.com/data/6/0a00051afe12673ccd29b29f5/application/pdf/HX%20Stomp%20XL%203.80%20Owner's%20Manual%20-%20English%20.pdf
- HX Effects 3.80 Owner's Manual — *Dynamic DSP* p. 39 — https://line6.com/data/6/0a00051afdbe673ccc8bdcf2d/application/pdf/HX%20Effects%203.80%20Owner's%20Manual%20-%20English%20.pdf
- Helix Stadium manual — *Dynamic DSP* — https://manuals.line6.com/en/helix-stadium/live/dynamic-dsp

**Community measurement**

- Ben Vesco, *Helix DSP Allocations* (3.80.0) — the per-model table this file is
  built from — https://benvesco.com/store/helix-dsp-allocations/
- Line 6 Community, *List of DSP usage per model?* — where the community
  spreadsheet originated and Line 6 staff acknowledged the gap — https://line6.com/support/topic/31230-list-of-dsp-usage-per-model/
- Line 6 Community, *HX Effects and HX Stomp, same DSP?* — staff confirmation of
  identical processor and allocation — https://line6.com/support/topic/59214-hx-effects-and-hx-stomp-same-dsp-post-30-thoughts/
- Line 6 Community, *HX Stomp/Effects DSP question* — https://line6.com/support/topic/63943-hx-stompeffects-dsp-question/
- Line 6 Community, *Models Greyed Out* — grey-out behaviour and per-path DSP — https://line6.com/support/topic/58512-models-greyed-out/
- Helix Help, *Controller Assign* — independent confirmation of the 64 cap — https://helixhelp.com/tips-and-guides/helix/controller-assign
- Helix Help, *The Blocks* — https://helixhelp.com/tips-and-guides/helix/the-blocks

**Internal**

- `docs/platform-knowledge/line6-helix.md` — model lists, firmware history
- `docs/TONE_ENGINEERING_BIBLE.md` §3 — verified model IDs from 300+ real presets
- `docs/HLX_EXEMPLAR_ANALYSIS.md` — .hlx format and block parameter conventions
- `data/helix-inventory.json` — the model-ID source of truth
