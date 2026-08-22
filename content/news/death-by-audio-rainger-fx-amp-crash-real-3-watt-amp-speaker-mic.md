---
title: "Death By Audio and Rainger FX Put a Real 3-Watt Amp, a 2-Inch Speaker, and a Microphone Inside a Pedal — and the Reason It Works Is the One Thing an IR Physically Cannot Do"
date: "2026-08-22"
category: "new-gear"
slug: "death-by-audio-rainger-fx-amp-crash-real-3-watt-amp-speaker-mic"
excerpt: "The Amp Crash went live August 20 at $395 / £425. Inside the box: a 3-watt amplifier, a 2\" speaker, and a mic pointed at it. Every writeup is calling it novelty. It isn't — there's a specific, nameable thing happening in that enclosure that a cab IR is mathematically incapable of reproducing, and it's worth understanding whether you buy the pedal or not. Here's what's actually generating the sound, how close you can get on a Helix or HX Stomp (with the blocks that get you there), and where the approximation stops."
source_url: "https://deathbyaudio.com/products/amp-crash"
image_url: ""
author_slug: "jess-kowalski"
---

Death By Audio (Queens) and Rainger FX (London) launched the **Amp Crash** on August 20 at 10 a.m. EST. It's **$395 / £425 inc. VAT**, direct from both builders and through their dealer networks — DBA handling international, Rainger FX handling the UK.

What's in the box, per the makers:

- A **real 3-watt amplifier**
- A **2-inch speaker**
- A **microphone** pointed at that speaker
- **Gain** and **Tone** for the amp section
- **Separate DI Out and Mic Out level controls** — not a single blend knob
- A **Mic Gate**
- Three selectable onboard effects — **Reverb, Echo, Chorus** — sharing **Depth** and **Time**
- An **external speaker jack** (8Ω minimum)
- Buffered bypass, 9VDC at **300 mA**, lifetime warranty

Oliver Ackermann on working with David Rainger: "His effects are bonkers in the best way possible." Rainger's line is "powerful, unique, flexible, and a whole load of fun to use."

Fine. Everybody's covering it as a novelty — *lol they put an amp in a pedal*. I want to argue the opposite, and I want to be specific about why, because the specific reason is genuinely useful to you even if you never buy this thing.

## Three Different Sound Sources Are Fighting In That Enclosure

When people say "it has a real amp inside," they're describing one of three things happening, and they're not equally interesting.

**1. The amp's own distortion.** A 3-watt circuit clipping its preamp and power section. This is the least remarkable part. Modelers are *extremely* good at this now. My HX Stomp does small-amp clipping convincingly enough that I gig it with no amp on stage and nobody has ever once asked. If this were the whole story, the Amp Crash would be a $395 way to get something I already have. If you want to hear the difference between the two stages doing the work, [preamp vs. power amp distortion](/blog/preamp-vs-power-amp-distortion-how-to-hear) is the exercise.

**2. The speaker being driven past its limits.** This is where it gets interesting. A 2-inch driver has almost no excursion, almost no low-frequency output, and a very light cone. Push 3 watts into it and you are not operating it in its linear range — you're operating it in the range where the cone is breaking up, the suspension is running out of travel, and the driver is mechanically compressing the signal. That's a real, audible, *nonlinear* thing. [Cabinet volume and why size matters](/blog/cabinet-volume-and-tone-why-size-matters) covers the physics side, and [speaker power handling](/blog/speaker-power-handling-watts-cab) covers what happens when you exceed it on purpose.

**3. The acoustic loop between speaker and mic.** There's a mic in a small sealed-ish box a couple of inches from a speaker that's being driven hard. That's a feedback path. Not a metaphor — an actual acoustic feedback path, inside the enclosure, with the guitar signal in it. That's what generates the "explosive harmonic feedback" DBA is advertising.

The presence of a **Mic Gate** control tells you they know exactly what item 3 does. You don't put a gate on a mic path unless that path has a noise and self-oscillation problem you need to be able to shut off. I read that as a spec sheet being honest with you.

## The Part a Cab IR Cannot Do, Stated Precisely

Here's the claim, and I'll defend it.

**An impulse response is a linear, time-invariant snapshot.** That's not a criticism of IRs — it's their definition. You capture a system's response to an impulse, and convolving your signal with it reproduces that system's behavior *on the assumption that the system responds the same way at every input level*. Double the input, double the output, same character.

A speaker being driven to the edge of its excursion **does not obey that assumption.** Its behavior at 0.5 W is not a scaled version of its behavior at 3 W. That is the definition of nonlinear, and it is exactly the region the Amp Crash lives in permanently.

So: your Helix cab block is not "worse" at this. It is structurally not modeling it. The IR captured a speaker behaving itself. There is no gain setting that makes a linear convolution start breaking up like a cone at its limit — [Helix cab models decoded](/blog/helix-cab-models-decoded) covers what those blocks *are* actually doing, which is a lot, just not this.

Same story for item 3. The acoustic loop between a speaker and a mic in a shared enclosure is a live, real-time, physically coupled feedback system. There isn't a block for that because it isn't a block-shaped thing.

I want to be careful here: **I have not played this pedal.** I'm reasoning from the published spec and from what tiny drivers do, not from time with the unit. If someone gets one in front of me I'll come back and tell you if the theory survives contact.

## How Close You Can Actually Get on a Modeler

You can get closer than the marketing wants you to think. Not all the way. Here's the honest version.

**Amp block.** Skip the big-bottle models entirely — they're the wrong physics. Two that get you into the neighborhood:

