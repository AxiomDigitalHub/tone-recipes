---
title: "Orange's New $249 Baby Terror Is 20 Solid-State Watts With No Cab Sim on the DI — Which Makes It a Modeler Player's Amp, Not a Purist's"
date: "2026-07-29"
category: "new-gear"
slug: "orange-baby-terror-20-watt-jfet-lunchbox-head"
excerpt: "The Baby Terror is a 1.5 kg, 20-watt JFET lunchbox head with a three-band EQ, presence, a footswitchable second volume, and a low-end 'Tubby' switch — $249/£199/€229, out today. The spec everyone is skipping is the one that matters most: the balanced XLR out carries no cabinet emulation. That's not an omission, it's an invitation, and it changes who this amp is actually for."
source_url: "https://www.guitarworld.com/gear/desktop-amps/orange-baby-terror"
image_url: ""
author_slug: "hank-presswood"
---

I have opinions about solid-state amplifiers. Most of them formed behind a counter in Austin between 1994 and 2019, watching people trade in perfectly good transistor amps because somebody on a forum told them tubes were the only honest way to make noise. Those opinions have softened some. Not because I changed my mind about what a 6V6 does under a heavy right hand — I didn't — but because I finally stopped pretending that every amp is trying to be the same amp.

The **Orange Baby Terror**, which went on sale globally today, is not trying to be a tube amp. That's the most interesting thing about it, and almost every writeup I've read today has buried it under the weight spec.

## What It Is

Twenty watts, single-ended **class A JFET front end**, solid-state power. It weighs **1.5 kg** — about three and a third pounds — and measures roughly 165 × 140 × 100 mm, which is to say it fits in the outside pocket of a backpack. It runs off an external 15V supply, so there's no transformer weight in the box. It comes with a padded Orange gig bag. **$249 / £199 / €229**, available now through the usual suspects.

The front panel is more amp than the size suggests:

- **Gain**, and then **two separate Volume controls** — the second one **footswitchable**, so you can kick a lead boost without touching the gain structure. Orange's claim is that the second volume doesn't color the drive on its way up.
- A **full three-band EQ** — Bass, Middle, Treble — plus a **Presence** control. That's a real tone stack, not the single "Shape" knob you usually get at this size.
- A **Tubby switch**, which is Orange's name for a low-end contour that lets more bass through early in the signal path. On, it thickens cleans and dirty-cleans. Off, it tightens up so riffs stay articulate when the gain goes up.

Round the back: an **effects loop**, a **balanced XLR line out with ground lift**, a footswitch jack, and **8-ohm and 16-ohm speaker outputs** so you can match whatever cabinet you own.

Sarah Yule, Orange's Managing Director, framed the pitch as small not having to mean fewer features — an amp light enough to carry in one hand but serious enough to be somebody's main rig. That's marketing language, but the feature list mostly earns it. A footswitchable boost and a proper four-band voicing section on a 3-pound head is not a toy layout.

## The Spec Nobody Is Leading With

Here's the part I want you to sit with, because it determines whether this amp makes sense for you.

**The balanced XLR output has no cabinet emulation on it.** It's a line out. Orange's own framing is that you send that preamp signal into a DAW and add your own impulse responses and plug-ins for silent tracking and demos.

Now. In 2026, a DI with no speaker sim is a choice, and it cuts two ways.

If you were expecting to plug the XLR straight into a PA at a gig and hear a guitar amp, you will not. You will hear a raw, buzzy, fizzy preamp signal with a mountain of unfiltered top end above 5 kHz, because a guitar speaker is a 6 dB-per-octave brick wall and nothing in that signal path has replaced it. Every single person who has ever plugged a non-cab-sim DI into a front-of-house console has learned this in the worst possible venue.

But if you already own a modeler, an IR loader, or a plug-in — and if you're reading this site, you do — that raw line out is the *good* version. You get Orange's actual analog preamp and tone stack, uncolored by somebody else's idea of a 4x12, and then you put whatever cab you want behind it. That's a more flexible rig than a built-in cab sim would give you, and it's the reason I think this amp is more interesting to the modeler crowd than to the people it's ostensibly aimed at.

If you need to make that XLR gig-ready, [IR loader pedals for a direct rig](/blog/ir-loader-pedals-direct-rig-two-notes-boss-ir2-mooer) covers the boxes that do it — a Two Notes, a Boss IR-2, or a Mooer Radar sitting between the Baby Terror's XLR and the snake turns a fizzy line out into a usable front-of-house signal for well under the price of the amp. Same principle as [reamping a clean DI through a cab sim pedal](/blog/reamp-clean-di-through-cab-sim-pedal), just happening live instead of at the desk.

## The Tone: What a JFET Front End Actually Does

Let me translate the circuit talk, because "class A JFET" gets thrown around like it means something obvious.

A JFET is a field-effect transistor whose transfer curve happens to look a good deal like a triode's. Run one single-ended and biased into class A, and when you overdrive it you get **asymmetric clipping with a strong second-harmonic component** — which is the technical way of saying it distorts warm and musical rather than harsh and odd-order. That's why designers reach for JFETs when they want a small solid-state preamp to behave. It is genuinely closer to a tube preamp stage than a garden-variety op-amp clipper.

