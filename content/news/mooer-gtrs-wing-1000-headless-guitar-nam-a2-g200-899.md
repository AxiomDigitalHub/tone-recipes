---
title: "Mooer's GTRS Wing 1000 Puts NAM in a Headless Guitar for €899. The Sources Disagree on Which NAM Files It Loads"
seo_title: "Mooer GTRS Wing 1000: Headless Guitar With NAM, €899"
date: "2026-11-27"
category: "new-gear"
slug: "mooer-gtrs-wing-1000-headless-guitar-nam-a2-g200-899"
excerpt: "Mooer's GTRS Wing 1000 is a fanned-fret headless guitar with a modeler inside it: amp and cab models, 40 slots for captures and IRs, a 10-hour battery and USB-C recording. It's orderable at Thomann for €899. Three write-ups give three slightly different spec sheets, including whether it loads NAM A1 files or only A2 Lite. Here's what's settled, what isn't, and how to build presets on a rig you can only edit from a phone."
source_url: "https://www.gearnews.com/mooer-gtrs-wing-1000/"
image_url: ""
author_slug: "jess-kowalski"
---

Mooer's GTRS line builds a multi-effects unit into the guitar. The newest one, the **GTRS Wing 1000** (Mooer also calls it the W1000), is a headless, fanned-fret model with a new processor called the G200 and support for Neural Amp Modeler captures. Gearnews reported on November 27 that it's available to order at Thomann for **$825 / £766 / €899** with a gig bag.

A note on timing. Mooer's German distributor, W-Distribution, posted its announcement on November 4, so this isn't a today-only reveal. What's new this week is that it's orderable and that outlets have started writing it up. They don't fully agree with each other, which is the reason to read the fine print before you spend €899.

## What Every Source Agrees On

- **Body and neck:** alder body, five-piece roasted flame maple and rosewood bolt-on neck, satin finish, C profile
- **Fretboard:** rosewood, 12-inch radius, 24 stainless steel fanned frets, zero fret, 42 mm bone nut
- **Bridge:** GTRS HL-II headless
- **Pickups:** GTRS HM-2N and HM-2B humbuckers with volume, tone and a three-way switch
- **Processor:** G200, with amp and cab modeling, effects, guitar simulations and synth models
- **Captures:** NAM support, plus Mooer's own MNRS format
- **Motion control:** a 6-axis sensor that maps guitar movement to effect parameters
- **Battery:** 4000 mAh, about 10 hours, charged over USB-C
- **Connections:** USB-C for charging and recording, Bluetooth 5.0 for audio playback and the app, a headphone-capable output
- **Passive mode:** switch the electronics off and it works as a normal two-humbucker guitar into a normal amp

That last one matters more than it sounds. If the battery dies at a gig or the app stops cooperating, you still have a guitar.

## Where the Sources Disagree

I read three write-ups: Gearnews, the W-Distribution announcement, and Noise Harmony, which quotes Thomann's listing and Mooer's spec list. Here's where they split.

| Spec | Gearnews | W-Distribution | Noise Harmony |
|---|---|---|---|
| NAM formats | A1 and A2 | A2 Lite | A2 Lite `.nam` files only |
| Effect count | 229 | 224 | not stated |
| Scale length | 25.1 inches | "multi-scale" | 640–648 mm (25.2–25.5 in) per Thomann |
| Finishes | Blue Sparkle Burst | Cosmic Blue, Dark Matter | Cosmic Blue, Dark Matter |
| Looper | not stated | 80 minutes | 80 seconds, 10 slots |

Most of these are small. The NAM row isn't.

## The NAM Question

A2 Lite is the cut-down version of NAM's newer architecture, built for inexpensive embedded chips. Dev's [A2 explainer](/news/tone3000-nam-architecture-2-a2-open-source-modeling) covers the split between Lite and Full. If the Wing 1000 loads A2 Lite only, then the large back catalog of older A1 captures on TONE3000 won't load unless someone has re-trained them as A2 Lite.

