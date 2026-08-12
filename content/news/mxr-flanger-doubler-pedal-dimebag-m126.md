---
title: "MXR Reissued the Rack Dimebag Never Turned Off — And Almost Everyone Chasing That Sound Builds the Wrong Effect"
date: "2026-08-12"
category: "new-gear"
slug: "mxr-flanger-doubler-pedal-dimebag-m126"
excerpt: "MXR announced the Flanger/Doubler on August 11 — $333 street, all-analog BBD, available now. It's a pedalboard version of the Model 126 rack that Dimebag's tech says lived in the wet loop 100% of the time. But it was parked in Doubler mode, not flanging. If you've been buying flangers to chase the Cowboys from Hell intro, you've been building the wrong block. Here's the correct one on Helix, HX Stomp, and Quad Cortex — plus the Invert switch's mono-cancellation problem, measured."
source_url: "https://www.jimdunlop.com/mxr-flanger-doubler/"
image_url: ""
author_slug: "viktor-kessler"
---

MXR announced the Flanger/Doubler on August 11. It's $333 street ($475.71 MSRP), it's available now, and it is an all-analog bucket-brigade recreation of the Model 126 rack unit — the late-'70s/early-'80s box that Reverb listings have been quietly repricing upward for a decade because of one guitarist.

I want to get the interesting part out of the way first, because it's the part the press coverage keeps burying under the word *flanger*.

Dimebag Darrell's tech, Grady Champion, has said the MXR Flanger/Doubler sat in the wet side of Dimebag's rig **100 percent of the time**. Always on. Never bypassed. It's audible on the intro to "Cowboys from Hell," on "Slaughtered," on "Hellbound."

And it was in **Doubler mode**.

Not flanging. Doubling. Those are different circuits doing different math, and the distinction is the whole reason people spend years buying flangers, not liking the result, and concluding that Dimebag's tone was "just the Randall."

## What Actually Shipped

From Dunlop's spec sheet and the retailer listings:

- **Authentic BBD circuitry** — bucket-brigade delay, analog, not a digital model of one. The original 126 ran a Reticon SAD1024 alongside the rarer R5101.
- **Two voices via a dedicated Doubler button** — full jet-sweep flanging on one side, short fixed-offset doubling on the other.
- **Manual, Width, Speed, Regen, Mix** — the original control set. Manual sets the sweep's center point, Width its excursion, Speed its rate, Regen the feedback intensity that turns a gentle sweep into metallic resonance.
- **Invert switch** — flips the polarity of the wet signal. Dunlop's framing: "airy and hollow" one way, "punchy and mid-forward" the other.
- **CV in/out** — control voltage jacks for syncing sweep to a modular rig or DAW.
- **Rear-panel line-level input switch** — so it can sit in a rack loop or a studio insert without clipping on hot signals.
- **Dual LEDs** tracking sweep position in real time.

Guitar World reports Zakk Wylde has already had one out live with Pantera. That's a fair signal of intent: this is being positioned as the tour-grade version of a unit that currently only exists as a 45-year-old rack with failing electrolytics.

## The Effect You Actually Want Is Not a Flanger

Here is the signal theory, because "use a doubler" is exactly the kind of advice that gets repeated without anyone explaining the mechanism.

A **flanger** takes a copy of your signal, delays it by a very short and *continuously modulated* amount — roughly 0.5 to 10 ms — and sums it back with the dry. The sum creates a comb filter: a series of notches spaced across the spectrum. Because the delay time is sweeping, the notches sweep with it. That moving comb is the jet sound. Feedback (Regen) sharpens the notches into resonant peaks and makes the effect scream.

A **doubler** uses the same architecture with two changes that matter enormously: the delay is **longer** (roughly 15–40 ms) and it's **barely modulated or not modulated at all**. Past about 15 ms, the comb notches get packed so densely that you stop hearing them as filtering and start hearing the copy as a *separate performance*. There's no sweep, so nothing whooshes. What you get is the perceptual signature of a second take — width, thickness, a slight blur on the pick attack.

