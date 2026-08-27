---
title: "Sleep Token's First Signature Instruments Arrive — and the Jackson's 30\" Octave-Down Spec Breaks Every Metal Preset You Own"
date: "2026-08-26"
category: "new-gear"
slug: "jackson-charvel-sleep-token-iv-monarkh-iii-san-dimas-bass"
excerpt: "Jackson and Charvel unveiled the Sleep Token IV Monarkh SC ($2,199.99) and III Pro-Mod San Dimas Bass V ($1,599.99). The guitar is a 30-inch-scale EverTune build set up for whole-octave-down tuning — which puts your low string at 41 Hz, the same fundamental as a bass low E. Here is what that does to your high-pass, your gate, and your cab block."
source_url: "https://www.premierguitar.com/news/jackson-charvel-sleep-token-signature"
image_url: ""
author_slug: "viktor-kessler"
---

Fender Musical Instruments announced the first Sleep Token signature instruments today: the **Jackson Pro Plus Series Signature Sleep Token IV Monarkh SC** at $2,199.99 USD (£1,949 / €2,299) and the **Charvel Sleep Token III Signature Pro-Mod San Dimas Bass V** at $1,599.99 USD (£1,399 / €1,649).

The specs, because specs are the part I can actually verify.

**Jackson IV Monarkh SC:** 30" scale length, built for whole-octave-down tuning. EverTune 6 bridge with custom saddles Jackson says are engineered for stability in the lowest registers. Direct-mount Fishman Fluence Open Core Classic humbuckers. Bound mahogany body with quilt maple veneer, three-piece caramelized maple set neck, pale moon ebony fingerboard with compound radius and 22 stainless steel frets. Pearloid teardrop inlays, Luminlay side dots, matching headstock.

**Charvel III San Dimas Bass V:** Five strings, poplar body, caramelized maple neck, 34.4"–35.5" multiscale fanned-fret layout. Custom red Fishman Fluence soap bars with three voicings on a mini toggle, Fishman two-band EQ with a blend knob, Hipshot Ultra Lite tuners, locking strap pins.

That's the announcement. Now the part the press release doesn't cover, which is what happens when you plug a 30-inch octave-down guitar into a preset that was built for a 25.5-inch guitar in E standard.

## Run the Numbers Before You Run the Preset

Standard low E is 82.41 Hz. An octave below that is **41.20 Hz** — which is, to four significant figures, the same fundamental as the low E on a four-string bass.

I want that to sit for a second, because it reframes the whole signal chain. You are not building a drop-tuned guitar tone. You are building a tone for an instrument whose lowest fundamental lives in bass territory, played through amp models and cab IRs that were captured, voiced, and in many cases deliberately filtered for an instrument that bottoms out at 82 Hz.

Every one of the following defaults is now wrong, and each one is wrong in a measurable direction.

### 1. Your High-Pass Filter Is Deleting the Note

The standard modern-metal recipe puts a high-pass somewhere between 80 and 100 Hz to keep the low end from turning to mud. At E standard that's a sensible move — it trims below the fundamental and cleans up the flub without touching the note itself.

At 41 Hz, an 80 Hz high-pass is a **6 dB-per-octave-and-steeper attenuator sitting directly on top of your fundamental.** You will not hear a "tighter" tone. You will hear a thin one, and then you will compensate by adding gain, and then you will wonder why it sounds fizzy. That's the failure loop I walk through in [why your high-gain tone sounds fizzy](/blog/fix-fizzy-high-gain).

Start at 35 Hz and move up only until the flub goes away. In my testing on 8-string material the useful corner is usually 45–55 Hz, not 80. Measure it — don't inherit it.

### 2. Your Tube Screamer Is Doing a Different Job Now

The TS808's low-end roll-off sits around 720 Hz. That number is why the pedal works so well as a tightener in front of a high-gain amp: it strips the low content that would otherwise smear the distortion stage, leaving the amp to distort a mid-focused signal. I have an OD808 permanently on in front of my 5150 III for exactly this reason, and I've written up the mechanism in [why a Tube Screamer in front of a high-gain amp works](/blog/tube-screamer-before-high-gain-amp).

Here's the wrinkle. At E standard, that 720 Hz corner is roughly 3.1 octaves above your fundamental. At octave-down tuning it's **4.1 octaves above it.** The pedal is removing proportionally *more* of your instrument. The tightening still works — arguably it works harder — but you lose more body doing it, and the Drive/Level balance that felt right on a 6-string will feel gutless here. Back the Drive down and push Level up further than you think. Same trick as the drop-tuned setups covered in [gain staging for drop tunings](/blog/gain-staging-drop-tunings).

### 3. Your Noise Gate Is Chopping the Fundamental

This is the one that gets missed, and it's just arithmetic. The period of a 41.20 Hz waveform is **24.3 milliseconds.** That is the time it takes a single cycle of your lowest note to complete.

Fast gate release times — the 5 to 15 ms values that work beautifully for tight staccato chugs on a 6-string in Drop C — are now shorter than one cycle of the note you're playing. The gate closes mid-waveform. What you hear is a click, a stutter, or a note that seems to disappear before it decays, and you will blame the amp model. It isn't the amp model.

