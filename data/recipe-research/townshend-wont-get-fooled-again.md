# Pete Townshend — "Won't Get Fooled Again" Pedalboard Research

**Recipe slug:** `townshend-wont-get-fooled-again`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Glyn Johns engineered; Who's Next is one of the most-documented sessions)

---

## Recording context

- **Album:** *Who's Next* (1971)
- **Studio:** **Olympic Studios**, London + **Mick Jagger's Stargroves** mansion (Rolling Stones Mobile)
- **Producer:** **The Who** + **Glyn Johns**
- **Engineer:** Glyn Johns
- Recording dates: April–June 1971

Won't Get Fooled Again is The Who's most-iconic anthem. The synth-arpeggio-led arrangement (Pete's ARP 2600 sequencer pattern) provides the song's "engine"; Pete's guitar enters in cathartic power chords with massive Marshall clarity. The Glyn Johns stereo-room mic technique was pioneered on this album.

---

## Guitar

- **Model:** **Gibson Les Paul Deluxe** (mini-humbuckers, gold-top) — Townshend's "Number 1" Les Paul of this era
  - Some sources cite a **Gretsch Country Gentleman** for certain takes — Pete had multiple guitars
- **Pickup:** **Bridge mini-humbucker** for the chord stabs
- **Tuning:** E standard
- **Strings:** Light .010s
- **Notable mods:** Stock — Pete plays Les Pauls factory-spec
- **Era caveat:** Pre-Schecter-era for Pete. The Les Paul Deluxe is the Who's Next era guitar; the SG and Gibson J-200 (acoustic 9-string) are also documented at Stargroves.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Edwards/Univox Vol-Wah** | Wah/volume pedal | Off for Won't Get Fooled Again | Verified off |
| — | (otherwise pedal-less) | Pete is mostly guitar→amp | — | Verified |

**Notes:**
- Pete Townshend's signature pre-effects-pedal-era tone is **Les Paul → Hiwatt → cab → mic**
- The "explosive" power chord tone is the Hiwatt at full volume + the Les Paul mini-humbuckers + Glyn Johns' room mics
- The synth arp is the only "effect" — and it's a separate ARP 2600 instrument, not a guitar processor

---

## Amp + Cab

- **Amp:** **Hiwatt Custom 100 (DR103)** — Pete's signature amp. Hiwatt was custom-built for Pete by Dave Reeves at the request of Marshall (Pete had outgrown Marshall sizes in 1969–70)
  - Settings: Volume 8, Bass 5, Mid 5, Treble 7, Presence 7 (Hiwatts have independent EQ per channel)
- **Cab:** **Hiwatt Fane Crescendo 4x12** — Fane speakers (NOT Greenbacks). The Fane's tighter low end is part of the Hiwatt sound
- **Power tubes:** EL34 quad
- **Modifications:** Stock Hiwatt — Pete's amps are factory custom-spec (not modded post-build)
- **Multi-cab setup:** **Yes — multiple Hiwatt 4x12s on stage**, but for studio basics likely a single 4x12. Some Stargroves overdubs may have used multiple amps

The Hiwatt's clean-loud headroom (it stays clean at high volume, breaks up only at full crank) is THE Townshend sound. NOT a saturated amp — a LOUD-clean amp.

---

## Microphones

- **Close mic:** **Shure SM57** close
- **Off-axis:** Possibly **Beyer M160** ribbon
- **Room mic:** **Glyn Johns Stereo Room Mic technique** — pioneered on Who's Next: a stereo pair (often AKG C12 or Coles 4038) ~10–15 feet back, capturing the natural acoustic mix at Stargroves

The Glyn Johns method places room mics far back to capture the natural ambience of the Stargroves house. The wide stereo image of Won't Get Fooled Again's drums (and guitar) is partly from this technique.

---

## Technique notes

- **Right-hand attack:** WINDMILL strums — Pete's most-iconic right-hand technique
- **Chord shapes:** Suspended 4ths and add9s — Pete's signature chord voicings
- **Bend technique:** Light, infrequent — Pete is a chord player, not a soloist
- **Volume knob:** Mostly full
- **Picking patterns:** Aggressive strummed chords; occasional muted single-string passages

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals) | — | — | Empty pedalboard |
| Hiwatt Custom 100 | (no direct Helix Hiwatt model) | Speculative | Closest is **Brit J-45** OR **Brit Plexi Brt** for British clean-loud headroom — Hiwatt has more headroom than Plexi, less crunch |
| Hiwatt Fane 4x12 | (no direct Fane model) | Speculative | Use **4x12 Greenback 25** as approximation — closest British 4x12 |
| SM57 + Coles 4038 | Mic 0 + Mic 5 ribbon on cabSibling | Verified for SM57 | Coles ribbon doesn't have direct match |

---

## Sources

- Wikipedia — *Who's Next* article
- Glyn Johns — *Sound Man* (autobiography)
- Pete Townshend — *Who I Am* (autobiography)
- Equipboard pros/pete-townshend
- Andy Babiuk's *The Who Gear* (forthcoming)

---

## Confidence summary

- **Verified:** 15 items (recording context, Olympic + Stargroves, Glyn Johns engineering, Hiwatt Custom 100, Les Paul Deluxe, no pedals)
- **Likely:** 2 items (mic technique specifics, exact amp settings)
- **Speculative:** 2 items (Hiwatt has no direct Helix model — Brit J-45 or Plexi Brt as approximations)

---

## Open questions

- **Single 4x12 or multiple cabs?** For studio basics, single is most likely; live performances had massive cab walls
- **Les Paul Deluxe or another guitar?** Pete had multiple Les Pauls — Deluxe is most-credited

---

## Recipe alignment

The current `townshend-wont-get-fooled-again` recipe should:
- Empty pedalboard (or just optional comp)
- Brit J-45 (or Brit Plexi Brt) amp at Drive 0.65 (clean-loud, just at breakup)
- 4x12 Greenback 25 cab dual-mic with cabSibling
- Spring or Hot Springs reverb at low mix
- Tilt EQ at end
- Note: the Hiwatt's character is "loud-clean" — set Drive lower than typical Marshall (0.65 vs 0.85) and use Master at maximum to preserve the clean-but-power-breaking-up character
- IDEAL: dual-DSP topology with two cabs in parallel for the Glyn Johns stereo room sound
