# Eddie Van Halen — "Eruption" Pedalboard Research

**Recipe slug:** `evh-eruption-brown-sound`
**Last researched:** 2026-04-27
**Source confidence:** mostly Verified (the most-documented guitar rig in rock history; Eddie discussed it personally in dozens of interviews across decades)

---

## Recording context

- **Album:** *Van Halen* (1978)
- **Studio:** Sunset Sound Recorders, Los Angeles
- **Producer:** Ted Templeman
- **Engineer:** Donn Landee
- Recording dates: September – October 1977 (album released February 10, 1978)

The first Van Halen album was tracked extremely fast — Templeman wanted the live energy preserved. Eruption itself was tracked in **a single take** on a slow afternoon when David Lee Roth and Templeman happened to walk into the live room. Eddie had been using it as a warm-up; Templeman heard it and said "we're cutting that." That's why the famous solo is a one-take performance of an unrehearsed warmup.

---

## Guitar

- **Model:** **The Frankenstrat** (the white-with-black-stripes, pre-red-stripes version — the red striping came later for the Women & Children First era cover photo)
- **Construction:**
  - Body: Ash, $50, from Boogie Bodies (Lynn Ellsworth's company in Pennsylvania) — Stratocaster-shaped ash
  - Neck: Maple, $80, from Boogie Bodies
  - Single humbucker route (no neck or middle pickup)
- **Pickup:** **1961 Gibson PAF humbucker (bridge position only)**
  - DC resistance ~7.5k
  - Eddie potted the coils in paraffin wax in his kitchen to reduce microphonic squeal at high volume
  - Wired directly to the volume knob — **NO tone control**
  - Pulled from a 1961 Gibson ES-335 that Eddie had bought used
- **Tuning:** **E♭ (Eb) Standard** — half-step down. This is critical: Van Halen tuned a half step flat throughout the first album.
- **Strings:** Eddie's preferred .009 sets (Fender Bullets era, before he had his own signature strings)
- **Vibrato:** Modified Schaller vibrato bridge — **NOT a Floyd Rose**. The Floyd came in 1979–1980 after Eruption. For the 1977 Eruption recording, the Schaller is what created the dive-bombs.
- **Era caveat:** The Frankenstrat is famously photographed with red-and-white striping + Floyd Rose. Both came AFTER Eruption was tracked. The original recording is the white-with-black-stripes / Schaller-vibrato configuration.

---

## Pedalboard (chronological)

For Eruption specifically, the chain is dead simple:

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **MXR Phase 90** | The opening phaser sweep | Speed knob ≈ 5 (moderate); always-on for the intro | Verified |

**Notes:**
- That's the entire pedalboard for Eruption. No fuzz, no overdrive, no delay.
- The MXR Phase 90 is on for the famous opening 8 seconds (the phaser sweep). Some versions have it on through more of the solo; the original recording has it primarily at the intro.
- An MXR Flanger and an Echoplex EP-3 were on Eddie's general board but **NOT on Eruption** specifically. The Echoplex does feature on other VH1 tracks (Ain't Talkin' 'Bout Love uses it).

---

## Amp + Cab — the variac story

This is the secret weapon, extensively documented in Eddie's own interviews.

- **Amp:** Marshall Super Lead 1959 100W head — a Plexi-era 100W (some sources cite a JMP from the early 70s, post-Plexi but pre-JCM800)
  - The amp was modified slightly — Eddie removed the master volume circuit (when the amp had one) and ran it stock-Plexi-style with all controls dimed
  - Settings: All knobs at 10 (Volume, Treble, Mid, Bass, Presence)
  - **Power tubes:** KT88 (some sources cite EL34 — Eddie said different things at different times; KT88 is most commonly cited for the original Eruption tracking)
