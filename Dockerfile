# Build and run Node + Redis in a single container
FROM node:22-bookworm

# Install Redis server
RUN apt-get update \
  && apt-get install -y redis-server \
  && rm -rf /var/lib/apt/lists/*

# App directory
WORKDIR /usr/src/app

# Install dependencies first (better cache)
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source
COPY src ./src

# Build TypeScript to dist/
RUN npm run build

ENV NODE_ENV=production \
    PORT=3000

# App and Redis ports
EXPOSE 3000 6379

# Start Redis in the background, then start the Node app
CMD ["bash", "-c", "redis-server --bind 0.0.0.0 --save '' --appendonly no & node dist/server.js"]
