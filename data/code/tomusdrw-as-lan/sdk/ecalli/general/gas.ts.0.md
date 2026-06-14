---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/general/gas.ts#L1-L13'
title: sdk/ecalli/general/gas.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 08e5f32c5b18285afa0ad021ab09ef7c8caf7ca0886aeb9eb90445fb386175c1
language: typescript
---
`sdk/ecalli/general/gas.ts` (lines 1–13)

```typescript
/**
 * Ecalli 0: Gas remaining.
 *
 * Returns the remaining gas after this call.
 *
 * Registers:
 * - r7 (out) = remaining gas
 *
 * @returns remaining gas as i64
 */
// @ts-expect-error: decorator
@external("ecalli", "gas")
export declare function gas(): i64;
```
