---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/e2e-rpc.yml#L1-L42
title: .github/workflows/e2e-rpc.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: f994747afff505a7b56b695e2dc618cc4615cb65874ae13b3f96c5e5608caa8a
language: yaml
---
`.github/workflows/e2e-rpc.yml` (lines 1–42)

```yaml
name: QA - @typeberry/rpc

on:
  workflow_dispatch:
  pull_request:
    branches: [ "main" ]
  merge_group:

env:
  TEST_VECTORS_REF: ffffffffffffffffffffffffffffffffffffffff # it is loaded in scripts/load-test-ref.sh

jobs:
  e2e:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [26.x]

    steps:
      - uses: actions/checkout@v6
      - name: Load test ref
        run: .github/scripts/load-test-ref.sh
      - name: Checkout JAM test vectors
        uses: actions/checkout@v6
        with:
          repository: fluffylabs/test-vectors
          path: "./test-vectors"
          ref: ${{ env.TEST_VECTORS_REF }}
      - name: Fetch only required submodule (w3f-davxy_072)
        working-directory: ./test-vectors
        run: |
          sed -i 's|git@github.com:|https://github.com/|g' .gitmodules
          git submodule sync w3f-davxy_072
          git submodule update --init --depth 1 w3f-davxy_072
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run test:e2e -w @typeberry/rpc
```
