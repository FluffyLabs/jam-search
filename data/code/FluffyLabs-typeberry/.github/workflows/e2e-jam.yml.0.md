---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/e2e-jam.yml#L1-L28
title: .github/workflows/e2e-jam.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 025fc8d349fcac92952321bc745878a0007b0967e93a74602978363481328e42
language: yaml
---
`.github/workflows/e2e-jam.yml` (lines 1–28)

```yaml
name: E2E - @typeberry/jam

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  merge_group:

jobs:
  jam-e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    strategy:
      matrix:
        node-version: [26.x]

    steps:
    - uses: actions/checkout@v6
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v6
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - name: Run JAM dev mode E2E test
      run: npm run test:e2e -w @typeberry/jam
```
