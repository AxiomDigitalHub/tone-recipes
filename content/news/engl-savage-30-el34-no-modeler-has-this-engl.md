---
title: "ENGL's New Savage 30 Runs EL34s — Which Means No Modeler on Earth Has This ENGL, and the One in Your Helix Is a Different Amp Entirely"
date: "2026-09-27"
category: "new-gear"
slug: "engl-savage-30-el34-no-modeler-has-this-engl"
excerpt: "ENGL launched the Savage 30 at Guitar Summit on September 25 — a 30-watt two-channel head, four ECC83s and a pair of EL34s, onboard gate, power soak with a Speaker Off setting, $1,769.99 at Sweetwater. The spec that matters is the EL34s. The Savage 120 runs 6550s. The Powerball runs 6L6GCs. Helix's only ENGL model is the Powerball. Fractal's Savage model is the 120. The Savage 30's power section has never been modeled by anyone, and I can show you which three parameters that changes."
source_url: "https://www.gearnews.com/engl-savage-30-and-powercube-200-high-gain-but-smaller/"
image_url: ""
author_slug: "viktor-kessler"
---

ENGL launched the **Savage 30** at Guitar Summit on **September 25**, alongside a **Powercube 200** power amp. The Savage 30 is a **30-watt head** with Clean and Lead channels, each with its own Gain control, shared Bass/Middle/Treble, a dedicated Lead Volume, global Presence and Master, and Gain Lo/Hi, Contour and Depth Boost switches.

The back panel has a **tube-buffered serial effects loop**, a **noise gate with a threshold control**, a **line output**, and a **power soak offering Full, Mid, Low and Speaker Off**. Under the hood: **four ECC83 preamp tubes and two EL34 power tubes**. It measures 23 × 42 × 20 cm, weighs 11 kg, and runs **$1,769.99** at Sweetwater — about $1,199 through Thomann in Europe.

Most of the coverage is framing this as "Savage 120 tone in a smaller box." I want to push back on that, because the power section says otherwise, and the power section is not a detail.

## Three ENGLs, Three Different Power Tubes

Here is the thing I had to go check before I believed it.

| Amp | Power tubes | Modeled as |
|---|---|---|
| ENGL Powerball E645 | 6L6GC | **Das Metall** (Helix family) |
| ENGL Savage 120 | 6550 (KT88 as the common swap) | **Angle Severe** (Fractal Axe-FX) |
| **ENGL Savage 30 (new)** | **EL34** | **nothing** |

Three amps in the same family, three entirely different power-tube families. This is not ENGL being inconsistent — a 6550 is a beam tetrode built for high plate voltage and stiff, almost solid-state-feeling headroom, a 6L6GC is the American workhorse with a scooped-mid compression signature, and an **EL34 is the British bottle**: earlier breakup, a pronounced upper-mid push around 1–2 kHz, and a softer, slower sag when you push the power section.

You cannot swap between these tubes casually. The Savage 120 will not take 6L6GCs at all — it is 6550s or KT88s, and that is a bias and plate-voltage constraint, not a tone preference.

So when the marketing calls this a smaller Savage, what they mean is the preamp topology and the feature set. **The power section is a different animal**, and in a high-gain amp at 30 watts, the power section is doing a large share of the audible work — far more than it does in a 120-watt head where you never get close to power-stage compression at any survivable volume.

## What Your Modeler Actually Has

If you own a Helix, HX Stomp, Helix LT or POD Go, your only ENGL model is **Das Metall**, which is the **Powerball E645**. I have it in our [Helix amp model cheat sheet](/blog/helix-amp-model-cheat-sheet) at a starting Gain of 67%, described as maximum gain and maximum precision. That description is correct and it is a 6L6GC amp. It is not a Savage.

If you own a Fractal unit, you have **Angle Severe**, which is the **Savage 120** — the 6550 amp. Closer in preamp lineage, wrong power section for the 30.

Nobody has the Savage 30. Not Line 6, not Fractal, not Neural, not Kemper's factory profiles, and no NAM capture exists of an amp that has been on sale for two days.

I say that as information, not as a complaint. The useful question is: **if I want to get in the neighborhood of an EL34 Savage using what I already own, what do I change?** Three things, and only three.

## The Three Parameters That Move a 6L6 Model Toward EL34

Start from **Das Metall** in the Helix, or **Angle Severe** in a Fractal if you have it. Then:

