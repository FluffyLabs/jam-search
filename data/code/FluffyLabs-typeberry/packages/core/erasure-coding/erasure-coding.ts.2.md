---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/erasure-coding.ts#L200-L333
title: packages/core/erasure-coding/erasure-coding.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 4
content_sha: be9315032c351eff416fee889279f5b72243a8e6d493aa0f0eb41d73aeccfb04
language: typescript
---
`packages/core/erasure-coding/erasure-coding.ts` (lines 200–333)

```typescript
    const pointIndex = i * POINT_ALIGNMENT;
    for (let j = 0; j < POINT_LENGTH; j++) {
      result.raw[resultIndex + j] = resultData[pointIndex + j * HALF_POINT_SIZE];
    }
  }

  return result;
}

/**
 * `split`: Takes a single BytesBlob and divides it into sequential,
 * contiguous Bytes of a given size.
 *
 * Opposite of `join`.
 *
 * Input: [a0, a1, a2, a3, a4, a5], n = 2, k = 3
 *
 * Output: [[a0, a1], [a2, a3], [a4, a5]]
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/3eb4013eb401?v=0.6.6
 */
export function split<N extends number, K extends number>(input: BytesBlob, n: N, k: K): FixedSizeArray<Bytes<N>, K> {
  check`${n * k === input.length}`;
  const result: Bytes<N>[] = [];
  for (let i = 0; i < k; i++) {
    const start = i * n;
    const bytes = Bytes.zero(n);
    bytes.raw.set(input.raw.subarray(start, start + n));
    result[i] = bytes;
  }
  return FixedSizeArray.new(result, k);
}

/**
 * `join`: Takes an array of Bytes and concatenates them sequentially
 * (one after another) into a single BytesBlob.
 *
 * The resulting blob has length of `N * K`.
 *
 * Opposite of `split`.
 *
 * Input: [[a0, a1], [a2, a3], [a4, a5]]
 *
 * Output: [a0, a1, a2, a3, a4, a5]
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/3ed4013ed401?v=0.6.6
 */

export function join<N extends number, K extends number>(input: FixedSizeArray<Bytes<N>, K>): BytesBlob {
  return BytesBlob.blobFromParts(input.map((x) => x.raw));
}

/**
 * `unzip`: Reorganizes the data by de-interleaving: it takes every `K-th` byte
 * for each of output Bytes, where `K` is the number of output Bytes
 * and `N` is the size of each output Bytes.
 *
 * Opposite of `lace`.
 *
 * Input: [a0, b0, c0, a1, b1, c1], n = 2, k = 3
 *
 * Output: [[a0, a1], [b0, b1], [c0, c1]]
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/3e06023e0602?v=0.6.6
 */
export function unzip<N extends number, K extends number>(input: BytesBlob, n: N, k: K): FixedSizeArray<Bytes<N>, K> {
  const result = Array.from({ length: k }, () => Bytes.zero(n));
  for (let i = 0; i < k; i++) {
    const entry = result[i].raw;
    for (let j = 0; j < n; j++) {
      entry[j] = input.raw[j * k + i];
    }
  }
  return FixedSizeArray.new(result, k);
}

/**
 * `lace`: Takes an array of Bytes and interleaves:
 * it takes the first Byte from each, then the second byte from
 * each, etc., producing a single BytesBlob.
 *
 * Opposite of `unzip`.
 *
 * Input: [[a0, a1], [b0, b1], [c0, c1]]
 *
 * Output: [a0, b0, c0, a1, b1, c1]
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/3e2a023e2a02?v=0.6.6
 */
export function lace<N extends number, K extends number>(input: FixedSizeArray<Bytes<N>, K>): BytesBlob {
  const k = input.length;
  if (k === 0) {
    return BytesBlob.empty();
  }
  const n = input[0].length;
  const result = BytesBlob.blobFrom(safeAllocUint8Array(k * n));
  for (let i = 0; i < k; i++) {
    const entry = input[i].raw;
    for (let j = 0; j < n; j++) {
      result.raw[j * k + i] = entry[j];
    }
  }
  return result;
}

/**
 * `T`: Transposing function which accepts an array of `K` pieces of data
 * which each have same lenght of `N` octets and returns an array of `N`
 * pieces of data which each have length of `K` octets.
 *
 * T[[x0,0, x0,1, x0,2, . . . ], [x1,0, x1,1, . . . ], . . . ] ≡
 * [[x0,0, x1,0, x2,0, . . . ], [x0,1, x1,1, . . . ], . . . ]
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/3e2e023e2e02?v=0.6.6
 */
export function transpose<T, N extends number, K extends number>(
  input: FixedSizeArray<FixedSizeArray<T, K>, N>,
  k: K,
): FixedSizeArray<FixedSizeArray<T, N>, K> {
  const n = input.fixedLength;
  const columns: FixedSizeArray<T, N>[] = [];

  for (let c = 0; c < k; c++) {
    const newColumn: T[] = [];
    for (let r = 0; r < n; r++) {
      const cell = input[r][c];
      newColumn.push(cell);
    }
    columns.push(FixedSizeArray.new(newColumn, n));
  }
  return FixedSizeArray.new(columns, k);
}

/**
```
