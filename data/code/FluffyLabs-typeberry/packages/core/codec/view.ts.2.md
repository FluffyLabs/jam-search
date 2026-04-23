---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/view.ts#L242-L282
title: packages/core/codec/view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 2aae0ef54ccc81e5b8964905331a459f830ab402917d673fcc17de3ef3f6e3ca
language: typescript
---
`packages/core/codec/view.ts` (lines 242–282)

```typescript
    // now our `this.decoder` points to the end of the object, so we can use
    // it to determine where is the end of the encoded data.
    return BytesBlob.blobFrom(this.decoder.source.subarray(this.initialDecoderOffset, this.decoder.bytesRead()));
  }

  private decodeUpTo(index: number): ViewField<T, V> {
    check`
      ${this.lastDecodedIdx < index}
      Unjustified call to 'decodeUpTo' - the index (${index}) is already decoded (${this.lastDecodedIdx}).
    `;
    let lastItem = this.cache.get(this.lastDecodedIdx);
    const skipper = Skipper.new(this.decoder);

    // now skip all of the fields and further populate the cache.
    for (let i = this.lastDecodedIdx + 1; i <= index; i++) {
      // create new cached prop
      const fieldDecoder = skipper.decoder.clone();
      const type = this.descriptor;
      lastItem = new ViewField(
        `${this.toString()}[${index}]`,
        () => type.View.decode(fieldDecoder.clone()),
        () => type.decode(fieldDecoder.clone()),
        () => type.skipEncoded(fieldDecoder.clone()),
      );
      // skip the field
      type.skip(skipper);
      // cache data
      this.cache.set(i, lastItem);
      this.lastDecodedIdx = i;
    }

    if (lastItem === undefined) {
      throw new Error("Last item must be set, since the loop turns at least once.");
    }
    return lastItem;
  }

  toString() {
    return `SequenceView<${this.descriptor.name}>(cache: ${this.cache.size})`;
  }
}
```
