---
title: "HeadRush 5.1 Puts the Whole TONE3000 Library on the Touchscreen — Free, Native, No Computer. Here Are the Two Preset Habits to Break Before You Load a Capture"
date: "2026-08-03"
category: "firmware-update"
slug: "headrush-5-1-native-nam-tone3000-integration"
excerpt: "HeadRush Prime, Core, and Flex Prime now run Neural Amp Modeler files natively and browse TONE3000 straight from the touchscreen over Wi-Fi — no conversion, no desktop utility, no transfer shuffle. The update is free. The part nobody puts in the press release is what a capture does to the two blocks sitting on either side of it in your existing presets."
source_url: "https://www.inmusicbrands.com/press/tone-3000/"
image_url: ""
author_slug: "sean-nakamura"
---

HeadRush shipped firmware 5.1 on August 1. Prime, Core, and Flex Prime now load Neural Amp Modeler captures natively — as NAM files, not as a converted proprietary format — and they browse, search, preview, and download from TONE3000's library directly on the touchscreen over Wi-Fi. No computer in the chain. No conversion utility. No download-to-desktop-then-transfer step. It is free for everyone who already owns one of the three units.

I want to separate two things here, because the announcement blurs them and they have very different weights.

The first thing is the library access, which is genuinely a workflow change. TONE3000 hosts north of half a million community captures. Getting them onto a modeler has historically meant a laptop, a file browser, a conversion step, and a USB cable — which is exactly the friction point where "I'll try that capture later" turns into never. Deleting that step is real.

The second thing is the word *native*, and that one is doing more work than it looks like.

## Native Means Your Tones Don't Live in HeadRush's House

When a modeler "supports NAM" by converting the file into its own internal format, two things happen. The conversion is lossy in ways that vary by implementation, and — more durably — the resulting tone is now a HeadRush object, or a Valeton object, or whatever. It doesn't travel. HeadRush 5.1 runs the NAM file as a NAM file. A capture you like on a Flex Prime is byte-identical to the one running in the free NAM plugin on your laptop and the one on somebody's Blackstar.

That is the entire argument for the open format, and it is why I keep paying attention to this thread. [Dev covered NAM Architecture 2 when TONE3000 and Steve Atkinson released it on June 2](/news/tone3000-nam-architecture-2-a2-open-source-modeling) — the rebuilt open-source engine that out-scored Neural DSP's Neural Capture V2, IK's ToneX, and Line 6's Proxy in a 1,000-person MUSHRA blind test, published methodology and all. HeadRush was on the launch-partner list that day. So was Blackstar, who [shipped native A2 in the $130 Beam Solo five weeks later](/news/blackstar-beam-solo-native-nam-a2). This is the second launch partner to actually deliver, and it's the one aimed at people playing shows.

The A2 detail matters for a specific reason: A2-Lite exists so this can run on cheap embedded silicon at roughly 50% CPU on a $3 ARM chip. A Prime is not a $3 ARM chip. Which raises the question I'd want answered before I rebuilt a live setlist around this, and which nothing in the announcement addresses.

## The Question the Press Release Doesn't Answer: How Many

Neither the press release nor HeadRush's materials state how many NAM blocks you can run simultaneously, or what a capture costs against the DSP budget on each unit. Core and Flex Prime are documented at up to 14 blocks per rig; the Prime isn't specified in the announcement at all, and no source I can find puts a number on NAM-block cost.

So: unknown. I'm flagging it as unknown rather than guessing, because it's the difference between "swap your amp block for a capture" and "rebuild your dual-amp preset around one capture." If you run parallel amp paths — and my whole clean/high-gain split lives on that structure — this is the number that decides whether 5.1 changes your rig or just your amp block. Load one, watch your DSP meter, and you'll know more than the internet does right now.

## Habit One: Your Cab Block Is Probably About to Run Twice

Here's the trap that eats the first hour for everyone who loads a capture into an existing preset.

NAM captures on TONE3000 come in two broad flavors: amp-only (the capture stops at the speaker output, you supply the cab) and full-rig (the capture already includes a cab and mic). They are not labeled with any enforced consistency, because a global volunteer community made them.

Drop a full-rig capture into a preset that still has your cab or IR block switched on, and you are running two cabinets in series. It does not sound subtly off. It sounds like a blanket — all the top end gone above about 4k, honky in the low mids, and the instinct is to blame the capture. The capture is fine. You stacked two lowpass filters.

