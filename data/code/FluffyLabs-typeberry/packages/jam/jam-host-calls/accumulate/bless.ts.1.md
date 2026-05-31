---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/bless.ts#L85-L130
title: packages/jam/jam-host-calls/accumulate/bless.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 900c0bb644da3ad111979ea6d92b191da21eb76a89906c6ca8204a0ed27f23ad
language: typescript
---
`packages/jam/jam-host-calls/accumulate/bless.ts` (lines 85–130)

```typescript
    const res = safeAllocUint8Array(tryAsExactBytes(codec.u32.sizeHint) * this.chainSpec.coresCount);
    const assignersDecoder = Decoder.fromBlob(res);
    const memoryReadResult = memory.loadInto(res, assignersPtr);
    if (memoryReadResult.isError) {
      logger.trace`[${this.currentServiceId}] BLESS(m: ${manager}, v: ${delegator}, r: ${registrar}, ${lazyInspect(autoAccumulate)}) <- PANIC`;
      return PvmExecution.Panic;
    }

    // `a`
    const assigners = tryAsPerCore(
      assignersDecoder.sequenceFixLen(codec.u32.asOpaque<ServiceId>(), this.chainSpec.coresCount),
      this.chainSpec,
    );

    const updateResult = this.partialState.updatePrivilegedServices(
      manager,
      assigners,
      delegator,
      registrar,
      autoAccumulate,
    );

    if (updateResult.isOk) {
      logger.trace`[${this.currentServiceId}] BLESS(m: ${manager}, a: [${assigners}], v: ${delegator}, r: ${registrar}, ${lazyInspect(autoAccumulate)}) <- OK`;
      regs.set(IN_OUT_REG, HostCallResult.OK);
      return;
    }

    const e = updateResult.error;

    // NOTE: `UpdatePrivilegesError.UnprivilegedService` won't happen in 0.7.1+
    if (e === UpdatePrivilegesError.UnprivilegedService) {
      logger.trace`[${this.currentServiceId}] BLESS(m: ${manager}, a: [${assigners}], v: ${delegator}, r: ${registrar}, ${lazyInspect(autoAccumulate)}) <- HUH`;
      regs.set(IN_OUT_REG, HostCallResult.HUH);
      return;
    }

    if (e === UpdatePrivilegesError.InvalidServiceId) {
      logger.trace`[${this.currentServiceId}] BLESS(m: ${manager}, a: [${assigners}], v: ${delegator}, r: ${registrar}, ${lazyInspect(autoAccumulate)}) <- WHO`;
      regs.set(IN_OUT_REG, HostCallResult.WHO);
      return;
    }

    assertNever(e);
  }
}
```
