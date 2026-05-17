---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/build-qa.yml#L1-L30
title: .github/workflows/build-qa.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 3ddb3be30fb0407bbc6db7a8f91d5227a866cb788639f47fc2b19083a828a02e
language: yaml
---
`.github/workflows/build-qa.yml` (lines 1–30)

```yaml
name: Build - Lint & Test

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
  merge_group:

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [24.x]

    steps:
      - uses: actions/checkout@v6
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run qa
      - run: npm test
      - run: GP_VERSION=0.7.1 npm test
      - run: GP_VERSION=0.7.2 npm test
      - run: npm run docs
```
