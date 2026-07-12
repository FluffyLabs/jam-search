---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/build-qa.yml#L1-L30
title: .github/workflows/build-qa.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a1d469bf99e6727f1c043b8cb5320416559d3521092427f24b8b99f5cbfc359c
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
        node-version: [26.x]

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
