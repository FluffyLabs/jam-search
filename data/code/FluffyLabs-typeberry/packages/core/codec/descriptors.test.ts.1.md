---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.test.ts#L113-L226
title: packages/core/codec/descriptors.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 5
content_sha: 46be69ff2fd9a8da0880f40cf73757de98bb8696d55262abf5bdeb275d3d68f3
language: typescript
---
`packages/core/codec/descriptors.test.ts` (lines 113–226)

```typescript
      parentHeaderHash: Bytes.fill(32, 1),
      priorStateRoot: Bytes.fill(32, 2),
      extrinsicHash: Bytes.fill(32, 3),
    };
    const encoded = Encoder.encodeObject(headerCodec, elem);
    assert.deepStrictEqual(
      `${encoded}`,
      "0x010101010101010101010101010101010101010101010101010101010101010102020202020202020202020202020202020202020202020202020202020202020303030303030303030303030303030303030303030303030303030303030303",
    );

    const decoded = Decoder.decodeObject(headerCodec, encoded);
    assert.deepStrictEqual(decoded, elem);
  });
});

describe("Codec Descriptors / class", () => {
  const testData = () => {
    const encoder = Encoder.create();
    const parentHeaderHash = Bytes.zero(32);
    encoder.bytes(parentHeaderHash);

    const priorStateRoot = Bytes.fill(32, 1);
    encoder.bytes(priorStateRoot);

    const extrinsicHash = Bytes.fill(32, 5);
    encoder.bytes(extrinsicHash);

    return {
      bytes: encoder.viewResult(),
      parentHeaderHash,
      priorStateRoot,
      extrinsicHash,
    };
  };

  it("should create a lazy view", () => {
    // given
    const data = testData();

    const headerView = Decoder.decodeObject(TestHeader.Codec.View, data.bytes);
    assert.deepStrictEqual(headerView.parentHeaderHash.view(), data.parentHeaderHash);
    assert.deepStrictEqual(headerView.extrinsicHash.view(), data.extrinsicHash);
    assert.deepStrictEqual(headerView.priorStateRoot.view(), data.priorStateRoot);
    // now this should come from cache
    assert.deepStrictEqual(headerView.parentHeaderHash.materialize(), data.parentHeaderHash);
    assert.deepStrictEqual(headerView.extrinsicHash.materialize(), data.extrinsicHash);
    assert.deepStrictEqual(headerView.priorStateRoot.materialize(), data.priorStateRoot);
    assert.deepStrictEqual(headerView.encoded(), data.bytes);
  });

  it("should materialize a lazy view", () => {
    // given
    const data = testData();

    const headerView = Decoder.decodeObject(TestHeader.Codec.View, data.bytes);
    // read one data point to have something in cache, but not everything
    assert.deepStrictEqual(headerView.parentHeaderHash.view(), data.parentHeaderHash);

    const header = headerView.materialize();
    assert.deepStrictEqual(header.parentHeaderHash, data.parentHeaderHash);
    assert.deepStrictEqual(header.extrinsicHash, data.extrinsicHash);
    assert.deepStrictEqual(header.priorStateRoot, data.priorStateRoot);
    assert.deepStrictEqual(headerView.encoded(), data.bytes);
  });

  it("should decode a class", () => {
    // given
    const data = testData();

    const header = Decoder.decodeObject(TestHeader.Codec, data.bytes);

    assert.deepStrictEqual(header.parentHeaderHash, data.parentHeaderHash);
    assert.deepStrictEqual(header.extrinsicHash, data.extrinsicHash);
    assert.deepStrictEqual(header.priorStateRoot, data.priorStateRoot);
  });

  it("should encode a class", () => {
    // given
    const data = testData();
    const header = new TestHeader(data.parentHeaderHash, data.priorStateRoot, data.extrinsicHash);

    const result = Encoder.encodeObject(TestHeader.Codec, header);

    assert.deepStrictEqual(result, data.bytes);
    assert.deepStrictEqual(TestHeader.Codec.sizeHint, { bytes: 3 * 32, isExact: true });
  });
});

describe("Codec Descriptors / nested views", () => {
  class TestExtrinsic {
    static Codec = codec.Class(TestExtrinsic, {
      kind: codec.string,
    });

    static create(o: CodecRecord<TestExtrinsic>) {
      return new TestExtrinsic(o.kind);
    }

    private constructor(public kind: string) {}
  }

  class TestBlock {
    static Codec = codec.Class(TestBlock, {
      someUnrelatedField: codec.u32,
      header: TestHeader.Codec,
      extrinsic: TestExtrinsic.Codec,
    });

    static create(o: CodecRecord<TestBlock>) {
      return new TestBlock(o.someUnrelatedField, o.header, o.extrinsic);
    }

    private constructor(
      public readonly someUnrelatedField: U32,
```
