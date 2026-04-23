FROM node:25-slim

WORKDIR /app

EXPOSE 3000

# git is required for on-start data fetching (see backend/src/data/fetcher.ts).
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*

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

# Fetch data on start from the repo. Override DATA_REF to pin to a specific
# commit; leave DATA_REPO_URL empty to serve whatever's at /app/data (not
# recommended for prod — the image no longer bundles data/).
ENV DATA_REPO_URL=https://github.com/FluffyLabs/jam-search.git
ENV DATA_REF=main

CMD ["npm", "start", "-w", "backend"]
