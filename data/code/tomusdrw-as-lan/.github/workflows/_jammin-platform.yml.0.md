---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/_jammin-platform.yml#L1-L101
title: .github/workflows/_jammin-platform.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 2
content_sha: e31540a6be95864a9455124b81ae6d45cfd2ca2de2c882161da03da17de60c21
language: yaml
---
`.github/workflows/_jammin-platform.yml` (lines 1–101)

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
          # asc must be on PATH from the global assemblyscript install.
          docker run --rm "${{ inputs.primary-tag }}" asc --version

      - name: Smoke test — no-args run prints help and exits 64
        run: |
          set -eu
          # Default CMD is a usage message that exits 64 (EX_USAGE). Guards
          # against a future refactor that accidentally restores an
          # `npm install`-bearing CMD; jammin always passes its own command,
          # so this CMD should never run during normal use.
          set +e
          out=$(docker run --rm "${{ inputs.primary-tag }}")
          rc=$?
          set -e
          echo "$out"
          if [ "$rc" -ne 64 ]; then
            echo "::error::expected exit 64 from no-args run, got $rc"
            exit 1
          fi
```
