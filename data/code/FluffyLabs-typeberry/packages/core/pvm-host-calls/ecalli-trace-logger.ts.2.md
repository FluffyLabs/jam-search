---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-trace-logger.ts#L246-L258
title: packages/core/pvm-host-calls/ecalli-trace-logger.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 999a961c52da1a4950fef4e8f163ab7349c403d8a9e83bf638cd9daa869df533
language: typescript
---
`packages/core/pvm-host-calls/ecalli-trace-logger.ts` (lines 246–258)

```typescript
    this.reads.push({ address, hex: BytesBlob.blobFrom(data).toString(), len: data.length });
  }

  memWrite(address: U32, data: Uint8Array): void {
    this.writes.push({ address, hex: BytesBlob.blobFrom(data).toString(), len: data.length });
  }

  clear(): void {
    this.reads.length = 0;
    this.writes.length = 0;
    this.registers.clear();
  }
}
```
