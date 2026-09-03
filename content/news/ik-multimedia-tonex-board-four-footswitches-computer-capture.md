---
title: "IK's $999 TONEX Board Has Four Footswitches — and Still Can't Capture Without a Computer"
date: "2026-09-03"
category: "new-gear"
slug: "ik-multimedia-tonex-board-four-footswitches-computer-capture"
excerpt: "The TONEX Board shipped today at $999.99: 5-inch touchscreen, 2,000 Tone Models, four per preset, 76 effects, 12 slots, dual signal paths. Two numbers define it and neither is the price. Four footswitches, against eleven on a Quad Cortex and twelve on a Stadium XL. And capture still happens on a computer, at the exact moment both of its rivals moved capture onto the box."
source_url: "https://www.ikmultimedia.com/news/?item_id=19751"
image_url: ""
author_slug: "dev-okonkwo"
---

IK Multimedia launched the **TONEX Board** today — its first full-size floor modeler, **$999.99 / £999 / €1,099**, available now.

The spec sheet is not the problem. A 5-inch color touchscreen, six push-rotary encoders, 2,000 premium Tone Models onboard with the 60,000-plus ToneNET library behind them, up to four Tone Models per preset, 76 effects across nine categories with up to 12 slots per preset, two independent signal paths, VIR cabinet modeling plus custom IR loading, 1,440 preset slots across 12 setlists, dual stereo FX loops for full four-cable-method work, 5-pin MIDI in and out, two expression jacks, XLR and TRS output pairs. That is a real modeler. On paper it belongs in the room with the Helix Stadium, the Quad Cortex, and the Tone Master Pro.

Two things on that sheet are worth thinking about harder than the rest, and the coverage today is mostly arguing about the price instead.

## Four Footswitches

The TONEX Board has four footswitches.

The Quad Cortex has eleven. The Helix Stadium XL has twelve. The Fender Tone Master Pro has ten. Those units cost more, and there is a defensible argument that the Board is priced where it is precisely because IK spent the money on the DSP and the screen instead of the chassis real estate.

But footswitch count is not a comfort feature. It is the hard limit on how many state changes you can make with your feet inside one song, and it is the single spec that decides whether a preset architecture that works on one board transfers to another. I want to be careful here, because I am the wrong person to be annoyed by this. I have never played a live gig. My rig is a Squier into a Focusrite into Ableton, and the number of times I have needed to change a sound with my foot in the last year is zero. If anything, four switches and a big touchscreen describes exactly how I would use a modeler.

Which is why it is worth saying plainly rather than defensively: if you are coming from a Helix or a Cortex, your preset layouts do not port. Not conceptually — literally. A Helix snapshot page or a QC Stomp-mode row assumes eight or more assignable switches on the floor. The Board gives you four, in Preset, Scene, or Stomp mode, and you choose which mode a given preset lives in.

The practical consequence is that the Board pushes you toward **Scene-style** building rather than stomp-style building. Instead of one switch per effect, you build three or four complete states — clean verse, driven chorus, lead, ambient — and step between them. That is the same architecture as [Helix snapshots](/blog/helix-worship-snapshots-sunday-morning) and [Quad Cortex scenes](/blog/quad-cortex-scenes-vs-stomp-mode), and if you already build that way, four switches is genuinely enough for most songs. If you build stomp-style, where every drive and delay has its own switch and you combine them live, four switches is not enough and no firmware update will make it enough. Budget for an external MIDI controller in that case; the 5-pin DIN is there for exactly this, and it changes the real cost of the board.

## The Capture Asymmetry

The second number is zero: the number of amps you can capture with the TONEX Board by itself.

TONEX Board ships with TONEX Modeler, TONEX, AmpliTube 5 MAX, and the TONEX Board Editor. Modeler is the capture tool, and it runs on a computer. You connect the amp to an audio interface, train a model, and then move that model to the board with the editor. That is the same workflow TONEX has always had, and it is a good workflow — training is fast, the results are strong, and IK's AI Machine Modeling is the reason anybody cares about this ecosystem in the first place.

