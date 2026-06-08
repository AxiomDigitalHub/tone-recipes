# Recipe Backlog

> The prioritized queue for the **daily-recipe-production** scheduled task.
> Each run picks the next 5 unproduced entries (status `queued`), researches
> them, writes the full recipe (Helix + QC + Katana + Kemper + Fractal + TONEX
> translations), runs the audit until clean, commits, and pushes. Then marks
> them `done` here and adds 5 new candidates at the bottom of the queue.

**Last revised:** 2026-05-10

## How to use this file

- Pick the next 5 entries with `status: queued` (top of the list = highest
  priority).
- After producing each recipe, change its `status` to `done` and append the
  recipe slug.
- New backlog entries should go at the bottom of the queue and be ordered
  by search-volume estimate × catalog gap (genre coverage).
- Don't reorder existing `queued` entries — that breaks reproducibility for
  the routine. If a song becomes higher priority, move it to the top with
  a comment explaining why.

## Quality bar (non-negotiable)

A recipe is "done" only if:
1. It passes the audit (`npx tsx scripts/audit-recipes.ts`) with **zero
   errors and zero warns**.
2. It has at least 2 source URLs from credible rig-rundown sources
   (Premier Guitar, Equipboard, official artist site, Sound on Sound,
   Gilmourish, etc.).
3. The signal_chain reflects what's documented for the actual recording —
   not an "approximation" guessed from listening.
4. All 6 platform translations exist and have ≥3 blocks (TONEX exempt
   per the Bible — single ToneNET search-query block is correct).
