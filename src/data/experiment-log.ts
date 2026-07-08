/**
 * The Experiment — running log
 * ----------------------------
 * Curated milestones rendered on /experiment. Every entry is grounded in
 * the actual git history — dates and facts come from commits, not memory.
 * Append new entries at the END as the experiment continues; never rewrite
 * old ones (the log is the record, warts included).
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
    body: "The first commit is a bare create-next-app. The question behind it: can AI build guitar-tone resources good enough that real players actually use them — exact per-rig settings, not another “set everything to 5 and trust your ears” content farm?",
  },
  {
    date: "2026-03-22",
    title: "It becomes a product",
    body: "Ten recipes, user accounts, favorites, album art, and a signal chain you can read like a pedalboard. One tone, translated across platforms.",
  },
  {
    date: "2026-03-25",
    title: "First downloadable presets",
    body: "The library hits 30 recipes and ships its first .hlx files. A recipe you can read is nice; a file you can load is the point.",
  },
  {
    date: "2026-03-26",
    title: "First public corrections",
    body: "A tone audit catches 12 recipes with flat-out wrong settings. They get fixed in one commit, in the open. The generate → check → correct loop starts here and never stops.",
  },
  {
    date: "2026-03-28",
    title: "Fader & Knob is born — and so are the writers",
    body: "ToneRecipes becomes Fader & Knob. Same day, the strangest branch of the experiment: instead of one anonymous blog voice, a roster of AI authors — each with a name, a rig, formative bands, a personality profile — so the writing sounds like the actual range of players in the community. Every post gets rewritten in their voices.",
  },
  {
    date: "2026-03-29",
    title: "The engine goes autonomous",
    body: "The content pipeline starts running itself: five posts, a SERP analysis, and five new target topics per day, committed automatically. Dozens of those runs now sit in the history.",
  },
  {
    date: "2026-04-05",
    title: "Making the files actually load",
    body: "The least glamorous, most important stretch: reverse-engineering the Helix .hlx format from real HX Edit exports. One day’s haul: 38 wrong amp/effect model IDs found and fixed, verified against 250+ real presets. A patch that lists the right settings is useless if it loads the wrong amp.",
  },
  {
    date: "2026-04-07",
    title: "Fourteen homepages in two days",
    body: "The hero section gets rebuilt fourteen times in a row — v4 r1 through r14 — chasing a look that could stand out on an AI-saturated web. Most of the fourteen were bad. All of them are in the log.",
  },
  {
    date: "2026-04-08",
    title: "The transparency page ships",
    body: "Pricing restructures, and the site gets its first AI-transparency page — what the AI does, in plain language. The disclosure stops being a footer whisper.",
  },
  {
    date: "2026-04-26",
    title: "Ground truth for the generator",
    body: "The Helix factory-preset corpus gets harvested into a structured dataset, and the preset generator is rebuilt against it — no more speculating model IDs. Every artist preset is regenerated from verified templates.",
  },
  {
    date: "2026-05-01",
    title: "Every recipe gets its homework",
    body: "All 50 flagship tones receive deep-dive rig research — 50 documents on what the artists actually played through — and the corrections flow back into the recipes: Hetfield, Iommi, Van Halen, Gilmour, and the rest.",
  },
  {
    date: "2026-05-03",
    title: "The redesign becomes the site",
    body: "After eleven public feedback rounds, the editorial v3 design cuts over to become faderandknob.com. One commit from that week says it all: “drop count-flex eyebrows” — the day bragging about volume stopped being the strategy.",
  },
  {
    date: "2026-06-26",
    title: "Axl picks up the phone",
    body: "The tone chatbot launches with a rockstar persona, built specifically to reason about gain staging and block order instead of bluffing like a general model. The Sunday Setlist newsletter starts sending itself.",
  },
  {
    date: "2026-07-06",
    title: "The experiment starts reporting on itself",
    body: "A content-authority audit forces a hard look in the mirror: seeded ratings and comments — fake social proof from the early days — get deleted from production. Real ratings become server-rendered. And this page ships, with every number generated from the repository instead of typed by anyone. What you’re reading is the correction.",
  },
  {
    date: "2026-07-07",
    title: "Fired by our host, live on our own server by dinner",
    body: "Our hosting platform fair-use-blocks the account — the site serves 402 errors to everyone, including Google. The response, built the same day: a portable Docker image, a free CI pipeline that builds it on every commit, a $6 server, and Cloudflare in front. DNS cuts over, certificates issue in four seconds, and the daily content engine now deploys to infrastructure nobody can switch off. The page you’re reading is served from that box.",
  },
];
