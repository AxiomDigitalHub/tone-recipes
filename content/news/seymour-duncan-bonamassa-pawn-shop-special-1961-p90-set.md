---
title: "Seymour Duncan Cloned the P-90s in Bonamassa's Pawn-Shop 1961 SG for $375 — and the One Helix Setting That Can Erase What You Paid For"
date: "2026-09-11"
category: "new-gear"
slug: "seymour-duncan-bonamassa-pawn-shop-special-1961-p90-set"
excerpt: "Seymour Duncan's Custom Shop has recreated the soapbar P-90s in Joe Bonamassa's 1961 SG Special: 7.8k neck, 8.4k bridge, Alnico IV, wax potted, $375 a set, with the first 610 signed. The numbers are squarely mid-pack for a P-90, so the character lives in the magnet and the resonant peak. On a modeler, that peak is exactly what a Tube Screamer block sitting first in your chain will quietly shave off."
source_url: "https://www.premierguitar.com/news/seymour-duncan-joe-bonamassa-pawn-shop"
image_url: ""
author_slug: "hank-presswood"
---

Joe Bonamassa's first vintage guitar with a catalog number isn't a Burst. It's a white 1961 SG Special he found in a pawn shop.

In 2010 he was playing the Embassy Theatre in Fort Wayne, Indiana, in the dead of winter. Somebody told him there was a pawn shop around the corner with an interesting SG in it. He walked over, came back with a pristine first-year SG Special, and plugged it in at the venue. That guitar is now **inventory item #001** in his Nerdville collection. His description of what he heard that night: *"these particular P-90s were the P-90s that I was searching for."*

I have a soft spot for this kind of story. My first guitar came out of a pawn shop on Avenue Q in Lubbock for $25, and after 25 years behind a counter I can tell you most of the guitars that actually change somebody's playing come from rooms like that, not from auction catalogs.

Seymour Duncan's Custom Shop announced on September 8 that it has cloned the pickups out of that guitar. It's the Custom Shop's first P-90 collaboration with Bonamassa.

## What's in the Box

**Joe Bonamassa "Pawn Shop Special" 1961 P90 Set — $375**

- **DC resistance:** 7.8k neck, 8.4k bridge
- **Magnets:** Alnico IV, neck and bridge
- **Wind:** custom, matched to the originals
- **Potting:** wax potted
- **Hardware:** historically accurate dimpled P-90 bottom plate, period-correct covers
- **Lead wire:** single-conductor braided shield
- **Limited run:** the first **610 sets** come with a Nerdville #001 tag, a certificate of authenticity signed by Bonamassa and Seymour W. Duncan, and limited-edition packaging

The trade press lists it as available now. When I checked Bonamassa's own store it showed sold out with pre-orders open, so if you want one of the 610 signed sets, don't wait on it.

## The Numbers Are Ordinary. That's the Point.

Most people will look at 7.8k and 8.4k first and learn nothing from them.

Our [DC resistance guide](/blog/pickup-dc-resistance-what-it-actually-measures) puts P-90s broadly between 7.5k and 9k. This set lands right in the middle. It isn't a hot P-90 and it isn't an underwound one. The roughly 8% step up from neck to bridge is ordinary balancing, because the string swings less near the bridge and the bridge coil needs more wire to keep up. Nothing in those two numbers explains why Bonamassa went looking for these pickups for years.

DC resistance measures wire, not character. The spec on this box that actually tells you something is the **magnet**.

Seymour Duncan says it chose **Alnico IV** to reproduce the "airy top end and sizzle" of Joe's originals. In the published bar-magnet figures from our [magnet guide](/blog/pickup-magnet-types-alnico-2-3-5-ceramic-string-pull), Alnico IV sits around 630–670 gauss, below Alnico V's 710–770. A slightly softer field pulls less on the string, and the string rewards you with a more open, less compressed attack. That's the physical basis for "airy."

The same guide has a height table, and for Alnico IV the answer is the **chart figure**. It's close enough to V that the published number holds. So if you're swapping out an Alnico V P-90 set, don't crank these closer on reflex because you expect them to be weaker. Start where your old set was. If the low strings start to warble, [magnet pull is the first suspect](/blog/pickup-height-magnet-pull-warble). On a P-90, height is also a drive control, which our [P-90 overdrive guide](/blog/p90-pickups-overdrive) covers in detail.

## The One Spec That Isn't 1961

Everything about this set is period-correct except one thing, and it's the most interesting decision in the whole announcement.

**They're wax potted.** Seymour Duncan says that was done to Joe's preference, for reliability at volume in front of powerful amps.

Period Gibson pickups generally weren't wax potted. That's a big part of why an old P-90 squeals when you lean on it. An unpotted coil can move, and a coil that moves is a microphone. Bonamassa owns the originals and still asked for the replicas to be potted. A man with that collection deciding his vintage tone doesn't have to include microphonic squeal is making a practical call, not a nostalgic one.

For modeler players this matters more than the magnet does. If your stage rig is a Helix or a Quad Cortex into an FRFR wedge at real volume, an unpotted vintage-spec P-90 is a feedback problem waiting for its moment. Squeal from a microphonic pickup isn't the same thing as the controllable, singing feedback you get from a guitar, and our [stage feedback guide](/blog/stop-feedback-stage-physics) explains why a gate can't fix either one. Potting takes one variable out. The hum doesn't go away: these are still single-coil pickups. You still want [a gate in the right place](/blog/noise-gate-placement-modeler-preset) and the usual [60-cycle hum](/blog/how-to-remove-60-cycle-hum) housekeeping.

