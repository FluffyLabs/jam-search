---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/utils.ts#L1-L94
title: assembly/instructions/utils.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5e9ebaf5c8981bbe2dd229203f689c9c2eada41dae43303da25145f0117a4185
language: typescript
---
`assembly/instructions/utils.ts` (lines 1–94)

```typescript
import { portable } from "../portable";
import { NO_OF_REGISTERS } from "../registers";

/**
 * Multiply two unsigned 64-bit numbers and take the upper 64-bits of the result.
 *
 * The result of multiplication is a 128-bits number and we are only interested in the part that lands in the upper 64-bits.
 * For example (for 32-bit case) if we multiply `0xffffffff * 0xffffffff`, we get:

 * |   32-bits  |   32-bits  |
 * +------------+------------+
 * |    upper   |    lower   |
 * | 0xfffffffe | 0x00000001 |
 *
 * So `0xfffffffe` is returned.
 */
export function mulUpperUnsigned(a: u64, b: u64): u64 {
  const aHigh: u64 = a >> u64(32);
  const aLow: u64 = a & u64(0xffff_ffff);
  const bHigh: u64 = b >> u64(32);
  const bLow: u64 = b & u64(0xffff_ffff);

  const lowLow = portable.u64_mul(aLow, bLow);
  const lowHigh = portable.u64_mul(aLow, bHigh);
  const highLow = portable.u64_mul(aHigh, bLow);
  const highHigh = portable.u64_mul(aHigh, bHigh);
  const carry = portable.u64_add(
    portable.u64_add(lowLow >> u64(32), lowHigh & u64(0xffff_ffff)),
    highLow & u64(0xffff_ffff),
  );

  return portable.u64_add(
    portable.u64_add(portable.u64_add(highHigh, lowHigh >> u64(32)), highLow >> u64(32)),
    carry >> u64(32),
  );
}

/**
 * Same as [mulUpperUnsigned] but treat the arguments as signed (two-complement) 64-bit numbers and the result alike.
 */
export function mulUpperSigned(a: i64, b: i64): u64 {
  let isResultNegative = false;
  let aAbs = a;
  let bAbs = b;
  if (a < i64(0)) {
    isResultNegative = !isResultNegative;
    aAbs = portable.u64_add(~a, i64(1));
  }
  if (b < i64(0)) {
    isResultNegative = !isResultNegative;
    bAbs = portable.u64_add(~b, i64(1));
  }

  if (isResultNegative) {
    const upper = mulUpperUnsigned(aAbs, bAbs);
    const lower = portable.u64_mul(aAbs, bAbs);
    return portable.u64_add(~upper, lower === u64(0) ? u64(1) : u64(0));
  }

  return mulUpperUnsigned(aAbs, bAbs);
}

export function mulUpperSignedUnsigned(a: i64, b: u64): u64 {
  if (a < i64(0)) {
    const aAbs: u64 = portable.u64_add(~a, u64(1));
    const upper = mulUpperUnsigned(aAbs, b);
    const lower = portable.u64_mul(aAbs, b);
    return portable.u64_add(~upper, lower === u64(0) ? u64(1) : u64(0));
  }
  return mulUpperUnsigned(a, b);
}

export class Inst {
  @inline
  static u8SignExtend(v: u8): i64 {
    // u64 wrap ensures unsigned representation in JS BigInt (no-op in AS)
    return u64(i64(i32(i16(i8(v)))));
  }

  @inline
  static u16SignExtend(v: u16): i64 {
    return u64(i64(i32(i16(v))));
  }

  @inline
  static u32SignExtend(v: u32): i64 {
    return u64(i64(i32(v)));
  }

  @inline
  static reg(v: u64): u32 {
    return v >= u64(NO_OF_REGISTERS) ? NO_OF_REGISTERS - 1 : u32(v);
  }
}
```
