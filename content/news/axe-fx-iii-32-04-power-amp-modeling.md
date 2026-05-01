---
title: "Axe-Fx III Firmware 32.04 Reworks Power Amp Modeling — FM9 In Private Beta, FM3 To Follow"
date: "2026-04-27"
category: "firmware-update"
slug: "axe-fx-iii-32-04-power-amp-modeling"
excerpt: "Fractal pushed Axe-Fx III firmware 32.04 on Friday April 24. The headline change is improved power amp modeling and a fresh round of amp model updates based on new analysis methods. There is also a real bug fix in the Chorus block that was costing depth on Auto-Depth presets, and a Multiplexer USB routing fix. FM9 is already in private beta. FM3 is next."
source_url: "https://forum.fractalaudio.com/threads/axe-fx-iii-firmware-32-04-release.220289/"
image_url: ""
author_slug: "viktor-kessler"
---

Fractal released Axe-Fx III firmware 32.04 on Friday April 24, 2026. It came in 19 days after 32.03 — fast even by Fractal's "Firmware Friday" cadence — and the changes are weighted toward modeling refinement rather than feature additions. If you read 32.03 as the new analysis method's first public pass, 32.04 is the second pass through the catalog with the corrections that fall out of broader testing.

## What 32.04 Actually Changes

The most important line in the release notes is the one about power amp modeling. Fractal updated the underlying power amp model and ran many of the existing amp models back through the new analysis methodology. Existing presets are automatically migrated with new default values for some advanced parameters in the amp block, so when you load a stored preset under 32.04 it will not sound the same as it did under 32.03 — and that is the intent, not a bug.

What you should listen for: the way amps respond when you push them past the breakup threshold. Power amp modeling is where the dynamic load interaction between speaker impedance, the tubes, and the output transformer is supposed to live. When that modeling is accurate, the amp gets thicker and slightly looser as you dig in — the way a real cranked tube power section actually compresses. When it is not accurate, the amp tracks pick attack with a slightly synthetic linearity that gives the modeled-amp tell. 32.04 is iterating on that, and on the higher-gain models it is the most audible change.

The "more open" feel that early adopters are reporting in the forum thread is not marketing language — it is what you get when output stage compression behaves correctly under transient input. If your existing preset suddenly feels less stiff and you have not changed anything else, that is the new model talking.

## The Chorus Bug Fix Matters More Than It Sounds

Buried lower in the notes is this: several Chorus models — including Analog Mono, Analog Stereo, and a few of the BBD-style algorithms — had less depth than earlier firmware when Auto-Depth was enabled. That regression slipped in somewhere in the 32.x line and 32.04 fixes it.

If you have built any preset since the 32.x updates that uses one of the affected Chorus algorithms with Auto-Depth on, expect the modulation depth to come back. For clean and crunch presets that lean on chorus as a stereo widener — which is most of the chorus use cases on this platform — the depth recovery is going to be obvious on the first A/B. Not subtle.

The other practical fix: the Multiplexer block was not selecting USB audio inputs correctly. If you reroute USB inputs through Multiplexer in any of your studio presets, that path now works again.

## FM9 In Private Beta, FM3 Underway

The release thread on the Fractal forum confirms FM9 firmware 32.04 is already in private beta with selected testers, and FM3 is in active development behind it. Fractal's pattern through the 32.x line has been roughly two-to-four weeks between Axe-Fx III public release and FM9 release, with FM3 trailing FM9 by another one-to-two weeks.

For practical planning purposes: if you are an FM9 owner and you maintain critical performance presets, expect a public 32.04 build sometime in the first half of May. If you are on FM3, plan for late May.

The Mark II Turbo variants of FM9 and FM3 should be in the same release window — Fractal has been consistent through the 32.x line about treating Turbo and non-Turbo as the same firmware target, so the additional DSP headroom on Turbo models means more simultaneous block headroom under the new amp models, not a different feature set.

## Should You Update Right Now

For Axe-Fx III owners, the answer depends on what you are doing this week. If you have a gig or session where preset consistency matters, sit on 32.03 until you have a quiet week to A/B your high-gain rhythm presets. The amp model migration is going to shift your tone slightly, and depending on how aggressively you have set advanced parameters on your existing patches, "slightly" can mean "I need to redial the master volume relationship to the cab block."

If you are between commitments, update now. The Chorus fix alone is reason enough to take the new build, and the new power amp modeling is the kind of change that gets better the more time you spend with it dialed in.

A note for anyone on the Mark II Turbo: you have more DSP headroom to play with under 32.04 because the amp block efficiency improvements stack with the Turbo's additional processing budget. If you have been at the DSP ceiling on a complex preset on the original Mark II, the Turbo on 32.04 is where you would actually feel the difference — not in tone, but in how many simultaneous blocks you can stack before the unit complains.

## Dig Deeper on Fader & Knob

- Our coverage of the [Fractal AM4 V2.00 firmware](/news/fractal-am4-v2-firmware-now-shipping) walks through the prior amp modeling refinements that 32.04 builds on, including how the new analysis methods affect high-gain low-end behavior.
- The [Fractal preset building guide](/blog/fractal-am4-preset-guide) covers signal chain construction with the gate block, drive block, and amp block — directly relevant when redialing presets after a 32.04 update.
- For comparison context, the [Neural DSP CorOS 4.1.0 announcement](/news/neural-dsp-coros-4-1-pcom-darkglass-ultimate) covers what is shipping on the Quad Cortex side this month.
- Browse all our [Fractal tone recipes](/platforms/fractal) for preset frameworks built on Axe-Fx III, FM9, and FM3.
