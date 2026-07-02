---
title: "Axe-Fx III Firmware 32.06 Adds Three Brit JVM Crunch Models And Changes Plex Block Behavior"
date: "2026-07-02"
category: "firmware-update"
slug: "axe-fx-iii-32-06-brit-jvm-crunch"
excerpt: "Fractal released Axe-Fx III firmware 32.06 on June 25, 2026, with Axe-Edit III 1.14.34 shipping the same day. The headline is three new amp models — Brit JVM Crunch Green, Orange, and Red — captured from the Crunch channel of a Marshall JVM410. There is also a quieter but consequential change to the Plex block: Master Pitch now controls pitch only, and detune is handled separately. No modeling code changed, so existing presets are untouched."
source_url: "https://forum.fractalaudio.com/threads/axe-fx-iii-firmware-32-06-release.221343/"
image_url: ""
author_slug: "viktor-kessler"
---

Fractal released Axe-Fx III firmware 32.06 on June 25, 2026, with Axe-Edit III 1.14.34 shipping the same day to add editor support for the new models. After the modeling-heavy 32.04 and the two-amp fill-in of 32.05, this is another small, targeted release: three new amp models and one behavior change to an effect block. No modeling code was touched, which means your existing presets will sound exactly as they did on 32.05. The only delta is what becomes available when you decide to use it.

Let me be precise about what actually shipped, because "three new JVM models" is easy to misread.

## What The Three New Models Actually Are

The three adds are **Brit JVM Crunch Green**, **Brit JVM Crunch Orange**, and **Brit JVM Crunch Red**. All three are captured from a single amplifier — the Marshall JVM410 — and all three are the **Crunch channel**, not the two overdrive channels people usually reach for when they think "JVM high gain."

This is the part worth understanding. The JVM410 has four channels — Clean, Crunch, OD1, OD2 — and each channel has three modes selected by a button: Green, Orange, and Red. The modes are not three separate amps. They are three progressively more aggressive gain-and-voicing states of the *same* channel. On the real amp, Green is the lowest-gain, most open version of that channel's voicing; Orange adds gain and a midrange push by changing the preamp gain staging; Red is the most saturated and compressed state with the most cold-clipping character.

So what 32.06 gives you is the full three-mode sweep of the JVM's *Crunch* channel as three discrete models:

- **Green** — the cleanest of the three. This is edge-of-breakup to light crunch territory. Think chime with hair on it, the kind of rhythm tone that stays articulate when you play open chords and only breaks up when you dig in. This is a plexi-adjacent voicing with more modern tightness.
- **Orange** — the sweet spot for most rhythm work. More preamp gain, a harder midrange, and enough saturation to hold a power chord without collapsing. This is the classic "British crunch" rhythm sound — AC/DC to early hard rock to modern worship-rock rhythm beds.
- **Red** — the most aggressive Crunch mode. This is where the channel starts to overlap with lower-gain OD1 territory. Tighter low end, more compression, more sustain. Still fundamentally a crunch voicing, not a scooped high-gain metal sound.

If you were expecting the JVM's OD1/OD2 channels — the modern high-gain modes that make the JVM a metal amp — those are not in this release. This is specifically the crunch side of the amp, and it fills a real gap. The Axe-Fx III has been strong on plexi-lineage crunch (the Brit lineage models) and strong on modern high gain, but the JVM's specific flavor of tight, gained-up-but-still-clear British crunch has been underrepresented. Now you have the whole mode sweep of it.

## Where These Fit Against What You Already Have

The practical question is not "is this a good model" — Fractal's amp modeling has been past that argument for years — it is "when do I reach for JVM Crunch Orange instead of a Plexi or a JCM800 model."

Here is the distinction that matters. A cranked Plexi and a JCM800 both get their crunch from being pushed — the gain and the volume are tangled together, and the tone comes alive at stage volume. The JVM Crunch channel is a *preamp-gain* crunch: you get the saturation without needing the master cranked, and the three modes let you dial the gain amount by mode selection rather than by riding the gain knob into mush. For direct recording and silent-practice contexts — which is most of us, most of the time — that preamp-gain behavior is genuinely more useful. You get repeatable crunch at any output level, and the mode buttons give you three fixed, voiced gain stops instead of a continuous knob you have to redial by ear.

For preset construction, the move is to build a single rhythm preset with the three modes on adjacent scenes: Green for verses and clean-ish passages, Orange for the main rhythm bed, Red for heavier bridges or double-tracked layers. Because all three are the same channel of the same amp, the underlying EQ character and cab interaction stay consistent across the three scenes — you are changing gain and saturation, not jumping between three unrelated voicings. Put a single cab/IR behind all three and the transitions sound like one amp being pushed harder, because that is exactly what they are.

If you gate and boost the way I do, note that Red will not need a tightener the way an OD1/OD2 model would — it is already a crunch voicing, so a Tube Screamer-style boost in front will mostly just add midrange and a little more gain, not the low-end tightening you would want on a true high-gain channel. Use the boost for voicing here, not for structural tightness.

## The Plex Block Change — Small, But Read This If You Use Plex

The quieter change in 32.06 is to the **Plex block**: Master Pitch now controls pitch only and no longer affects detune, while Master Detune continues to control detune only. Previously the two parameters interacted in a way that made it harder to set pitch and detune independently.

If you use the Plex block for shimmer-style pitched reverbs or for detuned ambient washes, this is a cleanup you will appreciate — you can now set your pitch interval and your detune spread as fully separate decisions instead of having one bleed into the other. If you have existing presets that leaned on the old interacting behavior, check them: the model code did not change, but the *control* behavior did, so a Plex-heavy preset built on 32.05 or earlier could sound slightly different in its detune character after you update. This is the one place in 32.06 where an existing preset can shift, and it only affects presets that use the Plex block with both Master Pitch and Master Detune engaged.

## FM9 And FM3 Timing

As always, FM9 and FM3 lag the Axe-Fx III. On Fractal's normal cadence, expect the JVM Crunch models to reach FM9 roughly two to four weeks after the Axe-Fx III release — so mid-to-late July for a public FM9 build — and FM3 another one to two weeks after that. The FM9 is currently working through its own 12.00 firmware line in beta, so the exact sequencing of when 32.06's models land on FM9 depends on how that beta cycle resolves.

## Update Recommendation

If you are on 32.05 and you do not specifically need a British crunch voicing or use the Plex block, there is no urgency — nothing else changed. Sit tight.

If you build rhythm-forward presets and have wanted a tight, articulate British crunch that sits between plexi grind and modern high gain, take 32.06 the next time you have studio time to build a JVM Crunch preset properly. The three-mode approach — Green/Orange/Red on adjacent scenes — is the right way to use it, and it is a voicing the platform genuinely did not have before. And if you use Plex for pitched or detuned ambience, update and re-check those specific presets so the new independent pitch/detune behavior works for you rather than surprising you at a gig.

## Dig Deeper On Fader & Knob

- Our coverage of [Axe-Fx III firmware 32.05](/news/axe-fx-iii-32-05-pvh-6160-block-clean) walks through the two amp models 32.06 sits on top of.
- The [Axe-Fx III firmware 32.04](/news/axe-fx-iii-32-04-power-amp-modeling) writeup covers the power amp modeling rework underneath the whole 32.x line.
- The [FM9 firmware 12.00 public beta](/news/fm9-firmware-12-00-public-beta) coverage explains how the 32.x models make their way to FM9 owners.
- Browse all our [Fractal tone recipes](/platforms/fractal) for preset frameworks built on Axe-Fx III, FM9, and FM3.