Rule of thumb I use: **release time no shorter than two full periods of your lowest fundamental.** At 41 Hz that's a floor of about 50 ms. Set the threshold as usual — my full method is in [noise gate threshold and decay settings for high gain](/blog/noise-gate-threshold-decay-settings-high-gain) — but treat 50 ms as a hard minimum on release and only tighten it if you genuinely hear tails you don't want.

### 4. Your Cab Block Can't Reproduce It

A 4x12 loaded with V30s starts rolling off hard below roughly 80 Hz. That is not a flaw — it's why the speaker sounds the way it does, and it's a large part of why V30s dominate modern metal. It is also why a V30 IR will simply not pass much of a 41 Hz fundamental. I went through the fatigue problem this creates in [V30 fatigue in modern metal](/blog/v30-fatigue-modern-metal), and the pairing options in [Helix cab and IR pairings](/blog/helix-cab-ir-pairings).

Three approaches, in the order I'd try them:

1. **Mixed IR.** Blend a V30 4x12 for the mids and pick attack with a cab that extends lower — a 1x15 or a bass cab IR — and low-pass the bass cab above ~150 Hz so it contributes only weight, not character.
2. **Split the signal.** Run a crossover: everything below ~120 Hz goes to a clean or lightly compressed path with no amp distortion at all, everything above goes through your full high-gain chain. This is standard practice in bass rigs and it exists for precisely this reason. Distorting a 41 Hz fundamental produces intermodulation garbage; keeping it clean and blending it back gives you weight without mud.
3. **Accept the roll-off and let the bass carry it.** Perfectly valid, and honestly what most mixes do anyway. Sleep Token records are dense — the guitar isn't carrying the sub content alone.

Option 2 is what I'd build first. Option 3 is what will probably sound best in a band.

### 5. Fishman Fluences Are Not Passive Pickups

Open Core Classics are quieter than the original Fluence line but they are still active, and their output is consistent in a way passives are not — no magnetic loading, flat impedance response, and a hotter, more even signal into your front end.

Two consequences. First, the impedance-interaction tricks that shape a passive guitar's top end — the loading effects Margot walks through in [impedance and buffers](/blog/impedance-buffers-fuzz) — simply do not apply. An active pickup presents a low, fixed source impedance, so your modeler's input impedance setting stops being a tone control and becomes a formality. Stop chasing it; the top end you want has to come from EQ. Second, if you're A/B'ing this against a passive guitar in the same preset, you are not comparing tones — you're comparing levels. Match them first: [how to level-match modeler presets](/blog/level-match-modeler-presets).

## What EverTune Fixes and What It Doesn't

EverTune holds pitch under bending pressure and temperature change by mechanically decoupling string tension from your hands. On a 30" scale at octave-down tuning, where string tension is a genuine engineering problem and intonation drift is worst, that's not a gimmick — it's the right tool.

What it does not fix is the *setup*. A guitar built to be tuned an octave down needs string gauges chosen for that tension, and swapping to a lighter set to make bends easier will put the EverTune outside its working force range and you'll be back in the manual for an afternoon. Buy the gauge Jackson recommends, learn the adjustment procedure, and leave it alone.

## The Honest Caveat

A signature guitar gets you the artist's *instrument*. It does not get you their tone, and the marketing copy will never say that out loud.

IV's recorded sound is a production result — amps, captures, re-amping, layering, mixing, and a mastering chain — and roughly none of it lives in the wood. What the Monarkh gives you is the correct *starting conditions*: the scale length that makes octave-down tuning playable at all, a bridge that holds it, and pickups with enough output to drive a front end cleanly. That is a real and non-trivial thing to hand a player. It is also about a third of the job.

The other two thirds are in the preset, and the preset is where the numbers above matter. If you want the general framework before you touch a knob, start with [how to dial in a modeler tone](/blog/how-to-dial-in-modeler-tone) and the [Helix amp model cheat sheet](/blog/helix-amp-model-cheat-sheet). If you're working in the same low-tuned, rhythmically dense territory generally, [dialing in drop-tuned high gain](/blog/dialing-in-drop-tuned-high-gain) and the [Misha Mansoor / Periphery djent tone breakdown](/blog/misha-mansoor-periphery-djent-tone) are the closest existing reference points I have.

## What I'd Want Measured

Two things, before I'd form an opinion on the instrument itself.

**One:** a frequency plot of the Open Core Classics at that scale length and tuning. Fluence's whole pitch is consistency, and I'd like to see whether the "Classic" voicing holds its midrange character when the fundamental drops an octave or whether it starts behaving like a bass pickup. That is answerable with a DI recording and an FFT, and I expect somebody will post one within the week.

**Two:** whether 22 frets on a 30" scale is a usable lead instrument or a rhythm tool with a top end you'll never visit. Not a criticism — plenty of great instruments are rhythm tools — but the marketing says "saturated leads," and 30 inches of scale plus a whole octave down is a very different left hand than the phrase implies.

The bass, for what it's worth, looks like the more conventionally excellent of the two. A 34.4"–35.5" multiscale five-string with three-voice Fluence soap bars and a two-band EQ is a well-specified working instrument at $1,599.99 regardless of whose name is on it.
