---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/.github/workflows/pages-deploy.yml#L1-L52
title: .github/workflows/pages-deploy.yml
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7c77e63bd18628891b4fad98db8ffdbe51d8d8878e6d4d67f537e912b6762bf9
language: yaml
---
`.github/workflows/pages-deploy.yml` (lines 1–52)

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy to Github Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Update version
        run: npm run update-version
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./web"
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
