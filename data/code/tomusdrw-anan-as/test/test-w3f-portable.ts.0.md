---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/test/test-w3f-portable.ts#L1-L7'
title: test/test-w3f-portable.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ed029073992114d985d14282a642fd13bd7ff8c2c60419b35d832e0629a89edf
language: typescript
---
`test/test-w3f-portable.ts` (lines 1–7)

```typescript
#!/usr/bin/env node

// @ts-expect-error: portable bundle has no TS declarations for direct import
import * as pvm from "../dist/build/js/portable-bundle.js";
import { runW3fTests } from "./test-w3f-common.js";

runW3fTests(pvm);
```
