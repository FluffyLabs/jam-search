---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/test/test-trace-format.ts#L203-L207
title: test/test-trace-format.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 2
chunk_total: 3
content_sha: 6e212e138c2a02617c38a489f706c21f5dd89dd76f73d8c32fedb43177ee60ec
language: typescript
---
`test/test-trace-format.ts` (lines 203–207)

```typescript
// Test: missing termination throws
assert.throws(() => parseTrace("program 0x00\nstart pc=0 gas=100"), /Missing termination/, "missing termination");
console.log("PASS: missing termination throws");

console.log("\nAll trace format tests passed.");
```
