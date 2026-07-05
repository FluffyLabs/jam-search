---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.ts#L146-L304
title: packages/core/codec/descriptors.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 6
content_sha: 06547600e0dae49f5f6a76f6e5b13794ab4b56410076b6d6719e225d63596b77
language: typescript
---
`packages/core/codec/descriptors.ts` (lines 146–304)

```typescript
export const u8 = Descriptor.new<U8>(
  "u8",
  exactHint(1),
  (e, v) => e.i8(v),
  (d) => d.u8(),
  (d) => d.u8(),
);

/** Signed 64-bit number. */
export const i64 = Descriptor.withView<bigint, Bytes<8>>(
  "i64",
  exactHint(8),
  (e, v) => e.i64(v),
  (d) => d.i64(),
  (s) => s.u64(),
  bytes(8),
);

/** Signed 32-bit number. */
export const i32 = Descriptor.withView<number, Bytes<4>>(
  "i32",
  exactHint(4),
  (e, v) => e.i32(v),
  (d) => d.i32(),
  (s) => s.u32(),
  bytes(4),
);

/** Signed 24-bit number. */
export const i24 = Descriptor.withView<number, Bytes<3>>(
  "i24",
  exactHint(3),
  (e, v) => e.i24(v),
  (d) => d.i24(),
  (s) => s.u24(),
  bytes(3),
);

/** Signed 16-bit number. */
export const i16 = Descriptor.withView<number, Bytes<2>>(
  "i16",
  exactHint(2),
  (e, v) => e.i16(v),
  (d) => d.i16(),
  (s) => s.u16(),
  bytes(2),
);

/** Signed 8-bit number. */
export const i8 = Descriptor.new<number>(
  "i8",
  exactHint(1),
  (e, v) => e.i8(v),
  (d) => d.i8(),
  (s) => s.u8(),
);

/** 1-byte boolean value. */
export const bool = Descriptor.new<boolean>(
  "bool",
  exactHint(1),
  (e, v) => e.bool(v),
  (d) => d.bool(),
  (s) => s.bool(),
);

/** Variable-length bytes blob. */
export const blob = Descriptor.new<BytesBlob>(
  "BytesBlob",
  { bytes: TYPICAL_SEQUENCE_LENGTH, isExact: false },
  (e, v) => e.bytesBlob(v),
  (d) => d.bytesBlob(),
  (s) => s.bytesBlob(),
);

/** String encoded as variable-length bytes blob. */
export const string = Descriptor.withView<string, BytesBlob>(
  "string",
  { bytes: TYPICAL_SEQUENCE_LENGTH, isExact: false },
  (e, v) => e.bytesBlob(BytesBlob.blobFrom(new TextEncoder().encode(v))),
  (d) => new TextDecoder("utf8", { fatal: true }).decode(d.bytesBlob().raw),
  (s) => s.bytesBlob(),
  blob,
);

/** Variable-length bit vector. */
export const bitVecVarLen = Descriptor.new<BitVec>(
  "BitVec[?]",
  { bytes: TYPICAL_SEQUENCE_LENGTH >>> 3, isExact: false },
  (e, v) => e.bitVecVarLen(v),
  (d) => d.bitVecVarLen(),
  (s) => s.bitVecVarLen(),
);

/** Fixed-length bit vector. */
export const bitVecFixLen = (bitLen: number) =>
  Descriptor.new<BitVec>(
    `BitVec[${bitLen}]`,
    exactHint(bitLen >>> 3),
    (e, v) => e.bitVecFixLen(v),
    (d) => d.bitVecFixLen(bitLen),
    (s) => s.bitVecFixLen(bitLen),
  );

/** Optionality wrapper for given type. */
export const optional = <T, V>(type: Descriptor<T, V>): Descriptor<T | null, V | null> => {
  const self = Descriptor.new<T | null>(
    `Optional<${type.name}>`,
    addSizeHints({ bytes: 1, isExact: false }, type.sizeHint),
    (e, v) => e.optional(type, v),
    (d) => d.optional(type),
    (s) => s.optional(type),
  );

  if (hasUniqueView(type)) {
    return Descriptor.withView(self.name, self.sizeHint, self.encode, self.decode, self.skip, optional(type.View));
  }

  return self;
};

export type SequenceVarLenOptions = LengthRange & {
  typicalLength?: number;
};

/** Variable-length sequence of given type. */
export const sequenceVarLen = <T, V = T>(
  type: Descriptor<T, V>,
  options: SequenceVarLenOptions = {
    minLength: 0,
    maxLength: 2 ** 32 - 1,
  },
) => {
  const name = `Sequence<${type.name}>[?]`;
  const typicalLength = options.typicalLength ?? TYPICAL_SEQUENCE_LENGTH;
  return Descriptor.withView<T[], SequenceView<T, V>>(
    name,
    { bytes: typicalLength * type.sizeHint.bytes, isExact: false },
    (e, v) => {
      validateLength(options, v.length, name);
      e.sequenceVarLen(type, v);
    },
    (d) => {
      const len = d.varU32();
      validateLength(options, len, name);
      return d.sequenceFixLen(type, len);
    },
    (s) => {
      const len = s.decoder.varU32();
      validateLength(options, len, name);
      return s.sequenceFixLen(type, len);
    },
    sequenceViewVarLen(type, options),
  );
};

/** Fixed-length sequence of given type. */
export const sequenceFixLen = <T, V = T>(type: Descriptor<T, V>, len: number) =>
  Descriptor.withView<T[], SequenceView<T, V>>(
```
