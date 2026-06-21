---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/expunge.ts#L1-L15
title: sdk/ecalli/refine/expunge.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 486bf70e71b4b53c566ef74fe58d56dc2e4ab1e2684871d594a57e10cc5608d9
language: typescript
---
`sdk/ecalli/refine/expunge.ts` (lines 1–15)

```typescript
/**
 * Ecalli 13: Expunge inner machine.
 *
 * Destroy an inner PVM machine and recover its resources.
 *
 * Registers:
 * - r7 (in)  = m — machine ID
 * - r7 (out)     — hash/result on success, or WHO if unknown
 *
 * @param machine_id - inner machine ID
 * @returns result on success, or WHO if unknown machine
 */
// @ts-expect-error: decorator
@external("ecalli", "expunge")
export declare function expunge(machine_id: u32): i64;
```
