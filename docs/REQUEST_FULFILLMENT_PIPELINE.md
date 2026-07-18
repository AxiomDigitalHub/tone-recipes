# Request Fulfillment Pipeline (Tier 3) — Design

**Status:** DESIGN — not built. Written 2026-07-17 (overnight session).
**Prereqs shipped:** request queue + per-plan quotas + Your Tones + fulfillment
notifications (2026-07-13), Axl fk-request cards (2026-07-17).
**Owner decision needed before build:** §7 open questions.

The goal: a filed `tone_request` becomes a published, audited recipe page with
no human in the loop — while keeping RECIPE_STANDARD as a hard gate, never
stranding work uncommitted, and never notifying a user before their page is
actually live.

---

## 1. Shape: nightly batch, not per-request

Per-request instant fulfillment is impossible anyway (recipes are static TS →
publish = commit + ~11 min build/deploy) and undesirable (batch = 50% API
discount, one deploy per night, one QA surface per night). The pipeline is a
**nightly run that drains up to N requests** (start N=5, the proven size of
the existing daily-recipes runs).

```
                      ┌────────────────────────────────────────────┐
  tone_requests       │  NIGHTLY RUN (headless session/agent)      │
  (pending, ranked) ─▶│  select → research → author → AUDIT GATE   │─▶ git commit+push
                      │  → art → mark in_progress + record mapping │        │
                      └────────────────────────────────────────────┘        ▼
                                                                CI build → deploy
                                                                            │
                      ┌────────────────────────────────────────────┐        ▼
  requester ◀── bell ─│  POST-DEPLOY COMPLETER (/api/cron/…)       │◀─ deploy success
  notification        │  verify URLs live → status=completed →     │   (workflow step)
                      │  completed_recipe_slug → notification      │
                      └────────────────────────────────────────────┘
```

## 2. Selection

- Query `tone_requests` where `status='pending'`, ranked by
  `upvotes DESC, created_at ASC`. Paid requesters' rows may get a rank boost
  (Pass/Pro = the people paying for the feature) — see §7.
- **Dedupe before authoring:** against the corpus (existing recipe for the
  same song/part → mark completed immediately with that slug — free win) and
  within the queue (same song filed twice → fulfill once, complete both).
- **Decline lane:** requests the pipeline shouldn't attempt (not a guitar/bass
  tone, no findable reference recording, part='other' with an empty
  description) get `status='declined'` + a kind, specific `admin_notes`. A
  declined request must never burn a night's slot silently.

## 3. Authoring run (the existing recipe-run, made headless)

Reuse the daily-recipes discipline verbatim — RECIPE_STANDARD.md is the spec,
`npx tsx scripts/audit-recipes.ts` is the gate, Helix amps on the 0–10 scale,
platform translations checked against QC/Fractal siblings, dates stamped.
Delta from today's runs:

- **Input** comes from the queue (§2), not the SEO backlog. The SEO backlog
  remains the filler when the queue is short — the run always ships N.
- **Research:** web search per song (reference isolation, rig archaeology,
  live-vs-studio variants). Batch API where the orchestration allows;
  cost target from the 2026-07-10 scope: ~$0.30–0.50/song.
- **Art:** existing Apple/iTunes pipeline, unchanged.
- **On-tree vs off-tree:** if the song fits the worship/Helix cluster
  (TARGET_SEGMENT docs), full indexed page. Otherwise the page ships
  `robots: noindex` + excluded from sitemap ("off-tree") — the requester gets
  their tone; the index doesn't get thin pages. Flag on the recipe record:
  `off_tree?: boolean`.

## 4. Commit-or-fail (the stranding-bug killer)

The 2026-07 stranding incident (recipes authored, never committed, backlog
rows still queued) must be structurally impossible:

1. Run starts: `git status --porcelain` MUST be clean (or run in a dedicated
   worktree). Dirty tree → abort loudly before any authoring.
