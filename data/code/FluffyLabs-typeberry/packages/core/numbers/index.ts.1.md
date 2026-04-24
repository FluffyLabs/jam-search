---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/index.ts#L117-L142
title: packages/core/numbers/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7f7aea7e690408c579fa868688e7382c53a65227babfa68c7909467338e70866
language: typescript
---
`packages/core/numbers/index.ts` (lines 117–142)

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
  return asTypedNumber(uint8Array[0] | (uint8Array[1] << 8) | (uint8Array[2] << 16) | (uint8Array[3] << 24));
}

/** Get the smallest value between U64 a and values given as input parameters. */
export const minU64 = (a: U64, ...values: U64[]): U64 => values.reduce((min, value) => (value > min ? min : value), a);

/** Get the biggest value between U64 a and values given as input parameters. */
export const maxU64 = (a: U64, ...values: U64[]): U64 => values.reduce((max, value) => (value < max ? max : value), a);
```
