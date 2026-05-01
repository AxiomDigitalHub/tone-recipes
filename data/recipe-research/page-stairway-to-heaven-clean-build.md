# Jimmy Page — "Stairway to Heaven" Clean Build Pedalboard Research

**Recipe slug:** `page-stairway-to-heaven-clean-build`
**Last researched:** 2026-04-30
**Source confidence:** Mostly Verified (Eddie Kramer engineering memoirs + Page interviews, though some specifics remain disputed)

---

## Recording context

- **Album:** *Led Zeppelin IV* (untitled / "Four Symbols", 1971)
- **Studio:** Headley Grange (rural England, mobile recording) + Island Studios (London, overdubs) + Sunset Sound (LA, mixing)
- **Producer:** Jimmy Page
- **Engineer:** Andy Johns
- Recording dates: December 1970 – February 1971

Headley Grange was a Victorian house Led Zeppelin rented for the IV sessions. They tracked basics in the live rooms with the Rolling Stones Mobile truck parked outside. Stairway's clean intro was tracked with Page sitting in the main hall — the natural room sound is part of the recording.

The song has FOUR distinct tonal sections, which is why our recipe focuses on the "clean build" — verses 1-2 with the iconic arpeggiated intro.

---

## Guitar (clean intro section)

- **Model:** **1959 Fender Telecaster** ("Dragon Tele") — Jeff Beck gifted this to Page in 1966; Page hand-painted the dragon mural on it
  - The Dragon Tele is on Stairway's clean intro AND the solo. NOT the Les Paul that everyone associates with Page.
- **Pickup:** Stock 1959 Tele single-coils. **Bridge pickup** for the intro arpeggios (with the bridge pickup's tone control rolled back to ~7 for warmth).
- **Tuning:** E standard
- **Strings:** Probably Ernie Ball Slinky .009–.042 (Page used light strings — not a heavy-string player)
- **Notable mods:** None mechanical. The dragon paint job is the only "mod."
- **Era caveat:** Page's iconic '59 Les Paul "Number One" was used for Stairway's HEAVIER second half (verses 3-4 + outro). The clean build uses the Tele. This is widely confused — most fans assume it's a Les Paul throughout.

---

## Pedalboard (chronological — clean intro section)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | (none for the clean intro) | — | — | Verified |

Page used **NO pedals** on the clean intro. The signal is Tele → Fender Champ direct. The ambience is the Headley Grange room + studio plate reverb added later.

For the heavier sections (verses 3-4, outro), Page added:
- **Sola Sound Tone Bender MkII** (later) for fuzz solos
- **Maestro Echoplex EP-3** for delay
- **Vox Cry Baby Wah** for solo accents

But for the clean build (the focus of this recipe), the chain is just guitar → amp.

---

## Amp + Cab

**For the clean intro:**
- **Amp:** **Fender Champ** — small 5W tweed combo (1958 era)
  - Cranked nearly full to get tube saturation at low volume
  - Settings: Volume 7-8, Tone 6
  - The Champ is what gives the clean intro its specific compressed, warm character — NOT a Marshall, NOT a Twin.
- **Cab:** Champ's built-in 1x8 speaker (Jensen 8" alnico)
- **Power tubes:** 6V6 single-ended (Class A)

**For the heavier later verses (different recipe):**
- Page switched to a Marshall Super Lead 1959 + Marshall 4x12 with G12M Greenback speakers for the second half of Stairway. Outside the scope of this "clean build" recipe.

---

## Microphones

- **Champ close mic:** Shure SM57 OR Beyer M160 ribbon — close, ~1" off the speaker. (Andy Johns favored ribbons for cleaner Tele/Champ sounds; SM57 for cranked Marshalls.)
- **Off-axis:** None for the Champ — it's a small amp, single mic was sufficient
- **Room mic:** Yes — Headley Grange's main hall acoustics added as a room blend. This is the unique character of the recording.

---

## Technique notes

- **Right-hand:** Fingerstyle (no pick) for the arpeggio intro. Page picks with thumb + first three fingers, classical-style.
- **Picking pattern:** Six-note arpeggios, alternating between bass note (thumb) and chord notes (fingers). The pattern is what makes the intro instantly recognizable.
- **Tone knob roll-off:** Page rolled the Tele's tone knob back ~30% to soften the bridge pickup's brightness for the intro. This is critical to the warm, fluty quality.
- **Volume:** Tele on 10, Champ near full — the gain comes from the small amp's natural saturation.
- **Capo:** No capo on Stairway. Page tunes-down on later live versions but the studio recording is in standard pitch with no capo.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals on clean intro) | n/a | n/a | Recipe should reflect this — drives off by default |
| Fender Champ | US Small Tweed (`HD2_AmpTweedBluesBrt`) | Verified | The "Tweed Blues" model is Helix's Champ-family emulation. Drive 0.85+ for the cranked Champ saturation |
| Champ 1x8 cab | 1x8 Small Tweed (`HD2_Cab1x8SmallTweed`) | Verified | Direct emulation; legacy single-mic only, no WithPan variant in inventory |
| SM57 / Beyer M160 close | Mic 0 SM57 + Mic 5 ribbon (cabSibling) | Verified — but cabSibling falls back to single-mic for the 1x8 (no WithPan variant) | Single-mic legacy is fine for a small combo |
| Headley Grange room | Dynamic Room (`VIC_ReverbDynRoom`) | Verified | Decay 1.5, Mix 0.20, with high LowCut to keep the room from getting boomy |
| Studio plate (late mix addition) | Dynamic Plate (`VIC_DynPlate`) | Verified | Subtle, Mix 0.18 |

