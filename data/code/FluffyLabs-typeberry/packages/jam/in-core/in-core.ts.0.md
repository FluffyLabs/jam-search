---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/in-core.ts#L1-L99
title: packages/jam/in-core/in-core.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 1170cac0912a4bd553194b4f8cf68d72188fce25906708cb06fa35f21e8d2ad5
language: typescript
---
`packages/jam/in-core/in-core.ts` (lines 1–99)

```typescript
import type { CoreIndex, Segment } from "@typeberry/block";
import { type RefineContext, type WorkPackageHash, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import type { WorkItemExtrinsic } from "@typeberry/block/work-item.js";
import type { WorkPackage } from "@typeberry/block/work-package.js";
import { WorkPackageSpec, WorkReport } from "@typeberry/block/work-report.js";
import { Bytes } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray } from "@typeberry/collections";
import type { ChainSpec, PvmBackend } from "@typeberry/config";
import type { StatesDb } from "@typeberry/database";
import type { Blake2b, WithHash } from "@typeberry/hash";
import { HASH_SIZE } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { tryAsU8, tryAsU16, tryAsU32 } from "@typeberry/numbers";
import { buildWorkPackageFetchData } from "@typeberry/transition/externalities/fetch-externalities.js";
import { assertEmpty, Result } from "@typeberry/utils";
import type { ImportedSegment, PerWorkItem } from "./externalities/index.js";
import { AuthorizationError, type AuthorizationOk, IsAuthorized } from "./is-authorized.js";
export type { ImportedSegment, PerWorkItem };

import { Refine, type RefineItemResult } from "./refine.js";

export type RefineResult = {
  report: WorkReport;
  exports: PerWorkItem<Segment[]>;
};

export enum RefineError {
  /** State for context anchor block or lookup anchor is not found in the DB. */
  StateMissing = 0,
  /** Posterior state root of context anchor block does not match the one in the DB. */
  StateRootMismatch = 1,
  /** Lookup anchor state-slot does not match the one given in context. */
  InvalidLookupAnchorSlot = 2,
  /** Authorization error. */
  AuthorizationError = 3,
}

const logger = Logger.new(import.meta.filename, "refine");

export class InCore {
  private readonly isAuthorized: IsAuthorized;
  private readonly refineItem: Refine;

  static new(chainSpec: ChainSpec, states: StatesDb, pvmBackend: PvmBackend, blake2b: Blake2b) {
    return new InCore(chainSpec, states, pvmBackend, blake2b);
  }

  private constructor(
    public readonly chainSpec: ChainSpec,
    private readonly states: StatesDb,
    pvmBackend: PvmBackend,
    blake2b: Blake2b,
  ) {
    this.isAuthorized = new IsAuthorized(chainSpec, pvmBackend, blake2b);
    this.refineItem = new Refine(chainSpec, pvmBackend, blake2b);
  }

  /**
   * Work-report computation function.
   *
   * Note this requires all of the imports and extrinsics to be already fetched
   * and only performs the refinement.
   *
   * Any validation must be done externally!
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/1b7f021b7f02?v=0.7.2
   */
  async refine(
    workPackageAndHash: WithHash<WorkPackageHash, WorkPackage>,
    core: CoreIndex,
    imports: PerWorkItem<ImportedSegment[]>,
    extrinsics: PerWorkItem<WorkItemExtrinsic[]>,
  ): Promise<Result<RefineResult, RefineError>> {
    const workPackageHash = workPackageAndHash.hash;
    const { context, items } = workPackageAndHash.data;

    // TODO [ToDr] Verify BEEFY root
    // TODO [ToDr] Verify prerequisites
    logger.log`[core:${core}] Attempting to refine work package with ${items.length} items.`;

    // Verify anchor block
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/15cd0215cd02?v=0.7.2
    // TODO [ToDr] Validation
    const state = this.states.getState(context.anchor);
    if (state === null) {
      return Result.error(RefineError.StateMissing, () => `State at anchor block ${context.anchor} is missing.`);
    }

    const stateRoot = await this.states.getStateRoot(state);
    if (!stateRoot.isEqualTo(context.stateRoot)) {
      return Result.error(
        RefineError.StateRootMismatch,
        () =>
          `State at ${context.anchor} does not match expected root hash. Ours: ${stateRoot}, expected: ${context.stateRoot}`,
      );
    }

    // TODO [ToDr] GP link
    // Verify lookup anchor state
```
