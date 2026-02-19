FROM node:20-alpine AS base

WORKDIR /app

# Development stage
FROM base AS development
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["yarn", "workspace", "@bg-teach/frontend", "dev"]

# Builder stage for production
FROM base AS builder
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace @bg-teach/frontend build

# Production image
FROM base AS final

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts from standalone output
# Standalone mode already includes node_modules needed for runtime
COPY --from=builder /app/packages/frontend/.next/standalone ./
COPY --from=builder /app/packages/frontend/.next/static ./packages/frontend/.next/static
COPY --from=builder /app/packages/frontend/public ./packages/frontend/public

USER nextjs

EXPOSE 3000

# In standalone mode, server.js is at the root of the standalone folder
CMD ["node", "packages/frontend/server.js"]
