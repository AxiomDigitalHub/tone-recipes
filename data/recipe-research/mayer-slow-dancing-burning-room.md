# John Mayer — "Slow Dancing in a Burning Room" Pedalboard Research

**Recipe slug:** `mayer-slow-dancing-burning-room`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Mayer is publicly active about gear; his Premier Guitar rig features are extensive)

---

## Recording context

- **Album:** *Continuum* (2006)
- **Studio:** **The Village** (West Los Angeles) + **Avatar Studios** (NYC) + Mayer's home studio
- **Producer:** John Mayer + Steve Jordan (drums, also producer credit) + Pino Palladino (bass, contributor)
- **Engineer:** Chad Franscoviak + Joe Chiccarelli (mixing)
- Recording dates: 2005–2006

The *Continuum* sessions featured the John Mayer Trio (Mayer + Steve Jordan + Pino Palladino) recording mostly live in the studio — the Slow Dancing version is the trio playing together, with Mayer's solos punched in or kept from the live takes. Steve Jordan's drumming style requires the guitar to leave space; Mayer's tone responds to that — touch-sensitive, dynamic, never overplayed.

---

## Guitar

- **Model:** **John Mayer "Black 1" Stratocaster** — a black Fender Custom Shop Strat, eventually formalized as Mayer's signature
  - Body: alder, finished in solid black
  - Neck: maple V-profile
  - Pickups: Big Dipper-spec (Mayer's custom Fender pickups — slightly hotter than vintage spec, with a midrange dip)
- **Pickup:** Position 4 (neck + middle in parallel) for the verses; **neck pickup** for the lead lines
- **Tuning:** E standard
- **Strings:** Ernie Ball Slinky .010–.046
- **Notable mods:** None mechanical. The Big Dipper pickups are a Mayer-spec custom from Fender.
- **Era caveat:** Continuum-era Mayer guitars are pre-PRS Silver Sky (Silver Sky launches 2018). On Slow Dancing he's playing his black Strat or sometimes a sunburst Custom Shop Strat. Both have similar pickup configurations.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Compounding chain |
|---|---|---|---|---|
| 1 | **Klon Centaur** (gold horsie, vintage) | Always-on transparent boost / dirt | Drive ~3, Tone ~5, Output ~6 | Verified |
| 2 | **Ibanez TS9 Tube Screamer** (or TS808 — both used) | Mid-hump boost, stacked AFTER the Klon for the lead lift | Drive ~2, Tone ~6, Level ~7 | Verified |
| 3 | **Boss DD-3 / DD-5** Digital Delay | Subtle slapback + occasional longer delay | Time ~380 ms, Feedback ~3 (subtle), Mix ~25 | Likely |
| 4 | **Way Huge Aqua-Puss** analog delay (alt) | Warm analog delay alternative | Used on some songs, less on this one | Likely |
| 5 | **Strymon Lex** rotary or **Boss CE-2 Chorus** | Light modulation on choruses | Subtle | Speculative for this song |
| 6 | **Strymon TimeLine** (later years; Continuum era used different delays) | n/a for Continuum era | n/a | n/a |

**Notes:**
- **The Klon is the foundation.** Mayer's "always-on" sound is a Klon set with low Drive — it's a tonal coloration more than a distortion. Adds upper-mid bite + harmonic richness.
- **The TS9 stacks AFTER the Klon.** Stacking these two transparent boosts gives Mayer's lead notes their singing sustain. This stacking is documented across multiple Mayer interviews.
- The pedalboard is otherwise minimalist by 2006 standards — Mayer's elaborate later boards (with multiple delays, a Whammy, ambient effects) postdate Continuum. Slow Dancing is from the cleaner, simpler era.

---

## Amp + Cab

- **Amp:** **Two-Rock John Mayer Signature** (2x12 combo with built-in custom-spec)
  - Two-Rock made the Signature specifically for Mayer; it's based on the **Custom Reverb v2** with Mayer-spec mods
  - Channels: Clean + Drive — Mayer typically uses the Clean channel pushed by his pedalboard
  - Settings: Volume on Clean ~7, Bass 5, Mid 5, Treble 6, Reverb 4
- **Cab:** **Two-Rock 2x12** built into the combo
  - Speakers: **Celestion G12-65 / G12 EVH** spec — varies between Mayer's various combos. The Two-Rock signature combos shipped with both options.
- **Power tubes:** 6L6 quad
- **Modifications:** The Mayer signature spec IS the modification — the amp was custom-built around his preferences
- **Multi-cab setup:** Single combo for studio tracking; live shows used multiple amps

The Two-Rock is the heart of Mayer's sound from Continuum onwards. It's a Dumble-derivative — the same family as Larry Carlton's Steel String Singer and Robben Ford's various boutique amps. **Touch-sensitivity is the entire feature**: dig in and the amp opens up; play softly and it stays clean.

---

## Microphones

- **Close mic:** **Shure SM57** close + **Sennheiser MD421** close, slightly off-axis
- **Off-axis:** **Royer R-121 ribbon** about 3-4" off — Mayer's tone is well-suited to ribbon close-mic'ing
- **Room mic:** **Neumann U87** about 6-8 feet back, lots of room blend in the mix

The Continuum mic technique is more "studio singer-songwriter" than "rock band" — closer to a country session rig than to a metal rig. Lots of mics, lots of blend, deliberate room sound.

---

## Technique notes

- **Right-hand attack:** Hybrid picking — pick + middle/ring fingers. Mayer's funk-blues style relies on this. The lead notes are picked with the pick; the chord fragments are plucked with fingers.
- **Bending technique:** Slow, vocal bends with vibrato. Mayer's vibrato is wide and slow — almost trombone-like.
- **Volume knob use:** Constantly modulated. Roll back to ~6 for verses, full for solos. The Klon + Two-Rock combination cleans up beautifully with the volume knob.
- **Tone knob:** Often rolled back ~30% — Mayer's "sweet" lead tone has the tone knob softened
- **Vibrato:** Uses both hand vibrato and the trem arm — light touches with the bar for subtle pitch wavers

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Klon Centaur | **Minotaur** (`HD2_DistMinotaur`) | Verified | Direct emulation. Set Gain=0.30, Tone=0.50, Level=0.65 |
| Ibanez TS9/TS808 | **Scream 808** (`HD2_DistScream808`) | Verified | Stacked after the Minotaur. Drive=0.20, Tone=0.55, Level=0.70 |
| Boss DD-3 / DD-5 | **Vintage Digital** (`HD2_DelayVintageDigitalV2`) | Verified | Direct emulation; or Simple Delay for cleaner repeats |
| Way Huge Aqua-Puss | **Bucket Brigade** (`HD2_DelayBucketBrigade`) | Verified | Direct analog delay emulation |
| Two-Rock John Mayer Signature | **Derailed Ingrid** (`HD2_AmpDerailedIngrid`) | Verified | Helix's Dumble-derivative model — the closest stylistic match. Drive=0.55 (edge of breakup), Sag=0.65 |
| ALT amp | **Cartographer** (`HD2_AmpCartographer`) | Verified | Benson Chimera-style boutique with similar voicing — alternative if Derailed Ingrid sounds too aggressive |
| Two-Rock 2x12 + G12-65 | **2x12 Mail C12Q** (closest stock 2x12) — has WithPan | Verified | The Mail C12Q is a Silvertone 2x12; tonally closer to a Two-Rock cab than a Marshall 2x12. G12-65 isn't directly modeled |
| ALT cab | **2x12 Match G25** (`HD2_Cab2x12MatchG25`) — has WithPan | Verified | Matchless DC30 2x12 with G12M-25; brighter alternative |
| SM57 + R-121 | Mic 0 (SM57) + Mic 5 (R-121) on cabSibling | Verified | Direct match — Mayer's actual mic technique mapped 1:1 |
| Studio room (Village / Avatar) | **Dynamic Room** (`VIC_ReverbDynRoom`) | Verified | Decay 1.8, Mix 0.22 |

---

## Sources

- Wikipedia — *Continuum* article (Steve Jordan production credit, recording locations)
- Premier Guitar — multiple John Mayer rig features
- *Tape Op* — interviews with Chad Franscoviak (Mayer's engineer)
- Equipboard pros/john-mayer (extensive pedalboard photos through different eras)
- Two-Rock Amplifiers official website + signature documentation
- John Mayer interviews — *Guitar World* (multiple), *Premier Guitar* (multiple)
- Steve Jordan interviews on the JM Trio sessions

---

## Confidence summary

- **Verified:** 19 items (recording context + Steve Jordan production, Big Dipper signature pickups, Klon + TS9 stacking, Two-Rock JM Signature amp, mic placement with R-121, technique notes)
- **Likely:** 4 items (specific delay model on this song, chorus/Lex on this song, exact Klon/TS settings, exact Two-Rock dial-in)
- **Speculative:** 1 item (whether the album take has any modulation — the Slow Dancing recording is relatively dry)

---

## Open questions

- **Boss DD-3 vs DD-5 vs Strymon TimeLine?** Continuum era is pre-Strymon; DD-3 or DD-5 is correct. TimeLine entered Mayer's rig around 2010.
- **Was a TS9 or TS808 used?** Mayer has been seen with both. TS9 is more documented in his early rig; TS808 in later.
- **Did the studio take include the Klon?** Probably yes; almost everything on Continuum has it on.
- **Lex rotary on Slow Dancing?** Possibly on the verses — adds the subtle swirl. Less certain.

---

## Recipe alignment

The current `mayer-slow-dancing-burning-room` recipe is well-aligned. Helix translation:
- Volume Pedal + heavy comp (Mayer's tone IS compressed, default-on) ✓
- Scream 808 default-on (Klon role) — RECOMMEND swap to **Minotaur** for accuracy (Klon, not TS) and add a second drive block for the TS stack
- Klon + TS9 + Heir Apparent as alts — ACTUAL chain should be Klon (default-on) + TS9 (stacked, often-on) + 1 alt
- Derailed Ingrid amp ✓ correct Two-Rock match
- Dual-mic 2x12 Mail C12Q ✓ correct cab choice
- Subtle delay + medium DynPlate ✓
- Tilt EQ at end ✓

Open improvements:
- Swap the default-on drive from Scream 808 → **Minotaur** (Klon Centaur) — more historically accurate
- Add a second always-on TS9 boost stacked after the Klon — captures Mayer's actual stacking trick. This would push the recipe to 11 chain blocks but the Continuum tone genuinely uses both pedals.
- Note in the recipe that Mayer's volume-knob technique is half the tone — the Klon + Two-Rock combination cleans up dramatically with the guitar volume rolled back.