## Where the Airy Top End Lives, and the Helix Setting That Deletes It

This is the part of the story most spec sheets leave out.

You can't model a pickup. It sits upstream of the converter, and no amp block or IR knows what's in your guitar. What your modeler *can* do is change how the pickup is loaded before conversion happens. The "airy top end" Seymour Duncan chose Alnico IV to preserve is mostly the pickup's **resonant peak**, which is exactly what the load changes.

Sean covered this in our [modeler input impedance guide](/blog/modeler-input-impedance-setting-what-to-set-it-to), and the key finding applies directly to a $375 pickup purchase. Load resistance controls the *height* of the resonant peak. At 1M the peak stands up at full height. At 230k it's shorter and broader, and a real part of what you just paid for is gone.

Here's the trap. On Helix, **Auto** impedance reads the first block in the path, and a Tube Screamer model sets around 230k. Plenty of blues presets start with a Scream 808 or Kinky Boost block sitting first, and under the default Auto behavior that block sets the input load **even when it's bypassed.** So you install a set of pickups built around their top end, load a blues preset, and Helix rolls the peak down before a single amp block runs.

The fix takes a minute:

- **Helix / HX:** set **In-Z to 1M** on the Input block of every P-90 preset. Or switch the global Auto Impedance preference to First Enabled, so a bypassed drive stops setting the load.
- **Quad Cortex:** check that the combo input's IMPEDANCE parameter is at **1M**. It doesn't derive the value from your chain, so it stays wherever you last left it.
- **Fractal:** AUTO follows the first *active* block, so a bypassed drive won't bite you. An engaged TS model first in the chain still will.

Then check your cable. Cable capacitance moves the peak *down* in frequency. The load resistance above only changes its height. A long, cheap cable to the floor unit can drag that sizzle into the upper mids. Our [cable length guide](/blog/does-cable-length-affect-tone) has the numbers.

## Running Our Bonamassa Recipe With a P-90 Guitar

Our [Sloe Gin blues-rock lead recipe](/recipe/bonamassa-sloe-gin-blues-rock-lead) is built around what Bonamassa actually played on that record: a 1959 Les Paul on the neck PAF, a Tube Screamer as a boost into a Dumble-into-Marshall-4x12 blend. The TS sits at **Drive 3, Tone 5, Level 7.** Those numbers are right for a PAF.

They're wrong for a P-90, and here's the specific reason.

A PAF's energy sits in the lower mids, below the Tube Screamer's built-in midrange hump around 720 Hz, so the TS mostly adds level. A P-90 puts its energy in the **upper mids, roughly 800 Hz to 2.5 kHz**, right on top of that hump. Keep the recipe's Tone at 5 with an SG Special and the two stack into a nasal, congested honk that doesn't sound like Bonamassa or the Les Paul.

Here are the adjustments I'd make if you're running this recipe on a P-90 guitar, whether it's a Bonamassa-set SG, an [Epiphone Junior](/news/epiphone-billie-joe-armstrong-les-paul-junior-radiant-red), or a [three-P-90 Reverend](/news/reverend-kingbolt-air-390-three-steelhead-p90-semi-hollow):

- **TS / Scream 808:** Tone down from 5 to about **2** (8–9 o'clock). Drive down from 3 to about **1.5**. Leave Level where it is or push it slightly. You're using it purely as a boost into the amp, not as a clipping stage.
- **If the TS still honks:** swap it for a Klon-style block (Helix's **Minotaur**) with Treble around 8–9 o'clock. Its clean-blend path keeps more of the pickup's own voice in the signal.
- **Amp block:** don't add treble to find the sizzle. It's already in the pickup, provided your input impedance isn't taking it away.
- **Guitar controls:** do the real work on the guitar. The [Les Paul Junior recipe](/blog/les-paul-junior-tone-recipe) settles Volume at 5–6 for rhythm and 7–10 for leads, and Tone at 7–8 so a cranked amp doesn't get spiky. Those translate directly to a two-P-90 SG.

For the amp itself, the clean-headroom-first approach in our [Helix blues amp model guide](/blog/best-helix-amp-models-blues) is the right starting point for P-90s: **US Deluxe Vib** for a cleaner, pushed Fender voice, or **Brit 2204** if you want the Marshall half of Bonamassa's blend.

## Is It Worth $375?

As somebody who prices guitars for a living, here's how I'd weigh it.

$375 is real money for two pickups. For that price you could nearly buy a whole P-90 guitar, and we covered Epiphone's $545 Junior back in July. The signed certificate and the #001 tag are collectibles, and they'll hold some value among Bonamassa fans. They won't make the guitar sound any different.

What you're paying for is a specific, documented pair of 1961 P-90s, voiced by a builder who had the originals in hand, with the one modern change that makes them safe at stage volume. If you already own an SG Special, a Junior, or a Les Paul Special with a set of anonymous P-90s that are too dark or too bright, that's the problem Bonamassa described having for years, and this is a legitimate fix. I play a 1958 Junior with a single P-90 for slide and wouldn't touch its pickup. My guitar isn't the one this set is for.

If you do buy a set, finish the job on the modeler end. Set In-Z to 1M, turn the Tube Screamer's tone down, and let the pickup do the sizzling.
