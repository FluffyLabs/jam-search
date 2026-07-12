---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/test/test-w3f.ts#L1-L6'
title: test/test-w3f.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 1
content_sha: abe01e9e6161c9b75558f93fdf92dee7cec30b70c8c815d83438296505cbd9d4
language: typescript
---
`test/test-w3f.ts` (lines 1–6)

```typescript
#!/usr/bin/env node

import * as pvm from "../build/release.js";
import { runW3fTests } from "./test-w3f-common.js";

runW3fTests(pvm);
```
