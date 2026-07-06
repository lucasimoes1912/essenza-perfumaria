# syntax=docker/dockerfile:1

# ---- Build ----
FROM node:24-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime (imagem final enxuta, só o necessário) ----
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# "::" = IPv6 dual-stack; a rede interna do Railway roteia via IPv6
ENV HOSTNAME=::
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
