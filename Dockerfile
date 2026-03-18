# -------------------------
# Base build stage
# -------------------------
FROM oven/bun:latest AS base
WORKDIR /app

# Copy package manager files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# -------------------------
# Build stage
# -------------------------
FROM base AS builder
COPY . .
RUN bun run build

# -------------------------
# Production runtime
# -------------------------
FROM oven/bun:latest AS production
WORKDIR /app

# Copy only what’s needed
COPY --from=builder /app/package.json /app/bun.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["bun", "run", "index.js"]
