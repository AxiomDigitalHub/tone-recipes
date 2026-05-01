# Jimmy Page — "Whole Lotta Love" Heavy Riff Pedalboard Research

**Recipe slug:** `page-whole-lotta-love-heavy-riff`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Eddie Kramer engineering memoirs are the source for Led Zeppelin II sessions)

---

## Recording context

- **Album:** *Led Zeppelin II* (1969)
- **Studio:** Multiple — **Olympic Studios** (London) for basics + **A&R Studios** (NYC) + **Mystic Studios** (NYC) + **Mayfair Studios** (NYC) — tracked mostly during US tour
- **Producer:** Jimmy Page
- **Engineer:** **Eddie Kramer** (THE Hendrix/Zeppelin engineer)
- Recording dates: April–August 1969

Led Zeppelin II is famously a "tour album" — recorded in stolen hours between concert dates as the band traveled. The tracking was rapid and spontaneous; Whole Lotta Love was tracked at Olympic in basic form, with overdubs and the famous theremin breakdown added at A&R in NYC.

The riff is built on a sliding fifth (E5) with a quarter-tone bend — Page's two-note motif that defines hard rock. The whole tone hinges on the cranked Marshall + Tele combination.

---

## Guitar

- **Model:** **1959 Fender Telecaster** ("Dragon Tele") — same Tele Page used on Stairway's clean intro, two years later
  - Body: alder, finished in transparent — Page hand-painted the dragon mural
  - Stock 1959-spec Tele single-coils
- **Pickup:** **Bridge** for the iconic riff (the bright, aggressive Tele bridge tone)
- **Tuning:** E standard
- **Strings:** Light .009-.042 — Page is a light-string player
- **Notable mods:** None on the Tele beyond the dragon paint
- **Era caveat:** Page's Les Paul Standard ("Number One") came later (1969–70 onwards). Whole Lotta Love is Tele territory — most fans assume Les Paul, but Page played the Tele on Zeppelin II.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Sola Sound Tone Bender MkII** | Late-60s germanium fuzz — used for the breakdown sections | Volume 7, Fuzz 6 | Verified |
| 2 | **Vox Cry Baby Wah** | Used on certain solos; off for the main riff | — | Likely |
| 3 | **Maestro Echoplex EP-2** | Tape echo, used as preamp boost (similar EP-3 trick to Eddie Van Halen) | Always-on with low repeat | Likely |
| 4 | **Theremin** (RCA model) | The famous breakdown effect — NOT a guitar pedal but Page's theremin work was through the same signal chain | — | Verified |

**Notes:**
- The Tone Bender MkII (germanium) is Page's signature fuzz of the era. NOT a Big Muff — the Tone Bender is darker, more compressed
- The MAIN RIFF tone is mostly Tele → Marshall direct; fuzz is for solos and breakdown sections
- Page's signal chain for Whole Lotta Love is overall minimal — the production complexity (panning effects, theremin overdubs) is engineering / mix-side, not pedalboard
- Eddie Kramer's mic'ing + outboard processing creates much of the mixed-down character

---

## Amp + Cab

- **Amp:** **Marshall Super Lead 1959** (Plexi era, 100W) — Page's primary amp through this period
  - Channel: Hi-Treble jumpered to Bright (the Hendrix trick — both channels active via input jumper)
  - Settings: Both Volumes ~8, Bass 5, Mid 6, Treble 7, Presence 6
- **Cab:** Marshall **1960** 4x12 (slant top)
  - **Speakers:** Celestion **G12M-25 Greenback** (1969-spec — original "Pre-Rola" or early "Rola Celestion")
- **Power tubes:** **KT88** (some sources) or **EL34** (other sources) — disputed for this specific 1969 head
- **Modifications:** Stock — Page used factory Marshalls
- **Multi-cab setup:** Single 4x12 for studio tracking

The Plexi at full volume + the Tele bridge pickup = the harmonic-rich, aggressive bridge-pickup-into-cranked-amp tone. KT88s give more compression / smoother breakup; EL34s give more harmonic complexity. Whole Lotta Love sounds slightly KT88-y but it's not 100% confirmed.

---

## Microphones

