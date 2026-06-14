---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/index.ts#L1-L10
title: packages/jam/jam-host-calls/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: b644e63189cd0b2ab55118574ebc2571e772e67ae44fe7588856ee3b479686de
language: typescript
---
`packages/jam/jam-host-calls/index.ts` (lines 1–10)

```typescript
export * as accumulate from "./accumulate/index.js";
export * from "./externalities/partial-state.js";
export * from "./externalities/pending-transfer.js";
export * from "./externalities/refine-externalities.js";
export * from "./externalities/state-update.js";
export * as general from "./general/index.js";
export { codecServiceAccountInfoWithThresholdBalance as hostCallInfoAccount } from "./general/info.js";
export * from "./general/results.js";
export * as refine from "./refine/index.js";
export * from "./utils.js";
```