2. Per-recipe atomicity: a recipe that fails the audit is reverted from
   index.ts before the run proceeds — the tree only ever contains passing
   work.
3. Run ends in exactly one of two states:
   - **Committed & pushed** (≥1 recipe passed), or
   - **Clean tree + failure report** (0 passed; nothing half-done left).
4. The run's LAST action verifies `git status` clean and `git log`
   ahead-count 0 (pushed). Anything else = the run failed, alert Daniel.
5. `status='in_progress'` is written to the fulfilled rows only AFTER the
   push succeeds — a crashed run leaves rows `pending` for the next night.

## 5. Post-deploy completion (never notify before the page is live)

Marking `completed` at commit time would fire notifications ~11 min before
the URL exists (or forever-early if CI fails). Instead:

- The nightly run records `request_id → slug` mappings by setting
  `status='in_progress'` + `completed_recipe_slug` (slug known at commit).
- A new authenticated endpoint `/api/cron/complete-fulfillments`
  (CRON_SECRET bearer, service role — pattern of sunday-setlist) runs as a
  **post-deploy step in build-image.yml**: for each `in_progress` row with a
  slug, it curls the live URL, and on 200 flips `status='completed'` and
  inserts the notification (service role bypasses the moderator-only RLS).
- Idempotent: safe to re-run; rows without live URLs stay `in_progress` and
  retry on the next deploy.
- Manual moderation keeps working unchanged — the completer only touches rows
  that carry a slug and are `in_progress`.

## 6. Orchestration options (pick one at build time)

| Option | How | Pros / cons |
|---|---|---|
| A. GitHub Actions cron → headless Claude Code (`claude -p`) | Scheduled workflow on a runner with repo checkout + secrets | Same environment as today's runs; free minutes; needs ANTHROPIC_API_KEY + SUPABASE_SERVICE_ROLE_KEY as repo secrets; runner must push (deploy key) |
| B. Claude Code scheduled cloud agent (routine) | `/schedule` a nightly routine with repo access | Easiest to stand up; billing via existing plan; less control over runtime |
| C. Managed Agents (CMA) with `github_repository` resource + Outcome rubric | Agent + session per night, rubric = "N recipes pass audit, committed, pushed" | Cleanest contract (outcome-graded, iterate loop); new infra to learn; costs runtime + tokens |

Recommendation: **start with B** (lowest setup, proves the loop end-to-end),
graduate to A when we want run logs in CI and tighter secrets scoping. C is
the eventual right home if runs get long or need per-run isolation.

## 7. Open questions for Daniel

1. Paid-rank boost in selection — yes/no, and how strong?
2. N per night (5?) and a monthly token/cost ceiling for the pipeline?
3. Off-tree rule sign-off: noindex + out of sitemap, or full page for
   everything? (Current instant-publish decision said off-tree for
   off-the-beaten-path — this encodes it.)
4. Decline taxonomy: OK for the pipeline to decline autonomously with a
   note, or should declines queue for human review first?
5. Kill switch: repo variable `FULFILLMENT_ENABLED` (pattern of
   DEPLOY_ENABLED/CRON_ENABLED) — assumed yes.

## 8. Build order (when greenlit)

1. `/api/cron/complete-fulfillments` + build-image.yml post-deploy step
   (safe to ship before the pipeline — it no-ops until rows carry slugs).
2. Queue-export script (`scripts/fulfillment-queue.ts`: select + dedupe +
   decline-lane, service role, DRY-RUN mode).
3. Run-harness prompt (the recipe-run instructions, parameterized by queue
   items) + commit-or-fail wrapper.
4. Orchestrator (option B routine) + `FULFILLMENT_ENABLED` gate + cost
   logging (`usage` per song into docs/ai-sov-runs/ or a table).
5. Two supervised dry runs (Daniel reviews the diff before push) → then
   hands-off with the §4 invariants.
