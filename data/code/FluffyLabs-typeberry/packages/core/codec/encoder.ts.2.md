---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/encoder.ts#L261-L403
title: packages/core/codec/encoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 4
content_sha: f7f7c4add09736907eb84073edbec89d678164ae59ce6fbd9d240252375de918
language: typescript
---
`packages/core/codec/encoder.ts` (lines 261–403)

```typescript
    check`${num < 2 ** 32} Only for numbers up to 2**32`;
    this.varU64(BigInt(num));
  }

  /**
   * Encode a 64-bit natural number (compact).
   *
   * The encoding can take variable amount of bytes depending on the actual value.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/365202365202
   */
  varU64(value: bigint) {
    const num = BigInt(value); // this should be a no-op, but fixes incorrect usage in JS

    if (num === 0n) {
      this.ensureBigEnough(1);
      this.destination[this.offset] = 0;
      this.offset += 1;
      return;
    }

    // handle the biggest case
    let maxEncoded = 2n ** (7n * 8n);
    if (num >= maxEncoded) {
      this.ensureBigEnough(9);
      this.destination[this.offset] = 0xff;
      this.dataView.setBigUint64(this.offset + 1, num, true);
      this.offset += 9;
      return;
    }

    // let's look for the correct range
    let minEncoded = maxEncoded >> 7n;
    for (let l = 7; l >= 0; l -= 1) {
      if (num >= minEncoded) {
        this.ensureBigEnough(l + 1);

        // encode the first byte
        const maxVal = 2n ** BigInt(8 * l);
        const byte = BigInt(2 ** 8 - 2 ** (8 - l)) + num / maxVal;
        this.destination[this.offset] = Number(byte) & 0xff;
        this.offset += 1;
        // now encode the rest of bytes of len `l`
        let rest = num % maxVal;
        for (let i = this.offset; i < this.offset + l; i += 1) {
          this.destination[i] = Number(rest & 0xffn);
          rest >>= 8n;
        }
        this.offset += l;
        return;
      }
      // move one power down
      maxEncoded = minEncoded;
      minEncoded >>= 7n;
    }

    throw new Error(`Unhandled number encoding: ${num}`);
  }

  /**
   * Encode a variable-length sequence of bytes given as [`BytesBlob`].
   *
   * That's just a convenience wrapper for [`blob`] function.
   */
  bytesBlob(blob: BytesBlob) {
    this.blob(blob.raw);
  }

  /**
   * Encode a variable-length sequence of bytes.
   *
   * The data is placed in the destination, but with an
   * extra length-discriminator (see [`u32`]) encoded in a compact form.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/372600372600
   */
  blob(blob: Uint8Array) {
    // first encode the length
    this.varU32(tryAsU32(blob.length));

    // now encode the bytes
    this.ensureBigEnough(blob.length);
    this.destination.set(blob, this.offset);
    this.offset += blob.length;
  }

  /**
   * Encode a fixed-length sequence of bytes.
   *
   * The data is simply copied to the destination
   * without any discriminator (i.e. no length prefix).
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/371100371100
   *
   */
  bytes<N extends number>(bytes: Bytes<N>) {
    this.ensureBigEnough(bytes.length);

    this.destination.set(bytes.raw, this.offset);
    this.offset += bytes.length;
  }

  /**
   * Encode a bit vector with known length.
   *
   * The bits are packed into bytes and just placed as-is in the destination.
   * https://graypaper.fluffylabs.dev/#/579bd12/378000378000
   */
  bitVecFixLen(bitvec: BitVec) {
    const bytes = bitvec.raw;
    this.bytes(Bytes.fromBlob(bytes, bytes.length));
  }

  /**
   * Encode a bit vector with variable length.
   *
   * A bit-length discriminator (varU32) is placed before the packed bit content.
   * https://graypaper.fluffylabs.dev/#/579bd12/378200378200
   */
  bitVecVarLen(bitvec: BitVec) {
    const len = bitvec.bitLength;
    this.varU32(tryAsU32(len));
    this.bitVecFixLen(bitvec);
  }

  /**
   * Encode a composite object.
   */
  object<T>(encode: Encode<T>, element: T) {
    this.applySizeHint(encode);
    encode.encode(this, element);
  }

  /**
   * Encode a potentially empty value.
   *
   * A 0 or 1 is placed before the element to indicate it's presence.
   * https://graypaper.fluffylabs.dev/#/579bd12/375f00375f00
   */
  optional<T>(encode: Encode<T>, element?: T | null) {
    const isSet = element !== null && element !== undefined;
    this.bool(isSet);
    if (isSet) {
```
