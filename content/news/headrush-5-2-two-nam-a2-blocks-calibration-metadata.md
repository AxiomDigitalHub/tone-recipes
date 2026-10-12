---
title: "HeadRush 5.2 Answers the Question 5.1 Left Open: Two NAM A2 Full Captures Per Rig, Four Lite. Here's How to Spend Them Without Building a Phase Problem"
date: "2026-10-12"
category: "firmware-update"
slug: "headrush-5-2-two-nam-a2-blocks-calibration-metadata"
excerpt: "Free firmware 5.2 for HeadRush Prime, Core, and Flex Prime lifts the one-capture-per-rig ceiling: two NAM A2 Full files or four A2 Lite files, plus Stereo and Switch Doubling and A2 calibration metadata for gain matching. That turns a capture from an amp-block swap into a dual-amp rig, which means the phase and level habits you already use on modeled dual-amp presets now apply to captures too."
source_url: "https://mixdownmag.com.au/news/new-firmware-update-from-headrush/"
image_url: ""
author_slug: "sean-nakamura"
---

HeadRush released firmware 5.2 for Prime, Core, and Flex Prime last week. It's free, it installs over Wi-Fi or USB, and HeadRush's release notes give it a release date of October 2026. Mixdown reported it on October 9. Almost the whole changelog is about Neural Amp Modeler.

When [5.1 brought native NAM and on-device TONE3000 browsing in August](/news/headrush-5-1-native-nam-tone3000-integration), I flagged one thing as unknown: how many captures a rig could run. That number decides whether NAM changes your rig or only your amp block. The 5.1 release notes did answer it, but quietly, and the answer was one: a single NAM A2 (Full or Lite) or A1 file per rig. 5.2 raises that limit, and the new limit is the real story.

## What 5.2 Actually Changes

From HeadRush's own 5.2.0 release notes:

- **Up to 2 NAM A2 Full files per rig, loaded natively without conversion.** You can do it with two separate NAM A2 blocks, or with Stereo Doubling or Switch Doubling inside a single A2 block.
- **Up to 4 NAM A2 Lite files per rig,** using Stereo or Switch Doubling across two A2 blocks.
- **NAM A2 Calibration Metadata support.** The unit now honors the input and output levels stored when a compatible capture was made, which HeadRush says improves gain matching.
- **Fixes:** NAM files could get unintended EQ when previewed through TONE3000 on the device. NAM A1 files didn't appear in TONE3000 unless specific filters were set. Switching Scenes or Rigs that contain NAM files could cause a delay or a burst of noise. There was also rare noise on USB audio with some DAWs, plus a CPU-reporting glitch with NAM files.

Per Mixdown, Stereo Doubling sends two NAM amps to separate outputs, and Switch Doubling flips between two captures without a preset change or a gap in sound.

