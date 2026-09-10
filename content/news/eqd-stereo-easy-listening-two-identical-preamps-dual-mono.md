---
title: "EarthQuaker's $249 Stereo Easy Listening Runs Two Identical Preamps — Which Is Not the Same Thing as Stereo"
date: "2026-09-10"
category: "new-gear"
slug: "eqd-stereo-easy-listening-two-identical-preamps-dual-mono"
excerpt: "Announced September 10: an all-analog amp and cab simulator with a three-band active EQ, dual XLR outs, an aux input, and $249 on the tag. EQD says plugging a mono signal into the left input feeds two identical independent preamps. Two identical preamps fed the same signal is dual mono, and the difference matters more than the price does."
source_url: "https://www.earthquakerdevices.com/stereo-easy-listening"
image_url: ""
author_slug: "margot-thiessen"
---

EarthQuaker Devices announced the **Stereo Easy Listening** today — **$249 US MAP**, €265 through Thomann, up for preorder now. It is an all-analog preamp and speaker-cabinet simulator in a 5 x 2.75 x 2.5-inch enclosure, and it is the grown-up version of a pedal I have quietly recommended to about a dozen students.

The original **Easy Listening** arrived in summer 2025 at $99 with exactly one knob on it. One knob — Level — a mono ¼" input, a TRS headphone output, and a circuit EQD said was voiced after "one of our favorite classic American guitar amps: a '65 Deluxe." Which is my amp, so I paid attention. It was a headphone box that happened to sound good.

The stereo version adds most of what people asked for. **Dual ¼" inputs. Dual XLR outputs.** A **stereo TRS headphone jack.** An **aux input with its own level control** that bypasses the preamp and cab sim entirely, so backing tracks and a drum machine come through clean. And an **active three-band EQ** — Bass, Middle, Treble — where the mono original had nothing at all. EQD describes the foundational voice this time as the mid-scooped warmth of a classic American amplifier rather than naming the Deluxe outright.

It also draws **200 mA**, up from 75 on the mono version. Hold that number; I'll come back to it, because it's the spec most likely to ruin someone's afternoon.

## Two Identical Preamps Is Dual Mono

Here is the sentence in EQD's own copy that decides how you should think about this pedal: *"Running mono? Plug into the Left input and Stereo Easy Listening automatically converts your signal to stereo, giving you the massive sound of two separate amps."* The trade press describes the mechanism plainly — a mono signal at the left input is fed to **two identical, independent preamps**, each with its own analog cabinet simulation.

Two identical circuits, receiving the same signal, producing the same output. That is dual mono. It is not stereo.

I want to be careful here, because "dual mono" gets used as an insult and I don't mean it as one. Two independent analog signal paths is a real thing to build and a real thing to hear. Each preamp has its own noise floor, its own component tolerances, its own tiny deviations — so the two sides are never bit-identical the way a digital split is, and that microscopic decorrelation is probably some of what people describe as bigness. You are also getting two genuinely separate outputs to two genuinely separate destinations, which is worth something at front of house.

What you are not getting is a stereo image. There is no delay between the sides, no modulation, no phase or EQ offset — nothing that gives your ears a reason to place anything anywhere. Width in a guitar rig comes from **time and difference**, and this box supplies neither on its own. Our [stereo signal chain architecture guide](/blog/stereo-signal-chain-architecture) lays out the rule I keep coming back to: dirt is mono, time is stereo, and the split point is the modulation block. Stereo Easy Listening sits *after* everything, at the output stage. It cannot manufacture a split that never happened upstream.

This is also why "two separate amps" is doing a lot of work in that sentence. Two amps in a room sound wide because they're in different physical places, moving different air, with different speakers and different distances to your ears. Two identical preamps into one pair of headphones is a different phenomenon entirely, and if you have ever chased [stereo width that survives a mono sum](/blog/stereo-width-tricks-that-survive-mono), you already know the difference between a wide image and a loud one.

## The Real Stereo Use Case, and the Cab Sim Trap Inside It

So feed it two different signals. That is the version of this pedal that actually earns the word stereo on the front, and it is the version I think most people reading this will end up building.

Take your Helix or your Quad Cortex, run its left and right outs into the two ¼" inputs, and now each preamp has something distinct to work with — your stereo delay, your stereo reverb, your dual-amp panning. Real differences arrive, the two analog paths carry them separately, and the XLRs deliver a genuine image to the desk.

But look at what you just built. Your modeler's preset ends in a cab block or an IR. Stereo Easy Listening begins with a speaker-cabinet simulation. **You are now running a cab sim into a cab sim**, which is two low-pass filters, two sets of resonant peaks, and two rolled-off top ends stacked on the same signal. It sounds exactly like what it is: muffled, boxy, and mysteriously dead in the upper mids. Every time somebody tells me their modeler sounds fine in headphones and terrible through some new box, this is the first thing I ask about.

The fix is the one Sean walks through in [disabling the cab IR for a voiced FRFR](/blog/disable-cab-ir-for-voiced-frfr-preset-rebuild), and the logic transfers directly. If the analog cab sim in this pedal is providing the speaker, **your preset has to stop providing one.** Bypass the cab or IR block at the end of the chain, then rebuild — because a preset voiced with a cab block in it is not a preset that's ready to have that block removed. You will need to bring the high end back down with a high cut somewhere around 6 to 8 kHz to replace the rolloff the IR was doing, re-balance the amp block's treble, and reset your output level, since pulling an IR usually changes gain by a few dB.

