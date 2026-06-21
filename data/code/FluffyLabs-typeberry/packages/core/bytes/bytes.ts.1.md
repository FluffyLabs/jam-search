---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/bytes.ts#L132-L246
title: packages/core/bytes/bytes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 3
content_sha: eb45f161b9b4725679d72a8d77c0cb67bd7fdc05c346e1e9359cf7da10c50081
language: typescript
---
`packages/core/bytes/bytes.ts` (lines 132–246)

```typescript
  static blobFromNumbers(v: number[]): BytesBlob {
    check`${v.find((x) => (x & 0xff) !== x) === undefined} BytesBlob.blobFromNumbers used with non-byte number array.`;
    const arr = new Uint8Array(v);
    return new BytesBlob(arr);
  }

  /** Parse a hex-encoded bytes blob without `0x` prefix. */
  static parseBlobNoPrefix(v: string): BytesBlob {
    const len = v.length;
    if (len % 2 === 1) {
      throw new Error(`Odd number of nibbles. Invalid hex string: ${v}.`);
    }
    const buffer = new ArrayBuffer(len / 2);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < len - 1; i += 2) {
      const c = v.substring(i, i + 2);
      bytes[i / 2] = byteFromString(c);
    }

    return new BytesBlob(bytes);
  }

  /** Parse a hex-encoded bytes blob with `0x` prefix. */
  static parseBlob(v: string): BytesBlob {
    if (!v.startsWith("0x")) {
      throw new Error(`Missing 0x prefix: ${v}.`);
    }
    return BytesBlob.parseBlobNoPrefix(v.substring(2));
  }

  /**
   * Split `BytesBlob` into chunks of given size.
   *
   * Last chunk might be smaller than `size`.
   */
  *chunks(size: number): Generator<BytesBlob, undefined, void> {
    for (let i = 0; i < this.length; i += size) {
      yield BytesBlob.blobFrom(this.raw.subarray(i, i + size));
    }
  }
}

/**
 * A convenience wrapper for a fix-length sequence of bytes.
 */
export class Bytes<T extends number> extends BytesBlob {
  /** Length of the bytes array. */
  readonly length: T;

  private constructor(raw: Uint8Array, len: T) {
    super(raw);
    check`${raw.byteLength === len} Given buffer has incorrect size ${raw.byteLength} vs expected ${len}`;
    this.length = len;
  }

  /** Create new [`Bytes<X>`] given a backing buffer and it's length. */
  static fromBlob<X extends number>(v: Uint8Array, len: X): Bytes<X> {
    return new Bytes(v, len);
  }

  /** Create new [`Bytes<X>`] given an array of bytes and it's length. */
  static fromNumbers<X extends number>(v: number[], len: X): Bytes<X> {
    check`${v.find((x) => (x & 0xff) !== x) === undefined} Bytes.fromNumbers used with non-byte number array.`;
    const x = new Uint8Array(v);
    return new Bytes(x, len);
  }

  /** Create an empty [`Bytes<X>`] of given length. */
  static zero<X extends number>(len: X): Bytes<X> {
    return new Bytes(safeAllocUint8Array(len), len);
  }

  // TODO [ToDr] `fill` should have the argments swapped to align with the rest.
  /** Create a [`Bytes<X>`] with all bytes filled with given input number. */
  static fill<X extends number>(len: X, input: number): Bytes<X> {
    check`${(input & 0xff) === input} Input has to be a byte.`;
    const bytes = Bytes.zero(len);
    bytes.raw.fill(input, 0, len);
    return bytes;
  }

  /** Parse a hex-encoded fixed-length bytes without `0x` prefix. */
  static parseBytesNoPrefix<X extends number>(v: string, len: X): Bytes<X> {
    if (v.length > 2 * len) {
      throw new Error(`Input string too long. Expected ${len}, got ${v.length / 2}`);
    }

    const blob = BytesBlob.parseBlobNoPrefix(v);
    return new Bytes(blob.raw, len);
  }

  /** Parse a hex-encoded fixed-length bytes with `0x` prefix. */
  static parseBytes<X extends number>(v: string, len: X): Bytes<X> {
    if (v.length > 2 * len + 2) {
      throw new Error(`Input string too long. Expected ${len}, got ${v.length / 2 - 1}`);
    }

    const blob = BytesBlob.parseBlob(v);
    return new Bytes(blob.raw, len);
  }

  /** Compare the sequence to another one. */
  isEqualTo(other: Bytes<T>): boolean {
    check`${this.length === other.length} Comparing incorrectly typed bytes!`;
    return u8ArraySameLengthEqual(this.raw, other.raw);
  }

  /** Converts current type into some opaque extension. */
  asOpaque<R>(): Opaque<Bytes<T>, TokenOf<R, Bytes<T>>> {
    return asOpaqueType<Bytes<T>, TokenOf<R, Bytes<T>>>(this);
  }

  toStringTruncated() {
    if (this.raw.length > 8) {
      const start = bytesToHexString(this.raw.subarray(0, 2));
```
