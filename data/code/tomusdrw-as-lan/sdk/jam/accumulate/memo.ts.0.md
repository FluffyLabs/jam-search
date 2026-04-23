---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/memo.ts#L1-L44'
title: sdk/jam/accumulate/memo.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 9cf9c1cd36beb855550ea57311ead0cc0b8fc2f9851bc5af773dcc90511afc67
language: typescript
---
`sdk/jam/accumulate/memo.ts` (lines 1–44)

```typescript
/**
 * Fixed-size 128-byte memo for transfers.
 *
 * Shorter input is zero-padded to 128 bytes. Input exceeding 128 bytes
 * is silently truncated.
 */

import { BytesBlob } from "../../core/bytes";
import { TRANSFER_MEMO_SIZE } from "./item";

export { TRANSFER_MEMO_SIZE };

export class Memo {
  /**
   * Create a memo from arbitrary data.
   *
   * If data is shorter than 128 bytes it is zero-padded.
   * If data is longer than 128 bytes it is truncated.
   */
  static create(data: BytesBlob): Memo {
    if (<u32>data.length === TRANSFER_MEMO_SIZE) {
      return new Memo(data);
    }
    const padded = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    const copyLen = min<u32>(<u32>data.length, TRANSFER_MEMO_SIZE);
    memory.copy(padded.raw.dataStart, data.raw.dataStart, copyLen);
    return new Memo(padded);
  }

  /** Create an empty memo (128 zero bytes). */
  static empty(): Memo {
    return new Memo(BytesBlob.zero(TRANSFER_MEMO_SIZE));
  }

  private constructor(
    /** The 128-byte memo data. */
    public readonly data: BytesBlob,
  ) {}

  /** Pointer to the underlying memory (for ecalli calls). */
  ptr(): u32 {
    return this.data.ptr();
  }
}
```
