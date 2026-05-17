---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/fibonacci/assembly/test-run.ts#L1-L6
title: examples/fibonacci/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: edd11fc910587fbc724555d164d0aaef44e75cd1e0663c3f86d90419596f3683
language: typescript
---
`examples/fibonacci/assembly/test-run.ts` (lines 1–6)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as sdk from "./index.test";

export function runAllTests(): void {
  runTestSuites([TestSuite.create(sdk.TESTS, "fibonacci.ts")]);
}
```
