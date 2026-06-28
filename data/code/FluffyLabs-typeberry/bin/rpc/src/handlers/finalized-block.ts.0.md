---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/finalized-block.ts#L1-L9
title: bin/rpc/src/handlers/finalized-block.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: d01aeff3a42dc84d71a40797274eb62a0887afbc293592dd35213faf5fdbddf4
language: typescript
---
`bin/rpc/src/handlers/finalized-block.ts` (lines 1–9)

```typescript
import type { Handler } from "@typeberry/rpc-validation";
import { bestBlock } from "./best-block.js";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#finalizedblock
 */
export const finalizedBlock: Handler<"finalizedBlock"> = async (params, context) => {
  return bestBlock(params, context); // todo [seko] implement finalized block logic once finality is there
};
```
