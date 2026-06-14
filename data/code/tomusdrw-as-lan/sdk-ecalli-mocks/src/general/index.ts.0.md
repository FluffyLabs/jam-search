---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/index.ts#L1-L28
title: sdk-ecalli-mocks/src/general/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: feb8135f16d394897e647869f91a708e2d2ce78f7042f1172e2909f4fc26b351
language: typescript
---
`sdk-ecalli-mocks/src/general/index.ts` (lines 1–28)

```typescript
// General ecalli mock stubs (0-5, 100).

export { gas, setGasValue, resetGas } from "./gas.js";
export {
  fetch, setFetchData, setFetchDataForKind, setAccumulateItems, setAccumulateItem,
  encodeOperand, encodeTransfer, resetFetch,
} from "./fetch.js";
export {
  lookup, setLookupPreimage, setLookupNone, resetLookup,
  setPreimageAttached, clearPreimageAttachments,
} from "./lookup.js";
export { read, write, setStorageEntry, resetStorage } from "./storage.js";
export { info, setInfoData, setDefaultInfoData, resetInfo } from "./info.js";
export { log } from "./log.js";

import { resetGas } from "./gas.js";
import { resetFetch } from "./fetch.js";
import { resetInfo } from "./info.js";
import { resetLookup } from "./lookup.js";
import { resetStorage } from "./storage.js";

export function resetGeneral(): void {
  resetGas();
  resetFetch();
  resetLookup();
  resetStorage();
  resetInfo();
}
```
