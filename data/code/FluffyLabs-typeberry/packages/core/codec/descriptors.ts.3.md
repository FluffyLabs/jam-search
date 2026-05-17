---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.ts#L433-L560
title: packages/core/codec/descriptors.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 3
chunk_total: 6
content_sha: e19b8cfb639516f26fbc821f16c63c7553ec9bdd47bf12ea27a64e277565f41d
language: typescript
---
`packages/core/codec/descriptors.ts` (lines 433–560)

```typescript
type UnionDescriptorRecord<TKind extends number, T extends { kind: TKind }> = {
  [K in TKind]: Descriptor<Omit<Extract<T, { kind: K }>, "kind">, unknown>;
};

/** Tagged union type encoding. */
export const union = <
  TKind extends number,
  T extends { kind: TKind },
  TVariants extends UnionDescriptorRecord<TKind, T> = UnionDescriptorRecord<TKind, T>,
>(
  name: string,
  variants: TVariants,
): Descriptor<T> => {
  const keys = Object.keys(variants).map(Number) as TKind[];
  const variantMap = Object.fromEntries(keys.map((key, idx) => [key, idx]));
  const indexToKey = Object.fromEntries(keys.map((key, idx) => [idx, key]));

  // Calculate size hint as the minimum variant size + index size
  const minVariantSize = Math.max(...keys.map((key) => variants[key].sizeHint.bytes));
  const sizeHint: SizeHint = {
    bytes: 1 + minVariantSize, // varU32 index + smallest variant
    isExact: false,
  };

  const encode = (e: Encoder, x: T) => {
    const idx = variantMap[x.kind];
    if (idx === undefined) {
      throw new Error(`Unknown variant type: ${x.kind} for ${name}`);
    }
    e.varU32(tryAsU32(idx));
    const codec = variants[x.kind];
    // I'm sorry but I can't figure out a better typing here :)
    codec.encode(e, x as unknown as Omit<Extract<T, { kind: number }>, "kind">);
  };

  const decode = (d: Decoder): T => {
    const idx = d.varU32();
    const kind = indexToKey[idx];
    if (kind === undefined) {
      throw new Error(`Unknown variant index: ${idx} for ${name}`);
    }
    const codec = variants[kind];
    const value = codec.decode(d);
    return { kind, ...value } as unknown as T;
  };

  const skip = (s: Skipper) => {
    const idx = s.decoder.varU32();
    const kind = indexToKey[idx];
    if (kind === undefined) {
      throw new Error(`Unknown variant index: ${idx} for ${name}`);
    }
    const codec = variants[kind];
    codec.skip(s);
  };

  return Descriptor.new(name, sizeHint, encode, decode, skip);
};

/** Choose a descriptor depending on the encoding/decoding context. */
export const select = <T, V = T>(
  {
    name,
    sizeHint,
  }: {
    name: string;
    sizeHint: SizeHint;
  },
  chooser: (ctx: unknown | null) => Descriptor<T, V>,
): Descriptor<T, V> => {
  const Self = chooser(null);
  return Descriptor.withView(
    name,
    sizeHint,
    (e, x) => chooser(e.getContext()).encode(e, x),
    (d) => chooser(d.getContext()).decode(d),
    (s) => chooser(s.decoder.getContext()).skip(s),
    hasUniqueView(Self)
      ? select(
          {
            name: Self.View.name,
            sizeHint: Self.View.sizeHint,
          },
          (ctx) => chooser(ctx).View,
        )
      : Self.View,
  );
};

/**
 * A descriptor for a more complex POJO.
 *
 * This descriptor is very similar to `Class`, but it DOES NOT maintain the
 * prototype chain of the resulting object - we only care about the shape of
 * the object here.
 */
export const object = <T>(
  descriptors: SimpleDescriptorRecord<T>,
  name = "object",
  create: (o: CodecRecord<T>) => T = (o) => o as T,
) => {
  return Class({ name, create }, descriptors);
};

/**
 * A descriptor for a more complex class type.
 *
 * The resulting descriptor is able to encode & decode all of the public fields of
 * the class, given the map of descriptors for each one of them.
 *
 * The resulting decoded object will be an instance of given `Class` unlike simpler,
 * shape-based `object` method.
 */
export const Class = <T, D extends DescriptorRecord<T> = DescriptorRecord<T>>(
  Class: ClassConstructor<T>,
  descriptors: D,
): Descriptor<T, ViewOf<T, D>> => {
  // Calculate a size hint for this class.
  let sizeHint = exactHint(0);
  forEachDescriptor(descriptors, (_k, val) => {
    sizeHint = addSizeHints(sizeHint, val.sizeHint);
  });

  const skipper = (s: Skipper) => {
    // optimized case for fixed size complex values.
    if (sizeHint.isExact) {
      return s.decoder.skip(sizeHint.bytes);
    }
```
