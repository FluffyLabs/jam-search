---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.ts#L298-L438
title: packages/core/codec/descriptors.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 6
content_sha: dff6ff686d37958202a72b738c51d6a73bcac953f3eb9d6c77a5b455379a87e1
language: typescript
---
`packages/core/codec/descriptors.ts` (lines 298–438)

```typescript
    sequenceViewVarLen(type, options),
  );
};

/** Fixed-length sequence of given type. */
export const sequenceFixLen = <T, V = T>(type: Descriptor<T, V>, len: number) =>
  Descriptor.withView<T[], SequenceView<T, V>>(
    `Sequence<${type.name}>[${len}]`,
    { bytes: len * type.sizeHint.bytes, isExact: type.sizeHint.isExact },
    (e, v) => e.sequenceFixLen(type, v),
    (d) => d.sequenceFixLen(type, len),
    (s) => s.sequenceFixLen(type, len),
    sequenceViewFixLen(type, { fixedLength: len }),
  );

/** Small dictionary codec. */
export const dictionary = <K, V, V2>(
  key: Descriptor<K>,
  value: Descriptor<V, V2>,
  {
    sortKeys,
    fixedLength,
  }: {
    sortKeys: (a: K, b: K) => number;
    fixedLength?: number;
  },
): Descriptor<Map<K, V>, Map<K, V2>> => {
  const self = Descriptor.new<Map<K, V>>(
    `Dictionary<${key.name}, ${value.name}>[${fixedLength ?? "?"}]`,
    {
      bytes:
        fixedLength !== undefined
          ? fixedLength * addSizeHints(key.sizeHint, value.sizeHint).bytes
          : TYPICAL_DICTIONARY_LENGTH * (addSizeHints(key.sizeHint, value.sizeHint).bytes ?? 0),
      isExact: fixedLength !== undefined ? key.sizeHint.isExact && value.sizeHint.isExact : false,
    },
    (e, v) => {
      const data = Array.from(v.entries());
      data.sort((a, b) => sortKeys(a[0], b[0]));

      // length prefix
      if (fixedLength === undefined) {
        e.varU32(tryAsU32(data.length));
      }
      for (const [k, v] of data) {
        key.encode(e, k);
        value.encode(e, v);
      }
    },
    (d) => {
      const map = new Map<K, V>();
      const len = fixedLength ?? d.varU32();
      let prevKey = null as null | K;
      for (let i = 0; i < len; i += 1) {
        const k = key.decode(d);
        const v = value.decode(d);
        if (map.has(k)) {
          throw new Error(`Duplicate item in the dictionary encoding: "${k}"!`);
        }
        if (prevKey !== null && sortKeys(prevKey, k) >= 0) {
          throw new Error(`The keys in dictionary encoding are not sorted "${prevKey}" >= "${k}"!`);
        }
        map.set(k, v);
        prevKey = k;
      }
      return map;
    },
    (s) => {
      const len = fixedLength ?? s.decoder.varU32();
      s.sequenceFixLen(key, len);
      s.sequenceFixLen(value, len);
    },
  );

  if (hasUniqueView(value)) {
    return Descriptor.withView(
      self.name,
      self.sizeHint,
      self.encode,
      self.decode,
      self.skip,
      dictionary(key, value.View, { sortKeys, fixedLength }),
    );
  }

  return self;
};

/** Encoding of pair of two values. */
export const pair = <A, AView, B, BView>(
  a: Descriptor<A, AView>,
  b: Descriptor<B, BView>,
): Descriptor<[A, B], [AView, BView]> => {
  const self = Descriptor.new<[A, B]>(
    `Pair<${a.name}, ${b.name}>`,
    addSizeHints(a.sizeHint, b.sizeHint),
    (e, elem) => {
      a.encode(e, elem[0]);
      b.encode(e, elem[1]);
    },
    (d) => {
      const aValue = a.decode(d);
      const bValue = b.decode(d);
      return [aValue, bValue];
    },
    (s) => {
      a.skip(s);
      b.skip(s);
    },
  );

  if (hasUniqueView(a) && hasUniqueView(b)) {
    return Descriptor.withView(self.name, self.sizeHint, self.encode, self.decode, self.skip, pair(a.View, b.View));
  }
  return self;
};

/** Custom encoding / decoding logic. */
export const custom = <T>(
  {
    name,
    sizeHint = { bytes: 0, isExact: false },
  }: {
    name: string;
    sizeHint: SizeHint;
  },
  encode: (e: Encoder, x: T) => void,
  decode: (d: Decoder) => T,
  skip: (s: Skipper) => void,
): Descriptor<T> => Descriptor.new(name, sizeHint, encode, decode, skip);

/**
 * Descriptor record for union variants.
 * Each variant can have its own view type, but the union itself won't expose views.
 */
type UnionDescriptorRecord<TKind extends number, T extends { kind: TKind }> = {
  [K in TKind]: Descriptor<Omit<Extract<T, { kind: K }>, "kind">, unknown>;
};

/** Tagged union type encoding. */
export const union = <
```
