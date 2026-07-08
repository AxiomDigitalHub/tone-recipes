# Vercel decommission — troubleshooting sprint

Written 2026-07-07, the day after cutover (commit `ca9f588`). Full codebase
scan for remaining Vercel traces + live-state verification of the new
DigitalOcean/Caddy/Cloudflare stack. Companion to docs/MIGRATION.md (the
runbook); this is the punch list that closes it out.

**Verified working, no action needed:** site serves from our infra
(`via: 1.1 Caddy`, `server: cloudflare`, zero `x-vercel-*` headers, 200s);
`DEPLOY_ENABLED=true` + `CRON_ENABLED=true` + SSH secrets set; deploys
shipping (cutover build green); `AMAZON_ASSOCIATES_TAG=faderandknob-20`
repo var feeding the image build; `HEALTH_CHECK_TOKEN` configured on the
droplet (endpoint returns the by-design 404, not the unconfigured 503);
`sharp` installed for next/image; Dockerfile's system Chromium +
`LOCAL_CHROME_PATH` bypasses the @sparticuz serverless path; Cloudflare
strips client-sent `cf-ipcountry`, so outsiders can't spoof geo-blocks.

**Out of scope:** Google OAuth — separate agent has it, pending.

---

## P0 — time-sensitive

### 1. ~~This week's Sunday Setlist is in limbo~~ RESOLVED 2026-07-07
Vercel runtime logs settled it: the **old Vercel deployment's cron fired
Tue 2026-07-07 14:00:16 UTC and sent to 5 recipients**
(`[sunday-setlist] sent to 5 recipients (5 songs)`, deployment
`dpl_4BKhiv8NsoTRgFPDj4o9vBsRinPe`). The GH Actions run at 16:16 UTC was
skipped (flag flipped ~10h later) — so exactly one send went out this
week. Do NOT fire the workflow manually.

