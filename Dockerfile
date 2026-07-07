# Fader & Knob — host-portable production image.
#
# Runs the site on ANY Docker host (Hetzner/DO VPS, Railway, Render, Fly)
# with zero Vercel dependencies:
#   - Next standalone output → `node server.js`
#   - Real Chromium via apt for PDF rendering (LOCAL_CHROME_PATH replaces
#     the @sparticuz/chromium serverless hack — see src/lib/pdf/)
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
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runtime ---------------------------------------------------------------
FROM node:24-bookworm-slim AS runner
WORKDIR /app

# Chromium for the PDF download route. fonts-liberation keeps text metrics
# sane; the site's own webfonts load over the network during render.
RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium fonts-liberation ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    LOCAL_CHROME_PATH=/usr/bin/chromium \
    NEXT_TELEMETRY_DISABLED=1 \
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
