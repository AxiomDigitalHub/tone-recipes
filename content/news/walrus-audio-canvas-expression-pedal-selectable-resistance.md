---
title: "Walrus Audio's Canvas Expression Has a Selectable-Resistance Output — Which Means It's the First Expression Pedal That Doesn't Care Whose Modeler You Own"
date: "2026-08-20"
category: "new-gear"
slug: "walrus-audio-canvas-expression-pedal-selectable-resistance"
excerpt: "Walrus announced the Canvas Expression on August 18: contactless magnetic sensor, no pot to wear out, $299.99, shipping now. The headline features are MIDI and CV. The spec that actually solves a problem is buried in the output section — a TS output with selectable 10k, 25k, and 50k total resistance. Expression pedals are not a single standard, and that mismatch is why your last one felt wrong on a Helix. Here's the taxonomy, which setting matches which device, and how to use the custom taper for worship swells."
source_url: "https://www.walrusaudio.com/collections/canvas-series"
image_url: ""
author_slug: "sean-nakamura"
---

Walrus Audio announced the **Canvas Expression** on August 18 — the second pedal in the Canvas series, following the Canvas Volume from earlier this year. It's **$299.99 / €329**, in a steel-and-aluminum enclosure, 8.9 inches deep, and it's already listed at Sweetwater and Thomann.

The spec sheet, from Walrus:

- **Contactless magnetic position sensor** — no string, no gear, no potentiometer in the signal path
- **Two independent outputs (A and B)**, each switchable between TRS expression, TS variable-resistance, switch, and CV modes
- **TRS output**: voltage divider with a 50 kΩ potentiometer value
- **TS output**: variable resistor with **selectable total resistance of 10 kΩ, 25 kΩ, or 50 kΩ**
- **CV output**: selectable 0–3.3 V and 0–5 V ranges
- **MIDI** over 1/8-inch TRS Type A (in and out) and USB-C, with firmware updates via walrusaudio.io
- **Web editor** for tapers, wiring, MIDI CC/PC assignments, CV, and switch behavior
- Isolated 9 VDC, center-negative, 300 mA minimum
- Four onboard parameter LEDs — TYPE, WIRE, DIR, X — for editing without a computer

Every outlet covering this is leading with MIDI and CV. I understand the instinct. MIDI on an expression pedal is genuinely useful and CV opens a door to the modular world.

But those aren't the features that fix the thing most guitarists are actually annoyed about. **The selectable TS resistance is.**

## Expression Pedals Are Not One Standard. They're Three.

This is the part nobody puts on the box, and it's the reason "I bought an expression pedal and it feels wrong / only uses half the sweep / my modeler says no pedal connected" is a permanent fixture of every modeler forum.

There are, functionally, two different electrical schemes wearing the same 1/4-inch jack:

**Scheme 1 — TRS voltage divider.** The host device sends a reference voltage down the ring, the pedal's pot divides it, and the wiper returns a fraction of that voltage on the tip. The host reads a *voltage*. This is what most manufacturers expect, and the common pot value is 25 kΩ or 50 kΩ. Boss, Strymon, Eventide, and most MIDI controllers live here.

**Scheme 2 — TS variable resistor.** No reference voltage. The pedal is just a resistance between tip and sleeve that changes as you rock it. The host reads a *resistance*. **This is Line 6's scheme**, and it is why a perfectly good TRS expression pedal can behave badly on a Helix.

Line 6's documented behavior is that its devices are built around a **10 kΩ linear** pedal wired tip-and-sleeve, with the wiper and one lug joined to sleeve. An open circuit reads as no pedal present; a dead short reads as heel-down; roughly 10 kΩ reads as toe-down. That's why Mission sells an **EP1-L6** as a separate SKU from its standard model — same chassis, different wiring, because the two schemes are not interchangeable.

Then there's the third axis nobody mentions: **pot value even within a scheme**. A 25 kΩ pedal on a device calibrated for 10 kΩ doesn't fail — it works, badly. You get full travel mapped into a portion of the parameter range, or a sweep that hits 100% at three-quarters of the throw and then does nothing. It's not broken. It's mismatched.

## What Canvas Expression Actually Does About It

One pedal, three selectable TS resistances plus a TRS voltage-divider mode. That is not a marketing bullet. That is **the entire compatibility matrix, addressable in software**.

Practical mapping, with the caveat that you should always confirm against your own device's manual and run its calibration routine afterward:

