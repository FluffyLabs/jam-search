---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/.github/workflows/build.yml#L1-L102
title: .github/workflows/build.yml
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 036fa0976ff3599951dd9ff57a08218a91f416de74173971a4dce8bf625f05d9
language: yaml
---
`.github/workflows/build.yml` (lines 1–102)

```yaml
name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

env:
  NODE_VERSION: 22.x

jobs:
  jamtestvectors:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Checkout JAM test vectors
        uses: actions/checkout@v4
        with:
          repository: FluffyLabs/jamtestvectors
          path: "./jamtestvectors"
          ref: ba76542dbf7a0c72d414a87ad2e30ce4da380448 # New test vectors.
      - name: Run W3F tests (WASM)
        run: npm run test:w3f ./jamtestvectors/pvm/programs/*.json
      - name: Run W3F tests (portable JS)
        run: npm run test:w3f-portable ./jamtestvectors/pvm/programs/*.json

  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run qa
      - run: npm run build
      - run: npm test --if-present

  benchmark:
    runs-on: ubuntu-latest
    # Only run benchmarks on PRs, not on main branch pushes
    if: github.event_name == 'pull_request'
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - name: Get baseline branch
        run: |
          # Get the base branch (main) to compare against
          echo "BASE_BRANCH=${{ github.base_ref }}" >> $GITHUB_ENV
      - run: npm ci
      - run: npm run build
      # Checkout base branch for baseline
      - name: Checkout base branch for baseline
        uses: actions/checkout@v4
        with:
          ref: ${{ github.base_ref }}
          path: ./baseline
      # Run benchmarks on baseline
      - name: Run baseline benchmark
        run: |
          cd ./baseline
          npm ci
          npm run build
          npm run bench:baseline
          cp ./bench/baseline.json ../../baseline.json
      # Run benchmarks on current PR
      - name: Run PR benchmark
        run: |
          npm run bench:ci
          cp ./bench/results.json ../results.json
      # Compare results and post PR comment
      - name: Compare benchmarks
        run: |
          npm run bench:compare ../baseline.json ../results.json -- --threshold 100 --markdown ./bench-comment.md
      - name: Post benchmark comment
        if: always() && hashFiles('bench-comment.md') != ''
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          # Delete previous benchmark comment if it exists
          COMMENT_ID=$(gh api repos/${{ github.repository }}/issues/${{ github.event.pull_request.number }}/comments \
            --jq '.[] | select(.body | startswith("## Benchmark Results")) | .id' | head -1)
          if [ -n "$COMMENT_ID" ]; then
            gh api repos/${{ github.repository }}/issues/comments/$COMMENT_ID -X DELETE
          fi
          gh pr comment ${{ github.event.pull_request.number }} --body-file ./bench-comment.md
```
