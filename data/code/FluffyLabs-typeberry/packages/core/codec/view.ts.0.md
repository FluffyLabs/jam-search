---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/view.ts#L1-L120
title: packages/core/codec/view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: a96fc0464c275a8d03ead56cbef4523adc9544bd5556472496b6a15c73c61446
language: typescript
---
`packages/core/codec/view.ts` (lines 1–120)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import { check, TEST_COMPARE_USING } from "@typeberry/utils";
import type { Decoder } from "./decoder.js";
import type { ClassConstructor, CodecRecord, Descriptor, DescriptorRecord } from "./descriptor.js";
import { Skipper } from "./skip.js";

/** View type for given complex object `T`. */
export type ViewOf<T, D extends DescriptorRecord<T>> = ObjectView<T> & {
  [K in keyof D]: D[K] extends Descriptor<infer T, infer V> ? ViewField<T, V> : never;
};

/** A caching wrapper for either object or sequence item. */
export class ViewField<T, V> implements ViewField<T, V> {
  private cachedValue: T | undefined;
  private cachedView: V | undefined;
  private cachedBlob: BytesBlob | undefined;

  constructor(
    private readonly name: string,
    private readonly getView: () => V,
    private readonly getValue: () => T,
    private readonly getEncoded: () => BytesBlob,
  ) {}

  /** Fully decode the underlying data. */
  materialize(): T {
    if (this.cachedValue === undefined) {
      this.cachedValue = this.getValue();
    }
    return this.cachedValue;
  }

  /** Decode just the view of the underlying data. */
  view(): V {
    if (this.cachedView === undefined) {
      this.cachedView = this.getView();
    }
    return this.cachedView;
  }

  /** Return an encoded value of that object. */
  encoded(): BytesBlob {
    if (this.cachedBlob === undefined) {
      this.cachedBlob = this.getEncoded();
    }
    return this.cachedBlob;
  }

  toString() {
    return `ViewField<${this.name}>`;
  }
}

/**
 * A base class for all the lazy views.
 */
export abstract class ObjectView<T> {
  /** Keys of all descriptors. */
  private readonly descriptorsKeys: (keyof T)[];
  /** Already decoded items. */
  private readonly cache = new Map<keyof T, ViewField<T[keyof T], unknown>>();
  /** Initial decoder state. */
  private readonly initialDecoderOffset;
  /** Last decoded index that we have in the cache already. */
  private lastDecodedFieldIdx = -1;

  constructor(
    private readonly decoder: Decoder,
    protected readonly materializedConstructor: ClassConstructor<T>,
    protected readonly descriptors: DescriptorRecord<T>,
  ) {
    this.descriptorsKeys = Object.keys(descriptors) as (keyof T)[];
    this.initialDecoderOffset = decoder.bytesRead();
  }

  /**
   * Create a concrete instance of `T` by decoding all of the remaining
   * fields that are not yet there in the cache.
   */
  materialize(): T {
    const fields = this.descriptorsKeys;
    const constructorParams = Object.fromEntries(fields.map((key) => [key, this.get(key).materialize()]));
    return this.materializedConstructor.create(constructorParams as CodecRecord<T>);
  }

  /** Return an encoded value of that object. */
  encoded(): BytesBlob {
    const fields = this.descriptorsKeys;
    // edge case?
    if (fields.length === 0) {
      return BytesBlob.blobFromNumbers([]);
    }

    if (this.lastDecodedFieldIdx < fields.length - 1) {
      const lastField = fields[fields.length - 1];
      this.decodeUpTo(lastField);
    }
    // now our `this.d` points to the end of the object, so we can use
    // it to determine where is the end of the encoded data.
    return BytesBlob.blobFrom(this.decoder.source.subarray(this.initialDecoderOffset, this.decoder.bytesRead()));
  }

  /**
   * Get the value of the field from cache or decode it.
   */
  protected get<K extends keyof T>(field: K): ViewField<T[K], unknown> {
    const cached: ViewField<T[keyof T], unknown> | undefined = this.cache.get(field);
    if (cached !== undefined) {
      return cached as ViewField<T[K], unknown>;
    }

    return this.decodeUpTo(field);
  }

  private decodeUpTo<K extends keyof T>(field: K): ViewField<T[K], unknown> {
    const index = this.descriptorsKeys.indexOf(field);
    const lastField = this.descriptorsKeys[this.lastDecodedFieldIdx];
    check`
      ${this.lastDecodedFieldIdx < index}
      Unjustified call to 'decodeUpTo' -
```
