# Headless Distribution Playbook — Fader & Knob

**Created:** 2026-07-17 (overnight session). **Research basis:**
docs/research/HEADLESS_DISTRIBUTION_RESEARCH_2026-07-17.md and
docs/research/AI_CITATION_RESEARCH_2026-07-17.md.

"Headless" = runs without a human fronting it, within platform rules, and
honest about what F&K is (openly AI-operated, human-verified). Three lanes:

- **AUTOMATED** — runs itself once built. No per-item human action.
- **SEMI** — pipeline prepares everything; Daniel approves/executes each item
  or does a one-time handshake, then it runs itself.
- **HUMAN (capital events)** — Daniel, once, on purpose. Not automation.

Complements docs/outreach-drafts.md (Nathan's human community lane) — this
doc never posts to communities as a person. **Standing rule: nothing in the
SEMI or HUMAN lanes fires without Daniel's explicit go, ever.**

---

## Lane 1 — AUTOMATED (status)

| Piece | Status | Notes |
|---|---|---|
| IndexNow on deploy (Bing/Yandex/Naver/Seznam) | ✅ SHIPPED 2026-07-17 | CI job, changed-URLs-only (48h window), `INDEXNOW_ENABLED` gate. Bing = ChatGPT/Copilot retrieval backbone. |
| WebSub hub declaration + publish pings | ✅ SHIPPED 2026-07-17 | Hubs in feed.xml/feed.json + CI ping on deploy → Feedly/NewsBlur/Flipboard/Inoreader real-time. |
| JSON Feed (/feed.json) | ✅ SHIPPED 2026-07-17 | NetNewsWire/Reeder/FreshRSS crowd. |
| Feed images + self-link + 50-item cap | ✅ SHIPPED 2026-07-17 | media:thumbnail per item — Flipboard's ≥400px art requirement. |
| Discover hygiene (`max-image-preview:large`, feed links in head) | ✅ SHIPPED 2026-07-17 | Follow-feature eligible; Discover itself is a lottery ticket. |
| Full-content feed (`content:encoded`) | 🔲 BACKLOG | Blocked on an MDX→HTML renderer for Knob/SettingsGrid/FAQ components (291/370 posts use them). Unlocks Flipboard/SmartNews's preferred format. |
| F&K Discord `#new-recipes` webhook | 🔲 NEEDS DANIEL | Creating the server + webhook is a one-time human act; the feed then runs itself (MonitoRSS or a 20-line script in CI). |
| YouTube Shorts autopost | 🔲 NEEDS DANIEL | Clips pipeline exists. Gate: one-time YouTube API compliance audit for the Google Cloud project, else API uploads are locked private. Then: disclose synthetic media on every upload, few/week, each song-specific. |
| Podcast feed ("Tone Recipe Radio") | 🔲 IDEA | AI-voiced weekly digest from posts, openly labeled — accepted practice on Apple/Spotify; whole second directory ecosystem. Medium build. |

## Lane 2 — SEMI (prepared by pipeline, human executes)

1. **Line 6 CustomTone** — the best-matched audience that exists (every visitor
   owns a Helix). Plan: `scripts/customtone-batch.ts` (TO BUILD) exports 2-3
   .hlx presets/week + title/description with recipe URL; Daniel uploads under
   a real-name, openly F&K-branded account (Yamaha ToS requires real name; no
   automated form submission — their anti-interference clause). The preset is
   the value; the link is a footnote. Measure via UTM/slug.
2. **Flipboard Magazine** — one-time submission at flipboard.com/publishers
   (feed now meets the image requirement; full-content upgrade strengthens the
   application). After approval: fully automated forever.
3. **SmartNews application** — long shot, one form, needs the full-content
   feed first. File under "while you're at it."
4. **Partner Discord feed channels** — DM admins of Helix/worship-guitar
   servers offering an opt-in #tone-recipes webhook channel. One human message
   each; headless after consent. The anti-astroturf version of community reach.
5. **guitarpatches.com (Katana .tsl)** — occasional uploads, transparent
   account, same pattern as CustomTone.

## Lane 3 — HUMAN capital events (once, on purpose)

- **Show HN** — F&K qualifies ("something people can play with" = free preset
  downloads). Lead with the /experiment log and honest failure data; Daniel in
  the comments for a day. Biggest single-day discovery event available.
- **AI newsletter/directory circuit** — Ben's Bites community submission,
  There's An AI For That, Uneed/MicroLaunch/TinyLaunch/BetaList/SaaSHub.
  ~15 min each, permanent backlinks, the "openly AI-run business" story is hot.
- **Reddit** — human-only by both rules and culture (Reddit 403s headless
  rules-fetching; that's the tell). One transparent launch post per relevant
  sub, months apart, from Nathan/Daniel per outreach-drafts.md. Note from
  citation research: engines anoint 3-5 subreddits as truth sources per topic —
  being genuinely present there is also an AI-citation play, not just traffic.

## Explicitly rejected

- Automated posting to Reddit/Facebook/forums (rules + ethics + brand).
- TONE3000 (NAM/IR only — recheck quarterly; upload API is on their roadmap,
  and an F&K IR-pack line would make it the best API-native channel).
- Cortex Cloud / ToneNET (walled gardens, wrong formats/strategy).
- Facebook Groups (API removed 2024; Pages autopost ≈ zero reach).
- Anything that hides the AI-operated nature of the site.

## Measurement

- GA4: referral sessions from feedly/flipboard/discord.com/news.ycombinator;
  UTM on CustomTone/description links.
- Bing Webmaster Tools AI Performance report (monthly — also the AI-citation
  ground truth per the citation research).
- Add a `distribution` section to the monthly index-health-log entry.
