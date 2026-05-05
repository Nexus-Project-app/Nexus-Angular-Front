# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Builder
# ──────────────────────────────────────────────────────────────────────────────
FROM dhi.io/node:24-alpine3.23 AS builder

WORKDIR /build

# Copy lock files first for cache efficiency
COPY package.json package-lock.json /build/

# Install dependencies (including dev for build)
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Ensure public/ exists even if empty
RUN mkdir -p public

# Build Angular application
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Runtime (Hardened)
# ──────────────────────────────────────────────────────────────────────────────
FROM dhi.io/node:24-alpine3.23

# OCI Image Labels
LABEL org.opencontainers.image.title="Nexus Angular Frontend"
LABEL org.opencontainers.image.description="Angular 21+ SSR frontend for Nexus Project"
LABEL org.opencontainers.image.source="https://github.com/Nexus-Project-app/Nexus-Angular-Front"
LABEL org.opencontainers.image.documentation="https://github.com/Nexus-Project-app/Nexus-Angular-Front"
LABEL org.opencontainers.image.vendor="Nexus Project"
LABEL org.opencontainers.image.licenses="MIT"

# Set working directory
WORKDIR /app

# Create non-root user (hardened)
RUN addgroup -S nexus && adduser -S nexus -G nexus

# Copy package files
COPY package.json package-lock.json /app/

# Install production dependencies only
RUN npm ci --omit=dev --omit=optional --no-audit --no-fund && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nexus:nexus /build/dist ./dist/

# Copy public assets
COPY --chown=nexus:nexus public/ ./public/

# Security: Verify build artifacts exist
RUN test -f dist/projet/server/server.mjs || (echo "ERROR: server.mjs not found" && exit 1)

# Switch to non-root user
USER nexus

# Expose port
EXPOSE 4000

# Health check (graceful)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/health', (res) => { if(res.statusCode !== 200) throw new Error(res.statusCode); })" || exit 1

# Start application with graceful shutdown
CMD ["node", "--enable-source-maps", "dist/projet/server/server.mjs"]
