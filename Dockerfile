FROM node:22-slim

WORKDIR /app

EXPOSE 3000

# Copy all source files and install dependencies
# NOTE because of workspace we don't optimize this step
COPY . .
RUN npm ci

# Build TypeScript
RUN npm run build

# Embeddings cache volume — mount persistent storage here
# to avoid regenerating embeddings on every restart.
# Example: docker run -v embeddings-cache:/app/cache ...
ENV CACHE_DIR=/app/cache
VOLUME /app/cache

CMD ["npm", "start", "-w", "backend"]
