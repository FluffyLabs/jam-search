---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.test.ts#L1-L122
title: packages/core/erasure-coding/erasure-coding.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 4
content_sha: ee8b2d6ec1bd295ede978f16707fd8a9667c0348f6779d61511a34d14bdd7f69
language: typescript
---
`packages/core/erasure-coding/erasure-coding.test.ts` (lines 1–122)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { type PerValidator, tryAsPerValidator } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { FixedSizeArray } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
// NOTE: we can't initialize `wasm` from `@typeberry/crypto`, because
// for some reason this dependency is not not de-duplicated.
import { init } from "@typeberry/native";
import { deepEqual } from "@typeberry/utils";
import { SEGMENT_FULL, SEGMENT_TINY, TEST_DATA, WORKPACKAGE_FULL, WORKPACKAGE_TINY } from "./ec-test-data.js";
import {
  checkConsistency,
  chunksToShards,
  decodeData,
  decodePiece,
  encodePoints,
  join,
  lace,
  N_CHUNKS_REQUIRED,
  POINT_LENGTH,
  padAndEncodeData,
  shardsToChunks,
  split,
  unzip,
} from "./erasure-coding.js";

let seed = 1;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomItems<T, N extends number>(arr: [number, T][], n: N): FixedSizeArray<[number, T], N> {
  if (n > arr.length) {
    throw new Error("Requested more items than available in the array");
  }

  const result: [number, T][] = [];
  const copy = [...arr];

  for (let i = 0; i < n; i++) {
    const randomIndex = i + Math.floor(random() * (copy.length - i));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
    result.push(copy[i]);
  }

  return FixedSizeArray.new(result, n);
}

before(async () => await init.reedSolomon());

describe("erasure coding: general", async () => {
  const data = TEST_DATA.data as string;
  const segmentEc = TEST_DATA.segment.segments[0].segment_ec;

  seed = Math.floor(1000 * Math.random());

  it("should check consistency", () => {
    checkConsistency();
  });

  it("should encode data", () => {
    const encoded = encodePoints(Bytes.parseBytesNoPrefix(data, 684));
    const expected = segmentEc.map((x) => Bytes.parseBytesNoPrefix(x, 2));

    assert.deepStrictEqual([...encoded], expected);
  });

  it(`should decode data (random seed: ${seed})`, () => {
    const shards = segmentEc.map<[number, Bytes<POINT_LENGTH>]>((chunk, idx) => [
      idx,
      Bytes.parseBytesNoPrefix(chunk, POINT_LENGTH),
    ]);
    const selectedShards = FixedSizeArray.new(getRandomItems(shards, N_CHUNKS_REQUIRED), N_CHUNKS_REQUIRED);

    const decoded = decodePiece(selectedShards);

    assert.strictEqual(`${decoded}`, `0x${data}`);
  });
});

describe("erasure coding: full", async () => {
  const wp_data = WORKPACKAGE_FULL.data as string;
  const wp_shards = WORKPACKAGE_FULL.shards;
  const seg_data = SEGMENT_FULL.data as string;
  const seg_shards = SEGMENT_FULL.shards;

  seed = Math.floor(1000 * Math.random());

  it("should encode segment data", () => {
    const encoded = padAndEncodeData(BytesBlob.parseBlobNoPrefix(seg_data));
    const expected = seg_shards.map(BytesBlob.parseBlobNoPrefix);

    deepEqual([...encoded], expected);
  });

  it(`should decode segment data (random seed: ${seed})`, () => {
    const shards = seg_shards.map<[number, Bytes<12>]>((chunk, idx) => [idx, Bytes.parseBytesNoPrefix(chunk, 12)]);
    const selectedShards = getRandomItems(shards, N_CHUNKS_REQUIRED);

    const decoded = decodeData(selectedShards);

    assert.deepStrictEqual(`${decoded}`, `0x${seg_data}`);
  });

  it("should encode workpackage data", () => {
    const encoded = padAndEncodeData(BytesBlob.parseBlobNoPrefix(wp_data));
    const expected = wp_shards.map(BytesBlob.parseBlobNoPrefix);

    deepEqual([...encoded], expected);
  });

  it(`should decode workpackage data (random seed: ${seed})`, () => {
    const shards = wp_shards.map<[number, Bytes<2>]>((chunk, idx) => [idx, Bytes.parseBytesNoPrefix(chunk, 2)]);
    const selectedShards = getRandomItems(shards, N_CHUNKS_REQUIRED);

    const decoded = decodeData(selectedShards);

    assert.deepStrictEqual(`${decoded}`, `0x${wp_data}`);
  });

```
