---
title: "Reverend Put Three P-90s in a Semi-Hollow — Then Built It on a 25.5\" Scale, Which Quietly Invalidates Most P-90 Overdrive Advice"
date: "2026-08-14"
category: "new-gear"
slug: "reverend-kingbolt-air-390-three-steelhead-p90-semi-hollow"
excerpt: "The Kingbolt Air 390 is $1,599, mahogany with a center block and a solid spruce top, and carries three hum-cancelling Steelhead P-90s wired to seven combinations via a five-way and a push-pull. The three-pickup semi-hollow is a Gibson idea. Reverend built theirs on a Fender scale — and that one number changes where the P-90 bark lands, which drive settings work, and how you have to level-match a preset across seven positions instead of three."
source_url: "https://www.guitarworld.com/gear/electric-guitars/meet-the-reverend-kingbolt-air-390"
image_url: ""
author_slug: "margot-thiessen"
---

Three P-90s in a semi-hollow body is not a new idea. Gibson has been doing versions of it since the ES-5 in 1949, and the three-pickup Les Paul Custom made it a permanent fixture of the vocabulary. What Reverend announced yesterday takes that arrangement and moves it three quarters of an inch.

The Kingbolt Air 390 is a mahogany body routed for a full-length center block, capped with a solid spruce top, cut as an offset double-cut with Reverend's f-holes. Three hum-cancelling Steelhead P-90s. Volume, Tone, and Bass Contour. A five-way selector with a push-pull Studio switch that opens up seven total pickup combinations, including neck-and-bridge together and all three at once. Roasted maple neck, Medium Oval profile, 12" radius, maple or rosewood board. Wilkinson WVS50 IIK tremolo, Pin-Lock tuners, Boneite nut. $1,599, available now in Metallic Limeade, Purple Punch, Iconic Blue, and Sandstone.

I have not played one. Everything below is read off the spec sheet and the physics, and I'll say so again where it matters — but the spec sheet on this guitar is unusually informative, because one number on it does more work than anything else in the announcement.

That number is 25.5.

## The Scale Length Is the Whole Story

Nearly every P-90 guitar you have heard is a 24.75" instrument. Gibson designed the pickup, Gibson designed the scale, and they grew up together. The result is that essentially all accumulated P-90 folk wisdom — including [our own guide to P-90s and overdrive](/blog/p90-pickups-overdrive), which I use and stand behind — was calibrated on a 24.75" platform.

The Kingbolt Air 390 is 25.5". For the same string gauge at the same pitch, tension rises with the square of the scale, so a 3% longer string is carrying about 6% more tension. That is not a rounding error you can ignore. More tension means the string is stiffer, the attack transient is faster and harder, the fundamental decays into upper partials sooner, and the whole instrument reads brighter and tighter before a single pickup gets involved.

Now stack the P-90 on top of that. The P-90's defining feature is a forward, present upper midrange — a lot of energy in the 800Hz to 2.5kHz window, more than a single-coil has and more harmonically complex there than a humbucker. On a 24.75" mahogany guitar, that bark sits on top of a warm, slightly loose fundamental, and the two balance. It's why the pickup has the reputation it has.

Put the same voicing over a tighter, brighter 25.5" fundamental and you don't get "a P-90 guitar, but crisper." You get a guitar where the upper-mid emphasis has less warmth underneath it to lean against.

The practical consequence lands on your drive pedal, and it runs opposite to the standard advice. The received wisdom for P-90s into a Tube Screamer is to back off the Drive and roll the Tone down, because the TS's own midrange emphasis around 720Hz stacks with the pickup and congests. That advice is correct on a Les Paul Junior. On this guitar I would expect the congestion to be milder and the harshness risk to move higher up — meaning if you dial in the usual heavy Tone rollback, you will over-correct and end up with something dull and boxy that you'll blame on the guitar.

My starting point, and I want to be honest that this is reasoning rather than listening: treat the drive settings closer to how you'd treat a Telecaster with a hot bridge pickup than how you'd treat a Les Paul Special. Start the Tone control higher than the P-90 rulebook says, and come down only if you actually hear the problem.