- **THE VARIAC:** Eddie powered the Marshall through a **variable transformer (Variac)** set to approximately **85 volts** (instead of the standard 120V mains).
  - **Why:** Reducing the mains voltage drops the amp's plate voltage, which causes the power tubes to saturate at much lower volume. This creates the warm, compressed "brown sound" — power-amp distortion at usable volumes.
  - **Effect on tone:** The amp sounds like it's at 11 (cranked) but at the actual volume of about 6 or 7. The character is fatter, more saturated, with less harshness than a fully-powered Marshall at maximum volume.
  - **Caveat:** This trick stresses tubes and transformers and shortens their lifespan. Eddie burned through tubes constantly because of the variac. **Modeler users don't need a variac** — modelers simulate this saturation digitally via the amp's Drive + Sag parameters.
- **Cab:** Marshall 4x12 (1960B straight cab) with **Celestion G12M-25 (Greenback)** speakers
  - Some sources cite Celestion G12H-30 speakers — both were standard 1970s Marshall spec
  - Single 4x12 in the studio
- **Modifications:** The amp itself was relatively stock — Eddie's signature mods (the "5150" preamp circuit) came later. For VH1 Eruption, it's a stock Plexi run via variac.

---

## Microphones

- **Close mic:** Shure SM57 — Sunset Sound's standard rock guitar mic
- **Off-axis / second mic:** Possibly a **Neumann U67 or U87** condenser at 4-6 ft — Sunset Sound's standard pairing
- **Distant mic:** Likely none for Eruption (the song is short and intense; mixed close)
- Donn Landee's specific mic notes for the Eruption session aren't in the public record

---

## Technique notes

- **Right-hand attack:** Eddie uses a thick **Dunlop Tortex** pick (later branded as his own EVH signature). Pick is held between thumb and middle finger (rather than thumb and index) — this frees the index finger for the famous **right-hand tapping technique**.
- **The tapping section** (starts at ~1:00 of the track): Eddie's middle finger of the picking hand taps at the 12th, 15th, 19th frets while the fretting hand pulls off to open notes. This is the technique that made Eruption a genre-defining moment.
- **Vibrato bar use:** Eddie uses the Schaller vibrato heavily for dive-bombs and pitch wiggles. The Schaller doesn't lock as well as a Floyd Rose, so post-dive tuning recovery requires the player to know where the bar settles back.
- **Tone knob:** N/A — the Frankenstrat had no tone knob.
- **Volume knob:** Full open. Eddie used the volume knob for cleanup but on Eruption it's pinned at 10.
- **Pinch harmonics:** Eddie does several throughout the solo — they ring more clearly because the Frankenstrat's volume-only wiring leaves the high-frequency harmonics intact (no tone knob = no high-end roll-off).

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Frankenstrat with PAF | (guitar — handled by user) | n/a | Use any humbucker-equipped Strat. Hot ceramic humbuckers will overdrive too much; aim for a vintage 7.5k PAF-style. |
| MXR Phase 90 | Script Mod Phase (`HD2_PhaserScriptModPhase`) | Verified | Helix's Phase 90 model. Set Speed ≈ 0.5, Mix ≈ 1.0. |
| Marshall Super Lead 1959 + variac | Brit Plexi Brt (`HD2_AmpBritPlexiBrt`) with **HIGH Sag (0.75-0.85)** | Verified | Helix has no variac model — but the variac's effect is increased power-tube sag and saturation. Setting Sag ≈ 0.80 + Bias ≈ 0.65 + Drive ≈ 0.70 simulates the under-voltaged Plexi character. The "brown sound" is roughly: pushed Plexi + heavy sag + bias toward saturation. |
| KT88 power tubes | (handled by amp model) | n/a | Helix amp models include their own power-tube character |
| Marshall 4x12 + Greenback 25s | 4x12 Greenback 25 (`HD2_Cab4x12Greenback25`) or `HD2_CabMicIr_4x12Greenback25WithPan` | Verified, dual-mic capable | Direct match for the speaker spec |
| SM57 + U67/U87 | Mic 0 (SM57 close) + Mic 5 (R-121 ribbon) via dual-mic cab | Verified | Helix has no U67/U87 condenser model that's verified-loadable; the R-121 ribbon's smoother top-end approximates the condenser's roundness |

