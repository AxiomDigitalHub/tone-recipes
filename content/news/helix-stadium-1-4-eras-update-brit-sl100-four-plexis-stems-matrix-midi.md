---
title: "Helix Stadium 1.4 Puts Four Different Plexis Behind One 'Era' Knob — and Quietly Gives Worship Teams MIDI Mute Over the Click and Tracks. Here's How to Use Both"
date: "2026-10-14"
category: "firmware-update"
slug: "helix-stadium-1-4-eras-update-brit-sl100-four-plexis-stems-matrix-midi"
excerpt: "Line 6's free Helix Stadium 1.4 'Eras Update' adds 14 Agoura amp channels (a Marshall Super Lead in '67, '68, '70 and '71 versions, an Omega Granophyre, and an Agoura Litigator called the Prosecutor), six effects, cloud stem separation in Showcase, USB editing, and a full MIDI CC map for the Matrix Mixer. The Era parameter changes how you dial a Plexi, and the Matrix CCs change how you run Sunday morning."
source_url: "https://kb.line6.com/helix-stadium-1-4-release-notes"
image_url: ""
author_slug: "sean-nakamura"
---

Line 6 released **Helix Stadium 1.4, "The Eras Update,"** on October 13. It's free for Helix Stadium XL, Helix Stadium Floor, and [Helix Stadium Native](/news/line6-helix-stadium-native-intro-free-plugin). Hardware owners also need the latest Helix Stadium app. Download it from line6.com/software.

I read the full release notes rather than the press summary, because what matters here is in the parameter list. Two things in this update change how you build presets: the **Era** parameter on the new Marshall model, and the **Matrix Mixer MIDI map**. The rest is good, but those two are why I'd update before this weekend.

## What's New, Itemized

**Amps (14 new Agoura channels from 6 amps, condensed into 3 models).** That brings Agoura to 67 channels. With the 111 HX channels, the platform totals 178.

- **Brit SL100.** Based on the Marshall Super Lead in four eras: **'67, '68, '70, '71**. Each era has Normal, Bright, and Jumped channels, 12 channels in total.
- **Omega Granophyre.** Based on the Omega Ampworks Granophyre 6L6. It has a High/Low input **Jack** parameter, a **Voice** switch that moves the Mid knob between a lower-mid and a higher-mid focus, and an **NFB** Open/Closed switch.
- **Prosecutor.** The first Line 6 Original built on Agoura. Line 6 started from the HX **Litigator** and replaced every tube DSP block with its Agoura version.

**Effects (6 new):**

- **Mercator** (Distortion): the tube preamp from Ben Adrian's Cartographer, rebuilt as a drive pedal with an active 3-band EQ. Drive and Drive 2 sit between tube stages 1–2 and 2–3, and there are two Bright switches. It uses less DSP than the full preamp.
- **Rock Box Dist** and **Rock Box Boost** (Distortion): the two halves of the Z.Vex Box of Rock.
- **PortaBox 424** (Distortion): the JHS 424 Gain Stage, which is itself derived from the Tascam Portastudio 424 preamp. Gain 1, Gain 2, Bass, Treble.
- **Essex Vibe** (Modulation): the vibrato circuit from a Top Boost Vox AC-30. Rate syncs to tempo, and Stages selects 1 or 2 phase-shift stages.
- **Dimension W** (Modulation): the BOSS DC-2W Waza Craft. It covers both the 1985 Dimension C pedal and the 1979 Dimension D rack, including the combined-button modes.

**Features:** cloud stem separation in Showcase, Skip Markers, USB editing from the app, nested folders for Proxy clones, mono↔stereo block swap that keeps settings, MIDI control of the Matrix Mixer, per-preset or global expression pedal settings, a shorter audible gap on preset changes, and a long list of bug fixes.

## The Brit SL100: Era Is the Knob You Used to Change With a Soldering Iron

The legacy HX Plexi models give you one amp. If it was too bright or too fizzy, your only options were EQ or a different amp. The SL100 adds a choice HX never had: **which year's circuit you're playing through**. Per Line 6, preamp gain rises over the four eras, and the Bright channel changes through the bright cap and coupling cap values. Line 6 left out a '74 because it differs from the '71 only in bright cap value. They cover that with a separate **BrightCap** parameter: none, or the four most common values from the amp's history, applied to the Brt Drive only.

That means you have two separate controls for the same complaint, and I'd use them in a fixed order:

1. **Pick the Era for gain structure first.** If you're running the amp clean-ish with a pedal in front, start early ('67/'68). If you want the amp itself to do the crunch, start later ('70/'71). Set Era at the volume you'll actually play at. A change in gain structure sounds very different at bedroom level.
2. **Then use BrightCap for top end, not Treble.** Treble moves the tonestack. BrightCap changes how much high end bypasses the Brt Drive pot, and on a real amp that effect depends on how far the pot is turned up. If the amp is spiky with Brt Drive low and fine with it high, that's the bright cap, so turn BrightCap down rather than turning Treble down.
3. **Jumped channels: balance the two Drives.** The release notes confirm the inactive channel bleeds into the active one, which is how a real jumpered Plexi behaves. Our [jumping amp channels explainer](/blog/jumping-amp-channels-what-the-patch-cable-actually-does) covers what that patch cable does. In practice, Nrm Drive is your low-end and body control and Brt Drive is your bite. Set them separately. Don't move them together.

