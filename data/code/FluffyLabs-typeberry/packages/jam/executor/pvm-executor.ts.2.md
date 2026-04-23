---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/executor/pvm-executor.ts#L209-L230
title: packages/jam/executor/pvm-executor.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: bde835b527c569e368a62c6aca593ee9b1b199376f57219369fd5edda5a76d2d
language: typescript
---
`packages/jam/executor/pvm-executor.ts` (lines 209–230)

```typescript
    externalities: AccumulateHostCallExternalities,
    chainSpec: ChainSpec,
    pvm: PvmBackend,
  ) {
    const hostCallHandlers = PvmExecutor.prepareAccumulateHostCalls(serviceId, externalities, chainSpec);

    const instances = await PvmExecutor.prepareBackend(pvm);
    return new PvmExecutor(serviceCode, hostCallHandlers, entrypoint.ACCUMULATE, instances);
  }

  /** A utility function that can be used to prepare on transfer executor */
  static async createOnTransferExecutor(
    serviceId: ServiceId,
    serviceCode: BytesBlob,
    externalities: OnTransferHostCallExternalities,
    pvm: PvmBackend,
  ) {
    const hostCallHandlers = PvmExecutor.prepareOnTransferHostCalls(serviceId, externalities);
    const instances = await PvmExecutor.prepareBackend(pvm);
    return new PvmExecutor(serviceCode, hostCallHandlers, entrypoint.ON_TRANSFER, instances);
  }
}
```
