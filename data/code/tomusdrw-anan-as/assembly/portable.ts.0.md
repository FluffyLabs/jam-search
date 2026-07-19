---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/portable.ts#L1-L133'
title: assembly/portable.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 0
chunk_total: 3
content_sha: d76b1dff6d62f4dbfc1685ff67da1ea77cb73376e81ba0bb6347a3276df17df1
language: typescript
---
`assembly/portable.ts` (lines 1–133)

```typescript
// Runtime binding for TS decorator emit in portable JS builds.
const inline = (_target: i32 = 0, _propertyKey: i32 = 0, descriptor: i32 = 0): i32 => descriptor;

export class portable {
  // @ts-ignore: @inline is an AS-only decorator
  @inline
  static installPolyfills(): void {
    if (ASC_TARGET !== 0) {
      return;
    }

    // @ts-ignore: JS runtime only
    const g = globalThis as any;
    if (g.__ananPortablePolyfillsInstalled) {
      return;
    }
    g.__ananPortablePolyfillsInstalled = true;

    // StaticArray -> Array with AS-like zero-initialized length constructor.
    g.StaticArray = function StaticArray(length: number): any {
      const arr = new Array(length);
      arr.fill(0);
      return arr;
    };
    g.StaticArray.fromArray = (x: any[]) => x;

    g.ASC_TARGET = 0;

    g.i8 = (value: any): any => {
      const n = typeof value === "bigint" ? Number(value) : value;
      return (n << 24) >> 24;
    };

    g.i16 = (value: any): any => {
      const n = typeof value === "bigint" ? Number(value) : value;
      return (n << 16) >> 16;
    };

    const i32Fn = (value: any): any => {
      if (typeof value === "bigint") {
        return Number(BigInt.asIntN(32, value));
      }
      return value | 0;
    };
    i32Fn.MIN_VALUE = -2147483648;
    i32Fn.MAX_VALUE = 2147483647;
    g.i32 = i32Fn;

    const i64Fn = (value: any): any => {
      return BigInt.asIntN(64, BigInt(value));
    };
    i64Fn.MAX_VALUE = BigInt("9223372036854775807");
    i64Fn.MIN_VALUE = BigInt("-9223372036854775808");
    g.i64 = i64Fn;

    g.u8 = (v: any): any => {
      if (typeof v === "bigint") {
        return Number(v & BigInt(0xff)) >>> 0;
      }
      return (v & 0xff) >>> 0;
    };

    g.u16 = (v: any): any => {
      if (typeof v === "bigint") {
        return Number(v & BigInt(0xffff)) >>> 0;
      }
      return (v & 0xffff) >>> 0;
    };

    g.u32 = (v: any): any => {
      if (typeof v === "bigint") {
        return Number(v & BigInt(0xffff_ffff)) >>> 0;
      }
      return (v & 0xffff_ffff) >>> 0;
    };

    const u64Fn = (value: any): any => {
      return BigInt.asUintN(64, BigInt(value));
    };
    u64Fn.MAX_VALUE = BigInt("18446744073709551615");
    u64Fn.MIN_VALUE = BigInt(0);
    g.u64 = u64Fn;

    g.f32 = (v: any): any => Math.fround(v);
    g.f64 = (v: any): any => +v;
    g.bool = (v: any): any => !!v;

    const dataViewProto = DataView.prototype as any;
    if (!dataViewProto.setUint64) {
      dataViewProto.setUint64 = function (byteOffset: number, value: bigint, littleEndian?: boolean): void {
        const high = Number((value >> BigInt(32)) & BigInt(0xffff_ffff));
        const low = Number(value & BigInt(0xffff_ffff));
        if (littleEndian) {
          this.setUint32(byteOffset, low, true);
          this.setUint32(byteOffset + 4, high, true);
        } else {
          this.setUint32(byteOffset, high, false);
          this.setUint32(byteOffset + 4, low, false);
        }
      };
    }

    if (!dataViewProto.getUint64) {
      dataViewProto.getUint64 = function (byteOffset: number, littleEndian?: boolean): bigint {
        if (littleEndian) {
          const low = BigInt(this.getUint32(byteOffset, true));
          const high = BigInt(this.getUint32(byteOffset + 4, true));
          return (high << BigInt(32)) | low;
        }
        const high = BigInt(this.getUint32(byteOffset, false));
        const low = BigInt(this.getUint32(byteOffset + 4, false));
        return (high << BigInt(32)) | low;
      };
    }

    g.unchecked = (v: any): any => v;
    g.inline = inline;
    g.changetype = (v: any): any => v;
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
  // @ts-ignore: parameter type differs between AS and JS
  static asArray<T>(v: T[]): T[] {
    if (ASC_TARGET === 0) {
      // @ts-ignore: JS runtime - v is an iterator, convert to array
      return Array.from(v) as T[];
    }
    return v;
  }

  // @ts-ignore: @inline is an AS-only decorator
  @inline
```