## Seven Positions Is a Level Problem Before It's a Tone Problem

The seven combinations are the headline feature, and they are genuinely useful. They are also the thing most likely to wreck a modeler preset, and nobody writes that part down.

Here is what is actually happening electrically. A five-way on three pickups gives you three solo positions and two adjacent pairs. The push-pull Studio switch adds the outer pair — neck and bridge, skipping the middle — and all three together.

Those combinations do not sit at the same output level, and they do not sit at the same frequency balance, for two separate reasons.

The first is comb filtering. Two pickups reading the same string at two different points along its length will cancel at frequencies where the distance between them equals a half wavelength. The wider the spacing, the lower the notch. This is exactly the mechanism behind the Strat's positions 2 and 4, and it's why the neck-and-bridge combination on a Telecaster sounds hollow in a specific way. On this guitar, neck-plus-bridge is the widest spacing available, so that notch is the deepest and lowest of the seven. It is a real scoop, not a subtle one.

The second is source impedance, and this is the one that catches people. Pickups wired in parallel present a lower combined impedance than any one of them alone. All three at once drops the source impedance to roughly a third. Lower source impedance loaded against the fixed capacitance of your cable pushes the resonant peak *higher* in frequency and flattens it. So the all-three position is not "more pickup, more output." It is lower output, thinner, and brighter than the solo positions. Every three-pickup-parallel guitar behaves this way, and every time someone flips to it expecting a fat sound they conclude the switch is broken.

For a modeler this is a concrete problem. Your amp block's response is a function of how hard you hit it. Seven positions with meaningfully different output levels means seven different amounts of drive into the same preset, and the two positions you'll reach for as "special" — outer pair and all three — are the two that arrive quietest. Set a preset in the bridge position and the all-three setting will sound not just different but *underpowered*, which reads as "worse" and usually gets blamed on the wrong thing.

The fix is the boring one. Pick a reference position, dial the preset there, then walk all seven and note where each lands, using the method in our [preset level-matching guide](/blog/level-match-modeler-presets). If you're on a Helix, HX Stomp, or Quad Cortex, the cheapest solution is a gain block early in the chain with a couple of dB of makeup assigned to a snapshot or a footswitch, so the outer-pair and all-three positions can be brought back up to the preset's operating point instead of limping into it. Our [pickup position guide](/blog/pickup-position-guide) covers why the positions sound the way they do; this is the part about making them all usable inside one preset.

## The Bass Contour Is Passive, So Your Input Jack Gets a Vote

Reverend's Bass Contour is on every guitar they make and it is the most underrated control in their catalog. It is a passive low-frequency roll-off — turn it down and you shed low end, which tightens the bottom and re-voices the pickup upward. On a P-90 it will get you a long way toward twang, and on a three-P-90 guitar with a spruce top it is probably the most important knob on the instrument.

The word doing the work is *passive*. A passive network's corner frequency depends on the total load it sees, and that includes whatever you plug into. Into the 1MΩ input your modeler presents, the control behaves the way Reverend voiced it. Put something with a low input impedance first in the chain — a vintage-spec fuzz sitting around 10kΩ is the classic offender — and the entire taper shifts under you. The knob will still work. It will not work where the markings suggest.

This is the same interaction that makes fuzz pedals behave strangely after a buffer, and [our piece on impedance and buffers with fuzz](/blog/impedance-buffers-fuzz) covers the mechanism. The short version for this guitar: if you run a fuzz, set the Bass Contour with the fuzz engaged, not bypassed, because those are two different circuits as far as the knob is concerned.

## What the Spruce Top Gives You Direct — and the EQ Move It Rules Out

Reverend describes the Air 390 as offering controlled feedback, which is the standard semi-hollow pitch and is written for someone standing in front of a loud amp. If you play through headphones or go direct to a PA, that sentence does not describe your situation at all. Acoustic feedback needs an acoustic loop — a speaker moving air that moves the top that moves the string — and there isn't one in a pair of headphones. The [physics of stage feedback](/blog/stop-feedback-stage-physics) is the same story from the other direction.

