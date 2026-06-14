---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.test.ts#L471-L592
title: packages/core/codec/decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 4
chunk_total: 5
content_sha: 8ab58d5a91203f73f0c5eff50e3a4ff210952f602e292188cfbe88c81b2e5ea0
language: typescript
---
`packages/core/codec/decoder.test.ts` (lines 471–592)

```typescript
    const input = BytesBlob.parseBlob("0x410841");
    const decoder = Decoder.fromBytesBlob(input);

    // when
    const bitvec1 = decoder.bitVecFixLen(8);
    const bitvec2 = decoder.bitVecVarLen();
    decoder.finish();

    // then
    const expected = BitVec.empty(8);
    expected.setBit(0, true);
    expected.setBit(6, true);

    assert.deepStrictEqual(bitvec1, expected);
    assert.deepStrictEqual(bitvec2, expected);
  });

  it("should decode a longer bit vector", () => {
    const input = BytesBlob.parseBlob("0x01000000010000800141010000000100008001");
    const decoder = Decoder.fromBytesBlob(input);

    // when
    const bitvec1 = decoder.bitVecFixLen(65);
    const bitvec2 = decoder.bitVecVarLen();
    decoder.finish();

    // then
    const expected = BitVec.empty(65);
    expected.setBit(0, true);
    expected.setBit(32, true);
    expected.setBit(63, true);
    expected.setBit(64, true);

    assert.deepStrictEqual(bitvec1, expected);
    assert.deepStrictEqual(bitvec2, expected);
  });

  it("should fail if remaining bits are set", () => {
    const input = BytesBlob.parseBlob("0x010000000100008011");
    const decoder = Decoder.fromBytesBlob(input);

    // when
    assert.throws(() => decoder.bitVecFixLen(65), {
      name: "Error",
      message: "Non-zero bits found in the last byte of bitvec encoding.",
    });
  });
});

describe("JAM decoder / generics", () => {
  class MyType {
    constructor(
      public x: number,
      public y: boolean,
      public z: Bytes<4>,
    ) {}

    static decode(decoder: Decoder): MyType {
      const x = decoder.i32();
      const y = decoder.bool();
      const z = decoder.bytes(4);

      return new MyType(x, y, z);
    }
  }

  it("should decode an optional value", () => {
    const input = BytesBlob.parseBlob("0x010300000001deadbeef0000010500000000deadbeef");
    const decoder = Decoder.fromBytesBlob(input);

    const results = [
      decoder.optional(MyType),
      decoder.optional(MyType),
      decoder.optional(MyType),
      decoder.optional(MyType),
    ];
    decoder.finish();

    assert.deepStrictEqual(results, [
      new MyType(3, true, Bytes.parseBytes("0xdeadbeef", 4)),
      null,
      null,
      new MyType(5, false, Bytes.parseBytes("0xdeadbeef", 4)),
    ]);
  });

  it("should decode a sequence", () => {
    const input = BytesBlob.parseBlob(
      "0x030500000001deadbeef0700000001deadbeef0a00000001deadbeef0500000001deadbeef0700000001deadbeef0a00000001deadbeef",
    );
    const decoder = Decoder.fromBytesBlob(input);

    const result1 = decoder.sequenceVarLen(MyType);
    const result2 = decoder.sequenceFixLen(MyType, 3);
    decoder.finish();

    const bytes = Bytes.parseBytes("0xdeadbeef", 4);
    const expected = [new MyType(5, true, bytes), new MyType(7, true, bytes), new MyType(10, true, bytes)];

    assert.deepStrictEqual(result1, expected);
    assert.deepStrictEqual(result2, expected);
  });
});

describe("JAM decoder / decodeSequence", () => {
  const data = ["is", "there", "anybody", "out", "there", "?"];
  const encodedData = Encoder.encodeObject(codec.sequenceFixLen(codec.string, data.length), data);

  it("should decode a sequence of unknown length", () => {
    assert.deepStrictEqual(Decoder.decodeSequence(codec.string, encodedData), data);
  });

  it("should throw an error when data is invalid", () => {
    const invalidData = BytesBlob.parseBlob("0xf60587061670964567267744557f1270333e84696620669775705265f6");
    assert.throws(() => Decoder.decodeSequence(codec.string, invalidData), Error);
  });

  it("should throw an error when there's extra data past valid data", () => {
    const dataWithExtraData = Bytes.parseBlob(`${encodedData.toString()}deadbeef`);
    assert.throws(() => Decoder.decodeSequence(codec.string, dataWithExtraData), Error);
  });
});
```
