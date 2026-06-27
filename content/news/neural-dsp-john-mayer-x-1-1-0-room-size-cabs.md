---
title: "Neural DSP's John Mayer X 1.1.0 Just Documented 14 Signal Chains — and Added Room-Size Cabs Worth Stealing"
date: "2026-06-26"
category: "firmware-update"
slug: "neural-dsp-john-mayer-x-1-1-0-room-size-cabs"
excerpt: "Neural DSP shipped Archetype: John Mayer X 1.1.0 on June 24 with 14 song-specific presets — Slow Dancing in a Burning Room, Perfectly Lonely, Vultures, Wild Blue — plus selectable Small/Medium/Large room sizes on every cab. The presets are a free signal-chain reference for one of the most-requested clean tones in guitar, and the room-size control is a tone-design idea you can replicate on a Helix or HX Stomp today. Here's how to read both."
source_url: "https://neuraldsp.com/news/archetype-john-mayer-x-1-1-0-is-now-available"
image_url: ""
author_slug: "sean-nakamura"
---

Neural DSP released Archetype: John Mayer X version 1.1.0 on June 24. This is a desktop and Quad Cortex plugin update, not a CorOS firmware drop, so it is easy to scroll past if you do not own the title. Do not scroll past it.

The headline for most people is the 14 new presets, built by John Mayer, modeled on specific songs: Slow Dancing in a Burning Room, Perfectly Lonely, Vultures, Wild Blue, and Who Did You Think I Was, among others. The headline for me is a smaller change buried in the notes — cabinets and the Three-In-One Amp now have selectable room sizes (Small, Medium, Large), where previous versions were locked to Large. That is the part that matters even if you never touch this plugin, and I will come back to it.

First, the presets, because there is more signal in them than the marketing suggests.

## A Song-Named Preset Is a Documented Signal Chain

I build presets the way I build a design system: if you cannot reproduce a tone, you do not actually understand it. The frustrating thing about chasing John Mayer's clean sound for the last decade has been that the "recipe" lives in interviews, scattered rig rundowns, and a lot of forum guesswork. What 1.1.0 ships is the opposite of guesswork — fourteen reference chains, each tied to a song you can pull up and A/B against in real time.

You do not need to own the plugin to use that. Pull up "Slow Dancing in a Burning Room" and listen to where the tone actually lives: it is not a high-gain sound, it is a clean-to-edge-of-breakup amp with the midrange doing all the work and a compressor setting the attack. "Perfectly Lonely" is brighter, faster in its compression recovery, more of a funk-clean. "Vultures" leans on the neck pickup and a slower, wetter ambience. Each preset is a labeled answer to "what is the chain," and the chain is the transferable part — not the specific Neural DSP amp model.

This is exactly the gap our [John Mayer clean tone guide](/blog/john-mayer-clean-tone-settings) already walks for hardware players: neck pickup, amp with clean headroom and the volume wide open, a subtle compressor first in the chain, a Tube Screamer used as a clean boost rather than a dirt box, and spring reverb kept under 30 percent. The 1.1.0 presets are a way to verify that framework by ear and tune the proportions per song. Load the guide's starting points on your Helix, then use Mayer's "Perfectly Lonely" preset as the target you are matching the compressor and treble against.

## The Room-Size Cab Change Is the Real Takeaway

Here is the feature I want hardware players to pay attention to, because it is a tone-design principle, not a Neural DSP exclusive.

Previous versions of John Mayer X rendered every cab at a fixed Large room size. 1.1.0 lets you choose Small, Medium, or Large. That sounds cosmetic. It is not. Room size in a cab block is controlling early reflections — the short, dense burst of sound that bounces off the walls before the actual reverb tail develops. It is the single most underrated variable in why a clean tone sounds "in a room" versus "pasted on top of a track."

Large room reflections push a clean tone back and make it feel three-dimensional and ambient — which is why every previous version of this plugin defaulted there, and why Mayer's recorded cleans have that depth. A Small room pulls the tone forward, tightens the low end, and gives you more of a present, in-your-face clean that sits better in a dense mix or a loud stage.

You can do the same thing on a Helix, HX Stomp, or Quad Cortex right now, and most players never touch the control that does it:

- **On Helix / HX Stomp**, open the cab block parameters and look at **Early Reflections**. That is your room-size knob. Lower it to pull the tone forward and tighten it; raise it to push the cab back into a larger space. If you want to go further, run a dual-cab block with two mic distances — a close mic for body, a room mic for the reflections — and blend.
- **On Quad Cortex**, the cab and IR blocks do not expose early reflections as directly, so the move is to add a short **Room** or **Plate** reverb block set to a very low mix (under 15 percent) with a short pre-delay. That synthesizes the early-reflection layer the John Mayer X room-size control is giving you natively.

The lesson the update teaches, intentionally or not, is that the difference between a flat clean tone and a Mayer-grade clean tone is often not the amp or the IR. It is the 20 to 80 milliseconds of room sound sitting under the note. Most factory clean presets ship that dialed too far back, or missing entirely.

For full disclosure, I live in high-gain territory — my catalogued presets are Fortin models and tight Recto IRs, not Strat cleans. But the one tone I keep coming back to as a guilty pleasure is raw, room-mic'd sound, and this is the same principle wearing a cleaner suit. Reflections are reflections.

## The Rest of the Changelog, Briefly

The remaining 1.1.0 changes are housekeeping, but two are worth a note if you own the plugin:

- **Undo / Redo with an edit history.** This is the kind of quality-of-life feature I wish every hardware editor shipped with. Experiment freely; reverse cleanly.
- **Fixes:** improved Antelope Filter pedal accuracy, a corrected chirp noise on the Signature 83 amp, and a relabeled parameter on the Justa Boost (it now reads "Volume" instead of "Output," which is what it always did). If you noticed the Signature 83 chirp on high notes, it is gone.

## What This Means for You

If you own John Mayer X: update, then spend an hour loading the song presets one at a time and reading the chains rather than just playing them. That is where the value is.

If you do not own it and play hardware: the news here is free. The 14 presets confirm a signal-chain framework you can build today, and the room-size cab feature is a reminder to go find your early-reflections control and actually use it. That one change will get you closer to a believable clean tone than another amp model swap will.

## Dig Deeper on Fader & Knob

- Building the tone on hardware? Start with our [John Mayer clean tone settings guide](/blog/john-mayer-clean-tone-settings) — neck pickup, clean headroom, compressor-first, Tube Screamer as a boost.
- Deciding where to build it? Our [Helix vs. Quad Cortex](/blog/helix-vs-quad-cortex) comparison covers how each platform handles cab and room blocks.
- Want the captures-vs-models context for Neural DSP's amp engine? Our [Quad Cortex captures vs. models](/blog/quad-cortex-captures-vs-models) breakdown explains what you are actually loading.
