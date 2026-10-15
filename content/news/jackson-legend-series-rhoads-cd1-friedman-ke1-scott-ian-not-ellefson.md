---
title: "Jackson's Legend Series Rebuilds Rhoads' Concorde, Friedman's Kelly, Scott Ian's 'NOT' and Ellefson's First Five-String. The Rhoads Guitar Is the One That Will Break Your Crazy Train Preset"
date: "2026-10-15"
category: "new-gear"
slug: "jackson-legend-series-rhoads-cd1-friedman-ke1-scott-ian-not-ellefson"
excerpt: "Jackson announced four limited-edition Legend Series signature instruments on October 14: a Randy Rhoads CD1 ($2,499.99), a Marty Friedman Kelly KE-1 ($2,299.99), a Scott Ian Rhoads RR22 'NOT' ($2,199.99) and a David Ellefson CB V five-string bass ($2,499.99). Each one recreates an instrument Jackson originally built for the artist. If you want the Rhoads tone, there's a catch: the Concorde isn't the guitar on Blizzard of Ozz, and its JB bridge pickup runs hotter than what Randy actually tracked with. Here's how to re-stage your preset for it."
source_url: "https://blabbermouth.net/news/jackson-unveils-legend-series-signature-guitars-for-randy-rhoads-scott-ian-david-ellefson-and-marty-friedman"
image_url: ""
author_slug: "viktor-kessler"
---

Jackson announced the **Legend Series** on **October 14**: four limited-edition signature instruments, each one a recreation of something Jackson originally built for the artist. Jackson hasn't published production numbers or ship dates. The announcement points buyers to retail partners listed at jacksonguitars.com.

These are the specs Jackson has released. Where it hasn't published a spec, I've marked it as unpublished instead of filling it in.

## The Four Instruments

| Model | MSRP (USD) | Body / Neck | Pickups | Bridge |
|---|---|---|---|---|
| **Randy Rhoads CD1** | $2,499.99 | Alder; graphite-reinforced maple neck; bound ebony board, 22 jumbo frets, 12"–16" compound radius | Seymour Duncan **JB** (bridge) / **'59** (neck) | Vintage-style six-saddle tremolo |
| **Marty Friedman Kelly KE-1** | $2,299.99 | Alder; three-piece maple neck-through; ebony, 24 jumbo frets, 12"–16" compound | Single Seymour Duncan **JB** | **Kahler 7330 fixed** |
| **Scott Ian Rhoads RR22 "NOT"** | $2,199.99 | Alder; three-piece maple neck-through with graphite reinforcement | *Not published* | Top-mount **Floyd Rose 1000** |
| **David Ellefson CB V Concert Bass** | $2,499.99 | Alder; three-piece quartersawn maple neck-through with graphite rods; ebony, 12"–16" compound | **EMG 40DC** + CS active, 3-band EQ | Jackson HiMass five-string |

The details that make them replicas:

- **CD1:** ivory with black pinstripes, gold hardware, black headstock with gold lettering, two volumes, two tones and a three-way toggle. Jackson says it revives a V shape that used to be Custom Shop only.
- **KE-1:** built from the original sample, down to Friedman's white "1" on the body.
- **RR22:** the "NOT" body graphics, as on Ian's original.
- **CB V:** gloss black with all-black hardware. It reproduces the first five-string Jackson ever built, made for Ellefson's 1990 tour.

International pricing is £1,849–£1,899 and €2,199–€2,249 across the range.

Scale lengths haven't been published for any of the four. Jackson's Rhoads-family guitars have historically been 25.5", and that matters for one of the points below. I'll update this article when Jackson confirms the figure.

## The Rhoads Problem: This Isn't the Guitar on the Record

This affects your presets directly, and the press release doesn't mention it.

The Concorde is the shape everyone associates with Randy Rhoads. It isn't what he recorded *Blizzard of Ozz* with. Our [Crazy Train lead recipe](/recipe/rhoads-crazy-train-lead) is built on his **white Les Paul Custom**: 24.75" scale, PAF-style humbuckers, into an MXR Distortion+ and a cranked Marshall Super Lead. Our [Diary of a Madman](/recipe/rhoads-diary-of-a-madman) and [Flying High Again solo](/recipe/rhoads-flying-high-again-solo) recipes are built on the **Karl Sandoval polka-dot V**. That's also 24.75", with a PAF-style bridge humbucker. In both cases the recording guitar had a vintage-output humbucker on a Gibson-length scale.

The CD1 differs from that on two measurable counts.

**1. The JB is hotter than a PAF.** A Seymour Duncan JB has a noticeably higher DC resistance and output than a vintage-voiced PAF, and it has a pronounced upper-mid push. Rhoads' recorded tone already gets its gain from three stages: the Distortion+, the Marshall's preamp, and a wah parked as a fixed filter. Add a hotter pickup and every one of those stages clips earlier. You'll hear the fast alternate-picked passages in the Crazy Train intro lose note separation first. That separation is the reason the recipe keeps the Distortion+ at **6**, not 10.

