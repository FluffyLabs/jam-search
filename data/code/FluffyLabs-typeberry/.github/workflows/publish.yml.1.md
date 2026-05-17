---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish.yml#L129-L155
title: .github/workflows/publish.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: eb6ce0863a1f66b6bf17323c0efbfc7135b5f69bd5fbeb356ac9f699e930b097
language: yaml
---
`.github/workflows/publish.yml` (lines 129–155)

```yaml
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
