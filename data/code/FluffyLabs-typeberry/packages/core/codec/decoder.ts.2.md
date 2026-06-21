---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.ts#L279-L393
title: packages/core/codec/decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 3
content_sha: 292e0f90f30185125bf33f8f7ff3d4906cca54a750b080e4339260e9e83de45c
language: typescript
---
`packages/core/codec/decoder.ts` (lines 279–393)

```typescript
    const byteLength = Math.ceil(bitLength / 8);
    const bytes = this.bytes(byteLength);

    // verify that the remaining bits are zero
    const emptyBitsStart = bitLength % 8;
    if (emptyBitsStart > 0) {
      const lastByte = bytes.raw[byteLength - 1];
      const emptyBits = lastByte >> emptyBitsStart;
      if (emptyBits > 0) {
        throw new Error("Non-zero bits found in the last byte of bitvec encoding.");
      }
    }

    return BitVec.fromBytes(bytes, bitLength);
  }

  /** Decode a variable-length sequence of bits. */
  bitVecVarLen(): BitVec {
    const bitLength = this.varU32();
    return this.bitVecFixLen(bitLength);
  }

  /** Decode a composite object. */
  object<T>(decode: Decode<T>): T {
    return decode.decode(this);
  }

  /** Decode a possibly optional value. */
  optional<T>(decode: Decode<T>): T | null {
    const isSet = this.bool();
    if (!isSet) {
      return null;
    }
    return decode.decode(this);
  }

  /** Decode a known-length sequence of elements. */
  sequenceFixLen<T>(decode: Decode<T>, len: number): T[] {
    const result = Array<T>(len);
    for (let i = 0; i < len; i += 1) {
      result[i] = decode.decode(this);
    }
    return result;
  }

  /** Decode a variable-length sequence of elements. */
  sequenceVarLen<T>(decode: Decode<T>): T[] {
    const len = this.varU32();
    return this.sequenceFixLen(decode, len);
  }

  /**
   * Move the decoding cursor to given offset.
   *
   * Note the offset can actually be smaller than the current offset
   * (i.e. one can go back).
   */
  resetTo(newOffset: number) {
    if (this.offset < newOffset) {
      this.skip(newOffset - this.offset);
    } else {
      check`${newOffset >= 0} The offset has to be positive`;
      this.offset = newOffset;
    }
  }

  /** Skip given number of bytes for decoding. */
  skip(bytes: number) {
    this.ensureHasBytes(bytes);
    this.offset += bytes;
  }

  /**
   * Finish decoding `source` object and make sure there is no data left.
   *
   * This method can be called when the entire object that was meant to be
   * stored in the `source` is now fully decoded and we want to ensure
   * that there is no extra bytes contained in the `source`.
   */
  finish() {
    if (this.offset < this.source.length) {
      throw new Error(`Expecting end of input, yet there are still ${this.source.length - this.offset} bytes left.`);
    }
  }

  private getNum<T>(bytes: number, f: () => T) {
    this.ensureHasBytes(bytes);
    const num = f();
    this.offset += bytes;
    return num;
  }

  private ensureHasBytes(bytes: number) {
    check`${bytes >= 0} Negative number of bytes given.`;
    if (this.offset + bytes > this.source.length) {
      throw new EndOfDataError(
        `Attempting to decode more data than there is left. Need ${bytes}, left: ${this.source.length - this.offset}.`,
      );
    }
  }
}

const MASKS = [0xff, 0xfe, 0xfc, 0xf8, 0xf0, 0xe0, 0xc0, 0x80];
export function decodeVariableLengthExtraBytes(firstByte: number) {
  check`${firstByte >= 0 && firstByte < 256} Incorrect byte value: ${firstByte}`;
  for (let i = 0; i < MASKS.length; i++) {
    if (firstByte >= MASKS[i]) {
      return 8 - i;
    }
  }

  return 0;
}

export class EndOfDataError extends Error {}
```
