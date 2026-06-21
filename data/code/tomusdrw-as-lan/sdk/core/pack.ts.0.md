---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/pack.ts#L1-L27'
title: sdk/core/pack.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7ff1841052a8da6cc9f35f476f3a9ed5aab3baa121ccd2429cc329d944a7fe1f
language: typescript
---
`sdk/core/pack.ts` (lines 1–27)

```typescript
export type U8WithError = u16;

@inline()
export function u8WithError(v: u8, error: u8): U8WithError {
  return (u16(error) << 8) + v;
}

@inline()
export function u8IsError(c: U8WithError): boolean {
  return c >> 8 > 0;
}

/**
 * Pack a Uint8Array into a u64 as (len << 32 | ptr) for returning data
 * to the host via an entry-point return value.
 *
 * The backing ArrayBuffer is pinned so the GC will never collect it.
 * This means every call permanently leaks the buffer — only use this
 * for entry-point return values (one per invocation).
 */
export function ptrAndLen(data: Uint8Array): u64 {
  // Pin the ArrayBuffer so the raw pointer remains valid after this
  // function returns. Without this, the GC may collect the buffer
  // before the caller (host or test harness) reads from the pointer.
  __pin(changetype<usize>(data.buffer));
  return (u64(data.byteLength) << 32) | u64(data.dataStart);
}
```
