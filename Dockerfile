##### DEPENDENCIES STAGE
# This stage installs dependencies without building the application.
FROM --platform=linux/amd64 node:22-alpine AS deps

# Add necessary packages
RUN apk add --no-cache libc6-compat openssl

# Set the working directory
WORKDIR /app

# Copy package.json and lock file to cache dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

##### BUILDER STAGE
# This stage builds the Next.js application.
FROM --platform=linux/amd64 node:22-alpine AS builder

# Build-time environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR

# Set the working directory
WORKDIR /app

# Pass build arguments to environment variables
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_CLIENTVAR=$NEXT_PUBLIC_CLIENTVAR

# Copy dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire application code
COPY . .

# Build the Next.js application
RUN npm run build

##### RUNNER STAGE
# This stage creates the production-ready container.
FROM --platform=linux/amd64 node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Define environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy required files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the user to the non-root user
USER nextjs

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "./server.js"]
