# Voice of Customer — Worship & Budget Guitarists (July 2026)

**Compiled:** 2026-07-25
**Method:** Primary-source research. Public forum threads, Reddit archive APIs, vendor pages, church-tech publications.
**Supersedes nothing** — this sits alongside `WORSHIP_MARKET_DEEP_DIVE.md` and `TARGET_SEGMENT_AND_SEO_STRATEGY.md` and **explicitly contradicts several claims in both** (see §9).

---

## 0. Method, access limits, and how much to trust each quote

Read this before quoting anything publicly.

**What was retrieved and how:**

| Source | Access | Quote reliability |
|---|---|---|
| line6.com/support forums | Direct fetch, incl. their search endpoint | **High** — but passed through a summarizing layer; spot-verify before publishing |
| Reddit (r/worshipleaders, r/WorshipGuitar, r/Line6Helix, r/line6) | reddit.com is **blocked**; retrieved via PullPush + Arctic-Shift archive APIs, and one stream via a live browser | **High** for body text (raw JSON fields), **medium** for permalink rendering — links were reconstructed from `permalink` fields and not all were re-opened |
| forum.kemper-amps.com, unity.neuraldsp.com, tonelib.net | Direct fetch | High |
| Vendor sites (Worship Tutorials, Signal Theory, PraiseCharts, Sunday Shred, MultiTracks, ToneBuilder.ai, Tonevault, StadiumDepot) | Direct fetch | High |
| Church-tech publications | Direct fetch | High |

**What was NOT accessible (real gaps, not laziness):**
- **TDPRI "Worship Service Players"** — the single best worship-guitar forum — has gone behind a **Tollbit AI paywall** (`tollbit.tdpri.com`, HTTP 402). Same for **TheGearPage**. Both were listed as key sources in our internal docs; **they are now closed to us.**
- **YouTube comments** — blocked. The "what do people ask repeatedly in tutorial comments" question is **unanswered**. This is the biggest remaining gap.
- **Facebook groups** (Helix Worship Team Users, Boss Katana Patch Central, Worship Sound Guy) — login-walled.
- **Fractal forum, thegearforum.com, ProSoundWeb, Trustpilot, Sweetwater reviews** — 403.
- Session WebSearch budget was exhausted mid-research; the back half ran on direct fetches and DuckDuckGo-lite.

**Convention below:** quotes in quotation marks were returned as quoted material by the retrieval layer. Where I only have a paraphrase, it says *(paraphrase)*. Where a quote is clipped mid-sentence it is marked with `…`.

---

## 1. The actual weekly workflow

### 1.1 The internal doc's timeline is wrong in a specific, expensive way

`WORSHIP_MARKET_DEEP_DIVE.md` §3 says: *"Monday-Tuesday: Setlist drops … Tuesday-Thursday: Personal practice window."*

**What the evidence actually shows: Monday is rare, the window is ~1–2 hours of attention (not three evenings), and the setlist is not final until soundcheck.**

In the entire retrieved corpus, exactly **one** person described a Monday deadline — and framed it as an enforced internal policy, i.e. unusual discipline:

> "they need to have it picked, the charts and rehearsal mix in planning center by Monday for the upcoming week. That gives me until our Thursday night practice to edit all the backing tracks"
> — u/FeedbackSubstantial2, r/worshipleaders, 2024-06-28 — https://www.reddit.com/r/worshipleaders/comments/1dpv0bd/how_do_you_pick_your_set_list_and_when_do_you/lan83s7/

Tuesday is the realistic *good* case, and it usually buys **one day**, not three:

> "In our set up, it's usually Tuesday morning. So I generate a set list … and get the set list out to the band later Tuesday so we can rehearse Wednesday evening."
> — u/jlg89tx, r/worshipleaders, 2024-06-27 — https://www.reddit.com/r/worshipleaders/comments/1dpv0bd/how_do_you_pick_your_set_list_and_when_do_you/laktj08/

> "We typically get Sunday's music on Tuesday or Wednesday for Wednesday night rehearsal."
> — u/GaddielTundor, r/worshipleaders, 2025-05-06 — https://www.reddit.com/r/worshipleaders/comments/1kfayyq/volunteers_how_much_time_do_you_put_in_each_week/mqvu7uu/

A meaningful minority get essentially nothing:

> "Frequently our worship pastor won't have the songs posted until less than a week before we are scheduled to play. This week the whole set wasn't posted until yesterday (our rehearsal day)!"
> — u/KnowHope24, r/worshipleaders, 2018-08-23 — https://www.reddit.com/r/worshipleaders/comments/99pv9e/whats_a_typical_rehearsal_look_like_for_you/

> "My church will schedule volunteers not even 3 days before service and will pick songs the night before OR the morning of. This is a little bit irritating for me because i have no time to practice and i feel majorly unprepared everytime i step on that stage."
> — u/BahdMusician, r/worshipleaders, 2024-09-15 — https://www.reddit.com/r/worshipleaders/comments/1fh09hc/team_not_being_open_minded/

### 1.2 Who decides, and why it's late

The blocker is upstream of the worship leader — it's the pastor's sermon:

> "I don't even get a scripture or even a sermon title until Tuesday or Wednesday of that week. Charts go out a few hours after I get some idea of where we're going."
> — u/UMCLocalPastor, r/worshipleaders, 2021-04-12 — https://www.reddit.com/r/worshipleaders/comments/mok0eo/set_list_timing_ahead_of_rehearsal/gu7dys3/

> "We genuinely rarely know what direction he is going with his upcoming sermons, and that's because a lot of times he himself doesn't know until the night before"
> — u/Glum-Huckleberry-111, r/worshipleaders, 2025-05-15 — https://www.reddit.com/r/worshipleaders/comments/1kmqobv/lead_pastor_that_keeps_asking_for_last_minute/msekkxr/

And there is a *cultural* cover story for lateness, which one commenter named precisely:

> "The Holy Spirit can definitely lead people to make a last minute change on Sunday morning; but that same Holy Spirit can also lead people on Thursday, and probably does, but it's us who are doing things at the last minute that should have been better planned ahead."
> — u/Books_Guy23, r/worshipleaders, 2025-05-18 — https://www.reddit.com/r/worshipleaders/comments/1kmqobv/lead_pastor_that_keeps_asking_for_last_minute/mt1bm5m/

### 1.3 The setlist is not stable — and neither is the key

This is the finding with the sharpest product consequence:

> "our lead pastor will ask the day of if we can change the setlist, despite the setlist being up for over a week on Planning Center (which they can see). They just texted me right now asking if I can change a song on the setlist even though service is in two hours."
> — u/Glum-Huckleberry-111, r/worshipleaders, 2025-05-14 — https://www.reddit.com/r/worshipleaders/comments/1kmqobv/lead_pastor_that_keeps_asking_for_last_minute/

> "at Wednesday practice we locked in all the songs and keys, only for her to get a cold and lose her voice on Sunday. Another leader took over at short notice, but we had to change the keys to suit her range, and then decided to swap one song out for another 15 minutes before the service started."
> — u/Donkey_Ali, r/worshipleaders, 2025-04-07 — https://www.reddit.com/r/worshipleaders/comments/1jtuikx/as_a_worship_leader_what_skillsconcepts_do_you/mlxz0j1/

> "Some of the worship leaders at my church aren't very familiar with keys, chords, and notes so sometimes the team won't know what key the song will be in until the day of rehearsals."
> — u/glowing-oranges, r/worshipleaders, 2018-08-23 — https://www.reddit.com/r/worshipleaders/comments/99pv9e/whats_a_typical_rehearsal_look_like_for_you/e4ptoo8/

### 1.4 How much time volunteers actually have

**~1–2 hours of solo prep per week. That is the ceiling, not the floor.**

> "I personally spend about an hour per week listening/learning/practicing the songs on my own, 30 minutes for Wed rehearsal, 30 minutes runthrough on Sun morning, and another 20 minutes during service."
> — u/GaddielTundor, r/worshipleaders, 2025-05-06 — https://www.reddit.com/r/worshipleaders/comments/1kfayyq/volunteers_how_much_time_do_you_put_in_each_week/mqvu7uu/

> "I spend enough time to run through the set list at least twice, I'd estimate 2 hours total. I am known to be well prepared"
> — u/SIRLANTZAL0T, r/worshipleaders, 2025-05-05 — same thread, comment `mqqlwlk`

> "It's at least three hours of prep time for leading a 20 to 25 minute set when learning a new song that goes up to 4 to maybe 8 hours. Trying to balance, full time work, home life and volunteering at church is a battle."
> — u/weekend-guitarist (OP), r/worshipleaders, 2025-05-05 — https://www.reddit.com/r/worshipleaders/comments/1kfayyq/volunteers_how_much_time_do_you_put_in_each_week/

And crucially: **nominal lead time ≠ actual prep time.**

> "My bass player finally looked at the set this morning at 3am. It's been up for a week."
> — u/nlvogel, r/worshipleaders, 2021-04-11 — https://www.reddit.com/r/worshipleaders/comments/mok0eo/set_list_timing_ahead_of_rehearsal/gu5pod4/

### 1.5 Rehearsal reality: 45–90 minutes, and it is NOT for learning parts

> "We have full band rehearsal at 2 pm on Saturday, which gives us 90 minutes of rehearsal for 3-4 songs … respect your fellow volunteers' time and understand that with only 90 minutes we aren't teaching parts."
> — u/Zachj91 (Music Director), r/worshipleaders, 2018-08-31 — https://www.reddit.com/r/worshipleaders/comments/99pv9e/whats_a_typical_rehearsal_look_like_for_you/e555f7l/

> "Rehearsal is only about 45 minutes and we do not have ANY prior practice."
> — u/BahdMusician, r/worshipleaders, 2024-09-15 — https://www.reddit.com/r/worshipleaders/comments/1fh09hc/team_not_being_open_minded/

**A large minority run no midweek rehearsal at all:**

> "we don't run a mid week rehearsal, and we expect everyone to show up on Sunday and know their parts and put everything together fairly quickly."
> — u/gottharry, r/worshipleaders, 2024-05-23 — https://www.reddit.com/r/worshipleaders/comments/1cyxzoq/does_your_worship_team_have_an_age_requirement/l5cqjck/

