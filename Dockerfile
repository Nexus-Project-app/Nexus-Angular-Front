FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build



FROM node:24-alpine AS runtime
ENV NODE_ENV=production
RUN addgroup -S nexus && adduser -S nexus -G nexus
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund --ignore-scripts && npm cache clean --force

COPY --from=builder --chown=nexus:nexus /app/dist ./dist

USER nexus

EXPOSE 4000

CMD ["node", "dist/projet/server/server.mjs"]
