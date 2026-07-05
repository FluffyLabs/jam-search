---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.ts#L1-L140
title: packages/core/codec/decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: d93e3c821f0ba86138c22e0e929b4cead3acc37133d90ff212d59c1f266b0908
language: typescript
---
`packages/core/codec/decoder.ts` (lines 1–140)

```typescript
import { BitVec, Bytes, BytesBlob } from "@typeberry/bytes";
import { tryAsU64, type U8, type U16, type U32, type U64 } from "@typeberry/numbers";
import { check } from "@typeberry/utils";

/** A decoder for some specific type `T` */
export type Decode<T> = {
  /** Decode object of type `T`. */
  decode: (d: Decoder) => T;
};

/** Primitives decoder for JAM codec. */
export class Decoder {
  /**
   * Create a new [`Decoder`] instance from given bytes blob and starting offset.
   */
  static fromBytesBlob(source: BytesBlob, offset?: number) {
    return new Decoder(source.raw, offset);
  }

  /**
   * Create a new [`Decoder`] instance given a raw array of bytes as a source.
   */
  static fromBlob(source: Uint8Array, context?: unknown) {
    return new Decoder(source, undefined, context);
  }

  /**
   * Decode a single object from all of the source bytes.
   *
   * NOTE that if you need to decode multiple objects, it might be better
   * to create a [`Decoder`] instance intstead of slicing the data.
   */
  static decodeObject<T>(decode: Decode<T>, source: BytesBlob | Uint8Array, context?: unknown): T {
    const decoder = source instanceof BytesBlob ? Decoder.fromBytesBlob(source) : Decoder.fromBlob(source);
    decoder.attachContext(context);
    const obj = decoder.object(decode);
    decoder.finish();
    return obj;
  }

  /**
   * Decode a sequence of objects from all of the source bytes.
   */
  static decodeSequence<T>(decode: Decode<T>, source: BytesBlob | Uint8Array, context?: unknown): T[] {
    const decoder = source instanceof BytesBlob ? Decoder.fromBytesBlob(source) : Decoder.fromBlob(source);
    decoder.attachContext(context);
    const seq = [] as T[];

    while (decoder.bytesRead() < decoder.source.length) {
      seq.push(decoder.object(decode));
    }

    decoder.finish();
    return seq;
  }

  private readonly dataView: DataView;

  private constructor(
    public readonly source: Uint8Array,
    private offset = 0,
    private context?: unknown,
  ) {
    this.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength);
  }

  /**
   * Attach context to the decoder.
   *
   * The context object can be used to pass some "global" parameters
   * down to custom decoders.
   */
  attachContext(context?: unknown) {
    this.context = context;
  }

  /**
   * Get the decoding context object.
   */
  getContext(): unknown {
    return this.context;
  }

  /**
   * Return a copy of this decoder.
   *
   * The copy will maintain it's own `offset` within the source.
   */
  clone(): Decoder {
    return new Decoder(this.source, this.offset, this.context);
  }

  /**
   * Return the number of bytes read from the source
   * (i.e. current offset within the source).
   */
  bytesRead(): number {
    return this.offset;
  }

  /**
   * Return all remaining bytes as BytesBlob and move offset to the end.
   */
  remainingBytes(): BytesBlob {
    const bytes = this.source.subarray(this.offset);
    const length = bytes.length;
    this.offset += length;
    return Bytes.fromBlob(bytes, length);
  }

  /** Decode single byte as a signed number. */
  i8(): number {
    return this.getNum(1, () => this.dataView.getInt8(this.offset));
  }

  /** Decode single byte as an unsigned number. */
  u8(): U8 {
    return this.getNum(1, () => this.dataView.getUint8(this.offset)) as U8;
  }

  /** Decode two bytes as a signed number. */
  i16(): number {
    return this.getNum(2, () => this.dataView.getInt16(this.offset, true));
  }

  /** Decode two bytes as an unsigned number. */
  u16(): U16 {
    return this.getNum(2, () => this.dataView.getUint16(this.offset, true)) as U16;
  }

  /** Decode three bytes as a signed number. */
  i24(): number {
    const num = this.u24();
    return num >= 2 ** 23 ? num - 2 ** 24 : num;
  }

  /** Decode three bytes as an unsigned number. */
  u24(): number {
    return this.getNum(3, () => {
      let num = this.dataView.getUint8(this.offset);
```