So what are you paying for if you never make the guitar squeal?

The center block plus solid spruce top changes how the string is *damped*, and that shows up in the pickup signal whether or not there's a speaker in the room. A solid top with f-holes is more compliant than a slab of mahogany. It absorbs and returns energy on a slightly different curve, which usually reads as a low-mid bloom and a softer, rounder note envelope. That is real, it is in the signal, and it survives going direct.

Which means one common modeler habit is wrong on this guitar. The default fix for mud in a direct preset is a low-mid cut somewhere around 250 to 400Hz, and on a solidbody with humbuckers that's often exactly right. Here, that bloom is the thing that balances a bright 25.5" scale and an upper-mid-forward pickup. Cut it and you're left with the harshness and none of the body — the guitar's own compensation, removed on autopilot.

If you need to tighten the low end on this instrument, use the Bass Contour on the guitar first. It's doing the job before the signal ever reaches a converter, and it's voiced for these pickups. Reach for the EQ block second, if at all.

## A Starting Preset

Reasoning from specs, not from having played it — treat this as a hypothesis to test rather than a destination.

I would build this around a black-panel Fender rather than anything British. A Deluxe Reverb topology gives you a scooped-ish midrange that leaves room for the P-90's upper-mid push instead of fighting it, and it breaks up in a way that rewards the faster attack transient a 25.5" scale produces. On a Helix or HX Stomp that's **US Deluxe Nrm**; on a Quad Cortex, the equivalent black-panel model. Our [Deluxe Reverb settings guide](/blog/fender-deluxe-reverb-settings) has the full map.

Amp block, on the 0–10 scale the Helix uses:

- **Drive 4.5** — enough to get edge-of-breakup on the bridge P-90 and stay clean on the neck
- **Bass 3.5** — lower than you'd think, because the spruce top is already contributing bloom
- **Mid 5** — leave it; the pickup is the midrange here
- **Treble 5.5** — start conservative and come up, since the scale is doing brightness work for you
- **Master 7** — where the power-amp stage starts contributing compression
- **Ch Vol** to taste for level-matching

Then set the guitar's Bass Contour, not the amp's Bass knob, until the low end sits right. The order matters. If you tighten with the amp block first, you'll flatten the bloom described above and then spend an hour wondering why a semi-hollow sounds like a Telecaster.

For drive, my first two candidates would be a RAT-style circuit, which of the three classic drives needs the least compensation for P-90s in the first place — and a low-gain transparent overdrive with the Tone set higher than P-90 convention suggests, for the reason at the top of this piece. If you want the general method for building this from scratch, [how to dial in a modeler tone](/blog/how-to-dial-in-modeler-tone) is the process.

## Where $1,599 Lands

That price puts the Kingbolt Air 390 in a strange spot, and I mean that as an observation rather than a complaint. It is well above the Epiphone and Sire semi-hollows and meaningfully below a Collings or a Gibson ES. The nearest comparisons are the mid-tier Gretsch Electromatic and Streamliner range and the used American semi-hollow market, and against both of those the Air 390's argument is specificity: nothing else at any price gives you three hum-cancelling P-90s, seven combinations, a passive bass roll-off, and a Wilkinson trem on a 25.5" scale.

Whether you want that particular collection of decisions is a separate question from whether it's well made, and I can't answer either one from a spec sheet. What I can say is that the combination is not an accident and it is not a Gibson clone with a different headstock. Reverend took a familiar layout, changed the one dimension that reorganizes everything downstream of it, and the result is a guitar whose own category's received wisdom mostly doesn't apply.

If one shows up at a shop near you, the two things worth ten minutes are the all-three position — is it usable or is it a novelty — and how far you can turn the Bass Contour down before the spruce bloom disappears entirely. Those two answers will tell you more than any spec list, including this one.
