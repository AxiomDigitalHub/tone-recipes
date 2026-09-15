---
title: "EHX Turned Adrian Belew's Broken Switch Into a Mode — and the Setting That Matters Is One You Already Own"
date: "2026-09-15"
category: "new-gear"
slug: "ehx-adrian-belew-echoflanger-filter-matrix-depth-zero"
excerpt: "The Adrian Belew Echoflanger is a limited-edition reissue of the 1977 EH-1311 at €239 / £208, with the four original modes, a new Volume knob, and two combination modes that formalize the in-between switch position Belew got by accident. Three of the four modes are one BBD circuit at different delay times — and the fourth, Filter Matrix, is the one Helix and Quad Cortex owners keep building wrong. The fix is a single parameter, and it is not the one you think."
source_url: "https://www.gearnews.com/ehx-adrian-belew-echoflanger-guitar/"
image_url: ""
author_slug: "sean-nakamura"
---

Electro-Harmonix has brought back the Echoflanger as the **Adrian Belew Echoflanger** — a limited-edition reissue of the 1977 EH-1311, listed at **€239 / £208** and orderable now. EHX has not disclosed the size of the run. Original EH-1311s currently ask around **$1,695** on the used market, which is most of the reason this announcement is news at all.

The spec, from the listing:

- **Four original modes** — Filter Matrix, Flange, Chorus, Slap Back.
- **Two new combination modes** — Chorus + Flange, and Slap Back + Filter Matrix.
- **Controls** — Feedback, Rate, Width, Tune, Blend, and a **Volume** knob that the 1977 unit did not have.
- **Mono in, stereo out** (L/R), true bypass, 9V DC only at 40 mA. No battery.

I want to skip past the part where I tell you this pedal is cool, because that part is obvious, and get to the part that is actually useful: **three of those four modes are the same circuit**, and the fourth one is the reason people who own a Helix or a Quad Cortex keep failing to reproduce this sound with blocks they already have.

## The Broken Switch Is Now a Footswitchable Mode

The historical detail here is better than the usual signature-pedal origin story.

Belew's original unit had a four-way selector, and he has said he got the sound on Tom Tom Club's "Genius of Love" by **jamming that selector between the chorus and flanger positions** — a place the switch was never meant to stop. He marked the useful spots on the enclosure with dots. One of those dots was the "elephant sound" for King Crimson's "Elephant Talk." He described the self-oscillating end of the pedal's range as giant metallic insects flying across the stereo image, which is the most accurate description of maxed BBD feedback anyone has written.

So the headline feature of the reissue — **Chorus + Flange as a selectable mode** — is EHX productizing a malfunction. That is a genuinely good design decision and it is also the tell for what is going on inside the box.

## One Circuit, Four Delay Times

A bucket-brigade line delays your signal by some number of milliseconds and sums it back with the dry. That sum is a comb filter: a stack of notches whose spacing is set by the delay time. Every mode on this pedal is that one operation with two variables changed — **how long the delay is** and **whether an LFO is moving it**.

| Mode | Delay time | LFO |
|---|---|---|
| Flange | ~0.5–10 ms | Sweeping |
| Chorus | ~15–25 ms | Sweeping, gentler |
| Slap Back | ~30 ms and up | Off or minimal |
| **Filter Matrix** | Anywhere in the flange range | **Off** |

EHX's own copy for the Polychorus — the same circuit family — says it plainly: Filter Matrix "disengages the sweep flange adjustment for manual flange tones." The LFO stops. The comb filter parks wherever you set it and stays there, and the **Tune** knob becomes a tone control that moves the notches by hand instead of on a timer.

And now look at where "between chorus and flanger" falls on that table. It is the gap — roughly **10 to 15 ms**, with feedback up. Long enough that the notches are packed tighter than a flanger's, short enough that you still hear it as filtering rather than as a second voice. That is the Belew zone. It has a number.

## Building All Six Modes on a Modeler

