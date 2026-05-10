---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.test.ts#L450-L493
title: packages/core/codec/descriptors.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 4
chunk_total: 5
content_sha: 0f1be0c62d8631f176cc25c36f14e7f6fa6049bab56ec1accb527870edb81f49
language: typescript
---
`packages/core/codec/descriptors.test.ts` (lines 450–493)

```typescript
    const encoded = Encoder.encodeObject(MemoryDataCodec, input);
    const decoded = Decoder.decodeObject(MemoryDataCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    // Variant index 0 (varU32) + value 42 (u32)
    assert.deepStrictEqual(`${encoded}`, "0x002a000000");
  });

  it("should encode/decode union with second variant (Data)", () => {
    const input: MemoryData = { kind: DataKind.Data, value: BytesBlob.blobFromString("test") };

    const encoded = Encoder.encodeObject(MemoryDataCodec, input);
    const decoded = Decoder.decodeObject(MemoryDataCodec, encoded);

    assert.deepStrictEqual(decoded, input);
    // Variant index 1 (varU32) + length 4 (varU32) + "test"
    assert.deepStrictEqual(`${encoded}`, "0x010474657374");
  });

  it("should handle multiple encode/decode cycles", () => {
    const inputs: MemoryData[] = [
      { kind: DataKind.Length, value: tryAsU32(100) },
      { kind: DataKind.Data, value: BytesBlob.blobFromString("hello") },
      { kind: DataKind.Length, value: tryAsU32(0) },
      { kind: DataKind.Data, value: BytesBlob.blobFromString("") },
    ];

    for (const input of inputs) {
      const encoded = Encoder.encodeObject(MemoryDataCodec, input);
      const decoded = Decoder.decodeObject(MemoryDataCodec, encoded);
      assert.deepStrictEqual(decoded, input);
    }
  });

  it("should throw on unknown variant index during decode", () => {
    const encoder = Encoder.create();
    encoder.varU32(tryAsU32(99)); // Invalid variant index

    const encoded = encoder.viewResult();
    assert.throws(() => {
      Decoder.decodeObject(MemoryDataCodec, encoded);
    }, /Unknown variant index: 99/);
  });
});
```