That's why the Dimebag rhythm sound is enormous without ever announcing itself as an effect. A comb sweep is obvious. A 20 ms static offset is not. It just sounds like the guitar is twice as big as it should be.

**So: if you have been dialing flangers looking for that, you were modulating a delay that should have been sitting still.**

## Building It Correctly on Your Modeler

Two routes, and I'd try them in this order.

### Route 1 — Helix, HX Stomp, Helix Native: the Double Take block

Line 6 ships a modulation model called **Double Take**, built specifically as a double-tracking effect rather than as a model of a vintage box. It is the closest thing in the Helix library to the 126's Doubler mode, and it's the honest first stop.

Starting point:

- **Mix around 35–45%.** This is the single most important control and the one people over-turn. At 50/50 you no longer have a dry track with a double — you have two equal tracks and a smeared transient. Dimebag's version reads as *thick*, not *washed*.
- **Keep it post-amp.** More on this below; it's not optional.
- **Leave modulation minimal.** If the block offers any sweep or drift, keep it low. The moment it becomes audible movement, you've built a chorus.

### Route 2 — Any platform, built from parts

This works on a Quad Cortex, a GP-200, a TONEX pedal into anything, or a Helix if you want more control than Double Take exposes:

1. **Split to a parallel path** after the amp and cab.
2. **Delay block on the wet leg.** Digital or mono delay, whichever your platform's simplest model is. **Time: 22 ms.** **Feedback: 0.** Zero — a doubler is one reflection, not a repeating one. **Mix: 100% wet** on the block itself, since the parallel path *is* the wet leg.
3. **Optional detune.** A pitch/detune block at **±6 to ±9 cents** on the wet leg makes the copy read as a genuinely separate performance rather than a clone. This is the trick that makes the effect survive on a single-tracked guitar.
4. **Set the balance at the merge**, not inside the delay. Wet leg roughly 5–7 dB under the dry.

Then sweep the delay time and listen: at 8 ms you'll hear obvious hollow comb filtering. Somewhere around 15 ms it stops sounding like an effect. By 25–30 ms it's starting to read as slapback. The useful window is narrow, and it's narrower on a palm-muted riff than on open chords, because a tight transient makes the offset audible sooner. Find your number on the actual riff, not on a strummed E.

The full logic of when a second copy earns its keep and when it just eats headroom is in [Double-Tracking When You Only Have Twenty Minutes](/blog/double-tracking-on-a-time-budget).

### For the flanger side

If you do want the sweep, Helix gives you **Jet Flanger** (the A/DA-derived one, the most aggressive sweep in the box), **Analog Flanger**, **AC Flanger**, and **Dynamix Flanger**, which responds to your picking dynamics rather than a fixed LFO. Set Regen high and Speed slow for the classic taking-off sound; keep Regen low and Width moderate for something that sits under a riff without eating it.

## The Placement Detail Nobody Mentions

The 126 was in Dimebag's **wet head loop** — not in front of the amp. This matters more than any knob setting on this list.

Run a doubler *before* a high-gain preamp and you're feeding two correlated signals into a nonlinear stage. The distortion intermodulates them, the comb filtering gets re-shaped by the clipping, and the low end turns to mud — the exact opposite of what you wanted. Run it *after* the amp and cab and each copy is fully formed distorted guitar, summed cleanly.

On a modeler: the doubler block goes **after** the cab/IR block. If you're using a parallel split, split after the cab. This is the same reasoning that puts an overdrive *before* the preamp for tightening — you're choosing where in the chain the nonlinearity happens, deliberately. That mechanism is the entire subject of [Why the Tube Screamer Before a High-Gain Amp Is the Best Metal Trick](/blog/tube-screamer-before-high-gain-amp), and it's the same principle running in the other direction here.

For the broader question of which blocks split and which stay mono, [Stereo Guitar Signal Chain Architecture](/blog/stereo-signal-chain-architecture) covers the routing.

## The Invert Switch Is a Mono Landmine

This is the part I'd want flagged if I were buying one.

The Invert switch flips the polarity of the wet signal. Dunlop describes the tonal result — hollow versus mid-forward — and that description is accurate, because inverting the wet leg inverts the comb filter: every peak becomes a notch and every notch becomes a peak. Fine. Useful.

