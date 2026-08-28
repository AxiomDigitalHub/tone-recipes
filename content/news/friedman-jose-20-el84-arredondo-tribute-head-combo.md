---
title: "Friedman's Jose 20 Puts the Arredondo Mod in an EL84 Chassis — and Names the Man Who Made It"
date: "2026-08-28"
category: "new-gear"
slug: "friedman-jose-20-el84-arredondo-tribute-head-combo"
excerpt: "Dave Friedman follows the JOSE 100 with a 20-watt EL84 head and 1x12 combo built around a three-position Gain Style switch. $1,799 and $2,099. The interesting part isn't the wattage — it's that a mod nobody was allowed to talk about for forty years now has a nameplate."
source_url: "https://www.premierguitar.com/news/friedman-jose-20-head-and-combo"
image_url: ""
author_slug: "hank-presswood"
---

Friedman announced the JOSE 20 on August 27 — a 20-watt head at $1,799.99 street and a 1x12 combo at $2,099.99, following the JOSE 100 that started this line. Two EL84s, four 12AX7s, bypassable series effects loop, and the combo loaded with a Celestion G12M-65 Creamback.

I want to talk about the amp. But first I want to talk about the name on it, because in twenty-five years behind a counter in Austin I watched that name get whispered and I never once saw it printed on a chassis.

## Jose Arredondo Was the Secret

Jose Arredondo worked out of El Monte, California. He hot-rodded British amplifiers for players who could not get what they wanted out of a stock Marshall — more sustain, tighter low end, richer harmonic content, and a feel under the fingers that responded instead of just getting louder. His modified amps ended up under some of the most recognizable rock guitar tones of the era, and for decades the standard practice was to not say so.

That's not unusual. That's the whole history of amp modding. A guy in a shop solders in a cascading gain stage, changes some values, and the record that comes out three months later sells four million copies with no credit to anyone. I've appraised a lot of amps where the real value was in what somebody did to it after it left England, and the only documentation was a customer's memory and a different-looking solder joint.

So Friedman putting JOSE on the front panel — developed alongside Jose's daughter, Marisol Arredondo — is the part of this announcement I'd underline. Dave Friedman built a business on this lineage. Naming it is the right call, and it's late by about forty years, which is not Dave's fault.

## What's Actually on the Panel

The control set tells you what this amp is trying to be:

**Internally bridged Volume I and Volume II.** That's channel jumping — the trick every Plexi player learned with a short patch cable across the front of a Super Lead. Friedman did it inside the chassis so you don't need the cable. The two volumes interact; that interaction *is* the tone.

**Plexi/Gain switch.** Adds a true additional gain stage. This is the Jose modification in one toggle: stock Plexi response on one side, the cascaded hot-rod on the other.

**Three-position Gain Style switch.** Revoices the circuit for three different Arredondo-derived gain structures, from Plexi-ish crunch to saturated high gain.

**Fat switch.** Low-end body without turning the bass control up, which is a different thing and a better one.

**System Master Volume.** The reason a 20-watt EL84 amp is on the market at all in 2026.

Two EL84s instead of EL34s is the interesting engineering decision. EL84s compress earlier and sound different when they do — more chime and a faster, springier breakup than the tighter, more linear EL34 push. If you want the full argument on what that power section actually contributes, we wrote it up in [EL84 tube character](/blog/el84-tube-character-ac30-boutique). This is not a JOSE 100 with fewer watts. It's a different power section wearing the same preamp philosophy, and anybody telling you it's identical at lower volume hasn't heard both.

## Now: How Do You Get This on a Modeler?

Most of you reading this are not going to spend $1,800 on a tube head. Fair. Here's where the Jose voicing already lives on gear you own.

**On a Helix, the closest model is Placater Dirty.** That's Line 6's take on the Friedman BE-100 — which is Dave Friedman's own amp, built out of exactly this modded-Marshall tradition. If you want the Jose flavor, that's your starting block, not a Plexi model. The full block list is in our [Helix amp model cheat sheet](/blog/helix-amp-model-cheat-sheet).

**The other one nobody uses is Line 6 2204 Mod.** It's a hot-rodded JCM800 preamp, and "hot-rodded 2204" is a fairly direct description of what an Arredondo amp was. It sits in the same gap the Jose 20's middle Gain Style position is aiming at — more than a Plexi, less than a modern high-gain amp. I put it on our list of [underrated Helix amp models](/blog/10-helix-amp-models-underrated) and I stand by it.

**To chase the channel-jumped Volume I/II behavior:** use **Brit Plexi Jump**. That's the jumped Super Lead, already modeled. It's the "Plexi" side of that toggle without the added gain stage.

Settings, on the Helix 0–10 amp scale, for the Placater Dirty starting point:

- **Drive 5.5–6.5.** Higher than that and you're past Jose into modern metal territory, which is not what this voicing does well.
- **Bass 4.** British amps of this family get flubby fast. The Fat switch on the real amp exists because you should *not* be solving low end with the bass knob.
- **Mids 6.5–7.** The mids are the Marshall. Don't scoop them.
- **Treble 5.5.** Then adjust with **Presence 4–5**, which on this family is doing more work than treble is.
- **Master 7+.** On a modeled amp the master control is your power-tube saturation. Leaving it at 5 gets you preamp gain with no power section behavior, which is the single most common reason a modeled Marshall sounds flat. Then use the channel volume to level-match, per [our level-matching guide](/blog/level-match-modeler-presets).

**Cab:** a 4x12 with Greenbacks or a G12M, mic'd off-axis. The combo version of the real amp ships with a G12M-65 Creamback, so a Greenback-family IR is the honest match, not a V30.

**Boost:** put a Tube Screamer in front with **Drive at 0, Tone around 6, Level high**. You're not adding gain — you're tightening the low end going into the preamp, which is the same job the Fat switch is compensating for on the real amp. We covered why that placement works [here](/blog/tube-screamer-before-high-gain-amp), and the stacking math for a Marshall specifically [here](/blog/stacking-ts-and-klon-into-marshall).

That'll get you in the neighborhood. It will not get you the feel — the way a real EL84 pair sags and springs back when you dig in is the thing modeling is still worst at, and I'll say that as somebody who owns one amp made in 1964 and no modelers.

## Is It Worth $1,799?

Depends what you're buying.

If you're buying a 20-watt Marshall-family head to gig with, the field is crowded and cheaper. Marshall's own Studio series covers a lot of this ground — we compared [SV20 against the rest of the line](/blog/marshall-studio-vintage-sv20-comparison), and the [Jubilee vs. JCM800 comparison](/blog/marshall-silver-jubilee-vs-jcm800) is the other axis of that decision.

If you're buying the *specific* Arredondo gain structure with three voicings of it on a switch, from the shop that inherited the tradition directly, there isn't a cheaper version of that. The three-position Gain Style switch is the feature. Everything else on the panel is standard Friedman.

My honest appraiser's read: the combo at $2,099 is the better buy of the two. A 1x12 with a Creamback in it is a complete instrument. The head at $1,799 means you still need a cab, and by the time you've bought a decent 2x12 you're past the combo's price with more to carry.

And if you're the kind of player who's going to run it direct anyway — buy the Placater block. It's already on your Helix, it costs nothing, and it'll get you eighty percent of the way for the price of an afternoon.
