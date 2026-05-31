---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/scripts/load-test-ref.sh#L1-L4
title: .github/scripts/load-test-ref.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f52acfd00e55f0ec42d22586254a468ae7f3beca8cf2d60b4a594c82b8d32bc3
language: bash
---
`.github/scripts/load-test-ref.sh` (lines 1–4)

```bash
#!/bin/sh
REF=ed6db7e90f39c339dfa1a0ee6c618c9639efae76

echo "TEST_VECTORS_REF=$REF" >> "$GITHUB_ENV"
```
