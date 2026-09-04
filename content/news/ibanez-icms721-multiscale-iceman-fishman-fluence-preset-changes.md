---
title: "Ibanez Put a 27.2-Inch Bass Side and Active Fluences on a $1,699 Iceman — Three Preset Settings That Are Now Wrong"
date: "2026-09-04"
category: "new-gear"
slug: "ibanez-icms721-multiscale-iceman-fishman-fluence-preset-changes"
excerpt: "The Axe Design Lab ICMS721, announced September 3, is the first multiscale Iceman: 25.5 inches at the treble side out to 27.2 at the bass, okoume body, bolt-on five-piece Wizard II-7 neck, Fishman Fluence Modern humbuckers, Mono-Rail G2, $1,699 / £1,539 street. Ibanez also resprayed the Vai, Satriani, and Nita Strauss flagships. The finishes are the story everywhere else. The specification that breaks your existing presets is the combination of a longer bass-side scale and an active pickup — it changes your input stage, your low-cut, and your gate threshold, in that order."
source_url: "https://www.musicradar.com/guitars/ibanez-launches-7-string-multiscale-iceman-refreshes-core-signature-artist-models"
image_url: ""
author_slug: "viktor-kessler"
---

Ibanez announced the **Axe Design Lab ICMS721** on September 3. It is the first Iceman with a multiscale fretboard, which is a sentence I did not expect to type about a body shape that has spent fifty years being a novelty silhouette for people who wanted a Les Paul that looked angry.

The specification, as published: **25.5-inch treble side running out to 27.2 inches on the bass side**, solid **okoume** body, **bolt-on five-piece Wizard II-7 neck** (maple with walnut strips), **ebony fingerboard at a 15.7-inch radius**, 24 jumbo frets, **Fishman Fluence Modern humbuckers** with two selectable voices per pickup, **Mono-Rail G2** individual saddles, **Gotoh MG-T locking tuners**, Iron Pewter finish. **$1,699 / £1,539 street.**

Alongside it, Ibanez refreshed the artist flagships: Nita Strauss's **JIVA10** in Torch Red, Joe Satriani's **JS2470CS** in Cherry Sunburst, Steve Vai's **PIA77BON2** with a 24-karat gold leaf floral print done with Bonvillain Design Studio, and Marcelo Barbosa's **MB10** with the Dyna-MIX10 switching and Alter Switch.

I want to be accurate about what that second paragraph is: those are finish changes and appointment changes on existing platforms. The pickups, scale lengths, and switching are, as far as the published specs go, carried over. If you already own a JIVA10 or a JS2470, nothing about your presets changed today. That is not a criticism — a respray is a legitimate product — but it is not a tone story, and I am not going to write four hundred words pretending it is.

The Iceman is a tone story, and specifically it is a *preset* story, because the two headline specs interact in a way that makes three settings you probably copied from an existing 7-string preset measurably wrong.

## The 27.2-Inch Bass Side Changes What Your Amp Block Receives

Start with the physics, because the marketing language around multiscale is uniformly bad.

String tension at a given pitch and gauge scales with the square of the vibrating length. Going from 25.5 inches to 27.2 inches on the low string — about a 6.7 percent increase in length — puts roughly **14 percent more tension** on that string at the same pitch and gauge. That is the actual mechanism. Everything people say about multiscale being "tighter" traces back to that number.

What higher tension does to a signal, in terms your modeler cares about:

**The attack transient gets shorter and higher in amplitude.** A tighter string reaches peak displacement faster and settles faster. Your pick attack becomes a steeper edge.

**The fundamental gets relatively quieter against the harmonics.** A slacker string dumps more energy into the fundamental and the first few partials, which is where the low-mid bloom that people call "mud" comes from. Tighter, and that energy redistributes upward.

**The pitch stability under a hard palm mute improves.** A slack low string goes measurably sharp when you press it into the bridge. Less slack, less of that. This is why drop-tuned rhythm parts on a short-scale 7 sound slightly out of tune with themselves on a sustained chug and nobody can quite say why.

Here is the consequence that matters. **The low-cut you set to control a 25.5-inch low B is now over-correcting.** Most modern high-gain presets I have looked at run a high-pass somewhere between 80 and 120 Hz ahead of or inside the amp block, and that number was chosen to deal with a low string that was producing too much fundamental energy. On a 27.2-inch bass side the source material has less of that to begin with. Leave the cut where it was and the note loses weight — you get all of the tightness and none of the authority, which is the specific failure mode that makes extended-range guitars sound thin on a mix bus.

**Start 15 to 25 Hz lower than your usual setting and move up until the palm mute stops smearing.** If you normally sit at 100, try 80. The same principle that governs [gain staging for drop tunings](/blog/gain-staging-drop-tunings) applies here in reverse: you are correcting less because the instrument is doing more of the work. If you're building the preset from scratch, [the drop-tuned high-gain walkthrough](/blog/dialing-in-drop-tuned-high-gain) is the right starting order — set the low-cut last, after the gain structure, not first.

