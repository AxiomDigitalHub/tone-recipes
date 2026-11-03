---
title: "Overloud THU Premium 2.2 Loads NAM Captures Inside a Full Amp Sim, Free for Owners. The Free NAM Plugin Already Plays Them. What You're Getting Is the Room and the Tweak Controls"
date: "2026-11-03"
category: "new-gear"
slug: "overloud-thu-premium-2-2-nam-player-tweak-air-free-update"
excerpt: "Overloud's THU Premium 2.2, out November 2 as a free update for Premium owners, adds a NAM Player that loads Neural Amp Modeler profiles into THU's signal chain with Amp Tweaks, AIR room simulation, and Fluid Processing. Overloud hasn't said whether it reads A2 files. Here's what's new compared with the free NAM plugin you can already run, plus the two setup mistakes that will make captures sound worse in THU than they do outside it."
source_url: "https://www.overloud.com/products/thu"
image_url: ""
author_slug: "dev-okonkwo"
---

Overloud shipped **THU Premium 2.2** on November 2, and it's a **free update for existing Premium owners**. The headline feature is a **NAM Player**. It loads Neural Amp Modeler profiles straight into the THU signal chain, so they sit next to THU's own amp models, cabs, effects, routing, and preset system.

That's the third NAM integration I've written about in two weeks, after [HeadRush 5.2](/news/headrush-5-2-two-nam-a2-blocks-calibration-metadata) and [Fractal's firmware 33 announcement](/news/fractal-axe-fx-iii-firmware-33-nam-a2-player-tone3000-axe-edit). This one is different because it's a plugin. And in a DAW you could already play NAM captures for free.

## What 2.2 Adds, per Overloud

- **NAM Player** in the THU soundchain, which loads standard NAM profiles.
- **Amp Tweaks** for NAM profiles. Coverage of the release describes them as reshaping distortion character and dynamic response. Overloud hasn't published the actual control list.
- **AIR (Amp In Room)** and **Fluid Processing** work on NAM profiles too. AIR is Overloud's room-ambience processing. Fluid Processing is their continuously variable tone-shaping feature.
- Everything else THU already does, including external IR loading, the cab section, effects, and routing, now works with captures in the chain.

What Overloud **hasn't said**: whether the player reads **A2** files or only the original architecture, what it costs on CPU, and what the Tweak controls are in detail. The A2 question matters most, because [A2 is where the capture library is heading](/news/tone3000-nam-architecture-2-a2-open-source-modeling). I'll update this once Overloud's release notes or the compatibility page answer it. If you're working from an A2-heavy folder, load one file before you rebuild a session around it.

**Pricing:** Overloud's store lists THU Premium at **€169** (shown alongside €299, which reads as the regular price). Premium owners also get a free THU Modern Metal Pack until November 9.

## The Honest Comparison: Free NAM Plugin vs. THU 2.2

The official NAM plugin is free and plays captures with an input, an output, a basic EQ, and an IR loader. If all you do is load a full-rig capture and record, that already sounds like the capture, because the capture is the sound.

THU 2.2 gets you three things the free plugin doesn't:

1. **A room.** Most full-rig captures are close-miked and dry. In headphones that sounds like your head is inside the speaker cone. AIR places the amp in a space before you add reverb. In my experience that's the difference between a guitar that sits in a mix and one that sits on top of it. With a dry capture, start AIR low and raise it until the guitar stops feeling glued to your forehead. Then stop.
2. **One preset system for models and captures.** Your THU amp-model presets and your NAM presets live in the same browser with the same effects. If you've been chaining the NAM plugin into a separate effects plugin and then a reverb, that's three instances down to one.
3. **Tweak controls on the capture.** I'll get to the catch below.

If you don't own THU and you're happy with the free NAM plugin plus [a good reverb](/blog/reverb-decay-time-units-pedal-vs-plugin), this update isn't a reason to buy it. If you already own Premium, it's free, so install it.

## Mistake 1: A Full-Rig Capture Into THU's Cab

This is where everybody's first NAM preset goes wrong, on every platform. Captures come in two kinds:

- **Full-rig**: amp, cab, and mic are baked in. **Turn THU's cab off.** If you leave it on, you're running two speakers and two mics in series. The low end chokes, the top end dies, and you blame the capture.
- **Amp-only (DI)**: no speaker in the file. **You need THU's cab or an IR.**

TONE3000 labels are community-written and unreliable. Bypass the cab and play one chord. If it sounds like a finished, mic'd amp, it's full-rig. If it's fizzy and thin, like a raw DI, it's amp-only. The [IR guide](/blog/impulse-response-ir-guide) covers the amp-only chain, and the [cab-off rebuild guide](/blog/disable-cab-ir-for-voiced-frfr-preset-rebuild) covers the other one.

## Mistake 2: Expecting Tweaks to Re-Knob the Amp

A NAM capture is a recording of one amp at one setting. Whatever "Amp Tweaks" does, it runs on that recording. It can reshape how the capture responds. It can't go back and move the amp's real gain knob, because the gain structure inside the capture was frozen when it was made. Viktor explained this for [Fractal's NAM tone stack](/news/fractal-axe-fx-iii-firmware-33-nam-a2-player-tone3000-axe-edit), and it applies here, though I'm reasoning from how captures work, not from measurements of Overloud's controls. [Captures vs. models](/blog/quad-cortex-captures-vs-models) explains the tradeoff on the Quad Cortex.

So:

- **Choose the capture for its gain and voicing.** Use Tweaks for small corrections.
- **A/B against Tweaks at neutral, at matched loudness.** Every capture comes in at whatever level its author left it. A Tweak that "sounds better" is often just louder. The [level-matching guide](/blog/level-match-modeler-presets) has the method, and it works the same in a DAW. Match on the master meter, not by ear.

## How I'd Set It Up

Full-rig capture → THU cab **off** → AIR low → a little compression → delay and reverb. One instance, saved as a preset. For amp-only captures, turn the cab back on and choose a mic position before you touch any EQ. In my experience, most of what people fix with EQ after an amp-only capture is really a mic-position problem.

For the plugin-rig version of a specific song, the recipe pages list the amp, cab, and effects order. The chain above maps onto them, with a capture where the amp block goes.
