---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/state-update.ts#L1-L118
title: packages/jam/jam-host-calls/externalities/state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 4
content_sha: 9f7d560500bd4280dc827298997727e78fed9eff152d1d5b1921fa1064b72be7
language: typescript
---
`packages/jam/jam-host-calls/externalities/state-update.ts` (lines 1–118)

```typescript
import type { CoreIndex, PerValidator, ServiceId, TimeSlot } from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import type { BytesBlob } from "@typeberry/bytes";
import { asKnownSize, type FixedSizeArray } from "@typeberry/collections";
import type { OpaqueHash } from "@typeberry/hash";
import { isU32, isU64, tryAsU32, type U64 } from "@typeberry/numbers";
import {
  type AUTHORIZATION_QUEUE_SIZE,
  LookupHistoryItem,
  PrivilegedServices,
  ServiceAccountInfo,
  type ServicesUpdate,
  type State,
  StorageItem,
  type StorageKey,
  tryAsLookupHistorySlots,
  type UpdatePreimage,
  UpdatePreimageKind,
  UpdateService,
  UpdateServiceKind,
  UpdateStorage,
  type ValidatorData,
} from "@typeberry/state";
import { assertNever, check, OK, Result } from "@typeberry/utils";
import type { PendingTransfer } from "./pending-transfer.js";

export const InsufficientFundsError = "insufficient funds";
export type InsufficientFundsError = typeof InsufficientFundsError;

/** Update of the state entries coming from accumulation of a single service. */
export type ServiceStateUpdate = Partial<Pick<State, "privilegedServices" | "authQueues" | "designatedValidatorData">> &
  ServicesUpdate;

/** Deep clone of a map with array. */
function deepCloneMapWithArray<K, V>(map: Map<K, V[]>): Map<K, V[]> {
  const cloned: [K, V[]][] = [];

  for (const [k, v] of map.entries()) {
    cloned.push([k, v.slice()]);
  }

  return new Map(cloned);
}

/**
 * State updates that currently accumulating service produced.
 *
 * `x_u`: https://graypaper.fluffylabs.dev/#/9a08063/2f31012f3101?v=0.6.6
 */
export class AccumulationStateUpdate {
  /** Updated authorization queues for cores. */
  public readonly authorizationQueues: Map<CoreIndex, FixedSizeArray<AuthorizerHash, AUTHORIZATION_QUEUE_SIZE>> =
    new Map();
  /** New validators data. */
  public validatorsData: PerValidator<ValidatorData> | null = null;
  /** Updated priviliged services. */
  public privilegedServices: PrivilegedServices | null = null;

  private constructor(
    /** Services state updates. */
    public readonly services: ServicesUpdate,
    /** Pending transfers. */
    public transfers: PendingTransfer[],
    /** Yielded accumulation root. */
    public yieldedRoot: OpaqueHash | null = null,
  ) {}

  /** Create new empty state update. */
  static empty(): AccumulationStateUpdate {
    return new AccumulationStateUpdate(
      {
        created: [],
        updated: new Map(),
        removed: [],
        preimages: new Map(),
        storage: new Map(),
      },
      [],
    );
  }

  /** Create a state update with some existing, yet uncommited services updates. */
  static new(update: ServicesUpdate): AccumulationStateUpdate {
    return new AccumulationStateUpdate(
      {
        ...update,
      },
      [],
    );
  }

  /** Create a copy of another `StateUpdate`. Used by checkpoints. */
  static copyFrom(from: AccumulationStateUpdate): AccumulationStateUpdate {
    const serviceUpdates: ServicesUpdate = {
      // shallow copy
      created: [...from.services.created],
      updated: new Map(from.services.updated),
      removed: [...from.services.removed],
      // deep copy
      preimages: deepCloneMapWithArray(from.services.preimages),
      storage: deepCloneMapWithArray(from.services.storage),
    };
    const transfers = [...from.transfers];
    const update = new AccumulationStateUpdate(serviceUpdates, transfers, from.yieldedRoot);

    // update entries
    for (const [k, v] of from.authorizationQueues) {
      update.authorizationQueues.set(k, v);
    }

    if (from.validatorsData !== null) {
      update.validatorsData = asKnownSize([...from.validatorsData]);
    }

    if (from.privilegedServices !== null) {
      update.privilegedServices = PrivilegedServices.create({
        ...from.privilegedServices,
```
