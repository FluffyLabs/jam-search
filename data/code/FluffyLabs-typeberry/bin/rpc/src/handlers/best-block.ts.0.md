---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/best-block.ts#L1-L22
title: bin/rpc/src/handlers/best-block.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bdd3a0a8247673e5b4001b62980c6b70e501799bd312da84ead772733a27406d
language: typescript
---
`bin/rpc/src/handlers/best-block.ts` (lines 1–22)

```typescript
import { type Handler, RpcError, RpcErrorCode, validation } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#bestblock
 */
export const bestBlock: Handler<"bestBlock"> = async (_params, { db }) => {
  const headerHash = db.blocks.getBestHeaderHash();
  const header = db.blocks.getHeader(headerHash);

  if (header === null) {
    throw new RpcError(
      RpcErrorCode.BlockUnavailable,
      `Best header not found with hash: ${headerHash.toString()}`,
      validation.hash.encode(headerHash.raw),
    );
  }

  return {
    header_hash: headerHash.raw,
    slot: header.timeSlotIndex.materialize(),
  };
};
```
