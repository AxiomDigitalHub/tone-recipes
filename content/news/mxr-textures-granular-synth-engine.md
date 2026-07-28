---
title: "MXR Put a Granular Synth in a Pedal for $269 — Here's What Your Helix Already Does, and the One Mode It Can't Touch"
date: "2026-07-28"
category: "new-gear"
slug: "mxr-textures-granular-synth-engine"
excerpt: "MXR announced the Textures Granular Synth Engine (M310) on July 28 — $269, available now, with three capture modes, eight presets, and true stereo I/O. Delay mode and Auto-Freeze are largely buildable on a Helix, HX Stomp, or Quad Cortex tonight for free. Layers mode — four independently sampled notes with their own fade envelopes — is not. Here's the honest split, with the block-level settings to try first."
source_url: "https://www.jimdunlop.com/mxr-textures-granular-synth-engine/"
image_url: ""
author_slug: "dev-okonkwo"
---

MXR announced the Textures Granular Synth Engine on July 28. It's the M310, it's $269 street (£279 in the UK), and it's already listed as available at Dunlop and the usual retailers. The pitch, in MXR's own words: it "records what you play and reshapes it into a shifting blend of tones and timbres."

That's granular synthesis, which is a thing I've spent an embarrassing number of 2 AM sessions doing inside Ableton and have almost never seen offered as a dedicated guitar pedal at this price. So my first reaction was genuine interest, and my second was the reflex I have about every ambient box: *how much of this is already sitting in the modeler I own?*

The answer turned out to be more interesting than usual. Two-thirds of this pedal is buildable on a Helix tonight. The remaining third isn't in any modeler I know of.

## What Actually Shipped

From Dunlop's spec sheet:

- **Three capture modes**, selected by a Mode button, which determine how the pedal records and replays your signal:
  - **Delay** — continuously fragments incoming notes into grains as they play back
  - **Auto-Freeze** — captures the input and sustains it as an evolving wash
  - **Layers** — samples **up to four independent notes or chords**, each with its own fade characteristics
- **Grain controls**: Size and Overlap define grain length and how densely grains stack
- **Playback controls**: Pitch and Reverse, plus Time/Delay and Regen for temporal movement, and Mix for wet/dry
- **Eight preset buttons** with factory sounds spanning regenerative octave loops, polyphonic synth pads, sub-octave beds, and stuttering glitch
- **Hidden parameters** under a Reverse-hold or Mode-hold: randomization amount, plus built-in reverb, filter, and vibrato tuning, and tap tempo
- **Full stereo in and out**, configurable as mono, wet/dry, or true stereo
- **Expression pedal input**, morphing continuously between heel and toe states
- **MXR Split + Tap** support for hands-free preset scrolling, tap, and freeze

The built-in reverb/filter/vibrato is worth flagging early: this is not just a grain engine, it's a grain engine with a small effects rack behind it. That matters when you compare it to what a modeler block gives you.

## The Two-Thirds You Can Build Tonight

I want to be specific here rather than hand-wave "your modeler can do that," because the whole reason I write for this site is that nobody gives bedroom players actual parameter values.

**Delay mode is Glitch Delay territory.** On Helix, HX Stomp, and Helix Native, the **Glitch Delay** block is a genuine grain-style delay — it slices incoming audio into fragments and replays them with pitch and reverse variation. It is not as deep as a dedicated granular engine, but the family resemblance is obvious the second you turn it on. Start with a short time, push the slice/repeat density up, add a small amount of pitch variance, and blend to taste rather than running it wet. Where MXR gives you Size and Overlap as continuous knobs, you're working with a fixed grain architecture — you can dial the character, not redesign the engine.

Stack that into a reverb and you're most of the way to the pedal's first two preset banks. If you want the shimmering, octave-regenerating version, run a **Poly Pitch at +12 into a delay with high feedback**, in a parallel path so your dry note stays intact — the same routing logic I'd use for [shimmer without a BigSky](/blog/shimmer-reverb-without-bigsky) and the reason [parallel reverb routing](/blog/parallel-reverb-routing) shows up in nearly every ambient patch I build.

**Auto-Freeze is a solved problem.** Holding a chord as an infinite bed is one of the most thoroughly covered tricks in modeler land. On Helix and HX Stomp the direct route is a **Poly Sustain** block with a footswitch assigned to engage it; the scrappier route is assigning a footswitch to slam a delay's feedback or a reverb's decay to maximum and letting it ring. Both give you the "the chord is still there while I play over it" effect, which is the actual musical job. We walked through all three approaches — freeze block, looper-as-pad, and infinite reverb — in the [synth pad without a keyboard piece](/blog/synth-pad-guitar-no-keyboard-freeze-hold), and the honest conclusion there hasn't changed: this is free on gear you already own.

If your interest is the runaway, self-feeding version of that, [controlled delay self-oscillation](/blog/controlled-delay-self-oscillation-ambient-noise-instrument) covers turning feedback into an instrument rather than an accident, and [reverse reverb swells](/blog/reverse-reverb-guitar-swells-and-textures) covers the backwards-bloom half of what Textures' Reverse knob is doing.

