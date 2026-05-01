# Jimi Hendrix — "Voodoo Child (Slight Return)" Pedalboard Research

**Recipe slug:** `hendrix-voodoo-child-wah`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Eddie Kramer engineering memoirs are the definitive source for Electric Ladyland gear)

---

## Recording context

- **Album:** *Electric Ladyland* (1968)
- **Studio:** **Record Plant Studios**, New York City (Studio A)
- **Producer:** Jimi Hendrix + Eddie Kramer (Kramer was the engineer but functionally co-produced)
- **Engineer:** **Eddie Kramer** (THE Hendrix engineer; engineered every Experience studio album)
- Recording dates: April–August 1968

Voodoo Child (Slight Return) was tracked late in the Electric Ladyland sessions. The take that made the album is famously the THIRD take — Hendrix wanted a "slight return" of the longer Voodoo Chile from earlier in the album. Recorded in essentially one live take with the Experience.

---

## Guitar

- **Model:** **1968 Fender Stratocaster** (white/olympic white finish)
  - Hendrix played LEFT-HANDED on a right-handed Strat, flipping it upside down — which means the cutaway is on the LOW string side, the controls and bridge plate face up, and the strings are reversed (low E on bottom)
  - The pickup positioning relative to the strings creates a unique tone: the bridge pickup is now closer to the bridge, the neck pickup is now closer to the fretboard
- **Pickup:** Stock Fender 1968 single-coils. **Neck pickup** for the main verse riff (the famous slow funk pickup); **bridge** for harder solo accents
- **Tuning:** Eb standard (down 1/2 step) — Hendrix tuned down for vocal range and string feel
- **Strings:** Fender Rock & Roll .010-.038 (with a wound G string — common in late 60s) OR Fender 150s
- **Notable mods:** None — the Strat was stock. Hendrix replaced bodies/necks frequently due to wear, so different "white Strats" appear across different sessions, but always stock.
- **Era caveat:** Hendrix's Strats are passive single-coils. NO active electronics, NO pickup swaps, NO mods. The whole point of his tone is what one of his hands could pull out of a stock Strat.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Vox Cry Baby Wah** (V846 era) | DEFAULT-ON throughout the song — THE Voodoo Child sound | Constantly modulated by foot | Verified |
| 2 | **Dallas-Arbiter Fuzz Face** (germanium transistor) | Used for solo sustain | Volume ~7, Fuzz ~7 | Verified |
| 3 | **Octavia** (Roger Mayer prototype) | Used briefly on the solo for upper-octave fuzz | Engaged briefly | Likely |

**Notes:**
- The **wah is on for the entire song**. The opening note is a slow heel-down sweep; the main riff has the wah constantly modulating between heel and toe positions. This is RHYTHMIC wah, not solo accent — Hendrix uses the pedal as part of the groove.
- The **Fuzz Face** (germanium transistors, NPN — not silicon) is essential. Germanium fuzz responds differently to the guitar's volume knob than silicon — turn down the guitar's volume and a Fuzz Face cleans up almost completely. This is half of why Hendrix's tone has the dynamic range it does.
- Roger Mayer was Hendrix's pedal builder. The Octavia is a Mayer original, and Hendrix had multiple custom Mayer pedals throughout his career.
- No other pedals in this song. No delay, no chorus, no boost.

---

## Amp + Cab

