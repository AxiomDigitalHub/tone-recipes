---
name: faderandknob-social-autopost
description: Fader & Knob social v2. Mondays — digest, then plan/write/critique/gate/render/schedule the week's 5 carousels. Other days — reconcile + metrics only.
---

<!--
PROPOSED replacement for ~/.claude/scheduled-tasks/faderandknob-social-autopost/SKILL.md.
NOT installed. Daniel installs it (copy the text below the front matter into the task) after:
  1. pausing the current task,
  2. confirming timezone in scripts/social/config.json (assumed America/Chicago),
  3. the /ig page is deployed and the IG profile (avatar, bio with AI disclosure) is done,
  4. then setting "profileReady": true. Until step 4 the routine plans, writes, gates and
     renders, but publishes nothing.
Spec: docs/social-strategy/council/03-prompt-engineer-spec.md + 04-*-signoff.md.
-->

Working dir: /Users/daniellivengood/Documents/Claude/tone-recipes

0. If `scripts/social/run.ts` is missing, STOP and report "social v2 not present". Never run
   `scripts/social-post.ts` from this task (that is the retired v1 poster).
1. `export $(grep -E '^ZERNIO_API_KEY=' .env.local | xargs)`
2. Every day:
   - `npx tsx scripts/social/run.ts reconcile`
   - `npx tsx scripts/social/run.ts metrics`
   - `npx tsx scripts/social/run.ts status`
3. Mondays only (America/Chicago), in this order:
   a. `npx tsx scripts/social/run.ts digest`
   b. `npx tsx scripts/social/run.ts plan --week`
      (On a Monday this plans the current week. If a plan already exists, leave it.)
   c. For EACH slot directory the plan printed (docs/social-queue/v2/weeks/<monday>/<slotId>/):
      read `copy-request.md` and `factsheet.json`, then write `copy.json` exactly as
      copy-request.md specifies. You are the copywriter: words only. Do not edit
      factsheet.json, slot.json, config, code, or the ledger.
   d. For EACH slot, launch a FRESH subagent (Agent tool) whose whole prompt is: "Follow
      <slot dir>/critic-request.md exactly; write critic.json; edit nothing else." It writes
      `critic.json` with `"independent": true`.
      If subagents are unavailable, write critic.json yourself with `"independent": false`.
      The gate then forces Zernio approval for that slot (Mara's rule) — say so in the report.
   e. `npx tsx scripts/social/run.ts gate --week`
      For each slot that fails, read its `gate.json` reasons, rewrite `copy.json`, re-run the
      critic subagent and the gate. At most 2 retries per slot; after that leave it failed.
      Never weaken a fact, edit the fact sheet, or invent a number to pass.
   f. `npx tsx scripts/social/run.ts render --week`
   g. `npx tsx scripts/social/run.ts publish --week --live`
      The script refuses to post unless config.profileReady is true, and posts go to
      Zernio `pending_approval` while config.approvalMode is true (weeks 1–2). Both refusals
      are expected, not errors. Posts are scheduled for each slot's day at config.postTime.
4. Report: the digest headline lines, each slot's state (scheduled / pending_approval /
   gate_failed / skipped + reason), the contact-sheet path
   (docs/social-queue/v2/weeks/<monday>/contact-sheet.jpg), and everything under
   "Needs Daniel".

Guardrails:
- Never retry a publish by hand, never re-run `publish --live` for a slot the ledger shows as
  publishing / unknown / scheduled / pending_approval / published. The ledger + Zernio
  Idempotency-Key make duplicates impossible only if you don't route around them.
- Never edit scripts/social/config.json, the ledger, fact sheets, or code from this task.
- Never post to Reddit, X, Facebook groups or Threads. Never send DMs or comments.
- Never commit, push, or touch git. Never deploy.
- Never add audio to anything; never call an image/video/audio model.
- One feed post per platform per day is enforced in code; do not work around it.
