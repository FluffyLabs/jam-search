---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/authorizer/assembly/test-run.ts#L1-L6
title: examples/authorizer/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b96c78ef1b3c82dcfc0b66ae21fb0aa1c48debd6adb6650260be668f31660bc2
language: typescript
---
`examples/authorizer/assembly/test-run.ts` (lines 1–6)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as sdk from "./index.test";

export function runAllTests(): void {
  runTestSuites([TestSuite.create(sdk.TESTS, "authorize.ts")]);
}
```