The timing is what makes it awkward. The Quad Cortex has captured on the device since launch — you plug the amp into the box, it runs the process itself, and the capture exists in your presets minutes later. And Line 6's Proxy engine — introduced on Helix Stadium in firmware 1.3 in March and [sharpened again in 1.10](/news/helix-stadium-firmware-1-10-new-amps) days later — is cloud-assisted rather than computer-assisted: the Stadium does the sending, Line 6's servers do the math, no laptop in the chain either.

So at $999 in September 2026, the TONEX Board is the modeler in its class where capturing your own amp means bringing a computer and an interface. If you are a studio player who was going to do this at a desk anyway, that is not a downgrade — the desktop workflow is arguably better, because you can audition and retrain without hunching over a floorboard. If you were imagining walking into a rehearsal room with a borrowed head and coming out with a model, that is the thing this box does not do.

Worth understanding the distinction underneath all three of these before you decide it matters: a capture and a model are [not the same object](/blog/quad-cortex-captures-vs-models), and most players who think they need on-device capture actually need a better search of somebody else's library.

## What This Means for Your Presets

If you already have a TONEX library — ONE, ONE+, TONEX Pedal, or just the software — everything transfers. The Tone Models are the same format. The board's editor pushes them over. That continuity is the real argument for the Board over a platform switch, and it is not a small one.

Three things change when those models land on a floorboard instead of a pedal or a plugin:

**You now have four models per preset instead of one.** Two per path, four across split paths. That opens the dual-amp and wet/dry builds you could not do on a ONE — clean model and driven model running in parallel, blended, rather than one model doing both jobs at a compromise gain setting. If you have been running a single mid-gain capture and rolling your volume knob to get clean, stop doing that on this box. Build the clean model as its own path.

**Levels will not match.** Tone Models are captured at whatever level the person capturing them chose, and stacking four of them in one preset makes that inconsistency audible in a way a single-model pedal never did. Do the [level-matching pass](/blog/level-match-modeler-presets) before you build anything you care about — set one model as your reference, match the others to it at the output stage, then start adding effects.

**The 12 effect slots are AmpliTube effects, not TONEX effects.** Fifty-one of the 76 come from AmpliTube 5, which means the drive pedals in front of your Tone Model are software emulations of pedals, hitting a machine-learned capture of an amp. That stack behaves like the real thing more than you would expect, but the [Tube Screamer-into-high-gain rules](/blog/tube-screamer-before-high-gain-amp) still apply and they matter more here: your Tone Model already has its own gain staging baked in at the level the amp was captured. A drive block in front is pushing an amp that is already set where it is set. Start with the drive's level at unity and its gain low, and let the capture do the distorting.

## The USB Caveat

The 4-in/2-out USB audio interface is listed as coming in a firmware update, not shipping today. The USB-C port is there and it is USB 2.0.

For anyone in my situation — record direct, never mic anything, want one box between guitar and DAW — that is the feature that decides the purchase, and it is the one feature that is not in the box on launch day. I would not buy a $999 board on the promise of a firmware update. Buy it for what it does today, and treat the interface as a bonus if and when it lands.

## Where It Sits

At $999.99 the Board is priced against real competition and is, on the specs, undersold on the floor and overdelivered on the screen. If your priority is the TONEX modeling engine and the ToneNET library, and you build in scenes, and you have a computer for captures, it is a coherent product at a fair price.

If your priority is footswitches, get a Helix. If your priority is capturing amps without a laptop, get a Cortex. If your priority is spending less than $500, [there are four good answers](/blog/best-modeler-under-500) and this is not one of them.

The honest version of this announcement is that IK built a very good sound engine into a chassis that made one significant compromise, and whether that compromise is disqualifying depends entirely on how you use your feet.
