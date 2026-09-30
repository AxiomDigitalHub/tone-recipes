---
title: "Melofty's $1,250 Axom Max Loads NAM Files — Which Matters More Than the 400 Amps, Because NAM Files Are the Only Part of Your Rig You Can Take With You"
date: "2026-09-29"
category: "new-gear"
slug: "melofty-axom-max-nam-a2-1250-portable-captures"
excerpt: "Melofty announced the Axom Max on September 25 — €1,299 / about $1,250, 400+ amps, a 7-inch touchscreen, a guitar synth with no MIDI pickup, an AI text-prompt assistant, and support for Neural Amp Modeler A2 files. The amp count is noise. NAM support at this price is the actual news, because NAM is the only capture format that survives your next platform migration — and I have migrated three times."
source_url: "https://www.gearnews.com/melofty-axom-max-audio-processor-guitar/"
image_url: ""
author_slug: "sean-nakamura"
---

Melofty announced the **Axom Max** on September 25. **€1,299 at Thomann, about $1,250 in the US**, delivery quoted at two to three weeks.

The spec sheet as published:

- **400+ amp models**, 210+ cabs, 130+ effects, 200+ impulse responses
- **MFIM capture engine** (Multidimensional Fusion Inverse Modeling), which Melofty says resolves up to **9,856 parameter points per capture**
- **NAM A2 support** — third-party Neural Amp Modeler files load into the chain, plus user WAV IRs
- **DeepSynth** — 50+ synth voices and 70+ instrument models tracking the raw pickup signal, **no MIDI pickup required**
- **AI sound assistant** — build a rig by voice or text prompt from the phone app
- **7-inch HD touchscreen**, Wi-Fi, Bluetooth 5.0
- **Dual 9-slot signal chains**
- **8-in / 8-out USB audio interface**, 24-bit/192 kHz, USB-C
- **MIDI, XLR out with phantom power**
- **Four assignable footswitches**, onboard expression plus a jack for a second
- **60-minute stereo looper**
- **Vocal processor** with pitch correction and harmonizer
- 3.45 kg

Every roundup this week will lead with four hundred amps. I want to be precise about why that number is not information: **nobody has ever run out of amp models.** I keep a spreadsheet of every preset I have ever built, and across a Helix, a Kemper, and now a Quad Cortex, the number of distinct amp models I have used in a finished patch is somewhere around fourteen. Four hundred is a marketing unit, not a capability. Two hundred and ten cabs is worse — you will use four IRs and feel nothing about it.

The number that changes anything on this spec sheet is a format name: **NAM A2.**

## NAM Support Is a Migration Story, and Nobody Frames It That Way

Here is the thing I have learned the expensive way, three times.

I ran a Kemper. Then a Helix. Now a Quad Cortex. Each migration cost me roughly a month of evenings, and the cost was never the amp models — it was that **everything I had built was locked to the box I was leaving.** Kemper profiles are Kemper's. Quad Cortex captures are Neural's. Helix Stadium's new Proxy clones are Line 6's, and they live partly on Line 6's server. TONEX Tone Models are IK's. The models sound different from each other and that is a fine debate, but the structural problem is that none of them travel. When you change platforms you do not port your rig. You rebuild it. I have the spreadsheet precisely because I got tired of losing work.

**NAM is the one format that isn't like that.** It is open, it is a file, and it is not owned by whoever sold you the hardware. A NAM capture you made in 2024 loads into a NAM plugin, a Hotone Pulze Jr., a Mooer GE100 Pro, and now this. That portability is the entire reason it matters, and it is a completely different kind of feature from "400 amps."

So the honest framing of the Axom Max is: **at $1,250 it is competing with the Helix Stadium, the Quad Cortex, and a TONEX-based rig, and it is the one in that bracket built around a capture format none of them can lock.** Fractal aside, that is unusual company at this price. Melofty is a newer name with no track record I can verify and no long firmware history to inspect, which is a real risk I will come back to — but the format choice is the right one, and it is the part of this announcement that would actually survive the company.