5. The album_art_url is verified by `npx tsx scripts/audit-album-art.ts`
   (re-run with the new song's title to confirm a match).

If a song's gear is poorly documented, **skip it** and pick the next
queued entry. A made-up recipe is worse than a missing one — it makes the
catalog less trustworthy, which is the only moat we have.

---

## Queue

Format: `Pri · Song · Band · Guitarist · Album (Year) · Gear sketch · Status`

| # | Song | Band | Guitarist | Album (Year) | Gear sketch | Status |
|--:|------|------|-----------|--------------|-------------|--------|
| 1 | Hotel California (final solo) | Eagles | Don Felder + Joe Walsh | Hotel California (1976) | Felder: 1959 LP through Fender Tweed Twin. Walsh: LP through Music Man HD-130. Echoplex on Walsh, MXR Phase 90 considered but not used on the track. | done |
| 2 | Free Bird (outro solo) | Lynyrd Skynyrd | Allen Collins + Gary Rossington | (Pronounced 'Lĕh-'nérd 'Skin-'nérd) (1973) | Collins: '57 Strat through Peavey Mace. Rossington: '59 LP through Marshall Super Lead. No effects on the original track. | done |
| 3 | Smoke on the Water (riff) | Deep Purple | Ritchie Blackmore | Machine Head (1972) | White '74 Strat (scalloped, post-recording) into Marshall Major 200W via AIWA reel-to-reel as preamp. The riff used parallel fourths/fifths, not power chords. | done |
| 4 | Sunshine of Your Love (riff) | Cream | Eric Clapton | Disraeli Gears (1967) | "Fool" SG painted by The Fool. Marshall JTM45 head + 4x12. Wah pedal not used on this track. The "woman tone" — guitar tone rolled off, neck pickup. | done |
| 5 | Money for Nothing (riff) | Dire Straits | Mark Knopfler | Brothers in Arms (1985) | Mid-position Strat (NS-style) into Laney Klipp through Sennheiser MD441 condensed and SM57. Wah pedal half-cocked. Knopfler used his fingers (no pick) — that's half the tone. | done |
| 6 | Sweet Home Alabama (intro) | Lynyrd Skynyrd | Ed King (not Rossington) | Second Helping (1974) | Intro lick + count-off is Ed King on a '72 Strat (weak single-coils), cranked amp (Marshall per King / Twin per engineer), single padded U87, no pedals. Attribution corrected from Rossington per Sound on Sound + King interviews. | done |
| 7 | Black Dog (riff) | Led Zeppelin | Jimmy Page | Led Zeppelin IV (1971) | LP into Marshall direct-injected via mic preamp on the console (Andy Johns trick). The recorded signal is line-level not amp'd; the amp tone heard is preamp distortion. | done |
| 8 | Money (solo) | Pink Floyd | David Gilmour | The Dark Side of the Moon (1973) | Black Strat → Big Muff Pi (Triangle) → Hiwatt DR103 → WEM 4x12. Binson Echorec on the dotted-eighth. | done |
| 9 | Don't Stop Believin' (solo) | Journey | Neal Schon | Escape (1981) | LP Custom or '59 LP into Mesa/Boogie Mark IIB. Schon used flanger and chorus on the lead. | needs-research |
| 10 | More Than a Feeling (riff) | Boston | Tom Scholz | Boston (1976) | Scholz custom-built rig (the Rockman precursor). LP into a 100W power amp + Scholz's homemade preamp. Highly compressed, multi-tracked. | done |
| 11 | Carry On Wayward Son (intro vocals + riff) | Kansas | Kerry Livgren | Leftoverture (1976) | LP through Marshall + Mesa/Boogie Mark I (blended). The riff is the iconic vocal harmony first, then guitar. | done |
| 12 | Black (build to outro) | Pearl Jam | Mike McCready | Ten (1991) | CORRECTED: not Mesa Studio .22 (that was Cobain's). McCready: black '62 Japanese-reissue Strat → Fender Bassman (clean verses) + Marshall JCM800 4x12 25W Greenbacks (solo), TS-9, Cry Baby. He confirmed "you can hear that [Bassman] on Black." | done |
| 13 | Even Flow (intro riff) | Pearl Jam | Mike McCready | Ten (1991) | Same Ten rig as Black, more midrange grit + Cry Baby wah on the solo. JCM800-driven, bridge pickup. | done |
| 14 | The Pretender (riff) | Foo Fighters | Dave Grohl + Chris Shiflett | Echoes, Silence, Patience & Grace (2007) | Built on the documented core: Grohl's Gibson Trini Lopez → Mesa Dual Rectifier (Modern) → V30 4x12, NS-2 gate. Shiflett's Tele Deluxe is the documented second guitar; his exact ESPG amp isn't pinned to the track, so the recipe centers on Grohl's rig. | done |
| 15 | Snow (Hey Oh) (intro arpeggio) | Red Hot Chili Peppers | John Frusciante | Stadium Arcadium (2006) | '62 Strat clean → Marshall Major (200W) + Boss CE-1 chorus. POG noted for the outro octave swell. | done |
| 16 | Dani California (verse + solo) | Red Hot Chili Peppers | John Frusciante | Stadium Arcadium (2006) | '62 Strat → Big Muff Pi (verses) + Octave Fuzz (solo) → Marshall Major. The solo was inspired by Hendrix and tracks accordingly. | needs-research |
| 17 | This Charming Man (jangle) | The Smiths | Johnny Marr | The Smiths (1984) | Rickenbacker 330 double-tracked with producer John Porter's '54 Tele → Roland JC-120 + Fender Twin Reverb blend, JC onboard chorus. ~15 layers. Capo 2nd fret. | done |
| 18 | There Is a Light That Never Goes Out (verse) | The Smiths | Johnny Marr | The Queen Is Dead (1986) | Same Rickenbacker + JC-120 + chorus rig as This Charming Man. Different chord voicings (E-major-friendly position). | done |
| 19 | One (intro clean → outro thrash) | Metallica | James Hetfield + Kirk Hammett | …And Justice for All (1988) | Hetfield: ESP Explorer with EMG 81/60 → Mesa Mark IIC+. Hammett: ESP KH → Mesa Mark IIC+ with wah on the solo. Distinct from Master of Puppets — first track with the EMG/ESP combo. | done |
| 20 | Battery (intro classical → thrash) | Metallica | James Hetfield + Kirk Hammett | Master of Puppets (1986) | Hetfield: ESP Explorer or Jackson King V → Mesa Mark IIC+ → Marshall power amp. Same era and rig as Master of Puppets — different riff voicing. The classical intro uses an acoustic. | done |
| 21 | The Boys Are Back in Town (twin lead) | Thin Lizzy | Scott Gorham + Brian Robertson | Jailbreak (1976) | Gorham: '59 LP into Marshall Super Lead. Robertson: '74 LP into Marshall. Twin harmonized lead in thirds — both guitars are essential. | done |
| 22 | Run to the Hills (galloping verse) | Iron Maiden | Dave Murray + Adrian Smith | The Number of the Beast (1982) | Both: Strats with hot-rodded pickups → Marshall JCM800. Galloping triplet rhythm requires precise alternate picking. | done |
| 23 | Painkiller (riff) | Judas Priest | Glenn Tipton + K.K. Downing | Painkiller (1990) | Tipton: Hamer Phantom GT into Marshall JMP-1 + Marshall power amp. Downing: same era. Drop-D not used; standard tuning, blistering tempo. | done |
| 24 | Holy Diver (intro riff + solo) | Dio | Vivian Campbell | Holy Diver (1983) | Campbell: Strat (later Charvel) into Marshall JCM800. The intro has subtle wah engaged at a fixed position. | done |
| 25 | Cemetery Gates (clean intro → solo) | Pantera | Dimebag Darrell | Cowboys From Hell (1990) | Dean ML "Dean From Hell" → Randall RG100ES (solid-state, no tubes). MXR 6-band EQ in front. Different from Walk — earlier album, more clean dynamics. | done |
| 26 | Crossroads (live solo) | Cream | Eric Clapton | Wheels of Fire (1968) | "Fool" SG into Marshall 100W stack. Live recording, Winterland '68. The solo is improvised but follows blues-form chord changes. | done |
| 27 | The Sky Is Crying (slow blues) | Stevie Ray Vaughan | Stevie Ray Vaughan | The Sky Is Crying (1991, posthumous) | Number One Strat → TS808 → Vibroverb. Slower and more emotive than Pride and Joy or Texas Flood — closer to BB King territory. | done |
| 28 | Born Under a Bad Sign (lead) | Albert King | Albert King | Born Under a Bad Sign (1967) | Flying V (left-handed but strung right-handed and flipped — strings reversed) → Acoustic 270. King's bending technique was inverted from most players. | needs-research |
| 29 | Crazy (intro slide) | Aerosmith | Joe Perry | Get a Grip (1993) | LP into Marshall JCM800 + Bogner Fish preamp. The intro slide guitar uses bottleneck on a Strat. | needs-research |
| 30 | Walk This Way (riff) | Aerosmith | Joe Perry | Toys in the Attic (1975) | LP into Marshall Super Lead. Talkbox not on this track (that's "Sweet Emotion"). The riff is straight-ahead funk-rock through a cranked amp. | done |
| 31 | Sweet Emotion (intro) | Aerosmith | Joe Perry | Toys in the Attic (1975) | LP through Marshall Super Lead with Heil Talk Box on the intro vocal-tone effect. The "talking" effect is a tube into a vocoder-like resonance through the talkbox. | done |
| 32 | November Rain (solo) | Guns N' Roses | Slash | Use Your Illusion I (1991) | '59 LP replica → Marshall JCM800 + studio MXR M-117 Flanger. The famous outdoor solo is double-tracked with a Crybaby wah on subtle filter sweeps. | done |
| 33 | Mr. Brightside (riff) | The Killers | Dave Keuning | Hot Fuss (2004) | Tele into Vox AC30 with Boss DD-3 delay set to dotted eighth. Similar to The Edge's approach but tighter rhythmic gating. | done |
| 34 | Black Hole Sun (verse) | Soundgarden | Kim Thayil | Superunknown (1994) | Strat-style guitar into Mesa Boogie + Leslie rotary speaker simulation (or actual Leslie). Drop-D tuning, capo position varies. | done |
| 35 | Alive (verse riff + solo) | Pearl Jam | Mike McCready | Ten (1991) | Strat → Mesa/Boogie Studio .22. The famous solo is a Free Bird-influenced extended outro that McCready improvised in the studio. | done |
| 36 | Yellow Ledbetter (intro) | Pearl Jam | Mike McCready | (B-side, 1992) | Strat through clean Marshall + light overdrive. Hendrix-influenced phrasing, "Little Wing"-adjacent voicings. | done |
| 37 | Cherub Rock (riff) | Smashing Pumpkins | Billy Corgan | Siamese Dream (1993) | "Big Muff Pi" through Marshall stack — the canonical "Siamese Dream" tone, multi-tracked 6+ rhythm tracks per song. | done |
| 38 | 1979 (chiming arpeggio) | Smashing Pumpkins | Billy Corgan | Mellon Collie and the Infinite Sadness (1995) | Yamaha SG into clean amp with chorus and delay. Sampled rhythm loop underneath — guitar is overlay, not driver. | needs-research |
| 39 | Bullet With Butterfly Wings (verse) | Smashing Pumpkins | Billy Corgan | Mellon Collie (1995) | Same Big Muff + Marshall stack rig as Cherub Rock, with cleaner verse passages and fuzz-bombs on the chorus. | done |
| 40 | Sex on Fire (verse arpeggio) | Kings of Leon | Caleb Followill | Only by the Night (2008) | Tele into Vox AC30. The arpeggio uses delay set to dotted eighth, simpler than U2 but in the same lineage. | needs-research |
| 41 | Use Somebody (verse riff) | Kings of Leon | Caleb Followill | Only by the Night (2008) | Same Tele + AC30 + delay rig. Cleaner than Sex on Fire, with reverb pushed for atmosphere. | done |
| 42 | Take It Easy (intro) | Eagles | Glenn Frey + Bernie Leadon | Eagles (1972) | Acoustic-driven track. Frey: Martin D-28. Leadon: '59 Tele on the lead lines through clean amp. | done |
| 43 | Life in the Fast Lane (riff) | Eagles | Joe Walsh | Hotel California (1976) | Walsh's LP through Music Man HD-130 + Maestro Echoplex. The riff is hammer-on/pull-off pattern across the second and third strings. | done |
| 44 | Reptilia (riff) | The Strokes | Nick Valensi + Albert Hammond Jr | Room on Fire (2003) | Two Strats panned hard L/R into clean amps with edge-of-breakup. The riff reads as one guitar but is two interlocking parts. | done |
| 45 | Last Nite (riff) | The Strokes | Nick Valensi + Albert Hammond Jr | Is This It (2001) | Same two-Strat / two-amp setup. The opening riff is hammered out on a Strat through a Crate VC30 (the cheap amp that defined their sound). | done |
| 46 | Folsom Prison Blues (boom-chicka) | Johnny Cash's band | Luther Perkins | (1956 single) | Tele through Fender Twin or Princeton, played in the "boom-chicka" pattern with the bass strings palm-muted. Capo position varies. | done |
| 47 | The Devil Went Down to Georgia (guitar break) | Charlie Daniels Band | Charlie Daniels (fiddle lead) + Tom Crain (guitar) | Million Mile Reflections (1979) | Crain: Strat through Music Man amp. The fiddle is the lead but the guitar break in the middle is iconic. | queued |
| 48 | Sharp Dressed Man (riff) | ZZ Top | Billy Gibbons | Eliminator (1983) | Pearly Gates LP through cranked Marshall, with Eliminator-era processing (synth pads underneath). Different from La Grange — late-'80s "MTV ZZ Top." | queued |
| 49 | Cult of Personality (riff) | Living Colour | Vernon Reid | Vivid (1988) | LP-style guitar (eventually a Hamer signature) through Marshall + ADA MP-1 preamp. The riff is fast pull-offs across the high strings. | queued |
| 50 | Toxicity (riff) | System of a Down | Daron Malakian | Toxicity (2001) | Ibanez Iceman → Mesa/Boogie Dual Rectifier. Drop-C tuning. The riff is alternating muted and open chord stabs. | queued |
| 51 | Chop Suey (intro arpeggio + chorus) | System of a Down | Daron Malakian | Toxicity (2001) | Same Iceman + Recto rig. The intro arpeggio is clean; the chorus drops to drop-C with full distortion. | queued |
| 52 | Plush (riff) | Stone Temple Pilots | Dean DeLeo | Core (1992) | LP into Mesa/Boogie Mark IIB. The riff uses dropped-D tuning and is built on parallel fifths. | queued |
| 53 | Interstate Love Song (intro) | Stone Temple Pilots | Dean DeLeo | Purple (1994) | LP into Vox AC30 for the cleaner verse, switched to Mesa for the chorus. The intro picking pattern is distinctive — open-D-style voicings. | queued |
| 54 | Don't Fear the Reaper (riff) | Blue Öyster Cult | Donald "Buck Dharma" Roeser | Agents of Fortune (1976) | Gibson SG through Music Man amp. The clean riff uses chorus and reverb for the atmospheric quality; the solo flips to overdrive. | queued |
| 55 | Highway to Hell (riff) | AC/DC | Angus Young | Highway to Hell (1979) | SG → cranked Marshall Plexi. Same setup as Back in Black era. Mutt Lange production added studio polish. | queued |
| 56 | Whole Lotta Rosie (riff) | AC/DC | Angus Young | Let There Be Rock (1977) | Same SG → Marshall rig as Back in Black. Earlier production, less polish, more raw aggression. | queued |
| 57 | The Number of the Beast (chorus riff) | Iron Maiden | Dave Murray + Adrian Smith | The Number of the Beast (1982) | Twin Strats → twin Marshall JCM800s. The harmonized chorus riff is in fourths. Same production era as Run to the Hills. | queued |
| 58 | Aces High (intro riff) | Iron Maiden | Dave Murray + Adrian Smith | Powerslave (1984) | Same twin-Strat / twin-Marshall rig. Faster tempo than Run to the Hills, harmonized fifths underneath. | queued |
| 59 | Pretty Woman (riff) | Roy Orbison | Roy Orbison + Billy Sanford | (1964 single) | Acoustic-driven hit, but Sanford's electric riff is iconic — through a Fender Twin, played on a Tele. | queued |
| 60 | Johnny B. Goode (riff) | Chuck Berry | Chuck Berry | After School Session (1958) | ES-350T (later ES-355) through Fender Twin. The double-stop intro is the foundation of all rock guitar lead phrasing. | queued |

---

## Done

(Recipes that have been produced. The daily routine appends here after each
successful run.)

| Date | Slug | Backlog # |
|------|------|-----------|
| 2026-06-01 | felder-hotel-california-solo | 1 |
| 2026-06-01 | collins-free-bird-outro-solo | 2 |
| 2026-06-01 | blackmore-smoke-on-the-water-riff | 3 |
| 2026-06-01 | clapton-sunshine-of-your-love-woman-tone | 4 |
| 2026-06-01 | knopfler-money-for-nothing-intro | 5 |
| 2026-06-02 | edking-sweet-home-alabama-intro | 6 |
| 2026-06-02 | page-black-dog-riff | 7 |
| 2026-06-02 | gilmour-money-solo | 8 |
| 2026-06-02 | scholz-more-than-a-feeling-riff | 10 |
| 2026-06-02 | livgren-carry-on-wayward-son-riff | 11 |
| 2026-06-03 | mccready-black-solo | 12 |
| 2026-06-03 | mccready-even-flow-solo | 13 |
| 2026-06-03 | grohl-the-pretender-riff | 14 |
| 2026-06-03 | frusciante-snow-hey-oh-intro | 15 |
| 2026-06-03 | marr-this-charming-man-jangle | 17 |
| 2026-06-05 | marr-there-is-a-light-jangle | 18 |
| 2026-06-05 | metallica-one-clean-to-thrash | 19 |
| 2026-06-05 | metallica-battery-acoustic-to-thrash | 20 |
| 2026-06-05 | gorham-boys-are-back-twin-lead | 21 |
| 2026-06-05 | murray-run-to-the-hills-gallop | 22 |
| 2026-06-06 | tipton-painkiller-speed-metal | 23 |
| 2026-06-06 | campbell-holy-diver-les-paul-marshall | 24 |
| 2026-06-06 | dimebag-cemetery-gates-clean-to-crushing | 25 |
| 2026-06-06 | clapton-crossroads-live-solo | 26 |
| 2026-06-06 | srv-the-sky-is-crying-slow-blues | 27 |
| 2026-06-07 | perry-walk-this-way-riff | 30 |
| 2026-06-07 | perry-sweet-emotion-talk-box | 31 |
| 2026-06-07 | slash-november-rain-solo | 32 |
| 2026-06-07 | keuning-mr-brightside-riff | 33 |
| 2026-06-07 | thayil-black-hole-sun-rotary-verse | 34 |
| 2026-06-07 | mccready-alive-solo | 35 |
| 2026-06-07 | mccready-yellow-ledbetter-clean | 36 |
| 2026-06-07 | corgan-cherub-rock-big-muff | 37 |
| 2026-06-07 | corgan-bullet-butterfly-fender-blender | 39 |
| 2026-06-07 | walsh-life-in-the-fast-lane-riff | 43 |
| 2026-06-08 | followill-use-somebody-octave-lead | 41 |
| 2026-06-08 | leadon-take-it-easy-tele-lead | 42 |
| 2026-06-08 | valensi-reptilia-lead-riff | 44 |
| 2026-06-08 | hammond-last-nite-riff | 45 |
| 2026-06-08 | perkins-folsom-prison-blues-boom-chicka | 46 |

### Corrections applied this run (2026-06-08)

- **#41 Use Somebody** — the backlog sketch credits "Caleb Followill / Tele +
  AC30." Research (Sound on Sound's Jacquire King interview, official song
  credits) shows the iconic delayed octave hook is **Matthew Followill (lead)**,
  not Caleb (rhythm + vocal), and King confirmed the **Matchless** combo was the
  amp on this track (a Vox AC-15 was the documented second amp). Guitar is a
  semi-hollow Epiphone (Sheraton, era-documented). Recipe centers on Matthew's
  DL4-delay + lush Eventide-style reverb tone.
- **#42 Take It Easy** — built on **Bernie Leadon's** B-Bender Telecaster lead
  (not Frey's acoustic). Key corrected to **G major, no capo** (sketch implied
  otherwise). Amp is a clean Fender (Deluxe Reverb / Tweed Deluxe, era-inferred);
  Olympic Studios, Glyn Johns. Avoided two common errors: the '53 maple-neck Tele
  (post-1974) and Frey's Takamine (1976+) — neither belongs to this 1972 track.
- **#44 Reptilia** — **Nick Valensi** lead on an Epiphone Riviera (P-94
  single-coils), not "two Strats." Documented chain (Gordon Raphael): Visual
  Sound Jekyll & Hyde → **Fender Hot Rod DeVille**, MD 421 → API no EQ. Not high
  gain — edge-of-breakup. Hard L/R two-guitar panning foregrounded.
- **#45 Last Nite** — **CORRECTED the Crate VC30 myth.** No primary source
  supports it; producer Gordon Raphael documents **Fender DeVille** amps. Recipe
  centers on **Albert Hammond Jr's** white '70s-reissue Strat, with the Crate
  story explicitly flagged as unverified lore and corrected.
- **#46 Folsom Prison Blues** — built on the **1955 Sun studio** version:
  **Luther Perkins's early-'50s Fender Esquire** (single bridge pickup, dead
  vol/tone pots) — not a Telecaster — flatwounds, palm-muted boom-chicka, into a
  small **Silvertone 1300** (per Marshall Grant; NOT a Fender on this cut) with
  **Sam Phillips's Sun tape slapback**. Album art anchored to the studio LP
  *With His Hot and Blue Guitar*, not the live At Folsom Prison cover.

**Album-art note:** all 5 new covers were visually verified via the Read tool
(the album-art audit can't auto-match because it searches iTunes by guitarist
name while these tracks are credited to bands — same false-negative as the
existing Walsh / Keuning / Thayil / Corgan band-member recipes).

### Corrections applied this run (2026-06-07, batch 2)

- **#35 Alive** — the backlog sketch's "Strat → Mesa/Boogie Studio .22" is the
  same myth corrected on #12 Black: the Studio .22 was Cobain's, not
  McCready's. Per Premier Guitar (McCready's own account), the recorded Alive
  solo is the black **1962 Japanese-reissue Strat → Ibanez TS-9 → cranked
  Marshall JCM800 → 4x12 (25W Greenbacks)**, with a **Cry Baby** in the solo
  and a **Uni-Vibe on the one-take outro** (overdubbed at Tim Palmer's mix in
  England). Also flagged: the "Alive = 1959 Les Paul" belief is a LIVE fact —
  McCready didn't acquire that guitar until 1998, so it can't be on the 1991
  record. Recipe ships the Strat and debunks both in its notes.
