FROM node:20-alpine AS builder

WORKDIR /app

# Copy the entire project source code
COPY . .

# Install dependencies and build
RUN yarn install --frozen-lockfile
RUN yarn workspace @bg-teach/shared build
RUN yarn workspace @bg-teach/backend build

# Production image
FROM node:20-alpine AS final

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Copy the entire workspace structure for production install
# This is necessary for workspace links to work correctly
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

# Install ONLY production dependencies for the entire workspace
RUN yarn install --frozen-lockfile --production --network-timeout 100000

# Copy built artifacts
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Create user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

USER expressjs

EXPOSE 3001

# Entry point from the root of the workspace
CMD ["node", "packages/backend/dist/index.js"]
