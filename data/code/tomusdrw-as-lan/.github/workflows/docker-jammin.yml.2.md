---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/docker-jammin.yml#L205-L222
title: .github/workflows/docker-jammin.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 7d261c50d1450a0860eb46a53167644daa4cbb0be44b07a6b7848176234b184a
language: yaml
---
`.github/workflows/docker-jammin.yml` (lines 205–222)

```yaml
          # they covered distinct platforms. Read the published manifest
          # back and assert linux/amd64 + linux/arm64 are both present.
          # buildx attaches provenance/SBOM as extra `unknown/unknown` entries
          # in the manifest list — skip those, we only care about real images.
          got=$(
            docker buildx imagetools inspect --raw "$IMAGE" \
              | jq -r '
                .manifests[]
                | select(.platform.os != "unknown")
                | "\(.platform.os)/\(.platform.architecture)"
              ' \
              | sort -u
          )
          expected=$(printf 'linux/amd64\nlinux/arm64')
          if [[ "$got" != "$expected" ]]; then
            echo "::error::manifest platforms mismatch — expected: $expected; got: $got"
            exit 1
          fi
```
