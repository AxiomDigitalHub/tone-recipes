---
title: "MXR's First Tuner Is the Sonic Research Turbo Tuner Reborn at $149.99 — and the Buffer Switch Matters More Than the Strobe If You Play a Modeler"
date: "2026-10-22"
category: "new-gear"
slug: "mxr-turbo-tuner-sonic-research-strobe-three-buffer-modes-149"
excerpt: "MXR announced the Turbo Tuner on October 20: the Sonic Research strobe engine in an MXR box, $149.99 street, five custom presets, and a bypass switch with true bypass plus three buffered modes. Everyone will review the strobe. The part that changes your tone is the buffer, because the first pedal in your chain decides what your modeler's Auto input impedance actually does."
source_url: "https://premierguitar.com/news/sonic-research-s-turbo-tuner-comes-to-mxr-with-modern-upgrades"
image_url: ""
author_slug: "jess-kowalski"
---

MXR announced the **Turbo Tuner** on **October 20**. It's the company's first tuner, built on the core engine of the **Sonic Research Turbo Tuner**, the strobe pedal that has been a pro-board staple for years.

The specs:

- **$149.99** street
- **True strobe display** with four brightness levels, plus a modernized LED window
- **"Fraction-of-a-cent precision"** (MXR's phrase, no number given)
- **Chromatic mode plus five customizable presets.** Each one holds up to **12 strings** with **±50-cent offsets** per string
- **Switchable bypass: true bypass, or one of three buffered modes**
- MUTE indicator LED, automatic power-up mode
- **9V passthrough output** to power one more pedal
- **USB** for firmware updates and editor software that's still coming

MXR didn't list dimensions, power draw or a ship date.

The preset system is the nerd feature. Per-string offsets mean you can save a sweetened tuning, a drop tuning and a 12-string setup without doing math at the gig. If you split tunings across two guitars in the same set, that's a real time-saver at changeovers. Fine. But a strobe is a strobe, and a Polytune is still a good tuner.

The bypass switch is what I'd actually write home about.

## Why the First Pedal Matters on a Modeler

Most people put the tuner **first**. So whatever the tuner does in bypass, every pedal and every amp model downstream hears it.

Helix, HX Stomp and HX Effects all have a **Guitar In-Z** setting, and the default is **Auto**: the input impedance changes to match whatever block comes first in your preset. Put a fuzz first and it drops impedance like a real fuzz seeing your pickups. Put an amp first and it presents a high, amp-like load. It's a clever feature, and it only works if **your pickups are the thing hitting the input.**

Put a **buffer** in front of all that and Auto stops mattering. A buffer's output is low impedance, and a low-impedance source doesn't care what load it sees. Your fuzz-first preset no longer gets the pickup interaction it was built around. Your vintage-voiced amp model stops getting the slight treble loss your cable and pickups normally give it, and it can sound a little brighter and stiffer than the preset you dialed in at home.

None of that is bad. It's just *different*, and now you get to choose. That's what makes three buffered modes plus true bypass on a **tuner** a big deal.

## Which Mode, When

- **True bypass, into a modeler, short cable (under ~10 ft total):** the default I'd start with. Your pickups talk straight to the modeler's input, and Guitar In-Z Auto does its job. Fuzz-first presets behave like the [fuzz and impedance guide](/blog/impedance-buffers-fuzz) says they should.
- **Buffered, long cable run or a big analog board in front of the modeler:** switch it on. Past about 15–20 feet of total cable, the capacitance shaves real high end off a passive pickup ([how much cable length actually costs you](/blog/does-cable-length-affect-tone)). A buffer at the front stops that. Then set your Helix input to a fixed impedance (1MΩ) instead of Auto, so presets stop moving around depending on the first block.
- **Buffered, fuzz first:** don't. Put the fuzz before the tuner, or run true bypass. A [Fuzz Face](/blog/big-muff-vs-fuzz-face) that sees a buffer instead of a pickup goes thin and fizzy. That's not a defect, it's the circuit.

The longer argument about whether buffers "ruin tone" is in [the buffer myth](/blog/buffer-myth-buffered-bypass) and [buffer vs true bypass with a looper](/blog/buffer-vs-true-bypass-looper). Short version: one good buffer near the front of a long chain is almost always a win. Two or three stacked buffers are where people get weird results. If you're building a board from scratch, our [beginner signal chain guide](/blog/beginner-signal-chains) puts the tuner in the right spot.

## What MXR Hasn't Said

Two things I want before I'd buy one.

First, **what the three buffered modes actually are.** "Three buffered modes" could mean three output levels, three input impedances, or three treble-compensation voicings. Those are very different features. If one of them is a **lower input impedance setting** (a "vintage cable" emulation that loads the pickups the way a long cord does), that's a tone tool for modeler players who miss the slight darkening of a real amp rig. If it's three unity-gain variations, it's a spec sheet line.

Second, **power draw.** Strobe displays aren't free, and the 9V passthrough means the pedal is sharing its supply. A tuner pulling 100+ mA plus a hungry digital pedal on the passthrough could overload a small isolated output. I'll check that number when MXR posts a manual.

$149.99 isn't cheap for a tuner. But it's also a tuner, a buffer with real options, and a power tap in one footprint, and the buffer is the part that actually touches your tone.

*Sources: [Premier Guitar](https://premierguitar.com/news/sonic-research-s-turbo-tuner-comes-to-mxr-with-modern-upgrades).*
