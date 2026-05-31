---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/docker-jammin.yml#L1-L100
title: .github/workflows/docker-jammin.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 3
content_sha: f1d919920bcc9d55e51b29c537dc78f215d240c86749504e93e69b00993c327f
language: yaml
---
`.github/workflows/docker-jammin.yml` (lines 1–100)

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
  tags:
    # Compute the image name, primary tag, and full tag list once. Both the
    # per-platform build matrix and the manifest-merge job consume these.
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      image: ${{ steps.tags.outputs.image }}
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
              echo "image=${IMAGE}"
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
              echo "image=${IMAGE}"
              echo "primary=${IMAGE}:pr-${PR_NUMBER}-${SHORT_SHA}"
              echo "tags<<EOF"
              echo "EOF"
            } >> "$GITHUB_OUTPUT"
          elif [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            # Manual dispatches can run from any branch/tag. Stamp the ref into
            # the tag so ad-hoc builds don't masquerade as `main-*` outputs.
            SHORT_SHA="${GITHUB_SHA::7}"
            REF_SLUG="${GITHUB_REF_NAME//\//-}"
            {
              echo "image=${IMAGE}"
              echo "primary=${IMAGE}:manual-${REF_SLUG}-${SHORT_SHA}"
              echo "tags<<EOF"
              echo "${IMAGE}:manual-${REF_SLUG}-${SHORT_SHA}"
              echo "EOF"
            } >> "$GITHUB_OUTPUT"
          else
            SHORT_SHA="${GITHUB_SHA::7}"
            {
              echo "image=${IMAGE}"
              echo "primary=${IMAGE}:main-${SHORT_SHA}"
              echo "tags<<EOF"
              echo "${IMAGE}:main-${SHORT_SHA}"
              echo "EOF"
            } >> "$GITHUB_OUTPUT"
          fi

  # Smoke-test build. Runs on every trigger (including PRs). No registry
  # access — the Dockerfile cargo-installs a crate, whose build script runs
  # arbitrary code, so we don't want packages:write here.
  build:
    needs: tags
    strategy:
```