Here is the part I care about, and the part that does not exist anywhere else in the coverage of this pedal.

Your modeler can do five of these six things tonight. It does the sixth one badly by default, and the fix is one parameter.

### Flange, Chorus, Slap Back

Trivial. Helix gives you **Jet Flanger** (the A/DA-derived one, most aggressive sweep), **Analog Flanger**, **AC Flanger**, and **Dynamix Flanger**. Any chorus block covers chorus. A mono delay at 30–80 ms with feedback at zero covers Slap Back. Quad Cortex, GP-200, MG-30, TONEX into anything — same three blocks, different names. Nothing interesting to say here.

### Filter Matrix — and the parameter everyone gets wrong

The instinct is to grab a flanger block and **turn Rate (or Speed) to zero**. This is the wrong control and it is why your attempt sounds like a flanger that is merely slow.

On most platforms the flanger's Speed parameter has a *minimum that is not zero*. Helix's flangers bottom out at a very low but nonzero rate. Set it to minimum and the comb is still crawling — it just takes forty seconds to get anywhere, so it sounds fine on a single chord and then drifts out from under you across a song. That drift is exactly the thing Filter Matrix exists to eliminate.

**Set Depth to 0 instead.**

Depth is the LFO's excursion. At zero, the modulator is still running and is multiplied by nothing, so the delay time does not move at all — no drift, no crawl, no matter what Speed says. The block collapses into a static comb filter. That is Filter Matrix, exactly, on any platform that exposes a Depth or Width parameter, which is all of them.

Then:

