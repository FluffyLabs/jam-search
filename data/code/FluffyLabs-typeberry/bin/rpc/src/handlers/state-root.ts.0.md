---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/state-root.ts#L1-L19
title: bin/rpc/src/handlers/state-root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6e157822cd6810938fa7865ec8594f9a405129e35ede0d02277d2876214fb3fd
language: typescript
---
`bin/rpc/src/handlers/state-root.ts` (lines 1–19)

```typescript
import type { HeaderHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#staterootheader_hash
 */
export const stateRoot: Handler<"stateRoot"> = async ([headerHash], { db }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();

  const stateRoot = db.blocks.getPostStateRoot(hashOpaque);

  if (stateRoot === null) {
    throw new RpcError(RpcErrorCode.BlockUnavailable, `Block unavailable: ${hashOpaque.toString()}`, hashOpaque.raw);
  }

  return stateRoot.raw;
};
```
