---
title: "SolidGoldFX's $199 Fuzzbox Has a Switch for Buffers — Which Is the Switch Modeler Players Have Been Asking For"
date: "2026-09-14"
category: "new-gear"
slug: "solidgoldfx-fuzzbox-vintage-modern-switch-modeler-buffer"
excerpt: "A low-gain silicon Tone Bender Mk II with Bias, Sag, and a Vintage/Modern toggle that SolidGoldFX says plays nicely with wahs, buffers, and modern pedalboards. $199. If you run a Helix or a Quad Cortex, that toggle is not a tone switch — it is a placement switch, and it tells you which of your two options for this pedal is the right one."
source_url: "https://solidgoldfx.com/"
image_url: ""
author_slug: "margot-thiessen"
---

SolidGoldFX has introduced the **Fuzzbox** — **$199 US**, £189 in Europe through Audio Distribution Group and available there now, hand-built in Montreal. It is a low-gain silicon fuzz in the Tone Bender Mk II tradition, which the company positions as the next evolution of its long-running Rosie, and it has four things on the front panel that matter: the usual level and fuzz controls, a **Bias** knob, a **Sag** knob, and a two-position **Vintage/Modern** toggle.

That toggle is the reason I am writing about this pedal instead of the twelve other fuzzes announced this month. SolidGoldFX describes Modern mode as adding low end and playing nicely with **wah pedals, buffers, and modern pedalboards**, with Vintage giving you the raw, unfiltered Mk II response. Read that again with a modeler on the floor in front of you. That is not a tone switch. That is a *placement* switch, and almost nobody explains it that way.

## The Specs, Briefly

- **Circuit:** three-transistor Tone Bender Mk II topology using low-gain silicon transistors
- **Bias:** adjusts the operating point of the third transistor, from tight and snappy to soft, saggy and compressed
- **Sag:** simulates a fading battery, varying circuit voltage from roughly **9 V down to about 5 V**
- **Vintage/Modern toggle:** Vintage is the raw Mk II interaction; Modern adds low end and improves compatibility with wahs, buffers and modern boards
- **Enclosure:** 125B, top-mounted jacks, **relay-based true bypass**
- **Power:** 9–18 V DC, centre-negative, 2.1 mm, **20 mA** draw. No battery compartment — the relay needs the supply.

Silicon rather than germanium is a deliberate choice, not a cost cut, and our [germanium vs. silicon fuzz guide](/blog/germanium-vs-silicon-fuzz) covers why: silicon gives you temperature stability and repeatability, which is what you want from a pedal that has a Bias knob on it. If the transistors drifted with room temperature the way germanium does, Bias would be chasing a moving target and you would never find the same sound twice.

## Why "Plays Nicely With Buffers" Is a Sentence About Your Modeler

Here is the thing almost every write-up of this pedal is going to skip.

A Tone Bender Mk II is famously fussy about what sits on either side of it, and the fussiness runs in both directions. On the **input** side, the circuit presents a low impedance to your pickup — tens of kilohms, not the megohm a modern amp gives you — and that loading is not a defect. It is a large part of the sound. Put a buffered pedal in front of it and you have handed the fuzz a low-impedance source that it can no longer interact with, and the whole thing goes brittle and thin. That is the mechanism our [impedance and buffers guide](/blog/impedance-buffers-fuzz) walks through, and it has not changed since 1966.

On the **output** side, a Mk II drives through a volume pot, which means its output impedance is not especially low and it varies with where that pot is set. Feed that into something expecting a hot, low-impedance signal and you lose level and top end.

Now put a Helix, an HX Stomp, or a Quad Cortex at the end of that cable, and both problems become settings problems rather than cable problems.

## Setting One: Fuzzbox Straight Into the Modeler

This is the configuration most people will build, and it is the one Vintage mode was made for.

Guitar, short cable, Fuzzbox, into the modeler's guitar input. Nothing between the pickup and the pedal. The fuzz gets to load your pickup the way the circuit expects, your volume knob does the thing everybody buys a Mk II for, and Vintage mode gives you the unfiltered interaction.

Then go fix the input.

On a Helix, the **Input block's In-Z parameter** is a real analog load circuit at the jack, not a DSP filter, and it is set to **Auto** out of the box. Auto reads the first block on your path — *whether or not that block is bypassed* — and if that block happens to be a fuzz or wah model, the Helix drops the input impedance down into the tens of kilohms to emulate a fuzz being first in the chain. Which is fine when the fuzz is a model. It is exactly wrong when the fuzz is a physical pedal already sitting in front of the jack, because now your Fuzzbox's output is driving a 22k load and you will hear it as lost level and a flattened top end that no EQ block puts back.

**Set In-Z to 1M and leave it there.** Sean's [full breakdown of the impedance parameter](/blog/modeler-input-impedance-setting-what-to-set-it-to) is the long version, but the short version for this pedal is: the moment a real fuzz is in front of the unit, Auto has nothing useful to guess at. You already did the loading in analog. Ask the modeler to be a 1-megohm amp input and get out of the way.

While you are in there, if you are on a Helix and want bypassing the pedal to behave predictably, **Global Settings → Preferences → Auto Impedance** can be switched from First Block to **First Enabled**, so a bypassed block stops setting your input load.

