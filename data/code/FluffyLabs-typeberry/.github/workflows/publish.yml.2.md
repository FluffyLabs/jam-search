---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish.yml#L207-L243
title: .github/workflows/publish.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 4d667af3822704f5eb58bb31ce9d9045c4068dd2d508cbb9d60f4d32db8d8ed5
language: yaml
---
`.github/workflows/publish.yml` (lines 207–243)

```yaml
  update-release-notes:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    needs: [publish-npm, docker]
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
      uses: softprops/action-gh-release@v3
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
