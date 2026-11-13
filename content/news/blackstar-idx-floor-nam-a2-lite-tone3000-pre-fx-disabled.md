---
title: "Blackstar ID:X Floor Gets Native NAM A2-Lite — but Your Pre-Amp FX Switch Off When a Capture Loads"
date: "2026-11-13"
category: "firmware-update"
slug: "blackstar-idx-floor-nam-a2-lite-tone3000-pre-fx-disabled"
excerpt: "A free firmware update announced November 12 brings native NAM A2-Lite playback and in-app TONE3000 browsing to all three Blackstar ID:X Floor units, the One, Two, and Three (about €179–€275 at Thomann). Each unit holds up to 24 captures, and only Amp + Cab captures are supported for now. The fine print matters: when a NAM capture is active, the pre FX section is disabled, so any drive or compressor you had in front of the amp drops out. Here's how to build patches around that."
source_url: "https://www.tone3000.com/blog/blackstar-idx-floor-nam-a2"
image_url: ""
author_slug: "jess-kowalski"
---

Blackstar has pushed a free firmware update that lets its ID:X Floor One, Two, and Three run Neural Amp Modeler A2-Lite captures natively. TONE3000 announced it on November 12. You plug the unit into a Mac or PC over USB, update Architect (Blackstar's editor), accept the firmware prompt, and the amp menu in Architect gets a TONE3000 option. Sign in with a free TONE3000 account, pick an Amp + Cab capture, and it loads straight onto the floorboard. Save it to a patch to keep it after you disconnect.

There's no conversion step and no proprietary Blackstar format. The file on the board is the same NAM file everyone else trades. That's the same deal [Blackstar gave the $130 Beam Solo headphone amp back in July](/news/blackstar-beam-solo-native-nam-a2), and it's now on boards with footswitches, which is the part that matters to anyone gigging one.

## The numbers

- **Captures:** up to 24 stored on the unit at once, alongside the stock amp models
- **Patches:** about 100 (Blackstar documents 99 locations across 33 banks)
- **Capture type:** Amp + Cab only for now, so the amp, cab, and mic arrive in one file
- **Engine:** A2-Lite, the hardware-friendly version of [NAM's Architecture 2](/news/tone3000-nam-architecture-2-a2-open-source-modeling)
- **Price:** free for owners. Thomann lists the boards at €179 (One), €209 (Two), and €275 (Three) as of this week

For context, the stock ID:X Floor already ships with 12 electric amp models (six Blackstar designs, six recreations), selectable EL84/EL34/6L6 power-tube responses, Blackstar's ISF tone control, 35+ effects, and CabRig IR speaker simulation. NAM doesn't replace any of that. It adds 24 slots of anything from the community library on top.

## The catch: pre FX goes dark

Both TONE3000's write-up and Noise Harmony's coverage say the same thing: **when a NAM capture is active, the pre FX section is disabled.** On the ID:X Floor, pre FX is where a boost, overdrive, or compressor sits in front of the amp. If your current patch is a Tube Screamer-style drive into a Blackstar high-gain model, swap the amp for a capture and the drive drops out. The patch gets looser and flabbier, and you'll think the capture is bad when it isn't.

Three ways to build around it:

1. **Pick captures that already have the push baked in.** TONE3000 is full of captures made with a boost or overdrive in front of the amp. Look for that in the capture name or description. With pre FX gone, the gain staging has to live inside the file.
2. **Move your compressor after the amp.** Post-amp compression is a legitimate move, not a compromise. It evens out volume rather than feeding the amp a hotter, flatter signal. We cover the tradeoffs in our [compressor placement guide](/blog/compressor-placement-modeler-preset-pre-amp-post-amp).
3. **Put a real pedal in front of the board.** A $40 drive into the ID:X input does what the pre FX block can't while a capture is loaded.

Amp + Cab-only support has a consequence too. The mic and cab are part of the capture, so CabRig isn't doing the speaker work on those patches. If a capture sounds fizzy or boxy, swapping the IR won't fix it. Swap the capture, or use a post-amp EQ to cut the harsh top end. Our [guide to fixing a thin modeler tone](/blog/fix-thin-modeler-tone) covers the EQ moves.

## Where it lands

The ID:X Floor joins a crowded field of budget boards with native NAM, including [Mooer's GE100 Pro](/news/mooer-ge100-pro-ai-modeler-under-100), [Valeton's GP-150 and GP-180](/news/valeton-gp-150-gp-180-nam-support), and [Zoom's Neurig](/news/zoom-neurig-nam-a2-lite-dna-engine-300-modeler). At the budget end, being able to load captures has stopped being a selling point. Every board can do it. What separates them is what the rest of the board does while a capture is loaded. Blackstar's answer is that the effects before the amp switch off, and that's worth knowing before you buy one for NAM. If you already own one, it's a free update with no downside. Just rebuild your high-gain patches with options 1 through 3 in mind.

Nobody has published a careful evaluation of how A2-Lite captures feel on ID:X Floor hardware yet, and Blackstar hasn't posted a firmware version number. If you're shopping, our [best modeler under $500 roundup](/blog/best-modeler-under-500) has the wider field.