## Setting Two: Fuzzbox in the Modeler's FX Loop — This Is What Modern Mode Is For

Here is the configuration I think is more interesting, and the one that makes the toggle worth paying for.

The classic order is **wah, then fuzz**. Hendrix, Gilmour, every recording you are thinking of. But if the Fuzzbox is a physical pedal sitting in front of your Helix, every wah you own inside that Helix is *after* the fuzz, which is the wrong order and sounds like it. You can buy a physical wah and lose a pedalboard slot, or you can put the Fuzzbox where it belongs: **in the modeler's send/return loop**, placed after the wah block in your signal chain.

Our [effects loop guide](/blog/effects-loop-explained) and Sean's [send/return tricks piece](/blog/modeler-send-return-loop-tricks-beyond-shimmer) cover the routing. Two things to get right:

1. **Set the loop to instrument level.** On a Helix that is Global Settings → Ins/Outs → FX Send/Return, and the difference between instrument and line is covered in our [line level vs. instrument level breakdown](/blog/line-level-vs-instrument-level-effects-loop). Send a line-level signal into a Mk II and you are slamming a circuit designed for a passive pickup. It will not sound like a fuzz, it will sound like a fault.
2. **Flip the toggle to Modern.**

Because here is the part that makes this pedal genuinely well-designed: **a modeler's FX Send is buffered.** By definition. It is a low-impedance driven output coming off a converter — the exact source a Mk II hates, and the exact scenario SolidGoldFX built Modern mode to survive. Vintage mode in an FX loop will sound thin and papery, and you will blame the loop. Modern mode is the mode that works there.

So the rule is simple enough to write on tape and stick to the enclosure:

- **Front of the modeler, straight from the guitar → Vintage.** Set In-Z to 1M.
- **Inside the FX loop, after a wah or any block → Modern.** Set the loop to instrument level.

I have never seen a fuzz ship with a switch that maps this cleanly onto the two ways modeler players actually use one. That is the story here, and SolidGoldFX's own copy gets close to saying it without quite saying it.

## Sag, and the Parameter You Should Not Stack It With

The Sag knob varies the circuit's supply voltage from roughly 9 V down to around 5 V, which is the starved-battery trick made adjustable. Turned down, the fuzz gets softer, spongier, slower to recover, and gates a little at the tail of a note. It is a feel control more than a tone control.

Two notes on using it with a modeler.

**Do not stack it with your amp block's Sag parameter.** Helix amp models have a Sag control, and so do Fractal's and the Quad Cortex's. Those model a *power supply* sagging under load in a tube power amp — a different physical mechanism at a different point in the chain, with a different time constant. Both feel like "softer and later." Run both at once and you get a rig that arrives after the beat, and you will spend an hour blaming your picking. Pick one. My default is Sag on the pedal, amp Sag near the middle, because the pedal version happens first and everything downstream inherits it.

**Do not chase the gate with more gain.** Starved-voltage fuzz gates. That is the sound. If you want the gate but not the sputter, the fix lives on the guitar, not the pedal — and it is the same volume-knob discipline as [cleaning up a cranked amp with the guitar volume](/blog/volume-knob-cleanup-tube-amp-vs-modeler).

## What Goes After It

Low-gain Mk II fuzz is a midrange event. It does not behave like a [Big Muff](/blog/big-muff-vs-fuzz-face), which scoops the mids and needs an amp with mids to survive; a Mk II pushes them, which means the amp block you put behind it matters more than usual.

Starting points I would actually use:

- **Brit Plexi Brt / Brit 2204** with the Drive pulled **down**, not up — you want the amp near breakup, not distorting, so the fuzz is the distortion and the amp is the speaker. Somewhere around Drive 3.5–4.5 on a Helix.
- **Mids at noon or below** on the amp block. The pedal is already supplying them. Leaving amp Mids at 6–7 the way a clean preset wants is where the honk comes from.
- **Cab:** a 4x12 with a dynamic mic off-axis. The off-axis position takes the 2–3 kHz spike off the top of the fuzz without you having to reach for a high cut.
- **High cut** around 6.5–8 kHz on the cab block if it is still spiky. Our [Hendrix fuzz recipe](/blog/hendrix-fuzz-tone-recipe) lands in the same neighbourhood for the same reason.

## Is It Worth $199?

$199 buys you a lot of fuzz in 2026, and that is the honest frame. A used Rosie is cheaper. A Behringer or Mosky Mk II clone is under $50 and, being a three-transistor circuit with no magic parts, will get you a surprising distance. If what you want is *the sound*, cheap gets you most of the way — we have said that about fuzz before and I am not walking it back.

What $199 buys here is the two knobs and the switch. Bias and Sag turn a circuit with one right setting into a circuit with a usable range, and the Vintage/Modern toggle solves a placement problem that everyone running a modeler has and almost nobody has named. If you have one fuzz on the board and you want it to work both in front of the unit and inside the loop, that toggle is the feature, and a $40 clone does not have it.

If you already own a Mk II clone you love and it lives in exactly one place forever, keep it. Set your In-Z to 1M anyway. That part is free.
