---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/test-run.ts#L1-L12
title: examples/ecalli-test/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 77f8b2a81acd45af8bda1dc7a0f9d5f45f1115d046e906331f593cc9ab672eec
language: typescript
---
`examples/ecalli-test/assembly/test-run.ts` (lines 1–12)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as accumulateTests from "./accumulate.test";
import * as authorizeTests from "./authorize.test";
import * as refineTests from "./refine.test";

export function runAllTests(): void {
  runTestSuites([
    TestSuite.create(refineTests.TESTS, "refine.test.ts"),
    TestSuite.create(accumulateTests.TESTS, "accumulate.test.ts"),
    TestSuite.create(authorizeTests.TESTS, "authorize.test.ts"),
  ]);
}
```
