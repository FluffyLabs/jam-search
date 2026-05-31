---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/release-publish.yml#L1-L105
title: .github/workflows/release-publish.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d684d6b463e6256d0bdc26d668d3aeb7fc3608a7c3641af8d25e799a05a9135a
language: yaml
---
`.github/workflows/release-publish.yml` (lines 1–105)

```yaml
name: "Release: Publish"

on:
  release:
    types: [published]

permissions:
  contents: read
  id-token: write

concurrency:
  group: release-publish-${{ github.event.release.tag_name }}
  cancel-in-progress: false

env:
  NODE_VERSION: 24.x

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout release tag
        uses: actions/checkout@v6
        with:
          ref: ${{ github.event.release.tag_name }}

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          registry-url: https://registry.npmjs.org
          cache: "npm"

      - name: Install LLVM 18
        run: sudo apt-get update -qq && sudo apt-get install -y -qq llvm-18-dev libpolly-18-dev

      - uses: dtolnay/rust-toolchain@stable

      - name: Cache wasm-pvm binary
        id: cache-wasm-pvm
        uses: actions/cache@v5
        with:
          path: ~/.cargo/bin/wasm-pvm
          key: wasm-pvm-cli-0.9.0

      - name: Install wasm-pvm-cli
        if: steps.cache-wasm-pvm.outputs.cache-hit != 'true'
        run: cargo install wasm-pvm-cli@0.9.0 --locked

      - name: Verify tag matches package versions
        run: |
          TAG="${{ github.event.release.tag_name }}"
          EXPECTED="${TAG#v}"
          SDK_VERSION=$(node -p "require('./sdk/package.json').version")
          MOCKS_VERSION=$(node -p "require('./sdk-ecalli-mocks/package.json').version")
          ROOT_VERSION=$(node -p "require('./package.json').version")
          echo "Tag: $TAG"
          echo "Expected version: $EXPECTED"
          echo "SDK:   $SDK_VERSION"
          echo "Mocks: $MOCKS_VERSION"
          echo "Root:  $ROOT_VERSION"
          if [[ "$SDK_VERSION" != "$EXPECTED" || "$MOCKS_VERSION" != "$EXPECTED" || "$ROOT_VERSION" != "$EXPECTED" ]]; then
            echo "::error::Version mismatch between release tag and package.json files. Did you merge the release-prepare PR before publishing the release?"
            exit 1
          fi
          echo "VERSION=$EXPECTED" >> "$GITHUB_ENV"

      - name: Install
        run: npm ci

      - name: QA
        run: npm run qa

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Publish @fluffylabs/as-lan-ecalli-mocks
        run: |
          EXISTING=$(npm view "@fluffylabs/as-lan-ecalli-mocks@$VERSION" version 2>/dev/null || true)
          if [ -n "$EXISTING" ]; then
            echo "Version $VERSION already published, skipping."
          else
            (cd sdk-ecalli-mocks && npm publish)
          fi

      - name: Publish @fluffylabs/as-lan
        run: |
          EXISTING=$(npm view "@fluffylabs/as-lan@$VERSION" version 2>/dev/null || true)
          if [ -n "$EXISTING" ]; then
            echo "Version $VERSION already published, skipping."
          else
            (cd sdk && npm publish)
          fi

      - name: Write job summary
        run: |
          {
            echo "## Release v$VERSION published"
            echo ""
            echo "- [\`@fluffylabs/as-lan@$VERSION\`](https://www.npmjs.com/package/@fluffylabs/as-lan/v/$VERSION)"
            echo "- [\`@fluffylabs/as-lan-ecalli-mocks@$VERSION\`](https://www.npmjs.com/package/@fluffylabs/as-lan-ecalli-mocks/v/$VERSION)"
          } >> "$GITHUB_STEP_SUMMARY"
```
