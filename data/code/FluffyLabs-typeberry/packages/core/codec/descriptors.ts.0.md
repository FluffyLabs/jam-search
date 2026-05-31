---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.ts#L1-L155
title: packages/core/codec/descriptors.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 6
content_sha: a591ce322675201d8c6c824f17e8c6fac553acec09e1effb6a8919efd0a3ceac
language: typescript
---
`packages/core/codec/descriptors.ts` (lines 1–155)

```typescript
import { type BitVec, Bytes, BytesBlob } from "@typeberry/bytes";
import { tryAsU32, type U8, type U16, type U32, type U64 } from "@typeberry/numbers";
import { check } from "@typeberry/utils";
import { type Decoder, EndOfDataError } from "./decoder.js";
import {
  type ClassConstructor,
  type CodecRecord,
  Descriptor,
  type DescriptorRecord,
  type OptionalRecord,
  type SimpleDescriptorRecord,
} from "./descriptor.js";
import { addSizeHints, type Encoder, type SizeHint } from "./encoder.js";
import { type Skip, Skipper } from "./skip.js";
import { type LengthRange, validateLength } from "./validation.js";
import { ObjectView, SequenceView, type ViewField, type ViewOf } from "./view.js";

/**
 * For sequences with unknown length we need to give some size hint.
 * TODO [ToDr] [opti] This value should be updated when we run some real-data bechmarks.
 */
const TYPICAL_SEQUENCE_LENGTH = 64;
/**
 * For the size hint for encoding typical dictionaries.
 * TODO [ToDr] [opti] This value should be updated when we run some real-data bechmarks.
 */
export const TYPICAL_DICTIONARY_LENGTH = 32;

/**
 * Convert a descriptor for regular array into readonly one.
 *
 * NOTE: for performance reasons we assume that every `readonly T[]` is `T[]`,
 *       and the `readonly` annotation is there just to prevent altering it.
 *       It's not true in a general case, but should be good enough for us.
 *
 */
export function readonlyArray<T, V>(desc: Descriptor<T[], V>): Descriptor<readonly T[], V> {
  return desc.convert(
    (x) => {
      check`
        ${Array.isArray(x)}
        Non-arrays are not supported as 'readonly': got ${typeof x}, ${x}
      `;
      // NOTE [ToDr] This assumption is incorrect in general, but it's documented
      // in the general note. We avoid `.slice()` the array for performance reasons.
      return x as T[];
    },
    (x) => x,
  );
}

function exactHint(bytes: number): SizeHint {
  return {
    bytes,
    isExact: true,
  };
}

/** Fixed-length bytes sequence. */
export const bytes = (() => {
  const cache = new Map<number, unknown>();
  return <N extends number>(len: N): Descriptor<Bytes<N>> => {
    let ret = cache.get(len) as Descriptor<Bytes<N>>;
    if (ret === undefined) {
      ret = Descriptor.new<Bytes<N>>(
        `Bytes<${len}>`,
        exactHint(len),
        (e, v) => e.bytes(v),
        (d) => d.bytes(len),
        (s) => s.bytes(len),
      );
      cache.set(len, ret);
    }
    return ret;
  };
})();

/** Zero-size `void` value. */
export const nothing = Descriptor.new<void>(
  "void",
  { bytes: 0, isExact: true },
  (_e, _v) => {},
  (_d) => {},
  (_s) => {},
);

/** Variable-length U32. */
export const varU32 = Descriptor.new<U32>(
  "var_u32",
  { bytes: 4, isExact: false },
  (e, v) => e.varU32(v),
  (d) => d.varU32(),
  (d) => d.varU32(),
);

/** Variable-length U64. */
export const varU64 = Descriptor.new<U64>(
  "var_u64",
  { bytes: 8, isExact: false },
  (e, v) => e.varU64(v),
  (d) => d.varU64(),
  (d) => d.varU64(),
);

/** Unsigned 64-bit number. */
export const u64 = Descriptor.withView<U64, Bytes<8>>(
  "u64",
  exactHint(8),
  (e, v) => e.i64(v),
  (d) => d.u64(),
  (d) => d.u64(),
  bytes(8),
);

/** Unsigned 32-bit number. */
export const u32 = Descriptor.withView<U32, Bytes<4>>(
  "u32",
  exactHint(4),
  (e, v) => e.i32(v),
  (d) => d.u32(),
  (d) => d.u32(),
  bytes(4),
);

/** Unsigned 24-bit number. */
export const u24 = Descriptor.withView<number, Bytes<3>>(
  "u24",
  exactHint(3),
  (e, v) => e.i24(v),
  (d) => d.u24(),
  (d) => d.u24(),
  bytes(3),
);

/** Unsigned 16-bit number. */
export const u16 = Descriptor.withView<U16, Bytes<2>>(
  "u16",
  exactHint(2),
  (e, v) => e.i16(v),
  (d) => d.u16(),
  (d) => d.u16(),
  bytes(2),
);

/** Unsigned 8-bit number. */
export const u8 = Descriptor.new<U8>(
  "u8",
  exactHint(1),
  (e, v) => e.i8(v),
  (d) => d.u8(),
  (d) => d.u8(),
);

/** Signed 64-bit number. */
export const i64 = Descriptor.withView<bigint, Bytes<8>>(
```
