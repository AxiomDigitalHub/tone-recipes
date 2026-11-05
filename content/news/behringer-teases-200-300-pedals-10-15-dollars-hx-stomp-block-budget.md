---
title: "Behringer Teases 200–300 Pedals at $10–$15 Each. If You Run an HX Stomp, Here's the Math That Actually Matters"
date: "2026-11-04"
category: "new-gear"
slug: "behringer-teases-200-300-pedals-10-15-dollars-hx-stomp-block-budget"
excerpt: "Behringer says it's making somewhere between 200 and 300 all-metal analog and digital stompboxes priced at $10 to $15, some of them open-source. There are no models, no specs and no date yet. What there is: a reason for every eight-block modeler owner to rethink which jobs live in DSP and which live on the floor."
source_url: "https://guitar.com/news/behringer-15-dollar-effects-pedals/"
image_url: ""
author_slug: "jess-kowalski"
---

Behringer posted a teaser on Facebook this week that opened with "Dear guitar players. We owe you an apology," and then said the company had been too busy with synths, mixers and DJ gear to pay attention to us. The fix, per the post: **somewhere between 200 and 300 new pedals, in all-metal enclosures, analog and digital, priced at $10 to $15 each.** Behringer says the range will go from "legendary legacy" designs to new circuits, and that some of them will be **open-source pedals you can modify**. The post asks followers which pedal they should build next and invites people to send schematics. Its sign-off line is that great tone should come from your fingers, "not your credit card."

That is the whole announcement. No model names, no specs, no release date, no word on which retailers. [Guitar.com](https://guitar.com/news/behringer-15-dollar-effects-pedals/) and [MusicRadar](https://www.musicradar.com/guitars/dear-guitar-players-we-owe-you-an-apology-weve-been-so-busy-disrupting-synthesizers-mixers-and-dj-gear-that-we-completely-forgot-about-you-behringer-teases-100s-of-usd10-usd15-stompboxes-but-whats-going-on-with-the-tc-electronic-stuff-in-the-photo) both picked it up. MusicRadar noticed TC Electronic gear in the teaser photo, which makes sense when you remember TC and Behringer belong to the same parent company, Music Tribe.

Boutique builders are not thrilled, and Behringer's history with clone lawsuits is out there if you want to read it. That isn't what this piece is about. I want to know what a $15 pedal does to your rig.

## The Two Things That Are Actually New

Behringer has been selling cheap clones for years. Elena already ranked twelve of them in our [Behringer clone roundup](/blog/behringer-pedal-clone-roundup), and I'd still stand behind that list today. Two details in this teaser move things, though.

**All-metal enclosures.** The roundup's biggest complaint about the current line has nothing to do with sound. It's the plastic: the switches go flaky, the PCB-mounted jacks crack loose, the paint chips. Our [$200 all-Behringer board](/blog/200-dollar-pedalboard-build-all-behringer-tuner-exception) only works because it lives at home and gets stepped on gently. If metal boxes actually ship at $15, the "fine for the bedroom, not for the gig" line we've been drawing moves, maybe a long way. I'm not handing out a verdict on a box nobody has held. I'm just telling you that's the spec to check first when these show up.

**Open-source.** If Behringer really publishes schematics, you get a $15 metal box with a known circuit you're allowed to mod. For anyone who has been eyeing our [DIY pedal starter guide](/blog/diy-pedal-starter-guide) but didn't want to drill an enclosure, that's a cheaper first project than any kit.

## The HX Stomp Math

Here's why I care, and I play an HX Stomp direct to the PA every week.

The Stomp gives you **eight blocks.** Once you've spent them on an amp, a cab, a gate, a delay and a reverb, you've got three left. You'll want two of them for a drive and a modulation block, and the last one ends up as the volume or EQ block you swore you didn't need. The Stomp doesn't usually choke on DSP. It chokes on block count.

So every job that moves out of the box onto the floor gives you a block back. A dead-simple circuit is the easiest job to move, because the analog version does it as well as the model does. At $10 to $15, moving it costs less than a set of strings.

What's worth moving, assuming the new line covers the same territory as the current one:

- **The drive in front of the amp.** A Tube Screamer circuit's character comes from an op-amp and two clipping diodes, and the current [TO800 already gets most of the way there](/blog/behringer-pedal-clone-roundup) because the chip family matches. Put it before the Stomp's input and you free a block. The settings are the ones we always give for [a TS in front of a gained-up amp](/blog/tube-screamer-before-high-gain-amp): Drive low, Level high, Tone around noon. The amp block does the gain and the pedal does the tightening.
- **Analog chorus and short analog delay.** These are bucket-brigade circuits, so the analog version is the real effect, not an approximation of it. The VD400 is still the best value in Behringer's catalog, and our [head-to-head with the Aqua-Puss](/blog/aqua-puss-vs-behringer-vd400) explains why. One catch: a cheap BBD pedal can arrive with its bias trimmer set badly, and [that's a twenty-minute fix, not a broken pedal](/blog/bbd-bias-trim-symptoms-analog-delay-chorus).
- **Fuzz, sort of.** A fuzz in front of a modeler only works if nothing buffered sits between the guitar and the fuzz, and if the modeler stops second-guessing your input. On a Helix or Stomp that means setting the Input block's **In-Z to 1M** instead of Auto, because Auto will load a real fuzz down like it's a fuzz model. Sean's [input impedance breakdown](/blog/modeler-input-impedance-setting-what-to-set-it-to) covers it, and the physics are in the [impedance and buffers guide](/blog/impedance-buffers-fuzz).

What I'd leave in the box: **reverb, and any delay longer than about 600 ms.** The cheap digital ambience pedals in the current line are the ones that landed on the skip list. The Stomp's reverbs are better than anything at this price will be. Don't trade a good block for a worse pedal just to save a slot.

## Where the Pedals Go

If you move effects onto the floor, keep one rule straight: **anything that should hit the amp goes before the Stomp's input. Anything that should come after the amp goes in the send/return.** Drive and fuzz go in front. Chorus and delay go in the loop, placed after the amp and cab blocks in the signal chain, with the send set to instrument level. That routing is the same idea as the [4-cable method](/blog/where-to-put-noise-gate-4-cable-method), done with the Stomp's own loop instead of a separate amp.

You're also adding buffers and cable runs to a rig that was one cable long, so read the [buffer myth piece](/blog/buffer-myth-buffered-bypass) before you blame the new pedals for losing top end.

## What to Check When They Actually Ship

When model names show up, I'll check three things before I tell you to buy anything:

1. **Does the chip family match the original?** That rule from the roundup still predicts whether a Behringer clone sounds like the pedal it copies or just sounds like the same kind of effect.
2. **Are the jacks mounted to the metal or to the board?** Metal walls don't help if the jacks still hang off the PCB.
3. **How much does unit-to-unit variance matter for this circuit?** A TS-style drive sets its voice with resistor ratios and comes out consistent. A discrete fuzz lands wherever its transistors land. We go through [which parts drift and why](/blog/two-units-same-pedal-component-tolerance) in our component tolerance piece.

Until then, it's a Facebook post with a photo. I'm excited anyway. A $15 metal box that frees a block on my Stomp is exactly my kind of argument. But nobody should sell their Boss pedals over a teaser.
