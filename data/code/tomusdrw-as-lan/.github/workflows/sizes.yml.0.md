---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/sizes.yml#L1-L128
title: .github/workflows/sizes.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 2
content_sha: d22d74f9494baaa7f8c542dedacafd0259ed13a79d6d11837f687efa7e0173bb
language: yaml
---
`.github/workflows/sizes.yml` (lines 1–128)

```yaml
name: Artifact Sizes

on:
  pull_request:
    branches: [ "main" ]

env:
  NODE_VERSION: 24.x

permissions:
  pull-requests: write

jobs:
  report-sizes:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
      with:
        ref: ${{ github.event.pull_request.head.sha }}
        fetch-depth: 0

    - name: Use Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v6
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install LLVM 18 and Rust toolchain
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

    # --- Build PR branch ---
    - name: Install dependencies (PR)
      run: npm ci

    - name: Build examples and collect sizes (PR)
      run: |
        mkdir -p /tmp/sizes/pr
        for example_dir in examples/*/; do
          example=$(basename "$example_dir")
          if [ ! -f "$example_dir/package.json" ]; then
            continue
          fi

          cd "$example_dir"
          npm install
          npm run asbuild:release

          wasm_size=$(stat -c%s "build/release.wasm" 2>/dev/null || echo "0")

          pvm_output=$(wasm-pvm compile build/release.wasm -o build/release.pvm --adapter ../../pvm-adapter.wat 2>&1) || true
          pvm_size=$(stat -c%s "build/release.pvm" 2>/dev/null || echo "0")

          # Save as JSON
          printf '{"wasm":%s,"pvm":%s}\n' "$wasm_size" "$pvm_size" > "/tmp/sizes/pr/${example}.json"
          echo "$pvm_output" > "/tmp/sizes/pr/${example}.pvm.log"

          cd "$GITHUB_WORKSPACE"
        done

    # --- Build base branch ---
    - name: Checkout base branch
      run: git checkout ${{ github.event.pull_request.base.sha }}

    - name: Install dependencies (base)
      run: npm ci

    - name: Build examples and collect sizes (base)
      run: |
        mkdir -p /tmp/sizes/base
        for example_dir in examples/*/; do
          example=$(basename "$example_dir")
          if [ ! -f "$example_dir/package.json" ]; then
            continue
          fi

          cd "$example_dir"
          npm install
          npm run asbuild:release

          wasm_size=$(stat -c%s "build/release.wasm" 2>/dev/null || echo "0")

          pvm_output=$(wasm-pvm compile build/release.wasm -o build/release.pvm --adapter ../../pvm-adapter.wat 2>&1) || true
          pvm_size=$(stat -c%s "build/release.pvm" 2>/dev/null || echo "0")

          printf '{"wasm":%s,"pvm":%s}\n' "$wasm_size" "$pvm_size" > "/tmp/sizes/base/${example}.json"
          echo "$pvm_output" > "/tmp/sizes/base/${example}.pvm.log"

          cd "$GITHUB_WORKSPACE"
        done

    - name: Generate PR comment
      id: comment
      uses: actions/github-script@v9
      with:
        script: |
          const fs = require('fs');
          const path = require('path');

          function readSizes(dir) {
            const results = {};
            if (!fs.existsSync(dir)) return results;
            for (const file of fs.readdirSync(dir)) {
              if (!file.endsWith('.json')) continue;
              const name = file.replace('.json', '');
              const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
              const logFile = path.join(dir, `${name}.pvm.log`);
              data.pvmOutput = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').trim() : '';
              results[name] = data;
            }
            return results;
          }

          function formatBytes(bytes) {
            if (bytes === 0) return 'N/A';
            if (bytes < 1024) return `${bytes} B`;
```
