---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/parent.ts#L1-L38
title: bin/rpc/src/handlers/parent.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d28a7424a2100f58bb94b2db2137c1760dbeff2570e189d2a74a60ca38f5db74
language: typescript
---
`bin/rpc/src/handlers/parent.ts` (lines 1–38)

```typescript
import type { HeaderHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode, validation } from "@typeberry/rpc-validation";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#parentheader_hash
 */
export const parent: Handler<"parent"> = async ([headerHash], { db }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const header = db.blocks.getHeader(hashOpaque);
  if (header === null) {
    throw new RpcError(
      RpcErrorCode.BlockUnavailable,
      `Block unavailable: ${hashOpaque.toString()}`,
      validation.hash.encode(hashOpaque.raw),
    );
  }

  const parentHash = header.parentHeaderHash.materialize();

  if (parentHash.isEqualTo(Bytes.zero(HASH_SIZE).asOpaque())) {
    throw new RpcError(RpcErrorCode.Other, `Parent not found for block: ${hashOpaque.toString()}`);
  }

  const parentHeader = db.blocks.getHeader(parentHash);
  if (parentHeader === null) {
    throw new RpcError(
      RpcErrorCode.Other,
      `The hash of parent was found (${parentHash}) but its header doesn't exist in the database.`,
    );
  }

  return {
    header_hash: parentHash.raw,
    slot: parentHeader.timeSlotIndex.materialize(),
  };
};
```
