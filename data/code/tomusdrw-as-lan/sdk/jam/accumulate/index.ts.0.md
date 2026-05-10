---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/index.ts#L1-L8'
title: sdk/jam/accumulate/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 661b0a7cf530087f6343b30e0377b4e1144911f700535f4b1cd002945767a38c
language: typescript
---
`sdk/jam/accumulate/index.ts` (lines 1–8)

```typescript
export { Admin, AssignError, BlessError, DesignateError } from "./admin";
export { ChildServices, EjectChildError, NewChildError } from "./child-services";
export { AccumulateContext, TransferError } from "./context";
export { AccumulateFetcher } from "./fetcher";
export * from "./item";
export { Memo } from "./memo";
export { AccumulatePreimages, ForgetError, ProvideError, SolicitError } from "./preimages";
export { SelfService } from "./self-service";
```
