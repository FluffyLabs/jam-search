---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/unsubscribe.ts#L1-L9
title: bin/rpc/src/handlers/unsubscribe.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c8febf5c05c8b9e7b337d9490ae06793e09cbe86ac42ccff3663f563ec6e8354
language: typescript
---
`bin/rpc/src/handlers/unsubscribe.ts` (lines 1–9)

```typescript
import type { GenericHandler, validation } from "@typeberry/rpc-validation";
import type z from "zod";

export const unsubscribe: GenericHandler<
  z.infer<typeof validation.unsubscribeSchema.input>,
  z.infer<typeof validation.unsubscribeSchema.output>
> = async ([id], { subscription }) => {
  return subscription.unsubscribe(id);
};
```
