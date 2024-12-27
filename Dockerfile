##### DEPENDENCIES

FROM --platform=linux/amd64 node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependency files
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on the lock file
RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install; \
    else echo "No lockfile found. Using npm install as fallback." && npm install; \
    fi

##### BUILDER

FROM --platform=linux/amd64 node:22-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
    else echo "No lockfile found for build step." && exit 1; \
    fi

##### RUNNER

FROM --platform=linux/amd64 node:22-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for running the app
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose port and set the command to run the application
EXPOSE 3000
CMD ["node", "server.js"]
