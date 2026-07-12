---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/vectors-test-suites.yml#L115-L144
title: .github/workflows/vectors-test-suites.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6e62180fce3b15061f90461092b0d3f12fe97509087670f8e48118e77ef4dd21
language: yaml
---
`.github/workflows/vectors-test-suites.yml` (lines 115–144)

```yaml
          comment-tag: test-vectors-errors

      - name: Download all failure artifacts
        if: ${{ needs.test-vectors.result == 'failure' }}
        uses: actions/download-artifact@v8
        with:
          path: artifacts
          pattern: "*-results"
          merge-multiple: false

      - name: Combine error results
        if: ${{ needs.test-vectors.result == 'failure' }}
        run: |
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
