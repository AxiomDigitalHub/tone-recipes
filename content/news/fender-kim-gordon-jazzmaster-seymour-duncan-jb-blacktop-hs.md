---
title: "Fender's Kim Gordon Jazzmaster Puts a Seymour Duncan JB Next to a Jazzmaster Neck Pickup. That's Two Very Different Outputs on One Switch, and Your Presets Need to Know"
date: "2026-10-29"
category: "new-gear"
slug: "fender-kim-gordon-jazzmaster-seymour-duncan-jb-blacktop-hs"
excerpt: "Fender and Kim Gordon have a limited-edition signature Jazzmaster built on the Blacktop HS she played live: Olympic White, a Seymour Duncan JB in the bridge, a Jazzmaster single-coil in the neck, no rhythm circuit, $1,099.99. The hot bridge and the soft neck land on the same three-way switch. Here's how to set a modeler so both positions work."
source_url: "https://www.premierguitar.com/news/fender-and-kim-gordon-introduce-signature-jazzmaster"
image_url: ""
author_slug: "jess-kowalski"
---

Fender announced a **Limited Edition Kim Gordon Jazzmaster** on October 27. It's based on the Blacktop Jazzmaster Gordon played live for years, which had the same unusual layout: a humbucker in the bridge and a regular Jazzmaster pickup in the neck. Fender built the new one to nearly the same spec, and Gordon's comment in the launch coverage is basically that she finally got Fender to put a Seymour Duncan in it.

Street price is **$1,099.99** in Fender's launch coverage (also £1,449 / €1,699). Gearnews spotted it at $1,349.99 on Sweetwater and €1,599 at Thomann, so check before you buy. It's made in Fender's Ensenada, Mexico factory.

What's on it, per Fender's coverage and retailer listings:

- **Body**: alder, Olympic White, with a matching painted headstock and a 3-ply black pickguard
- **Neck**: maple, Modern "C" profile, satin finish, rosewood board with block inlays
- **Bridge pickup**: **Seymour Duncan JB TB-4** humbucker
- **Neck pickup**: Fender **Player Series Alnico V Jazzmaster** single-coil (Guitar World called it a P-90. Fender and the other retailers say Jazzmaster, and that matches the Blacktop it's copying)
- **Switching**: three-way toggle, one volume, one tone. **No rhythm circuit**, so none of the roller wheels and slide switch on the upper horn
- **Bridge**: Jazzmaster bridge with **Mustang saddles**, vintage-style floating tremolo with a push-in arm
- Synthetic bone nut, deluxe gig bag

I haven't played one. But anyone running an offset into a modeler can already tell where this layout is going to bite people.

## The Two Pickups Aren't Close in Output

A JB is one of the hottest passive humbuckers in common use, with a DC resistance of about 16k ohms. A Jazzmaster neck pickup is a wide, flat single-coil. It's warm, it's quieter, and it doesn't push an amp anywhere near as hard. Our [pickup DC resistance explainer](/blog/pickup-dc-resistance-what-it-actually-measures) covers why that number doesn't tell you everything. But here the gap is big enough that you'll hear it the second you flip the switch.

On an amp, that's half the fun. Bridge gives you the snarl, neck gives you the clean-ish bloom, and you ride the volume knob. On a modeler preset that you built and saved with one pickup, it's a problem:

- **Build on the bridge** and the neck comes out thin, quiet and noticeably cleaner. Your lead sound turns into a rhythm sound.
- **Build on the neck** and the JB slams the amp block. Everything gets compressed, fizzy and louder than the rest of your board.

Gordon's version also drops the rhythm circuit, so you don't get a second preset volume to cover the gap. The middle position (both pickups) lands somewhere between the two and is worth checking on its own.

## Setting It Up on a Modeler

**On a Helix or HX Stomp:**

- **Build the gain on the bridge first.** The JB is the pickup that will overload things, so set your drive and amp gain with it. Then switch to the neck and listen. If it's too clean, that's often what you want for a verse.
- **Use snapshots for the level gap, not the guitar.** Make one snapshot for the neck and one for the bridge. On the neck snapshot, raise the amp's **Ch Vol** or the output block level by a couple of dB until the two match at the PA. Don't fix it by turning the JB down on the guitar. You lose the top end the pickup is good at.
- **Watch the input.** If the JB is clipping your first drive block, the issue is gain staging, not the pickup. [Overdrive with humbuckers](/blog/overdrive-with-humbuckers-settings) goes through where to set drive and level so a hot pickup pushes the pedal without smearing.
- **Leave the gate off on the neck.** A Jazzmaster single-coil is quieter at the amp but hums more. A gate set for the humbucker will chop the decay on the single-coil. [Noise gate placement](/blog/noise-gate-placement-modeler-preset) shows how to keep it from eating your sustain.

**On a Quad Cortex**, same approach: scenes instead of snapshots, with the level offset on the neck scene.

## Getting the Sonic Youth Part Right

Remember that a lot of the Sonic Youth sound came from **alternate tunings, cheap and modified guitars, and feedback**, not one perfect amp. The signature guitar gives you the hardware. The noise is still on you.

If you want to go that way on a modeler:

- **Bridge humbucker into a mid-gain amp with the gain lower than you'd think.** The JB adds enough on its own. Too much amp gain and the chords lose their open-tuning shimmer.
- **Let it feed back.** On a modeler that means volume and some delay or reverb, not just gain. Our [shoegaze wall of sound recipe](/blog/shoegaze-wall-of-sound-recipe) and the [Loveless tone breakdown](/blog/my-bloody-valentine-loveless-tone) are built around exactly this kind of guitar: an offset, open chords, a lot of tail.
- **Use the floating trem.** With Mustang saddles and a push-in arm, small bends on held chords are part of the sound. Your pitch modulation should come from your hand, not a chorus block.

## Should You Buy One

**If you love offsets and want a humbucker in the bridge**: this is a straightforward layout at a reasonable price. Fender has made HS Jazzmasters before, but not often, and the JB is a known pickup that's easy to replace or keep.

**If you're already playing a Jazzmaster into a modeler**: you can test the idea first. Put a hot humbucker-style input level into your existing preset (a clean boost block in front of the amp, about +6 dB) and see whether you like how the amp responds. If you do, this guitar is that, minus the boost.

**If you need the rhythm circuit**: this doesn't have one. That's on purpose, since the Blacktop didn't either.
