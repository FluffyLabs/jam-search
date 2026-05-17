---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.ts#L145-L168'
title: sdk/core/byte-buf.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 4cc835f978ce446bc79badbf1a5b0cc2dfc747e8a14ff35164a0ba025bf81ef6
language: typescript
---
`sdk/core/byte-buf.ts` (lines 145–168)

```typescript
  /** Copy the buffer contents into a new managed Uint8Array. */
  finish(): Uint8Array {
    const out = new Uint8Array(this._pos);
    memory.copy(out.dataStart, this._ptr, this._pos);
    this._pos = 0;
    return out;
  }

  /** Copy the buffer contents into a new `BytesBlob`. */
  finishBlob(): BytesBlob {
    return BytesBlob.wrap(this.finish());
  }

  /** Reset the write position without producing output. */
  reset(): void {
    this._pos = 0;
  }
}

/** Convert a 0-15 nibble to its lowercase hex ASCII char. */
function nibble(n: u8): u8 {
  // 0-9 → '0'-'9' (48-57), 10-15 → 'a'-'f' (97-102)
  return n < 10 ? n + 48 : n + 87;
}
```
