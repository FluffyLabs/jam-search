---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.test.ts#L341-L454
title: packages/core/codec/descriptors.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 55f6c061b88cf3ef92fa33919e77d4e65709e907c5df6025e77b72a93c174cc9
language: typescript
---
`packages/core/codec/descriptors.test.ts` (lines 341–454)

```typescript
      a: codec.varU32,
      b: codec.bool,
    });

    static create({ a, b }: CodecRecord<Concrete>) {
      return new Concrete(a, b);
    }

    toString() {
      return `${this.a} ${this.b}`;
    }
  }

  it("should encode/decode concrete instance of generic class", () => {
    const input = new Concrete(tryAsU32(15), true);
    const encoded = Encoder.encodeObject(Concrete.Codec, input);
    const decoded = Decoder.decodeObject(Concrete.Codec, encoded);

    assert.deepStrictEqual(decoded, input);
  });
});

describe("Codec Descriptors / dictionary", () => {
  it("should encode/decode a dictionary", () => {
    const input = new Map<U32, Bytes<32>>();
    input.set(tryAsU32(10), Bytes.fill(32, 10));
    input.set(tryAsU32(1), Bytes.fill(32, 1));
    input.set(tryAsU32(15), Bytes.fill(32, 15));

    const dictCodec = codec.dictionary(codec.u32, codec.bytes(32), {
      sortKeys: (a, b) => a - b,
    });

    const encoded = Encoder.encodeObject(dictCodec, input);
    const decoded = Decoder.decodeObject(dictCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    assert.deepStrictEqual(
      `${encoded}`,
      "0x030100000001010101010101010101010101010101010101010101010101010101010101010a0000000a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0f0000000f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f",
    );
  });

  it("should encode/decode a known-length dictionary", () => {
    const input = new Map<U32, Bytes<32>>();
    input.set(tryAsU32(10), Bytes.fill(32, 10));
    input.set(tryAsU32(1), Bytes.fill(32, 1));
    input.set(tryAsU32(15), Bytes.fill(32, 15));

    const dictCodec = codec.dictionary(codec.u32, codec.bytes(32), {
      sortKeys: (a, b) => a - b,
      fixedLength: 3,
    });

    const encoded = Encoder.encodeObject(dictCodec, input);
    const decoded = Decoder.decodeObject(dictCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    assert.deepStrictEqual(
      `${encoded}`,
      "0x0100000001010101010101010101010101010101010101010101010101010101010101010a0000000a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0f0000000f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f",
    );
  });

  it("should encode/decode 0-length dictionary", () => {
    const input = new Map<U32, Bytes<32>>();

    const dictCodec = codec.dictionary(codec.u32, codec.bytes(32), {
      sortKeys: (a, b) => a - b,
      fixedLength: 0,
    });

    const encoded = Encoder.encodeObject(dictCodec, input);
    const decoded = Decoder.decodeObject(dictCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    assert.deepStrictEqual(`${encoded}`, "0x");
  });
});

describe("Codec Descriptors / pair", () => {
  it("should encode/decode a pair", () => {
    const input: [U32, BytesBlob] = [tryAsU32(1245), BytesBlob.blobFromString("hello world!")];
    const pairCodec = codec.pair(codec.u32, codec.blob);

    const encoded = Encoder.encodeObject(pairCodec, input);
    const decoded = Decoder.decodeObject(pairCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    assert.deepStrictEqual(`${encoded}`, "0xdd0400000c68656c6c6f20776f726c6421");
  });
});

describe("Codec Descriptors / union", () => {
  enum DataKind {
    Length = 0,
    Data = 1,
  }

  type MemoryData = { kind: DataKind.Length; value: U32 } | { kind: DataKind.Data; value: BytesBlob };

  const MemoryDataCodec = codec.union<DataKind, MemoryData>("MemoryData", {
    [DataKind.Length]: codec.object({ value: codec.u32 }),
    [DataKind.Data]: codec.object({ value: codec.blob }),
  });

  it("should encode/decode union with first variant (Length)", () => {
    const input: MemoryData = { kind: DataKind.Length, value: tryAsU32(42) };

    const encoded = Encoder.encodeObject(MemoryDataCodec, input);
    const decoded = Decoder.decodeObject(MemoryDataCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    // Variant index 0 (varU32) + value 42 (u32)
```
