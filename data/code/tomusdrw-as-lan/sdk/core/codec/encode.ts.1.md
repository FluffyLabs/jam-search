---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/encode.ts#L135-L245
title: sdk/core/codec/encode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 231b8b6e987f5e9e9fca4bf7d0715917997438e4b6d47a7995f7ef43ad9645a3
language: typescript
---
`sdk/core/codec/encode.ts` (lines 135–245)

```typescript
    // First byte: prefix mask | high bits of value
    const shifted = value >> (8 * l);
    const prefix = u8(2 ** 8 - 2 ** (8 - l));
    this.dataView.setUint8(this.offset, prefix | u8(shifted));
    this.offset += 1;

    // Remaining l bytes: low bits, little-endian
    for (let i: u8 = 0; i < l; i += 1) {
      this.dataView.setUint8(this.offset, u8(value >> (8 * i)));
      this.offset += 1;
    }
  }

  /** Encode a 32-byte sequence. */
  bytes32(value: Bytes32): void {
    this.bytesFixLen(value.bytes);
  }

  /** Encode a fixed-length sequence of bytes. */
  bytesFixLen(value: BytesBlob): void {
    const len = value.length;
    if (len === 0) {
      return;
    }
    if (!this.ensureCapacity(len)) return;
    this.data.set(value.raw, this.offset);
    this.offset += len;
  }

  /** Encode a variable-length sequence of bytes (length-prefixed). */
  bytesVarLen(value: BytesBlob): void {
    this.varU64(u64(value.raw.length));
    this.bytesFixLen(value);
  }

  /** Encode a composite object using the given codec. */
  object<T>(codec: TryEncode<T>, value: T): void {
    codec.encode(value, this);
  }

  /** Encode a possibly optional value using the given codec. */
  optional<T>(codec: TryEncode<T>, value: T | null): void {
    if (value === null) {
      this.u8(0);
    } else {
      this.u8(1);
      codec.encode(value, this);
    }
  }

  /** Encode a known-length sequence of elements using the given codec. */
  sequenceFixLen<T>(codec: TryEncode<T>, values: StaticArray<T>): void {
    for (let i: u32 = 0; i < <u32>values.length; i += 1) {
      codec.encode(values[i], this);
    }
  }

  /** Encode a variable-length sequence of elements (length-prefixed) using the given codec. */
  sequenceVarLen<T>(codec: TryEncode<T>, values: StaticArray<T>): void {
    this.varU64(u64(values.length));
    this.sequenceFixLen(codec, values);
  }

  /**
   * Ensure the internal buffer has room for `bytes` more bytes.
   * Returns true if space is available, false if the buffer is full (fixed-size mode).
   */
  private ensureCapacity(bytes: u32): boolean {
    if (this._isError) {
      return false;
    }

    const remaining = <u32>this.data.length - this.offset;
    if (bytes <= remaining) {
      return true;
    }

    if (!this.growable) {
      this._isError = true;
      return false;
    }

    const required = this.offset + bytes;
    let newCapacity = <u32>this.data.length;
    if (newCapacity === 0) {
      newCapacity = DEFAULT_CAPACITY;
    }
    while (newCapacity < required) {
      newCapacity *= 2;
    }

    const newData = new Uint8Array(newCapacity);
    newData.set(this.data.subarray(0, this.offset));
    this.data = newData;
    this.dataView = new DataView(newData.buffer, 0, newCapacity);
    return true;
  }
}

function encodeVariableLengthExtraBytes(value: u64): u8 {
  // Number of extra bytes needed beyond the first byte.
  // Each level l uses (8-l-1) value bits in the first byte + 8*l bits in extra bytes.
  // Total value capacity: 7*(l+1) bits.
  // l=1: < 2^14, l=2: < 2^21, ..., l=7: < 2^56, l=8: >= 2^56
  for (let l: u8 = 1; l <= 7; l += 1) {
    if (value < u64(1) << (7 * (l + 1))) {
      return l;
    }
  }
  return 8;
}
```
