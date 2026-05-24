---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialize.ts#L1-L106
title: packages/jam/state-merkleization/serialize.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: f7eb3a704674470b0168bcd950c44021809bcf9d2b3d6b7eb814517b34f1e1d8
language: typescript
---
`packages/jam/state-merkleization/serialize.ts` (lines 1–106)

```typescript
import type { EntropyHash, ServiceId, TimeSlot } from "@typeberry/block";
import { codecFixedSizeArray } from "@typeberry/block/codec-utils.js";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { codec, Descriptor } from "@typeberry/codec";
import { SortedArray } from "@typeberry/collections";
import { type Blake2b, HASH_SIZE } from "@typeberry/hash";
import type { U32 } from "@typeberry/numbers";
import {
  accumulationQueueCodec,
  authPoolsCodec,
  authQueuesCodec,
  availabilityAssignmentsCodec,
  codecWithVersion,
  DisputesRecords,
  ENTROPY_ENTRIES,
  PrivilegedServices,
  RecentBlocks,
  type RecentBlocksView,
  ServiceAccountInfo,
  type State,
  StatisticsData,
  type StatisticsDataView,
  type StorageKey,
  validatorsDataCodec,
} from "@typeberry/state";
import { AccumulationOutput, accumulationOutputComparator } from "@typeberry/state/accumulation-output.js";
import { recentlyAccumulatedCodec } from "@typeberry/state/recently-accumulated.js";
import { SafroleData, type SafroleDataView } from "@typeberry/state/safrole-data.js";
import type { StateView } from "@typeberry/state/state-view.js";
import { type StateKey, StateKeyIdx, stateKeys } from "./keys.js";

export type StateCodec<T, V = T> = {
  key: StateKey;
  Codec: Descriptor<T, V>;
  extract: (s: State) => T;
};

/** Serialization for particular state entries. */
export namespace serialize {
  /** C(1): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b15013b1501?v=0.6.7 */
  export const authPools: StateCodec<State["authPools"], ReturnType<StateView["authPoolsView"]>> = {
    key: stateKeys.index(StateKeyIdx.Alpha),
    Codec: authPoolsCodec,
    extract: (s) => s.authPools,
  };

  /** C(2): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b31013b3101?v=0.6.7 */
  export const authQueues: StateCodec<State["authQueues"], ReturnType<StateView["authQueuesView"]>> = {
    key: stateKeys.index(StateKeyIdx.Phi),
    Codec: authQueuesCodec,
    extract: (s) => s.authQueues,
  };

  /**
   * C(3): Recent blocks with compatibility
   *  https://graypaper.fluffylabs.dev/#/7e6ff6a/3b3e013b3e01?v=0.6.7
   */
  export const recentBlocks: StateCodec<RecentBlocks, RecentBlocksView> = {
    key: stateKeys.index(StateKeyIdx.Beta),
    Codec: RecentBlocks.Codec,
    extract: (s) => s.recentBlocks,
  };

  /** C(4): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b63013b6301?v=0.6.7 */
  export const safrole: StateCodec<SafroleData, SafroleDataView> = {
    key: stateKeys.index(StateKeyIdx.Gamma),
    Codec: SafroleData.Codec,
    extract: (s) =>
      SafroleData.create({
        nextValidatorData: s.nextValidatorData,
        epochRoot: s.epochRoot,
        sealingKeySeries: s.sealingKeySeries,
        ticketsAccumulator: s.ticketsAccumulator,
      }),
  };

  /** C(5): https://graypaper.fluffylabs.dev/#/7e6ff6a/3bba013bba01?v=0.6.7 */
  export const disputesRecords: StateCodec<DisputesRecords> = {
    key: stateKeys.index(StateKeyIdx.Psi),
    Codec: DisputesRecords.Codec,
    extract: (s) => s.disputesRecords,
  };

  /** C(6): https://graypaper.fluffylabs.dev/#/7e6ff6a/3bf3013bf301?v=0.6.7 */
  export const entropy: StateCodec<State["entropy"]> = {
    key: stateKeys.index(StateKeyIdx.Eta),
    Codec: codecFixedSizeArray(codec.bytes(HASH_SIZE).asOpaque<EntropyHash>(), ENTROPY_ENTRIES),
    extract: (s) => s.entropy,
  };

  /** C(7): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b00023b0002?v=0.6.7 */
  export const designatedValidators: StateCodec<
    State["designatedValidatorData"],
    ReturnType<StateView["designatedValidatorDataView"]>
  > = {
    key: stateKeys.index(StateKeyIdx.Iota),
    Codec: validatorsDataCodec,
    extract: (s) => s.designatedValidatorData,
  };

  /** C(8): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b0d023b0d02?v=0.6.7 */
  export const currentValidators: StateCodec<
    State["currentValidatorData"],
    ReturnType<StateView["currentValidatorDataView"]>
  > = {
```
