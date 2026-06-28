---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialize-state-update.ts#L114-L225
title: packages/jam/state-merkleization/serialize-state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 3
content_sha: 5e20138b7f14012215d9e9eea88f16ab064b599c21c3dc6290b48b7937cf4479
language: typescript
---
`packages/jam/state-merkleization/serialize-state-update.ts` (lines 114–225)

```typescript
        }
        case UpdatePreimageKind.UpdateOrAdd: {
          const { hash, length, slots } = action.item;
          const codec = serialize.serviceLookupHistory(blake2b, serviceId, hash, length);
          yield [StateEntryUpdateAction.Insert, codec.key, encode(codec.Codec, slots)];
          break;
        }
        case UpdatePreimageKind.Remove: {
          const { hash, length } = action;
          const codec = serialize.servicePreimages(blake2b, serviceId, hash);
          yield [StateEntryUpdateAction.Remove, codec.key, EMPTY_BLOB];

          const codec2 = serialize.serviceLookupHistory(blake2b, serviceId, hash, length);
          yield [StateEntryUpdateAction.Remove, codec2.key, EMPTY_BLOB];
          break;
        }
      }
    }
  }
}
function* serializeServiceUpdates(
  servicesUpdates: Map<ServiceId, UpdateService> | undefined,
  encode: EncodeFun,
  blake2b: Blake2b,
): Generator<StateEntryUpdate> {
  if (servicesUpdates === undefined) {
    return;
  }
  for (const [serviceId, { action }] of servicesUpdates.entries()) {
    // new service being created or updated
    const codec = serialize.serviceData(serviceId);
    yield [StateEntryUpdateAction.Insert, codec.key, encode(codec.Codec, action.account)];

    // additional lookup history update
    if (action.kind === UpdateServiceKind.Create && action.lookupHistory !== null) {
      const { lookupHistory } = action;
      const codec2 = serialize.serviceLookupHistory(blake2b, serviceId, lookupHistory.hash, lookupHistory.length);
      yield [StateEntryUpdateAction.Insert, codec2.key, encode(codec2.Codec, lookupHistory.slots)];
    }
  }
}

type EncodeFun = <T>(codec: Encode<T>, val: T) => BytesBlob;

function* serializeBasicKeys(spec: ChainSpec, update: Partial<State>) {
  function doSerialize<T>(val: T, codec: StateCodec<T>): StateEntryUpdate {
    return [StateEntryUpdateAction.Insert, codec.key, Encoder.encodeObject(codec.Codec, val, spec)];
  }

  if (update.authPools !== undefined) {
    yield doSerialize(update.authPools, serialize.authPools); // C(1)
  }

  if (update.authQueues !== undefined) {
    yield doSerialize(update.authQueues, serialize.authQueues); // C(2)
  }

  if (update.recentBlocks !== undefined) {
    yield doSerialize(update.recentBlocks, serialize.recentBlocks); // C(3)
  }

  const safroleData = getSafroleData(
    update.nextValidatorData,
    update.epochRoot,
    update.sealingKeySeries,
    update.ticketsAccumulator,
  );
  if (safroleData !== undefined) {
    yield doSerialize(safroleData, serialize.safrole); // C(4)
  }

  if (update.disputesRecords !== undefined) {
    yield doSerialize(update.disputesRecords, serialize.disputesRecords); // C(5)
  }

  if (update.entropy !== undefined) {
    yield doSerialize(update.entropy, serialize.entropy); // C(6)
  }

  if (update.designatedValidatorData !== undefined) {
    yield doSerialize(update.designatedValidatorData, serialize.designatedValidators); // C(7)
  }

  if (update.currentValidatorData !== undefined) {
    yield doSerialize(update.currentValidatorData, serialize.currentValidators); // C(8)
  }

  if (update.previousValidatorData !== undefined) {
    yield doSerialize(update.previousValidatorData, serialize.previousValidators); // C(9)
  }

  if (update.availabilityAssignment !== undefined) {
    yield doSerialize(update.availabilityAssignment, serialize.availabilityAssignment); // C(10)
  }

  if (update.timeslot !== undefined) {
    yield doSerialize(update.timeslot, serialize.timeslot); // C(11)
  }

  if (update.privilegedServices !== undefined) {
    yield doSerialize(update.privilegedServices, serialize.privilegedServices); // C(12)
  }

  if (update.statistics !== undefined) {
    yield doSerialize(update.statistics, serialize.statistics); // C(13)
  }

  if (update.accumulationQueue !== undefined) {
    yield doSerialize(update.accumulationQueue, serialize.accumulationQueue); // C(14)
  }

  if (update.recentlyAccumulated !== undefined) {
```
