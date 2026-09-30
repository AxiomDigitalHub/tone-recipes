---
title: "Strymon's $199 La Brea Has No Firmware — and Its Best Knob Is One Your Modeler Can Copy Tonight, If You Fix the Phase First"
date: "2026-09-29"
category: "new-gear"
slug: "strymon-la-brea-analog-tape-drive-199-dry-blend-phase"
excerpt: "Strymon released the La Brea Analog Tape Drive today — $199, fully analog, no MIDI, no USB, no firmware, 24V internal rails. The headline is tape saturation. The knob that matters is Dry: a parallel clean blend that stays in phase at every setting. You can build that in a Helix or a Quad Cortex, and most people build it wrong, because in a modeler phase alignment is something you have to do on purpose."
source_url: "https://www.strymon.net/product/la-brea/"
image_url: ""
author_slug: "margot-thiessen"
---

Strymon put out the **La Brea Analog Tape Drive** today. **$199 street**, shipping now.

What it is, per Strymon:

- **Fully analog.** No MIDI, no USB, no firmware, no digital processing anywhere in it
- **Multi-stage tape saturation**, built on pre-emphasis and de-emphasis filtering "similar to a magnetic tape deck" rather than a conventional clipping stage — soft-clip behavior instead of diode-hard edges
- **Tape Sat** — the drive control
- **Gain** — two-position switch, *norm* / *high*, which sets the range Tape Sat sweeps
- **Shift** — three-position high-frequency contour: *high* opens the top, *flat* leaves it, *mid* adds midrange underneath the HF lift
- **Dry** — an independent clean blend, from fully off to **+6 dB of boost**, described as staying in phase with the saturated signal at all settings
- **Level** — output of the saturated path, from silence to enough to bully an amp's front end
- **True bypass**, JFET-buffered high-impedance input, low-impedance output
- **Runs 24V internally** off a 9V, 500 mA supply, for headroom and noise floor
- Lineage: the designer read Pete Celi's original white paper on the **Deco** tape circuit over a decade ago and has been working on tape-centric saturation since — this is the same company that shipped the [Timeline MX](/news/strymon-timeline-mx-dual-engine-delay) earlier this year, and it is a conspicuously different kind of product

I want to be careful here, because "tape saturation pedal" is a phrase that has been used to sell a lot of ordinary overdrives. This one is describing something specific and slightly unusual, and it is worth knowing what the description means before you decide whether you want it.

## What "Pre-Emphasis and De-Emphasis" Actually Means for How It Feels

A normal overdrive clips. You push a signal into a pair of diodes or an op-amp rail, the peaks flatten, and you get harmonics — the whole taxonomy is in [overdrive vs. distortion vs. fuzz](/blog/overdrive-vs-distortion-vs-fuzz), and the short version is that clipping shape is what your ear reads as *character*.

A tape deck does something different on the way in. It **boosts high frequencies before the tape**, records, then **cuts the same high frequencies on the way out.** The reason is noise, historically. The side effect is the thing musicians chase: because the highs were lifted going in, they saturate *first* and *hardest*, and then the de-emphasis filter on the output pulls them back down. What comes out is a signal whose top end has been compressed and softened while the midrange stayed relatively intact.

That is why tape does not sound like a Tube Screamer. It is not that it clips more politely. It is that **the frequencies that get clipped are weighted differently before the clipping happens**, and then un-weighted afterward. Transients get rounded instead of spiked. Pick attack softens without the midrange hump a TS puts in — see [Tube Screamer vs. Klon vs. Blues Driver](/blog/tube-screamer-vs-klon-vs-blues-driver) for what that hump does and why people either need it or resent it.

Practically, on a Jazzmaster into a Deluxe Reverb, this is the difference between a pedal that makes the amp louder and more aggressive, and a pedal that makes the amp sound like it was already recorded. I have not played one. But I know what that circuit topology does, and it is the honest reason to be interested in this rather than the word "tape" on the enclosure.

## The Dry Knob Is the Story

Every part of this pedal is a known quantity except one, and it is the one I would buy it for.

**Dry is a parallel clean blend that goes from silence to +6 dB, and Strymon says it stays in phase with the saturated path at every position.**

If that sounds familiar it should. A clean blend running alongside the dirt is the trick that made the Klon what it is — the reason a Centaur can add gain without erasing the guitar is that your original signal is still there underneath, uncrushed. [The Klon settings guide](/blog/klon-centaur-settings-guide) and [Tumnus Deluxe vs. Klon KTR](/blog/tumnus-deluxe-vs-klon-ktr) both turn on this. What is different here is the range: **+6 dB of clean is not a blend, it is a second pedal.** You can run Tape Sat low, Dry high, and use this as a clean boost that happens to have a little grit in it. Or invert it and get a nearly fully saturated signal with just enough dry underneath to keep the pick attack readable. That is two useful pedals in one enclosure, and neither of them is the obvious one.

And the phase claim is not marketing decoration. It is the hard part.

## Here Is How to Build It in Your Modeler — and Why Yours Probably Comb-Filters

You do not need to buy this to have a dry blend. **You need a parallel path, and you need to align it.** The reason most people's homemade clean blend sounds worse than a Klon's is not the drive model. It is phase.

When you split a signal down two paths in a Helix, an HX Stomp, or a Quad Cortex, the two paths do not automatically arrive together. Every block adds latency. Drive blocks are cheap; amp and cab blocks are not. So your dirty path lands a few samples behind your clean path, and when they recombine, the delayed copy cancels some frequencies and reinforces others. That is a comb filter. It does not sound like a phase problem — **it sounds like a thin, hollow, slightly nasal tone that you will spend an hour blaming on the drive model.**

