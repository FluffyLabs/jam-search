---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-utils.ts#L124-L159
title: packages/core/pvm-interpreter/ops/math-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: bdff307bede6097b27ae310d706825860552fa000ae88431402dbf0c065068bd
language: typescript
---
`packages/core/pvm-interpreter/ops/math-utils.ts` (lines 124–159)

```typescript
  return interpretAsSigned(resultLimitedTo64Bits);
}

export function mulUpperSS(a: bigint, b: bigint) {
  const signedResult = (a * b) >> 64n;
  const resultLimitedTo64Bits = signedResult & 0xffff_ffff_ffff_ffffn;
  return interpretAsSigned(resultLimitedTo64Bits);
}

export function unsignedRightShiftBigInt(value: bigint, shift: bigint): bigint {
  check`${shift >= 0} Shift count must be non-negative`;

  const fillBit = value < 0 ? "1" : "0";
  // Convert the BigInt to its binary representation
  const binaryRepresentation = value.toString(2).padStart(64, fillBit);

  // If the value is negative, emulate unsigned behavior
  const unsignedRepresentation = value < 0n ? (1n << BigInt(binaryRepresentation.length)) + value : value;

  // Perform the right shift
  return unsignedRepresentation >> shift;
}

export function maxBigInt(...args: bigint[]) {
  if (args.length === 0) {
    throw new Error("No arguments provided");
  }
  return args.reduce((max, current) => (current > max ? current : max));
}

export function minBigInt(...args: bigint[]) {
  if (args.length === 0) {
    throw new Error("No arguments provided");
  }
  return args.reduce((max, current) => (current < max ? current : max));
}
```
