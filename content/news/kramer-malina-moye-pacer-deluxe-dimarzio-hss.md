---
title: "Kramer's Malina Moye Pacer Deluxe Pairs Two Vintage-Output Single-Coils With a Super Distortion — and That Gap Will Wreck Your Presets"
date: "2026-07-30"
category: "new-gear"
slug: "kramer-malina-moye-pacer-deluxe-dimarzio-hss"
excerpt: "Kramer's 50th-anniversary signature for Malina Moye is a Splash Blue Pacer Deluxe with a left-handed version in the lineup and a DiMarzio HSS set: Virtual Vintage Blues, Area 67, and a Super Distortion in the bridge. That last one is the story. You're putting a vintage-output single-coil and one of the hottest humbuckers ever sold on the same five-way switch, with no tone control on the bridge — and if you go direct into a Helix or Quad Cortex, positions 1 and 5 are not going to hit your amp block like the same guitar. Here's how to wire the preset so they do."
source_url: "https://www.gibson.com/blogs/gibson-gazette/kramer-launches-the-malina-moye-pacer-deluxe"
image_url: ""
author_slug: "margot-thiessen"
---

There is a particular kind of guitar I find myself defending a lot, and it's the one where somebody looked at the standard HSS Strat layout — the most boring, most reasonable pickup configuration in the world — and made an actual *choice* about what goes in each slot instead of ordering the catalog default.

Kramer's new **Malina Moye Pacer Deluxe** is that guitar. It arrived this week as part of the brand's 50th-anniversary run, and Moye is Kramer's first woman of color signature artist. It's Splash Blue with gold hardware and a tortoiseshell pickguard, which is a color combination I did not expect to like and have now looked at eleven times.

But the pickguard isn't the interesting part. The interesting part is what's underneath it.

## What Kramer Actually Built

