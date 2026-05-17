---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/test-run.ts#L1-L6
title: examples/all-ecalli/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 10c8b1c120a48f11515691f5910b404eaac10ddcbee71c27d7d0438c11922184
language: typescript
---
`examples/all-ecalli/assembly/test-run.ts` (lines 1–6)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as allEcalliTests from "./all-ecalli.test";

export function runAllTests(): void {
  runTestSuites([TestSuite.create(allEcalliTests.TESTS, "all-ecalli.test.ts")]);
}
```
