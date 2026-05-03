---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/general/log.ts#L1-L15'
title: sdk/ecalli/general/log.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a06ab2279330dcad906a986300cb912037189571d6d52c17aa57fce9b8a80e4e
language: typescript
---
`sdk/ecalli/general/log.ts` (lines 1–15)

```typescript
/**
 * Ecalli 100: JIP-1 Debug log.
 *
 * Emit a debug message to the host logger.
 *
 * @param level - log level: 0=fatal, 1=warning, 2=important, 3=helpful, 4=pedantic
 * @param target_ptr - category string pointer (0 for none)
 * @param target_len - category string length (0 for none)
 * @param message_ptr - message string pointer
 * @param message_len - message string length
 * @returns 0 on success
 */
// @ts-expect-error: decorator
@external("ecalli", "log")
export declare function log(level: u32, target_ptr: u32, target_len: u32, message_ptr: u32, message_len: u32): u32;
```
