---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/view.ts#L116-L246
title: packages/core/codec/view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: c457a6e9cef097d497a96da00248b8f459483000699a834def9dbd7c4abec6c1
language: typescript
---
`packages/core/codec/view.ts` (lines 116–246)

```typescript
    const index = this.descriptorsKeys.indexOf(field);
    const lastField = this.descriptorsKeys[this.lastDecodedFieldIdx];
    check`
      ${this.lastDecodedFieldIdx < index}
      Unjustified call to 'decodeUpTo' -
       the index ($Blobindex}, ${String(field)})
       is already decoded (${this.lastDecodedFieldIdx}, ${String(lastField)}).
    `;

    let lastItem = this.cache.get(lastField);
    const skipper = Skipper.new(this.decoder);

    // now skip all of the fields and further populate the cache.
    for (let i = this.lastDecodedFieldIdx + 1; i <= index; i++) {
      // create new cached prop
      const fieldDecoder = skipper.decoder.clone();
      const field = this.descriptorsKeys[i];
      const type = this.descriptors[field as keyof DescriptorRecord<T>];
      lastItem = new ViewField(
        `${this.toString()}.${String(field)}`,
        () => type.View.decode(fieldDecoder.clone()),
        () => type.decode(fieldDecoder.clone()),
        () => type.skipEncoded(fieldDecoder.clone()),
      );
      // skip the field
      type.skip(skipper);
      // cache data
      this.cache.set(field, lastItem);
      this.lastDecodedFieldIdx = i;
    }

    if (lastItem === undefined) {
      throw new Error("Last item must be set, since the loop turns at least once.");
    }

    return lastItem as ViewField<T[K], unknown>;
  }

  toString() {
    return `View<${this.materializedConstructor.name}>(cache: ${this.cache.size})`;
  }

  [TEST_COMPARE_USING]() {
    return this.materialize();
  }
}

/**
 * A lazy-evaluated decoder of a sequence.
 *
 * Instead of decoding/allocating the whole collection at once,
 * you can wrap the decoder into `SequenceView` to do it lazily.
 *
 * Collection items can be decoded fully (materialized) or can
 * just be requested as views.
 */
export class SequenceView<T, V = T> {
  /** Length of the sequence (either already decoded or given if fixed). */
  public readonly length: number;
  /** Already decoded items. */
  private readonly cache = new Map<number, ViewField<T, V>>();
  /** Initial decoder state. */
  private readonly initialDecoderOffset;
  /** Last decoded index that we have in the cache already. */
  private lastDecodedIdx = -1;

  constructor(
    private readonly decoder: Decoder,
    private readonly descriptor: Descriptor<T, V>,
    fixedLength?: number,
  ) {
    this.initialDecoderOffset = this.decoder.bytesRead();
    this.length = fixedLength ?? decoder.varU32();
  }

  /** Iterate over field elements of the view. */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      const val = this.get(i);
      if (val === undefined) {
        throw new Error("We are within 0..this.length so all items are defined.");
      }
      yield val;
    }
  }

  /** Create an array of all views mapped to some particular value. */
  map<R>(cb: (v: ViewField<T, V>) => R): R[] {
    const res = new Array(this.length);
    let i = 0;
    for (const v of this) {
      res[i] = cb(v);
      i++;
    }
    return res;
  }

  /**
   * Retrieve item at given index.
   *
   * The item can be either materialized or it's view can be requested.
   */
  get(index: number): ViewField<T, V> | undefined {
    if (index >= this.length) {
      return undefined;
    }

    const v = this.cache.get(index);
    if (v !== undefined) {
      return v;
    }

    // populate the cache
    return this.decodeUpTo(index);
  }

  /** Return an encoded value of that object. */
  encoded(): BytesBlob {
    // edge case?
    if (this.length === 0) {
      return BytesBlob.blobFromNumbers([]);
    }

    if (this.lastDecodedIdx < this.length - 1) {
      this.decodeUpTo(this.length - 1);
    }
    // now our `this.decoder` points to the end of the object, so we can use
    // it to determine where is the end of the encoded data.
    return BytesBlob.blobFrom(this.decoder.source.subarray(this.initialDecoderOffset, this.decoder.bytesRead()));
  }

```