Or don't, and go the other direction: leave your presets alone, accept that this is a mono practice and DI box, and use the left input only. That's a legitimate choice and it's cheaper in effort. What isn't legitimate is stacking the two and blaming the pedal.

## An Active EQ on a Cut-Only Voice

The three-band EQ is the addition I find most interesting, and EQD published the crossover points in the manual, which I appreciate more than I can express: **Bass handles up to 500 Hz. Middle covers 500 Hz to 2 kHz. Treble takes 2 kHz and up.**

Notice that it's an *active* EQ. That word matters, and it puts this circuit in a different category from the amp it evokes.

A blackface Fender tone stack is passive. It has no gain of its own — it can only take frequencies away, which is why, as our [Deluxe Reverb settings guide](/blog/fender-deluxe-reverb-settings) puts it, all three controls at noon already means some natural midrange scoop is baked in. You are not adding mids on that amp. You are choosing how much of everything else to remove. That constraint is not a flaw; it is a substantial part of why the amp sounds the way it does, and it is why the tone controls interact with each other and with the Volume knob instead of behaving like independent sliders.

An active three-band with fixed crossovers behaves nothing like that. Bands boost as well as cut, they're more independent of one another, and turning Middle up **adds** 500 Hz to 2 kHz rather than declining to remove it. So this pedal can do something the circuit it references physically cannot: put midrange back into a mid-scooped voice. If you have ever wanted a Deluxe that could get honky and forward for a single song, this is a $249 box that will do it, and there is no vintage-correct way to get there.

The practical translation, if you're chasing this on a modeler instead of buying the pedal: **do not go turn your amp block's Mid knob up.** A well-modeled Fender tone stack reproduces the passive interaction, mid included, which means that knob has limited leverage by design — that's the amp being right, not the model being weak. Put a separate **three-band or parametric EQ block after the amp**, set the bands near 500 Hz and 2 kHz, and boost there. That's the same architecture EQD built, in the order they built it, and it's the difference between fighting a tone stack and adding a stage after it. Our [EQ pedal placement guide](/blog/eq-pedal-placement) covers why post-amp and pre-amp EQ are two different tools rather than two settings of one.

## "Zero Latency" Is True, and Mostly Not the Reason

EQD's copy promises zero latency and no harsh digital artifacts, and both claims are literally accurate — it's an analog circuit, there is no converter, there is no buffer.

I'd just rather nobody bought this pedal for that reason, because Viktor already measured the thing it's implicitly compared against. His work on [latency in cab-sim and IR loader pedals](/blog/ir-loader-cab-sim-pedal-latency-how-much-you-can-hear) lands where these arguments usually land: the numbers are far smaller than the forums claim, and they rarely lag your playing in a way you can identify blind. If digital cab sim latency were a real problem for your rig, you would have discovered that before reading a press release.

The honest case for analog here isn't latency. It's that there is no menu. One voice, three tone controls, a level knob, and no preset to manage — which for a certain kind of practice session is the entire point. I teach adult beginners, and the number of them who have stalled out on a $200 modeler because the interface asked them to make forty decisions before making a sound is not small. A box with four knobs on it is a different relationship with the instrument. That's worth $249 to some people and worth nothing to others, and it has nothing to do with samples.

## The 200 Milliamp Problem

Back to that number, because it's the one that will actually bite someone.

**200 mA at 9V DC, 2.1mm negative center**, and EQD's manual is emphatic: do not run it at higher voltages. A great many isolated pedalboard supplies provide 100 mA per output. Some provide 250 on one or two outputs and 100 on the rest. If you plug this into a 100 mA output it may run, it may run badly, or it may sag and add noise in ways you'll spend a week blaming on your cables — I have done exactly that, and I'd rather you didn't.

Check your supply's per-output rating before it arrives, not after, and if you need to think through [pedalboard power supply isolation](/blog/pedalboard-power-supply-isolation) and which outputs can actually carry this, the guide is there. Daisy-chaining it off a one-spot with three other pedals is not going to work.

One more note on the XLRs: EQD's product page doesn't mention a ground lift, though gearnews reported one in their coverage today. If it's there, good — that's the switch you want when the desk and your board are on different circuits. If it isn't, and you get hum the first time you plug both XLRs into a house console, that's a ground loop and not a defect, and [ground lift versus transformer isolation](/blog/ground-lift-vs-transformer-isolation-wet-dry-wet-hum) explains which of the two fixes it.

## What It Feels Like at 11 PM on a Wednesday

I keep a Jazzmaster on a stand next to my desk, and the reason I have played it most nights for years is that my '65 reissue is not an option after about nine o'clock. Everything about this pedal is aimed at that hour: an aux input with its own level so a backing track sits behind you instead of over you, a headphone jack that doesn't route through a laptop, and a preamp that gives you a recognizable American clean the instant you plug in.

That's a genuinely good product, and it is the thing I'd buy it for. Just buy it for that, and not for the word on the front of the box. If you want stereo, you have to bring the stereo with you — from a modeler's L/R, from a stereo delay, from something that creates a difference between the two sides — and then you have to go turn off a cab block to make room for the one you just bought. Do those two things and this is a lovely output stage.

Plug a mono guitar into the left input and turn it up, and what you'll hear is a very nice American clean, twice, at the same time.
