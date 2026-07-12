---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.ts#L101-L209
title: packages/core/erasure-coding/erasure-coding.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 4
content_sha: d4895e9a226d4d0aa801820a4b7997267433c262e85113fa80c49730c4f94652
language: typescript
---
`packages/core/erasure-coding/erasure-coding.ts` (lines 101–209)

```typescript
    ${input.every(([_idx, point]) => point.length === pointBytes)},
    Every piece must have the same length!
  `;

  const pieces = FixedSizeArray.fill(() => Bytes.zero(PIECE_SIZE), points);

  for (let i = 0; i < points; i++) {
    const start = i * POINT_LENGTH;
    const pieceChunks = input.map<[number, Bytes<POINT_LENGTH>]>(([index, piece]) => [
      index,
      // this is split?
      Bytes.fromBlob(piece.raw.subarray(start, start + POINT_LENGTH), POINT_LENGTH),
    ]);

    pieces[i] = decodePiece(FixedSizeArray.new(pieceChunks, N_CHUNKS_REQUIRED));
  }

  return lace(pieces);
}

/**
 *  Erasure-encoding function. Takes exactly `PIECE_SIZE` data and generate `N_CHUNKS_TOTAL` points.
 *
 *  https://graypaper.fluffylabs.dev/#/9a08063/3e4e013e5a01?v=0.6.6
 */
export function encodePoints(input: Bytes<PIECE_SIZE>): FixedSizeArray<Bytes<POINT_LENGTH>, N_CHUNKS_TOTAL> {
  const result: Bytes<POINT_LENGTH>[] = [];
  const data = safeAllocUint8Array(POINT_ALIGNMENT * N_CHUNKS_REQUIRED);

  // add original shards to the result
  for (let i = 0; i < N_CHUNKS_REQUIRED; i++) {
    const pointStart = POINT_LENGTH * i;
    result.push(Bytes.fromBlob(input.raw.subarray(pointStart, pointStart + POINT_LENGTH), POINT_LENGTH));
    // fill array that will be passed to wasm lib
    for (let j = 0; j < POINT_LENGTH; j++) {
      data[i * POINT_ALIGNMENT + j * HALF_POINT_SIZE] = input.raw[pointStart + j];
    }
  }

  // encode and add redundancy shards
  const points = new reedSolomon.ShardsCollection(POINT_ALIGNMENT, data);
  const encodedResult = reedSolomon.encode(N_CHUNKS_REDUNDANCY, points);
  const encodedData = encodedResult.take_data();

  for (let i = 0; i < N_CHUNKS_REDUNDANCY; i++) {
    const pointIndex = i * POINT_ALIGNMENT;

    const redundancyPoint = safeAllocUint8Array(POINT_LENGTH);
    for (let j = 0; j < POINT_LENGTH; j++) {
      redundancyPoint[j] = encodedData[pointIndex + j * HALF_POINT_SIZE];
    }
    result.push(Bytes.fromBlob(redundancyPoint, POINT_LENGTH));
  }

  return FixedSizeArray.new(result, N_CHUNKS_TOTAL);
}

/**
 * The function takes exactly `N_CHUNKS_REQUIRED` chunks to recover the original piece.
 *
 * NOTE the piece may contain padding, so it should be trimmed externally.
 */
export function decodePiece(
  input: FixedSizeArray<[number, Bytes<POINT_LENGTH>], N_CHUNKS_REQUIRED>,
): Bytes<PIECE_SIZE> {
  const result = Bytes.zero(PIECE_SIZE);

  const data = safeAllocUint8Array(N_CHUNKS_REQUIRED * POINT_ALIGNMENT);
  const indices = new Uint16Array(input.length);

  for (let i = 0; i < N_CHUNKS_REQUIRED; i++) {
    const [index, points] = input[i];
    const pointStart = i * POINT_ALIGNMENT;
    for (let j = 0; j < POINT_LENGTH; j++) {
      data[pointStart + j * HALF_POINT_SIZE] = points.raw[j];
    }
    indices[i] = index;
    if (index < N_CHUNKS_REQUIRED) {
      // fill original shards in result
      const pointStartInResult = POINT_LENGTH * index;
      result.raw.set(points.raw, pointStartInResult);
    }
  }
  const points = new reedSolomon.ShardsCollection(POINT_ALIGNMENT, data, indices);

  const decodingResult = reedSolomon.decode(N_CHUNKS_REQUIRED, N_CHUNKS_REDUNDANCY, points);
  const resultIndices = decodingResult.take_indices(); // it has to be called before take_data
  const resultData = decodingResult.take_data(); // it destroys the result object in rust

  if (resultIndices === undefined) {
    throw new Error("indices array in decoded result must exist!");
  }

  check`${resultData.length === resultIndices.length * POINT_ALIGNMENT} incorrect length of data or indices!`;

  for (let i = 0; i < resultIndices.length; i++) {
    // fill reconstructed shards in result
    const index = resultIndices[i];
    const resultIndex = POINT_LENGTH * index;
    const pointIndex = i * POINT_ALIGNMENT;
    for (let j = 0; j < POINT_LENGTH; j++) {
      result.raw[resultIndex + j] = resultData[pointIndex + j * HALF_POINT_SIZE];
    }
  }

  return result;
}

/**
```
