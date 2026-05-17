---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/portable/types/assemblyscript.d.ts#L1-L90
title: portable/types/assemblyscript.d.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1dee21d0c15924630edf39e439ba16b7495309afdf20d75256f92bcba9318eef
language: typescript
---
`portable/types/assemblyscript.d.ts` (lines 1–90)

```typescript
// Custom AssemblyScript type declarations for the portable (JS) build.
// Uses permissive types to allow number/bigint mixing that AS allows natively.

type ASNumber = number | bigint;
type ASPrimitive = ASNumber | boolean;

// AS numeric types in portable runtime.
type i8 = number;
type i16 = number;
type i32 = number;
type i64 = number;
type u8 = number;
type u16 = number;
type u32 = number;
type u64 = number;
type isize = number;
type usize = number;
type f32 = number;
type f64 = number;
type bool = boolean;

// AS built-in functions (provided by assemblyscript/std/portable at runtime)
declare function bswap<T>(value: T): T;
declare function clz<T>(value: T): T;
declare function ctz<T>(value: T): T;
declare function popcnt<T>(value: T): T;
declare function rotl<T>(value: T, shift: T): T;
declare function rotr<T>(value: T, shift: T): T;
declare function abs<T>(value: T): T;
declare function max<T>(left: T, right: T): T;
declare function min<T>(left: T, right: T): T;
declare function select<T>(ifTrue: T, ifFalse: T, condition: bool): T;
declare function unreachable(): never;
declare function changetype<T>(value: unknown): T;
declare function unchecked<T>(value: T): T;
declare function assert<T>(isTrueish: T, message?: string): T;
declare const inline: MethodDecorator;

// AS target constant
declare const ASC_TARGET: i32;

// Type cast functions with static constants
declare function i8(value: ASPrimitive): i8;
declare function i16(value: ASPrimitive): i16;

interface I32Cast {
  (value: ASPrimitive): i32;
  MIN_VALUE: i32;
  MAX_VALUE: i32;
}
declare var i32: I32Cast;

interface I64Cast {
  (value: ASPrimitive): i64;
  MIN_VALUE: i64;
  MAX_VALUE: i64;
}
declare var i64: I64Cast;

declare function u8(value: ASPrimitive): u8;
declare function u16(value: ASPrimitive): u16;
declare function u32(value: ASPrimitive): u32;

interface U64Cast {
  (value: ASPrimitive): u64;
  MAX_VALUE: u64;
  MIN_VALUE: u64;
}
declare var u64: U64Cast;

declare function f32(value: ASPrimitive): f32;
declare function f64(value: ASPrimitive): f64;
declare function bool(value: ASPrimitive): bool;

// StaticArray - alias for Array in JS
interface StaticArray<T> extends Array<T> {}
interface StaticArrayConstructor {
  new <T>(length: number): StaticArray<T>;
  fromArray<T>(arr: T[]): StaticArray<T>;
}
declare const StaticArray: StaticArrayConstructor;

// DataView extensions
interface DataView {
  setUint64(byteOffset: number, value: u64, littleEndian?: boolean): void;
  getUint64(byteOffset: number, littleEndian?: boolean): u64;
}

// MapIterator - in AS this returns an array, in JS it's an iterator
type MapIterator<T> = IterableIterator<T> | T[];
```