### 2. Vercel cron is CONFIRMED live → double-send on 2026-07-14 unless paused
Item 1's evidence upgrades this from "possibly" to "certainly": the stale
deployment predates the `"crons": []` commit (git→deploy integration was
broken), so its Tuesday cron is still armed alongside our now-enabled GH
cron, and it holds all 17 prod secrets (`STRIPE_SECRET_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, rotated `CRON_SECRET`).
Dashboard-only fixes (project: `tone-recipes`,
`prj_hJSpmqgR9cOJBFjZ7yGzO2ow5ATj`, team `team_1VkpZwZiPrgTLta0S2Pp9Bxb`):

- [ ] **Before Tue 2026-07-14 14:00 UTC**: Vercel dashboard → Settings →
      pause the project (one click, kills the cron + serving; keeps the
      shell for DNS rollback). Deleting just the CRON_SECRET env var also
      defangs the cron (route 503s without it) if pausing feels too final.
- [ ] Delete the env vars from the Vercel project (rollback would need a
      re-push anyway, and the snapshot exists).
- [ ] After the clean week (~2026-07-14): delete the project, cancel
      billing.
- [ ] Optional belt-and-braces: rotate `CRON_SECRET` once more after
      Vercel is gone, so the only holders are GitHub secrets + the droplet.

### 3. Confirm Cloudflare "IP Geolocation" is ON — the OFAC geo-block depends on it
`src/middleware.ts:27` reads `x-vercel-ip-country` (now never present)
with `cf-ipcountry` as the only remaining source. Cloudflare only attaches
`cf-ipcountry` when **IP Geolocation** is enabled (dashboard → Network).
If it's off, geo-blocking of IR/KP/SY/CU/CN/RU/BY is silently disabled —
the middleware deliberately degrades open. Not externally testable
(Cloudflare strips the header from client requests either way).

- [ ] Cloudflare dashboard → Network → IP Geolocation → verify ON.
- [ ] Spot-check origin logs for `cf-ipcountry` on a real request.

---

## P1 — this week (correctness on the new stack)

### 4. Rate-limiter IP is now spoofable — switch to `cf-connecting-ip`
**FIXED in code 2026-07-07** — `getClientIp()` now prefers
`cf-connecting-ip` (Cloudflare-set, unforgeable through the proxy) with
XFF only as local-dev fallback; stale serverless comments rewritten.
Context: the first XFF entry is client-appendable behind Cloudflare, so
an abuser used to get a fresh rate-limit bucket per request on checkout,
newsletter signup, and every rate-limited route.

- [x] Prefer `cf-connecting-ip`, fall back to XFF for local dev.
- [ ] Optional hardening (droplet-side): firewall 80/443 to Cloudflare IP
      ranges — otherwise direct-to-origin requests bypass Cloudflare
      entirely (no geo header, forged XFF, no WAF).

### 5. End-to-end PDF download check on prod
The download route (src/app/api/recipes/[slug]/download) now renders via
system Chromium (`LOCAL_CHROME_PATH=/usr/bin/chromium`). The code path is
right; nobody has verified a real PDF since cutover.

- [ ] Download a recipe PDF from production; confirm fonts (Fraunces)
      render, not fallback faces.

### 6. ~~`stripe-setup-plans.ts --write-vercel` writes to a dead platform~~ FIXED 2026-07-07
The `--write-vercel` path is gone; the script now prints ready-to-paste
`.env.production` lines with droplet restart instructions
(`docker compose up -d app` — price IDs are runtime env, no rebuild).

---

## P2 — cleanup commit — DONE 2026-07-07 (all three items shipped in one commit)

### 7. ~~Drop the Vercel-only packages~~ DONE
- [x] `@vercel/analytics` + `@vercel/speed-insights` uninstalled; the
      `VERCEL === "1"` block, imports, and the `va` branch in analytics.ts
      removed. GA4 + Clarity carry analytics.
- [x] `@sparticuz/chromium` uninstalled; render-print-pdf.ts is
      LOCAL_CHROME_PATH/platform-default only; `outputFileTracingIncludes`
      gone from next.config.ts (~80 MB lighter images);
      `serverExternalPackages` kept for `puppeteer-core`.

### 8. ~~Delete the artifacts~~ DONE
- [x] `vercel.json` deleted (git rm).
- [x] `.vercel/` removed locally (project IDs preserved in item 2 above).
- [x] `VERCEL_OIDC_TOKEN` line removed from `.env.local`.
- [x] `.vercel` kept in .gitignore/.dockerignore — harmless.

### 9. ~~Stale-comment sweep~~ DONE
All comment references rewritten for the droplet stack, including the
user-facing health-check 503 string. Deliberately untouched:
supabase/migrations/017 header (applied migrations don't get edited) and
historical docs (MIGRATION.md, V3 handoff, strategy docs, this file).

### 10. Docs hygiene (low priority)
- [ ] MIGRATION.md: mark steps 1-5 done with dates; keep step 6 checklist
      live until decommission completes.
- [ ] V3_REDESIGN_HANDOFF.md preview-deployment instructions (Vercel MCP
      share tokens, branch aliases) are dead — add a historical note.
      There is no preview-deploy equivalent on the new stack yet; if one
      is wanted, that's a new project, not this sprint.
- [ ] FaderAndKnob_Content_Authority_Strategy.md cites
      `tone-recipes.vercel.app` URLs — historical snapshot, leave or
      annotate.

---

## P3 — watch window (through 2026-07-14)

- [ ] Tue 2026-07-14 14:00 UTC: first clean scheduled cron fire — confirm
      HTTP 200 in the Actions run.
- [ ] Per the runbook: GA4 realtime traffic, Stripe webhook deliveries,
      signup + download flows.
- [ ] GSC: confirm Googlebot crawl stats recover post-402 (crawl rate took
      the fair-use block on the chin).
- [ ] After the clean week: finish item 2 (delete project, cancel billing)
      and run the P2 cleanup commit.
