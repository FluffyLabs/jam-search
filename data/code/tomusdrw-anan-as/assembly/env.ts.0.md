---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/env.ts#L1-L11'
title: assembly/env.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5e20d474a2ad286c6ea5974a11c29c5773e1b5be8a0ad3a4e37c65565ed81283
language: typescript
---
`assembly/env.ts` (lines 1–11)

```typescript
/**
 * Host call handler: ecalli index + r7-r12, returns r7.
 * See: https://todr.me/wasm-pvm/architecture.html#host_call_necalli_index-r7--r7n-1---i64--ecalli
 */
export declare function host_call_6b(ecalli: i64, r7: i64, r8: i64, r9: i64, r10: i64, r11: i64, r12: i64): i64;

/**
 * Retrieve r8 captured by the last host_call_6b invocation.
 * See: https://todr.me/wasm-pvm/architecture.html#host_call_necalli_index-r7--r7n-1---i64--ecalli
 */
export declare function host_call_r8(): i64;
```