- **Amp:** **Marshall Super Lead 100** (the "Plexi" / 1959 head) — 100W, 4xKT88 or EL34
  - Channel: Hendrix used the Normal channel jumpered to the Bright channel (link jumper from the Bright channel input #1 to the Normal channel input #2)
  - Settings: Both Volumes around 7, Bass 5, Mid 5, Treble 7, Presence 7
  - Hendrix's amp settings were aggressive — full-volume Marshalls for studio AND stage
- **Cab:** Marshall **1960** 4x12 (slant top cab, A-cabinet)
  - **Speakers:** Celestion **G12M-25 Greenback** (the original 1968-spec Greenbacks — "Pre-Rola" and early "Rola Celestion" stamps)
  - The original G12M-25 is the speaker on every Hendrix recording. Modern Greenbacks are reissues — close but not identical
- **Power tubes:** **KT88** in some heads, **EL34** in others — Hendrix's specific Voodoo Child amp is documented as KT88-loaded. KT88s give a more compressed, smoother breakup than EL34s
- **Modifications:** None
- **Multi-cab setup:** Single 4x12 in the studio (live, Hendrix used 4-6 cabs)

The Marshall Plexi at full volume into a 4x12 with original Greenbacks is THE Hendrix tone. Eddie Kramer documented multiple takes of trying smaller amps for studio tracking, and the verdict was always — Hendrix needed his stage rig at full volume to get HIS tone.

---

## Microphones

- **Close mic:** **Shure SM57** — close, ~1" off the speaker. Standard for the era.
- **Off-axis / second mic:** Often a **Beyer M160 ribbon** added for body, less commonly an AKG C12 condenser
- **Room mic:** Yes — Eddie Kramer's signature was room mic'ing. Studio A at the Record Plant has natural acoustics; Kramer added a U67 about 8 feet back

Kramer's mic technique was a precursor to modern multi-mic approaches. He documented the SM57 + M160 close + U67 distant blend as his standard for Hendrix.

---

## Technique notes

- **Right-hand attack:** Hendrix played with a thin pick (Fender Medium), but his attack was light — let the amp do the work
- **Left-hand thumb-fretting:** Voodoo Child's main riff uses Hendrix's signature thumb-over-the-neck technique to fret the bass note while the index/middle handle the chord stabs
- **Wah pedal technique:** Constant rhythmic motion synced to the song's groove. Most modern players use wah for solo accents; Hendrix used it for verse rhythm.
- **Volume knob use:** Hendrix rolled the volume back to ~5 for cleaner verse passages, full open for the solo. The Fuzz Face cleans up beautifully when the guitar volume is rolled back — that's the tone shift mid-song.
- **Slide use:** None on Voodoo Child — pure picking + bending
- **Stratocaster pickup switching:** Hendrix often "rode" the 5-way switch mid-passage, blending neck + middle or middle + bridge for tonal variation

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Vox Cry Baby V846 | **UK Wah 846** (`HD2_WahUKWah846`) | Verified | Direct V846 emulation. DEFAULT-ON, assign to EXP 1, and rock it constantly |
| Dallas-Arbiter Fuzz Face | **Arbitrator Fuzz** (`HD2_DistArbitratorFuzz`) | Verified | Direct Fuzz Face emulation. Volume 0.70, Fuzz 0.70. Roll back the recipe's "guitar volume" to demo the cleanup behavior |
| Roger Mayer Octavia | **Tycoctavia Fuzz** (`HD2_DistTycoctaviaFuzz`) | Verified | Direct emulation. Off by default, kick on for solo accents |
| Marshall Super Lead 100 (Plexi) | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct emulation. Drive 0.85, both channels jumpered (Helix doesn't have a true jumper — boost Drive to compensate). Sag 0.55 |
| Marshall 1960A + G12M-25 | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) — has WithPan variant | Verified, dual-mic capable | Direct match. Position 0.49 (near-center) for vintage Hendrix character |
| SM57 + Beyer M160 | Mic 0 (SM57) + Mic 5 (R-121) on cabSibling | Verified | M160 → R-121 ribbon is the closest character match |
| Record Plant Studio A room | **Dynamic Room** (`VIC_ReverbDynRoom`) | Verified | Decay 1.8, Mix 0.20 |

---

## Sources

- Wikipedia — *Electric Ladyland* article (recording dates, Record Plant, Eddie Kramer credits)
- *Setting the Record Straight: Hendrix in the Studio* (Eddie Kramer + John McDermott, 2007) — the definitive book on Hendrix's studio gear
- Eddie Kramer interviews — *Tape Op*, *Mix*, *Sound on Sound* (multiple decades)
- Roger Mayer's official website — pedal provenance
- Equipboard pros/jimi-hendrix
- *Are You Experienced* documentary footage (some pedalboard shots)
- *Guitar World* — Eddie Kramer interviews on Hendrix specifically

---

## Confidence summary

- **Verified:** 19 items (recording context + Eddie Kramer engineering, 1968 Strat lefty/right setup, Vox V846 wah default-on, germanium Fuzz Face, Marshall Plexi + KT88s, 4x12 + G12M-25 Greenbacks, Eb tuning, Kramer's mic blend)
- **Likely:** 2 items (Octavia on Voodoo Child specifically — definitely on his board, less certain of song use)
- **Speculative:** 0 items — Hendrix's gear is among the most-documented in rock history

---

## Open questions

- **Octavia on Voodoo Child or only on Voodoo Chile (the longer track)?** Both are on the same album. Voodoo Chile (the long blues version) clearly has Octavia in the solo; Voodoo Child (Slight Return) is less obvious.
- **KT88 vs EL34 power tubes on this specific session?** Documented as KT88 for some 1968 Plexis; not 100% confirmed for this Voodoo Child take.
- **Studio plate or just room ambience?** The Record Plant had its own EMT plate; Kramer used it sparingly. Voodoo Child sounds more room-mic-driven than plate-driven.

---

## Recipe alignment

The current `hendrix-voodoo-child-wah` recipe is solid. Helix translation:
- Volume Pedal + light comp ✓
- UK Wah 846 default-on (or assigned to EXP 1) ✓ matches the constantly-rocking wah
- Arbitrator Fuzz default-on ✓ matches the Fuzz Face
- Tycoctavia Fuzz default-off, alt for solo ✓ matches the Octavia
- Brit Plexi Brt amp at Drive 0.85 ✓ matches the cranked Plexi
- Dual-mic 4x12 Greenback 25 ✓ matches the actual 1960A + G12M-25 setup
- Tilt EQ at end ✓

Open improvements:
- Recipe is well-aligned. The main "improvement" is reminding users that the wah technique (constant rhythmic motion) is half the tone — could be in the recipe notes.
- Could add a Dynamic Room block for the Record Plant ambience — currently no room reverb in the chain.
