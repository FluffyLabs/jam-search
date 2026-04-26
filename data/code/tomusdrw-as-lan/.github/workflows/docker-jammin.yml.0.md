---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/docker-jammin.yml#L1-L102
title: .github/workflows/docker-jammin.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 7a6ddaaf984c4e80f45f9105946e21318607ebac2a5098ce5fd226e7980630fe
language: yaml
---
`.github/workflows/docker-jammin.yml` (lines 1–102)

```yaml
name: Build jammin-as-lan image

on:
  release:
    types: [published]
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    # Builds the image and runs smoke tests. Runs on every trigger, including
    # pull_request. Does not need packages:write — the push job handles that.
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      primary: ${{ steps.tags.outputs.primary }}
      tags: ${{ steps.tags.outputs.tags }}
    steps:
      - name: Checkout (release tag)
        if: github.event_name == 'release'
        uses: actions/checkout@v6
        with:
          ref: ${{ github.event.release.tag_name }}

      - name: Checkout (branch or PR)
        if: github.event_name != 'release'
        uses: actions/checkout@v6

      - name: Compute image tags
        id: tags
        env:
          REPO_OWNER: ${{ github.repository_owner }}
          PR_HEAD_SHA: ${{ github.event.pull_request.head.sha }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          RELEASE_TAG_NAME: ${{ github.event.release.tag_name }}
        run: |
          set -euo pipefail
          # ghcr refs must be lowercase; repo owner can be mixed-case (e.g. FluffyLabs).
          IMAGE="ghcr.io/${REPO_OWNER,,}/jammin-as-lan"
          if [[ "${{ github.event_name }}" == "release" ]]; then
            TAG_VERSION="${RELEASE_TAG_NAME#v}"
            SDK_VERSION=$(node -p "require('./sdk/package.json').version")
            MOCKS_VERSION=$(node -p "require('./sdk-ecalli-mocks/package.json').version")
            ROOT_VERSION=$(node -p "require('./package.json').version")
            if [[ "$TAG_VERSION" != "$SDK_VERSION" || "$TAG_VERSION" != "$MOCKS_VERSION" || "$TAG_VERSION" != "$ROOT_VERSION" ]]; then
              echo "::error::release tag ($RELEASE_TAG_NAME) does not match package.json versions (sdk=$SDK_VERSION mocks=$MOCKS_VERSION root=$ROOT_VERSION). Did you publish the draft release before merging the bump PR?"
              exit 1
            fi
            {
              echo "primary=${IMAGE}:${TAG_VERSION}"
              echo "tags<<EOF"
              echo "${IMAGE}:${TAG_VERSION}"
              echo "${IMAGE}:latest"
              echo "EOF"
            } >> "$GITHUB_OUTPUT"
          elif [[ "${{ github.event_name }}" == "pull_request" ]]; then
            # Use the PR head SHA (not GITHUB_SHA, which is the ephemeral merge
            # commit) so the tag points at the contributor's actual commit.
            SHORT_SHA="${PR_HEAD_SHA::7}"
            {
              echo "primary=${IMAGE}:pr-${PR_NUMBER}-${SHORT_SHA}"
              echo "tags<<EOF"
              echo "EOF"
            } >> "$GITHUB_OUTPUT"
          else
            SHORT_SHA="${GITHUB_SHA::7}"
            {
              echo "primary=${IMAGE}:main-${SHORT_SHA}"
              echo "tags<<EOF"
              echo "${IMAGE}:main-${SHORT_SHA}"
              echo "EOF"
            } >> "$GITHUB_OUTPUT"
          fi

      - uses: docker/setup-buildx-action@v4

      - name: Build image (load into local docker for smoke test)
        uses: docker/build-push-action@v7
        with:
          context: .
          file: docker/jammin-as-lan.Dockerfile
          load: true
          tags: ${{ steps.tags.outputs.primary }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Smoke test — wasm-pvm and node on PATH
        run: |
          set -eux
          # wasm-pvm is a subcommand-style CLI; --help is the built-in
          # clap flag that exits 0 and proves the binary loaded without
          # dynamic-linker errors (glibc version, missing shared libs, …).
          docker run --rm "${{ steps.tags.outputs.primary }}" wasm-pvm --help
          docker run --rm "${{ steps.tags.outputs.primary }}" node --version

      - name: Report uncompressed image size
        run: |
          docker image inspect "${{ steps.tags.outputs.primary }}" \
```
