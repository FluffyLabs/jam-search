---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/pages.ts#L1-L21'
title: sdk/ecalli/refine/pages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 768c0fcd28578b45e213849099f3fc26bbd4517f89e40b4421c77195b462c566
language: typescript
---
`sdk/ecalli/refine/pages.ts` (lines 1–21)

```typescript
/**
 * Ecalli 11: Set inner machine page access.
 *
 * Configure page access permissions for an inner PVM machine.
 *
 * Registers:
 * - r7 (in)  = m — machine ID
 * - r7 (out)     — OK, WHO (unknown machine), or HUH (invalid access type)
 * - r8 (in)  = p — start page index
 * - r9 (in)  = n — page count
 * - r10 (in) = a — access type
 *
 * @param machine_id - inner machine ID
 * @param start_page - start page index
 * @param page_count - number of pages
 * @param access_type - access permission type
 * @returns OK, WHO, or HUH
 */
// @ts-expect-error: decorator
@external("ecalli", "pages")
export declare function pages(machine_id: u32, start_page: u32, page_count: u32, access_type: u32): i64;
```