The same logic says you can probably **take your pre-amp-block overdrive out, or turn it down.** A Tube Screamer-style boost with the gain at zero and the level high is an input-impedance and low-frequency-rolloff device — [that's the whole reason it tightens a high-gain preamp](/blog/tube-screamer-before-high-gain-amp). A 27.2-inch bass side with a ceramic Fluence is already delivering a signal with less low-frequency content than the boost was there to remove. Running both is not additive; it is subtractive twice, and the result reads as fizzy and small. I run an OD808 permanently on my own 7-string and I would take it off for this guitar before I did anything else.

## Active Pickups Break Your Input Stage Before They Reach the Amp Block

The Fluence Modern is an active pickup. It runs off a battery, has a low output impedance, and puts out a hot, consistent signal that does not care what it is plugged into.

Two settings in your modeler are affected, and both live upstream of every other thing in the preset — which means getting them wrong invalidates all the tuning you do downstream.

**Input impedance.** Most modelers let you set the guitar input impedance, and the default is usually auto or a mid-range value. That setting exists to emulate the loading a passive pickup sees from a real amp's input stage, and with a passive pickup it genuinely changes the resonant peak and therefore the top end. With an active pickup, the output buffer means the setting does substantially less — but "less" is not "nothing," and the auto mode's guess may not be the one you want. [The input impedance setting is worth understanding rather than leaving on auto](/blog/modeler-input-impedance-setting-what-to-set-it-to), especially on a guitar where you will be switching between two output levels.

**Input pad.** This is the one people actually get bitten by. A hot active pickup into a fixed-headroom converter can clip the input stage on a hard strum, and converter clipping is not amp distortion — it is a hard, ugly artifact that no amount of downstream EQ will remove. Check your input meter with the bridge pickup on Voice 1 and the hardest right hand you have. If it pins, [engage the pad](/blog/modeler-input-pad-when-you-need-it) and re-set your levels from there. If you skip this and then spend an hour chasing harshness in the cab block, you will not find it, because it is not there.

## The Voice Switch Is a Preset Problem, Not a Tone Control

Fluence pickups carry two voicings per pickup, selectable from the guitar. On the Modern ceramic set, Voice 1 is the high-output modern voicing — searing, tight low end, the reason people buy these. Voice 2 is a lower-output, more open voicing with different harmonic content.

Every review will describe this as versatility. From a preset standpoint it is a **level and EQ discontinuity that your gain structure has to survive**, and that is a different problem.

Two things change when you flip that switch: output level, and the frequency balance hitting the amp block's input. A gain structure tuned around Voice 1 will, on Voice 2, sit lower in the amp model's gain curve — which is fine and often desirable — but the noise gate does not know that.

**This is the specific failure.** You set a gate threshold on Voice 1, where the pickup is hot and the noise floor is low. You flip to Voice 2, the signal drops several dB, and the threshold you chose is now sitting inside your sustain. Notes chop off. The gate stutters on decays. Everyone blames the gate, which is not the component that changed.

Set the threshold on **the quieter voice** and let the louder one clear it comfortably. That is the correct order of operations, and it is the same reasoning behind [setting threshold and decay against your actual playing rather than against silence](/blog/noise-gate-threshold-decay-settings-high-gain). One more thing in the Fluence's favor here: an active pickup with a low output impedance has a genuinely low noise floor compared to a high-output passive, so you may find you can back the threshold off further than your instincts say. Do that. An over-tight gate is more audible than a small amount of hiss, every time.

If the two voices end up too far apart to share one preset, the honest answer is two snapshots with different input trims — not one compromise gate setting that half-works on both.

## What I Have Not Measured

I have not played this guitar. Nobody has, outside of Ibanez.

Things I would want to check before recommending it, and which no spec sheet answers: whether the **bolt-on** construction changes the Iceman's sustain character against the set-neck models — this is a real departure for the platform and I do not want to guess at it. Whether **okoume** behaves like the mahogany it is usually substituted for; it is lighter and generally slightly brighter in my experience with it in other builds, but that is anecdote, not data. And whether the **Mono-Rail G2** saddles on a multiscale hold intonation as well across the fanned spread as they do on a straight-scale RG, since individual saddles are exactly the right bridge choice for a fanned layout but the setup tolerances are less forgiving.

Also worth saying plainly: a 27.2-inch bass side is a real adjustment for the fretting hand, particularly on chords low on the neck. Multiscale is not free ergonomics. It is a trade, and if you have never played one, play one before you buy one on spec.

## Who This Is Actually For

If you are running a 25.5-inch 7-string in drop A and have been fighting the low string on every sustained palm-muted section — going sharp under pressure, smearing into the amp block, needing an aggressive low-cut that hollows out the note — this addresses that at the physical layer, and $1,699 for a Fishman-loaded multiscale with a locking-tuner setup is a defensible number.

If you play in standard B and your low string already behaves, this is a shape preference with a specification list attached, and there is no shame in that. Just do not tell yourself the multiscale is going to fix a gain-structure problem. It will not. [Fizz is a gain-staging failure, not a scale-length failure](/blog/fix-fizzy-high-gain), and it follows you to whatever guitar you buy next.

And if the thing you actually want is the Vai gold leaf: it is a beautiful respray of a guitar whose electronics did not change today. Buy it because it is beautiful. That is a complete reason.
