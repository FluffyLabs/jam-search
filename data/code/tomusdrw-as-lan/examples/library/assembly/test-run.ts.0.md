---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/test-run.ts#L1-L10
title: examples/library/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 706ce91b0706a6585b294b9cec266fc0b5bf6eb76f118d59d8f0c9a2f32fac28
language: typescript
---
`examples/library/assembly/test-run.ts` (lines 1–10)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as accumulateTests from "./accumulate.test";
import * as refineTests from "./refine.test";

export function runAllTests(): void {
  runTestSuites([
    TestSuite.create(refineTests.TESTS, "refine.test.ts"),
    TestSuite.create(accumulateTests.TESTS, "accumulate.test.ts"),
  ]);
}
```
