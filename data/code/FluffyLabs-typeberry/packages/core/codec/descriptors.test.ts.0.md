---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.test.ts#L1-L119
title: packages/core/codec/descriptors.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 5
content_sha: b4e703cb53c1103dcf9d87d9cfbd2b67a823159f289d3cb18d0fd66e7c051cba
language: typescript
---
`packages/core/codec/descriptors.test.ts` (lines 1–119)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { Decoder } from "./decoder.js";
import type { CodecRecord } from "./descriptor.js";
import * as codec from "./descriptors.js";
import { Encoder } from "./encoder.js";

class TestHeader {
  static Codec = codec.Class(TestHeader, {
    parentHeaderHash: codec.bytes(32),
    priorStateRoot: codec.bytes(32),
    extrinsicHash: codec.bytes(32),
  });

  static create = ({ parentHeaderHash, priorStateRoot, extrinsicHash }: CodecRecord<TestHeader>) =>
    new TestHeader(parentHeaderHash, priorStateRoot, extrinsicHash);

  // this key is ignored, since it's not a string one.
  public readonly 0: number;

  public constructor(
    public readonly parentHeaderHash: Bytes<32>,
    public readonly priorStateRoot: Bytes<32>,
    public readonly extrinsicHash: Bytes<32>,
  ) {}
}

describe("Codec Descriptors / sequence view", () => {
  class MyHash {
    static Codec = codec.Class(MyHash, {
      hash: codec.bytes(32),
    });
    static create = ({ hash }: CodecRecord<MyHash>) => new MyHash(hash);
    constructor(public readonly hash: Bytes<32>) {}
  }

  const headerSeq = codec.sequenceFixLen(MyHash.Codec, 10);
  const data = [
    new MyHash(Bytes.fill(32, 0)),
    new MyHash(Bytes.fill(32, 1)),
    new MyHash(Bytes.fill(32, 2)),
    new MyHash(Bytes.fill(32, 3)),
    new MyHash(Bytes.fill(32, 4)),
    new MyHash(Bytes.fill(32, 5)),
    new MyHash(Bytes.fill(32, 6)),
    new MyHash(Bytes.fill(32, 7)),
    new MyHash(Bytes.fill(32, 8)),
    new MyHash(Bytes.fill(32, 9)),
  ];
  const encoded = Encoder.encodeObject(headerSeq, data);

  it("should encode & decode", () => {
    const seqView = Decoder.decodeObject(headerSeq.View, encoded);

    // when
    const reEncoded = Encoder.encodeObject(headerSeq.View, seqView);

    // then
    assert.deepStrictEqual(reEncoded, encoded);
  });

  it("should retrieve one item", () => {
    const seqView = Decoder.decodeObject(headerSeq.View, encoded);

    // when
    const item5 = seqView.get(5);

    // then
    assert.deepStrictEqual(
      item5?.encoded().toString(),
      "0x0505050505050505050505050505050505050505050505050505050505050505",
    );
    assert.deepStrictEqual(item5?.materialize(), new MyHash(Bytes.fill(32, 5)));
    assert.deepStrictEqual(item5?.view().hash.materialize(), Bytes.fill(32, 5));
    assert.deepStrictEqual(item5?.view().hash.view(), Bytes.fill(32, 5));
  });

  it("should iterate over all items", () => {
    const seqView = Decoder.decodeObject(headerSeq.View, encoded);

    let i = 0;
    for (const item of seqView) {
      assert.deepStrictEqual(item?.materialize(), new MyHash(Bytes.fill(32, i)));
      i++;
    }
    assert.deepStrictEqual(i, 10);
  });

  it("should map all items", () => {
    const seqView = Decoder.decodeObject(headerSeq.View, encoded);

    const mapped = seqView.map((x) => x.view().hash.encoded());
    const materialized = seqView.map((x) => x.materialize().hash);
    assert.deepStrictEqual(mapped.length, seqView.length);
    assert.deepStrictEqual(materialized.length, seqView.length);
    for (let i = 0; i < 10; i++) {
      assert.strictEqual(mapped[i].toString(), materialized[i].toString());
    }
  });
});

describe("Codec Descriptors / object", () => {
  it("should encode & decode", () => {
    const headerCodec = codec.object({
      parentHeaderHash: codec.bytes(32),
      priorStateRoot: codec.bytes(32),
      extrinsicHash: codec.bytes(32),
    });

    const elem = {
      parentHeaderHash: Bytes.fill(32, 1),
      priorStateRoot: Bytes.fill(32, 2),
      extrinsicHash: Bytes.fill(32, 3),
    };
    const encoded = Encoder.encodeObject(headerCodec, elem);
    assert.deepStrictEqual(
      `${encoded}`,
```
