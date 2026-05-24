---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/encoder.ts#L398-L481
title: packages/core/codec/encoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 4309670785d6754aa04454d166604d5f07ef18ba287691f87bc5cfbc14a4eb0b
language: typescript
---
`packages/core/codec/encoder.ts` (lines 398–481)

```typescript
   * https://graypaper.fluffylabs.dev/#/579bd12/375f00375f00
   */
  optional<T>(encode: Encode<T>, element?: T | null) {
    const isSet = element !== null && element !== undefined;
    this.bool(isSet);
    if (isSet) {
      this.applySizeHint(encode);
      encode.encode(this, element);
    }
  }

  /**
   * Encode a fixed-length sequence of elements of some type.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/371100371100
   */
  sequenceFixLen<T>(encode: Encode<T>, elements: readonly T[]) {
    this.applySizeHint(encode, elements.length);
    for (const e of elements) {
      encode.encode(this, e);
    }
  }

  /**
   * Encode a variable-length sequence of elements of some type.
   *
   * A length discriminator is placed before the concatentation of encodings of all the elements.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/374400374400
   */
  sequenceVarLen<T>(encode: Encode<T>, elements: readonly T[]) {
    check`${elements.length <= 2 ** 32} Wow, that's a nice long sequence you've got here.`;
    this.varU32(tryAsU32(elements.length));
    this.sequenceFixLen(encode, elements);
  }

  private applySizeHint<T>(encode: Encode<T>, multiply = 1) {
    const sizeHint = encode.sizeHint.bytes;
    if (sizeHint > 0 && multiply > 0) {
      this.ensureBigEnough(sizeHint * multiply, { silent: true });
    }
  }

  /**
   * Expand the destination to fit given length.
   *
   * The `silent` flag can be set when we are just giving a size hint about
   * a composite type being encoded.
   * In such case we are not sure if we are going to use all of the bytes from the hint,
   * so going over `MAX_LENGTH` or destination is not an error here.
   * When subsequent fields of a composite object will be encode they call this function
   * anyway, so if we really should throw we will.
   */
  private ensureBigEnough(length: number, options: { silent: boolean } = { silent: false }) {
    check`${length >= 0} Negative length given`;

    const newLength = this.offset + length;
    if (newLength > MAX_LENGTH) {
      if (options.silent) {
        return;
      }
      throw new Error(`The encoded size (${newLength}) would reach the maximum of ${MAX_LENGTH}.`);
    }

    if (newLength > this.destination.length) {
      // we can try to resize the underlying buffer
      if (this.buffer !== undefined) {
        // make sure we at least double the size of the buffer every time.
        const minExtend = Math.max(newLength, this.buffer.byteLength << 1);
        // but we must never exceed the max length.
        this.buffer.resize(Math.min(MAX_LENGTH, minExtend));
      }
      // and then check again
      if (newLength > this.destination.length) {
        if (options.silent) {
          return;
        }
        throw new Error(
          `Not enough space in the destination array. Needs ${newLength}, has ${this.destination.length}.`,
        );
      }
    }
  }
}
```
