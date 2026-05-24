---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.test.ts#L115-L217
title: packages/core/erasure-coding/erasure-coding.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 26757029f25a9234248ca4f8df3988c13a5f695d4c3812601925de7059ac0b7c
language: typescript
---
`packages/core/erasure-coding/erasure-coding.test.ts` (lines 115–217)

```typescript
    const shards = wp_shards.map<[number, Bytes<2>]>((chunk, idx) => [idx, Bytes.parseBytesNoPrefix(chunk, 2)]);
    const selectedShards = getRandomItems(shards, N_CHUNKS_REQUIRED);

    const decoded = decodeData(selectedShards);

    assert.deepStrictEqual(`${decoded}`, `0x${wp_data}`);
  });

  it(`should encode and decode segment data without a change (random seed: ${seed})`, () => {
    const segments = padAndEncodeData(BytesBlob.parseBlobNoPrefix(seg_data));
    const shards = segments.map<[number, BytesBlob]>((chunk, idx) => [idx, chunk]);
    const selectedShards = getRandomItems(shards, N_CHUNKS_REQUIRED);
    const decoded = decodeData(selectedShards);

    assert.deepStrictEqual(`${decoded}`, `0x${seg_data}`);
  });

  it(`should encode and decode workpackage data without a change (random seed: ${seed})`, () => {
    const segments = padAndEncodeData(BytesBlob.parseBlobNoPrefix(wp_data));
    const shards = segments.map<[number, BytesBlob]>((chunk, idx) => [idx, chunk]);
    const selectedShards = getRandomItems(shards, 342);
    const decoded = decodeData(selectedShards);

    assert.deepStrictEqual(`${decoded}`, `0x${wp_data}`);
  });
});

describe("erasure coding: tiny", async () => {
  const wp_data = WORKPACKAGE_TINY.data as string;
  const wp_shards = WORKPACKAGE_TINY.shards;
  const seg_data = SEGMENT_TINY.data as string;
  const seg_shards = SEGMENT_TINY.shards;

  seed = Math.floor(1000 * Math.random());

  it("should encode segment data", () => {
    const segments = chunksToShards(tinyChainSpec, padAndEncodeData(BytesBlob.parseBlobNoPrefix(seg_data)));
    const expected: PerValidator<BytesBlob> = tryAsPerValidator(
      seg_shards.map(BytesBlob.parseBlobNoPrefix),
      tinyChainSpec,
    );

    assert.deepStrictEqual(segments.length, expected.length);
    deepEqual(segments, expected);
  });

  it(`should decode segment data (random seed: ${seed})`, () => {
    const segments: PerValidator<BytesBlob> = tryAsPerValidator(
      seg_shards.map(BytesBlob.parseBlobNoPrefix),
      tinyChainSpec,
    );
    const shards = shardsToChunks(tinyChainSpec, segments);

    // slicing to remove duplicates
    const selectedShards = getRandomItems(shards.flat().slice(0, 1023), 342);

    const decoded = decodeData(selectedShards);

    deepEqual(`${decoded}`, `0x${seg_data}`);
  });

  it("should encode workpackage data", () => {
    const segments = chunksToShards(tinyChainSpec, padAndEncodeData(BytesBlob.parseBlobNoPrefix(wp_data)));
    const expected: PerValidator<BytesBlob> = tryAsPerValidator(
      wp_shards.map(BytesBlob.parseBlobNoPrefix),
      tinyChainSpec,
    );

    deepEqual(segments, expected);
  });

  it(`should decode workpackage data (random seed: ${seed})`, () => {
    const shards = shardsToChunks(
      tinyChainSpec,
      tryAsPerValidator(wp_shards.map(BytesBlob.parseBlobNoPrefix), tinyChainSpec),
    );

    // slicing to remove duplicates
    const selectedShards = getRandomItems(shards.flat().slice(0, 1023), 342);

    const decoded = decodeData(selectedShards);

    assert.strictEqual(`${decoded}`, `0x${wp_data}`);
  });

  it(`should encode and decode segment data without a change (random seed: ${seed})`, () => {
    const segments = chunksToShards(tinyChainSpec, padAndEncodeData(BytesBlob.parseBlobNoPrefix(seg_data)));
    const shards = shardsToChunks(tinyChainSpec, segments);
    // slicing to remove duplicates
    const selectedShards = getRandomItems(shards.flat().slice(0, 1023), 342);
    const decoded = decodeData(selectedShards);

    assert.strictEqual(`${decoded}`, `0x${seg_data}`);
  });

  it(`should encode and decode workpackage data without a change (random seed: ${seed})`, () => {
    const shards = padAndEncodeData(BytesBlob.parseBlobNoPrefix(wp_data)).map<[number, BytesBlob]>((shard, idx) => [
      idx,
      shard,
    ]);
    const selectedShards = getRandomItems(shards, 342);
    const decoded = decodeData(selectedShards);

```
