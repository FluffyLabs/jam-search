---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/stdin.sh#L1-L3'
title: bin/stdin.sh
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: f781cf6d23b2181b6630b27eba6cce2a2704b7de55500eb030c38ad3132be836
language: bash
---
`bin/stdin.sh` (lines 1–3)

```bash
#!/bin/bash
SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
${SCRIPT_DIR}/test-w3f.js -
```
