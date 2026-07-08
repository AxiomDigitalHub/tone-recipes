---
title: "FM9 Firmware 12.00 Goes Final And FM3 13.0 Hits Beta — Both Now Carry The Axe-Fx III 32.06 Amps"
date: "2026-07-08"
category: "firmware-update"
slug: "fm9-12-00-final-fm3-13-beta-32-06-amps"
excerpt: "On July 7 Fractal shipped FM9 firmware 12.00 as a final release and posted FM3 firmware 13.0 Beta 2. Both bring their platform up to Axe-Fx III 32.06 — which means the Brit JVM Crunch trio and the PVH 6160 Block Clean, plus the reworked power amp model from 32.04, are no longer III-only. If you own an FM9 or FM3 and skipped the Axe-Fx coverage because you don't own the flagship, everything in those three F&K breakdowns now applies to your unit."
source_url: "https://forum.fractalaudio.com/threads/fm9-firmware-version-12-0.221547/"
image_url: ""
author_slug: "viktor-kessler"
---

Two things happened in the Fractal camp on July 7, and they are the same thing viewed from two units. FM9 firmware 12.00 came out of beta and shipped as a final release. FM3 firmware 13.0 posted its second public beta. Both of them do the same job: they bring the smaller unit up to date with Axe-Fx III firmware 32.06.

I have written three separate pieces on what landed on the III across this firmware cycle — [the 32.04 power amp rework](/news/axe-fx-iii-32-04-power-amp-modeling), [the PVH 6160 Block Clean in 32.05](/news/axe-fx-iii-32-05-pvh-6160-block-clean), and [the Brit JVM Crunch trio in 32.06](/news/axe-fx-iii-32-06-brit-jvm-crunch). If you read those and then closed the tab because you own an FM9 or an FM3 and not the flagship, this is your reminder to go back and reopen them. As of yesterday, all of it is on your unit — or, for FM3 owners, about to be.

## What "up to 32.06" Actually Means On The FM9

FM9 firmware 12.00 final brings the FM9 up to Axe-Fx III release 32.0632p06 and runs DynaCabs 1.09. That version string matters because it tells you exactly which III snapshot you are inheriting. Two chunks of change are folded in here.

The first is the amp catalog. The FM9 now has the **Brit JVM Crunch Green, Orange, and Red** models captured from the Crunch channel of a Marshall JVM410, and the **PVH 6160 Block Clean**. That last one is the important one for anyone working in the 5150 lineage, because the Block Clean fills a gap that has been sitting open in the 6160 family — the clean-to-edge-of-breakup voicing that the higher-gain 6160 models never covered. There is also a housekeeping rename: the old Deluxe Tweed model is now "Deluxe Tweed Bright," with a Normal-channel version alongside it. Same physical amp, different input.

The second chunk is the one that changes sounds you already have: the **power amp rework** that first shipped on the III in 32.04. FM9 12.00 lists improved power amp modeling and improved preamp and power tube grid modeling. This is not a new-model addition you can ignore — it is a change to the model math under every amp block you already run. Existing presets are migrated automatically, but migrated does not mean unchanged. A preset that felt stiff at the breakup threshold under 11.x will feel slightly looser and more compressed under 12.00, because the power section now tracks pick attack less linearly. On high-gain models — the 6160 chain, the Recto-derived stuff, the Fortin-adjacent boutiques — this is the most audible. It is a better model. It is also a different one, and if you gig fixed setlists you re-A/B before you trust it.

There is also a genuinely useful bug fix: 12.00 corrects an interaction with FM9-Edit that was garbling some parameter text. Note that you need **FM9-Edit 1.03.21** (posted July 2) to run the final firmware — the editor is not optional here, it is the version that matches.

If any of that reads as familiar, it should — I covered the model math in detail when it hit the III in [the 32.04 breakdown](/news/axe-fx-iii-32-04-power-amp-modeling). The signal theory does not change because the box got smaller. The FM9's amp block runs the same algorithm the III does; the only thing the III has that the FM9 does not is DSP headroom for more simultaneous blocks. The tone of a single amp-plus-cab path is identical, which is exactly why a well-built Axe-Fx III amp-block setting transfers to an FM9 with the same parameter values and comes out sounding the same.

## FM3 Owners: You're One Beta Away

FM3 firmware 13.0 Beta 2, also posted July 7, brings the FM3 up to the same Axe-Fx III 32.06 baseline and also runs DynaCabs 1.09. Beta 2 specifically fixes the white-noise issue and the Mixer block problems that showed up in the previous beta, which is the normal beta cadence — the feature payload lands early, the following betas chase down the regressions it introduced. You will need the matching FM3-Edit to run it.

Because it is still beta, my advice for FM3 owners is the boring, correct one: if you play out, wait for final. If you are a bedroom or studio player who can afford to have a preset behave unexpectedly for a day, you can pull Beta 2 now and start living with the new power amp feel so it is not a surprise when 13.0 goes final. Either way, the amps you are getting are the same 32.06 set the FM9 just got — the Brit JVM Crunch trio and the PVH 6160 Block Clean — so the F&K coverage applies to you identically.

## Which F&K Settings To Reach For First

Here is the part that actually saves you time. The amp models are shared across the whole Fractal platform, so the amp-block parameter values in an Axe-Fx III recipe are drop-in on an FM9 or FM3 running matched firmware. That means:

- **If you play high-gain in the 5150/6160 world**, start with the PVH 6160 Block Clean as a *pedal-platform* rather than a lead channel. It takes a boost in front better than the higher-gain 6160 models because you are not already slamming the preamp — put an overdrive with the gain at zero and the level up ahead of it, and you get the tightening without the mud. The [32.05 write-up](/news/axe-fx-iii-32-05-pvh-6160-block-clean) has the reasoning on why the Block Clean sits where it does in the lineage.
- **If you want a Marshall-crunch rhythm tone**, the Brit JVM Crunch Orange is the middle-ground voicing of the three — Green is the darker/lower-gain end, Red the hottest. Dial the amp block, then let the cab do the rest; the [32.06 breakdown](/news/axe-fx-iii-32-06-brit-jvm-crunch) covers the Plex block behavior change that shipped alongside these, which matters if you use pitch effects.
- **Before you trust any migrated preset**, re-check your power amp settings against the new model. The reworked power section changed the feel of Master, Sag, and the transformer parameters. If you dialed those by ear under 11.x on an FM9, they will land differently under 12.00 — the [32.04 piece](/news/axe-fx-iii-32-04-power-amp-modeling) explains what the rework actually did so you know what you are re-adjusting toward.

The short version: Fractal did not give the FM9 and FM3 a lite version of 32.06. They gave them 32.06. The models are the models. If you have been treating the F&K Axe-Fx III firmware coverage as somebody else's news, it stopped being that yesterday.
