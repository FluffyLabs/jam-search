---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/588'
title: Block generator stopped working
site: github.com/FluffyLabs/typeberry
created_at: '2025-09-06T21:13:18.000Z'
last_modified: '2025-09-06T21:13:18.000Z'
content_kind: issue
---

# Block generator stopped working

## Issue by @tomusdrw

I've tried running on couple of `GP_VERSIONS` but it keeps failing with a pretty cryptic error:
```
LOG   [importer] ❌ Rejected block #1: Expected: 0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d, got: 0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0
```

Would be good to cover it with tests as well to make sure it does not happen in the future.
