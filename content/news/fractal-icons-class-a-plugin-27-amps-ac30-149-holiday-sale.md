---
title: "Fractal ICONS: Class-A Puts 27 Vox-Family Amps in a $149 Plugin. The Cut Knob Still Works Backwards"
seo_title: "Fractal ICONS: Class-A Plugin Has 27 Vox-Style Amps"
date: "2026-11-25"
category: "new-gear"
slug: "fractal-icons-class-a-plugin-27-amps-ac30-149-holiday-sale"
excerpt: "Fractal Audio's third ICONS plugin covers the EL84 chime family: 27 amp models built around the AC30, AC15 and their boutique descendants, 19 DynaCab HD cabs, 17 drives and 148 presets. It's $149 during the holiday sale (listed against $199), with another 20% off for existing ICONS owners. Here's what's in it, what Fractal hasn't said, and where to set the knobs on the amp type that confuses the most people."
source_url: "https://www.fractalaudio.com/icons-class-a"
image_url: ""
author_slug: "viktor-kessler"
---

Fractal Audio announced ICONS: Class-A on November 24. It is the third plugin in the ICONS series, after Fullerton (American amps) and Pasadena (the 5150 family), and it covers the amp family I spend the least time with: EL84 combos, no negative feedback, the chime sound.

I'm the high-gain writer here, so I'll stick to what can be checked. The details below come from Fractal's product page and its forum announcement. Where neither says something, I've marked it.

## What's Confirmed

- **Amps:** 27 models. Fractal's page names most of them under its usual stand-in names: Class-A 30W (Normal, Top Boost, Brilliant and Hot), Class-A 15W TB, AC-20 (12AX7 and EF86 versions), Matchbox Chiefman and D-30, Suhr Badger 30 and 18, Wrecker Liverpool and Rocket, Citrus A30, Division 13 FT37 and CJ, Mr Z MZ-38 and MZ-8, Blankenship Leeds, plus a handful more
- **Cabs:** 19 DynaCab HD cabs, including a 1x12 Blue and a 2x12 Pre-Rola. A User Cab mode gives you two slots for third-party IRs
- **Drives and effects:** 17 drive pedals including a treble booster, plus compression, EQ, chorus, vibe, tape delay, spring reverb, a shimmer reverb and a rotary
- **Presets:** 148
- **Formats:** AU, VST3 and AAX, plus a standalone app for macOS and Windows
- **Modeling version:** synced to Axe-Fx III firmware 33
- **Price:** $149 during Fractal's holiday sale, shown against a struck-through $199
- **Owner discount:** existing ICONS owners get an extra 20% off the sale price, applied at checkout. One forum user reports paying $119.20, which matches the arithmetic

## What Fractal Hasn't Said

- When the holiday sale ends
- System requirements
- Whether there is a trial
- How licensing and activation work
- A bundle price that includes Class-A alongside Fullerton and Pasadena

One early install note from the forum: a user who unchecked AAX during installation reported getting presets for only two amps, and fixed it by reinstalling with every component selected. That's a single report, not a confirmed bug. If your preset list looks short, try that first.

## Why This Matters If You Own Fractal Hardware

Two things line up here.

First, the plugin's amp modeling is synced to [firmware 33](/news/fractal-axe-fx-iii-firmware-33-nam-a2-player-tone3000-axe-edit), the same generation running on a current Axe-Fx III. Fractal says ICONS is not a software Axe-Fx, and the routing is deliberately simpler. But the amp block is the part that matters for tone, and a setting you find on the Class-A 30W TB in the plugin should be a sensible starting point on the same model in your hardware.

Second, the AM4 is getting the same cabs. AM4 firmware 3.00 Beta 4, posted on November 18, lists 13 new DynaCabs including a 2x12 Class-A 30W Pre-Rola and a 4x12 Citrus. It's a beta, so I'd wait for the release build before loading it on a gigging unit, but the direction is clear: Fractal's Vox-family content is being refreshed across the line at once.

Our [Fractal platform page](/platforms/fractal) has the existing recipes if you want to see where these models already appear.

## The Settings Layer: This Amp Type Does Not Behave Like a Marshall

Most of the wrong AC30 settings I see come from treating it like any other amp. There are three specific differences, and they apply to every Top Boost model in this plugin and to the Vox models in every other modeler.

**1. The Cut knob runs in reverse.** Cut is a treble cut in the power section. Turning it up removes highs. If the amp sounds harsh and you turn Cut down, you've made it brighter. Our [Cut knob explainer](/blog/vox-ac30-cut-knob-explained) covers the circuit.

**2. Treble and Bass interact.** On the Top Boost channel the two controls aren't independent, and both scoop mids as they go up. Settings that look low on paper, with Bass around 3, are normal. Bass at 6 on a Top Boost amp is usually mud.

**3. There is no negative feedback.** That's a large part of why the amp feels loose and compresses early, and it's why there's no Presence control. The power amp is doing more of the work than you'd expect, so master volume changes the tone and not only the level. The background is in [Class A vs Class AB](/blog/class-a-vs-class-ab-amp) and our piece on [EL84 character](/blog/el84-tube-character-ac30-boutique).

A reasonable edge-of-breakup starting point on a Top Boost model, on a 0–10 scale:

| Control | Start here | Then adjust |
|---|---|---|
| Drive / Gain | 4 to 5 | Down for single-note clean parts, up until chords just start to grit |
| Bass | 3 | Rarely above 4 |
| Treble | 5 to 6 | This is your brightness control, more than Cut |
| Cut | 4 to 5 | Up to tame fizz, remembering it works backwards |
| Master | High | The power amp is part of the sound |

Treat those as a place to begin and not as measured values. Pickups and cab choice will move them. The full walkthrough is in the [AC30 settings guide](/blog/vox-ac30-settings-guide).

### Same Amps on a Helix

If you're on Line 6 hardware you already have most of this family. Essex A30 is the Top Boost AC30, Essex A15 is the AC15, the A30 Fawn models are the non-Top Boost circuit, and the Matchstick models are the Matchless DC-30 that Fractal calls Matchbox. Helix amp blocks use the same 0–10 scale, so the table above carries over directly. For worship players, where this amp family is close to the default, start with the [Helix worship tone guide](/blog/worship-guitar-tone-helix).

### Which Cab to Load First

The plugin leads with two speaker options, the Blue and the Pre-Rola. They are not subtle variations. The Blue is the bright, early-compressing one associated with the classic AC30 sound, and the Pre-Rola Greenback is darker with more low-mid. If the Blue cab is too sharp through your monitors, switch speakers before you reach for EQ. We compared the two in a worship context in [Alnico Blue vs Greenback](/blog/alnico-blue-vs-greenback-ac30-worship).

## Where It Sits

This is the third hardware modeling company to move its amps into a DAW this year. Line 6 released [Helix Stadium Native Intro](/news/line6-helix-stadium-native-intro-free-plugin) for free in August, and Kemper shipped [Profiler Native](/news/kemper-profiler-native-plugin-249-euro-au-vst3-clap-no-aax) the same day Fractal announced Class-A. Fractal's approach is the narrowest of the three: one amp family per plugin, sold separately.

That makes the buying decision simple. If the AC30 family is what you play, $149 buys 27 variations of it with matched cabs. If you want one plugin that covers everything, this isn't built to be that. And if you'd rather have the sound in hardware, Tone King's [Royce preamp pedal](/news/tone-king-royce-ac30-tube-preamp-pedal-600) is the analog route to the same place.

The missing trial information is the gap I'd want closed before buying. Check the product page for one before you pay.
