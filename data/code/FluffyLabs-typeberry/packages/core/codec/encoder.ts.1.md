---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/encoder.ts#L137-L269
title: packages/core/codec/encoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 64f6308cacbe12752e19bee6bf6c1d407fa2d57e42305e0a6fbfa349bf851c95
language: typescript
---
`packages/core/codec/encoder.ts` (lines 137–269)

```typescript
    return this.context;
  }

  /**
   * View the current encoding result.
   *
   * Note that the resulting array here, might be shorter than the
   * underlying `destination`.
   */
  viewResult() {
    return BytesBlob.blobFrom(this.destination.subarray(0, this.offset));
  }

  /**
   * Encode a 32-bit integer.
   *
   * The encoding will always occupy 4 bytes in little-endian ordering.
   * Negative numbers are represented as a two-complement.
   */
  i32(num: number) {
    this.prepareIntegerN(num, 4);
    this.dataView.setInt32(this.offset, num, true);
    this.offset += 4;
  }

  /**
   * Encode a 64-bit integer.
   *
   * The encoding will always occupy 8 bytes in little-endian ordering.
   * Negative numbers are represented as a two-complement.
   */
  i64(num: bigint) {
    const maxNum = 2n ** 64n;
    // note that despite the actual range of values being within:
    // `[ - maxNum / 2, maxNum / 2)`
    // we still allow positive numbers from `[maxNum / 2, maxNum)`.
    // So it does not matter if the argument is a negative value,
    // OR if someone just gave us two-complement already.
    check`${num < maxNum} Only for numbers up to 2**64 - 1`;
    check`${-num <= maxNum / 2n} Only for numbers down to -2**63`;
    this.ensureBigEnough(8);

    this.dataView.setBigInt64(this.offset, num, true);
    this.offset += 8;
  }

  /**
   * Encode a 24-bit integer.
   *
   * The encoding will always occupy 3 bytes in little-endian ordering.
   * Negative numbers are represented as a two-complement.
   */
  i24(num: number) {
    this.prepareIntegerN(num, 3);
    this.dataView.setInt8(this.offset, num & 0xff);
    this.dataView.setInt16(this.offset + 1, num >> 8, true);
    this.offset += 3;
  }

  /**
   * Encode a 16-bit integer.
   *
   * The encoding will always occupy 2 bytes in little-endian ordering.
   * Negative numbers are represented as a two-complement.
   */
  i16(num: number) {
    this.prepareIntegerN(num, 2);
    this.dataView.setInt16(this.offset, num, true);
    this.offset += 2;
  }

  /**
   * Encode a 8-bit integer.
   *
   * The encoding will always occupy 1 byte in little-endian ordering.
   * Negative numbers are represented as a two-complement.
   */
  i8(num: number) {
    this.prepareIntegerN(num, 1);
    this.dataView.setInt8(this.offset, num);
    this.offset += 1;
  }

  /**
   * Encode a single boolean discriminator using 1-byte encoding.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/375300375300
   */
  bool(bool: boolean) {
    this.i8(tryAsU8(bool ? 1 : 0));
  }

  /**
   * Prepare for encoding of a fixed-bytes number.
   *
   *
   * The encoding will always occupy N bytes in little-endian ordering.
   * Negative numbers are represented as a two-complement.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/36fc0136fc01
   */
  private prepareIntegerN(num: number, bytesToEncode: 1 | 2 | 3 | 4) {
    const BITS = 8;
    const maxNum = 2 ** (BITS * bytesToEncode);
    // note that despite the actual range of values being within:
    // `[ - maxNum / 2, maxNum / 2)`
    // we still allow positive numbers from `[maxNum / 2, maxNum)`.
    // So it does not matter if the argument is a negative value,
    // OR if someone just gave us two-complement already.
    check`${num < maxNum} Only for numbers up to 2**${BITS * bytesToEncode} - 1`;
    check`${-num <= maxNum / 2} Only for numbers down to -2**${BITS * bytesToEncode - 1}`;

    this.ensureBigEnough(bytesToEncode);
  }

  /**
   * Encode a 32-bit natural number (compact).
   *
   * The encoding can take variable amount of bytes depending on the actual value.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/365202365202
   */
  varU32(num: U32) {
    check`${num >= 0} Only for natural numbers.`;
    check`${num < 2 ** 32} Only for numbers up to 2**32`;
    this.varU64(BigInt(num));
  }

  /**
   * Encode a 64-bit natural number (compact).
   *
   * The encoding can take variable amount of bytes depending on the actual value.
   *
```