- **Body:** alder
- **Neck:** bolt-on maple with a skunk stripe, custom Medium C profile
- **Fingerboard:** maple, 10" radius, 22 medium-jumbo frets
- **Pickups:** DiMarzio HSS — **Virtual Vintage Blues** (neck), **Area 67** (middle), **Super Distortion** (bridge)
- **Controls:** five-way blade, master volume, and **two** tone controls — one for the neck pickup, one for the middle
- **Hardware:** Kramer modern two-point non-locking vibrato, Kramer locking tuners, Graph Tech TUSQ nut, gold knurled knobs
- **Finish:** Splash Blue, gold hardware, tortoiseshell pickguard
- **Left-handed:** yes — a proper lefty version, in the launch lineup, not as a special order
- **Price:** listed between **$1,299** (Guitar Center, Musician's Friend) and **$1,499** (Sweetwater) depending on retailer
- **Case:** premium Kramer gig bag with a reproduction of Moye's signature

Two things deserve to be said out loud before we get to the tone. First: a left-handed version, at launch, in the same finish, at the same price. Moye plays left-handed and upside down, and a signature model that quietly assumes lefties will just deal with it would have been absurd — but plenty of brands would have shipped it that way anyway. Second: Moye's own quote on the build was that she wanted it to be *"a completely different type of Kramer,"* and the pickup selection is where that shows up. This is not a Pacer with a hot bridge humbucker for shred. It's a Pacer built for rock, blues, soul, and funk to live in the same instrument.

Which is a genuinely hard thing to ask a five-way switch to do.

## The Part That Matters at 11 PM On a Wednesday

Here's the thing about this pickup set that nobody is going to mention in a launch post, and it's the thing you'll feel within about four minutes of plugging into a modeler.

**The Super Distortion is not a "hot" pickup by modern standards. It's the pickup that *invented* the category.** DiMarzio released it in 1972 as the first commercially successful aftermarket replacement humbucker, and its entire reason for existing was to push a Marshall's front end harder than a PAF could. Ceramic magnet, high output, thick mids, and a compressed, forward attack.

The Virtual Vintage Blues and the Area 67 are the opposite design brief. They're DiMarzio's hum-cancelling takes on vintage-output Strat single-coils — the Area 67 in particular is voiced around a late-'60s Strat, which is a *low* output pickup with an open, glassy top end.

So the five-way on this guitar spans a bigger output range than almost anything else you'd call a Strat. Position 5 (neck) is vintage-level. Position 1 (bridge) is the pickup that was designed in 1972 to overdrive amps that wouldn't otherwise overdrive. That's not a nuance. That's a different input signal.

Through a real amp, you barely think about it — you turn down, the amp cleans up, your hands sort it out. Through a modeler going direct, **it changes which amp you're playing.** Not the model. The behavior. A Plexi block sitting right at the edge of breakup on the neck pickup will be in full crunch on the bridge, and the *same drive knob* will produce two different amps depending on which way you flicked the switch. This is the same front-end math I've walked through for [overdrive with humbuckers](/blog/overdrive-with-humbuckers-settings) and the [pickup position guide](/blog/pickup-position-guide) — it's just wider here than usual.

And there's a second trap sitting in the control layout: **the bridge pickup has no tone control.** Master volume, tone for neck, tone for middle. That's classic Strat wiring and it's correct for the instrument, but it means the one position with the hottest, thickest, most aggressive pickup is also the one position where you cannot roll off any top end at the guitar. Every bit of brightness management for position 1 has to happen inside your preset.

## Building the Preset So the Switch Is a Feature

Five moves. This is how I'd set it up if I were gigging this guitar direct to a PA, and the order matters.

1. **Dial your core amp block on the middle pickup, not the bridge.** Position 3 (Area 67) is the lowest-output pickup on the guitar and the one you're most likely to use for funk rhythm. Set your amp's drive so *that* position sounds right, then let the neck fill in warmer and the bridge push it into real gain. Building the other direction — bridge first — leaves you with three positions that sound anemic and no way back.

2. **Put a level trim on the bridge position, not a gain change.** If your platform can do per-snapshot gain (Helix snapshots, QC scenes), assign a small **−2 to −3 dB** input trim to the bridge selection. You are not trying to make a Super Distortion sound like a single-coil. You're trying to keep it from jumping 6 dB in the mix when you switch for a solo. Same discipline as [level-matching presets across a setlist](/blog/level-match-modeler-presets), applied inside one patch.

3. **Fix the bridge brightness in the preset, since the guitar can't.** A high-cut around **6–7 kHz** on the bridge position tames the ceramic-magnet edge without turning it into mud. If your modeler lets you snapshot an EQ block, that's the cleanest place for it — [the modeler EQ guide](/blog/modeler-eq-guide) covers where in the chain to land it. Do not solve this by pulling treble on the amp block, because that setting follows you into positions 2–5, where you actually wanted the treble.

4. **Compressor before the amp, and leave it on.** This is a funk-and-soul guitar. A compressor in front evens out the output disparity across the five-way better than anything else you can do, and it's the backbone of the clean rhythm sound anyway. Start around a 4:1 ratio with light gain reduction — [the compressor settings guide](/blog/compressor-pedal-settings-guide) has the starting points, and [compressor placement in a modeler preset](/blog/compressor-placement-modeler-preset-pre-amp-post-amp) covers pre-amp vs. post-amp, which matters more than people think here.

5. **Use position 2 and 4 more than you think you will.** The in-between positions on a set like this — bridge-plus-middle especially — split the difference in output and give you the hollow, quacky voice that carries funk rhythm through a mix. On a guitar with this much output spread, the notched positions are the ones that make the whole thing hang together.

## Chasing the Moye Side of It

If what you actually want is the tone this instrument is pointed at — rock, blues, soul, and funk on one guitar — the honest answer is that the amp matters less than the compression and the right hand.

Start with a clean-to-edge-of-breakup blackface or Deluxe-style block. Not a high-gain model. Moye's playing lives in that place where the amp is *just* starting to give, and every bit of grit past that comes from either the pickup or your attack. If you want a map of which block on your unit does this, [the Helix amp model cheat sheet](/blog/helix-amp-model-cheat-sheet) and [the best Helix amp models for blues](/blog/best-helix-amp-models-blues) will get you there faster than scrolling.

For the funk rhythm side, the clean chain in [the Khruangbin clean funk tone recipe](/blog/khruangbin-clean-funk-tone) is a very good starting frame — compressor, minimal drive, bridge-and-middle position, and the discipline to leave the reverb quieter than you want it. Swap the reverb for a shorter room and you're most of the way there.

For leads, the Super Distortion into a pushed clean amp is a classic and slightly unfashionable sound — it's thick, mid-forward, and it sustains without needing much gain. Add a clean boost rather than more drive; [clean boost vs. overdrive for solo boosts](/blog/clean-boost-vs-overdrive-vs-volume-pedal-solo-boost) explains why that stays cleaner in a mix. And if you want to follow the upside-down-lefty lineage all the way back — Hendrix, Albert King, and now Moye — [the Hendrix fuzz tone recipe](/blog/hendrix-fuzz-tone-recipe) is the other end of that thread.

## Should You Buy One

At $1,299 to $1,499 with a full DiMarzio set, locking tuners, a TUSQ nut, and a two-point trem, the value math is fine — the pickups alone are roughly $300 of the price, and buying a cheaper Pacer and installing them yourself lands you in the same neighborhood with more work and less resale.

What I'd actually tell you is this: the reason to buy this specific guitar is the pickup combination, and the reason to be careful about it is *also* the pickup combination. If you play one voice — all clean, or all high-gain — you don't need this much range and you'd be happier with a matched set. If you're the player who does a soul rhythm part, a clean funk verse, and a fat lead in the same forty minutes, this is a genuinely well-thought-out instrument and the five-way is a real tool.

Just don't build your presets on the bridge pickup. Build them in the middle and let the switch move you outward in both directions. That's the whole trick, and it's the one thing the spec sheet will never tell you.
