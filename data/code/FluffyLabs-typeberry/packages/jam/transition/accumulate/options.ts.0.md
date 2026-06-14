---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/options.ts#L1-L6
title: packages/jam/transition/accumulate/options.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 47d4dd3ffcb218fce438c2efda6af81d238e2266537a1ff6284803b4f49172ae
language: typescript
---
`packages/jam/transition/accumulate/options.ts` (lines 1–6)

```typescript
import type { PvmBackend } from "@typeberry/config";

export type AccumulateOptions = {
  pvm: PvmBackend;
  accumulateSequentially: boolean;
};
```
