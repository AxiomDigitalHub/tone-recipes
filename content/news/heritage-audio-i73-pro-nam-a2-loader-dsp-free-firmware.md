---
title: "Heritage Audio's i73 Pro Interfaces Now Run NAM A2 Captures on Their Own DSP, Free. Monitor Through the Capture, but Record the Dry DI Anyway"
seo_title: "Heritage Audio i73 Pro Adds NAM A2 Loader, Free Update"
date: "2026-11-06"
category: "new-gear"
slug: "heritage-audio-i73-pro-nam-a2-loader-dsp-free-firmware"
excerpt: "Heritage Audio released a free firmware and Mixer app update on November 6 that lets its i73 Pro audio interfaces load NAM A2 captures and IRs, including TONE3000 downloads, and run them on the interface's built-in DSP instead of your computer's CPU. Heritage calls it the first audio interface to do this. The real win for bedroom players is tracking through a capture with no buffer-size lag. The trap is printing only the wet sound and losing the DI you'll want later."
source_url: "https://musicplayers.com/2026/11/heritage-audios-i73-pro-range-becomes-the-first-audio-interface-to-run-nam-a2-models/"
image_url: ""
author_slug: "dev-okonkwo"
---

Heritage Audio pushed a **free firmware update** for its **i73 Pro** audio interfaces on November 6. It adds a built-in loader for **Neural Amp Modeler A2 captures and impulse responses**, and the captures run on the interface's own DSP, not on your computer. Any `.nam` file from TONE3000 can go straight onto the box. Heritage says that makes the i73 Pro range **the first audio interface to run NAM A2 models**.

This is the fourth NAM integration I've covered in about a month. The others were [HeadRush 5.2](/news/headrush-5-2-two-nam-a2-blocks-calibration-metadata), [Fractal's firmware 33](/news/fractal-axe-fx-iii-firmware-33-nam-a2-player-tone3000-axe-edit) and [Overloud THU 2.2](/news/overloud-thu-premium-2-2-nam-player-tweak-air-free-update). This one is the closest to how I actually record: guitar, interface, laptop, headphones, no amp anywhere in the room.

## What the Update Does

From Heritage's announcement and the trade coverage:

- **NAM A2 models plus IRs**, loaded into the interface. The press release says the loader handles captures of amps, combos, pedals and outboard gear, and that you can download TONE3000 captures and load them directly.
- **Processing on the interface's DSP.** Heritage founder Peter Rodriguez put it as "no plug-in, no extra device and no latency to worry about."
- **Two NAM slots**, according to [Gearnews' write-up](https://www.gearnews.com/heritage-audio-i73-pro/). Each slot holds up to four captures and four IRs, has its own tuner, and you can save unlimited user presets.
- **You need the new Mixer app** along with the firmware. Both come from Heritage's user portal. The Mixer already ran Heritage's own plugins on the DSP, and it can host any VST3 plugin for monitoring.

The range is the **i73 Pro One, Pro 2 and Pro Edge**. They're 1073-style preamp interfaces, so this update turns a vocal-and-mic interface into one that also replaces a guitar rig. Gearnews lists Sweetwater at **$599, $899 and $1,099**. If you already own one, the update costs nothing.

**What Heritage hasn't said:** whether the loader runs **A2 Full, A2 Lite or both**, whether older **A1** files load, and how long an IR can be. A2 Lite is the lightweight version built for embedded chips, and as I explained in the [A2 explainer](/news/tone3000-nam-architecture-2-a2-open-source-modeling), it isn't a bad version. But TONE3000 files aren't labeled consistently. Load one capture of each type before you build a session around a folder of them. I'll update this once the manual answers it.

## Why DSP Monitoring Is the Actual News

Running NAM on a laptop already worked. The free NAM plugin plays these same captures. What you couldn't avoid was the round trip: guitar into the interface, through the DAW at whatever buffer size you're running, back out to your headphones. At 256 samples with a heavy session open, a capture feels a little bit off under your fingers. You might not hear the delay, but you notice it when you're doing palm-mutes. The [latency budget guide](/blog/guitar-recording-latency-budget-buffer-size-monitoring) explains how that adds up.

DSP monitoring takes the capture out of that path. You hear the amp tone from the interface while the DAW does whatever it's doing. So you can leave the buffer at 1024 for a mix session with forty plugins on it and still track a guitar part that feels tight.

## The Mistake to Avoid: Printing Only the Wet Tone

Here's my setup for any "amp in the interface" feature, and Gearnews says the i73 Pro can record dry and wet at the same time:

1. **Record the DI on one track and the capture on another.** Monitor through the capture so it feels like an amp while you play.
2. **Treat the wet track as a placeholder.** It's useful for writing and for sending a rough mix to someone. It isn't final.
3. **Make the final tone decision with the mix around it.** Reamp the DI through the NAM plugin, a different capture, or an amp sim. Our [reamp guide](/blog/reamp-clean-di-through-cab-sim-pedal) covers the cab-sim version, and the [hybrid reamp guide](/blog/hybrid-reamp-real-amp-plus-amp-sim-blend-one-di) covers blending.

The reason is that you'll pick a capture at 2 AM in headphones, and then the bass part arrives and the capture's low mids fight it. If all you kept was the wet track, you're stuck EQing a frozen recording. If you kept the DI, you just pick a different capture.

## Full-Rig vs. Amp-Only, Again

The same rule applies here as with every NAM loader. With **four IRs per slot**, it's easy to get wrong:

- **Full-rig capture** (amp, cab and mic baked in): **leave the IR off.** If you add one, you're running two speakers in series. The low end gets muddy and the top end disappears.
- **Amp-only capture**: **you need an IR.** Without one it sounds fizzy and thin, like a raw DI.

Test by bypassing the IR and strumming one chord. If it sounds like a mic'd amp, it's a full-rig capture. The [IR guide](/blog/impulse-response-ir-guide) covers choosing a cab for the amp-only kind.

Also **match levels before you compare captures**. Every TONE3000 file comes in at whatever output level its creator left it, and the louder one always sounds better for the first ten seconds. The [level-matching guide](/blog/level-match-modeler-presets) has the method. On this interface, use the DAW's meter on the wet track.

## Who Should Care

- **i73 Pro owners:** install it. It's free, and it's a real guitar rig you didn't have yesterday.
- **Shopping for an interface and you play guitar:** this is now a real factor alongside the preamp. It doesn't make a $599 interface a better buy than a $150 one plus the free NAM plugin if your laptop already handles low buffers well. It matters if your sessions are heavy enough that you've been choosing between low latency and plugin count.
- **Helix or HX Stomp players who record:** your modeler already gives you hardware-monitored tones. This is only for if you want to use NAM captures in the studio without a second box on the desk.

For song-specific starting points, the recipe pages list the amp, cab and effects order for each tone. The chain above maps onto them: a capture where the amp block goes, an IR where the cab goes, and the dry DI recorded the whole time.
