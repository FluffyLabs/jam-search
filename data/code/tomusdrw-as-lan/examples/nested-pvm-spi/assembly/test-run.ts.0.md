---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/nested-pvm-spi/assembly/test-run.ts#L1-L6
title: examples/nested-pvm-spi/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 24e881b579d1bfa5f0e74a32f38eadcb0a55fe1699703c1410c906909c93792d
language: typescript
---
`examples/nested-pvm-spi/assembly/test-run.ts` (lines 1–6)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as refineTest from "./refine.test";

export function runAllTests(): void {
  runTestSuites([TestSuite.create(refineTest.TESTS, "refine.ts")]);
}
```
