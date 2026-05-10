---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/portable.ts#L274-L355'
title: assembly/portable.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-08T13:25:50+02:00'
last_modified: '2026-05-08T13:25:50+02:00'
chunk_index: 2
chunk_total: 3
content_sha: aa23267b8554c2a06657ed472c6f459f05c36e744830949c0ffdbf92fc4d483b
language: typescript
---
`assembly/portable.ts` (lines 274–355)

```typescript
    }
    return ctz<u64>(v);
  }

  // --- rotr ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static rotr_u32(v: u32, shift: u32): u32 {
    if (ASC_TARGET === 0) {
      shift &= 31;
      return u32((v >>> shift) | (v << (32 - shift)));
    }
    return rotr<u32>(v, shift);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static rotr_u64(v: u64, shift: u64): u64 {
    if (ASC_TARGET === 0) {
      shift &= u64(63);
      return u64((v >> shift) | (v << (u64(64) - shift)));
    }
    return rotr<u64>(v, shift);
  }

  // --- rotl ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static rotl_u32(v: u32, shift: u32): u32 {
    if (ASC_TARGET === 0) {
      shift &= 31;
      return u32((v << shift) | (v >>> (32 - shift)));
    }
    return rotl<u32>(v, shift);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static rotl_u64(v: u64, shift: u64): u64 {
    if (ASC_TARGET === 0) {
      shift &= u64(63);
      return u64((v << shift) | (v >> (u64(64) - shift)));
    }
    return rotl<u64>(v, shift);
  }

  // --- u64 wrapping arithmetic ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static u64_add(a: u64, b: u64): u64 {
    if (ASC_TARGET === 0) {
      // @ts-ignore: BigInt
      return BigInt.asUintN(64, BigInt(a) + BigInt(b));
    }
    return a + b;
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static u64_sub(a: u64, b: u64): u64 {
    if (ASC_TARGET === 0) {
      // @ts-ignore: BigInt
      return BigInt.asUintN(64, BigInt(a) - BigInt(b));
    }
    return a - b;
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static u64_mul(a: u64, b: u64): u64 {
    if (ASC_TARGET === 0) {
      // @ts-ignore: BigInt
      return BigInt.asUintN(64, BigInt(a) * BigInt(b));
    }
    return a * b;
  }
}

portable.installPolyfills();
```
