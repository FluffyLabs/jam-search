---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L197-L347
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 5586b1ddc18bf65718d05d0fadb062df3d1cc96342bdaa9e133d908746625d49
language: typescript
---
`packages/jam/node/main.ts` (lines 197–347)

```typescript
    bestHeader,
  );

  const { closeAuthorship } = await initAuthorship(
    importer,
    config.isAuthoring,
    config.isFastForward,
    authorshipParams,
    baseConfig,
    authorshipKeys,
  );

  const api: NodeApi = {
    chainSpec,
    async importBlock(block: BlockView) {
      const res = await importer.sendImportBlock(block);
      if (res.isOk) {
        return Result.ok(await importer.sendGetBestStateRootHash());
      }
      return res;
    },
    async getStateEntries(hash: HeaderHash) {
      return importer.sendGetStateEntries(hash);
    },
    async getBestStateRootHash() {
      return importer.sendGetBestStateRootHash();
    },
    async close() {
      logger.log`[main] ☠️  Closing the authorship module`;
      await closeAuthorship();
      logger.log`[main] ☠️  Closing the networking module`;
      await closeNetwork();
      logger.log`[main] ☠️ Closing the importer`;
      await closeImporter();
      logger.log`[main] ☠️  Closing the extensions`;
      closeExtensions();
      if (mainRootDb !== null) {
        logger.log`[main] 🛢️ Closing the database`;
        await mainRootDb.close();
      }
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
    stateBackend: RegularStateBackend;
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
        createPersistentWorkerConfig({
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
    stateBackend: RegularStateBackend;
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
```