**Critical "brown sound" recipe** (different from a normal Plexi Helix recipe):
- Drive: 0.70 (NOT maxed — the variac reduces effective drive saturation despite the amp dimed)
- Sag: 0.80 (HIGH — this is the variac trick simulated)
- Bias: 0.65 (slightly hot for power-tube saturation)
- Master: 1.0 (full)
- ChVol: 0.65 (lower than usual; the variac drops effective volume)
- Resonance: 0.55 (the cab couples differently when amp is under-voltaged)

---

## Sources

- Wikipedia — Eddie Van Halen article (Frankenstrat construction, $50 ash body, $80 maple neck, paraffin-wax PAF potting)
- *A Producer's Life* — Ted Templeman's autobiography (recording context for VH1, Sunset Sound sessions)
- *Eruption: Conversations with Eddie Van Halen* — Brad Tolinski biography (gear timeline, variac usage)
- *Guitar World* — multiple Eddie Van Halen feature articles across decades, particularly the 1996 "Brown Sound" feature
- *Guitar Player Magazine* — extensive Eddie Van Halen interviews from 1978 onward
- Donn Landee interviews — Mix Magazine, Recording Magazine
- Equipboard — pros/eddie-van-halen
- Premier Guitar — multiple Eruption-specific tone breakdowns

---

## Confidence summary

- **Verified:** 22 items (recording context, Frankenstrat construction, PAF pickup, variac usage, MXR Phase 90 as the only pedal, Marshall 1959 amp, all-knobs-dimed approach, single-take performance origin)
- **Likely:** 4 items (KT88 vs EL34 power tubes — Eddie said both at different times, exact Greenback 25 vs G12H-30 speaker, U67 vs U87 distant mic, exact MXR Phase 90 Speed setting)
- **Speculative:** 0 items

---

## Open questions

- **KT88 vs EL34 power tubes.** Eddie has said both in different interviews. KT88 is more commonly cited for the Eruption recording specifically (the bigger, brighter character of KT88s suits the brown sound better). EL34s would give a slightly midrange-honkier tone.
- **Was the variac at 85V or some other voltage?** Most sources cite 85V; some cite 90V. A few cite "around 80V." All are in the same range. The exact number probably doesn't matter — the principle is "reduce mains voltage by ~30%."
- **Was the Echoplex EP-3 active on Eruption?** Most sources say NO — Eruption is too dry for an Echoplex to be in the chain. But Eddie's general board had it, so some live versions of Eruption do feature it.
- **Phase 90 Speed setting.** Most "Eruption tone guides" suggest Speed ~5/10 (moderate). The original recording's phaser is somewhere between slow-and-moderate. Speed ~ 0.4–0.6 in 0–1 range is the right ballpark.

---

## Recipe alignment

The current `evh-eruption-brown-sound` recipe (auto-shipped with the 50-preset library) needs the following updates after this research:

1. **Tuning:** E♭ standard (half step down), NOT E standard. This is critical for the song to play correctly to the recording.
2. **Strings:** Light gauge — .009-.042 or .009-.046.
3. **Pickup:** Single bridge humbucker, vintage PAF voicing (not a hot ceramic).
4. **Drive chain:** Drop any TS-style boost. **Eruption has NO drive pedal** — the saturation is all from the variac'd Plexi.
5. **Modulation:** Script Mod Phase (`HD2_PhaserScriptModPhase`) DEFAULT-ON for the intro phaser sweep. Speed ≈ 0.5, Mix ≈ 1.0.
6. **Amp:** Brit Plexi Brt (`HD2_AmpBritPlexiBrt`).
7. **Critical "brown sound" amp settings:**
   - Drive: 0.70
   - Sag: **0.80 (HIGH — simulates the variac)**
   - Bias: 0.65 (slightly hot)
   - Master: 1.0
   - ChVol: 0.65
   - Resonance: 0.55
   - Bass: 0.65, Mid: 0.55, Treble: 0.70, Presence: 0.65 (all flat-ish; the cab + tubes do the shaping)
8. **Cab:** 4x12 Greenback 25 with WithPan dual-mic (SM57 + ribbon).
9. **Tilt EQ:** Default at 0.5 (flat) — useful for FRFR brightness tweak.
10. **Note in recipe description:** Mention the variac trick + high-Sag setting as the key to the brown sound. Users will ask about it.
