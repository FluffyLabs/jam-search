---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialized-state.ts#L105-L226
title: packages/jam/state-merkleization/serialized-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 918327a31af5aa392569dddf2d9bd6e7fc39e5ce3d529fd5fed6eb7c3f539447
language: typescript
---
`packages/jam/state-merkleization/serialized-state.ts` (lines 105–226)

```typescript
      throw new Error(`Required state entry for ${description} is missing!. Accessing key: ${k.key}`);
    }
    return data;
  }

  private retrieveOptional<T>({ key, Codec }: KeyAndCodec<T>): T | undefined {
    const cached = this.dataCache.get(key);
    if (cached !== undefined) {
      return cached as T;
    }
    const bytes = this.backend.get(key);
    if (bytes === null) {
      return undefined;
    }
    const data = Decoder.decodeObject(Codec, bytes, this.spec);
    this.dataCache.set(key, data);
    return data;
  }

  get availabilityAssignment(): State["availabilityAssignment"] {
    return this.retrieve(serialize.availabilityAssignment, "availabilityAssignment");
  }

  get designatedValidatorData(): State["designatedValidatorData"] {
    return this.retrieve(serialize.designatedValidators, "designatedValidatorData");
  }

  get nextValidatorData(): State["nextValidatorData"] {
    return this.retrieve(serialize.safrole, "safroleData.nextValidatorData").nextValidatorData;
  }

  get currentValidatorData(): State["currentValidatorData"] {
    return this.retrieve(serialize.currentValidators, "currentValidators");
  }

  get previousValidatorData(): State["previousValidatorData"] {
    return this.retrieve(serialize.previousValidators, "previousValidators");
  }

  get disputesRecords(): State["disputesRecords"] {
    return this.retrieve(serialize.disputesRecords, "disputesRecords");
  }

  get timeslot(): State["timeslot"] {
    return this.retrieve(serialize.timeslot, "timeslot");
  }

  get entropy(): State["entropy"] {
    return this.retrieve(serialize.entropy, "entropy");
  }

  get authPools(): State["authPools"] {
    return this.retrieve(serialize.authPools, "authPools");
  }

  get authQueues(): State["authQueues"] {
    return this.retrieve(serialize.authQueues, "authQueues");
  }

  get recentBlocks(): State["recentBlocks"] {
    return this.retrieve(serialize.recentBlocks, "recentBlocks");
  }

  get statistics(): State["statistics"] {
    return this.retrieve(serialize.statistics, "statistics");
  }

  get accumulationQueue(): State["accumulationQueue"] {
    return this.retrieve(serialize.accumulationQueue, "accumulationQueue");
  }

  get recentlyAccumulated(): State["recentlyAccumulated"] {
    return this.retrieve(serialize.recentlyAccumulated, "recentlyAccumulated");
  }

  get ticketsAccumulator(): State["ticketsAccumulator"] {
    return this.retrieve(serialize.safrole, "safroleData.ticketsAccumulator").ticketsAccumulator;
  }

  get sealingKeySeries(): State["sealingKeySeries"] {
    return this.retrieve(serialize.safrole, "safrole.sealingKeySeries").sealingKeySeries;
  }

  get epochRoot(): State["epochRoot"] {
    return this.retrieve(serialize.safrole, "safrole.epochRoot").epochRoot;
  }

  get privilegedServices(): State["privilegedServices"] {
    return this.retrieve(serialize.privilegedServices, "privilegedServices");
  }

  get accumulationOutputLog(): State["accumulationOutputLog"] {
    return this.retrieve(serialize.accumulationOutputLog, "accumulationOutputLog");
  }
}

/** Service data representation on a serialized state. */
export class SerializedService implements Service {
  static new(
    blake2b: Blake2b,
    serviceId: ServiceId,
    accountInfo: ServiceAccountInfo,
    retrieveOptional: <T>(key: KeyAndCodec<T>) => T | undefined,
  ) {
    return new SerializedService(blake2b, serviceId, accountInfo, retrieveOptional);
  }

  private constructor(
    public readonly blake2b: Blake2b,
    /** Service id */
    public readonly serviceId: ServiceId,
    private readonly accountInfo: ServiceAccountInfo,
    private readonly retrieveOptional: <T>(key: KeyAndCodec<T>) => T | undefined,
  ) {}

  /** Service account info. */
  getInfo(): ServiceAccountInfo {
    return this.accountInfo;
  }

  /** Retrieve a storage item. */
  getStorage(rawKey: StorageKey): BytesBlob | null {
```
