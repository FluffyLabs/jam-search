---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package-fetcher.ts#L116-L143
title: sdk/jam/work-package-fetcher.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 91a139612f8914a7a949bed1d4dc38a96d17d018a98b22be739c8a691b276552
language: typescript
---
`sdk/jam/work-package-fetcher.ts` (lines 116–143)

```typescript
  allWorkItems(): StaticArray<WorkItemInfo> {
    const raw = fetchRawOrPanic(this.fb, FetchKind.AllWorkItems);
    const d = Decoder.fromBlob(raw);
    const r = d.sequenceVarLen<WorkItemInfo>(this.workItemInfo);
    if (r.isError || !d.isFinished()) panic("allWorkItems: host returned malformed data");
    return r.okay!;
  }

  /** Single work-item summary (kind 12). Returns Optional.none if index is out of bounds. */
  oneWorkItem(workItem: u32): Optional<WorkItemInfo> {
    return fetchAndDecodeOptional<WorkItemInfo>(this.fb, this.workItemInfo, FetchKind.OneWorkItem, workItem);
  }

  /** Work-item payload blob (kind 13). Returns Optional.none if index is out of bounds. */
  workItemPayload(workItem: u32): Optional<BytesBlob> {
    return fetchBlob(this.fb, FetchKind.WorkItemPayload, workItem);
  }

  /** Fetch a raw blob by kind, panicking if unavailable. */
  blobOrPanic(kind: FetchKind, param1: u32 = 0, param2: u32 = 0): BytesBlob {
    return fetchBlobOrPanic(this.fb, kind, param1, param2);
  }

  /** Fetch a raw blob by kind, returning Optional.none if unavailable. */
  blob(kind: FetchKind, param1: u32 = 0, param2: u32 = 0): Optional<BytesBlob> {
    return fetchBlob(this.fb, kind, param1, param2);
  }
}
```
