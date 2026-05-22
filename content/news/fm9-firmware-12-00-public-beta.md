---
title: "FM9 Firmware 12.00 Hits Public Beta — Catches Up To Axe-Fx III 32.04"
date: "2026-05-21"
category: "firmware-update"
slug: "fm9-firmware-12-00-public-beta"
excerpt: "Fractal pushed FM9 firmware 12.00 to public beta on May 4 and followed with Beta 3 about ten days later. The headline is parity with Axe-Fx III 32.04 — the reworked power amp model and the catalog re-analysis are now on the FM9. New DRIVE block additions include a 'Swedish Metal' layout and an Oversampling control. DynaCabs jumps to 1.09."
source_url: "https://forum.fractalaudio.com/threads/fm9-firmware-12-00-beta-2.220468/"
image_url: ""
author_slug: "viktor-kessler"
---

When the Axe-Fx III 32.04 release notes landed on April 24, the line that mattered for FM9 owners was the one about FM9 being in private beta. As of May 4, that beta is public — FM9 firmware 12.00 Beta 2 — and Beta 3 followed about ten days later with the usual round of bug-bounce corrections. If you skipped 32.04 on the III because you do not own one, you now get to live through the same model migration on the FM9.

This is not a small update. It is the FM9 catching up to the most significant amp-modeling change Fractal has shipped in this firmware cycle, and the same caveats apply: your existing presets are going to sound different.

## What 12.00 Brings Over From The Axe-Fx III

FM9 firmware 12.00 is, by Fractal's own description in the release notes, the FM9 brought up to date with Axe-Fx III firmware 32.04. That means the reworked power amp model and the re-analyzed amp catalog from 32.03 and 32.04 are now both present on the FM9. Many of the existing amp models have been updated with new preamp bias and cathode-follower values to improve dynamic response, and frequency response has been refined across the catalog using the same new analysis techniques the III line received.

What this sounds like in practice: amps respond more correctly at the breakup threshold and just past it. The power section feels slightly looser and more compressed when you dig in, instead of tracking pick attack with that mechanical linearity that gives a modeled high-gain amp away. On the higher-gain models — the 5150-derived stuff, the Recto chain, the modern boutiques — this is the most audible change. If a preset that previously felt stiff now feels a little more open, you are not imagining it. That is the new model talking.

Existing presets are migrated automatically when you load them under 12.00, with new default values applied to advanced amp block parameters. So when you open a 11.x preset under 12.00, it is the same preset on paper but a different sound coming out. Plan to re-A/B everything that matters before you commit.

DynaCabs gets a bump to version 1.09 as part of the update.

## New Drive Block Additions Worth Knowing About

There are real feature additions in the DRIVE block, not just modeling refinements. Two of them are worth flagging:

**A new "Swedish Metal" layout** in the DRIVE block. Fractal is not naming names here, but the genre signal is hard to miss. If you have been running a tube-screamer-in-front workflow to tighten a 5150 or a Fortin model, the Swedish Metal layout is going to overlap with what you are already trying to dial in — except it is doing it as a dedicated DRIVE block layout rather than a generic boost with the gain at zero.

**An Oversampling control** added to the DRIVE block. This matters for clean drive headroom and for reducing the kind of aliasing that creeps in when you hit a drive model hard with bright pickups. Higher oversampling costs CPU but cleans up the top end on bright, gainy patches. On the FM9, where CPU budget is a live concern on dense presets, this is now a per-block decision instead of a fixed setting.

The DELAY block also picks up a **Dry Diffusion control**, the MIXER block gets new Delay controls, and the CHORUS block layouts have been updated. None of those are headline features but they are the kind of small refinements that compound over a session of dialing in.

## The Bug Fixes That Actually Matter

A handful of fixes in 12.00 are worth specifically calling out because they affect tones people are actively using.

**Crash on amp models at Gain 10.** Some amp models could crash the unit when Gain was set to maximum. If you have been keeping certain high-gain models at 9.5 because 10 was unreliable, you can stop doing that. The crash is fixed.

**Supertweed blocking distortion.** The Supertweed model had excessive blocking distortion — the chunky, gated artifact you get when an overdriven tube stage cannot recover between cycles. That has been corrected. If you use the Supertweed and felt it was choking out on chord work, try it again under 12.00.

**Input EQ with Definition at 0.0.** The amp block's Input EQ was not working when Definition was set to 0.0. That is a niche but real bug — Definition at 0.0 is a legitimate setting if you are trying to keep an amp's own voicing dominant — and it now works correctly.

**Excessive aliasing when overdriving the Amp block input.** Some amp models would produce more aliasing than they should when the Amp block input was being driven hard. Fixed. This is in the same territory as the new DRIVE block Oversampling control — Fractal is tightening up aliasing behavior across the high-gain signal path.

Beta 3 added a fix for the JS410 amps, which were not working correctly in Beta 2, and corrected the Delay Diffusion Time so it now sounds right at 100%.

## How To Approach The Update

This is a public beta, not the final release, but Fractal's public betas on this firmware line have been stable in practice. The risk is not crashes; the risk is that you load a preset you trust and it sounds different than you remember.

The pragmatic workflow:

1. **Back up everything before you update.** Pull a full backup with FM9-Edit (1.03.20 or later for Beta 2 support). If you do not like what 12.00 does to a specific preset, you can roll back the preset without rolling back the firmware.
2. **Update presets in passes.** Load each preset, listen at performance volume, adjust the amp block parameters that have migrated to new defaults. The most common adjustments will be on Master Volume, Sag, and Bias on the higher-gain models — those are where the new power amp model is doing the most work.
3. **Re-evaluate your Drive block chains.** If you have been using a generic boost in front of an amp, audition the Swedish Metal DRIVE block layout against your current chain. It may simplify the block count on your dense presets.
4. **Turn on Oversampling on bright, gainy DRIVE blocks.** Listen for top-end smoothness. If you cannot hear a difference, turn it back off to save CPU. If you can, leave it on.

The FM3 is next in the rollout sequence, per the same release pattern Fractal has followed all cycle: III first, FM9 second, FM3 third. If you are on FM3, expect this same modeling overhaul to land for you in the next several weeks.
