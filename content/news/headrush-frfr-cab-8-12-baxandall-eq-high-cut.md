---
title: "HeadRush's New FRFR Cabs Put a Baxandall EQ and a High-Cut on the Back — Which Is a Preset Decision, Not a Speaker Decision"
date: "2026-09-03"
category: "new-gear"
slug: "headrush-frfr-cab-8-12-baxandall-eq-high-cut"
excerpt: "HeadRush announced the FRFR-8 CAB ($399, 480W peak) and FRFR-12 CAB ($499, 750W peak) on September 1 — closed wooden cabinets with kickstands, compression drivers on a 90-degree horn, Bluetooth 5.3, and a three-band Baxandall EQ plus a high-cut filter on the panel. That last control is the one worth understanding, because tone controls on a full-range monitor are a contradiction until you know what job they're actually doing."
source_url: "https://www.gearnews.com/headrush-frfr-cab-series/"
image_url: ""
author_slug: "sean-nakamura"
---

HeadRush introduced the **FRFR CAB** series on September 1 — two powered full-range cabinets aimed at modeler players who want their rig to look and sit like an amp instead of a PA wedge.

- **FRFR-8 CAB** — 8-inch custom woofer, 1-inch compression driver, **480 watts peak**, **$399**
- **FRFR-12 CAB** — 12-inch custom woofer, 1-inch compression driver, **750 watts peak**, 18.5 kg, **$499**

Both use a 90-degree conical horn, XLR/TRS combo inputs, an XLR line out for feeding front-of-house, Bluetooth 5.3 for backing tracks, and a closed wooden cabinet with an integrated kickstand. They are shipping through Thomann and Sweetwater with some launch delays reported.

The interesting part is on the back panel: a **three-band Baxandall EQ** and a **high-cut filter**.

## A Tone Stack on a Full-Range Speaker Is a Contradiction

I want to take this seriously rather than treat it as a feature bullet, because it looks wrong on first read and it isn't.

The entire premise of FRFR is flat. You built a cab block or loaded an IR inside your modeler, that block is doing the speaker coloration, and the monitor's job is to reproduce the result without adding a voice of its own. If the monitor has tone controls, either the monitor isn't flat or you're being invited to undo work you already did upstream. That's the objection, and it's a fair one — it's the same reason [running a modeler into a guitar cab](/blog/frfr-vs-guitar-cab-for-modelers) is a different design decision, not a lesser one.

Here's what the controls are actually for, and it's worth being precise about it.

A Baxandall stack is a shelving EQ. It is not a Fender or Marshall tone stack — there's no midrange notch, no interaction between bands, no characteristic scoop when you set everything to noon. Flat controls means flat response, and moving a band tilts a broad shelf rather than carving a peak. That is the correct topology for a monitor, and it's the reason this doesn't contradict the FRFR premise the way a guitar-amp tone stack on the same panel would.

The job those shelves are doing is **room correction**, not tone shaping. Your presets were built in one acoustic environment. Then you set the cab on a hardwood stage against a back wall, and the low shelf on the box is the fastest way to pull back the [boundary reinforcement](/blog/cab-placement-wall-bass-boundary) you just introduced without touching a preset you spent three months tuning. That's a legitimate use and it belongs on the speaker, because the problem lives in the room, not in the patch.

The **high-cut filter** is the one I'd actually reach for most. Compression drivers reproduce everything above 10 kHz that your modeler sends them, and cab IRs are honest about content that a real guitar speaker would never have made in the first place — a 12-inch guitar speaker rolls off hard past about 5–6 kHz. That's the source of the fizz complaint that follows every FRFR rig, and it's why the standard advice is [a low-pass in the preset](/blog/fix-fizzy-high-gain).

## Where to Put the Cut — Preset or Cabinet

This is the part that actually affects your rig, and it's a routing decision more than a taste one.

**Put the high-cut in your preset if you send an XLR to front-of-house.** The line output on these cabs is a feed for the PA, and the whole point of a modeler rig is that the engineer hears what you hear. A high-cut on the cabinet's own panel shapes what comes out of the box on stage. If your preset is fizzy into the room and you fix it at the cabinet, the PA still gets the fizz. Fix it once, in the preset, at the cab block or a Simple EQ after it, and both destinations inherit it.

**Put it on the cabinet only for problems that are specific to the cabinet.** Different rooms, different nights, a stage where the horn is firing straight at your ears from a tilted kickstand — those are per-gig adjustments that shouldn't be baked into a preset you also use for recording. The kickstand is relevant here for a reason that's easy to miss: [tilting a cab up](/blog/frfr-cab-placement-floor-tilted-raised-stand) aims a 90-degree horn at your head instead of your knees, and the perceived high end changes dramatically with that one physical move. If tilting the box made it bright, fix it at the box.

The failure mode I'd warn against is fixing it in both places, forgetting you did, and then wondering six weeks later why your presets sound dull through headphones. Keep a note of which layer owns which decision.

## The Two-Cab Question

The wattage gap is bigger than the price gap: $100 buys 270 more peak watts and four more inches of cone. That's the standard FRFR sizing tradeoff and the answer is the usual one — the 8-inch is a rehearsal, small-room, and monitoring box; the 12-inch is the one that survives a loud drummer.

But the low end is the real differentiator, not the volume. An 8-inch woofer in a closed cabinet is not going to move air below roughly 70–80 Hz in any convincing way. If you play in standard tuning that is entirely fine. If you're in [drop tunings](/blog/dialing-in-drop-tuned-high-gain), your fundamental on a dropped low string is sitting right at or below where that box gives up, and you will hear it as a preset problem when it's a speaker problem.

For context on where these land against the field, our [FRFR roundup](/blog/best-frfr-speakers-for-modelers) covers the price tiers, and the [HeadRush FRFR-112 MkII comparison](/blog/headrush-frfr-112-mkii-vs-quilter-aviator-cub-budget-frfr) is the direct predecessor — the new FRFR-12 CAB is the same platform in a closed wooden box with a tone stack and Bluetooth added.

## One Thing to Do Before You Plug In

If you're moving from studio monitors or headphones to one of these, do not judge your presets on the first pass. Do the [level-matching pass](/blog/level-match-modeler-presets) first, set the cabinet's EQ flat and its high-cut off, and listen to what you actually built. Then adjust.

The order matters because a Baxandall stack is very good at making a bad preset sound acceptable, which is exactly how you end up with a preset that only works through one speaker. Get the preset right against flat, then use the panel for the room.
