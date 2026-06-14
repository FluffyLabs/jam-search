---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/decode.ts#L1-L160'
title: sdk/core/codec/decode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 155553ac64dc9b2d8001a823e3caa7a8558a1b75961968796aefc400a0baa308
language: typescript
---
`sdk/core/codec/decode.ts` (lines 1–160)

```typescript
import { Bytes32, BytesBlob } from "../bytes";
import { Result } from "../result";

export enum DecodeError {
  /** Not enough bytes in the buffer to decode request data. */
  MissingBytes = 0,
  /** Collection would be too large to decode. */
  TooLarge,
  /** Invalid discriminator tag or value out of expected range. */
  InvalidData,
}

/**
 * Interface for types that can decode a value from a [`Decoder`].
 *
 * Prefer implementing this on a dedicated codec class rather than
 * on the data type directly. See [`TryEncode`] for an example.
 */
export interface TryDecode<T> {
  decode(d: Decoder): Result<T, DecodeError>;
}

export class Decoder {
  /**
   * Create a new [`Decoder`] instance given a raw array of bytes as a source.
   */
  static fromBlob(source: Uint8Array): Decoder {
    return new Decoder(source);
  }

  /**
   * Create a new [`Decoder`] instance reading from a [`BytesBlob`] without
   * copying. Prefer this over `fromBlob(blob.raw)` at call sites that already
   * hold a `BytesBlob`.
   */
  static fromBytesBlob(source: BytesBlob): Decoder {
    return new Decoder(source.raw);
  }

  // Cached pointer + length of `source`. With `--runtime=stub` the bump
  // allocator never moves objects, so `dataStart` is stable for the life
  // of the decoder. Direct `load<T>` writes avoid the DataView allocation
  // and per-read bounds-checked accessor calls.
  private readonly ptr: usize;
  private readonly srcLen: u32;
  private _isError: boolean = false;

  private constructor(
    public readonly source: Uint8Array,
    private offset: u32 = 0,
  ) {
    this.ptr = source.dataStart;
    this.srcLen = <u32>source.length;
  }

  /**
   * If the decoder turns into error state, the last value was not decoded properly
   * and might be garbage.
   */
  @inline
  get isError(): boolean {
    return this._isError;
  }

  /**
   * Return a copy of this decoder.
   *
   * The copy will maintain it's own `offset` within the source.
   */
  clone(): Decoder {
    return new Decoder(this.source, this.offset);
  }

  /**
   * Return the number of bytes read from the source
   * (i.e. current offset within the source).
   */
  @inline
  bytesRead(): u32 {
    return this.offset;
  }

  /** Decode single byte as an unsigned number. */
  u8(): u8 {
    const offset = this.moveOffset(1);
    if (offset !== -1) {
      return load<u8>(this.ptr + offset);
    }
    return 0;
  }

  /** Decode two bytes as an unsigned number. */
  u16(): u16 {
    const offset = this.moveOffset(2);
    if (offset !== -1) {
      return load<u16>(this.ptr + offset);
    }
    return 0;
  }

  /** Decode three bytes as an unsigned number (little-endian). */
  u24(): u32 {
    const offset = this.moveOffset(3);
    if (offset !== -1) {
      const lo = <u32>load<u16>(this.ptr + offset);
      const hi = <u32>load<u8>(this.ptr + offset + 2);
      return lo | (hi << 16);
    }
    return 0;
  }

  /** Decode 4 bytes as an unsigned number. */
  u32(): u32 {
    const offset = this.moveOffset(4);
    if (offset !== -1) {
      return load<u32>(this.ptr + offset);
    }
    return 0;
  }

  /** Decode 8 bytes as a unsigned number. */
  u64(): u64 {
    const offset = this.moveOffset(8);
    if (offset !== -1) {
      return load<u64>(this.ptr + offset);
    }
    return 0;
  }

  /**
   * Decode a variable-length u64 and validate it fits in a u32.
   * Sets isError if the value overflows u32 range.
   */
  varU32(): u32 {
    const val = this.varU64();
    if (val > 0xffff_ffff) {
      this._isError = true;
      return 0;
    }
    return u32(val);
  }

  /**
   * Decode a variable-length encoding of natural numbers (up to 2**64).
   */
  varU64(): u64 {
    let offset = this.moveOffset(1);
    if (offset === -1) {
      return 0;
    }

    const firstByte = load<u8>(this.ptr + offset);
    const l = decodeVariableLengthExtraBytes(firstByte);

    if (l === 0) {
      return u64(firstByte);
    }

    offset = this.moveOffset(l);
    if (offset === -1) {
```