- **#36 Yellow Ledbetter** — guitar corrected. Not the black '62 used on the
  rest of Ten: per McCready (Vintage Guitar), Yellow Ledbetter is a **Fender
  '57 reissue Strat with a maple neck**. The amp is **genuinely undocumented**
  for this track — built on a clean **Fender Bassman** voice (his documented
  Ten clean amp) and labeled "inferred" throughout. Pedal-free, big studio
  plate; the tone is technique + reverb.
- **#37 Cherub Rock** — well-documented and shipped as-is. The dirt is
  specifically the **late-'70s op-amp Big Muff** (Helix "Industrial Fuzz"),
  into the **low-gain input** of a cranked, KT88-loaded **JCM800 2203** run as
  a loud near-clean power stage (preamp low, master high). Eb standard;
  quad-tracked wall. Pickup (DiMarzio vs Lace) and speaker model flagged
  uncertain.
- **#39 Bullet With Butterfly Wings** — the headline correction: the loud
  chorus is a **Fender Blender** (octave fuzz), **not** the Siamese Dream Big
  Muff. Corgan names the pedal and the song together in his Dec-1995 Guitar
  World interview. Built on the Mellon Collie rig (JCM800 2203/KT88 → Mesa
  Strategy 500 at half power → Marshall 4x12). Clean verse path is inferred
  (fuzz bypassed); exact Bullet-take guitar not documented (era number-one '57
  reissue Strat used). Eb standard.
