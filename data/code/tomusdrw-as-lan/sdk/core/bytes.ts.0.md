---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/bytes.ts#L1-L161'
title: sdk/core/bytes.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 2
content_sha: ffe8e6b861cd29f2e8f7bf5441721e384219db53a8a3d5278a75795de30a3b7f
language: typescript
---
`sdk/core/bytes.ts` (lines 1–161)

```typescript
import { ptrAndLen, U8WithError, u8IsError, u8WithError } from "./pack";
import { Result } from "./result";

export enum BlobParseError {
  MissingPrefix = 0,
  InvalidNumberOfNibbles = 1,
  InvalidCharacters = 2,
}

export class BytesBlob {
  /** Enrich an existing Uint8Array. */
  static wrap(data: Uint8Array): BytesBlob {
    return new BytesBlob(data);
  }

  /**
   * Encode an ASCII string (1 byte per char, no UTF-8 overhead).
   *
   * Prefer this over `encodeUtf8` for ASCII-only strings (log targets, storage keys, etc.)
   * as it avoids pulling in the full UTF-8 machinery (~520 B WASM / ~1.15 KB PVM).
   * Use `encodeUtf8` when full UTF-8 support is needed.
   */
  static encodeAscii(str: string): BytesBlob {
    const len = str.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buf[i] = str.charCodeAt(i);
    }
    return BytesBlob.wrap(buf);
  }

  /** Encode an UTF8 string. */
  static encodeUtf8(str: string): BytesBlob {
    return BytesBlob.wrap(Uint8Array.wrap(String.UTF8.encode(str)));
  }

  /** Zero-filled bytes buffer of given length. */
  static zero(length: u32): BytesBlob {
    return new BytesBlob(new Uint8Array(length));
  }

  /** Empty byte buffer (zero-length). */
  static empty(): BytesBlob {
    return BytesBlob.zero(0);
  }

  /** Parse hex bytes blob with 0x prefix. */
  static parseBlob(v: string): Result<BytesBlob, BlobParseError> {
    if (v.startsWith("0x")) {
      return BytesBlob.parseBlobNoPrefix(v.slice(2));
    }
    return Result.err<BytesBlob, BlobParseError>(BlobParseError.MissingPrefix);
  }

  /** Parse hex bytes blob without 0x prefix. */
  static parseBlobNoPrefix(v: string): Result<BytesBlob, BlobParseError> {
    const len = v.length;
    if (len % 2 === 1) {
      return Result.err<BytesBlob, BlobParseError>(BlobParseError.InvalidNumberOfNibbles);
    }

    const bytes = new Uint8Array(len / 2);
    for (let i = 0; i < len - 1; i += 2) {
      const c = v.slice(i, i + 2);
      const b = byteFromString(c);
      if (u8IsError(b)) {
        return Result.err<BytesBlob, BlobParseError>(BlobParseError.InvalidCharacters);
      }
      bytes[i / 2] = b;
    }

    return Result.ok<BytesBlob, BlobParseError>(new BytesBlob(bytes));
  }

  private constructor(public readonly raw: Uint8Array) {}

  @inline()
  get length(): i32 {
    return this.raw.length;
  }

  subarray(start: u32, end: u32): BytesBlob {
    return BytesBlob.wrap(this.raw.subarray(start, end));
  }

  toString(): string {
    return bytesToHexString(this.raw);
  }

  @inline()
  ptr(): u32 {
    return u32(this.raw.dataStart);
  }

  @inline()
  toPtrAndLen(): u64 {
    return ptrAndLen(this.raw);
  }

  isEqualTo(other: BytesBlob): bool {
    const a = this.raw;
    const b = other.raw;
    const len = a.length;
    if (len !== b.length) {
      return false;
    }
    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}

export enum Bytes32Error {
  NotEnoughData = 0,
}

export class Bytes32 {
  /** Wrap raw bytes as Bytes32 without any length validation. */
  static wrapUnchecked(raw: Uint8Array): Bytes32 {
    return new Bytes32(raw);
  }

  static wrap(data: Uint8Array): Result<Bytes32, Bytes32Error> {
    if (data.length !== 32) {
      return Result.err(Bytes32Error.NotEnoughData);
    }
    return Result.ok<Bytes32, Bytes32Error>(new Bytes32(data));
  }

  static zero(): Bytes32 {
    return new Bytes32(new Uint8Array(32));
  }

  public readonly bytes: BytesBlob;
  public readonly raw: Uint8Array;

  private constructor(data: Uint8Array) {
    const bytes = BytesBlob.wrap(data);
    this.bytes = bytes;
    this.raw = bytes.raw;
  }

  @inline()
  get length(): i32 {
    return this.raw.length;
  }

  @inline()
  ptr(): u32 {
    return u32(this.raw.dataStart);
  }

  toString(): string {
    return this.bytes.toString();
  }
}

const CODE_OF_0: i32 = "0".charCodeAt(0);
```
