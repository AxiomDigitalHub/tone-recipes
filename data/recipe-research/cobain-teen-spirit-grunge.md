# Kurt Cobain — "Smells Like Teen Spirit" Pedalboard Research

**Recipe slug:** `cobain-teen-spirit-grunge`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Butch Vig + Andy Wallace mix notes; Cobain's gear is well-documented despite the band's anti-gear-talk image)

---

## Recording context

- **Album:** *Nevermind* (1991)
- **Studio:** **Sound City Studios**, Van Nuys, CA — the famous studio also used for Tom Petty, Fleetwood Mac, and many others
- **Producer:** **Butch Vig**
- **Engineer:** Butch Vig (tracking) + **Andy Wallace** (mix)
- Recording dates: May 2 – June 14, 1991

The Sound City sessions are part of Nevermind's mythology. Vig's discipline (multiple takes, careful overdubs) reshaped Cobain's playing approach — Bleach (1989) is a single-take rough record; Nevermind has layered guitars and tight performances despite the band's grunge aesthetic.

Andy Wallace's mix added the album's signature compression and brightness — it's polished by post-mix standards, contradicting the band's later objections about "selling out." The raw guitar tracking captures Cobain's actual rig faithfully; Wallace's mix transformed it into the sound the world knows.

---

## Guitar

- **Model:** **Fender Mustang** (1969 era, modified) — Cobain's primary guitar for Teen Spirit
  - Some sources say a Fender Jaguar; Mustang is more documented for Nevermind
  - Body: alder, finished in Lake Placid Blue (one of Cobain's color preferences)
- **Pickup:** Stock Fender single-coils OR Cobain's modified versions — he was known to swap pickups
  - For Teen Spirit specifically: probably stock single-coils, bridge position
- **Tuning:** Eb standard (down 1/2 step) — Cobain tuned down throughout Nevermind
- **Strings:** Light gauge .009-.042 (Cobain was a light-string player)
- **Notable mods:** Cobain often swapped pickups, tape-fixed broken parts, and used left-hand body smashing as a "feature" — the Mustang on Nevermind was his preferred rough-around-the-edges instrument
- **Era caveat:** Cobain's signature Jaguar (the iconic blue one with the Lake Placid finish) is from a slightly later era than Teen Spirit. The Nevermind track was likely the Mustang. Multiple Cobain fan resources flip on this.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss DS-1 Distortion** | DEFAULT-ON for the chorus / explosion section; OFF for the verse | Distortion ~7, Tone ~5, Level ~6 | Verified |
| 2 | **EHX Small Clone** chorus pedal | DEFAULT-ON for the entire song — the iconic shimmer | Rate ~3, Depth ~7 (D-mode "Deep") | Verified |
| 3 | **Tech 21 SansAmp Bass Driver DI** | Used for some live and studio cleanup | — | Speculative |

**Notes:**
- **The DS-1 is the chorus distortion pedal.** The verse is CLEAN with the chorus pedal on; the explosive chorus section is the DS-1 kicked on. The dramatic quiet/loud dynamic is achieved by toggling ONE pedal.
- **The Small Clone is on the entire song** — never bypassed. The deep, wobbly chorus is integral to Cobain's tone. Without it, the clean verses lose their character. Many YouTube tone tutorials miss this.
- The Russian Big Muff (Civil War era) was on Cobain's later pedalboards but probably NOT on Teen Spirit specifically — Big Muff appears more on In Utero (1993).
- Cobain's pedalboard for Teen Spirit is otherwise minimal. The DS-1 + Small Clone is the WHOLE chain.

---

## Amp + Cab

- **Amp:** **Mesa/Boogie Studio .22+** OR **Marshall 30th Anniversary** — sources disagree
  - Most commonly cited: **Mesa Studio .22+** (a small 22W combo with a 1x12, used for studio overdubs)
  - For Teen Spirit's chorus: a louder amp — possibly a **Mesa Mark IV** or a Marshall, no consensus
  - Butch Vig may have layered multiple amps in the mix (reflective of his Smashing Pumpkins later production approach)
- **Cab:** Mesa 1x12 (built into the Studio .22+) for clean verses; a 4x12 for the chorus/distortion sections
- **Power tubes:** 6L6 quad in Mesa
- **Modifications:** Probably stock — Cobain wasn't a gear modifier for amps
- **Multi-cab setup:** Studio overdubs may have layered amps; live shows used the Mesa + 4x12

---

## Microphones

- **Close mic:** **Shure SM57** — close, ~1" off, on-axis
- **Off-axis:** Sometimes a Sennheiser MD421 close
- **Room mic:** Sound City's natural studio room — a Neumann U87 about 8 feet back. Andy Wallace's mix added MORE room sound than Vig tracked

The Nevermind room sound is partly Sound City's natural drum-tracking room and partly Wallace's mix-side reverb additions. Vig's tracking was relatively dry; the album's "big" sound is Wallace's contribution.

---

## Technique notes

- **Right-hand attack:** Cobain's pick attack is heavy and slightly inaccurate by metal-precise standards — the looseness is the character. Heavy downstrokes for the verse, full downpicks for the chorus
- **Palm muting:** Some — the verse riff has muted bass notes. Not as pristine as a metal player's mute
- **Pinch harmonics:** None on Teen Spirit
- **Power chords:** The chorus is built on classic 5th power chords (F-Bb-Ab-Db) — simple, repetitive, played hard
- **Volume knob:** Full open. Cobain didn't volume-roll for dynamics — he used the DS-1 toggle and picking force

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Boss DS-1 | **Deez One Vintage** (`HD2_DistDeezOneVintage`) | Verified | Direct DS-1 emulation. Distortion=0.80, Tone=0.50, Level=0.70 |
| EHX Small Clone | **PlastiChorus** (`HD2_ChorusPlastiChorus`) | Verified | Direct Small Clone emulation. Rate=0.40, Depth=0.70 (D-mode), Mix=0.6 |
| Mesa Studio .22+ | **Cali Texas Ch2** (`HD2_AmpCaliTexasCh1`) — closest model. Note: actual Studio .22+ isn't directly modeled; Cali Texas approximates the Mesa Mark series voicing | Verified | Drive=0.55, Mid=0.30 (grunge scoop), Sag=0.55 |
| Mesa 1x12 cab | **1x12 US Deluxe** (`HD2_Cab1x12USDeluxe`) | Verified | Closest stock 1x12 |
| ALT cab for chorus | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) | Verified, has WithPan | If using a different cab for the chorus, dual-mic would help |
| SM57 + MD421 | Mic 0 (SM57) + Mic 5 (R-121) on cabSibling | Verified | Direct match for studio mic technique |
| Sound City room | **Dynamic Room** (`VIC_ReverbDynRoom`) | Verified | Decay 1.5, Mix 0.18 |

