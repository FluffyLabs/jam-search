---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L202-L346
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 4
content_sha: d07f13670fada7fdf1f77431204307ba74ffe24f689c4fe428cf8e52d3757bbe
language: typescript
---
`packages/jam/node/main.ts` (lines 202–346)

```typescript
      logger.log`[main] ☠️  Closing the authorship module`;
      await closeAuthorship();
      logger.log`[main] ☠️  Closing the networking module`;
      await closeNetwork();
      logger.log`[main] ☠️ Closing the importer`;
      await closeImporter();
      logger.log`[main] ☠️  Closing the extensions`;
      closeExtensions();
      logger.log`[main] 🛢️ Closing the database`;
      await rootDb.close();
      logger.log`[main] 📳 Closing telemetry`;
      await telemetry?.close();
      logger.info`[main] ✅ Done.`;
    },
  };

  return api;
}

const initAuthorship = async (
  importer: ImporterApi,
  isAuthoring: boolean,
  isFastForward: boolean,
  params:
    | {
        isInMemory: true;
        rootDb: RootDb<BlocksDb, SerializedStatesDb>;
        networkingPort: DirectPort;
      }
    | {
        isInMemory: false;
        networkingPort: ThreadPort;
      },
  baseConfig: {
    nodeName: string;
    chainSpec: ChainSpec;
    blake2b: Blake2b;
    dbPath: string;
  },
  authorshipKeys: { keys: { bandersnatch: BandersnatchSecretSeed; ed25519: Ed25519SecretSeed }[] },
) => {
  if (!isAuthoring) {
    logger.log`✍️  Authorship off: disabled`;
    return {
      closeAuthorship: () => {
        params.networkingPort.close();
        return Promise.resolve();
      },
      authorshipWorker: null,
    };
  }

  logger.info`✍️  Starting block generator.`;
  const workerParams = { ...authorshipKeys, isFastForward };
  const { generator, worker, finish } = params.isInMemory
    ? await startBlockGenerator(
        DirectWorkerConfig.new({
          ...baseConfig,
          blocksDb: params.rootDb.getBlocksDb(),
          statesDb: params.rootDb.getStatesDb(),
          workerParams,
        }),
        params.networkingPort,
      )
    : await spawnBlockGeneratorWorker(
        LmdbWorkerConfig.new({
          ...baseConfig,
          workerParams,
          ports: new Map([[AUTHORSHIP_NETWORK_PORT, params.networkingPort]]),
        }),
      );

  // relay blocks from generator to importer
  generator.setOnBlock(async (block) => {
    logger.log`✍️  Produced block at ${block.header.view().timeSlotIndex.materialize()}`;
    await importer.sendImportBlock(block);
  });

  return { closeAuthorship: finish, authorshipWorker: worker };
};

const initNetwork = async (
  importer: ImporterApi,
  params:
    | {
        isInMemory: true;
        rootDb: RootDb<BlocksDb, SerializedStatesDb>;
        authorshipPort: DirectPort;
      }
    | {
        isInMemory: false;
        authorshipPort: ThreadPort;
      },
  baseConfig: {
    nodeName: string;
    chainSpec: ChainSpec;
    blake2b: Blake2b;
    dbPath: string;
  },
  genesisHeaderHash: HeaderHash,
  networkConfig: NetworkConfig | null,
  bestHeader: Listener<WithHash<HeaderHash, HeaderView>>,
) => {
  if (networkConfig === null) {
    logger.log`🛜 Networking off: no config`;
    return {
      closeNetwork: async () => {
        params.authorshipPort.close();
      },
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
        LmdbWorkerConfig.new({
          ...baseConfig,
          workerParams: networkingConfig,
          ports: new Map([[AUTHORSHIP_NETWORK_PORT, params.authorshipPort]]),
        }),
      );

  // relay blocks from networking to importer
  network.setOnBlocks(async (newBlocks) => {
    for (const block of newBlocks) {
```
