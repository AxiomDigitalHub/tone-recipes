---
title: "Axe-Fx III Firmware 33 Will Run NAM A2 Captures: A Four-Channel NAM Player Block, TONE3000 Inside Axe-Edit, and a Mark I Cab-Bank Warning"
date: "2026-11-02"
category: "firmware-update"
slug: "fractal-axe-fx-iii-firmware-33-nam-a2-player-tone3000-axe-edit"
excerpt: "TONE3000 and Fractal Audio announced on October 30 that Axe-Fx III firmware 33 adds a NAM Player block that loads NAM A2 captures, plus TONE3000 browsing inside Axe-Edit III 1.15.03. Firmware 33 is not on Fractal's download page yet (32.06 is still current). Each NAM Player holds four captures across four channels, A2 Full allows two blocks per preset, and Mark I owners lose User Cab Bank 2 to capture storage."
source_url: "https://www.tone3000.com/blog/fractal-axe-fx-iii-nam-a2"
image_url: ""
author_slug: "viktor-kessler"
---

On October 30, TONE3000 published a partnership announcement saying Axe-Fx III firmware 33 will run Neural Amp Modeler A2 captures natively, with TONE3000's library browsable from inside Axe-Edit III. Of everything in the NAM A2 rollout so far, this is the one I didn't expect. Fractal built its reputation on modeling amp circuits, not capturing them. Now its flagship will run captures and models side by side, in the same preset.

Before anything else, here is the status: **firmware 33 is announced, not released.** TONE3000's post calls it upcoming. As of today, November 2, Fractal's Axe-Fx III download page still lists 32.06, dated June 25. Axe-Edit III 1.15.03, the editor version TONE3000 lists as the minimum, is already posted. Without the firmware, though, it gives you nothing NAM-related to load. Everything below comes from the announcement. I'll check it against Fractal's own release notes when 33.0 ships.

## What Firmware 33 Adds, Per the Announcement

- **A NAM Player block.** You drop it in where the Amp block goes, and it loads NAM A2 captures.
- **Four channels per NAM Player.** That's four captures in one block, mapped the same way the Amp block's A–D channels are.
- **Two NAM Player blocks per preset in A2 Full mode,** so up to eight captures in a single preset. A preset can also hold one traditional Amp block alongside them.
- **A non-Turbo limit.** On non-Turbo units, the second NAM Player switches to A2 Lite if a traditional Amp block is also in the preset.
- **Capture storage.** Current units hold 256 captures. Original and Mark I units hold 128.
- **Modeled tone controls on the NAM Player:** Bass, Mid, Treble, Bright, and Bright Cap. TONE3000 calls these modeled analog stacks, not a generic EQ.
- **TONE3000 in Axe-Edit III** (Tools menu). You can search, filter by gear type, browse Discover and Creators, and install captures straight to the unit. It requires a TONE3000 account.
- **Free for all Axe-Fx III owners,** including original and Mark I hardware.
- **Not in 33:** a NAM capture utility inside Axe-Edit. The announcement lists it as coming later, with no date.

The same post lists non-NAM changes for 33: Cygnus X-4 amp modeling, remastered Drive block models, 13 new DynaCabs (two of them "Pre-Rola" models), Formant controls in the Pitch block, and updates to the Flanger, Reverb, Plex, Filter, and Megatap blocks. I'll write those up from the actual release notes, because a partner's summary of someone else's changelog isn't a changelog.

The announcement covers only the Axe-Fx III. The FM9, FM3, and AM4 aren't mentioned. Don't assume your unit is getting this until Fractal says so.

## Mark I Owners: Back Up User Cab Bank 2 Before You Update

This is the one item that can cost you something. According to TONE3000, **firmware 33 repurposes User Cab Bank 2 on Mark I units for NAM storage.** Any IRs in that bank will need a new home. Before 33 is out, export Bank 2 from Axe-Edit's Cab Manager, write down which presets point to those slots, and plan where the IRs will go. If a preset references a slot that no longer holds that IR, it won't throw an error. It will just sound wrong, and you'll find out at rehearsal.

If you don't know which hardware revision you own, check before you update.

## The Cab Rule Is Where Most NAM Presets Will Go Wrong

This is the same mistake I've watched people make on [HeadRush 5.1](/news/headrush-5-1-native-nam-tone3000-integration) and the [Zoom NeuRig](/news/zoom-neurig-nam-a2-lite-dna-engine-300-modeler). On the Axe-Fx, it's easier to make because the default preset routes Amp into Cab.

NAM captures come in two kinds:

1. **Full-rig captures.** The amp, the cab, and the mic are all baked into the capture. **Bypass or remove the Cab block.** If you leave it in, you're running the signal through two speakers and two mics in series. The low end gets choked off, the top end disappears, and people blame the capture.
2. **Amp-only (DI) captures.** These have no speaker in them. **You need a Cab block.** Pick a DynaCab or a factory or user IR, and treat it like a normal amp-plus-cab chain.

TONE3000's library is community-built and the labeling is inconsistent. Assume nothing. Before you use a new capture, play it once with the Cab block bypassed. If it sounds like a finished, mic'd amp, it's full-rig. If it sounds fizzy and thin, like a raw DI, it's amp-only. That takes ten seconds and settles it. The [IR guide](/blog/impulse-response-ir-guide) and the [cab-block rebuild guide](/blog/disable-cab-ir-for-voiced-frfr-preset-rebuild) cover both setups.

For amp-only captures, the DynaCab system is what makes this attractive on a Fractal unit. You can put a high-quality capture of a real amp in front of a cab and mic you can move continuously. Most capture platforms can't do that, because their best captures have the speaker locked in.

