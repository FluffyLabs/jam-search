---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/release-prepare.yml#L112-L118
title: .github/workflows/release-prepare.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: dc2a29854ed134bb28e59ed4e4b41938ad820c01a40190996beb43dcd6dc5197
language: yaml
---
`.github/workflows/release-prepare.yml` (lines 112–118)

```yaml
            echo "## Release v$VERSION prepared"
            echo ""
            echo "### Next steps"
            echo "1. Review and merge PR: $BRANCH"
            echo "2. Publish draft release: v$VERSION"
            echo "3. Publish workflow runs automatically on release publication."
          } >> "$GITHUB_STEP_SUMMARY"
```
