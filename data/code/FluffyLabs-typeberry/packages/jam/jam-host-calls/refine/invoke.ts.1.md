---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/invoke.ts#L99-L124
title: packages/jam/jam-host-calls/refine/invoke.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 19571d2a0d951ffafc34473946c99fcc3468727c9f98dad66f037fed688d5e5a
language: typescript
---
`packages/jam/jam-host-calls/refine/invoke.ts` (lines 99–124)

```typescript
    const storeResult = memory.storeFrom(destinationStart, resultData.raw);
    check`${storeResult.isOk} Memory writeability has been checked already.`;

    const returnState = machineState.result;

    if (returnState.status === Status.HOST) {
      regs.set(IN_OUT_REG_1, tryAsU64(returnState.status));
      regs.set(IN_OUT_REG_2, returnState.hostCallIndex);
      return;
    }

    if (returnState.status === Status.FAULT) {
      regs.set(IN_OUT_REG_1, tryAsU64(returnState.status));
      regs.set(IN_OUT_REG_2, returnState.address);
      return;
    }

    if ([Status.PANIC, Status.HALT, Status.OOG].includes(returnState.status)) {
      regs.set(IN_OUT_REG_1, tryAsU64(returnState.status));
      return;
    }

    const statusName = Status[returnState.status] !== undefined ? Status[returnState.status] : "Unknown";
    throw new Error(`Unexpected inner PVM result: ${returnState.status} (${statusName})`);
  }
}
```