But consider what happens at a very short delay time with the wet leg inverted and the mix near 50%: the two signals approach direct cancellation in the frequency bands where they were previously reinforcing. In stereo that reads as dramatic width. **Summed to mono by a FOH desk, a large part of it disappears**, and it can take some of your dry signal's body with it.

If you play through a house system that might sum you to mono — which is most rooms, most weeks — set this switch with a mono check, not by ear in stereo headphones. Sum your outputs, listen for whether the guitar loses low-mid weight, and choose accordingly. We ran this test across the common widening tricks in [Which Stereo Widening Tricks Survive a Mono PA (and Which Vanish)](/blog/stereo-width-tricks-that-survive-mono), and doubler-with-inverted-wet is squarely in the "verify before you trust it" column.

The same caution applies to the modeler build above: if you add a polarity invert to your parallel leg because it sounds bigger, check mono before the gig, not at it.

## Is It Worth $333 If You Own a Modeler?

**No**, if what you want is the Dimebag rhythm thickness. That is a 22 ms static delay in a parallel path at 40% mix, and you have it tonight for free. Build it, play "Cowboys from Hell" through it, and I think you'll find the gap between that and a $333 pedal is not where your money makes the most difference. Your gain staging and your palm-mute consistency are almost certainly bigger variables — see the [5150 / 6505 settings guide](/blog/peavey-5150-settings-guide) if you want to audit the front end first.

**Yes**, if any of these describe you:

- **You want the analog BBD character specifically.** A bucket-brigade line is bandwidth-limited and noisy by construction — the delayed copy comes back darker and slightly degraded, and that darkness is why the doubled signal sits *behind* the dry rather than fighting it. Modeler doublers generally give you a full-bandwidth copy. You can approximate the difference with a low-pass around 5–6 kHz on the wet leg, and I'd recommend trying that before spending anything, but it is an approximation.
- **You need CV.** Nothing in a guitar modeler syncs its LFO to a modular rig. If that's your world, this is the only entry on the list.
- **You're running a wet/dry/wet rig with real amps.** The line-level switch means this drops into a rack loop properly, which is the use case the original 126 was built for and the one a floor modeler doesn't address.
- **You're DSP-starved.** An HX Stomp already running an amp, cab, gate, boost, delay and reverb has no room for a parallel doubler path. Offloading it is a legitimate reason to buy hardware.

## My Take

I'm generally the person telling you the block you already own does the job, and most of this article is me doing exactly that. But the thing worth taking from this announcement isn't the pedal — it's that one of the most-chased metal rhythm sounds of the last thirty-five years was a **static 20-ish millisecond delay at partial mix, placed after the distortion, and never switched off**. That's it. No sweep, no secret amp, no unobtainable cabinet.

It got mythologized as a flanger because the box says "Flanger" first on the faceplate. Thousands of players bought flangers, swept them, and got a sound that was nothing like the record — and then blamed the amp. That's cargo cult in its purest form: copying the label instead of the mechanism.

Go set a delay to 22 ms with zero feedback in a parallel path after your cab. It costs you nothing and it will tell you more about that record in ten minutes than another year of reading forum threads.

## Dig Deeper on Fader & Knob

- When a second guitar track is worth the time and when it isn't: [Double-Tracking When You Only Have Twenty Minutes](/blog/double-tracking-on-a-time-budget).
- Check your width before FOH sums you: [Which Stereo Widening Tricks Survive a Mono PA](/blog/stereo-width-tricks-that-survive-mono).
- What splits and what stays mono: [Stereo Guitar Signal Chain Architecture](/blog/stereo-signal-chain-architecture).
- The other half of "where does the nonlinearity go": [Why the Tube Screamer Before a High-Gain Amp Is the Best Metal Trick](/blog/tube-screamer-before-high-gain-amp).
- Audit the front end before you buy anything: [Peavey 5150 / EVH 6505 Settings Guide](/blog/peavey-5150-settings-guide).
- Modulation that moves without seasickness: [Modulated Reverb](/blog/modulated-reverb-movement-on-the-tail).
