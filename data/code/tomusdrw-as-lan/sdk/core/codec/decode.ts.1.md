---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/decode.ts#L157-L280
title: sdk/core/codec/decode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 3
content_sha: c65fb2b9733bed18105eb603df6db39634ec08a30070ee0cbf3e2bd999265e91
language: typescript
---
`sdk/core/codec/decode.ts` (lines 157–280)

```typescript
      return this.dataView.getUint64(offset, true);
    }

    let num = (u64(firstByte) + 2 ** (8 - l) - 2 ** 8) << (8 * l);
    for (let i = 0; i < <i32>l; i += 1) {
      num |= u64(this.source[offset + i]) << (8 * i);
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
    return this.moveOffset(bytes) !== -1;
  }

  /**
   * Finish decoding `source` object and make sure there is no data left.
   *
   * This method can be called when the entire object that was meant to be
   * stored in the `source` is now fully decoded and we want to ensure
```
