---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/.github/workflows/npm-publish.yml#L1-L81
title: .github/workflows/npm-publish.yml
site: github.com/tomusdrw/anan-as
created_at: '2026-05-08T13:25:50+02:00'
last_modified: '2026-05-08T13:25:50+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 840b014456d2156988b52536b680c2c4563e2dacbeef1a64ebe84befb256ecd6
language: yaml
---
`.github/workflows/npm-publish.yml` (lines 1–81)

```yaml
name: Publish to NPM

on:
  push:
    branches:
      - main  # Triggers on push to main branch
    tags:
      - 'v*.*.*'  # Triggers on version tags like v1.0.0, v2.1.3, etc.
  workflow_dispatch:  # Allows manual trigger from Actions tab

permissions:
  id-token: write # NPM OIDC
  contents: read

env:
  NODE_VERSION: 22.x

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write  # Required for NPM provenance
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'

      - name: Update npm to 11.5.1
        run: npm install -g npm@11.5.1

      - name: Install dependencies
        run: npm ci

      - name: Run QA checks
        run: npm run qa

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Determine publish tag and version
        id: publish-info
        run: |
          if [[ "${{ github.ref }}" == refs/tags/v* ]]; then
            echo "tag=latest" >> $GITHUB_OUTPUT
            echo "is_release=true" >> $GITHUB_OUTPUT
          else
            echo "tag=next" >> $GITHUB_OUTPUT
            echo "is_release=false" >> $GITHUB_OUTPUT
          fi

      - name: Sync version from tag
        if: steps.publish-info.outputs.is_release == 'true'
        run: |
          TAG_VERSION="${GITHUB_REF#refs/tags/v}"
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          if [ "$CURRENT_VERSION" != "$TAG_VERSION" ]; then
            echo "Aligning package.json version ($CURRENT_VERSION) -> $TAG_VERSION"
            npm version "$TAG_VERSION" --no-git-tag-version
          fi
      - name: Bump version for next tag
        if: steps.publish-info.outputs.is_release == 'false'
        run: |
          COMMIT_HASH="${{ github.sha }}"
          COMMIT_SHORT="${COMMIT_HASH:0:7}"
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          NEW_VERSION="${CURRENT_VERSION}-${COMMIT_SHORT}"
          npm version ${NEW_VERSION} --no-git-tag-version
          echo "Publishing version: ${NEW_VERSION}"

      - name: Publish to NPM
        run: npm publish --provenance --scope @fluffylabs --access public --tag ${{ steps.publish-info.outputs.tag }}
```
