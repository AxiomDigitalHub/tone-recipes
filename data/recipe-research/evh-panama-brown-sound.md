# Eddie Van Halen — "Panama" Brown Sound Pedalboard Research

**Recipe slug:** `evh-panama-brown-sound`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Frank's Music interviews + Donn Landee's engineering notes for *1984*)

---

## Recording context

- **Album:** *1984* (1984)
- **Studio:** Eddie's home studio "5150" (Coldwater Canyon, Los Angeles) — the studio is named after the amp, not the other way around
- **Producer:** Ted Templeman + Eddie Van Halen
- **Engineer:** Donn Landee (long-time Templeman collaborator, engineered every Van Halen album)
- Recording sessions: 1983 — Eddie tracked guitars at his own studio for the first time

The 5150 home studio gave Eddie complete control over his guitar tracking — he could experiment with mic placement, amp settings, and overdubs without studio clock pressure. *1984* is the first Van Halen album with that home-studio character.

---

## Guitar

- **Model:** **Frankenstrat** (the original) — Charvel-bodied, Strat-shaped, painted in the iconic red/white/black tape stripes
  - Body: ash, ordered as a factory second from Boogie Bodies (later Charvel)
  - Neck: maple, also from Boogie Bodies
  - Single Gibson PAF humbucker in the bridge (rewound to Eddie's spec — the original used a Gibson humbucker pulled from a damaged ES-335)
  - Floyd Rose tremolo (early version)
  - Single volume knob, no tone, no pickup switch
- **Pickup:** Single bridge humbucker. By 1984, Eddie was using a more refined PAF replica wound by Seymour Duncan (the "Custom Custom" prototype) — though some sources say the original PAF was still in use
- **Tuning:** **Eb standard** — every Van Halen recording is tuned down 1/2 step (with rare exceptions). Panama is in Eb.
- **Strings:** Fender Bullets .009–.042 (light strings — Eddie was a light-string player despite the heavy tones)
- **Notable mods:** EVERYTHING is a mod. The Frankenstrat is famously hand-built. By 1984: Floyd Rose Original tremolo, brass nut, single volume pot, neck shimmed forward for action.
- **Era caveat:** The Frankenstrat on *1984* is post-1979 era — the pickup, neck, and Floyd had all been swapped from the *Van Halen I* (1978) version. Different specific guitar by serial number, same basic concept.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **MXR Phase 90** | Used on certain solos (NOT primary on Panama) | Speed ~3 | Verified for VH catalog; less certain on Panama |
| 2 | **MXR Flanger** | Subtle flanger on choruses | Slow speed | Likely |
| 3 | **Echoplex EP-3** (rack-style tape echo) | Used as a slight always-on preamp boost — the EP-3 has a distinct boost character | Time ~120 ms (slapback), Mix low | Verified |

**Notes:**
- **The Echoplex EP-3 trick** — Eddie ran the EP-3 ALWAYS-ON with the delay set to a barely-audible slapback. The EP-3's preamp circuit adds a subtle boost + harmonic enhancement that's part of the Brown Sound. This is well-documented in producer interviews.
- The Phase 90 is NOT on Panama specifically — it's the Eruption / Atomic Punk pedal. Panama's solo is mostly clean Frankenstrat → 5150 with the EP-3 slapback.
- No fuzz, no overdrive, no boost pedals — gain is from the amp.

---

## Amp + Cab

- **Amp:** **Peavey 5150** prototype — at the time of *1984* tracking, this was a custom-modified Marshall Plexi. The actual Peavey 5150 amp wasn't released until 1992; for *1984*, the "5150 sound" was the studio name + a specific Plexi mod.
  - The actual amp on *1984*: **Marshall Super Lead 1959** with a Variac (variable AC transformer) reducing the wall voltage to ~89V, which de-tunes the power tubes and gives them a softer, sagging response. This is the "Brown Sound" — variac'd Plexi.
  - Settings: Volume on the Hi-Treble channel cranked, Bass 5, Mid 6, Treble 7, Presence 7
- **Cab:** Marshall 4x12 (1960B straight cab) — believed to have **Celestion Greenback G12M-25** or the slightly later G12-65
  - Some sources cite the G12-65 by 1984; the G12M-25 was earlier. Could be either depending on which cab was used at 5150 home studio.
- **Power tubes:** EL34 quads, slightly underpowered due to variac
- **Modifications:**
  - **Variac de-tuning** — wall voltage dropped to ~89V (US standard is 120V). This is THE Brown Sound mod. It pulls EL34s back to a softer saturation.
  - José Arredondo (Eddie's amp tech) did some internal tweaks to the Plexi for tighter response
- **Multi-cab setup:** Single 4x12, mono'd in the mix

---

## Microphones

- **Close mic:** Shure SM57 — close, ~1" off the speaker, on-axis to one of the four 12"s
- **Off-axis / second mic:** Often a Sennheiser MD421 close, or a Neumann U87 a few feet back for room
- **Room mic:** The 5150 home studio had a controlled room — Donn Landee added a room mic about 8 feet back occasionally for ambience

Donn Landee's mic technique was relatively standard rock — close + medium-distance pair. Nothing exotic.

---

## Technique notes

- **Right-hand attack:** Eddie picked with a Fender Medium pick (Tortoise pattern). Aggressive but precise — the Brown Sound depends on consistent picking force.
- **Tapping:** Panama's solo includes some two-handed tapping passages — the right-hand fingers play notes on the fretboard while the left hand handles bends and pull-offs.
- **Floyd Rose use:** Eddie was the player who normalized aggressive Floyd dive-bombs in mainstream rock. Panama has subtle Floyd use, not the full divebombs of Eruption.
- **Pinch harmonics:** Panama's solo has a few — Eddie's "harmonic squeals" are a constant.
- **Volume knob:** Single volume, set to 10 for solos, ~7 for cleaner verses (rolled back manually mid-song).

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Echoplex EP-3 | Transistor Tape (`HD2_DelayTransistorTape`) | Verified | Set Time=0.12, Feedback=0.10, Mix=0.15, Headroom=0.30 (for the EP-3 boost character) |
| MXR Phase 90 (off for Panama) | Script Mod Phase (`HD2_PhaserScriptModPhase`) | Verified | Off by default for Panama; on for Eruption |
| MXR Flanger | Gray Flanger (`HD2_FlangerGrayFlanger`) | Verified | Slow speed for the chorus shimmer |
| Marshall Super Lead 1959 (variac'd) | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct emulation. To simulate the variac: lower the Master to 0.85 (not 1.0) and increase Sag to 0.70+ — emulates the soft power-tube response |
| ALTERNATE: Peavey 5150 (post-1992 era) | PV Panama (`HD2_AmpPVPanama`) | Verified | The PV Panama IS the actual 5150 amp. For Panama-the-song from *1984*, use Brit Plexi Brt (the variac'd setup); for later live recordings (1992+), PV Panama is more accurate |
| Marshall 4x12 + G12M-25 / G12-65 | 4x12 Greenback 25 (`HD2_Cab4x12Greenback25`) — has WithPan variant | Verified | If the album cab was G12M-25, this is direct. If G12-65, no direct match — Greenback 25 is closest. |
| SM57 + MD421 / U87 | Mic 0 (SM57) + Mic 5 (R-121) on cabSibling | Verified | MD421 → ribbon character is the closest stand-in |

---

## Sources

- Wikipedia — *1984 (album)* article (Donn Landee, Ted Templeman, 5150 home studio)
- *Eruption: Conversations with Eddie Van Halen* (Brad Tolinski, 2021) — definitive Eddie biography
- Donn Landee interviews — *Sound on Sound*, *Tape Op*
- Premier Guitar — multiple Eddie Van Halen rig features
- Equipboard pros/eddie-van-halen
- *Guitar World* — May 2020 Eddie tribute issue (covers gear chronology)
- The Frankenstrat replica builds documented across Charvel/EVH Custom Shop press materials

---

## Confidence summary

- **Verified:** 19 items (recording context, 5150 home studio + Donn Landee, Frankenstrat + Floyd, variac'd Plexi as the Brown Sound mechanism, Echoplex EP-3 always-on slapback, mic placement, Eb tuning + light strings)
- **Likely:** 4 items (exact pickup model in 1984, exact cab speakers G12M-25 vs G12-65, MXR Flanger on Panama, Phase 90 specific song use)
- **Speculative:** 0 items

---

## Open questions

- **Was the actual Peavey 5150 amp on *1984* tracking?** No — the Peavey 5150 amp wasn't released until 1992. The studio was named "5150" before the amp existed. For Panama the song from 1984, the amp is a variac'd Marshall Plexi. The PV Panama Helix model is more accurate for the 1992-onward era.
- **G12M-25 or G12-65 in the 1984 cab?** Disputed. Both are Celestions, voiced similarly, but G12-65 is brighter.
- **Echoplex EP-3 always-on or just for solos?** Multiple sources confirm always-on with low mix (the preamp is the point, not the delay).

---

## Recipe alignment

The current `evh-panama-brown-sound` recipe uses **PV Panama** as the amp. For Panama specifically (1984 album), this is a small historical mismatch — the actual amp is a variac'd Plexi (Brit Plexi Brt), not the post-1992 Peavey 5150.

**Recommended recipe update:**
- Change amp from PV Panama → **Brit Plexi Brt** (Marshall Super Lead 1959)
- Lower Master to ~0.85 (simulates variac de-tuning)
- Raise Sag to ~0.70 (simulates softer EL34 response under reduced voltage)
- Add an Echoplex-style Transistor Tape ALWAYS-ON with Time 0.12, Mix 0.15 — this is the EP-3 slapback boost trick
- Keep Phase 90 + Flanger as alt drives (off by default for Panama)

The current recipe sounds great but is sonically a 1990s-era 5150 tone, not the *1984* Brown Sound. Worth a future update.

A sibling recipe `evh-eruption-brown-sound` (already researched) uses the same Brown Sound formula but with Phase 90 default-on for Eruption's iconic phaser-on-solo character.