> "I TRY to get my set out at least a week before … We don't do a midweek rehearsal although it would be a ton better if we did. We rehearse from 7:15-8:20 on Sunday morning."
> — u/Stormblessed71, r/worshipleaders, 2021-04-11 — https://www.reddit.com/r/worshipleaders/comments/mok0eo/set_list_timing_ahead_of_rehearsal/gu6nhz2/

Published best-practice guidance corroborates the constraint. Worship Online's rehearsal guide states *(paraphrase)* that 60–90 minutes is the norm and "your team needs to know their parts before they walk in the door" (https://worshiponline.com/worship-rehearsal-tips/). Worship Ministry Training puts soundcheck at **"7 Minutes Max"** and describes the failure mode: *"It starts 20 minutes late. Songs drag on without clear direction. Two and a half hours later, everyone feels confused and unprepared."* (Jeremy Ellis, 2025-06-05 — https://www.worshipministrytraining.com/how-to-run-a-worship-rehearsal-that-actually-works/)

That such articles exist in volume — including a satire piece whose Rule #1 is *"Plan your setlist a day before rehearsal. Remind your team that they're required to find time within the next 26½ hours to practice these songs"* (Worship Team Coach — https://www.worshipteamcoach.com/ministry-leadership/13-rules-for-frustrating-your-worship-team/) — is itself evidence that late setlists are the norm being corrected, not the exception.

### 1.6 Where the time actually goes

Not where our docs assume. The guitarist's acute unknown is **what to play**, not what it sounds like:

> "I have been learning to play via private lessons for about two (2) years. My church, like many others, gives their musicians a lyrics sheet with chord charts and says "good luck".
>
> What am I supposed to do with this thing? How do I know what I am supposed to play?
>
> I'm not looking for general advice like "learn to play by ear" -or- "play the scale that goes with the chord". I get that, thanks. But, **is there an actual resource out there that teaches a guitarist how to know what to play with these extremely limited references.**
>
> Every Sunday thousands of of worship guitarists know what to play, when, with minimal band rehearsal time. **Where do I go to learn how to do that?**"
> — u/SomeoneElseYouKnew, r/WorshipGuitar, 2025-04-30 — https://www.reddit.com/r/WorshipGuitar/comments/1kb6up0/chord_charts/ *(verified verbatim against the archive API)*

This is the single most important quote in the document. It is a **product request**, unprompted, from exactly our buyer — and he pre-empts the two answers the internet gives him. He is not asking for a tone. He is asking for the part.

> "I seldom know what I'm doing, and running through a song in 5 minutes doesn't help me to know everything I need to do … how many times do I play the verse the chorus the bridge the interludes and for how long, difficult to take notes with a guitar around my neck when we only have 5 to 8 minutes to rehearse the song."
> — u/Brett_Rick57, r/worshipleaders, 2026-03-31 — https://www.reddit.com/r/worshipleaders/comments/1s8ynpf/guitar_player_former_worship_leader/

Music directors are hand-building part-isolation aids because of this:

> "Making .mp3's with a specific instrument part boosted so they can hear what is being played. That's been really helpful for our electric players"
> — u/Zachj91, r/worshipleaders, 2018-08-31 — same thread as above

### 1.7 Planning Center: universal, indispensable, clumsy — and *not* a reliable delivery channel

PCO appears unprompted as the assumed default across setlist, scheduling and rehearsal threads. Sentiment is bimodal:

> "Planning center is by far my biggest part that drives me crazy. People cancel. Sometimes I get notifications.... Sometimes non. … Planning center is also about as organized in building templates and such as a box of loose legos."
> — u/dark7string, r/worshipleaders, 2026-05-27 — https://www.reddit.com/r/worshipleaders/comments/1tohnw3/if_you_schedule_volunteers_in_planning_center/oo8t9nx/

> "Planning center refuses to send notifications for rehearsals on my phone for some reason. It drives me up the wall. I have been late to rehearsal many times because of it."
> — u/CEhobbit, r/worshipleaders, 2026-05-29 — same thread, comment `oohtt4m`

> "Anybody ever had an issue where certain team members see no files for the songs in planning center? They've accepted the plan and can see the song titles. But they have no tracks, lyrics, chord sheets, etc."
> — u/BloodyMasamune, r/worshipleaders, 2026-01-19 — https://www.reddit.com/r/worshipleaders/comments/1qgr0j2/no_files_in_planning_center/

**Positioning warning — read this before building the PCO integration:**

> "We ride or die by Planning Center. … What's something I hate about Planning Center? I guess I hate how many times a week someone tries to sell me an alternate to Planning Center."
> — u/bzach74, r/worshipleaders, 2026-05-27 — https://www.reddit.com/r/worshipleaders/comments/1tohnw3/if_you_schedule_volunteers_in_planning_center/oo6hw9y/

> "The human part drives me crazy. But there's nothing I can do about that. … Planning Center does as much as anything could to make dealing with humans easier."
> — u/kyleblane, r/worshipleaders, 2026-05-27 — same thread, comment `oo57lwr`

**Read:** the PCO integration is still a good idea, but it must be framed as *complementing* PCO (a link/attachment that lives inside their existing plan), never as a better planning tool. And it cannot assume the setlist is final or that notifications arrived.

### 1.8 The corrected weekly model

| When | What actually happens |
|---|---|
| Sun–Mon | Nothing. Pastor hasn't fixed the sermon text. |
| **Tue–Wed** | Setlist posted *if the church is organized*. Keys may still be unset. |
| Wed **or** Thu evening | The one group rehearsal, **45–90 min**. Explicitly not for teaching parts. |
| Wed night–Sat | Solo prep actually happens: **1–2 hours**, often the night before, often late. |
| Sat night / Sun AM | Setlist and/or **key can still change**. |
| Sun, 60–90 min pre-service | Run-through + soundcheck (~7 min). First time the tone is heard in the room. |

**Design for:** a stressed 60–90 minute window, often the night before, on a setlist that may still change, in a key that may still change, aimed at sounding right through someone else's PA.

---

## 2. The top 10 pain points, ranked by frequency of mention

Ranking reflects how often the theme surfaced *unprompted*, including in threads about something else.

### #1 — "Sounds great at home, terrible at church / in the mix / through FOH"
**Evidence: very strong.** The dominant theme by a wide margin. Turned up in nearly every thread opened.

> "How can I get my hx stomp with my pedal board to sound good live like it sounds at home ?" … "I play Christian worship at church"
> — u/Sauceman809, r/Line6Helix, 2023-10-05 — https://www.reddit.com/r/Line6Helix/comments/170im84/how_can_i_get_my_hx_stomp_with_my_pedal_board_to/

> "Yup. 'Bedroom tone' is a thing. Something that sounds great at low volumes practicing at home often sounds terrible at concert volumes. Those clear, sparkly highs become ear-piercing. Those full chunky lows become mud."
> — u/OskarBlues, same thread

> "I spent all week dialing in my presets just to have them sound pretty rough at band practice on Friday." … "it started to sound quite harsh and digital? I didn't hear any clipping, but it just sounded 'metallic' and rough"
> — u/ReplacementPlenty389, r/Line6Helix, 2025-06-22 — https://www.reddit.com/r/Line6Helix/comments/1lhhhs1/help_with_preset_tone_at_home_vs_show_vs_practice/

> "Turn up to rehearsal, plug in my actual main guitar… and plug from the mono out into the desk, and suddenly everything sounds different." … "the guitar lost all it's richness, suddenly felt like someone was playing through an old radio." … "Was a little heartbreaking tbh, was really excited to get going with it :("
> — u/Fortune-Zestyclose, r/line6, 2022-06-15 — https://www.reddit.com/r/line6/comments/vcp5th/hx_stomp_questions_from_a_newb/

> "Reverb sounds good at home...but live it buries you and make your playing unintelligible."
> — theElevators, Line 6 Community, May 31 — https://line6.com/support/topic/71974-live-gigs-and-volume/

> "A guitar tone that sounds great while practicing alone won't necessarily cut through on stage."
> — silverhead (Line 6 Expert), same thread, May 22

The pessimistic consensus is the opening:

> "I have been in this exact situation and tried just about everything… I found there is no effective way to do this without dialing in the tone while in those environments."
> — u/thriller_night, r/Line6Helix, 2025-06-22 — https://www.reddit.com/r/Line6Helix/comments/1lhhhs1/help_with_preset_tone_at_home_vs_show_vs_practice/

### #2 — Downloaded/purchased presets don't translate
**Evidence: very strong**, and the most commercially load-bearing theme we have.

> "Nobody's presets are going to sound great out of the box unless you're playing the same instrument and using the same monitoring as whoever developed them."
> — u/Blrfl, r/Line6Helix, 2024-02 — https://www.reddit.com/r/Line6Helix/comments/1b2k74z/what_preset_packs_should_i_buy/

> "That's why most presets don't sound good - the tone they produce is always dependent on a number of factors outside of the Helix. So they might sound great on a YouTube demo but terrible when you play them yourself."
> — u/CaptJimboJones, same thread

> "I've already purchased a preset pack from one of the big names in the Helix world and it sounds terrible and is completely disorganized."
> — u/yad76, r/Line6Helix, 2024-02-28 — same thread

> "there's not a single preset that I've tried that I've been happy with straight out of the box."
> — u/Edge_of_the_Wall, same thread (from someone claiming 100+ packs tried)

> "**Every single preset** whether by sinmix, fremen or others - sounded like crap through a PA in a band situation."
> — K-Roll86, Line 6 Community — https://line6.com/support/topic/43836-best-custom-presets-for-helix-lt/

And a worship-specific version — the incumbent's weak point, named by a customer:

> "Worship Tutorials often uses the same Amp/Cab and effects chains in many different songs"
> — bbehrens, Line 6 Community, Jan 5 — https://line6.com/support/topic/71210-how-do-i-get-the-best-modern-tones-from-my-line-6-gear-without-losing-clarity/
>
> *In fairness, the same poster also says: "Oh, and I would highly recommend any of their presets. I just wish that they were a little cheaper is all." — so this is an engaged customer's critique, not a detractor's. That makes it more useful, not less: sameness and price are what a satisfied buyer notices.*

### #3 — Tweaking instead of playing; the time sink
**Evidence: strong.** Note: **nobody uses the term "tweak-itis."** Do not use it in copy.

> "what I think happens is your ears and brain start to give up and anything sound good. Helix us a huge time consuming unit...that is def one issue with it."
> — u/Ok_Stop_213, r/Line6Helix, 2025-12 — https://www.reddit.com/r/Line6Helix/comments/1pus1c3/can_you_all_give_a_new_owner_some_hard_truths/

