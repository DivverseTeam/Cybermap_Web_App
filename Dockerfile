FROM --platform=linux/amd64 node:18-alpine3.14

# Add necessary system packages
RUN apk add --no-cache libc6-compat openssl bash

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --force

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
