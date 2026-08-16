---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L348-L387
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 0c3d355b0d5102f8e39aaed55242a03f8f3d1c0c896ae5cffba72c3b0c44263d
language: typescript
---
`packages/jam/node/main.ts` (lines 348–387)

```typescript
          ...baseConfig,
          blocksDb: params.rootDb.getBlocksDb(),
          statesDb: params.rootDb.getStatesDb(),
          workerParams: networkingConfig,
        }),
        params.authorshipPort,
      )
    : await spawnNetworkWorker(
        createPersistentWorkerConfig({
          ...baseConfig,
          workerParams: networkingConfig,
          ports: new Map([[AUTHORSHIP_NETWORK_PORT, params.authorshipPort]]),
        }),
      );

  // relay blocks from networking to importer
  network.setOnBlocks(async (newBlocks) => {
    for (const block of newBlocks) {
      await importer.sendImportBlock(block);
    }
  });

  // relay newly imported headers to trigger network announcements
  bestHeader.on((header) => {
    network.sendNewHeader(header);
  });

  return { closeNetwork: finish, networkApi: network, networkWorker: worker };
};

function createPersistentWorkerConfig<T>(params: {
  nodeName: string;
  chainSpec: ChainSpec;
  workerParams: T;
  dbPath: string;
  blake2b: Blake2b;
  ports?: Map<string, ThreadPort>;
}): PersistentWorkerConfig<T> {
  return FjallWorkerConfig.new(params);
}
```
