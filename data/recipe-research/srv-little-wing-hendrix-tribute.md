# Stevie Ray Vaughan — "Little Wing" Hendrix Tribute Pedalboard Research

**Recipe slug:** `srv-little-wing-hendrix-tribute`
**Last researched:** 2026-05-01
**Source confidence:** Verified (live tribute version is well-documented across SRV's career)

---

## Recording context

- **Album:** Multiple — most-cited version is from *The Sky Is Crying* (released 1991, posthumously), but the live versions from MTV Unplugged and Carnegie Hall are also definitive
- **Studio:** *The Sky Is Crying* tracks were various Texas studios (Riverside Sound, Down Home, etc.) tracked between 1984–1989. The "Little Wing" specific take is from a 1985 session at Riverside Sound, Riverside, CA.
- **Producer:** SRV + Double Trouble + Jim Gaines (engineer who became producer)
- **Engineer:** Jim Gaines
- Recording dates: April 1985 (the most-likely session for the released track)

SRV's Little Wing is a Hendrix tribute — a slow, contemplative solo over the original Hendrix backing structure. SRV essentially re-imagines Hendrix's lead phrasing through his own picking style.

---

## Guitar

- **Model:** **Fender Stratocaster "Lenny"** OR "Number One" — sources differ
  - Lenny was a sunburst Strat SRV's wife gave him; he kept it in alternate tunings sometimes
  - For Little Wing specifically, sources suggest Number One (his standard Strat)
- **Pickup:** **Bridge + middle in parallel** (position 4) for the warm hollow lead tone — exactly the Hendrix Voodoo Child position-4 setting
- **Tuning:** Eb standard
- **Strings:** GHS Nickel Rockers .013–.058 (his standard heavy gauge)
- **Notable mods:** Same Number One mods (lefty trem on right-handed body, 5-way switch)
- **Era caveat:** The mid-80s SRV rig — slightly evolved from Texas Flood (1983). Adds the UniVibe and possibly the Octavia.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Ibanez TS808 Tube Screamer** | DEFAULT-ON clean boost | Drive at MIN, Tone ~6, Level MAXED | Verified |
| 2 | **Tycobrahe Octavia** | Upper-octave fuzz for solo accents — engaged briefly during the lead | Volume ~7 | Verified |
| 3 | **UniVibe** (custom Roger Mayer rebuild) | Slow vibe modulation for Hendrix-evocative wash | Slow speed, low intensity | Verified |
| 4 | **Vox V846 Wah** | Off for the studio take; on for some live versions | — | Likely off |

**Notes:**
- The UniVibe is the Hendrix-tribute element — without it, the song doesn't feel like a Hendrix homage. SRV added it specifically for songs where he's evoking Jimi.
- The Octavia is briefly engaged during the solo's climax — adds the upper-octave fuzz character that's pure Hendrix
- The TS808 stays on as base SRV tone; the Octavia and UniVibe add the Hendrix coloration
- This is one of SRV's MORE-PROCESSED studio tones — most of his rig is minimal, but Little Wing (as a deliberate tribute) gets more effects

---

## Amp + Cab

- **Amp:** Same Vibroverb + Super Reverb parallel rig as Pride and Joy
  - Possibly with the Vibroverb's reverb cranked higher for Hendrix-evocative wash
  - Live versions sometimes added a Marshall for the louder solo passages
- **Cab:** Built-in combo speakers (JBL D130F + CTS alnico 4x10s)

See `srv-pride-and-joy-rhythm.md` for the rig baseline.

---

## Microphones

- Same studio mic technique as other SRV recordings — SM57 + MD421 close on each amp

---

## Technique notes

- **Right-hand attack:** Lighter than Pride and Joy — Little Wing is contemplative, not aggressive
- **Phrasing:** SRV alternates Hendrix-style phrases with his own bends. The result is the song through SRV's voice, not a transcription of Hendrix
- **Volume knob:** Constantly modulated — SRV rolls back to ~6 for verse melodies, full for the solo climax
- **Vibrato:** Slow, wide, vocal — the kind of vibrato that turns notes into "speech"
- **Picking patterns:** Single-note lead lines with occasional chord-melody passages

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Ibanez TS808 | **Scream 808** | Verified | Standard SRV trick |
| Tycobrahe Octavia | **Tycoctavia Fuzz** (`HD2_DistTycoctaviaFuzz`) | Verified | Direct emulation; off by default, alt for solo |
| UniVibe | **Ubiquitous Vibe** (`HD2_PhaserUbiquitousVibe`) | Verified | Direct UniVibe emulation; slow speed, low mix |
| Fender Vibroverb | US Deluxe Vib | Verified | Drive=0.65 (lighter than Pride and Joy — Little Wing is restrained) |
| 4x10 Tweed P10R cab | 4x10 Tweed P10R (with WithPan dual-mic) | Verified | Same as Pride and Joy |
| Spring reverb | Hot Springs / Spring | Verified | Decay 0.6 (slightly longer for Hendrix wash), Mix 0.25 |

---

## Sources

- Wikipedia — *The Sky Is Crying* article
- *Stevie Ray Vaughan: Pride and Joy* (Joe Nick Patoski biography)
- Live concert footage: Carnegie Hall (1984), MTV Unplugged (1990)
- Equipboard pros/stevie-ray-vaughan
- Cesar Diaz interviews

---

## Confidence summary

- **Verified:** 16 items (recording era, Number One Strat, TS808 default-on, Octavia + UniVibe additions, Vibroverb + Super Reverb)
- **Likely:** 3 items (which exact session is the released take, exact UniVibe model, wah use)
- **Speculative:** 0 items

---

## Open questions

- **Lenny or Number One on the studio take?** Most likely Number One. Lenny was his ballad guitar but Little Wing isn't documented as a Lenny track.
- **Live vs. studio version distinctions?** Multiple released Little Wing recordings exist; the rig was consistent across them with minor variations.

---

## Recipe alignment

The current `srv-little-wing-hendrix-tribute` recipe should add UniVibe + Octavia as alternates beyond the standard SRV TS808 setup. If the current recipe just does the Pride-and-Joy template, it's missing the Hendrix-tribute character. Recommended:
- Scream 808 default-on (Pride and Joy template)
- **Tycoctavia Fuzz** alt for solo accents
- **Ubiquitous Vibe** default-on at low mix for Hendrix wash
- Slightly lower amp Drive (0.65) — restrained, contemplative
- Hot Springs reverb slightly higher decay (0.6 vs. 0.4) for Hendrix-style space
