---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc/src/handlers/subscribe-best-block.ts#L1-L9
title: packages/jam/rpc/src/handlers/subscribe-best-block.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e77dde919bb4aa7012e3d3439776733cd672914a87d9aec48d936fc0177a09f6
language: typescript
---
`packages/jam/rpc/src/handlers/subscribe-best-block.ts` (lines 1–9)

```typescript
import { type Handler, validation } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#subscribebestblock
 */
export const subscribeBestBlock: Handler<"subscribeBestBlock"> = async (params, { subscription }) => {
  return subscription.subscribe("subscribeBestBlock", bestBlock, validation.schemas.bestBlock.output, params);
};
```
