---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/portable.ts#L125-L284'
title: assembly/portable.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 1
chunk_total: 3
content_sha: a47635db93ac4482cdb51477ac2da299e86227ed162f6a157481356a6f35a2a6
language: typescript
---
`assembly/portable.ts` (lines 125–284)

```typescript
    if (ASC_TARGET === 0) {
      // @ts-ignore: JS runtime - v is an iterator, convert to array
      return Array.from(v) as T[];
    }
    return v;
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static arrayAt<T>(v: T[], i: u32): T {
    if (ASC_TARGET === 0) {
      return v[i];
    }
    return unchecked(v[i]);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static staticArrayAt<T>(v: StaticArray<T>, i: u32): T {
    if (ASC_TARGET === 0) {
      return v[i];
    }
    return unchecked(v[i]);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static asU32(v: u32): u32 {
    if (ASC_TARGET === 0) {
      return v >>> 0;
    }
    return v;
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static uint8ArrayView(data: ArrayBuffer, offset: i32, length: i32): Uint8Array {
    if (ASC_TARGET === 0) {
      // @ts-ignore: JS runtime supports Uint8Array(buffer, offset, length)
      return new Uint8Array(data, offset, length);
    }
    // @ts-ignore: Uint8Array.wrap is an AS-only API
    return Uint8Array.wrap(data, offset, length);
  }

  // --- bswap ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static bswap_u16(v: u16): u16 {
    if (ASC_TARGET === 0) {
      return u16(((v & 0xff) << 8) | ((v >> 8) & 0xff));
    }
    return bswap<u16>(v);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static bswap_u32(v: u32): u32 {
    if (ASC_TARGET === 0) {
      return u32(((v & 0xff) << 24) | ((v & 0xff00) << 8) | ((v >> 8) & 0xff00) | ((v >> 24) & 0xff));
    }
    return bswap<u32>(v);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static bswap_u64(v: u64): u64 {
    if (ASC_TARGET === 0) {
      const lo = u32(v);
      const hi = u32(v >> u64(32));
      const sLo = portable.bswap_u32(lo);
      const sHi = portable.bswap_u32(hi);
      return u64((u64(sLo) << u64(32)) | u64(sHi));
    }
    return bswap<u64>(v);
  }

  // --- popcnt ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static popcnt_u32(v: u32): u32 {
    if (ASC_TARGET === 0) {
      v = v - ((v >>> 1) & 0x55555555);
      v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
      return (((v + (v >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
    }
    return popcnt<u32>(v);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static popcnt_u64(v: u64): u64 {
    if (ASC_TARGET === 0) {
      const lo = portable.popcnt_u32(u32(v));
      const hi = portable.popcnt_u32(u32(v >> u64(32)));
      return u64(lo + hi);
    }
    return popcnt<u64>(v);
  }

  // --- clz ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static clz_u32(v: u32): u32 {
    if (ASC_TARGET === 0) {
      // @ts-ignore: Math.clz32 exists in ES2015+
      return <u32>Math.clz32(v);
    }
    return clz<u32>(v);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static clz_u64(v: u64): u64 {
    if (ASC_TARGET === 0) {
      const hi = u32(v >> u64(32));
      if (hi !== 0) {
        return u64(portable.clz_u32(hi));
      }
      return u64(32 + portable.clz_u32(u32(v)));
    }
    return clz<u64>(v);
  }

  // --- ctz ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static ctz_u32(v: u32): u32 {
    if (ASC_TARGET === 0) {
      if (v === 0) return 32;
      // @ts-ignore: Math.clz32 exists in ES2015+
      return <u32>(31 - Math.clz32(v & -v));
    }
    return ctz<u32>(v);
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static ctz_u64(v: u64): u64 {
    if (ASC_TARGET === 0) {
      const lo = u32(v);
      if (lo !== 0) {
        return u64(portable.ctz_u32(lo));
      }
      return u64(32 + portable.ctz_u32(u32(v >> u64(32))));
    }
    return ctz<u64>(v);
  }

  // --- rotr ---

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static rotr_u32(v: u32, shift: u32): u32 {
    if (ASC_TARGET === 0) {
      shift &= 31;
```
