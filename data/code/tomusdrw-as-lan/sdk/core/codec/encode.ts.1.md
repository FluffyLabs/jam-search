---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/encode.ts#L135-L257
title: sdk/core/codec/encode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: f52ea8826033805a592dbf787cd7a812bf3b3b08945a751d85b2be0368f51b3f
language: typescript
---
`sdk/core/codec/encode.ts` (lines 135–257)

```typescript
      this.offset += 1;
      store<u64>(this.ptr + this.offset, value);
      this.offset += 8;
      return;
    }

    if (!this.ensureCapacity(1 + l)) return;
    // First byte: prefix mask | high bits of value
    const shifted = value >> (8 * l);
    const prefix = u8(2 ** 8 - 2 ** (8 - l));
    store<u8>(this.ptr + this.offset, prefix | u8(shifted));
    this.offset += 1;

    // Remaining l bytes: low bits, little-endian
    for (let i: u8 = 0; i < l; i += 1) {
      store<u8>(this.ptr + this.offset, u8(value >> (8 * i)));
      this.offset += 1;
    }
  }

  /** Encode a 32-byte sequence. */
  bytes32(value: Bytes32): void {
    this.bytesFixLen(value.bytes);
  }

  /** Encode a fixed-length sequence of bytes. */
  bytesFixLen(value: BytesBlob): void {
    const len = <u32>value.length;
    if (len === 0) {
      return;
    }
    if (!this.ensureCapacity(len)) return;
    memory.copy(this.ptr + this.offset, value.raw.dataStart, len);
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
  @inline
  private ensureCapacity(bytes: u32): boolean {
    if (this._isError) {
      return false;
    }

    if (bytes <= this.cap - this.offset) {
      return true;
    }

    return this.grow(bytes);
  }

  private grow(bytes: u32): boolean {
    if (!this.growable) {
      this._isError = true;
      return false;
    }

    const required = this.offset + bytes;
    let newCapacity = this.cap;
    if (newCapacity === 0) {
      newCapacity = DEFAULT_CAPACITY;
    }
    while (newCapacity < required) {
      newCapacity *= 2;
    }

    const newData = new Uint8Array(newCapacity);
    memory.copy(newData.dataStart, this.ptr, this.offset);
    this.data = newData;
    this.ptr = newData.dataStart;
    this.cap = newCapacity;
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
