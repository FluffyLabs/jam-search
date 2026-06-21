---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/api-debugger.ts#L274-L304
title: assembly/api-debugger.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 6ca283b315143e088c99e059560ab9a94c6fc5905fd89be8332b025194db3026
language: typescript
---
`assembly/api-debugger.ts` (lines 274–304)

```typescript
  }
}

function readPages(pageMap: Uint8Array): InitialPage[] {
  const pages: InitialPage[] = [];
  const codec = new Decoder(pageMap);
  while (!codec.isExhausted()) {
    const p = new InitialPage();
    p.address = codec.u32();
    p.length = codec.u32();
    p.access = codec.u8() > 0 ? Access.Write : Access.Read;
    pages.push(p);
  }
  return pages;
}

function readChunks(chunks: Uint8Array): InitialChunk[] {
  const res: InitialChunk[] = [];
  const codec = new Decoder(chunks);
  while (!codec.isExhausted()) {
    const c = new InitialChunk();
    c.address = codec.u32();
    const len = codec.u32();
    const data = codec.bytes(len);
    for (let i: u32 = 0; i < len; i++) {
      c.data.push(data[i]);
    }
    res.push(c);
  }
  return res;
}
```
