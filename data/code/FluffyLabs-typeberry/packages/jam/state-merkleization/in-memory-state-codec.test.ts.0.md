---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/in-memory-state-codec.test.ts#L1-L72
title: packages/jam/state-merkleization/in-memory-state-codec.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: aa8b657129914c6029d7cb620233b09d4aaf5044c9c400f41abac8326ec471e5
language: typescript
---
`packages/jam/state-merkleization/in-memory-state-codec.test.ts` (lines 1–72)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec, Decoder, Encoder } from "@typeberry/codec";
import { asOpaqueType, type Opaque } from "@typeberry/utils";
import { codecMap } from "./in-memory-state-codec.js";

describe("JAM types codec / Map", () => {
  type StorageKey = Opaque<BytesBlob, "storage key">;

  class StorageItem {
    static Codec = codec.Class(StorageItem, {
      key: codec.blob.convert(
        (i) => i,
        (o) => asOpaqueType(o),
      ),
      value: codec.blob,
    });

    static create({ key, value }: CodecRecord<StorageItem>) {
      return new StorageItem(key, value);
    }

    private constructor(
      readonly key: StorageKey,
      readonly value: BytesBlob,
    ) {}
  }
  const dictionaryCodec = codecMap(StorageItem.Codec, (x) => x.key.toString(), { typicalLength: 10 });

  const arrayCodec = codec.sequenceVarLen(StorageItem.Codec);

  it("should be compatible with a list", () => {
    const list = ["0x00", "0x01", "0x02"]
      .map(BytesBlob.parseBlob)
      .map((x) => StorageItem.create({ key: asOpaqueType(x), value: x }));

    const encoded = Encoder.encodeObject(arrayCodec, list);
    const decoded = Decoder.decodeObject(dictionaryCodec, encoded);
    const reencoded = Encoder.encodeObject(dictionaryCodec, decoded);
    const decodedlist = Decoder.decodeObject(arrayCodec, reencoded);

    assert.deepStrictEqual(list, decodedlist);
    assert.deepStrictEqual(encoded.toString(), reencoded.toString());
    assert.deepStrictEqual(list, Array.from(decoded.values()));
  });

  it("should throw an error if order is incorrect", () => {
    const list = ["0x00", "0x02", "0x01"]
      .map(BytesBlob.parseBlob)
      .map((x) => StorageItem.create({ key: asOpaqueType(x), value: x }));

    const encoded = Encoder.encodeObject(arrayCodec, list);

    assert.throws(() => {
      Decoder.decodeObject(dictionaryCodec, encoded);
    }, new Error('The keys in dictionary encoding are not sorted "0x02" >= "0x01"!'));
  });

  it("should throw an error if there are duplicates", () => {
    const list = ["0x00", "0x01", "0x01"]
      .map(BytesBlob.parseBlob)
      .map((x) => StorageItem.create({ key: asOpaqueType(x), value: x }));

    const encoded = Encoder.encodeObject(arrayCodec, list);

    assert.throws(() => {
      Decoder.decodeObject(dictionaryCodec, encoded);
    }, new Error('Duplicate item in the dictionary encoding: "0x01"!'));
  });
});
```
