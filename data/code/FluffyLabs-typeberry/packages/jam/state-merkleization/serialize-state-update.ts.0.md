---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialize-state-update.ts#L1-L117
title: packages/jam/state-merkleization/serialize-state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 3735049853d64d1a6a1178f910ed028892f6bcc0023545b1ea45b1dac38aeeaf
language: typescript
---
`packages/jam/state-merkleization/serialize-state-update.ts` (lines 1–117)

```typescript
import type { ServiceId } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { type Encode, Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import type { Blake2b } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import {
  SafroleData,
  type ServicesUpdate,
  type State,
  tryAsLookupHistorySlots,
  type UpdatePreimage,
  UpdatePreimageKind,
  type UpdateService,
  UpdateServiceKind,
  type UpdateStorage,
  UpdateStorageKind,
} from "@typeberry/state";
import type { StateKey } from "./keys.js";
import { type StateCodec, serialize } from "./serialize.js";

/** What should be done with that key? */
export enum StateEntryUpdateAction {
  /** Insert an entry. */
  Insert = 0,
  /** Remove an entry. */
  Remove = 1,
}

export type StateEntryUpdate = [StateEntryUpdateAction, StateKey, BytesBlob];

const EMPTY_BLOB = BytesBlob.empty();

/** Serialize given state update into a series of key-value pairs. */
export function* serializeStateUpdate(
  spec: ChainSpec,
  blake2b: Blake2b,
  update: Partial<State & ServicesUpdate>,
): Generator<StateEntryUpdate> {
  // first let's serialize all of the simple entries (if present!)
  yield* serializeBasicKeys(spec, update);

  const encode = <T>(codec: Encode<T>, val: T) => Encoder.encodeObject(codec, val, spec);

  // then let's proceed with service updates
  yield* serializeServiceUpdates(update.updated, encode, blake2b);
  yield* serializePreimages(update.preimages, encode, blake2b);
  yield* serializeStorage(update.storage, blake2b);
  yield* serializeRemovedServices(update.removed);
}

function* serializeRemovedServices(servicesRemoved: ServiceId[] | undefined): Generator<StateEntryUpdate> {
  if (servicesRemoved === undefined) {
    return;
  }
  for (const serviceId of servicesRemoved) {
    const codec = serialize.serviceData(serviceId);
    yield [StateEntryUpdateAction.Remove, codec.key, EMPTY_BLOB];
  }
}

function* serializeStorage(
  storageUpdates: Map<ServiceId, UpdateStorage[]> | undefined,
  blake2b: Blake2b,
): Generator<StateEntryUpdate> {
  if (storageUpdates === undefined) {
    return;
  }
  for (const [serviceId, updates] of storageUpdates.entries()) {
    for (const { action } of updates) {
      switch (action.kind) {
        case UpdateStorageKind.Set: {
          const key = action.storage.key;
          const codec = serialize.serviceStorage(blake2b, serviceId, key);
          yield [StateEntryUpdateAction.Insert, codec.key, action.storage.value];
          break;
        }
        case UpdateStorageKind.Remove: {
          const key = action.key;
          const codec = serialize.serviceStorage(blake2b, serviceId, key);
          yield [StateEntryUpdateAction.Remove, codec.key, EMPTY_BLOB];
          break;
        }
      }
    }
  }
}

function* serializePreimages(
  preimagesUpdates: Map<ServiceId, UpdatePreimage[]> | undefined,
  encode: EncodeFun,
  blake2b: Blake2b,
): Generator<StateEntryUpdate> {
  if (preimagesUpdates === undefined) {
    return;
  }
  for (const [serviceId, updates] of preimagesUpdates.entries()) {
    for (const { action } of updates) {
      switch (action.kind) {
        case UpdatePreimageKind.Provide: {
          const { hash, blob } = action.preimage;
          const codec = serialize.servicePreimages(blake2b, serviceId, hash);
          yield [StateEntryUpdateAction.Insert, codec.key, blob];

          if (action.slot !== null) {
            const codec2 = serialize.serviceLookupHistory(blake2b, serviceId, hash, tryAsU32(blob.length));
            yield [
              StateEntryUpdateAction.Insert,
              codec2.key,
              encode(codec2.Codec, tryAsLookupHistorySlots([action.slot])),
            ];
          }
          break;
        }
        case UpdatePreimageKind.UpdateOrAdd: {
          const { hash, length, slots } = action.item;
          const codec = serialize.serviceLookupHistory(blake2b, serviceId, hash, length);
```
