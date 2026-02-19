FROM node:20-alpine AS base

WORKDIR /app

# Development stage
FROM base AS development
COPY . .
RUN yarn install
EXPOSE 3001
CMD ["yarn", "workspace", "@bg-teach/backend", "dev"]

# Builder stage for production
FROM base AS builder
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace @bg-teach/backend build

# Production image
FROM base AS final

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Copy the entire workspace structure for production install
# This is necessary for workspace links to work correctly
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json

# Install ONLY production dependencies for the entire workspace
RUN yarn install --frozen-lockfile --production --network-timeout 100000

# Copy built artifacts
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Create user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

USER expressjs

EXPOSE 3001

# Entry point from the root of the workspace
CMD ["node", "packages/backend/dist/index.js"]
