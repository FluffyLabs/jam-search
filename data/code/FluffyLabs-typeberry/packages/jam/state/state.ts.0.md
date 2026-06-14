---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/state.ts#L1-L102
title: packages/jam/state/state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: ca4fc5d3daf1ea41c2d43a3e8b2b2bc15cbb83ecc3dc5315b35c4675e317c1ee
language: typescript
---
`packages/jam/state/state.ts` (lines 1–102)

```typescript
import type { EntropyHash, PerValidator, ServiceId, TimeSlot } from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { BytesBlob } from "@typeberry/bytes";
import type { FixedSizeArray, SortedArray } from "@typeberry/collections";
import type { U32 } from "@typeberry/numbers";
import type { AccumulationOutput } from "./accumulation-output.js";
import type { AccumulationQueue } from "./accumulation-queue.js";
import type { AvailabilityAssignment } from "./assurances.js";
import type { AuthorizationPool, AuthorizationQueue } from "./auth.js";
import type { PerCore } from "./common.js";
import type { DisputesRecords } from "./disputes.js";
import type { PrivilegedServices } from "./privileged-services.js";
import type { RecentBlocks } from "./recent-blocks.js";
import type { RecentlyAccumulated } from "./recently-accumulated.js";
import type { SafroleData } from "./safrole-data.js";
import type { LookupHistorySlots, ServiceAccountInfo, StorageKey } from "./service.js";
import type { StatisticsData } from "./statistics.js";
import type { ValidatorData } from "./validator-data.js";

/**
 * In addition to the entropy accumulator η_0, we retain
 * three additional historical values of the accumulator at
 * the point of each of the three most recently ended epochs,
 * η_1, η_2 and η_3. The second-oldest of these η2 is utilized to
 * help ensure future entropy is unbiased (see equation 6.29)
 * and seed the fallback seal-key generation function with
 * randomness (see equation 6.24). The oldest is used to re-
 * generate this randomness when verifying the seal above
 * (see equations 6.16 and 6.15).
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/0ef5010ef501
 */
export const ENTROPY_ENTRIES = 4;
export type ENTROPY_ENTRIES = typeof ENTROPY_ENTRIES;

/** State with some entries being possible to enumerate. */
export type EnumerableState = {
  /**
   * Returns recently active `ServiceId`s.
   *
   * NOTE we don't define exactly what 'recent' means on purpose.
   * This method only exists to satisfy requirements of RPC services method.
   */
  recentServiceIds(): readonly ServiceId[];
};

/**
 * Complete state tuple with all entries.
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/08f10008f100
 */
export type State = {
  /**

   * `ρ rho`: work-reports which have been reported but are not yet known to be
   *          available to a super-majority of validators, together with the time
   *          at which each was reported.
   *
   *  https://graypaper.fluffylabs.dev/#/579bd12/135800135800
   */
  readonly availabilityAssignment: PerCore<AvailabilityAssignment | null>;

  /**
   * `ι iota`: The validator keys and metadata to be drawn from next.
   */
  readonly designatedValidatorData: PerValidator<ValidatorData>;

  /**
   * `γₖ gamma_k`: The keys for the validators of the next epoch, equivalent to those keys which constitute γ_z .
   */
  readonly nextValidatorData: PerValidator<ValidatorData>;

  /**
   * `κ kappa`: Validators, who are the set of economic actors uniquely
   *            privileged to help build and maintain the Jam chain, are
   *            identified within κ, archived in λ and enqueued from ι.
   *
   *  https://graypaper.fluffylabs.dev/#/579bd12/080201080601
   */
  readonly currentValidatorData: PerValidator<ValidatorData>;

  /**
   * `λ lambda`: Validators, who are the set of economic actors uniquely
   *             privileged to help build and maintain the Jam chain, are
   *             identified within κ, archived in λ and enqueued from ι.
   *
   *  https://graypaper.fluffylabs.dev/#/579bd12/080201080601
   */
  readonly previousValidatorData: PerValidator<ValidatorData>;

  /**
   * `ψ psi`: Judgements
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/091900091900
   */
  readonly disputesRecords: DisputesRecords;

  /**
   * `τ tau`: The current time slot.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/186401186401
   */
```
