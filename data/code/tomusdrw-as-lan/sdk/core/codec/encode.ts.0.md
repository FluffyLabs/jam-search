---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/encode.ts#L1-L140'
title: sdk/core/codec/encode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: bff52e830e6e4914d32280f338ce1c6a87b143c260c7e4784e8d9a6dce5fa441
language: typescript
---
`sdk/core/codec/encode.ts` (lines 1–140)

```typescript
import { Bytes32, BytesBlob } from "../bytes";

// Default capacity of the encoder buffer.
const DEFAULT_CAPACITY = 32;

/**
 * Interface for a codec that can encode values of type `T` into an [`Encoder`].
 *
 * Implement this on a dedicated, stateless codec class rather than
 * on the data type directly. For example, for a `Point` data type
 * create a separate `PointCodec` class:
 *
 * ```ts
 * class Point { constructor(public x: u32, public y: u32) {} }
 *
 * class PointCodec implements TryEncode<Point>, TryDecode<Point> {
 *   encode(value: Point, e: Encoder): void { e.u32(value.x); e.u32(value.y); }
 *   decode(d: Decoder): Result<Point, DecodeError> { ... }
 * }
 * ```
 */
export interface TryEncode<T> {
  /** Encode the given value into the encoder. */
  encode(value: T, e: Encoder): void;
}

export class Encoder {
  /**
   * Create a growable [`Encoder`] with the given initial capacity.
   *
   * NOTE: prefer [`Encoder.into`] for known payload sizes to avoid overallocating.
   */
  static create(initialCapacity: u32 = DEFAULT_CAPACITY): Encoder {
    return new Encoder(new Uint8Array(initialCapacity), true);
  }

  /** Create a fixed-size [`Encoder`] that writes into the given buffer. */
  static into(buffer: Uint8Array): Encoder {
    return new Encoder(buffer, false);
  }

  private dataView: DataView;
  private offset: u32 = 0;
  private _isError: boolean = false;

  private constructor(
    private data: Uint8Array,
    private readonly growable: boolean,
  ) {
    this.dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  /** Whether writing has overflowed the buffer (fixed-size mode only). */
  get isError(): boolean {
    return this._isError;
  }

  /** Return the number of bytes written so far. */
  bytesWritten(): u32 {
    return this.offset;
  }

  /** Return the encoded bytes, trimmed to the actual length. */
  finishRaw(): Uint8Array {
    if (this.data.length === this.offset) {
      return this.data;
    }
    return this.data.subarray(0, this.offset);
  }

  /** Return the encoded bytes wrapped as a BytesBlob. */
  finish(): BytesBlob {
    return BytesBlob.wrap(this.finishRaw());
  }

  /** Encode a single byte. */
  u8(value: u8): void {
    if (!this.ensureCapacity(1)) return;
    this.dataView.setUint8(this.offset, value);
    this.offset += 1;
  }

  /** Encode two bytes (little-endian). */
  u16(value: u16): void {
    if (!this.ensureCapacity(2)) return;
    this.dataView.setUint16(this.offset, value, true);
    this.offset += 2;
  }

  /** Encode three bytes (little-endian). */
  u24(value: u32): void {
    if (!this.ensureCapacity(3)) return;
    this.dataView.setUint16(this.offset, u16(value & 0xffff), true);
    this.dataView.setUint8(this.offset + 2, u8((value >> 16) & 0xff));
    this.offset += 3;
  }

  /** Encode 4 bytes (little-endian). */
  u32(value: u32): void {
    if (!this.ensureCapacity(4)) return;
    this.dataView.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  /** Encode 8 bytes (little-endian). */
  u64(value: u64): void {
    if (!this.ensureCapacity(8)) return;
    this.dataView.setUint64(this.offset, value, true);
    this.offset += 8;
  }

  /**
   * Encode a natural number using variable-length encoding (up to 2**64).
   *
   * This is the inverse of `Decoder.varU64()`.
   */
  varU64(value: u64): void {
    if (value < 128) {
      this.u8(u8(value));
      return;
    }

    const l = encodeVariableLengthExtraBytes(value);

    if (l === 8) {
      if (!this.ensureCapacity(9)) return;
      this.dataView.setUint8(this.offset, 0xff);
      this.offset += 1;
      this.dataView.setUint64(this.offset, value, true);
      this.offset += 8;
      return;
    }

    if (!this.ensureCapacity(1 + l)) return;
    // First byte: prefix mask | high bits of value
    const shifted = value >> (8 * l);
    const prefix = u8(2 ** 8 - 2 ** (8 - l));
    this.dataView.setUint8(this.offset, prefix | u8(shifted));
    this.offset += 1;

```
