---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-utils.ts#L1-L129
title: packages/core/pvm-interpreter/ops/math-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: 179a6972234da6adf90b8138e56961f6536d04d5d4d1d2c9c177dea3b6a96bd5
language: typescript
---
`packages/core/pvm-interpreter/ops/math-utils.ts` (lines 1–129)

```typescript
import { MAX_VALUE_U32 } from "@typeberry/numbers";
import { check } from "@typeberry/utils";

/**
 * Overflowing addition for two-complement representation of 32-bit signed numbers.
 */
export function addWithOverflowU32(a: number, b: number) {
  if (a > MAX_VALUE_U32 - b) {
    /**
     * MAX_VALUE_U32 is equal to 2 ** 32 - 1
     * MAX_VALUE_U32 - ( (MAX_VALUE_U32 - a) + (MAX_VALUE_U32 - b) ) - 1
     * = MAX_VALUE_U32 - (2MAX_VALUE_U32 - a - b) -1
     * = MAX_VALUE_U32 - 2MAX_VALUE_U32 + a + b - 1
     * = a + b - MAX_VALUE_U32 - 1
     * = a + b - 2 ** 32
     * but we know that 2MAX_VALUE_U32 > a + b > MAX_VALUE_U32 so in this case:
     * a + b - 2 ** 32 <=> (a + b) % 2 ** 32
     * = (a + b) % (MAX_VALUE_U32 + 1)
     */
    const spaceToMaxA = MAX_VALUE_U32 - a;
    const spaceToMaxB = MAX_VALUE_U32 - b;
    const overflowSum = spaceToMaxA + spaceToMaxB;
    return MAX_VALUE_U32 - overflowSum - 1;
  }

  return a + b;
}

/**
 * Overflowing addition for two-complement representation of 64-bit signed numbers.
 */
export function addWithOverflowU64(a: bigint, b: bigint) {
  return (a + b) % 2n ** 64n;
}

/**
 * Overflowing subtraction for two-complement representation of 32-bit signed numbers.
 */
export function subU32(a: number, b: number) {
  if (b > a) {
    return MAX_VALUE_U32 - b + a + 1;
  }

  return a - b;
}

/**
 * Overflowing subtraction for two-complement representation of 64-bit signed numbers.
 */
export function subU64(a: bigint, b: bigint) {
  return (2n ** 64n + a - b) % 2n ** 64n;
}

const MUL_THRESHOLD = 2 ** 16;

/**
 * Efficiently multiply the two given numbers modulo 2**32 (i.e. lower 32-bit part of the multiplication).
 *
 * In case the numbers fit into 2**32 we simply calculate their multiplication.
 * In case the numbers are larger we split them into higher and lower bits
 * and perform the multiplication separately to make sure we don't overflow
 * the 2**32 and `MAX_SAFE_INTEGER`.
 */
export function mulLowerUnsignedU32(a: number, b: number) {
  if (a > MUL_THRESHOLD || b > MUL_THRESHOLD) {
    const aHigh = a >> 16;
    const aLow = a & 0xffff;
    const bHigh = b >> 16;
    const bLow = b & 0xffff;

    const lowLow = aLow * bLow;
    const lowHigh = aLow * bHigh;
    const highLow = aHigh * bLow;

    const carry = (lowLow >> 16) + (lowHigh & 0xffff) + (highLow & 0xffff);
    return (lowLow & 0xffff) | (carry << 16);
  }

  return a * b;
}

export function mulU64(a: bigint, b: bigint) {
  return (a * b) % 2n ** 64n;
}

/**
 * Multiply two unsigned 64-bit numbers and take the upper 64-bits of the result.
 *
 * The result of multiplication is a 64-bits number and we are only interested in the part that lands in the upper 32-bits.
 * For example if we multiply `0xffffffff * 0xffffffff`, we get:

 * |       64-bits      |       64-bits      |
 * +--------------------+--------------------+
 * |        upper       |        lower       |
 * | 0xfffffffffffffffe | 0x0000000000000001 |
 *
 * So `0xfffffffffffffffe` is returned.
 */
export function mulUpper(a: bigint, b: bigint) {
  return ((a * b) >> 64n) & 0xffff_ffff_ffff_ffffn;
}

function interpretAsSigned(value: bigint) {
  const unsignedLimit = 1n << 64n;
  const signedLimit = 1n << 63n;

  if (value >= signedLimit) {
    return value - unsignedLimit;
  }

  return value;
}

export function mulUpperUU(a: bigint, b: bigint) {
  const aUnsigned = a & 0xffff_ffff_ffff_ffffn;
  const bUnsigned = b & 0xffff_ffff_ffff_ffffn;
  return ((aUnsigned * bUnsigned) >> 64n) & 0xffff_ffff_ffff_ffffn;
}

export function mulUpperSU(a: bigint, b: bigint) {
  const bUnsigned = b & 0xffff_ffff_ffff_ffffn;
  const signedResult = (a * bUnsigned) >> 64n;
  const resultLimitedTo64Bits = signedResult & 0xffff_ffff_ffff_ffffn;
  return interpretAsSigned(resultLimitedTo64Bits);
}

export function mulUpperSS(a: bigint, b: bigint) {
  const signedResult = (a * b) >> 64n;
  const resultLimitedTo64Bits = signedResult & 0xffff_ffff_ffff_ffffn;
```