What it is *not* is a tube power section. The Baby Terror's 20 watts are solid-state watts, and solid-state power stages don't sag, don't compress much as they approach clipping, and don't bloom under a heavy pick attack the way a pair of EL84s does. When you crank a Micro Terror or an AC15 and feel the note swell a beat after you hit it, that's power supply sag and output-tube compression — and no JFET preamp will hand it to you. If you don't understand where in an amp your breakup is being generated, [preamp vs. power amp distortion](/blog/preamp-vs-power-amp-distortion-how-to-hear) is worth twenty minutes; it's the single most useful thing to know before you buy any small amp.

So: warm preamp drive, tight and unsagging power, and a real Orange midrange. That's the voice.

## How to Cop the Baby Terror Voice on a Modeler You Already Own

You want the honest version? The Orange preamp character isn't a mystery, and every modeler made in the last decade has at least two Orange models in the amp list. Here's the recipe.

**1. Start with a Tiny Terror or OR-model, not a Rockerverb.** The Baby Terror is a single-channel, medium-gain, midrange-forward voice — it lives in Tiny Terror / Dual Terror territory, not high-gain Rockerverb territory. On Helix, that's the **Brit Trem / Placater**-adjacent Orange models depending on your firmware; on Quad Cortex, the Orange-flavored blocks in the British family. If you can't tell which model in your amp list is which real amp, the [Helix Amp Model Cheat Sheet](/blog/helix-amp-model-cheat-sheet) maps every one of them to the actual amp behind the name.

**2. Build the Tubby switch out of a low shelf, and put it *before* the amp block.** This is the one that matters, and it's the one most people get backwards. Tubby is not a bass knob on the tone stack — it lets more low end through *early in the signal path*, which means it hits the gain stage with more bottom and changes how the amp clips, not just how it sounds afterward. To replicate it: drop a **low-shelf EQ ahead of your amp block**, +3 to +4 dB below about 150 Hz. Now A/B it with the shelf bypassed and you'll hear exactly what Tubby does — fuller and rounder on cleans, muddier when the gain climbs. That's why Orange gave you a switch to turn it off for riffs. The general principle of where in the chain your EQ lands is the whole subject of the [EQ pedal placement guide](/blog/eq-pedal-placement), and it's the difference between shaping tone and shaping *distortion*.

**3. Set the gain low and use the second volume as the boost.** The Baby Terror's whole lead-tone concept is a clean level jump that doesn't touch gain structure. On a modeler, that means: **do not** use a drive pedal block for your solo boost. Use a **volume or clean-boost block after the amp**, +3 to +5 dB, footswitched. That preserves the exact drive character and just makes it louder, which is what Orange built into the hardware. [Clean boost vs. overdrive vs. volume pedal for a solo boost](/blog/clean-boost-vs-overdrive-vs-volume-pedal-solo-boost) walks through why those three do very different things to the same signal.

**4. Presence is a power-amp control — reach for it last.** On a real amp, presence is a negative-feedback control in the power section, not another treble knob. On most modelers it's modeled as exactly that, which is why turning it up adds *aggression* and pick attack rather than just brightness. Set your three-band first, get the amp sitting right, then use presence to decide how hard it bites. If your amp block's controls aren't behaving the way you expect, [what gain, volume, and master actually do](/blog/amp-gain-volume-master-controls) is the ground floor.

**5. Cab: a 1x12 or 2x12 with a Celestion Vintage 30 or a Creamback, mic slightly off-center.** Orange's house sound is a closed-back cab and a V30's aggressive upper-mid peak. A 4x12 IR will get you the big stack version; a 2x12 keeps the lunchbox proportions. Off-center on the cone keeps the top end from getting spiky.

That gets you the Baby Terror voice through headphones, an interface, or an [FRFR cab](/blog/best-frfr-speakers-for-modelers) tonight, at any volume, for nothing you don't already own.

## So Should You Buy It

Twenty-five years behind a counter taught me to answer this question by asking what problem the customer actually has, so here are the three versions.

**If you want a small amp that will drive a real cabinet in a rehearsal room:** yes, this is a good buy. Twenty solid-state watts into a 2x12 is genuinely loud enough to hold a spot next to a drummer, the 8/16-ohm outputs mean it'll match anything, and $249 with a gig bag is a fair number. Solid-state also means no bias, no retubes, no tubes rattling loose in the back of a car. That's a real ownership advantage, not a consolation prize.

**If you want tube feel:** no, and don't let the JFET marketing convince you otherwise. The preamp will clip pleasantly. The power section will not sag, will not bloom, and will not reward you for hitting the strings harder in the way a cranked EL84 does. If that dynamic is what you're chasing, save up. This is not the amp, and Orange isn't claiming it is.

**If you already own a modeler and you're thinking about this as a second rig:** here's where I'd actually put my money, and it's the version of this article that most of you need. You do not need the Baby Terror to make Orange sounds — you already have Orange models sitting in your unit, and the recipe above will get you 90% there tonight. What the Baby Terror gives you that your modeler doesn't is *an analog front end you can put in front of things*: a real JFET preamp with a real tone stack, feeding a raw line out you can send anywhere. Into an IR loader for a gig. Into an interface for tracking. Into the return of your modeler's [effects loop](/blog/series-vs-parallel-effects-loop) if you want the Orange preamp with your modeler's time-based effects behind it.

That's a legitimately useful tool, and at $249 it's cheaper than most of the pedals that try to do the same job. Just buy it for that reason — not because it's small, and not because somebody told you a transistor is a tube if you squint at the transfer curve. It isn't. But it's an honest amp with an honest output jack, and after twenty-five years of watching people buy the wrong thing for the right reasons, I'll take honest.
