---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptor.ts#L119-L144
title: packages/core/codec/descriptor.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: cd0b37d39048a6632068dd035d696e6df23d534945eb7de0cdbc3799cea8abd7
language: typescript
---
`packages/core/codec/descriptor.ts` (lines 119–144)

```typescript
    const initBytes = decoder.bytesRead();
    this.skip(Skipper.new(decoder));
    const endBytes = decoder.bytesRead();
    return BytesBlob.blobFrom(decoder.source.subarray(initBytes, endBytes));
  }

  /** Return a new descriptor that converts data into some other type. */
  public convert<F>(input: (i: F) => T, output: (i: T) => F): Descriptor<F, V> {
    return new Descriptor(
      this.name,
      this.sizeHint,
      (e: Encoder, elem: F) => this.encode(e, input(elem)),
      (d: Decoder) => output(this.decode(d)),
      this.skip,
      this.View,
    );
  }

  /** Safely cast the descriptor value to a opaque type. */
  public asOpaque<R>(): Descriptor<Opaque<T, TokenOf<R, T>>, V> {
    return this.convert(
      (i) => seeThrough(i),
      (o) => asOpaqueType<T, TokenOf<R, T>>(o),
    );
  }
}
```