| Your device | Output mode | Setting |
|---|---|---|
| Helix / Helix LT / HX Stomp / HX Effects / POD Go | TS variable resistor | **10 kΩ** |
| Eventide (H90, H9) | TS or TRS per Eventide's spec | **25 kΩ** |
| Most TRS-expecting devices (Boss, Strymon, generic) | TRS voltage divider | 50 kΩ divider |

And because outputs A and B are independent, **one pedal can be a 10 kΩ TS pedal into your Helix and a MIDI CC source into something else at the same time.** For anyone running a Helix plus an outboard reverb, that's one less pedal and one less hole in the board.

I want to be precise about one thing: Walrus publishes the selectable resistance values, but I have not measured this unit, and no announcement replaces running your host's own pedal calibration. On Helix that lives in **Global Settings**. Do it once after you set the resistance. If the sweep still doesn't reach both ends, you have the wrong mode, not a bad pedal.

## The Sensor Question

The contactless magnetic sensor is the other real story, and it's a reliability story rather than a tone story.

Every expression pedal failure mode I've personally dealt with traces to one of three mechanical parts: **the pot wiper** (scratchy sweep, dead spots — the classic), **the string or belt** (slips, stretches, snaps mid-set), or **the gears** (backlash, so the first few degrees of travel do nothing).

A magnetic position sensor has none of those. There is no wiper riding a carbon track, so there's nothing to wear a groove into. That matters more than it sounds if your expression pedal spends its life as a **wah** — a wah gets used across its full travel constantly, which is exactly the duty cycle that kills pots.

What I can't tell you yet: how the magnetic sensor's resolution compares to a good pot in practice. A pot is continuous; a digital sensor has a step size. Whether that's audible depends on the sensor's resolution and how the host quantizes incoming expression values — which, on most modelers, is 0–127 anyway. If the host is throwing away resolution at the MIDI-style 128-step grid, sensor resolution above that is academic. I'll update this piece if Walrus publishes a figure.

## The Part Worth $299 to a Worship Player: Custom Tapers

Here's where this stops being a spec discussion.

A stock expression pedal has a **linear taper**. Heel-to-toe travel maps evenly onto 0–100% of the parameter. That's the wrong curve for two of the most common jobs in a modeler rig.

**Volume swells.** Perceived loudness isn't linear with signal level. A linear pedal spends the first half of its travel in a region where you barely hear anything change, then does most of the audible work in the last third. That's why swells feel like they "arrive" abruptly instead of blooming. What you want is a curve that opens slowly at the top of the throw and puts fine control where the audible change happens. The Canvas Expression's editor lets you set that per-output rather than per-preset — meaning the correction lives in the pedal and travels to every device you plug it into.

If you're building swells, the mechanics of the technique matter as much as the curve — [volume swell technique](/blog/volume-swell-technique) covers the right-hand and pedal side, and [volume pedal dynamics control](/blog/volume-pedal-dynamics-control) covers where in the chain the level change should happen.

**Wah.** A wah's sweet spot is a narrow band in the middle of the sweep. A linear taper gives equal travel to the extremes, where you spend almost no time, and cramps the middle, where you spend all of it. Expanding the center of the curve gives you more physical travel over the range you actually play in.

**Where it doesn't help:** if you're using expression to control a delay mix or a reverb decay, linear is usually fine, and the taper is a solution looking for a problem.

Before you buy this to replace a hardware volume pedal, though, be clear on which job you're solving — they are not the same tool, and [expression pedal vs. volume pedal](/blog/expression-pedal-vs-volume-pedal) lays out where each one belongs. An expression pedal controlling a volume block inside the modeler is subject to the modeler's parameter update rate. A hardware volume pedal in the analog chain isn't. For most worship players the block-based approach is right, because it lets you place the volume change *after* your delays so the repeats keep ringing through the swell. If you're setting that chain up for Sunday, [worship guitar tone on Helix](/blog/worship-guitar-tone-helix) is where the routing gets covered properly.

## Who This Is Actually For

**Buy it if:** you run more than one device and are tired of owning a Line 6 expression pedal *and* a TRS expression pedal; you've killed a pot or a string in a treadle before; or you want a taper that isn't linear and don't want to fake it with a curve inside a preset.

**Skip it if:** you have one modeler with a working onboard treadle. A Helix Floor already has EXP 1 and EXP 2 under your foot. $299.99 to add a third expression input you don't have an assignment for is not a tone upgrade — it's a spare.

**The real competitor** isn't another expression pedal. It's a $60 generic that happens to match your one device's scheme, which works fine until you buy a second device. Canvas Expression's value proposition is that it's the last one you buy, not the cheapest one you buy. Whether that math works depends entirely on how many things you plug into.
