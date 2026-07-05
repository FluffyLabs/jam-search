---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/not-implemented.ts#L1-L9
title: bin/rpc/src/handlers/not-implemented.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7482544ce30c526fb32be879d8a824f8e3d694ffa12e8fa9ac493a04a0db647c
language: typescript
---
`bin/rpc/src/handlers/not-implemented.ts` (lines 1–9)

```typescript
import { type GenericHandler, RpcError, RpcErrorCode, type validation } from "@typeberry/rpc-validation";
import type z from "zod";

export const notImplemented: GenericHandler<
  z.infer<typeof validation.notImplementedSchema.input>,
  z.infer<typeof validation.notImplementedSchema.output>
> = () => {
  throw new RpcError(RpcErrorCode.Other, "Method not implemented");
};
```
