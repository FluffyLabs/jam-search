---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/utils-benchmarks.yml#L1-L61
title: .github/workflows/utils-benchmarks.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: bf104efbe785ae6c646c2a5a723a39eed88e30d21835cecfb7a21d4587b368c1
language: yaml
---
`.github/workflows/utils-benchmarks.yml` (lines 1–61)

```yaml
# Run all benchmarks and compare the results.

name: Utils - Benchmarks

on:
  workflow_dispatch:
  pull_request:
    branches: [ "main" ]
  #merge_group: # no need to run benchmarks again

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  benchmarks:
    runs-on: [self-hosted, benchmarks]

    strategy:
      matrix:
        node-version: [26.x]

    steps:
      - name: Delete previous comment on PR
        # Don't attempt to comment if PR is coming from a fork.
        if: ${{ always() && github.event.pull_request.head.repo.full_name == github.repository }}
        uses: thollander/actions-comment-pull-request@v3
        with:
          mode: delete
          comment-tag: benchmarks
      - uses: actions/checkout@v6
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - name: Benchmarks run
        uses: nick-fields/retry@v4
        with:
          timeout_minutes: 30
          max_attempts: 3
          command: npm start -w @typeberry/benchmark
      - name: Display results
        if: always()
        run: cat ./dist/benchmarks/results.txt
      - name: Comment PR
        if: ${{ always() && github.event.pull_request.head.repo.full_name == github.repository }}
        uses: thollander/actions-comment-pull-request@v3
        with:
          file-path: ./dist/benchmarks/results.txt
          comment-tag: benchmarks
      - name: Upload new transaction log
        if: failure()
        uses: actions/upload-artifact@v7
        with:
          path: |
            ./benchmarks/*/output
            ./dist/benchmarks/results.json
            ./dist/benchmarks/results.txt
          name: benchmark-results
```