> "it took me almost a year of tweaking my lt till i got to a tone that i kinda liked"
> — u/ilovemudballons, same thread

> "Don't forget ear fatigue! After hours of tweaking, nothing sounds the same."
> — u/psyqil, r/Line6Helix, 2025-06-14 — https://www.reddit.com/r/Line6Helix/comments/1lb2zkv/the_frustration_with_confusion/

> "when I practice I use yamaha thr. Even though I have and love Helix. Simple, effective, everything needed is on the panel and very limited, and it's a good thing." … "This way I minimize my gear frustrations :)"
> — u/Guitar_maniac1900, same thread — *a Helix owner deliberately choosing a limited device. Constraint as a feature.*

> "It took me a good 2-3 years to start getting the absolute best out of my HX Stomp - don't worry, I kicked my heels and could have done it so much faster if I'd found guys like Jason Sadites, Nick Hill, John Nathan Cordy and The Bunn sooner"
> — u/NOKnova, r/Line6Helix, 2025-12 — https://www.reddit.com/r/Line6Helix/comments/1pus1c3/can_you_all_give_a_new_owner_some_hard_truths/

Worship-specific, and the purest statement of our buyer's constraint:

> "Obviously I know you can build your own, but as a full time pastor and chaplain with a family, building tones is something I don't have time for if I have to jump in last minute on band as well. So for example, if I have to play 'Rattle' would love to be able to import that tone onto the unit and **trust it's going to get the job done**."
> — u/TheChappa9, r/WorshipGuitar — https://www.reddit.com/r/WorshipGuitar/comments/1knqu6f/modellers_so_many_modellers/

### #4 — Weekly setlist/preset management on the device
**Evidence: strong in worship contexts specifically.** This is the recurring weekly chore we could remove.

> "We play 4 or 5 songs each service and those songs vary from week to week... How do you make it easy to create a setlist (say with 4 songs in it) and make them easily accessible during the set? ... And then, the following week, delete the songs in that setlist and add new songs to it? This is not rocket science but I can't seem to do this without having to jump through hoops to get it done. **Makes me wanna sell the things and go back to stomp boxes.**"
> — wepjr, Line 6 Community, 2022-01-29 — https://line6.com/support/topic/62867-setting-up-helix-lt-for-worship-service-each-week/

> "the band leader called a song that I didn't have programmed and I had to manually scroll through to find a song that was close."
> — u/swimbikerunnerd, r/Line6Helix, 2025-06-29 — https://www.reddit.com/r/Line6Helix/comments/1lnd068/thoughts_after_first_ever_gig_with_hx_stomp/

> "I REALLY want a button or two to advance to the next song. I know it sounds silly, but having to bend over and dial to the next song is something I don't want to do."
> — same post

> "I generally have an empty preset named '-----------------' acting as a separator if that makes sense."
> — u/Migudel, r/Line6Helix, 2022-11-17 — https://www.reddit.com/r/Line6Helix/comments/yxbxha/how_to_organize_presets_on_hx_stomp/

> "It would be nice if the app allowed you to export a text list/spreadsheet/whatever so that you could document your presets, but it doesn't."
> — u/Brack_vs_Godzilla, r/Line6Helix, 2026-03-01 — https://www.reddit.com/r/Line6Helix/comments/1rhmus6/presets_and_setlists_use_cases/ — *he resorts to screenshotting and running OCR*

There is an unresolved methodological schism here — **preset-per-song vs. a handful of generic presets** — that nobody has authoritatively written up:

> "Have a preset for every song. Even if you only use one sound throughout the song, still create a new preset. I use snapshots to change all my sounds in the preset. Eg: verse, chorus, solo... Then before each service, arrange the presets in the desired order."
> — theElevators, Line 6 Community, 2022-01-30 — thread 62867

> "I was playing a preset per song, but have transitioned to about 4-6 generic presets."
> — jbuhajla, Line 6 Community, 2017-07-12 — https://line6.com/support/topic/28452-praise-and-worship-patches/

> "FWIW, I decided against using a 'preset per song' approach."
> — u/65TwinReverbRI, r/Line6Helix, 2025-06-29 — thread 1lnd068

### #5 — Level/volume mismatch across presets, and gain staging
**Evidence: moderate-strong**, fragmented across many small threads — which is itself the opportunity, because there's no canonical answer.

> "Levelling the presets and getting optimum Output Levels is complicated and **everybody does it differently**."
> — rd2rk, Line 6 Community, 2024-01-28 — https://line6.com/support/topic/67938-picked-up-an-hxstomp-feeling-overwhelmed-let%E2%80%99s-start-with-volume-jumps-and-then-options-for-monitoring/

> "BEWARE, most of his presets are insanely loud. Idk if my presets are weirdly quiet or not, but his presets will shake my walls"
> — u/EschewObfuscati0n, r/Line6Helix, 2024-02 — https://www.reddit.com/r/Line6Helix/comments/1b2k74z/what_preset_packs_should_i_buy/

> "They come at wildly different output volume levels...put-off"
> — d0stenning, Line 6 Community — https://line6.com/support/topic/23078-puzzled-about-custom-tone-user-presets/

Worship-specific — a level problem self-misdiagnosed as a tone problem:

> "I'm worried that sometimes I disappear from the mix. … My friends in the congregation say that they can hear me during the choruses/loud parts but that they can't hear me when it's a lower dynamic like a bridge or a verse or if I'm doing ambient stuff. That makes me question wether I have my gain staging/overdrive staging set up correctly."
> — u/swatguy987, r/worshipleaders, 2020-03-09 — https://www.reddit.com/r/worshipleaders/comments/fg3aqw/electric_guitar_mixgain_staging/

> "I like to use IR output levels and the overall output gain as ways to balance patches so that different guitars have a similar volume/level that I send to the house."
> — ajcrowder, Line 6 Community, 2018-05-29 — thread 28452

### #6 — Snapshots vs. presets vs. stomp mode
**Evidence: strong**, and unusually well-documented — Line 6's own developer concedes the naming is broken.

> "If this is the case why would you use snapshots and not presets on their own?"
> — u/vjninet, r/line6, 2024-11-17 — https://www.reddit.com/r/line6/comments/1gtv895/can_different_snapshots_be_configured_with/

> "The term is confusing and we're changing it in a future update, but the snapshot bypass toggle ENABLES snapshot control of that block - it is enabled by default."
> — u/thebishopgame (flaired **Helix Team – Dev**), r/Line6Helix, 2026-01-18 — https://www.reddit.com/r/Line6Helix/comments/1qgalqo/snapshot_bypass/

> "this function is amazing once you understand it, but is absolutely baffling and maddening when you don't."
> — u/Dynastydood, r/Line6Helix, 2024-12 — https://www.reddit.com/r/Line6Helix/comments/1haobtg/2_amp_presets_dsp/

> "I can't seem to figure out how to get to my snapshots to appear on the foot switches." … "all I can figure out is that I can turn the distortion pedal on and off in a snapshot, but I can't set the gain change."
> — dacrane, Line 6 Community, 2017-03-22 — https://line6.com/support/topic/26316-help-me-understand-how-to-use-snapshots/

### #7 — HX Stomp / POD Go DSP + block limits
**Evidence: strong and long-running** (2018 → 2026; survived the 6→8 block bump).

> "Running into a wall with the 6 block limit… If I run 2 overdrive pedals, amp, ir cab, noise gate, and compressor, I hit my limit. I cannot run reverb, or delay."
> — andrewyano, Line 6 Community, 2018-11-12 — https://line6.com/support/topic/37242-hx-stomp-needs-8-blocks/

> "now at this point I'm already pretty low on DSP and all I can add is a reverb OR delay OR a modulation."
> — adagosto, Line 6 Community, 2022-08-21 — https://line6.com/support/topic/64517-hx-stomp-dsp-limit-work-around/

> "If you have 1/2 the power of a Helix, you will need to learn to make certain compromises."
> — theElevators, same thread

> "now that I understand how this thing uses DSP, I want more of it. For example, the Prize Drive (Nobels) using more DSP than the other dirt pedals...why?"
> — u/swimbikerunnerd, r/Line6Helix, 2025-06-29 — https://www.reddit.com/r/Line6Helix/comments/1lnd068/

**Note the constraint everyone ignores:** the HX Stomp has only **one** setlist. "The HX Stomp only has 1 setlist unlike the bigger units." — u/Football_Optimal, r/Line6Helix, 2022-11-17 (thread yxbxha). Shipping a 30-preset pack to a Stomp user is a packaging failure.

### #8 — FOH conflict, stage volume, monitors
**Evidence: moderate.** Real, but thinner than expected — the two best sources (TDPRI, ProSoundWeb) were paywalled/blocked. Treat as under-sampled, not resolved.

> "I often need to have my amp up louder than the stage singers can handle to hear myself (I'm 3 feet from the drums on a small stage) - so I've had the airbud in one ear, and the amp as loud as they can stand it in my right side, and it's just I'm not hearing enough of myself to feel good on what I'm playing."
> — u/whiskeytwn, r/worshipleaders, 2025-04-01 — https://www.reddit.com/r/worshipleaders/comments/1jolpn1/what_do_you_guys_use_for_inear_monitors_esp/

> "The sound guys were not very experienced and something was always WAY too loud. A few times I approached them on how to improve and was told that basically we aren't professionals and the way it is is fine."
> — u/BahdMusician, r/worshipleaders, 2024-09-15 — https://www.reddit.com/r/worshipleaders/comments/1fh09hc/team_not_being_open_minded/ln88x54/

> "It sounded great in my own mix, but in the context of the band it was too much."
> — u/bzach74, r/worshipleaders, 2026-06-04 — https://www.reddit.com/r/worshipleaders/comments/1tt4j8j/the_old_barncaster/oprsgym/

> "comparing the results of your amp at home to the sanctuary PA might not be apples to apples."
> — u/dereklaneVO (sound guy), r/worshipleaders, 2026-03-16 — https://www.reddit.com/r/worshipleaders/comments/1ruzbyu/sound_guy_keeps_compressing_my_piano_or_is_it/oat7if4/

And the classic worship-specific corrective, from 2013 and still repeated:

