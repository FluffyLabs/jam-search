---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/encoder.test.ts#L133-L258
title: packages/core/codec/encoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 1ced3b5c66cb0153d0749fb38037266da3ba1fa5a7541e74c4776177c7785bec
language: typescript
---
`packages/core/codec/encoder.test.ts` (lines 133–258)

```typescript
    assert.deepStrictEqual(encoder.viewResult().toString(), BytesBlob.parseBlob("0x4242d6ff0000").toString());
  });

  it("should encode a bunch of i8 numbers", () => {
    const encoder = Encoder.create();

    encoder.i8(0x42);
    encoder.i8(-42);
    encoder.i8(0);

    assert.deepStrictEqual(encoder.viewResult(), BytesBlob.parseBlob("0x42d600"));
  });

  it("should encode a bool", () => {
    const encoder = Encoder.create();

    encoder.bool(true);
    encoder.bool(false);

    assert.deepStrictEqual(encoder.viewResult(), BytesBlob.parseBlob("0x0100"));
  });
});

describe("JAM encoder / sizing", () => {
  it("should throw exception if destination is too small", () => {
    const encoder = Encoder.create({
      destination: new Uint8Array(2),
    });

    assert.throws(
      () => {
        encoder.i32(5);
      },
      {
        name: "Error",
        message: "Not enough space in the destination array. Needs 4, has 2.",
      },
    );
  });

  it("should extend the space", () => {
    const encoder = Encoder.create({
      expectedLength: 1,
    });

    encoder.i32(5);

    assert.deepStrictEqual(encoder.viewResult(), BytesBlob.parseBlob("0x05000000"));
  });
});

describe("JAM encoder / bitvec", () => {
  it("should encode a 1-byte bit vector", () => {
    const encoder = Encoder.create();
    // 1 byte long bit vec
    const bitvec = BitVec.empty(8);
    bitvec.setBit(0, true);
    bitvec.setBit(6, true);

    // when
    encoder.bitVecFixLen(bitvec);
    encoder.bitVecVarLen(bitvec);

    assert.deepStrictEqual(encoder.viewResult().toString(), "0x410841");
  });

  it("should encode a longer bit vector", () => {
    const encoder = Encoder.create();
    const bitvec = BitVec.empty(65);
    bitvec.setBit(0, true);
    bitvec.setBit(32, true);
    bitvec.setBit(63, true);
    bitvec.setBit(64, true);

    // when
    encoder.bitVecFixLen(bitvec);
    encoder.bitVecVarLen(bitvec);

    assert.deepStrictEqual(encoder.viewResult().toString(), "0x01000000010000800141010000000100008001");
  });
});

describe("JAM encoder / generics", () => {
  class MyType {
    z: Bytes<4>;
    constructor(
      public x: number,
      public y: boolean,
      z?: Bytes<4>,
    ) {
      this.z = z ?? Bytes.parseBytes("0xdeadbeef", 4);
    }

    static encode(encoder: Encoder, elem: MyType) {
      encoder.i32(elem.x);
      encoder.bool(elem.y);
      encoder.bytes(elem.z);
    }

    static sizeHint = { bytes: 4 + 1 + 4, isExact: true };
  }

  it("should encode an optional value", () => {
    const encoder = Encoder.create();

    encoder.optional(MyType, new MyType(3, true));
    encoder.optional(MyType, null);
    encoder.optional(MyType, null);
    encoder.optional(MyType, new MyType(5, false));

    assert.deepStrictEqual(encoder.viewResult().toString(), "0x010300000001deadbeef0000010500000000deadbeef");
  });

  it("should encode a sequence", () => {
    const encoder = Encoder.create();
    const seq = [new MyType(5, true), new MyType(7, true), new MyType(10, true)];

    encoder.sequenceVarLen(MyType, seq);
    encoder.sequenceFixLen(MyType, seq);

    assert.deepStrictEqual(
      encoder.viewResult().toString(),
      "0x030500000001deadbeef0700000001deadbeef0a00000001deadbeef0500000001deadbeef0700000001deadbeef0a00000001deadbeef",
    );
  });
});
```
