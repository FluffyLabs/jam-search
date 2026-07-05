---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L338-L404
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 65f2af29140ca38522d752126d83886ac4cefdb3dd2187aee61f16d6b5ea41ba
language: typescript
---
`packages/jam/node/main.ts` (lines 338–404)

```typescript
      networkApi: null,
      networkWorker: null,
    };
  }

  const { key, host, port, bootnodes } = networkConfig;

  const networkingConfig = NetworkingConfig.create({
    genesisHeaderHash,
    key,
    host,
    port: tryAsU16(port),
    bootnodes: bootnodes.map((node) => node.toString()),
  });

  const { network, worker, finish } = params.isInMemory
    ? await startNetwork(
        DirectWorkerConfig.new({
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

function createPersistentWorkerConfig<T>({
  stateBackend,
  ...params
}: {
  stateBackend: RegularStateBackend;
  nodeName: string;
  chainSpec: ChainSpec;
  workerParams: T;
  dbPath: string;
  blake2b: Blake2b;
  ports?: Map<string, ThreadPort>;
}): PersistentWorkerConfig<T> {
  switch (stateBackend) {
    case RegularStateBackend.Fjall:
      return FjallWorkerConfig.new(params);
    case RegularStateBackend.Lmdb:
      return LmdbWorkerConfig.new(params);
  }
}
```
