# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Builder — Angular build + production deps
# Has a working shell; all RUN commands live here.
# ──────────────────────────────────────────────────────────────────────────────
FROM dhi.io/node@sha256:fde8eaa98fe792804511c8729462a9825d6f66b620ad56b377e386c1a0fc2177 AS builder

WORKDIR /build

# Cache-friendly: lock files first so npm ci layer is reused when source changes
COPY package.json package-lock.json ./

# Install all dependencies (dev tools required for Angular build)
RUN npm install --no-audit --no-fund

# Copy source after deps to avoid invalidating npm layer on code changes
COPY . .

# Ensure public/ exists so runtime COPY never fails on empty asset dir
RUN mkdir -p public

# Build Angular SSR application
RUN npm run build

# Verify build artifact before runtime stage consumes it
RUN test -f dist/projet/server/server.mjs || (echo "ERROR: server.mjs not found" && exit 1)

# Install production-only deps in a separate directory for clean COPY to runtime
WORKDIR /prod
COPY package.json package-lock.json ./

# BuildKit secrets: if private npm registry needed, use:
#   RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install ...
RUN npm install --omit=dev --omit=optional --no-audit --no-fund && \
    npm cache clean --force

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Setup — Alpine provides tini + non-root user
# dhi.io/node:24-alpine3.23 is a hardened image (no shell in runtime).
# Use stock Alpine to prepare init binary and user entries, then copy them over.
# ──────────────────────────────────────────────────────────────────────────────
FROM alpine:3.23 AS setup

RUN apk add --no-cache tini && \
    addgroup -S nexus && adduser -S nexus -G nexus

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3: Runtime — hardened, shell-less, COPY-only
# No RUN commands: avoids /bin/sh dependency on the hardened node image.
# ──────────────────────────────────────────────────────────────────────────────
FROM dhi.io/node@sha256:fde8eaa98fe792804511c8729462a9825d6f66b620ad56b377e386c1a0fc2177

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
ENV NODE_ENV=production

# Bring in non-root user entries from Alpine setup stage
COPY --from=setup /etc/passwd /etc/passwd
COPY --from=setup /etc/group /etc/group

# tini static binary from Alpine setup stage (musl-compatible, no shell needed)
COPY --from=setup /sbin/tini /sbin/tini

WORKDIR /app

# Production node_modules from builder (no npm install needed at runtime)
COPY --from=builder --chown=nexus:nexus /prod/node_modules ./node_modules/

# Built Angular SSR artifacts
COPY --from=builder --chown=nexus:nexus /build/dist ./dist/
COPY --from=builder --chown=nexus:nexus /build/public/ ./public/

USER nexus

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (res) => { if(res.statusCode !== 200) throw new Error(res.statusCode); })" || exit 1

# tini as PID 1: forwards SIGTERM to node for graceful shutdown
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/projet/server/server.mjs"]
