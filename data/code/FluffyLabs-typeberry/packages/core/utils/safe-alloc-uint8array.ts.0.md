---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/safe-alloc-uint8array.ts#L1-L13
title: packages/core/utils/safe-alloc-uint8array.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 96fb150e830cf7960f1a1cb725492cef4b8ac8bd95e2037aacea83e3f012f672
language: typescript
---
`packages/core/utils/safe-alloc-uint8array.ts` (lines 1–13)

```typescript
// about 2GB, the maximum ArrayBuffer length on Chrome confirmed by several sources:
// - https://issues.chromium.org/issues/40055619
// - https://stackoverflow.com/a/72124984
// - https://onnxruntime.ai/docs/tutorials/web/large-models.html#maximum-size-of-arraybuffer
export const MAX_LENGTH = 2145386496;

export function safeAllocUint8Array(length: number): Uint8Array {
  if (length > MAX_LENGTH) {
    // biome-ignore lint/suspicious/noConsole: can't have a dependency on logger here
    console.warn(`Trying to allocate ${length} bytes, which is greater than the maximum of ${MAX_LENGTH}.`);
  }
  return new Uint8Array(Math.min(MAX_LENGTH, length));
}
```
