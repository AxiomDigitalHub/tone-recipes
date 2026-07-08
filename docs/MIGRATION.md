# Getting off Vercel — migration runbook

Written 2026-07-06, the day Vercel fair-use-blocked the team and served
402s on production. The escape hatch is built and CI is already producing
host-portable images; this doc is the remaining human steps + cutover plan.

> **STATUS 2026-07-07: steps 1–5 DONE.** faderandknob.com serves from the
> DO droplet behind Cloudflare; auto-deploys and the GH cron are live.
> Step 6 (decommission) is tracked — with the rest of the post-cutover
> punch list — in docs/VERCEL_DECOMMISSION_SPRINT.md. Time-critical piece:
> the old Vercel deployment's cron STILL fires Tuesdays 14:00 UTC (it sent
> the 2026-07-07 newsletter itself) and will double-send alongside the GH
> cron on 2026-07-14 unless the project is paused first.

## Why we're leaving

- Fair-use block took the site down (402s to every visitor, including
  Googlebot) with no warning usable to us, and the git→deploy integration
  stayed broken even after the block lifted.
- The daily content engine rebuilds ~1,200 static pages every day — that
  build volume is exactly what tripped the limits, and it's core to the
  product, not an excess.
- Commercial site (Stripe) on their infrastructure means this can recur.

## What's already done (no action needed)

- `output: "standalone"` in next.config.ts — the build is self-contained
- `Dockerfile` — Node 24 + real Chromium (PDF route uses
  `LOCAL_CHROME_PATH=/usr/bin/chromium`; the @sparticuz serverless hack is
  bypassed off-Vercel, kept for as long as Vercel serves production)
- `sharp` installed — required for next/image optimization off-Vercel
- `src/middleware.ts` reads Cloudflare's `cf-ipcountry` as well as
  Vercel's geo header (OFAC blocking keeps working behind Cloudflare)
- Vercel-only analytics (`@vercel/analytics`, Speed Insights) render only
  when `VERCEL=1`; GA4 + MS Clarity are host-agnostic and remain
- `.github/workflows/build-image.yml` — builds + pushes
  `ghcr.io/axiomdigitalhub/tone-recipes:{latest,sha}` on every push to
  main (free minutes: public repo). Deploy job dormant until
  `DEPLOY_ENABLED=true`
- `.github/workflows/sunday-setlist-cron.yml` — replaces the vercel.json
  cron; dormant until `CRON_ENABLED=true` (avoids double-send)
- GitHub repo vars/secrets set: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (vars), `CRON_SECRET` (secret, rotated
  2026-07-06 and synced to Vercel), `DEPLOY_ENABLED=false`,
  `CRON_ENABLED=false`
- `docker-compose.yml` + `Caddyfile` — the full VPS stack
- Complete production env snapshot pulled to the session scratchpad
  (`.env.prod`, chmod 600) for provisioning; regenerate anytime with
  `npx vercel env pull .env.production --environment=production`
  (CRON_SECRET is sensitive-flagged there — use the rotated value from
  GitHub, or rotate again)

## Human steps (in order)

### 1. Create the server (~10 min, ~$6–12/mo)
Hetzner Cloud CX22 (or DigitalOcean basic droplet), Ubuntu 24.04,
SSH key auth. Install Docker: `curl -fsSL https://get.docker.com | sh`.

### 2. Move DNS to Cloudflare (free plan) — can happen before the server
Add faderandknob.com to Cloudflare, import records, switch nameservers at
the registrar. Leave records pointing at Vercel (proxied/orange-cloud)
until cutover — the site keeps working throughout. Set SSL/TLS mode to
"Full (strict)".

### 3. Provision the app on the VPS
```bash
mkdir -p /opt/faderandknob && cd /opt/faderandknob
# copy docker-compose.yml, Caddyfile, and the env snapshot as .env.production
# remove VERCEL_* / TURBO_* / NX_* lines from .env.production
docker login ghcr.io   # any GitHub PAT with read:packages
docker compose up -d
```
Verify directly against the origin IP before touching DNS:
`curl -H "Host: faderandknob.com" -k https://<VPS_IP>/` → expect the
homepage, and spot-check `/experiment`, `/blog`, a recipe page, a PDF
download, and `/api/health-check/stripe`.

### 4. Enable auto-deploys
Add repo secrets `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`
(deploy-only key), then set repo variable `DEPLOY_ENABLED=true`. Every
push to main now ships to the VPS automatically — same cadence the daily
content engine had on Vercel, zero build fees.

### 5. Cutover (5 minutes, reversible)
1. In Cloudflare DNS: point the apex A record (and www CNAME) at the VPS
   IP. Keep proxied (orange cloud).
2. Set repo variable `CRON_ENABLED=true` (newsletter cron moves to
   GitHub Actions).
3. Delete the `crons` block from vercel.json (retires the Vercel cron).
4. Watch for an hour: traffic (GA4 realtime), Stripe webhook deliveries
   (Stripe dashboard → the endpoint URL doesn't change, it's
   domain-based), signup + download flows.

Rollback = point DNS back at Vercel. Nothing else to undo.

### 6. Decommission (after a clean week)
- Remove the Vercel project (or downgrade the team) and cancel billing
- Delete `VERCEL_OIDC_TOKEN` from .env.local
- Optional cleanup commit: drop `@vercel/analytics`, `@sparticuz/chromium`
  workarounds in next.config.ts, and vercel.json entirely

## Runtime env vars (17, names only — values in the Vercel dashboard /
env snapshot)

ANTHROPIC_API_KEY, AMAZON_ASSOCIATES_TAG, CRON_SECRET,
HEALTH_CHECK_TOKEN, NEWSLETTER_UNSUBSCRIBE_SECRET,
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
REPLICATE_API_TOKEN, RESEND_API_KEY, STRIPE_PASS_PRICE_ID_ANNUAL,
STRIPE_PASS_PRICE_ID_MONTHLY, STRIPE_PRO_PRICE_ID_ANNUAL,
STRIPE_PRO_PRICE_ID_MONTHLY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
SUPABASE_SERVICE_ROLE_KEY, (OPENAI_API_KEY — local scripts only)

## What does NOT change

Supabase (auth/db), Stripe (webhook URL is domain-based), Resend, GA4,
Clarity, the domain itself, and every workflow that commits to main —
the content engine keeps publishing exactly as before; only the thing
that turns commits into a live site changes.