If you are trying to work out what the capture-versus-model distinction buys you before you spend four figures on any of this, start with [Quad Cortex captures vs. models](/blog/quad-cortex-captures-vs-models) and [Kemper profiles vs. Helix models](/blog/kemper-profiles-vs-helix-models). Those two articles are the ones that decide this purchase, not the amp count.

## What NAM Support Actually Costs You at the Settings Level

Loading a NAM file is not free, and this is where the spec sheet stops helping you.

**NAM captures are usually louder and hotter than the platform's native amp blocks.** Every time I have dropped a NAM or a capture into a chain built around modeled amps, the level jumped and the gain structure shifted, and the first instinct — pull the amp's channel volume down — is the wrong move, because you have already clipped the block in front of it. The order of operations that actually works:

1. **Set input level first, at the instrument.** A capture was made at a specific input level. Feed it a hotter signal than the original capture saw and it compresses in a way you will read as "harsh," not "loud."
2. **Match output level between the NAM block and your native amp block before you judge tone.** Not roughly. Actually match them. Loudness is the single biggest confound in every A/B you will run on this box, and a 2 dB advantage will win a blind test on tone it does not deserve.
3. **Then set the cab.** A NAM capture may or may not include the cab. If it does and you stack an IR behind it, you are hearing two speakers in series, which is the most common cause of the boxy, blanketed sound people blame on the capture. That's the same trap covered in [why your modeler tone sounds thin](/blog/fix-thin-modeler-tone), running in the opposite direction.

That sequence applies to the Axom Max, the Pulze Jr., a GE100 Pro, and a NAM plugin identically. It is the workflow tax on portable captures, and it is worth paying.

## The AI Assistant Is a Generator, So Check the Mids

The phone app builds rigs from a voice or text prompt. We have covered this claim three times now in three price brackets — the [Mooer GE100 Pro at $96](/news/mooer-ge100-pro-ai-modeler-under-100), the [Hotone Pulze Jr. at $299](/news/hotone-pulze-jr-ai-presets-nam-battery-modeling-amp), and now at $1,250 — and my read has not changed, because the architecture has not changed.

Viktor's piece on [generator vs. retrieval AI tone tools](/blog/how-ai-tone-tools-differ-generator-vs-retrieval) is the frame I would use here. A generator produces plausible settings from a model's weights. It does not look anything up, and it cannot tell you it was wrong. That is not a reason to refuse to use it — it is a reason to know which failure mode to check.