**And in a DAW, this is even more free.** If you record like I do — interface, laptop, no amp in the room — you already have granular tools that go further than any pedal. Ableton's Granulator, any of the free grain-cloud devices floating around, and Valhalla Supermassive's longer modes will get you into the same sonic neighborhood with a fraction of the money. I compared Supermassive against a Strymon BlueSky's tail [here](/blog/valhalla-supermassive-vs-strymon-bluesky-ir-reverb-tail), and the short version applies to this pedal too: for headphone work, the plugin is not the compromise people assume it is.

## The One-Third That Isn't in Your Modeler

Layers mode. This is the reason I'd keep an eye on this pedal instead of dismissing it.

**Four independently sampled notes or chords, each with its own fade characteristic**, is not a thing a Helix, HX Stomp, or Quad Cortex block does. Freeze on a modeler is monolithic: you capture what's ringing, and that's the bed. One capture, one decay. What MXR is describing is closer to a small sampler with four voices you populate one at a time — grab a low root, grab a fifth two bars later, grab a suspended voicing on top, and each one breathes and decays on its own schedule while you keep playing.

For anyone building ambient beds, that's a structurally different tool. It's the difference between one sustained chord under your melody and an actual evolving harmonic stack that you assembled in real time. The closest modeler equivalent is a looper with layered overdubs, and a looper locks everything to one loop length and one shared fade — which is exactly the constraint that makes looper pads sound static. The [looper, delay, reverb chain-order piece](/blog/looper-delay-reverb-signal-chain) gets into why placement changes what a looped bed can do, but no amount of placement gives you four independent envelopes.

Two other things the pedal has that a modeler block genuinely lacks:

- **Continuous grain parameters.** Size and Overlap as real knobs means you can move from a shimmering micro-grain cloud to a chunky, stuttering half-second fragment on the same setting. Glitch Delay lets you steer inside its design; it doesn't let you change the grain size out from under it.
- **Real stereo width from the grain engine itself.** True stereo in and out with wet/dry configurability means grains can scatter across the field rather than sitting centered in a mono block. If you're mixing to headphones, that's not a garnish — stereo placement is most of what makes an ambient bed feel large, which is the whole argument in [stereo signal chain architecture](/blog/stereo-signal-chain-architecture).

## Who Should Actually Buy It

**Skip it** if you wanted this for shimmer, freeze pads, or glitchy delay and you own a Helix, HX Stomp, or Quad Cortex. Those three sounds are the ones people mean 90% of the time when they say "ambient," and you have all of them. Spend an evening with Glitch Delay and a Poly Sustain block before you spend $269.

**Skip it harder** if you record entirely in the box. Whatever this pedal does, a granular plugin does further, cheaper, with automation and undo. Pedals earn their keep by being playable in real time with your feet; that's an advantage that mostly evaporates when you're sitting at a laptop.

**Take it seriously** if Layers mode describes something you've been trying and failing to build. Four independent captures with independent fades is a genuinely new capability at this price point, and if you're the person handling transitions, film-score-ish beds, or the instrumental section where the texture *is* the part, that's a tool that writes parts rather than supporting them. Also worth it if your patches are DSP-starved — an HX Stomp with two delays, a big reverb, and an amp is already scraping the ceiling, and moving texture duty to an external box buys that headroom back.

**The middle path**, and the one I'd take: build the Delay-mode approximation on your modeler this week. Glitch Delay into a long reverb, Poly Pitch +12 on a parallel leg, footswitch on Poly Sustain. If that scratches the itch, you kept $269. If you find yourself wishing you could hold three separate chords with three separate decays, then you've identified exactly what the money is buying — and it isn't the grains, it's the four voices.

## My Take

The interesting thing about Textures isn't that MXR made an ambient pedal. It's that granular synthesis is a technique from electronic music — I first heard it in production, not on a guitar — and it's now arriving at $269 in a format you can stomp on. That's the same arc that brought pitch shifting and shimmer from studio racks to sub-compact boxes, and it usually means the sound is about to stop being a niche.

But the version of me at 17, who had a Squier and no money, would have been better served by an evening with the free tools already on the desk than by another box. The grains were always available. The four independent fades weren't. Know which one you're actually buying.

## Dig Deeper on Fader & Knob

- Build a held pad without a keys player: [freeze, hold, and looper tricks](/blog/synth-pad-guitar-no-keyboard-freeze-hold).
- Turn feedback into a playable instrument in [controlled delay self-oscillation](/blog/controlled-delay-self-oscillation-ambient-noise-instrument).
- The backwards-bloom half of the Reverse knob: [reverse reverb swells and textures](/blog/reverse-reverb-guitar-swells-and-textures).
- Free-plugin ambient in the box: [Valhalla Supermassive vs. Strymon BlueSky](/blog/valhalla-supermassive-vs-strymon-bluesky-ir-reverb-tail).
- Why stereo placement is most of "big": [stereo signal chain architecture](/blog/stereo-signal-chain-architecture).
- Shimmer on gear you already own: [shimmer reverb without a BigSky](/blog/shimmer-reverb-without-bigsky) and [parallel reverb routing](/blog/parallel-reverb-routing).
