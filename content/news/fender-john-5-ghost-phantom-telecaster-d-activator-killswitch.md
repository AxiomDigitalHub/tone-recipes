---
title: "Fender Gave John 5 Three More Telecasters and Took the Tone Knob Off All of Them — the D Activator Is a Passive Pickup Pretending to Be Active, and Your Modeler Can Tell"
date: "2026-10-08"
category: "new-gear"
slug: "fender-john-5-ghost-phantom-telecaster-d-activator-killswitch"
excerpt: "Fender announced three new John 5 signature Telecasters on October 6 — the Ghost and Phantom at $1,299.99 and a Custom Shop Phantom at $6,000. All three run DiMarzio D Activator humbuckers, one master volume, no tone control, and a momentary killswitch. Two of those four decisions change how you have to build a preset, and one of them is the reason a passive pickup designed to imitate an active one behaves differently in a modeler than the EMG it's imitating."
source_url: "https://www.premierguitar.com/news/fender-introduces-three-new-john-5-signature-telecaster-models"
image_url: ""
author_slug: "viktor-kessler"
---

Fender and the Fender Custom Shop announced **three new John 5 signature Telecasters** on **October 6**. John 5 is now the most-signatured Telecaster artist in Fender's history, which is a strange sentence to write about a guitar designed for country music in 1950.

What was announced:

- **John 5 Phantom Telecaster** — $1,299.99 USD / £1,149 / €1,349. Black with matching headcap, nyatoh body, C-profile maple neck, **ebony fretboard, 12" radius**, **Floyd Rose FRTS2000 Special** double-locking tremolo
- **John 5 Ghost Telecaster** — $1,299.99 USD / £1,099 / €1,299. Arctic White with red binding and matching red accents, nyatoh body, C-profile maple neck, **maple fretboard, 9.5" radius**, **6-saddle hardtail** Tele bridge
- **Fender Custom Shop John 5 "Phantom" Telecaster** — $6,000 USD / £5,599 / €6,599. Two-piece select alder with Ultra Contours, **flat-laminated ebony board with a 10"–14" compound radius**, 22 medium jumbo frets, 25.5" scale, **R7 locking nut**, **recessed Floyd Rose Original**, locking tuners, Luminlay side dots, black hardware, hardshell case

And the part that is identical across all three, which is the part worth talking about:

- **DiMarzio D Activator humbuckers**, neck and bridge, both coils permanently wired in series — no splits, no taps
- **One master volume knob. No tone control.**
- **A momentary killswitch** (arcade-style on the production Ghost and Phantom; the Custom Shop spec lists a 3-position toggle alongside the single master volume)

> "I don't know if the Telecaster picked me or I picked it. I was so drawn to that shape." — John 5

Two of those three shared decisions have real consequences for how you build a patch, and I don't think either one gets explained when these guitars get written up. So.

## The D Activator Is the Interesting Spec, and the Reason Is Impedance

DiMarzio's D Activator exists to do a specific job: **deliver the output level and the tight, compressed, fast attack of an active pickup without a battery.** It is a passive pickup engineered to imitate an EMG. That is the whole design brief, and by most accounts it does it well.

Here is what that imitation cannot cover, and it is not a tone-quality question — it is a circuit question.

An **active** pickup has a preamp inside it. The coil feeds a buffer, and what leaves the guitar jack is a **low-impedance** signal from an op-amp output. A low-impedance source does not care what it is plugged into. Cable capacitance barely touches it. The input impedance of the next device in the chain barely touches it. That immunity is a large part of why EMG-equipped guitars sound the same through a 10-foot cable and a 30-foot cable, and why they sound the same into every amp input on earth.

A **passive** pickup — the D Activator very much included — is a coil of wire. Its output is **high-impedance**, and it forms a resonant circuit with everything downstream: your cable's capacitance, your pot values, and the input impedance of whatever it hits first. Change that input impedance and you move the resonant peak. Move the resonant peak and you change the top end. This is the mechanism behind [what pickup DC resistance actually measures](/blog/pickup-dc-resistance-what-it-actually-measures) and why two pickups with the same DC resistance don't sound alike.

**So: if you buy one of these guitars because you want active-pickup tightness, and you plug it into a modeler with the input impedance set to Auto, you are not getting what you think you're getting.**

Concretely, on a Helix or HX Stomp:

1. Go to the **Input block** and set **Input Impedance explicitly**. Do not leave it on Auto. Auto sets impedance based on the first block in the chain, which means your pickup's top end changes when you switch presets. That is the single most-overlooked setting on the platform — [the full explanation is here](/blog/modeler-input-impedance-setting-what-to-set-it-to).
2. **1 MΩ** is the closest thing to "the pickup sees nothing and behaves like it would into a buffered pedal." It is the brightest and the most open. With a high-output ceramic humbucker that already has a forward upper midrange, this is often *too much* — you will hear it as fizz above 4 kHz.
3. **230 kΩ to 90 kΩ** loads the coil down, rolls the resonant peak lower, and does what players describe as "sounding like a real amp input." On a D Activator bridge pickup into a high-gain model, this is where I'd start.
4. Pick one, write it down, and use the same value across every preset in the setlist. The reason is boring and important: if impedance changes per-preset, your pick attack changes per-preset, and you will chase that for a month blaming the amp block.