If you load our recipe and play it with a CD1:

- **Take the Distortion+ block's Distortion from 6 to about 4.5.** Leave Output at 7 so the Marshall still gets pushed.
- **Lower the Super Lead's Volume I from 8 to about 7.** Judge the result on the intro riff, not on a held note. Held notes hide over-saturation. Fast sixteenths expose it.
- **Re-check the noise gate.** More output raises the noise floor along with the signal, so a threshold that was right for a Les Paul will now cut off note tails. [Threshold and decay for high gain](/blog/noise-gate-threshold-decay-settings-high-gain) covers how to re-set it.

If you'd rather compensate before the amp than change the recipe, set an input trim or a level block about 3 dB down. Then you can swap between a Les Paul and the CD1 without editing the preset. [One modeler, two guitars, different output levels](/blog/one-modeler-two-guitars-different-output-levels) walks through doing that per guitar.

**2. If it's 25.5", the low end tightens and the top gets brighter.** A longer scale means higher string tension at the same gauge. That tightens palm mutes and adds top-end attack. Rhoads' recipes are set up for 24.75" and .009s, so a 25.5" CD1 will sound **brighter and stiffer** through the same blocks. **Take Presence down from 7 to about 6** before you change anything else. Presence acts on the power amp's negative feedback, and that's where the extra fizz from a longer scale stacks up. Treble interacts with the wah peak, so leave it alone until Presence is sorted.

None of this is a criticism of the guitar. A JB in a 25.5" alder V is a very good metal guitar. It's a different input than the one in the recipe, and the recipe was calibrated on the original.

## Marty Friedman KE-1: One Pickup, Fixed Bridge, Fewer Variables

The KE-1 is the simplest of the four to stage: one JB, a **fixed** Kahler, no neck pickup and no selector. With no neck pickup, your clean and edge-of-breakup sounds come from the **volume knob**. That means the high-gain amp block has to clean up when you roll it back. Build the lead preset first. Then roll the guitar volume to about 6 and check that the amp still sounds like an amp and not a fuzz. If it doesn't clean up, the issue is too much gain into the amp, not the guitar. Use a [Tube Screamer in front of the high-gain block](/blog/tube-screamer-before-high-gain-amp) with Gain near zero and Level up, and pull the amp's own gain down. That combination gives back more volume-knob range than adding gain anywhere else in the chain.

The fixed Kahler is worth noting for one more reason: no floating trem means no tuning drift when you bend one string against another. That's how Friedman plays, with the exotic-scale bends and the oblique bends against a held note. Your harmonizer and pitch blocks track a stable string better than one that moves.

We don't have a Megadeth recipe on F&K yet. I won't guess the *Rust in Peace* signal chain in a news article. When we build that recipe, it'll go through the same attribution check as everything else.

## Scott Ian RR22 "NOT" and the Ellefson CB V

**RR22:** Jackson hasn't published the pickups, so I can't give you a gain-staging change yet. What I can confirm is the **top-mount Floyd Rose 1000**. If this is your first Floyd, read [the setup guide](/blog/floyd-rose-setup-guide) before it arrives. Ian's playing is all downpicked rhythm, so you'll need to get the spring tension right for your string gauge, or the bridge will drift sharp every time you dig in.

**CB V bass:** the **EMG 40DC is active**, and the onboard 3-band EQ is active too. An active bass into a modeler's instrument input can clip the converter even when the amp block sounds clean. If the low B sounds "farty" on hard notes regardless of amp settings, the problem is the input, not the amp. Pad the input or turn down the bass's master volume, and leave the onboard EQ flat until the rig is staged. Then use the onboard bass knob as a performance control, not a fix.

## The Short Version

- **Randy Rhoads CD1:** buy it for the shape and the history. If you want the record tone, pull our recipe's Distortion+ to about 4.5, Volume I to about 7 and Presence to about 6, then re-gate.
- **Marty Friedman KE-1:** stage the amp so it cleans up from the volume knob, because that's your only control.
- **Scott Ian NOT:** wait for pickup specs. Set up the Floyd properly.
- **David Ellefson CB V:** pad the input before you blame the amp model.

Every one of these is a measurable change from the preset you already have. Measure first, then turn knobs.

*Sources: [Blabbermouth](https://blabbermouth.net/news/jackson-unveils-legend-series-signature-guitars-for-randy-rhoads-scott-ian-david-ellefson-and-marty-friedman), [MusicRadar](https://www.musicradar.com/guitars/jackson-legends-series-randy-rhoads-scott-ian-marty-friedman-david-ellefson). More on Randy's rig: [Randy Rhoads tone recipes](/artist/randy-rhoads).*
