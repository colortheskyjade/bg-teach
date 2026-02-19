FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
RUN yarn install --frozen-lockfile --production=false

# Build shared and backend
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules
COPY . .
RUN yarn workspace @bg-teach/shared build
RUN yarn workspace @bg-teach/backend build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json ./
COPY --from=builder /app/packages/shared/dist ./node_modules/@bg-teach/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@bg-teach/shared/
COPY --from=deps /app/node_modules ./node_modules

USER expressjs

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/index.js"]
