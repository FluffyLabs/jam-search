---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/constants.ts#L1-L8
title: packages/jam/safrole/constants.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d9a6a0ee7278e214ba7436adc25315336408070319e864f5fe8680f186a45488
language: typescript
---
`packages/jam/safrole/constants.ts` (lines 1–8)

```typescript
import { BytesBlob } from "@typeberry/bytes";

/** `X_E`: https://graypaper.fluffylabs.dev/#/68eaa1f/0e90010e9001?v=0.6.4 */
export const JAM_ENTROPY = BytesBlob.blobFromString("jam_entropy").raw;
/** `X_F`: https://graypaper.fluffylabs.dev/#/68eaa1f/0ea5010ea501?v=0.6.4 */
export const JAM_FALLBACK_SEAL = BytesBlob.blobFromString("jam_fallback_seal").raw;
/** `X_T`: https://graypaper.fluffylabs.dev/#/68eaa1f/0ebc010ebc01?v=0.6.4 */
export const JAM_TICKET_SEAL = BytesBlob.blobFromString("jam_ticket_seal").raw;
```
