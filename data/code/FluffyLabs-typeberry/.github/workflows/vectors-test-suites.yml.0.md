---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/vectors-test-suites.yml#L1-L121
title: .github/workflows/vectors-test-suites.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5fe7331a6faaed8579ce76ed54491f8543fa2d6fff1d9202f2ac92b21a13600f
language: yaml
---
`.github/workflows/vectors-test-suites.yml` (lines 1–121)

```yaml
name: VECTORS - test suites

on:
  workflow_dispatch:
  pull_request:
    branches: [ "main" ]
  #merge_group: skip test vectors in merge queue, because it's pretty slow

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.event.merge_group.head_ref || github.ref }}
  cancel-in-progress: true

env:
  TEST_VECTORS_REF: ffffffffffffffffffffffffffffffffffffffff # loaded in scripts/load-test-ref.sh
  NODE_VERSION: 26.x

jobs:
  test-vectors:
    name: ${{ matrix.display_name }}
    runs-on: self-hosted

    strategy:
      fail-fast: false
      matrix:
        include:
          - display_name: conformance-0.7.2
            gp_version: 0.7.2
            script: jam-conformance-072.ts
            output: jam-conformance-072.txt
            artifact_name: conformance-072-results
            submodule: jam-conformance
          - display_name: w3f-0.7.2
            gp_version: 0.7.2
            script: w3f-072.ts
            output: w3f-072.txt
            artifact_name: w3f-072-results
            submodule: w3f_072
          - display_name: w3f-davxy-0.7.1
            gp_version: 0.7.1
            script: w3f-davxy-071.ts
            output: w3f-davxy-071.txt
            artifact_name: davxy-071-results
            submodule: w3f-davxy_071
          - display_name: w3f-davxy-0.7.2
            gp_version: 0.7.2
            script: w3f-davxy-072.ts
            output: w3f-davxy-072.txt
            artifact_name: davxy-072-results
            submodule: w3f-davxy_072
          - display_name: javajam-0.7.1
            gp_version: 0.7.1
            script: javajam-071.ts
            output: javajam-071.txt
            artifact_name: javajam-071-results
            submodule: javajam_071
          # Vectors committed in-repo under `test-vectors-local/` (no external submodule).
          - display_name: local-0.7.2
            gp_version: 0.7.2
            script: local.ts
            output: local.txt
            artifact_name: local-results
            submodule: ""

    env:
      GP_VERSION: ${{ matrix.gp_version }}

    steps:
      - uses: actions/checkout@v6
      - name: Load test ref
        run: .github/scripts/load-test-ref.sh
      - name: Checkout JAM test vectors
        if: ${{ matrix.submodule != '' }}
        uses: actions/checkout@v6
        with:
          repository: fluffylabs/test-vectors
          path: "./test-vectors"
          ref: ${{ env.TEST_VECTORS_REF }}
      - name: Fetch only required submodule (${{ matrix.submodule }})
        if: ${{ matrix.submodule != '' }}
        working-directory: ./test-vectors
        run: |
          sed -i 's|git@github.com:|https://github.com/|g' .gitmodules
          git submodule sync ${{ matrix.submodule }}
          git submodule update --init --depth 1 ${{ matrix.submodule }}
      - name: Use Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - run: npm start -w @typeberry/test-runner -- ${{ matrix.script }}
      - name: Display results
        if: always()
        run: cat ./dist/${{ matrix.output }}
      - name: Upload new transaction log
        if: failure()
        uses: actions/upload-artifact@v7
        with:
          path: |
            ./dist/${{ matrix.output }}
          name: ${{ matrix.artifact_name }}

  summary:
    name: Post error summary
    runs-on: self-hosted
    needs: test-vectors
    if: always()

    steps:
      - name: Delete previous error comment
        if: ${{ github.event.pull_request.head.repo.full_name == github.repository }}
        uses: thollander/actions-comment-pull-request@v3
        with:
          mode: delete
          comment-tag: test-vectors-errors

      - name: Download all failure artifacts
        if: ${{ needs.test-vectors.result == 'failure' }}
        uses: actions/download-artifact@v8
        with:
          path: artifacts
```
