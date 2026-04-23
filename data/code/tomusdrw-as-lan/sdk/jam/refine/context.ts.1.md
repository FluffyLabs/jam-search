---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/context.ts#L105-L118
title: sdk/jam/refine/context.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 1
chunk_total: 2
content_sha: f874d3b88fb51556fd671e95a7861b004602ff821075b5fe705c41d82bb84763
language: typescript
---
`sdk/jam/refine/context.ts` (lines 105–118)

```typescript
  /** Encode a response and return it as a ptrAndLen-packed u64. */
  respond(ecalliResult: i64, data: Uint8Array | null = null): u64 {
    const bytes = data === null ? BytesBlob.empty() : BytesBlob.wrap(data);
    const enc = Encoder.create(8 + 1 + bytes.raw.length);
    this.response.encode(Response.create(ecalliResult, bytes), enc);
    return ptrAndLen(enc.finishRaw());
  }
}

/** Error from exportSegment(). */
export enum ExportSegmentError {
  /** Segment export limit reached (FULL sentinel). */
  Full,
}
```
