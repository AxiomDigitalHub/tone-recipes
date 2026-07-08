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
    title: "An empty app and a question",
    body: "Day one was an empty app and one question: can AI build guitar resources that are actually good? Not another pile of “set everything to 5 and use your ears” advice — real settings, for real rigs, that get you the sound on the record.",
  },
  {
    date: "2026-03-22",
    title: "It starts to feel real",
    body: "Ten tones in, it looked like an actual product. You could make an account, save favorites, and see every tone laid out like a pedalboard — with the same settings translated for whatever gear you own.",
  },
  {
    date: "2026-03-25",
    title: "First downloadable presets",
    body: "The library hit 30 tones and shipped its first preset files. Reading the settings is nice. Downloading a file your Helix just loads — that's the point.",
  },
  {
    date: "2026-03-26",
    title: "The first public corrections",
    body: "An audit caught 12 tones with wrong settings. We fixed them the same day and left the record public. That became the pattern for everything here: the AI builds, we check, and when something's wrong, we fix it in the open instead of quietly swapping it.",
  },
  {
    date: "2026-03-28",
    title: "Fader & Knob is born — and so are the writers",
    body: "ToneRecipes became Fader & Knob. The same day we tried the strangest part of the experiment: instead of one generic blog voice, we built a roster of AI writers — each with its own name, taste, and rig — because guitarists aren't one person, and the advice shouldn't read like they are. Every article got rewritten in their voices.",
  },
  {
    date: "2026-03-29",
    title: "The engine starts running itself",
    body: "The content system went autonomous: five new articles a day, plus its own research into what guitarists are actually searching for. Nobody presses a button. It publishes on its own, every day, and it hasn't stopped.",
  },
  {
    date: "2026-04-05",
    title: "Making the files actually load",
    body: "The least glamorous work and the most important: getting our preset files to load perfectly on real hardware. In one day we found 38 tones quietly pointing at the wrong amp or effect models and fixed every one, checking our files against 250+ presets made on the actual gear. A preset that lists the right settings but loads the wrong amp helps nobody.",
  },
  {
    date: "2026-04-07",
    title: "Fourteen homepages in two days",
    body: "We rebuilt the homepage fourteen times in two days, chasing a look that didn't feel like every other AI-made website. Most of those fourteen were bad. They're all still in the record — that's the deal.",
  },
  {
    date: "2026-04-08",
    title: "Saying the quiet part out loud",
    body: "We published our first page explaining exactly what the AI does here, in plain language. Until then, that disclosure lived in the footer fine print. It shouldn't have.",
  },
  {
    date: "2026-04-26",
    title: "Rebuilding the presets against the real thing",
    body: "We collected the Helix's own factory presets and rebuilt our preset generator to match them exactly — no more guessing at what the hardware expects. Then we regenerated every artist preset from those verified templates.",
  },
  {
    date: "2026-05-01",
    title: "Every tone gets its homework",
    body: "All 50 flagship tones got a research deep-dive: what did Hetfield, Iommi, Van Halen, and Gilmour actually play through on those records? Where the research disagreed with our settings, the settings changed.",
  },
  {
    date: "2026-05-03",
    title: "The redesign becomes the site",
    body: "After eleven rounds of feedback, the new design became the site you're looking at now. One decision from that week stuck with me: we stopped putting “look how many tones we have” counters all over the pages. Bragging about volume isn't the point. Being right is.",
  },
  {
    date: "2026-06-26",
    title: "Axl picks up the phone",
    body: "We launched Axl, our tone chatbot — trained specifically on guitar tone, so when you ask how to fix a muddy bridge pickup you get real settings back, not the vague hand-waving you'd get from a general-purpose chatbot. The Sunday Setlist newsletter started sending itself the same week.",
  },
  {
    date: "2026-07-06",
    title: "The experiment starts reporting on itself",
    body: "An outside audit made us look in the mirror. Early on, we had seeded the site with fake ratings and comments so it wouldn't look empty. That was wrong. We deleted them from the live site, kept only what's real, and built this page — where every number is counted from the actual work, not typed in by anyone. What you're reading is the correction.",
  },
  {
    date: "2026-07-07",
    title: "Fired by our host, back online by dinner",
    body: "Our hosting company blocked the site — every visitor got an error page, including Google. So that same day we moved: a $6-a-month server of our own, automated publishing that costs nothing, and Cloudflare in front for protection. By dinner the site was back up on machines nobody can switch off. The page you're reading is served from that box.",
  },
];
