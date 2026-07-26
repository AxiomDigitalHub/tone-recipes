# Fader & Knob — Routing & Mix Architecture

> The companion volume to the [Tone Engineering Bible](TONE_ENGINEERING_BIBLE.md).
> The Bible covers what each block *is*. This covers how blocks are
> wired together, how much of each one you actually hear, and what
> happens to all of it between your output jack and the room.
>
> **Last updated:** July 2026
> **Sources:** first-party manuals (Line 6 Helix 3.80 + HX Stomp 3.80 +
> HX Edit 3.80 + Helix Stadium; Kemper PROFILER 5.5; Fractal Axe-Fx III
> Owner's Manual + Blocks Guide; Quad Cortex CorOS 4.0.0; Boss Katana
> Gen 3; Boss GT-1000; IK TONEX Pedal 1.6.22), manufacturer staff
> statements, measured community data, and live-sound engineering press.
>
> **Reading rule:** every number below is quoted from a manual,
> computed from a documented law, or explicitly flagged. Section 10
> lists everything this document does **not** know. If a claim isn't in
> the sources and isn't in section 10, it shouldn't be here.

---

## Table of Contents

1. [Mix Laws — the same number is not the same amount](#1-mix-laws--the-same-number-is-not-the-same-amount)
2. [Series vs Parallel — decision rules with numeric anchors](#2-series-vs-parallel--decision-rules-with-numeric-anchors)
3. [Mix by Role — converting the genre tables into dB](#3-mix-by-role--converting-the-genre-tables-into-db)
4. [Parallel Path Level Math](#4-parallel-path-level-math)
5. [Gain Staging by Platform](#5-gain-staging-by-platform)
6. [Live Routing Recipes](#6-live-routing-recipes)
7. [Global EQ and Output Calibration](#7-global-eq-and-output-calibration)
8. [Mono-Sum Survival](#8-mono-sum-survival)
9. [When a Split Earns Its DSP](#9-when-a-split-earns-its-dsp)
10. [What This Document Does Not Know](#10-what-this-document-does-not-know)
11. [Sources](#11-sources)

---

## 1. Mix Laws — the same number is not the same amount

### 1.1 The four laws

Every modeler has a Mix control. Almost none of them behave the same
way. There are four architectures in current use, and only two of them
are documented by the manufacturer.

Let **m** be the Mix control, 0.0 to 1.0. Figures are amplitude gain,
converted to dB.

| Law | Dry gain | Wet gain | Who uses it | Documented? |
| --- | --- | --- | --- | --- |
| **Linear** | 1 − m | m | Fractal — all blocks except Delay | Yes — Blocks Guide, "Common Mix/Level Parameters" |
| **50/50** | min(1, 2(1−m)) | min(1, 2m) | Fractal **Delay** block; Kemper **delay and reverb** | Yes — Fractal Blocks Guide (Delay Mix page) + Fractal wiki; Kemper Main Manual 5.5 |
| **Constant power** | √(1−m) | √m | "a few" unnamed Fractal blocks; the likely Helix/QC behaviour | Partially — Fractal names the exception but not the blocks |
| **Dual level** | Direct Level, independent | Effect Level, independent | Boss GT-1000, Katana | Yes — GT-1000 parameter guide |

Fractal states its default outright:

> "With the exception of a few blocks that use a constant power
> algorithm, Mix controls the dB levels of wet and dry signals in an
> **inverse linear relationship. A mix setting of 50% results in both
> wet and dry being at −6 dB** in comparison to their maximum output
> levels."
> — *Fractal Audio Blocks Guide*, Common Mix/Level Parameters

and flags the Delay block as the exception: *"the delay block uses a
different Mix Law compared to other blocks."* The Fractal wiki spells
that law out — below 50%, dry sits at unity and wet ramps 0 → unity;
above 50%, wet holds at unity and dry falls to zero.

Kemper documents the identical 50/50 shape in plain English:

> "Controls the level of the delay signal. **At the middle position,
> the delay is as loud as the direct signal; beyond this point it will
> start to attenuate the dry signal.** With 'Mix' turned all the way to
> the right, you will hear only the pure, delayed signal."
> — *KEMPER PROFILER Main Manual 5.5*, Delay Mix

and then, for reverb: *"Reverb 'Mix' works exactly like the delay 'Mix'
parameter."*

Boss doesn't have a Mix control at all. The GT-1000 delay exposes
**EFFECT LEVEL** (0–120, *"Adjusts the volume of the delay sound"*) and
**DIRECT LEVEL** (0–100, *"Adjusts the volume of the direct sound"*) as
two independent knobs. Reverb is the same pair, 0–100 each. Genuinely
parallel: the dry is never touched by the wet control.

**Line 6 does not publish its curve.** The Helix manual and Helix Help
both say only that *"When set to 0% the path bypasses the effect
completely. When set to 100%, the entire path is fed through the
effect, and no dry thru signal is heard."* Neither states what happens
at 30%. Same for Neural DSP. § 1.8 has a ten-minute measurement
procedure; until someone runs it, treat Helix and QC as "linear or
constant power, unknown which" — a **4–6 dB** band of uncertainty.

### 1.2 What "Mix 30%" actually does

| Mix | Linear<br>dry | wet | wet−dry | 50/50<br>dry | wet | wet−dry | Const-pwr<br>dry | wet | wet−dry |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 10% | −0.9 | −20.0 | −19.1 | 0.0 | −14.0 | −14.0 | −0.5 | −10.0 | −9.5 |
| 15% | −1.4 | −16.5 | −15.1 | 0.0 | −10.5 | −10.5 | −0.7 | −8.2 | −7.5 |
| 20% | −1.9 | −14.0 | −12.0 | 0.0 | −8.0 | −8.0 | −1.0 | −7.0 | −6.0 |
| 25% | −2.5 | −12.0 | −9.5 | 0.0 | −6.0 | −6.0 | −1.2 | −6.0 | −4.8 |
| **30%** | **−3.1** | **−10.5** | **−7.4** | **0.0** | **−4.4** | **−4.4** | **−1.5** | **−5.2** | **−3.7** |
| 35% | −3.7 | −9.1 | −5.4 | 0.0 | −3.1 | −3.1 | −1.9 | −4.6 | −2.7 |
| 40% | −4.4 | −8.0 | −3.5 | 0.0 | −1.9 | −1.9 | −2.2 | −4.0 | −1.8 |
| **50%** | **−6.0** | **−6.0** | **0.0** | **0.0** | **0.0** | **0.0** | **−3.0** | **−3.0** | **0.0** |
| 60% | −8.0 | −4.4 | +3.5 | −1.9 | 0.0 | +1.9 | −4.0 | −2.2 | +1.8 |
| 75% | −12.0 | −2.5 | +9.5 | −6.0 | 0.0 | +6.0 | −6.0 | −1.2 | +4.8 |

All figures in dB relative to the block's input.
Linear = Fractal non-delay. 50/50 = Fractal Delay, Kemper delay + reverb.

Read the bold rows. **At Mix 30%, the wet signal sits anywhere from
−10.5 dB to −5.2 dB, and the dry is either untouched or 3 dB down.**
Expressed as the thing your ear actually judges — how loud the effect
is relative to the note you played — the spread is **−7.4 dB to
−3.7 dB**. At Mix 20% the spread widens to **6 dB**. At Mix 10% it is
**9.6 dB**.

That is the correctness bug in every cross-platform recipe we have
shipped: the Helix card says `Mix: 30`, the Fractal card says `Mix: 30`,
and they are not the same preset.

### 1.3 The one number that means the same thing everywhere

**Mix 50% is universal.** Every law converges there: wet equals dry,
exactly, on all four architectures. Linear puts both at −6 dB, constant
power at −3 dB, 50/50 at 0 dB — the absolute levels differ, but the
*ratio* is 1:1 in every case, and ratio is what the ear reads as "how
much effect."

- **Below 50%, platforms diverge and the gap grows as you go lower.**
  The most divergent zone is 10–25% — exactly where subtle reverbs and
  rhythmic delays live.
- **Above 50%, divergence returns and the dry starts vanishing fast.**
  On the linear law, Mix 75% has the dry 12 dB down. On the 50/50 law
  it's 6 dB down. Neither is "a bit more reverb."
- **Anything at 100% wet is portable.** Rotary, pitch/whammy, a
  parallel-path reverb, a wet-only send — all four laws agree at 100%.

There are exactly two Mix values safe to write in a cross-platform
recipe without conversion: **50 and 100.**

### 1.4 Conversion table — target ratio to platform number

Write recipes in **wet-minus-dry dB**, then look up the platform's
number.

| Target (wet − dry) | Sounds like | Linear | 50/50 | Const-pwr | Boss E.Level<br>(Direct 100) |
| ---: | --- | ---: | ---: | ---: | ---: |
| −18 dB | barely there; "is it on?" | 11 | 6 | 2 | 13 |
| −15 dB | felt, not heard | 15 | 9 | 3 | 18 |
| −12 dB | tracking-room ambience | 20 | 13 | 6 | 25 |
| −10 dB | subtle repeat under the part | 24 | 16 | 9 | 32 |
| −8 dB | clearly audible, still behind | 28 | 20 | 14 | 40 |
| −6 dB | the classic "obvious but tasteful" | 33 | 25 | 20 | 50 |
| −4 dB | forward; the effect is part of the riff | 39 | 32 | 28 | 63 |
| −3 dB | very wet | 41 | 35 | 33 | 71 |
| 0 dB | wet = dry | 50 | 50 | 50 | 100 |

Formulas, if you'd rather compute (r = 10^(target/20)):

```
linear:          m = r / (1 + r)
50/50:           m = r / 2                (valid for r ≤ 1)
constant power:  m = r² / (1 + r²)
Boss E.Level:    E = 100 · r,  Direct = 100
```

**The single most useful consequence:** *on Kemper, and on the Fractal
Delay block, dial our published Mix numbers down by about a third.* A
worship delay written as `Mix: 30` for a linear-law device is `Mix: 20`
on a Kemper for the same audible amount of echo. Getting this backwards
is why "the Kemper version sounds washy" is a real complaint.

Boss goes the other way — E.Level is a straight percentage of unity, so
the numbers run roughly **double** a linear-law modeler's. `Mix: 30` on
a linear-law device is about `E.Level 43` with `Direct 100` on a GT.

### 1.5 Loudness change when you engage the block

**Decorrelated wet** (reverb tails, chorus with independent L/R, long
delay repeats). Power sums, total = √(dry² + wet²):

| Mix | Linear | 50/50 | Constant power |
| ---: | ---: | ---: | ---: |
| 10% | −0.9 dB | +0.2 dB | 0.0 dB |
| 20% | −1.7 dB | +0.6 dB | 0.0 dB |
| 25% | −2.0 dB | +1.0 dB | 0.0 dB |
| 30% | −2.4 dB | +1.3 dB | 0.0 dB |
| 40% | −2.8 dB | +2.1 dB | 0.0 dB |
| 50% | −3.0 dB | +3.0 dB | 0.0 dB |

**Correlated wet** (compressor blend, a doubler tight enough to fuse, a
drive blended against its own dry). Amplitudes add, total = dry + wet:

| Mix | Linear | 50/50 | Constant power |
| ---: | ---: | ---: | ---: |
| 10% | 0.0 dB | +1.6 dB | +2.0 dB |
| 25% | 0.0 dB | +3.5 dB | +2.7 dB |
| 40% | 0.0 dB | +5.1 dB | +3.0 dB |
| 50% | 0.0 dB | +6.0 dB | +3.0 dB |
| 74% | 0.0 dB | +3.6 dB | +2.7 dB |

Three rules fall out:

1. **Constant power is level-neutral for reverb and wrong for
   compressors.** Engaging a constant-power reverb never changes
   loudness. Engaging a constant-power compressor blend at 50% makes
   you 3 dB louder for free — which players read as "the compressor
   improved it" when it only made it louder.
2. **Linear is level-neutral for compressors and drops for reverb.** A
   linear-law reverb at Mix 30 makes the preset 2.4 dB *quieter* than
   bypass. That's the "why does my clean patch lose punch when I turn
   the verb on" complaint.
3. **The 50/50 law always makes you louder.** On Kemper and the Fractal
   Delay block, engaging a delay at Mix 30 is +1.3 dB; at Mix 50 it's
   +3 dB. Budget for it in the block's Level or in Rig Volume.

Our own compressor convention — `Mix: 74` on the Worship Tutorials
Deluxe Comp (Bible § 3) — is a *correlated* blend. On a linear law it's
level-neutral; on a 50/50 law it's +3.6 dB. Same number, different
patch.

### 1.6 Kill Dry, Input Gain, and the bus-send idiom

The way out of mix-law roulette is to stop using Mix as a level
control. Feed the effect from a send and set its output level
separately — the same discipline as an aux send in a DAW.

| Platform | Bus-send control | What it does | Kill Dry? |
| --- | --- | --- | --- |
| **Fractal** | **Input Gain** — on Delay, Megatap, Multitap, Ten-Tap, Pitch, Plex Delay, Resonator, Reverb | *"Determines the amount of signal fed to the effect processor within the block. This simulates the way an AUX Send would normally feed an effect routed in parallel. **It has no effect on the dry signal.**"* | Yes. Also **Bypass Mode: MUTE IN** for parallel time effects, **MUTE FX IN** for series with spillover |
| **Kemper** | **Mix Location: Pre** — *"the delay tail will be unaffected by fast changes to Mix, which will control only the delay input level"* | Input-side control | No explicit Kill Dry; use **Output Source: "DLY/REV wet"** on a stereo output for a true wet-only feed |
| **Helix** | None. No Input Gain, no Kill Dry | — | Emulated: block on parallel path B, **Mix 100%**, amount set by the Merge Mixer's B Level |
| **Quad Cortex** | None documented | — | Emulated: split to a second row, Mix 100%, amount set by Mixer LEVEL B |
| **Boss GT / Katana** | **Direct Level** — it *is* the dry control | Dry and wet already independent | Direct Level 0 = wet only |
| **TONEX Pedal** | None | — | Delay and Reverb both have **MIX 0–100%**, so 100% wet is available |

The Helix/QC workaround is community-standard, not a hack — but it
costs a path and it changes the mix law to "whatever the mixer does,"
which is at least a law you control. Line 6's manual documents the
extreme version: move the Merge block to path 1B, push the Split past
the last block on 1A, and **turn path 1A's Output Level all the way
down** — a hard kill-dry built out of routing.

Fractal also ships a live-only convenience nobody else has: **Global
Mix**, a ±50% offset applied to every block that opts in, *"so you can
design presets with the built-in ability for fast mix compensation in
playing environments that require more or less wet mix."* One knob,
whole setlist, dry room vs live room.

### 1.7 Why 100% wet + kill dry keeps trails constant

The reason pros run wet effects at 100% on a parallel path isn't
purity — it's **snapshot and scene stability**.

When Mix does the blending, changing Mix changes the effect's *output*,
so a snapshot that lowers Mix chops the existing tail. When a send
level does the blending, changing it changes the *input*, and the tail
already in the reverb keeps ringing at the level it was born with.
Kemper says this explicitly: *"In the 'Post' position, a change of the
Mix control changes the output level of the delay, and thus will have
an immediate impact to the delay tail when modified. In the 'Pre'
position, the delay tail will be unaffected by fast changes to Mix."*

**Rule: anything you intend to automate per-snapshot should be a send
level, not a Mix.** Anything you set once and forget can be Mix.

Fractal's Bypass Modes encode the same distinction and are worth
memorising, because picking the wrong one is the most common "my trails
cut off" bug:

| Bypass Mode | Behaviour | Use for |
| --- | --- | --- |
| MUTE | wet and dry both silenced | — |
| THRU | block completely disengaged, behaves as a shunt | series effects with no tail requirement |
| **MUTE IN** | inputs muted; *"allows effect tails to ring out or spillover"* | **time-based effects in parallel** |
| MUTE OUT | outputs muted; tails killed instantly but the input keeps listening | — |
| **MUTE FX IN** | effect inputs muted, *"the dry level is unaffected"*, tails ring | **time-based effects in series with spillover** |
| MUTE FX OUT | effect outputs muted, dry unaffected, tails silenced on bypass | — |

Helix's equivalent is one switch: *"Trails On: Any delay repeats or
reverb decays continue to decay naturally when the block is bypassed
**or a different snapshot is selected**."* Trails Off plus snapshot
switching is the sound of someone unplugging your reverb mid-song.

### 1.8 Measuring your own unit in ten minutes

You need a DAW, a loopback, and a sine or pink-noise source. Once per
platform.

1. Put a **delay with feedback 0 and a long time** (2 s) in the chain.
   Level 0.0 dB.
2. **Mix 0%.** Capture. Dry reference = 0 dB.
3. **Mix 50%.** Capture. Measure the *dry* transient (the first hit,
   before the repeat arrives):
   - dry unchanged → **50/50 law**
   - dry −3 dB → **constant power**
   - dry −6 dB → **linear**
4. Confirm with the repeat: it should read 0 / −3 / −6 dB matching the
   same law.
5. Spot-check at Mix 25%: linear gives dry −2.5 / wet −12; 50/50 gives
   dry 0 / wet −6; constant power gives dry −1.2 / wet −6.

Do this for a **delay** block and a **reverb** block separately —
Fractal proves they can differ inside one device.

---

## 2. Series vs Parallel — decision rules with numeric anchors

### 2.1 The default is series

Series costs no DSP, cannot comb-filter against itself, and cannot
create a mono-sum null. Parallel costs a path, a mixer, and a level
calibration, and every one of those is a place to be wrong. The burden
of proof is on the split.

### 2.2 The four questions

**Q1 — Would a Mix control give the same result?**

For a single time-based effect at the end of a chain: usually yes.
Fractal says so in its own manual — *"Remember that MIX generally
applies only to Reverb blocks which are wired in series. (Parallel
reverbs typically run with MIX at 100%.)"* Line 6's community position
is the same: a Mix knob and a parallel path are two expressions of one
operation.

Three documented exceptions where they are *not* the same:

- **Trails and bypass behaviour differ by topology.** Fractal: *"For
  tails to ring out when an individual block is bypassed, set that
  block's Bypass Mode to 'MUTE FX IN'. If an effect is running in
  parallel, use 'MUTE IN' instead."* Same musical goal, different
  required setting.
- **You want to post-process only the wet path.** A filtered, pitched,
  or compressed *repeat* is impossible with a Mix knob. Fractal's own
  routing examples include *"an entire parallel chain for a shimmery,
  filtered effect with a VOLUME block for its own 'Send' control."*
- **The branches need different destinations.** Cab for FOH, no cab for
  the stage amp. A Mix knob cannot do this.

**Q2 — Do the two branches carry genuinely different content?**

This is the phase test and the mono test at once. Two branches carrying
the same signal with a small difference comb-filter against each other.
Two branches carrying different signals cannot cancel. The
Fractal-forum formulation is the one to remember: *"If the left delay
channel is fed with a signal totally different from the right delay
channel… they can not phase-cancel each other."*

The evidence that this is not theoretical: a Kemper user re-amped the
**same DI through two instances of the same profile** and still got
*"the chorusing / comb filtering and other phase artifacts,"* worst on
chords. His generalisation — *"the closer your tracks are, the more
comb filtering you get, which only stops when they completely align"* —
is the whole rule in one sentence. Line 6's forum adds the useful
nuance from the other side: with genuinely *different* amps and cabs,
*"the most you're going to get is filtering of what they have in
common."*

**Numeric anchor:** if two branches' frequency responses differ by less
than about **3 dB across 200 Hz – 4 kHz**, they are the same signal.
Blending them buys level, not tone.

**Q3 — Is the DSP better spent elsewhere?**

On HX Stomp (8 blocks, one path splittable to A/B) a split costs two
slots plus the duplicated blocks. On Helix Floor/LT (32 blocks, 4
paths) it's cheap. On a Quad Cortex (4 rows × 8 slots) a split costs a
row *and* forces you to duplicate every post-amp effect you want in
both feeds — QC users call this *"a massive oversight in terms of CPU
usage."*

**Q4 — Does it survive mono?**

See § 8. If the answer requires hard panning or a polarity flip, the
split is a studio technique, not a live one, and the recipe must say so.

### 2.3 Anchors

| Situation | Verdict | Anchor |
| --- | --- | --- |
| One reverb, one delay, end of chain | **Series.** Use Mix | Identical audio, saves a path |
| Reverb you'll ride per snapshot | **Parallel**, 100% wet | Keeps tails constant (§ 1.7) |
| Fuzz you want to keep low end under | **Parallel** dry blend | Resolve polarity first (§ 9.1) |
| Two amps with clearly different voicings | **Parallel** | Only if they differ > 3 dB across the mids |
| Two similar-voiced amps | **Don't** | Measurable comb filtering (§ 9.2) |
| Cab for FOH + no cab for a stage amp | **Parallel**, separate outputs | The one split that is never optional |
| Bass/treble split, baritone or 7-string | **Crossover split** | 150–300 Hz is the documented bass figure; see § 9.3 |
| Parallel compression | **Series** with the comp's own Mix | Fractal's manual says the Mix knob *is* NY compression |

---

## 3. Mix by Role — converting the genre tables into dB

[TONE_SCIENCE_RESEARCH § Approach 6 and 7](TONE_SCIENCE_RESEARCH.md)
already give delay and reverb Mix ranges per genre. They're good
ranges — they're just written in a unit that isn't portable. This
section translates them and adds the roles they don't cover.

### 3.1 Re-reading the existing tables

The published ranges were written against a pedal/plugin mental model,
which is closest to the **linear** law. Read them that way, then
convert:

| Existing entry | Published Mix | Means (wet−dry) | Kemper / Fractal Delay | Const-power block |
| --- | ---: | ---: | ---: | ---: |
| Delay — Worship, dotted 8th | 25–35% | −9.5 to −5.4 dB | **17–27** | **10–22** |
| Delay — Ambient | 30–45% | −7.4 to −1.7 dB | **21–41** | **16–40** |
| Delay — Blues | 15–25% | −15.1 to −9.5 dB | **9–17** | **3–10** |
| Delay — Rock | 20–30% | −12.0 to −7.4 dB | **13–21** | **6–16** |
| Delay — Country slapback | 30–40% | −7.4 to −3.5 dB | **21–33** | **16–31** |
| Delay — Metal | 10–15% | −19.1 to −15.1 dB | **6–9** | **1–3** |
| Reverb — Tight rhythm | 15–25% | −15.1 to −9.5 dB | **9–17** | **3–10** |
| Reverb — Rock lead | 20–30% | −12.0 to −7.4 dB | **13–21** | **6–16** |
| Reverb — Ballad/slow | 25–40% | −9.5 to −3.5 dB | **17–33** | **10–31** |
| Reverb — Worship ambient | 30–50% | −7.4 to 0 dB | **21–50** | **16–50** |
| Reverb — Country spring | 15–25% | −15.1 to −9.5 dB | **9–17** | **3–10** |

The pattern is the useful bit, and it isn't a flat scale factor:
**Kemper and the Fractal Delay want roughly two-thirds of our published
number at the quiet end, converging to the same number at 50.** A
published `Mix: 15` becomes 9 on a Kemper (×0.6); a published `Mix: 45`
becomes 41 (×0.91); `Mix: 50` stays 50. The error you make by ignoring
this is largest exactly where most of our recipes live.

### 3.2 Roles the genre tables don't cover

Written directly in wet−dry dB. Convert with § 1.4.

| Role | Target wet − dry | Notes |
| --- | ---: | --- |
| **Tracking-room ambience** (you're adding a floor, not a plate) | −18 to −14 dB | Decay < 0.8 s, predelay < 20 ms |
| **Slapback, rockabilly** | −8 to −5 dB | 80–140 ms, feedback ≤ 10%. Loud enough to be a *part* |
| **Slapback, invisible thickener** | −14 to −10 dB | Same time, 6 dB back |
| **Rhythmic dotted-8th, worship** | −10 to −6 dB | Audible on its own; must not compete with the downbeat |
| **Ambient wash, pad-adjacent** | −6 to −3 dB | Only works with a low cut ≥ 200 Hz on the wet path |
| **Solo delay used as sustain** | −12 to −8 dB | You want the note to last, not to hear echoes |
| **Plate under a lead** | −12 to −8 dB | Bible § 3's `Mix: 0.23` reads as −10.5 dB on a linear law — consistent |
| **Big hall, worship pad** | −8 to −4 dB | Predelay 80–150 ms or the attack disappears |
| **Shimmer / octave-up verb under dry** | −12 to −8 dB | Above −8 dB it stops being a guitar |
| **Chorus, subtle studio double** | −8 to −6 dB | ≈ Mix 25–33 linear |
| **Chorus, classic (Small Clone, Juno)** | 0 dB | Mix 50 on every platform — why 50 is the historical default |
| **Rotary / Leslie** | 100% wet | A real Leslie has no dry path |
| **Pitch shift, whammy, harmonizer lead** | 100% wet | Except deliberate dry+harmony, which is 0 dB |
| **Octave-down under dry** | −10 to −6 dB | Low-cut the octave at 60–80 Hz or it disappears into the bass |
| **Parallel compression, "New York"** | −6 to −3 dB compressed vs dry | ≈ Mix 33–41 linear. **House recommendation, not a citation** — see § 9.2 |
| **Fuzz with clean blend** | −6 to −3 dB dry vs fuzz | The dry is there for low end and transient, not tone |

Our house `Mix: 74` compressor convention sits well past the parallel-
compression band above and is doing something different: a *mostly
compressed* sound with a dynamics escape hatch. That's a legitimate
choice; it just shouldn't be described as parallel compression.

---

## 4. Parallel Path Level Math

### 4.1 The measurement everyone should know

Line 6's own forum has the clean experiment, and a Line 6 product
manager confirmed the result:

- Input: **−6 dBFS** sine.
- Split A/B, even. Each path measured in isolation: **−9 dBFS**
  → the split applies a **−3 dB pan law per leg**.
- Merged: **−3 dBFS**
  → merging two *correlated* legs adds **+6 dB**.
- Net effect of adding a parallel path that does nothing: **+3 dB.**

Line 6's Digital Igloo confirmed this happens *"in meatspace with real
pedals and splitters as well,"* referenced *"a pan law,"* and pointed at
the Merge block for compensation. The Helix Stadium manual states it in
prose: *"The overall output level of the signal is increased slightly
for each parallel path added."*

### 4.2 Compensation rules

The correction depends on how correlated the branches are, because that
decides whether they sum at +6 dB or +3 dB.

| Branches | Sum of legs | Net vs unsplit | Fix |
| --- | ---: | ---: | --- |
| Identical (a split that does nothing) | +6 dB | **+3 dB** | Merge Level **−3.0 dB** |
| Near-identical (same amp, two mics; two IRs of the same speaker) | +5 to +6 dB | **+2 to +3 dB** | Merge Level **−2.5 dB**, trim by ear |
| Genuinely different (Bassman + JCM800; clean + fuzz; dry + shimmer) | +3 to +5 dB | **0 to +2 dB** | Merge Level **−1.0 dB** to start, then measure |
| Fully decorrelated (dry + a long reverb tail) | +3 dB | **0 dB** | No correction needed |

Equivalent alternative: set **A Level and B Level both to −3.0 dB**
instead of the master. The arithmetic lands identically (each leg
−9 −3 = −12 dBFS, coherent merge −12 +6 = −6 dBFS = unity) and it
leaves the master free for a snapshot-automatable trim.

### 4.3 The HX Stomp trap

**HX Stomp ships the Merge Mixer Level at +3.0 dB. Helix Floor, Helix
LT and Helix Native ship it at 0.0 dB.** Line 6 has never publicly
explained the difference. A recipe that says "split here, merge at 0"
is therefore **3 dB hotter on an HX Stomp than on an LT**, and the
player will conclude our numbers are wrong.

Any recipe that declares a split must name the device its merge levels
are calibrated for. (Proposed rule `parallel-path-level-compensated` in
[ROUTING_SPEC_ADDITIONS.md](ROUTING_SPEC_ADDITIONS.md).)

### 4.4 Quad Cortex

The QC's Mixer block exposes **LEVEL A / PAN A / LEVEL B / PAN B /
PHASE / MIXER LEVEL**, all defaulting to **0.0 dB**; the Splitter's
Balance defaults to **0.50**. Neural DSP does not publish the split
law. If the split is linear (−6 dB per leg), a Y-split/merge is
self-compensating at 0/0; if it's a −3 dB pan law like Helix, it isn't.
**Unverified — measure it** with the § 1.8 method.

What *is* documented and matters more: the QC is **unity gain from
input to output with no blocks**, output lane and Outputs 1&2 at 0 dB,
Volume at 100%. And a 6 dB error hiding in a cable choice — *"If you
use a TRS cable in output 3&4 you will get unity gain. If you use a TS
cable, you will get 6 dB less signal."*

### 4.5 Fractal

Fractal makes the strongest claim of any manufacturer about its routing
layer:

> "You may freely SPLIT or MERGE up to six ways at any point. **This is
> sonically transparent and there is zero risk of signal degradation or
> phase problems.**"
> — *Axe-Fx III Owner's Manual*, The Grid

**Read that narrowly.** It is a statement about shunts, cables, splits
and merges — the *routing*. It is not a claim that two rows carrying
different blocks arrive at the merge in time with each other. Blocks
with different internal latency (look-ahead compression, different cab
mic distances, IRs of different lengths) will still land misaligned.

Two Fractal-specific gotchas:

- **Balance is not a pan.** *"Every block outputs both left and right
  signals. As you adjust to the left or right, the opposite channel
  gets quieter. Both the wet and the dry are affected."* Using Balance
  to place a parallel branch attenuates rather than repositions.
- **Bypass Mode THRU on a parallel time-based block doubles your dry.**
  Use **MUTE IN** (§ 1.7). This is the single most common parallel-
  routing error on Fractal and it manifests as "my parallel reverb made
  the tone louder and phasey" — because it did.

Fractal's Output blocks are also mixers in their own right, which is
how multi-destination rigs are built:

> "Every Output block includes a **multi-channel mixer. The channels
> correspond to the rows of the grid.** A Main level controls the
> master mix. Each channel and Main also have Balance controls."
> — *Fractal Blocks Guide*, Output Blocks 1–4

The manual's illustrated example shows six rows feeding Output 1 with
per-row Levels of −6.00, +6.00, +3.00, −2.00, 0.00 and +2.00 dB, and
per-row Balances of 0.0, 0.0, −100.0, +100.0, −50.0 and +34.0.

---

## 5. Gain Staging by Platform

### 5.1 The transparent leveler

Every platform has exactly one control that changes loudness without
changing character. Use it, and nothing else, to balance presets.

| Platform | Transparent leveler | What it is | What NOT to use |
| --- | --- | --- | --- |
| **Helix / HX** | Amp block **Ch Vol** | Post-power-amp level; doesn't touch the drive/master relationship | **Master** — sets the preamp-to-power-amp balance and is a *tone* control (TONE_SCIENCE § 4.2). Bible convention: `Master: 1.0`, `ChVol: 0.35–0.90` |
| **Helix, second pass** | **Output block Level** (0.0 dB = unity) | ±1–3 dB trim. *"large swings indicate you should fix the issue upstream"* | Global EQ Level, which also colours |
| **Fractal** | Amp block **Level** | Block output level | **Master Volume** (power-amp saturation) and **Input Trim** (preamp drive) — both are tone |
| **Kemper** | **Rig Volume** | *"this parameter does not drive the sound into any power amp distortion, so it will only change the volume of the sound, not the character"* | Amplifier Volume, which does |
| **Quad Cortex** | **Lane output** (stored in the patch) | Per-preset trim | I/O-page outputs — those are *global*, so they move every preset |
| **Boss Katana** | Amp **Volume** | Note: on Gen 3, LINE OUT is post-VOLUME and **not** affected by MASTER | **Power Control**, which changes power-amp behaviour on purpose |
| **TONEX Pedal** | **MAIN VOL** (−40 to +3 dB) | Global output | **TRIM IN** (−15 to +15 dB, default **+8.5 dB**) — that's your input stage |

Kemper's design intent is worth quoting because it's the opposite of
how most people use it: *"The PROFILER is designed so that every
PROFILE, distortion or compression will produce approximately the same
loudness… **If you feel that clean Rigs sound softer or louder than
distorted Rigs, please don't try to fix it by adjusting the volume of
the individual Rigs!** Instead, you should readjust the Clean Sens
parameter in the Input Section."*

### 5.2 Unity-gain discipline

The goal: **bypassing any block should not change the loudness.** If it
does, the player will use the block as a volume boost and then discover
in a mix that they've been playing a 3 dB louder chorus for years.

| Block | Unity means | Common violation |
| --- | --- | --- |
| Compressor | Makeup set so bypass is level-matched **by ear** | Matching the peak meter → 4 dB louder perceptually |
| Drive (off by default) | Engaging it is a deliberate +2 to +4 dB, or 0 dB for a pure tone change | Every drive at +6 dB, so the patch is a staircase |
| EQ | Broadband gain compensated for cuts and boosts | A 6 dB 2 kHz boost with no output trim |
| Delay / reverb | § 1.5 — the law decides; compensate at the block Level | Assuming engage = no change |
| Merge / mixer | § 4.2 | Leaving it at 0.0 dB after a split |
| Cab / IR | Level 0.0 dB, and don't use it as a leveler | Using Cab Level to fix a hot amp |

Headroom targets, from the Quad Cortex wiki's phrasing of the universal
rule: **12 dB for clean tones, 6 dB for distorted**, and *"keep each
block close to unity gain (bypassing the block shouldn't change the
overall volume too much)."*

### 5.3 Metering — peak, not loudness, everywhere

**No modeler here shows you a loudness meter.** They all show peak, and
peak is the wrong number for level-matching a compressed distorted
patch against an uncompressed clean one.

| Platform | What you get |
| --- | --- |
| **Helix** | Input/Output blocks fill green for signal present, red for clipping. Output, Send and FX Loop blocks show a level meter in the Inspector — *"The meter measures output level… displayed red… to alert you of clipping."* One bar for mono blocks, two for stereo |
| **Kemper** | A single OUTPUT LED, with a caveat worth reading: *"The PROFILER performs soft clipping and is very forgiving in terms of amplitude clipping, so there is no need to panic if the OUTPUT LED flashes red occasionally"* |
| **Quad Cortex** | Lane meter. Wiki method: *"turn the output lane up until it flashes, then turn it down some number of dB of head room, say 6 dB or so"* |
| **Fractal** | Per-block and output metering in Axe-Edit; blocks are floating-point internally |
| **TONEX** | TRIM IN has a LOW / OK / HI indicator — the only guided input calibration in the group |

**The working method:** match by ear at gig volume, then use the meter
only as a clipping check. ±1 dB perceived difference between presets is
inaudible live; ±2 dB is noticeable but workable; **beyond ±3 dB is
obvious** and should be treated as a failure.

### 5.4 Where digital clipping actually happens

Floating-point internals mean you cannot clip *inside* the chain on
Helix, Fractal or QC. You clip at three places:

1. **The A/D at the input.** Fix with input pad / Instrument level /
   Kemper Clean Sens / TONEX TRIM IN. Not with block levels.
2. **The D/A at the output.** Fix with the output block or the analogue
   output level setting.
3. **A Send jack feeding an external pedal.** Helix flags this
   specifically — Send/Return blocks have their own clip indicators.
   Instrument-level send into a stompbox, line-level into a rack unit.

---

## 6. Live Routing Recipes

### 6.1 Recipe A — FRFR only (the default)

```
guitar → modeler → [full chain incl. cab/IR] → FRFR wedge (stage)
                                             → FOH (XLR)
```

| Platform | Stage feed | FOH feed | Notes |
| --- | --- | --- | --- |
| Helix | 1/4" outs, **Line** | XLR outs, **Line** (or Mic if the desk has no line input) | Set **Volume Knob Controls → 1/4"** so the big knob moves your wedge, not FOH |
| Kemper | MONITOR OUTPUT (Master Mono by default) | MAIN OUTPUTS (Master Stereo) | Monitor Cab Off stays **off** — you want the cab |
| Quad Cortex | OUT 3/4, **TRS cable** (TS costs 6 dB) | OUT 1/2 XLR | Default Multi-Out feeds 1/2 + 3/4 + USB simultaneously |
| Fractal | Out 2, or **Output 2 → Copy Output 1** | Out 1 | Copy Output 1 gives *"an extra copy of the Output 1 mix with separate front panel level control"*, so you can *"adjust stage levels and house levels independently"* |

**Fractal caveat on Copy Output 1:** *"only works when the Output 2
block is NOT present on the grid for the current preset,"* and *"When
Output 2 | Copy Output 1 is enabled, Output 1 Global EQ settings are
NOT applied to signals at Out 2. Instead, the Output 2 Global EQ
settings apply as usual."*

Calibration note: cab block required, Global EQ high cut engaged
(§ 7.2), preset levels matched by ear at gig volume.

### 6.2 Recipe B — FOH gets the cab, the stage amp doesn't

The pre-cab split. This is the routing that separates a modeler player
who owns a real amp from one who fights it.

```
                        ┌─→ [Cab/IR] ─→ XLR ─→ FOH
guitar → [pre] → [amp] ─┤
                        └─────────────→ 1/4" ─→ power amp → guitar cab
```

The FOH branch has a speaker simulation because it's going through a
PA. The stage branch does not, because it's going through an actual
speaker. Running a cab sim into a real guitar cab is two speakers in
series and it sounds like a blanket.

**Kemper — best implementation, and it's global.** One switch:

> "The soft button labeled **'Monitor Cab Off'** in the Output Section
> will bypass the Cabinet PROFILE for the MONITOR OUTPUT, as well as
> for the built-in power amp of PowerHead and PowerRack. **The Cabinet
> PROFILE stays active for the other outputs, including the MAIN
> OUTPUTS.** This is a global setting and is therefore applied to all
> Rigs."

Costs no DSP, no path, no per-preset work. For a stereo stage rig,
enable **"Monitor Stereo"** and MONITOR + DIRECT OUTPUT become a stereo
pair with Monitor Cab Off applied to both.

**Fractal — a documented factory rig.** Fractal ships this as a named
setup, "FRFR/DIRECT TO FRONT-OF-HOUSE + BACKLINE":

> "custom presets simultaneously send two different signals — WITH
> speaker sims sent to a full-range front-of-house/monitors P.A. mix,
> and one WITHOUT speaker sims, sent to a 'backline' rig consisting of
> a power amp and traditional guitar cab… **Output 1 is at the end of
> the chain… and Output 2 taps the signal just before the cab block.**"

Grid: `IN1 → WAH → DRV → AMP → CHO → DLY → REV → CAB → OUT1`, with
**OUT2** tapped under CAB. The manual also flags the trap this creates
and the fix: *"the cab block has been moved to after the effects, which
may collapse them to mono at Output 1… Another solution would be to
split the signal after the amp into separate chains of
[Cab—Effects—Out 1] and [No-Cab—Duplicate Effects—Out 2]."*

Output counts matter here: **Axe-Fx III has 4 outputs, FM9 has 3, FM3
has 2.**

**Helix — a parallel path and a second Output block.** Line 6 documents
the idiom directly:

> "Move the Merge block down to path B. The Merge block shifts right,
> and a duplicate Output block is created… **Path A could be routed to
> the 1/4" outputs, while path B could be routed to the XLRs.**"

A preset can carry **up to four Output blocks (one or two per path)**,
with destinations `Multi`, `Path 2A/2B/2A+B`, `1/4"`, `XLR`,
`Send 1/2`, `Send 3/4`, and `Digital (S/PDIF, AES/EBU, L6 LINK)`.
Output block parameters are just **Pan** and **Level**.

**Helix gotcha that bites people:** *"Global EQ is never heard from
Send, Digital, or USB outputs."* If you feed the stage power amp from a
**Send**, Global EQ won't touch it — which is a feature if you know it
and a mystery if you don't. If you feed it from the **1/4" outs**,
Global EQ *will* touch it unless you set **Apply EQ** to XLR only.

**HX Stomp — it works, but only out the Sends.** From the HX Stomp
manual: *"There may be situations where you want parallel path B to be
sent to a completely different set of outputs… The Mixer moves to path
B, and a new Output block is created. In this case, **path A is being
sent from the HX Stomp Main L/R outputs, and path B is being sent from
its stereo Send L/R output**."*

The constraints are real: 8 blocks total, no XLR outputs at all, no
Path 2, and only one stereo Send pair — **so using Send L/R for the
stage feed costs you your FX loop.** The practical Stomp build is
`Amp → split → [Cab → Main L/R = FOH]` and `[no cab → Send L/R = stage
power amp]`, with all time-based effects placed *before* the split so
they're shared instead of duplicated.

**Quad Cortex — a split, not a switch, and still no per-output cab
bypass.** Verified as of **CorOS 4.0.0 (released 21 January 2026)**:
the release notes add Quad Cortex mini support, custom device naming,
footswitch Hold Timing, a Gig View footswitch toggle, four new virtual
devices (Nordic Concert Hall, Studio Plate 70, Blossom, Phase Doctor),
UI changes and seven bug fixes — **no per-output cab bypass and no
output-routing changes.** Neural's own forum still carries it as an
open feature request, explicitly citing *"competing units (such as the
Kemper Profiler's 'Monitor Cab Off')"*.

Neural documents the workaround in its own manual:

> "**Power Amp & Cab + FRFR/Direct** — This method is used to maintain
> a full signal chain that can be sent to a flat response system while
> sending a parallel signal to a cabinet with the cab device bypassed…
> use an **A/B Splitter to patch the signal before reaching the cab
> block to output 3 (OUT3/L)**."

The manual's other relevant example, "Combo Amplifier," is the
global-bypass version: *"Don't add a Cab block in your Preset. If the
Preset includes a Cab block, bypass it."*

The Grid is **4 rows × 8 device slots**; output blocks are reassignable
by tapping, and tap-and-hold gives **LANE OUTPUT CONTROL** with Volume,
Pan, Mute and Solo. **The cost:** every post-amp effect you want in
both feeds has to be duplicated on the second row, and the routing has
to be rebuilt into every live preset — there is no soundcheck switch.

**Boss Katana Gen 3 — you cannot get a dry feed from the line
outputs.** All of them are speaker-simulated:

- **LINE OUT** (mono 1/4", *100 / HEAD / Artist only — the Katana-50
  doesn't have one*): *"You can obtain powerful guitar amp sound just
  as if you were playing through the speaker."* Level follows the
  **VOLUME** knob; *"Since the [MASTER] knob does not affect the
  output, you can turn down the [MASTER] knob so that sound is output
  to a connected device without any sound being produced from the amp
  itself."* That's a genuinely useful silent-stage feature.
- **PHONES/REC OUT** (stereo 1/4"): also speaker-simulated, follows
  VOLUME *and* MASTER, and mutes the internal speaker when a plug is
  inserted.
- **LINE OUT AIR FEEL**: `REC` (distant mic), `LIVE` (close mic),
  `BLEND`, and — via BOSS Tone Studio — `CUSTOM SETTING` with two
  configurable mic type/position slots (M1, M2). On Gen 3 hardware the
  panel control is **Artist only**.

The only cab-less tap on a Katana is the **SEND** jack of the mono FX
loop (100/HEAD/Artist only). *Katana MkII specifics are
community-sourced only — see § 10.*

**TONEX Pedal — physically impossible.** One stereo unbalanced output
pair, and *"The headphones output is a copy of the main OUTPUT."* Cab
control exists at two levels, both all-or-nothing: per-preset **CAB
active/bypass**, and a global **CAB — Global cabinet bypass: enables/
disables the cabinet globally on all PRESETs.** That global switch is
the closest analogue to Monitor Cab Off, but it kills the cab on the
only output — a "tonight the whole rig goes into a real power amp"
switch, not a split.

### 6.3 Recipe C — Wet/Dry/Wet

Three amps: a dry amp in the middle carrying the guitar, two wet amps
carrying nothing but effects.

```
                          ┌────────────────────→ dry amp (centre, mono)
guitar → [gain stage] ────┤
                          └─→ [time FX 100% wet] → wet L / wet R (hard panned)
```

**The five rules.**

1. **Put the split after everything that should hit all three amps.**
   *"The splitter/ABY pedal should be situated after every effect that
   you want to hit all 3 amps."* Anything after the split reaches one
   side only.
2. **Dry path gets the gain stage and the non-time-based effects** —
   distortion, overdrive, fuzz, compression, tremolo, wah, octave.
   **Wet path gets delay, reverb, and usually modulation.**
3. **Every wet block runs 100% wet.** *"Use a delay that allows you to
   turn the dry sound all the way down. That way you won't get weird
   phase cancellation issues between the dry and effect speakers."*
   The mechanism is exactly the mix law from § 1.1: at Mix 50% on a
   linear-law device you are emitting a **−6 dB copy of your dry signal
   out of the wet speakers**, time-offset and spatially separated from
   the real dry amp. That copy sums acoustically in the room and again
   in the FOH mix. Mix 100% removes it.
4. **Wet amps hard panned, dry amp centre and mono.** *"The 2 wet amps
   could be panned hard left and right, giving a wider spread of the
   effect in the PA system, while the main dry amp is run in mono and
   spread evenly between the two sides."*
5. **Level the wets against the dry at gig volume.** The ratio that
   sounds right at 70 dB is drowning at 100 dB.

**Kemper has this built in.** Set a stereo output's **Output Source**
to `DLY/REV wet`:

> "Only the wet stereo effect signal of the delay and reverb located in
> the modules DLY and REV are sent to the output. **If no delay or
> reverb is active, the output will remain silent.**"

Combine with `Stack` on another output (*"tapped directly behind the
stack section and does not include any post amp effects"*) for the dry
feed and you have W/D/W from two menu selections.

**Fractal** does it with the per-row Output mixer (§ 4.5): dry chain on
one row, wet chains on others, then per-row Level and Balance in each
Output block build the dry-centre / wet-hard-L-R picture.

**Helix** — a documented real-world build: Path 1A carries the dry mono
signal to a **Send block** feeding the centre speaker; Path 1B carries
stereo wet to **Multi**; Paths 2A/2B carry additional wet effects. The
builder's own mandatory rules: *at least one effect block on each wet
path must be on; at least one block on each wet path must be 100% wet;*
Spread set to 10 so the effects go hard L/R; the Send block's **Dry
Thru** control manages wet/dry balance; and **tremolo/autopan stays on
the dry path** so it modulates guitar volume rather than the effects.

**Output counts:** you need three discrete feeds minimum. Helix Floor
(1/4" + XLR + two Send pairs) and Axe-Fx III (four outputs) are
comfortable. **FM9 (3 outputs)** is workable. **FM3 (2), HX Stomp
(Main + one Send pair) and Quad Cortex (two pairs)** can do two feeds,
not three. **TONEX Pedal (one pair) cannot.**

---

## 7. Global EQ and Output Calibration

### 7.1 What each platform gives you

| Platform | Structure | Scope |
| --- | --- | --- |
| **Helix (Floor/LT/Stomp, 3.x)** | *"three fully parametric bands plus variable low and high cut filters."* HX Edit: the cuts are **shelving**; the three parametric bands have **Frequency, Gain (±12 dB), and Q** | One EQ, with an **Apply EQ** parameter choosing 1/4" only, XLR only, or both. ***"Global EQ is never heard from Send, Digital, or USB outputs"*** |
| **Helix Stadium** | Same band structure, plus a **Matrix Mixer** — *"lets you set up completely different cue/monitor mixes for the 1/4", XLR, or Phones outputs"* | Per-output |
| **Fractal** | **Four separate Global EQ pages, one per output.** *"These EQs affect ONLY the Analog outputs. AES/SPDIF/USB are not affected"* | Genuinely per-output — the only platform here that gives you four |
| **Kemper** | Separate **Main Equalizer** and **Monitor Equalizer** in the Output Section. All Output Section settings are global but savable as **output presets** *"tailored to specific venues, studios or rehearsal rooms"* | Per-output |
| **Quad Cortex** | Global I/O EQ | Per-output pair |
| **Boss Katana Gen 3** | **GLOBAL EQ**, placeable *"either before (INPUT) or after (OUTPUT) the effect chain"*, plus TONE SHAPE and (Artist) CABINET RESONANCE | Global |

**The filter-slope detail that explains most confusion.** On Helix, the
**Cab and IR block cuts are 6 dB/octave**, while **EQ blocks and Global
EQ cut at 12 dB/octave**. The same number in the two places does very
different things: a high cut of **4.7–5.5 kHz on an IR block** is
roughly equivalent to **8–10 kHz on an EQ block**. Fractal publishes
its slopes outright — the Cab block's per-IR filters run *"from very
gentle (6 dB/octave) to steep (24 dB/octave)"* via Low Slope / High
Slope.

Always state which filter a number belongs to. A recipe that says
"high cut 6 kHz" without saying whether that's the cab block or Global
EQ is ambiguous by roughly an octave.

### 7.2 Live starting values by destination

These are starting points to be adjusted at soundcheck, not settings.
The bracketed figures are the range of *cited* values from experienced
players; where they disagree, both ends are shown.

| Destination | Low cut | High cut (12 dB/oct, Global EQ or EQ block) | Why |
| --- | --- | --- | --- |
| **FRFR wedge / PA** | **80–125 Hz** *(cited: 72 / 125 / 0–120 / 150 Hz)* | **6–9.5 kHz** *(cited: 6 / 8+ / 9.5 kHz)* | The case that needs the most filtering. See the mechanism below |
| **FOH (XLR)** | 80 Hz | 8–10 kHz | Go gentler than the wedge — the engineer has their own HPF and will do it better. Send them something shapeable |
| **Real guitar cab (pre-cab split)** | Off, or 60 Hz | **Off** | The speaker already rolls off hard above ~5 kHz. Adding a high cut on top produces a muffled stage sound. Most common global-EQ mistake in a hybrid rig |
| **In-ear monitors** | 100–120 Hz | **6–7 kHz** *(equivalently 4.7–5.5 kHz on a 6 dB/oct IR-block filter)* | IEM drivers couple straight into the ear canal: no room, no air absorption, no distance. Everything that softened the top at 20 feet is gone |
| **Studio / DI** | Off | Off | Fix it in the mix, with better tools than a three-band |

**Why FRFR needs a high cut that a real cab doesn't — and it is not
what most people think.** The reason isn't the FRFR box's tweeter; it's
the *mic technique baked into the IR*. Virtual cabs and IRs are
captured close-miked, on-axis, at or near the dust cap — the brightest
possible position — because studio engineers expect to EQ afterwards.
As one Line 6 forum contributor put it: *"A close miked guitar amp will
sound just like putting your ear up to that cone, not a pleasant
experience."* A real guitar speaker in a room is highly **directional**:
its top end beams away from you and the room absorbs the rest, so you
get an HF rolloff for free. An FRFR box has **wide dispersion**, so it
broadcasts that close-mic fizz evenly across the room with nothing to
save you.

Two consequences worth internalising:

- The amount of high cut you need scales with **how bright your IR is**,
  not with your speaker. Swap the IR, re-dial the cut.
- Helix's **Tilt EQ** is a more natural alternative to a brick-wall high
  cut — it simulates moving the mic off-axis rather than lopping the
  top off. A cited starting point is around *"dark 50."*

And the volume caveat that invalidates half of all bedroom EQ work:
**"What sounds great at low volume will be biting and fizzy at high
volume."** Dial the cuts at gig level.

*Our own per-block reverb cuts (LowCut 125 Hz / HighCut 6500 Hz, Bible
§ 3) are tighter than these because they shape the reverb **tail**
specifically, not the whole signal. Don't confuse the two.*

### 7.3 Output level calibration

| Setting | Helix | Fractal | Quad Cortex | Katana Gen 3 |
| --- | --- | --- | --- | --- |
| To a stompbox / front of a guitar amp | 1/4" Outputs = **Instrument** | — | — | — |
| To a mixer / monitors / recorder | 1/4" Outputs = **Line** | Output Level **+4 dBu** (pro) or **−10 dBV** (consumer, default) | Out 3/4, **TRS cable** | LINE OUT (mono, post-VOLUME) |
| XLR to a mic input | XLR Outputs = **Mic** | — | Out 1/2 | — |
| XLR to a line input | XLR Outputs = **Line** | — | — | — |
| FX loop to a pedal / rack | Send/Return = **Instrument** / **Line** | — | — | — |
| Max output level | **not published** | **+20 dBu** on Outputs 1–4, 600 Ω | XLR **+9.5 dBu**; TRS 3/4 **+15.5 dBu balanced / +9.5 dBu unbalanced** | not published |
| Ground lift | Rear-panel button (Stadium: XLR Ground Lift menu setting) | XLR Ground Lift on Out 1 & 2; **Humbuster cables** recommended on the 1/4" outs | Per-output GROUND LIFT switches | — |
| Mono connection | *"connect only the LEFT/MONO"* jack | Output Mode = **SUM L+R** or **COPY L>R** | — | LINE OUT is mono |

**What to tell the FOH engineer.** Fractal publishes the clearest
version of this and it applies to every modeler in the list:

> "If you are working with a sound technician, be sure to tell them
> that you are outputting a **hot LINE level input — NOT a microphone
> level signal. They should use a balanced line input without a
> preamp**."
>
> "…the Axe-Fx III outputs a **direct LINE level signal which should
> initially not require any EQ or settings typically used on a mic'd
> guitar cabinet**."

**Three live-safety and live-sanity items:**

1. **Phantom power.** Line 6, in capitals: *"IMPORTANT! Never connect
   the Helix device's XLR outputs to a device whose XLR inputs have 48V
   phantom power enabled!"*
2. **Set the Volume knob's scope deliberately.** Helix's *Volume Knob
   Controls* exists so you *"control the level sent from the 1/4"
   outputs to your stage monitor without affecting the XLR level sent
   to the front-of-house mixer."* Set it to `Digital` and *"Helix's
   1/4" and XLR outs will be at unity level."* If you don't set this,
   you will turn yourself down in FOH at the worst possible moment.
3. **Helix 1/4" outs are unbalanced TS.** Keep those runs short; long
   stage runs belong on the XLRs.

**Kemper's Master Volume links everything by default** and is a 0–10
scale, not dB, precisely because *"output volumes of linked outputs
might vary."* Unlink Headphone and Monitor from Master before a gig
unless you want one knob to move all three.

**Kemper's headphone/IEM helper:** the **Space** parameter *"adds a
small room simulation to the master signal,"* addressing the
*"in-the-head localization"* fatigue you get monitoring a mono-ish
signal on headphones. It's a monitoring aid, not a tone — it belongs in
the Output Section, not in a recipe.

---

## 8. Mono-Sum Survival

The worship ICP's most expensive failure. The patch is perfect at home,
perfect in the wedge, and at the service it's thin, or the reverb is
gone, or the chorus vanished. Almost always: FOH summed L+R.

### 8.1 Why it happens even in "stereo" rooms

> "**If we tried the same hard-panning techniques in live sound,
> roughly one third of the audience would be missing critical elements
> in the mix**, because those in the center could hear both
> loudspeakers, while those on the far left and right would miss the
> sounds coming from the opposite side."
> — James Attaway, ProSoundWeb

and from the design side, a consultant's realistic compromise: *"If we
can design a room to be 80% stereo, **any zones outside the stereo
field would get a mono sum of the left-right mix** so everyone in the
room can hear everything."* Even a well-designed stereo room sums your
guitar for the outer sections.

Fractal's one-sentence version, which is the best framing for a recipe
note: *"stereo separation may not always translate well to a live
audience. People seldom are in the right spot to hear both sides
equally well. Also, many PA systems are mono."*

**There are two different failures, and they break different things:**

- **SUM (L+R)** — kills anything that is the same signal with opposite
  polarity: wideners, inverted-wet choruses, 2290-style dual delays.
- **HALF-STEREO** (only the left cable patched) — kills anything living
  on one side: ping-pong repeats, auto-panners, one half of a
  hard-panned dual cab.

A patch can survive one and die in the other. Fractal's manual names
the exceptions for half-stereo explicitly: it *"works fine, aside from
the exceptions such as ping-pong, panning, etc."*

### 8.2 The level ladder

Relative to a centre-panned dry guitar, which is unaffected:

| Content | Mono-sum change | Mechanism |
| --- | ---: | --- |
| Centre / correlated (dry, mono FX) | **0 dB** | Reference |
| Decorrelated stereo (true stereo reverb tail, dual-LFO chorus) | **−3 dB** | Power sum, not amplitude sum |
| Present on one side only (ping-pong tap, one leg of a hard-panned dual cab) | **−6 dB** | Only one leg contributes |
| Same signal, opposite polarity | **−∞** | Complete cancellation |

The −3 dB row is the answer to *"my reverb got quieter and I don't know
why."* It didn't — the dry stayed and the wet lost 3 dB relative to it,
which reads as a drier patch.

### 8.3 Comb filtering — the numbers

Sum a signal with a delayed copy of itself and you get
|H(f)| = 2|cos(πfT)|: peaks +6 dB, nulls −∞, repeating forever.
First null at **1/(2T)**, spacing **1/T**.

| Delay | First null | Null spacing | What it sounds like on guitar |
| ---: | ---: | ---: | --- |
| 0.5 ms | 1000 Hz | 2000 Hz | Hollow, nasal — notches in the core midrange |
| 1 ms | 500 Hz | 1000 Hz | **Worst case.** Guts the body and the presence together |
| 2 ms | 250 Hz | 500 Hz | Thin, phasey |
| 5 ms | 100 Hz | 200 Hz | Noticeable low-mid scoop |
| 7 ms | 71 Hz | 143 Hz | Loses weight; mids mostly survive. *(= Fractal Classic Enhancer at Width 35%)* |
| 10 ms | 50 Hz | 100 Hz | Mostly cosmetic on guitar |
| 20 ms | 25 Hz | 50 Hz | Nulls below the guitar's range — reads as "not wide any more," not tone damage. *(= Classic Enhancer at Width 100%)* |
| 30 ms | 17 Hz | 33 Hz | Approaching audible slapback |

**The counterintuitive part, and the thing to teach:** *short*
micro-delays do far more damage in mono than long ones. A 1 ms Haas
offset destroys the tone; a 20 ms one just stops being wide. If you
must widen with delay, go long.

If the two sides aren't at equal level, the nulls shallow out: with
amplitudes 1 and *a*, null depth is 20·log₁₀(1−a). Dropping the delayed
side 6 dB (a = 0.5) turns a total null into a −6 dB dip. Costs width,
buys survivability. *(The −6 dB figure is a widely-repeated rule of
thumb; the arithmetic behind it is exact.)*

### 8.4 The kill list

| Effect / setting | Mono behaviour | Severity |
| --- | --- | --- |
| **2290-style dual delay, one side polarity-reversed** | **Repeats vanish entirely.** Fractal on its own model: *"the delays disappear entirely if the signal is summed to mono after the Delay block… due to phase cancellation"* | Fatal |
| **"80s" / Triangle-style stereo chorus** | **Chorus vanishes entirely.** Fractal: *"Some chorus types (such as 80s and Triangle) 'invert' the wet sound on one side. If you're collapsing the signal to mono after the Chorus block, the wet side will completely cancel and you'll hear no chorus at all."* A user filed it as a bug: *"at 100% there is no volume at all"* | Fatal |
| **Fractal "Vintage tape" chorus** | *"It sums the left and right block inputs into mono, so use caution as stereo cancellation may occur"* | Fatal |
| **Any chorus/flanger with LFO Phase 180°** | Wet cancels | Fatal |
| **Auto-panner / tremolo at 180° LFO phase** | *"Use 0° for a true Tremolo, or 180° for perfect panning."* At 180° the channel gains are exact complements, so the modulation sums to a constant — **the panning disappears; the level doesn't** | Fatal to the effect |
| **Haas / micro-delay widening** — Fractal "Classic" Enhancer, Helix Dual IR `Delay`, any manual L/R offset | Comb filter per § 8.3. Fractal: *"the Enhancer in Classic mode can cause phase cancellation. Use the Modern or Stereoizer mode instead."* Cliff Chase: *"An allpass filter is a crude approach and will create comb filtering when collapsing to mono"* | Severe, tonal |
| **Fractal Delay "Right Post Delay" / Time Offset** | A hidden widener: *"Widens the sound of a mono echo by adding 0–100 ms of delay at the right (wet) output."* Anything set here is a mono comb filter | Severe |
| **Helix Dual IR block with `Delay` > 0** | Line 6 ships a Haas widener inside the cab block: *"Delays either the 'A' or 'B' IR up to 50 ms… to simulate a 'double tracking' effect — most effective when the two IRs are also panned opposite."* Panned opposite + delayed = a mono comb filter | Severe |
| **Helix Dual IR / Dual Cab `Polarity: Inverted`** | Line 6's own troubleshooting advice — *"If you encounter audible phasing, try setting one IR's Polarity to Inverted"* — creates a mono null. It fixes a stereo problem by building a mono one | Fatal |
| **Merge Mixer `B Polarity`** (Helix) / **Mixer `PHASE`** (QC) | Whatever's on that branch cancels in mono. Line 6: *"Typically, this should be set to 'Normal.'"* | Fatal |
| **Ping-pong delay, SUM to mono** | **Survives.** Taps are at different *times*, so nothing cancels — repeats collapse to centre and you hear them all, so perceived repeat rate roughly doubles vs what each ear heard. Fractal's wiki maintainer, after testing: *"No problems when summing the output to mono"* | Safe (rhythm feel changes) |
| **Ping-pong delay, HALF-stereo** | *"you will lose one of the repeats"* | Severe |
| **Stereo reverb (mono-in / stereo-out — the standard design)** | **Survives.** Fractal documents its topology: *"The signal which gets reverberated is first summed to mono. The resulting reverberated wet output… is stereo, except for the Spring reverb type."* Tails are decorrelated, not inverted, so they sum at +3 dB → **−3 dB relative to the dry.** Early reflections are the risky part (sparse, near-identical between channels); the diffuse tail combs harmlessly | Safe, 3 dB drier |
| **Rotary / Leslie sim** | **Survives better than its reputation.** Doppler warble, amplitude modulation and horn/drum voicing live in the signal, not the L/R difference — only the mic-spacing throb does. Fractal's Rotary defaults `Mic Spacing: 0` (*"simulates a mono mic on the drum"*) and adds *"You'd be surprised at how many rotary recordings are actually mono!"* | Safe, narrower |
| **Hard-panned dual cab, two different IRs** | Irregular partial cancellation, not a clean comb, because the branches carry genuinely different signals. Expect midrange colouration and loss of size. Line 6 confirms the architecture: *"Dual Cab blocks are stereo, with each of its two Cab models panned hard left and right"* | Moderate, tonal |
| **Kemper Single Delay with Stereo raised** | *"This stereo effect is created by phase shifts, but is **fully mono compatible**. This means the effect disappears naturally, without side effects, when the signal is mixed down to mono at playback"* | Safe by design |
| **Kemper Stereo Widener** | *"when the signal is summed to mono, the effect is **completely canceled out with no coloration** to the sound"* | Safe by design |

**Roland Dimension D / Boss Dimension chorus:** sources conflict. Some
describe it as two delayed signals out of phase; others say the
Dimension line specifically avoids the phase problems other choruses
have. Fractal attaches mono-cancellation warnings to its 80s and
Triangle types but *not* to its Dimension types — suggestive, not
proof. **Treat as "probably more mono-tolerant than an 80s chorus;
verify on your rig."**

**Roland JC-120 chorus circuit:** the claim that the JC-120's chorus
wet path is polarity-inverted to one speaker is widely repeated and
circumstantially supported — its modeled descendants demonstrably do
cancel — but we found no schematic to confirm it. **Not stated as fact
here.**

### 8.5 The pre-gig test procedure

Ten minutes, once, before you trust a setlist.

**Step 1 — sum, and listen.**

| Platform | How |
| --- | --- |
| **Fractal** | `SETUP: I/O: Audio` → the output's **Mode**: STEREO / **SUM L+R** / **COPY L>R** / MUTE. Best-in-class — a global toggle, per output. The manual even warns you why: *"summing has its own issues. For example, short delays or phase differences between channels can result in strange artifacts or cancellation"* |
| **Helix / HX** | No global sum. Use Line 6's own documented behaviour — *"Adding a mono effects block will collapse any preceding stereo blocks on the same path to mono."* Drop a **mono Gain or mono EQ block at the end of the path** and toggle it |
| **Quad Cortex** | No clean built-in sum. **Do not use a Y-cable** — passively shorting two outputs together is not summing, and users report cancellation. Sum in a DAW over USB, or on the console. *(CorOS 4.0.0 added a "Phase Doctor" device for alignment — see § 9.4 — but that is not a sum-to-mono switch.)* |
| **Kemper** | Set the output's **Output Source** to **Master Mono** and A/B against **Master Stereo**. Kemper's own note: *Master Left "will sound similar to 'Master Mono' but often less dense, depending what stereo effects are used"* |
| **Any platform** | Sum on the console: pan both channels centre |

**Step 2 — half-stereo, separately.** Unplug the right cable. Different
test, different failures.

**Step 3 — compare correctly.** The methodological trap: don't A/B
stereo against mono. Stereo always wins, whether or not there's a
cancellation problem, because ears prefer stereo. **Compare COPY L>R
against SUM L+R.** Both are mono, so any difference between them is a
real routing problem and not a stereo-preference illusion.

**Step 4 — the console polarity check** (hand this to your volunteer
engineer; it needs nothing from the modeler):

> "Sum both the left and right channels to mono… and flip the polarity
> of one of them. **If the output level goes down or if the low
> frequencies get quieter, then it's not very de-correlated. If they
> stay about the same, it's more de-correlated.**"
> — James Attaway, ProSoundWeb

Inverted for our purposes: **if flipping polarity on one side makes
your guitar louder or fuller, you have polarity-inverted widening in
the patch and it will null when summed.**

**Step 5 — free channel-identity check.** Run a ping-pong delay. The
first repeat should come out the LEFT channel. If it doesn't, someone
has your cables crossed and every pan decision you made is backwards.

### 8.6 Mono-safe substitutions

The governing rule, and the only one you need to memorise: **make the
two channels carry genuinely different signals, never the same signal
with a polarity or micro-delay offset.**

| Instead of | Use |
| --- | --- |
| 2290-style dual delay with an inverted side | **Two delays at different times, both centred.** Different times = different signals = cannot cancel |
| Ping-pong, when FOH might take one side only | A centred dual delay. (Ping-pong is fine for *summing* — half-stereo is what kills it) |
| Stereo chorus with an inverted wet channel | **Chorus with LFO Phase 0°**; get width from an L/R *delay-time* offset, not polarity |
| "Classic" / Haas enhancer | **Modern or Stereoizer** mode — *"The effect is mono-compatible: there are no phasing problems when summing to mono"* |
| Wide stereo reverb | **Stereo Width / Stereo Spread 0%**, or a **Spring** algorithm (mono by design), or two parallel reverb blocks fed differently and panned |
| Stereo rotary | **Mic Spacing / Stereo Spread 0%** — Fractal's default anyway |
| Hard-panned dual cab | Two *different* cabs are safe-ish. Pull the pans inside ±30 and it's a level trim in mono instead of a −6 dB hole |
| Helix Dual IR with Delay > 0 | **Delay 0, Polarity Normal.** Get width from two genuinely different IRs |
| Any Haas widening | **Slight panning instead of processing** — ±20 to ±30 rather than a micro-delay |
| Widening you really need | **M/S-based widening**, which is inherently mono-compatible |

**The standing pattern: stereo to IEM, mono to FOH.** Fractal makes it
trivial — output modes are per-output, so OUT 1 runs STEREO to FOH and
OUT 2 runs SUM L+R to your monitor, or the reverse. On Helix, run the
1/4" pair to your wedge in stereo and the **LEFT/MONO XLR** to FOH.
Regardless of platform, **build the mono version and have it ready** —
plenty of engineers simply will not take two channels for a guitar.

### 8.7 The honest counter-example

A church FOH engineer, writing in ProSoundWeb, deliberately uses a Haas
delay to widen a mono source: he double-patched one B3 mic to two
hard-panned channels and *"settled on about 5 msec for one channel,"*
adding *"This technique could also be useful on guitars, or mono
keyboard sends."*

By § 8.3, 5 ms puts its first null at 100 Hz with notches every 200 Hz.
It works for him because **he controls both channels and knows the
room.** It is exactly what goes wrong when a guitarist bakes it into a
patch and hands it to an unknown board. That's the distinction worth
teaching — not "never use Haas," but "never *ship* Haas."

### 8.8 The state of our own catalogue

Measured against `src/lib/data/index.ts`, July 2026:

- **253 of 253 Helix cab blocks** have `Delay: 0` and `Pan: 0.5`. No
  Haas offsets, no hard pans. Clean on the single worst mono trap.
- **~8 recipes** ship a block whose identity is stereo: rotary/Leslie
  (`thayil-black-hole-sun-rotary-verse`, `keuning-mr-brightside-riff`,
  `mccready-alive-solo`, `gilmour-money-solo`) and stereo chorus
  (`marr-this-charming-man-jangle`, `marr-there-is-a-light-jangle`,
  `dimebag-cemetery-gates-clean-to-crushing`), plus one stereo delay.
  These need a `mono_note`.
- **No recipe declares mono behaviour at all.** That's the gap
  `mono-safe-declared` closes.

---

## 9. When a Split Earns Its DSP

Honest table. "Earns it" means the split does something a series chain
or a Mix knob measurably cannot. Several widely-repeated claims in this
area turn out not to survive checking; those are called out.

### 9.1 Splits that earn it

**Fuzz with a clean blend — earns it, *conditionally*.**
The documented rationale is bass-first: Sound On Sound notes that
*"putting a fuzz or distortion in series on bass can be too much"* and
recommends parallel blending, demonstrating it on guitar to *"restore
some of the sense of clarity which can often be lost in a heavily
distorted signal."* Darkglass describes its blend as *"the clean signal
remains at unity gain while the volume of the overdriven signal is set
by the Level knob."*

Two conditions, both documented, both regularly ignored:

1. **Resolve polarity first.** No pedal manufacturer we could find
   documents phase-aligning its internal clean blend. Builders treat it
   as a case-by-case problem: *"The Split N Blend or Buff n Blend
   sometimes doesn't play well with circuits that flip phase of the
   signal"* — determine whether the circuit inverts, then add an
   inverting stage or a phase switch. Lehle ships a **180° phase
   switch** on its parallel mixer for exactly this reason: *"Some
   pedals flip the phase when activated. This is a known issue."*
2. **Don't buffer-split into a fuzz.** Lehle again: *"Most fuzz pedals
   don't like buffered sounds or buffering at all, because this is what
   you are doing when splitting a signal actively."* An active split
   changes the fuzz's input-impedance interaction with your pickups —
   a separate degradation from phase, and one you can't EQ back.

*Anchor:* dry at −6 to −3 dB against the fuzz; low-cut the fuzz branch
around 150 Hz so the two aren't fighting for the same octave. **Our
recommendation, not a citation.**

| Split | Why it works | Anchor |
| --- | --- | --- |
| **Cab for FOH, no cab for a stage amp** | Not a tone choice — two destinations physically need different signals. The only split that is never optional | § 6.2 |
| **Two amps with genuinely different voicings** | Different circuits are different signals: they cannot null, and the composite has content neither has alone | The 3 dB test (§ 2.2 Q2) |
| **Shimmer / octave-up under a dry note** | The pitched branch is harmonically unrelated to the dry, so it adds without masking. Serial placement feeds the shimmer back into itself | Pitched branch −12 to −8 dB, high-passed at 300 Hz |
| **Reverb you automate per snapshot** | Keeps tails constant across snapshot changes | § 1.7 |
| **Post-processing only the wet path** | A filtered, pitched or compressed *repeat* is impossible with a Mix knob. Fractal's routing examples include *"an entire parallel chain for a shimmery, filtered effect with a VOLUME block for its own 'Send' control"* | — |
| **Crossover / frequency split** | See § 9.3 — the structurally strongest case in this whole document | 150–300 Hz on bass |
| **Wet/dry/wet** | Three amps physically cannot be a series chain | § 6.3 |

### 9.2 Splits that don't earn it

**Parallel compression — the manual says the Mix knob already is it.**
Fractal, Compressor block:

> "**Mix** – Sets the ratio of wet (compressed) and dry (unprocessed)
> sounds. This would normally be set to 100% but **lower settings allow
> parallel compression, also known as 'New York' compression**."

Building a second row to do this costs DSP and buys nothing. The one
genuine reason to still use a real parallel row is sidechain source
control — Fractal's comp offers `BLOCK L` / `BLOCK R` sidechain
options, *"useful when the compressor follows an effect with one side
out of phase (delay, chorus, enhancer)"* — which a Mix knob doesn't
give you.

*Honest gap:* we found **no rigorous guitar-specific parallel-
compression blend figures.** The commonly cited numbers (≈35% on kick,
≈55% on snare, ≈70% on overheads) are drum-bus guidance. The −6 to
−3 dB figure in § 3.2 is our recommendation, not a citation.

**Two similar-voiced amp models in parallel — this one holds up, with
hard evidence.** A Kemper user re-amped the same DI through two
instances of *the same profile* and still got *"the chorusing / comb
filtering and other phase artifacts,"* worst on chords. The design rule
from both the Kemper and Line 6 threads: **two amps in parallel only
earn their DSP if their spectra barely overlap** — EQ-carved, or
crossover-split. Otherwise you're paying DSP for comb filtering. Line 6
adds the practical detail that changing **mic distance or mic type** in
the cab block changes time alignment and therefore the phase
relationship, and the fix: a Simple Delay block on one path in
**0.1 ms increments**, mimicking real mic repositioning, checked by
collapsing to mono.

**Delay or reverb on a parallel path when a Mix knob would do.**
Identical audio, one wasted path — unless you need constant tails,
exact unity dry, wet-only post-processing, or a different destination
(§ 2.2 Q1).

**A split "for width" using a small delay on one branch.** That's a
Haas widener. § 8.3 — a mono comb filter with extra steps.

**Two mid-gain overdrives in parallel — the received wisdom here is
contested, and we're not going to pretend otherwise.**
We went looking for evidence that parallel drives are worse than
series, and found the opposite. Lehle argues that in parallel
overdrives *"just add"* without influencing each other negatively,
whereas in series *"your sound gets muddy, undefined and any
transparency is lost."* That Pedal Show built an entire episode
advocating parallel drives. Hamilton Effects frames it as a *different*
result rather than a worse one: series means *"the first stage shapes
and clips the signal, and the second stage receives that
already-processed waveform,"* giving greater saturation, while parallel
means *"each signal path keeps its own character,"* retaining clarity
and attack.

**The honest verdict:** the documented downside of parallel drives is
**polarity mismatch** — which is why Lehle ships a 180° switch — and,
for fuzz, **buffered-splitter loading**. Not intermodulation, and not
"no added harmonics." Our house preference for series stacking is a
*taste and DSP-budget* position, and the recipes should say so rather
than dressing it as physics. What *is* defensible: series costs nothing
and cannot null, parallel costs a path and can — so series is the right
default, not the right answer.

### 9.3 Crossover splits — the strongest structural case

Fractal's Crossover (XVR) block:

> "A crossover splits an audio signal into high and low frequency
> components so they can then be handled separately. This two-way
> stereo crossover block contains **4th-order Linkwitz-Riley filters
> for excellent separation.** You can use two crossover blocks to
> create a three-way crossover by feeding the output of one into the
> other. Applications include splitting a signal into two different
> amps, or creating 'multi-band' effects such as polyfuzz or hi-lo
> chorus."

Helix's Split > Crossover: *"Any signal above this frequency is sent to
Path A (upper); any signal below this frequency is sent to Path B
(lower),"* with a **Reverse** switch to swap them. Note that a bypassed
Helix Split *"sends both left and right signals to both paths equally"*
— i.e. it degrades to a Y split, which is the safe failure.

**Why a crossover split behaves better than a Y split, structurally:** a
4th-order Linkwitz-Riley's two outputs sum to **flat magnitude with the
bands in phase at the crossover point**. That is precisely why Fractal
specifies LR4 in that block. A Y split gives you two copies of the same
signal that *can* cancel; an LR4 split gives you two bands that
*cannot*, because they barely overlap. This is the strongest technical
argument in this document for any split. *(The LR4 summing property is
standard filter theory; Fractal documents the filter type, not the
consequence — the inference is ours.)*

**Cited frequencies:** the only quantified source we could reach is
bass-specific — split at **~150–300 Hz**, distortion/overdrive/
compression on the upper band, clean compression on the lower — with
~200 Hz noted as the threshold above which clean modulation and delay
*"glisten and shimmer"* on bass.

**Gap:** we found **no source giving a crossover frequency for baritone
or 7/8-string guitar specifically.** The 150–300 Hz figure is bass
guidance. A low B on a 7-string (B1 ≈ 61.7 Hz) is an octave above a
bass low B (B0 ≈ 30.9 Hz), so extrapolating downward is our inference,
not a citation — treat **120–250 Hz** as a starting point to test, not
a published number.

Cheaper alternative that needs no split at all: an EQ before the drive,
cutting lows into it. Same intent, one block.

### 9.4 The latency question — and a correction

**Correction to a claim we have repeated elsewhere:** *"Fractal has
automatic delay compensation that time-aligns parallel rows"* is **not
supported by the Axe-Fx III Owner's Manual.** The only "Delay
Compensation" in that manual is a parameter in the **IR Capture
utility**, for compensating far-field mic distance and mixer latency
(*"the speed of sound is roughly 1 ft/ms so a mic that is 10 ft from
the speaker would incur roughly 10 ms of delay"*). Don't cite it for
row alignment.

What each vendor actually says:

- **Fractal:** splits and merges are *"sonically transparent… zero risk
  of signal degradation or phase problems."* That's the routing layer.
  It says nothing about blocks with different internal latency.
- **Line 6:** no delay compensation, no latency discussion, and no
  phase discussion in the routing chapter. What Line 6 *does* ship is
  **B Polarity on every Merge block** — a tacit acknowledgement that
  merges can go wrong.
- **Neural DSP:** documented user-level misalignment when running two
  amps or captures in parallel lanes (the community explanation being
  that captures aren't necessarily phase-preserving; one user described
  the result as a *"wah pedal in the ½-depressed position"* sound) —
  and then, in **CorOS 4.0.0 (January 2026), Neural shipped "Phase
  Doctor,"** described as a utility for fixing phase issues in stereo
  rigs and multi-amp setups. **A major vendor shipping a dedicated
  alignment tool in 2026 is the clearest available evidence that
  parallel lanes are not automatically aligned.**

**Two mitigations that always work:**

1. **Keep branch block counts equal** where you can.
2. **Check for it.** Play a clean palm-mute with both branches at equal
   level, then flip one branch's polarity. If the sound gets *thinner*
   with polarity normal and *fuller* inverted, the branches are
   misaligned. Fix with a small delay on the shorter branch — in
   0.1 ms steps, as Line 6's forum suggests — then **re-run the mono
   test**, because you have just built the thing § 8.3 warns about.

### 9.5 The dual-amp records — what's actually documented

This is the section most likely to be quoted, so it's the section we
checked hardest. **Most famous "two-amp blend" stories are not parallel
blends.** They're either different amps for different parts, or wet/dry
architectures where each amp carries a different signal.

| Artist / track | What's documented | Is it a parallel blend? |
| --- | --- | --- |
| **Mike McCready, "Black"** | McCready: *"I had a Marshall JCM800 with a 4×12 cabinet with, I think, 25-watt speakers in it. And I had a Fender Bassman for the clean tones. You can hear that on Black."* | **No — and this corrects a claim we have published.** The quote documents **two amps doing two different jobs** (clean parts vs lead). Nothing found supports the amps being blended in parallel. The exact Bassman model is also not established |
| **Adam Jones, Tool** | Genuinely simultaneous multi-amp. A 1976 Marshall Super Bass 100 W (both channels wired together), two Diezel VH4 100 W heads, Mesa 4×12s, a Mesa 2×15 bass cab, and a rotating third slot | **Yes** — but sources disagree on the third amp. One gear rundown lists a **Bogner Überschall**; engineer **Joe Barresi**, who made *10,000 Days*, names a **Mesa Boogie**: *"He has a Marshall that he loves, a Diezel, and then he was using a Mesa Boogie at one point… we just experimented with combinations of heads and cabinets until it worked for the song."* Note the blend intent is **empirical and per-song**, not a "one amp for lows, one for highs" doctrine |
| **Stevie Ray Vaughan** | *"often used two amplifiers simultaneously, one more distorted than the other."* Early '80s: Super Reverb (clean) + Marshall Club and Country (dirt). 1984 on: Vibroverb (overdrive) + Dumble Steel String Singer (clean). Late '80s: Dumble SSS + 1967 Marshall Major. 1990: a pair of '59 Bassman reissues. One Vibroverb drove a Fender Vibratone rotating cab | **Yes**, but **the splitting/routing is not documented.** Also note the common "Vibroverb + Dumble + Bassman" three-amp framing is wrong — the Bassmans are a separate, later configuration |
| **Brian May** | Three AC30s, *"allowing him to send delay signals to two of the amps and a 'dry', unaffected signal to the other amp"* | **Not a blend — a wet/dry/wet.** Architecturally the important case: each amp carries a *different* signal, which is why it doesn't comb-filter. **Source is a tribute-band blog — weak; treat as illustrative** |
| **John Mayer** | Dumble Steel String Singer, Two-Rock John Mayer Signature and Fender Bassman into Alessandro 2×12s, managed by a custom Bob Bradshaw switching system | **Partially verified.** The rig is documented; whether the amps run simultaneously or are switched is not clear from the source, and the widely-quoted Mayer line about the Two-Rock "supplementing" the Dumble could not be traced to a primary source |
| **The Edge, U2** | One Fender Edge Signature Deluxe onstage; offstage, two 2015 Vox AC30TBs, two 2016 tweaked AC30s, a Fender Edge Deluxe, a 1957 Tweed Deluxe and a 1957 Harvard, all on a Bradshaw rig with two RS40 controllers | **Multi-amp, but the source doesn't call it wet/dry.** Don't state the W/D/W framing without a better citation |
| **Eric Johnson** | Fender Twins for clean rhythm, the Dumble for dirty rhythm, Marshalls for solos | **No — that's amp selection per sound**, not parallel summing |
| **Nirvana, *Nevermind*** | Mesa Studio Preamp + Crown power amp for verses; Fender Bassman for choruses and heavy overdubs; Vox AC30 for cleans (*"All the clean guitars and strummy stuff that was I'm sure the Vox AC30"*) | **No — sequential overdubs with different rigs** |

**The lesson for recipe writing:** "two amps on the record" almost
never means "two amps summed in parallel." Before a recipe declares a
`routing` split on historical grounds, check whether the source
describes *simultaneous* use. Tool and SRV pass that test. Pearl Jam's
"Black" does not.

### 9.6 What our catalogue does today

33 of 195 recipes describe a blended or multi-amp arrangement in prose
— `mccready-black-solo`, `thayil-black-hole-sun-rotary-verse`,
`jones-stinkfist-drop-d-crush`, `thomson-psychosocial-riff`,
`homme-go-with-the-flow-riff`, `collins-free-bird-outro-solo` among
them — and every one ships as a single serial chain, because the recipe
format has no way to express a split. The proposed `routing` field
([ROUTING_SPEC_ADDITIONS.md](ROUTING_SPEC_ADDITIONS.md)) exists for
these. **Per § 9.5, several of them should have the prose corrected
before the routing is added.**

---

## 10. What This Document Does Not Know

Stated plainly so nobody quotes this for something it doesn't know.

1. **The Line 6 Helix mix law.** Line 6 documents only 0% = dry and
   100% = wet. The curve between is unpublished. § 1.8 has the
   measurement.
2. **The Neural DSP Quad Cortex mix law.** Same gap, same measurement.
3. **The Quad Cortex split/merge gain law.** Mixer defaults are 0.0 dB
   and Splitter Balance defaults to 0.50, but whether an even Y-split
   and merge is unity, +3 dB, or something else is not documented.
4. **Which Fractal blocks use the constant-power algorithm.** Fractal
   says "a few" and never names them.
5. **Whether HX Stomp's split law differs from Helix Floor/LT**, or
   only the Merge default. Line 6 never explained the +3.0 dB default.
6. **Parallel-path time alignment** on Helix, Fractal and QC. None of
   the three documents it. Neural shipping "Phase Doctor" in CorOS
   4.0.0 is circumstantial evidence that it isn't automatic.
7. **Helix Global EQ Low Cut / High Cut frequency ranges.** Not
   published in the Helix 3.80 Owner's Manual, the HX Edit 3.80 Pilot's
   Guide, the Helix Stadium Global EQ page, or Helix Help. The gain
   range **is** verified at **±12 dB** on the three parametric bands.
   The nearest Line 6 house convention for filters of this family is
   the Powercab remote's **Low Cut "Off or 20 Hz–500 Hz"** and
   **Hi Cut "500 Hz–20 kHz or Off"** — a convention, not a spec.
8. **Helix maximum output level in dBu, and output impedance.** Absent
   from every Line 6 document checked. Kemper doesn't publish them
   either. Only Fractal (**+20 dBu, 600 Ω**) and Quad Cortex
   (**+9.5 / +15.5 dBu**) do.
9. **Boss Katana MkII output behaviour.** The MkII owner's manual and
   its Tone Studio parameter guide were not retrievable. Everything
   marked Gen 3 in § 6.2 is manufacturer-verified; MkII Air Feel
   behaviour is community-sourced only.
10. **The Roland JC-120 chorus circuit.** No schematic found to confirm
    the polarity-inversion claim.
11. **Roland Dimension D mono behaviour.** Sources contradict.
12. **The "+3 dB vs +6 dB" Fractal reverb compensation disagreement.**
    The Blocks Guide says the default law puts wet and dry at −6 dB at
    Mix 50%, which implies **+6 dB** restores unity dry. Multiple forum
    posts recommend **+3 dB**, which would imply constant power. The
    manual is the stronger source and this document follows it — but if
    the Reverb block is one of the unnamed constant-power exceptions
    (item 4), the +3 dB advice is correct. Measure before betting a mix
    on it.
13. **Guitar-specific parallel-compression blend percentages.** No
    rigorous source found; the § 3.2 figure is our recommendation.
14. **Crossover frequency for baritone / 7-string guitar.** Only bass
    figures (150–300 Hz) are cited anywhere we could reach.
15. **Fractal firmware currency.** The Axe-Fx III material here comes
    from the Owner's Manual at FW 20.x and the June 2023 Blocks Guide.
    The Output 2 / Copy Output 1 / per-output Global EQ architecture
    has been stable for years, but re-check version-specific claims
    against current firmware.
16. **Helix Stadium per-path cab-bypass workflow.** The live manual
    documents the Matrix Mixer's existence but not its internals or how
    output-block destinations work on that platform.

---

## 11. Sources

### Manufacturer documentation (primary)

- Line 6 — *Helix 3.80 Owner's Manual*: https://line6.com/data/6/0a00051afda2673ccc1cc8e68/application/pdf/Helix%203.80%20Owner's%20Manual%20-%20English%20.pdf
  (Block Order and Stereo Imaging; Output block destinations; Send/Return; Split & Merge; Block Level Indicators and Meters; Global EQ; Global Settings > Ins/Outs; Dual IR parameters)
- Line 6 — *HX Stomp 3.80 Owner's Manual* (block count, Setting Path B's Output): https://line6.com/support/manuals/hxstomp
- Line 6 — *HX Edit 3.80 Pilot's Guide* (Global EQ ±12 dB, shelving cuts)
- Line 6 — *Helix Stadium manual*: https://manuals.line6.com/en/helix-stadium/live — Input/Output and Mix blocks, Signal Path Routing, Global EQ, Global Settings
- Line 6 Knowledge Base — Common Signal Flow Traits on the Helix: https://kb.line6.com/common-signal-flow-traits-on-the-helix
- Kemper — *PROFILER Main Manual 5.5*: https://tcfurlong.com/wp-content/uploads/KEMPER-PROFILER-Main-Manual-5.5-English.pdf
  (Rig Volume; Output LED; Monitor Cab Off; Output Sources; Pure Cabinet; Space; Delay Mix and Mix Location; Reverb Mix; Single Delay mono compatibility; Stereo Widener)
- Fractal Audio — *Blocks Guide*: https://www.fractalaudio.com/downloads/manuals/fas-guides/Fractal-Audio-Blocks-Guide.pdf
  (Common Mix/Level Parameters — the mix-law statement, Input Gain, Global Mix, Bypass Modes, Stereo Spread; Delay; Compressor Mix / "New York" compression; Crossover XVR; Reverb; Rotary; Enhancer; Output Blocks 1–4)
- Fractal Audio — *Axe-Fx III Owner's Manual*: https://www.fractalaudio.com/downloads/manuals/axe-fx-3/Axe-Fx-III-Owners-Manual.pdf
  (MONO SUM L+R / COPY L>R; The Grid; FRFR/Direct to FOH + Backline; Output 2 Copy Output 1; per-output Global EQ; Output Level −10 dBV/+4 dBu; specifications; Spillover; Multi I/O Setups)
- Neural DSP — *Quad Cortex User Manual* (CorOS 2.0): https://downloads.neuraldsp.com/file/quad-cortex/Quad%20Cortex%20User%20Manual%202_0_0.pdf
  (Splitters and Mixers; Setup Examples — Combo Amplifier, Power Amp & Cab + FRFR/Direct, 4CM; specifications)
- Neural DSP — *Quad Cortex User Manual 4.0.0*: https://neuraldsp.com/manual/quad-cortex
- Neural DSP — *CorOS 4.0.0 release notes* (21 January 2026): https://neuraldsp.com/quad-cortex-updates/coros-4-0-0-and-cortex-control-4-0-0-are-now-available
- Boss / Roland — *Katana Gen 3 Owner's Manual*: https://static.roland.com/assets/media/pdf/KATANA_eng03_W.pdf
- Boss — *BOSS Tone Studio for Katana Gen 3 parameter guide*: https://static.roland.com/assets/media/pdf/BTS_KTN3_SP_eng02_W.pdf
- Boss / Roland — *GT-1000 Parameter Guide* (Delay/Reverb EFFECT LEVEL and DIRECT LEVEL): https://manuals.plus/boss/gt-1000-guitar-effects-processor-manual
- IK Multimedia — *TONEX Pedal User Manual* v1.6.22: https://g1.ikmultimedia.com/html/Manuals/TONEXPedal/TONEX_Pedal_User_Manual_English.pdf
- Darkglass — Microtubes B7K Ultra V2 (Blend description): https://www.darkglass.com/products/b7uv2a

### Manufacturer wikis and reference

- Fractal Audio Wiki — Mono and stereo: https://wiki.fractalaudio.com/wiki/index.php?title=Mono_and_stereo
- Fractal Audio Wiki — Delay block (the 50/50 mix law; 2290 Phase Reverse; Time Offset): https://wiki.fractalaudio.com/wiki/index.php?title=Delay_block
- Fractal Audio Wiki — Reverb block: https://wiki.fractalaudio.com/wiki/index.php?title=Reverb_block
- Fractal Audio Wiki — Chorus block (80s / Triangle inversion; Vintage Tape): https://wiki.fractalaudio.com/wiki/index.php?title=Chorus_block
- Fractal Audio Wiki — Enhancer block (Haas, mono-compatible modes): https://wiki.fractalaudio.com/wiki/index.php?title=Enhancer_block
- Fractal Audio Wiki — Rotary block: https://wiki.fractalaudio.com/wiki/index.php?title=Rotary_block
- Quad Cortex Wiki — Gain Staging: https://quadcortex.wiki/Gain_Staging
- Helix Help — Common Effect Settings (Mix, Level, Trails): https://helixhelp.com/tips-and-guides/universal/common-fx-settings
- Helix Help — The Blocks (Split types, Merge parameters): https://helixhelp.com/tips-and-guides/helix/the-blocks

*Note: `wiki.fractalaudio.com` and `forum.fractalaudio.com` return HTTP
403 to automated fetching. Use a browser, or the
`web.archive.org/web/2024/` prefix.*

### Forum threads and measured data

- Line 6 Community — Parallel Path merge mixer +3 Level only on HX Stomp, not LT or Native: https://line6.com/support/topic/62872-parallel-path-merge-mixer-3-level-only-on-hx-stomp-not-lt-or-native/
- SevenString.org — Helix Native split/merge measurements (−6 dBFS in, −9 dBFS per leg, −3 dBFS merged; Digital Igloo response): https://sevenstring.org/threads/helix-native-split-merge-question.365197/
- Line 6 Community — Phase issue with two amp blocks, one path each: https://line6.com/support/topic/58405-phase-issue-with-two-amp-blocks-one-path-each/
- Line 6 Community — Questions about high/low cut blocks (6 vs 12 dB/oct; IEM values): https://line6.com/support/topic/57668-questions-about-highlow-cut-blocks/
- Line 6 Community — Adjust your Global EQ, you may be surprised (72 Hz / 9.5 kHz; 125 Hz / 6 kHz): https://line6.com/support/topic/21316-adjust-your-global-eq-you-may-be-surprised/
- Line 6 Community — High cut and low cut settings in Global EQ: https://line6.com/support/topic/33841-high-cut-and-low-cut-settings-in-global-eq/
- Line 6 Community — An accurate scientific explanation for why we still need treble cut with FRFR: https://line6.com/support/topic/56787-an-accurate-scientific-explanation-for-why-we-still-need-treble-cut-with-frfr-speakers-and-a-virtual-cab/
- Line 6 Community — Stereo Vs Mono to FOH: https://line6.com/support/topic/16698-stereo-vs-mono-to-foh/
- Line 6 Community — Mono vs. Stereo delays: https://line6.com/support/topic/29013-mono-vs-stereo-delays/
- Line 6 Community — Mono to FOH, Stereo to IEM: https://line6.com/support/topic/35127-mono-to-foh-stereo-to-iem/
- Line 6 Community — HX Stomp stereo output to FOH and mono output to amp: https://line6.com/support/topic/69784-hx-stomp-stereo-output-to-foh-and-mono-output-to-amp-on-stage-can-it-be-done/
- Line 6 Community — Wet Dry Wet (WDW) & Delay Mix 100%: https://line6.com/support/topic/23973-wet-dry-wet-wdw-delay-mix-100/
- Line 6 Community — kill dry / mute FX in or out for FX on parallel path: https://line6.com/support/topic/20951-kill-drymute-fx-in-or-out-etc-for-fx-on-parallel-path/
- Kemper forum — Double-tracking guitar, comb filtering (same profile ×2 still combs): https://forum.kemper-amps.com/forum/thread/42185-double-tracking-guitar-comb-filtering/
- Fractal forum — Different Mix Laws for Delay and Reverb?: https://forum.fractalaudio.com/threads/different-mix-laws-for-delay-and-reverb.195357/
- Fractal forum — Mix on delay/reverb: https://forum.fractalaudio.com/threads/mix-on-delay-reverb.179750/
- Fractal forum — Erudite explanation of Mix vs. Level vs. Input Gain: https://forum.fractalaudio.com/threads/erudite-explanation-of-mix-vs-level-vs-input-gain.156960/
- Fractal forum — Kill Dry for Delay and Reverb: https://forum.fractalaudio.com/threads/kill-dry-for-delay-and-reverb.211521/
- Fractal forum — Since moving from Helix, I use reverbs and delays at a much lower mix level. Why?: https://forum.fractalaudio.com/threads/since-moving-from-helix-i-use-reverbs-and-delays-at-a-much-lower-mix-level-why.212005/
- Fractal forum — A delay that works as well in mono (summed) as in stereo?: https://forum.fractalaudio.com/threads/a-delay-that-works-as-well-in-mono-summed-as-in-stereo.69029/
- Fractal forum — THE definitive Axe-Fx mono setup guide: https://forum.fractalaudio.com/threads/the-definitive-axe-fx-mono-setup-guide.32489/
- Fractal forum — Fixed: 80s Style Chorus ("at 100% there is no volume at all"): https://forum.fractalaudio.com/threads/fixed-80s-style-chorus.179654/
- Neural DSP Unity — Phase issues with 2 amps: https://unity.neuraldsp.com/t/phase-issues-with-2-amps/7366
- Neural DSP Unity — Global Cab IR bypass per physical output (open feature request): https://unity.neuraldsp.com/t/global-cab-ir-bypass-per-physical-output-on-quad-cortex/19686
- Neural DSP Unity — Disabling cab block globally: https://unity.neuraldsp.com/t/disabling-cab-block-globally/12574
- Neural DSP Unity — Cab bypass per output: https://unity.neuraldsp.com/t/cab-bypass-per-output/22769
- Neural DSP Unity — Stereo to Mono, question and my latest solution: https://unity.neuraldsp.com/t/stereo-to-mono-question-and-my-latest-solution/10138
- PedalPCB forum — Fuzz "blend" advice (phase inversion in fuzz circuits): https://forum.pedalpcb.com/threads/fuzz-%22blend%22-advice.16646/

### Engineering press and live-sound sources

- ProSoundWeb — *Mono Versus Stereo: Bringing Additional Context*, James Attaway: https://www.prosoundweb.com/mono-versus-stereo-bringing-additional-context-to-the-longstanding-debate/
- ProSoundWeb — *Making Mono Sources Sound Stereo*, Mike Sessler: https://www.prosoundweb.com/making-mono-sources-sound-stereo/
- Church Production — *Stereo or Mono? Sound System Design for Worship*, Andy McDonough: https://www.churchproduction.com/education/stereo-or-mono-sound-system-design-for-worship/
- Sound On Sound — *Can Haas delays be mono compatible?*, Matt Houghton: https://www.soundonsound.com/sound-advice/q-can-haas-delays-be-mono-compatible
- Sound On Sound — *Classic Stereo Widening*, Mike Thornton: https://www.soundonsound.com/techniques/classic-stereo-widening
- Sound On Sound — *Using Guitar Pedals In Parallel*: https://www.soundonsound.com/techniques/using-guitar-pedals-parallel
- Sound On Sound — *NAMM 2026: Neural DSP introduce Quad Cortex mini* (Phase Doctor): https://www.soundonsound.com/news/namm-2026-neural-dsp-introduce-quad-cortex-mini
- Lehle — *Parallel Worlds* (phase switch; fuzz and buffered splits): https://blog.lehle.com/2018/05/16/parallel-worlds/
- Hamilton Effects — *Drives in Parallel vs Drives in Series*: https://hamiltoneffects.com/designnotes/drives-in-parallel-vs-drives-in-series
- Tone Tailors — *Get better bass tone with signal crossover* (150–300 Hz): https://tonetailors.com/tone-tips/get-better-bass-tone-with-signal-crossover/
- Cosmic Loop FX — *Parallel routing for bassists*: https://www.cosmicloopfx.com/post/parallel-routing-for-bassists-how-to-get-thick-clear-tone
- Boost Guitar Pedals — *What is a Wet/Dry/Wet Rig, and How to Set it Up?*: https://www.boostguitarpedals.co.uk/blogs/pedal-knowledge/what-is-a-wet-dry-wet-rig-and-how-to-set-it-up
- The Music Zoo — *How To Set Up A Wet-Dry-Wet Amplifier Rig*: https://www.themusiczoo.com/blogs/news/how-to-set-up-a-wet-dry-wet-amplifier-rig
- jimamsden — *Wet-Dry-Wet Setup with Helix*: https://jimamsden.wordpress.com/2018/06/19/wet-dry-wet-setup-with-helix/
- Komposition101 — *How to Volume Match Presets on the Line 6 Helix*: https://www.komposition101.com/blog/volume-matching-presets-on-line6-helix
- Chuck Levin's — *How to run your entire band through the Neural DSP Quad Cortex*: https://chucklevins.com/blogs/chucks-blog/how-to-run-your-entire-band-through-the-neural-dsp-quad-cortex

### Artist gear sources (§ 9.5)

- Ground Guitar — Mike McCready's Marshall JCM800: https://www.groundguitar.com/mike-mccready/mike-mccreadys-marshall-jcm800/
- Ground Guitar — Mike McCready's Fender Bassman: https://www.groundguitar.com/mike-mccready/mike-mccreadys-fender-bassman-ab165-amp/
- Ground Guitar — Kurt Cobain *Nevermind* tone breakdown: https://www.groundguitar.com/tone-breakdown/kurt-cobain-nevermind-guitars-amps-effects/
- Mixdown — *Rig Rundown: Adam Jones of Tool* (incl. the Joe Barresi quote): https://mixdownmag.com.au/features/rig-rundown-adam-jones-of-tool/
- SRV Archive — Amplifiers: https://srvarchive.com/amplifiers
- Premier Guitar — Rig Rundown: John Mayer: https://www.premierguitar.com/gear/rig-rundown-john-mayer
- Premier Guitar — Rig Rundown: U2's The Edge: https://www.premierguitar.com/gear/rig-rundown-u2s-the-edge
- EJFans — Eric Johnson amps: https://www.ejfans.com/gear/amps

### Weaker sources, used with caution and flagged in-text

- Guitar Chalk — TC Electronic 2290 delay settings (the polarity-flip widening claim; corroborated by Fractal's own model documentation): https://www.guitarchalk.com/tc-electronic-2290-delay-settings/
- Gearspace — Stereo effects: dealing with phase cancellation in mono (the "−6 dB shallows the notches" rule of thumb): https://gearspace.com/board/electronic-music-instruments-and-electronic-music-production/1217401-stereo-effects-dealing-phase-cancellation-mono.html
- UA — Roland Dimension D Manual (Dimension D mono claims conflict across sources): https://help.uaudio.com/hc/en-us/articles/33538284818964-Roland-Dimension-D-Manual
- Queen Tribute UK — Brian May's three-AC30 wet/dry description (tribute-band blog; illustrative only): https://www.queentributeuk.com/post/how-to-get-brian-may-s-signature-guitar-sound
- Komposition101 — Helix EQ cheat sheet (numbers sit inside the cited ranges, but the page shows signs of unattributed generated content — corroboration only): https://www.komposition101.com/blog/the-helix-eq-cheat-sheet-exact-settings-for-every-situation