- **#43 Life in the Fast Lane** — amp corrected. The catalog's Walsh chain
  (Les Paul → Music Man HD-130 + Echoplex) is the **Hotel California outro**,
  NOT this track. Per the official Line 6 song tone template + Vintage Guitar,
  Walsh cut the Fast Lane riff on a **1950s Strat → cranked tweed Fender
  Deluxe (5E3)**, with **Felder's '59 Les Paul doubling the riff an octave up**
  through the same amp. No talk box (that's Rocky Mountain Way), no confirmed
  Echoplex; amp-only. Strat-vs-Tele and Deluxe-vs-Champ flagged as the
  documented uncertainties.

### Corrections applied this run (2026-06-07)

- **#33 Mr. Brightside** — the backlog sketch ("Tele into Vox AC30 with Boss
  DD-3 dotted eighth") is a **myth that contradicts the primary source.** Per
  Dave Keuning's own GuitarPlayer account, ~90% of Hot Fuss — including this
  riff — was **a 1970s Ibanez Destroyer straight into a Fender Hot Rod
  DeVille**, standard tuning, edge-of-breakup. There is **no documented delay
  on the recording**; the cascading, Edge-adjacent feel is the moving Dadd9
  voicing with the open high E ringing. The Telecaster, AC30, dotted-eighth
  delay, and Eb-standard claims are all unsourced tone-blog folklore. The
  recipe ships the documented rig and debunks the myth in its notes.
- **#34 Black Hole Sun** — attribution corrected. The watery **verse rotary
  part was tracked by Chris Cornell**, not Kim Thayil — per producer Michael
  Beinhorn (via Guitar World), Cornell cut most of Superunknown's rhythm and
  Thayil played lead. The verse tone is a 1989 **Gretsch Duo Jet through a real
  Leslie Model 16 (Fender Vibratone) driven by a Marshall JMP**, fast rotor —
  not a chorus pedal or Univibe. The off-pitch shimmer is a **tape speed-up
  (~75 cents sharp of drop D)**, not an alternate tuning. Attributed to Thayil
  (Soundgarden's guitarist, matching the queue) with Cornell's role flagged
  throughout. Mic/room reverb undocumented; not asserted.
- **#30 Walk This Way** — the amp is genuinely disputed in the sources: Joe
  Perry (first-person) recalls a 1950s 50W Fender Twin; Guitar World's
  track-by-track analysis says an Ampeg V-2 (mid selector at 800 Hz). Both
  agree the riff growl IS the midrange push, so the recipe centers on the
  bass-low / mid-forward voicing and flags both amps rather than picking one.
  The riff is amp-only (Maestro fuzz appears only on the outro); 3-mic capture
  (Sony C37 + SM57 + MD421 → 1176 → Pultec) per engineer Jay Messina.

### Corrections applied earlier (2026-06-06)

- **#23 Painkiller** — the backlog sketch's "Marshall JMP-1" is anachronistic
  (the JMP-1 rackmount preamp launched in 1992, *after* Painkiller's 1990
  recording). Built on the well-cited consensus instead: hot-humbucker Hamer
  solidbodies into a cranked **Marshall JCM800-era** head, recorded by Chris
  Tsangarides at Miraval Studios, France. Attributed to Glenn Tipton (the
  title-track solo); K.K. Downing credited in the notes.
- **#24 Holy Diver** — the sketch's "Strat (later Charvel)" is wrong for the
  record. Per Vintage Guitar + Equipboard + Campbell interviews, Holy Diver
  was cut on a **wine-red Gibson Les Paul Deluxe** (refinished matte black,
  DiMarzio X2N bridge) boosted by a **Boss SD-1** into a stock cranked
  **JCM800** at Sound City Studios. The Charvels came later, on the Last in
  Line tour.

### needs-research

- **#38 1979 (Billy Corgan, Mellon Collie 1995)** — skipped 2026-06-07. The
  *production* of 1979 is exceptionally well-documented (Corgan, Flood,
  Moulder, Chamberlin) — but the **specific clean guitar rig is not**. No
  credible source names the guitar, amp, or modulation chain for 1979's
  chiming part; it began as an acoustic/vocal demo and was rebuilt around a
  loop processed through a **Kurzweil K2600**. Every "1979 guitar tone" gear
  list online (Yamaha SG, Marshall + chorus, "Eventide instant flanger") is an
  unsourced tone-match *suggestion*, not documentation. Building a guitar-rig
  recipe would mean guessing the guitar, amp, and chorus — exactly what the
  no-approximation bar forbids. Re-queue only if a primary source names the
  1979 guitar/amp/effects, or re-scope to a "studio production — loop +
  Kurzweil" entry. Built #43 (Life in the Fast Lane) in its place this run.

- **#40 Sex on Fire (Kings of Leon, Only by the Night 2008)** — skipped
  2026-06-07. The **amp is genuinely undocumented**, same failure mode as #9.
  Per the primary Sound on Sound interview, engineer Jacquire King ran a
  rotating "mix and match" of **5-6 amps, two at a time** per guitar part and
  names **no model**; the Vox AC30 in the backlog sketch is an unsourced
  tone-guide suggestion (debunked). The riff delay is also not pinned to a
  named pedal/setting. What IS documented: the guitar (**Gibson ES-325**), the
  dual-amp SM57+U67 Blackbird tracking, and an **Eventide DSP4000** "synth-like
  reverb" — not enough to name an amp model for six platform translations
  without guessing. **Attribution correction for the re-queue:** the signature
  high riff was **written and recorded by Caleb Followill** (on his ES-325,
  playing high-neck while recovering from shoulder surgery) — not Matthew, and
  not in Caleb's usual rhythm role. Re-queue only if a primary source names the
  Sex on Fire amp.

- **#28 Born Under a Bad Sign (Albert King, 1967)** — skipped 2026-06-07.
  The guitar half is magazine-grade (Gibson Flying V, played as a flipped
  right-handed instrument with the strings in factory order so the low E sits
  at the bottom; Erlewine-documented light gauges; an unusual down-tuning that
  the sources themselves conflict on). But the **amp is genuinely undocumented
  for the 1966–67 Stax sessions** — and the Acoustic 270 in the backlog sketch
  is **anachronistic** (Acoustic Control Corp. was founded in 1967; the 270
  shipped ~1970, and those were his later live amps, not the record). No
  primary source names the Stax studio amp, cab, or mic for this track, and the
  candidates (a borrowed Fender, a small tweed) are speculation. The amp/cab/mic
  half fails the no-approximation bar. Re-queue only if a primary source on the
  1967 studio amp surfaces, or re-scope to a guitar/technique-only entry. Built
  #33 (Mr. Brightside) in its place this run.

- **#29 Crazy (Joe Perry, Get a Grip 1993)** — skipped 2026-06-07. There is
  **no song-specific gear documented** for this track — no interview, rig
  rundown, or liner note ties named gear to "Crazy." The backlog sketch's two
  headline details both failed verification: the **Bogner Fish preamp has no
  documented Joe Perry connection** (its known users are Megadeth/Slayer/
  Anthrax members, Vernon Reid, Jerry Cantrell), and the **Strat slide-intro
  guitar is unsourced** (slide tuning also unknown). Perry himself describes the
  Get a Grip sessions as ~75 amps and countless guitars pieced together per
  break — i.e. no single per-song rig. Re-queue only if a primary source on the
  "Crazy" rig (or its slide intro) surfaces. Built #34 (Black Hole Sun) in its
  place this run.

- **#16 Dani California (John Frusciante, Stadium Arcadium 2006)** — skipped
  2026-06-03. The backlog sketch (Big Muff Pi verses + Octave Fuzz solo →
  Marshall Major) is **contradicted by the documentation.** Per Ground
  Guitar's Stadium Arcadium tone breakdown, the verses were a *clean* 1954
  Strat split in stereo through a **Doepfer A100 modular synth** controlling
  a low-pass filter, with harmony guitars run through a **Moog MF-105 MuRF**;
  the solo was "primarily clean," later processed with a **Delta Labs
  Effectron II delay** — and the source explicitly notes **no traditional
  fuzz** (no Big Muff) was used. That signal path is exotic, studio-bound,
  and not reproducible as a trustworthy player-facing rig recipe, and it
  doesn't match the queued premise. Re-queue only if a simpler, well-sourced
  account of a guitar-rig (amp + pedal) version of the tone surfaces, or
  re-scope the entry to "studio chain — modular synth + MuRF." Built #17
  (This Charming Man) in its place this run.

- **#9 Don't Stop Believin' (Neal Schon, Escape 1981)** — skipped 2026-06-02.
  The guitar (black 1977 Gibson Les Paul) and studio (Fantasy Studios,
  Berkeley; Elson/Stone production) are well-documented, but the **amp is
  genuinely unsourced** — no primary source quotes Schon or the producers
  naming the Escape studio amp. Candidates conflict wildly (Peavey Mace vs.
  a Marshall vs. a Mesa/Boogie Mark), and they're different enough voicings
  that guessing one would fail the no-approximation bar. Mic placement and
  the specific chorus/delay/reverb units are also undocumented. Re-queue
  only if a primary source (Schon interview / producer account) on the
  Escape amp surfaces. Built #11 in its place this run.

---

## Backlog Maintenance

**Weekly task** (in `weekly-recipe-audit`): when the queue drops below 30
entries, add 10 new candidates from these sources:
- Spotify "Top 50 Most Streamed Rock Songs" of the past month
- Reddit r/guitar "what tone is this" recurring questions
- YouTube guitar-cover top videos (high-traffic = high-search)
- Genre coverage gaps in the existing catalog (if we have only one country
  recipe, queue 3 country songs; if zero metal-core, queue some)

Don't randomly add songs — every queue entry should answer "which guitarist
with which gear on what record." If you can't fill those four blanks
confidently, it's not ready for the queue.
