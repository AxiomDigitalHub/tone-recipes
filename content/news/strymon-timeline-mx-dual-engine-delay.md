---
title: "Strymon's TimeLine MX Runs Two Delay Machines at Once for $679 — Here's What Your Helix Can and Can't Do About It"
date: "2026-07-07"
category: "new-gear"
slug: "strymon-timeline-mx-dual-engine-delay"
excerpt: "Strymon announced the TimeLine MX on July 7 — a $679 successor to the delay that has anchored worship pedalboards for over a decade. It runs any two of twelve machines simultaneously with series, parallel, or split routing and per-engine panning, and adds four new engines: Spectral granular, a per-tap MultiTap, Oil Can, and Drum. The original TimeLine stays in the lineup at $449. If yours lives in a Helix effects loop, here's the honest math."
source_url: "https://www.strymon.net/product/timeline-mx/"
image_url: ""
author_slug: "nathan-cross"
---

Strymon announced the TimeLine MX on July 7, and it is already in stock at strymon.net for $679. Before anything else, one fact worth stating plainly because I have already seen it misreported: the original TimeLine is not discontinued. It is still listed at $449 on Strymon's site, in stock, shipping same day. The MX sits above it, not in place of it.

That matters for this audience more than most, because if you play in a worship band there is a decent chance a TimeLine is velcroed to your board right now — probably in your Helix's effects loop, probably running a dotted-eighth on one preset and a quarter-note tape voice on another. It has been the default delay of Sunday-morning rigs for over a decade. So the real question is not "is the MX good." Strymon does not ship bad delays. The question is what it does that your Helix cannot, and whether that gap is worth $679 to you.

## What Shipped

The spec sheet, from Strymon's product page:

- **Twelve machines**, and the MX runs **any two simultaneously** with series, parallel, or split routing and individual panning per engine
- **Four new engines**: **Spectral** (granular delay with pitch, reverse, and time-stretch), **MultiTap** (eight taps with per-tap control over pan, level, feedback, and filter), **Oil Can** (dark, murky electrostatic-style repeats), and **Drum** (vintage multi-head drum echo)
- The returning machines — dTape, dBucket, Digital, Reverse, Ice, Lo Fi, Filter — plus a **new reverb engine** that counts as the twelfth machine
- **Five-minute stereo looper**, one-button or multi-button operation, placeable before or after the delays, with reverse, redo, and half-speed via MIDI
- **Configurable hardware insert** — an effects loop inside the delay pedal
- Large OLED screen, 300 presets, TRS stereo I/O with selectable configurations, MIDI over USB-C, TRS, and DIN, expression pedal input
- Tri-core 800 MHz ARM processor, 24-bit/96 kHz conversion

Strymon CEO Gregg Stock's line in the announcement — "It's taken a long time, but the day is finally here" — is not marketing overstatement. The original TimeLine shipped in 2011. This is the first true second generation.

## The Part Your Helix Genuinely Cannot Do

I want to be fair in both directions here, because the reflex answer — "my Helix already has a dozen delay blocks" — is true and also misses what is new.

The dual-machine architecture itself is not the moat. More on that below. The moat is inside the new engines:

- **Per-tap control on MultiTap.** Eight taps, and every tap gets its own pan, level, feedback, and filter. Helix has multitap delays, but they do not expose the taps as individually addressable voices. Building a pattern where tap three sits dark and left while tap five sits bright and right is sound design the Helix delay blocks simply do not offer.
- **Per-grain control on Spectral.** Granular delay with pitch, reverse, and time-stretch at the grain level. Helix's Glitch Delay gets you into the neighborhood — sliced, pitched repeats — but not a true granular engine with this depth. For ambient intros and transition swells, this is the most musically useful thing on the pedal.
- **The Oil Can and Drum voicings.** Helix has no oil-can delay and no multi-head drum echo. These are characterful, specific sounds, and if you want them on a Helix today, you are approximating with tape models and EQ.
- **The hardware insert.** A configurable loop inside the delay means your repeats can run through an external pedal — drive on the repeats only, a vibe on the wet path — without any parallel-path gymnastics. There is no Helix equivalent inside a single block.

