---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/erasure-coding.ts#L1-L80
title: bin/test-runner/w3f/erasure-coding.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f1c61c90002f61dd0641993f3eee2c8e4676b352746f0a57e86749832baa8931
language: typescript
---
`bin/test-runner/w3f/erasure-coding.ts` (lines 1–80)

```typescript
import { it } from "node:test";

import type { PerValidator } from "@typeberry/block";
import { fromJson } from "@typeberry/block-json";
import type { BytesBlob } from "@typeberry/bytes";
import { FixedSizeArray } from "@typeberry/collections";
import {
  chunksToShards,
  decodeDataAndTrim,
  initEc,
  N_CHUNKS_REQUIRED,
  N_CHUNKS_TOTAL,
  padAndEncodeData,
  shardsToChunks,
} from "@typeberry/erasure-coding";
import { type FromJson, json } from "@typeberry/json-parser";
import { check, deepEqual } from "@typeberry/utils";
import type { RunOptions } from "../common.js";

export class EcTest {
  static fromJson: FromJson<EcTest> = {
    data: fromJson.bytesBlobNoPrefix,
    shards: json.array(fromJson.bytesBlobNoPrefix),
  };

  data!: BytesBlob;
  shards!: PerValidator<BytesBlob>;
}

export async function runEcTest(test: EcTest, { chainSpec: spec }: RunOptions) {
  await initEc();

  it("should encode data & decode it back", () => {
    const shards = padAndEncodeData(test.data);
    const segments = chunksToShards(spec, shards);
    const shardsBack = shardsToChunks(spec, segments);

    const allShards = shardsBack.flat();
    check`${allShards.length >= N_CHUNKS_TOTAL} since we have data from all validators, we must have them all`;
    const start = N_CHUNKS_REQUIRED / 2;
    // get a bunch of shards to recover from
    const selectedShards = FixedSizeArray.new(allShards.slice(start, start + N_CHUNKS_REQUIRED), N_CHUNKS_REQUIRED);
    const decoded = decodeDataAndTrim(selectedShards, test.data.length);

    deepEqual(decoded, test.data);
  });

  it("should decode from the first 1/3 of shards", () => {
    const shards = shardsToChunks(spec, test.shards);
    const allShards = shards.flat();
    const selectedShards = FixedSizeArray.new(allShards.slice(0, N_CHUNKS_REQUIRED), N_CHUNKS_REQUIRED);
    const ourSelectedShards = (() => {
      const shards = padAndEncodeData(test.data);
      const segments = chunksToShards(spec, shards);
      const shardsBack = shardsToChunks(spec, segments).flat();
      return FixedSizeArray.new(shardsBack.slice(0, N_CHUNKS_REQUIRED), N_CHUNKS_REQUIRED);
    })();
    deepEqual(selectedShards, ourSelectedShards);
    const decoded = decodeDataAndTrim(selectedShards, test.data.length);

    deepEqual(decoded, test.data);
  });

  it("should exactly match the test encoding", () => {
    const shards = padAndEncodeData(test.data);
    const segments = chunksToShards(spec, shards);

    deepEqual(segments, test.shards);
  });

  it("should decode from random 1/3 of shards", () => {
    const shards = shardsToChunks(spec, test.shards);
    const allShards = shards.flat();
    const start = N_CHUNKS_REQUIRED / 2;
    const selectedShards = FixedSizeArray.new(allShards.slice(start, start + N_CHUNKS_REQUIRED), N_CHUNKS_REQUIRED);
    const decoded = decodeDataAndTrim(selectedShards, test.data.length);

    deepEqual(decoded, test.data);
  });
}
```
