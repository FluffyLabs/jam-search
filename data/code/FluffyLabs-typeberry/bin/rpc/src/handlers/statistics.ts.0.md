---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/handlers/statistics.ts#L1-L20
title: bin/rpc/src/handlers/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 44dbdbd0ffea291c2f344f755eed7b8c938421d25fdb7aad5b9a2f583267dd52
language: typescript
---
`bin/rpc/src/handlers/statistics.ts` (lines 1–20)

```typescript
import type { HeaderHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { HASH_SIZE } from "@typeberry/hash";
import { type Handler, RpcError, RpcErrorCode } from "@typeberry/rpc-validation";
import { StatisticsData } from "@typeberry/state";

/**
 * https://github.com/polkadot-fellows/JIPs/blob/772ce90bfc33f4e1de9de3bbe10c561753cc0d41/JIP-2.md#statisticsheader_hash
 */
export const statistics: Handler<"statistics"> = async ([headerHash], { db, chainSpec }) => {
  const hashOpaque: HeaderHash = Bytes.fromBlob(headerHash, HASH_SIZE).asOpaque();
  const state = db.states.getState(hashOpaque);

  if (state === null) {
    throw new RpcError(RpcErrorCode.Other, `State not found for block: ${hashOpaque.toString()}`);
  }

  return Encoder.encodeObject(StatisticsData.Codec, state.statistics, chainSpec).raw;
};
```
