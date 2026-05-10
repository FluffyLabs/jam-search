---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/state-entries.ts#L1-L110
title: packages/jam/state-merkleization/state-entries.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 04ab83e69badaf9400c738a104df7ba8afad2685255d29e62c364042dcf1b915
language: typescript
---
`packages/jam/state-merkleization/state-entries.ts` (lines 1–110)

```typescript
import type { StateRootHash } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { codec, Encoder } from "@typeberry/codec";
import { SortedSet, TruncatedHashDictionary } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { type Blake2b, HASH_SIZE, TRUNCATED_HASH_SIZE, type TruncatedHash } from "@typeberry/hash";
import type { InMemoryState } from "@typeberry/state";
import { InMemoryTrie, type LeafNode, leafComparator } from "@typeberry/trie";
import { getBlake2bTrieHasher } from "@typeberry/trie/hasher.js";
import { assertNever, TEST_COMPARE_USING } from "@typeberry/utils";
import type { StateKey } from "./keys.js";
import { type StateCodec, serialize } from "./serialize.js";
import { type StateEntryUpdate, StateEntryUpdateAction } from "./serialize-state-update.js";

const TYPICAL_STATE_ITEMS = 50;
const TYPICAL_STATE_ITEM_LEN = 50;

const stateEntriesSequenceCodec = codec.sequenceVarLen(codec.pair(codec.bytes(TRUNCATED_HASH_SIZE), codec.blob));
/**
 * Full, in-memory state represented as serialized entries dictionary.
 *
 * State entries may be wrapped into `SerializedState` to access the contained values.
 */
export class StateEntries {
  static Codec = codec.custom<StateEntries>(
    {
      name: "StateEntries",
      sizeHint: {
        isExact: false,
        bytes: TYPICAL_STATE_ITEMS * (HASH_SIZE + TYPICAL_STATE_ITEM_LEN),
      },
    },
    (e, v) => stateEntriesSequenceCodec.encode(e, Array.from(v.dictionary)),
    (d) => StateEntries.fromEntriesUnsafe(stateEntriesSequenceCodec.decode(d)),
    (s) => stateEntriesSequenceCodec.skip(s),
  );

  /** Turn in-memory state into it's serialized form. */
  static serializeInMemory(spec: ChainSpec, blake2b: Blake2b, state: InMemoryState) {
    return new StateEntries(convertInMemoryStateToDictionary(spec, blake2b, state));
  }

  /**
   * Wrap a collection of truncated state entries and treat it as state.
   *
   * NOTE: There is no verification happening, so the state may be
   * incomplete. Use only if you are sure this is all the entries needed.
   */
  static fromDictionaryUnsafe(data: TruncatedHashDictionary<StateKey, BytesBlob>): StateEntries {
    return new StateEntries(data);
  }

  /**
   * Create a new serialized state from a collection of existing entries.
   *
   * NOTE: There is no verification happening, so the state may be
   * incomplete. Use only if you are sure this is all the entries needed.
   */
  static fromEntriesUnsafe(
    entries: Iterable<[StateKey | TruncatedHash, BytesBlob] | readonly [StateKey | TruncatedHash, BytesBlob]>,
  ) {
    return new StateEntries(TruncatedHashDictionary.fromEntries(entries));
  }

  private constructor(private readonly dictionary: TruncatedHashDictionary<StateKey, BytesBlob>) {}

  /** When comparing, we can safely ignore `trieCache` and just use entries. */
  [TEST_COMPARE_USING]() {
    return Object.fromEntries(this.dictionary);
  }

  /** Iterator over entries */
  entries(): Generator<[TruncatedHash, BytesBlob]> {
    return this.dictionary.entries();
  }

  /** Iterator over entries keys */
  *keys(): Generator<TruncatedHash> {
    yield* this.dictionary.keys();
  }

  /** Iterator over entries values */
  *values(): Generator<BytesBlob> {
    yield* this.dictionary.values();
  }

  /** Dump state entries to JSON string (format compatible with stf vectors). */
  toString() {
    return JSON.stringify(
      Array.from(this.entries()).map(([key, value]) => ({
        key,
        value,
      })),
      null,
      2,
    );
  }

  [Symbol.iterator]() {
    return this.dictionary[Symbol.iterator]();
  }

  /** Retrieve value of some serialized key (if present). */
  get(key: StateKey): BytesBlob | null {
    return this.dictionary.get(key) ?? null;
  }

  /** Modify underlying entries dictionary with given update. */
  applyUpdate(stateEntriesUpdate: Iterable<StateEntryUpdate>) {
    for (const [action, key, value] of stateEntriesUpdate) {
```
