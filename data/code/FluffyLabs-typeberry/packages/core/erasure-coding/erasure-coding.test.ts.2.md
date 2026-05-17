---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.test.ts#L211-L332
title: packages/core/erasure-coding/erasure-coding.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 4
content_sha: 08d7e1366715998310a3c5743b4288e4da6a1679cabecb3b30d18412e56ad626
language: typescript
---
`packages/core/erasure-coding/erasure-coding.test.ts` (lines 211–332)

```typescript
    const shards = padAndEncodeData(BytesBlob.parseBlobNoPrefix(wp_data)).map<[number, BytesBlob]>((shard, idx) => [
      idx,
      shard,
    ]);
    const selectedShards = getRandomItems(shards, 342);
    const decoded = decodeData(selectedShards);

    assert.strictEqual(`${decoded}`, `0x${wp_data}`);
  });
});

describe("erasure coding: split", async () => {
  it("should split data", () => {
    const test = [
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]),
        expected: [Bytes.fromNumbers([0x00, 0x01], 2), Bytes.fromNumbers([0x02, 0x03], 2)],
        size: 2,
      },
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
        expected: [Bytes.fromNumbers([0x00, 0x01, 0x02, 0x03], 4), Bytes.fromNumbers([0x04, 0x05, 0x06, 0x07], 4)],
        size: 4,
      },
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
        expected: [
          Bytes.fromNumbers([0x00, 0x01], 2),
          Bytes.fromNumbers([0x02, 0x03], 2),
          Bytes.fromNumbers([0x04, 0x05], 2),
          Bytes.fromNumbers([0x06, 0x07], 2),
        ],
        size: 2,
      },
      {
        input: BytesBlob.blobFrom(new Uint8Array(648)),
        expected: [Bytes.zero(648)],
        size: 648,
      },
      {
        input: BytesBlob.empty(),
        expected: [],
        size: 648,
      },
    ];

    for (const { input, expected, size } of test) {
      const result = split(input, size, input.length / size);

      assert.deepStrictEqual([...result], expected);
    }
  });
});

describe("erasure coding: join", async () => {
  it("should join data", () => {
    const test = [
      {
        input: FixedSizeArray.new([Bytes.fromNumbers([0x00, 0x01], 2), Bytes.fromNumbers([0x02, 0x03], 2)], 2),
        expected: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]),
      },
      {
        input: FixedSizeArray.new(
          [Bytes.fromNumbers([0x00, 0x01, 0x02, 0x03], 4), Bytes.fromNumbers([0x04, 0x05, 0x06, 0x07], 4)],
          2,
        ),
        expected: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
      },
      {
        input: FixedSizeArray.new(
          [
            Bytes.fromNumbers([0x00, 0x01], 2),
            Bytes.fromNumbers([0x02, 0x03], 2),
            Bytes.fromNumbers([0x04, 0x05], 2),
            Bytes.fromNumbers([0x06, 0x07], 2),
          ],
          4,
        ),
        expected: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
      },
      {
        input: FixedSizeArray.new([Bytes.zero(648)], 1),
        expected: BytesBlob.blobFrom(new Uint8Array(648)),
      },
      {
        input: FixedSizeArray.new([], 0),
        expected: BytesBlob.empty(),
      },
    ];

    for (const { input, expected } of test) {
      const result = join(input);

      assert.deepStrictEqual(result.length, expected.length);
      assert.deepStrictEqual(result, expected);
    }
  });

  it("should split and join data without a change", () => {
    const test = [
      { input: BytesBlob.blobFromNumbers([0x00, 0x01]), n: 1, k: 2 },
      { input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]), k: 4, n: 1 },
      { input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]), k: 2, n: 4 },
      { input: BytesBlob.blobFrom(new Uint8Array(648)), k: 648, n: 1 },
      { input: BytesBlob.blobFrom(new Uint8Array(1)), k: 1, n: 1 },
    ];

    for (const { input, n, k } of test) {
      const splitted = split(input, n, k);
      const joined = join(splitted);

      assert.deepStrictEqual(joined.length, input.length);
      assert.deepStrictEqual(joined, input);
    }
  });
});

describe("erasure coding: unzip", async () => {
  it("should unzip data", () => {
    const test = [
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]),
```
