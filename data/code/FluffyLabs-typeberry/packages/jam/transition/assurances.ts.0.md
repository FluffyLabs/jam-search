---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/assurances.ts#L1-L108
title: packages/jam/transition/assurances.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: 8fef5e3282fc3752bf3a94ff1cc4b1346bf7389324858d17205a4a7a74f31d4c
language: typescript
---
`packages/jam/transition/assurances.ts` (lines 1–108)

```typescript
import type { HeaderHash, TimeSlot } from "@typeberry/block";
import type { AssurancesExtrinsicView } from "@typeberry/block/assurances.js";
import type { WorkReport } from "@typeberry/block/work-report.js";
import { BytesBlob } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { ed25519 } from "@typeberry/crypto";
import type { DisputesStateUpdate } from "@typeberry/disputes";
import type { Blake2b } from "@typeberry/hash";
import type { State } from "@typeberry/state";
import { check, OK, Result } from "@typeberry/utils";

/** Assurances transition input. */
export type AssurancesInput = {
  /** A view of assurances extrinsic. */
  assurances: AssurancesExtrinsicView;
  /** Current header time slot. */
  slot: TimeSlot;
  /** Parent hash that all assurances need to be anchored at. */
  parentHash: HeaderHash;
  /**
   * ρ† - Availability assignment resulting from disputes transition:
   * https://graypaper.fluffylabs.dev/#/1c979cb/136900139e00?v=0.7.1
   */
  disputesAvailAssignment: DisputesStateUpdate["availabilityAssignment"];
};

/** State of the assurances. */
export type AssurancesState = Pick<State, "availabilityAssignment" | "currentValidatorData">;

/** State update of the assurances. */
export type AssurancesStateUpdate = Pick<AssurancesState, "availabilityAssignment">;

/** Possible error during assurances transition. */
export enum AssurancesError {
  /** Assurances must all be anchored in `parentHash`. */
  InvalidAnchor = 0,
  /** Assurances must be ordered by `validatorIndex`. */
  InvalidOrder = 1,
  /** One of the signatures is invalid. */
  InvalidSignature = 2,
  /** There is no report pending availability on a core which validator indicated assurance. */
  NoReportPending = 3,
  /** Unknown validator index. */
  InvalidValidatorIndex = 4,
}

/**
 * `U`: The period in timeslots after which reported but unavailable work may be replaced.
 *
 * https://graypaper.fluffylabs.dev/#/4bb8fd2/418300418500
 */
export const REPORT_TIMEOUT_GRACE_PERIOD = 5;

/** Performs the transition of assurances state given some input. */
export class Assurances {
  constructor(
    public readonly chainSpec: ChainSpec,
    public readonly state: AssurancesState,
    public readonly blake2b: Blake2b,
  ) {}

  async transition(input: AssurancesInput): Promise<
    Result<
      {
        availableReports: WorkReport[];
        stateUpdate: AssurancesStateUpdate;
      },
      AssurancesError
    >
  > {
    const coresCount = this.chainSpec.coresCount;
    /**
     * The signature must be one whose public key is that of the validator assuring
     * and whose message is the serialization of the parent hash Hp and the
     * aforementioned bitstring.
     * https://graypaper.fluffylabs.dev/#/579bd12/14b40014b600
     */
    const signaturesVerification = this.verifySignatures(input.assurances);

    // materialize the assurances
    const assurances = input.assurances.map((x) => x.materialize());

    // calculate number of assurances for each of the core
    const perCoreAssurances = FixedSizeArray.new(Array(coresCount).fill(0), coresCount);

    /**
     * The assurances must all be anchored on the parent and ordered by validator index.
     * https://graypaper.fluffylabs.dev/#/579bd12/149a00149a00
     */
    let prevValidatorIndex = -1;
    for (const assurance of assurances) {
      const { anchor, validatorIndex, bitfield } = assurance;
      if (!anchor.isEqualTo(input.parentHash)) {
        return Result.error(
          AssurancesError.InvalidAnchor,
          () => `anchor: expected: ${input.parentHash}, got ${anchor}`,
        );
      }

      if (prevValidatorIndex >= validatorIndex) {
        return Result.error(
          AssurancesError.InvalidOrder,
          () => `order: expected: ${prevValidatorIndex + 1}, got: ${validatorIndex}`,
        );
      }
      prevValidatorIndex = assurance.validatorIndex;

```
