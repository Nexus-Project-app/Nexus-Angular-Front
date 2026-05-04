FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build 
RUN addgroup -S nexus && adduser -S nexus -G nexus
WORKDIR /app

USER nexus

EXPOSE 4000

CMD ["node", "dist/projet/server/server.mjs"]
