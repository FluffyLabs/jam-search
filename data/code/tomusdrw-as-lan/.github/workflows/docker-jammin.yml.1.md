---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/docker-jammin.yml#L95-L207
title: .github/workflows/docker-jammin.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 6cc5cd9503e170f0b081011c7747feac6941fa6729ac96b617c00c83addc21b7
language: yaml
---
`.github/workflows/docker-jammin.yml` (lines 95–207)

```yaml
  # Smoke-test build. Runs on every trigger (including PRs). No registry
  # access — the Dockerfile cargo-installs a crate, whose build script runs
  # arbitrary code, so we don't want packages:write here.
  build:
    needs: tags
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: linux/amd64
            runner: ubuntu-latest
          - platform: linux/arm64
            runner: ubuntu-24.04-arm
    permissions:
      contents: read
    uses: ./.github/workflows/_jammin-platform.yml
    with:
      platform: ${{ matrix.platform }}
      runner: ${{ matrix.runner }}
      image: ${{ needs.tags.outputs.image }}
      primary-tag: ${{ needs.tags.outputs.primary }}
      push: false

  # Publish per-platform digests. Skipped on PRs entirely so the
  # packages:write token never lives in a runner that just ran untrusted PR
  # code in `build`. Reuses the GHA cache populated by `build`, so the docker
  # build is effectively a metadata replay.
  push:
    needs: [tags, build]
    if: github.event_name != 'pull_request'
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: linux/amd64
            runner: ubuntu-latest
          - platform: linux/arm64
            runner: ubuntu-24.04-arm
    permissions:
      contents: read
      packages: write
    uses: ./.github/workflows/_jammin-platform.yml
    with:
      platform: ${{ matrix.platform }}
      runner: ${{ matrix.runner }}
      image: ${{ needs.tags.outputs.image }}
      primary-tag: ${{ needs.tags.outputs.primary }}
      push: true

  merge:
    # Combines the per-platform digests pushed by the push matrix into a
    # single multi-arch manifest list and tags it. Skipped on PRs — they
    # never push.
    needs: [tags, push]
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Download digests
        uses: actions/download-artifact@v8
        with:
          path: ${{ runner.temp }}/digests
          pattern: digests-*
          merge-multiple: true

      - uses: docker/setup-buildx-action@v4

      - name: Login to GHCR
        uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Create manifest list and push
        working-directory: ${{ runner.temp }}/digests
        env:
          IMAGE: ${{ needs.tags.outputs.image }}
          TAGS: ${{ needs.tags.outputs.tags }}
        run: |
          set -euo pipefail
          shopt -s nullglob
          TAG_ARGS=()
          while IFS= read -r tag; do
            [[ -z "$tag" ]] && continue
            TAG_ARGS+=("-t" "$tag")
          done <<< "$TAGS"
          SOURCES=()
          for digest in *; do
            SOURCES+=("${IMAGE}@sha256:${digest}")
          done
          # Must match the build matrix size. Guards against silent partial
          # manifests if a future refactor breaks upload/download naming.
          EXPECTED_PLATFORMS=2
          if [[ "${#SOURCES[@]}" -ne "$EXPECTED_PLATFORMS" ]]; then
            echo "::error::expected ${EXPECTED_PLATFORMS} platform digests, found ${#SOURCES[@]}"
            exit 1
          fi
          docker buildx imagetools create "${TAG_ARGS[@]}" "${SOURCES[@]}"

      - name: Inspect pushed manifest and assert platform coverage
        env:
          IMAGE: ${{ needs.tags.outputs.primary }}
        run: |
          set -euo pipefail
          docker buildx imagetools inspect "$IMAGE"
          # Belt-and-braces: the digest count check earlier guarantees we
          # passed the right number of sources to imagetools, but not that
          # they covered distinct platforms. Read the published manifest
          # back and assert linux/amd64 + linux/arm64 are both present.
          # buildx attaches provenance/SBOM as extra `unknown/unknown` entries
```
