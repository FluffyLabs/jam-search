---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/index.ts#L117-L143
title: packages/core/numbers/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 05e92bba584ba69df7e7a1be73b5ec4458fef4369ca8479015cf23d4b024b41f
language: typescript
---
`packages/core/numbers/index.ts` (lines 117–143)

```typescript
    overflow ||= prev > sum;
  }

  return { overflow, value: tryAsU32(sum) };
}

/**
 * Transform provided U32 number to little-endian representation.
 */
export function u32AsLeBytes(value: U32): Uint8Array {
  return new Uint8Array([value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff]);
}

/**
 * Interpret 4-byte `Uint8Array` as U32 written as little endian.
 */
export function leBytesAsU32(uint8Array: Uint8Array): U32 {
  check`${uint8Array.length === 4} Input must be a Uint8Array of length 4`;
  // >>> 0 is needed to avoid changing sign of the number (the `<< 24` produces a signed int32)
  return asTypedNumber((uint8Array[0] | (uint8Array[1] << 8) | (uint8Array[2] << 16) | (uint8Array[3] << 24)) >>> 0);
}

/** Get the smallest value between U64 a and values given as input parameters. */
export const minU64 = (a: U64, ...values: U64[]): U64 => values.reduce((min, value) => (value > min ? min : value), a);

/** Get the biggest value between U64 a and values given as input parameters. */
export const maxU64 = (a: U64, ...values: U64[]): U64 => values.reduce((max, value) => (value < max ? max : value), a);
```
