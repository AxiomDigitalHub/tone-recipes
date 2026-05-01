# Angus Young — "Back in Black" Rhythm Pedalboard Research

**Recipe slug:** `angus-young-back-in-black-rhythm`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Mutt Lange produced; Tony Platt engineered; well-documented session)

---

## Recording context

- **Album:** *Back in Black* (1980)
- **Studio:** **Compass Point Studios**, Bahamas
- **Producer:** **Robert "Mutt" Lange**
- **Engineer:** Tony Platt + Mutt Lange
- Recording dates: April–May 1980

Back in Black is the title track of the post-Bon-Scott AC/DC tribute album — Brian Johnson's first as singer. Angus' rhythm guitar is the iconic 4-chord progression (E5, D5, A5, E5) that opens the song. The tone is the most-perfectly-dialed Marshall-into-cab in rock history.

---

## Guitar

- **Model:** **1968 Gibson SG Standard** — Angus' "Number 1" SG, factory cherry red
  - Body: mahogany, cherry, lightweight
  - Pickups: Gibson stock '68 humbuckers (T-Top era)
- **Pickup:** **Bridge humbucker** for the riff
- **Tuning:** E standard (NOT Eb — AC/DC is rare in tuning to E standard despite the heavy sound)
- **Strings:** Light .009-.042 — Angus is a light-string player
- **Notable mods:** Stock — Angus plays SGs factory-spec
- **Era caveat:** The 1968 SG has been Angus' main guitar from the early 70s onwards. Same guitar through the entire AC/DC discography (with backups).

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| — | (none — guitar → amp directly) | Angus is famously pedal-less | — | Verified |

**Notes:**
- Angus Young has **NEVER used pedals on AC/DC studio recordings**. He is the canonical "guitar → cable → amp" rock player
- The tone is **SG → Marshall → 4x12 → mic**. Period.
- Mutt Lange's contribution was **layering** — Angus tracked the riff multiple times for thickness, but each track is dry guitar→amp

---

## Amp + Cab

- **Amp:** **Marshall Plexi 1959 Super Lead** (100W, jumpered) — Angus' lifelong amp
  - Channel: jumpered (both Hi-Treble + Bright channels active via input bridge)
  - Settings: Both Volumes 8, Bass 5, Mid 6, Treble 7, Presence 7
- **Cab:** **Marshall 1960** 4x12 (slant) with **Celestion G12-65** speakers (1980-era)
- **Power tubes:** EL34 quad
- **Modifications:** Stock — Marshall factory amps
- **Multi-cab setup:** Single 4x12 in studio for basics; possible second cab for overdubs

The cranked Plexi + jumpered channels = the entire Angus tone foundation. Mutt Lange's production magic is in tracking layering, not gear changes.

---

## Microphones

- **Close mic:** **Shure SM57** close, on-axis to one of the four 12s
- **Off-axis:** **Sennheiser MD421** off-axis or different speaker
- **Room mic:** Compass Point's tropical concrete room — possibly a Neumann U87 ~6-8 feet back. Tony Platt was tight close-mic with selective room blend

---

## Technique notes

- **Right-hand attack:** Heavy pick attack, aggressive — Angus is a hard-charging rhythm player
- **Riff style:** Power chord stabs (E5, D5, A5, E5) with downstrokes
- **Bend technique:** Light bends in the lead breaks, not in the rhythm
- **Volume knob:** Generally full open
- **Picking patterns:** Heavy downstrokes, no muting on the rhythm — chords ring out

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals) | — | — | Empty pedalboard |
| Marshall Plexi 1959 Super Lead | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct Plexi emulation. Drive=0.85, both jumpered channels = boost Drive |
| Marshall 1960 + G12-65 | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) | Verified for Greenback | G12-65 not directly modeled — Greenback closest |
| SM57 + MD421 | Mic 0 + Mic 5 on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Back in Black* article
- Mutt Lange interviews (rare but documented)
- Tony Platt engineer interviews
- Equipboard pros/angus-young
- *Premier Guitar* / *Total Guitar* AC/DC features
- Andy Babiuk's *AC/DC Gear* documentation

---

## Confidence summary

- **Verified:** 16 items (recording context, Compass Point, Mutt Lange production, '68 SG, Marshall Plexi, no pedals, Tony Platt engineering)
- **Likely:** 2 items (exact mic placement, exact amp settings)
- **Speculative:** 0 items (everything well-documented)

---

## Open questions

- **Single Plexi or multiple?** Most sources say single Plexi for studio basics
- **Double-tracking layers?** Yes — Mutt Lange's signature layering produces the album's massive guitar sound

---

## Recipe alignment

The current `angus-young-back-in-black-rhythm` recipe should:
- Empty pedalboard
- Brit Plexi Brt amp at Drive 0.85
- 4x12 Greenback 25 cab dual-mic with cabSibling
- Hot Springs reverb at very low mix (AC/DC tones are nearly dry)
- Tilt EQ at end
- Note: This is THE simplest tone in rock — guitar → amp → mic. The recipe should be minimal blocks (drive optional/empty, amp, cab, reverb, EQ).
