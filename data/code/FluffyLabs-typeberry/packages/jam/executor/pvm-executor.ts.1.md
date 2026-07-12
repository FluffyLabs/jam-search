---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/executor/pvm-executor.ts#L117-L214
title: packages/jam/executor/pvm-executor.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 67cd769cdf0df55ece99caa0ca3ec0e3c29d91e9ee642d88085518b2c9103c1d
language: typescript
---
`packages/jam/executor/pvm-executor.ts` (lines 117–214)

```typescript
  /** Prepare accumulation host call handlers */
  private static prepareAccumulateHostCalls(
    serviceId: ServiceId,
    externalities: AccumulateHostCallExternalities,
    chainSpec: ChainSpec,
  ) {
    const accumulateHandlers: HostCallHandler[] = ACCUMULATE_HOST_CALL_CLASSES.map((HandlerClass) =>
      HandlerClass.new(serviceId, externalities.partialState, chainSpec),
    );

    /** https://graypaper.fluffylabs.dev/#/ab2cdbd/30d00130d001?v=0.7.2 */
    const generalHandlers: HostCallHandler[] = [
      general.LogHostCall.new(serviceId),
      general.GasHostCall.new(serviceId),
      general.Read.new(serviceId, externalities.serviceExternalities),
      general.Write.new(serviceId, externalities.serviceExternalities),
      general.Fetch.new(serviceId, externalities.fetchExternalities),
      general.Lookup.new(serviceId, externalities.serviceExternalities),
      general.Info.new(serviceId, externalities.serviceExternalities),
    ];

    return accumulateHandlers.concat(generalHandlers);
  }

  /** Prepare is-authorized host call handlers */
  private static prepareIsAuthorizedHostCalls(serviceId: ServiceId, externalities: IsAuthorizedHostCallExternalities) {
    const generalHandlers: HostCallHandler[] = [
      general.LogHostCall.new(serviceId),
      general.GasHostCall.new(serviceId),
      general.Fetch.new(serviceId, externalities.fetchExternalities),
    ];

    return generalHandlers;
  }

  /** Prepare on transfer host call handlers */
  private static prepareOnTransferHostCalls(serviceId: ServiceId, externalities: OnTransferHostCallExternalities) {
    const generalHandlers: HostCallHandler[] = [
      general.LogHostCall.new(serviceId),
      general.GasHostCall.new(serviceId),
      general.Fetch.new(serviceId, externalities.fetchExternalities),
      general.Read.new(serviceId, externalities.partialState),
      general.Write.new(serviceId, externalities.partialState),
      general.Lookup.new(serviceId, externalities.partialState),
      general.Info.new(serviceId, externalities.partialState),
    ];

    return generalHandlers;
  }
  /**
   * Execute provided program
   *
   * @param args additional arguments that will be placed in PVM memory before execution
   * @param gas gas limit
   * @returns `ReturnValue` object containing consumed gas, status and an optional memory slice
   */
  async run(args: BytesBlob, gas: ServiceGas) {
    const ret = await this.pvm.runProgram(this.serviceCode.raw, args.raw, Number(this.entrypoint), tryAsGas(gas));
    return {
      ...ret,
      consumedGas: tryAsServiceGas(ret.consumedGas),
    };
  }

  /** A utility function that can be used to prepare refine executor */
  static async createRefineExecutor(
    serviceId: ServiceId,
    serviceCode: BytesBlob,
    externalities: RefineHostCallExternalities,
    pvm: PvmBackend,
  ) {
    const hostCallHandlers = PvmExecutor.prepareRefineHostCalls(serviceId, externalities);
    const instances = await PvmExecutor.prepareBackend(pvm);
    return new PvmExecutor(serviceCode, hostCallHandlers, entrypoint.REFINE, instances);
  }

  /** A utility function that can be used to prepare is-authorized executor */
  static async createIsAuthorizedExecutor(
    serviceId: ServiceId,
    serviceCode: BytesBlob,
    externalities: IsAuthorizedHostCallExternalities,
    pvm: PvmBackend,
  ) {
    const hostCallHandlers = PvmExecutor.prepareIsAuthorizedHostCalls(serviceId, externalities);
    const instances = await PvmExecutor.prepareBackend(pvm);
    return new PvmExecutor(serviceCode, hostCallHandlers, entrypoint.IS_AUTHORIZED, instances);
  }

  /** A utility function that can be used to prepare accumulate executor */
  static async createAccumulateExecutor(
    serviceId: ServiceId,
    serviceCode: BytesBlob,
    externalities: AccumulateHostCallExternalities,
    chainSpec: ChainSpec,
    pvm: PvmBackend,
  ) {
    const hostCallHandlers = PvmExecutor.prepareAccumulateHostCalls(serviceId, externalities, chainSpec);

```