Two of three sources say A2 Lite, and one of those is the distributor. Noise Harmony adds a detail that fits: NAM A2 import for the G200 arrived in Mooer's GTRS Studio desktop software with version 1.2.1 in July 2026. So I'd plan on A2 Lite and treat A1 support as unconfirmed until Mooer's own documentation says otherwise.

What to do about it:

1. **Check the file type before you download.** TONE3000 listings aren't labeled consistently. It's the same catch we flagged on the [Mooer Future Flex](/news/mooer-future-flex-209-battery-modeler-stereo-speakers-nam-a2) last week.
2. **Know whether a capture is amp-only or full-rig.** Amp-only captures need a cab IR after them. Full-rig captures already include the cab, so turn the cab block off or you'll stack two.
3. **Budget your slots.** Gearnews reports 40 slots shared between captures and IRs. That's enough if you're picky. Three or four amps and two or three cabs covers most players. Our [IR guide](/blog/impulse-response-ir-guide) helps with the cab side.

One more reported detail: the IR loader uses 1024-point files. At 48 kHz that's about 21 milliseconds, which is plenty for a close-mic'd cab and too short for room sound. If you load a long IR, expect it to be cut down. The [long IR post](/blog/long-ir-500ms-room-mic-capture-what-it-adds) explains what gets lost.

## Building Presets on a Guitar

The workflow is the unusual part. Captures and IRs go in from a computer over USB-C using GTRS Studio. Tone editing happens in the GTRS phone app. The guitar itself has one multi-function knob. So you build at home and tweak from your phone. There's no screen or row of knobs on the instrument.

Three things follow from that.

**Dial for where it'll be heard.** Most people will use this through headphones, since that's the point of a guitar with a rig in it. A preset built in headphones will be too dark and too bassy through a PA or an amp's return. Our [headphones vs. room post](/blog/tone-good-in-headphones-bad-in-room) has the fix. Keep a second copy of any preset you plan to play through speakers, and start that copy with less gain and a low cut around 80–100 Hz.

**Stereo needs a split cable.** The output is a 6.35 mm TRS jack. Plug in a regular guitar cable and you get one side. If you've built ping-pong delays or stereo reverbs, you need a TRS-to-dual-mono cable to hear them through two channels.

**Motion control needs a footswitch.** According to Thomann's listing as quoted by Noise Harmony, the Motion Expression feature requires Mooer's F4 or the GTRS GWF4 wireless footswitch. Gearnews lists the GWF4 at $52 / €57. Add that to the price if tilting the guitar to open a wah is why you want this.

## Who It's For

I go direct from an HX Stomp, so I have a bias. A floor unit gives you footswitches, bigger presets and something you can adjust mid-set with your shoe. A guitar with one knob doesn't.

The Wing 1000 makes sense as a travel and practice rig: a headless guitar and a pair of headphones, with no pedalboard or power strip to pack. It also works as a backup. If your main rig fails, you plug the guitar's output into the PA and you still have an amp sound.

Whether the guitar is good, nobody independent has said yet. I haven't seen a published review with measurements or a long-term report on the frets, the bridge or the electronics. The prices also vary. Gearnews quotes £766 at Thomann, and a search listing showed a UK retailer at £599, which I couldn't confirm is current. Shop around before paying the first number you see.

## Bottom Line

- **What:** Mooer GTRS Wing 1000 (W1000), a headless fanned-fret guitar with a G200 modeler built in
- **Price:** $825 / £766 / €899 at Thomann, gig bag included
- **NAM:** probably A2 Lite only. Confirm in Mooer's documentation before assuming older A1 captures will load
- **Check before buying:** exact scale lengths, the looper's real capacity, and whether the finish you want is the one in stock
- **Tone takeaway:** build one preset for headphones and a second for speakers, keep the capture list short, and bring a TRS split cable if you use stereo effects
