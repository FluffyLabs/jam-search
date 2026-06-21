---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/in-memory-state-codec.ts#L1-L129
title: packages/jam/state-merkleization/in-memory-state-codec.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: 64c4ac483f8b216f8bdffe52ee49655b134abd945fe2fb380e95afb4e7199a95
language: typescript
---
`packages/jam/state-merkleization/in-memory-state-codec.ts` (lines 1–129)

```typescript
import { codecPerValidator, type ServiceId, type TimeSlot } from "@typeberry/block";
import { type CodecHashDictionaryOptions, codecHashDictionary } from "@typeberry/block/codec-utils.js";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import { Ticket } from "@typeberry/block/tickets.js";
import { type CodecRecord, codec, Descriptor } from "@typeberry/codec";
import { asKnownSize, HashDictionary } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { BANDERSNATCH_RING_ROOT_BYTES, type BandersnatchRingRoot } from "@typeberry/crypto/bandersnatch.js";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import { Ordering } from "@typeberry/ordering";
import {
  InMemoryService,
  InMemoryState,
  LookupHistoryItem,
  PreimageItem,
  ServiceAccountInfo,
  type State,
  StorageItem,
  tryAsLookupHistorySlots,
  ValidatorData,
} from "@typeberry/state";
import { SafroleSealingKeysData } from "@typeberry/state/safrole-data.js";
import { seeThrough } from "@typeberry/utils";
import { serialize } from "./serialize.js";

type LookupHistoryEntry = {
  key: PreimageHash;
  data: LookupHistoryItem[];
};

/** Codec for a map with string keys. */
export const codecMap = <T>(
  value: Descriptor<T>,
  extractKey: (val: T) => string,
  {
    typicalLength = codec.TYPICAL_DICTIONARY_LENGTH,
    compare = (a, b) => {
      const keyA = extractKey(a);
      const keyB = extractKey(b);

      if (keyA < keyB) {
        return Ordering.Less;
      }

      if (keyA > keyB) {
        return Ordering.Greater;
      }

      return Ordering.Equal;
    },
  }: CodecHashDictionaryOptions<T> = {},
): Descriptor<Map<string, T>> => {
  return Descriptor.new(
    `Map<${value.name}>[?]`,
    {
      bytes: typicalLength * value.sizeHint.bytes,
      isExact: false,
    },
    (e, v) => {
      const data = Array.from(v.values());
      data.sort((a, b) => compare(a, b).value);

      e.varU32(tryAsU32(data.length));

      for (const v of data) {
        value.encode(e, v);
      }
    },
    (d) => {
      const map = new Map<string, T>();
      const len = d.varU32();
      let prevValue = null as null | T;
      for (let i = 0; i < len; i += 1) {
        const v = value.decode(d);
        const k = extractKey(v);
        if (map.has(k)) {
          throw new Error(`Duplicate item in the dictionary encoding: "${k}"!`);
        }
        if (prevValue !== null && compare(prevValue, v).isGreaterOrEqual()) {
          throw new Error(
            `The keys in dictionary encoding are not sorted "${extractKey(prevValue)}" >= "${extractKey(v)}"!`,
          );
        }
        map.set(k, v);
        prevValue = v;
      }
      return map;
    },
    (s) => {
      const len = s.decoder.varU32();
      s.sequenceFixLen(value, len);
    },
  );
};

const lookupHistoryItemCodec = codec.object<LookupHistoryItem>(
  {
    hash: codec.bytes(HASH_SIZE).asOpaque<PreimageHash>(),
    length: codec.u32,
    slots: codec
      .readonlyArray(codec.sequenceVarLen(codec.u32.asOpaque<TimeSlot>()))
      .convert(seeThrough, tryAsLookupHistorySlots),
  },
  "LookupHistoryItem",
  ({ hash, length, slots }) => LookupHistoryItem.new(hash, length, slots),
);

const lookupHistoryEntryCodec = codec.object<LookupHistoryEntry>({
  key: codec.bytes(HASH_SIZE).asOpaque<PreimageHash>(),
  data: codec.sequenceVarLen(lookupHistoryItemCodec),
});

const lookupHistoryCodec = codec
  .sequenceVarLen(lookupHistoryEntryCodec)
  .convert<HashDictionary<PreimageHash, LookupHistoryItem[]>>(
    (dict) => {
      const entries: LookupHistoryEntry[] = [];
      for (const [key, data] of dict) {
        entries.push({
          key,
          data,
        });
      }
      return entries;
    },
    (items): HashDictionary<PreimageHash, LookupHistoryItem[]> => {
      const dict = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();
      for (const { key, data } of items) {
```
