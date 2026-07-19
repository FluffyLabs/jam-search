---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/accumulate/index.ts#L1-L36
title: sdk-ecalli-mocks/src/accumulate/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 61c7ff9c9d57bf321eb7393e8dbc84f1e3dd82a53bbd3b5abdc6f51983c4afa8
language: typescript
---
`sdk-ecalli-mocks/src/accumulate/index.ts` (lines 1–36)

```typescript
// Accumulate ecalli mock stubs (14-26).

export {
  bless, assign, designate,
  setBlessResult, setAssignResult, setDesignateResult,
  getLastBlessManager, getLastBlessAssignersPtr, getLastBlessDelegator,
  getLastBlessRegistrar, getLastBlessAutoAccumPtr, getLastBlessAutoAccumCount,
  getLastAssignCore, getLastAssignAuthQueuePtr, getLastAssignNewAssigner,
  getLastDesignateValidatorsPtr,
  resetPrivileged,
} from "./privileged.js";
export { checkpoint } from "./checkpoint.js";
export {
  new_service, upgrade, eject,
  setNewServiceResult, setEjectResult,
  getLastUpgradeCodeHashPtr, getLastUpgradeGas, getLastUpgradeAllowance,
  resetServices,
} from "./services.js";
export { transfer, setTransferResult, resetTransfer } from "./transfer.js";
export {
  query, solicit, forget, yield_result, provide,
  setQueryResult, setSolicitResult, setForgetResult, setProvideResult, resetPreimages,
  getSolicitCount, getForgetCount, getProvideCount, resetPreimageCounters,
} from "./preimages.js";

import { resetPrivileged } from "./privileged.js";
import { resetServices } from "./services.js";
import { resetTransfer } from "./transfer.js";
import { resetPreimages } from "./preimages.js";

export function resetAccumulate(): void {
  resetPrivileged();
  resetServices();
  resetTransfer();
  resetPreimages();
}
```