If you've built an AC/DC-style rhythm on the HX Plexi (see our [AC/DC rhythm tone recipe](/blog/acdc-rhythm-tone-recipe)), rebuild it on the SL100 and try the eras side by side at matched output. Use **Level** for that, since Line 6 says it affects volume only, not tone. Level-match with the [preset level-matching method](/blog/level-match-modeler-presets) before deciding. Otherwise the louder era will win every time. I'm not going to tell you which era is right until I've run that comparison. You shouldn't trust a forum post that names one without doing it either.

## The Granophyre's Volume vs. Master Note Is the Real Tip

Line 6's notes include a dialing tip worth taking literally. The Granophyre's **Volume** sets the preamp level into the phase inverter. **Lower Volume with higher Master** gives chunkier lows. **Higher Volume with lower Master** gives darker, grittier mids. These two knobs set where the distortion happens, so they aren't interchangeable. For a tighter 6L6 rhythm, keep Volume down and get loudness from Master. Line 6 also says 1.4 improves cab and Agoura power-amp interaction, most noticeably on 6L6 high-gain amps with Presence turned up. If you set Presence on a 6L6 Agoura preset before 1.4, check it again now.

## Matrix MIDI: The Worship Feature Nobody's Headlining

This is the one for anyone running Showcase on Sunday. Each Matrix layer (1/4", XLR, Phones) now has its own MIDI channel: **Ch. 3, 4 and 5 by default**. Each source gets CCs for Level, Pan, Mute and Solo. The ones that matter on stage:

| Source | Level | Pan | Mute | Solo |
|---|---|---|---|---|
| Click | CC25 | CC48 | CC71 | CC94 |
| Count In | CC26 | CC49 | CC72 | CC95 |
| Song (all tracks) | CC16 | CC39 | CC62 | CC85 |
| Tracks 1–8 | CC17–24 | CC40–47 | CC63–70 | CC86–93 |

Mute and Solo toggle on any value of 64 or higher. CC103 clears all solos. One trap: a Matrix layer can't share a channel with Global MIDI (Ch. 1) or assignable controls (Ch. 2). If your MIDI controller already sends on 3–5 for something else, remap the layers in Global Settings > MIDI first.

What you get from this: **mute the click in the house (XLR layer) while keeping it in your in-ears (Phones layer) from one footswitch**, or drop the tracks for a spontaneous moment without touching the screen. If you're building this into a Sunday rig, layer it on the snapshot structure from our [Helix worship snapshots guide](/blog/helix-worship-snapshots-sunday-morning). The in-ear side is covered in [guitar tone in in-ear monitors](/blog/guitar-tone-in-ear-monitors).

## Stem Separation: Useful for Learning, With a Dependency

Showcase can now split a single audio file into five stereo stems (drums, bass, guitar, vocals, other) using **Yamaha's Music Connect** cloud service. Line 6 describes free access as "a convenience." The notes don't promise limits, pricing, or permanence, so don't build your whole setlist prep around it being there forever. If you already use another separation tool, you can import up to 8 stereo WAV stems into a new song directly. That's the safer workflow.

For learning parts, solo the guitar stem to hear the part, then mute it and play in its place. That's the fastest way I know to check whether a [worship tone recipe](/blog/goodness-of-god-guitar-tone-helix) actually sits where the record's guitar sits, rather than sounding right on its own.

## The Smaller Fixes That Matter

- **Mono↔stereo swap keeps settings, but clears snapshot and controller assignments.** Reassign them after swapping, or your snapshots will silently stop moving that block. This is the Stadium version of the trap in our [legacy mono/stereo collapse piece](/blog/helix-legacy-blocks-mono-stereo-collapse).
- **Expression pedals can now be global or per preset.** If you want a volume pedal to behave the same in every preset, set it Global once.
- **Dimension W's Mode** runs 1 through 4 and the combos, and higher numbers mean more effect. For a doubled-clean width that survives a mono sum better than a stereo chorus, start at the low modes.

## What I'd Do First

Update, then spend one session on just the SL100: one guitar, matched Level, the four eras at gig volume, Brt Drive at 3 and then at 7 on each, and a note on which BrightCap value you settle on. It's 16 data points and one evening. Then map Click Mute on the XLR layer to a footswitch and test it with your sound person before Sunday, not during.

*Helix Stadium 1.4 is free for Helix Stadium XL, Floor, and Native. Full details are in [Line 6's 1.4 release notes](https://kb.line6.com/helix-stadium-1-4-release-notes).*

## Dig Deeper on Fader & Knob

- [Helix Stadium Native: the free plugin](/news/line6-helix-stadium-native-intro-free-plugin): the desktop side of this update.
- [Jumping amp channels explained](/blog/jumping-amp-channels-what-the-patch-cable-actually-does): what the SL100's Jumped channels model.
- [Helix worship snapshots for Sunday morning](/blog/helix-worship-snapshots-sunday-morning): where Matrix MIDI fits.
- [Level-matching modeler presets](/blog/level-match-modeler-presets): required before comparing eras.
- [Helix amp model cheat sheet](/blog/helix-amp-model-cheat-sheet): the HX side of the 178-channel list.