## What Your Helix Already Does

Now the other direction, because $679 deserves honesty.

Two delay machines at once with independent routing and panning is a thing a Helix or HX Stomp can substantially replicate today: split into parallel paths A and B, drop a different delay block on each — say Transistor Tape on one, Bucket Brigade on the other — pan the paths apart, and merge. That is the MX's parallel mode, built from blocks you already own. Series mode is even easier: two delay blocks in a row. The classic worship stack of a dotted-eighth into a quarter-note ambient wash has never required two physical pedals, and it does not require this one.

The five-minute looper is likewise covered — Helix's looper block is right there, and most of us trigger loops from Ableton or a pad rig anyway. And the new reverb engine is welcome on a standalone board, but you are already carrying better reverb options in the Helix than a delay pedal's twelfth machine.

So the honest framing: the MX's architecture is replicable on your modeler. Its new voices are not.

## Buy Or Skip, For The Helix Player

**Skip it** if your TimeLine lives in the Helix loop running dotted-eighth tape and quarter-note digital, and that is the job. The original does that at $449, your Helix does it for free, and the congregation cannot hear the difference between a dTape block and a dTape pedal. If your current TimeLine works, nothing announced today made it worse.

**Take it seriously** if you are the ambient-textures player on your team — the one handling transitions, swells, and the instrumental moments where the delay *is* the part. Per-tap MultiTap patterns, granular Spectral beds, and the insert loop are genuinely new tools, and they are the kind of tools that create parts rather than support them. At $679 it is priced below a used HX Stomp, and it would slot into the Helix loop exactly where your current TimeLine sits, on the same four cables.

**The middle path**: try building the MX's parallel mode on your Helix this week — two delay blocks, split paths, panned — before spending anything. If that scratches the itch, you saved $679. If it leaves you wanting the taps and the grains, now you know the money is buying the engines, not the routing.

## Try the Trick on Your Helix Today

We went ahead and built that middle path for you. Here's the MX's parallel mode as a free Helix preset — two delays running at the same time, no sign-in, no catch.

![Signal flow: guitar into amp and cab, then the path splits in two — a digital delay playing dotted eighths on top, a tape echo playing quarter notes underneath — and both mix back together at the output.](/images/news/parallel-dual-delay-routing.svg)

1. **Download the preset:** [FK Dual Delay MX (.hlx)](/presets/technique-parallel-dual-delay.hlx). It works on any Helix, LT, or HX Stomp.
2. **Load it:** open HX Edit, click an empty preset slot, then File → Open Preset and pick the file you just downloaded.
3. **Play something slow.** You're hearing two delays at once — a crisp digital delay bouncing dotted eighths down one path, a warm, wobbly tape echo pulsing quarter notes down the other, blended back together at the end.
4. **Set the tempo:** tap the TAP footswitch in time with your song (or type a BPM into HX Edit) and both delays lock in together — the dotted eighths dancing around the quarter notes is the whole trick.
5. **Make it yours:** turn either delay's Mix knob up or down to decide which voice leads — crisp digital up front with the tape as a halo, or the other way around.

If that scratches the itch, you just saved $679. If it leaves you wanting the taps and the grains, now you know exactly what the MX is selling you.

## Dig Deeper on Fader & Knob

- Running delays in a Helix effects loop? Our [effects loop explainer](/blog/effects-loop-explained) covers the routing the TimeLine has lived in for a decade.
- The dual-delay layering the MX does in hardware is the same recipe as our [cascading dual delay guide](/blog/cascading-dual-delay-bloom-dream-pop-shoegaze) — build it from Helix blocks first.
- The worship staple the MX still serves: our [dotted-eighth delay guide](/blog/dotted-eighth-delay-no-tap-tempo) gets the timing right on any platform.
- Chasing the wider worship sound? Start with our [Bethel Music Helix tone breakdown](/blog/bethel-music-guitar-tone-helix), then browse the [Helix tone recipes](/platforms/helix).
