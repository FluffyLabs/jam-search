---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/encoder.ts#L1-L146
title: packages/core/codec/encoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 4
content_sha: 1d9c85eb63833c88dcccfaba6a5f5c79c26fa841e17a965e71f4b774779756ad
language: typescript
---
`packages/core/codec/encoder.ts` (lines 1–146)

```typescript
import type { BitVec } from "@typeberry/bytes";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { check } from "@typeberry/utils";
import { tryAsU8 } from "../numbers/index.js";

/** Hint for how big the encoded object will be. */
export type SizeHint = {
  /** Number of bytes in the encoding. */
  bytes: number;
  /** Is `bytes` the exact number of bytes that will be used or just a hint? */
  isExact: boolean;
};

export function tryAsExactBytes(a: SizeHint): number {
  check`${a.isExact} The value is not exact size estimation!`;
  return a.bytes;
}

export function addSizeHints(a: SizeHint, b: SizeHint): SizeHint {
  return {
    bytes: a.bytes + b.bytes,
    isExact: a.isExact && b.isExact,
  };
}

/** An encoder for some specific type `T`. */
export type Encode<T> = {
  /** Encode given element of type `T`. */
  encode: (encoder: Encoder, elem: T) => void;
  /**
   * A hint about size of that type.
   *
   * Can be used as an optimization for how many bytes should be allocated for that type.
   */
  sizeHint: SizeHint;
};

/**
 * I had to extend ArrayBuffer type to use resizable ArrayBuffer.
 * We will be able to remove it when this is merged: https://github.com/microsoft/TypeScript/pull/58573
 * And then a new version of TypeScript is released.
 */
declare global {
  interface ArrayBufferConstructor {
    new (length: number, options?: { maxByteLength: number }): ArrayBuffer;
  }

  interface ArrayBuffer {
    resize(length: number): void;
  }
}

/**
 * New encoder options.
 *
 * Either provide a destination (needs to be able to fit all the data!)
 * or hint the expected length of the encoding to avoid re-allocations.
 */
export type Options =
  | {
      expectedLength: number;
    }
  | {
      destination: Uint8Array;
    };

const DEFAULT_START_LENGTH = 512; // 512B
const MAX_LENGTH = 20 * 1024 * 1024; // 20MB

/**
 * JAM encoder.
 */
export class Encoder {
  /**
   * Create a new encoder either to fill up given `destination`
   * or with a minimal expected size.
   */
  static create(options?: Options) {
    if (options !== undefined && "destination" in options) {
      return new Encoder(options.destination);
    }

    const startLength = options?.expectedLength ?? DEFAULT_START_LENGTH;
    const buffer = new ArrayBuffer(Math.min(MAX_LENGTH, startLength), { maxByteLength: MAX_LENGTH });
    const destination = new Uint8Array(buffer);
    return new Encoder(destination, buffer);
  }

  /**
   * Encode just a single object.
   *
   * NOTE that if you need to encode a tuple glueing together outputs
   * of that function is going to be sub-optimal!
   *
   * This is only for one-shot encodings.
   */
  static encodeObject<T>(encode: Encode<T>, object: T, context?: unknown): BytesBlob {
    const encoder = Encoder.create({
      expectedLength: encode.sizeHint.bytes || DEFAULT_START_LENGTH,
    });
    encoder.attachContext(context);
    encoder.object(encode, object);
    return encoder.viewResult();
  }

  private offset = 0;
  private context?: unknown;

  private readonly dataView: DataView;

  private constructor(
    private readonly destination: Uint8Array,
    private readonly buffer?: ArrayBuffer,
  ) {
    if (buffer !== undefined) {
      this.dataView = new DataView(buffer);
    } else {
      this.dataView = new DataView(destination.buffer, destination.byteOffset, destination.byteLength);
    }
  }

  /**
   * Attach context to the encoder.
   *
   * The context object can be used to pass some "global" parameters
   * down to custom encoders.
   */
  attachContext(context?: unknown) {
    this.context = context;
  }

  /**
   * Get the encoding context object.
   */
  getContext(): unknown {
    return this.context;
  }

  /**
   * View the current encoding result.
   *
   * Note that the resulting array here, might be shorter than the
   * underlying `destination`.
   */
  viewResult() {
```