- **Soup Pro** (modeled on the Supro S6616) — a genuinely small, cheap-sounding-in-the-good-way circuit
- **Voltage Queen** (Victoria Vintage Queen) — low-wattage tweed-adjacent, gets ratty early

**Cab block.** This is the part that matters more than the amp choice. **Soup Pro Ellipse** — Helix's model of the Supro 1x6x9 elliptical — is the smallest, most bandwidth-limited cab in the box and the closest thing to a tiny driver you have. Pair it with the Soup Pro amp and you're at least in the right room.

**Amp block deep params.** Get into the second page:

- **Master** high, **Ch Vol** down to compensate — you want the power section working, not the master doing your level control. [Master volume vs. non-master breakup](/blog/master-volume-vs-non-master-amp-breakup) is the concept.
- **Sag** up. This is the closest control you have to "the power supply can't keep up," which is a real part of what a tiny amp does.
- **Bias** and **Bias X** to taste — Bias X in particular changes how the output stage behaves as it's pushed, which is the closest thing to a nonlinearity knob you get.

**Cab block params.** Pull the **Low Cut** up aggressively — a 2" driver produces essentially nothing below a few hundred Hz, and faking that is one of the few places where the modeler wins on convenience. Bring **Distance** in close and use the **Early Reflections** to suggest a small enclosure.

**What you still won't have:** the nonlinear cone breakup, and the feedback loop. You can *imitate* the second one with an aggressive amount of gain and a resonant filter, and it will sound like an effect, because it is one. The real thing responds to how you hold the guitar. That gap is the entire product.

For the general case of "make it sound like it's falling apart on purpose," I already wrote the long version in [Jack White's lo-fi garage tone](/blog/jack-white-lo-fi-garage-tone) — Silvertone-through-a-broken-speaker is the same target from a different angle.

## The Feature Nobody Is Talking About: Two Separate Output Levels

Every writeup says "blend control." It isn't one. It's a **DI Out level and a Mic Out level, independently**, and that's better.

A blend knob is a crossfade — you're always trading one for the other. Two independent levels means you can run the DI at unity and the mic at zero, which is a clean-ish 3-watt amp DI. Or DI at zero and mic wide open, which is nothing but the destroyed-speaker sound. Or both, at whatever ratio, including "both loud," which a crossfade can't do.

If you record, that is a **hybrid chain in a single enclosure** — a direct signal and a mic'd signal from the same source, natively phase-locked because they're in the same box. Blending a clean direct path against a mic'd path is a real studio technique and it's fiddly to set up; [the hybrid re-amp chain](/blog/hybrid-reamp-real-amp-plus-amp-sim-blend-one-di) is how you'd normally do it with a DI and a round trip, and [close mic plus room mic phase blending](/blog/close-mic-plus-room-mic-guitar-cab-phase-blend) is what usually bites you. Here the alignment problem mostly goes away by construction.

Two things I can't answer from the spec sheet: **whether the internal mic still picks up anything when you're driving an external cab** through the 8Ω jack, and what the mic's own character is. Both change the use case a lot. Neither is published.

## The Price Argument, Which Is Not the One I Usually Make

I'm the person who tells you a $50 RAT gets you 90% of a $300 boutique overdrive, so let's do this properly.

**$395 is a lot.** It's more than an HX Stomp costs used. It's four times a Big Muff. If this were a fuzz circuit in a nice enclosure I'd be writing a very different article, because that market is thoroughly solved at a quarter of the price and [overdrive vs. distortion vs. fuzz](/blog/overdrive-vs-distortion-vs-fuzz) will get you sorted for free.

But the usual argument doesn't apply here, and I want to be straight about why rather than pretend it does. My boutique-markup complaint is that you're paying a premium for a *marginally different version of a thing that exists cheaply*. That's not what this is. There is no $50 pedal with a real speaker being destroyed inside it. The comparison set isn't other fuzzes — it's "buy a beat-up practice amp for $60, mic it, and accept that it's now a two-piece rig you can't put on a board." That's the actual alternative, and it's a real one. Whether $395 beats it depends entirely on whether the pedalboard form factor is worth ~$335 to you. For me, playing venues where I load in with one gig bag and go direct, it might be. For someone with a garage and a mic stand, it clearly isn't.

Also, budget honestly: **300 mA at 9V.** That is a lot for one pedal — it needs its own isolated output, and a fair number of cheap daisy chains won't feed it.

## Who Should Actually Buy This

**Buy it if:** you make noise on purpose and the sound of something failing is part of your vocabulary; you record and want a direct-plus-mic'd pair from one source with no phase work; or you go ampless and have specifically missed the thing where a speaker in the room does something you didn't ask it to.

**Skip it if:** you want a fuzz. Buy a fuzz. Two of them, actually — [germanium vs. silicon](/blog/germanium-vs-silicon-fuzz) — and you'll still have change.

**Also skip it if** the appeal you're feeling is "a real amp is better than modeling." That's not what's on offer. A 3-watt amp into a 2-inch speaker is not a better amp than the Soup Pro model in your Helix. It is a *worse* amp, deliberately, in a way that is interesting. Those are extremely different purchases and I've watched people confuse them before. If what you actually want is a small amp that sounds good quietly, [practice amps compared](/blog/practice-amps-mustang-spark-hx-stomp) is the honest shelf.

The Amp Crash isn't competing with your modeler. It's competing with the specific decision to keep a broken speaker around because it does something nothing else does. I've owned that speaker. It lived under my bed for four years. This is that, on a board, with a lifetime warranty — and, unlike mine, with a gate on it.