**1. Master Volume — push it, hard.** This is the one that matters most and the one people leave alone. In every Helix amp block the **Master parameter models the power section**, not your output level. At the default position you are hearing preamp distortion into a power stage that is barely working — which is exactly the wrong operating point for a 30-watt amp. Bring Master to **7.0–8.0** and drop the block's Level or your Output block to compensate. What you are buying is power-stage compression and sag, and it is the single largest structural difference between a 120-watt head and a 30-watt one. (Helix amp parameters run on a 0–10 scale, not 0–1 — if you have been typing decimals, that is a separate problem.)

**2. Presence down, and mids up to replace it.** A 6L6GC-based high-gain amp is scooped through the mids with a hard presence shelf on top. An EL34 amp has that energy lower, in the upper mids. So: **Presence down by roughly 1.5–2.0** from wherever the model sits, **Mid up by 1.0–1.5**. You are moving the same brightness down about an octave. Do it with the amp block's own controls before you reach for an EQ block — the amp block's tone stack sits inside the modeled circuit and interacts with the gain structure, and a post-amp EQ does not.

**3. Drop the Drive, because EL34s break up sooner.** Whatever gain you were running on Das Metall, take **1.0–1.5 off**. The Powerball's whole identity is that it stays clinically tight at absurd gain levels. An EL34 amp at 30 watts is going to be losing composure before you get there, and the honest version of that character is less preamp gain with the power section working, not more preamp gain with the power section idling.

Then let your cab do the rest. A 4x12 with V30s and a **High Cut around 6.0–6.5 kHz** is where I'd start; if it reads as fizzy after these changes, the fix is upstream and [fizz in high gain is almost always a cab-and-cut problem, not a gain problem](/blog/fix-fizzy-high-gain).

## The Two Back-Panel Features Worth More Than the Tone Stack

**The onboard noise gate with a rear-panel threshold.** Do not use it as your only gate. An in-amp gate sits *after* the preamp, which means it is making a threshold decision on a signal that is already saturated and already has a noise floor baked into it. That is the wrong place to make that decision. Put your real gate **in front of the amp**, looking at the clean guitar signal, where the difference between "note" and "hiss" is still a measurable amplitude difference. Use the amp's gate as a second stage to catch what the first one misses. The full reasoning is in [noise gate threshold and decay for high gain](/blog/noise-gate-threshold-decay-settings-high-gain).

**The power soak with a Speaker Off setting, plus the line out.** This is the feature that makes the Savage 30 interesting to anyone running a hybrid rig, and it is the one that needs a warning attached. Speaker Off plus a line output means you can run the amp silently and take a signal out of it — but a line out off a power soak is a **line-level signal off a tapped output**, not a speaker-level feed into a reactive load. It will not have the load interaction that makes an amp feel like an amp, and it will need a cab sim after it. If you want the real thing, you want a reactive load box, and the impedance and level distinctions are in [line level vs instrument level in the effects loop](/blog/line-level-vs-instrument-level-effects-loop) and [preamp out and power amp in versus loop jacks](/blog/preamp-out-power-amp-in-vs-effects-loop-jacks).

Also: the loop is **serial and tube-buffered**, which is the correct choice for this kind of amp and means your time-based effects go there, not in front. [Series versus parallel loops](/blog/series-vs-parallel-effects-loop) covers why that matters more than people think.

## The Measurement I'd Want

What I actually want is a frequency sweep of the Savage 30's power section at Full versus Low power soak, against a Das Metall capture at Master 3.0 and Master 8.0. My prediction is that the Low-power Savage 30 and the high-Master Das Metall land closer together than the spec sheets suggest, and that the remaining gap is a 2–3 dB hump somewhere between 1.2 and 2 kHz plus a difference in sag time constant.

I don't have the amp, so that's a hypothesis, not a finding. But it is a testable one, and if you have both, the three changes above are where I'd start looking.

*Sources: [gearnews](https://www.gearnews.com/engl-savage-30-and-powercube-200-high-gain-but-smaller/), [ENGL product page](https://www.engl-amps.com/shop/heads/engl-e611-savage-30/), [Sweetwater](https://www.sweetwater.com/store/detail/Savage30--engl-amplifiers-savage-30-watt-amplifier-head), [Fractal Audio forum on the Angle Severe / Savage 120 model](https://forum.fractalaudio.com/threads/fractal-audio-amp-models-angle-severe-engl-savage-120.111501/).*
