---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/decode.ts#L277-L313
title: sdk/core/codec/decode.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 2
chunk_total: 3
content_sha: 73d5ce9f44ad849aafd8db74cafc2a78608bab6f6e7588983df69ae48142049a
language: typescript
---
`sdk/core/codec/decode.ts` (lines 277–313)

```typescript
   * Finish decoding `source` object and make sure there is no data left.
   *
   * This method can be called when the entire object that was meant to be
   * stored in the `source` is now fully decoded and we want to ensure
   * that there is no extra bytes contained in the `source`.
   */
  isFinished(): boolean {
    // TODO [ToDr] set isError?
    return this.offset === this.source.length;
  }

  // Progress the offset, but return the previous offset or -1 if not enough bytes.
  private moveOffset(bytes: u32): u32 {
    if (this.hasBytes(bytes)) {
      const currentOffset = this.offset;
      this.offset += bytes;
      return currentOffset;
    }
    this._isError = true;
    return -1;
  }

  private hasBytes(bytes: u32): boolean {
    return bytes <= <u32>this.source.length - this.offset;
  }
}

const MASKS: u8[] = [0xff, 0xfe, 0xfc, 0xf8, 0xf0, 0xe0, 0xc0, 0x80];

function decodeVariableLengthExtraBytes(firstByte: u8): u8 {
  for (let i: u8 = 0; i < <u8>MASKS.length; i++) {
    if (firstByte >= MASKS[i]) {
      return 8 - i;
    }
  }
  return 0;
}
```
