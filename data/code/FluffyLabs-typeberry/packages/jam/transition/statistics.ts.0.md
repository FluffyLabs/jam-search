---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.ts#L1-L124
title: packages/jam/transition/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 4
content_sha: da4e154fa5203aaf1eb1b150c10e05207e1ccbe9f5769f8d5ffaf76520fc1fcb
language: typescript
---
`packages/jam/transition/statistics.ts` (lines 1–124)

```typescript
import {
  type Extrinsic,
  type ServiceGas,
  type ServiceId,
  type TimeSlot,
  tryAsCoreIndex,
  tryAsPerValidator,
  tryAsServiceGas,
  type ValidatorIndex,
} from "@typeberry/block";
import type { Preimage, PreimagesExtrinsic } from "@typeberry/block/preimage.js";
import type { WorkReport } from "@typeberry/block/work-report.js";
import type { WorkResult } from "@typeberry/block/work-result.js";
import { type ChainSpec, EC_SEGMENT_SIZE } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import { tryAsU16, tryAsU32, type U32 } from "@typeberry/numbers";
import { ServiceStatistics, type State, StatisticsData, ValidatorStatistics } from "@typeberry/state";
import { check } from "@typeberry/utils";

export type Input = {
  slot: TimeSlot;
  authorIndex: ValidatorIndex;
  extrinsic: Extrinsic;
  /**
   * `w`: Set of work reports in present extrinsic
   *
   * https://graypaper.fluffylabs.dev/#/cc517d7/156c01156c01?v=0.6.5
   */
  incomingReports: WorkReport[];
  /**
   * `W`: Sequence of newly available work-reports
   *
   * https://graypaper.fluffylabs.dev/#/cc517d7/145d01145d01?v=0.6.5
   */
  availableReports: WorkReport[];
  /**
   * `I`: Accumulation statistics
   * TODO [MaSo] Use fields from accumulation.
   *
   * https://graypaper.fluffylabs.dev/#/cc517d7/171f05171f05?v=0.6.5
   */
  accumulationStatistics: Map<ServiceId, CountAndGasUsed>;
  reporters: readonly Ed25519Key[];
  currentValidatorData: State["currentValidatorData"];
};

export type CountAndGasUsed = {
  count: U32;
  gasUsed: ServiceGas;
};

/** https://graypaper.fluffylabs.dev/#/68eaa1f/18f60118f601?v=0.6.4 */
export type StatisticsState = Pick<State, "timeslot" | "statistics"> & {
  /**
   * `κ' kappa_prime`: Posterior active validators
   *
   * https://graypaper.fluffylabs.dev/#/68eaa1f/187103187103?v=0.6.4
   */
  readonly currentValidatorData: State["currentValidatorData"];
};

/** Update to the statistics state. */
export type StatisticsStateUpdate = Pick<StatisticsState, "statistics">;

export class Statistics {
  constructor(
    private readonly chainSpec: ChainSpec,
    public readonly state: StatisticsState,
  ) {}

  private getStatistics(slot: TimeSlot): StatisticsData {
    /** https://graypaper.fluffylabs.dev/#/68eaa1f/186402186402?v=0.6.4 */
    const currentEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    const nextEpoch = Math.floor(slot / this.chainSpec.epochLength);

    /** e === e' */
    if (currentEpoch === nextEpoch) {
      return this.state.statistics;
    }

    /** e !== e' */
    const emptyValidators = tryAsPerValidator(
      Array.from({ length: this.chainSpec.validatorsCount }, () => {
        return ValidatorStatistics.empty();
      }),
      this.chainSpec,
    );

    return StatisticsData.create({
      ...this.state.statistics,
      current: emptyValidators,
      previous: this.state.statistics.current,
    });
  }

  /** https://graypaper.fluffylabs.dev/#/68eaa1f/195601195601?v=0.6.4 */
  private calculateDAScoreCore(availableWorkReports: WorkReport | undefined) {
    if (availableWorkReports === undefined) {
      return tryAsU32(0);
    }

    let sum = 0;

    const workPackageLength = availableWorkReports.workPackageSpec.length;
    const workPackageSegment = Math.ceil((availableWorkReports.workPackageSpec.exportsCount * 65) / 64);
    sum += workPackageLength + EC_SEGMENT_SIZE * workPackageSegment;

    /** Available work report score can be up to `W_R + W_G * ((W_M * 65) / 64) = 0x00C4_2180` */
    return tryAsU32(sum);
  }

  /** https://graypaper.fluffylabs.dev/#/68eaa1f/191103191103?v=0.6.4 */
  private calculateRefineScore(workResults: WorkResult[]) {
    const score = {
      gasUsed: 0n,
      imported: 0,
      extrinsicCount: 0,
      extrinsicSize: 0,
      exported: 0,
    };

    /** Maximal number of work results is I=16 */
    for (const workResult of workResults) {
      score.gasUsed += workResult.load.gasUsed;
```
