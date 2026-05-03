---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/test-run.ts#L1-L6
title: examples/pastebin/assembly/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bf5cca8ed81aa7612196a4436092495808e07267e2696bf6f3b411357578108f
language: typescript
---
`examples/pastebin/assembly/test-run.ts` (lines 1–6)

```typescript
import { runTestSuites, TestSuite } from "@fluffylabs/as-lan/test";
import * as pastebinTests from "./pastebin.test";

export function runAllTests(): void {
  runTestSuites([TestSuite.create(pastebinTests.TESTS, "pastebin.test.ts")]);
}
```
