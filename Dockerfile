FROM node:20-alpine AS base

WORKDIR /app

# Development stage
FROM base AS development
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Builder stage for production
FROM base AS builder
COPY . .
RUN npm install
RUN npm run build

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
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

# In standalone mode, server.js is at the root of the standalone folder
CMD ["node", "server.js"]
