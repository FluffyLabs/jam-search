---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.ts#L260-L385
title: packages/jam/jam-host-calls/general/fetch.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 4
content_sha: 9bacab418f1471568283e89e14881ff08c5916050838e64bb88e697bd8c52318
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.ts` (lines 260–385)

```typescript
const IN_OUT_REG = 7;

/**
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/324000324000?v=0.6.7
 */
export class Fetch implements HostCallHandler {
  index = tryAsHostCallIndex(1);
  basicGasCost = tryAsSmallGas(10);
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, 9, 10, 11, 12);

  static new(currentServiceId: ServiceId, fetch: IFetchExternalities) {
    return new Fetch(currentServiceId, fetch);
  }

  private constructor(
    public readonly currentServiceId: ServiceId,
    private readonly fetch: IFetchExternalities,
  ) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<undefined | PvmExecution> {
    const fetchKindU64 = regs.get(10);
    const kind = clampU64ToU32(fetchKindU64);
    const value = this.getValue(kind, regs);
    // o
    const output = regs.get(IN_OUT_REG);

    const valueLength = tryAsU64(value?.length ?? 0);
    // f
    const offset = minU64(regs.get(8), valueLength);
    // l
    const length = minU64(regs.get(9), tryAsU64(valueLength - offset));

    // NOTE: casting to `Number` is safe in both places, since we are always bounded
    // by the actual length of the value returned which is smaller than `2*32`.
    const chunk = value === null ? new Uint8Array() : value.raw.subarray(Number(offset), Number(offset + length));
    const storeResult = memory.storeFrom(output, chunk);
    if (storeResult.isError) {
      logger.trace`[${this.currentServiceId}] FETCH(${kind}) <- PANIC`;
      return PvmExecution.Panic;
    }

    logger.trace`[${this.currentServiceId}] FETCH(${kind}) <- ${value?.toStringTruncated()}`;
    logger.insane`[${this.currentServiceId}] FETCH(${kind}) <- ${value}`;

    // write result
    regs.set(IN_OUT_REG, value === null ? HostCallResult.NONE : valueLength);
  }

  private getValue(kind: U32, regs: HostCallRegisters): BytesBlob | null {
    const ext = this.fetch;

    // Kind 0: constants - all contexts
    if (kind === FetchKind.Constants) {
      return ext.constants();
    }

    // Kind 1: entropy - Refine, Accumulate
    if (kind === FetchKind.Entropy) {
      if (ext.context === FetchContext.IsAuthorized) {
        return null;
      }
      return ext.entropy();
    }

    // Kind 2: authorizer trace - Refine only
    if (kind === FetchKind.AuthorizerTrace) {
      if (ext.context !== FetchContext.Refine) {
        return null;
      }
      return ext.authorizerTrace();
    }

    // Kind 3: other work item extrinsics - Refine only
    if (kind === FetchKind.OtherWorkItemExtrinsics) {
      if (ext.context !== FetchContext.Refine) {
        return null;
      }
      const workItem = regs.get(11);
      const index = regs.get(12);
      return ext.workItemExtrinsic(workItem, index);
    }

    // Kind 4: my extrinsics - Refine only
    if (kind === FetchKind.MyExtrinsics) {
      if (ext.context !== FetchContext.Refine) {
        return null;
      }
      const index = regs.get(11);
      return ext.workItemExtrinsic(null, index);
    }

    // Kind 5: other work item imports - Refine only
    if (kind === FetchKind.OtherWorkItemImports) {
      if (ext.context !== FetchContext.Refine) {
        return null;
      }
      const workItem = regs.get(11);
      const index = regs.get(12);
      return ext.workItemImport(workItem, index);
    }

    // Kind 6: my imports - Refine only
    if (kind === FetchKind.MyImports) {
      if (ext.context !== FetchContext.Refine) {
        return null;
      }
      const index = regs.get(11);
      return ext.workItemImport(null, index);
    }

    // Kind 7: work package - IsAuthorized, Refine
    if (kind === FetchKind.WorkPackage) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      return ext.workPackage();
    }

    // Kind 8: auth configuration - IsAuthorized, Refine
    if (kind === FetchKind.AuthConfiguration) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      return ext.authConfiguration();
    }

```
