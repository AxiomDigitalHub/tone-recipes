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
| 12 | Black (build to outro) | Pearl Jam | Mike McCready | Ten (1991) | Strat through Mesa/Boogie Studio .22 — the same era/circuit as Cobain's Nevermind setup, different player. The outro solo uses delay and reverb for the "ah-yah" call-and-response. | queued |
| 13 | Even Flow (intro riff) | Pearl Jam | Mike McCready | Ten (1991) | Same Strat-into-Mesa rig as Black, more midrange grit. McCready's stutter-bend technique is half the recipe. | queued |
| 14 | The Pretender (riff) | Foo Fighters | Dave Grohl + Chris Shiflett | Echoes, Silence, Patience & Grace (2007) | Grohl: Trini Lopez signature into Mesa Boogie Dual Rectifier. Shiflett: '72 Tele Deluxe into Marshall JCM800. Two-amp blend on the rhythm. | queued |
| 15 | Snow (Hey Oh) (intro arpeggio) | Red Hot Chili Peppers | John Frusciante | Stadium Arcadium (2006) | '62 Strat → Boss CE-1 chorus → Marshall Major. Different from Under the Bridge — same era player, post-rehab return tone. | queued |
| 16 | Dani California (verse + solo) | Red Hot Chili Peppers | John Frusciante | Stadium Arcadium (2006) | '62 Strat → Big Muff Pi (verses) + Octave Fuzz (solo) → Marshall Major. The solo was inspired by Hendrix and tracks accordingly. | queued |
| 17 | This Charming Man (jangle) | The Smiths | Johnny Marr | The Smiths (1984) | Rickenbacker 330 into Roland JC-120 with Boss CE-1 chorus. Multi-tracked rhythms (~15 layers per Marr's recollection). Capo on 2nd fret. | queued |
| 18 | There Is a Light That Never Goes Out (verse) | The Smiths | Johnny Marr | The Queen Is Dead (1986) | Same Rickenbacker + JC-120 + chorus rig as This Charming Man. Different chord voicings (E-major-friendly position). | queued |
| 19 | One (intro clean → outro thrash) | Metallica | James Hetfield + Kirk Hammett | …And Justice for All (1988) | Hetfield: ESP Explorer with EMG 81/60 → Mesa Mark IIC+. Hammett: ESP KH → Mesa Mark IIC+ with wah on the solo. Distinct from Master of Puppets — first track with the EMG/ESP combo. | queued |
| 20 | Battery (intro classical → thrash) | Metallica | James Hetfield + Kirk Hammett | Master of Puppets (1986) | Hetfield: ESP Explorer or Jackson King V → Mesa Mark IIC+ → Marshall power amp. Same era and rig as Master of Puppets — different riff voicing. The classical intro uses an acoustic. | queued |
| 21 | The Boys Are Back in Town (twin lead) | Thin Lizzy | Scott Gorham + Brian Robertson | Jailbreak (1976) | Gorham: '59 LP into Marshall Super Lead. Robertson: '74 LP into Marshall. Twin harmonized lead in thirds — both guitars are essential. | queued |
| 22 | Run to the Hills (galloping verse) | Iron Maiden | Dave Murray + Adrian Smith | The Number of the Beast (1982) | Both: Strats with hot-rodded pickups → Marshall JCM800. Galloping triplet rhythm requires precise alternate picking. | queued |
| 23 | Painkiller (riff) | Judas Priest | Glenn Tipton + K.K. Downing | Painkiller (1990) | Tipton: Hamer Phantom GT into Marshall JMP-1 + Marshall power amp. Downing: same era. Drop-D not used; standard tuning, blistering tempo. | queued |
| 24 | Holy Diver (intro riff + solo) | Dio | Vivian Campbell | Holy Diver (1983) | Campbell: Strat (later Charvel) into Marshall JCM800. The intro has subtle wah engaged at a fixed position. | queued |
| 25 | Cemetery Gates (clean intro → solo) | Pantera | Dimebag Darrell | Cowboys From Hell (1990) | Dean ML "Dean From Hell" → Randall RG100ES (solid-state, no tubes). MXR 6-band EQ in front. Different from Walk — earlier album, more clean dynamics. | queued |
| 26 | Crossroads (live solo) | Cream | Eric Clapton | Wheels of Fire (1968) | "Fool" SG into Marshall 100W stack. Live recording, Winterland '68. The solo is improvised but follows blues-form chord changes. | queued |
| 27 | The Sky Is Crying (slow blues) | Stevie Ray Vaughan | Stevie Ray Vaughan | The Sky Is Crying (1991, posthumous) | Number One Strat → TS808 → Vibroverb. Slower and more emotive than Pride and Joy or Texas Flood — closer to BB King territory. | queued |
| 28 | Born Under a Bad Sign (lead) | Albert King | Albert King | Born Under a Bad Sign (1967) | Flying V (left-handed but strung right-handed and flipped — strings reversed) → Acoustic 270. King's bending technique was inverted from most players. | queued |
| 29 | Crazy (intro slide) | Aerosmith | Joe Perry | Get a Grip (1993) | LP into Marshall JCM800 + Bogner Fish preamp. The intro slide guitar uses bottleneck on a Strat. | queued |
| 30 | Walk This Way (riff) | Aerosmith | Joe Perry | Toys in the Attic (1975) | LP into Marshall Super Lead. Talkbox not on this track (that's "Sweet Emotion"). The riff is straight-ahead funk-rock through a cranked amp. | queued |
| 31 | Sweet Emotion (intro) | Aerosmith | Joe Perry | Toys in the Attic (1975) | LP through Marshall Super Lead with Heil Talk Box on the intro vocal-tone effect. The "talking" effect is a tube into a vocoder-like resonance through the talkbox. | queued |
| 32 | November Rain (solo) | Guns N' Roses | Slash | Use Your Illusion I (1991) | '59 LP replica → Marshall JCM800 + studio MXR M-117 Flanger. The famous outdoor solo is double-tracked with a Crybaby wah on subtle filter sweeps. | queued |
| 33 | Mr. Brightside (riff) | The Killers | Dave Keuning | Hot Fuss (2004) | Tele into Vox AC30 with Boss DD-3 delay set to dotted eighth. Similar to The Edge's approach but tighter rhythmic gating. | queued |
| 34 | Black Hole Sun (verse) | Soundgarden | Kim Thayil | Superunknown (1994) | Strat-style guitar into Mesa Boogie + Leslie rotary speaker simulation (or actual Leslie). Drop-D tuning, capo position varies. | queued |
| 35 | Alive (verse riff + solo) | Pearl Jam | Mike McCready | Ten (1991) | Strat → Mesa/Boogie Studio .22. The famous solo is a Free Bird-influenced extended outro that McCready improvised in the studio. | queued |
| 36 | Yellow Ledbetter (intro) | Pearl Jam | Mike McCready | (B-side, 1992) | Strat through clean Marshall + light overdrive. Hendrix-influenced phrasing, "Little Wing"-adjacent voicings. | queued |
| 37 | Cherub Rock (riff) | Smashing Pumpkins | Billy Corgan | Siamese Dream (1993) | "Big Muff Pi" through Marshall stack — the canonical "Siamese Dream" tone, multi-tracked 6+ rhythm tracks per song. | queued |
| 38 | 1979 (chiming arpeggio) | Smashing Pumpkins | Billy Corgan | Mellon Collie and the Infinite Sadness (1995) | Yamaha SG into clean amp with chorus and delay. Sampled rhythm loop underneath — guitar is overlay, not driver. | queued |
| 39 | Bullet With Butterfly Wings (verse) | Smashing Pumpkins | Billy Corgan | Mellon Collie (1995) | Same Big Muff + Marshall stack rig as Cherub Rock, with cleaner verse passages and fuzz-bombs on the chorus. | queued |
| 40 | Sex on Fire (verse arpeggio) | Kings of Leon | Caleb Followill | Only by the Night (2008) | Tele into Vox AC30. The arpeggio uses delay set to dotted eighth, simpler than U2 but in the same lineage. | queued |
| 41 | Use Somebody (verse riff) | Kings of Leon | Caleb Followill | Only by the Night (2008) | Same Tele + AC30 + delay rig. Cleaner than Sex on Fire, with reverb pushed for atmosphere. | queued |
| 42 | Take It Easy (intro) | Eagles | Glenn Frey + Bernie Leadon | Eagles (1972) | Acoustic-driven track. Frey: Martin D-28. Leadon: '59 Tele on the lead lines through clean amp. | queued |
| 43 | Life in the Fast Lane (riff) | Eagles | Joe Walsh | Hotel California (1976) | Walsh's LP through Music Man HD-130 + Maestro Echoplex. The riff is hammer-on/pull-off pattern across the second and third strings. | queued |
| 44 | Reptilia (riff) | The Strokes | Nick Valensi + Albert Hammond Jr | Room on Fire (2003) | Two Strats panned hard L/R into clean amps with edge-of-breakup. The riff reads as one guitar but is two interlocking parts. | queued |
| 45 | Last Nite (riff) | The Strokes | Nick Valensi + Albert Hammond Jr | Is This It (2001) | Same two-Strat / two-amp setup. The opening riff is hammered out on a Strat through a Crate VC30 (the cheap amp that defined their sound). | queued |
| 46 | Folsom Prison Blues (boom-chicka) | Johnny Cash's band | Luther Perkins | (1956 single) | Tele through Fender Twin or Princeton, played in the "boom-chicka" pattern with the bass strings palm-muted. Capo position varies. | queued |
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

### needs-research

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
