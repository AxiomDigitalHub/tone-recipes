# Fader & Knob — host-portable production image.
#
# Runs the site on ANY Docker host (Hetzner/DO VPS, Railway, Render, Fly)
# with zero Vercel dependencies:
#   - Next standalone output → `node server.js`
#   - PDF rendering via @sparticuz/chromium in node_modules (apt chromium
#     SIGTRAPs in slim containers — see src/lib/pdf/render-print-pdf.ts)
#   - content/ + presets/ copied in (read from disk at runtime)
#
# Build (CI does this — see .github/workflows/build-image.yml):
#   docker build \
#     --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
#     --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
#     -t ghcr.io/axiomdigitalhub/tone-recipes .
#
# Run: see docker-compose.yml (env_file carries the runtime secrets).

# ---- deps + build ----------------------------------------------------------
FROM node:24-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* are baked into the client bundle at build time. They are
# public-by-design values (Supabase anon key is meant for browsers).
# AMAZON_ASSOCIATES_TAG bakes into SSG page HTML (affiliate links are
# assembled at prerender time) — non-secret, but must be present here or
# every static page renders unattributed amazon links.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG AMAZON_ASSOCIATES_TAG
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    AMAZON_ASSOCIATES_TAG=$AMAZON_ASSOCIATES_TAG \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runtime ---------------------------------------------------------------
FROM node:24-bookworm-slim AS runner
WORKDIR /app

# PDF rendering uses @sparticuz/chromium from node_modules (the build made
# for barebones containers) — apt chromium SIGTRAPs here (gpu-process crash,
# verified 2026-07-08), so it is deliberately NOT installed. fonts-liberation
# keeps fallback text metrics sane; site webfonts load over the network.
RUN apt-get update \
  && apt-get install -y --no-install-recommends fonts-liberation ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# No LOCAL_CHROME_PATH: its absence is what routes render-print-pdf.ts to the
# sparticuz branch. HOME must exist/be writable for chromium's profile dirs
# (the -r system user gets no home otherwise → crashpad "--database" crash).
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOME=/tmp \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Non-root runtime user.
RUN groupadd -r nextjs && useradd -r -g nextjs nextjs

# Standalone server + static assets.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# Runtime disk reads (fs from process.cwd()): blog/news MDX + preset files.
COPY --from=builder --chown=nextjs:nextjs /app/content ./content
COPY --from=builder --chown=nextjs:nextjs /app/presets ./presets

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3000/ >/dev/null || exit 1

CMD ["node", "server.js"]
