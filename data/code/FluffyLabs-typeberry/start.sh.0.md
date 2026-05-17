---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/start.sh#L1-L5'
title: start.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: a661bef134e0770aa5a3a8b5311456a0ae887bd02ab732baf339970f9854c0c4
language: bash
---
`start.sh` (lines 1–5)

```bash
#!/bin/sh
# Start script for Docker container
# Forwards all arguments to npm start

exec npm start -- "$@"
```
