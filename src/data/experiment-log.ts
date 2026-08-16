/**
 * The Experiment — running log
 * ----------------------------
 * Curated milestones rendered on /experiment. Every entry is grounded in
 * the actual git history — dates and facts come from commits, not memory.
 * Append new entries at the END as the experiment continues. FACTS are
 * append-only (never revise what happened); wording may be edited for
 * voice and clarity (2026-07-08 voice pass: Daniel's plainspoken first
 * person — a guitarist who found the site yesterday should understand
 * every entry; no git-speak, no insider shorthand).
 *
 * 2026-07-30 headline pass: titles state what happened, in plain words.
 * No metaphors, no riddles — a reader scanning the list should know what
 * each entry is about before opening it. ("The small door that opened on
 * the wrong room" meant nothing; it is now "Signing in sent you to the
 * wrong page.") Bodies were not touched.
 *
 * The dashboard numbers on the same page come from
 * src/data/experiment-stats.json — regenerate with
 * `npx tsx scripts/generate-experiment-stats.mts`.
 */

export interface ExperimentLogEntry {
  /** ISO date (YYYY-MM-DD) — matches the commit(s) it describes. */
  date: string;
  title: string;
  body: string;
}

export const experimentLog: ExperimentLogEntry[] = [
  {
    date: "2026-03-16",
    title: "Day one: can AI actually do this?",
    body: "Day one was an empty app and one question: can AI build guitar resources that are actually good? Not another pile of “set everything to 5 and use your ears” advice — real settings, for real rigs, that get you the sound on the record.",
  },
  {
    date: "2026-03-22",
    title: "Ten tones, accounts, and a pedalboard view",
    body: "Ten tones in, it looked like an actual product. You could make an account, save favorites, and see every tone laid out like a pedalboard — with the same settings translated for whatever gear you own.",
  },
  {
    date: "2026-03-25",
    title: "The first downloadable presets",
    body: "The library hit 30 tones and shipped its first preset files. Reading the settings is nice. Downloading a file your Helix just loads — that's the point.",
  },
  {
    date: "2026-03-26",
    title: "An audit finds 12 tones with wrong settings",
    body: "An audit caught 12 tones with wrong settings. We fixed them the same day and left the record public. That became the pattern for everything here: the AI builds, we check, and when something's wrong, we fix it in the open instead of quietly swapping it.",
  },
  {
    date: "2026-03-28",
    title: "Fader & Knob, and a roster of AI writers",
    body: "ToneRecipes became Fader & Knob. The same day we tried the strangest part of the experiment: instead of one generic blog voice, we built a roster of AI writers — each with its own name, taste, and rig — because guitarists aren't one person, and the advice shouldn't read like they are. Every article got rewritten in their voices.",
  },
  {
    date: "2026-03-29",
    title: "The site starts publishing on its own",
    body: "The content system went autonomous: five new articles a day, plus its own research into what guitarists are actually searching for. Nobody presses a button. It publishes on its own, every day, and it hasn't stopped.",
  },
  {
    date: "2026-04-05",
    title: "38 presets were loading the wrong amp",
    body: "The least glamorous work and the most important: getting our preset files to load perfectly on real hardware. In one day we found 38 tones quietly pointing at the wrong amp or effect models and fixed every one, checking our files against 250+ presets made on the actual gear. A preset that lists the right settings but loads the wrong amp helps nobody.",
  },
  {
    date: "2026-04-07",
    title: "Fourteen homepages in two days",
    body: "We rebuilt the homepage fourteen times in two days, chasing a look that didn't feel like every other AI-made website. Most of those fourteen were bad. They're all still in the record — that's the deal.",
  },
  {
    date: "2026-04-08",
    title: "We explain what the AI actually does here",
    body: "We published our first page explaining exactly what the AI does here, in plain language. Until then, that disclosure lived in the footer fine print. It shouldn't have.",
  },
  {
    date: "2026-04-26",
    title: "Rebuilding our presets against Line 6's own files",
    body: "We collected the Helix's own factory presets and rebuilt our preset generator to match them exactly — no more guessing at what the hardware expects. Then we regenerated every artist preset from those verified templates.",
  },
  {
    date: "2026-05-01",
    title: "Fifty tones get a research deep-dive",
    body: "All 50 flagship tones got a research deep-dive: what did Hetfield, Iommi, Van Halen, and Gilmour actually play through on those records? Where the research disagreed with our settings, the settings changed.",
  },
  {
    date: "2026-05-03",
    title: "The redesign goes live, and the counters come down",
    body: "After eleven rounds of feedback, the new design became the site you're looking at now. One decision from that week stuck with me: we stopped putting “look how many tones we have” counters all over the pages. Bragging about volume isn't the point. Being right is.",
  },
  {
    date: "2026-06-26",
    title: "Axl: a chatbot that only knows guitar tone",
    body: "We launched Axl, our tone chatbot — trained specifically on guitar tone, so when you ask how to fix a muddy bridge pickup you get real settings back, not the vague hand-waving you'd get from a general-purpose chatbot. The Sunday Setlist newsletter started sending itself the same week.",
  },
  {
    date: "2026-07-06",
    title: "We deleted our fake ratings and built this page",
    body: "An outside audit made us look in the mirror. Early on, we had seeded the site with fake ratings and comments so it wouldn't look empty. That was wrong. We deleted them from the live site, kept only what's real, and built this page — where every number is counted from the actual work, not typed in by anyone. What you're reading is the correction.",
  },
  {
    date: "2026-07-07",
    title: "Fired by our host, back online by dinner",
    body: "Our hosting company blocked the site — every visitor got an error page, including Google. So that same day we moved: a $6-a-month server of our own, automated publishing that costs nothing, and Cloudflare in front for protection. By dinner the site was back up on machines nobody can switch off. The page you're reading is served from that box.",
  },
  {
    date: "2026-07-08",
    title: "21 errors in our three most-read guides",
    body: "While I slept, the AI fact-checked our three most-read guides against outside sources and found 21 errors — including describing a famous Fender circuit wrong and a $1,399 speaker listed at $500. All fixed by morning, in the open as always. The same sweep caught something embarrassing for an AI experiment: our new shield service had quietly rewritten our rules file to tell every AI crawler to go away. The site built by AI was blocking AI. Found overnight, fixed with one toggle in the morning.",
  },
  {
    date: "2026-07-08",
    title: "A second AI whose only job is to fail the first",
    body: "We gave the AI a proper job description for writing new tones — research the real rig, cite sources, follow every rule we've written down — and a second AI whose only job is to fail the first one's work. Its first tone passed every written rule. Then the inspector failed the preset file anyway: four real problems, caught before any human saw them, including a bug that had been quietly hiding in presets we shipped months ago. Everything was fixed and re-checked the same night. That's the loop this whole experiment has been building toward: one AI builds, another tries to tear it down, and the record stays public.",
  },
  {
    date: "2026-07-08",
    title: "Why bought presets fail, and what we ship now",
    body: "We spent the night reading what guitarists say about preset sellers, and the verdict is brutal: presets don't fail because they sound bad — they fail because they were dialed in on someone else's speakers, someone else's pickups, someone else's room. So we stopped shipping bare preset files. Every download is now a pack: the preset, plain-language notes on why every block is there, install steps that assume nothing, and a troubleshooter for when it sounds wrong on your rig — because it might, and pretending otherwise is how preset sellers lose people. One thing we deliberately did not ship: a “level-matched” promise. We built the measuring tool first. The promise waits until the measurements say we've earned it.",
  },
  {
    date: "2026-07-08",
    title: "We built a preset for the pedal we were reporting on",
    body: "A $679 delay pedal was announced yesterday. Instead of just reporting it, we built a free Helix preset that imitates its signature trick — two different delays running side by side — drew a map of how the signal flows, and put both in the article. If we cover gear, you should get to try the idea in the next five minutes, not just read about it. Building it also pushed our preset tech somewhere it had never been: that side-by-side routing had to be assembled by hand from real hardware files, which taught us exactly what to automate next.",
  },
  {
    date: "2026-07-10",
    title: "One dashboard with the real numbers",
    body: "For months, the honest answer to “how's the site actually doing?” lived scattered across five different tools. So we built one screen that pulls the real numbers straight from the database — who signed up this week, who's paying, what they're downloading — instead of the guesswork ad-blockers leave behind. Building it surfaced a bug worth telling on ourselves: the owner's own admin access had been silently switched off the moment he subscribed to a plan, because one setting was quietly doing two jobs at once. Fixed, and split apart so it can't happen again. You can't improve what you can't see.",
  },
  {
    date: "2026-07-10",
    title: "Signing in sent you to the wrong page",
    body: "For a while, signing in could drop you somewhere random — you'd log in from the browse page and land back on the home screen for no reason. Turned out four different parts of the site each had their own idea of where to send you afterward, so it was luck of the draw. We gave them one rule: after you sign in, you go back to wherever you were. It's a small thing. But the small things are what quietly tell people whether anyone's actually paying attention. Someone is.",
  },
  {
    date: "2026-07-13",
    title: "Ask us for a tone we don't have",
    body: "Until now, if the song you needed wasn't in the library, that was the end of the conversation. So we built the other direction: you can ask for a tone, and it goes into a real queue with your name on it. Everyone gets a couple of requests; paying members get more. There's a page that shows you what you asked for and where it stands. It's also the most honest market research we have — instead of guessing what to build next, we're now being told.",
  },
  {
    date: "2026-07-17",
    title: "Axl stops inventing settings it doesn't have",
    body: "Our tone chatbot had two bad habits. It would occasionally think out loud in front of you — you'd ask about a delay setting and get a paragraph of the machine talking to itself. And when it didn't know a song, it would improvise settings rather than admit the gap. We fixed both: the chat now answers from the settings we've actually published, and when a song isn't in the archive it says so and offers to file the request for you. A chatbot that confidently invents amp settings is worse than no chatbot.",
  },
  {
    date: "2026-07-22",
    title: "The newsletter signup was showing people an error",
    body: "Someone tried to join the newsletter from the homepage and instead of a thank-you they got a raw error page with a web address they'd never seen. It had been doing that quietly — the form was submitting the old-fashioned way and the code behind it only knew how to answer modern requests. Every person who signed up from the homepage without JavaScript running hit a wall. Fixed the same day. I don't know how many people that cost us, and that's the part that stings: the failures that don't show up in any dashboard are the expensive ones.",
  },
  {
    date: "2026-07-25",
    title: "Most of our download buttons didn't work",
    body: "This is the worst thing we've found so far. Only 50 tones had a preset file sitting on the server, but every tone in the library showed a download button. So you'd find your song, make an account because we asked you to, click download — and get nothing. Every Katana download failed too, and the Quad Cortex button never got built at all, even though the machinery behind it had worked for months. We rewired every download to build the file on demand instead of hunting for one that was never made, then checked all of them: every tone in the library now produces a working file, with the notes, install steps, and a troubleshooter in the same zip. If you hit that dead end, I'm sorry. It was live for longer than I want to admit.",
  },
  {
    date: "2026-07-25",
    title: "A quarter of our presets were dropping blocks",
    body: "We stopped adding things for a night and measured what we'd already built, honestly, nine different ways. The results: about a quarter of our tones were quietly dropping a block when the file got built — one of them lost its amp and its speaker cabinet, which means the preset couldn't possibly sound like the record. Most of the causes were embarrassing rather than hard: our own writing called a pedal by its real-world name when the Helix calls it something else for trademark reasons. Worse for strategy: we say we're building for worship guitarists, and five songs out of the whole library were worship songs. One song from the 2020s. Total. You can't fix what you refuse to count.",
  },
  {
    date: "2026-07-25",
    title: "Making the site readable by AI assistants",
    body: "More people find answers through an AI now than by scrolling a results page, so we made the site properly readable by them: a clean text version of every page for any assistant that asks for one, a formal way for an AI agent to look up our tones directly, and a plain statement in our rules file that AI systems are welcome to read and train on what we publish. Two weeks earlier we'd turned down a piece of this — advertising a service address we hadn't actually built — because announcing a door that opens onto nothing is exactly the kind of thing this experiment is supposed to not do. We built the door first. Then we announced it.",
  },
  {
    date: "2026-07-26",
    title: "We cancelled the tool we'd planned since spring",
    body: "The original pitch for this whole thing was a tool where you upload a clip of a tone you love and get back the settings to recreate it. We researched it for months. Then a night of digging turned up the obvious: one of the big modeling companies shipped exactly that last September, inside the amp software people already own. We're not going to build a worse version of a thing our customers already have. So we cut it, wrote down why, and kept the parts that were actually ours — the research layer underneath, and the request queue that tells us what people can't find anywhere else. Announcing a pivot is easy. Cancelling your own favorite idea is the part nobody posts about.",
  },
  {
    date: "2026-08-05",
    title: "Every recipe page now shows what we checked — and what we didn't",
    body: "We had a blue verified checkmark on all 205 tones. Hover it and it said \"manually reviewed and verified by our editorial team.\" There is no editorial team. Nobody here plugs in a guitar. That badge was on every card in the library and it was simply false, so it's gone. What replaced it is a block on every recipe page listing what a program actually checked on that specific tone: whether the preset file we hand you contains every block we printed, how much of the amp's processing power the chain uses, whether the sources are real gear journalism or somebody's wiki, and how firmly the guitarist is tied to that specific part. Underneath it, in the same size type, is what nobody checked — starting with the fact that no human has ever heard these settings played.",
  },
  {
    date: "2026-08-05",
    title: "Every compressor we shipped was set wrong",
    body: "Building that block meant measuring things we'd never measured, and the first number back was bad. Compressor attack and release times were written in our library as milliseconds — 60, 200, 910 — but the code that builds your preset had no rule for them, so anything above 10 got flattened to the maximum. Every compressor in every Helix preset we've ever handed out was shipping with the slowest possible attack and the slowest possible release, which is close to the compressor doing nothing at all. The same confusion showed on the page: a 60-millisecond attack printed as \"Attack 60s\". Sixty seconds. We fixed the values, fixed the display, and added a rule to the nightly check so a number that contradicts its own scale can't pass again. That rule immediately found about 2,600 more values where the scale we print doesn't match the gear — most of them because a Boss Katana runs its knobs 0 to 100 and we were describing them 0 to 10. Those are written down and being worked through in the open.",
  },
  {
    date: "2026-08-05",
    title: "The Quad Cortex and Katana files were quietly wrong",
    body: "The same measurement turned up something worse than the compressor. When our library names a block the translator doesn't recognise, the Helix builder leaves it out — visible, honest, annoying. The Quad Cortex and Katana builders instead substitute something else and say nothing. A block called \"Studio Comp\" was coming out as a Tube Screamer in 175 tones: a compressor turned into an overdrive, in a file that loads perfectly and sounds nothing like the record. On Katana, the word \"Reverb\" wasn't in the translation table at all, so it fell through to the overdrive slot and any real reverb later in the chain got dropped. Not one of our 205 tones produces a fully correct Quad Cortex or Katana file today. That's now printed on each recipe page, per platform, with the blocks named, so you know exactly what to set by hand before you play it. Fixing the translation tables is next; telling you first was the part that couldn't wait.",
  },
];
