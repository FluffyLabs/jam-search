---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.test.ts#L323-L434
title: packages/core/erasure-coding/erasure-coding.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 3
chunk_total: 4
content_sha: a86d6050853f6202dfb972e7919b475d7ca53fa25acc3dbe16f2b8efe44bd24a
language: typescript
---
`packages/core/erasure-coding/erasure-coding.test.ts` (lines 323–434)

```typescript
      assert.deepStrictEqual(joined, input);
    }
  });
});

describe("erasure coding: unzip", async () => {
  it("should unzip data", () => {
    const test = [
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]),
        expected: [BytesBlob.blobFromNumbers([0x00, 0x02]), BytesBlob.blobFromNumbers([0x01, 0x03])],
        n: 2,
        k: 2,
      },
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
        expected: [Bytes.fromNumbers([0x00, 0x02, 0x04, 0x06], 4), Bytes.fromNumbers([0x01, 0x03, 0x05, 0x07], 4)],
        n: 4,
        k: 2,
      },
      {
        input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
        expected: [
          Bytes.fromNumbers([0x00, 0x04], 2),
          Bytes.fromNumbers([0x01, 0x05], 2),
          Bytes.fromNumbers([0x02, 0x06], 2),
          Bytes.fromNumbers([0x03, 0x07], 2),
        ],
        n: 2,
        k: 4,
      },
      {
        input: Bytes.zero(648),
        expected: [Bytes.zero(648)],
        k: 1,
        n: 648,
      },
      {
        input: BytesBlob.empty(),
        expected: [],
        k: 0,
        n: 648,
      },
    ];

    for (const { input, expected, n, k } of test) {
      const result = unzip(input, n, k);

      deepEqual([...result], expected);
    }
  });
});

describe("erasure coding: lace", async () => {
  it("should lace data", () => {
    const test = [
      {
        input: FixedSizeArray.new([Bytes.fromNumbers([0x00, 0x02], 2), Bytes.fromNumbers([0x01, 0x03], 2)], 2),
        expected: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]),
      },
      {
        input: FixedSizeArray.new(
          [Bytes.fromNumbers([0x00, 0x02, 0x04, 0x06], 4), Bytes.fromNumbers([0x01, 0x03, 0x05, 0x07], 4)],
          2,
        ),
        expected: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
      },
      {
        input: FixedSizeArray.new(
          [
            Bytes.fromNumbers([0x00, 0x04], 2),
            Bytes.fromNumbers([0x01, 0x05], 2),
            Bytes.fromNumbers([0x02, 0x06], 2),
            Bytes.fromNumbers([0x03, 0x07], 2),
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
      const result = lace(input);

      assert.strictEqual(`${result}`, `${expected}`);
    }
  });

  it("should unzip and lace data without a change", () => {
    const test = [
      { input: BytesBlob.blobFromNumbers([0x00, 0x01]), n: 1, k: 2 },
      { input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03]), n: 2, k: 2 },
      { input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]), n: 2, k: 4 },
      { input: BytesBlob.blobFromNumbers([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]), n: 4, k: 2 },
    ];

    for (const { input, n, k } of test) {
      const unzipped = unzip(input, n, k);
      const laced = lace(unzipped);

      assert.strictEqual(`${laced}`, `${input}`);
    }
  });
});
```
