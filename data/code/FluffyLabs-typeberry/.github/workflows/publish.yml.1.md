---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish.yml#L120-L163
title: .github/workflows/publish.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7ef18bb167234b754e91460162aaf3f5684abe038d2f65790f42290286b9c5f3
language: yaml
---
`.github/workflows/publish.yml` (lines 120–163)

```yaml
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64

  update-release-notes:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    needs: [publish-npm, publish-docker]
    permissions:
      contents: write

    steps:
    - uses: actions/checkout@v6

    - name: Compute release version (strip leading v)
      id: ver
      run: |
        RAW="${{ github.event.release.tag_name }}"
        echo "version=${RAW#v}" >> "$GITHUB_OUTPUT"

    - name: Update Release Notes
      uses: softprops/action-gh-release@v2
      with:
        body: |
          ## 🐳 Docker Images

          ```bash
          # GitHub Container Registry
          docker pull ghcr.io/${{ github.repository_owner }}/typeberry:${{ steps.ver.outputs.version }}
          ```

          ## 📦 NPM Packages

          ```bash
          npm install @typeberry/lib@${{ steps.ver.outputs.version }}
          npm install @typeberry/jam@${{ steps.ver.outputs.version }}
          ```

          ---
          ${{ github.event.release.body }}
        append_body: true
```
