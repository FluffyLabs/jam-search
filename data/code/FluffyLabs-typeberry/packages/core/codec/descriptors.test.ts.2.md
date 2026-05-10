---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.test.ts#L220-L353
title: packages/core/codec/descriptors.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 5
content_sha: d98d80774e1ed6c09ea11c9c3002b4b59e2ef6b952f2a258daa08d035957be6d
language: typescript
---
`packages/core/codec/descriptors.test.ts` (lines 220–353)

```typescript

    static create(o: CodecRecord<TestBlock>) {
      return new TestBlock(o.someUnrelatedField, o.header, o.extrinsic);
    }

    private constructor(
      public readonly someUnrelatedField: U32,
      public readonly header: TestHeader,
      public readonly extrinsic: TestExtrinsic,
    ) {}
  }

  const testData = () => {
    const encoder = Encoder.create();
    // field
    encoder.i32(0xdeadbeef);

    // Header
    const parentHeaderHash = Bytes.zero(32);
    encoder.bytes(parentHeaderHash);
    const priorStateRoot = Bytes.fill(32, 1);
    encoder.bytes(priorStateRoot);
    const extrinsicHash = Bytes.fill(32, 5);
    encoder.bytes(extrinsicHash);

    // Extrinsic
    codec.string.encode(encoder, "hello world!");

    return {
      bytes: encoder.viewResult(),
      parentHeaderHash,
      priorStateRoot,
      extrinsicHash,
    };
  };

  it("should decode nested structures", () => {
    // when
    const data = testData();
    const block = Decoder.decodeObject(TestBlock.Codec, data.bytes);

    // then
    assert.strictEqual(block.someUnrelatedField, 0xdeadbeef);

    const header = block.header;
    assert.strictEqual(`${header.parentHeaderHash}`, `${data.parentHeaderHash}`);
    assert.strictEqual(`${header.priorStateRoot}`, `${data.priorStateRoot}`);
    assert.strictEqual(`${header.extrinsicHash}`, `${data.extrinsicHash}`);

    assert.deepStrictEqual(block.extrinsic, TestExtrinsic.create({ kind: "hello world!" }));
  });

  it("should encode in the same way", () => {
    // given
    const blockBytes = testData().bytes;
    const block = Decoder.decodeObject(TestBlock.Codec, blockBytes);
    const blockView = Decoder.decodeObject(TestBlock.Codec.View, blockBytes);

    // when
    const encoded = Encoder.encodeObject(TestBlock.Codec, block);

    // then
    assert.strictEqual(`${encoded}`, `${blockBytes}`);
    assert.strictEqual(`${blockView.encoded()}`, `${blockBytes}`);
  });

  it("should return a nested view", () => {
    // given
    const data = testData();
    const blockView = Decoder.decodeObject(TestBlock.Codec.View, data.bytes);

    // when
    const headerView = blockView.header.view();

    // then
    assert.strictEqual(`${headerView.extrinsicHash.view()}`, `${data.extrinsicHash}`);
    assert.strictEqual(`${headerView.priorStateRoot.materialize()}`, `${data.priorStateRoot}`);
  });

  it("should return encoded data of the nested view", () => {
    // given
    const data = testData();
    const blockView = Decoder.decodeObject(TestBlock.Codec.View, data.bytes);
    const block = Decoder.decodeObject(TestBlock.Codec, data.bytes);
    const headerEncoded = Encoder.encodeObject(TestHeader.Codec, block.header);

    // when
    const headerView = blockView.header.view();

    // then
    assert.strictEqual(`${headerView.encoded()}`, `${headerEncoded}`);
  });

  it("should create a view after field was decoded", () => {
    // given
    const data = testData();
    const blockView = Decoder.decodeObject(TestBlock.Codec.View, data.bytes);

    // when
    const header = blockView.header.materialize();
    const headerView = blockView.header.view();

    // then
    assert.strictEqual(`${header.extrinsicHash}`, `${data.extrinsicHash}`);
    assert.strictEqual(`${header.priorStateRoot}`, `${data.priorStateRoot}`);
    // view?
    assert.strictEqual(`${headerView.extrinsicHash.materialize()}`, `${data.extrinsicHash}`);
    assert.strictEqual(`${headerView.priorStateRoot.materialize()}`, `${data.priorStateRoot}`);
  });
});

describe("Codec Descriptors / generic class", () => {
  abstract class Generic<A, B> {
    constructor(
      public readonly a: A,
      public readonly b: B,
    ) {}
  }

  class Concrete extends Generic<U32, boolean> {
    static Codec = codec.Class(Concrete, {
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

```
