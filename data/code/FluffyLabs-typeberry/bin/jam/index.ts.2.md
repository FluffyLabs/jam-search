---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L230-L258'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: d35f0b4b97244b3bf2b5ab321ed23b3c4efdc10d696b4c7033f42667352c423d
language: typescript
---
`bin/jam/index.ts` (lines 230–258)

```typescript
    logger.warn`RPC server requires a persistent database; skipping (in-memory mode).`;
    return null;
  }

  const chainSpec = getChainSpec(config.node.flavor);
  const { dbPath } = getDatabasePath(
    blake2b,
    config.nodeName,
    config.node.chainSpec.genesisHeader,
    withRelPath(config.node.databaseBasePath),
  );

  const dbConfigParams = {
    nodeName: config.nodeName,
    chainSpec,
    workerParams: undefined,
    dbPath,
    blake2b,
  };

  const rootDb = await FjallWorkerConfig.new(dbConfigParams).openDatabase({ readonly: true });

  const pvmBackend = config.pvmBackend;
  const server = RpcServer.new(rpcPort, rootDb, chainSpec, blake2b, pvmBackend, rpcHandlers, validation.schemas);

  return async () => {
    await server.close();
  };
}
```
