---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialized-state.ts#L1-L112
title: packages/jam/state-merkleization/serialized-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 9eca4c1029908d6147d273c62053b1a87af5f9468bca42a095f5aee636e03c66
language: typescript
---
`packages/jam/state-merkleization/serialized-state.ts` (lines 1–112)

```typescript
import { type ServiceId, tryAsTimeSlot } from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { BytesBlob } from "@typeberry/bytes";
import { type Decode, Decoder } from "@typeberry/codec";
import { HashDictionary } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import type { Blake2b } from "@typeberry/hash";
import type { U32 } from "@typeberry/numbers";
import {
  type EnumerableState,
  type LookupHistorySlots,
  type Service,
  type ServiceAccountInfo,
  type State,
  type StorageKey,
  tryAsLookupHistorySlots,
} from "@typeberry/state";
import type { StateView, WithStateView } from "@typeberry/state/state-view.js";
import { TEST_COMPARE_USING } from "@typeberry/utils";
import type { StateKey } from "./keys.js";
import { serialize } from "./serialize.js";
import { type SerializedStateBackend, SerializedStateView } from "./serialized-state-view.js";
import type { StateEntries } from "./state-entries.js";

/**
 * State object which reads it's entries from some backend.
 *
 * It differs from `InMemoryState` by needing to serialize the keys before accessing them.
 *
 * NOTE: the object has no way of knowing if all of the required data is present
 * in the backend layer, so it MAY fail during runtime.
 */
export class SerializedState<T extends SerializedStateBackend = SerializedStateBackend>
  implements State, WithStateView, EnumerableState
{
  /** Create a state-like object from collection of serialized entries. */
  static fromStateEntries(spec: ChainSpec, blake2b: Blake2b, state: StateEntries, recentServices: ServiceId[] = []) {
    return new SerializedState(spec, blake2b, state, recentServices);
  }

  /** Create a state-like object backed by some DB. */
  static new<T extends SerializedStateBackend>(
    spec: ChainSpec,
    blake2b: Blake2b,
    db: T,
    recentServices: ServiceId[] = [],
  ): SerializedState<T> {
    return new SerializedState(spec, blake2b, db, recentServices);
  }

  private dataCache: HashDictionary<StateKey, unknown> = HashDictionary.new();
  private viewCache: HashDictionary<StateKey, unknown> = HashDictionary.new();

  private constructor(
    private readonly spec: ChainSpec,
    private readonly blake2b: Blake2b,
    public backend: T,
    /** Best-effort list of recently active services. */
    private readonly recentlyUsedServices: ServiceId[],
  ) {}

  /** Comparing the serialized states, just means comparing their backends. */
  [TEST_COMPARE_USING]() {
    return this.backend;
  }

  /** Return a non-decoding version of the state. */
  view(): StateView {
    return SerializedStateView.new({
      spec: this.spec,
      backend: this.backend,
      recentlyUsedServices: this.recentlyUsedServices,
      viewCache: this.viewCache,
    });
  }

  // TODO [ToDr] Temporary method to update the state,
  // without changing references.
  public updateBackend(newBackend: T) {
    this.backend = newBackend;
    this.dataCache = HashDictionary.new();
    this.viewCache = HashDictionary.new();
  }

  recentServiceIds(): readonly ServiceId[] {
    return this.recentlyUsedServices;
  }

  getService(id: ServiceId): SerializedService | null {
    const serviceData = this.retrieveOptional(serialize.serviceData(id));
    if (serviceData === undefined) {
      return null;
    }

    if (!this.recentlyUsedServices.includes(id)) {
      this.recentlyUsedServices.push(id);
    }

    return SerializedService.new(this.blake2b, id, serviceData, (key) => this.retrieveOptional(key));
  }

  private retrieve<T>(k: KeyAndCodec<T>, description: string): T {
    const data = this.retrieveOptional(k);
    if (data === undefined) {
      throw new Error(`Required state entry for ${description} is missing!. Accessing key: ${k.key}`);
    }
    return data;
  }

  private retrieveOptional<T>({ key, Codec }: KeyAndCodec<T>): T | undefined {
    const cached = this.dataCache.get(key);
    if (cached !== undefined) {
```
