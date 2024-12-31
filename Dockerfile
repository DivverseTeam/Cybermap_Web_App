##### DEPENDENCIES
FROM --platform=linux/amd64 node:18-alpine3.14 AS deps

# Add necessary system packages
RUN apk add --no-cache libc6-compat openssl bash

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Clear npm cache and install dependencies with verbose logging
RUN npm cache clean --force && npm ci --verbose

##### BUILDER
FROM --platform=linux/amd64 node:18-alpine3.14 AS builder

# Pass build-time arguments
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR

WORKDIR /app

# Copy installed dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

##### RUNNER
FROM --platform=linux/amd64 node:18-alpine3.14 AS runner

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