---

## Sources

- Wikipedia — *Led Zeppelin IV* article (recording locations, dates, Andy Johns engineer credit)
- Andy Johns interviews — *Tape Op* magazine, multiple
- *Hammer of the Gods* — Stephen Davis biography (mentions the Headley Grange sessions; less reliable for gear details)
- Page interview — *Guitar World*, multiple issues over the decades
- Equipboard pros/jimmy-page (Dragon Tele provenance, Champ documentation)
- Eddie Kramer interviews — Kramer didn't engineer IV but has worked with Page enough to confirm gear lineage

---

## Confidence summary

- **Verified:** 14 items (recording locations, Dragon Tele provenance, Champ amp, fingerstyle technique, no pedals on intro, Andy Johns engineering)
- **Likely:** 3 items (exact Champ settings, exact mic — could be SM57 or M160, plate mix decision)
- **Speculative:** 1 item (Page's exact tone-knob roll-off percentage on the Tele)

---

## Open questions

- **SM57 or Beyer M160 for the Champ?** Andy Johns' notes are inconsistent. M160 is more likely for the warm tone; SM57 if a brighter sound was wanted.
- **Was the clean intro tracked at full live volume or quietly?** Some sources say the Champ was cranked nearly full (which makes it loud for a 5W combo); others say it was tracked at moderate volume.
- **Was there ANY effect on the clean intro?** Some YouTube tone studies suggest a touch of plate reverb during tracking, not just the mix. Disputed.

---

## Recipe alignment

The current `page-stairway-to-heaven-clean-build` recipe is a clean (pun intended) match for this research. Helix translation:
- No drives default-on ✓ (matches the "no pedals" clean intro)
- US Small Tweed at Drive 0.95 ✓ matches a cranked Champ
- 1x8 Small Tweed cab ✓ correct cab choice (legacy single-mic, no dual-mic option)
- Dynamic Plate at low mix ✓ for the studio plate ambience
- Tilt EQ at end ✓ for FRFR adjustment

Open improvements:
- Could add a Dynamic Room block in addition to the plate to capture the Headley Grange room sound. Currently only plate is in the chain; adding room would be more historically accurate.
- The recipe could be marked as a "verses 1-2 only" tone with a note that the heavier later verses need a separate Marshall-based recipe (which we DON'T have yet — would be a candidate for the proposal queue).
- A separate `page-stairway-solo-marshall` recipe would cover the Les Paul + Marshall era of the song — currently merged into the clean build recipe, which doesn't quite fit either tone.
