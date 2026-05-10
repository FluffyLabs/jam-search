---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/authorizer/assembly/authorize.ts#L1-L35
title: examples/authorizer/assembly/authorize.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 944a4f395629e1083983759e8a07b339a4f305ed5107373efb39a7fd50074b16
language: typescript
---
`examples/authorizer/assembly/authorize.ts` (lines 1–35)

```typescript
import { AuthorizeContext, AuthorizeFetcher, ByteBuf, gas, LogMsg, panic, ptrAndLen } from "@fluffylabs/as-lan";

const logger: LogMsg = LogMsg.create("auth");

export function is_authorized(ptr: u32, len: u32): u64 {
  const ctx = AuthorizeContext.create();
  const coreIndex = ctx.parseCoreIndex(ptr, len);
  const fetcher = AuthorizeFetcher.create();

  const authConfig = fetcher.authConfig();
  const token = fetcher.authToken();

  logger
    .str("Null Authorizer, [")
    .u32(u32(coreIndex))
    .str("], ")
    .u64(u64(gas()))
    .str(" gas, ")
    .blob(authConfig)
    .str(" param, ")
    .blob(token)
    .str(" token")
    .info();

  if (!token.isEqualTo(authConfig)) {
    panic("Authorization failed");
  }

  const trace = ByteBuf.create(7 + token.length)
    .strAscii("Auth=<")
    .bytes(token.raw)
    .strAscii(">")
    .finish();
  return ptrAndLen(trace);
}
```