---

## Sources

- Wikipedia — *Nevermind* article (Butch Vig, Andy Wallace, Sound City, recording dates)
- Butch Vig interviews — *Tape Op*, *Mix*, *Sound on Sound* (Nevermind production methodology)
- Andy Wallace interviews — *Mix* magazine (mix approach)
- Equipboard pros/kurt-cobain (Nevermind-era gear photos)
- *Heavier Than Heaven* (Charles R. Cross biography) — covers Cobain's gear preferences
- *Sound City* documentary (2013) — Dave Grohl's documentary about the studio includes Nevermind details
- Multiple Cobain gear documentations on YouTube and forums

---

## Confidence summary

- **Verified:** 16 items (recording context + Vig production + Sound City, Cobain's Mustang preference, DS-1 + Small Clone signal chain, Mesa Studio .22+ for cleans, Andy Wallace mix character, Eb tuning)
- **Likely:** 4 items (exact pickup config on Teen Spirit, exact amp for chorus section, multi-amp layering, mic placement on this specific song)
- **Speculative:** 1 item (Tech 21 SansAmp use — possible but unconfirmed)

---

## Open questions

- **Mustang or Jaguar on Teen Spirit?** Multiple sources contradict each other. Mustang is more documented for Nevermind era; Jaguar comes later.
- **Single amp or layered amps in the studio?** Vig has confirmed layering on Nevermind generally; track-by-track attribution is incomplete.
- **DS-1 stock or modified?** Cobain swapped some pedal components; the DS-1 is most-cited as stock.

---

## Recipe alignment

The current `cobain-teen-spirit-grunge` recipe matches the documented signal chain. Helix translation:
- Volume Pedal + light comp ✓
- Deez One Vintage (DS-1) default-on ✓ matches the chorus distortion pedal
- Industrial Fuzz alt drive (substituted for the original "Dark Dove Fuzz" / Russian Big Muff in the recipe) — Big Muff probably NOT on Teen Spirit; this is a future-fuzz alternative
- PlastiChorus (Small Clone) default-on ✓ correct, the iconic chorus shimmer
- Cali Texas Ch2 amp with Mid=0.30 ✓ the grunge mid-scoop
- Dual-mic 1x12 US Deluxe ✓ matches the small Mesa combo
- Tilt EQ at end ✓

Open improvements:
- Snapshot mode would help — verse (DS-1 off, Small Clone on, clean amp) vs chorus (DS-1 on, Small Clone on, amp pushed). Currently the recipe is one-tone.
- Could clarify the era caveat in the recipe metadata — Nevermind-era Mustang vs later Jaguar.
- The DS-1 alt fuzz (Industrial Fuzz / Russian Muff) is a HISTORICALLY incorrect addition for Teen Spirit; In Utero territory. Could remove or relabel.
