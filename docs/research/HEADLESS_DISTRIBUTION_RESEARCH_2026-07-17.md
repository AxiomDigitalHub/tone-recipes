# Headless Distribution Channels — Research Pass 2026-07-17

> Full findings from the overnight research agent (channel rules verified against
> primary sources where reachable). Action plan lives in
> docs/HEADLESS_DISTRIBUTION_PLAYBOOK.md. This file is the reference.

(Channel-by-channel findings preserved verbatim below.)

## Preset platforms
- **Line 6 CustomTone** — best audience match on the internet (every visitor owns a
  Helix). Web-form upload only, no API. Yamaha ToS: no solicitation outside designated
  areas; real-name accounts; no automation that "interferes." De-facto norm tolerates
  creator attribution links when the preset is the value (cf. established preset makers).
  Lane: SEMI — pipeline generates .hlx + title/description with recipe URL; a human
  uploads 2–3/week under a real-name, openly F&K-branded account.
- **ToneHunt → TONE3000** — rebranded, NAM/IR-only (no .hlx/.tsl/QC). Has a real
  OAuth2 REST API, currently READ-only; upload API on their public roadmap. Re-check
  quarterly; an F&K IR-pack line would be the wedge. Lane: watch.
- **Cortex Cloud** — walled garden, in-app sharing only, off-strategy (QC deprioritized). Skip.
- **TONEX ToneNet** — app-gated, TONEX formats only. Skip.
- **Katana** — guitarpatches.com (web upload, live in 2026) + VGuitarForums patch-exchange
  boards. Small, personal communities: occasional transparent posts only. Lane: SEMI.

## Feeds/syndication (the pure-headless layer)
- **WebSub**: alive (W3C rec; Google + Superfeedr hubs operating; Feedly/NewsBlur/
  Flipboard/Inoreader consume). `<link rel="hub">` + publish ping. AUTOMATABLE, zero risk.
- **JSON Feed**: healthy niche (NetNewsWire/NewsBlur/Reeder/FreshRSS). Add /feed.json.
- **Flipboard**: self-serve RSS → Magazine after one-time review. Requirements: FULL-content
  feed, ≥1 image ≥400px/post, ~30+ items. AUTOMATABLE after approval.
- **SmartNews**: application with SmartFormat feed (full content:encoded, media:thumbnail
  ≥1500px). Long shot, cheap to try.
- **Google Discover**: auto-eligible; levers = max-image-preview:large, 1200px+ 16:9 heroes,
  Follow (feed link in <head>). Lottery-ticket traffic.
- **Podcast-feed hack**: AI-voiced weekly show generated from posts is accepted practice
  (Apple/Spotify) with AI disclosure. On-brand for F&K. AUTOMATABLE end-to-end; a real
  future project ("Tone Recipe Radio").

## Communities
- **Reddit**: HUMAN-ONLY. Reddit blocks unauthenticated rules fetches (403) — hostile to
  headless by construction. One transparent human-posted launch post per community,
  months apart, human answers comments. Pairs with docs/outreach-drafts.md.
- **Discord**: webhook/RSS feed channels are OFFICIALLY supported automation
  (MonitoRSS/RSS.app/FeedCord). Two plays: own F&K server with #new-recipes webhook;
  admin-consented feed channels in partner Helix/worship servers (one human DM each,
  headless forever after). AUTOMATABLE after consent.
- **Facebook Groups**: Groups API killed Apr 2024; no third-party posting exists. Pages
  autopost = near-zero reach. Deprioritize.

## Story channels (one-shot capital events, HUMAN)
- **Show HN**: qualifies (downloadable presets = "something people can play with").
  Norms: maker present in comments, no relaunch spam. Lead with /experiment log +
  honest failure data — HN will stress-test the claim.
- **AI newsletters/directories**: Ben's Bites community submissions, TAAFT/Futurepedia,
  Uneed/MicroLaunch/TinyLaunch/BetaList/SaaSHub. 15-min forms, permanent backlinks.
- The AI-run-business story angle is hot in 2026 (Project Vend, AI-CEO experiments).

## YouTube Shorts
- Programmatic upload viable; "inauthentic content" policy targets undifferentiated
  mass-production, not automation per se. MUST disclose synthetic media
  (containsSyntheticMedia via API). LANDMINE: uploads from an unaudited API project
  are force-locked private — complete the YouTube API compliance audit first.
  Keep volume modest, every Short song-specific. AUTOMATABLE post-audit.

## Email loops
- SparkLoop is ESP-agnostic (works with self-hosted site + supported ESP); beehiiv
  Boosts requires hosting there. Thin guitar-adjacent partner supply — later.

(Ranked shortlist and full source URL list: see the session transcript of 2026-07-17
and HEADLESS_DISTRIBUTION_PLAYBOOK.md which operationalizes it.)
