---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/test-utils.ts#L1-L12
title: packages/core/pvm-interpreter/test-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 90dbeb8e6c9cc8beaf0f3ce0fd2418d7bd9db5c0f5714143935c9effaee27828
language: typescript
---
`packages/core/pvm-interpreter/test-utils.ts` (lines 1–12)

```typescript
import { safeAllocUint8Array } from "@typeberry/utils";

export function bigintToUint8ArrayLE(value: bigint, byteLength = 4): Uint8Array {
  const buffer = safeAllocUint8Array(byteLength);
  let val = value;
  for (let i = 0; i < byteLength; i++) {
    buffer[i] = Number(val & 0xffn); // Extract the lowest 8 bits
    val >>= 8n; // Shift the value 8 bits to the right
  }

  return buffer;
}
```
