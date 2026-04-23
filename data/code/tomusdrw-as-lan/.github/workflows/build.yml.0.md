---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/build.yml#L1-L37
title: .github/workflows/build.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 32167fd4d596f9b709ae2ca59822cd961e9fde36d49e97c45d343311a144421d
language: yaml
---
`.github/workflows/build.yml` (lines 1–37)

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
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    - name: Install LLVM 18 and Rust toolchain
      run: sudo apt-get update -qq && sudo apt-get install -y -qq llvm-18-dev libpolly-18-dev
    - uses: dtolnay/rust-toolchain@stable
    - name: Cache wasm-pvm binary
      id: cache-wasm-pvm
      uses: actions/cache@v4
      with:
        path: ~/.cargo/bin/wasm-pvm
        key: wasm-pvm-cli-0.8.0
    - name: Install wasm-pvm-cli
      if: steps.cache-wasm-pvm.outputs.cache-hit != 'true'
      run: cargo install wasm-pvm-cli@0.8.0 --locked
    - run: npm ci
    - run: npm run qa
    - run: npm run build
    - run: npm test --if-present
```
