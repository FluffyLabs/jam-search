---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/subscribe-finalized-block.ts#L1-L14
title: bin/rpc/src/handlers/subscribe-finalized-block.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: c2b7f10c88e1aba615a437ff3bb75db5dde1983bf0aeffaea75687501467b8fa
language: typescript
---
`bin/rpc/src/handlers/subscribe-finalized-block.ts` (lines 1–14)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { finalizedBlock } from "./finalized-block.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribefinalizedblock
 */
export const subscribeFinalizedBlock: Handler<"subscribeFinalizedBlock"> = async (params, { subscription }) => {
  return subscription.subscribe(
    "subscribeFinalizedBlock",
    finalizedBlock,
    validation.schemas.finalizedBlock.output,
    params,
  );
};
```
