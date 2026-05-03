---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/_jammin-platform.yml#L102-L122
title: .github/workflows/_jammin-platform.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 86a90cf6ec76ec880c60fd00803765c773d16b59d83200c5ab8848225d1d1212
language: yaml
---
`.github/workflows/_jammin-platform.yml` (lines 102–122)

```yaml
          context: .
          file: docker/jammin-as-lan.Dockerfile
          platforms: ${{ inputs.platform }}
          outputs: type=image,name=${{ inputs.image }},push-by-digest=true,name-canonical=true,push=true
          cache-from: type=gha,scope=${{ steps.platform.outputs.pair }}

      - name: Export digest
        if: inputs.push
        run: |
          mkdir -p "${RUNNER_TEMP}/digests"
          digest="${{ steps.push.outputs.digest }}"
          touch "${RUNNER_TEMP}/digests/${digest#sha256:}"

      - name: Upload digest
        if: inputs.push
        uses: actions/upload-artifact@v4
        with:
          name: digests-${{ steps.platform.outputs.pair }}
          path: ${{ runner.temp }}/digests/*
          if-no-files-found: error
          retention-days: 1
```