The Quad Cortex handles this differently and with less exposure to the problem, but the principle survives: **a passive high-output humbucker is sensitive to what it loads into, and an active one isn't.** Buying a passive pickup that emulates an active one means you inherit active-style output and compression *plus* passive-style impedance sensitivity. That's not a flaw. It's a thing to set correctly once.

## No Tone Knob Means Your Preset Has to Do a Job the Guitar Won't

One master volume. That's it. No tone control on any of the three.

On a cranked tube amp, a single volume knob is less of a limitation than it sounds, because the volume knob *is* a tone control — rolling it back on a hot front end cleans up and darkens simultaneously. That interaction is real and it's the basis of [one amp, two sounds with the volume knob](/blog/one-amp-two-sounds-volume-knob-settings).

**In a modeler, that interaction is much weaker, and the reason is the input stage.** A modeled preamp's response to a lower input level is not identical to a tube preamp's, and the high-impedance loading that makes a guitar volume pot act as a passive low-pass is partly bypassed by the converter's input. The practical result: you roll back to 6 and you get quieter, not cleaner-and-darker in the way you expected. [The full comparison is here](/blog/volume-knob-cleanup-tube-amp-vs-modeler), and it is the most common disappointment players report after switching platforms.

So with this guitar, specifically:

- **Do not build a preset that assumes you can take 20% of the brightness out from the guitar.** You can't. There is no tone knob and the volume knob won't do it.
- **Put the trim in the preset instead.** A high-cut in the cab block or a parametric EQ with a shelf starting around 5–6 kHz is the equivalent of the tone control this guitar doesn't have. Set it once, as part of the patch.
- **Build the clean sound as its own preset, not as a volume-knob position.** John 5's own rig reportedly reflects this: he runs an **EVH 5150-series head with EL34 power tubes** into a stock EVH cab and uses **only the first two channels** — one clean, one high-gain. He switches channels. He does not roll the volume knob to get clean. Copy the architecture, not just the amp.

## The Killswitch Is a Noise Gate Problem Before It's a Technique

This is the part I actually want to flag, because it's the thing that will frustrate someone this month.

A killswitch is a **momentary switch that shorts your signal to ground** while it's held and releases when you let go. John 5 has credited Buckethead as the reason he started using one. Used at speed it produces the stutter/machine-gun effect, and on a high-gain patch it is a genuinely musical device.

**Your noise gate cannot tell the difference between a killswitch and you stopping playing.** It sees signal drop to zero and it closes. Then the switch releases, signal returns, and the gate has to open again. Every stutter is now a gate cycle, and the gate's attack and release times are now part of your rhythm.

What goes wrong, in order of how often I see it:

- **Release/decay too long.** The gate closes on the first stutter and hasn't finished reopening before the next one. You get a stutter that sounds soft, late, and uneven — the attack of each burst gets eaten. This is the most common one.
- **Threshold too high.** With a high-output pickup into a lot of gain, a threshold set to kill hiss between riffs can be high enough that the tail of each stutter burst is below it, so the gate chops the burst short rather than letting it ring.
- **Gate placed after the amp block.** Gating a high-gain amp's output means gating a signal that includes the amp's own noise floor and sustain, and the gate's decision point no longer corresponds to what your hands did.

Settings to start from, for stutter work specifically:

1. **Put the gate first, before the drive and amp blocks** — the usual rule, and it matters more here. [Gate placement in a modeler preset](/blog/noise-gate-placement-modeler-preset) covers why.
2. **Shorten the decay/release aggressively.** If you normally run something in the 100–200 ms range for riffing, cut it toward the fastest setting your platform offers for killswitch patches. You want the gate out of the way, not managing the transition.
3. **Lower the threshold until the gate stops truncating bursts**, then accept the extra hiss between riffs. If the hiss is unacceptable, that's a sign you should be solving it at the source — [threshold and decay for high-gain](/blog/noise-gate-threshold-decay-settings-high-gain) walks the trade.
4. **Consider a second preset.** A gate tuned for tight palm-muted chugging and a gate tuned for 16th-note stuttering are not the same gate. One preset will be a compromise; two won't.

There's a cleaner option worth naming: **if you do the stutter in the modeler instead of the guitar** — a tremolo block with a square wave, assigned to a footswitch — you can bypass the gate interaction entirely, because the chopping happens after the gate. It will be metronomically perfect, which is either what you want or exactly the problem. John 5's stutters are hand-timed and uneven and that unevenness is the musical content. A square-wave tremolo cannot do that. Pick based on what you're after, but know the gate cost is only on one side of that choice.

## Copping This Tone on a Modeler: the EL34 Detail Matters

If you want the John 5 high-gain sound and you're going direct, the amp model is where most people land wrong.

