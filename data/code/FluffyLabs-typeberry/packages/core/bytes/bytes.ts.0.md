---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/bytes.ts#L1-L137
title: packages/core/bytes/bytes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: a6ddea2ede18240163239a48529f9f1a47e918c39a7c191db88bb8a4724aa0fd
language: typescript
---
`packages/core/bytes/bytes.ts` (lines 1–137)

```typescript
import { type Comparator, Ordering } from "@typeberry/ordering";
import {
  asOpaqueType,
  check,
  type Opaque,
  safeAllocUint8Array,
  TEST_COMPARE_USING,
  type TokenOf,
} from "@typeberry/utils";

// TODO: [MaSo] Update BytesBlob and Bytes, so they return Result (not throw error)
/**
 * A variable-length blob of bytes with a concise text representation.
 *
 * The structure is used as convenience wrapper for [`Uint8Array`],
 * especially if the data is coming from a hex-encoded string.
 */
export class BytesBlob {
  [TEST_COMPARE_USING]() {
    return this.toString();
  }

  readonly raw: Uint8Array;
  readonly length: number = 0;

  protected constructor(data: Uint8Array) {
    this.raw = data;
    this.length = data.byteLength;
  }

  /**
   * Display a hex-encoded version of this byte blob.
   */
  toString() {
    return bytesToHexString(this.raw);
  }

  /** Display a hex-encoded version of this byte blob, but truncated if it's large. */
  toStringTruncated() {
    const bytes = `${this.raw.length} ${this.raw.length === 1 ? "byte" : "bytes"}`;
    if (this.raw.length > 32) {
      const start = bytesToHexString(this.raw.subarray(0, 16));
      const end = bytesToHexString(this.raw.subarray(this.raw.length - 16));
      return `${start}...${end.substring(2)} (${bytes})`;
    }
    return `${this.toString()} (${bytes})`;
  }

  toJSON() {
    return this.toString();
  }

  /** Decode contained bytes as string. */
  asText() {
    const decoder = new TextDecoder();
    return decoder.decode(this.raw);
  }

  /** Compare the sequence to another one. */
  isEqualTo(other: BytesBlob): boolean {
    if (this.length !== other.length) {
      return false;
    }

    return u8ArraySameLengthEqual(this.raw, other.raw);
  }

  /** Compare the sequence to another one lexicographically.
   *  Returns `Ordering.Less` if "this" blob is less than (or shorter than) "other", `Ordering.Equal` if blobs are identical and `Ordering.Greater` otherwise.
   *  https://graypaper.fluffylabs.dev/#/5f542d7/07c40007c400
   */
  public compare(other: BytesBlob) {
    const min = Math.min(this.length, other.length);
    const thisRaw = this.raw;
    const otherRaw = other.raw;

    for (let i = 0; i < min; i++) {
      if (thisRaw[i] < otherRaw[i]) {
        return Ordering.Less;
      }

      if (thisRaw[i] > otherRaw[i]) {
        return Ordering.Greater;
      }
    }

    if (this.length < other.length) {
      return Ordering.Less;
    }

    if (this.length > other.length) {
      return Ordering.Greater;
    }

    return Ordering.Equal;
  }

  /** Create a new [`BytesBlob`] with no data. */
  static empty(): BytesBlob {
    return new BytesBlob(new Uint8Array());
  }

  /** Create a new [`BytesBlob'] by converting given UTF-u encoded string into bytes. */
  static blobFromString(v: string): BytesBlob {
    const encoder = new TextEncoder();
    return BytesBlob.blobFrom(encoder.encode(v));
  }

  /** Create a new [`BytesBlob`] from existing [`Uint8Array`]. */
  static blobFrom(v: Uint8Array): BytesBlob {
    return new BytesBlob(v);
  }

  /** Create a new [`BytesBlob`] by concatenating data from multiple `Uint8Array`s. */
  static blobFromParts(v: Uint8Array | Uint8Array[], ...rest: Uint8Array[]) {
    const vArr = v instanceof Uint8Array ? [v] : v;
    const totalLength = vArr.reduce((a, v) => a + v.length, 0) + rest.reduce((a, v) => a + v.length, 0);
    const buffer = safeAllocUint8Array(totalLength);
    let offset = 0;
    for (const r of vArr) {
      buffer.set(r, offset);
      offset += r.length;
    }
    for (const r of rest) {
      buffer.set(r, offset);
      offset += r.length;
    }
    return new BytesBlob(buffer);
  }

  /** Create a new [`BytesBlob`] from an array of bytes. */
  static blobFromNumbers(v: number[]): BytesBlob {
    check`${v.find((x) => (x & 0xff) !== x) === undefined} BytesBlob.blobFromNumbers used with non-byte number array.`;
    const arr = new Uint8Array(v);
    return new BytesBlob(arr);
  }

```
