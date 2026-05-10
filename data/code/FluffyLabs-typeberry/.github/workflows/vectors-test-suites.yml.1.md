---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/vectors-test-suites.yml#L119-L135
title: .github/workflows/vectors-test-suites.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 4db15258136d4237b19c839ca48646bad79c556e594bb2312218309eb9520edd
language: yaml
---
`.github/workflows/vectors-test-suites.yml` (lines 119–135)

```yaml
          echo "## ❌ Test Vector Failures" > combined-errors.md
          echo "" >> combined-errors.md
          for dir in artifacts/*/; do
            if [ -d "$dir" ]; then
              name=$(basename "$dir")
              echo "" >> combined-errors.md
              (cat "$dir"*.txt >> combined-errors.md 2>/dev/null) || (echo "No output file found: $name" >> combined-errors.md)
              echo "" >> combined-errors.md
            fi
          done

      - name: Post error comment to PR
        if: ${{ needs.test-vectors.result == 'failure' && github.event.pull_request.head.repo.full_name == github.repository }}
        uses: thollander/actions-comment-pull-request@v3
        with:
          file-path: combined-errors.md
          comment-tag: test-vectors-errors
```