1. **Depth / Width: 0.**
2. **Manual** (Helix's name for the sweep center; QC and others may call it Center or Offset) is now your Tune knob. Sweep it slowly and listen — you are moving the notch stack up and down the spectrum by hand. Park it where the guitar gets hollow in a way you like.
3. **Regen / Feedback: start at 40–50%.** This is what turns shallow notches into sharp resonant peaks. Filter Matrix with no feedback is barely audible; the resonance *is* the effect.
4. **Mix: 50%.** Comb filtering needs the dry signal present to cancel against. Unlike most modulation, this one is not a "dial it back until it's tasteful" effect — at low mix there is no filter.

Assign Manual to an expression pedal and you have a hand-swept flange, which is what people were actually doing with these pedals in 1977 before LFOs got cheap.

### Chorus + Flange — the Belew mode

Two ways, and I would do them in this order.

**Simple version:** one flanger block, Manual pushed toward the top of its range so the effective delay lands in that 10–15 ms gap, **Depth low but not zero** (10–20%), **Regen high** (60–75%), **Speed slow**. You get flanger resonance moving at chorus speed, which is functionally what jamming the switch between detents produced.

**Faithful version:** chorus block and flanger block in **parallel**, not series. Series stacks the combs and the result gets muddy fast because the second block filters an already-filtered signal. Parallel sums two independent combs against one dry signal, which is closer to what a single BBD line doing two things at once actually sounds like. Balance the two legs by ear; the flanger wants to sit under the chorus, not on top of it. Chain-order reasoning for this kind of stack is in [Signal Chain Order: The Complete Guide](/blog/signal-chain-order-guide), and the parallel-path mechanics are in [Stereo Guitar Signal Chain Architecture](/blog/stereo-signal-chain-architecture).

### Slap Back + Filter Matrix

Delay block at 30–80 ms, feedback zero, **into** a flanger block with Depth at 0 and Regen high. Order matters here: the comb filter goes *after* the repeat so the slap is filtered, not the other way around. This is the closest thing on the pedal to an ambience mode and the easiest one to overdo.

### The metallic insects

Max the Feedback and ride Tune and Width and the circuit self-oscillates. On a modeler: Regen to 90%+ on a flanger with Depth at 0, then move Manual. You get a resonant tone that tracks your hand, not your playing. It is an instrument, not an effect, and it behaves under your fingers the same way a self-oscillating delay does — which we broke down at length in [Controlled Delay Self-Oscillation: Using Your Delay as a Noise Instrument](/blog/controlled-delay-self-oscillation-ambient-noise-instrument). Same discipline applies: set a footswitch that gets you out of it before you need one.

## The Stereo Output Is a Mono Problem

Mono in, stereo out, on a comb filter, is the specific combination that disappears when a front-of-house desk sums you.

Stereo on this circuit is generally produced by feeding the two outputs different phases of the same wet signal. That reads as enormous width in headphones. Summed to mono, the out-of-phase content cancels — and because the wet signal here is a *filtered copy of your dry guitar*, some of your dry body can go with it. You do not lose the effect and keep the guitar; you can lose both.

Check it before the gig, not at it. Sum your outputs, play a chord, and listen for low-mid weight vanishing. We ran this test across the common width tricks in [Which Stereo Widening Tricks Survive a Mono PA (and Which Vanish)](/blog/stereo-width-tricks-that-survive-mono), and phase-inverted modulation is squarely in the "verify first" column. This applies to the modeler build too, if you have built it stereo.

## Should You Buy It

**No**, if what you want is the sound. Every mode on this pedal is a comb filter at a delay time, and your modeler has comb filters at every delay time. The Belew records are not locked behind a BBD. Set Depth to 0 tonight and you will learn more about what that pedal was doing than another year of listening to *Discipline* through headphones will teach you.

**Yes**, if:

- **You want the BBD's bandwidth limiting specifically.** A bucket-brigade line loses high end and gains noise by construction, so the delayed copy comes back darker than the dry. That darkness is why the comb sits behind the guitar instead of fighting it. You can approximate it with a low-pass around 5–6 kHz on the wet path, and I would try that before spending anything, but it is an approximation. The failure modes of real BBD lines are in [BBD Bias Trim Symptoms](/blog/bbd-bias-trim-symptoms-analog-delay-chorus).
- **You want a hand-swept knob.** Filter Matrix under a real Tune knob is a different instrument than Filter Matrix under an expression pedal. That is a legitimate ergonomic reason, not a tone reason, and it is the honest one.
- **It is limited and you collect.** Fine. That is a real reason. It is just not a tone argument.
- **Your HX Stomp is full.** Six blocks with an amp, cab, gate, drive, delay and reverb in them leaves nothing for a parallel chorus/flange stack. Offloading to hardware is legitimate.

## My Take

The thing I keep turning over is that the defining sound here came from a switch stopping somewhere it was not designed to stop. Belew could not have written down a repeatable procedure for it at the time — he marked the enclosure with dots because that was the only way to find the spot again. That is the opposite of how I build anything.

And then forty-nine years later, a company measured it, found it was about twelve milliseconds with the feedback up, and put it on a rotary switch.

That is the whole argument for understanding the mechanism instead of buying the box. The dots were a workaround for not knowing the number. We know the number now. It is in the table above, it costs nothing, and you can go find it in your modeler in the next ten minutes.

Set Depth to zero first.

## Dig Deeper on Fader & Knob

- Feedback as an instrument, and how to get back out: [Controlled Delay Self-Oscillation](/blog/controlled-delay-self-oscillation-ambient-noise-instrument).
- Before you trust a stereo modulation patch at a gig: [Which Stereo Widening Tricks Survive a Mono PA](/blog/stereo-width-tricks-that-survive-mono).
- What splits and what stays mono: [Stereo Guitar Signal Chain Architecture](/blog/stereo-signal-chain-architecture).
- Where modulation goes relative to gain and time effects: [Signal Chain Order: The Complete Guide](/blog/signal-chain-order-guide).
- Why real bucket-brigade lines sound the way they do — and how they fail: [BBD Bias Trim Symptoms](/blog/bbd-bias-trim-symptoms-analog-delay-chorus).
- Chorus that reads as an era rather than an effect: [Robert Smith's Chorus Tone](/blog/cure-robert-smith-chorus-tone).