The A1 limit doesn't appear to change. The multi-capture limits apply only to A2 files, so if your favorite capture is an older A1 file, it still runs one per rig. That's one more reason to check which architecture a TONE3000 capture uses before you design a rig around it. [Dev's A2 explainer](/news/tone3000-nam-architecture-2-a2-open-source-modeling) covers why the Full/Lite split exists at all.

## The Scene-Switch Fix Is the Quiet Headline for Gigging Players

I'd take the fourth bullet over the first two if I had to choose. Under 5.1, a delay or a burst of noise when switching Scenes or Rigs that contain NAM files was a known issue. A capture rig that clicks or gaps on a scene change can't go in a setlist, however good the capture sounds. If you tried 5.1 captures, heard that, and went back to modeled amps for live use, retest after updating. Treat it as a new variable rather than assuming it's fixed. Run your actual setlist's scene changes at gig volume before you trust it.

## Two Captures in One Rig Is a Dual-Amp Preset, With Dual-Amp Problems

Most people will reach for this first: one capture panned left, another panned right, both active, a huge wall. That's Stereo Doubling, and it works the same way a modeled dual-amp preset works, including the parts that go wrong.

**Phase.** Two captures of different amps (or the same amp with different mics baked in, if they're full-rig captures) won't line up in time or phase. Stereo hides that in headphones. The moment FOH sums the board to mono, or a venue runs mono, you get comb filtering and a thinned-out midrange that sounds like a bad capture. It isn't one. HeadRush added a Phase Invert parameter to Advanced Block Edit back in 5.1, and this is exactly what it's for. Our [phase cancellation guide for dual-amp modeler presets](/blog/phase-cancellation-dual-amp-modeler-presets) walks through the check: sum to mono, flip one side, and keep whichever version keeps the low mids.

**Mono survival.** If your stereo spread depends on two different captures being different, test it collapsed. The [stereo width tricks that survive mono](/blog/stereo-width-tricks-that-survive-mono) piece is the checklist I use. If you need to plan where the split sits in the chain, [stereo signal chain architecture](/blog/stereo-signal-chain-architecture) covers it.

**Cabs, twice over.** The habit from 5.1 still applies, now with two chances to get it wrong. A full-rig capture already has a cab and mic in it. If you pair it with an amp-only capture, one side needs a cab or IR and the other must not have one. Mixed capture types in one rig is the new easiest way to build a preset where one side sounds like a blanket. The [cab-block/FRFR rebuild guide](/blog/disable-cab-ir-for-voiced-frfr-preset-rebuild) and the [IR guide](/blog/impulse-response-ir-guide) cover both halves.

## Switch Doubling Is the One I'd Actually Build Around

Stereo Doubling gets the YouTube thumbnails. Switch Doubling is the more useful structure for most people playing a live set.

Two captures in one block, with a gapless switch between them, gives you a clean capture and a drive capture under one footswitch without a rig change. The alternative is a capture that you push harder with a front-end boost. That's what a single NAM capture always forced on you, because a capture is a snapshot at one gain setting and won't clean up like a model does when you roll back the volume knob. ([Captures vs. models](/blog/quad-cortex-captures-vs-models) covers that tradeoff, and it still holds here.) 5.2 doesn't make captures dynamic. It lets you carry two snapshots and swap between them cleanly. For worship or cover sets, where the job is verse-clean and chorus-crunch on the same amp voice, that maps directly onto how the set is structured.

If you go this route, use two captures of the **same amp** at different gain settings, from the same capture author if possible. Same amp means the EQ voice stays consistent across the switch, and the only thing that changes is the gain. That's what you want.

## Calibration Metadata Helps, but Doesn't Replace Level-Matching

In my 5.1 write-up, the second habit to break was that every capture arrives at a different volume. Calibration metadata is HeadRush's answer. The unit reads the input and output levels the capture creator stored and gain-stages accordingly.

Two caveats before you delete your level-matching step:

1. **It only applies to compatible captures.** Per the release notes, it covers levels "stored during the creation of compatible captures." Older captures and captures made without that data won't benefit. TONE3000's library is built by volunteers and isn't consistently labeled, so assume a capture has no metadata until you've confirmed it does.
2. **Matched input level isn't matched perceived loudness.** Correct input calibration means the capture sees the gain it was built for. That makes the capture more faithful, which is good. Two faithful captures can still play back at very different perceived levels, and on Switch Doubling that difference becomes an audible jump at the switch.

So the workflow stays the same: pick a reference, match every capture to it by ear at gig volume, and log the offset. The [preset level-matching guide](/blog/level-match-modeler-presets) has the method. Calibration metadata should mean fewer captures arrive wildly off, not that you can skip the check.

## Where This Leaves the Price Ladder

In August I said that once Flex Prime ($499), Core ($699), and Prime ($999) all pull from the same capture library, you're paying for I/O, switches, DSP, and screen as you move up, not for tones. 5.2 reinforces that. All three get the same two-Full/four-Lite ceiling in the same free update. A Flex Prime now runs a two-capture switching rig with no conversion step, which changes how it compares against everything in our [best modeler under $500 roundup](/blog/best-modeler-under-500). The older Eleven HD boxes (Pedalboard, Gigboard, MX5) still aren't on the update list.

## What I'd Do This Week

Update, then build exactly one rig: two A2 Full captures of the same amp, clean and driven, in a single block on Switch Doubling. Run your scene changes at volume to confirm the 5.1 noise is gone, match the two levels, and then try the stereo version with a mono-sum check. Two variables, tested one at a time. It's the same discipline as last time with twice as many captures.

*HeadRush 5.2.0 is a free update for Prime, Core, and Flex Prime, available over Wi-Fi or from [HeadRush's downloads page](https://www.headrushfx.com/downloads.html). Release coverage via [Mixdown](https://mixdownmag.com.au/news/new-firmware-update-from-headrush/).*

## Dig Deeper on Fader & Knob

- [HeadRush 5.1: native NAM + TONE3000](/news/headrush-5-1-native-nam-tone3000-integration): the update this one builds on.
- [Phase cancellation in dual-amp modeler presets](/blog/phase-cancellation-dual-amp-modeler-presets): required before you run two captures in stereo.
- [Stereo width tricks that survive mono](/blog/stereo-width-tricks-that-survive-mono): the FOH-sum check.
- [Level-matching modeler presets](/blog/level-match-modeler-presets): still necessary with calibration metadata.
- [Captures vs. models](/blog/quad-cortex-captures-vs-models): why two snapshots don't make one dynamic amp.
