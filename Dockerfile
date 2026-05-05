# ──────────────────────────────────────────────────────────────────────────────
# SHA256 pinning (reproducibility + security):
#   docker pull dhi.io/node:24-alpine3.23
#   docker inspect --format='{{index .RepoDigests 0}}' dhi.io/node:24-alpine3.23
# Then replace tag with: dhi.io/node:24-alpine3.23@sha256:<digest>
# ──────────────────────────────────────────────────────────────────────────────

# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Builder
# ──────────────────────────────────────────────────────────────────────────────
FROM dhi.io/node:24-alpine3.23 AS builder

WORKDIR /build

# Cache-friendly: lock files first so npm ci layer is reused when source changes
COPY package.json package-lock.json ./

# Install all dependencies (dev tools required for Angular build)
RUN npm ci --no-audit --no-fund

# Copy source after deps to avoid invalidating npm layer on code changes
COPY . .

# Ensure public/ exists so runtime COPY never fails on empty asset dir
RUN mkdir -p public

# Build Angular SSR application
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Runtime (Hardened)
# ──────────────────────────────────────────────────────────────────────────────
FROM dhi.io/node:24-alpine3.23

# Build-time metadata — pass via: --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
ARG BUILD_DATE
ARG GIT_REVISION
ARG VERSION

# OCI Image Labels (consolidated to single layer)
LABEL org.opencontainers.image.title="Nexus Angular Frontend" \
      org.opencontainers.image.description="Angular 21+ SSR frontend for Nexus Project" \
      org.opencontainers.image.source="https://github.com/Nexus-Project-app/Nexus-Angular-Front" \
      org.opencontainers.image.documentation="https://github.com/Nexus-Project-app/Nexus-Angular-Front" \
      org.opencontainers.image.vendor="Nexus Project" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_REVISION}" \
      org.opencontainers.image.version="${VERSION}"

# Port control via env — override at runtime: docker run -e PORT=3000
ENV PORT=4000

# tini: proper PID 1 init, forwards SIGTERM to node process (graceful shutdown)
# Non-root user: minimal attack surface
RUN apk add --no-cache tini && \
    addgroup -S nexus && adduser -S nexus -G nexus

WORKDIR /app

# Cache-friendly: prod deps layer before copying built artifacts (changes less often)
COPY package.json package-lock.json ./

# Production deps only — no dev tools in runtime image
# BuildKit secrets: if private npm registry needed, use:
#   RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci ...
RUN npm ci --omit=dev --omit=optional --no-audit --no-fund && \
    npm cache clean --force

# Copy artifacts from builder (never from host — avoids stale local files)
COPY --from=builder --chown=nexus:nexus /build/dist ./dist/
COPY --from=builder --chown=nexus:nexus /build/public/ ./public/

# Fail fast if build artifact missing
RUN test -f dist/projet/server/server.mjs || (echo "ERROR: server.mjs not found" && exit 1)

USER nexus

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (res) => { if(res.statusCode !== 200) throw new Error(res.statusCode); })" || exit 1

# tini as ENTRYPOINT ensures SIGTERM propagates correctly to node (PID 1 problem solved)
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/projet/server/server.mjs"]
