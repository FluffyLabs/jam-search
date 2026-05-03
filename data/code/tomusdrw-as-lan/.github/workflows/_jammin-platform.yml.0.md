---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/_jammin-platform.yml#L1-L105
title: .github/workflows/_jammin-platform.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 2
content_sha: e4b5284e62beba625090e7927380faee2c554d39b78458a8379bd397a8275a1b
language: yaml
---
`.github/workflows/_jammin-platform.yml` (lines 1–105)

```yaml
name: Build one jammin platform

# Reusable workflow that builds a single platform of jammin-as-lan.
#
# Called twice from docker-jammin.yml: once in "smoke-test" mode (push=false,
# runs on every trigger including PRs) and once in "publish" mode (push=true,
# non-PR only). The two callers forward different permission sets so that the
# packages:write token is never present in a runner that just executed
# PR-supplied build code.

on:
  workflow_call:
    inputs:
      platform:
        description: 'Docker platform string (e.g. linux/amd64).'
        type: string
        required: true
      runner:
        description: 'GitHub Actions runner label native to `platform`.'
        type: string
        required: true
      image:
        description: 'Image name without a tag (e.g. ghcr.io/owner/jammin-as-lan).'
        type: string
        required: true
      primary-tag:
        description: 'Fully-qualified image:tag used to load and smoke-test the build locally.'
        type: string
        required: true
      push:
        description: 'When true, push the built image to GHCR by digest and upload the digest as an artifact.'
        type: boolean
        default: false

jobs:
  build:
    runs-on: ${{ inputs.runner }}
    # Permissions are inherited from the calling job. GitHub Actions requires
    # any `permissions` declared here to be a subset of the caller's grants,
    # so we can't declare `packages: write` unconditionally — the smoke-test
    # caller only grants `contents: read`, and the call would fail validation.
    # Smoke-test callers grant only `contents: read` (push steps are gated on
    # `inputs.push` and skipped). Publish callers additionally grant
    # `packages: write` so the GHCR login + push-by-digest can run.
    steps:
      - name: Checkout (release tag)
        if: github.event_name == 'release'
        uses: actions/checkout@v6
        with:
          ref: ${{ github.event.release.tag_name }}

      - name: Checkout (branch or PR)
        if: github.event_name != 'release'
        uses: actions/checkout@v6

      - name: Normalize platform label
        id: platform
        run: |
          p='${{ inputs.platform }}'
          echo "pair=${p//\//-}" >> "$GITHUB_OUTPUT"

      - uses: docker/setup-buildx-action@v4

      - name: Build image (load into local docker for smoke test)
        uses: docker/build-push-action@v7
        with:
          context: .
          file: docker/jammin-as-lan.Dockerfile
          platforms: ${{ inputs.platform }}
          load: true
          tags: ${{ inputs.primary-tag }}
          cache-from: type=gha,scope=${{ steps.platform.outputs.pair }}
          cache-to: type=gha,mode=max,scope=${{ steps.platform.outputs.pair }}

      - name: Smoke test — wasm-pvm and node on PATH
        run: |
          set -eux
          # wasm-pvm is a subcommand-style CLI; --help is the built-in
          # clap flag that exits 0 and proves the binary loaded without
          # dynamic-linker errors (glibc version, missing shared libs, …).
          docker run --rm "${{ inputs.primary-tag }}" wasm-pvm --help
          docker run --rm "${{ inputs.primary-tag }}" node --version

      - name: Report uncompressed image size
        run: |
          docker image inspect "${{ inputs.primary-tag }}" \
            --format 'uncompressed size: {{.Size}} bytes'

      - name: Login to GHCR
        if: inputs.push
        uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push by digest
        if: inputs.push
        id: push
        uses: docker/build-push-action@v7
        with:
          context: .
          file: docker/jammin-as-lan.Dockerfile
          platforms: ${{ inputs.platform }}
          outputs: type=image,name=${{ inputs.image }},push-by-digest=true,name-canonical=true,push=true
```