John 5's reported head is an **EVH 5150-series amp running EL34s**. Most modeler 5150-family models are built from the **6L6** version. That is not a cosmetic difference. EL34s in this circuit give you less low-mid thump and more upper-midrange grind and compression; 6L6s give you the tighter, bigger-bottomed voicing most people associate with the 5150 name.

Where to start:

| Platform | Model | What to know |
|---|---|---|
| Line 6 Helix / HX Stomp | **PV Panama** | The original 5150 voicing, 6L6-based. Accurate preamp character; you'll be compensating in the power-amp and EQ controls for the EL34 difference |
| Neural DSP Quad Cortex | **Peavey 5153** | The EVH III voicing rather than the original 5150; the red channel is closest to the classic sound |

Then compensate toward EL34:

1. **Pull Resonance down and Presence down** before you touch anything else. On any 5150-family model, high Presence at high preamp gain is the dominant source of the fizz people blame on "digital" — if it's buzzing above 4 kHz, Presence comes down first. [Fixing fizzy high-gain](/blog/fix-fizzy-high-gain) is the whole procedure.
2. **Take 15–20% of the gain out.** With a D Activator bridge pickup, you are already feeding the model more signal than a standard-output humbucker would. Most players leave the gain where it was and lose palm-mute definition. [The 5150 settings guide](/blog/peavey-5150-settings-guide) has the channel-by-channel numbers.
3. **Mesa 4x12 with V30s** as the cab/IR, before you experiment. That's what the amp was developed alongside, and it tames the forward upper-midrange rather than amplifying it.
4. **An overdrive in front with gain at zero and level high**, if you want the tightness. Not for distortion — for the input-impedance change and the low-end trim it puts in front of the preamp. [Tube Screamer in front of a high-gain amp](/blog/tube-screamer-before-high-gain-amp) explains the mechanism; [overdrive settings with humbuckers](/blog/overdrive-with-humbuckers-settings) covers the pickup side.

And if you only ever play the Ghost's hardtail version and wonder whether you need the Floyd model: you don't, for tone. You need it for dive-bombs and for the tuning stability under a trem arm, and you pay for it in string changes. [Floyd Rose setup](/blog/floyd-rose-setup-guide) is the honest accounting of that trade.

## My Read on the Three

The **$1,299.99** price on an Indonesian-built guitar is the thing people will argue about, and that argument is legitimate — it's a real jump from where Indonesian Fender production sat a few years ago, and the parts list (nyatoh body, FRTS2000 rather than a Floyd Original) doesn't obviously justify it on materials alone. Whether the fit and finish justify it is a question for someone who has one in their hands, and I don't.

What I'll say is narrower and I think more useful: **the two production models are meaningfully different guitars, and not in the way the finish suggests.** Ghost is a 9.5"-radius maple board with a hardtail. Phantom is a 12"-radius ebony board with a Floyd. Those are different necks and different maintenance commitments wearing matching pickups. If you're choosing between them, choose on radius and bridge, not on white-versus-black.

The Custom Shop at **$6,000** is a different conversation entirely — alder, compound radius, Floyd Original, locking nut — and it's priced where that conversation is about whether you want a Custom Shop guitar, not about specs.

One last thing, and it's the part I find genuinely interesting about all three. This is a **Telecaster with two series-wired high-output humbuckers, no tone knob, and a killswitch.** There is nothing left of the 1950 circuit except the outline. The guitar that defined [country Telecaster tone](/blog/country-telecaster-tone-settings) has been hollowed out and refilled with a metal guitar's electronics, and it works, and it has worked for John 5 for twenty years across Manson, Zombie, and Crüe. The body shape turned out to be the part that mattered. That is a reasonable thing for Fender to have noticed three signature models ago.

## Dig Deeper on Fader & Knob

- [Modeler input impedance: what to set it to](/blog/modeler-input-impedance-setting-what-to-set-it-to) — the setting that decides what a passive D Activator actually sounds like
- [What pickup DC resistance actually measures](/blog/pickup-dc-resistance-what-it-actually-measures) — why "high output" doesn't tell you the top end
- [Noise gate threshold and decay for high-gain](/blog/noise-gate-threshold-decay-settings-high-gain) — the settings a killswitch forces you to revisit
- [Noise gate placement in a modeler preset](/blog/noise-gate-placement-modeler-preset) — gate first, and why it matters more with a momentary switch
- [Peavey 5150 settings guide](/blog/peavey-5150-settings-guide) — channel-by-channel, plus the Helix and Quad Cortex model names
- [Fixing fizzy high-gain](/blog/fix-fizzy-high-gain) — Presence comes down before anything else
- [Volume knob cleanup: tube amp vs. modeler](/blog/volume-knob-cleanup-tube-amp-vs-modeler) — why a one-knob guitar needs a different preset strategy direct
- [Overdrive settings with humbuckers](/blog/overdrive-with-humbuckers-settings) — gain at zero, level up, and what that does to the input stage
- [Floyd Rose setup guide](/blog/floyd-rose-setup-guide) — the maintenance side of choosing Phantom over Ghost
