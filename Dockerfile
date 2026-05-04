# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:24-alpine AS runtime

LABEL org.opencontainers.image.source=https://github.com/Nexus-Project-app/Nexus-Angular-Front
LABEL org.opencontainers.image.description="Nexus Angular SSR frontend"
LABEL org.opencontainers.image.licenses=MIT

# Non-root user
RUN addgroup -S nexus && adduser -S nexus -G nexus

WORKDIR /app

# Production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Built artefacts from builder
COPY --from=builder --chown=nexus:nexus /app/dist ./dist

USER nexus

ENV NODE_ENV=production \
    PORT=4000

EXPOSE 4000

CMD ["node", "dist/projet/server/server.mjs"]
