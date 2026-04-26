FROM node:25-slim

WORKDIR /app

EXPOSE 3000

# git is required for on-start data fetching (see backend/src/data/fetcher.ts).
# ca-certificates is required for git's HTTPS clone to verify the GitHub cert.
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
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
# commit or tag for rollback. DATA_REPO_URL must stay set — the image no
# longer bundles data/ (see .dockerignore), so unsetting it will crash at
# startup.
ENV DATA_REPO_URL=https://github.com/FluffyLabs/jam-search.git
ENV DATA_REF=main

CMD ["npm", "start", "-w", "backend"]
