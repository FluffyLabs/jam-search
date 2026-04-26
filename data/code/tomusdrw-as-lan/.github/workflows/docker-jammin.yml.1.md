---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/docker-jammin.yml#L98-L141
title: .github/workflows/docker-jammin.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 8eb21ece9ad4f381e081e47e173c27cfc3d67c235a8f70d5b6f87f6e76aea589
language: yaml
---
`.github/workflows/docker-jammin.yml` (lines 98–141)

```yaml
          docker run --rm "${{ steps.tags.outputs.primary }}" node --version

      - name: Report uncompressed image size
        run: |
          docker image inspect "${{ steps.tags.outputs.primary }}" \
            --format 'uncompressed size: {{.Size}} bytes'

  push:
    # Pushes to GHCR. Scoped to trusted triggers only; PRs never reach this
    # job, so packages:write is structurally unavailable to PR runs.
    needs: build
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout (release tag)
        if: github.event_name == 'release'
        uses: actions/checkout@v6
        with:
          ref: ${{ github.event.release.tag_name }}

      - name: Checkout (branch)
        if: github.event_name != 'release'
        uses: actions/checkout@v6

      - uses: docker/setup-buildx-action@v4

      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Push image
        uses: docker/build-push-action@v7
        with:
          context: .
          file: docker/jammin-as-lan.Dockerfile
          push: true
          tags: ${{ needs.build.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```
