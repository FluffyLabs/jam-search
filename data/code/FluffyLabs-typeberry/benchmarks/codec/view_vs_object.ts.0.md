---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/view_vs_object.ts#L1-L140
title: benchmarks/codec/view_vs_object.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: b8103f285a32f5df57b5c22b79338733cfbaa50ca27cb46b5d0aa21891b6c602
language: typescript
---
`benchmarks/codec/view_vs_object.ts` (lines 1–140)

```typescript
import assert from "node:assert";
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";
import { Bytes } from "@typeberry/bytes";
import { type CodecRecord, codec, Decoder, type DescribedBy, Encoder } from "@typeberry/codec";
import { tryAsU64, type U64 } from "@typeberry/numbers";

class TestHeader {
  static Codec = codec.Class(TestHeader, {
    blockNumber: codec.varU64,
    parentHeaderHash: codec.bytes(32),
    priorStateRoot: codec.bytes(32),
    extrinsicHash: codec.bytes(32),
  });

  static create(o: CodecRecord<TestHeader>) {
    return new TestHeader(o);
  }

  public readonly blockNumber: U64;
  public readonly parentHeaderHash: Bytes<32>;
  public readonly priorStateRoot: Bytes<32>;
  public readonly extrinsicHash: Bytes<32>;

  private constructor(o: CodecRecord<TestHeader>) {
    this.blockNumber = o.blockNumber;
    this.parentHeaderHash = o.parentHeaderHash;
    this.priorStateRoot = o.priorStateRoot;
    this.extrinsicHash = o.extrinsicHash;
  }
}

class TestBlock {
  static Codec = codec.Class(TestBlock, {
    extrinsic: codec.sequenceFixLen(codec.bytes(128), 10),
    header1: TestHeader.Codec,
    header2: TestHeader.Codec,
  });

  static create(o: CodecRecord<TestBlock>) {
    return new TestBlock(o);
  }

  public readonly extrinsic: Bytes<128>[];
  public readonly header1: TestHeader;
  public readonly header2: TestHeader;

  private constructor(o: CodecRecord<TestBlock>) {
    this.extrinsic = o.extrinsic;
    this.header1 = o.header1;
    this.header2 = o.header2;
  }
}

const encoder = Encoder.create();
const parentHeaderHash = Bytes.fill(32, 1);
const priorStateRoot = Bytes.fill(32, 5);
const extrinsicHash = Bytes.fill(32, 0x42);
const testHeader = TestHeader.create({
  blockNumber: tryAsU64(10_000_000n),
  parentHeaderHash,
  priorStateRoot,
  extrinsicHash,
});
const testExtrinsic = Array(10).fill(Bytes.fill(128, 0x69));

TestBlock.Codec.encode(
  encoder,
  TestBlock.create({
    header1: testHeader,
    header2: testHeader,
    extrinsic: testExtrinsic,
  }),
);

const encodedData = encoder.viewResult();

function compare(
  name: string,
  runView: (view: DescribedBy<typeof TestBlock.Codec.View>) => void,
  runBlock?: (block: TestBlock) => void,
) {
  const res = [
    add(`Get ${name} from View`, () => {
      const view = TestBlock.Codec.View.decode(Decoder.fromBytesBlob(encodedData));
      runView(view);
    }),
  ];

  if (runBlock !== undefined) {
    res.unshift(
      add(`Get ${name} from Decoded`, () => {
        const header = TestBlock.Codec.decode(Decoder.fromBytesBlob(encodedData));
        runBlock(header);
      }),
    );
  }

  return res;
}

export default function run() {
  return suite(
    "Codec Views",

    ...compare(
      "the first field",
      (view) => {
        assert.deepStrictEqual(view.header2.view().blockNumber.materialize(), 10_000_000n);
      },
      (block) => {
        assert.deepStrictEqual(block.header2.blockNumber, 10_000_000n);
      },
    ),

    ...compare("the first field as view", (view) => {
      assert.deepStrictEqual(view.header2.view().blockNumber.view(), 10_000_000n);
    }),

    ...compare(
      "two fields",
      (view) => {
        const headerView = view.header2.view();
        assert.deepStrictEqual(headerView.blockNumber.materialize(), 10_000_000n);
        return headerView.priorStateRoot.materialize();
      },
      (block) => {
        assert.deepStrictEqual(block.header2.blockNumber, 10_000_000n);
        return block.header2.priorStateRoot;
      },
    ),

    ...compare("two fields from materialized", (view) => {
      const headerView = view.header2.materialize();
      assert.deepStrictEqual(headerView.blockNumber, 10_000_000n);
      return headerView.priorStateRoot;
    }),

    ...compare("two fields as views", (view) => {
      const headerView = view.header2.view();
```
