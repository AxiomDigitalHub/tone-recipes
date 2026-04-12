---
title: "Kemper OS 14.0 Leaves Beta — Profiling 2.0 Is Now Live for All MK2 and Player Owners"
date: "2026-04-12"
category: "firmware-update"
slug: "kemper-os-14-stable-profiling-2-live"
excerpt: "After a six-week public beta, Kemper's OS 14.0 reached stable release on March 31. Profiling 2.0's 100,000-point frequency analysis is now in the hands of anyone who paid for a MK2 or Player — including the Player's long-awaited ability to create profiles, not just play them."
source_url: "https://forum.kemper-amps.com/forum/thread/67624-os-14-0-3-release/"
image_url: ""
author_slug: "hank-presswood"
---

Kemper shipped OS 14.0.3 as the stable release on March 31, 2026. If you have been holding back from the public beta — which opened on March 4 — the final version is here and it is ready for real use.

We covered the public beta announcement when it dropped. What the stable release confirms is the full feature set and the things Kemper still has not fully solved.

## What Is New If You Have Not Been Watching

Profiling 2.0 increases the number of frequency analysis points from roughly 10,000 to over 100,000. That is not marketing language. It means the profiling process captures more of what the amp actually does, particularly in two areas where the original engine had consistent limitations: the low-end behavior of high-gain amps under hard picking, and the touch sensitivity of Class A designs like Vox circuits.

The profiling process now takes approximately three minutes versus the original 90 seconds. Kemper's position is that you will re-profile your best amps and hear the difference. Based on forum feedback from the beta period, that claim holds up particularly well for Mesa/Boogie Mark series amps and similar designs with active EQ circuits that the original engine sometimes struggled to represent accurately.

Two new Liquid Profiling parameters arrived with this update: Power Sag, which controls simulated power amp compression behavior independently of the profile's gain structure, and Speaker Resonance, which adjusts the low-frequency resonance interaction between the power amp and speaker. Both work on existing Liquid Profiles as well as new Profiling 2.0 captures.

## The Player Can Now Create Profiles

This is the part of the release that changes the value proposition of the Profiler Player specifically. When Kemper released the Player in 2023, it was a playback device — you could use existing profiles but not create new ones. OS 14.0 removes that limitation. Player owners can now run the full Profiling 2.0 workflow on their unit, at the same quality level as the MK2 rack and toaster.

For anyone who bought a Player as an entry point into the Kemper ecosystem and has an amp collection worth capturing, this update is substantial. The Player was already one of the most capable compact units in its price range. The ability to create profiles makes it a legitimate standalone profiling rig.

## What Is Not Yet Fixed

The stable release ships with two known issues that Kemper has acknowledged:

ASIO driver users on Windows are experiencing reduced functionality when running Rig Manager and a DAW simultaneously. Kemper has stated that full ASIO feature parity will be restored in a future update. If your workflow depends on running both at the same time on Windows, hold off on updating the ASIO driver component until that patch arrives.

macOS users are encountering Core Audio conflicts that prevent simultaneous use of Rig Manager and a DAW through the same Core Audio device. This is being addressed but does not have a resolution date yet.

Neither issue affects the profiling workflow or the unit's analog I/O. If you profile to standalone hardware and do not use Rig Manager and a DAW at the same time, you will not encounter either problem.

## The Practical Upshot

If you have been on a Kemper for a few years and have amps you have been meaning to re-profile with better settings, OS 14.0 is the reason to do it now. The improvement is most meaningful on amps that challenged the original engine — high-gain American voicings, amps with complex tone stacks, anything where the original profile felt slightly off in the low end. The Player's profiling capability is the other major story here, and it is the kind of update that makes a product genuinely more useful rather than just incrementally different.

If you are on a MK1 Profiler, the update is still worth taking — you can play Profiling 2.0 captures shared by the community even though you cannot create them.

## Dig Deeper on Fader & Knob

- Our [Kemper profiling workflow guide](/blog/kemper-profiling-workflow) walks through the full process from mic placement to saving your finished profile, now updated for the Profiling 2.0 timing changes.
- Re-profiling your collection? Our [guide to profiling high-gain amps on Kemper](/blog/kemper-high-gain-profiling) covers the settings that most affect accuracy on Mesa and Marshall voicings.
- New to Kemper? Start with our [Kemper vs. Quad Cortex](/blog/kemper-vs-quad-cortex) comparison to understand where each platform's profiling approach has practical advantages.
- Browse all our [Kemper tone recipes](/platforms/kemper) for community-tested preset frameworks.
