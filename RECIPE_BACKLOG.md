# Recipe Backlog

> The prioritized queue for the **daily-recipe-production** scheduled task.
> Each run picks the next 5 unproduced entries (status `queued`), researches
> them, writes the full recipe (Helix + QC + Katana + Kemper + Fractal + TONEX
> translations), runs the audit until clean, commits, and pushes. Then marks
> them `done` here and adds 5 new candidates at the bottom of the queue.

**Last revised:** 2026-06-10

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
| 1001 | What A Beautiful Name | Hillsong Worship | Nigel Hendroff | Let There Be Light (2016) | SHIPPED as hendroff-what-a-beautiful-name. CORRECTION: the always-on pedal is the Jackson Audio Prism boost, NOT a Klon KTR (Klon premise was inaccurate). Main guitar is his Gretsch NH Signature Penguin (Broad'Tron BT-65), not a Duesenberg. Amp Vox AC30 Top Boost / Matchless. 136 BPM, key D. | done |
| 1002 | Goodness of God | Bethel Music | David Hislop | Victory (Live) (2019) | SHIPPED as hislop-goodness-of-god. CORRECTION: best-documented guitarist is David Hislop, NOT Strand/Pope; amp is a UK Vox AC30/6 TB with Greenbacks, NOT a Matchless (that's Pope/Holt). Gretsch Filter'Tron, JHS Superbolt/Kilt drives (no Klon), Walrus Deep Six, Strymon Timeline/BigSky/El Cap. 82 BPM, key Ab. | done |
| 1003 | Graves Into Gardens | Elevation Worship | Elevation band (verify guitarist) | Graves Into Gardens (Live) (2020) | SKIPPED 2026-06-12. Could not confirm a single electric guitarist for the recording (credited team: David Liotta / Joey Signa / Kevin Smith / E Edwards; Furtick also played electric on the bridge). The one documented Elevation board (E Edwards) is a Quad Cortex/HX Stomp MODELER rig, not the AC30/Klon/Timeline analog premise above. Drop "Jonsal/Davide" — Jonsal Barrientes is a vocalist. | needs-research |
| 1004 | Living Hope | Phil Wickham | Casey Moore (session) | Living Hope (2018) | SHIPPED as moore-living-hope. CORRECTION: the title track (track 2) was played by session guitarist Casey Moore, produced by Ed Cash — NOT touring guitarist Taylor Johnson (who plays other album tracks). Clean Vox/Bad Cat, EHX Micro POG, dotted-eighth, big plate. ~72 BPM half-time, key Eb. | done |
| 1005 | Build My Life | Housefires / Pat Barrett | Housefires band (verify) | Housefires III (Live) (2016) | SKIPPED 2026-06-12. No documented electric guitarist for the III recording and zero primary-source rig documentation (AllMusic/Discogs credits 403-blocked; no rig rundown / Equipboard profile exists). Only tutorial-maker patches exist, which are not the band's gear. Song facts: key G, 70 BPM, 4/4. Needs liner-note credits before shipping. | needs-research |
| 1006 | King of Kings | Hillsong Worship | Nigel Hendroff (unconfirmed) | Awake (2019) | SKIPPED 2026-06-12. Could NOT confirm Hendroff played electric on the Awake master (album led by Brooke Ligertwood w/ Michael Guy Chislett; no per-musician credits published). Song facts are well-documented (68 BPM, key D, always-on OD on edge of breakup, dotted-SIXTEENTH delay at 68 BPM, big lead build) — needs a guitarist-attribution source before shipping. | needs-research |
| 1007 | Way Maker | Leeland (popular version) | Casey Moore | Better Word (Live) (2019) | SHIPPED as moore-way-maker. Casey Moore VERIFIED as Leeland's lead guitarist (Wikipedia + Equipboard). Strat → EB VP JR volume pedal → Klon-style drive → Strymon Timeline (dotted-eighth) → Boss RV-6 → Vox AC30. 68 BPM, key E. | done |
| 1008 | Battle Belongs | Phil Wickham | session/touring guitarist (verify) | Hymn of Heaven (2021) | SKIPPED 2026-06-12. No published per-track electric-guitar credit for the studio recording (only songwriter/producer credits exist); tutorial sites describe the host's gear, not the studio rig. Song facts: key Db, ~72 BPM half-time, 4/4. Needs Hymn of Heaven liner-note instrument credits. | needs-research |
| 1009 | Great Are You Lord | All Sons & Daughters | Stu Garrard (Stu G) | Live (2013) | SHIPPED as garrard-great-are-you-lord. Stu Garrard VERIFIED as the credited electric guitarist (Discogs "Live" credits). Blue Mexican Tele → Vox AC30 (+ Park combo), Jackson Audio Prism always-on boost, restrained ambient delay/reverb. ~72 BPM 6/8, key A. | done |
| 1010 | House of the Lord | Phil Wickham | session/touring guitarist (verify) | Hymn of Heaven (2021) | SKIPPED 2026-06-12. Same disqualifier as #1008 — no published per-track electric-guitar credit for the studio recording. Song facts: key Bb, 86 BPM, 4/4. Needs Hymn of Heaven liner-note instrument credits before shipping. | needs-research |
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
| 47 | The Devil Went Down to Georgia (guitar break) | Charlie Daniels Band | Charlie Daniels (fiddle lead) + Tom Crain (guitar) | Million Mile Reflections (1979) | Crain: Strat through Music Man amp. The fiddle is the lead but the guitar break in the middle is iconic. | needs-research |
| 48 | Sharp Dressed Man (riff) | ZZ Top | Billy Gibbons | Eliminator (1983) | Pearly Gates LP through cranked Marshall, with Eliminator-era processing (synth pads underneath). Different from La Grange — late-'80s "MTV ZZ Top." | done |
| 49 | Cult of Personality (riff) | Living Colour | Vernon Reid | Vivid (1988) | LP-style guitar (eventually a Hamer signature) through Marshall + ADA MP-1 preamp. The riff is fast pull-offs across the high strings. | done |
| 50 | Toxicity (riff) | System of a Down | Daron Malakian | Toxicity (2001) | Ibanez Iceman → Mesa/Boogie Dual Rectifier. Drop-C tuning. The riff is alternating muted and open chord stabs. | done |
| 51 | Chop Suey (intro arpeggio + chorus) | System of a Down | Daron Malakian | Toxicity (2001) | Same Iceman + Recto rig. The intro arpeggio is clean; the chorus drops to drop-C with full distortion. | done |
| 52 | Plush (riff) | Stone Temple Pilots | Dean DeLeo | Core (1992) | LP into Mesa/Boogie Mark IIB. The riff uses dropped-D tuning and is built on parallel fifths. | done |
| 53 | Interstate Love Song (intro) | Stone Temple Pilots | Dean DeLeo | Purple (1994) | Telecaster (neck) into clean Vox AC30 with an S.I.B. VariDrive on the intro; '57 LP TV Special for the chorus. Southern Tracks, Brendan O'Brien. Eb tuning. | done |
| 54 | Don't Fear the Reaper (riff) | Blue Öyster Cult | Donald "Buck Dharma" Roeser | Agents of Fortune (1976) | CORRECTED: riff cut on co-producer's Gibson ES-175 hollowbody (not the SG) into a clean Music Man 410-65. Shimmer is EMT plate + 15ips tape delay, NOT a chorus. SG only for the solo. Record Plant NYC. | done |
| 55 | Highway to Hell (riff) | AC/DC | Angus Young | Highway to Hell (1979) | 1968 SG → cranked Marshall 1959 Super Lead Plexi, G12-65 cab. Schaffer-Vega wireless preamp boost. Roundhouse, Mutt Lange polish. No pedals. | done |
| 56 | Whole Lotta Rosie (riff) | AC/DC | Angus Young | Let There Be Rock (1977) | Late-'60s SG → cranked Marshall JMP Super Lead, G12M Greenbacks. Rawer/midrange-forward, Plexi Normal channel. Albert Studios Sydney, Vanda & Young, near-live. | done |
| 57 | The Number of the Beast (chorus riff) | Iron Maiden | Dave Murray + Adrian Smith | The Number of the Beast (1982) | Murray's Strat (DiMarzio Super Distortion) + Smith's Ibanez Destroyer → cranked Marshall (model disputed: Super Lead vs early JCM800), MXR Distortion+ boost, Greenbacks. Martin Birch, Battery Studios. | done |
| 58 | Aces High (intro riff) | Iron Maiden | Dave Murray + Adrian Smith | Powerslave (1984) | Same twin-Strat / twin-Marshall rig. Faster tempo than Run to the Hills, harmonized fifths underneath. | done |
| 59 | Pretty Woman (riff) | Roy Orbison | Roy Orbison + Billy Sanford | (1964 single) | SKIPPED — riff guitar + amp undocumented. The in-room witness (Wayne Moss, MusicRadar) says he doesn't remember Sanford's guitar; the only named amp in the session was a Gibson, not the backlog's guessed "Tele through a Fender Twin." The riff was a layered stack of 3 electrics. Studio/reverb (RCA Studio B, EMT plate, Bill Porter) is documented but the signal chain is not. Fails the quality gate. | needs-research |
| 60 | Johnny B. Goode (riff) | Chuck Berry | Chuck Berry | After School Session (1958) | ES-350T (later ES-355) through Fender Twin. The double-stop intro is the foundation of all rock guitar lead phrasing. | done |
| 61 | My Own Summer (riff) | Deftones | Stephen Carpenter | Around the Fur (1997) | Carpenter's ESP 7-string → Marshall, drop tuning, dark/heavy | done |
| 62 | Falling Away From Me (intro/verse) | Korn | Munky & Head | Issues (1999) | Ibanez 7-string (Apex/K7) → Mesa Triple Rectifier Solo, A-standard 7-string (drop-tuned 2 steps), clean DiMarzio neck into crushing chug | done |
| 63 | Freak on a Leash (riff) | Korn | Munky & Head | Follow the Leader (1998) | SHIPPED as korn-freak-on-a-leash. CORRECTION: amp is Mesa DUAL Rectifier, not Triple (3-channel Triple shipped late 1999, post-album); exact studio head is forum-sourced, hedged in notes. Guitar = Ibanez Universe UV7 (K7 = 2001), DiMarzio Blaze, A-standard A-D-G-C-F-A-D, scooped Recto. | done |
| 64 | Blind (intro) | Korn | Munky & Head | Korn (1994) | SHIPPED as korn-blind-intro. Ibanez Universe UV7, A-standard. Amp hedged: Mesa Dual Rectifier is era live amp / documented Korn voice, exact 1994 tracking head unpublished (forum-sourced). Distinctive: Ross Robinson's modded-fuzz, very-dry Indigo Ranch production, default-ON fuzz. | done |
| 65 | Got the Life (riff) | Korn | Munky & Head | Follow the Leader (1998) | SHIPPED as korn-got-the-life. Same rig as #63 (Universe UV7 → Mesa Dual Rectifier, A-standard). Tuned for staccato funk-chug: slightly lower gain, tight fast gate + low Sag for articulation. (Dropped "Fusion Edge pickup" — anachronistic.) | done |
| 66 | Be Quiet and Drive (Far Away) (main riff) | Deftones | Stephen Carpenter | Around the Fur (1997) | SHIPPED as carpenter-be-quiet-and-drive. CORRECTION: Around the Fur is a 6-STRING DROP C# record (C#-G#-C#-F#-A#-D#), NOT 7-string — Seymour Duncan JB (not EMG), per Carpenter interviews. ESP Horizon Custom → ADA MP-1 → Marshall 9200, FZ-2 Hyper Fuzz, chorus clean verse. | done |
| 67 | Change (In the House of Flies) (verse) | Deftones | Stephen Carpenter | White Pony (2000) | SHIPPED as carpenter-change-in-the-house-of-flies. CORRECTION: 6-STRING DROP C (C-G-C-F-A-D), NOT 7-string/EMG — White Pony was "mostly six-string-led" with Seymour Duncan (Carpenter); EMG/7-string era came after. ESP Horizon → ADA MP-1/JMP-1 → Marshall 9200 + POD, atmospheric build. | done |
| 68 | Hexagram (riff) | Deftones | Stephen Carpenter | Deftones (2003) | ESP 7-string, EMG 81-7 → Marshall JMP-1 + 9200, 7-string drop tuning, frantic tremolo chug | done |
| 69 | Sugar (verse) | System of a Down | Daron Malakian | System of a Down (1998) | Ibanez Iceman → Marshall JCM800, drop C (C-G-C-F-A-D), spastic stop-start riffing | done |
| 70 | Spiders (clean/verse) | System of a Down | Daron Malakian | System of a Down (1998) | Ibanez Iceman → Marshall (Super Lead/JCM800), drop C, clean arpeggio into heavy | done |
| 71 | Aerials (intro) | System of a Down | Daron Malakian | Toxicity (2001) | Ibanez Iceman → Marshall, drop C, chiming clean-octave figure, MXR Phase 90 | done |
| 72 | B.Y.O.B. (chorus riff) | System of a Down | Daron Malakian | Mezmerize (2005) | Ibanez Iceman → Marshall, drop C, breakneck verse into anthemic chorus | done |
| 73 | Bulls on Parade (main riff/solo) | Rage Against the Machine | Tom Morello | Evil Empire (1996) | "Arm the Homeless" (EMG 81/85, Kramer neck, Floyd) → Marshall JCM800 2205 50W + Peavey 4x12, E♭ standard (NOT drop D — Morello tuned a half step down), wah toggle-scratch solo | done |
| 74 | Guerrilla Radio (verse) | Rage Against the Machine | Tom Morello | The Battle of Los Angeles (1999) | "Arm the Homeless" → Marshall JCM800 2205 + Peavey 4x12, drop D, percussive wah "wacka-wacka," DigiTech Whammy 2-oct siren solo (corrected: Arm the Homeless, not Telecaster) | done |
| 75 | Sleep Now in the Fire (riff) | Rage Against the Machine | Tom Morello | The Battle of Los Angeles (1999) | "Arm the Homeless" → Marshall JCM800 2205 + Peavey 4x12, STANDARD tuning (corrected from drop D), bluesy A-minor riff, Whammy harmony-mode verse hum | done |
| 76 | People of the Sun (riff) | Rage Against the Machine | Tom Morello | Evil Empire (1996) | "Arm the Homeless" → Marshall JCM800 2205, drop D, signature is the hex/Allen-key string scrape between pickups (corrected: scrape is the main riff, Whammy is chorus squeals) | done |
| 77 | Stinkfist (main riff) | Tool | Adam Jones | Ænima (1996) | Gibson Les Paul Custom Silverburst (Duncan JB bridge) → Diezel VH4 + Marshall Super Bass, drop D, Boss BF-2 flanger swirl | done |
| 78 | Sober (riff) | Tool | Adam Jones | Undertow (1993) | Les Paul Silverburst → modified Marshall Super Bass 100 (jumpered), drop D, dynamic quiet-to-crush (corrected: Undertow is single Super Bass; Diezel rig came later, from Ænima on) | done |
| 79 | The Pot (riff) | Tool | Adam Jones | 10,000 Days (2006) | Les Paul Silverburst → Diezel VH4 + Marshall Super Bass + Mesa 4x12. CORRECTION: tuning is **Drop C** (Adam Jones, per Guitar World — tuned down for Maynard), NOT drop D. MXR Micro Amp clean boost on board. | done |
| 80 | Jambi (riff/solo) | Tool | Adam Jones | 10,000 Days (2006) | Les Paul Silverburst → 3-head blend (Marshall Super Bass + Diezel VH4 + Rivera Knucklehead), **Drop D (D A D G B E)**. Heil Talk Box on the solo (verified, MusicRadar/Guitar World). Bone-dry rhythm. | done |
| 81 | Crawling (verse/chorus) | Linkin Park | Brad Delson | Hybrid Theory (2000) | PRS CE 24 → Mesa Dual Rectifier. CORRECTION: tuning is **Eb standard** (half-step down, standard shapes), NOT drop D. Amp rig is documented-consensus (no primary session breakdown); noted honestly in recipe. | done |
| 82 | One Step Closer (riff) | Linkin Park | Brad Delson | Hybrid Theory (2000) | PRS CE 24 → Mesa Dual Rectifier, **Drop D (half-step down)**. Delson's favorite riff. Amp rig is documented-consensus; mic/pedal specifics are reconstructions, noted honestly in recipe. | done |
| 83 | Faint (octave riff) | Linkin Park | Brad Delson | Meteora (2003) | PRS Custom 24 → Mesa Dual Rectifier + Marshall 1959 layered, **Drop D (half-step down)**, bright cutting octave hook over strings. Amp rig is documented-consensus, noted honestly in recipe. | done |
| 84 | Papercut (riff) | Linkin Park | Brad Delson | Hybrid Theory (2000) | PRS CE 24 → Mesa Dual Rectifier (+Marshall 1959SLP layer), drop C# (½-step + drop D), NS-2 gate; NRG/Don Gilmore | done |
| 85 | Duality (main riff) | Slipknot | Mick Thomson & Jim Root | Vol. 3: The Subliminal Verses (2004) | CORRECTED rig: VHT Pitbull (Thomson) + modded Bogner Uberschall/Mesa Mark IIC (Root), drop B; Rubin/Sound City. NOT the later Rivera/Orange/MTM touring gear | done |
| 86 | Before I Forget (riff) | Slipknot | Mick Thomson & Jim Root | Vol. 3 (2004) | Same Vol.3 rig: modded Bogner Uberschall (Root, ~70%) + VHT Pitbull (Thomson), drop B; Rubin/Sound City | done |
| 87 | Wait and Bleed (riff) | Slipknot | Mick Thomson & Jim Root | Slipknot (1999) | SKIPPED — Jim Root did NOT play this track (Josh Brainard + Mick Thomson tracked it, 1998); Brainard's debut rig is undocumented and no published settings exist. Re-scope to Thomson-only or drop. | needs-research |
| 88 | Psychosocial (main riff) | Slipknot | Mick Thomson & Jim Root | All Hope Is Gone (2008) | Ibanez MTM1/Blackouts → JCM800 2203 + Maxon (Thomson); Jim Root Tele/EMG → Orange Rockerverb + Diezel (Root), drop A; Fortman/Sound Farm | done |
| 89 | Down with the Sickness (riff) | Disturbed | Dan Donegan | The Sickness (2000) | Gibson-era guitar (pre-Maya) → Mesa Triple Rectifier, drop C#, DigiTech Whammy intro siren, GHS .012-.054; Johnny K/Groovemaster | done |
| 90 | Stricken (riff) | Disturbed | Dan Donegan | Ten Thousand Fists (2005) | SHIPPED as donegan-stricken-riff. CORRECTION: Washburn Maya signature launched 2005 (the album year) with Seymour Duncan HBs; the RM4 1086 module was built IN-STUDIO during these sessions (Donegan: "a combination between a Mesa/Boogie and a Bogner Ecstasy") → RT2/50 → R412XLT V30. Drop C, Johnny K @ Groovemaster. | done |
| 91 | Stupify (riff) | Disturbed | Dan Donegan | The Sickness (2000) | SHIPPED as donegan-stupify-riff. CORRECTION: recorded on a GIBSON LES PAUL STANDARD (PRS was live-only) — pre-Washburn era. Mesa Triple Rectifier (Modern), Recto 4x12 V30, drop C# (C#-G#-C#-F#-A#-D#), Johnny K @ Groovemaster. | done |
| 92 | Whatever (riff) | Godsmack | Tony Rombola | Godsmack (1998) | SHIPPED as rombola-whatever-riff. CORRECTIONS: borrowed GIBSON LES PAUL STUDIO (not Custom — Rombola: "the one that worked best with my Mesas"); amp is his "Mesas" (Rectifier-family; exact debut model NOT pinned, Dual Rectos came post-Universal); NO Splawn confirmed for debut; tuning is DROP C (C-G-C-F-A-D), not drop D. New Alliance Studios, Sully Erna + Mudrock. | done |
| 93 | I Stand Alone (riff) | Godsmack | Tony Rombola | Faceless / soundtrack (2002) | needs-research — SKIPPED 2026-06-18. Guitar (Les Paul Standard, from video) and tuning (drop C) are confirmable, but the amp is NOT documented for this specific 2002 single (only his general Mesa Dual Rectifier rig by inference) and the producer/studio could not be verified to 2+ sources. Don't guess the rig per the quality gate; revisit if a track-specific interview surfaces. | needs-research |
| 94 | Awake (riff) | Godsmack | Tony Rombola | Awake (2000) | SHIPPED as rombola-awake-riff. CORRECTIONS: Mesa/Boogie (Mix Online primary: "Rombola's Mesa/Boogie amps were miked"; Dual Rectifier strong inference) captured with SM57 + Sennheiser MD 421 → John Hardy M1 preamps → Manley Massive Passive EQ; tuning is DROP C, not drop D. Gibson Les Paul. Sully Erna + Mudrock. | done |
| 95 | Dig (main riff) | Mudvayne | Greg Tribbett | L.D. 50 (2000) | SKIPPED 2026-06-19. Gear undocumented for the 2000 sessions: no primary source names the tracking guitar, pickups, or amp. The Ibanez RG7620 7-string premise is WRONG — "Dig" is 6-string DROP B (B-F#-B-E-G#-C#), not a 7-string; Tribbett's Ibanez/EMG endorsements are 2004+ and his Mesa/Randall amps are his later live rig. Only tuning + studio (Warehouse, Vancouver / Garth Richardson) are verifiable. Needs a tracking-amp source. | needs-research |
| 96 | Last Resort (riff) | Papa Roach | Jerry Horton | Infest (2000) | SHIPPED as horton-last-resort-riff (2026-06-19). CORRECTIONS: amp is documented MARSHALL (JMP-1 preamp/EL34 + JCM900), NOT a Mesa Dual Rectifier; tuning is DROP D, not drop C; BOSS describes a tight mid-forward 'bark,' not a scooped Recto. Specific Infest guitar undocumented (pre-Infest Carvin; Schecter came later). NRG Studios / Jay Baumgardner. | done |
| 97 | Getting Away with Murder (riff) | Papa Roach | Jerry Horton | Getting Away with Murder (2004) | SKIPPED 2026-06-19. Tuning genuinely contested across whole families (standard / drop D / drop C# / drop C) and the 2004 amp + guitar are undocumented (Mesa/Bogner unsupported; Schecter sig didn't exist in 2004). Only production (Howard Benson / Bay 7 + Sparky Dark / CLA mix) is documented. Needs a primary Horton interview on the GAWM sessions. | needs-research |
| 98 | Youth of the Nation (riff) | P.O.D. | Marcos Curiel | Satellite (2001) | SKIPPED 2026-06-19. Tuning unknown/conflicting (tabs split standard vs drop D) and no source ties a specific guitar/amp to the Satellite recording (Curiel's PRS + Mesa loyalty is career-general, not session-confirmed). Only production (Howard Benson / Bay 7 + Sparky Dark / CLA) is documented. Needs session-specific gear + tuning. | needs-research |
| 99 | Bodies (main riff) | Drowning Pool | C.J. Pierce | Sinner (2001) | SHIPPED as pierce-bodies-riff (2026-06-19). Drop C (C-G-C-F-A-D) and Mesa Dual Rectifier confirmed (amp widely reported). Studio Ocean / Jay Baumgardner / NRG mix documented. Specific 2001 guitar undocumented (B.C. Rich/Dean signatures are ~2010+); shipped with honest hedges. | done |
| 100 | Sinner (riff) | Drowning Pool | C.J. Pierce | Sinner (2001) | DEFERRED 2026-06-19 — buildable (same album/rig as Bodies: Drop C, Mesa Dual Rectifier, Ocean/Baumgardner), held back to avoid shipping two same-album Drowning Pool recipes in one batch. Promote next run. SHIPPED 2026-06-20 as pierce-sinner-riff (same documented Sinner-album rig as Bodies). | done |
| 101 | Loco (main riff) | Coal Chamber | Meegs Rascon | Coal Chamber (1997) | DEFERRED 2026-06-19 — GEAR fully researched & solid: DROP B (B-F#-B-E-G#-C#), Marshall JCM800 (Meegs direct quote, JCM900 on sections), NRG / Jay Gordon, Duncan JB; debut-era guitar = B.C. Rich (NOT the later Yamaha Drop-6, which is his 2001+ rig). BLOCKER: Coal Chamber's self-titled debut is not on iTunes, so album_art_url can't be verified per our rule. Needs a verified album-art source, then ship. | queued |
| 102 | Enemy (riff) | Sevendust | Clint Lowery & John Connolly | Seasons (2003) | SHIPPED as lowery-enemy-riff (2026-06-19). Mesa/Boogie Mark IV (Lowery's documented career recording amp), PRS Custom 22, low-B Drop B family (B-F#-B-E-G#-C#; exact voicing within the family unverified). Butch Walker / Ruby Red, Baumgardner mix. CORRECTION: Diamond/EVH premise wrong (Diamond is his later LIVE rig); Connolly's rhythm amp undocumented. | done |
| 103 | Refugee (riff) | Tom Petty & the Heartbreakers | Mike Campbell | Damn the Torpedoes (1979) | SHIPPED as campbell-refugee-lead (2026-06-19). CORRECTION: the guitar is the modified '72 Tele 'RED DOG' (HH + Tele-bridge single, onboard Destruct boost), NOT a Broadcaster (that's his 'American Girl' guitar). Amp undocumented for the track — shipped as era-accurate cranked tweed/blackface Fender + lush LA plate. Sound City / Iovine / Yakus documented. | done |
| 104 | Blood and Thunder (riff) | Mastodon | Brent Hinds / Bill Kelliher | Leviathan (2004) | SHIPPED as kelliher-blood-and-thunder-riff (2026-06-19). Marshall JCM800 (6550-modded) + Hinds' JMP + BK Butler Tube Driver (always-on boost), Gibson LP Custom / Flying V, D STANDARD (D-G-C-F-A-D, not drop). CORRECTION: Diezel premise wrong; documented amps are Marshall. Matt Bayles / Robert Lang Studios. | done |
| 105 | (research links for a future Tremonti recipe — row was malformed by a prior run; links preserved in git history at 8f9568d^) | Alter Bridge | Mark Tremonti | — | Rich source set already gathered (Equipboard, 2x Premier Guitar rig rundowns, guitarguitar, Guitar Lobby, boogieforum). Blackbird solo already shipped — pick a NEW song (e.g. Metalingus riff or Isolation) before using. | reference |
| 106 | (research links for a future Baroness recipe — row was malformed by a prior run; links preserved in git history at 8f9568d^) | Baroness | John Baizley / Gina Gleason | STONE (2023) | Source set gathered (uberproaudio, Equipboard, 2x Premier Guitar rig rundowns incl. 2024, Guitar World STONE feature). No song pinned yet — pick one with documented per-track gear. | reference |
| 107 | Go with the Flow (riff) | Queens of the Stone Age | Josh Homme | Songs for the Deaf (2002) | SHIPPED 2026-06-20 as homme-go-with-the-flow-riff. CORRECTIONS: recording guitar = Ovation electric (Valentine's account), NOT the Maton BB1200 (that's the live/signature guitar); recording amp = blended Ampeg VT-40 + V-4B bass head + Peavey/Tube Works solid-state, NOT the VT-22 (live-era); tuning is C standard (C-F-Bb-Eb-G-C); dirt = Foxx octave fuzz + Z.Vex SHO; off-axis miking (U87/C37A) chasing ~600 Hz; Sound City/Conway, Eric Valentine. | done |
| 108 | First It Giveth (riff) | Queens of the Stone Age | Josh Homme | Songs for the Deaf (2002) | SHIPPED 2026-06-21 as homme-first-it-giveth-riff. CORRECTION: tracking guitar = Ovation Ultra GP / Maton MS-series per Eric Valentine, NOT the Maton BB1200 (that's post-2005). C standard. Dirt = Univox Super-Fuzz + Boss SD-1, Boss GE-7 ~400 Hz boost; Ampeg V-4B/VT-40 blend, off-axis Sony C-37A/MD441/RCA44. VT-22 is live-only. Per-song pedal use inferred from Valentine's documented album board. | done |
| 109 | 3's & 7's (riff) | Queens of the Stone Age | Josh Homme | Era Vulgaris (2007) | SHIPPED 2026-06-21 as homme-3s-and-7s-riff. Maton BB1200 (his main by this era; TVL Jaguar also on album), Ampeg, Fulltone Ultimate Octave fuzz (inferred). CORRECTION: producers = Homme + Chris Goss (The Fififf Teeners), eng. Alain Johannes at Cherokee/Steakhouse/Sound City — Joe Barresi only mixed "Make It wit Chu," NOT this track. Tuning C standard per band convention (widely transcribed in E; flagged). | done |
| 110 | My God Is the Sun (riff) | Queens of the Stone Age | Josh Homme | ...Like Clockwork (2013) | needs-research — DEFERRED 2026-06-21. GEAR is well documented (Maton BB1200 JH/Lollar, vintage Ampeg + GreedTone JHI-100, Homme/QOTSA prod., Mark Rankin recording at Pink Duck). BLOCKER: ...Like Clockwork is NOT on the iTunes/Apple Music store in any country (US/GB/DE/CA/AU checked), so album_art_url can't be verified per our rule. Needs a verified album-art source, then ship. | needs-research |
| 111 | Green Machine (riff) | Kyuss | Josh Homme | Blues for the Red Sun (1992) | SHIPPED 2026-06-21 as homme-green-machine-riff. CORRECTION: guitar = 1984 Ovation Ultra GP (DiMarzio DP-104 Super 2), NOT an SG/acoustic. Amp = Marshall JCM900 4100 (NOT the later MosValve, ~1995) → Ampeg 8x10 BASS cab. Dirt is amp gain + wah, NOT a "desert fuzz" pedal (myth corrected). C standard (Homme: "B and C"). Chris Goss / Sound City / eng. Joe Barresi 1992. | done |
| 112 | Thumb (riff) | Kyuss | Josh Homme | Blues for the Red Sun (1992) | SHIPPED 2026-06-21 as homme-thumb-riff. Same album rig as Green Machine (Ovation Ultra GP → JCM900 4100 → Ampeg 8x10 bass cab, Chris Goss/Sound City). Differentiated by neck-pickup, darker JCM900 normal-channel voicing for the album's heaviest low end; wah textural (default-off). Dirt = amp gain, no fuzz. C standard. | done |
| 113 | Like a Stone (solo) | Audioslave | Tom Morello | Audioslave (2002) | SHIPPED 2026-06-20 as morello-like-a-stone-solo. CORRECTION: guitar = Fender "Soul Power" Strat (Hot Rails bridge + 2 Noiseless), NOT "Arm the Homeless" — that custom was retired in 2002 as Audioslave formed. Standard E (the Drop-D claims trace to the bass part). Marshall JCM800 2205 lead channel (cleans via rolled-back volume) → Peavey 4x12 G12K-85; WH-1 octave-up on the solo, Boss DD-3 delay, TR-2 trem on the riff. Rick Rubin / Cello Studios. | done |
| 114 | Cochise (riff) | Audioslave | Tom Morello | Audioslave (2002) | SHIPPED 2026-06-21 as morello-cochise-riff (pulled forward as the 5th in place of art-blocked #110). CORRECTION: guitar = Fender "Soul Power" Strat (Hot Rails bridge + 2 Noiseless, kill-switch toggle), NOT "Arm the Homeless" (that's the RATM guitar w/ EMGs). Standard E (Drop-D is a myth). JCM800 2205 lead → Peavey 4x12 G12K-85. The "helicopter" intro = kill-switch toggle stutter + fast high-feedback Boss DD delay + DigiTech Whammy. DOD FX40B is a board boost (Cochise use inferred); tremolo belongs to "Like a Stone." Rick Rubin / Cello Studios. | done |
| 115 | Show Me How to Live (riff) | Audioslave | Tom Morello | Audioslave (2002) | SHIPPED 2026-06-22 as morello-show-me-how-to-live-riff. CORRECTIONS: tuning is DROP D (D-A-D-G-B-E), not standard E; guitar is the 'Soul Power' Strat (Hot Rails bridge), NOT 'Arm the Homeless' (that's the RATM EMG guitar); the signature warble is in the SOLO (tremolo-picked high E through a Cry Baby wah feeding a RING MODULATOR), NOT a Whammy on the riff. Riff = JCM800 2205 lead straight into Peavey 4x12 (G12K-85). Rubin / Cello Studios. | done |
| 116 | Slither (riff) | Velvet Revolver | Slash | Contraband (2004) | SHIPPED 2026-06-20 as slash-slither-riff. Drop D (D-A-D-G-B-E) CONFIRMED via Slash quote (not Eb). Distortion = Frank-Levi-modded Marshall JCM800 2203 + JCM 2555SL Slash Signature (Vox AC30 cleans); 1960BV V30 cab; Tube Screamer documented out front. CAUTION baked into recipe: the Vintage Modern 2466 is Libertad-era, NOT Contraband. Josh Abraham / Ryan Williams / Andy Wallace, NRG + Pulse, SM57. | done |
| 117 | Fall to Pieces (solo) | Velvet Revolver | Slash | Contraband (2004) | SHIPPED 2026-06-22 as slash-fall-to-pieces-solo. CORRECTIONS: tuning is Eb STANDARD (half-step down), not standard E; rhythm guitar is a '56 Les Paul Goldtop (slashparadise, track-specific), solo guitar likely the Derrig '59 replica (inferred); SD Alnico II Pro pickups; amp is the 2555SL Silver Jubilee → 1960BV (V30); MXR 10-band for the solo boost. DROPPED the Crybaby wah (unverified for this track), Vox AC30 cleans, and modded-2203 (unconfirmed). Abraham/Wallace, NRG+Pulse. | done |
| 118 | Dirty Little Thing (riff) | Velvet Revolver | Slash | Contraband (2004) | SHIPPED 2026-06-23 as slash-dirty-little-thing-riff. Slash quote nails it: "I think I'm playing straight into Marshalls" — Les Paul, NO pedals, into a Frank-Levi-modded JCM800 2203 (S.I.R. #34) / JCM 2555SL Silver Jubilee, 1960AV/BV V30 cab. CORRECTION vs. Slither: standard E (not Drop D), and no Tube Screamer documented on this track. Josh Abraham / NRG + Pulse, ~168 BPM key A. Cab/mic/exact-LP inferred from his Contraband rig. | done |
| 119 | Woman (riff) | Wolfmother | Andrew Stockdale | Wolfmother (2005) | SHIPPED 2026-06-20 as stockdale-woman-riff. CORRECTION: recording guitar = '73 Gibson SG (Stockdale's own words), NOT a Gibson ES-355 (unverified) — Flying V is later/live. Standard E. Amp = rotating vintage palette (Marshall Plexi/Super Lead, Orange, Laney, Hiwatt), Dave Sardy switching per section, Sound City LA. Fuzz: Green Russian Big Muff (documented studio) + Foxx Tone Machine octave fuzz (his live staple, for the lead bite). New artist entry added: andrew-stockdale. | done |
| 120 | Joker & the Thief (riff) | Wolfmother | Andrew Stockdale | Wolfmother (2005) | SHIPPED 2026-06-22 as stockdale-joker-and-the-thief-riff. CORRECTIONS: guitar is a '73 Gibson SG (not '74); the album amps are a rotating vintage palette and Stockdale (MusicRadar) names the HIWATT feedback for THIS song specifically — NOT the JMP/Vox AC30 (those are his LIVE rig). Studio fuzz = Green Russian Big Muff, phaser on intro. Dave Sardy / Sound City. Tuning (std E) and cab/mic are educated, not session-confirmed. | done |
| 121 | Dimension (riff) | Wolfmother | Andrew Stockdale | Wolfmother (2005) | SHIPPED 2026-06-23 as stockdale-dimension-riff. '73 Gibson SG (Stockdale's own, confirmed) → cranked ~50W Marshall Super Lead Plexi (his "pretty sure I used a Marshall 50-watt" quote), green-Russian Big Muff as the fuzz wall. CORRECTION: dropped the Roland AF-100 Bee Baa — it's only in his general-rig gear lists, NOT documented for the 2005 Sardy sessions; the documented studio fuzz is the green-Russian Muff. Dave Sardy / Sound City + Sunset Sound, std E ~142 BPM Bm. Cab/mic/per-section amp inferred. | done |
| 122 | Pleasure to Burn (riff) | Rival Sons | Scott Holiday | Pressure & Time (2011) | needs-research — SKIPPED 2026-06-22. No song-level gear documented: Holiday himself says he can't recall which gear goes with which tune, and no source names the amp, fuzz, or tuning for THIS track to 2 sources. Worse, the strongest "Gnarly Fuzz all over the record" + "little Supro" quotes are actually about the NEXT album (Head Down, 2012), so even the era attribution leans on the adjacent record — the amp is a pure guess. Documented at album level only: modded Firebird VII, Dave Cobb producing, recorded at The 1974 (LA, not Nashville). Fails the quality gate; revisit only if a track-specific Holiday interview surfaces. | needs-research |
| 123 | Keep On Swinging (riff) | Rival Sons | Scott Holiday | Head Down (2012) | needs-research — SKIPPED 2026-06-23. Same disqualifier as #122: Holiday's only song-named quote is hedged ("I'm terrible at recalling which gear goes with which tune") AND it contradicts the backlog sketch on every point — it's a '62 Fender Jazzmaster (Lollar P-90s), a "little Supro" combo (NOT Orange 4x12 via PowerStage), and a Basic Audio Gnarly Fuzz OR Vox Tone Bender (NOT a ZVEX Fuzz Probe, which is his live pedal). Tuning/BPM undocumented. Dave Cobb / Vance Powell, Nashville, Feb 2012. Revisit only if a firm track-level source surfaces; the Firebird/Orange/Fuzz-Probe premise is wrong. | needs-research |
| 124 | Open My Eyes (riff) | Rival Sons | Scott Holiday | Great Western Valkyrie (2014) | needs-research — SKIPPED 2026-06-23. ZERO song-level rig documentation, and the album-level fact contradicts the sketch: for GWV Holiday used a Kauer Banshee "Excalibur" (TV Jones Filtertrons) "on pretty much the entire record" (MusicRadar Aug 2014) — NOT a Firebird VII. "Way Huge Attack Vector" appears only in his general/later pedal lists, never tied to this song or album. Amp not song-documented (2014 live = 2× Orange OR50). Dave Cobb / Low Country Sound, Nashville. Fails the quality gate. | needs-research |
| 125 | Highway Tune (riff) | Greta Van Fleet | Jake Kiszka | From the Fires (2017) | SHIPPED 2026-06-22 as kiszka-highway-tune-riff (built with disclosure). CORRECTIONS: the drive is a Rangemaster-style germanium TREBLE BOOSTER (Jext Telez Range Lord), not an EHX Big Muff; the amp is a cranked Marshall SUPER LEAD PLEXI-style head (the Astoria combo + JCM800 are LATER/live, deliberately excluded). 1961 Gibson SG 'The Beloved' (humbuckers), standard E. Young/Sutton at Rustbelt Studios, Royal Oak MI. Hard-verified: producers/studio/guitar/tuning/booster identity; amp head + cab + mic inferred from his documented rig. New artist: jake-kiszka. | done |
| 126 | Black Smoke Rising (riff) | Greta Van Fleet | Jake Kiszka | From the Fires (2017) | SHIPPED 2026-06-23 as kiszka-black-smoke-rising-riff. Same documented #1 rig as Highway Tune (1961 SG 'The Beloved' → Jext Telez Range Lord treble booster → cranked Marshall SUPER LEAD PLEXI → 4x12 → Holy Grail) but voiced heavier/darker for the slower ~100 BPM (G major). CORRECTION: NOT a JCM800 (that's his later/live amp) — period-correct is the cranked Plexi. The verse's doubled/octave texture is most likely double-tracking; included a low-blend Micro POG as an optional/inferred emulation. Sutton/Young, Rustbelt. Std E. | done |
| 127 | When the Curtain Falls (riff) | Greta Van Fleet | Jake Kiszka | Anthem of the Peaceful Army (2018) | SHIPPED 2026-06-23 as kiszka-when-the-curtain-falls-riff. CORRECTION: the Selmer Zodiac Twin 30 / JCM800 pairing is his 2021 TOURING rig — anachronistic for 2018. The documented 2018 rig (Premier Guitar Rig Rundown) is a Marshall ASTORIA head → 1982A 4x12, pushed by an MXR Micro Amp clean boost with twin EHX Holy Grails (studio also blended an AC30 + Marshall, U67/U87 mics). 1961 SG, standard, ~96 BPM. Rust Brothers (Sutton/Young/Boone), Blackbird + Rustbelt. Cleaner/punchier than his Plexi songs — a deliberately distinct recipe. | done |
| 128 | Sacred the Thread (riff) | Greta Van Fleet | Jake Kiszka | Starcatcher (2023) | SHIPPED 2026-06-23 as kiszka-sacred-the-thread-riff. VERIFIED combos-only: Kiszka explicitly abandoned Marshall stacks ("it just moves so much air") and tracked on a blonde Fender Bassman, Vox AC30, silverface Princeton and Magnatone Twilighter, captured by a multi-distance mic blend (close/2ft/5ft/room). Reverb = the RCA Studio A room itself, NOT a pedal. Dave Cobb / RCA Studio A. 1961 SG, standard. Built on the AC30 as lead voice; Range Lord treble booster kept low + flagged inferred (no session pedalboard documented). BPM undocumented. | done |
| 129 | Electric Worry (riff) | Clutch | Tim Sult | From Beale Street to Oblivion (2007) | SHIPPED 2026-06-22 as sult-electric-worry-riff (built with disclosure). Gibson SG → cranked Marshall JMP (Super Lead) → 1960 cab (V30), mid-forward, open-string riff, NO fuzz. CORRECTION: the EHX Micro POG is a studio staple of his on OTHER tracks but is NOT documented on 'Electric Worry' — deliberately left out. Real McCoy wah as a textural accent (default-off). Hard-verified: standard E (Sult himself, Guitar World video), Joe Barresi at Sound City + Bay 7, song is a Muddy Waters 'Trouble No More' partial cover. Specific SG / amp settings / mic inferred. New artist: tim-sult. | done |
| 130 | Earth Rocker (riff) | Clutch | Tim Sult | Earth Rocker (2013) | SHIPPED as sult-earth-rocker-riff (2026-06-24). CORRECTION: the guitar was a Gibson Les Paul Junior (P-90) -- Sult told Guitar World it was the ONLY electric on the whole album, not an SG. Amps Marshall JCM900 (primary) + JTM45 (blend per producer Machine); Orange PPC212 2x12 (V30). Prod. Machine @ The Machine Shop, Belleville NJ. | done |
| 131 | A Quick Death in Texas (riff) | Clutch | Tim Sult | Psychic Warfare (2015) | needs-research -- SKIPPED 2026-06-24. The Psychic Warfare album rig IS documented (Marshall JCM800 + Fender Bassman + Orange OR100; occasional Big Muff / Creepy Fingers fuzz on 3-4 tracks), but the per-song guitar and amp for this funky, fingerpicked ZZ-Top-worship track are NOT isolated anywhere -- sources only say Sult used "a particular guitar for fingerpicking." Don't guess SG vs PRS vs the clean-Bassman setting. Needs a song-specific source. | needs-research |
| 132 | Second Chance (lead) | Shinedown | Zach Myers | The Sound of Madness (2008) | SHIPPED as myers-second-chance-lead (2026-06-24). CORRECTION: the "Second Chance" guitar is a PRS Santana converted to semi-hollow (Myers names it specifically for this song), not the SC-250. Diezel Herbert (his main Shinedown head ~a decade); clean-verse / singing-lead contrast via a transparent boost on/off. | done |
| 133 | Cut the Cord (riff) | Shinedown | Zach Myers | Threat to Survival (2015) | SHIPPED as myers-cut-the-cord-riff (2026-06-24). PRS SE custom in D standard (whole step down), .011-.052; Axe-Fx II patches off a Diezel Herbert + Fryette into a Diamond 4x12 (Crown power amp live). Gated, percussive high-gain chug. | done |
| 134 | I Miss the Misery (riff) | Halestorm | Joe Hottinger | The Strange Case Of... (2012) | SHIPPED as hottinger-i-miss-the-misery-riff (2026-06-24). 2003 Gibson SG Standard → cranked Marshall Super Lead plexis (red '71 / purple '73) → Bogner 4x12 (Beyma Liberty); Tru-Fi Octavia fuzz on the lead. Prod. Howard Benson. | done |
| 135 | Love Bites (So Do I) (solo) | Halestorm | Joe Hottinger | The Strange Case Of... (2012) | SHIPPED as hottinger-love-bites-solo (2026-06-24). Same rig as #134 (SG → cranked vintage Super Lead plexi → Bogner/Beyma 4x12); solo differentiated by the Bogner La Grange lead boost + Strymon TimeLine delay. (The SV20H in the old sketch is the modern reissue of these vintage Super Leads.) Grammy winner. | done |
| 136 | Open Casket (riff) | The Sword | J.D. Cronise | Age of Winters (2006) | SHIPPED as cronise-open-casket-riff (2026-06-25). CORRECTION: the Bogner Ecstasy Red is his LATER touring board and is anachronistic for 2006 (pedal ~2012). Per Kyle Shutt (Guitar World 2020) the Age of Winters guitars ran a Maxon DS-830 Distortion Master into a borrowed Laney AOR 100; an SG Faded also appeared. Cronise's defining/live voice is the 1979 Explorer E2 (DiMarzio Super Distortion) → cranked Orange OR100 → Orange 4x12 (V30). C standard, 2 steps down. Self-produced, Folkvang/Austin. New artist: jd-cronise. | done |
| 137 | Freya (riff) | The Sword | J.D. Cronise / Kyle Shutt | Age of Winters (2006) | SHIPPED as cronise-freya-riff (2026-06-25). CORRECTION: "Big Crunch One Knob" is Kyle Shutt's later touring AMP, not a pedal — dropped. Same Age of Winters chain as #136: Maxon DS-830 → borrowed Laney AOR (Shutt), with Cronise's Orange OR100 / 1979 Explorer as the live/defining voice. Double-tracked riff; song blew up via Guitar Hero II. C standard, 2 steps down. | done |
| 138 | Maiden, Mother & Crone (riff) | The Sword | J.D. Cronise / Kyle Shutt | Gods of the Earth (2008) | SHIPPED as cronise-maiden-mother-crone-riff (2026-06-25). By the second album the cranked Orange OR100 is the locked-in voice (Cronise = Orange since 1998); gain is all amp. The MXR Phase 90 (documented in his 2014 + 2021 PG rig rundowns) is the riff's swirling signature sweep. Carbon Copy delay left out to keep the riff dry/forward. ~105 BPM, key C, 2 steps down. Self-produced @ Folkvang/Premium, Austin, 2007. | done |
| 139 | Hung Out to Dry (riff) | Red Fang | Bryan Giles / David Sullivan | Red Fang (2009) | needs-research — SKIPPED 2026-06-25. WRONG BAND: "Hung Out to Dry" is a FU MANCHU song (2006 EP), NOT a Red Fang track and NOT on Red Fang's 2009 debut (10-track listing has no such song). The sketch is also broken on gear: Friedman BE-OD is anachronistic (pedal ~2015), the Electra Omega is David Sullivan's (Giles plays a 5-string Fender Mustang), and the Nik Huber Krautster is a later-era (2016+) guitar. RE-SCOPE to a real debut track (e.g. Prehistoric Dog / Reverse Thunder) before shipping — the 2009 rig is mostly inference anyway (gear journalism is 2016+; dirt = cranked Sunn Beta Lead, no pedal). | needs-research |
| 140 | Wires (riff) | Red Fang | Bryan Giles / David Sullivan | Murder the Mountains (2011) | SHIPPED as giles-wires-riff (2026-06-25). The beer-armor single. Production HARD-VERIFIED: produced by Chris Funk (The Decemberists) + Red Fang, recorded at Type Foundry (Portland), mixed by Vance Powell @ Blackbird (Nashville). Built on Red Fang's signature cranked Sunn Beta Lead (solid-state, all-amp dirt — no verified pedal); drop C. Electra Omega = Sullivan, Giles = 5-string Mustang. CAUTION baked in: nearly all RF gear journalism is 2016+, so the per-song chain is informed inference. New artist: bryan-giles. | done |
| 141 | Take My Bones Away (riff) | Baroness | John Baizley / Peter Adams | Yellow & Green (2012) | SHIPPED as baizley-take-my-bones-away-riff (2026-06-25). Lead single / first mainstream-rock chart hit. Produced by John Congleton (2nd album with him). CORRECTION: the Fender Deluxe Reverb is a LATER-era (2015+) Baroness amp — anachronistic; the 2012 platform is Bad Cat (Baizley) + Matamp "Green" (Adams) run CLEAN with pedal-driven dirt (Pro Co RAT ✓ + modded Big Muff + Crowther Hot Cake). Deliberate Gibson→Fender single-coil switch (Tele/Jazzmaster). Tuning UNCERTAIN — B-minor tonality; crowd tabs read drop B but unverified. New artist: john-baizley. | done |
| 142 | Shock Me (riff) | Baroness | John Baizley / Pete Adams | Purple (2015) | needs-research — SKIPPED 2026-06-26. Purple-session guitar/amp/pedal gear is undocumented — only career/touring rig exists (the Bad Cat/Phase 90/RAT sketch is touring gear; the Fender-combos description belongs to the LATER Gold & Grey). Lineup correction: Baizley + Pete Adams (Gina Gleason joined 2017, AFTER Purple). Verified only: producer Dave Fridmann, Tarbox Road Studios, key Gm ~125 BPM. Needs a session-specific source. | needs-research |
| 143 | Mr. Highway's Thinking About the End (riff) | All Them Witches | Ben McLeod | Lightning at the Door (2013) | needs-research — SKIPPED 2026-06-26. WRONG SONG: 'Mr. Highway's Thinking About the End' is an A DAY TO REMEMBER track (Homesick, 2009), NOT an All Them Witches song and not on Lightning at the Door. Backlog data error — re-scope to a real ATW track before queueing. | needs-research |
| 144 | When God Comes Back (riff) | All Them Witches | Ben McLeod | Lightning at the Door (2013) | needs-research — SKIPPED 2026-06-26. BACKLOG ALBUM WRONG: 'When God Comes Back' is on Lightning at the Door (2013), NOT Dying Surfer Meets His Maker (2015). A dedicated Premier Guitar Riff Rundown exists but documents the riff, not the original 2013 rig; 2013-session gear is undocumented (all ATW rundowns are 2017+) and the tuning needs video confirmation. The sketch (Hiwatt/Orange, Big Muff/TimeLine) is wrong. Revisit if a 2013-session source surfaces. | needs-research |
| 145 | Hisingen Blues (riff) | Graveyard | Joakim Nilsson | Hisingen Blues (2011) | SHIPPED as nilsson-hisingen-blues-riff (2026-06-26). CORRECTIONS: recording guitar = Hagström Viking (his older Hagström was stolen), NOT a P-90 Gibson (that's his later ES-330/SG); amp = Laney GH100TI with preamp tubes swapped for LESS gain (his main Laney broke mid-session), NOT a Marshall Bluesbreaker; dirt = ProCo RAT only ('mostly we just play with the amps') — NO Maestro FZ-1/Big Muff. 100% analog to tape, Don Alsterberg / Don Pierre Studios, Gothenburg. Std E (tabbed). New artist: joakim-nilsson. | done |
| 146 | The Siren (riff) | Graveyard | Joakim Nilsson / Jonatan Ramm | Hisingen Blues (2011) | needs-research — SKIPPED 2026-06-26. BACKLOG ALBUM WRONG: 'The Siren' is on Hisingen Blues (2011), NOT the 2008 self-titled debut. Gear is career-general only, never track-specific; also a same-album duplicate of #145 (shipped this run) — hold to avoid two same-album Graveyard recipes. Drop the unverified Tube Screamer (documented boost is an MXR Micro Amp). Re-file and revisit. | needs-research |
| 147 | Lydia (riff) | Highly Suspect | Johnny Stevens | Mister Asylum (2015) | needs-research — DEFERRED 2026-06-26. GEAR is buildable: hard-verified 'Battlefat' yellow MIM Strat, band's Supro Thunderbolt + Fender Hot Rod Deluxe dual-amp (label as signature setup, not session-isolated), Boss BD-2; producer Joel Hamilton / Studio G Brooklyn; F# minor ~128 BPM. (Keeley D&M Drive in the sketch is anachronistic — 2017.) BLOCKER: Mister Asylum is NOT on iTunes in any storefront (US/GB/DE/CA/AU/FR/NL checked), so album_art_url can't be verified per our rule. Needs a verified album-art source, then ship. | needs-research |
| 148 | My Name Is Human (riff) | Highly Suspect | Johnny Stevens | The Boy Who Died Wolf (2016) | needs-research — SKIPPED 2026-06-26. All documented gear is the 2019 LIVE rig (Premier Guitar rundown); the 2016 studio guitar is unknown (the Venice Guitars customs didn't exist yet). Verified only: producer Joel Hamilton, 140 BPM / D minor. No session signal chain to build from. Revisit if studio gear surfaces. | needs-research |
| 149 | The Wolf Is Loose (riff) | Mastodon | Brent Hinds / Bill Kelliher | Blood Mountain (2006) | SHIPPED as kelliher-wolf-is-loose-riff (2026-06-26). CORRECTION: the Diezel VH4 is anachronistic (Hinds' ~2011-2014 rig) — REMOVED. Documented Blood Mountain amps are a Laney VH100R (hard-verified) + 2-ch Marshall JCM800, boosted by a Chandler Tube Driver; Kelliher Silverburst LP Custom (Seymour Duncan SH-6), Hinds Silverburst Flying V; D standard (D-G-C-F-A-D). Matt Bayles / Robert Lang + Studio Litho, Seattle. ~173 BPM. | done |
| 150 | Colony of Birchmen (riff) | Mastodon | Brent Hinds / Bill Kelliher | Blood Mountain (2006) | Hinds V / Kelliher LP → Marshall JMP / Diezel VH4 into Orange 4x12 | done |
| 151 | Oblivion (riff) | Mastodon | Brent Hinds / Bill Kelliher | Crack the Skye (2009) | SHIPPED as kelliher-oblivion-riff (2026-06-26). CORRECTION: NO Diezel in 2009 (that's the later touring rig). Per the 2009 Premier Guitar interview the amps are vintage Marshall JCM800/JMP + Fender Twin Reverb (cleans); Kelliher's 1960B 4x12 with 20W Greenbacks; SH-6 Silverburst LP Custom, Hinds Silverburst V. Brendan O'Brien / Southern Tracks, Atlanta, tracked live. Tuning standard-to-drop-D (exact 'Oblivion' tuning not primary-confirmed). | done |
| 152 | My Own Prison (riff) | Creed | Mark Tremonti | My Own Prison (1997) | SHIPPED as tremonti-my-own-prison-riff (2026-06-26). CORRECTION: guitar = 1986 red Gibson Les Paul + stock Kahler (the 'My Own Prison' guitar, stolen '97 / recovered 2024), NOT a PRS (came 2001+). Drop D, ~140 BPM. Amp = Mesa Dual Rectifier (heavy) + Fender Twin (clean) — community-attributed, NOT session-confirmed (Tremonti: 'three different rigs,' never named). John Kurzweg, remixed by Ron Saint-Germain. New artist: mark-tremonti. | done |
| 153 | Higher (riff) | Creed | Mark Tremonti | Human Clay (1999) | SHIPPED as tremonti-higher-riff (2026-06-26). CORRECTIONS: tracked with Gibson Les Pauls (1986 red + goldtop), NOT PRS; amp = Tremonti's hedged recollection of a Hughes & Kettner Attax 100 (Rectifier use uncertain), NOT a confirmed Mesa; no TS808 documented. Cleans/modulation from a TC Electronic rack. Drop D droning open low D, ~156 BPM, D major. John Kurzweg, Tallahassee / SSL 9000 mix. | done |
| 154 | What If (riff) | Creed | Mark Tremonti | Human Clay (1999) | PRS → Mesa/Boogie Dual Rectifier, drop tuning, TS808 | done |
| 155 | Open Your Eyes (riff) | Alter Bridge | Mark Tremonti | One Day Remains (2004) | needs-research — SKIPPED 2026-06-26. The 2004 studio amp chain is poorly documented; the widely-cited Triple Rec / Cornford / Bogner Shiva rig is actually Tremonti's 2012 SOLO album All I Was (cross-contaminated by AI summarizers). Producer correction: Ben Grosse (NOT Baskette — he started with Blackbird 2007). Verified: PRS single-cut platform, D major ~162 BPM. Needs a 2004-session source. | needs-research |
| 156 | Metalingus (riff) | Alter Bridge | Mark Tremonti | One Day Remains (2004) | PRS Tremonti → Mesa Triple Rectifier / Bogner Überschall dual-amp, drop tuning | done |
| 157 | Blackbird (solo) | Alter Bridge | Mark Tremonti / Myles Kennedy | Blackbird (2007) | PRS Tremonti → Mesa Triple Rec + Bogner, TS808 + Mark Tremonti phaser | done |
| 158 | All My Life (riff) | Foo Fighters | Dave Grohl / Chris Shiflett | One by One (2002) | Trini Lopez Standard → Mesa Dual Rectifier / Vox AC30, drop-D drive | done |
| 159 | Times Like These (riff) | Foo Fighters | Dave Grohl / Chris Shiflett | One by One (2002) | SHIPPED as grohl-times-like-these-riff (2026-07-07). Released take VERIFIED: re-recorded May 2002 at Studio 606 (Alexandria basement) with Raskulinecz; Grohl rhythm (Trini Lopez), Shiflett lead. The riff sits in Grohl's documented AC30 clean/edge lane with Dual Recto crunch layered for full-band sections — Helix core is Essex A30 with a default-off Scream 808 chorus push. Intro alternates 8/4 and 7/4, D Mixolydian, 145 BPM, standard tuning. | done |
| 160 | The Sky Is a Neighborhood (riff) | Foo Fighters | Dave Grohl / Chris Shiflett / Pat Smear | Concrete and Gold (2017) | needs-research — SKIPPED 2026-07-22. The whole point of Concrete and Gold was that Greg Kurstin told the band to bring unfamiliar gear: 20+ amps rotated through EastWest, and NO reputable source pins a specific amp or guitar to THIS track. The only per-song-confirmed piece is a JHS Muffuletta fuzz (Shiflett). The sketch (Trini Lopez/ES-335 → Friedman BE-100 + Vox AC30 + Strymon TimeLine) is Grohl's live/touring rig, not the 2017 session — the documented "main" new amp was a Vox AC15 HW and the album's time-based fx were an EastWest echo chamber + Roland RE-201, not a Strymon. Fails the quality gate; revisit only if a per-song rig source surfaces. | needs-research |
| 161 | Devour (riff) | Shinedown | Zach Myers | The Sound of Madness (2008) | needs-research — SKIPPED 2026-07-22. Per the album credits most guitars were tracked by session players (Dave Bassett contributing most rhythm, Tim Pierce additional rhythm, Nick Perri lead) — no source ties a player or rig to THIS song. The sketch is Zach Myers's later touring rig and is anachronistic: the SE Zach Myers signature (2011) and his Axe-Fx (2013) didn't exist in 2008; any Diezel Myers used on the record was a VH4, not the Herbert. Only production (Rob Cavallo / CLA mix / Sterling master) is documented. Fails the quality gate; revisit only if session-specific gear surfaces. | needs-research |
| 162 | Monkey Wrench (riff) | Foo Fighters | Dave Grohl / Pat Smear | The Colour and the Shape (1997) | Gibson Trini Lopez Standard → Mesa/Boogie Dual Rectifier + Vox AC30 | done |
| 163 | - Fu Manchu: Scott Hill uses a Univox Super-Fuzz into a Marshall JCM800, Bob Balch a Marshall Super Bass/DSL100H with Creepy Fingers fuzz — documented, but I didn't have a clean song-to-album gear pin, so I left them out rather than guess. Easy add if you want: "Hung Up in Heaven | Fu Manchu | Scott Hill / Bob Balch | California Crossing (2001) | Ampeg Dan Armstrong → Marshall JCM800, Univox Super-Fuzz." | queued |
| 164 | Mr. Scary (instrumental) | Dokken | George Lynch | Back for the Attack (1987) | Lynch's ESP Kamikaze → modded Marshall, no-name 'Mr Scary' amp | done |
| 165 | Power-Up (verse) | Judas Priest | Glenn Tipton / K.K. Downing | Stained Class (1978) | SKIPPED 2026-07-29 — the song does not exist. Stained Class has no track called "Power-Up" (tracklist: Exciter / White Heat, Red Hot / Better by You, Better Than Me / Stained Class / Invader / Saints in Hell / Savage / Beyond the Realms of Death / Heroes End). The gear sketch (Tipton SG / Downing Flying V → non-master-volume Marshall stacks, Cornish board) is fine and reusable — re-queue against a REAL Stained Class track (Invader, Saints in Hell and Savage are all unbuilt; Exciter and Beyond the Realms of Death already shipped). | needs-research |
| 166 | Beyond the Realms of Death (clean intro/solo) | Judas Priest | Glenn Tipton | Stained Class (1978) | Gibson SG → Marshall Super Lead, clean-to-lead dynamics, Cry Baby | done |
| 167 | Victim of Changes (main riff) | Judas Priest | K.K. Downing / Glenn Tipton | Sad Wings of Destiny (1976) | SHIPPED as downing-victim-of-changes-riff (2026-07-22). Downing red Flying V + Tipton SG Special (PAF humbuckers) → cranked NON-master Marshall Super Lead 50/100W (EL34 power-tube dirt) with a Dallas Rangemaster treble booster on the front; MXR Phase 100 sparingly. Standard E, E minor, ~148 BPM (74 half-time doom intro/outro). STUDIO CORRECTION: Rockfield (Wales) + Morgan (London), NOT Island. Amp model/serial, mics, reverb are era-accurate reconstruction (undocumented). | done |
| 168 | Exciter (intro) | Judas Priest | Glenn Tipton | Stained Class (1978) | SHIPPED as tipton-exciter-riff (2026-07-22). Tipton Gibson SG + Downing Flying V → cranked NON-master Marshall Super Lead 50/100W with a Dallas/Arbiter Rangemaster treble booster (confirmed). Standard E, A minor, tracked ~130 BPM felt in double-time (~260) — early speed-metal blueprint; fast double-picked attack is the angle. STUDIO CORRECTION: Chipping Norton (Oxfordshire) tracking, mixed at Trident, prod. Dennis MacKay — NOT Utopia (that was only the Spooky Tooth cover). NOT the anachronistic JCM800. String gauge/mics undocumented. | done |
| 169 | Hell Bent for Leather (riff) | Judas Priest | K.K. Downing | Killing Machine/Hell Bent for Leather (1978) | Gibson Flying V → Marshall Super Lead, Cry Baby wah, Echoplex EP3 | done |
| 170 | Wrathchild (riff) | Iron Maiden | Steve Harris-era twin guitars (Murray) | Killers (1981) | Dave Murray '57/'63 Strat (DiMarzio Super Distortion) → 50W Marshall Super Lead, MXR Distortion+ | done |
| 171 | Phantom of the Opera (gallop) | Iron Maiden | Dave Murray | Iron Maiden (1980) | SHIPPED as murray-phantom-of-the-opera-riff (2026-07-22). Murray black "Kossoff" Strat (1963 body / 1957 neck), DiMarzio Super Distortion bridge + PAF neck → cranked NON-master 50W Marshall Super Lead; Cry Baby + Phase 90 as textures. CORRECTIONS: the "'57 Strat" and "black Strat" are the SAME guitar; MXR Distortion+ is best-documented from Number of the Beast (1982), so it's OFF here — the debut's dirt is the Super Distortion pickup into the Plexi. Only Maiden album with Dennis Stratton (LP, harmony); Adrian Smith not yet in the band. Raw/dry Kingsway production (Wil Malone disengaged, band self-produced). Std E, E minor, ~109 BPM. | done |
| 172 | 22 Acacia Avenue (twin lead) | Iron Maiden | Adrian Smith / Dave Murray | The Number of the Beast (1982) | SHIPPED as murray-22-acacia-avenue-riff (2026-07-22). Murray "Kossoff" Strat (Super Distortion bridge) plays solo 1; Smith Ibanez Destroyer DT-300 plays solo 2 — in 1982 with STOCK Ibanez humbuckers (its DiMarzio Super Distortions were a LATER mod, not '82). Both → cranked 50W Marshall Super Lead. Murray's chain = Cry Baby + MXR Distortion+ (enters ON at NOTB — the element that tightens the Plexi vs the raw debut) + Phase 90. Battery Studios, Martin Birch — tight, dry, hard-panned double-tracking. Std E, ~112-113 BPM. Cabs/mics/reverb are Birch-style reconstruction. | done |
| 173 | The Evil That Men Do (solo) | Iron Maiden | Adrian Smith / Dave Murray | Seventh Son of a Seventh Son (1988) | SHIPPED as smith-evil-that-men-do-solo. Smith plays this solo (Murray takes Prowler '88). Rig confirmed: Jackson custom superstrat w/ DiMarzio Super Distortion → Gallien-Krueger 250ML solid-state combo, overdrive channel + onboard echo. Recorded Feb–Mar 1988 at Musicland Studios, Munich; Martin Birch producing/engineering. "Strats" in the old sketch is wrong for Smith — he was on the Jackson by then. | done |
| 174 | Wasted Years (riff) | Iron Maiden | Adrian Smith | Somewhere in Time (1986) | SHIPPED as smith-wasted-years-riff (2026-07-22, new artist adrian-smith). Pulled forward ahead of #173 for tonal variety in an otherwise cranked-Marshall batch. Smith single-humbucker Charvel/Jackson San Dimas (DiMarzio Super Distortion bridge, Floyd Rose) → Gallien-Krueger 250-series SOLID-STATE combo — the one era Maiden set aside the Marshalls; bright/compressed/glassy. Boss CH-1 chorus = the chiming intro; GK onboard OD channel for the heavier sections. CONFIRMED: NO guitar synth on the track (a Roland synth only sparked the writing). Wisseloord (guitars)/Compass Point/Electric Lady mix, Martin Birch. Std E, E minor, ~154 BPM. GK model suffix (250ML vs 250RL) debated — same lineage. | done |
| 175 | Tears of the Dragon (intro) | Iron Maiden (Bruce Dickinson solo) | Roy Z (NOT Adrian Smith) | Balls to Picasso (1994) | SKIPPED 2026-07-29 — ATTRIBUTION WAS WRONG. Balls to Picasso is the Roy Z / Tribe of Gypsies album; Adrian Smith was not involved (he joins Dickinson on Accident of Birth, 1997, and The Chemical Wedding, 1998). Recorded at Metropolis/Townhouse 3/Westside, London; produced by "Shay Baby." Roy Z's specific 1994 guitar/amp/pedals for this track are not documented in any primary source. Needs a Roy Z rig interview covering the Balls to Picasso sessions. | needs-research |
| 176 | Sea of Madness | Iron Maiden | Dave Murray / Adrian Smith | Somewhere in Time (1986) | SHIPPED as smith-sea-of-madness-riff. Written by Adrian Smith. Jackson custom superstrat / Charvel San Dimas w/ DiMarzio Super Distortion → Gallien-Krueger 250ML (overdrive + onboard chorus/echo), Boss CE-3 chorus. Rhythm section cut at Compass Point (Nassau), guitars at Wisseloord (Netherlands); Martin Birch producing. Sibling of #174 smith-wasted-years-riff (same rig, driven instead of clean). | done |
| 177 | Sign of the Cross (intro) | Iron Maiden | Janick Gers / Dave Murray | The X Factor (1995) | SKIPPED 2026-07-29 — no per-session rig documentation exists for The X Factor. Recorded 1994–95 at Barnyard Studios, Essex; produced by Steve Harris, engineered by Nigel Green — but no source names the amps, guitars or pedals Gers and Murray used on these sessions. The generic "Strat → Marshall" sketch is an assumption, not a documented rig. Needs an X Factor-era rig rundown or interview. | needs-research |
| 178 | Stargazer (main riff/solo) | Rainbow | Ritchie Blackmore | Rising (1976) | SHIPPED as blackmore-stargazer-solo. CORRECTION: there is NO Hornby-Skewes on this record — Blackmore replaced it with the AIWA TP-1011 tape deck in November 1973 and kept the AIWA until 1992. Confirmed rig: 1974 Olympic-white Strat, scalloped ROSEWOOD board, overwound staggered singles (~6.6k), Schaller tuners → AIWA TP-1011 (preamp boost + third-head echo) → modified 200W Marshall Major. Recorded Feb 1976, Musicland Studios Munich, Martin Birch; 28-piece Munich Philharmonic on the finale. Two chords: Am and G. | done |
| 179 | Kill the King (riff) | Rainbow | Ritchie Blackmore | Long Live Rock 'n' Roll (1978) | SHIPPED as blackmore-kill-the-king-riff. 1974 SUNBURST Strat (scalloped rosewood, fat neck profile, overwound staggered singles ~6.6k) — Blackmore's favourite of this period → AIWA TP-1011 boost/echo → Marshall Major with tech-modified preamp; Schulte "Compact Phasing A" 8-stage phaser sat on the AIWA in this era (track use undocumented, shipped default-OFF). Recorded 1977 at Le Château d'Hérouville (Strawberry Studios), France; Martin Birch. | done |
| 180 | Gates of Babylon (solo) | Rainbow | Ritchie Blackmore | Long Live Rock 'n' Roll (1978) | Fender Strat → Marshall Major, AIWA tape echo, Middle-Eastern phrasing. (Note 2026-07-29: DEFERRED one run for tonal variety — #178 and #179 both shipped this run and #180 is the same album and the same rig as #179, so writing it in the same batch would have produced near-identical block notes. Gear is documented and ready; promote it next run. Use the #179 entry's corrected rig details.) | done |
| 181 | Stand Up and Shout (riff) | Dio | Vivian Campbell | Holy Diver (1983) | SHIPPED as campbell-stand-up-and-shout-riff. Les Paul Deluxe refinished matte black w/ DiMarzio X2N → Boss SD-1 (or GE-7) as a level boost → stock rented Marshall JCM800 2203, cranked. Sound City Studios, Van Nuys, early 1983; produced by Ronnie James Dio. Rig is documented at ALBUM level, not per track — sibling of campbell-holy-diver-les-paul-marshall, set drier/tighter for the opener's rhythm attack. | done |
| 182 | Don't Talk to Strangers (clean intro/solo) | Dio | Vivian Campbell | Holy Diver (1983) | Les Paul Deluxe (X2N) → JCM800, Boss OD for solo mid-boost, clean neck pickup intro | done |
| 183 | We Rock (riff) | Dio | Vivian Campbell | The Last in Line (1984) | Les Paul / Charvel → Marshall JCM800 + 4x12s, Boss overdrive (Note 2026-08-05: DEFERRED one run for tonal variety — #182 ships the same artist and the same rig from this cluster, so writing these in one batch would produce near-identical block notes. Gear sketch is unchanged and ready; promote on a later run.) | done |
| 184 | The Last in Line (solo) | Dio | Vivian Campbell | The Last in Line (1984) | Charvel super-strat (Floyd Rose) → JCM800, Boss OD boost (Note 2026-08-05: DEFERRED one run for tonal variety — #182 ships the same artist and the same rig from this cluster, so writing these in one batch would produce near-identical block notes. Gear sketch is unchanged and ready; promote on a later run.) | queued |
| 185 | Neon Knights (riff) | Black Sabbath | Tony Iommi | Heaven and Hell (1980) | Gibson SG (Iommi) → Laney Klipp / Marshall, Tycobrahe/Dallas Rangemaster-style treble boost | done |
| 186 | Children of the Sea (solo) | Black Sabbath | Tony Iommi | Heaven and Hell (1980) | GEAR SKETCH CORRECTED 2026-08-05 (was "Laney stack, treble booster"): Heaven and Hell was NOT the Laney/treble-booster rig. Iommi tracked it on 'Monkey' (left-handed cherry SG, John Birch neck pickup, Birch-rehoused Gibson P-90 in the bridge) plus 'Old Boy' (John Diggins, 1975) for overdubs, into a Marshall 1959 Super Lead rebuilt by John 'Dawk' Stillwell with an extra gain stage and master volume — Iommi: "He'd done away with the treble booster I had forever." Only effects on the album: chorus, delay, wah. Recorded Jan 1980, Studio Ferber, Paris; Martin Birch producing. Use these details, not the old sketch (Note 2026-08-05: DEFERRED one run for tonal variety — #185 ships the same artist and the same rig from this cluster, so writing these in one batch would produce near-identical block notes. Gear sketch is unchanged and ready; promote on a later run.) | done |
| 187 | The Mob Rules (riff) | Black Sabbath | Tony Iommi | Mob Rules (1981) | Gibson SG Special → Laney Klipp, treble boost, light-gauge strings (Note 2026-08-05: DEFERRED one run for tonal variety — #185 ships the same artist and the same rig from this cluster, so writing these in one batch would produce near-identical block notes. Gear sketch is unchanged and ready; promote on a later run.) | queued |
| 188 | Mr. Crowley (solo) | Ozzy Osbourne | Randy Rhoads | Blizzard of Ozz (1980) | Cream 1974 Gibson Les Paul Custom → white Marshall 1959 stacks, MXR Distortion+, MXR 10-band EQ, MXR stereo chorus | done |
| 189 | Diary of a Madman (clean/heavy) | Ozzy Osbourne | Randy Rhoads | Diary of a Madman (1981) | Karl Sandoval polka-dot Flying V & Les Paul Custom → white Marshall stacks, MXR Distortion+, 10-band EQ, MXR analog delay (Note 2026-08-05: DEFERRED one run for tonal variety — #188 ships the same artist and the same rig from this cluster, so writing these in one batch would produce near-identical block notes. Gear sketch is unchanged and ready; promote on a later run.) | done |
| 190 | Flying High Again (solo) | Ozzy Osbourne | Randy Rhoads | Diary of a Madman (1981) | Jackson Concorde/Les Paul Custom → Marshall Super Lead, MXR Distortion+ and chorus (Note 2026-08-05: DEFERRED one run for tonal variety — #188 ships the same artist and the same rig from this cluster, so writing these in one batch would produce near-identical block notes. Gear sketch is unchanged and ready; promote on a later run.) | queued |
| 191 | Bark at the Moon (riff) | Ozzy Osbourne | Jake E. Lee | Bark at the Moon (1983) | Charvel super-strat → Marshall, MXR Distortion+, fast legato leads | done |
| 192 | Killer of Giants (clean/solo) | Ozzy Osbourne | Jake E. Lee | The Ultimate Sin (1986) | Charvel → Marshall stack, clean arpeggio into gain, chorus/delay | done |
| 193 | Miracle Man (riff) | Ozzy Osbourne | Zakk Wylde | No Rest for the Wicked (1988) | Bullseye Gibson Les Paul Custom → Marshall JCM800, MXR Rotovibe, pinch-harmonic squeals | done |
| 194 | Fast as a Shark (riff) | Accept | Wolf Hoffmann | Restless and Wild (1982) | Fender Stratocaster (studio) → Marshall stack, MXR Distortion+, bright single-coil attack | queued |
| 195 | Restless and Wild (solo) | Accept | Wolf Hoffmann | Restless and Wild (1982) | Stratocaster → Marshall Super Lead, MXR Distortion+ boost | queued |
| 196 | Balls to the Wall (riff) | Accept | Wolf Hoffmann | Balls to the Wall (1983) | Fender Strat → Marshall stack, MXR Distortion+, mid-heavy grind | queued |
| 197 | Am I Evil? (riff/solo) | Diamond Head | Brian Tatler | Lightning to the Nations (1980) | White Gibson Flying V → Marshall Master Volume JMP, Morley Power Wah Boost | queued |
| 198 | The Lightning to the Nations (riff) | Diamond Head | Brian Tatler | Lightning to the Nations (1980) | Gibson Flying V → Marshall JMP, Morley Power Wah Boost | queued |
| 199 | Wheels of Steel (riff) | Saxon | Graham Oliver / Paul Quinn | Wheels of Steel (1980) | Gibson Les Paul / SG → Marshall 100W stacks, Cry Baby, twin-guitar harmony leads | queued |
| 200 | 747 (Strangers in the Night) (solo) | Saxon | Paul Quinn / Graham Oliver | Wheels of Steel (1980) | Les Paul → Marshall Super Lead, treble-boosted lead tone | queued |
| 201 | I Will Survive (intro/solo) | Mercyful Fate | Hank Shermann / Michael Denner | Don't Break the Oath (1984) | Gibson guitars → Marshall, caustic mid-forward tone, twin harmony leads | queued |
| 202 | A Dangerous Meeting (riff) | Mercyful Fate | Hank Shermann / Michael Denner | Don't Break the Oath (1984) | Gibson Flying V/Les Paul → Marshall stacks, Boss overdrive, harmonized leads | queued |
| 203 | Tooth and Nail (riff) | Dokken | George Lynch | Tooth and Nail (1984) | Modified Charvel super-strat (Floyd Rose) → modded Marshall JMP with extra gain stages + Randall RG100ES | queued |
| 204 | Into the Fire (solo) | Dokken | George Lynch | Tooth and Nail (1984) | Charvel → modded Marshall JMP, Randall RG100ES, soaring legato leads | queued |
| 205 | Future Shock (riff) | Dokken | George Lynch | Under Lock and Key (1985) | Charvel/early ESP "Tiger" → modded Marshall JMP, Soldano-style high gain | queued |
| 206 | Ace of Spades (riff) | Motörhead | "Fast" Eddie Clarke | Ace of Spades (1980) | 1972 Gibson Les Paul Deluxe (DiMarzio) → Marshall Lead 100 stacks, Boss OD-1 | queued |
| 207 | Overkill (riff) | Motörhead | "Fast" Eddie Clarke | Overkill (1979) | Gibson Les Paul Deluxe → Marshall 100W, Boss OD-1, raw double-kick-driven grind | queued |
| 208 | Speak of the Devil (solo) | Queensrÿche | Chris DeGarmo / Michael Wilton | Operation: Mindcrime (1988) | ESP guitars → shared Marshall JCM800 100W into 4x12 V30s; DeGarmo added Soldano preamp | queued |
| 209 | Eyes of a Stranger (solo) | Queensrÿche | Michael Wilton / Chris DeGarmo | Operation: Mindcrime (1988) | ESP → Marshall JCM800; Roland JC-120 for clean lead, rack chorus/delay | queued |
| 210 | I Don't Believe in Love (solo) | Queensrÿche | Chris DeGarmo | Operation: Mindcrime (1988) | ESP → JCM800 + Soldano preamp, BBE Sonic Maximizer, TC chorus | queued |
| 211 | A Tale That Wasn't Right (clean/solo) | Helloween | Kai Hansen / Michael Weikath | Keeper of the Seven Keys Part I (1987) | Hansen Rockinger RR-style / Weikath ESP → modded Marshall 1987, clean-to-gain dynamics | queued |
| 212 | I'm Alive (riff) | Helloween | Kai Hansen / Michael Weikath | Keeper of the Seven Keys Part I (1987) | Rockinger/ESP V-style → modded Marshall 1987 (boosted master/gain), harmonized leads | queued |
| 213 | Eagle Fly Free (solo) | Helloween | Michael Weikath / Kai Hansen | Keeper of the Seven Keys Part II (1988) | ESP guitars → ENGL amps (from Keeper II sessions), fast melodic twin leads | queued |
| 214 | Pull Me Under (riff) | Dream Theater | John Petrucci | Images and Words (1992) | Petrucci's Music Man → Mesa/Boogie Mark series, tight high-gain | queued |
| 215 | Links: [{"title":"John Petrucci | Dream Theater Wiki | Fandom","url":"https://dreamtheater.fandom.com/wiki/John_Petrucci"},{"title":"John Petrucci - Wikipedia","url":"https://en.wikipedia.org/wiki/John_Petrucci"},{"title":"Rig Rundown: Dream Theater’s John Petrucci and John Myung [2019]","url":"https://www.premierguitar.com/gear/rig-rundown-dream-theaters-john-petrucci-and-john-myung-2019"},{"title":"Guitar's News World: John Petrucci Dream Theater","url":"http://guitarworldblog.blogspot.com/2007/12/john-petrucci-dream-theater.html"},{"title":"John Petrucci's Guitar Gear, Pedalboard & Amps | Equipboard","url":"https://equipboard.com/pros/john-petrucci"},{"title":"John Petrucci Guitars and Gear 2026: Complete Setup Guide","url":"https://powersof10.com/john-petrucci-guitars-and-gear/"},{"title":"John Petrucci Amp Settings & Guitar Rig - A Closer Look!","url":"https://musicstrive.com/john-petrucci-amp-settings/"},{"title":"Dream Theater - John Petrucci's Guitar Gear Rig and Equipment","url":"https://www.uberproaudio.com/who-plays-what/190-dream-theater-john-petruccis-guitar-gear-rig-and-equipment"},{"title":"Rig tour: Dream Theater's John Petrucci | MusicRadar","url":"https://www.musicradar.com/news/rig-tour-dream-theater"},{"title":"Sound Like John Petrucci: Amp Settings and Gear Guide","url":"https://killerrig.com/sound-like-john-petrucci-amp-settings-and-gear/"}] | queued |
| 216 | Roundabout (intro/solo) | Yes | Steve Howe | Fragile (1971) | Gibson ES-5 Switchmaster → Fender Dual Showman, bright hollowbody bite, harmonics intro | queued |
| 217 | Yours Is No Disgrace (riff) | Yes | Steve Howe | The Yes Album (1971) | Gibson ES-175 → Fender Dual Showman, biting jangle, no pedals | queued |
| 218 | Siberian Khatru (head) | Yes | Steve Howe | Close to the Edge (1972) | Gibson ES-345 stereo → two Dual Showmans, dual-amp stereo delay | queued |
| 219 | Firth of Fifth (solo) | Genesis | Steve Hackett | Selling England by the Pound (1973) | 1957 Gibson Les Paul Goldtop → Hiwatt, fuzz-sustained legato lead | queued |
| 220 | Dancing with the Moonlit Knight (tapping) | Genesis | Steve Hackett | Selling England by the Pound (1973) | Les Paul Goldtop → Hiwatt, Shaftesbury Duo-Tone fuzz, early tapping | queued |
| 221 | The Musical Box (climax) | Genesis | Steve Hackett | Nursery Cryme (1971) | Les Paul → Hiwatt, Schaller/Tonebender fuzz swell | queued |
| 222 | Red (main riff) | King Crimson | Robert Fripp | Red (1974) | Gibson Les Paul Custom Black Beauty → Hiwatt DR103, raw blended-channel grind | queued |
| 223 | Larks' Tongues in Aspic Pt. II (riff) | King Crimson | Robert Fripp | Larks' Tongues in Aspic (1973) | Les Paul Custom → Hiwatt DR103, Guild Foxey Lady fuzz, jagged sustain | queued |
| 224 | La Villa Strangiato (solo) | Rush | Alex Lifeson | Hemispheres (1978) | Gibson ES-355 → Hiwatt heads + Marshall, fluid singing lead | queued |
| 225 | Xanadu (intro/solo) | Rush | Alex Lifeson | A Farewell to Kings (1977) | Gibson EDS-1275 doubleneck → Roland JC-120 (rhythm) + 100W Hiwatt (solo) | queued |
| 226 | The Spirit of Radio (intro) | Rush | Alex Lifeson | Permanent Waves (1980) | Gibson ES-355 → Marshall/Hiwatt, Electro-Harmonix Electric Mistress flanged arpeggios | queued |
| 227 | Limelight (solo) | Rush | Alex Lifeson | Moving Pictures (1981) | modified Stratocaster → Marshall + ambient room amps, long-delay fluid bends | queued |
| 228 | Dogs (solo) | Pink Floyd | David Gilmour | Animals (1977) | Black Strat (DiMarzio FS-1 bridge) → Hiwatt DR103, ram's-head Big Muff, Yamaha rotary | queued |
| 229 | Sheep (riff/solo) | Pink Floyd | David Gilmour | Animals (1977) | Fender Telecaster/Black Strat → Hiwatt DR103, ram's-head Big Muff aggression | queued |
| 230 | Aqualung (solo) | Jethro Tull | Martin Barre | Aqualung (1971) | 1958 Les Paul Junior → 100W Hiwatt + treble booster, straight-in grind | queued |
| 231 | Locomotive Breath (solo) | Jethro Tull | Martin Barre | Aqualung (1971) | Les Paul Junior → Hiwatt, treble-boosted lead, Leslie West-inspired bite | queued |
| 232 | Lady Fantasy (solo) | Camel | Andrew Latimer | Mirage (1974) | Gibson Les Paul → Marshall, vocal sustained lead, less overdriven | queued |
| 233 | Rhayader (theme) | Camel | Andrew Latimer | The Snow Goose (1975) | Les Paul → Marshall, melodic clean-to-mild-drive lead lines | queued |
| 234 | The Runaway (solo) | Gentle Giant | Gary Green | The Power and the Glory (1974) | Gibson Les Paul (PAF) → HH amp + EV folded horn, MXR Micro Amp boost | queued |
| 235 | Proclamation (riff) | Gentle Giant | Gary Green | The Power and the Glory (1974) | Les Paul → HH amp, Electric Mistress flanger, angular riffing | queued |
| 236 | The King Will Come (twin lead) | Wishbone Ash | Andy Powell / Ted Turner | Argus (1972) | Gibson Flying V → Marshall, harmonized twin-guitar leads | queued |
| 237 | Warrior (twin harmony) | Wishbone Ash | Andy Powell / Ted Turner | Argus (1972) | Flying V → Marshall, dual-guitar melodic harmony | queued |
| 238 | Metropolis Pt. 1 (unison) | Dream Theater | John Petrucci | Images and Words (1992) | Ernie Ball Music Man → Mesa/Boogie Mark series, tight unison shred | queued |
| 239 | 6:00 (riff) | Dream Theater | John Petrucci | Awake (1994) | Ibanez JPM → Mesa Mark IIC+ blended with Dual Rectifier, quad-tracked rhythm | queued |
| 240 | The Dance of Eternity (solo) | Dream Theater | John Petrucci | Metropolis Pt. 2: Scenes from a Memory (1999) | Music Man JP → Mesa Mark IIC+, articulate high-gain runs | queued |
| 241 | Of the Father and the Son (riff) | Symphony X | Michael Romeo | The Divine Wings of Tragedy (1997) | Caparison → ENGL Powerball, Ibanez TS808 boost, tight neoclassical gain | queued |
| 242 | Set the World on Fire (solo) | Symphony X | Michael Romeo | The Divine Wings of Tragedy (1997) | Caparison Dellinger → ENGL, TS808-driven, fast harmonic-minor leads | queued |
| 243 | The Drapery Falls (solo) | Opeth | Mikael Åkerfeldt | Blackwater Park (2001) | PRS CE24 → ENGL Savage (studio), thick mid-gain, jazz-chord cleans | queued |
| 244 | Bleak (riff) | Opeth | Mikael Åkerfeldt | Blackwater Park (2001) | PRS CE24 / Les Paul Custom → ENGL, Peavey 5150, layered death-prog rhythm | queued |
| 245 | Forty Six & 2 (riff) | Tool | Adam Jones | Ænima (1996) | 1979 Gibson Les Paul Custom Silverburst → hot-rodded Marshall Super Bass + Mesa 2x15, MXR Micro Amp boost | queued |
| 246 | The Grudge (riff) | Tool | Adam Jones | Lateralus (2001) | Les Paul Custom Silverburst → Marshall Super Bass + Mesa cabs, MXR Micro Amp, churning gain | queued |
| 247 | Sleep Together (riff) | Porcupine Tree | Steven Wilson | Fear of a Blank Planet (2007) | PRS Singlecut → Bad Cat Hot Cat + Diezel head, dark dual-channel grind | queued |
| 248 | Anesthetize (solo) | Porcupine Tree | Steven Wilson | Fear of a Blank Planet (2007) | PRS Custom 22 → Bad Cat, soaring sustained lead over odd-meter bed | queued |
| 249 | Selkies: The Endless Obsession (solo) | Between the Buried and Me | Paul Waggoner | Alaska (2005) | PRS Custom 24 → Mesa/Boogie, fluid sweep-and-legato leads | queued |
| 250 | White Walls (solo) | Between the Buried and Me | Paul Waggoner | Colors (2007) | PRS Custom 24 → Mesa/Boogie 2:90 power amp + Port City 2x12, melodic outro lead | queued |
| 251 | Kingdom of Loss (lead) | Allan Holdsworth | Allan Holdsworth | Hard Hat Area (1993) | Carvin Holdsworth signature → Hughes & Kettner, legato sheets-of-sound | queued |
| 252 | Devil Take the Hindmost (head) | Allan Holdsworth | Allan Holdsworth | Secrets (1989) | Carvin headless → Hughes & Kettner, ultra-smooth distorted legato | queued |
| 253 | The Death of Music (riff) | Devin Townsend | Devin Townsend | Ocean Machine: Biomech (1997) | guitar → Peavey 5150, dense wall-of-sound high-gain | queued |
| 254 | CAFO (riff) | Animals as Leaders | Tosin Abasi | Animals as Leaders (2009) | Ibanez 8-string → Fractal Axe-Fx, tight extended-range djent attack | queued |
| 255 | The Sleepless (intro) | Marillion | Steve Rothery | Clutching at Straws (1987) | Squier Strat (EMG SA) → Roland JC-120, Analogman-modded Boss DS-1 solo | queued |
| 256 | Pigs (Three Different Ones) (solo) | Pink Floyd | David Gilmour | Animals (1977) | Black Strat → Hiwatt DR103, Big Muff + talk-box, snarling lead | queued |
| 257 | Links: [{"title":"Luther Perkins rig? - Gearspace","url":"https://gearspace.com/board/so-many-guitars-so-little-time/185852-luther-perkins-rig.html"},{"title":"Luther Perkins, Tennessee Three Guitarist Gear | Equipboard","url":"https://equipboard.com/pros/luther-perkins"},{"title":"How to Get an Authentic Johnny Cash/Luther Perkins Esquire Tone","url":"https://www.premierguitar.com/gear/how-to-get-an-authentic-johnny-cash-luther-perkins-esquire-tone"},{"title":"Small amp for Luther Perkins SUN Records tone. | Telecaster Guitar Forum","url":"https://www.tdpri.com/threads/small-amp-for-luther-perkins-sun-records-tone.500199/"},{"title":"Silvertone 1300 Amplifier Poster | Zazzle","url":"https://www.zazzle.com/silvertone_1300_amplifier_poster-228897148102430550"},{"title":"Johnny Cash Guitarist Luther Perkins' '53 Esquire Guitar - Premier Guitar","url":"https://www.premierguitar.com/videos/luther-perkins-johnny-cash-guitars"},{"title":"Vintage 1947 Silvertone 1300 Guitar Amplifier Luther Perkins,Johnny Cash Band | eBay","url":"https://www.ebay.com/itm/176359857226"},{"title":"Vintage 1947 Silvertone 1300 Guitar Amplifier Luther ...","url":"https://picclick.com/Vintage-1947-Silvertone-1300-Guitar-Amplifier-Luther-PerkinsJohnny-174859478318.html"},{"title":"The Folsom Prison Gang","url":"https://thefolsomprisongang.tumblr.com/"}] | queued |
| 258 | Say It Ain't So (clean→crunch) | Weezer | Rivers Cuomo | Weezer (Blue Album) (1994) | Cuomo's Strat → Mesa/Marshall, clean verse to crunchy chorus | queued |
| 259 | Boygenius (clean→bright lead) | boygenius | Phoebe Bridgers | the record (2023) | Bridgers' Danelectro 59 → Fender Deluxe Reverb, light reverb + delay, jangly cleans | queued |
| 260 | Motion Sickness (clean lead) | Phoebe Bridgers | Phoebe Bridgers | Stranger in the Alps (2017) | Danelectro 59 → Fender Deluxe Reverb, spring reverb, soft chorus on chime parts | queued |
| 261 | Vertigo (riff) | U2 | The Edge | How to Dismantle an Atomic Bomb (2004) | Edge's Gibson Explorer → Vox AC30, garage crunch, minimal delay | queued |
| 262 | With or Without You (arpeggio swell) | U2 | The Edge | The Joshua Tree (1987) | Edge's Infinite Guitar/Strat → Vox AC30, volume swells with EBow-like sustain, long delay | queued |
| 263 | Pride (In the Name of Love) (chime) | U2 | The Edge | The Unforgettable Fire (1984) | Edge's Stratocaster → Vox AC30, dotted-eighth Memory Man delay, bright chime | queued |
| 264 | Bullet the Blue Sky (slide) | U2 | The Edge | The Joshua Tree (1987) | Edge's Strat with slide → Vox AC30, heavy distortion, aggressive whammy/slide | queued |
| 265 | When You Were Young (anthem lead) | The Killers | Dave Keuning | Sam's Town (2006) | Keuning's Fender Strat → Fender amp, big delay-soaked lead, bright overdrive | queued |
| 266 | Read My Mind (chime) | The Killers | Dave Keuning | Sam's Town (2006) | Keuning's Strat → Fender, dotted-eighth delay, clean shimmering arpeggios | queued |
| 267 | Yellow (verse→chorus) | Coldplay | Jonny Buckland | Parachutes (2000) | Buckland's Fender Telecaster → Vox AC30, light overdrive, warm jangly cleans | queued |
| 268 | Clocks (riff) | Coldplay | Jonny Buckland | A Rush of Blood to the Head (2002) | Buckland's Strat → Vox AC30, clean delay color over the piano riff | queued |
| 269 | In My Place (lead) | Coldplay | Jonny Buckland | A Rush of Blood to the Head (2002) | Buckland's Telecaster → Vox AC30, ringing lead, slap-back delay | queued |
| 270 | Buddy Holly (crunch riff) | Weezer | Rivers Cuomo | Weezer (Blue Album) (1994) | Cuomo's Strat → Mesa/Boogie + Marshall, thick crunch chords, tight palm-mutes | queued |
| 271 | Hash Pipe (fuzz riff) | Weezer | Rivers Cuomo | Weezer (Green Album) (2001) | Cuomo's Warmoth/Strat-style → Mesa/Boogie Dual Rectifier, heavy saturated riff | queued |
| 272 | Beverly Hills (talkbox+crunch) | Weezer | Rivers Cuomo | Make Believe (2005) | Cuomo's Strat → Mesa/Boogie, crunchy power chords, talkbox solo | queued |
| 273 | Sex (clean→chorus) | The 1975 | Adam Hann | The 1975 (2013) | Hann's Fender Jaguar → Hiwatt Custom 50, Boss CE-1 chorus, bright chiming cleans | queued |
| 274 | Chocolate (clean riff) | The 1975 | Adam Hann | The 1975 (2013) | Hann's Jaguar → Hiwatt Custom 50, Strymon TimeLine delay, clean funky single-notes | queued |
| 275 | Robbers (swell lead) | The 1975 | Adam Hann | The 1975 (2013) | Hann's Jaguar → Hiwatt + Roland JC-120, BigSky reverb, soaring delayed lead | queued |
| 276 | Kathleen (verse riff) | Catfish and the Bottlemen | Johnny Bond | The Balcony (2014) | Bond's Les Paul Custom → Marshall Plexi/JCM800, Fuzz Factory bite, driving riff | queued |
| 277 | Cocoon (lead) | Catfish and the Bottlemen | Johnny Bond | The Balcony (2014) | Bond's Les Paul Custom (Bigsby) → Marshall Plexi, Tube Screamer leads, anthemic crunch | queued |
| 278 | Soundcheck (riff) | Catfish and the Bottlemen | Johnny Bond | The Ride (2016) | Bond's Les Paul Custom → Marshall JCM800 + Orange 4x12s, thick fuzz-driven riff | queued |
| 279 | Figure It Out (riff/bass-guitar) | Royal Blood | Mike Kerr | Royal Blood (2014) | Kerr's bass → EHX POG2 octave split → Ampeg SVT + guitar amp, fuzz, faux-guitar riff | queued |
| 280 | Out of the Black (riff) | Royal Blood | Mike Kerr | Royal Blood (2014) | Kerr's bass → POG2 + Mastotron fuzz → Ampeg/Orange rig, massive octave riff | queued |
| 281 | Trip Switch (riff) | Royal Blood | Mike Kerr | How Did We Get So Dark? (2017) | Kerr's bass → POG2 octave + Big Muff → Ampeg SVT, dual-amp guitar/bass blend | queued |
| 282 | Amsterdam (lead) | Nothing But Thieves | Joe Langridge-Brown | Nothing But Thieves (2015) | Joe's Gibson Les Paul → Vox AC30/Fender Twin, BigSky reverb, soaring clean-to-drive lead | queued |
| 283 | Excuse Me (riff) | Nothing But Thieves | Joe Langridge-Brown | Broken Machine (2017) | Joe's Les Paul → Fender Bassbreaker/Vox AC30, DM-2W delay, sharp riff | queued |
| 284 | Red Eyes (chord swell) | The War on Drugs | Adam Granduciel | Lost in the Dream (2014) | Granduciel's '65 Jazzmaster → Hiwatt Custom 100, Stereo Memory Man delay, anthemic strum | queued |
| 285 | Under the Pressure (lead) | The War on Drugs | Adam Granduciel | Lost in the Dream (2014) | Granduciel's Jazzmaster → Hiwatt, Fulltone OCD + Strymon Flint, washy delayed lead | queued |
| 286 | I Don't Live Here Anymore (lead) | The War on Drugs | Adam Granduciel | I Don't Live Here Anymore (2021) | Granduciel's Jazzmaster → Alembic F-2B preamp, delay swells, heartland lead | queued |
| 287 | Bloodbuzz Ohio (arpeggio) | The National | Aaron Dessner | High Violet (2010) | Dessner's Fender Jaguar → Vox/Fender, Hot Cake drive, DL4 delay, intricate arpeggios | queued |
| 288 | Fake Empire (clean) | The National | Bryce Dessner | Boxer (2007) | Bryce's Les Paul Deluxe → Fender Twin Reverb, clean Klon-boosted picking | queued |
| 289 | Sea of Love (riff) | The National | Bryce Dessner | Trouble Will Find Me (2013) | Bryce's Jaguar → Fender Twin, Pro Co Rat grit, driving riff | queued |
| 290 | Closer (riff) | Kings of Leon | Matthew Followill | Because of the Times (2007) | Followill's Casino → Vox AC30, atmospheric delay, hypnotic arpeggio | queued |
| 291 | Iris (alt-tuning strum) | Goo Goo Dolls | Johnny Rzeznik | Dizzy Up the Girl (1998) | Rzeznik's Gibson in open tuning → Vox/Marshall, ringing open-string strum, light overdrive | queued |
| 292 | Slide (open-tuning riff) | Goo Goo Dolls | Johnny Rzeznik | Dizzy Up the Girl (1998) | Rzeznik's guitar in alt tuning → bright jangle, capo'd open chords, mild crunch | queued |
| 293 | Semi-Charmed Life (riff) | Third Eye Blind | Kevin Cadogan | Third Eye Blind (1997) | Cadogan's guitar → Marshall, bright clean riff into crunchy chorus chords | queued |
| 294 | Hey Jealousy (jangle) | Gin Blossoms | Jesse Valenzuela / Scott Johnson | New Miserable Experience (1992) | Telecaster/Rickenbacker → Fender, jangly arpeggios, light overdrive chorus | queued |
| 295 | Drops of Jupiter (verse) | Train | Jimmy Stafford | Drops of Jupiter (2001) | Stafford's Strat → Fender, warm clean verses, crunchy chorus power chords | queued |
| 296 | 3AM (riff) | Matchbox Twenty | Kyle Cook / Adam Gaynor | Yourself or Someone Like You (1996) | Strat/Tele → Fender, jangly clean riff, mild crunch chorus | queued |
| 297 | The Middle (riff) | Jimmy Eat World | Tom Linton / Jim Adkins | Bleed American (2001) | Strat/Tele → Mesa/Marshall, bright palm-muted riff, punchy power-chord chorus | queued |
| 298 | Sweetness (riff) | Jimmy Eat World | Jim Adkins | Bleed American (2001) | Adkins' guitar → Mesa, driving emo crunch, anthemic chorus | queued |
| 299 | Soul Meets Body (clean) | Death Cab for Cutie | Chris Walla | Plans (2005) | Walla's guitar → Fender, clean jangly picking, tape-delay shimmer | queued |
| 300 | Hysteria (riff) | Muse | Matt Bellamy | Absolution (2003) | Bellamy's Manson → Marshall, fuzz + Big Muff-style riff over bass-driven groove | queued |
| 301 | Stockholm Syndrome (riff) | Muse | Matt Bellamy | Absolution (2003) | Bellamy's Manson → Marshall/Diezel, heavy fuzz drop-D riff, octave fuzz lead | queued |
| 302 | Knights of Cydonia (lead) | Muse | Matt Bellamy | Black Holes and Revelations (2006) | Bellamy's Manson MIDI → Marshall, Whammy + fuzz, galloping surf lead | queued |
| 303 | Supermassive Black Hole (riff) | Muse | Matt Bellamy | Black Holes and Revelations (2006) | Bellamy's Manson → fuzz-funk riff, octave fuzz, tight muted groove | queued |
| 304 | Time Is Running Out (riff) | Muse | Matt Bellamy | Absolution (2003) | Bellamy's Manson → Marshall, fuzz-driven single-note riff, expressive vibrato | queued |
| 305 | Would? (riff) | Alice in Chains | Jerry Cantrell | Dirt (1992) | Cantrell's G&L Rampage → Bogner Fish preamp/Mesa, drop-D, wah | queued |
| 306 | Links: [{"title":"Jerry Cantrell’s Guitar Gear, Pedalboard & Amps | Equipboard","url":"https://equipboard.com/pros/jerry-cantrell"},{"title":"The Gear Used by Jerry Cantrell on Alice in Chains’ ‘Dirt’","url":"https://guitar.com/features/artist-rigs/the-gear-used-by-jerry-cantrell-on-alice-in-chains-dirt/"},{"title":"Jerry Cantrell's Epic Rig Rundown [2024] - Premier Guitar","url":"https://www.premierguitar.com/videos/rig-rundown/jerry-cantrell-2024"},{"title":"Rig Diagram: Jerry Cantrell, Alice In Chains (2010)","url":"https://guitar.com/rig-diagrams/rig-diagram-jerry-cantrell-alice-in-chains-2010/"},{"title":"Alice in Chains - Jerry Cantrell's Guitar Gear Rig and Equipment","url":"https://www.uberproaudio.com/who-plays-what/139-alice-in-chains-jerry-cantrells-guitar-gear-rig-and-equipment"},{"title":"Official Alice in Chains Gear thread... best on the net! | Rig-Talk","url":"https://www.rig-talk.com/forum/threads/official-alice-in-chains-gear-thread-best-on-the-net.50361/"},{"title":"Jerry Cantrell’s Guitars and Gear | Ground Guitar","url":"https://www.groundguitar.com/jerry-cantrell-gear/"},{"title":"Jerry Cantrell's Guitar Gear on Dirt (1992) | Boost Guitar Pedals","url":"https://www.boostguitarpedals.co.uk/blogs/gear-of-the-gods/jerry-cantrells-guitar-gear-dirt"},{"title":"Jerry Cantrell Guitars & Gear List (2026 Update) - Guitar Lobby","url":"https://www.guitarlobby.com/jerry-cantrell-guitars-and-gear/"}] | queued |
| 307 | Links: [{"title":"Kim Thayil | Equipboard","url":"https://equipboard.com/pros/kim-thayil"},{"title":"Soundgarden - Kim Thayil Guitar Gear Rig and Equipment","url":"https://www.uberproaudio.com/who-plays-what/270-soundgarden-kim-thayil-guitar-gear-rig-and-equipment"},{"title":"Kim Thayil (Soundgarden) Guitar Rig Rundown | Guitar FX Depot","url":"https://guitarfxdepot.com/rigs/kim-thayil-soundgarden-guitar-rig/"},{"title":"Rig Rundown - Soundgarden's Kim Thayil, Chris Cornell, and Ben Shepherd","url":"https://www.premierguitar.com/rig-rundown-soundgardens-kim-thayil-chris-cornell-and-ben-shepherd"},{"title":"Soundgarden (Kim Thayil) Amp Settings (gear and tone tips) - Guitar Chalk","url":"https://www.guitarchalk.com/soundgarden-kim-thayil-amp-settings/"},{"title":"Soundgarden's Kim Thayil, Chris Cornell, and Ben Shepherd Rig Rundown - YouTube","url":"https://www.youtube.com/watch?v=uEl7u9Z3lK0"},{"title":"Kim Thayil's Soundgarden Pedalboard - YouTube","url":"https://www.youtube.com/watch?v=5hWJWxCgLQo"},{"title":"Soundgarden Rig Tour ~ Kim Thayil ~ ElectraDyne, Stiletto 4x12 & Tremoverbs - YouTube","url":"https://www.youtube.com/watch?v=ahUfbGLBcYs"},{"title":"Video: Soundgarden & Kim Thayil Rig ~ San Francisco, CA ~ July 21, 2011 | MESA/Boogie®","url":"https://legacy.mesaboogie.com/amplitudes/2011/August/soundgarden-kim-thayil-san-francisco-ca-july-21-2011.html"},{"title":"These Are Guitars Kim Thayil Used on Each Soundgarden Album | Ultimate Guitar","url":"https://www.ultimate-guitar.com/articles/features/these_are_guitars_kim_thayil_used_on_each_soundgarden_album-160996"}] | queued |
| 308 | Links: [{"title":"Peter Klett, Candlebox Guitarist Gear | Equipboard","url":"https://equipboard.com/pros/peter-klett"},{"title":"Candlebox guitarist's gear? (Peter Klett) | Mesa Boogie Amp Forum","url":"https://boogieforum.com/threads/candlebox-guitarists-gear-peter-klett.27656/"},{"title":"Candlebox guitarist Peter Klett on making Far Behind | Guitar World","url":"https://www.guitarworld.com/artists/guitarists/peter-klett-candlebox-2026"},{"title":"From touring with Metallica, to filling Geddy Lee’s shoes, they were the ’90s Seattle band that did it all – without taking the grunge tag","url":"https://www.yahoo.com/entertainment/music/articles/touring-metallica-filling-geddy-lee-134013424.html"},{"title":"Gears + Equipment Used By Peter Klett - Gemtracks","url":"https://www.gemtracks.com/gears/peter-klett-30455/"},{"title":"Ax Facts and Stats: Candlebox guitarist Peter Klett","url":"https://www.guitarsite.com/news/features/candlebox_guitarist_peter_klett/"},{"title":"Tone Settings for Far Behind by Candlebox (guitar and amp) - Guitar Chalk","url":"https://www.guitarchalk.com/amp-settings-far-behind-candlebox/"},{"title":"What amp rig can get me close to Peter Klett's tone with Candlebox? - Amps - Harmony Central","url":"https://www.harmonycentral.com/forums/topic/1471699-what-amp-rig-can-get-me-close-to-peter-kletts-tone-with-candlebox/"},{"title":"Any Candlebox fans ? | Marshall Amp Forum","url":"https://marshallforum.com/threads/any-candlebox-fans.17002/"},{"title":"Hold On Hollywood - Far Behind (w/ Peter Klett, original ...","url":"https://www.youtube.com/watch?v=QC3L_x8_NTk"}] | queued |
| 309 | Rooster (intro/leads) | Alice in Chains | Jerry Cantrell | Dirt (1992) | G&L Rampage "Blue Dress" (Duncan JB) → Bogner-modded Marshall/Rockman-blend rhythm, EHX Small Stone phaser + flanger over intro | queued |
| 310 | Them Bones (drop-D riff) | Alice in Chains | Jerry Cantrell | Dirt (1992) | G&L Rampage → Bogner Fish preamp/VHT/Marshall multi-amp blend, dropped tuning, dry and chuggy | queued |
| 311 | Man in the Box (intro/hook) | Alice in Chains | Jerry Cantrell | Facelift (1990) | G&L Rampage → Bogner-modded Marshall, Dunlop Heil talkbox + Cry Baby wah on the vocal-guitar line | queued |
| 312 | No Excuses (clean/leads) | Alice in Chains | Jerry Cantrell | Jar of Flies (1994) | G&L Rampage → semi-clean Bogner channel, Cry Baby GCB-95, light chorus shimmer | queued |
| 313 | Dam That River (riff) | Alice in Chains | Jerry Cantrell | Dirt (1992) | G&L Rampage → Bogner Fish/VHT/Marshall cab with Vox Bulldog speakers, dropped-tuning grind | queued |
| 314 | Angry Chair (riff) | Alice in Chains | Jerry Cantrell | Dirt (1992) | G&L Rampage → Bogner-modded Marshall multi-amp wall, mid-scooped dirty rhythm | queued |
| 315 | Got Me Wrong (clean) | Alice in Chains | Jerry Cantrell | Sap (1992) | G&L Rampage → clean Bogner channel into Marshall cab, jangly arpeggios | queued |
| 316 | Hail, Hail (solo/leads) | Pearl Jam | Mike McCready | No Code (1996) | 1960 Fender Stratocaster → Marshall JCM800 2203, Ibanez TS-9 push, Cry Baby wah | queued |
| 317 | Given to Fly (leads) | Pearl Jam | Mike McCready | Yield (1998) | Fender Stratocaster → Marshall JCM800, Dunlop Uni-Vibe and Cry Baby for the soaring solo | queued |
| 318 | Daughter (solo) | Pearl Jam | Mike McCready | Vs. (1993) | Fender Stratocaster → Marshall JCM800 2203 dirty / Fender Twin clean blend, TS-9 boost | queued |
| 319 | Animal (riff/solo) | Pearl Jam | Mike McCready | Vs. (1993) | Stratocaster → Marshall JCM800, TS-9 Tube Screamer into the dirty amp | queued |
| 320 | Rearviewmirror (riff) | Pearl Jam | Stone Gossard | Vs. (1993) | Gibson Les Paul Custom (Duncan Alnico II) → Marshall JCM800, DOD EQ boost driving the preamp | queued |
| 321 | Once (riff) | Pearl Jam | Stone Gossard | Ten (1991) | Les Paul Custom → Marshall JCM800 dirty + blackface Fender Twin clean via Ernie Ball pan | queued |
| 322 | Why Go (riff) | Pearl Jam | Stone Gossard | Ten (1991) | Les Paul Custom → Marshall JCM800, Boss HyperFuzz for the snarling rhythm | queued |
| 323 | Spoonman (riff) | Soundgarden | Kim Thayil | Superunknown (1994) | Guild S-100 → Mesa/Boogie Dual Rectifier, drop-D, CAE boost, behind-the-bridge harmonics | queued |
| 324 | Rusty Cage (riff) | Soundgarden | Kim Thayil | Badmotorfinger (1991) | Guild S-100 → Peavey VTM-120 / Mesa Dual Rectifier, dropped/detuned riff | queued |
| 325 | Outshined (riff) | Soundgarden | Kim Thayil | Badmotorfinger (1991) | Guild S-100 → Peavey VTM-120 + Music Man HD-130, Drop-D heavy groove | queued |
| 326 | Jesus Christ Pose (riff) | Soundgarden | Kim Thayil | Badmotorfinger (1991) | Guild S-100 → Mesa Dual Rectifier/Peavey VTM-120, relentless detuned tremolo riffing | queued |
| 327 | Fell on Black Days (leads) | Soundgarden | Kim Thayil | Superunknown (1994) | Guild S-100 → Mesa Dual Rectifier, EHX Micro POG/chorus textures, EBBBBB-ish detune | queued |
| 328 | My Wave (riff) | Soundgarden | Kim Thayil | Superunknown (1994) | Guild S-100 → Mesa Dual Rectifier, E-E-B-B-B-B tuning, CAE boost | queued |
| 329 | Heart-Shaped Box (verse/chorus) | Nirvana | Kurt Cobain | In Utero (1993) | Fender Mustang/Univox Hi-Flier → Fender Quad Reverb, Electro-Harmonix Polychorus stab on the chorus | queued |
| 330 | Rape Me (riff) | Nirvana | Kurt Cobain | In Utero (1993) | Fender Mustang → Tech 21 SansAmp into Fender Quad Reverb, Boss DS-1 grit | queued |
| 331 | Pennyroyal Tea (verse/chorus) | Nirvana | Kurt Cobain | In Utero (1993) | Univox Hi-Flier → SansAmp/Quad Reverb, EHX Small Clone chorus on the clean verses | queued |
| 332 | Serve the Servants (riff) | Nirvana | Kurt Cobain | In Utero (1993) | Fender Mustang → Tech 21 SansAmp distortion into half-broken Fender Quad Reverb | queued |
| 333 | Come as You Are (riff) | Nirvana | Kurt Cobain | Nevermind (1991) | Fender Mustang → Mesa/Boogie Studio .22, Electro-Harmonix Small Clone chorus defines the riff | queued |
| 334 | In Bloom (riff) | Nirvana | Kurt Cobain | Nevermind (1991) | Fender Jaguar/Mustang → Mesa/Boogie Studio .22, Boss DS-1 distortion | queued |
| 335 | Today (intro/riff) | Smashing Pumpkins | Billy Corgan | Siamese Dream (1993) | late-'80s Fender Strat → 1984 Marshall JCM800 (KT88s), EHX Op-Amp Big Muff into low-gain input | queued |
| 336 | Rocket (riff) | Smashing Pumpkins | Billy Corgan | Siamese Dream (1993) | Fender Strat → JCM800 2203 (KT88 "Soul" head) + Marshall "Mars" 4x12, Op-Amp Big Muff | queued |
| 337 | Mayonaise (layered rhythm) | Smashing Pumpkins | Corgan/Iha | Siamese Dream (1993) | Strat + Les Paul Custom → twin Marshall JCM800s, Big Muff wash, shimmering clean layers | queued |
| 338 | Hummer (riff/leads) | Smashing Pumpkins | Billy Corgan | Siamese Dream (1993) | Fender Strat → JCM800 (KT88s), Op-Amp Big Muff, MXR Phase 100 swirl | queued |
| 339 | Soma (clean/solo) | Smashing Pumpkins | Corgan/Iha | Siamese Dream (1993) | Strat lead + Iha Les Paul/E-Bow → JCM800 and Fender Twin clean, Big Muff for the solo | queued |
| 340 | Glycerine (clean) | Bush | Nigel Pulsford | Sixteen Stone (1994) | '89 Fender Strat Plus → Mesa/Boogie Tremoverb clean channel, Boss CS-3 compressor, simple and dry | queued |
| 341 | Machinehead (riff) | Bush | Nigel Pulsford | Sixteen Stone (1994) | Strat Plus / '50s Les Paul Jr → Mesa Tremoverb, Boss DS-2 Turbo Distortion + Big Muff | queued |
| 342 | Everything Zen (riff) | Bush | Nigel Pulsford | Sixteen Stone (1994) | Strat Plus → Mesa/Boogie Tremoverb, Boss DS-2 grind, Boss DD-3 delay | queued |
| 343 | Lightning Crashes (build/leads) | Live | Chad Taylor | Throwing Copper (1994) | Les Paul → Marshall JMP / Vox AC30 / Fender split, Rotovibe for the gritty swell | queued |
| 344 | I Alone (riff) | Live | Chad Taylor | Throwing Copper (1994) | Les Paul → Marshall JMP + Fender + Vox AC30 overdub stack, Eventide 3000 ambience | queued |
| 345 | Touch Me I'm Sick (riff) | Mudhoney | Steve Turner | Superfuzz Bigmuff EP (1988) | Fender Mustang → Fender Super Reverb, Electro-Harmonix Big Muff Pi for the saturated sustain | queued |
| 346 | Nearly Lost You (riff) | Screaming Trees | Gary Lee Conner | Sweet Oblivion (1992) | Gibson SG/Firebird → Ampeg V4, Univox U-1095 Super-Fuzz for the fuzzed-out riff | queued |
| 347 | Doll Parts (build) | Hole | Eric Erlandson | Live Through This (1994) | '60s Fender Mustang/Jaguar → '60s Fender Super Reverb, raw and dynamic, swelling distortion | queued |
| 348 | Violet (riff) | Hole | Eric Erlandson | Live Through This (1994) | Fender Telecaster Thinline/Mustang → Fender Super Reverb + small Ampeg, gritty quiet-loud dynamics | queued |
| 349 | Bound for the Floor (riff) | Local H | Scott Lucas | As Good as Dead (1996) | modified Fender Strat (SG bridge pickup + bass pickup) → Matchless Super Chief + Vox AC15 into Marshall cabs | queued |
| 350 | Tomorrow (riff/solo) | Silverchair | Daniel Johns | Frogstomp (1995) | PRS Custom 24 → Mesa/Boogie Dual Rectifier, Boss DS-1 for the raw early grit | queued |
| 351 | Shine (riff) | Collective Soul | Ross Childress | Hints Allegations and Things Left Unsaid (1994) | guitar → Peavey 5150 head + Peavey 4x12, thick driven power-chord rhythm | queued |
| 352 | Far Behind (riff/leads) | Candlebox | Peter Klett | Candlebox (1993) | 1987 Gibson Les Paul Classic → Peavey VTM-120 + Marshall Mosfet, Ibanez Tube Screamer (Roland JC-120 cleans) | queued |
| 353 | Sex Type Thing (riff) | Stone Temple Pilots | Dean DeLeo | Core (1992) | Gibson Les Paul Standard → Demeter tri-modal preamp/VHT power, Cry Baby wah, big detuned rhythm | queued |
| 354 | Crackerman (riff) | Stone Temple Pilots | Dean DeLeo | Core (1992) | '78 Les Paul Standard → Demeter/VHT stereo rig into 4x12s, SIB Varidrive overdrive | queued |
| 355 | Crown of Thorns (build/leads) | Mother Love Bone | Bruce Fairweather | Apple (1990) | Gibson Les Paul Standard → Marshall stack, Cry Baby wah, swelling clean-to-crunch dynamics | queued |
| 356 | Hangar 18 (dual solo) | Megadeth | Marty Friedman / Dave Mustaine | Rust in Peace (1990) | Jackson KV/soloist → Marshall, ADA preamp; tight high-gain | queued |
| 357 | Links: [{"title":"Dimebag Darrell's Guitar Rig, Gear & Amps | Equipboard","url":"https://equipboard.com/pros/dimebag-darrell"},{"title":"Dimebag Darrell’s guitar gear: everything you need to nail the game-changing Pantera guitarist’s sound","url":"https://www.guitarworld.com/features/dimebag-darrells-guitar-gear-everything-you-need-to-nail-the-game-changing-pantera-guitarists-sound"},{"title":"Dimebag Darrell Guitars & Gear List (With Videos) - Guitar Lobby","url":"https://www.guitarlobby.com/dimebag-darrell-guitars-and-gear/"},{"title":"Dimebag Darrell Guitars and Gear: Equipment Guide 2026","url":"https://powersof10.com/dimebag-darrell-guitars-and-gear/"},{"title":"Gear Rundown: Dimebag Darrell","url":"https://mixdownmag.com.au/features/columns/gear-rundown-dimebag-darrell/"},{"title":"Randall Century C200 II 1994 Clean | Reverb","url":"https://reverb.com/item/32723202-randall-century-c200-ii-1994-clean"},{"title":"Randall Century II Dimebag Vulgar Display of Power/Far Beyond Driven | Reverb","url":"https://reverb.com/item/36804267-randall-century-ii-dimebag-vulgar-display-of-power-far-beyond-driven"},{"title":"Dimebag Darrell Guitars and Gear (March 2026) Complete Guide to His Iconic Setup - VVN News","url":"https://vintagevinylnews.com/dimebag-darrell-guitars-and-gear/"},{"title":"Dimebag Darrell Guitar SET of 3 From Hell, Far Beyond Driven, and Vulgar Display of Power Mini Guitar Models Licensed Dean Guitar Miniature - Etsy","url":"https://www.etsy.com/listing/1282660879/dimebag-darrell-guitar-set-of-3-from"},{"title":"Randall Century 170 II Dimebag Darrell 1992 Black | Reverb","url":"https://reverb.com/item/56774514-randall-century-170-ii-dimebag-darrell-1992-black"}] | queued |
| 358 | Blackened (rhythm) | Metallica | James Hetfield | ...And Justice for All (1988) | ESP Explorer w/ EMG 81 → Mesa/Boogie Mark IIC+ preamp into Strategy 400 power amp, ADA MP-1/MQ-1 in rack; dry tracked, EQ-scooped | queued |
| 359 | Harvester of Sorrow (rhythm) | Metallica | James Hetfield | ...And Justice for All (1988) | Gibson/ESP Explorer → Mesa Mark IIC+ "Crunchberries," Strategy 400; midrange-cut grind | queued |
| 360 | The Thing That Should Not Be (rhythm) | Metallica | James Hetfield | Master of Puppets (1986) | Jackson KV1, down-tuned → Mesa Mark IIC+ slaved into modded Marshall JCM800; thick detuned crunch | queued |
| 361 | Disposable Heroes (rhythm) | Metallica | James Hetfield | Master of Puppets (1986) | White Gibson Explorer → Mesa Mark IIC+ preamp into modded JCM800 power; Boss-tight downpicking | queued |
| 362 | Welcome Home (Sanitarium) (clean intro) | Metallica | Kirk Hammett / James Hetfield | Master of Puppets (1986) | Explorer → Roland JC-120 for cleans, Mark IIC+ for leads | queued |
| 363 | Creeping Death (rhythm) | Metallica | James Hetfield | Ride the Lightning (1984) | Gibson Flying V/Explorer → Marshall JMP 2203 + 1960B, Ibanez TS-9 boost; TC dual parametric EQ | queued |
| 364 | For Whom the Bell Tolls (main riff) | Metallica | James Hetfield | Ride the Lightning (1984) | Explorer → Marshall JMP 2203, TS-9 in front; chiming bell-tone grind | queued |
| 365 | Trapped Under Ice (rhythm) | Metallica | Kirk Hammett / James Hetfield | Ride the Lightning (1984) | Explorer → Marshall JMP 2203 + TS-9; fast tremolo-picked thrash | queued |
| 366 | Wake Up Dead (solo) | Megadeth | Chris Poland / Dave Mustaine | Peace Sells... But Who's Buying? (1986) | B.C. Rich Warlock → post-Plexi '75 Marshall, Rockman into front for gain; fluid fusion-thrash lead | queued |
| 367 | Peace Sells (main riff/solo) | Megadeth | Dave Mustaine / Chris Poland | Peace Sells... But Who's Buying? (1986) | Jackson King V / B.C. Rich → Marshall, Rockman boost; bouncy riff, liquid lead | queued |
| 368 | Tornado of Souls (solo) | Megadeth | Marty Friedman | Rust in Peace (1990) | 1990 USA Jackson Kelly (black) → Bogner Triple Giant; legato, exotic phrasing | queued |
| 369 | Holy Wars... The Punishment Due (rhythm/solo) | Megadeth | Dave Mustaine / Marty Friedman | Rust in Peace (1990) | Jackson King V (Duncan JB) → Marshall + Bogner Triple Giant preamp; tight palm-mute, ADA-era gain | queued |
| 370 | Take No Prisoners (rhythm) | Megadeth | Dave Mustaine / Marty Friedman | Rust in Peace (1990) | Jackson King V → Marshall/Bogner Triple Giant; razor downpicking | queued |
| 371 | Symphony of Destruction (main riff) | Megadeth | Dave Mustaine / Marty Friedman | Countdown to Extinction (1992) | Jackson King V → CAE 3+ SE preamp into VHT 2150 power; chunky midscoop | queued |
| 372 | Angel of Death (rhythm) | Slayer | Jeff Hanneman / Kerry King | Reign in Blood (1986) | B.C. Rich (Hanneman Bich / King Mockingbird w/ DiMarzio Super Distortion) → Marshall JCM800 2203 + stock 4x12, TS boost, Boss GE-10 EQ; dry, reverb-less | queued |
| 373 | Raining Blood (rhythm) | Slayer | Kerry King / Jeff Hanneman | Reign in Blood (1986) | B.C. Rich Mockingbird → Marshall JCM800 2203; forehead-hitting dry thrash | queued |
| 374 | South of Heaven (intro/rhythm) | Slayer | Jeff Hanneman / Kerry King | South of Heaven (1988) | B.C. Rich → Marshall JCM800 2203 + 4x12; slower, menacing grind | queued |
| 375 | Seasons in the Abyss (rhythm) | Slayer | Kerry King / Jeff Hanneman | Seasons in the Abyss (1990) | B.C. Rich Mockingbird → Marshall JCM800 2203; mid-boosted thrash | queued |
| 376 | War Ensemble (rhythm) | Slayer | Jeff Hanneman / Kerry King | Seasons in the Abyss (1990) | B.C. Rich → Marshall JCM800 2203 + 4x12; relentless downpick | queued |
| 377 | Caught in a Mosh (rhythm) | Anthrax | Scott Ian / Dan Spitz | Among the Living (1987) | Scott: Gibson V / Jackson RR → '82 Marshall JCM800 2203, TC Electronic Booster+Distortion as boost; Spitz: Jackson RR w/ EMG → Mesa/Boogie | queued |
| 378 | Indians (rhythm/breakdown) | Anthrax | Scott Ian / Dan Spitz | Among the Living (1987) | Jackson RR → Marshall JCM800 2203 w/ TC Booster; chugging mosh-part grind | queued |
| 379 | Among the Living (rhythm) | Anthrax | Scott Ian / Dan Spitz | Among the Living (1987) | Gibson V → Marshall JCM800 2203, TC Booster boost; tight gallop | queued |
| 380 | The New Order (rhythm/solo) | Testament | Eric Peterson / Alex Skolnick | The New Order (1988) | Skolnick: Ibanez 540 → Marshall Super Lead w/ ADA MP-1 in front; Peterson: Marshall JCM800 2203 w/ parametric EQ + Tube Screamer | queued |
| 381 | Practice What You Preach (solo) | Testament | Alex Skolnick / Eric Peterson | Practice What You Preach (1989) | Ibanez 540S → Marshall Super Lead, ADA MP-1, '70s 4x12 w/ 25W Celestions; melodic, vocal-like lead | queued |
| 382 | Into the Pit (rhythm) | Testament | Eric Peterson / Alex Skolnick | The New Order (1988) | Marshall JCM800 2203 + Tube Screamer + parametric EQ; frantic thrash riffing | queued |
| 383 | Bonded by Blood (rhythm) | Exodus | Gary Holt / Rick Hunolt | Bonded by Blood (1985) | ESP w/ EMG → Marshall JCM800 + 4x12 (Vintage 30s); aggressive bay-area downpick | queued |
| 384 | The Toxic Waltz (rhythm) | Exodus | Gary Holt / Rick Hunolt | Fabulous Disaster (1989) | ESP w/ EMG → Marshall JCM800; mosh-anthem chug | queued |
| 385 | Cowboys from Hell (rhythm/solo) | Pantera | Dimebag Darrell | Cowboys from Hell (1990) | 1981 Dean ML "Dean from Hell" (Bill Lawrence L-500XL) → Randall RG-100ES + 4x12, MXR 6-band EQ scoop, Furman PQ-3; razor-tight, screaming whammy | queued |
| 386 | Cemetery Gates is covered — skip; Domination (rhythm) | Pantera | Dimebag Darrell | Cowboys from Hell (1990) | Dean ML → Randall RG-100ES, MXR 6-band EQ; staccato breakdown | queued |
| 387 | This Love (rhythm/solo) | Pantera | Dimebag Darrell | Vulgar Display of Power (1992) | Dean ML (Bill Lawrence) → Randall Century 200, MXR 6-band EQ, Rocktron Hush gate; clean-to-crushing dynamics | queued |
| 388 | Mouth for War (rhythm) | Pantera | Dimebag Darrell | Vulgar Display of Power (1992) | Dean ML → Randall Century 200, three-amp dry/flange/gain blend, MXR 6-band; percussive groove | queued |
| 389 | Becoming (rhythm/whammy) | Pantera | Dimebag Darrell | Far Beyond Driven (1994) | "Far Beyond Driven" sunburst Dean ML → Randall Century 200, MXR 6-band EQ, MXR flanger; detuned whammy-dive groove | queued |
| 390 | I'm Broken (main riff) | Pantera | Dimebag Darrell | Far Beyond Driven (1994) | Dean ML → Randall Century 200 + Furman PQ-4 + MXR 6-band; lurching groove riff | queued |
| 391 | Arise (rhythm) | Sepultura | Andreas Kisser / Max Cavalera | Arise (1991) | Charvel Model / Jackson RR w/ EMG → Marshall JCM800 (one modded, one as power amp for ADA MP-1); ADA MP-1 preamp grind | queued |
| 392 | Dead Embryonic Cells (rhythm/solo) | Sepultura | Andreas Kisser | Arise (1991) | Jackson RR (EMG) → ADA MP-1 into Marshall JCM800 power; dark, slithering riffs and lead | queued |
| 393 | Refuse/Resist (rhythm) | Sepultura | Andreas Kisser | Chaos A.D. (1993) | ESP/Jackson (EMG) → Mesa/Boogie Triaxis into Strategy power amp; downtuned tribal groove | queued |
| 394 | Roots Bloody Roots (main riff) | Sepultura | Andreas Kisser | Roots (1996) | ESP/Fernandes, drop-tuned (low C) → Mesa Triaxis + Strategy 500; nu-thrash low-end crush | queued |
| 395 | Davidian (main riff) | Machine Head | Robb Flynn / Logan Mader | Burn My Eyes (1994) | Ibanez RG w/ EMG 81 / Gibson Explorer → modded Peavey 5150 + Mesa oversized 4x12 (greenbacks), Boss SD-1; "let freedom ring" groove-thrash | queued |
| 396 | Old (rhythm/breakdown) | Machine Head | Robb Flynn / Logan Mader | Burn My Eyes (1994) | Ibanez RG (EMG 81) → Peavey 5150 + Mesa cabs, Boss SD-1; downtuned bounce | queued |
| 397 | Act III lead (Seemingly Endless Time, solo) | Death Angel | Rob Cavestany / Gus Pepa | Act III (1990) | Jackson → Marshall JCM800 (100W Super Lead); fluid, melodic thrash lead | queued |
| 398 | Voracious Souls (rhythm) | Death Angel | Rob Cavestany / Gus Pepa | The Ultra-Violence (1987) | Jackson → Marshall JCM800; raw teenage thrash attack | queued |
| 399 | Alison Hell (rhythm/solo) | Annihilator | Jeff Waters | Alice in Hell (1989) | Vantage V → 1980s Marshall JCM800 50-watt heads, Boss OD-1 boost; precise, neoclassical thrash riffing/lead | queued |
| 400 | The Fun Palace (rhythm/solo) | Annihilator | Jeff Waters | Never, Neverland (1990) | Vantage V → Marshall JCM800 50W; intricate riff-shred | queued |
| 401 | Midnight Rider (slide) | The Allman Brothers Band | Duane Allman | Idlewild South (1970) | Duane's Les Paul → Marshall, glass-bottle slide, open E | queued |
| 402 | Links: [{"title":"Rig Rundown: Gov't Mule's Warren Haynes [2023] - Premier Guitar","url":"https://www.premierguitar.com/videos/rig-rundown/warren-haynes-2023"},{"title":"Gov’t Mule’s Warren Haynes Gear – Tone and Sound","url":"https://jam.buzz/extra/govt-mule-warren-haynes-gear/"},{"title":"Warren Haynes | Equipboard","url":"https://equipboard.com/pros/warren-haynes"},{"title":"Gear Guide - Warren Haynes","url":"https://warrenhaynes.net/gear-guide/"},{"title":"Rig Rundown - Gov't Mule's Warren Haynes - Premier Guitar","url":"https://www.premierguitar.com/gear/rig-rundown-govt-mules-warren-haynes"},{"title":"Warren Haynes | Vintage Guitar® magazine","url":"https://www.vintageguitar.com/32434/warren-haynes-3/"},{"title":"Warren Haynes on the SG behind his early Gov’t Mule tone | Guitar World","url":"https://www.guitarworld.com/artists/guitarists/warren-haynes-gibson-sg-from-guitar-world-cover-july-1994"},{"title":"(en) In The Style Of Warren Haynes","url":"https://guitarsexchange.com/en/psych-out/712/in-the-style-of-warren-haynes/"},{"title":"Warren Haynes – Vintage Guitar® magazine","url":"https://www.vintageguitar.com/62332/warren-haynes-5/"},{"title":"Warren Haynes and Soldano | The Gear Page","url":"https://www.thegearpage.net/board/index.php?threads/warren-haynes-and-soldano.464247/"}] | queued |
| 403 | Links: [{"title":"Charlie Daniels | Equipboard","url":"https://equipboard.com/pros/charlie-daniels"},{"title":"The Unique Guitar Blog: Charlie Daniels - His Life And His Guitars","url":"https://uniqueguitar.blogspot.com/2020/08/charlie-daniels-his-life-and-his-guitars.html"},{"title":"Charlie Daniels and Tommy Crain backstage.... | My Les Paul Forum","url":"https://www.mylespaul.com/threads/charlie-daniels-and-tommy-crain-backstage.294130/"},{"title":"Charlie Daniels – Vintage Guitar® magazine","url":"https://www.vintageguitar.com/2868/charlie-daniels/"},{"title":"The Les Paul Forum","url":"https://www.lespaulforum.com/index.php"},{"title":"The Charlie Daniels Band Members, Gear & Sound | Equipboard","url":"https://equipboard.com/band/the-charlie-daniels-band"},{"title":"Charlie Daniels 1959 Guitar on The Midnight Special","url":"https://www.facebook.com/groups/gibsonlespaulsgroup/posts/2134168473718721/"},{"title":"Charlie Daniels Band | Telecaster Guitar Forum","url":"https://www.tdpri.com/threads/charlie-daniels-band.10064/"},{"title":"Charlie Daniels - Wikipedia","url":"https://en.wikipedia.org/wiki/Charlie_Daniels"},{"title":"Tommy Bolin Gear Page","url":"https://www.angelfire.com/ny/bolinfan/gear.html"}] | queued |
| 404 | Statesboro Blues (slide intro) | The Allman Brothers Band | Duane Allman | At Fillmore East (1971) | '61 Gibson SG → 50-watt Marshall, Coricidin-bottle slide, open E | queued |
| 405 | One Way Out (slide) | The Allman Brothers Band | Duane Allman | Eat a Peach (1972) | Les Paul → tweed-era Marshall bass head, glass slide, dueling-lead breaks | queued |
| 406 | In Memory of Elizabeth Reed (lead) | The Allman Brothers Band | Dickey Betts | At Fillmore East (1971) | '57 Les Paul goldtop "Goldie" → 50-watt Marshall Super Lead, JBL D120s, Dorian modal lines | queued |
| 407 | Ramblin' Man (lead) | The Allman Brothers Band | Dickey Betts | Brothers and Sisters (1973) | '57 goldtop "Goldie" → Marshall Super Lead 4x12 w/ JBLs, no pedals, bright country-rock lead | queued |
| 408 | Jessica (lead) | The Allman Brothers Band | Dickey Betts | Brothers and Sisters (1973) | Les Paul → 50-watt Marshall, JBL D123 4x12, clean major-key instrumental | queued |
| 409 | Blue Sky (twin leads) | The Allman Brothers Band | Dickey Betts & Duane Allman | Eat a Peach (1972) | Betts goldtop + Duane Les Paul → Marshalls w/ JBLs, harmonized clean leads | queued |
| 410 | Midnight Blues / Don't Keep Me Wonderin' (slide) | The Allman Brothers Band | Duane Allman | Idlewild South (1970) | Les Paul → 50-watt Marshall, Coricidin slide, open-tuned bottleneck | queued |
| 411 | Get the slide tone — Mountain Jam (slide) | The Allman Brothers Band | Duane Allman | Eat a Peach (1972) | Les Paul → Marshall bass head, glass slide, extended modal jam | queued |
| 412 | Can't You See (intro/lead) | The Marshall Tucker Band | Toy Caldwell | The Marshall Tucker Band (1973) | '70s sunburst Les Paul (PAFs), thumb-picked → Fender Twin Reverb chassis into Marshall 4x12 w/ JBL K120s | queued |
| 413 | Searchin' for a Rainbow (lead) | The Marshall Tucker Band | Toy Caldwell | Searchin' for a Rainbow (1975) | post-CBS sunburst Strat → twin Fender Twin Reverbs into Marshall cabs w/ K120s, thumb-picked | queued |
| 414 | This Ol' Cowboy (jazzy lead) | The Marshall Tucker Band | Toy Caldwell | Where We All Belong (1974) | Gibson ES-350T → Fender Twin Reverb rig, K120 JBLs, clean swing phrasing | queued |
| 415 | Fire on the Mountain (lead) | The Marshall Tucker Band | Toy Caldwell | Searchin' for a Rainbow (1975) | sunburst Les Paul, thumb → Twin Reverb-into-Marshall rig, smooth country-rock lead | queued |
| 416 | Green Grass and High Tides (twin leads) | The Outlaws | Hughie Thomasson & Billy Jones | Outlaws (1975) | '72 three-bolt Strat → blackface Fender Super Twin into Marshall 4x12, clean-but-loud harmonized leads | queued |
| 417 | There Goes Another Love Song (lead) | The Outlaws | Hughie Thomasson | Outlaws (1975) | '74 Strat (Tele bridge pickup, out-of-phase) → Fender Super Twin/Marshall cab, bright single-coil lead | queued |
| 418 | Hurry Sundown (lead) | The Outlaws | Hughie Thomasson | Hurry Sundown (1977) | Strat → Super Twin into Marshall cab, Dunlop Tortex .60, clean Florida-Strat tone | queued |
| 419 | Hold On Loosely (solo) | .38 Special | Jeff Carlisi | Wild-Eyed Southern Boys (1981) | '69 Les Paul Deluxe goldtop → Peavey Mace VT into Marshall 4x12 w/ 25W Greenbacks | queued |
| 420 | Caught Up in You (solo) | .38 Special | Jeff Carlisi | Special Forces (1982) | Les Paul Deluxe goldtop → Peavey Mace VT, Marshall slant cab Greenbacks, arena-rock lead | queued |
| 421 | Rockin' Into the Night (solo) | .38 Special | Jeff Carlisi | Rockin' Into the Night (1979) | Les Paul Deluxe → Mace VT into Marshall cab, JBL K-series live, melodic solo | queued |
| 422 | Simple Man (twin leads) | Lynyrd Skynyrd | Gary Rossington & Allen Collins | Pronounced 'Lĕh-'nérd 'Skin-'nérd (1973) | Rossington '59 Les Paul "Bernice" + Collins Firebird → Marshall 1959T Super Tremolo, slow-build solo | queued |
| 423 | Tuesday's Gone (slide/lead) | Lynyrd Skynyrd | Gary Rossington | Pronounced (1973) | '59 Les Paul → Marshall Super Tremolo head, mournful slide and bends | queued |
| 424 | Gimme Three Steps (twin leads) | Lynyrd Skynyrd | Allen Collins & Gary Rossington | Pronounced (1973) | Collins Firebird + Rossington Les Paul → Marshall 1959T, JBL-loaded cabs, trading licks | queued |
| 425 | That Smell (lead) | Lynyrd Skynyrd | Steve Gaines | Street Survivors (1977) | Les Paul Custom → Peavey Mace (JBL E120s, Marshall-voiced mod), grinding lead | queued |
| 426 | I Know a Little (lead) | Lynyrd Skynyrd | Steve Gaines | Street Survivors (1977) | Les Paul → Peavey Mace rig, fast hybrid-picked country-boogie lead | queued |
| 427 | Flirtin' with Disaster (twin leads) | Molly Hatchet | Dave Hlubek & Steve Holland | Flirtin' with Disaster (1979) | Les Paul Standard / Gibson Explorer → Peavey Mace 100W heads (Skynyrd-style JBL/Marshall voicing), galloping harmonized leads | queued |
| 428 | Gator Country (lead) | Molly Hatchet | Dave Hlubek | Molly Hatchet (1978) | Gibson Explorer → Peavey Mace, thick Southern-boogie lead | queued |
| 429 | The South's Gonna Do It Again (lead) | The Charlie Daniels Band | Charlie Daniels & Tommy Crain | Fire on the Mountain (1974) | '58 Les Paul Standard "The Lady" → Marshall cab, .010s, buttery dual-lead | queued |
| 430 | Long Haired Country Boy (lead) | The Charlie Daniels Band | Tommy Crain | Fire on the Mountain (1974) | Les Paul → Marshall cab, laid-back bluesy country-rock lead | queued |
| 431 | Dixie Chicken (slide) | Little Feat | Lowell George | Dixie Chicken (1973) | Strat (Tele bridge pickup) → twin MXR Dyna Comps (stacked) into Fender Twin / Music Man, Sears 11/16 socket slide | queued |
| 432 | Rock and Roll Doctor (slide) | Little Feat | Lowell George | Feats Don't Fail Me Now (1974) | compressed Strat → stacked Dyna Comps into Fender Twin, socket-wrench slide, greasy tone | queued |
| 433 | Willin' / Spanish Moon (slide) | Little Feat | Lowell George | Feats Don't Fail Me Now (1974) | Strat → Dyna Comp pair into Fender Twin, socket slide, vocal-like phrasing | queued |
| 434 | Rocky Mountain Way (slide/talk box) | Joe Walsh (Barnstorm) | Joe Walsh | The Smoker You Drink... (1973) | Les Paul Deluxe, open tuning → tweed Fender Champ, Bob Heil Talk Box outro | queued |
| 435 | One of These Nights (solo) | Eagles | Don Felder | One of These Nights (1975) | '59 Les Paul → narrow-panel tweed Fender Deluxe, Echoplex + Boss chorus, lyrical solo | queued |
| 436 | Victim of Love (solo) | Eagles | Don Felder | Hotel California (1976) | Telecaster → tweed Fender Champ, raw single-coil rock lead | queued |
| 437 | Witchy Woman (lead) | Eagles | Bernie Leadon | Eagles (1972) | tobacco-burst Les Paul (mini-humbuckers) → Fender Deluxe Reverb, eerie bent-note lead | queued |
| 438 | Tush (lead) | ZZ Top | Billy Gibbons | Fandango! (1975) | '59 Les Paul "Pearly Gates" → '68 Marshall Super Lead 100W, raw boogie-shuffle lead | queued |
| 439 | Jesus Just Left Chicago (slow lead) | ZZ Top | Billy Gibbons | Tres Hombres (1973) | "Pearly Gates" Les Paul → '68 Marshall Super Lead, smoky slow-blues bends | queued |
| 440 | Waitin' for the Bus (riff) | ZZ Top | Billy Gibbons | Tres Hombres (1973) | "Pearly Gates" → Marshall Super Lead, treble-booster grind, staccato boogie riff | queued |
| 441 | Mr. Big (solo) | Gov't Mule | Warren Haynes | Dose (1998) | Gibson Les Paul → Soldano SLO-100 (low-mid mod) into Marshall 4x12, sustaining power-trio lead | queued |
| 442 | Soulshine (lead) | Gov't Mule | Warren Haynes | Dose (1998) | Les Paul "Chester" → Soldano SLO-100, warm singing-blues lead | queued |
| 443 | Thorazine Shuffle (slide) | Gov't Mule | Warren Haynes | Dose (1998) | Les Paul, slide → Soldano SLO-100/Marshall cab, heavy Southern slide riff | queued |
| 444 | Sting Me (lead) | The Black Crowes | Marc Ford | The Southern Harmony and Musical Companion (1992) | '59 Historic Les Paul → red-knob Fender Twin into Marshall half-stack, Fuzz Face + treble booster | queued |
| 445 | Thorn in My Pride (slide/lead) | The Black Crowes | Marc Ford | The Southern Harmony and Musical Companion (1992) | Les Paul → Twin/Marshall blend, wah + Octavia, building jam lead | queued |
| 446 | Remedy (rhythm/lead) | The Black Crowes | Rich Robinson | The Southern Harmony and Musical Companion (1992) | open-G guitar capo 3 → Marshall Silver Jubilee, fat riff bed; Marc Ford leads atop | queued |
| 447 | Sometimes Salvation (slide) | The Black Crowes | Rich Robinson | The Southern Harmony and Musical Companion (1992) | Gibson into Marshall Silver Jubilee, slide-driven open tuning | queued |
| 448 | Ain't Got the Blues (lead) | Blackberry Smoke | Charlie Starr | The Whippoorwill (2012) | '56 Les Paul Junior (P-90) → 50W Germino Lead 55LV into 4x12, gritty single-P90 lead | queued |
| 449 | Six Ways to Sunday (lead) | Blackberry Smoke | Charlie Starr | The Whippoorwill (2012) | Les Paul Junior / '59 Les Paul Special → Germino head, raw Southern lead | queued |
| 450 | Decoration Day (twin leads) | Drive-By Truckers | Mike Cooley & Jason Isbell | Decoration Day (2003) | Cooley Thinline Tele → 20W Marshall 2061X handwired into 4x10; Isbell Les Paul, harmonized leads | queued |
| 451 | Sinkhole (lead) | Drive-By Truckers | Mike Cooley | Decoration Day (2003) | "Cooleycaster" → 18W handwired Marshall 1974X 1x12, no pedals, amp-driven grind | queued |
| 452 | Sin City (pedal steel) | The Flying Burrito Brothers | Sneaky Pete Kleinow | The Gilded Palace of Sin (1969) | Fender 400 8-string pedal steel → fuzzbox + Leslie, pioneering distorted steel | queued |
| 453 | Christine's Tune / Devil in Disguise (pedal steel) | The Flying Burrito Brothers | Sneaky Pete Kleinow | The Gilded Palace of Sin (1969) | Fender cable-pull steel → fuzz + Echoplex, wailing steel "lead guitar" | queued |
| 454 | Could You Be Loved (skank) | Bob Marley & the Wailers | Junior Marvin / Al Anderson | Uprising (1980) | Les Paul/Strat → Fender clean, off-beat upstroke 'skank', spring reverb | queued |
| 455 | Links: [{"title":"Toots and the Maytals - Wikipedia","url":"https://en.wikipedia.org/wiki/Toots_and_the_Maytals"},{"title":"Toots & The Maytals – 54 - 46 / Pressure Drop | Releases | Discogs","url":"https://www.discogs.com/master/1451740-Toots-The-Maytals-54-46-Pressure-Drop"},{"title":"Pressure Drop - The Golden Tracks, by Toots and the Maytals","url":"https://goldenlanetootsandthemaytals.bandcamp.com/album/pressure-drop-the-golden-tracks"},{"title":"Toots & The Maytals – 54 - 46 / Pressure Drop","url":"https://www.discogs.com/release/594224-Toots-The-Maytals-54-46-Pressure-Drop"},{"title":"Toots & The Maytals - 54-46 (Reggae) / Pressure Drop (Beverley's) UK 7"","url":"https://www.dubvendor.co.uk/toots--the-maytals---54-46-reggae--pressure-drop-beverleys-uk-7-69852-p.asp"},{"title":"Toots & The Maytals - Record Collector Magazine","url":"https://recordcollectormag.com/reviews/live/toots-themaytals"},{"title":"“Pressure Drop” The Maytals – Covers of Reggae songs","url":"https://mostlymusiccovers.com/2023/10/25/pressure-drop-the-maytals-covers-of-reggae-songs/"},{"title":"Toots and the Maytals - Pressure Drop - The Golden Tracks","url":"https://goldenlanetootsandthemaytals.bandcamp.com/track/pressure-drop"},{"title":"Toots & The Maytals: albums, songs, concerts | Deezer","url":"https://www.deezer.com/us/artist/5871"},{"title":"Toots and the Maytals (1962-2020) | BlackPast.org","url":"https://blackpast.org/global-african-history/toots-and-the-maytals-1962-2020/"}] | queued |
| 456 | Exodus (lead/wah) | Bob Marley & the Wailers | Junior Marvin | Exodus (1977) | Fender Stratocaster → two Fender Twin Reverbs, Roger-Mayer Cry Baby + EHX Dr. Q envelope filter | queued |
| 457 | Jamming (skank) | Bob Marley & the Wailers | Junior Marvin / Al Anderson | Exodus (1977) | Strat / Les Paul → Fender Twin Reverb clean, off-beat 'skank' upstroke, spring reverb | queued |
| 458 | Three Little Birds (skank) | Bob Marley & the Wailers | Junior Marvin / Al Anderson | Exodus (1977) | Strat → Fender Twin Reverb, bright clipped chord stabs on the off-beat | queued |
| 459 | Legalize It (rhythm) | Peter Tosh | Peter Tosh | Legalize It (1976) | Fender Stratocaster → Fender Twin Reverb clean, choppy off-beat skank, light spring reverb | queued |
| 460 | Pressure Drop (rhythm) | Toots & the Maytals | Hux Brown | Monkey Man / Funky Kingston era (1969–73) | archtop/solidbody → Fender clean, syncopated rocksteady skank, palm-muted bubble | queued |
| 461 | 54-46 That's My Number (rhythm) | Toots & the Maytals | Hux Brown | Sweet and Dandy / From the Roots (1968) | electric → Fender clean, percussive off-beat chop driving the rocksteady groove | queued |
| 462 | The Harder They Come (rhythm) | Jimmy Cliff | Hux Brown | The Harder They Come OST (1972) | electric → Fender clean, crisp skank upstrokes over the one-drop | queued |
| 463 | Handsworth Revolution (rhythm) | Steel Pulse | David Hinds | Handsworth Revolution (1978) | Fender Stratocaster → clean amp, tight roots-reggae skank, dub-style spring reverb | queued |
| 464 | Train to Skaville (rhythm) | The Ethiopians / Skatalites scene | Ernest Ranglin | single (1967) | archtop Gibson → clean amp, palm-muted low-string ska riff, thick flatwounds + heavy pick | queued |
| 465 | A Message to You Rudy (skank) | The Specials | Lynval Golding / Roddy Radiation | The Specials (1979) | Gibson Les Paul → Vox AC30, fast clean off-beat skank chops | queued |
| 466 | Gangsters (rhythm) | The Specials | Roddy Radiation / Lynval Golding | The Specials (1979) | Les Paul Special → Vox AC30, punchy 2-Tone upstroke skank | queued |
| 467 | Concrete Jungle (lead) | The Specials | Roddy Radiation | The Specials (1979) | Gibson Les Paul → Vox AC30 driven, punk-edged lead over ska rhythm | queued |
| 468 | Our House (intro/riff) | Madness | Chris Foreman | The Rise & Fall (1982) | Fender Telecaster → layered Fender Twin + Mesa/Boogie, bright arpeggiated riff | queued |
| 469 | Baggy Trousers (rhythm) | Madness | Chris Foreman | Absolutely (1980) | Telecaster → Fender Twin, bouncy clean off-beat ska chop | queued |
| 470 | Roxanne (rhythm) | The Police | Andy Summers | Outlandos d'Amour (1978) | '63 Fender Telecaster Custom (PAF neck) → Fender Twin Reverb, sparse reggae-tinged off-beat stabs | queued |
| 471 | Walking on the Moon (chord stab) | The Police | Andy Summers | Reggatta de Blanc (1979) | '63 Tele Custom → Fender Twin, MXR Dyna Comp + EHX Electric Mistress, dubby Dadd9 stab | queued |
| 472 | Message in a Bottle (riff) | The Police | Andy Summers | Reggatta de Blanc (1979) | '63 Tele Custom → Fender Twin Reverb, EHX Electric Mistress chorus, add9 arpeggio riff | queued |
| 473 | What I Got (rhythm) | Sublime | Bradley Nowell | Sublime (1996) | Fender Stratocaster → Fender Twin Reverb clean, acoustic-flavored reggae upstroke | queued |
| 474 | Santeria (lead) | Sublime | Bradley Nowell | Sublime (1996) | Strat → Fender clean amp, bright ska-pop chord work + melodic lead, light Boss DD-3 | queued |
| 475 | Stomp the Land (rhythm) | Stick Figure | Scott Woodruff | Set in Stone (2015) | electric → Fender '65 Twin Reverb + Ibanez TS9DX, dub skank with heavy delay/reverb | queued |
| 476 | Closer to the Sun (rhythm) | Slightly Stoopid | Miles Doughty / Kyle McDonald | Closer to the Sun (2005) | Fender-style electric → clean/overdriven tube amp, reggae upstroke with bluesy fills | queued |
| 477 | Europa (lead) | Santana | Carlos Santana | Amigos (1976) / Moonflower (1977) | Yamaha SG2000 → Mesa/Boogie Mark, endless singing sustain, slow vibrato bends | queued |
| 478 | Samba Pa Ti (lead) | Santana | Carlos Santana | Abraxas (1970) | refinished Les Paul → Fender Twin Reverb, vocal-like sustained legato phrasing | queued |
| 479 | Oye Como Va (rhythm/lead) | Santana | Carlos Santana | Abraxas (1970) | refinished Les Paul → cranked Fender Twin Reverb, percussive comping + creamy sustained leads | queued |
| 480 | T(r+) Tied To the Sky (percussive) | Rodrigo y Gabriela | Rodrigo Sánchez / Gabriela Quintero | 11:11 (2009) | Yamaha NX nylon (7-piezo system) → DI/PA, golpe body percussion + plectrum-driven nylon shredding | queued |
| 481 | Hanuman (percussive) | Rodrigo y Gabriela | Rodrigo Sánchez / Gabriela Quintero | 11:11 (2009) | Yamaha NTX/NCX nylon → PA, thrash-derived nylon runs over hand-drum body slaps | queued |
| 482 | La Bamba (rhythm) | Los Lobos | David Hidalgo / Cesar Rosas | La Bamba OST (1987) | Strat / Gibson ES-335 → Fender Deluxe Reverb, driving Tex-Mex strum | queued |
| 483 | Will the Wolf Survive? (lead) | Los Lobos | David Hidalgo | How Will the Wolf Survive? (1984) | goldtop Les Paul / Nocaster → Fender Hot Rod, roots-rock lead, Tube Screamer push | queued |
| 484 | Low Rider (rhythm) | War | Howard Scott | Why Can't We Be Friends? (1975) | Gibson semi-hollow → Fender Twin Reverb, tight funk-Latin clean comp, Cry Baby | queued |
| 485 | The Cisco Kid (rhythm) | War | Howard Scott | The World Is a Ghetto (1972) | Gibson → Marshall/Fender clean, syncopated Latin-funk chord stabs | queued |
| 486 | Bamboleo (rumba flamenca) | Gipsy Kings | Nicolas/Tonino Baliardo | Gipsy Kings (1987) | spruce-top cypress flamenco nylon (Conde-style) → DI/PA, rasgueado rumba strum, golpe | queued |
| 487 | Chan Chan (son) | Buena Vista Social Club | Compay Segundo / Eliades Ochoa | Buena Vista Social Club (1997) | Compay's 7-string 'armónico' + Ochoa archtop → mic'd, interlocking son montuno | queued |
| 488 | Barcelona Nights (lead) | Ottmar Liebert | Ottmar Liebert | Nouveau Flamenco (1989) | nylon flamenco w/ black nylon strings, D'Addario → DI, rumba-flamenco picado melody | queued |
| 489 | Mario Takes a Walk (lead) | Jesse Cook | Jesse Cook | Tempest (1995) | Condé Hermanos / Godin Multiac nylon (RMC pickup) → DI/PA, rumba flamenca with percussive golpe | queued |
| 490 | Clandestino (rhythm) | Manu Chao | Manu Chao | Clandestino (1998) | Gretsch G6120 hollowbody → clean amp, gentle Latin-reggae off-beat strum | queued |
| 491 | Cumbia de los Muertos (rhythm) | Ozomatli | Raúl Pacheco | Ozomatli (1998) | Echopark Clarence-style electric → clean amp, cumbia/Latin-funk syncopated comp | queued |
| 492 | Fluorescent Adolescent (riff) | Arctic Monkeys | Jamie Cook / Alex Turner | Favourite Worst Nightmare (2007) | Cook's Strat → Vox/Fender, clean-to-edge | queued |
| 493 | Maps (verse) | Yeah Yeah Yeahs | Nick Zinner | Fever to Tell (2003) | '80s Japanese Fender Strat → Fender Hot Rod DeVille 4x10 + Deluxe, ProCo RAT for the swell-to-fuzz lift | queued |
| 494 | Rich (riff) | Yeah Yeah Yeahs | Nick Zinner | Fever to Tell (2003) | Japanese Strat → Fender DeVille/Deluxe pair, DigiTech Whammy + RAT, jagged single-note stab | queued |
| 495 | Y Control (riff) | Yeah Yeah Yeahs | Nick Zinner | Fever to Tell (2003) | Strat → Fender combos, ProCo RAT fuzz, EHX POG octave thickening | queued |
| 496 | Gold Lion (riff) | Yeah Yeah Yeahs | Nick Zinner | Show Your Bones (2006) | Strat → Fender Deluxe + DeVille, RAT into Line 6 DL4, taut tremolo-picked figure | queued |
| 497 | Heads Will Roll (stabs) | Yeah Yeah Yeahs | Nick Zinner | It's Blitz! (2009) | Strat → Fender combos, EHX POG + RAT, percussive disco-punk chord chops | queued |
| 498 | Obstacle 1 (riff) | Interpol | Daniel Kessler | Turn On the Bright Lights (2002) | 1967 Epiphone Casino → Fender '65 Twin Reverb (Princeton in studio), chiming arpeggio, light spring reverb | queued |
| 499 | NYC (arpeggio) | Interpol | Daniel Kessler | Turn On the Bright Lights (2002) | Epiphone Casino → Fender Twin Reverb, clean compressed delay-tinged arpeggios | queued |
| 500 | Slow Hands (riff) | Interpol | Daniel Kessler | Antics (2004) | Epiphone Casino → Fender Twin Reverb, bright neck-pickup staccato stabs | queued |
| 501 | Evil (riff) | Interpol | Daniel Kessler | Antics (2004) | Casino / 1960 Gibson ES-330 → Fender Twin Reverb, clean angular plucked lead | queued |
| 502 | The Modern Age (riff) | The Strokes | Nick Valensi / Albert Hammond Jr. | Is This It (2001) | Valensi's Epiphone Riviera + Hammond's Strat → Fender Hot Rod, slightly broken-up rhythm interplay | queued |
| 503 | Someday (lead) | The Strokes | Nick Valensi | Is This It (2001) | Epiphone Riviera → Fender Hot Rod Deville, bright clean-edge single-coil lead, no fuzz | queued |
| 504 | Hard to Explain (riff) | The Strokes | Albert Hammond Jr. / Nick Valensi | Is This It (2001) | Hammond's Fender Strat → Fender amp, thin overdriven rhythm against Valensi lead | queued |
| 505 | You Only Live Once (riff) | The Strokes | Nick Valensi / Albert Hammond Jr. | First Impressions of Earth (2006) | Riviera + Strat → Fender Hot Rod, layered clean-to-crunch octave riff | queued |
| 506 | Brianstorm (riff) | Arctic Monkeys | Jamie Cook / Alex Turner | Favourite Worst Nightmare (2007) | Cook's Fender Strat → Vox AC30, gated tremolo-picked attack, light fuzz | queued |
| 507 | 505 (build) | Arctic Monkeys | Jamie Cook / Alex Turner | Favourite Worst Nightmare (2007) | Strats → Vox AC30, swelling fuzz crescendo on the outro | queued |
| 508 | Crying Lightning (riff) | Arctic Monkeys | Jamie Cook / Alex Turner | Humbug (2009) | Cook's Strat → Vox AC30, heavy fuzz (Fuzz Factory-style) desert-rock grind | queued |
| 509 | Next Girl (riff) | The Black Keys | Dan Auerbach | Brothers (2010) | Custom Harmony/Teisco-style → Fender amp + Marshall, Fuzz for swampy bent-note riff | queued |
| 510 | Howlin' for You (riff) | The Black Keys | Dan Auerbach | Brothers (2010) | Supro/Harmony → cranked small combo, fuzz-stomp glam-blues stomp riff | queued |
| 511 | Gold on the Ceiling (riff) | The Black Keys | Dan Auerbach | El Camino (2011) | Custom Bigsby-equipped guitar → Marshall + Fender, fuzz with EHX-style octave shimmer | queued |
| 512 | Tighten Up (riff) | The Black Keys | Dan Auerbach | Brothers (2010) | Harmony-style → Fender amp, whistled-melody-doubling clean-to-fuzz lick | queued |
| 513 | Fell in Love with a Girl (riff) | The White Stripes | Jack White | White Blood Cells (2001) | 1964 Airline Res-O-Glas → Sears Silvertone 1485, EHX Big Muff Pi blasting the staccato riff | queued |
| 514 | Dead Leaves and the Dirty Ground (riff) | The White Stripes | Jack White | White Blood Cells (2001) | Airline → Silvertone 1485, Big Muff + DigiTech Whammy octave-up stab | queued |
| 515 | The Hardest Button to Button (riff) | The White Stripes | Jack White | Elephant (2003) | Kay Hollowbody → Silvertone/Fender, Big Muff + Whammy pulsing octave riff | queued |
| 516 | Blue Orchid (riff) | The White Stripes | Jack White | Get Behind Me Satan (2005) | Airline → small combo, DigiTech Whammy octave-up + Big Muff for the falsetto-pitch riff | queued |
| 517 | Steady, As She Goes (riff) | The Raconteurs | Jack White / Brendan Benson | Broken Boy Soldiers (2006) | Benson's Gretsch/Jack's Airline → Fender + Marshall, tight overdrive Motown-bass-driven riff | queued |
| 518 | Hate to Say I Told You So (riff) | The Hives | Nicholaus Arson | Veni Vidi Vicious (2000) | Fender Telecaster Custom → Fender Bandmaster + Hiwatt cab, Boss AW-3 wah intro | queued |
| 519 | Walk Idiot Walk (riff) | The Hives | Nicholaus Arson | Tyrannosaurus Hives (2004) | Telecaster Custom → Fender Vibrolux + Bandmaster, bright-switch staccato garage stab | queued |
| 520 | Take Me Out (riff) | Franz Ferdinand | Nick McCarthy / Alex Kapranos | Franz Ferdinand (2004) | Kapranos's hollowbody/McCarthy guitar → Vox/Carr-style combo, dry overdriven half-time disco-rock riff | queued |
| 521 | The Dark of the Matinée (riff) | Franz Ferdinand | Alex Kapranos / Nick McCarthy | Franz Ferdinand (2004) | Telecaster-style → Vox AC30, clean angular dual-guitar lines | queued |
| 522 | A-Punk (riff) | Vampire Weekend | Ezra Koenig | Vampire Weekend (2008) | Stratocaster → Fender Hot Rod Deluxe, bright clean staccato, Boss DD-3 eighth-note slap | queued |
| 523 | Cape Cod Kwassa Kwassa (riff) | Vampire Weekend | Ezra Koenig | Vampire Weekend (2008) | Strat → Roland JC-120, clean chorused Afro-pop guitar lines | queued |
| 524 | Cousins (riff) | Vampire Weekend | Ezra Koenig | Contra (2010) | Strat → Fender Hot Rod / JC-120, frantic bright single-coil surf-punk riff | queued |
| 525 | Solitude Is Bliss (riff) | Tame Impala | Kevin Parker | Innerspeaker (2010) | Fender Telecaster → vintage combo, fuzz + phaser, swirling psych lead | queued |
| 526 | Elephant (riff) | Tame Impala | Kevin Parker | Lonerism (2012) | Telecaster → cranked amp, heavy fuzz + phaser glam-stomp riff | queued |
| 527 | Somebody Told Me (riff) | The Killers | Dave Keuning | Hot Fuss (2004) | Fender Strat → Matchless DC30, Ibanez TS9 + delay, palm-muted new-wave riff | queued |
| 528 | Smile Like You Mean It (lead) | The Killers | Dave Keuning | Hot Fuss (2004) | Strat → Matchless DC30, Line 6 DL4 + Ibanez Analog Delay, soaring delayed lead | queued |
| 529 | Knocked Up (riff) | Kings of Leon | Matthew Followill | Because of the Times (2007) | Gibson ES-137 → Ampeg Reverberocket, EHX Bad Stone, atmospheric delayed arpeggio build | queued |
| 530 | The Way We Get By (riff) | Spoon | Britt Daniel | Kill the Moonlight (2002) | Fender Thinline Telecaster → Vox AC30, JHS Colour Box grit, percussive piano-doubled riff | queued |
| 531 | I Turn My Camera On (riff) | Spoon | Britt Daniel | Gimme Fiction (2005) | Thinline Tele → Vox Pathfinder, scrape-y muted funk-falsetto chord chops | queued |
| 532 | Float On (riff) | Modest Mouse | Isaac Brock | Good News for People Who Love Bad News (2004) | Fender-style → small combo, EHX Micro POG + chorus/delay, bright bouncing octave riff | queued |
| 533 | My Number (riff) | Foals | Yannis Philippakis | Holy Fire (2013) | Travis Bean 1000 Artist → Hiwatt, clean interlocking math-pop arpeggios, slap delay | queued |
| 534 | Inhaler (riff) | Foals | Yannis Philippakis | Holy Fire (2013) | Travis Bean → Hiwatt, Fuzzrocious RAT-style fuzz, crushing riff-to-clean dynamic | queued |
| 535 | Kids (lead) | MGMT | Andrew VanWyngarden / Ben Goldwasser | Oracular Spectacular (2007) | Stratocaster → small combo, fuzz over synth, simple bright lead doubling the hook | queued |
| 536 | What You Know (riff) | Two Door Cinema Club | Sam Halliday | Tourist History (2010) | Gibson ES-330 → Mesa/Boogie Mark V, Boss DD-20 + Line 6 DL4 dotted-eighth delay sparkle | queued |
| 537 | Ain't No Rest for the Wicked (riff) | Cage the Elephant | Lincoln Parish / Brad Shultz | Cage the Elephant (2008) | Gretsch hollowbody slide + Tele → Fender Super-Sonic, ZVEX Fuzz Factory/Mastotron, honky slide riff | queued |
| 538 | Caring Is Creepy (riff) | The Shins | James Mercer | Oh, Inverted World (2001) | Fender-style → small combo, chorus/reverb, jangly lo-fi clean arpeggio | queued |
| 539 | Eight Miles High (intro/solo) | The Byrds | Roger McGuinn | Fifth Dimension (1966) | McGuinn's Rickenbacker 360-12 → Vox AC30, compressed jangle | queued |
| 540 | Links: [{"title":"The Ultimate Guide to Jimi Hendrix: Tone, Gear, Effects - Guitar Gear Finder","url":"https://guitargearfinder.com/guides/ultimate-guide-jimi-hendrix-tone-gear-effects/"},{"title":"A detailed look at Jimi Hendrix' pedals and signal chain - Custom Boards Finland","url":"https://en.customboards.fi/blogs/articles/a-detailed-look-at-jimi-hendrix-pedals-and-signal-chain"},{"title":"Jimi Hendrix Guitars & Gear | Detailed History of Guitars, Amps & Effects | Ground Guitar","url":"https://www.groundguitar.com/jimi-hendrix-gear/"},{"title":"New York City Guitar School How Do I Get THAT Tone: A Gear Rundown Of Several Legends - New York City Guitar School","url":"https://nycguitarschool.com/how-do-i-get-that-tone-a-gear-rundown-of-several-legends/"},{"title":"Jimi Hendrix Guitars - What Was the Legend's Setup?","url":"https://www.gear4music.com/blog/jimi-hendrix-guitars/"},{"title":"Jimi Hendrix Gear - Animedin.net","url":"https://animedin.net/an-jimi-hendrix-gear&FORM=QSRE4"},{"title":"Jimi Hendrix's Guitar Gear: Woodstock 1969 | Boost Guitar Pedals","url":"https://www.boostguitarpedals.co.uk/blogs/gear-of-the-gods/jimi-hendrixs-guitar-gear-woodstock-1969"},{"title":"The Gear Used on Are You Experienced by the Jimi Hendrix Experience","url":"https://guitar.com/features/artist-rigs/the-gear-used-on-are-you-experienced-by-the-jimi-hendrix-experience/"},{"title":"The gear Jimi Hendrix used for his bluesiest moments | Guitar World","url":"https://www.guitarworld.com/features/jimi-hendrix-blues-gear"}] | queued |
| 541 | So You Want to Be a Rock 'n' Roll Star (riff) | The Byrds | Roger McGuinn | Younger Than Yesterday (1967) | Rickenbacker 360-12 + built-in treble booster → Vox AC30, compressed jangle | queued |
| 542 | Mr. Tambourine Man (intro) | The Byrds | Roger McGuinn | Mr. Tambourine Man (1965) | Rickenbacker 360-12 → Vox AC30, Fairchild 670 studio compressor, chiming arpeggios | queued |
| 543 | White Room (verse/solo) | Cream | Eric Clapton | Wheels of Fire (1968) | "The Fool" psychedelic 1964 Gibson SG → cranked Marshall, Vox wah, vocal woman-tone leads | queued |
| 544 | Tales of Brave Ulysses (main) | Cream | Eric Clapton | Disraeli Gears (1967) | 1964 Gibson SG → Marshall, Vox wah (one of rock's earliest), liquid wah swells | queued |
| 545 | SWLABR (solo) | Cream | Eric Clapton | Disraeli Gears (1967) | 1964 Gibson SG, tone rolled off → cranked Marshall stack, thick woman tone | queued |
| 546 | Spoonful (live solo) | Cream | Eric Clapton | Wheels of Fire (1968) | Gibson Les Paul/SG → Marshall 100W stack, no pedals, sustained blues-rock fury | queued |
| 547 | Machine Gun (lead) | Band of Gypsys | Jimi Hendrix | Band of Gypsys (1970) | Fender Stratocaster → Marshall Super Lead 100W, Fuzz Face + Uni-Vibe, dive-bomb feedback wails | queued |
| 548 | House Burning Down (solo) | The Jimi Hendrix Experience | Jimi Hendrix | Electric Ladyland (1968) | Strat → Marshall Super Lead, Fuzz Face + Vox wah, jagged tremolo-picked stabs | queued |
| 549 | Bold as Love (outro solo) | The Jimi Hendrix Experience | Jimi Hendrix | Axis: Bold as Love (1967) | Strat → Marshall, Fuzz Face, swirling Roger Mayer phase/flange leads | queued |
| 550 | 1983... (A Merman I Should Turn to Be) (mood) | The Jimi Hendrix Experience | Jimi Hendrix | Electric Ladyland (1968) | Strat → Marshall Super Lead, Uni-Vibe + Fuzz Face, underwater swells | queued |
| 551 | Burning of the Midnight Lamp (intro) | The Jimi Hendrix Experience | Jimi Hendrix | Electric Ladyland (1968) | Strat → Marshall, Vox wah + Fuzz Face, harpsichord-like wah comping | queued |
| 552 | Somebody to Love (solo) | Jefferson Airplane | Jorma Kaukonen | Surrealistic Pillow (1967) | Guild Thunderbird → Standel Super Imperial, biting fuzz-edged single notes | queued |
| 553 | White Rabbit (lead) | Jefferson Airplane | Jorma Kaukonen | Surrealistic Pillow (1967) | Guild Thunderbird → Standel Super Imperial, bolero crescendo, clean-to-fuzz build | queued |
| 554 | 3/5 of a Mile in 10 Seconds (solo) | Jefferson Airplane | Jorma Kaukonen | Surrealistic Pillow (1967) | Guild Thunderbird → Standel Super Imperial, raw garage-psych lead | queued |
| 555 | The Ballad of You & Me & Pooneil (jam) | Jefferson Airplane | Jorma Kaukonen | After Bathing at Baxter's (1967) | Gibson ES-345 → Fender Twin Reverb, Ampeg Scrambler fuzz, sprawling acid lead | queued |
| 556 | China Cat Sunflower (lead) | Grateful Dead | Jerry Garcia | Europe '72 (1972) | "Alligator" 1957 Strat + Alembic Stratoblaster → Fender Twin Reverb, bell-clear single-coil runs | queued |
| 557 | Dark Star (jam) | Grateful Dead | Jerry Garcia | Live/Dead (1969) | Gibson SG → Fender Twin Reverb, clean modal exploration into feedback | queued |
| 558 | Sugar Magnolia (lead) | Grateful Dead | Jerry Garcia | American Beauty (1970) | "Alligator" Strat → Fender Twin Reverb, bright country-rock fills | queued |
| 559 | Black Magic Woman / Gypsy Queen (lead) | Santana | Carlos Santana | Abraxas (1970) | 1968 Gibson Les Paul → Fender Twin Reverb, singing sustain, vibrato-laden lead | queued |
| 560 | Soul Sacrifice (solo) | Santana | Carlos Santana | Santana (1969) | Gibson SG Special → Fender Twin Reverb, percussive Latin-rock attack | queued |
| 561 | Light My Fire (solo) | The Doors | Robby Krieger | The Doors (1967) | 1964 Gibson SG Special (P-90s) → Fender Twin Reverb w/ JBLs, modal flamenco-inflected lead | queued |
| 562 | When the Music's Over (lead) | The Doors | Robby Krieger | Strange Days (1967) | Gibson SG → Fender Twin Reverb, Maestro Fuzztone FZ-1 screams + feedback | queued |
| 563 | Five to One (riff) | The Doors | Robby Krieger | Waiting for the Sun (1968) | Gibson SG → Fender Twin Reverb, Maestro Fuzztone, gritty stomping fuzz | queued |
| 564 | The End (raga lead) | The Doors | Robby Krieger | The Doors (1967) | Gibson SG (P-90s) → Fender Twin Reverb, Indian-raga sustain and slides | queued |
| 565 | Mr. Soul (riff) | Buffalo Springfield | Neil Young | Buffalo Springfield Again (1967) | Gretsch 6120 Chet Atkins → tweed Fender Deluxe 5C3, "Satisfaction"-derived fuzzy riff | queued |
| 566 | Bluebird (lead) | Buffalo Springfield | Stephen Stills | Buffalo Springfield Again (1967) | Gibson Super 400CES → Fender amp, ringing electric breaks | queued |
| 567 | Broken Arrow (textures) | Buffalo Springfield | Neil Young | Buffalo Springfield Again (1967) | Gretsch 6120 → tweed Fender Deluxe, fragmented psych collage tones | queued |
| 568 | Heart Full of Soul (riff) | The Yardbirds | Jeff Beck | single (1965) | Borrowed Fender Esquire/Telecaster → Vox AC30, Sola Sound Tone Bender fuzz, sitar-like raga riff | queued |
| 569 | Shapes of Things (solo) | The Yardbirds | Jeff Beck | single (1966) | Fender Esquire → Vox AC30, Tone Bender fuzz, proto-raga feedback solo | queued |
| 570 | Happenings Ten Years Time Ago (dual lead) | The Yardbirds | Jeff Beck & Jimmy Page | single (1966) | Fender Telecasters → Vox/Marshall, Tone Bender fuzz, chaotic twin-guitar freakout | queued |
| 571 | Over Under Sideways Down (riff) | The Yardbirds | Jeff Beck | Roger the Engineer (1966) | Fender Esquire → Vox AC30, fuzz, descending Eastern-flavored hook | queued |
| 572 | Summertime Blues (solo) | Blue Cheer | Leigh Stephens | Vincebus Eruptum (1968) | 1968 Gibson SG → wall of Marshall 100W Super Lead stacks, Fuzz Face, proto-metal sludge | queued |
| 573 | Out of Focus (lead) | Blue Cheer | Leigh Stephens | Vincebus Eruptum (1968) | Gibson SG → stacked Marshall Super Leads cranked to 10, Fuzz Face roar | queued |
| 574 | In-A-Gadda-Da-Vida (solo) | Iron Butterfly | Erik Brann | In-A-Gadda-Da-Vida (1968) | Mosrite Ventures Mark I → Vox Super Beatle, Mosrite Fuzzrite, frantic psych lead | queued |
| 575 | Who Do You Love (live lead) | Quicksilver Messenger Service | John Cipollina | Happy Trails (1969) | Gibson SG → Fender Dual Showman + Wurlitzer horns / Standel bass amps, tremolo and feedback acid-rock | queued |
| 576 | Mona (live jam) | Quicksilver Messenger Service | John Cipollina | Happy Trails (1969) | Gibson SG → Fender Twin/Dual Showman hybrid stack, quivering bias-tremolo and slide | queued |
| 577 | East-West (modal lead) | The Paul Butterfield Blues Band | Mike Bloomfield | East-West (1966) | 1954 Gibson Les Paul Goldtop → Fender Twin/Super Reverb, raga-blues modal exploration | queued |
| 578 | 7 and 7 Is (solo) | Love | Johnny Echols | Da Capo (1966) | Gibson SG-style → Fender piggyback amp, explosive proto-punk fuzz burst | queued |
| 579 | Roller Coaster (lead) | The 13th Floor Elevators | Stacy Sutherland | The Psychedelic Sounds of... (1966) | Gibson ES-330 → blackface Fender Twin Reverb, Maestro FZ-1 Fuzz-Tone + reverb haze | queued |
| 580 | Magic Carpet Ride (solo) | Steppenwolf | Michael Monarch | The Second (1968) | Fender Esquire → Fender Concert (4x10, cranked), amp-overload feedback intro and fuzzy lead | queued |
| 581 | Nature's Way (lead) | Spirit | Randy California | Twelve Dreams of Dr. Sardonicus (1970) | Stratocaster → Ampeg V4 stack, Jordan Boss Tone fuzz, melodic ringing leads | queued |
| 582 | Crosscut Saw (Albert King / shuffle) | Albert King | Albert King | Born Under a Bad Sign (1967) | 1958 Gibson Flying V "Lucy", strings flipped lefty → solid-state Acoustic head + 2x15 cab, clean, fingers only | queued |
| 583 | As the Years Go Passing By (slow blues) | Albert King | Albert King | Born Under a Bad Sign (1967) | Gibson Flying V → Acoustic solid-state amp, flatwounds, no pedals, vocal upward bends | queued |
| 584 | Personal Manager (Albert King / slow) | Albert King | Albert King | King of the Blues Guitar (1969) | Gibson Flying V → Acoustic head 2x15, clean clipped attack | queued |
| 585 | The Hunter (Albert King / riff) | Albert King | Albert King | Born Under a Bad Sign (1967) | Gibson Flying V → Acoustic solid-state, clean punch, fingers | queued |
| 586 | Hide Away (Freddie King / instrumental) | Freddie King | Freddie King | Let's Hide Away and Dance Away (1961) | Gibson Les Paul goldtop → Fender tweed combo, clean, plastic+steel fingerpicks | queued |
| 587 | The Stumble (Freddie King / instrumental) | Freddie King | Freddie King | Let's Hide Away and Dance Away (1961) | Gibson Les Paul goldtop → Fender tweed amp, clean bright stinging tone | queued |
| 588 | Going Down (Freddie King / riff) | Freddie King | Freddie King | Getting Ready (1971) | Gibson ES-345 → Fender amp, slight overdrive, thumb/finger picks | queued |
| 589 | Sweet Little Angel (B.B. King / slow blues) | B.B. King | B.B. King | Live at the Regal (1965) | Gibson ES-355 "Lucille" → Fender twin-style combo, clean, vibrato vocal bends | queued |
| 590 | How Blue Can You Get (B.B. King / dynamics) | B.B. King | B.B. King | Live at the Regal (1965) | Gibson ES-355 "Lucille" → Fender combo, clean, neck pickup | queued |
| 591 | Stormy Monday (slow blues) | Bobby "Blue" Bland / T-Bone style | B.B. King | Live at the Regal (1965) | Gibson ES-355 → Fender amp, clean jazzy chord-melody | queued |
| 592 | First Time I Met the Blues (Buddy Guy / wild) | Buddy Guy | Buddy Guy | I Was Walking Through the Woods (1960) | Fender Stratocaster → Fender Bassman, edge-of-breakup, no pedals | queued |
| 593 | Stone Crazy (Buddy Guy / extended jam) | Buddy Guy | Buddy Guy | Left My Blues in San Francisco (1967) | Fender Stratocaster → Fender Bassman cranked, dynamic clean-to-dirty | queued |
| 594 | Damn Right I've Got the Blues (title / modern) | Buddy Guy | Buddy Guy | Damn Right, I've Got the Blues (1991) | polka-dot Fender Stratocaster → Fender Bassman, neck pickup, raw overdrive | queued |
| 595 | Mannish Boy (Muddy Waters / riff) | Muddy Waters | Muddy Waters | Hard Again (1977) | Fender Telecaster → Fender tweed amp, clean, slide stabs | queued |
| 596 | Hoochie Coochie Man (stop-time) | Muddy Waters | Muddy Waters | single (1954) | Fender Telecaster → small tweed combo, clean, thumb-picked slide | queued |
| 597 | Killing Floor (Howlin' Wolf / riff) | Howlin' Wolf | Hubert Sumlin | single (1964) | Gibson Les Paul → Fender amp, clean cutting tone, fingerstyle | queued |
| 598 | Wang Dang Doodle (Howlin' Wolf / groove) | Howlin' Wolf | Hubert Sumlin | The Real Folk Blues (1966) | Gibson Les Paul → Fender combo, clean, no pedals | queued |
| 599 | Hideaway / Have You Heard (Bluesbreakers / Beano) | John Mayall's Bluesbreakers | Eric Clapton | Blues Breakers with Eric Clapton (1966) | 1960 Les Paul Standard "Beano burst" → Marshall JTM45 combo cranked, no pedals | queued |
| 600 | Steppin' Out (Bluesbreakers / instrumental) | John Mayall's Bluesbreakers | Eric Clapton | Blues Breakers with Eric Clapton (1966) | 1960 Les Paul → Marshall JTM45 2x12, full-up overdrive | queued |
| 601 | Hideaway live feedback (Cream era) | Cream | Eric Clapton | Wheels of Fire (1968) | Gibson SG "The Fool" → Marshall 100W stack, sustain/feedback, no pedals | queued |
| 602 | Oh Well (Part 1) (Fleetwood Mac / riff) | Fleetwood Mac | Peter Green | Then Play On (1969) | 1959 Les Paul "Greeny" (out-of-phase neck) → Marshall, raw clean-edge tone | queued |
| 603 | The Supernatural (instrumental) | John Mayall's Bluesbreakers | Peter Green | A Hard Road (1967) | 1959 Les Paul "Greeny" → Marshall combo, sustained feedback, neck pickup | queued |
| 604 | Still Got the Blues (title / slow) | Gary Moore | Gary Moore | Still Got the Blues (1990) | 1959 Les Paul "Stripe" neck pickup → Marshall JTM45 + 1960B, Marshall Guv'nor boost | queued |
| 605 | Midnight Blues (Gary Moore / slow) | Gary Moore | Gary Moore | Still Got the Blues (1990) | 1959 Les Paul → Marshall JTM45, Guv'nor pedal, neck pickup vibrato | queued |
| 606 | A Fool No More (Gary Moore / Greeny) | Gary Moore | Gary Moore | Blues for Greeny (1995) | Peter Green's "Greeny" '59 Les Paul → Marshall, out-of-phase tones, no pedals | queued |
| 607 | A Million Miles Away (Rory / slow build) | Rory Gallagher | Rory Gallagher | Tattoo (1973) | battered 1961 Fender Stratocaster → Vox AC30 Normal channel + Dallas Rangemaster booster | queued |
| 608 | Bad Penny (Rory / riff) | Rory Gallagher | Rory Gallagher | Jinx (1982) | 1961 Stratocaster → Fender tweed / Vox AC30, Rangemaster treble booster | queued |
| 609 | The Messiah Will Come Again (slow instrumental) | Roy Buchanan | Roy Buchanan | Roy Buchanan (1972) | 1953 Telecaster "Nancy" → Fender Vibrolux cranked, reverb on 2, volume/tone controlled | queued |
| 610 | Sweet Dreams (Roy Buchanan / slow) | Roy Buchanan | Roy Buchanan | Roy Buchanan (1972) | 1953 Telecaster → Fender Vibrolux, clean, pinch-harmonic squeals, no pedals | queued |
| 611 | Mellow Down Easy (Butterfield / shuffle) | Paul Butterfield Blues Band | Mike Bloomfield | The Paul Butterfield Blues Band (1965) | Fender Telecaster/Les Paul → Fender Twin Reverb, clean bite | queued |
| 612 | Be Careful with a Fool (Johnny Winter / fast blues) | Johnny Winter | Johnny Winter | Johnny Winter (1969) | Gibson Firebird → Fender Twin / Music Man, slide, raw overdrive, thumbpick | queued |
| 613 | Dallas (Johnny Winter / acoustic-electric slide) | Johnny Winter | Johnny Winter | Johnny Winter (1969) | National steel resonator / Firebird → Fender amp, bottleneck slide | queued |
| 614 | Mind Your Own Business (Jeff Healey / shuffle) | Jeff Healey Band | Jeff Healey | See the Light (1988) | Fender Stratocaster played lap-style → Marshall JCM800, light overdrive | queued |
| 615 | While My Guitar Gently Weeps (Jeff Healey / cover) | Jeff Healey Band | Jeff Healey | See the Light (1988) | Strat lap-style → Marshall stack, smooth sustain, no pedals | queued |
| 616 | Midnight in Harlem (Tedeschi Trucks / slide) | Tedeschi Trucks Band | Derek Trucks | Revelator (2011) | 1961 Gibson SG, neck pickup → Fender Super Reverb, glass Dunlop 215 slide, no pedals | queued |
| 617 | Anyday (Derek Trucks / slide cover) | Tedeschi Trucks Band | Derek Trucks | Live: Everybody's Talkin' (2012) | Gibson SG → Fender Super Reverb, glass slide, fingerpicked | queued |
| 618 | Empty Arms (SRV deep cut / shuffle) | Stevie Ray Vaughan | Stevie Ray Vaughan | Soul to Soul (1985) | "Number One" Strat → Fender Vibroverb/Super Reverb + Marshall, Ibanez Tube Screamer | queued |
| 619 | Cold Shot (SRV / funk-blues) | Stevie Ray Vaughan | Stevie Ray Vaughan | Couldn't Stand the Weather (1984) | Strat "Number One" → Fender Vibroverb, Tube Screamer, neck pickup | queued |
| 620 | Tin Pan Alley (SRV / slow blues) | Stevie Ray Vaughan | Stevie Ray Vaughan | Couldn't Stand the Weather (1984) | Strat → Fender Super Reverb, very low volume clean, no drive | queued |
| 621 | Talk to Your Daughter (title / shuffle) | Robben Ford | Robben Ford | Talk to Your Daughter (1988) | 1960 Fender Telecaster → Dumble Overdrive Special #002 + 212EV cab (G12-65), smooth OD | queued |
| 622 | Help the Poor (Robben Ford / cover) | Robben Ford | Robben Ford | Talk to Your Daughter (1988) | Fender Telecaster → Dumble Overdrive Special, Celestion G12-65, no pedals | queued |
| 623 | Blue on Black (Kenny Wayne Shepherd / riff) | Kenny Wayne Shepherd | Kenny Wayne Shepherd | Trouble Is... (1997) | Fender Stratocaster → Fender Vibro-King / Dumble-style, Tube Screamer, slide-edged bends | queued |
| 624 | Lie to Me (Jonny Lang / shuffle) | Jonny Lang | Jonny Lang | Lie to Me (1997) | Fender Stratocaster → Fender Bassman / Twin, light overdrive, neck pickup | queued |
| 625 | Sloe Gin-era deep cut: Dust Bowl (Bonamassa) | Joe Bonamassa | Joe Bonamassa | Dust Bowl (2011) | 1959 Les Paul → Dumble / Marshall Silver Jubilee, Way Huge / Tube Screamer drive | queued |
| 626 | Mountain Time (Bonamassa / slow ballad) | Joe Bonamassa | Joe Bonamassa | So, It's Like That (2002) | Gibson Les Paul → Marshall, Tube Screamer, neck pickup, slow vibrato | queued |
| 627 | Marie (Walter Trout / slow blues) | Walter Trout | Walter Trout | Common Ground (2010) | Fender Stratocaster → Mesa/Boogie, overdrive, neck pickup vibrato | queued |
| 628 | Rosanna (solo) | Toto | Steve Lukather | Toto IV (1982) | Lukather's '60 Les Paul → Marshall, slight chorus/delay | queued |
| 629 | Links: [{"title":"Steve Lukather | Equipboard","url":"https://equipboard.com/pros/steve-lukather"},{"title":"Rig Rundown: Toto's Steve Lukather - Premier Guitar","url":"https://www.premierguitar.com/gear/rig-rundown-totos-steve-lukather"},{"title":"Watch Alex Skolnick demo Steve Lukather’s live rig and reveal what’s on the Toto guitarist’s pedalboard | Guitar World","url":"https://www.guitarworld.com/news/alex-skolnick-steve-lukather-rig-tour"},{"title":"Gear Rundown: Steve Lukather","url":"https://mixdownmag.com.au/features/gear-rundown-steve-lukather/"},{"title":"Steve Lukather Official Website - Gear","url":"http://www.stevelukather.com/artist/gear.aspx"},{"title":"Steve Lukather's NEW Pedalboard-RACKSYSTEMS | Rig-Talk","url":"https://www.rig-talk.com/forum/threads/steve-lukathers-new-pedalboard-racksystems.116512/"},{"title":"SteveLukather.com, February 2013 Past Gear Steve Lukather Tour gear 2006","url":"http://www.stevelukather.com/media/84498/pastgear.pdf"},{"title":"Toto Guitarist The Definitive Guide to Steve Lukather","url":"https://www.onlineguitarbase.com/stevelukathertotoguitarist/"},{"title":"Steve Lukather gear and sound | Fractal Audio Systems Forum","url":"https://forum.fractalaudio.com/threads/steve-lukather-gear-and-sound.197531/"}] | queued |
| 630 | Links: [{"title":"John Sykes | Equipboard","url":"https://equipboard.com/pros/john-sykes"},{"title":"John Sykes | Equipment","url":"https://www.johnsykes.com/equipment.html"},{"title":"John Sykes Isolated Guitar Only - Still of the Night - Whitesnake | Rig-Talk","url":"https://www.rig-talk.com/forum/threads/john-sykes-isolated-guitar-only-still-of-the-night-whitesnake.313986/"},{"title":"Gear Rundown: John Sykes","url":"https://mixdownmag.com.au/features/gear-rundown-john-sykes/"},{"title":"Legendary Tones Series -- Sykes Pack – Top Jimi Profiles","url":"https://topjimi.com/products/legendary-tones-series-sykes-pack"},{"title":"What guitar gear did John Sykes use on Whitesnake's 1987 album? - Quora","url":"https://www.quora.com/What-guitar-gear-did-John-Sykes-use-on-Whitesnakes-1987-album"},{"title":"John Sykes sound on Whitesnake '87","url":"https://www.thegearpage.net/board/index.php?threads%2Fjohn-sykes-sound-on-whitesnake-87.1297001%2F="},{"title":"John Sykes: Thin Lizzy, Whitesnake – MusicPlayers.com","url":"https://www.musicplayers.com/2017/07/john-sykes-thin-lizzy-whitesnake/"},{"title":"John Sykes | Dinosaur Rock Guitar","url":"http://www.dinosaurrockguitar.com/node/56"}] | queued |
| 631 | Links: [{"title":"“Be Careful What You Wish for”: Warren DeMartini Tells the Tale of Ratt’s 1984 Breakthrough Hit, “Round and Round” | GuitarPlayer","url":"https://www.guitarplayer.com/players/be-careful-what-you-wish-for-warren-demartini-tells-the-tale-of-ratts-1984-breakthrough-hit-round-and-round"},{"title":"Warren DeMartini’s 1987 Ratt Rig: Part 1 : WoodyTone!","url":"http://www.woodytone.com/2010/01/04/warren-demartinis-1987-ratt-rig-part-1/"},{"title":"Ratt - Warren Demartini Guitar Gear Rig and Equipment","url":"https://www.uberproaudio.com/who-plays-what/321-ratt-warren-demartini-guitar-gear-rig-and-equipment"},{"title":"Warren DeMartini, Ratt Guitarist Gear | Equipboard","url":"https://equipboard.com/pros/warren-demartini"},{"title":"Warren DeMartini | Dinosaur Rock Guitar","url":"https://www.dinosaurrockguitar.com/node/18"},{"title":"Warren DeMartini","url":"https://www.charvel.com/features/warren-demartini"},{"title":"DETAILED Warren DeMartini Gear Rundown : WoodyTone!","url":"https://www.woodytone.com/2010/04/12/detailed-warren-demartini-gear-rundown/"},{"title":"How did Warren DeMartini...? | Marshall Amp Forum","url":"https://marshallforum.com/threads/how-did-warren-demartini.63771/"},{"title":"Warren DeMartini Amp Settings & Gear - Ratt Guitar Tone!","url":"https://musicstrive.com/ratt-guitar-tone/"},{"title":"Charvel Warren DeMartini San Dimas Review - Premier Guitar","url":"https://www.premierguitar.com/gear/charvel-warren-demartini-san-dimas-review"}] | queued |
| 632 | Wheel in the Sky (solo) | Journey | Neal Schon | Infinity (1978) | Gibson Les Paul Custom → Peavey Mace, Echoplex tape echo for the soaring lead | queued |
| 633 | Lights (intro/lead) | Journey | Neal Schon | Infinity (1978) | Fender Strat (reverse bridge pickup) → Peavey Mace, clean-to-edge | queued |
| 634 | Stone in Love (solo) | Journey | Neal Schon | Escape (1981) | '77 Gibson Les Paul Deluxe (black) → Peavey Mace/Marshall, Echoplex | queued |
| 635 | Separate Ways (lead) | Journey | Neal Schon | Frontiers (1983) | Gibson Les Paul Custom → Marshall, Echoplex slap | queued |
| 636 | Hold the Line (riff/solo) | Toto | Steve Lukather | Toto (1978) | Les Paul → Marshall, tight crunch, doubled | queued |
| 637 | Africa (guitar pads) | Toto | Steve Lukather | Toto IV (1982) | Strat-style → clean amp, heavy chorus shimmer | queued |
| 638 | Jukebox Hero (riff) | Foreigner | Mick Jones | 4 (1981) | '57 Les Paul Custom (mid pickup removed) → modded 100W Marshall Plexi, Hiwatt cabs | queued |
| 639 | Urgent (rhythm) | Foreigner | Mick Jones | 4 (1981) | '57 Les Paul Custom → Marshall Plexi, Tele layered for sparkle | queued |
| 640 | Eye of the Tiger (riff) | Survivor | Frankie Sullivan | Eye of the Tiger (1982) | Strat + Les Paul → 100W Marshall JMP, tight muted chug | queued |
| 641 | Burning Heart (solo) | Survivor | Frankie Sullivan | Rocky IV OST (1985) | Les Paul → Marshall JMP, ProCo RAT | queued |
| 642 | Sister Christian (solo) | Night Ranger | Brad Gillis | Midnight Madness (1983) | '62 Fender Strat (Floyd Rose) → Mesa Boogie, dive-bomb whammy | queued |
| 643 | (You Can Still) Rock in America (lead) | Night Ranger | Brad Gillis | Midnight Madness (1983) | Fernandes Strat (Floyd) → Mesa Boogie, whammy squeals | queued |
| 644 | Don't Tell Me You Love Me (eight-finger solo) | Night Ranger | Jeff Watson | Dawn Patrol (1982) | Gibson Les Paul ('68 goldtop) → Marshall, wah | queued |
| 645 | Keep On Loving You (solo) | REO Speedwagon | Gary Richrath | Hi Infidelity (1980) | '59 Gibson Les Paul Standard → Marshall JMP 2104, wah | queued |
| 646 | Take It on the Run (solo) | REO Speedwagon | Gary Richrath | Hi Infidelity (1980) | Les Paul Standard → 50W non-master Marshall, wah | queued |
| 647 | Blue Collar Man (riff/solo) | Styx | Tommy Shaw | Pieces of Eight (1978) | white Les Paul Custom → Marshall Plexi + 4x12 | queued |
| 648 | Renegade (solo) | Styx | Tommy Shaw | Pieces of Eight (1978) | black Les Paul (maple board) → Marshall Plexi | queued |
| 649 | Too Much Time on My Hands (lead) | Styx | Tommy Shaw | Paradise Theatre (1981) | '59 Les Paul → Marshall, bright crunch | queued |
| 650 | Photograph (solo) | Def Leppard | Phil Collen | Pyromania (1983) | Fender Telecaster → Marshall JMP-1 / Randall power amp, 4x12s | queued |
| 651 | Rock of Ages (rhythm) | Def Leppard | Steve Clark | Pyromania (1983) | Gibson Les Paul → Marshall JCM800, Boss chorus | queued |
| 652 | You Give Love a Bad Name (solo) | Bon Jovi | Richie Sambora | Slippery When Wet (1986) | Kramer (DiMarzio PAFs) → 100W Marshall + Mesa Recto, doubled | queued |
| 653 | Livin' on a Prayer (talkbox/solo) | Bon Jovi | Richie Sambora | Slippery When Wet (1986) | Kramer Jersey Star → Marshall, Heil/Framptone talkbox, harmonizer | queued |
| 654 | Don't Look Back (lead) | Boston | Tom Scholz | Don't Look Back (1978) | '68 stripped goldtop Les Paul (DiMarzio Super Distortion) → modded Marshall "Mars," Hyperdrive (modded Echoplex) | queued |
| 655 | Heat of the Moment (power chords) | Asia | Steve Howe | Asia (1982) | late-'50s Gibson Les Paul Junior → Gibson amp, multi-tracked | queued |
| 656 | Only Time Will Tell (lead) | Asia | Steve Howe | Asia (1982) | Gibson ES-Artist → clean-ish amp, chorus | queued |
| 657 | The Analog Kid (solo) | Rush | Alex Lifeson | Signals (1982) | Fender Strat → Marshall combo + Hiwatt, heavy chorus | queued |
| 658 | Point of Know Return (riff) | Kansas | Kerry Livgren | Point of Know Return (1977) | Gibson Les Paul → 100W Marshall + 4x12 | queued |
| 659 | Surrender (riff) | Cheap Trick | Rick Nielsen | Heaven Tonight (1978) | Hamer Standard (Explorer-shape) → '60s Orange 80W 2x12 | queued |
| 660 | Dream Police (rhythm/solo) | Cheap Trick | Rick Nielsen | Dream Police (1979) | '78 Hamer (checkerboard Standard) → Orange combo | queued |
| 661 | Working for the Weekend (riff/solo) | Loverboy | Paul Dean | Get Lucky (1981) | rebuilt '64 Fender Strat → Hiwatt 50 + Marshall, Roland RE-301 Chorus Echo preamp | queued |
| 662 | Broken Wings (solo) | Mr. Mister | Steve Farris | Welcome to the Real World (1985) | Charvel San Dimas → Dumble Overdrive Special, Boss HM-2 | queued |
| 663 | Kyrie (lead) | Mr. Mister | Steve Farris | Welcome to the Real World (1985) | Charvel San Dimas → Dumble Overdrive Special, stereo via modded Boss CE-1 | queued |
| 664 | Still of the Night (solo) | Whitesnake | John Sykes | Whitesnake (1987) | Gibson Les Paul Custom (Dirty Fingers) → twin Mesa Boogie Coliseum MkIII, PCM41 short delay | queued |
| 665 | Round and Round (solo) | Ratt | Warren DeMartini | Out of the Cellar (1984) | Charvel super-Strat (Floyd) → Marshall Super Lead, Fender Super Champ blend | queued |
| 666 | Cum on Feel the Noize (solo) | Quiet Riot | Carlos Cavazo | Metal Health (1983) | Gibson Flying V → Marshall JCM800 2203, slapback delay | queued |
| 667 | More Than Words (intro) | Extreme | Nuno Bettencourt | Extreme II: Pornograffitti (1990) | Nuno's Washburn N4 → acoustic-leaning clean, fingerpicked | queued |
| 668 | Links: [{"title":"Mark Kendall Tone | Marshall Amp Forum","url":"https://marshallforum.com/threads/mark-kendall-tone.72048/"},{"title":"Interview: Mark Kendall Discusses 30 Years of Great White and New Live Album | Guitar World","url":"https://www.guitarworld.com/features/interview-mark-kendall-discusses-30-years-great-white-and"},{"title":"Mark Kendall's amps for Twice Shy record?? - JCFonline.com","url":"https://www.jcfonline.com/forum/equipment/artists-and-their-gear/52971-mark-kendall-s-amps-for-twice-shy-record/page2"},{"title":"Mark Kendall on Great White’s two tragedies, welcoming grunge | Guitar World","url":"https://www.guitarworld.com/artists/guitarists/mark-kendall-great-white"},{"title":"Mark Kendall of Great White Interview: My Career in 5 Songs - ClassicRockHistory.com","url":"https://www.classicrockhistory.com/mark-kendall-of-great-white-interview-my-career-in-5-songs/"},{"title":"Great White - Wikipedia","url":"https://en.wikipedia.org/wiki/Great_White"},{"title":"Great White - Mark Kendall Guitar Rig Gear and Equipment","url":"https://www.uberproaudio.com/who-plays-what/632-great-white-mark-kendall-guitar-rig-gear-and-equipment"},{"title":"Mark Kendall - La Bella Strings","url":"https://www.labella.com/artists/mark-kendall/"},{"title":"Once Bitten Twice Shy (1989): Great White's Rock Classic - Classic Rock Artists","url":"https://classicrockartists.com/great-white-once-bitten-twice-shy-1989/"},{"title":"Mark Kendall, Great White Guitarist Gear | Equipboard","url":"https://equipboard.com/pros/mark-kendall"}] | queued |
| 669 | Links: [{"title":"Robbin Crosby of Ratt’s Rig Circa 1987 : WoodyTone!","url":"http://www.woodytone.com/2010/01/08/robbin-crosby-of-ratts-rig-circa-1987/"},{"title":"Robbin Crosby | Equipboard","url":"https://equipboard.com/pros/robbin-crosby"},{"title":"Voices From The Past - Robbin Crosby: | The Tone Rooms","url":"https://www.thetonerooms.com/threads/voices-from-the-past-robbin-crosby.10831/"},{"title":"Robbin Crosby \"Catfish\" Replica (Ratt) | Marshall Amp Forum","url":"https://marshallforum.com/threads/robbin-crosby-catfish-replica-ratt.86365/"},{"title":"GIBSON Firebird 7 Celebrity owned ROBBIN CROSBY","url":"https://forum.gibson.com/topic/35823-gibson-firebird-7-celebrity-owned-robbin-crosby-ratt/"},{"title":"Robbin Crosby - Kunena - UberProAudio.com","url":"https://www.uberproaudio.com/forum/requests-and-research/258-robbin-crosby"},{"title":"Robbin Crosby - JCFonline.com","url":"https://www.jcfonline.com/forum/equipment/jackson-usa-guitars/140680-robbin-crosby"},{"title":"Carlos Cavazo Details His Ratt Gear : WoodyTone!","url":"http://www.woodytone.com/2010/04/30/carlos-cavazo-details-his-ratt-gear/"},{"title":"Warren DeMartini, Ratt Guitarist Gear | Equipboard","url":"https://equipboard.com/pros/warren-demartini"}] | queued |
| 670 | Lay It Down (main riff) | Ratt | Robbin Crosby | Out of the Cellar (1984) | Jackson/Charvel super-strat (Duncan JB) → beat-up Marshall with 25W Greenbacks, plugged near-straight in | queued |
| 671 | Wanted Man (rhythm) | Ratt | Warren DeMartini | Out of the Cellar (1984) | Charvel super-strat → Marshall Super Lead stack, slapback delay, raw plexi crunch | queued |
| 672 | Shout at the Devil (main riff) | Mötley Crüe | Mick Mars | Shout at the Devil (1983) | Gibson Les Paul Custom → Marshall Super Lead (plexi-style), Cry Baby wah for leads | queued |
| 673 | Looks That Kill (rhythm) | Mötley Crüe | Mick Mars | Shout at the Devil (1983) | Les Paul Custom → Marshall Super Lead, dark mid-scooped grind | queued |
| 674 | In My Dreams (solo) | Dokken | George Lynch | Back for the Attack (1987) | ESP Kamikaze → cranked Marshall, Boss DS-1, smooth legato leads | queued |
| 675 | Talk Dirty to Me (riff) | Poison | C.C. DeVille | Look What the Cat Dragged In (1986) | Charvel super-strat → Soldano (custom Mike Soldano build) blended with Crate G-60 and Marshall JTM45 | queued |
| 676 | I Want Action (rhythm) | Poison | C.C. DeVille | Look What the Cat Dragged In (1986) | B.C. Rich Mockingbird → Soldano + Marshall JTM45 stack, bright party crunch | queued |
| 677 | Seventeen (riff/solo) | Winger | Reb Beach | Winger (1988) | Kramer Pacer → Soldano SLO-100, tight high-gain shred | queued |
| 678 | Madalaine (lead) | Winger | Reb Beach | Winger (1988) | Kramer super-strat → Soldano SLO-100, fast legato runs | queued |
| 679 | Headed for a Heartbreak (solo) | Winger | Reb Beach | Winger (1988) | Kramer super-strat → Soldano SLO-100, soaring sustained leads | queued |
| 680 | Get the Funk Out (solo) | Extreme | Nuno Bettencourt | Extreme II: Pornograffitti (1990) | Washburn N4 → ADA MP-1 preamp into McIntosh tube power amp, BBE Sonic Maximizer | queued |
| 681 | Decadence Dance (riff) | Extreme | Nuno Bettencourt | Extreme II: Pornograffitti (1990) | Washburn N4 → ADA MP-1 → McIntosh power amp, dry snapped funk-metal chug | queued |
| 682 | Here I Go Again '87 (solo) | Whitesnake | John Sykes | Whitesnake (1987) | Les Paul Custom → Mesa/Boogie Coliseum, thick saturated lead | queued |
| 683 | Judgement Day (riff) | Whitesnake | Steve Vai | Slip of the Tongue (1989) | Ibanez JEM → early Soldano SLO-100 (the "pink" heads) plus Jose-modded Marshalls | queued |
| 684 | The Final Countdown (solo) | Europe | John Norum | The Final Countdown (1986) | 1965 Fender Stratocaster → Marshall JCM800 2205, Boss Octaver | queued |
| 685 | Rock the Night (rhythm) | Europe | John Norum | The Final Countdown (1986) | Fender Stratocaster → Marshall JCM800 2205, mid-gain crunch | queued |
| 686 | Metal Health (Bang Your Head) (riff) | Quiet Riot | Carlos Cavazo | Metal Health (1983) | Washburn A-series → Marshall JCM800 2203, MXR 1500 slapback delay | queued |
| 687 | We're Not Gonna Take It (rhythm) | Twisted Sister | Jay Jay French | Stay Hungry (1984) | "Pink Burst" 1978 Gibson Les Paul → non-master-volume Marshall Super Lead stacks | queued |
| 688 | I Wanna Rock (riff) | Twisted Sister | Jay Jay French | Stay Hungry (1984) | Pink Les Paul → Marshall Super Lead (50/100W mix), raw cranked plexi | queued |
| 689 | Youth Gone Wild (riff) | Skid Row | Dave "Snake" Sabo | Skid Row (1989) | Kramer super-strat → ADA MP-1 into McIntosh transistor power amp → Marshall 4x12, EHX Big Muff | queued |
| 690 | 18 and Life (intro/solo) | Skid Row | Dave "Snake" Sabo | Skid Row (1989) | Kramer → ADA MP-1 → McIntosh power amp, '72 Triangle Big Muff for lead bite | queued |
| 691 | Nobody's Fool (solo) | Cinderella | Tom Keifer | Night Songs (1986) | 1978 Gibson Les Paul Custom → early-'70s Marshall Super Lead 100W (rented), Boss overdrive | queued |
| 692 | Gypsy Road (riff) | Cinderella | Jeff LaBar | Long Cold Winter (1988) | Gibson Les Paul → Marshall Super Lead crunch, Boss overdrive | queued |
| 693 | To Be With You (intro) | Mr. Big | Paul Gilbert | Lean Into It (1991) | Ibanez (fixed-bridge) → clean/acoustic-leaning, jangly strummed | queued |
| 694 | Daddy, Brother, Lover, Little Boy (solo) | Mr. Big | Paul Gilbert | Lean Into It (1991) | Ibanez super-strat → ADA MP-1 preamp (Voodoo-modded), cordless-drill picking on solo | queued |
| 695 | Modern Day Cowboy (solo) | Tesla | Frank Hannon | Mechanical Resonance (1986) | Gibson Les Paul → Marshall stack, bluesy Thin Lizzy-flavored leads | queued |
| 696 | Little Suzi (riff) | Tesla | Frank Hannon | Mechanical Resonance (1986) | Gibson → Marshall, melodic mid-gain crunch | queued |
| 697 | Once Bitten, Twice Shy (solo) | Great White | Mark Kendall | …Twice Shy (1989) | Gibson ES-335 → Soldano SLO-100, pure non-metal bluesy lead tone | queued |
| 698 | Rock Me (rhythm) | Great White | Mark Kendall | Once Bitten… (1987) | 1962 Fender Bassman driven into natural saturation, Les Paul/335, plus Marshall | queued |
| 699 | Sex Action (riff) | L.A. Guns | Tracii Guns | L.A. Guns (1988) | Gibson/Charvel → Marshall JCM800 (his go-to record amp), sleazy raw crunch | queued |
| 700 | Rainbow in the Dark (solo) | Dio | Vivian Campbell | Holy Diver (1983) | 1977 Gibson Les Paul Deluxe (DiMarzio X2N) → stock Marshall JCM800, Boss SD-1 boost | queued |
| 701 | Fool for Your Loving '89 / Slip of the Tongue (rhythm) | Whitesnake | Adrian Vandenberg | Slip of the Tongue (1989) | Fernandes super-strat → modified Marshall JCM2240 100W + 50W Super Lead into Celestion 4x12 | queued |
| 702 | Hello Mary Lou (solo) | Ricky Nelson | James Burton | single (1961) | Burton's '53/'68 Tele → Fender, flatwound 'banjo-string' bends | queued |
| 703 | Links: [{"title":"Decoding Jerry Donahue’s 5-Way Telecaster Wiring - Premier Guitar","url":"https://www.premierguitar.com/diy/mod-garage/jerry-donahue-telecaster-wiring"},{"title":"Vintage V58JDAB Jerry Donahue Review - Premier Guitar","url":"https://www.premierguitar.com/gear/vintage-v58jdab-jerry-donahue-review"},{"title":"Fender Custom Shop Jerry Donahue Telecaster | Reverb","url":"https://reverb.com/p/fender-custom-shop-jerry-donahue-telecaster"},{"title":"Jerry Donahue | Equipboard","url":"https://equipboard.com/pros/jerry-donahue"},{"title":"Seymour Duncan Jerry Donahue Lead Tele | Seymour Duncan","url":"https://www.seymourduncan.com/single-product/jerry-donahue-lead-tele"},{"title":"Jerry Donahue - Wikipedia","url":"https://en.wikipedia.org/wiki/Jerry_Donahue"},{"title":"Jerry Donahue Telecaster","url":"https://www.thegearpage.net/board/index.php?threads%2Fjerry-donahue-telecaster.720032%2F="},{"title":"Jerry Donahue Bio - Hellecasters","url":"http://hellecasters.com/jerry-bio.html"},{"title":"Fender Japan Jerry Donahue Telecaster 1985 Sunburst | Reverb","url":"https://reverb.com/item/82031-fender-japan-jerry-donahue-telecaster-1985-sunburst"},{"title":"1997 Fender (Japan) Jerry Donahue \"Hellecasters\" Stratocaster Electric Guitar","url":"https://jakewildwood.blogspot.com/2022/05/1997-fender-japan-jerry-donahue.html"}] | queued |
| 704 | I Walk the Line (boom-chicka rhythm) | Johnny Cash | Luther Perkins | single (1956) | Borrowed '55 Fender Esquire → Fender Champ, palm-muted single-note "boom-chicka," paper threaded in strings for damping | queued |
| 705 | Act Naturally (intro/fills) | Buck Owens | Don Rich | single (1963) | '60s Fender Telecaster → blackface Fender Twin Reverb w/ Jensens, bright clean Bakersfield twang, no effects | queued |
| 706 | Together Again (lead) | Buck Owens | Don Rich | single (1964) | Fender Telecaster (later silver-sparkle) → Fender Twin Reverb, sweet clean double-stops behind the steel | queued |
| 707 | Tiger by the Tail (lead) | Buck Owens | Don Rich | single (1964) | Fender Telecaster → blackface Twin Reverb, driving treble-bridge twang, snappy hybrid picking | queued |
| 708 | Mama Tried (lead) | Merle Haggard | Roy Nichols | single (1968) | Telecaster w/ Gibson neck humbucker → dimed Fender Twin Reverb w/ JBLs, pedal-steel-style finger bends | queued |
| 709 | Workin' Man Blues (solo) | Merle Haggard | Roy Nichols | single (1969) | Fender Telecaster → Twin Reverb w/ JBLs cranked, aggressive Bakersfield string-bending lead | queued |
| 710 | Suspicious Minds (live, '70s) | Elvis Presley | James Burton | On Stage / TCB era (1969–73) | '69 Pink Paisley Telecaster → Fender Twin (K-model Lansing speakers), country-funk fills | queued |
| 711 | Mystery Train / That's All Right (TCB live) | Elvis Presley | James Burton | TCB Band era (1969–77) | Pink Paisley Tele → Fender Twin w/ JBLs, fast banjo-roll Tele runs | queued |
| 712 | Sugarfoot Rag (lead) | Hank Garland | Hank Garland | single (1949) | Bigsby-modified Epiphone Zephyr → Standel 25-L-15 (cowhide, JBL D-130), lightning-fast western-swing single-note runs | queued |
| 713 | El Paso (lead fills) | Marty Robbins | Grady Martin | Gunfighter Ballads (1959) | Bigsby/Gibson nylon-string Spanish-style lead → Bradley Studio amp, gut-string flamenco-tinged country lead | queued |
| 714 | Mr. Sandman (lead) | Chet Atkins | Chet Atkins | single (1955) | Gretsch 6120 → Ray Butts EchoSonic (built-in tape slapback), thumb-and-fingers fingerstyle with slap echo | queued |
| 715 | Yakety Axe (lead) | Chet Atkins | Chet Atkins | single (1965) | Gretsch Country Gentleman → Standel 25L15, staccato fingerstyle "yakety" picking | queued |
| 716 | Time Between (lead) | The Byrds | Clarence White | Younger Than Yesterday (1967) | '54 Telecaster (pre-StringBender) → Fender Vibrolux, flatpicked country-rock bends | queued |
| 717 | Nashville West (lead) | The Byrds | Clarence White | Dr. Byrds & Mr. Hyde (1969) | '54 Parsons/White StringBender Telecaster → Fender Vibrolux, pedal-steel B-string pulls | queued |
| 718 | Country Boy (lead) | Heads Hands & Feet | Albert Lee | Heads Hands & Feet (1971) | Telecaster → Music Man amp, blistering hybrid-picked country-rock runs | queued |
| 719 | Luxury Liner (lead) | Emmylou Harris | Albert Lee | Luxury Liner (1977) | Telecaster → Music Man 130-watt, rapid-fire pedal-steel-style bends and open-string cascades | queued |
| 720 | Amos Moses (riff/lead) | Jerry Reed | Jerry Reed | single (1970) | Baldwin electric (Prismatone) → studio amp, swamp-funk claw-style fingerpicked riff | queued |
| 721 | Guitar Man (riff) | Jerry Reed (and Elvis cut) | Jerry Reed | single (1967) | Baldwin electric → studio amp, syncopated claw-style fingerstyle hook | queued |
| 722 | Wichita Lineman (solo) | Glen Campbell | Glen Campbell (w/ Carol Kaye's instrument) | single (1968) | Danelectro six-string bass (Bass VI-style) → Fender amp w/ tremolo, deep tremolo-quivered melodic solo | queued |
| 723 | Sugarfoot Rag-era Galveston/Gentle on My Mind (lead) | Glen Campbell | Glen Campbell | singles (1967–69) | Fender solidbody → Fender amp, clean flatpicked rhythm-lead, Wrecking Crew session | queued |
| 724 | Are You Sure Hank Done It This Way (lead) | Waylon Jennings | Waylon Jennings | Dreaming My Dreams (1975) | Leather-wrapped '53 Telecaster → '72 Fender Super Six Reverb, Maestro Phaser swirl over outlaw groove | queued |
| 725 | Honky Tonk Man (lead) | Dwight Yoakam | Pete Anderson | Guitars, Cadillacs, Etc., Etc. (1986) | '56 Telecaster → '65 Deluxe Reverb (Twin transformers, EV speaker) + tube Echoplex, Bakersfield twang | queued |
| 726 | Guitars, Cadillacs (lead) | Dwight Yoakam | Pete Anderson | Guitars, Cadillacs, Etc., Etc. (1986) | '56 Tele → modded '65 Deluxe Reverb, Goodrich volume pedal, sharp clean honky-tonk lead | queued |
| 727 | Highway 40 Blues (solo) | Ricky Skaggs | Ray Flacke | Highways & Heartaches (1982) | Telecaster (11-gauge strings, high action) → Lab Series L9 1x15, behind-the-nut bends and chicken-pickin' flurries | queued |
| 728 | Oklahoma Borderline (solo) | Vince Gill | Vince Gill | The Things That Matter (1985) | White '53 blackguard Telecaster → driven Fender Deluxe-style amp, Sparkle Drive + DD-3 delays, fast bends | queued |
| 729 | One More Last Chance (solo) | Vince Gill | Vince Gill | I Still Believe in You (1992) | '53 blackguard Telecaster → driven Deluxe-style amp, compressed twangy lead | queued |
| 730 | Liza Jane (solo) | Vince Gill | Vince Gill | Pocket Full of Gold (1991) | '53 blackguard Telecaster → two Rivera amps in stereo, heavy compression + multiple delays | queued |
| 731 | Mud on the Tires (solo) | Brad Paisley | Brad Paisley | Mud on the Tires (2003) | Grey Crook Paisley Tele (G-bender) → '62 Vox AC30 + Dr. Z Z-28 (JBL D130), Boss CS-2, Aqua-Puss delay | queued |
| 732 | Time Well Wasted (lead) | Brad Paisley | Brad Paisley | Time Well Wasted (2005) | 52/57 Telecaster → Dr. Z EZG-50/Maz 38, Boss CS-2, Aqua-Puss delay, G-bender twang | queued |
| 733 | Hot Wired (lead) | Brent Mason | Brent Mason | Hot Wired (1997) | '67 "Brent Mason mod" Telecaster (mini-hum neck, Strat mid) → Matchless DC-30 / Fender Bassman, twangy session lead | queued |
| 734 | Steve Wariner instrumental (lead) | Steve Wariner | Steve Wariner | No More Mr. Nice Guy (2000) | '86 Glaser Telecaster (B-bender, Ron Ellis pickups) → '58 Fender Bassman, Atkins-style fingerstyle twang | queued |
| 735 | Johnny Hiland chicken-pickin' (lead) | Johnny Hiland | Johnny Hiland | Johnny Hiland (2004) | Fender Telecaster → Fender Twin, Wampler Ego comp + ISP Decimator, blazing pedal-steel bends | queued |
| 736 | Marty Stuart Tele showcase (lead) | Marty Stuart & His Fabulous Superlatives | Marty Stuart | Ghost Train era (2010) | Clarence White's '54 StringBender Telecaster → Fender Deluxe Reverb, B-bender pedal-steel licks | queued |
| 737 | The Humbler / 88 Elmira St. (lead) | Danny Gatton | Danny Gatton | 88 Elmira St. (1991) | '53 Telecaster w/ Joe Barden pickups → '63 Vibrolux / '58 Bassman (beefed transformers), genre-hopping bends, behind-nut pulls | queued |
| 738 | Redneck Jazz (lead) | Danny Gatton | Danny Gatton | Redneck Jazz (1978) | '53 Telecaster + Magic Dingus Box → Fender Vibrolux + Leslie/Echoplex switching, jazz-country fusion runs | queued |
| 739 | Hellecasters lead (Tele duel) | The Hellecasters | Jerry Donahue | The Return of the Hellecasters (1993) | Fender JD signature Telecaster (5-way wiring) → Fender amp, Deep Blue delay, extreme multi-string and behind-nut bends | queued |
| 740 | For the Love of God (main theme) | Steve Vai | Steve Vai | Passion and Warfare (1990) | Ibanez JEM → Carvin/Marshall, Eventide harmonizer, wah | queued |
| 741 | Tender Surrender (head + solo) | Steve Vai | Steve Vai | Alien Love Secrets (1995) | Ibanez JEM → Bogner Ecstasy into Laney power amp, Boss DS-1 boost, Cry Baby wah | queued |
| 742 | The Audience Is Listening (intro/solo) | Steve Vai | Steve Vai | Passion and Warfare (1990) | Ibanez Universe 7-string → modded Marshall, Eventide harmonizer, whammy/wah | queued |
| 743 | Always With Me, Always With You (main melody) | Joe Satriani | Joe Satriani | Surfing with the Alien (1987) | Ibanez JS prototype → Marshall, Chandler Tube Driver, chorus + delay | queued |
| 744 | Flying in a Blue Dream (title track) | Joe Satriani | Joe Satriani | Flying in a Blue Dream (1989) | Ibanez JS1 → silverface Fender Pro Reverb, Chandler Tube Driver, Boss DS-1 | queued |
| 745 | The Extremist (main theme) | Joe Satriani | Joe Satriani | The Extremist (1992) | Ibanez JS → Marshall, Chandler Tube Driver, wah | queued |
| 746 | Satch Boogie (solo) | Joe Satriani | Joe Satriani | Surfing with the Alien (1987) | Ibanez JS prototype → Marshall, Chandler Tube Driver, whammy bar dives | queued |
| 747 | Far Beyond the Sun (main theme) | Yngwie Malmsteen | Yngwie Malmsteen | Rising Force (1984) | scalloped '72 Strat "Duck" → 50-watt Marshall stacks, DOD Overdrive Preamp 250, Boss chorus | queued |
| 748 | Black Star (intro/solo) | Yngwie Malmsteen | Yngwie Malmsteen | Rising Force (1984) | scalloped Strat → Marshall 50-watt, DOD 250 boost, neoclassical vibrato | queued |
| 749 | Glasgow Kiss (main theme) | John Petrucci | John Petrucci | Suspended Animation (2005) | Ernie Ball Music Man JP6 → Mesa/Boogie Mark IV, Dunlop wah, TC Electronic delay | queued |
| 750 | Damage Control (solo) | John Petrucci | John Petrucci | Suspended Animation (2005) | EBMM JP6 → Mesa/Boogie Road King, Keeley-style comp, delay | queued |
| 751 | Bad Horsie (riff) | Steve Vai | Steve Vai | Alien Love Secrets (1995) | Ibanez JEM → Bogner Ecstasy, Morley Bad Horsie wah (signature), Boss DS-1 | queued |
| 752 | Trilogy Suite Op. 5 (main) | Yngwie Malmsteen | Yngwie Malmsteen | Trilogy (1986) | scalloped Strat → Marshall 50-watt stacks, DOD 250, Boss chorus | queued |
| 753 | Trademark (head) | Eric Johnson | Eric Johnson | Ah Via Musicom (1990) | '57 Strat "Virginia" → Fender Deluxe Reverb (clean), Maestro Echoplex EP-3, TC Stereo Chorus | queued |
| 754 | Desert Rose (lead) | Eric Johnson | Eric Johnson | Ah Via Musicom (1990) | Strat → '69 Marshall Super Lead 100, TS-808 boost, Echoplex, Fuzz Face | queued |
| 755 | Manhattan (clean theme) | Eric Johnson | Eric Johnson | Ah Via Musicom (1990) | Strat neck pickup → Fender Twin / Deluxe Reverb clean, Echoplex, TC Stereo Chorus | queued |
| 756 | Technical Difficulties (main riff) | Racer X | Paul Gilbert | Second Heat (1987) | Ibanez → Laney GH100L into Marshall cabs, MXR Distortion+, no-frills high gain | queued |
| 757 | Scarified (intro/solo) | Racer X | Paul Gilbert | Second Heat (1987) | Ibanez → Laney GH100L, MXR Distortion+, picking-driven shred | queued |
| 758 | Altitudes (main theme) | Jason Becker | Jason Becker | Perpetual Burn (1988) | Carvin/Hurricane → borrowed '70s Marshall half-stack, Boss SD-1 Super Overdrive, MXR Phase 90 | queued |
| 759 | Perpetual Burn (title track) | Jason Becker | Jason Becker | Perpetual Burn (1988) | superstrat → '70s Marshall half-stack, Boss SD-1, sweep-picked runs | queued |
| 760 | Go Off! (solos) | Cacophony | Jason Becker & Marty Friedman | Go Off! (1988) | Carvin DC guitars → Carvin X100B stacks, dual-lead harmonies, light overdrive | queued |
| 761 | Dragon's Kiss (title track) | Marty Friedman | Marty Friedman | Dragon's Kiss (1988) | superstrat → Marshall / borrowed stack, Boss overdrive, exotic-scale bends | queued |
| 762 | Tumeni Notes (main) | Dixie Dregs | Steve Morse | Dregs of the Earth (1980) | Frankenstein Tele-style (later Music Man) → Engl-style clean/crunch, volume-pedal swells, compressor | queued |
| 763 | Cruise Control (theme) | Dixie Dregs | Steve Morse | Industry Standard (1982) | custom multi-pickup guitar → Marshall/Engl, compressor, wet/dry delay | queued |
| 764 | Mind's Eye (title track) | Vinnie Moore | Vinnie Moore | Mind's Eye (1986) | Ibanez w/ DiMarzio Super Distortion → loaner Marshall (via Mike Varney), Ibanez Super Metal pedal | queued |
| 765 | The King's Cup (main) | Tony MacAlpine | Tony MacAlpine | Edge of Insanity (1986) | Kramer w/ DiMarzio → Peavey Classic XTV hybrid into 4x12s, neoclassical runs | queued |
| 766 | Electric Gypsy (main theme) | Andy Timmons | Andy Timmons | Ear X-tacy (1994) | Ibanez AT100 prototype → Mesa/Boogie Lone Star ("Fender on steroids"), light overdrive, delay | queued |
| 767 | Cry for You (lead) | Andy Timmons | Andy Timmons | Ear X-tacy (1994) | Ibanez AT100 → Mesa/Boogie Lone Star, vocal vibrato, plate-style reverb + delay | queued |
| 768 | Soothsayer (main theme) | Buckethead | Buckethead | Crime Slunk Scene (2006) | Gibson Buckethead Les Paul → Marshall JVM410H, Boss DD delay, soaring sustained leads | queued |
| 769 | Waves (intro/solo) | Guthrie Govan | Guthrie Govan | Erotic Cakes (2006) | mahogany Suhr Standard → Cornford MK50 II (Martin Kidd), light gain, fusion phrasing | queued |
| 770 | Erotic Cakes (title track) | Guthrie Govan | Guthrie Govan | Erotic Cakes (2006) | Suhr Standard HSH → Cornford MK50, TS-style boost, legato fusion | queued |
| 771 | Kick It All Over (main) | Greg Howe | Greg Howe | Greg Howe (1988) | superstrat w/ DiMarzio → Marshall, fusion-shred hybrid picking, light overdrive | queued |
| 772 | Midnight Express (instrumental) | Extreme | Nuno Bettencourt | Extreme II: Pornograffitti (1990) | Washburn N4 → ADA MP-1 preamp into Marshall, funk-metal phrasing | queued |
| 773 | Flight of the Wounded Bumblebee (solo) | Extreme | Nuno Bettencourt | Extreme II: Pornograffitti (1990) | Washburn N4 → ADA MP-1 / Marshall, fast scalar runs, tight gate | queued |
| 774 | Django / Mountain Time (instrumental head) | Joe Bonamassa | Joe Bonamassa | Live From the Royal Albert Hall (2009) | Gibson Les Paul → Marshall Silver Jubilee + Van Weelden Twinkleland, Fuzz Face, Tube Screamer | queued |
| 775 | Hocus Pocus (lead) | Gary Hoey | Gary Hoey | Hocus Pocus Live (1998) | superstrat → triple Marshall-style 4x12 rack rig, full live FX rack, yodel/whammy gimmicks | queued |
| 776 | Links: [{"title":"Billy Gibbons' Guitar Gear, Pedalboard & Amps | Equipboard","url":"https://equipboard.com/pros/billy-gibbons"},{"title":"How To Sound Like Billy Gibbons - Happy Bluesman","url":"https://happybluesman.com/how-sound-billy-gibbons/"},{"title":"ZZ Top Tres Hombres gear? - Amps - Harmony Central","url":"https://www.harmonycentral.com/forums/topic/1426617-zz-top-tres-hombres-gear/"},{"title":"Prime Cuts: ZZ Top | Guitar World","url":"https://www.guitarworld.com/features/prime-cuts-zz-top"},{"title":"Billy Gibbons' Guitars and Gear","url":"https://www.groundguitar.com/billy-gibbons-gear/"},{"title":"ZZ Top - Billy Gibbons Guitar Gear Rig and Equipment","url":"https://www.uberproaudio.com/who-plays-what/304-zz-top-billy-gibbons-guitar-gear-rig-and-equipment"},{"title":"ZZ Top early sound | My Les Paul Forum","url":"https://www.mylespaul.com/threads/zz-top-early-sound.15927/"},{"title":"Billy Gibbons Guitars And Gear: Complete Tone Guide (March 2026) - VVN News","url":"https://vintagevinylnews.com/billy-gibbons-guitars-and-gear/"},{"title":"Billy Gibbons Guitars & Gear List (2026 Update) - Guitar Lobby","url":"https://www.guitarlobby.com/billy-gibbons-guitars-and-gear/"},{"title":"Billy Gibbons | Dinosaur Rock Guitar","url":"https://www.dinosaurrockguitar.com/node/21"}] | queued |
| 777 | Whipping Post (lead) | Allman Brothers Band | Duane Allman | At Fillmore East (1971) | '58/'59 tobacco-burst Les Paul Standard → 50W Marshall plexi heads into 4x12s, straight in | queued |
| 778 | More Than a Feeling solo / Peace of Mind (lead) | Boston | Tom Scholz | Boston (1976) | '68 Les Paul Goldtop (P-90s) → 100W Marshall + prototype Power Soak attenuator | queued |
| 779 | Barracuda (riff) | Heart | Roger Fisher | Little Queen (1977) | Stratocaster → Music Man head (6L6) into 2x12 Celestions, homemade flanger | queued |
| 780 | Crazy on You (electric lead) | Heart | Roger Fisher | Dreamboat Annie (1976) | Les Paul → Fender Twin Reverb, cranked loud | queued |
| 781 | Magic Man (lead) | Heart | Roger Fisher | Dreamboat Annie (1976) | Custom Les Paul → Fender Twin Reverb, loud, repeat-echo solo | queued |
| 782 | Mississippi Queen (riff) | Mountain | Leslie West | Climbing! (1970) | '50s Les Paul Junior (single P-90) → Sunn Coliseum head, 4x12s w/ Eminence | queued |
| 783 | Funk #49 (riff) | James Gang | Joe Walsh | Rides Again (1970) | Fender Telecaster → blackface Fender Champ, straight in | queued |
| 784 | Walk Away (lead) | James Gang | Joe Walsh | Thirds (1971) | Les Paul (Page's future #1) → tweed Fender Champ | queued |
| 785 | Stranglehold (lead) | Ted Nugent | Ted Nugent | Ted Nugent (1975) | '60s Gibson Byrdland (hollowbody) → Fender Twin Reverb into Dual Showman 2x15, feedback | queued |
| 786 | Cat Scratch Fever (riff) | Ted Nugent | Ted Nugent | Cat Scratch Fever (1977) | '66 blond Gibson Byrdland → Fender Twin Reverb (double-tracked w/ Bell 15RV combo) | queued |
| 787 | (Don't Fear) The Reaper (riff) | Blue Öyster Cult | Buck Dharma | Agents of Fortune (1976) | Gibson ES-175 → Music Man 410-65 combo, clean chime | queued |
| 788 | The Needle and the Spoon (solo) | Lynyrd Skynyrd | Allen Collins | Second Helping (1974) | Gibson Firebird → Marshall Super Lead, wah-colored solo | queued |
| 789 | On the Hunt (harmony leads) | Lynyrd Skynyrd | Collins / King / Rossington | Nuthin' Fancy (1975) | Firebird + Strat + Les Paul → Marshall Super Leads, three-guitar attack | queued |
| 790 | Saturday Night Special (riff) | Lynyrd Skynyrd | Ed King | Nuthin' Fancy (1975) | '73 Stratocaster → 50W Marshall cranked, slight phaser | queued |
| 791 | Slow Ride (slide) | Foghat | Rod Price | Fool for the City (1975) | Modified late-'50s Les Paul Jr. slide, open E → Sunn Model T 100W stack | queued |
| 792 | Takin' Care of Business (rhythm/lead) | Bachman-Turner Overdrive | Randy Bachman | BTO II (1973) | '60 Les Paul → Garnet Herzog tube distortion unit into amp, creamy sustain | queued |
| 793 | You Ain't Seen Nothing Yet (lead) | Bachman-Turner Overdrive | Randy Bachman | Not Fragile (1974) | Fender Stratocaster → Garnet amp w/ Herzog drive | queued |
| 794 | Fly Like an Eagle (lead) | Steve Miller Band | Steve Miller | Fly Like an Eagle (1976) | Stratocaster → '59 Fender Bassman, Echoplex set to triplet repeats | queued |
| 795 | The Joker (slide/lead) | Steve Miller Band | Steve Miller | The Joker (1973) | Stratocaster → Fender Bassman-style amp, slide on the lead figure | queued |
| 796 | China Grove (riff) | Doobie Brothers | Tom Johnston | The Captain and Me (1973) | Gibson SG → Fender Bassman/Bandmaster, straight in | queued |
| 797 | Long Train Runnin' (rhythm) | Doobie Brothers | Tom Johnston | The Captain and Me (1973) | Gibson SG → Fender Bassman/Bandmaster, percussive single-coil funk | queued |
| 798 | We're an American Band (riff) | Grand Funk Railroad | Mark Farner | We're an American Band (1973) | Messenger guitar / Veleno aluminum → West Laboratories Fillmore 200W | queued |
| 799 | I'm Your Captain (Closer to Home) (lead) | Grand Funk Railroad | Mark Farner | Closer to Home (1970) | Messenger guitar → West Laboratories Fillmore 200W head | queued |
| 800 | Links: [{"title":"Caleb Followill's Guitar Gear, Pedalboard & Amps | Equipboard","url":"https://equipboard.com/pros/caleb-followill-kings-of-leon"},{"title":"Inside Kings of Leon Guitarist Caleb Followill's Live Rig - Premier Guitar","url":"https://www.premierguitar.com/videos/kings-of-leon-rig-explained"},{"title":"Kings of Leon - Caleb Followill Guitar Rig Gear and Equipment","url":"https://www.uberproaudio.com/who-plays-what/589-kings-of-leon-caleb-followill-guitar-rig-gear-and-equipment"},{"title":"Kings of Leon Live Rig (Caleb Followill) Explained by Builder Barry O'Neal of Xact Tone Solutions - YouTube","url":"https://www.youtube.com/watch?v=-8wzMvn4Ne8"},{"title":"Kings of Leons Guitar Rig 2009","url":"https://www.guitarlessonslondon.com/Kings-of-Leons-Guitar-Rig-2009/"},{"title":"Kings of Leon Members, Gear & Sound | Equipboard","url":"https://equipboard.com/band/kings-of-leon"},{"title":"Kings Of Rock’n’Roll: The Kings Of Leon Gear Guide | Guitar Player Gear Guide","url":"https://guitarplayer.wordpress.com/2009/02/19/kings-of-rocknroll-the-kings-of-leon-gear-guide/"},{"title":"Caleb Followill","url":"https://theguitars.tumblr.com/post/159066889741/caleb-followill"},{"title":"The XAct Tone Solutions chief pedal puzzle solver and ...","url":"https://www.facebook.com/premierguitar/videos/kings-of-leon-live-rig-caleb-followill-explained/2436794936517186/"},{"title":"Matthew Followill's Guitar Gear | Equipboard","url":"https://equipboard.com/pros/matthew-followill"}] | queued |
| 801 | Links: [{"title":"Ritchie Blackmore","url":"https://www.vintageguitar.com/32424/ritchie-blackmore-3/"},{"title":"Ritchie Blackmore | Equipboard","url":"https://equipboard.com/pros/ritchie-blackmore"},{"title":"Ritchie Blackmore: The Sorcerer of the Stratocaster | Guitardoor","url":"https://guitardoor.com/ritchie-blackmore-the-sorcerer-of-the-stratocaster/"},{"title":"Ritchie Blackmore Guitars and Gear 2026: Equipment Guide","url":"https://powersof10.com/ritchie-blackmore-guitars-and-gear/"},{"title":"Ritchie Blackmore's Guitars | Equipboard","url":"https://equipboard.com/pros/ritchie-blackmore?gear=guitars"},{"title":"The Highway Star — Too mellow and too muted","url":"https://www.thehighwaystar.com/news/2025/02/03/too-mellow-and-too-muted/"},{"title":"Ritchie Blackmore | Marshall Amp Forum","url":"https://marshallforum.com/threads/ritchie-blackmore.2996/"},{"title":"Ritchie Blackmore Guitars & Gear (2026 Update) - Guitar Lobby","url":"https://www.guitarlobby.com/ritchie-blackmore-guitars-and-gear/"},{"title":"The Highway Star — Gear","url":"https://www.thehighwaystar.com/keywords/gear/"},{"title":"The Highway Star — Blackmore erased from Machine Head?","url":"https://www.thehighwaystar.com/thsblog/2006/11/05/blackmore-erased-from-machine-head/"}] | queued |
| 802 | Links: [{"title":"Mick Ronson | Equipboard","url":"https://equipboard.com/pros/mick-ronson"},{"title":"Mick Ronson's tone during the Bowie era, Tonebender question - ilovefuzz.com","url":"http://ilovefuzz.com/viewtopic.php?t=29179"},{"title":"The Anatomy of Mick Ronson's Guitar Tone — Pro Audio Files","url":"https://theproaudiofiles.com/the-anatomy-of-mick-ronsons-guitar-tone/"},{"title":"How to Get Mick Ronson’s Guitar Tone on a Budget","url":"https://blog.sonicbids.com/how-to-get-mick-ronsons-guitar-tone-on-a-budget"},{"title":"Rick Tedesco And The Hunt For Mick Ronson's Ziggy Stardust Les Paul | The Guitar Hangar","url":"https://www.guitarhangar.com/guitar-hangar/rick-tedesco-and-the-mick-ronson-ziggy-stardust-les-paul/"},{"title":"Mick Ronson wah engaged rhythm sound | The Gear Page","url":"https://www.thegearpage.net/board/index.php?threads/mick-ronson-wah-engaged-rhythm-sound.251245/"},{"title":"The Incredible Story of Mick Ronson’s 'Ziggy Stardust'-Era 1968 Gibson Les Paul Custom | GuitarPlayer","url":"https://www.guitarplayer.com/gear/the-incredible-story-of-mick-ronsons-ziggy-stardust-era-1968-gibson-les-paul-custom"},{"title":"Mick Ronson - The Sound","url":"https://guitarinteractivemagazine.com/features/feature-mick-ronson-the-sound/"}] | queued |
| 803 | Links: [{"title":"Steve Marriott | Equipboard","url":"https://equipboard.com/pros/steve-marriott"},{"title":"Humble Pie 30 Days in the Hole | Telecaster Guitar Forum","url":"https://www.tdpri.com/threads/humble-pie-30-days-in-the-hole.798508/"},{"title":"Humble Pie – 30 Days In The Hole","url":"https://www.discogs.com/release/7232974-Humble-Pie-30-Days-In-The-Hole"},{"title":"STEVE MARRIOTT - 30 Days InThe Hole - YouTube","url":"https://www.youtube.com/watch?v=PzCy5ykGdZk"},{"title":"March 30 1972. #Humble Pie 🥧        #30 Days In The Hole.                                         #Black Berries. #SteveMarriott       01/30/1947 🕊 💔 🕊 04/20/1991 | TikTok","url":"https://www.tiktok.com/@.detroitrockcity/video/7432833588627885354"},{"title":"30 Days in the Hole - Wikipedia","url":"https://en.wikipedia.org/wiki/30_Days_in_the_Hole"},{"title":"Remembering Humble Pie and Steve Marriott's music","url":"https://www.facebook.com/groups/817715178744888/posts/1851411635375232/"},{"title":"30 Days In The Hole - song and lyrics by Humble Pie","url":"https://open.spotify.com/track/4WLsFiBOAeP2F9vkvJrD56"},{"title":"Humble Pie – 30 Days In The Hole (1972) | Music For Us!","url":"https://musicfor.us/2018/08/07/humble-pie-30-days-in-the-hole-1972/"},{"title":"Amazon.com: Humble Pie 30 Days In The Hole","url":"https://www.amazon.com/humble-pie-30-days-hole/s?k=humble+pie+30+days+in+the+hole"}] | queued |
| 804 | Links: [{"title":"“Aqualung was Ian’s riff. The solo was all done on the fly. If I hadn’t got it in two takes then it would have been a flute solo. That’s when Jimmy Page came up to say hello”: Martin Barre on Jethro Tull, the Aqualung sessions – and supporting Hendrix","url":"https://www.guitarworld.com/artists/guitarists/jethro-tull-martin-barre-looks-back-on-acqualung"},{"title":"“I loved his playing, I loved his presence.” Martin Barre on the guitarist that put the fire into his “Locomotive Breath” solo | GuitarPlayer","url":"https://www.guitarplayer.com/guitarists/martin-barre-on-the-guitarist-that-put-the-fire-into-his-locomotive-breath-solo"},{"title":"Martin Barre | Equipboard","url":"https://equipboard.com/pros/martin-barre"},{"title":"Jethro Tull Guitarist Martin Barre Talks Guitars, Jimi Hendrix and \"Aqualung\" | Guitar World","url":"https://www.guitarworld.com/gw-archive/dear-guitar-hero-jethro-tull-guitarist-martin-barre"},{"title":"Martin Barre Reflects on the Recording of Jethro Tull's 1971 Prog Milestone, ‘Aqualung‘ | GuitarPlayer","url":"https://www.guitarplayer.com/players/martin-barre-reflects-on-the-recording-of-jethro-tulls-1971-prog-milestone-aqualung"},{"title":"Interview: Martin Barre - Taking Aqualung on the Road - Premier Guitar","url":"https://www.premierguitar.com/artists/interview-martin-barre-taking-aqualung-on-the-road"},{"title":"“I’d met Leslie West, and like a lot of guitar players, you couldn’t meet Leslie West and come out unscathed”: Martin Barre explains how the Mountain man influenced his most iconic solo on Jethro Tull’s Aqualung","url":"https://www.guitarworld.com/artists/martin-barre-on-leslie-west-aqualung-influence"},{"title":"Martin Barre","url":"https://www.vintageguitar.com/2842/martin-barre/"},{"title":"Home - Martin Barre","url":"http://martinbarre.com/"},{"title":"Martin Barre - Jethro Tull","url":"https://jethrotull.com/band-member/martin-barre/"}] | queued |
| 805 | Links: [{"title":"David Gilmour Guitars & Gear | Complete List of Guitars, Amps, Effects & More | Ground Guitar","url":"https://www.groundguitar.com/david-gilmour-gear/"},{"title":"Animals 1977 – gilmourish","url":"https://www.gilmourish.com/?page_id=18"},{"title":"David Gilmour's Guitar Gear, Pedalboard & Equipment | Equipboard","url":"https://equipboard.com/pros/david-gilmour"},{"title":"Legends of Tone: David Gilmour - zZounds Music Blog","url":"https://blog.zzounds.com/2017/01/25/legends-of-tone-david-gilmour/"},{"title":"Dark Side of the Moon 1972-75 – gilmourish","url":"https://www.gilmourish.com/?page_id=16"},{"title":"The Gear Used By David Gilmour on Pink Floyd’s Dark Side of the Moon | Guitar.com","url":"https://guitar.com/features/artist-rigs/gear-used-by-david-gilmour-pink-floyd-dark-side-of-the-moon/"},{"title":"Classic tone: Dogs – gilmourish","url":"https://www.gilmourish.com/?p=356"},{"title":"David Gilmour Guitars and Gear (2026 Overview) - Guitar Lobby","url":"https://www.guitarlobby.com/david-gilmour-guitars-and-gear/"},{"title":"How to sound like David Gilmour - Happy Bluesman","url":"https://happybluesman.com/sound-like-david-gilmour/"},{"title":"Ultimate Guide to David Gilmour: Tone, Gear, Effects - Guitar Gear Finder","url":"https://guitargearfinder.com/guides/the-beginners-guide-to-david-gilmour-tone-gear-effects/"}] | queued |
| 806 | Hideaway | John Mayall's Bluesbreakers | Eric Clapton | Blues Breakers with Eric Clapton (1966) | Clapton's '60 Les Paul Standard (PAFs) → Marshall 1962 2x12 "Bluesbreaker" combo (JTM45 circuit) cranked, no pedals | queued |
| 807 | All Your Love | John Mayall's Bluesbreakers | Eric Clapton | Blues Breakers with Eric Clapton (1966) | '60 Les Paul Standard → Marshall 1962 "Bluesbreaker" combo, neck pickup, bridge-of-amp breakup, no pedals | queued |
| 808 | Badge (intro/arpeggio) | Cream | Eric Clapton | Goodbye (1969) | '63–65 reverse Firebird I → Marshall stack, Leslie cabinet on the chiming bridge figure | queued |
| 809 | Albatross | Fleetwood Mac | Peter Green | single (1968) | Fender Stratocaster (subtle vibrato) → Fender amp with heavy spring reverb, no pedals | queued |
| 810 | Black Magic Woman | Fleetwood Mac | Peter Green | single (1968) | "Greeny" '59 Les Paul (out-of-phase) → Orange Matamp / Fender, reverb, fingers | queued |
| 811 | The Green Manalishi (With the Two-Prong Crown) | Fleetwood Mac | Peter Green | single (1970) | "Greeny" '59 Les Paul (out-of-phase) → Orange Matamp, layered overdriven rhythm | queued |
| 812 | Good Times Bad Times | Led Zeppelin | Jimmy Page | Led Zeppelin (1969) | '59 "Dragon" Telecaster → Supro Coronado 1690T, Leslie-style stutter solo, no fuzz | queued |
| 813 | Black Mountain Side | Led Zeppelin | Jimmy Page | Led Zeppelin (1969) | Gibson J-200 acoustic (DADGAD) → close-miked, tabla accompaniment, no amp | queued |
| 814 | Heartbreaker (solo) | Led Zeppelin | Jimmy Page | Led Zeppelin II (1969) | '59 Les Paul Standard → Marshall Super Lead 100, first Marshall-recorded track, unaccompanied break | queued |
| 815 | Ten Years Gone | Led Zeppelin | Jimmy Page | Physical Graffiti (1975) | '59 Les Paul → Marshall, ~14 overdubbed harmony-guitar layers | queued |
| 816 | Substitute | The Who | Pete Townshend | single (1966) | Rickenbacker (jangle rhythm) → Marshall stack, power-chord drive | queued |
| 817 | Pinball Wizard (intro) | The Who | Pete Townshend | Tommy (1969) | Gibson J-200 acoustic suspended-chord figure → into the band's Hiwatt/Sound City electric wall | queued |
| 818 | Baba O'Riley | The Who | Pete Townshend | Who's Next (1971) | '59 Gretsch 6120 → '59 Fender Bandmaster 3x10, Edwards volume pedal swells over the synth | queued |
| 819 | Bargain | The Who | Pete Townshend | Who's Next (1971) | '59 Gretsch 6120 → Fender Bandmaster, Edwards pedal, Joe Walsh-gifted rig | queued |
| 820 | Brown Sugar (riff) | The Rolling Stones | Keith Richards | Sticky Fingers (1971) | open-G 5-string Telecaster → small blackface Fender (Deluxe/Pro Reverb), no pedals | queued |
| 821 | Honky Tonk Women | The Rolling Stones | Keith Richards | single (1969) | open-G Telecaster → small Fender combo, cowbell-and-riff interplay | queued |
| 822 | Can't You Hear Me Knocking (solo) | The Rolling Stones | Mick Taylor | Sticky Fingers (1971) | Gibson Les Paul → Ampeg VT-22, fluid Latin-jam lead over the outro | queued |
| 823 | Stay With Me | Faces | Ronnie Wood | A Nod Is As Good As a Wink (1971) | Gibson SG → Ampeg V-4/SVT, slide and crunch rhythm | queued |
| 824 | All Right Now (riff) | Free | Paul Kossoff | Fire and Water (1970) | '59 Les Paul Standard → cranked Marshall Super Lead 100, no master volume, fingers | queued |
| 825 | Can't Get Enough | Bad Company | Mick Ralphs | Bad Company (1974) | sunburst Les Paul Junior (open-C tuning, CCGCEC) → Marshall stack, no pedals | queued |
| 826 | 30 Days in the Hole | Humble Pie | Steve Marriott | Smokin' (1972) | '57 Les Paul Custom "Black Beauty" (middle PAF removed) → Marshall Plexi Super PA, raw crunch | queued |
| 827 | I Don't Need No Doctor (live) | Humble Pie | Steve Marriott | Performance: Rockin' the Fillmore (1971) | '57 Les Paul Custom → Marshall Plexi Super PA, cranked live grind | queued |
| 828 | Highway Star (solo) | Deep Purple | Ritchie Blackmore | Machine Head (1972) | CBS-era Stratocaster (neck/bridge only) → 200w Marshall Major, Hornby-Skewes treble booster, baroque solo | queued |
| 829 | Blowin' Free | Wishbone Ash | Andy Powell & Ted Turner | Argus (1972) | Powell's '67 Flying V + Turner's pre-CBS Stratocaster → Orange stacks, twin-lead harmony | queued |
| 830 | Day of the Eagle | Robin Trower | Robin Trower | Bridge of Sighs (1974) | '73 Stratocaster (maple neck) → Marshall JMP-100 Mark II into 1960B 4x12s, treble booster | queued |
| 831 | Bridge of Sighs | Robin Trower | Robin Trower | Bridge of Sighs (1974) | '73 Stratocaster → Marshall JMP-100, Uni-Vibe + treble booster + Electric Mistress, slow Hendrixian melody | queued |
| 832 | Caroline | Status Quo | Francis Rossi & Rick Parfitt | Hello! (1973) | Rossi's '57 green Telecaster + Parfitt's '60 white Tele → cranked Vox AC30s, 12-bar boogie | queued |
| 833 | Down Down | Status Quo | Francis Rossi & Rick Parfitt | On the Level (1974) | green Telecasters → Vox AC30 (later mixed with Marshall), driving boogie riff | queued |
| 834 | Ziggy Stardust (riff) | David Bowie | Mick Ronson | The Rise and Fall of Ziggy Stardust (1972) | stripped '68 Les Paul Custom → Marshall Major 200w, Tone Bender + Cry Baby (parked), Echoplex | queued |
| 835 | Moonage Daydream (solo) | David Bowie | Mick Ronson | The Rise and Fall of Ziggy Stardust (1972) | stripped '68 Les Paul Custom → Marshall Major, Tone Bender fuzz, soaring sustained outro | queued |
| 836 | Fearless | Pink Floyd | David Gilmour | Meddle (1971) | Black Strat (open-G/E tuning) → Hiwatt DR103 into WEM Super Starfinder cabs, clean-to-fuzz | queued |
| 837 | Rock Bottom (solo) | UFO | Michael Schenker | Phenomenon (1974) | Schenker's '70s Gibson Flying V → Marshall Super Lead 100, wah half-cocked | queued |
| 838 | Lights Out (main riff) | UFO | Michael Schenker | Lights Out (1977) | '70s Gibson Flying V → Marshall Super Lead 50W, modified Cry Baby + WEM Copicat echo | queued |
| 839 | Only You Can Rock Me (solo) | UFO | Michael Schenker | Obsession (1978) | '70s Gibson Flying V → 50W Marshall 1987, half-cocked Cry Baby, WEM Copicat | queued |
| 840 | Doctor Doctor (intro) | UFO | Michael Schenker | Phenomenon (1974) | '70s Gibson Flying V → Marshall Super Lead 100, minimal effects | queued |
| 841 | Emerald (twin solo) | Thin Lizzy | Brian Robertson | Jailbreak (1976) | 1973 Gibson Les Paul Deluxe (minihumbuckers) → early-'70s Marshall Super Lead 100, Cry Baby | queued |
| 842 | Cowboy Song (solo) | Thin Lizzy | Scott Gorham | Jailbreak (1976) | Gibson Les Paul Deluxe → Marshall Super Lead 100, treble-forward EQ | queued |
| 843 | Don't Believe a Word | Thin Lizzy | Brian Robertson | Johnny the Fox (1976) | Gibson Les Paul Deluxe → Marshall Super Lead 100, WEM Copicats boosting front end | queued |
| 844 | Black Rose (solo) | Thin Lizzy | Gary Moore | Black Rose: A Rock Legend (1979) | 1959 Gibson Les Paul "Greeny" → Marshall, Cry Baby wah | queued |
| 845 | Rock Candy (main riff) | Montrose | Ronnie Montrose | Montrose (1973) | Gibson Les Paul → tweed Fender Bandmaster 3x10, Electro-Harmonix Ram's Head Big Muff | queued |
| 846 | Bad Motor Scooter | Montrose | Ronnie Montrose | Montrose (1973) | Gibson Les Paul → tweed Fender Bandmaster 3x10, Big Muff + slide | queued |
| 847 | Space Station No. 5 | Montrose | Ronnie Montrose | Montrose (1973) | Gibson Les Paul → tweed Fender Bandmaster, Ram's Head Big Muff fuzz | queued |
| 848 | Boom Boom (Out Go the Lights) (solo) | Pat Travers Band | Pat Travers | Live! Go for What You Know (1979) | '60s Gibson Melody Maker (T-Top bridge) → 50W Marshall, Cry Baby + Maestro Echoplex | queued |
| 849 | The Sails of Charon (solo) | Scorpions | Uli Jon Roth | Taken by Force (1977) | 1975 Fender Stratocaster (maple) → 1972 Marshall 1959T Super Lead 100, Vox Cry Baby | queued |
| 850 | Blackout (main riff) | Scorpions | Matthias Jabs | Blackout (1982) | 1976 Gibson Explorer → 50W Marshall 1987 (1978), power-tube distortion only | queued |
| 851 | No One Like You (solo) | Scorpions | Matthias Jabs | Blackout (1982) | Gibson Explorer → 50W Marshall 1987, Cry Baby | queued |
| 852 | Juke Box Hero (riff) | Foreigner | Mick Jones | 4 (1981) | '57 black Gibson Les Paul Custom (middle pickup removed) → modified Marshall 100W Plexi, Hiwatt cabs, digital delay | queued |
| 853 | Long, Long Way from Home | Foreigner | Mick Jones | Foreigner (1977) | '58 Gibson Les Paul Custom → modified Marshall 100W Plexi, Hiwatt/Fane cabs | queued |
| 854 | Hair of the Dog (riff) | Nazareth | Manny Charlton | Hair of the Dog (1975) | Gibson Les Paul → Marshall Super Lead 100, talk-box on "Love Hurts"-era tracks | queued |
| 855 | Feel Your Love Tonight (solo) | Van Halen | Eddie Van Halen | Van Halen (1978) | "Frankenstrat" (PAF in maple Strat body) → 100W Marshall Super Lead (variac'd), MXR Phase 90 + Echoplex | queued |
| 856 | Atomic Punk | Van Halen | Eddie Van Halen | Van Halen (1978) | Frankenstrat → variac'd Marshall Super Lead 100, MXR Phase 90, Univox EC-80 echo | queued |
| 857 | Mean Street (intro) | Van Halen | Eddie Van Halen | Fair Warning (1981) | Frankenstrat → variac'd Marshall Super Lead 100, MXR flanger/Phase 90 | queued |
| 858 | Unchained (riff) | Van Halen | Eddie Van Halen | Fair Warning (1981) | Frankenstrat (loaded with flanger) → variac'd Marshall Super Lead, MXR Flanger | queued |
| 859 | Let Me Swim | Cactus | Jim McCarty | Cactus (1970) | Gibson Les Paul → Marshall Super Lead 100, minimal effects | queued |
| 860 | Problem Child (riff) | AC/DC | Angus Young | Let There Be Rock (1977) | 1968 Gibson SG Standard → Marshall Super Lead 100, guitar straight in | queued |
| 861 | Let There Be Rock (solo) | AC/DC | Angus Young | Let There Be Rock (1977) | 1968 Gibson SG Standard → cranked Marshall Super Lead 100, no pedals | queued |
| 862 | Riff Raff | AC/DC | Angus Young | Powerage (1978) | Gibson SG Standard → Marshall Super Lead 100, Malcolm's Gretsch Jet rhythm bed | queued |
| 863 | Shot Down in Flames (rhythm) | AC/DC | Malcolm Young | Highway to Hell (1979) | 1963 Gretsch "Jet Firebird" (G6131) → Marshall Super Bass 100, no pedals | queued |
| 864 | Toys in the Attic (riff) | Aerosmith | Joe Perry | Toys in the Attic (1975) | 1959 Gibson Les Paul → Marshall Super Lead 100, straight in | queued |
| 865 | Last Child (riff) | Aerosmith | Brad Whitford | Rocks (1976) | Gibson Les Paul → Marshall 100W, funk-rock rhythm | queued |
| 866 | Nobody's Fault | Aerosmith | Joe Perry / Brad Whitford | Rocks (1976) | Gibson Les Paul → Marshall Super Lead, B.C. Rich on Perry's leads | queued |
| 867 | Cold Gin (solo) | Kiss | Ace Frehley | Kiss (1974) | 1959 Gibson Les Paul (3-pickup) → Marshall Super Lead 100, no pedals | queued |
| 868 | Parasite | Kiss | Ace Frehley | Hotter Than Hell (1974) | Gibson Les Paul → Marshall Super Lead 100, straight in | queued |
| 869 | Man on the Silver Mountain | Rainbow | Ritchie Blackmore | Ritchie Blackmore's Rainbow (1975) | Fender Stratocaster → Marshall Major 200W, Hornby-Skewes treble booster | queued |
| 870 | Feel Like Makin' Love (riff) | Bad Company | Mick Ralphs | Straight Shooter (1975) | Gibson Les Paul Junior → cranked Marshall, no pedals | queued |
| 871 | Ready for Love | Bad Company | Mick Ralphs | Bad Company (1974) | Gibson Les Paul Junior (P-90) → Marshall Super Lead 100, straight in | queued |
| 872 | Rocket Queen (solo) | Guns N' Roses | Slash | Appetite for Destruction (1987) | 1959 Les Paul replica (Kris Derrig) → modified Marshall (rented "S.I.R. #36"), Cry Baby | queued |
| 873 | Nightrain (solo) | Guns N' Roses | Slash | Appetite for Destruction (1987) | Derrig Les Paul replica → modified Marshall 1959 Super Lead, MXR delay | queued |
| 874 | Oceans (Where Feet May Fail) (ambient swells) | Hillsong UNITED | worship guitarist | Zion (2013) | Strat/Tele → Vox AC30, Strymon Timeline dotted-eighth + BigSky, volume swells | queued |
| 875 | Touch the Sky (intro/build) | Hillsong UNITED | Nigel Hendroff | Empires (2015) | Strat → Matchless/AC30, Strymon Timeline rhythmic delay + BigSky, ebow-style swells | queued |
| 876 | So Will I (100 Billion X) (ambient pads) | Hillsong UNITED | Nigel Hendroff | Wonder (2017) | Telecaster → AC30, Strymon Timeline + BigSky cloud reverb, sustained swells | queued |
| 877 | Mighty to Save (lead) | Hillsong Worship | Nigel Hendroff | Mighty to Save (2006) | Strat → Vox AC30, Line 6 DL4 dotted-eighth delay, plate reverb | queued |
| 878 | What a Beautiful Name (lead/build) | Hillsong Worship | Nigel Hendroff | Let There Be Light (2016) | Telecaster → AC30, Strymon Timeline dotted-eighth + BigSky, swells into chorus | queued |
| 879 | Hosanna (intro riff) | Hillsong UNITED | Nigel Hendroff | All of the Above (2007) | Strat → AC30, Line 6 DL4 / analog delay dotted-eighth, hall reverb | queued |
| 880 | From the Inside Out (ambient) | Hillsong UNITED | Nigel Hendroff | United We Stand (2006) | Strat → AC30, DD-style delay + reverb, layered cleans | queued |
| 881 | No Longer Slaves (ambient bed) | Bethel Music | worship guitarist | We Will Not Be Shaken (2015) | Strat → Vox AC30, Strymon Timeline + BigSky, volume-swell pads | queued |
| 882 | Reckless Love (swells/lead) | Cory Asbury / Bethel Music | worship guitarist | Reckless Love (2018) | Strat → AC30, Strymon Timeline dotted-eighth + BigSky, ambient swells | queued |
| 883 | Goodness of God (ambient) | Bethel Music | worship guitarist | Victory (2019) | Strat → AC30/Strymon Iridium, Strymon Timeline + BigSky, sustained pads | queued |
| 884 | You Make Me Brave (ambient lead) | Bethel Music | worship guitarist | You Make Me Brave (2014) | Strat → AC30, Strymon Timeline + BigSky shimmer, swelling leads | queued |
| 885 | Ever Be (pads) | Bethel Music | worship guitarist | We Will Not Be Shaken (2015) | Telecaster → AC30, Strymon Timeline + BigSky, volume swells | queued |
| 886 | This Is Amazing Grace (intro riff) | Phil Wickham | worship guitarist | The Ascension (2013) | Strat → Vox AC30, dotted-eighth delay (Strymon Timeline), plate reverb | queued |
| 887 | Living Hope (build/lead) | Phil Wickham | worship guitarist | Living Hope (2018) | Tele/Strat → AC30, Strymon Timeline dotted-eighth + BigSky, swelling build | queued |
| 888 | House of the Lord (lead) | Phil Wickham | worship guitarist | Hymn of Heaven (2021) | Strat → AC30, Strymon Timeline rhythmic delay + reverb, anthemic lead | queued |
| 889 | O Come to the Altar (ambient) | Elevation Worship | worship guitarist | Here as in Heaven (2016) | Strat → AC30, Strymon Timeline + Klon drive, BigSky pads | queued |
| 890 | Graves Into Gardens (lead/build) | Elevation Worship | worship guitarist | Graves Into Gardens (2020) | Strat → AC30, Strymon Timeline dotted-eighth + BigSky, swelling lead | queued |
| 891 | Do It Again (ambient swells) | Elevation Worship | worship guitarist | There Is a Cloud (2017) | Tele → AC30, Strymon Timeline + BigSky, volume swells | queued |
| 892 | The Blessing (pads) | Elevation Worship / Kari Jobe / Cody Carnes | worship guitarist | Graves Into Gardens (2020) | Strat → AC30, Strymon Timeline + BigSky shimmer, sustained pads | queued |
| 893 | How Great Is Our God (lead) | Chris Tomlin | Daniel Carson | Arriving (2004) | Fender Tele Thinline → Vox AC30, Line 6 DL4 dotted-eighth delay, light reverb | queued |
| 894 | Our God (intro/lead) | Chris Tomlin | Daniel Carson | And If Our God Is for Us (2010) | Tele Thinline → AC30/Matchless, Strymon Timeline + Crowther Hot Cake drive, dotted-eighth | queued |
| 895 | Holy Forever (lead) | Chris Tomlin | Daniel Carson | Always (2022) | Tele Thinline → AC30, Strymon Timeline dotted-eighth + reverb, anthemic lead | queued |
| 896 | Whom Shall I Fear (lead) | Chris Tomlin | Daniel Carson | Burning Lights (2013) | Tele → AC30, Strymon Timeline + Hot Cake, dotted-eighth delay | queued |
| 897 | Everlasting God (lead/build) | Lincoln Brewster | Lincoln Brewster | Let the Praises Ring (2005) | Fender Strat (DiMarzio Area pickups) → Line 6 POD, BD-2 Blues Driver, DD-3 delay, shred leads | queued |
| 898 | Today Is the Day (lead) | Lincoln Brewster | Lincoln Brewster | Today Is the Day (2008) | Signature Strat → POD HD500 direct, Full-Drive 2 drive, delay + reverb, melodic shred | queued |
| 899 | Your Grace Is Enough (lead) | Lincoln Brewster | Lincoln Brewster | Today Is the Day (2008) | Strat → POD HD500, BD-2/Full-Drive, dotted-eighth delay, bright cleans | queued |
| 900 | Your Love Never Fails (ambient) | Jesus Culture | worship guitarist | Come Away (2010) | Strat → AC30, Line 6 DL4 / Strymon Timeline + BigSky, swelling pads | queued |
| 901 | Rooftops (lead/build) | Jesus Culture | worship guitarist | Awakening: Live from Chicago (2011) | Strat → AC30, Strymon Timeline dotted-eighth + reverb, anthemic lead | queued |
| 902 | Set a Fire (ambient swells) | Jesus Culture | worship guitarist | Live from New York (2012) | Tele → AC30, Strymon Timeline + BigSky, volume swells | queued |
| 903 | One Thing Remains (ambient) | Jesus Culture / Kristian Stanfill | worship guitarist | Passion: White Flag (2012) | Strat → AC30, Strymon Timeline + reverb, sustained pads | queued |
| 904 | Build My Life (ambient) | Passion / Pat Barrett | worship guitarist | Worthy of Your Name (2017) | Tele → AC30, Strymon Timeline + BigSky, volume-swell pads | queued |
| 905 | Dare You to Move (dual-amp leads) | Switchfoot | Drew Shirley | The Beautiful Letdown (2003) | Elliott Tonemaster → '65 London head + Supro Super, TS808 (Keeley), Line 6 DL4 delay | queued |
| 906 | Meant to Live (riff) | Switchfoot | Jon Foreman / Drew Shirley | The Beautiful Letdown (2003) | Gretsch/Strat → TopHat King Royale / Budda Superdrive, overdrive + slap delay | queued |
| 907 | Stars (ambient verses) | Switchfoot | Drew Shirley | Nothing Is Sound (2005) | Elliott → Vox AC30 + dual amps, Holy Grail reverb, DL4 delay swells | queued |
| 908 | Brother (lead) | NEEDTOBREATHE | Bo Rinehart | Rivers in the Wasteland (2014) | Gibson Les Paul Standard → tweed/combo amp, Line 6 DL4 delay, room reverb | queued |
| 909 | Multiplied (clean lead) | NEEDTOBREATHE | Bo Rinehart | Rivers in the Wasteland (2014) | Les Paul → vintage combo, Visual Sound Route 66 drive, slap delay, light reverb | queued |
| 910 | Monster (lead/riff) | Skillet | Ben Kasica | Awake (2009) | PRS Custom 22 → Mesa Boogie Dual Rectifier + Marshall 1987X, tube-screamer drive, tight gate | queued |
| 911 | Feel Invincible (lead) | Skillet | Seth Morrison | Unleashed (2016) | PRS SC250 / Tremonti → Mesa Dual Rectifier + PRS Archon, Source Audio Nemesis delay, Blue Sky reverb | queued |
| 912 | I Can Only Imagine (build/lead) | MercyMe | Mike Scheuchzer | Almost There (2001) | Strat → Fender/Vox-style combo, chorus + delay, swelling clean lead | queued |
| 913 | Even So Come (ambient) | Passion / Kristian Stanfill | worship guitarist | Even So Come (2015) | Tele → AC30, Strymon Timeline dotted-eighth + BigSky, swelling pads | queued |
| 914 | Forever (Crowder) (ambient/loops) | Kari Jobe / Bethel | worship guitarist | Majestic (2014) | Strat → AC30, Strymon Timeline + BigSky, layered ambient swells | queued |
| 915 | Million Little Miracles (ambient) | Maverick City Music / Elevation | worship guitarist | Old Church Basement (2021) | Strat → AC30/Iridium, Strymon Timeline + BigSky, volume swells | queued |
| 916 | Wake (build) | Hillsong Young & Free | worship guitarist | We Are Young & Free (2013) | Strat → AC30, Strymon Timeline + Mobius modulation, synth-paired ambient lead | queued |
| 917 | Bleed American (riff) | Jimmy Eat World | Tom Linton | Bleed American (2001) | Les Paul → Marshall JMP, driving rhythm grind | queued |
| 918 | A Praise Chorus (lead) | Jimmy Eat World | Jim Adkins | Bleed American (2001) | Tele → later Vox AC30 Custom Classic for chime, layered jangle | queued |
| 919 | Basket Case (riff) | Green Day | Billie Joe Armstrong | Dookie (1994) | 'Blue' Fernandes Strat w/ Duncan JB bridge → Dookie-modded Marshall 1959SLP Plexi, no pedals | queued |
| 920 | When I Come Around (riff) | Green Day | Billie Joe Armstrong | Dookie (1994) | 'Blue' Strat → modded Marshall 1959SLP ("Pete"), single-amp punk crunch | queued |
| 921 | Longview (verse) | Green Day | Billie Joe Armstrong | Dookie (1994) | 'Blue' Strat → Marshall 1959SLP, clean-to-dirty dynamic | queued |
| 922 | American Idiot (riff) | Green Day | Billie Joe Armstrong | American Idiot (2004) | 1956 Les Paul Junior ('Floyd') P90 → modded Marshall "Idiot Amp" + Park 75, spiky P90 bite | queued |
| 923 | Boulevard of Broken Dreams (lead) | Green Day | Billie Joe Armstrong | American Idiot (2004) | Les Paul Junior P90 → tweed Fender Tremolux clean / Marshall crunch | queued |
| 924 | Dammit (riff) | Blink-182 | Tom DeLonge | Dude Ranch (1997) | 'Sticker' Strat w/ DiMarzio X2N bridge humbucker → Mesa Boogie, single-pickup buzz | queued |
| 925 | What's My Age Again? (riff) | Blink-182 | Tom DeLonge | Enema of the State (1999) | Strat/Les Paul w/ Duncan Invader → Mesa Boogie + Marshall JCM900 dual-amp dirty mids | queued |
| 926 | All the Small Things (riff) | Blink-182 | Tom DeLonge | Enema of the State (1999) | Strat single-humbucker → Mesa Boogie/JCM900 blend, bright pop-punk chug | queued |
| 927 | Fat Lip (riff) | Sum 41 | Dave Baksh | All Killer No Filler (2001) | PRS Singlecut → Marshall JCM2000 DSL, snotty bridge-pickup crunch | queued |
| 928 | In Too Deep (chorus) | Sum 41 | Deryck Whibley | All Killer No Filler (2001) | Gibson SG Classic → Marshall JCM2000 DSL, glossy power-pop drive | queued |
| 929 | Still Waiting (riff) | Sum 41 | Dave Baksh | Does This Look Infected? (2002) | PRS SC-250 → Marshall JCM800 + Diezel layered, heavier punk-metal grind | queued |
| 930 | Welcome to the Black Parade (lead) | My Chemical Romance | Ray Toro | The Black Parade (2006) | Les Paul Standard w/ Duncan Phat Cat P90s → Marshall JCM800 + Ibanez TS9 boost | queued |
| 931 | I'm Not Okay (I Promise) (riff) | My Chemical Romance | Ray Toro | Three Cheers for Sweet Revenge (2004) | Les Paul → Marshall, punchy pop-punk-emo crunch | queued |
| 932 | Helena (lead) | My Chemical Romance | Ray Toro | Three Cheers for Sweet Revenge (2004) | Les Paul → Marshall, melodic lead bite | queued |
| 933 | Sugar, We're Goin Down (solo) | Fall Out Boy | Joe Trohman | From Under the Cork Tree (2005) | Fender Telecaster → Orange Rockerverb/Thunderverb, sharp emo-pop lead | queued |
| 934 | This Ain't a Scene (riff) | Fall Out Boy | Joe Trohman | Infinity on High (2007) | Tele Deluxe-style → Orange Rockerverb, bright modern crunch | queued |
| 935 | Misery Business (riff) | Paramore | Josh Farro | Riot! (2007) | Telecaster Deluxe humbucker → Marshall JCM2000 DSL + Mesa Dual Rectifier, snappy pop-punk | queued |
| 936 | crushcrushcrush (riff) | Paramore | Josh Farro | Riot! (2007) | Tele Deluxe → Marshall JCM800, driving chug with DigiTech Whammy accents | queued |
| 937 | Ignorance (riff) | Paramore | Taylor York / Josh Farro | Brand New Eyes (2009) | Les Paul → Marshall JCM800 (Dookie amp), tight modern rock crunch | queued |
| 938 | My Own Worst Enemy-era / Cute Without the 'E' (Cut from the Team) (riff) | Taking Back Sunday | John Nolan | Tell All Your Friends (2002) | Guild M-75 Aristocrat / Tele Deluxe → Supro Thunderbolt + Boss DS-2, raw emo crunch | queued |
| 939 | The Artist in the Ambulance (riff) | Thrice | Teppei Teranishi | The Artist in the Ambulance (2003) | electric → Mesa Boogie Dual Rectifier, parked-wah melodic post-hardcore | queued |
| 940 | Stare at the Sun (lead) | Thrice | Dustin Kensrue / Teppei Teranishi | The Artist in the Ambulance (2003) | electric → Mesa Boogie Dual Rectifier, soaring twin-guitar leads | queued |
| 941 | My Friends Over You (riff) | New Found Glory | Chad Gilbert | Sticks and Stones (2002) | Gibson Les Paul Custom → Mesa Boogie Dual Rectifier Solo Head, chunky pop-punk | queued |
| 942 | Ocean Avenue (riff) | Yellowcard | Ryan Mendez | Ocean Avenue (2003) | Gibson Les Paul Custom → Mesa Boogie Dual Rectifier, bright violin-backed crunch | queued |
| 943 | The Reckless and the Brave-era / Sing the Sorrow Girl's Not Grey (riff) | AFI | Jade Puget | Sing the Sorrow (2003) | Les Paul / SG → producer's Marshall + Mesa Dual Rectifier blend, dark melodic punk | queued |
| 944 | The Taste of Ink (riff) | The Used | Quinn Allman | The Used (2002) | Telecaster '72 Deluxe-style → Marshall JCM2000 + Line 6 DL4, frantic emo-rock | queued |
| 945 | All That I've Got (riff) | The Used | Quinn Allman | In Love and Death (2004) | Gibson SG → Marshall JCM2000, melodic post-hardcore crunch | queued |
| 946 | Savior (riff) | Rise Against | Zach Blair | Appeal to Reason (2008) | Les Paul Custom w/ Duncan Distortion → '70s Marshall JMP + Ibanez TS9, melodic-hardcore drive | queued |
| 947 | Prayer of the Refugee (riff) | Rise Against | Zach Blair | The Sufferer & the Witness (2006) | Les Paul Custom → Marshall JMP, urgent punk crunch | queued |
| 948 | A Boy Brushed Red... (Living in Black and White) (riff) | Underoath | Tim McTague | They're Only Chasing Safety (2004) | Tele HH w/ Duncan JB → Marshall JCM800 2203 + Ibanez TS808, screamo chug | queued |
| 949 | Writing on the Walls (riff) | Underoath | Tim McTague | Define the Great Line (2006) | SG Special → Marshall JCM800 2203, heavy post-hardcore | queued |
| 950 | The Downfall of Us All (riff) | A Day to Remember | Neil Westfall | Homesick (2009) | electric → EVH 5150 III + Marshall JCM800 (Kemper-profiled), easycore breakdown crunch | queued |
| 951 | Mr. Highway's Thinking About the End-era / Have Faith in Me (chorus) | A Day to Remember | Kevin Skaff | Homesick (2009) | electric → Marshall JCM800 + EVH 5150 III, big melodic chorus | queued |
| 952 | Sic Transit Gloria (Glory Fades) (riff) | Brand New | Jesse Lacey | Deja Entendu (2003) | '70s Fender Telecaster → Marshall MKII into Matchless ES412, dynamic indie-emo | queued |
| 953 | The Quiet Things That No One Ever Knows (riff) | Brand New | Vincent Accardi / Jesse Lacey | Deja Entendu (2003) | Telecaster → Marshall MKII, jangly-to-driven emo | queued |
| 954 | Hands Down (acoustic-electric) | Dashboard Confessional | Chris Carrabba | A Mark, a Mission, a Brand, a Scar (2003) | Gibson J-185 / Mustang → Vox AC30 HWH + Bogner Shiva, emo strum-pop | queued |
| 955 | Vindicated (riff) | Dashboard Confessional | Chris Carrabba | Spider-Man 2 OST (2004) | 1967 Fender Mustang → Vox AC30 HWH + Bogner Shiva, driving emo-rock | queued |
| 956 | Buried a Lie (riff) | Senses Fail | Garrett Zablocki | Let It Enfold You (2004) | Gibson "The SG" → Mesa Boogie Dual Rectifier + Marshall JCM2000 + Boss SD-1, screamo crunch | queued |
| 957 | Understanding in a Car Crash (riff) | Thursday | Tom Keeley / Steve Pedulla | Full Collapse (2001) | Tele w/ Duncan Hot Rails → Marshall JCM800 + Vox AC30, melodic post-hardcore | queued |
| 958 | Smashed Into Pieces (riff) | Silverstein | Neil Boshart | Discovering the Waterfront (2005) | Les Paul Custom → Mesa Boogie Dual Rectifier + Maxon OD808, post-hardcore chug | queued |
| 959 | Everything Is Alright (riff) | Motion City Soundtrack | Joshua Cain | Commit This to Memory (2005) | Gibson SG Junior → Vox/Fender clean-crunch, Moog-tinged pop-punk | queued |
| 960 | A Favor House Atlantic (riff) | Coheed and Cambria | Claudio Sanchez | In Keeping Secrets of Silent Earth: 3 (2003) | Gibson Explorer → Marshall Super Lead-type, bright melodic crunch | queued |
| 961 | Time to Waste (riff) | Alkaline Trio | Matt Skiba | Crimson (2005) | Gibson Les Paul/SG → Diezel VH4 / Bogner Shiva, dark melodic punk | queued |
| 962 | This Ain't a Scene, It's an Arms Race (riff) | Fall Out Boy | Joe Trohman | Infinity on High (2007) | Tele Deluxe-style → Orange Rockerverb, bright modern crunch | queued |
| 963 | Cute Without the 'E' (Cut from the Team) (riff) | Taking Back Sunday | John Nolan | Tell All Your Friends (2002) | Guild M-75 Aristocrat → Supro Thunderbolt + Boss DS-2, raw emo crunch | queued |
| 964 | Girl's Not Grey (riff) | AFI | Jade Puget | Sing the Sorrow (2003) | Les Paul → producer's Marshall + Mesa Dual Rectifier blend, dark melodic punk | queued |
| 965 | A Boy Brushed Red... Living in Black and White (riff) | Underoath | Tim McTague | They're Only Chasing Safety (2004) | Tele HH (Duncan JB) → Marshall JCM800 2203 + Ibanez TS808, screamo chug | queued |
| 966 | Have Faith in Me (chorus) | A Day to Remember | Kevin Skaff | Homesick (2009) | electric → Marshall JCM800 + EVH 5150 III, big melodic chorus | queued |
| 967 | Links: [{"title":"Elliot Easton | Equipboard","url":"https://equipboard.com/pros/elliot-easton"},{"title":"“I paid $2,800 for it at a vintage dealer. Now, I think the guitar would be worth six figures”: What was Elliot Easton’s greatest gear find? The Cars legend reveals all – and argues that today’s players have never had it better","url":"https://www.guitarworld.com/artists/guitarists/elliot-easton-the-cars-bought-and-sold"},{"title":"Elliot Easton – Vintage Guitar® magazine","url":"https://www.vintageguitar.com/33516/elliot-easton-5/"},{"title":"Interview: Elliot Easton of The Cars | Guitar World","url":"https://www.guitarworld.com/artists/interview-elliot-easton-cars"},{"title":"Elliot Easton's Cars rig | The Gear Page","url":"https://www.thegearpage.net/board/index.php?threads/elliot-eastons-cars-rig.1209605/"},{"title":"Elliot Easton: The Cars – MusicPlayers.com","url":"https://musicplayers.com/2017/07/elliot-easton-the-cars/"},{"title":"Elliot Easton's Guitars | Equipboard","url":"https://equipboard.com/pros/elliot-easton?gear=guitars"},{"title":"Interview: Elliot Easton - Hello Again - Premier Guitar","url":"https://www.premierguitar.com/articles/Interview_Elliot_Easton_Hello_Again?page=2"}] | queued |
| 968 | Every Breath You Take (rhythm) | The Police | Andy Summers | Synchronicity (1983) | modified early-'60s Tele (PAF neck, out-of-phase switch) → Marshall stack low, chorus + echo, add9 chord shape | queued |
| 969 | So Lonely (chorus push) | The Police | Andy Summers | Outlandos d'Amour (1978) | Tele Custom → Marshall, light overdrive on the punk-reggae lift | queued |
| 970 | I Will Follow (riff) | U2 | The Edge | Boy (1980) | '76 Gibson Explorer → '64 Vox AC30 Top Boost, EH Deluxe Memory Man (vibrato setting) | queued |
| 971 | New Year's Day (arpeggio) | U2 | The Edge | War (1983) | Gibson Explorer → Vox AC30 Top Boost, Memory Man dotted-eighth delay, sparse chiming figure | queued |
| 972 | Sunday Bloody Sunday (chime) | U2 | The Edge | War (1983) | Explorer → Fender amp + AC30, Memory Man dialed back, martial open-string ostinato | queued |
| 973 | Bad (build) | U2 | The Edge | The Unforgettable Fire (1984) | Strat → AC30, Korg SDD-3000 long delay, two-chord swell crescendo | queued |
| 974 | A Forest (lead) | The Cure | Robert Smith | Seventeen Seconds (1980) | Olympic White Jazzmaster (Woolworth's Top 20 pickup) → Roland JC-120 stereo chorus, Boss BF-2 Flanger | queued |
| 975 | Boys Don't Cry (jangle) | The Cure | Robert Smith | Boys Don't Cry (1980) | Jazzmaster (Top 20 pickup) → Roland JC-120 clean chorus, bright single-note hook | queued |
| 976 | Just Like Heaven (intro) | The Cure | Robert Smith | Kiss Me Kiss Me Kiss Me (1987) | Jazzmaster → Roland JC-120 chorus, Boss CH-1, cascading layered jangle | queued |
| 977 | Pictures of You (lead) | The Cure | Robert Smith | Disintegration (1989) | Fender Bass VI (octave-down baritone) → Roland JC-120, heavy chorus, shimmering drone lines | queued |
| 978 | Radio Free Europe (jangle) | R.E.M. | Peter Buck | Murmur (1983) | '81 Jetglo Rickenbacker 360 → Vox AC30, light chorus, arpeggiated open-string ring | queued |
| 979 | Driver 8 (riff) | R.E.M. | Peter Buck | Fables of the Reconstruction (1985) | Rickenbacker 360 → Vox AC30, no distortion, descending arpeggio | queued |
| 980 | The One I Love (riff) | R.E.M. | Peter Buck | Document (1987) | Rickenbacker 360 → Vox AC30, minor-key arpeggio with occasional overdrive | queued |
| 981 | Killing Moon (lead) | Echo & the Bunnymen | Will Sergeant | Ocean Rain (1984) | Telecaster (+ hired Rickenbacker 12 on outro) → Fender Twin Reverb / Roland JC-120, Spanish-tinged lines | queued |
| 982 | Rescue (intro) | Echo & the Bunnymen | Will Sergeant | Crocodiles (1980) | Telecaster → Roland JC-120 chorus (live), tape-delay textures on record | queued |
| 983 | Brass in Pocket (lead) | Pretenders | James Honeyman-Scott | Pretenders (1980) | Gibson ES-335 / Tele → Fender amp, Boss chorus, melodic clean hook | queued |
| 984 | Kid (solo) | Pretenders | James Honeyman-Scott | Pretenders (1980) | Chrissie Hynde's Telecaster → Fender amp, Boss CE chorus + compressor, lyrical bends | queued |
| 985 | Talk of the Town (jangle) | Pretenders | James Honeyman-Scott | Extended Play EP (1981) | Rickenbacker 360/12 + Tele → Fender amp, chorus, Byrds-style 12-string ring | queued |
| 986 | Once in a Lifetime (stabs) | Talking Heads | David Byrne | Remain in Light (1980) | '62 Sunburst Stratocaster → Roland JC-120 chorus, MXR Dyna Comp, percussive single-note funk | queued |
| 987 | Burning Down the House (riff) | Talking Heads | David Byrne | Speaking in Tongues (1983) | '62 Strat (+ Martin D-35 gallop) → Roland JC-120, MXR Dyna Comp + Distortion+, choppy rhythm | queued |
| 988 | Psycho Killer (clean lines) | Talking Heads | David Byrne | Talking Heads: 77 (1977) | Sunburst Strat → Roland JC-120 clean, nervous palm-muted arpeggio | queued |
| 989 | Senses Working Overtime (riff) | XTC | Andy Partridge | English Settlement (1982) | '75 Ibanez Artist → Session/Sessionnette 75 solid-state combo, jangly verse-to-anthem shift | queued |
| 990 | Making Plans for Nigel (chime) | XTC | Andy Partridge | Drums and Wires (1979) | Ibanez Artist → Session combo (studio: '63 Fender Super Reverb), angular clean chords | queued |
| 991 | Just What I Needed (solo) | The Cars | Elliot Easton | The Cars (1978) | '77 Les Paul Standard → Fender Twin / Ampeg V4, Roland Chorus Ensemble + Morley Echo Volume | queued |
| 992 | My Best Friend's Girl (solo) | The Cars | Elliot Easton | The Cars (1978) | Tele w/ Bartolini mini-humbucker → Fender Twin / Ampeg, Roland chorus, rockabilly-tinged bends | queued |
| 993 | Rio (riff) | Duran Duran | Andy Taylor | Rio (1982) | Yamaha SG → late-'70s Marshall JMP 100-watt head, bright cutting power chords | queued |
| 994 | Girls on Film (riff) | Duran Duran | Andy Taylor | Duran Duran (1981) | Yamaha SG → Marshall JMP/JCM800, tight post-punk funk-rock chording | queued |
| 995 | Need You Tonight (riff) | INXS | Tim Farriss | Kick (1987) | Fender Stratocaster → Marshall JCM800 2203, Roland multi-FX delay, dirty single-note hook | queued |
| 996 | What You Need (stabs) | INXS | Tim Farriss | Listen Like Thieves (1985) | Stratocaster → Marshall JCM800, funk-rock chord stabs | queued |
| 997 | Debaser (riff) | Pixies | Joey Santiago | Doolittle (1989) | Les Paul Standard → Marshall JCM800 50-watt, raw cranked single-coil-style bite | queued |
| 998 | Here Comes Your Man (jangle) | Pixies | Joey Santiago | Doolittle (1989) | Gibson ES-345 (clean) → Fender Vibrolux Reverb, surf-tinged clean lead | queued |
| 999 | Gigantic (lead) | Pixies | Joey Santiago | Surfer Rosa (1988) | Les Paul → Marshall JCM800, bend-heavy melodic riff over Kim Deal's bass | queued |
| 1000 | Teen Age Riot (drone) | Sonic Youth | Thurston Moore / Lee Ranaldo | Daydream Nation (1988) | '61 Jazzmaster, altered tuning → Peavey Roadmaster + Marshall cab / Fender Twin, ProCo Rat | queued |

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
| 2026-06-09 | gibbons-sharp-dressed-man-eliminator | 48 |
| 2026-06-09 | reid-cult-of-personality-riff | 49 |
| 2026-06-09 | malakian-toxicity-drop-c-riff | 50 |
| 2026-06-09 | malakian-chop-suey-clean-to-crushing | 51 |
| 2026-06-09 | deleo-plush-les-paul | 52 |
| 2026-06-10 | deleo-interstate-love-song-clean-intro | 53 |
| 2026-06-10 | dharma-dont-fear-the-reaper-clean-riff | 54 |
| 2026-06-10 | angus-highway-to-hell-riff | 55 |
| 2026-06-10 | angus-whole-lotta-rosie-riff | 56 |
| 2026-06-10 | murray-number-of-the-beast-twin-riff | 57 |
| 2026-06-11 | murray-aces-high-gallop | 58 |
| 2026-06-11 | chuck-berry-johnny-b-goode | 60 |
| 2026-06-11 | carpenter-my-own-summer | 61 |
| 2026-06-11 | korn-falling-away-from-me | 62 |
| 2026-06-11 | morello-bulls-on-parade | 73 |
| 2026-06-12 | hendroff-what-a-beautiful-name | 1001 |
| 2026-06-12 | hislop-goodness-of-god | 1002 |
| 2026-06-12 | moore-living-hope | 1004 |
| 2026-06-12 | moore-way-maker | 1007 |
| 2026-06-12 | garrard-great-are-you-lord | 1009 |
| 2026-06-13 | korn-freak-on-a-leash | 63 |
| 2026-06-13 | korn-got-the-life | 65 |
| 2026-06-13 | korn-blind-intro | 64 |
| 2026-06-13 | carpenter-be-quiet-and-drive | 66 |
| 2026-06-13 | carpenter-change-in-the-house-of-flies | 67 |
| 2026-06-14 | carpenter-hexagram | 68 |
| 2026-06-14 | malakian-sugar | 69 |
| 2026-06-14 | malakian-spiders | 70 |
| 2026-06-14 | malakian-aerials | 71 |
| 2026-06-14 | malakian-byob | 72 |
| 2026-06-15 | morello-guerrilla-radio | 74 |
| 2026-06-15 | morello-sleep-now-in-the-fire | 75 |
| 2026-06-15 | morello-people-of-the-sun | 76 |
| 2026-06-15 | jones-stinkfist-drop-d-crush | 77 |
| 2026-06-15 | jones-sober-dynamic-crush | 78 |
| 2026-06-16 | jones-the-pot-drop-c-crush | 79 |
| 2026-06-16 | jones-jambi-drop-d-talk-box | 80 |
| 2026-06-16 | delson-crawling-clean-to-heavy | 81 |
| 2026-06-16 | delson-one-step-closer-drop-d | 82 |
| 2026-06-16 | delson-faint-drop-d-octave-hook | 83 |
| 2026-06-17 | delson-papercut-rhythm | 84 |
| 2026-06-17 | thomson-duality-riff | 85 |
| 2026-06-17 | root-before-i-forget-riff | 86 |
| 2026-06-17 | thomson-psychosocial-riff | 88 |
| 2026-06-17 | donegan-down-with-the-sickness-riff | 89 |
| 2026-06-18 | donegan-stricken-riff | 90 |
| 2026-06-18 | donegan-stupify-riff | 91 |
| 2026-06-18 | rombola-whatever-riff | 92 |
| 2026-06-18 | rombola-awake-riff | 94 |
| 2026-06-19 | horton-last-resort-riff | 96 |
| 2026-06-19 | pierce-bodies-riff | 99 |
| 2026-06-19 | lowery-enemy-riff | 102 |
| 2026-06-19 | campbell-refugee-lead | 103 |
| 2026-06-19 | kelliher-blood-and-thunder-riff | 104 |
| 2026-06-20 | pierce-sinner-riff | 100 |
| 2026-06-20 | homme-go-with-the-flow-riff | 107 |
| 2026-06-20 | morello-like-a-stone-solo | 113 |
| 2026-06-20 | slash-slither-riff | 116 |
| 2026-06-20 | stockdale-woman-riff | 119 |
| 2026-06-21 | homme-first-it-giveth-riff | 108 |
| 2026-06-21 | homme-3s-and-7s-riff | 109 |
| 2026-06-21 | homme-green-machine-riff | 111 |
| 2026-06-21 | homme-thumb-riff | 112 |
| 2026-06-21 | morello-cochise-riff | 114 |
| 2026-06-22 | morello-show-me-how-to-live-riff | 115 |
| 2026-06-22 | slash-fall-to-pieces-solo | 117 |
| 2026-06-22 | stockdale-joker-and-the-thief-riff | 120 |
| 2026-06-22 | kiszka-highway-tune-riff | 125 |
| 2026-06-22 | sult-electric-worry-riff | 129 |
| 2026-06-23 | slash-dirty-little-thing-riff | 118 |
| 2026-06-23 | stockdale-dimension-riff | 121 |
| 2026-06-23 | kiszka-black-smoke-rising-riff | 126 |
| 2026-06-23 | kiszka-when-the-curtain-falls-riff | 127 |
| 2026-06-23 | kiszka-sacred-the-thread-riff | 128 |
| 2026-06-24 | sult-earth-rocker-riff | 130 |
| 2026-06-24 | myers-second-chance-lead | 132 |
| 2026-06-24 | myers-cut-the-cord-riff | 133 |
| 2026-06-24 | hottinger-i-miss-the-misery-riff | 134 |
| 2026-06-24 | hottinger-love-bites-solo | 135 |
| 2026-06-25 | cronise-open-casket-riff | 136 |
| 2026-06-25 | cronise-freya-riff | 137 |
| 2026-06-25 | cronise-maiden-mother-crone-riff | 138 |
| 2026-06-25 | giles-wires-riff | 140 |
| 2026-06-25 | baizley-take-my-bones-away-riff | 141 |
| 2026-06-26 | nilsson-hisingen-blues-riff | 145 |
| 2026-06-26 | kelliher-wolf-is-loose-riff | 149 |
| 2026-06-26 | kelliher-oblivion-riff | 151 |
| 2026-06-26 | tremonti-my-own-prison-riff | 152 |
| 2026-06-26 | tremonti-higher-riff | 153 |
| 2026-07-01 | kelliher-colony-of-birchmen-riff | 150 |
| 2026-07-01 | tremonti-what-if-riff | 154 |
| 2026-07-01 | tremonti-metalingus-riff | 156 |
| 2026-07-01 | tremonti-kennedy-blackbird-solo | 157 |
| 2026-07-01 | grohl-all-my-life-riff | 158 |
| 2026-07-15 | grohl-monkey-wrench-riff | 162 |
| 2026-07-15 | george-lynch-mr-scary-lead | 164 |
| 2026-07-15 | glenn-tipton-beyond-the-realms-clean-to-lead | 166 |
| 2026-07-15 | kk-downing-hell-bent-for-leather-riff | 169 |
| 2026-07-15 | dave-murray-wrathchild-riff | 170 |
| 2026-07-22 | downing-victim-of-changes-riff | 167 |
| 2026-07-22 | tipton-exciter-riff | 168 |
| 2026-07-22 | murray-phantom-of-the-opera-riff | 171 |
| 2026-07-22 | murray-22-acacia-avenue-riff | 172 |
| 2026-07-22 | smith-wasted-years-riff | 174 |
| 2026-07-29 | smith-evil-that-men-do-solo | 173 |
| 2026-07-29 | smith-sea-of-madness-riff | 176 |
| 2026-07-29 | blackmore-stargazer-solo | 178 |
| 2026-07-29 | blackmore-kill-the-king-riff | 179 |
| 2026-07-29 | campbell-stand-up-and-shout-riff | 181 |
| 2026-08-05 | blackmore-gates-of-babylon-solo | 180 |
| 2026-08-05 | campbell-dont-talk-to-strangers-clean | 182 |
| 2026-08-05 | iommi-neon-knights-riff | 185 |
| 2026-08-05 | rhoads-mr-crowley-solo | 188 |
| 2026-08-05 | jake-e-lee-bark-at-the-moon-riff | 191 |
| 2026-08-12 | campbell-we-rock-riff | 183 |
| 2026-08-12 | iommi-children-of-the-sea-solo | 186 |
| 2026-08-12 | rhoads-diary-of-a-madman | 189 |
| 2026-08-12 | jake-e-lee-killer-of-giants-solo | 192 |
| 2026-08-12 | zakk-wylde-miracle-man-riff | 193 |


### Corrections applied this run (2026-08-12)

- **#193 Miracle Man** — the backlog sketch listed an "MXR Rotovibe," which is
  **wrong on two counts.** The Rotovibe is a *Dunlop* pedal, and it is a
  nineties signature product — it did not exist when No Rest for the Wicked was
  recorded in 1988. Wylde's documented effects for this period are a Boss SD-1
  Super Overdrive, a Boss CH-1 Super Chorus and a Dunlop Jimi Hendrix JH-1 wah.
  The sketch's "bullseye Gibson Les Paul Custom" is also anachronistic as
  written: the guitar is right (the 1981 Les Paul Custom he calls "the Grail,"
  acquired 1987), but it was still cream at this point. Wylde had it refinished
  *afterwards* precisely because a cream Custom in Ozzy's band looked like a
  Randy Rhoads impression — he asked for a Vertigo-poster spiral and got the
  bullseye back instead. Recipe written with the corrected gear.
- **#193 amp, flagged not resolved** — sources conflict on whether No Rest for
  the Wicked was tracked with the Marshall JCM800 2203 or the Lee Jackson
  Metaltronix M-1000. The 2203 is documented as his amp from 1987 onward and is
  what most sources point to; the Metaltronix is certainly all over the
  supporting tour and may have been in the studio. The recipe is built on the
  2203 and says so, with the ambiguity stated in `other_notes` rather than
  papered over.
- **#183 We Rock** — watch out for Campbell's ENGL Ritchie Blackmore signature
  head turning up in interview quotes attached to these songs. That refers to
  re-recording the Dio material with his band Last In Line decades later; no
  such amp existed in 1984. The 1984 rig is the Les Paul Deluxe / DiMarzio X2N
  / Boss overdrive / JCM800 chain, in his own words "a Les Paul through an
  overdrive pedal into a Marshall."
- **#192 Killer of Giants** — no track-level gear documentation exists for this
  song. What is documented is album-level (white Charvel for basics and solos,
  doubled with the blue or purple burst through whichever Marshall was not used
  on the first pass; EV-loaded straight 4x12; Boss OD-1 and a Rat), and the
  blue-burst credit for this specific solo comes from transcription sources
  rather than from Lee. The recipe states this distinction rather than
  presenting album-level gear as track-level fact.


### Corrections applied this run (2026-08-05)

- **#185 Neon Knights** — the backlog sketch's "Laney Klipp / Marshall,
  Tycobrahe/Dallas Rangemaster-style treble boost" is **wrong for this album.**
  The Laney Supergroups + treble booster are the Ozzy-era rig. For Heaven and
  Hell, John "Dawk" Stillwell (previously Ritchie Blackmore's amp tech) rebuilt
  six **Marshall 1959 Super Leads** with an extra gain stage and a master
  volume, and Iommi has said directly: **"He'd done away with the treble
  booster I had forever."** The absence of the booster is the defining
  characteristic of the tone, so shipping the sketch as written would have
  produced the wrong recipe. Guitars: **'Monkey'** (left-handed cherry-red SG
  with a John Birch neck pickup and a Birch-rehoused Gibson P-90 in the bridge)
  for the main tracks, **'Old Boy'** (John Diggins, 1975) for overdubs. Only
  effects on the album per Iommi: chorus, delay, wah. Recorded January 1980 at
  Studio Ferber, Paris; Martin Birch producing. **#186 has been corrected in
  place with the same details; #187 (Mob Rules, 1981) still carries the
  unverified Laney sketch and needs its own amp check before it ships.**
- **#191 Bark at the Moon** — the sketch listed an "MXR Distortion+," which is
  the *Rhoads* pedal, not Jake E. Lee's. Lee's own account is that he took a
  **Jose Arredondo-modified Marshall** to England and recorded the album with
  it — the mod's cascading gain is the source, with **no boost pedal in front**.
  Guitar is the blue-burst **Charvel San Dimas Style 1** (Seymour Duncan JB
  with an Alnico II magnet in the bridge, DiMarzio SDS-1 singles elsewhere),
  confirmed by Charvel's own signature-model documentation. The one documented
  pedal is an **Ibanez SF10 Swell Flanger**, and it is on the solo, not the
  riff. Same studio and engineer as Blizzard of Ozz (Ridge Farm / Max Norman).

### Corrections applied this run (2026-06-09)

- **#48 Sharp Dressed Man** — the backlog sketch's "Pearly Gates LP through
  cranked Marshall, Eliminator-era processing/synth pads" is **myth on every
  count.** Per engineer Terry Manning (Tape Op interview #58 + his verbatim
  messageboard post), the recorded rig was a **custom Dean solidbody with a
  single DiMarzio Super Distortion humbucker → a small 'Legend' 50W hybrid
  combo (tube preamp, solid-state power, one 12" Celestion) → AKG C414 B-ULS
  (~4-5" off-axis) → SpectraSonics pre → UA 176 limiter → tape.** Manning is
  emphatic: **NO Rockman, NO Marshall, no guitar pedals.** The Pearly Gates
  '59 LP is Gibbons' signature instrument but was NOT the Eliminator guitar.
  Recipe ships the Dean/Legend/176 chain; the Legend has no modeler model, so
  a cranked tweed Bassman stands in (noted as an approximation). String
  gauge/tuning for the sessions are undocumented (standard E assumed).
- **#49 Cult of Personality** — headline correction: the **A/DA MP-1 preamp
  in the sketch belongs to Time's Up (1990), NOT Vivid.** Per Reid's 1989
  Music Technology interview, the Vivid distortion was a **Pro-Co RAT into
  Marshalls blended with a Dean Markley DR150** (a Fender Showman added to the
  blend for the solo), and the guitar was his multi-colored **ESP Mirage with
  EMG 81 + two EMG SA pickups** (H-S-S) and a Floyd Rose — not a Les Paul or a
  Hamer (Hamer came later). Recorded at Skyline, NY by Ed Stasium with a
  multi-corner room-mic ambience (not outboard reverb). Standard E.
- **#50 Toxicity** — resolved the Marshall-vs-Mesa dispute: it's **both, at
  once.** Engineer Dave Schiffman (Mix Online): "the Mesa gave us the teeth,
  and the Marshall gave us the body" — a **Mesa Rectifier blended with a
  Marshall Plexi-type**, no overdrive pedals, each cab mic'd **SM57 + SM87
  into paired 1176s.** Guitar = **Ibanez Iceman IC300** (the DMM1 signature is
  2004, post-album; the Friedman Marshall and SG are Mezmerize-era). **Drop C
  (C-G-C-F-A-D).** Recorded dry at Cello Studios, Rubin/Malakian production,
  Andy Wallace mix. Mids kept IN (not the live scoop) so the riff reads.
- **#51 Chop Suey!** — same Toxicity rig (Iceman, drop C, Mesa+Marshall blend,
  no pedals). The clean-intro-to-crushing-chorus dynamic is **playing
  technique** — guitar volume rolled back + light pick attack on the neck
  pickup for the intro, dig in on the bridge for the chorus — not a clean
  channel or a distortion pedal. Built as a single-patch, volume-knob-dynamics
  recipe. Drop C confirmed across tab sources.
- **#52 Plush** — built in place of the skipped #47. Two sketch corrections:
  tuning is **standard E** (the low drone is the open D string, not drop D),
  and there is **no Mesa/Boogie Mark IIB** (unsourced). Per MusicRadar +
  Guitar World, DeLeo's documented Core rig was a **1978 sunburst Gibson Les
  Paul Standard → Demeter TGP-3 tube preamp → VHT Classic stereo power amp →
  two Marshall 4x12s**, at **Rumbo Recorders** with **Brendan O'Brien.** The
  **Rocktron Intelliverb** is the one effect documented specifically for Plush
  (recipe pushes the reverb up to reflect that). The exact track guitar and
  mic model are undocumented (album-default '78 LP used).

**Album-art note:** Eliminator (ZZ Top), Toxicity (SOAD) auto-matched iTunes;
Vivid (Living Colour) and Core (STP) are band-credited tracks that the
album-art audit can't auto-match (it searches iTunes by guitarist name) — both
covers were **visually verified via the Read tool** at 600x600 before shipping.

**Queue note:** the queue is down to **14 queued entries** (#47 re-flagged
needs-research, #48-52 done) — **below the 30-entry refill threshold.** The
weekly audit task should top it up.

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

- **#47 The Devil Went Down to Georgia (Tom Crain, Million Mile Reflections
  1979)** — skipped 2026-06-09. The famous lead is the **fiddle** (Charlie
  Daniels); the track's guitar break is **Tom Crain**, but his per-track rig is
  **not documented to magazine standard.** The official band history confirms
  only the studio (Woodland Sound, Nashville; mixed at Westlake; engineer Paul
  Grupp) and the **fiddle**-solo production (seven layered fiddle parts) — zero
  guitar-gear detail. No credible source documents Crain's guitar OR amp for
  this recording; the sketch's "Strat through a Music Man amp" is an unverified
  hypothesis, not documentation. Equipboard/Vintage Guitar/forums were blocked
  or carried no per-track Crain gear. Building it would mean guessing both the
  guitar and the amp — exactly what the no-approximation bar forbids, and the
  payoff is low since the hook is the fiddle. Re-queue only if a primary source
  on Crain's 1979 studio rig surfaces, or re-scope to a fiddle-tone entry.
  Built **#52 (Plush)** in its place this run.

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

**2026-06-10 — bulk expansion to 1000.** The queue was grown from 60 to 1000
entries via a fresh, parallel, genre-by-genre research sweep (~29 scenes:
classic/hard/prog/psych rock, NWOBHM/thrash/glam/shred metal, blues, southern,
country, rockabilly/surf, punk/post-punk, new wave, grunge, britpop, indie
revival, pop-punk/emo, nu-metal, metalcore/djent, funk/soul, jazz/fusion,
worship/CCM, modern hard rock, singer-songwriter, reggae/latin, 2010s alt).
Each entry names a specific guitarist + guitar + amp on a specific record;
entries with undocumented amps were dropped at research time. **These are
candidate gear *sketches*, not finished recipes** — the daily routine still does
deep per-song research, and may downgrade an entry to `needs-research` or skip
it if the rig doesn't hold up on closer inspection. ~300 additional researched
candidates that didn't fit the 1000 live in `docs/RECIPE_BACKLOG_OVERFLOW.md`.

**Weekly task** (in `weekly-recipe-audit`): when the queue drops below 30
entries, first promote from `docs/RECIPE_BACKLOG_OVERFLOW.md`; once that's
exhausted, add 10 new candidates from these sources:
- Spotify "Top 50 Most Streamed Rock Songs" of the past month
- Reddit r/guitar "what tone is this" recurring questions
- YouTube guitar-cover top videos (high-traffic = high-search)
- Genre coverage gaps in the existing catalog (if we have only one country
  recipe, queue 3 country songs; if zero metal-core, queue some)

Don't randomly add songs — every queue entry should answer "which guitarist
with which gear on what record." If you can't fill those four blanks
confidently, it's not ready for the queue.
