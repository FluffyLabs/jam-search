---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc/test/e2e-server.ts#L1-L41
title: packages/jam/rpc/test/e2e-server.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 30004e674143ff0746aa29980f1eeb12293f5ce93ac9b3ee3b9cfd18b1889b97
language: typescript
---
`packages/jam/rpc/test/e2e-server.ts` (lines 1–41)

```typescript
import { PvmBackend } from "@typeberry/config";
import { loadConfig, NODE_DEFAULTS } from "@typeberry/config-node";
import { Blake2b } from "@typeberry/hash";
import { getChainSpec, getDatabasePath } from "@typeberry/node";
import { validation } from "@typeberry/rpc-validation";
import { workspacePathFix } from "@typeberry/utils";
import { FjallWorkerConfig } from "@typeberry/workers-api-node";
import { handlers } from "../src/handlers.js";
import { RpcServer } from "../src/server.js";

const DEFAULT_PORT = 19800;

const withRelPath = workspacePathFix(`${import.meta.dirname}/../../../..`);

export async function startTestRpcServer(configPath: string, port = DEFAULT_PORT) {
  const blake2b = await Blake2b.createHasher();
  const nodeName = NODE_DEFAULTS.name;
  const nodeConfig = loadConfig([configPath], withRelPath);
  const spec = getChainSpec(nodeConfig.flavor);
  if (nodeConfig.databaseBasePath === undefined) {
    throw new Error("RPC server requires a persistent database path.");
  }

  const { dbPath } = getDatabasePath(
    blake2b,
    nodeName,
    nodeConfig.chainSpec.genesisHeader,
    withRelPath(nodeConfig.databaseBasePath),
  );

  const dbConfigParams = {
    nodeName,
    chainSpec: spec,
    workerParams: undefined,
    dbPath,
    blake2b,
  };
  const rootDb = await FjallWorkerConfig.new(dbConfigParams).openDatabase({ readonly: true });

  return RpcServer.new(port, rootDb, spec, blake2b, PvmBackend.Ananas, handlers, validation.schemas);
}
```
