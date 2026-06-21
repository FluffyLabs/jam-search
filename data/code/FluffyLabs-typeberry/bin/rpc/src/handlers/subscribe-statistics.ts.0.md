---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/subscribe-statistics.ts#L1-L20
title: bin/rpc/src/handlers/subscribe-statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 442d7ba5cb23c80dae62c2e4d2ba548afb8dda2827b56f993fa78697f9f5f44a
language: typescript
---
`bin/rpc/src/handlers/subscribe-statistics.ts` (lines 1–20)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";
import { finalizedBlock } from "./finalized-block.js";
import { statistics } from "./statistics.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribestatisticsfinalized
 */
export const subscribeStatistics: Handler<"subscribeStatistics"> = async (params, { subscription }) => {
  return subscription.subscribe(
    "subscribeStatistics",
    async ([finalized], context) => {
      const block = finalized ? await finalizedBlock([], context) : await bestBlock([], context);

      return statistics([block.header_hash], context);
    },
    validation.schemas.statistics.output,
    params,
  );
};
```
