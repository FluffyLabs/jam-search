---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/rpc.ts#L1-L21
title: packages/jam/config-node/rpc.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c1c9133282cd52cc1ce3730ce92e1efcf3746f8f145cb4ccb716300c0595bd9d
language: typescript
---
`packages/jam/config-node/rpc.ts` (lines 1–21)

```typescript
import type { JsonObject } from "@typeberry/block-json";
import { json } from "@typeberry/json-parser";

/** RPC server options. */
export class RpcOptions {
  static fromJson = json.object<JsonObject<RpcOptions>, RpcOptions>(
    {
      port: "number",
    },
    RpcOptions.new,
  );

  static new({ port }: { port: number }) {
    return new RpcOptions(port);
  }

  private constructor(
    /** Port for the JSON-RPC WebSocket server. */
    public readonly port: number,
  ) {}
}
```
