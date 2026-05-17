---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/prize-blockchain.yml#L1-L51
title: .github/workflows/prize-blockchain.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 693e2030cc626e7c0dfe62bddeac8a405738b3fc04898ee5bd7178fbf70a0155
language: yaml
---
`.github/workflows/prize-blockchain.yml` (lines 1–51)

```yaml
# This workflow will upload the hash of every commit merged to the main branch to a public blockchain
# WARNING: This workflow does not work in the context of the typeberry repo, but rather FluffyLabs/publish-commit

name: Prize - Commits to Kusama AH

on:
  push:
    branches: ["main"]

env:
  LOG_FILENAME: ${{ github.workspace }}/blockchain-git-log.json

permissions:
  actions: read
  contents: read

jobs:
  blockchain-git-log:
    runs-on: self-hosted
    timeout-minutes: 10

    strategy:
      matrix:
        node-version: [24.x]

    steps:
      - uses: actions/checkout@v6
        with:
          repository: 'FluffyLabs/publish-commit'
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - name: Download previous transaction log
        uses: dawidd6/action-download-artifact@v6
        with:
          name: log
          search_artifacts: true
          branch: ${{ github.ref_name }}
        continue-on-error: true
      - run: npm start
        env:
          COMMIT_KEY_SECRET: ${{ secrets.COMMIT_KEY_SECRET }}
        continue-on-error: true
      - name: Upload new transaction log
        uses: actions/upload-artifact@v4
        with:
          path: ${{ env.LOG_FILENAME }}
          name: log
```
