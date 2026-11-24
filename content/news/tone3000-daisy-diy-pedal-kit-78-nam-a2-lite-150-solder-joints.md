---
title: "TONE3000 and Daisy Have a $78 NAM A2 Pedal You Solder Yourself. The CPU Numbers Tell You How to Plan Its Four Presets"
seo_title: "TONE3000 x Daisy DIY Pedal: $78 NAM A2 Kit You Solder"
date: "2026-11-24"
category: "new-gear"
slug: "tone3000-daisy-diy-pedal-kit-78-nam-a2-lite-150-solder-joints"
excerpt: "The TONE3000 × Daisy DIY Pedal is an open-source NAM A2-Lite and IR player built on a $34.99 Daisy Seed3 and a $42.99 Tayda parts kit. Four presets, six knobs, no screen, about 150 solder joints. One capture uses roughly 40% of the processor and two in series use about 83%, which decides what each preset can hold. TONE3000 doesn't sell or support it, and says it shouldn't be your first build."
source_url: "https://www.tone3000.com/blog/tone3000-daisy-diy-pedal-kit"
image_url: ""
author_slug: "dev-okonkwo"
---

TONE3000 announced a pedal on November 24 that it is careful to say it doesn't sell. The TONE3000 × Daisy DIY Pedal is a community project: an open-source NAM player you build from two orders and about 150 solder joints. Guitar World added up the prices the same day and got $77.98.

Back in June, the [A2 announcement](/news/tone3000-nam-architecture-2-a2-open-source-modeling) leaned on the claim that A2-Lite could run on very cheap hardware. This is that claim turned into a bill of materials.

## What You're Buying

Two separate orders:

- **Daisy Seed3**, the processor module, $34.99 from Daisy Audio
- **Tayda Electronics parts kit**, $42.99: circuit board, a drilled and printed aluminum enclosure, and every remaining component

What you end up with:

- **Six knobs:** Input, Output, Noise Gate, and a three-band EQ
- **A four-position rotary switch** for presets, with an LED per preset
- **One footswitch**
- **A power LED** that flashes when the input or output clips
- **9V power** from a standard pedal supply
- **No screen and no menus**, by design

Captures go in over USB-C from a browser. The companion app runs in Chrome or Edge with nothing to install: connect the Seed3, sign in to TONE3000, pick a preset slot, browse and preview captures, and flash one to the pedal. The same app handles firmware. Everything is MIT licensed and on GitHub, including the firmware, schematic, board files, drill template and parts list.

Neither the announcement nor Guitar World lists latency, sample rate, or the exact jacks. The pedal appears to be mono, since TONE3000 lists "a stereo version" as a mod idea for builders.

## The Two Numbers That Matter

TONE3000 published the processor load, and it tells you more than a spec sheet would:

- One A2-Lite capture: about **40%** of the Seed3
- Two captures in series: about **83%**

Each preset can hold one of three things: a single capture, a capture into a cabinet IR, or a capture into a second capture. Two captures plus an IR isn't on that list, and at 83% there wouldn't be much processor left for it.

That makes each preset a choice.

**Amp capture into IR.** This is the direct-to-interface or direct-to-PA preset. Most NAM captures on TONE3000 are the amp alone with no cabinet, and an amp-only capture straight into an interface sounds harsh and fizzy. It needs the IR. Our [IR guide](/blog/impulse-response-ir-guide) covers picking one.

**Pedal capture into amp capture.** A captured overdrive in front of a captured amp, which is the stack people actually want. With no IR slot left, this preset needs a real cabinet after it. TONE3000 says the output can feed an amp, a power amp and cab, or an interface or PA. For a stacked preset, the first two are the ones that work, unless the second capture is a full rig that already includes the cab and mic.

**A single capture** with the most headroom left over. Good for a full-rig capture going direct, or an amp-only capture going into a power amp and cab.

With four slots, I'd split them by where the signal is going instead of by amp. Two direct presets with IRs, two for a cab. Mixing them up by accident is how you end up with either two cabinets stacked or none.

## Dialing It Without a Screen

A few things follow from the control layout.

The Input knob is your gain structure. A capture is a snapshot of an amp at one gain setting, and the only way to push it harder or softer is the level going in. Turn Input up until the clip LED flashes on hard strums, then back it off until it stops. From there, lower Input cleans the capture up a little and higher Input drives it. It won't behave exactly like the amp's own gain knob, because the capture never learned that knob.

The three-band EQ is the only tone shaping on board. The announcement doesn't say whether it sits before or after the capture, so I wouldn't assume it acts like an amp's tone stack. Treat it as a corrective EQ for the room and choose a capture that's already close.

There are no effects beyond the gate. No delay, no reverb. In a signal chain this pedal is the amp, and your time-based pedals go after it.

Check the file type before you flash anything. The pedal runs A2-Lite, and TONE3000's library doesn't label architectures consistently, which is the same catch we noted on the [Zoom Neurig](/news/zoom-neurig-nam-a2-lite-dna-engine-300-modeler). The announcement doesn't say what happens if you try to load something else.

## Should You Build One

TONE3000 is unusually direct about this. It doesn't sell, assemble or warranty the pedal, there's no build support from the company, and it calls the project "a better second or third build than a first." You need a soldering iron, a multimeter and a USB-C data cable. Help comes from Discord, the Daisy forum, GitHub issues, or Tayda.

If you've never soldered, start with a fuzz or boost kit. Our [DIY pedal starter guide](/blog/diy-pedal-starter-guide) walks through a first build, and 150 through-hole joints around a $35 processor module is a lot to learn on.

If you have built a couple of pedals, the math is hard to argue with. A [Mooer GE100 Pro](/news/mooer-ge100-pro-ai-modeler-under-100) at $96 does far more: effects, a screen, an expression pedal. This does one thing. What it offers instead is that every part of it is open. The firmware is on GitHub, the board files are published, and TONE3000's own list of suggested mods includes stereo, delay, reverb and Bluetooth. I write software for a living, and a $78 pedal whose source I can read and change is more interesting to me than a $96 one I can't.

Ship dates aren't listed for either order. Prices are as reported on November 24.
