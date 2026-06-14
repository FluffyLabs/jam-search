---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.ts#L324-L421
title: packages/core/erasure-coding/erasure-coding.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 3
chunk_total: 4
content_sha: b20b85023065938e98cc7e4f5d2e43f1c04167801ed4ff17392b7d8f55d9f435
language: typescript
---
`packages/core/erasure-coding/erasure-coding.ts` (lines 324–421)

```typescript
    for (let r = 0; r < n; r++) {
      const cell = input[r][c];
      newColumn.push(cell);
    }
    columns.push(FixedSizeArray.new(newColumn, n));
  }
  return FixedSizeArray.new(columns, k);
}

/**
 * `C`: Erasure-code chunking function which accepts an arbitrary sized data blob whose
 *       length divides wholly into `PIECE_SIZE` octets and results in `N_CHUNKS_TOTAL`
 *       sequences of sequences, each of `POINT_LENGTH * K` octets blobs.
 *       Where `K` is the number that divides input length by `PIECE_SIZE`.
 *
 *       Each element of resulting array is the same length.
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/3f15003f1500?v=0.6.6
 */
export function chunkingFunction(input: BytesBlob): FixedSizeArray<BytesBlob, N_CHUNKS_TOTAL> {
  const k = Math.floor(input.length / PIECE_SIZE);
  check`${k * PIECE_SIZE === input.length} Input length ${input.length} is not divisible by ${PIECE_SIZE}`;

  // we get a `k` pieces.
  const pieces = unzip<PIECE_SIZE, typeof k>(input, PIECE_SIZE, k);
  // and each piece get's ec-codec
  const points = pieces.map((p) => encodePoints(p));
  // hence we end up with a matrix of `points * k`
  type POINTS = FixedSizeArray<Bytes<POINT_LENGTH>, N_CHUNKS_TOTAL>;
  const pointsTyped: FixedSizeArray<POINTS, typeof k> = FixedSizeArray.new(points, k);
  // next we transpose the array, getting back an array of `N_CHUNKS_TOTAL` elements,
  // where each element is a `k` points (`Bytes<POINT_LENGTH>`).
  const transposed = transpose(pointsTyped, N_CHUNKS_TOTAL);
  // lastly we join each element of that resulting array
  // we get an array of `N_SHARDS_TOTAL` elements, each of length `POINT_LENGTH * k`.
  const chunks = transposed.map((c) => join(c));
  return FixedSizeArray.new(chunks, N_CHUNKS_TOTAL);
}

/** Split each validator's shard into numbered chunks it originally should have got. */
export function shardsToChunks(spec: ChainSpec, shards: PerValidator<BytesBlob>): PerValidator<[number, BytesBlob][]> {
  const result: [number, BytesBlob][][] = [];

  const shardSize = shards[0].length;
  check`
    ${shards.every((s) => s.length === shardSize)}
    Each shard must be the same length!
  `;

  const totalData = shards.map((s) => s.length).reduce((sum, sLength) => sum + sLength, 0);
  const chunkSize = Math.floor(totalData / N_CHUNKS_TOTAL);
  const piecesPerChunk = Math.floor(shardSize / chunkSize);

  let currentChunk = 0;
  for (const s of shards) {
    const validatorChunks: [number, BytesBlob][] = [];
    for (let i = 0; i < piecesPerChunk; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const chunk = BytesBlob.blobFrom(s.raw.subarray(start, end));
      // TODO [ToDr] we may possibly have not enough data for some of the chunk here
      if (chunk.length === chunkSize) {
        validatorChunks.push([currentChunk, chunk]);
      }

      currentChunk = (currentChunk + 1) % N_CHUNKS_TOTAL;
    }
    result.push(validatorChunks);
  }

  return tryAsPerValidator(result, spec);
}

/** Divide chunks between validators. */
export function chunksToShards(
  spec: ChainSpec,
  chunks: FixedSizeArray<BytesBlob, N_CHUNKS_TOTAL>,
): PerValidator<BytesBlob> {
  const result: BytesBlob[] = [];

  const allChunks = BytesBlob.blobFromParts(chunks.map((c) => c.raw));
  const shardSize = allChunks.length / N_CHUNKS_TOTAL;

  // wrap around the data to have enough
  const bytesToDrawFrom = BytesBlob.blobFromParts(allChunks.raw, allChunks.raw);
  const bytesPerValidator = Math.ceil(allChunks.length / spec.validatorsCount);
  // align number of bytes to the shard length.
  const alignedBytesPerValidator = Math.ceil(bytesPerValidator / shardSize) * shardSize;

  for (let i = 0; i < spec.validatorsCount; i++) {
    const start = i * alignedBytesPerValidator;
    const end = start + alignedBytesPerValidator;

    result.push(BytesBlob.blobFrom(bytesToDrawFrom.raw.subarray(start, end)));
  }

  return tryAsPerValidator(result, spec);
}
```