## The Tone Stack Is Not the Amp's Tone Stack

TONE3000 calls the NAM Player's Bass, Mid, Treble, and Bright controls modeled analog stacks. That's better than a parametric EQ. It still isn't the same as turning the knobs on the amp that was captured, and I want to explain why so nobody spends an evening trying to make it be.

A NAM capture is a snapshot of an amp at one set of knob positions. In a real amp, the tone stack's interaction with the gain stages is fixed in that snapshot. If a cascaded preamp has its stack between stages, cutting bass in front of the clipping stage tightens the distortion, not only the EQ. A stack added after a snapshot can reshape the snapshot's frequency response. It can't go back and change how the circuit inside the snapshot saturated. The announcement doesn't say exactly where Fractal puts these controls in the signal path, so I'm stating the general principle, not a measured result.

In practice:

- **Choose the capture for its gain structure and use the stack for small corrections.** If a high-gain capture is flubby in the low end, the fix is a tighter capture, or a boost into the NAM Player (the usual OD808 tightening trick applies, since it acts on the input). A big Bass cut won't fix it.
- **Keep stack moves small**, around ±2 from noon, and compare against the capture with the stack flat. Past that, you're EQing a recording of an amp, not adjusting the amp.

The [captures vs. models](/blog/quad-cortex-captures-vs-models) piece explains this tradeoff on the Quad Cortex. The physics is the same on a Fractal.

## How I'd Use Four Channels and Two Blocks

**Four channels from one capture author, one amp.** Four captures of the same physical amp at four gain settings (clean, edge of breakup, crunch, lead), all made by the same person, each on its own NAM Player channel, switched by scene. That gives you the channel-switching layout you already use with the Amp block, and the EQ voice stays consistent across the gain range because it's the same amp, mic, and room. Mixing captures from different authors across channels is how you get a lead scene that sounds like it came from a different band.

**Hybrid presets: one Amp block plus one NAM Player.** This is what's new on Fractal hardware. You can run a modeled amp on one path and a capture on the other in the same preset. Before you love it in stereo, check it in mono. Two different amps (and especially a full-rig capture next to a modeled amp with a DynaCab) won't line up in phase. Sum to mono, flip polarity on one side, and keep whichever version preserves the low mids. The [phase cancellation guide](/blog/phase-cancellation-dual-amp-modeler-presets) and [stereo width tricks that survive mono](/blog/stereo-width-tricks-that-survive-mono) walk through the procedure. On a non-Turbo unit, remember that adding that Amp block drops the second NAM Player to Lite. Decide which limit you care about before you design the preset.

**Level-match every capture.** Captures arrive at whatever output level their author left them at. Channel A to B can jump 6 dB with no warning. Match every channel to a reference at performance volume and write down the offsets. [The level-matching guide](/blog/level-match-modeler-presets) has the method.

## Why This Matters Beyond Fractal Owners

Here is the platform list for the NAM A2 format as of today: [HeadRush](/news/headrush-5-2-two-nam-a2-blocks-calibration-metadata), Zoom, [Darkglass](/news/darkglass-anagram-guitar-essentials-edition), several budget units, and now Fractal's flagship. A capture you make or download today will load on a growing share of the hardware on the market, from $300 boxes to a $2,500 rack unit. That portability is why [Dev's A2 explainer](/news/tone3000-nam-architecture-2-a2-open-source-modeling) argued the format would outlast any single box. Fractal adopting it is a strong data point for that argument.

It doesn't make Fractal's own modeling less relevant. The amp models still respond to their knobs in a way no capture can, and the [Fractal platform page](/platforms/fractal) presets don't change. What changes is that the gap in Fractal's lineup, a specific amp it doesn't model, can now be filled with a capture without leaving the unit.

## What I'd Do Now

1. **Mark I owners:** back up User Cab Bank 2 today and map which presets use it.
2. **Everyone:** don't install anything NAM-related until 33.0 appears on Fractal's [Axe-Fx III downloads page](https://www.fractalaudio.com/axe-fx-iii-downloads/) with its release notes. Axe-Edit 1.15.03 is already out, but by itself it doesn't add NAM support.
3. **When it ships:** build one preset. One NAM Player, four channels from one capture author, the Cab block set correctly for the capture type, levels matched. Test it before you add a second block or a hybrid Amp path. One variable at a time.

I'll cover the full firmware 33 release notes, including Cygnus X-4, the Drive remaster, and the new DynaCabs, when Fractal posts them.

*Announcement via [TONE3000](https://www.tone3000.com/blog/fractal-axe-fx-iii-nam-a2) (October 30, 2026). Firmware 33 had not been posted on Fractal Audio's download page as of November 2, 2026, which still listed 32.06.*

## Dig Deeper on Fader & Knob

- [NAM Architecture 2 (A2) explained](/news/tone3000-nam-architecture-2-a2-open-source-modeling): why A2 has Full and Lite variants.
- [Axe-Fx III 32.06: Brit JVM Crunch models](/news/axe-fx-iii-32-06-brit-jvm-crunch): the current shipping firmware.
- [HeadRush 5.2: two NAM A2 captures per rig](/news/headrush-5-2-two-nam-a2-blocks-calibration-metadata): another implementation of multiple captures.
- [Captures vs. models](/blog/quad-cortex-captures-vs-models): what a snapshot can and can't do.
- [Phase cancellation in dual-amp presets](/blog/phase-cancellation-dual-amp-modeler-presets): required before any hybrid Amp + NAM preset.
