---
title: "CorOS 4.1.0 Actually Ships: Device Presets, Eight New Virtual Devices, and the End of the PCOM Waiting List"
date: "2026-08-28"
category: "firmware-update"
slug: "neural-dsp-coros-4-1-0-ships-device-presets-virtual-devices"
excerpt: "Neural DSP shipped CorOS 4.1.0 on August 26 — four months after announcing it. The five Archetype X plugins arrived as promised, but the feature that changes how you actually work is Device Presets: save one block, recall it anywhere, across 2,000 factory starting points."
source_url: "https://neuraldsp.com/quad-cortex-updates"
image_url: ""
author_slug: "sean-nakamura"
---

Neural DSP released CorOS 4.1.0 and Cortex Control 4.1.0 for the Quad Cortex and Quad Cortex mini on August 26. It's free, it's the largest CorOS release the platform has had, and it landed roughly four months after the announcement we [covered back in April](/news/neural-dsp-coros-4-1-pcom-darkglass-ultimate).

The announcement was about plugin compatibility. The shipping version is about something else, and I don't think the press coverage has the emphasis right.

## What Actually Shipped

The headline from April held: five Archetype X plugins are now running natively on the Quad Cortex — John Mayer X, Petrucci X, Misha Mansoor X, Rabea X, and Tim Henson X. With those five, every currently available X-updated plugin is PCOM-compatible. The waiting list is empty. That's a real milestone for a framework that had been trickling out one or two plugins per release since CorOS 3.0.

Eight new virtual devices came with it:

- **Multivoicer** — harmonizer
- **Glitch** — granular delay
- **Ring Modulator**
- **Arpeggio Delay**
- **Crystal Delay**
- **Vintage Digital Reverb**
- **Douglas Shining** — compressor, modeled on the Darkglass Hyper Luminal
- **Plugin Parametric-4** — four-band parametric EQ

And Cortex Control 4.1.0 now manages multiple units from one computer, with individual device naming and unit toggling without swapping cables.

## Device Presets Are the Real Update

Here's the feature I'd have led with. **A Device Preset stores the settings for a single virtual device — one block — and lets you recall it into any preset.** The update ships with more than 2,000 factory Device Presets.

If you've built presets on a Quad Cortex for any length of time, you know the problem this solves. You spend forty minutes dialing a reverb until the decay sits exactly right against your delay. Then you build a new preset next week and you have to do it again — or copy the whole old preset and gut it, or dig through your library trying to remember which one had the good reverb in it. The block was the atomic unit of your work, but the *preset* was the smallest thing you could save. That mismatch is where hours go.

I have a spreadsheet with 847 presets in it precisely because the platform gave me no better way to find a setting I'd already solved. Device Presets is the platform finally admitting that the reusable unit is the block.

Two practical consequences:

**Your good blocks are now assets, not archaeology.** Build a library deliberately. The blocks worth saving are the ones with settings you arrived at slowly — compressors, reverb tails, your gate, your always-on EQ. Not your amp block; you'll change that per song anyway.

**Global EQ Presets and I/O Settings Presets came along too.** These matter more than they sound. If you play the same rig through a wedge on Sunday and headphones on Tuesday, that's two Global EQ curves you've been re-entering by hand. Now they're recallable. Our [modeler EQ guide](/blog/modeler-eq-guide) covers what those curves should actually look like for each context, and if you've never level-matched across them, [start here](/blog/level-match-modeler-presets) — recallable settings only help if the thing you recall is calibrated.

## Which of the Eight New Devices Are Worth Your Time

Not equally. Ranked by how often they'll leave your board once they're on it:

**Plugin Parametric-4.** Boring, essential, and the one I'd install first. A proper four-band parametric is the tool for the two problems that ruin more modeler tones than anything else: a honk around 800 Hz–1 kHz and fizz above 6 kHz. If your high gain sounds like a wasp in a tin can, that's a surgical EQ problem, not an amp-model problem — [the fizz walkthrough](/blog/fix-fizzy-high-gain) is the procedure.

**Douglas Shining.** A Hyper Luminal-style compressor is a genuinely different animal from a squash-box comp. It's a mix-bus compressor voicing on a guitar chain. Watch that you don't stack it against a comp you already have earlier in the chain — where you put compression in the signal path changes what it does, and we broke that down [here](/blog/compressor-placement-modeler-preset-pre-amp-post-amp).

**Vintage Digital Reverb.** This is a specific, useful color — the slightly grainy, pitched-up-shimmer character of 80s rack digital. It is not a better version of the CorOS 4 reverbs, which I [ranked when they landed](/blog/coros-4-reverbs-nordic-studio-plate-blossom-ranked). Use it when you want the artifact, not when you want the room.

**Crystal Delay, Arpeggio Delay, Glitch, Multivoicer, Ring Modulator.** These are texture devices. They're fun, and three of them will be gone from your presets in a month. That's fine — that's what texture devices are for. Just don't let them displace a block you actually need on a gig.

## Install Advice

Standard discipline, and I'll repeat it every time: **back up before you update.** Cortex Control will do it, it takes two minutes, and a firmware update is exactly the moment a corrupted preset library discovers itself.

Then, before you migrate anything: don't rebuild your existing presets around Device Presets in one sitting. Build the library forward. Every time you dial a block you like from here on, save it. In three months you'll have a library made of settings you actually use, instead of one made of settings you thought you'd use on a Saturday afternoon.

If you're building from a blank slate on this firmware, our [preset-from-scratch walkthrough](/blog/quad-cortex-preset-from-scratch) still holds — the signal-chain order didn't change, only the save granularity. And if you're deciding between capturing your amp and using a model now that the plugin library is complete, the [captures vs. models breakdown](/blog/quad-cortex-captures-vs-models) is the honest version of that argument.

## What This Does to the Platform Comparison

Every X plugin now runs on the hardware. That's the thing Neural DSP has been promising since PCOM launched, and it's the single strongest argument for the Quad Cortex over the alternatives: your plugin purchases follow you onto the floor.

It doesn't flip the whole comparison. Helix still has a deeper stock effects library and a routing grid I'd argue is more flexible, and we keep that head-to-head current [here](/blog/helix-vs-quad-cortex). But "buy the plugin, use it live" was an asterisked claim for two years. As of Wednesday, it isn't.

Quad Cortex mini owners get all of this too — if you're on the mini and wondering what CorOS 4 changed for you specifically, [we wrote that up](/blog/quad-cortex-mini-coros-4-existing-owners).
