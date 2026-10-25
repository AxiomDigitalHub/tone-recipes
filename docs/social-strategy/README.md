# Social v2: council decisions (2026-10-25)

Three agents debated the rebuild of the autoposter: Mara Quinn (Marketing Lead), Sasha Okafor (Social Media Manager) and Theo Lindqvist (Prompt Engineer). Their memos are in `council/` in order: `00` recon, `01` openings, `02` replies, `03` unified spec, `04` sign-offs. The fact base is in `EVIDENCE_BRIEF.md`.

## What they agreed
- **Diagnosis.** v1 reached 1 account in 30 days. The causes: no seed audience, signals that read as a bot (no avatar, a template caption, 12–13 hashtags), a blog hero image with nothing on it worth saving, wrong-audience topics, and a dead "link in bio".
- **Format.** v1's blog-hero posts are replaced by 4:5 carousels plus 2:3 Pinterest pins, rendered from recipe and settings data.
  - Weekly grid: 2 worship (Sunday Sound + a worship-rig card), 2 Knob Cards, 1 Fix-It.
  - "Just unwrapped" takes Mondays from Nov 30.
  - **Thursday = New Tone** (added 2026-10-25 at Daniel's request; it replaced the second Knob Card). The newest released recipe, laid out like its recipe page:
    - Song cover with a mini chain strip.
    - A signal-path slide with a guitar card, the site's block tiles and "← real gear".
    - "Every knob, broken out" cards.
    - Close.
    It's built through the site's own `recipeToBlocks` + `BlockIcon` (`scripts/social/render/site-chain.tsx`), so the card and the page can't disagree.
- **Numbers never pass through the LLM.** Templates render every value. The model writes only the headline and caption lines, cited to fact IDs, and a deterministic gate blocks any uncited number, musical key, banned phrase, or post that answers none of the six visitor questions.
- **KPI.** (saves + shares) per 1k reach, tracked per format. North star: social-sourced email signups, attributed through the `/ig` page via `newsletter_subscribers.source = social:<src>:<slot>`.
- **Channels.**
  - Instagram and Pinterest now.
  - Threads in week 2, only if Daniel commits about 10 minutes a week to replies.
  - Silent Trial Reels from day 30.
  - X off.
  - TikTok/YouTube wait until real audio exists, so hiring the audio contractor is the unlock.
- **Day-45 review.** It is flagged to Daniel; nothing changes automatically.

## Code
- `scripts/social/run.ts` runs the pipeline: `plan | gate | render | publish | reconcile | metrics | digest | status`. It is dry-run by default and refuses `--live` until `config.profileReady` is set.
- Tests are in `tests/social-gate.test.ts`.
- `src/app/ig/` is the link page.
- The proposed scheduled-task text is `PROPOSED_SKILL.md`. It is not installed yet.

## Needs Daniel
1. Pause the v1 task `faderandknob-social-autopost`.
2. Fix the Instagram profile: avatar, and a bio with the AI disclosure.
3. Deploy `/ig`.
4. Set `profileReady`.
5. Review `scripts/social/fixit-candidates.json`.
6. Connect Pinterest in Zernio (check pricing first).
7. Confirm the timezone, assumed to be America/Chicago.
8. Decide on the audio contractor.

## Found along the way
- **Site bug fixed while building New Tone.** `variantFor()` in `src/components/v3/recipe-to-blocks.ts` matched "mic" inside "Dynamics", so 94 noise-gate and dynamics blocks drew as Cab·Mic tiles on live recipe pages. The fix is in the working tree and not deployed yet.
- **Image fetch 403.** Zernio's validator got a 403 fetching faderandknob.com images, which is the likely cause of v1's failed and duplicate publishes. v2 uploads its media to Zernio instead.
- **Kinky Boost data conflict.** On `hislop-goodness-of-god`, the Kinky Boost notes say "DEFAULT-OFF" but the block is enabled.
