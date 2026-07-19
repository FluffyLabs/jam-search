---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/decode.ts#L152-L280
title: sdk/core/codec/decode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 3a0f52a8787ff58395a19e72177d630b1293d3c231190c9726d734d99006cac2
language: typescript
---
`sdk/core/codec/decode.ts` (lines 152–280)

```typescript
    const firstByte = load<u8>(this.ptr + offset);
    const l = decodeVariableLengthExtraBytes(firstByte);

    if (l === 0) {
      return u64(firstByte);
    }

    offset = this.moveOffset(l);
    if (offset === -1) {
      return 0;
    }

    if (l === 8) {
      return load<u64>(this.ptr + offset);
    }

    let num = (u64(firstByte) + 2 ** (8 - l) - 2 ** 8) << (8 * l);
    for (let i: u32 = 0; i < <u32>l; i += 1) {
      num |= u64(load<u8>(this.ptr + offset + i)) << (8 * i);
    }
    return num;
  }

  /** Decode a 32-byte sequence. */
  bytes32(): Bytes32 {
    const bytes = this.bytesFixLen(32);
    return Bytes32.wrapUnchecked(bytes.raw);
  }

  /**
   * Decode a fixed-length sequence of bytes.
   *
   * NOTE: this method may return an empty blob in case there is a decoding error.
   * We don't return a `Result` here to allow simpler handling of the error state
   * via just single `isError` check at the very end.
   **/
  bytesFixLen(len: u32): BytesBlob {
    if (len === 0) {
      return BytesBlob.empty();
    }
    const offset = this.moveOffset(len);
    if (offset === -1) {
      // Return empty blob on error — avoid allocating attacker-controlled len.
      // Callers like bytes32() / bytesVarLen() should check isError.
      return BytesBlob.wrap(new Uint8Array(0));
    }

    const bytes = this.source.subarray(offset, offset + len);
    return BytesBlob.wrap(bytes);
  }

  /**
   * Decode a variable-length sequence of bytes.
   *
   * NOTE: this method may return an empty blob in case there is a decoding error
   * We don't return a `Result` here to allow simpler handling of the error state
   * via just single `isError` check at the very end.
   */
  bytesVarLen(): BytesBlob {
    // TODO [ToDr] limit large collections?
    const len = this.varU32();
    return this.bytesFixLen(len);
  }

  /** Decode a composite object. */
  object<T>(decode: TryDecode<T>): Result<T, DecodeError> {
    return decode.decode(this);
  }

  /** Decode a possibly optional value. */
  optional<T>(decode: TryDecode<T>): Result<T | null, DecodeError> {
    const presenceByte = this.u8();
    if (this._isError) {
      return Result.err<T | null, DecodeError>(DecodeError.MissingBytes);
    }
    if (presenceByte === 0) {
      return Result.ok<T | null, DecodeError>(null);
    }
    // NOTE [ToDr] we don't detect non-canonical data here to to save few bytes
    const result = decode.decode(this);
    if (result.isOkay) {
      return Result.ok<T | null, DecodeError>(result.okay!);
    }
    return Result.err<T | null, DecodeError>(result.error);
  }

  /** Decode a known-length sequence of elements. */
  sequenceFixLen<T>(decode: TryDecode<T>, len: u32): Result<StaticArray<T>, DecodeError> {
    const result = new StaticArray<T>(len);
    for (let i: u32 = 0; i < len; i += 1) {
      const v = decode.decode(this);
      if (v.isOkay) {
        result[i] = v.okay!;
      } else {
        return Result.err<StaticArray<T>, DecodeError>(v.error);
      }
    }
    return Result.ok<StaticArray<T>, DecodeError>(result);
  }

  /** Decode a variable-length sequence of elements. */
  sequenceVarLen<T>(decode: TryDecode<T>): Result<StaticArray<T>, DecodeError> {
    const rawLen = this.varU64();
    if (this._isError) {
      return Result.err<StaticArray<T>, DecodeError>(DecodeError.MissingBytes);
    }
    if (rawLen > 0xffff_ffff) {
      this._isError = true;
      return Result.err<StaticArray<T>, DecodeError>(DecodeError.TooLarge);
    }
    return this.sequenceFixLen<T>(decode, u32(rawLen));
  }

  /**
   * Move the decoding cursor to given offset.
   *
   * Note the offset can actually be smaller than the current offset
   * (i.e. one can go back).
   */
  resetTo(newOffset: u32): void {
    if (this.offset < newOffset) {
      this.skip(newOffset - this.offset);
    } else {
      this.offset = newOffset;
    }
  }

  /** Skip given number of bytes for decoding. */
  skip(bytes: u32): boolean {
```
