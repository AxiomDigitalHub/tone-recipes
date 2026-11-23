---
title: "Mooer's Future Flex Is a $209 Battery Modeler With Built-In Stereo Speakers and NAM A2. The Speakers Are the Part That Changes How You Dial It"
seo_title: "Mooer Future Flex: $209 Speaker Modeler With NAM A2"
date: "2026-11-23"
category: "new-gear"
slug: "mooer-future-flex-209-battery-modeler-stereo-speakers-nam-a2"
excerpt: "Mooer's Future Flex puts 55 amps, 69 effects, four footswitches, a six-hour battery, an XLR mic input with phantom power and a pair of 2.2-inch speakers in one 1.2 kg box. Guitar World reports $209; it isn't on Mooer's own site yet. NAM A2 is in via TONE3000, with the exact loading method still unclear. Here's what to check before you buy and how to build presets for a unit you'll hear through three very different outputs."
source_url: "https://www.guitarworld.com/gear/amp-modeler-pedals/mooer-future-flex"
image_url: ""
author_slug: "jess-kowalski"
---

Mooer has a new modeler called the Future Flex, and the short version is that it's a floor unit with its own speakers. Four footswitches, 55 amp models, 69 effects, a battery, and a pair of 2.2-inch drivers pushing 15 watts in stereo. Guitar World reported it on November 21 at **$209, available now**, in Snowfall White and Phantom Black.

I'd hold that price loosely for a few days. Guitar Radar's write-up quotes £199 for the UK and says an official US price hasn't been confirmed, and it puts the original announcement in China on November 19. As of today the Future Flex isn't listed on Mooer's international site. So: real product, two outlets reporting it, price not yet pinned to a Mooer page.

## What's Reported So Far

- **Models:** 55 amps, 69 effects
- **Control:** four footswitches, a 1.28-inch round touchscreen, and a companion mobile app for full editing
- **Speakers:** dual 2.2-inch, 15 W stereo
- **Mic input:** XLR with 48 V phantom power
- **Storage:** 80 preset slots, 10 slots for third-party impulse responses
- **NAM:** A2 compatibility through the TONE3000 library
- **AI:** tone-from-text that builds an effects chain from a prompt, plus stem separation (the same tech as Mooer's StemLab)
- **Extras:** drum machine, looper
- **Battery:** up to six hours, about 2.5 hours to charge over USB-C
- **Size:** 396 × 178 × 179 mm, 1.2 kg

What nobody has reported yet is the full I/O. Guitar World says recording into a DAW is easy and Guitar Radar says external connections let it sit in a bigger rig, but neither one lists a headphone out, line outs, USB audio spec, or Bluetooth. That list decides whether this is a practice toy or a gig tool, so it's the first thing I'd look up when the manual lands.

## The NAM Question to Settle Before You Buy

Mooer already loads NAM on the [$96 GE100 Pro](/news/mooer-ge100-pro-ai-modeler-under-100), so NAM on a $209 box isn't a surprise. What's unclear is how. Guitar World says A2 integration gives you thousands of amp models through TONE3000. Guitar Radar describes it as a "conversion workflow." Those aren't the same thing. Native loading means the unit runs the capture as its author made it. Conversion means something gets translated on the way in, and you want to hear the result before trusting it.

Two things to check once real documentation exists:

1. **Which A2 flavor it runs.** Dev explained the split in our [A2 explainer](/news/tone3000-nam-architecture-2-a2-open-source-modeling): A2 Lite exists for cheap embedded chips, A2 Full wants more processing. On a battery unit at this price, Lite is the likely answer, and it's a fine one. But TONE3000 files aren't consistently labeled, which is the same catch we flagged on the [Zoom Neurig](/news/zoom-neurig-nam-a2-lite-dna-engine-300-modeler) and the [HeadRush 5.x updates](/news/headrush-5-2-two-nam-a2-blocks-calibration-metadata). Check the file type before you build a preset around a capture.
2. **Whether a capture is amp-only or full-rig.** Most NAM captures are the amp with no cab. Those need an impulse response after them, and you get ten third-party IR slots here. Ten is tight. Pick two or three cabs you actually like and stop there. Our [IR guide](/blog/impulse-response-ir-guide) covers how to choose them. If a capture already includes the cab and mic, turn the unit's cab block off or you're stacking two cabs and it'll sound like a blanket over the amp.

## The Speakers Change How You Build Presets

This is the bit a spec sheet won't tell you. A Future Flex preset can come out of three places: its own 2.2-inch speakers, headphones (assuming it has an output for them), and a PA or interface. Those will not sound alike, and a preset dialed on one will be wrong on the others.

A 2.2-inch driver can't move enough air to reproduce much below the low mids. A low E on a guitar is about 82 Hz, and a speaker that size is rolling off well above that. So when you dial by ear through the built-in speakers, you'll do what everybody does: crank the bass and add gain to get the weight back. Then you plug the same preset into a PA and it's boomy mud with too much fizz.

That's the same trap as [dialing in headphones and then playing in a room](/blog/tone-good-in-headphones-bad-in-room), just pointed the other way. The fix is boring and it works:

- **Keep two copies of anything you'll use out.** One voiced for the onboard speakers, one for direct. You have 80 slots. Spend them.
- **On the direct copy, start with the amp's bass around noon, not where the small speakers made you put it.** If the unit gives you cab or global EQ cuts, a low cut around 80–100 Hz and a high cut around 6–8 kHz is a sane starting point for going into a PA. Adjust from there with the band playing.
- **Back the gain off on the direct copy.** Small speakers hide fizz. A full-range system doesn't. Take a notch or two off whatever sounded right on the built-ins.
- **Level-match the two copies** so switching between them doesn't jump. Our [preset level-matching guide](/blog/level-match-modeler-presets) has the method.

None of this is specific to Mooer. It applies to any modeler with its own speakers, and it's why I tell people with desktop modeling amps not to copy their bedroom presets straight to a gig.

## Who It's For

I run a Jazzmaster into an HX Stomp and go direct, so I'm not the target here. The target is somebody who'd otherwise buy a small practice amp and a multi-effects unit separately. Our [practice amp comparison](/blog/practice-amps-mustang-spark-hx-stomp) covers the usual picks, and the Future Flex lands in that conversation with footswitches attached, which most of them don't have.

The XLR input with phantom power is the feature I'd watch. A battery box that takes a guitar and a condenser mic and makes noise on its own is a busking rig, or a living-room songwriting rig, or what you bring to a small-group rehearsal where nobody wants to haul a PA. Fifteen watts through two small speakers won't carry a room with a drummer in it. For a quiet set, it might be enough. That depends on how loud it gets before the speakers give up, and no one has measured that yet.

On the AI tone prompts, my view hasn't moved since the GE100 Pro: they're useful if they get a beginner into the right neighborhood faster than scrolling presets, and they're not a substitute for learning what the knobs do. We have a piece on [how these tools differ under the hood](/blog/how-ai-tone-tools-differ-generator-vs-retrieval) if you want the longer version. The stem separator is the one I'd use. Pulling the guitar out of a track and playing over what's left is good practice, and having it in the same box you practice through removes a step.

## Should You Buy One Now

Not yet, and not because anything looks wrong. Three facts are still open: the confirmed US price, the output list, and how NAM files get in. Each of them changes what this thing is good for. If you need a cheap modeler this week, the [sub-$500 roundup](/blog/best-modeler-under-500) has units with known answers to all three. If you can wait for the manual and a couple of honest demos through a real PA, the Future Flex could be the cheapest way to get a modeler, a practice speaker and a mic channel in one battery-powered box. I'd want to hear it direct before I believed it.
