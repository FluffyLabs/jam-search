---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/build-src.yml#L1-L61
title: .github/workflows/build-src.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: f792ef904ef3757123f45c8d9db2072e0caf8f2b336298d16e935a75f5fe5f49
language: yaml
---
`.github/workflows/build-src.yml` (lines 1–61)

```yaml
name: Build - Project

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  merge_group:

jobs:
  build:
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
        cache: 'npm'
    - run: npm ci
    - name: Check whether package-lock.json is up to date
      run: |
        npm install --package-lock-only
        if ! git diff --quiet -- package-lock.json; then
          echo "package-lock.json is out of sync with package.json."
          echo "Please run 'npm install' and commit the updated package-lock.json."
          exit 1
        else
          echo "package-lock.json is up to date."
        fi
    - run: npm run build
    - run: npm run build -w @typeberry/lib
    - run: npm run check:cycles

  npm:
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
        cache: 'npm'
    - run: npm ci
    - run: npm run build -w @typeberry/jam
    - run: |
        cd dist/jam
        npm install
        node index.js --help


```
