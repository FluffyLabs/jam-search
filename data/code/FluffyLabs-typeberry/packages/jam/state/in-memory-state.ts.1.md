---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L93-L214
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 7
content_sha: 7660351af7fe663af856797a45e87c3c4820e7f091dc5c95d7430a2a04b13217
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 93–214)

```typescript
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

  getInfo(): ServiceAccountInfo {
    return this.data.info;
  }

  getStorage(rawKey: StorageKey): BytesBlob | null {
    return this.data.storage.get(rawKey.toString())?.value ?? null;
  }

  hasPreimage(hash: PreimageHash): boolean {
    return this.data.preimages.has(hash);
  }

  getPreimage(hash: PreimageHash): BytesBlob | null {
    return this.data.preimages.get(hash)?.blob ?? null;
  }

  getLookupHistory(hash: PreimageHash, len: U32): LookupHistorySlots | null {
    const item = this.data.lookupHistory.get(hash);
    if (item === undefined) {
      return null;
    }
    return item.find((x) => x.length === len)?.slots ?? null;
  }

  getEntries(): ServiceEntries {
    return {
      storageKeys: Array.from(this.data.storage.values()).map((x) => x.key),
      preimages: Array.from(this.data.preimages.keys()),
      lookupHistory: Array.from(this.data.lookupHistory.entries()).map(([hash, val]) => {
        return { hash, length: val[0].length };
      }),
    };
  }

  /** Return identical `InMemoryService` which does not share any references. */
  clone(): InMemoryService {
    return InMemoryService.new(this.serviceId, {
      info: ServiceAccountInfo.create(this.data.info),
      preimages: HashDictionary.fromEntries(Array.from(this.data.preimages.entries())),
      lookupHistory: HashDictionary.fromEntries(
        Array.from(this.data.lookupHistory.entries()).map(([k, v]) => [k, v.slice()]),
      ),
      storage: new Map(this.data.storage.entries()),
    });
  }

  /**
   * Create a new in-memory service from another state service
   * by copying all given entries.
   */
  static copyFrom(service: Service, entries: ServiceEntries) {
    const info = service.getInfo();
    const preimages = HashDictionary.new<PreimageHash, PreimageItem>();
    const storage = new Map<string, StorageItem>();
    const lookupHistory = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();

    // copy preimages
    for (const hash of entries.preimages) {
      const blob = service.getPreimage(hash);
      if (blob === null) {
        throw new Error(`Service ${service.serviceId} is missing expected preimage: ${hash}`);
      }
      preimages.set(hash, PreimageItem.create({ hash, blob }));
    }

    // copy lookupHistory
    for (const { hash, length } of entries.lookupHistory) {
      const slots = service.getLookupHistory(hash, length);
      if (slots === null) {
        throw new Error(`Service ${service.serviceId} is missing expected lookupHistory: ${hash}, ${length}`);
      }
      const items = lookupHistory.get(hash) ?? [];
      items.push(LookupHistoryItem.new(hash, length, slots));
      lookupHistory.set(hash, items);
    }

    // copy storage
    for (const key of entries.storageKeys) {
      const value = service.getStorage(key);
      if (value === null) {
        throw new Error(`Service ${service.serviceId} is missing expected storage: ${key}`);
      }
      storage.set(key.toString(), StorageItem.create({ key, value }));
    }

    return InMemoryService.new(service.serviceId, {
      info,
      preimages,
      storage,
      lookupHistory,
    });
  }
}

/**
 * A special version of state, stored fully in-memory.
 */
export class InMemoryState extends WithDebug implements State, WithStateView, EnumerableState {
  /** Create a new `InMemoryState` by providing all required fields. */
  static new(chainSpec: ChainSpec, state: InMemoryStateFields) {
    return new InMemoryState(chainSpec, state);
  }

  /**
   * Create a new `InMemoryState` with a partial state override.
   *
   * Note the rest of the state will be set to some empty,
   * not-necessarily coherent values.
   */
  static partial(spec: ChainSpec, partial: Partial<InMemoryStateFields>) {
```