The fix is boring and it is the whole job: read what the capture is before you load it, and turn the cab block off for full-rig captures. If you've never had to do this deliberately, our [guide to disabling the cab block and rebuilding a preset for FRFR](/blog/disable-cab-ir-for-voiced-frfr-preset-rebuild) walks the whole sequence, and the [IR guide](/blog/impulse-response-ir-guide) covers pairing a cab to an amp-only capture. On a HeadRush going straight to FOH, this is the single highest-impact thing in this update.

## Habit Two: Every Capture Arrives at a Different Volume

Modeled amp blocks are voiced by a manufacturer to sit in a rough loudness neighborhood with each other. Captures are not. A NAM file is a snapshot of whatever the person who made it had the master and the input set to, and the spread between two captures of nominally the same amp can be enormous.

Practically, this means the moment you start swapping captures, your preset-to-preset level matching is void. You are no longer comparing tone — you are comparing volume, and louder wins every A/B you run. I've watched myself do this and reach the wrong conclusion about which capture I preferred more times than I'd like to write down.

Set a reference level, match every capture to it before you judge anything, and re-check the whole setlist before a gig. Our [preset level-matching guide](/blog/level-match-modeler-presets) has the method. If you keep any kind of preset log — I keep a sheet, this is not a secret — add a column for capture source and gain offset now, before you have forty of them and no idea which is which. Captures are unversioned files from strangers on the internet. Treat them like a dependency, because that's what they are.

## And Habit Zero: Know What You Actually Gained

A capture is a photograph of one amp at one setting. A model is a system you can turn knobs on. Trading your amp block for a capture buys you specificity and costs you range — the capture will not clean up the way the model does when you roll back your volume knob, because the nonlinearity you're asking for was never captured. That's not a knock on NAM, it's what a capture *is*, and the tradeoff is identical to the one I wrote up in [captures vs. models on the Quad Cortex](/blog/quad-cortex-captures-vs-models). All of that transfers here unchanged.

The move is not "replace all my amp blocks." The move is: keep the model where you need the knobs to work, use a capture where you need one exact sound to be exactly right.

## Where This Lands on the Price Ladder

Flex Prime is $499, Core is $699, Prime is $999 — and all three now pull from the same capture library as the free plugin and the $130 headphone amp. What you're buying as you go up that ladder is I/O, footswitches, DSP headroom, and screen. Not access to tones. That's a different product argument than the one modelers were making two years ago, and I don't think the mid-tier has finished repricing around it. Flex Prime specifically now looks different against everything in our [best modeler under $500 roundup](/blog/best-modeler-under-500).

One caveat worth stating plainly: the announcement names Prime, Core, and Flex Prime. The older Eleven HD–engine boxes — Pedalboard, Gigboard, MX5 — are not on the list. If you own one of those, nothing here is for you today, and I wouldn't assume it's coming.

## What I'd Actually Do This Week

If you own one of the three units: update, then load exactly one capture of an amp you already have a preset for. Same guitar, same monitoring, cab block handled correctly, levels matched. One variable. You'll learn more in twenty minutes of that than in a weekend of downloading four hundred captures you'll never audition.

The library is not the hard part anymore — HeadRush just made the library free and instant. The hard part is still the two blocks on either side of it, and firmware doesn't fix those.

*HeadRush 5.1 is available now, free, over Wi-Fi for Prime, Core, and Flex Prime. Details in [HeadRush's announcement](https://www.inmusicbrands.com/press/tone-3000/) and [TONE3000's writeup](https://www.tone3000.com/blog/headrush-nam-tone3000).*

## Dig Deeper on Fader & Knob

- [Disabling the cab block and rebuilding for FRFR](/blog/disable-cab-ir-for-voiced-frfr-preset-rebuild) — required reading before you load a full-rig capture.
- [Impulse response guide](/blog/impulse-response-ir-guide) — pairing a cab to an amp-only capture.
- [Level-matching modeler presets](/blog/level-match-modeler-presets) — the method that keeps capture A/Bs honest.
- [Captures vs. models](/blog/quad-cortex-captures-vs-models) — what you trade away when you swap a model for a snapshot.
- [Best modeler under $500](/blog/best-modeler-under-500) — where Flex Prime sits now.
