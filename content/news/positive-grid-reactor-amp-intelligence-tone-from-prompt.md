---
title: "Positive Grid's REACTOR Builds a Tone From a Text Prompt, a Recording, or a Photo — and It's $349"
date: "2026-06-03"
category: "new-gear"
slug: "positive-grid-reactor-amp-intelligence-tone-from-prompt"
excerpt: "Positive Grid announced REACTOR on June 2 — a 1x12 combo (50W/$349, 100W/$449) with an 'Amp Intelligence' engine that generates a full signal chain from a typed description, an uploaded recording, or an image. It's the first time the company's AI tone engine has lived in hardware instead of the Spark app. Here's what's actually interesting about it if you think about tone as a system, and where the marketing gets ahead of the physics."
source_url: "https://www.premierguitar.com/news/positive-grid-introduces-reactor"
image_url: ""
author_slug: "dev-okonkwo"
---

Positive Grid announced the REACTOR on June 2. It's a 1x12 electric guitar combo in two sizes — 50W for $349 and 100W for $449 — and it's already shipping to dealers. On paper it's a combo amp. In practice it's the first time Positive Grid has taken the AI-driven tone engine they've been building inside the Spark app and the BIAS ecosystem and put it into a box with a speaker and physical knobs.

I want to be upfront about my bias here, because it's the opposite of most people who'll review this. I don't own a tube amp. I've never owned a tube amp. My entire rig is a Strat into a Scarlett into Ableton, and I think about tone as a frequency curve and a stereo field, not as a thing that moves air in a room. So a combo amp is slightly outside my world. But an amp whose whole pitch is *"describe the sound you want and the software builds the signal chain"* — that's about as squarely in my world as gear gets. That's the part worth talking about.

## What "Amp Intelligence" Actually Claims To Do

Positive Grid is calling the engine **Amp Intelligence**. The marketing copy says they "decoded over 200 amp designs at the circuit level — gain stages, transformers, bias points, harmonic response — capturing the behavioral DNA" of a long list of classic amps. The headline feature is that you don't browse presets. You give REACTOR an *intent* in one of three forms:

- **A text description** — type something like "warm '65 Fender clean with a touch of spring verb" and it assembles a chain.
- **An uploaded recording** — feed it audio and it tries to match the tone.
- **An image** — share a photo and it generates a tone "inspired by" it.

It then builds a complete signal chain — or, per Positive Grid, sometimes "a custom amp" — in real time. There's also a **Tone Memory** layer that tracks how you tweak settings over time and supposedly nudges future results toward your habits.

Two of those three input methods are genuinely interesting and one of them is a party trick, so let me separate them.

## The Text-To-Tone Part Is The Real Story

Generating a signal chain from a text description is a real, tractable problem, and it's the one I'd actually use. If you've spent any time with image or audio generation models, the architecture more or less writes itself: you embed a corpus of amps, cabs, and effects into a parameter space, you train a model to map natural-language descriptions onto regions of that space, and you let a user land somewhere and then move. The interesting engineering question isn't "can it do this" — it obviously can — it's *how good the parameter space is*. A tone-from-text feature is only as good as the underlying models it's drawing from. If the 200 decoded amp circuits behave well and the effects are voiced honestly, then "warm '65 clean" lands you somewhere genuinely usable and you tweak from there. If the underlying models are mushy, no amount of clever language mapping saves you — you've just got a faster way to arrive at a mediocre starting point.

This is the thing I'd want a review to answer, and it's the thing the marketing carefully doesn't: **what is the floor?** Not "what's the best tone you got" — what's the *worst* tone a reasonable text prompt produces, and how far is it from usable? That's the number that tells you whether the engine is real or whether it's a search box bolted onto a preset library.

The **audio-matching** input is the more ambitious claim, and the one I'm most skeptical of. Matching a target recording is the same problem TONEX, Kemper's Profiling, and Neural's Neural Capture are all solving — except those tools profile a *real amp in front of you* with a known signal. Matching a finished, mixed recording is much harder, because the guitar tone in a record is tangled up with EQ, compression, the room, the mix bus, and whatever the mastering engineer did. Pulling a clean amp-and-cab target out of that is genuinely hard, and I'd want to hear honest before/after audio before I believed any of it.

The **image-to-tone** feature is a demo. A photo of a sunset becoming a "warm" tone is fun, it'll do numbers on Instagram, and it has no defensible relationship to physics. That's fine — not every feature has to be serious — but don't let it color how you judge the engine. The text and audio paths are the ones that matter.

## The Hardware Is More Sensible Than The AI Pitch

Strip away the Amp Intelligence story and the box itself is well-specced for someone like me, which surprised me.

- **Physical knobs** for gain, EQ, reverb, and master volume — so you're not buried in an app for basic moves.
- **Modifier switches:** a **Heat** control that tweaks harmonic content, and a **Push/Smooth** switch that jumps between a biting lead voicing and a rounder rhythm response.
- **USB-C direct recording interface** — this is the spec that made me actually pay attention. A combo amp that's also a recording interface means the tone you dialed in goes straight into your DAW, no mic, no interface in between.
- **Line out with cab simulation**, an **FX loop**, and a **MIDI input** — so it'll sit in a real signal chain instead of being a closed appliance.

That USB-C interface plus cab-sim line out is the part that makes this relevant to a bedroom recordist rather than just a practice-amp buyer. The whole reason I run plugins is that I want a clean digital signal I can re-amp, reverse, and EQ after the fact. An amp that hands me that signal over a single USB-C cable is doing the thing I care about, AI or no AI.

## Where This Sits — And The Honest Caveat

At $349/$449 this is priced against the budget-modeler field, not against a Helix or a Quad Cortex. You're not buying REACTOR for a deep, editable, gig-ready preset system — you're buying the *speed* of getting to a starting tone, plus a combo speaker and a recording interface in one box. For a beginner or a bedroom player who finds the blank-preset problem paralyzing, "type what you want and start playing" is a legitimately good answer to a real problem.

The honest caveat is the one that applies to every AI-tone claim right now: **the demo is curated and your room is not.** Every tone-from-text and tone-from-audio feature looks incredible in a launch video because someone picked the prompts that worked. The real test is the boring one — sit down, type ten honest prompts for sounds you actually use, and count how many land in usable territory on the first try versus how many need ten minutes of knob-twisting to rescue. If most of them land, Positive Grid built something real. If they don't, it's a faster path to the same factory-preset disappointment. I genuinely don't know which yet, and anyone telling you they do, three days after the announcement, is guessing.

I'll be downloading the audio examples the second independent ones show up. The idea is sound — describing a tone in plain language is a far more natural interface than a parameter list, and it's the direction this whole category is going. Whether *this* execution clears the bar is a question only honest A/B audio answers, and I'll update when there's some.

## Dig Deeper on Fader & Knob

- If $349 has you weighing this against a dedicated modeler, our [best modeler under $500](/blog/best-modeler-under-500) breakdown lays out what you actually give up at each price tier.
- The reason a combo's "tone" changes the second you record it direct is all about [bedroom modeler headphone and frequency response](/blog/bedroom-modeler-headphone-frequency-response) — worth reading before you judge any amp by its USB-C output.
- New to the idea that a tone *is* a chain of blocks? Start with [beginner signal chains](/blog/beginner-signal-chains) — it's the mental model that makes "the amp built me a signal chain" actually mean something.
