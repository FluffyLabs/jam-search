---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L1-L111
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 7
content_sha: cb9b68a5caf0454cdf004517ca96f903c65fdc79ce06e4cecfa18096e5bfb4a2
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 1–111)

```typescript
import {
  type EntropyHash,
  type ServiceGas,
  type ServiceId,
  type TimeSlot,
  tryAsPerEpochBlock,
  tryAsServiceGas,
} from "@typeberry/block";
import { W_C } from "@typeberry/block/gp-constants.js";
import type { WorkReport } from "@typeberry/block/work-report.js";
import { Bytes } from "@typeberry/bytes";
import { codec, Encoder } from "@typeberry/codec";
import { ArrayView, HashSet, SortedArray } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { EcalliTraceLogger, PvmExecutor, ReturnStatus } from "@typeberry/executor";
import { type Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import type { PendingTransfer } from "@typeberry/jam-host-calls";
import {
  AccumulationStateUpdate,
  PartiallyUpdatedState,
} from "@typeberry/jam-host-calls/externalities/state-update.js";
import { Logger } from "@typeberry/logger";
import { MAX_VALUE_U64, sumU64, tryAsU32, type U32 } from "@typeberry/numbers";
import {
  type AccumulationOutput,
  accumulationOutputComparator,
  hashComparator,
  type NotYetAccumulatedReport,
  ServiceAccountInfo,
  type ServicesUpdate,
  tryAsPerCore,
} from "@typeberry/state";
import { assertEmpty, Compatibility, GpVersion, Result, TestSuite } from "@typeberry/utils";
import { AccumulateExternalities } from "../externalities/accumulate-externalities.js";
import { AccumulateFetchExternalities } from "../externalities/accumulate-fetch-externalities.js";
import type { CountAndGasUsed } from "../statistics.js";
import { AccumulateData } from "./accumulate-data.js";
import { AccumulateQueue, pruneQueue } from "./accumulate-queue.js";
import {
  type AccumulateInput,
  type AccumulateResult,
  type AccumulateState,
  type AccumulateStateUpdate,
  GAS_TO_INVOKE_WORK_REPORT,
} from "./accumulate-state.js";
import { generateNextServiceId, getWorkPackageHashes } from "./accumulate-utils.js";
import {
  mergePerallelAccumulationResults,
  type ParallelAccumulationResult,
} from "./accumulation-result-merge-utils.js";
import type { Operand } from "./operand.js";
import type { AccumulateOptions } from "./options.js";

export const ACCUMULATION_ERROR = "duplicate service created";
export type ACCUMULATION_ERROR = typeof ACCUMULATION_ERROR;

type InvocationResult = {
  stateUpdate: AccumulationStateUpdate;
  consumedGas: ServiceGas;
};

type SequentialAccumulationResult = {
  accumulatedReports: U32;
  state: AccumulationStateUpdate;
  gasCost: ServiceGas;
};

enum PvmInvocationError {
  NoService = 0,
  NoPreimage = 1,
  PreimageTooLong = 2,
}

const logger = Logger.new(import.meta.filename, "accumulate");

const ARGS_CODEC = codec.object({
  slot: codec.varU32.asOpaque<TimeSlot>(),
  serviceId: codec.varU32.asOpaque<ServiceId>(),
  argsLength: codec.varU32,
});

export class Accumulate {
  public readonly options: AccumulateOptions;

  constructor(
    public readonly chainSpec: ChainSpec,
    public readonly blake2b: Blake2b,
    public readonly state: AccumulateState,
    options: AccumulateOptions,
  ) {
    const ecalliTraceEnabled = EcalliTraceLogger.isTraceEnabled();
    const accumulateSequentially = options.accumulateSequentially === true || ecalliTraceEnabled;
    this.options = { ...options, accumulateSequentially };

    if (ecalliTraceEnabled && options.accumulateSequentially !== true) {
      logger.warn`⚠️ ecalli trace logging is enabled: forcing sequential accumulation to keep the trace output ordered.`;
    } else if (accumulateSequentially) {
      logger.warn`⚠️ Parallel accumulation is disabled. Running in sequential mode.`;
    }
  }

  /**
   * Returns an index that determines how many WorkReports can be processed before exceeding a given gasLimit.
   *
   * https://graypaper.fluffylabs.dev/#/7e6ff6a/170a01170a01?v=0.6.7
   */
  private findReportCutoffIndex(gasLimit: ServiceGas, reports: ArrayView<WorkReport>) {
    const reportsLength = reports.length;
    let currentGas = 0n;

    for (let i = 0; i < reportsLength; i++) {
```