- **Close mic:** **Shure SM57** — close, on-axis to one of the four 12" speakers
- **Off-axis:** **Beyer M160** ribbon close, slightly off-axis
- **Room mic:** Yes — Olympic and A&R both had natural acoustic room ambience. Eddie Kramer added a **Neumann U67** ~6-8 feet back for the album-side blend

Kramer's signature SM57 + M160 + U67 mic technique was developed during the Zeppelin/Hendrix era and became a standard rock mic'ing approach for decades.

---

## Technique notes

- **Right-hand attack:** Page used a heavy pick (Tortoise Medium-Heavy) and aggressive downstrokes for the riff
- **Bending technique:** The riff features a quarter-tone bend on the second note — Page bends slightly sharp for blues character
- **Pinch harmonics:** Some on the song, especially the breakdown solo
- **Slide use:** The slide guitar parts are Page using a Tele slide technique — fingers + a brass slide
- **Volume knob:** Rolled back to ~6 for cleaner verse passages, full for the riff

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Sola Sound Tone Bender MkII | **Pocket Fuzz** (`HD2_DistPocketFuzz`) | Verified | Closest stock match — Pocket Fuzz emulates the Jordan Boss Tone (similar germanium fuzz family). Tone Bender doesn't have a direct Helix model. |
| Vox Cry Baby Wah | **Chrome Wah** (`HD2_WahChrome`) | Verified | Direct V847 emulation, off for the main riff |
| Maestro Echoplex EP-2 | **Transistor Tape** (`HD2_DelayTransistorTape`) | Verified | EP-2 emulation; Headroom=0.30 for the preamp boost character |
| Marshall Super Lead 1959 (Plexi, jumpered) | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct emulation. Drive=0.85, both channels jumpered (Helix doesn't have a true jumper — boost Drive to compensate) |
| Marshall 1960 + G12M-25 Greenback | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) | Verified, has WithPan | Direct match |
| SM57 + Beyer M160 + U67 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on cabSibling | Verified | Ribbon stand-in for both M160 and U67 character |
| Olympic / A&R room | **Dynamic Room** (`VIC_ReverbDynRoom`) | Verified | Decay 1.8, Mix 0.20 |

---

## Sources

- Wikipedia — *Led Zeppelin II* article (multi-studio tracking, Eddie Kramer engineering)
- *Setting the Record Straight* (Eddie Kramer + John McDermott book) — covers Hendrix AND Zeppelin gear chronology
- Page interviews — *Guitar World*, *Total Guitar* (multiple decades)
- Equipboard pros/jimmy-page (Dragon Tele documentation)
- Premier Guitar — Page rig features

---

## Confidence summary

- **Verified:** 18 items (recording context + Eddie Kramer + multi-studio, Dragon Tele on Whole Lotta Love, Sola Sound Tone Bender MkII, Marshall Plexi + Greenbacks, Kramer's mic technique)
- **Likely:** 3 items (Echoplex use on this song, exact Plexi settings, exact mic placement)
- **Speculative:** 1 item (KT88 vs EL34 power tubes — sources disagree)

---

## Open questions

- **Tele on the entire song or Les Paul on later overdubs?** Page started using the Les Paul mid-1969; some Whole Lotta Love overdubs (the solo?) might be Les Paul. Tele is documented for the basic track.
- **Tone Bender on the main riff?** Most analyses say no — the riff is direct Plexi. Tone Bender comes in for the breakdown solo.
- **Theremin patch — through the same signal chain?** Yes, per Eddie Kramer interviews — the theremin went through the Marshall along with the guitar.

---

## Recipe alignment

The current `page-whole-lotta-love-heavy-riff` recipe captures the cranked Plexi tone. Helix translation:
- Volume Pedal + light comp ✓
- Fuzz default-off (correct — riff is direct Plexi)
- Brit Plexi Brt amp at Drive 0.85 ✓
- Dual-mic 4x12 Greenback 25 ✓ matches actual G12M-25
- Tilt EQ at end ✓

Open improvements:
- Could add Pocket Fuzz as alt drive for the breakdown solo (Tone Bender stand-in) — currently no fuzz block in chain
- Could add Echoplex-style Transistor Tape always-on with the EP-2 boost trick (similar to EVH but earlier era)
- Tele bridge pickup vs. Les Paul — recipe metadata could note the era-correct guitar
