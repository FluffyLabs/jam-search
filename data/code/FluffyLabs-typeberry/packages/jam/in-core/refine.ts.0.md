---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/refine.ts#L1-L122
title: packages/jam/in-core/refine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: 52582415f99709f34410cbf488a3454b95a0938f151b8348663ff6b5574bbdd3
language: typescript
---
`packages/jam/in-core/refine.ts` (lines 1–122)

```typescript
import {
  type CoreIndex,
  type Segment,
  type ServiceGas,
  type ServiceId,
  tryAsCoreIndex,
  tryAsServiceGas,
} from "@typeberry/block";
import { W_C } from "@typeberry/block/gp-constants.js";
import type { WorkPackageHash } from "@typeberry/block/refine-context.js";
import type { WorkItem, WorkItemExtrinsic } from "@typeberry/block/work-item.js";
import { WorkExecResult, WorkExecResultKind, WorkRefineLoad, WorkResult } from "@typeberry/block/work-result.js";
import { BytesBlob } from "@typeberry/bytes";
import { codec, Encoder } from "@typeberry/codec";
import type { ChainSpec, PvmBackend } from "@typeberry/config";
import { PvmExecutor, type RefineHostCallExternalities, ReturnStatus, type ReturnValue } from "@typeberry/executor";
import { type Blake2b, HASH_SIZE } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import type { State } from "@typeberry/state";
import type { WorkPackageFetchData } from "@typeberry/transition/externalities/fetch-externalities.js";
import { assertNever, Result } from "@typeberry/utils";
import {
  type ImportedSegment,
  type PerWorkItem,
  RefineExternalitiesImpl,
  RefineFetchExternalities,
} from "./externalities/index.js";

export type RefineItemResult = {
  result: WorkResult;
  exports: readonly Segment[];
};

enum ServiceCodeError {
  /** Service id is not found in the state. */
  ServiceNotFound = 0,
  /** Expected service code does not match the state one. */
  ServiceCodeMismatch = 1,
  /** Code preimage missing. */
  ServiceCodeMissing = 2,
  /** Code blob is too big. */
  ServiceCodeTooBig = 3,
}

/** https://graypaper.fluffylabs.dev/#/ab2cdbd/2ffe002ffe00?v=0.7.2 */
const REFINE_ARGS_CODEC = codec.object({
  core: codec.varU32.convert<CoreIndex>(
    (x) => tryAsU32(x),
    (x) => tryAsCoreIndex(x),
  ),
  workItemIndex: codec.varU32,
  serviceId: codec.varU32.asOpaque<ServiceId>(),
  payloadLength: codec.varU32,
  packageHash: codec.bytes(HASH_SIZE).asOpaque<WorkPackageHash>(),
});

/**
 * Refine PVM invocation (Psi_R).
 *
 * Executes a single work item's refinement logic.
 */
export class Refine {
  constructor(
    private readonly chainSpec: ChainSpec,
    private readonly pvmBackend: PvmBackend,
    private readonly blake2b: Blake2b,
  ) {}

  async invoke(
    state: State,
    lookupState: State,
    packageFetchData: WorkPackageFetchData,
    idx: number,
    item: WorkItem,
    allImports: PerWorkItem<ImportedSegment[]>,
    allExtrinsics: PerWorkItem<WorkItemExtrinsic[]>,
    coreIndex: CoreIndex,
    workPackageHash: WorkPackageHash,
    exportOffset: number,
    authorizerTrace: BytesBlob,
  ): Promise<RefineItemResult> {
    const payloadHash = this.blake2b.hashBytes(item.payload);
    const baseResult = {
      serviceId: item.service,
      codeHash: item.codeHash,
      payloadHash,
      gas: item.refineGasLimit,
    };
    const imports = allImports[idx];
    const extrinsics = allExtrinsics[idx];
    const baseLoad = {
      importedSegments: tryAsU32(imports.length),
      extrinsicCount: tryAsU32(extrinsics.length),
      extrinsicSize: tryAsU32(extrinsics.reduce((acc, x) => acc + x.length, 0)),
    };
    const maybeCode = this.getServiceCode(state, idx, item);

    if (maybeCode.isError) {
      const error =
        maybeCode.error === ServiceCodeError.ServiceCodeTooBig
          ? WorkExecResultKind.codeOversize
          : WorkExecResultKind.badCode;
      return {
        exports: [],
        result: WorkResult.create({
          ...baseResult,
          result: WorkExecResult.error(error),
          load: WorkRefineLoad.create({
            ...baseLoad,
            gasUsed: tryAsServiceGas(item.refineGasLimit),
            exportedSegments: tryAsU32(0),
          }),
        }),
      };
    }

    const code = maybeCode.ok;
    const externalities = this.createRefineExternalities({
      packageFetchData,
      currentWorkItemIndex: idx,
      imports: allImports,
      extrinsics: allExtrinsics,
```
