---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L1-L104
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 7
content_sha: 598993036859f8f37b604f29500a700aa199ecddd6671cc8eff33c902fc45af6
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 1–104)

```typescript
import {
  type EntropyHash,
  type PerValidator,
  type ServiceId,
  type TimeSlot,
  tryAsPerEpochBlock,
  tryAsPerValidator,
  tryAsServiceId,
  tryAsTimeSlot,
  type WorkReportHash,
} from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import type { Ticket } from "@typeberry/block/tickets.js";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { codec } from "@typeberry/codec";
import {
  asKnownSize,
  FixedSizeArray,
  HashDictionary,
  HashSet,
  type KnownSizeArray,
  SortedArray,
  SortedSet,
} from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, BLS_KEY_BYTES, ED25519_KEY_BYTES, type Ed25519Key } from "@typeberry/crypto";
import { BANDERSNATCH_RING_ROOT_BYTES, type BandersnatchRingRoot } from "@typeberry/crypto/bandersnatch.js";
import { HASH_SIZE } from "@typeberry/hash";
import { MAX_VALUE_U32, tryAsU32, type U32 } from "@typeberry/numbers";
import { asOpaqueType, assertNever, check, OK, Result, WithDebug } from "@typeberry/utils";
import { type AccumulationOutput, accumulationOutputComparator } from "./accumulation-output.js";
import type { AccumulationQueue } from "./accumulation-queue.js";
import type { AvailabilityAssignment } from "./assurances.js";
import { AUTHORIZATION_QUEUE_SIZE, type AuthorizationPool, type AuthorizationQueue } from "./auth.js";
import { type PerCore, tryAsPerCore } from "./common.js";
import { DisputesRecords, hashComparator } from "./disputes.js";
import { InMemoryStateView } from "./in-memory-state-view.js";
import { PrivilegedServices } from "./privileged-services.js";
import { RecentBlocks } from "./recent-blocks.js";
import type { RecentlyAccumulated } from "./recently-accumulated.js";
import { type SafroleSealingKeys, SafroleSealingKeysData } from "./safrole-data.js";
import {
  LookupHistoryItem,
  type LookupHistorySlots,
  PreimageItem,
  ServiceAccountInfo,
  StorageItem,
  type StorageKey,
  tryAsLookupHistorySlots,
} from "./service.js";
import { ENTROPY_ENTRIES, type EnumerableState, type Service, type State } from "./state.js";
import {
  type ServicesUpdate,
  type UpdatePreimage,
  UpdatePreimageKind,
  type UpdateService,
  UpdateServiceKind,
  type UpdateStorage,
  UpdateStorageKind,
} from "./state-update.js";
import type { StateView, WithStateView } from "./state-view.js";
import { CoreStatistics, StatisticsData, ValidatorStatistics } from "./statistics.js";
import { VALIDATOR_META_BYTES, ValidatorData } from "./validator-data.js";

export enum UpdateError {
  /** Attempting to create a service that already exists. */
  DuplicateService = 0,
  /** Attempting to update a non-existing service. */
  NoService = 1,
  /** Attempting to provide an existing preimage. */
  PreimageExists = 2,
}

/** Data backing an {@link InMemoryService}. */
export type InMemoryServiceData = {
  /** https://graypaper.fluffylabs.dev/#/85129da/383303383303?v=0.6.3 */
  info: ServiceAccountInfo;
  /** https://graypaper.fluffylabs.dev/#/85129da/10f90010f900?v=0.6.3 */
  readonly preimages: HashDictionary<PreimageHash, PreimageItem>;
  /** https://graypaper.fluffylabs.dev/#/85129da/115400115800?v=0.6.3 */
  readonly lookupHistory: HashDictionary<PreimageHash, LookupHistoryItem[]>;
  /** https://graypaper.fluffylabs.dev/#/85129da/10f80010f800?v=0.6.3 */
  readonly storage: Map<string, StorageItem>;
};

/**
 * In-memory representation of the service.
 */
export class InMemoryService extends WithDebug implements Service {
  /** Create a new in-memory service wrapping the given id and data. */
  static new(serviceId: ServiceId, data: InMemoryServiceData) {
    return new InMemoryService(serviceId, data);
  }

  protected constructor(
    /** Service id. */
    readonly serviceId: ServiceId,
    /** Service details. */
    readonly data: InMemoryServiceData,
  ) {
    super();
  }

```
