---
title: "Fender's November Tone Master Pro Firmware Rebuilds the Virtual Capo and Makes the Greer Lightspeed Official"
seo_title: "Tone Master Pro Firmware Rebuilds the Virtual Capo"
date: "2026-11-18"
category: "firmware-update"
slug: "fender-tone-master-pro-november-2026-virtual-capo-rebuilt-greer-lightspeed"
excerpt: "Fender's November 18 Tone Master Pro firmware is free and does two things. It ships a completely rebuilt Virtual Capo as a public beta, running on a new polyphonic pitch-shifting algorithm that Fender says tracks more naturally with low latency. It also renames the Lightyear overdrive to Lightspeed under a formal Greer Amps partnership, with no change to the sound. The capo is the part that matters, and because it's beta, it doesn't belong on a Sunday-morning preset until you've rehearsed with it."
source_url: "https://www.guitarworld.com/gear/amp-modeler-pedals/greer-amps-fender-lightspeed-tone-master-pro"
image_url: ""
author_slug: "sean-nakamura"
---

Fender pushed a new Tone Master Pro firmware on November 18. It's free for all owners and installs through the Pro Control app. The release is small. One change is cosmetic, and the other could change how a lot of players handle key changes. I'll take them in reverse order of importance.

## Lightyear Is Now Lightspeed. Your Presets Won't Sound Different.

When [firmware 1.8.45](/news/fender-tone-master-pro-firmware-1-8-45-evh-5150) landed in June, one of its 15 new effects was **Lightyear**, a transparent, touch-sensitive overdrive modeled on the Greer Lightspeed. Fender and Greer Amps have now formally partnered. The block is renamed **Lightspeed** and gets Greer-approved artwork and branding.

Guitar World calls it a purely cosmetic rebrand. The sound is unchanged. If you built presets around Lightyear, nothing in the signal path moves. Your existing settings carry over, and the only thing that changes is the name on screen. I'd still spot-check one preset after updating before a gig, which you should do after any firmware update anyway.

## The Virtual Capo Rebuild Is the Real Update

The Virtual Capo first arrived in the late-2024 firmware as a polyphonic transposer, ±12 semitones. In this release it's been **completely rebuilt** on a **new polyphonic pitch-shifting algorithm**. Fender says it tracks more naturally with lower latency. It ships as a **public beta**.

That matters because a virtual capo stands or falls on two things: how it handles full chords, and how much delay it adds. An older-style pitch shifter can sound fine on single notes. Strum an open G shape through it and you hear the problems: warbly low strings, a slight smear on the attack, and a lag your hands notice before your ears do. Those artifacts get worse the further you shift. Up one or two semitones is usually tolerable. Down three or four on a full chord is where a weak algorithm falls apart.

Fender hasn't published latency figures or a tracking spec for the new version, so I can't tell you how close it gets to a real capo yet. Here's how I'd test it.

## How to Evaluate the Beta Before You Trust It

**1. Put it first in the chain.** Pitch shifters track best on a clean, uncompressed, undistorted signal. Run the Virtual Capo before any compressor, drive or amp block. Placing it after drive gives the algorithm a dense, clipped waveform to analyze, and tracking suffers. Our [guide to polyphonic pitch blocks](/blog/polyphonic-pitch-blocks-dsp-cost-worth-it) covers why this ordering matters on every platform.

**2. Test the shifts you actually use.** For most worship and singer-songwriter players, that means +1 to +3 to match a vocalist, or −1/−2 to play in an open-chord key the song wasn't written in. Strum full open chords at those settings, then play single notes on the low E. Muddy low strings are the first sign of trouble.

**3. Feel the latency against a click.** Play eighth notes against a metronome with the capo on and then off. If it feels like you're dragging with it engaged, you're hearing latency. Ignore that and you'll be fighting the timing through a whole set.

**4. Remember what a virtual capo can't do.** A real capo changes your voicings: the open strings ring in a new place and the guitar's resonance moves with them. Our [capo-position post](/blog/capo-position-as-a-tone-decision) explains why capo 5 and capo 0 aren't the same sound, even in the same key. A pitch shifter moves the pitch of what you're already playing and keeps everything else. That's handy for a last-minute key change. It isn't a replacement for choosing a capo position on purpose, especially when [two guitarists are splitting a song](/blog/capo-split-two-guitarists-same-song) and the different voicings are the whole point.

**5. Keep it off the Sunday preset until you've rehearsed it.** It's a public beta. Build a test preset, play it at a full-band rehearsal, and only promote it to your live set once it has held up for a whole run-through.

## The Takeaway

This isn't a big content drop like June's 1.8.45. The Lightspeed rename is housekeeping. The Virtual Capo rebuild targets one of the most practical features on any modeler for players who change keys on short notice. If the new algorithm delivers the natural tracking and low latency Fender claims, TMP owners won't need to reach for a capo during a set as often. Test it the way you'd test any new pitch block: first in the chain, at your real shift amounts, against a click.

## Dig Deeper on Fader & Knob

- [Fender Tone Master Pro firmware 1.8.45](/news/fender-tone-master-pro-firmware-1-8-45-evh-5150): the June update that added the Lightyear (now Lightspeed) block
- [Polyphonic pitch blocks cost you half a path and all of your stereo](/blog/polyphonic-pitch-blocks-dsp-cost-worth-it)
- [Your capo position is a tone decision, not just a key change](/blog/capo-position-as-a-tone-decision)
- [Who puts the capo on: dividing a song between two guitarists](/blog/capo-split-two-guitarists-same-song)
