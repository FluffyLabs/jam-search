---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.ts#L134-L284
title: packages/core/codec/decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 6fc6906da61b4e8ca006d2e35cc0b4142782195a6145c736862cd325aa53d599
language: typescript
---
`packages/core/codec/decoder.ts` (lines 134–284)

```typescript
    return num >= 2 ** 23 ? num - 2 ** 24 : num;
  }

  /** Decode three bytes as an unsigned number. */
  u24(): number {
    return this.getNum(3, () => {
      let num = this.dataView.getUint8(this.offset);
      num |= this.dataView.getUint16(this.offset + 1, true) << 8;
      return num;
    });
  }

  /** Decode 4 bytes as a signed number. */
  i32(): number {
    return this.getNum(4, () => this.dataView.getInt32(this.offset, true));
  }

  /** Decode 4 bytes as an unsigned number. */
  u32(): U32 {
    return this.getNum(4, () => this.dataView.getUint32(this.offset, true)) as U32;
  }

  /** Decode 8 bytes as a signed number. */
  i64(): bigint {
    return this.getNum(8, () => this.dataView.getBigInt64(this.offset, true));
  }

  /** Decode 8 bytes as a unsigned number. */
  u64(): U64 {
    return this.getNum(8, () => this.dataView.getBigUint64(this.offset, true)) as U64;
  }

  /**
   * Decode a boolean discriminator.
   *
   * NOTE: this method will throw an exception in case the encoded
   *       byte is neither 0 nor 1.
   */
  bool(): boolean {
    const num = this.u8();
    if (num === 0) {
      return false;
    }

    if (num === 1) {
      return true;
    }

    throw new Error(`Unexpected number when decoding a boolean: ${num}`);
  }

  /**
   * Decode a variable-length encoding of natural numbers (up to 2**32).
   *
   * NOTE: this method will panic in case a larger number is found
   *       in the source.
   */
  varU32(): U32 {
    this.ensureHasBytes(1);

    const firstByte = this.source[this.offset];
    const l = decodeVariableLengthExtraBytes(firstByte);
    this.offset += 1;

    if (l === 0) {
      return firstByte as U32;
    }

    if (l > 4) {
      throw new Error(`Unexpectedly large value for u32. l=${l}`);
    }

    this.ensureHasBytes(l);
    const mostSignificantByte = (firstByte + 2 ** (8 - l) - 2 ** 8) << (l * 8);
    if (l === 1) {
      return (mostSignificantByte + this.u8()) as U32;
    }

    if (l === 2) {
      return (mostSignificantByte + this.u16()) as U32;
    }

    if (l === 3) {
      return (mostSignificantByte + this.u24()) as U32;
    }

    if (mostSignificantByte === 0) {
      return this.u32();
    }

    throw new Error(`Unexpectedly large value for u32. l=${l}, mostSignificantByte=${mostSignificantByte}`);
  }

  /** Decode a variable-length encoding of natural numbers (up to 2**64). */
  varU64(): U64 {
    this.ensureHasBytes(1);

    const firstByte = this.source[this.offset];
    const l = decodeVariableLengthExtraBytes(firstByte);
    this.offset += 1;

    if (l === 0) {
      return tryAsU64(firstByte);
    }

    this.ensureHasBytes(l);
    this.offset += l;
    if (l === 8) {
      return tryAsU64(this.dataView.getBigUint64(this.offset - l, true));
    }

    let num = BigInt(firstByte + 2 ** (8 - l) - 2 ** 8) << BigInt(8 * l);
    for (let i = 0; i < l; i += 1) {
      num |= BigInt(this.source[this.offset - l + i]) << BigInt(8 * i);
    }
    return tryAsU64(num);
  }

  /** Decode a fixed-length sequence of bytes. */
  bytes<N extends number>(len: N): Bytes<N> {
    if (len === 0) {
      return Bytes.zero(len);
    }

    this.ensureHasBytes(len);
    const bytes = this.source.subarray(this.offset, this.offset + len);
    this.offset += len;
    return Bytes.fromBlob(bytes, len);
  }

  /** Decode a variable-length sequence of bytes. */
  bytesBlob(): BytesBlob {
    const len = this.varU32();
    this.ensureHasBytes(len);
    const bytes = this.source.subarray(this.offset, this.offset + len);
    this.offset += len;
    return BytesBlob.blobFrom(bytes);
  }

  /** Decode a fixed-length sequence of bits of given length. */
  bitVecFixLen(bitLength: number): BitVec {
    if (bitLength === 0) {
      return BitVec.empty(0);
    }

    const byteLength = Math.ceil(bitLength / 8);
    const bytes = this.bytes(byteLength);

    // verify that the remaining bits are zero
    const emptyBitsStart = bitLength % 8;
    if (emptyBitsStart > 0) {
```
