---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/executor/pvm-executor.ts#L1-L122
title: packages/jam/executor/pvm-executor.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 3
content_sha: 50495c28d512a28419f45557b1d64a19d742b15ef31c7f39fe41504c22ac835b
language: typescript
---
`packages/jam/executor/pvm-executor.ts` (lines 1–122)

```typescript
import { type ServiceGas, type ServiceId, tryAsServiceGas } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import type { ChainSpec, PvmBackend } from "@typeberry/config";
import { accumulate, general, refine } from "@typeberry/jam-host-calls";
import type { PartialState } from "@typeberry/jam-host-calls/externalities/partial-state.js";
import {
  type ProgramCounter,
  type RefineExternalities,
  tryAsProgramCounter,
} from "@typeberry/jam-host-calls/externalities/refine-externalities.js";
import { type HostCallHandler, HostCalls, HostCallsExecutor, PvmInstanceManager } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";

/**
 * Refine-specific host calls with common constructor.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/2fa7022fa702?v=0.7.2
 */
const REFINE_HOST_CALL_CLASSES = [
  refine.HistoricalLookup,
  refine.Export,
  refine.Machine,
  refine.Peek,
  refine.Poke,
  refine.Pages,
  refine.Invoke,
  refine.Expunge,
];

/**
 * Accumulate-specific host calls with common constructor.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/30d00130d001?v=0.7.2
 */
const ACCUMULATE_HOST_CALL_CLASSES = [
  accumulate.Bless,
  accumulate.Assign,
  accumulate.Designate,
  accumulate.Checkpoint,
  accumulate.New,
  accumulate.Upgrade,
  accumulate.Transfer,
  accumulate.Eject,
  accumulate.Query,
  accumulate.Solicit,
  accumulate.Forget,
  accumulate.Yield,
  accumulate.Provide,
];

export type RefineHostCallExternalities = {
  refine: RefineExternalities;
  fetchExternalities: general.IRefineFetch;
};

export type AccumulateHostCallExternalities = {
  partialState: PartialState;
  fetchExternalities: general.IAccumulateFetch;
  serviceExternalities: general.AccountsInfo & general.AccountsLookup & general.AccountsWrite & general.AccountsRead;
};

export type IsAuthorizedHostCallExternalities = {
  fetchExternalities: general.IIsAuthorizedFetch;
};

type OnTransferHostCallExternalities = {
  partialState: general.AccountsInfo & general.AccountsLookup & general.AccountsWrite & general.AccountsRead;
  fetchExternalities: general.IFetchExternalities;
};

namespace entrypoint {
  export const IS_AUTHORIZED = tryAsProgramCounter(0);
  export const REFINE = tryAsProgramCounter(0);
  export const ACCUMULATE = tryAsProgramCounter(5);
  /** @deprecated since 0.7.1 */
  export const ON_TRANSFER = tryAsProgramCounter(10);
}

/**
 * PVM exectutor class that prepares PVM together with host call handlers to be run in requested context
 */
export class PvmExecutor {
  private readonly pvm: HostCallsExecutor;
  private hostCalls: HostCalls;

  private constructor(
    private serviceCode: BytesBlob,
    hostCallHandlers: HostCallHandler[],
    private entrypoint: ProgramCounter,
    pvmInstanceManager: PvmInstanceManager,
  ) {
    this.hostCalls = HostCalls.new({
      missing: new general.Missing(),
      handlers: hostCallHandlers,
    });
    this.pvm = HostCallsExecutor.new(pvmInstanceManager, this.hostCalls);
  }

  private static async prepareBackend(pvm: PvmBackend) {
    return PvmInstanceManager.new(pvm);
  }

  /** Prepare refine host call handlers */
  private static prepareRefineHostCalls(serviceId: ServiceId, externalities: RefineHostCallExternalities) {
    const refineHandlers: HostCallHandler[] = REFINE_HOST_CALL_CLASSES.map((HandlerClass) =>
      HandlerClass.new(externalities.refine),
    );

    /** https://graypaper.fluffylabs.dev/#/ab2cdbd/2fa7022fa702?v=0.7.2 */
    const generalHandlers: HostCallHandler[] = [
      general.LogHostCall.new(serviceId),
      general.GasHostCall.new(serviceId),
      general.Fetch.new(serviceId, externalities.fetchExternalities),
    ];

    return refineHandlers.concat(generalHandlers);
  }

  /** Prepare accumulation host call handlers */
  private static prepareAccumulateHostCalls(
    serviceId: ServiceId,
    externalities: AccumulateHostCallExternalities,
    chainSpec: ChainSpec,
  ) {
```