> "One key to developing live patches is no reverb. Generally the room's reverb is enough"
> — brue58ski, Line 6 Community, 2013-08-06 — https://line6.com/support/topic/1859-any-worship-guitar-players-using-hd-500/

> "I program in the main sanctuary using the main P.A. as my reference."
> — ajktsb, same thread, 2013-08-07

### #9 — Global EQ / output mode / cab & IR confusion
**Evidence: moderate.** The specific gotchas recur, and the fixes are folklore, not documentation.

> "Make sure you're running Line out (check output settings on the stomp) before running into the FR12. Massive volume difference."
> — u/thriller_night, r/Line6Helix, 2025-06 — thread 1lnd068

> "The Volume knob on the face of the HXS is SUBTRACTIVE. Fully cranked is UNITY (0db - neither boosted nor cut)."
> — rd2rk, Line 6 Community, 2024-01-28 — thread 67938

> "I am finding I want different Global EQ settings when I'm going through my studio monitors at my desk vs. Fender FR12."
> — u/gavinashun, r/Line6Helix, 2026-01-15 — https://www.reddit.com/r/Line6Helix/comments/1qd8pjl/so_there_is_no_way_to_createsave_global_eq/

> "Where this would be handy is if you play at a bunch of venues regularly and like to use different EQ settings per venue across all your patches due to differences in rooms, PAs etc"
> — u/musclebuttbuffpants, same thread — *the multi-campus / travelling worship player*

### #10 — Firmware update anxiety
**Evidence: thin.** Real incidents exist but the dominant pattern is *rumour-driven dread that veterans debunk.* **Do not build a pillar page on this.**

> "i have learned that after Firmware updates patches may sound different to before and the user has to 'readjust' them."
> — RJKole, Line 6 Community, 2026-05-27 — https://line6.com/support/topic/71994-readjusting-everything-after-each-firmware-update/

> "With almost every new firmware release I hear reports from some people that they 'feel like' it sounds different for better or worse. I don't believe I've ever seen a verifiable case."
> — silverhead, same thread

> "You are not the first, and certainly will not be the last to have fallen into that trap of letting HX Edit update the firmware before updating itself."
> — datacommando, Line 6 Community, 2020 — https://line6.com/support/topic/58411-should-i-be-worried-update-mistake/