The failure mode for prompt-generated guitar tones is consistent and it is boring: **scooped mids and too much reverb.** A generator optimizes for a tone that sounds impressive alone, and alone means in headphones, and in headphones a mid-scooped patch with a long tail sounds enormous. Put a bass player and a snare drum in front of it and it evaporates. So the rule with the prompt workflow on any of these boxes: **prompt to get a starting point, then push the mids back up and cut the reverb time roughly in half before you trust it.** See [why a tone sounds good in headphones and bad in the room](/blog/tone-good-in-headphones-bad-in-room) for the mechanism, and [what an AI tone assistant can and can't tell you](/blog/ask-axl-ai-guitar-tone-assistant) for the limits of the category.

I will say the honest thing about prompting, though: it is genuinely good at the part of patch-building I hate, which is **the blank page.** "Give me a chimey clean with a slow tremolo" gets you to something you can edit in four seconds instead of four minutes. The editing is still yours.

## DeepSynth Without a MIDI Pickup Is the Claim I'd Test Hardest

Fifty-plus synth voices and seventy instrument models tracking the bare pickup signal, no hex pickup, no GK-3, nothing installed on the guitar.

I want this to work. I also want to set expectations honestly, because **monophonic pitch tracking from a magnetic pickup has physics problems that firmware does not remove.** The two that will show up on your first demo:

**Low notes track slowest.** Pitch detection needs at least one full cycle to know what it is looking at. A low E at 82 Hz is a 12-millisecond cycle, and most trackers want two or three before they commit. That is 25–35 ms of latency at the bottom of the neck and effectively zero at the twelfth fret. Riffs feel fine. **Low, slow, exposed single notes feel late**, and no amount of DSP fixes a wavelength.

**Chords are a different problem than notes.** If DeepSynth is monophonic per-string it needs a hex pickup, which this does not have — so it is deriving polyphony from a summed signal, and that is where trackers glitch. Palm-muted chugs and dyads are where I would test it before I believed the demo.

The practical point: if what you actually want is pads under a worship set or an ambient bed, the reliable way to get there has never been pitch tracking at all — it is a freeze or hold block, which has no tracking to fail. [Synth pads from a guitar with no keyboard](/blog/synth-pad-guitar-no-keyboard-freeze-hold) walks that path, and it works on the Helix, the QC, and a Stomp you already own.

## What I Would Want Answered Before I Bought One

I back up my firmware before every update. I am not the right person to ask about buying version one of anything from a company with no public firmware history. Four things I would want on the record first:

1. **Is NAM support full or reduced?** Coverage is hedging on a Lite versus Full distinction, and the answer changes whether your existing capture library loads or partly loads. This is the single most important unanswered question on the sheet.
2. **Where does the AI assistant run?** If prompts require a round trip to a server, the feature is a service, not a spec, and services end. Helix Stadium's Proxy already put a cloning engine partly in the cloud; that is a trade, not a scandal, but you should know which one you bought.
3. **How much of the dual 9-slot chain can you actually fill?** Eighteen blocks is a real number only if DSP lets you run eighteen. Every modeler has a ceiling and most of them do not print it.
4. **What is the preset ecosystem?** This is the one that bites hardest and nobody scores it. A new platform has no third-party preset market, no forum thread with your song already solved, and no eight years of accumulated fixes. A Helix has all three — see [the Helix family compared](/blog/line-6-helix-family-compared) — and so does a Quad Cortex. That gap is worth real money and it does not show up next to "400 amps."

## Who This Is Actually For

If you own a Helix, a Stadium, or a Quad Cortex, this is not an upgrade. It is a lateral move onto a platform with less history, and the migration will cost you the month I described above.

If you are buying into this tier fresh, the Axom Max is the first unit at $1,250 whose headline feature is a format you keep rather than a library you rent, and if the NAM support turns out to be full, that is a genuinely different proposition from everything else on the shelf. It is also version one from a company nobody has stress-tested on a stage yet. Both of those are true at the same time.

And if $1,250 is more than you meant to spend — which, for a guitar synth you may not use and a vocal processor you almost certainly won't, is a fair conclusion — [the best modeler under $500](/blog/best-modeler-under-500) is the article that saves you the money. NAM loading has already arrived at $96. The format won. The hardware is just catching up.

## Dig Deeper on Fader & Knob

- [Quad Cortex captures vs. models](/blog/quad-cortex-captures-vs-models) — what a capture actually is, and when a model beats one
- [Kemper profiles vs. Helix models](/blog/kemper-profiles-vs-helix-models) — the older version of the same argument, still the clearest one
- [Helix vs. Quad Cortex vs. Kemper](/blog/helix-vs-quad-cortex-vs-kemper) — the platform comparison this unit is now priced against
- [Generator vs. retrieval AI tone tools](/blog/how-ai-tone-tools-differ-generator-vs-retrieval) — which kind of AI you're using, and what it fails at
- [Synth pads from a guitar with no keyboard](/blog/synth-pad-guitar-no-keyboard-freeze-hold) — the no-tracking way to get the DeepSynth result
- [TONEX Tone Models explained](/blog/tonex-tone-models-guide) — the other capture ecosystem at this price