What to do instead:

1. **Split, then put the drive on path B and nothing on path A.** Keep the clean path genuinely empty. Every block you add to it is latency you now have to match.
2. **Check it by ear with the dirt bypassed but the split still active.** Set both paths to unity, run them together, and listen to the clean tone. If it sounds thinner than the same patch with the split removed, you have cancellation. That test takes ten seconds and almost nobody runs it.
3. **If your platform has a time-align or delay-compensation option on the merge block, use it.** If it does not, insert a delay block on the clean path set to the shortest available time and nudge it until the combined tone stops sounding hollow. You are looking for a specific moment where the low-mids come back.
4. **Keep the amp and cab after the merge, not on one path.** This is the single biggest mistake. If the dirty path has its own amp and the clean path does not, you are not blending drive with clean — you are blending an amplified signal with a raw pickup, and no phase alignment saves that. Put the split *before* the amp block and merge *before* it too. [Parallel amp routing in a modeler](/blog/parallel-amp-routing-modeler) covers the version where you genuinely want two amps, which is a different goal.
5. **Set the clean blend last, and set it low.** Start with clean at about 20% of the dirty path's level and come up. The point at which a note's attack suddenly becomes legible again is the setting you want. Past that you are just getting louder.

Do that and you have the La Brea's Dry knob, for free, in a box you already own. What $199 buys you is **not having to do any of it** — the alignment is baked into the circuit, because in analog parallel paths there is no block latency to align. That is a legitimate thing to pay for, and it is the clearest example I can give of where an analog pedal is still genuinely easier than the digital equivalent.

## Where to Put It If You Play Direct

Most people reading this do not have a Deluxe Reverb on stage. So: **in front of the modeler, into the instrument input, before the amp block.** Treat it as a preamp-stage pedal, not an effect — [preamp pedals vs. overdrive](/blog/preamp-pedals-vs-overdrive-whole-front-end) explains why that distinction changes where it goes.

Two things to watch when you do that:

**Your input level will jump.** Level on this pedal goes well past unity by design. If you run it hot into a modeler's instrument input you can clip the converter before you ever reach the amp block, and converter clipping does not sound like tape — it sounds like a mistake. Set Level to unity with the pedal bypassed first, then add Tape Sat.

**Pull gain out of your amp block.** If you add a saturation stage in front of a modeled amp that was already at the edge of breakup, you get two overlapping dirt sources fighting each other. Pick one. Either the pedal is your dirt and the amp block is clean-ish, or the amp block is your dirt and the pedal is a boost — the discipline is the same one in [Tube Screamer in front of a high-gain amp](/blog/tube-screamer-before-high-gain-amp), and it matters more with a soft-clipping circuit because soft clipping is *easier* to stack past the point of usefulness without noticing.

## The Shift Switch Is a Mix Decision, Not a Tone Decision

Three positions: high, flat, mid.

*High* is a smooth top-end lift. *Flat* is off. *Mid*, per Strymon, adds midrange underneath the HF boost "to help notes poke through the mix."

That last description is doing real work and I want to underline it, because it names the thing correctly. **A high-frequency boost is what sounds better alone. A midrange boost is what sounds better in a band.** Every player who has ever dialed a patch in headphones and then watched it vanish behind a drummer has met this exact trade — the mechanism is in [why a tone sounds good in headphones and bad in the room](/blog/tone-good-in-headphones-bad-in-room).

So the way to use this switch is not to pick the one that sounds best on your couch. It is: **flat or high at home, mid at practice.** And if you find yourself reaching for *mid* every time you play with other people, that is not the pedal telling you something about itself. That is your patch telling you its mids were scooped all along.

## Should You Want One

If you already own a good transparent overdrive and a modeler with a parallel path you have properly aligned, you have most of this. Build the blend, run the phase check above, and keep your $199.

If you play a darker guitar into a bright amp and you have never found an overdrive that adds grit without adding edge, the pre-emphasis topology is aimed squarely at you, and a soft-clipping circuit with a real clean blend and a midrange option is a more considered answer to that problem than most of what $199 buys. On a Jazzmaster it's the pedal I'd want to try first — see [Deluxe Reverb settings](/blog/fender-deluxe-reverb-settings) for the amp side of that pairing.

And one quiet note in favor of it: **no firmware.** In a week where the other genuinely interesting release is a $1,250 modeler with a cloud-connected AI assistant, there is something to be said for a box whose behavior in 2036 will be identical to its behavior today. That is not nostalgia. It is just a different kind of reliability, and it is getting rarer.

## Dig Deeper on Fader & Knob

- [The Klon settings guide](/blog/klon-centaur-settings-guide) — the clean-blend trick this pedal extends to +6 dB
- [Parallel amp routing in a modeler](/blog/parallel-amp-routing-modeler) — how to split and merge without comb filtering
- [Overdrive vs. distortion vs. fuzz](/blog/overdrive-vs-distortion-vs-fuzz) — where soft-clipping saturation sits in the taxonomy
- [Preamp pedals vs. overdrive](/blog/preamp-pedals-vs-overdrive-whole-front-end) — why this goes in front of the amp block, not in the loop
- [Tube Screamer vs. Klon vs. Blues Driver](/blog/tube-screamer-vs-klon-vs-blues-driver) — the midrange hump this circuit deliberately avoids
- [Impedance and buffers](/blog/impedance-buffers-fuzz) — what the JFET input stage does to whatever you put before it
