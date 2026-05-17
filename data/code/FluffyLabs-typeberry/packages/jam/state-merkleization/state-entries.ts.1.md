---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/state-entries.ts#L105-L194
title: packages/jam/state-merkleization/state-entries.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 401b900d692b83f2ca0a4f9372ac11442f368160d40f7ab1ae62b1e251c8efd9
language: typescript
---
`packages/jam/state-merkleization/state-entries.ts` (lines 105–194)

```typescript
    return this.dictionary.get(key) ?? null;
  }

  /** Modify underlying entries dictionary with given update. */
  applyUpdate(stateEntriesUpdate: Iterable<StateEntryUpdate>) {
    for (const [action, key, value] of stateEntriesUpdate) {
      if (action === StateEntryUpdateAction.Insert) {
        this.dictionary.set(key, value);
      } else if (action === StateEntryUpdateAction.Remove) {
        this.dictionary.delete(key);
      } else {
        assertNever(action);
      }
    }
  }

  /** https://graypaper.fluffylabs.dev/#/68eaa1f/391600391600?v=0.6.4 */
  getRootHash(blake2b: Blake2b): StateRootHash {
    const blake2bTrieHasher = getBlake2bTrieHasher(blake2b);
    const leaves: SortedSet<LeafNode> = SortedSet.fromArray(leafComparator);
    for (const [key, value] of this) {
      leaves.insert(InMemoryTrie.constructLeaf(blake2bTrieHasher, key.asOpaque(), value));
    }

    return InMemoryTrie.computeStateRoot(blake2bTrieHasher, leaves).asOpaque();
  }
}

/** https://graypaper.fluffylabs.dev/#/68eaa1f/38a50038a500?v=0.6.4 */
function convertInMemoryStateToDictionary(
  spec: ChainSpec,
  blake2b: Blake2b,
  state: InMemoryState,
): TruncatedHashDictionary<StateKey, BytesBlob> {
  const serialized = TruncatedHashDictionary.fromEntries<StateKey, BytesBlob>([]);
  function doSerialize<T>(codec: StateCodec<T>) {
    serialized.set(codec.key, Encoder.encodeObject(codec.Codec, codec.extract(state), spec));
  }

  doSerialize(serialize.authPools); // C(1)
  doSerialize(serialize.authQueues); // C(2)
  doSerialize(serialize.recentBlocks); // C(3)
  doSerialize(serialize.safrole); // C(4)
  doSerialize(serialize.disputesRecords); // C(5)
  doSerialize(serialize.entropy); // C(6)
  doSerialize(serialize.designatedValidators); // C(7)
  doSerialize(serialize.currentValidators); // C(8)
  doSerialize(serialize.previousValidators); // C(9)
  doSerialize(serialize.availabilityAssignment); // C(10)
  doSerialize(serialize.timeslot); // C(11)
  doSerialize(serialize.privilegedServices); // C(12)
  doSerialize(serialize.statistics); // C(13)
  doSerialize(serialize.accumulationQueue); // C(14)
  doSerialize(serialize.recentlyAccumulated); // C(15)
  doSerialize(serialize.accumulationOutputLog); // C(16)

  // services
  for (const [serviceId, service] of state.services.entries()) {
    // data
    const { key, Codec } = serialize.serviceData(serviceId);
    serialized.set(key, Encoder.encodeObject(Codec, service.getInfo()));

    // preimages
    for (const preimage of service.data.preimages.values()) {
      const { key, Codec } = serialize.servicePreimages(blake2b, serviceId, preimage.hash);
      serialized.set(key, Encoder.encodeObject(Codec, preimage.blob));
    }

    // storage
    for (const storage of service.data.storage.values()) {
      const { key, Codec } = serialize.serviceStorage(blake2b, serviceId, storage.key);
      serialized.set(key, Encoder.encodeObject(Codec, storage.value));
    }

    // lookup history
    for (const lookupHistoryList of service.data.lookupHistory.values()) {
      for (const lookupHistory of lookupHistoryList) {
        const { key, Codec } = serialize.serviceLookupHistory(
          blake2b,
          serviceId,
          lookupHistory.hash,
          lookupHistory.length,
        );
        serialized.set(key, Encoder.encodeObject(Codec, lookupHistory.slots.slice()));
      }
    }
  }

  return serialized;
}
```