**Honourable mention (not in the top 10, but new and rising):** *Helix Stadium migration.* Preset conversion from Helix/HX to Stadium is **one-way**, backups can't be imported wholesale, IRs don't auto-map, and Hybrid cabs load a different-sounding equivalent (Line6Tony, 2025-10-16 — https://line6.com/support/announcement/118-helixhx-preset-transfers-to-helix-stadium/). Early buyer friction is real: *"Spent $2500 to realize Global EQ doesn't save, and marketplace presets cant be imported."* — zeppssgtr81, 2026-07-06 (https://line6.com/support/topic/72094-helix-owners-any-buyers-remorse-switching-to-stadium-too-soon/).

---

## 3. What makes players PAY vs. use free — and what they regret

### 3.1 The purchase justifications that actually appear

**Time, not tone, is the stated reason.**

> "I'm a casual player and really don't have a lot of time building my own presets, and this helps me enjoy my Helix even more."
> — pinoy1, Line 6 Community — https://line6.com/support/topic/22156-fremens-helix-presets/

> "Any of these packs would probably be helpful if you want realistic tones **in a hurry**."
> — ieperry, Line 6 Community, 2019-04-01 — https://line6.com/support/topic/44146-delaune-vs-fremen-vs-mbritt-patches-a-review/

> "To me, the benefit is, once you have a profiler and an amp you like, you can get a lot of good profiles/performances **without having to spend all that time digging through Rig Manager**."
> — patrick2099, Kemper forum, 2025-02-10 — https://forum.kemper-amps.com/forum/thread/65278-stupid-beginner-question-do-you-recommend-still-to-buy-profiles/

> "Rig exchange is fine, but really **not curated** so you can spend hours and hours trying out stuff"
> — GCNC8068, same thread, 2025-02-15

**Curation is the product.** Not the files.

**The single best worship proof-of-demand quote in the corpus — note what the ROI is:**

> "I've been using hislops patches on my pod go for years now, I've bought a few of the different IR packs and love them. (**Always getting compliments from the sound guys about my tone**) I seen him pushing the new xrirs, and **All I really hear him saying the difference is they sound "better" but I'm confused as to how they sound better.** Are they better? Is it a huge difference? Should I just not waste the money and try some patches from somewhere else? **I like how easy it was to download the patches and plug in my guitar and go.**"
> — u/Body_Green, r/WorshipGuitar, 2025-03-15 — https://www.reddit.com/r/WorshipGuitar/comments/1jbk8nf/tone_factor_xrir/ *(verified verbatim against the archive API)*

Three lessons in one post: the ROI is **sound-guy approval**; the delight is **download → plug in → go**; and the upsell fails because *"better"* is not a claim a buyer can evaluate. **State specifically how a thing is better, or don't charge for it.**

> "(Not free) but David Hislop's patches are KILLER. I think they are like $15 but they sound infinitely better than every other patch I've tried(including worship tutorials although they sound good too)"
> — u/Willem_Culpepper, r/WorshipGuitar, 2021-10-27 — https://www.reddit.com/r/WorshipGuitar/comments/pz2kqh/helix_patchespresets/hi7jv4d/

> "I actually just got it yesterday. I also went to guitarforhisglory.com and picked up their delay pack for the DD500. **It includes song based delays for quite a few we do.** … Great starting points for someone like me who doesn't want to start from the defaults."
> — u/Stratosfisher, r/WorshipGuitar, 2020-06-16 — https://www.reddit.com/r/WorshipGuitar/comments/ha4wdd/my_current_rig_and_some_questions/fv1b6yz/

> "$15-30 or whatever for a $2k-4k amp seems pretty awesome"
> — andycoalter, Neural DSP forum, 2024-05-17 — https://unity.neuraldsp.com/t/worship-tutorials-captures/14127

A distinct and underrated job-to-be-done — **buying to learn**:

> "I found them very useful for getting ideas...like studying a textbook in school. In the end though, I always end up making my own."
> — Kilrahi, Line 6 Community — https://line6.com/support/topic/43836-best-custom-presets-for-helix-lt/

> "your stuff floored me and I think I'll be throwing down for this package, **even if just to learn from it!**"
> — Verne-Bunsen, Line 6 Community — https://line6.com/support/topic/22156-fremens-helix-presets/

### 3.2 The regret quotes — this is the QA spec

> "Definitely worth buying some 3rd party profiles. But...very few have really given me anything like the tones in the audio/video demos"
> — alligatorlizard, Kemper forum, 2023-05-16 — https://forum.kemper-amps.com/forum/thread/60530-tonejunkie-mbritt-and-other-commercial-profiles-is-it-worth-buying/

> "The packs I bought never sounded like the demos."
> — MicMusic, Kemper forum — https://forum.kemper-amps.com/forum/thread/59041-free-rigs-or-buying-rigs/

> "No matter what I do, they never sound like what was advertised."
> — OhG, same thread

> "If you can manage to use somebody else's patches completely unaltered, it's just dumb luck...**So why pay somebody if I end up having to do it myself anyway?**"
> — cruisinon2, Line 6 Community — thread 43836

> "I have purchased dozens of profile packs from a bunch of commercial profilers. Even that can be like playing roulette. **Most of them were demoed and deleted.**"
> — alerich, Kemper forum, 2023-05-13 — thread 60530

> "Some commercial rig packs have some killer profiles and some are **fillers** for me."
> — GearJocke, Kemper forum — https://forum.kemper-amps.com/forum/thread/55271-noob-question-why-do-kemper-commercial-profiles-exist/

> "had same issue i contacted support and got refund- **why sell products that cant be easily used**"
> — mandiboy, Line 6 Community, 2024-12-03 — https://line6.com/support/topic/67533-market-place-purchase/

> "unable to import this preset because required license wasn't found" / "Preset translation not supported, dsp block constraint exceeded"
> — saneff, Line 6 Community, 2024-10-02 — https://line6.com/support/topic/69294-bought-a-preset-from-line-6-site-now-says-unable-due-to-license/

> "Yeah, It frustrates me even knew about the proprietary *.hir format for IR files on the line6 site that only work with line6 stuff, but doofus me forgot." … "Upset with myself and kicking myself, but lesson learned."
> — Kovie, Line 6 Community, 2021-05-30 — https://line6.com/support/topic/60822-dangit-bought-hir-proprietary-format-ir/

> "I'm a bit stuck trying to eliminate the delay from the basic sound."
> — Beckybrown, Line 6 Community, 2019-04-06 — thread 44146

> "I really need to simplify and reduce choices" / "Too much choice ! Choice overload !"
> — d0stenning, Line 6 Community — https://line6.com/support/topic/23765-help-me-cull-my-collection-of-fremen-clean-presets/

And the moralised version we will have to position against:

> "All these 'presets' and 'IR's people think are some golden trick to modeling aren't putting the work in."
> — u/ProfessorOk6227, r/Line6Helix, 2025-12-24 — https://www.reddit.com/r/Line6Helix/comments/1pus1c3/

### 3.3 QA SPEC — ranked post-purchase complaints → hard rules

| # | Complaint | Rule it implies | Evidence |
|---|---|---|---|
| 1 | Doesn't sound like the demo | Demo must be the **delivered file, unmodified**. State the guitar, pickups, and monitoring. Never sweeten. | Strong (4+ independent posters, 3 threads) |
| 2 | Works at home, dies through the PA | Every recipe validated **at band volume through FRFR/PA**, not headphones. Ship an explicit "live-verified" flag. | Strong |
| 3 | "I tweaked it anyway — why did I pay?" | Frame as a **starting point** + a documented 3-knob adjustment path (gain / mids / output). This is literally the "recipe" framing. | Strong |
| 4 | Inconsistent output levels across a pack | **Hard gate:** level-match every preset in a pack to one reference. | Strong |
| 5 | Filler — "I use 3 of the 100" | Cap pack size. No near-duplicates. Publish an honest count of *distinct* tones. | Strong |
| 6 | Won't import — license / DSP / firmware mismatch | Pre-flight matrix: device, DSP budget, firmware. **Test-import on target hardware.** Only complaint found that produced an actual refund. | Strong |
| 7 | Depends on an IR or gear you don't own / locked format | Never require a paid third-party IR. Never ship proprietary/locked assets. State dependencies up front. | Strong |
| 8 | Tuned to the maker's guitar | State guitar + pickup type; offer HB/SC variants or a compensating gain note. | Moderate-strong |
| 9 | Poor naming / no documentation | Human-readable snapshot names + a README per recipe: what amp, what mic, what it's for, what to change. "Disorganized" ranks alongside "sounds terrible." | Moderate |
| 10 | Baked-in delay/reverb you can't remove | Time-based FX on separate, clearly-labelled, easily-bypassed blocks. **Acute in worship** — rooms are already reverberant. | Moderate |
| 11 | Sameness across a catalogue | Vary amp/cab/chain by song; don't reuse one template. This is the incumbent's named weakness. | Moderate (1 specific, high-quality quote) |

### 3.4 The trust bar, ranked

1. **A free sample they can actually load.** Table stakes, repeatedly cited. (Strong)
2. **Named reputation.** Buyers use maker names as shorthand for safety: Fremen, MBritt, Hislop, Tone Junkie, Sadites, Delaune. **We have no name yet — this is our single biggest deficit.** (Strong)
3. **Curation.** "Not curated, so you can spend hours" is the pain free content creates. (Strong)
4. **Evidence of real work** — own IRs, captures of rare gear, published methodology. (Strong)
5. **Hearing the maker play it.** Converts directly, but…
6. …**demo videos are actively distrusted** by a visible countercurrent: *"Pay no attention to YouTube demos. They won't sound like this for your setup."* — 1Towneley, Kemper forum, 2021-01-10 (https://forum.kemper-amps.com/forum/thread/52513-before-you-buy-commercial-rigs-and-profiles-check-out-the-rig-manager-for-rig-pa/). **The negative evidence here is stronger than the positive.**
7. **Independent comparison reviews.** The Delaune-vs-Fremen-vs-MBritt thread is itself the cited artifact.

### 3.5 "Free is enough" — the counter-argument we must answer

> "If you can't get a killer tone with the 1000's of free ones then you not going to get it by paying for it."
> — BayouTexan, Kemper forum — thread 55271

> "I spent a lot money (hundreds of pounds) buying hundreds of presets from famous preset creators and then came across a great guy in YouTube called Jonny Lee… his presets are all free - and better than the bought ones to my ears"
> — u/deekod1967, r/Line6Helix, 2024-02 — thread 1b2k74z

> "There are free worship patches for all Line 6 devices"
> — u/simonyahn, r/WorshipGuitar — https://www.reddit.com/r/WorshipGuitar/comments/1knqu6f/modellers_so_many_modellers/msokvi4/

**Where free demonstrably fails** — and this is our wedge:

> "Of the many I gone through the trouble of downloading and loading up **not a one survived my initial attempts at using**."
> — WickedFinger, Line 6 Community — https://line6.com/support/topic/23078-puzzled-about-custom-tone-user-presets/

> CustomTone "is full of user posted presets but I have found it to be **very hit and miss**."
> — r/Line6Helix, retrieved via search snippet — https://www.reddit.com/r/Line6Helix/comments/zc574m/where_to_find_free_helix_native_patches/

**Worship-specific pricing friction** — this is real and unique to this market:

> "Well, I look forward for someone sharing their setlist **for free for the glory of God**! … However it is okay to sell them too."
> — jesuscares, Line 6 Community, 2018-05-29 — thread 28452

That thread then produced a running loaves-and-fishes joke about duplicating presets. There is genuine cultural friction around monetising tone in a volunteer ministry context. Note also the price-sensitivity/moral discomfort about worship gear culture generally:

> "It seems as if the 'standard' of CCM praise teams is, in summary, materialistic excess. … I see on youtube channels like worship tutorials that it's practically a 'standard' to use gear like a Kemper amp ($2 grand) + a Helix FX board ($2 grand) along with, say, a Suhr electric ($3 grand)"
> — u/xijingpingpong, r/worshipleaders, 2021-03-12 — https://www.reddit.com/r/worshipleaders/comments/m3seuh/regarding_worship_band_culture/

---

## 4. The vocabulary they actually use

Terms below were observed in real usage. Terms we *assumed* but could not evidence are flagged.

| They say | We say / currently use | Evidence |
|---|---|---|
| **patch** (worship-dominant; also PraiseCharts' "Song Specific Guitar Patches", Worship Tutorials' "Line 6 Helix Patch") | preset | "Does anyone have some awesome patches." — awrigh10, line6 28452 |
| **preset** (Line6/Helix-native, and both used interchangeably by the same person) | preset | "Have a preset for every song." — theElevators, line6 62867 |
| **patch pack** | bundle / pack | praisecharts.com product naming |
| **tone** (generic, and the emotional word: "my tone", "great tone") | tone recipe | "Always getting compliments from the sound guys about my tone" — u/Body_Green |
| **snapshot** (Line 6) / **scene** (Quad Cortex) | snapshot | "inside that patch I utilize snapshots for the different sections of the song" — jbright44, line6 28452 |
| **swell / auto-swell / big swells** | swell | Worship Tutorials snapshot named "BIG SWELLS"; "delay (dotted eighth, quarter, slapback, auto-swell, reverse delay)" — whiteop, line6 1859 |
| **ambient** (both an adjective and a *patch name*) | ambient | "clean, drive, lead, and ambient (for swells)" — u/simonyahn; WT snapshot "CLEAN AMBI" / "AMBI DRIVE" |
| **dotted eighth** (often misspelled "dotted-eight") | dotted eighth | "I use digital delay with dotted eighth setting" — BigChas52, line6 1859 |
| **dual / parallel delays**, "1/4 into dotted 8th" | delay chain | "I have started using dual delays in parallel" — BlueViolince, line6 1859 |
| **edge of breakup** | edge of breakup | "I generally set them up where the amp is on the edge of breakup" — jbuhajla, line6 28452 |
| **POG** (as a generic for octave-up) | octave | WT snapshots "POG LEAD", "VB2+POG" |
| **the house** (= FOH) | FOH | "volume/level that I send to the house" — ajcrowder, line6 28452 |
| **direct to FOH** | direct out | "replacing them with Kemper heads going direct to FOH" — dhogeboom, line6 72094 |
| **P&W** | worship | "I also play P&W every week." — jbuhajla, line6 28452 |
| **bedroom tone** (the pejorative for home-dialled presets) | — *we don't use this and should* | "Yup. 'Bedroom tone' is a thing." — u/OskarBlues |
| **stems / click / guide cues / Playback / Prime** | tracks | edmiddlebrooks, line6 72124 |
| **AC30 / Matchless DC30 / Tele** (the canonical worship signifiers) | amp models | tonelib 15703, unity 14127 |
| **washed out**, **meaty**, **bright**, **in-your-face** (tonal descriptors in vendor copy) | — | guitarforhisglory.com product copy |
| **wet effects** (delay+reverb as a unit), **trails**, **wall of sound**, **soup** (too much wet), **fizzy** | delay/reverb | "In modern Worship Delay and Reverb are used very stylised as a main component of the sound and many big bands like Bethel or Hillsong started to put them **in front of the amp** to saturate through the Preamp at **edge of breakup**. That way they get this huge **'wall of sound'** … when you kick on your drives and the gain increases, the Reverb and Delay **trails** get way louder … without it turning into **soup**" — u/Danjiele, r/WorshipGuitar, 2025 — https://www.reddit.com/r/WorshipGuitar/comments/1j1wl7s/board_for_2025_help_me_decide/mg2juff/ |
| **board rundown** (the rig-tour content format) | rig tour | same comment: "it was helpfull to watch Pedalboard rundowns and comparing how different units sound" |

**Terms we assume but could NOT evidence in real user speech — stop using them as if they're native:**
- **"tweak-itis"** — zero occurrences. Users say *ear fatigue*, *"a year of tweaking"*, *"huge time consuming unit."*
- **"washy" / "shimmer" / "atmospheric"** as worship jargon — only found as Line 6 effect-block names, not as player vocabulary.
- **"pad"** — found only as a *keyboard/backing track* product (Worship Tutorials "Ambient Pads"), never as a guitar term. Using "pad" for a guitar tone will read as wrong.
- **"tone recipe"** — our own coinage. Nobody says it. That's fine as a brand term but it will not carry search traffic; the searchable words are **patch**, **preset**, **tone**, **[song name] + patch**.

**SEO/UI implication:** in worship contexts lead with **patch**, not preset. Title pattern that matches real speech: *"[Song] — Helix patch & tone"*, not *"[Song] tone recipe."*

---

## 5. Objections to AI-made presets

### 5.1 The landscape changed under us — AI presets are now mainstream and openly branded

This is the most important competitive fact in this document. As of mid-2026, **AI tone generation is not a taboo we're breaking; it's a category the platform vendors have already entered.**

- **Positive Grid BIAS X** (Sept 2025, $149): "Text-to-Tone" and "Music-to-Tone," trained on "over a million reference tones." Guitar World's review: *"The AI genuinely streamlines the creative process, without diminishing the ability to tweak manually."* (https://tech.yahoo.com/audio/articles/positive-grid-embraces-age-ai-162139231.html)
- **Neural DSP Cortex Studio** — "a free iOS AI guitar tone engineer in your pocket. Describe any sound — an artist, song, genre, or vibe — and Cortex Studio will build the perfect [preset]." Announced by May 2026. (https://unity.neuraldsp.com/t/cortex-studio-for-quad-cortex/22209)
- **ToneBuilder.ai** — "AI-powered preset creation for Line 6 Helix. Describe your sound, get a complete signal chain, and refine it in chat until it's exactly right." Exports `.hlx`. **Leans fully into AI in its branding.** (https://www.tonebuilder.ai/)
- **Tonevault.io** — free Helix preset community with a "ToneAI" assistant and worship tags. (https://www.tonevault.io/)
- **Line 6 Proxy** — Line 6's own cloud amp-cloning on Helix Stadium.
- User-built GPTs already circulate in the community: "ToneSmith" for HX Stomp (r/Line6Helix `1kovx41`) and "The Amazing Line 6 Helix Preset Creator" which "can actually create a real downloadable `.hlx` Helix preset file" (gad79, Line 6 Community, May 1 — https://line6.com/support/topic/71883-finally-%E2%80%94-ai-that-builds-actual-helix-hlx-files/ — **note: zero replies. Indifference, not hostility.**)

### 5.2 The objections, verbatim

**(a) Hostile — "AI doesn't belong near creativity"**

> "So much for getting to know and master your gear. Personally I don't want AI anywhere near anything that involves creativity."
> — Kenjiwhe, Neural DSP forum, 2024-10-19 — https://unity.neuraldsp.com/t/ai-tone-builder/15879

> "AI will ruin us all, and make us become idiots" *(paraphrase of loupinfern's post as returned)*
> — loupinfern, Neural DSP forum, 2025-06-21 — https://unity.neuraldsp.com/t/ai-automatic-guitar-tone-recreation/18693

> "Remove the discovery and learning process away, and then it's just a bunch of copy and paste"
> — BingoBronson, same thread, 2025-06-23

> "AI scares the sh## outta me because it does so many things better than me."
> — AdamF, same thread, 2025-06-22

**(b) The credibility objection — hallucination. This is the one that actually matters.**

> "Please stop recommending stuff like this. ChatGPT and other LLMs have continuously shown they're not actually capable of doing this. … at best, it'll give you what someone else said would work and at worst will just give you nonsense, but it'll be equally confident in both answers."
> — u/thebishopgame (**Helix Team – Dev**), r/Line6Helix, 2025-02-13 — https://www.reddit.com/r/Line6Helix/comments/1iohhhw/hx_stomp_make_bass_synth_tone_for_pink_pony_club/mck890u/

> "Chatgpt alone does a good job but **hallucinates. It gives options that don't exist.** And with my adhd having to correct it all the time made me go nuts. With the manual and other documents as a safe guard tonesmith doesn't drift as much and gives consistent results."
> — u/Awkward-Jury-5258, r/Line6Helix, 2025-05 — https://www.reddit.com/r/Line6Helix/comments/1kovx41/new_update_to_tonesmith_for_hx_stomp/mt2ncs5/

**(c) Pragmatic / accepting — and this is the larger group**

> "I used it. It was great. … I found this chat really useful and gave me very specific settings and signal chain that I can try and then modify from there."
> — u/Odd-Essay1346, same thread

> "This is absolutely incredible!! What an amazing time to be a guitar player!!"
> — u/jmans1, same thread

> "I would love something like this for the Quad Cortex. Might be gimmicky to some, but also fun and useful."
> — Beggars, Neural DSP forum, 2024-10-17 — https://unity.neuraldsp.com/t/ai-tone-builder/15879

> "Just created a preset for one of my acoustics using this and im pretty blown away by the results."
> — martindavidson261170, same thread, 2024-11-12

**(d) The capture/profile line — where acceptance already sits**

Kemper profiling, QC Capture, NAM, ToneX and now Line 6 Proxy are all *machine-derived tone reconstruction*, and none of them attract the "AI" objection. Buyers discuss them purely on outcome: *"$15-30 or whatever for a $2k-4k amp seems pretty awesome"* (andycoalter, unity 14127). **The line is not "machine-made vs human-made." The line is "verifiable against a real reference" vs "confidently made up."**

**(e) The worship/faith-specific angle — and the framing that already works**

There is an active, current (Jan–Feb 2026) debate about AI in worship, driven by AI artists charting on Christian charts. The consensus lands in a very specific place, and it is **favourable to us**:

> "AI can *assist* the craft but cannot *replace* the heart and witness of human worshippers"
> — Kenny Lamm, NC Baptists Worship Ministries, quoted in Religion Unplugged, 2026-01-03 — https://religionunplugged.com/news/2026/1/3/as-ai-music-climbs-the-charts-church-leaders-urge-caution-and-discernment

> "AI can help to generate ideas and stir creativity, but it cannot be a final source for the music sung in worship" … "That must remain the work of a human"
> — Kevin Uhrich, Westside Baptist Church, same article

> "These songs are made in seconds by machines. 'Soul-less' music"
> — Jon Huff, Cartersville First Baptist Church, same article

> "Apparently, it's possible to be soulful and yet without a soul."
> — Biblical Recorder / Baptist Press — https://www.brnow.org/news/does-ai-generated-worship-generate-worship/

Read carefully: **every objection is about AI authoring the *worship itself* — the song, the lyric, the artist.** None is about AI assisting the *craft*: the signal chain, the delay time, the gain staging. Uhrich's line ("assist the craft") is almost exactly our product. Also note the recurring fear is **undisclosed** AI ("concern people might not know certain artists are AI-generated"), which argues *for* disclosure, not against it.

### 5.3 Objection → counter-framing map

| Objection | Best-evidenced counter-framing |
|---|---|
| "AI hallucinates — it'll give me blocks that don't exist" | **The strongest and most legitimate objection.** Counter with *verification*, not reassurance: every recipe is emitted as a real device file, **test-imported on the target hardware**, DSP-checked, and level-matched. Publish the check. This is a moat against ToneBuilder-style chat tools that emit unverified files. |
| "AI removes the learning" | Ship the *why* alongside the file — which is already the tone-recipe format. Lean on the "buying to learn" JTBD ("like studying a textbook in school"). |
| "It's soulless / it's not real worship" | Draw the line the church leaders already drew: **AI assists the craft, humans do the worship.** We supply a delay time, not a song. Never let copy imply the tone is the ministry. |
| "You didn't put the work in" | Show the work: state the reference recording, the amp/cab choice, the trade-offs, what to change for your guitar. The complaint is about *lazy* output, not machine output. |
| "It won't sound like the demo anyway" | Same answer as the human-preset QA spec (§3.3). This objection is not AI-specific and never was. |

### 5.4 Does disclosure help or hurt? Honest read.

**Evidence: moderate, and it points toward disclosure being safe-to-positive in this niche — with one caveat.**

*For disclosure:*
- The commercial market has already normalised it. Positive Grid, Neural DSP and ToneBuilder.ai all **lead** with AI in their marketing; none is being punished for it.
- Community-built AI preset tools get warm receptions on Reddit ("absolutely incredible", "great", "blown away") and are met with **indifference rather than hostility** on the Line 6 forum.
- In worship specifically, the stated fear is *hidden* AI. Disclosure directly answers the objection that's actually being raised.

*Against / caveat:*
- The one genuinely damaging critique — from a **Line 6 developer** — is about **competence, not ethics.** If we say "AI" without simultaneously proving verification, we inherit the hallucination reputation.
- Worship carries an additional, non-transferable sensitivity around AI *authorship*. Copy must never blur tone-craft into worship-content.

**Recommendation:** disclose plainly and pair every disclosure with the verification claim. "AI-assisted, hardware-verified" is a defensible position; "AI-generated" alone is not. **Weak spot:** we found no direct A/B evidence of disclosure's effect on conversion in this niche. Treat as a testable hypothesis, not a settled fact.

---

## 6. The Katana / budget player

**What we know with reasonable confidence:**

- **The audience is bigger than the Helix audience on Reddit.** r/BossKatana ≈ **37k members, +19.5%/yr** — larger than r/Line6Helix (**26k, +25.4%/yr**) and 4× r/worshipleaders (**9k, +28%/yr**). r/WorshipGuitar exists but is small: **3k, +97%/yr** (fastest relative growth). (All via gummysearch.com/r/…)
- **The culture is free-sharing, with an organised request norm.** r/BossKatana's most-used flairs are "Question", "**Tone Request**", and "**Preset**". The main Facebook group, *Boss Katana Patch Central*, describes itself as offering "free settings for all." Peer-to-peer tone requests are answered for free, publicly, by hobbyists.
- **Boss Katana Gen 3 launched May 2024**, seven models from $299, with Bluetooth control via the Boss Tone Studio app — so the platform is current and cheap, and no computer is strictly required.
- **In worship, platform choice is driven by patch availability, not by tone.** This is the single most strategically useful thing found about budget buyers:

> "What I want to know is **which unit has the best range of quality patches available for download?** Especially for the worship context."
> — u/TheChappa9, r/WorshipGuitar — https://www.reddit.com/r/WorshipGuitar/comments/1knqu6f/modellers_so_many_modellers/

> "If you want to just download your patches, you aren't going to be at anything from Line 6. They've amassed a huuuuuge community over the past several years."
> — u/InvalidSoup97, same thread

> "Sharing of patches is huge, and probably what holds Boss back. **If they had them available on Worship Tutorials I bet more would go with Boss.**"
> — u/jpstephens225, r/WorshipGuitar, 2020-04-07 — https://www.reddit.com/r/WorshipGuitar/comments/ftrkum/boss_gtk_vs_helix_lt/fmq81ze/

> "where you will run into problems is that you will need to create the patches as **most Worship musicians use Line 6 and it will be difficult to find pre-made patches from others**."
> — u/maximusheals, same thread, 2020-04-03

### 6.1 The best single artifact: a worship guitarist who chose Katana *over* Helix

This post is worth reading in full — it inverts several of our assumptions at once:

> "I have the katana artist mk 2. It's outstanding. I have also played the gt1000, it is great too. **I prefer the katana because the tone I dial in is the tone I get even when playing live.** … I play live at church, lead guitar. The katana plugs into the front of house via the line out. What I have noticed is that **the sound I dialed in at home using the katana speaker as the reference my sound is perfectly re created with zero EQing required. I get the set list on a Tuesday, tweak a few settings for the delay, revers etc... and then save it to the channel on the amp, done.**
>
> Here is where the GT1000 wins: **it has ambient effects and dotted delays. Both of which are super useful..if boss would add those to the katana amp I would be happy and it's literally the only thing missing.**
>
> Here is where the katana matter most and the reason it wins in my book: sonically, I get zero digital sounding effects. The GT1000 and for that matter **the helix LT which I am borrowing to try out, are super digital sounding in comparison.**"
> — u/Careless_Plankton_40, signing off as *"Mike / Worship Guitarist / Life church east bay, Ca"*, r/BossKatana — https://www.reddit.com/r/BossKatana/comments/1c1v74x/boss_katana_artist_mk2_vs_gt1000/liqbh2w/

Four things fall out of this:

1. **The Katana largely dissolves pain point #1.** Because it's a real amp on stage with a line out, "what I dialled at home is what the house gets." That is the *single biggest* pain for Helix players, and this segment doesn't have it. Selling them "translation" is selling a problem they don't have.
2. **The gap for worship on Katana is named precisely: dotted-eighth delay and ambient effects.** That is the entire worship idiom, and the amp doesn't do it natively. **That is the product-shaped hole.**
3. **Their weekly loop is already fast** — setlist Tuesday, tweak delay/reverb, save to a channel, done. The job we can do is make that tweak correct in one go, not replace the loop.
4. **They actively perceive Helix as "super digital sounding."** Do not write copy that assumes Helix is the aspirational upgrade. In this segment it isn't.

Second corroborating account — an older worship player who chose Katana specifically to escape rig complexity:

> "I also play in a praise and worship band which requires many different effects. Connecting the processor to an amp got to be a mental and physical pain at my age, 74. … I got the Artist for the simplicity of setup, so I don't want to go down the wiring rabbit hole again."
> — u/OkBrilliant6436, r/BossKatana — https://www.reddit.com/r/BossKatana/comments/1jh5vh1/is_a_katana_mk1_worth_it_in_2025/mjatvo9/

### 6.2 Do they pay? Yes — but for tooling, not for tone

This is the sharpest finding in the segment, and it's a caution:

> "there is a phone app called katana librarian that you can use instead of the boss tone studio on a computer.... It completely opens every setting on the amp … Store infinite patches etc, **really worth the 12 bucks for the paid version for sure. Only app I've ever bought.**"
> — u/ilovea1steaksauce, r/BossKatana, 2025-02 — https://www.reddit.com/r/BossKatana/comments/1isjybx/picked_up_a_used_mkii_100_for_180_thought_it_was/mdjmo1v

> "I have been using the BTS app for a while but just pulled the trigger and paid for the Katana Librarian app. **The difference is that the Librarian allows you to install patches (presets) that people have created and made available on the Boss Tone Exchange website.**"
> — u/Zuckerandspice, r/BossKatana, 2024-10-12 — https://www.reddit.com/r/BossKatana/comments/1g1mwf3/boss_katana_gen_3_tone_studio_app/lriymnl

They spent money to get *easier access to free community patches.* "Only app I've ever bought" is a spending-ceiling statement. **Evidence that this segment will pay for preset content itself: still zero.** That is a real finding, not an absence of research.

### 6.3 Read

The Boss/budget segment is large, growing, and *explicitly* aware it is underserved — its own users cite the content vacuum as the reason to buy Line 6 instead. But it is a **free-sharing, request-answering culture that pays for convenience, not for tone**, and it does not suffer the home-vs-room pain that justifies our premium on the Helix side.

**Format implications:**
- Deliver **knob positions and numbers**, readable on a phone, dialable without a computer — that is how the community already trades settings, and the Katana's own channel-save workflow assumes it.
- Where files make sense, target **Katana Librarian / Boss Tone Exchange**, not a proprietary download.
- The content wedge is **"how to get dotted-eighth delay and ambient swells out of a Katana"** — the one thing their own users say is missing.
- **What would kill it:** charging for what Boss Tone Exchange gives away, requiring a computer, or writing copy that treats the Katana as a stepping stone to a Helix.

---

## 7. Who is competing for this attention right now (July 2026)

### 7.1 The incumbent has quietly restructured — and repriced

**Worship Tutorials has spun its guitar-preset business into a separate, non-worship-branded store: Signal Theory Audio** (signaltheoryaudio.com). Its Tone Pass 2026 is **$249.99** — supporting "at least 14 Tone-Match and amp-based patches," three back-catalogue presets, and 50% off further releases. It supports Line 6 Stadium/Proxy, Line 6 HX, Fractal, TONEX and Kemper, and **explicitly excludes Quad Cortex and Headrush.** Site claims **"over 970,000 preset downloads."** (https://signaltheoryaudio.com/collections/tone-pass)

**This contradicts our internal doc twice:** the Tone Pass is not "$99–$149/yr" (it is $249.99, and the 2025 edition listed at $159.99 down from $319.99), and the market leader is **de-emphasising the worship brand** for guitar presets. Worshiptutorials.com itself now lists individual song patches at **$9.99**, a Starter Pack at $49.99, and a Top Songs Pack at $69.99, and claims "Over 600,000 Line 6 HX presets downloaded."

Also worth noting: the flagship Worship Tutorials products are **artist series** (Bethel, Hillsong, Elevation), not song-specific — and the Bethel Helix patch page shows **"Version 5.0 (January 1, 2021)"** and **no reviews**. There is catalogue staleness at the top of this market.

### 7.2 New and newly-relevant competitors our docs don't list

| Who | What | Why it matters |
|---|---|---|
| **MultiTracks.com** | Sells Sam Wittek's "Helix – Worship Rig" preset packs; "New for 2026: Helix Stadium Patches with support for new Agoura Amp models" | **MultiTracks is the dominant worship rehearsal/multitrack platform.** They are inside the workflow we want to enter. Not mentioned anywhere in our internal docs. |
| **Sunday Shred** (sundayshred.com) | Song-specific Helix/Stadium patches at **$8.99/song**, versatile packs $12.99. Discloses honestly: *"The Patches…were not used on the original recordings…rather they were created by Sunday Shred with closest possible likeness"* | Direct, current, song-specific worship competitor at our price point. Their disclosure language is a good model. |
| **Worship Guitar Resources** | "These HX Stomp & Helix presets **and Tabs** will help you prepare for worship services with the right **parts and tones**" | Bundles **tabs + presets** — i.e. answers "what do I play" *and* "what does it sound like." The most complete answer to the #1 stated pain (§1.6). |
| **StadiumDepot** | "Your Line 6 Helix & Stadium community and marketplace for presets, learning, and beyond" — browse by band/song/genre, build setlists in-browser, sponsorship model | A marketplace + setlist builder. Structurally close to what we want to be. ~215 guitar presets currently. |
| **Tonevault.io** | Free Helix preset discovery with device/artist/tag filters (incl. a "worship" tag) and "ToneAI" | Free competitor to our browse experience. |
| **ToneBuilder.ai** | AI chat → complete Helix signal chain → `.hlx` export | Direct competitor to the ToneTrace concept, shipping today. |
| **Komposition101** | SEO content ("How to Build a Worship Guitar Rig on the Line 6 Helix", "How to Volume Match Presets on the Line 6 Helix: The Complete Guide [2026]") + own preset packs, **no named author** | Already ranking on our exact target queries with our exact content plan. |
| **David/Dave Hislop** | POD Go/Helix patches + IRs, ~$15 | The most-praised name in worship-specific patches in our Reddit corpus — more so than Worship Tutorials. |
| **Hey Worship Leader** (YouTube) | 40.4k subs, active worship rig/tone content | Active channel our docs don't list. |

### 7.2b The names worship players actually cite as authorities

Not the ones in our internal docs. From real recommendations in-thread: **David Hislop**, **Sam Wittek**, **Emilio Velasquez**, **Guitar for His Glory**, **Worship Tutorials**, and (for Helix generally) **Jason Sadites, Nick Hill, John Nathan Cordy, "The Bunn"**. The content format they name is the **"board rundown."**

One high-value craft detail surfaced in the same discussion, worth acting on: modern worship players increasingly run **wet effects in front of the amp** to saturate them at edge of breakup for the "wall of sound," and explicitly note that **Worship Tutorials does the opposite** (post-amp):

> "many big bands like Bethel or Hillsong started to put them in front of the amp to saturate through the Preamp at edge of breakup. That way they get this huge 'wall of sound'. … Worship Tutorials do most of their Line 6 presets that way [post-amp]"
> — u/Danjiele, r/WorshipGuitar, 2025 — https://www.reddit.com/r/WorshipGuitar/comments/1j1wl7s/board_for_2025_help_me_decide/mg2juff/

That is a concrete, checkable point of differentiation for our recipes — and a content topic ("wet in front vs. after the amp") with no authoritative write-up.

### 7.3 Platform news that changes the picture

- **Line 6 Helix Stadium / Stadium XL** — announced June 2025, XL shipped ~Nov 2025, Floor ~March 2026. New "Agoura" modelling. **Preset conversion from Helix/HX is one-way; Stadium can't read Helix-format files back; full backups can't be imported; IRs don't auto-map; Hybrid cabs load different-sounding equivalents.** Every preset seller is now shipping "Stadium versions."
- **Line 6 Proxy** — cloud-based amp cloning on Stadium. Line 6 now competes in captures.
- **Boss Katana Gen 3** — May 2024, from $299, Bluetooth app control.
- **Quad Cortex** — being *dropped* from the market leader's subscription (Tone Pass 2026 excludes it). This **supports** our internal decision to spend zero net-new effort on QC.

**Fast-growing / notable:** the AI-tone category (BIAS X, Cortex Studio, ToneBuilder.ai, ToneAI) went from nothing to platform-vendor-standard inside 12 months. r/WorshipGuitar nearly doubled in a year off a small base.

**Access shift worth flagging to the business:** TDPRI and TheGearPage have both erected **Tollbit AI paywalls**. Long-standing community research sources are closing to automated access. Anything we build that depends on scraping forums has a shrinking runway.

---

## 8. Unmet needs nobody is serving

Ranked by how repeatedly they surfaced with no product answer.

1. **"What am I supposed to play?"** — Chord charts don't tell a volunteer the *part*, and rehearsal explicitly isn't where they learn it. MDs are hand-rendering part-isolated MP3s to compensate. Only *Worship Guitar Resources* (tabs + presets) even attempts the combined answer. **This is a bigger pain than tone and it's adjacent to everything we already do.**
2. **Song-specific tone requests are served by DMs and YouTube comments.** The literal ask exists and goes unanswered: *"If I shared a song, is there someone good enough that could re-create a tone in Helix?"* — awrigh10, Line 6 Community, 2017 (thread 28452). The only answer offered was a YouTuber who "takes song requests too." **This is exactly the tone-request pipeline product.**
3. **A canonical preset-levelling standard.** *"Levelling the presets… everybody does it differently."* Nobody has published the method. Whoever does, owns a permanent citation.
4. **Weekly setlist→device workflow.** Rebuilding the setlist on the unit every week is a named, hated chore ("Makes me wanna sell the things"), and no vendor automates it. Still true: **no one has shipped a Planning Center preset integration.** Our internal claim survives.
5. **Preset documentation/export.** A user is OCR-ing screenshots to get a text list of his own presets. Trivial to solve, adjacent to what we sell.
6. **Room/PA translation as a product feature, not a lecture.** Everyone agrees home-dialled tones fail in the room, and the consensus answer is learned helplessness. A "sanctuary variant" or a documented 3-move adjustment path would be genuinely novel.
7. **Helix Stadium migration help for worship players.** New platform, one-way conversion, cabs that sound different, and a wave of buyers with $2,500 in and presets that won't import.
8. **Guidance on the preset-per-song vs. generic-preset schism.** A real methodological split, argued in every worship thread, never authoritatively resolved.
9. **The riff catalogue.** Experienced worship guitarists feel the electric role has thinned into ambient swells and want the *identifiable riffs* back — and they name the canon:

> "My journey with playing worship electric guitar for nearly 20 years has been driven by great riffs by guys like Nigel Hendroff, Jeffrey Kunde, and James Duke. … Recently with newest recordings from Upper Room, Bethel, Jenn Johnson, the 2 electric guitars I see are the thinnest layers in the mix. … If the Electric guitar is there, its merely synth-ey volume pedal swells. This needs to be brought back."
> — u/Reddik77, r/WorshipGuitar, 2023-03-11 — https://www.reddit.com/r/WorshipGuitar/comments/11p5bz2/the_vanishing_electric_guitar_riff_in_modern/

His list is a ready-made content plan: *Your Love Never Fails*, *Rooftops*, *Holy Spirit*, *Lion and the Lamb*, *Hope's Anthem*, *Hosanna*, *Take Heart*, *Oceans*, *With Everything*, *Holy*, *Here As In Heaven*, *At Your Name*, *Power of Your Love*. These are riff-identifiable songs with durable search intent — a different and possibly better target than chasing the current CCLI Top 25, where the electric part is often just swells.

---

## 9. Where our internal docs are CONTRADICTED

| Internal claim | What the evidence says | Confidence |
|---|---|---|
| **"Monday-Tuesday: Setlist drops … Tuesday-Thursday: personal practice window"** (`WORSHIP_MARKET_DEEP_DIVE.md` §3) | Monday is rare (one instance, framed as unusual discipline). Tue/Wed is the good case and usually yields **~1 day**. A large minority get <3 days or same-day. Actual solo prep is **1–2 hours**, often the night before. | **High** |
| **The setlist is a stable trigger** (implied throughout, and the basis of the PCO integration) | The setlist is **not final until soundcheck** — songs and *keys* change hours before service. Any product keyed to a fixed setlist/key must degrade gracefully. | **High** |
| **"Planning Center integration… turns a reactive Tuesday-night scramble into a one-click solution"** | PCO is universal, but notifications silently fail and attached files sometimes don't appear for team members. "It's in Planning Center" ≠ the guitarist has it. Also: this market is actively irritated by PCO-adjacent sales pitches. | **Medium-high** |
| **"Song-specific patches — the #1 purchase driver"** | Partly true, but the market leader's flagship products are **artist series**, not song-specific — and the loudest purchase justifications are about **time and curation**, not song accuracy. | **Medium** |
| **Tone Pass is "$99–$149/yr"** | Tone Pass 2026 is **$249.99**, sold under a new brand (Signal Theory Audio), and excludes Quad Cortex. | **High** |
| **Worship Tutorials is simply "the leader in worship guitar presets"** | It has **spun the preset business out of the worship brand**, its flagship worship patches show 2021 update dates and no reviews, and a customer publicly names its weakness: *"often uses the same Amp/Cab and effects chains in many different songs."* Meanwhile Dave Hislop is the more-praised name in our Reddit corpus. | **Medium-high** |
| **Competitor list (WT, PraiseCharts, Sunday Sounds, TWS, Worship Online, Worship Artistry, GuitarforHISGLORY)** | Misses **MultiTracks.com**, **Sunday Shred**, **Worship Guitar Resources**, **StadiumDepot**, **Tonevault**, **ToneBuilder.ai**, **Komposition101**, and the entire **AI-tone category**. | **High** |
| **"Line 6 ecosystem = 55–65% of the worship modeler market"** | **Unverified and unverifiable from primary sources.** No survey exists. What *is* evidenced is a *content* network effect — worship players choose Line 6 **because the patches exist**, which is a different (and better) argument. | **N/A — flag as estimate** |
| **"Reddit: r/worshipleaders — active community"** | 9k members. r/WorshipGuitar is 3k. r/BossKatana (37k) is bigger than both plus r/Line6Helix. Reddit worship-guitar is a **small** pond; and on r/Line6Helix, "Paid Preset/IR" is a **single-post flair category**. Preset commerce is a tiny share of the conversation. | **High** |
| **TDPRI "Worship Service Players" as a channel** | Now behind a **Tollbit paywall**. Same for TheGearPage. Both are effectively closed. | **High** |
| **Quad Cortex as a growth threat** | The market leader **dropped QC from its 2026 subscription.** Supports our zero-effort-on-QC decision. | **Medium-high** |
| **AI-made presets are a novel/risky position** | AI tone generation is now shipped by **Positive Grid, Neural DSP, and Line 6-adjacent startups**, openly branded as AI. We are late, not early. The differentiator is no longer "AI" — it is **verification**. | **High** |
| **Boss Katana as a "secondary segment" we can sell Set-Pack-style content to** (`TARGET_SEGMENT_AND_SEO_STRATEGY.md`) | "Underserved and winnable" holds. But the *monetisation* premise doesn't: this segment pays for tooling ($12 librarian app) to access **free** community patches, and its own worship users say the Katana already delivers "the tone I dial in is the tone I get even when playing live" — so our strongest Helix pitch (home→room translation) does not transfer. The real hole is **dotted-eighth delay and ambient swells**, which the amp lacks. | **Medium-high** |

---

## 10. What this means for F&K

### Product
1. **Design for a 60–90 minute window the night before, on an unstable setlist.** Every recipe must be usable in one pass with no computer required beyond the download. Nothing that assumes three evenings.
2. **Make the "recipe" framing do the work it's uniquely good at.** The #1 regret is *"I tweaked it anyway — why did I pay?"* A recipe that ships as an explicit starting point **plus a documented 3-move adjustment path** (gain / mids / output) converts that regret into the value proposition.
3. **Adopt the §3.3 QA spec as hard release gates**, especially: level-matching within a pack, test-import on target hardware at the target DSP budget, no required third-party IRs, and stated guitar/pickup/monitoring assumptions.
4. **Ship a "sanctuary variant" or a room-translation move-set.** The home-vs-church gap is the #1 pain and the field consensus is "you can't fix it." Being the ones who try is differentiating.
5. **Respect the HX Stomp's one setlist and its DSP budget.** Publish DSP cost per recipe. Nobody else does.
6. **Serve Helix Stadium now.** One-way conversion, cabs that sound different, and a cohort of new owners with import problems. Every competitor is already shipping Stadium versions.
7. **Consider bundling the part, not just the tone.** "What do I play" outranks "what does it sound like." Tabs/part-notes alongside the patch is the highest-leverage adjacency we found.
8. **Keep the Planning Center integration, but reposition it.** Complement PCO; never look like a PCO alternative. Assume the setlist may change and notifications may not arrive.

### Copy & SEO
9. **Say "patch" in worship contexts.** Title pattern: *"[Song] — Helix patch & tone."* "Tone recipe" is a fine brand term but not a search term.
10. **Use "bedroom tone" — it's their word.** Drop "tweak-itis," "washy," "shimmer," and "pad" (as a guitar term); none are native.
11. **Sell the FOH outcome, not the tone.** The best purchase testimonial we found measures success as *"always getting compliments from the sound guys about my tone."* That's the promise.
12. **Lead with time and curation, not accuracy.** "I don't have time to build tones and I need to trust it'll get the job done" is the buyer's own sentence.
13. **Do not lean on demo videos alone.** A visible faction distrusts them outright. Pair every demo with the delivered-file-unmodified claim and the stated rig.

### AI positioning
14. **Disclose, and pair disclosure with verification.** "AI-assisted, hardware-verified" is defensible. "AI-generated" alone inherits the hallucination reputation that a Line 6 developer publicly attached to LLM preset advice.
15. **Use the church's own line: AI assists the craft; humans do the worship.** Never let copy imply the tone is the ministry. Every faith-side objection we found is about AI *authoring worship*, not AI helping with a delay time.
16. **The moat is verification, not generation.** ToneBuilder.ai already generates `.hlx` files from chat. What nobody does is test-import, DSP-check, level-match and publish the check.

### Strategy
17. **We have no name, and name is the #2 trust signal.** Fremen, MBritt, Hislop, Sadites function as safety shorthand. Free, genuinely good, individually attributable recipes are the only route to that.
18. **The budget/Boss segment is large and *self-identified* as underserved**, but it pays for **convenience, not tone** (evidence: they buy a $12 librarian app to reach *free* community patches; zero evidence of paying for presets). Enter it with **free content that wins the name** — specifically "dotted-eighth delay and ambient swells on a Katana," the gap their own users name — and monetise elsewhere. Do not port the Helix pricing model. And note the Katana player does **not** have the home-vs-room pain, so our strongest Helix-side pitch doesn't transfer.
19. **Assume forum research access keeps closing.** TDPRI and TGP are already paywalled to automated access.

---

## Appendix — evidence gaps to close next

- **YouTube comments** — completely uncovered. The "what do people ask repeatedly" question is unanswered. Needs a session with YouTube access.
- **FOH/sound-engineer counter-perspective** — we have guitarists complaining; we have almost nothing from engineers about worship guitarists. ProSoundWeb topic 156115 ("Constant 'It's Too Loud' Complaints") and the Worship Sound Guy Facebook "too loud" thread are the named targets.
- **Worship-vendor VOC beyond Worship Tutorials** — zero verbatim evidence on That Worship Sound, Sunday Sounds, Worship Online, or GuitarforHISGLORY.
- **Subscription fatigue** — no direct quotes found. Relevant to any Sunday Ready pricing decision.
- **TDPRI "Worship Service Players"** — the highest-value blocked source. Worth manual browsing.
- **Katana monetisation** — we found evidence they pay for *tooling* and none that they pay for *presets*. Absence of evidence, not evidence of absence: worth one cheap live test (a paid Katana worship pack) before concluding.
- **Boss Tone Exchange** — not directly inspected. Worth auditing: how much worship content is already there, and how good it is.
- **Disclosure A/B evidence** — no niche-specific data on whether "AI-assisted" labelling helps or hurts conversion. Testable.
</content>
</invoke>
