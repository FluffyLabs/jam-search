---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/list-services.ts#L1-L20
title: bin/rpc/src/handlers/list-services.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 21302dbd3b4ff2aa81a5342457d42373bc12db4bf4372527eb87996cfe8c1b0e
language: typescript
---
`bin/rpc/src/handlers/list-services.ts` (lines 1–20)

```typescript
import type { HeaderHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#listservicesheader_hash
 */
export const listServices: Handler<"listServices"> = async ([headerHash], { db }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const state = db.states.getState(hashOpaque);

  if (state === null) {
    throw new RpcError(RpcErrorCode.Other, `Posterior state not found for block: ${hashOpaque.toString()}`);
  }

  const serviceIds = state.recentServiceIds();

  return [...serviceIds];
};
```
