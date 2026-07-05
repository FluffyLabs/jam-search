---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L98-L208
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 4
content_sha: e04e90f7fec7352be3dc1de364f8630fb07dcba6622978b0af0ac66592abea28
language: typescript
---
`packages/jam/node/main.ts` (lines 98–208)

```typescript
    : { isInMemory, config: createPersistentWorkerConfig(importerParams) };

  // Initialize the database with genesis state and block if there isn't one.
  logger.info`🛢️ Opening database at ${dbPath}`;
  const rootDb = await importerConfig.config.openDatabase({ readonly: false });
  try {
    await initializeDatabase(chainSpec, blake2b, genesisHeaderHash, rootDb, config.node.chainSpec, config.ancestry);
  } catch (e) {
    try {
      await rootDb.close();
    } catch (closeError) {
      logger.warn`Failed to close database after initialization error: ${closeError}`;
    }
    throw e;
  }
  // fjall-js shares the engine explicitly and requires every handle to close.
  // Keep lmdb's historical main-thread handle open until shutdown.
  let mainRootDb: RootDb<BlocksDb, SerializedStatesDb> | null = rootDb;
  if (!importerConfig.isInMemory && config.node.stateBackend === RegularStateBackend.Fjall) {
    await rootDb.close();
    mainRootDb = null;
  }

  // Start block importer
  let importer: ImporterApi;
  let closeImporter: () => Promise<void>;

  if (importerConfig.isInMemory) {
    ({ importer, finish: closeImporter } = await startImporterDirect(
      DirectWorkerConfig.new({
        ...importerConfig.config,
        blocksDb: rootDb.getBlocksDb(),
        statesDb: rootDb.getStatesDb(),
      }),
    ));
  } else {
    ({ importer, finish: closeImporter } = await spawnImporterWorker(importerConfig.config));
  }

  const bestHeader = new Listener<WithHash<HeaderHash, HeaderView>>();
  importer.setOnBestHeaderAnnouncement(async (header) => {
    const slot = header.data.timeSlotIndex.materialize();
    nodeMetrics.recordBestBlockChanged(slot, header.hash.toString());
    await bestHeader.callbackHandler()(header);
  });

  // Start extensions
  const closeExtensions = initializeExtensions({ chainSpec, bestHeader, nodeName });

  // Authorship initialization.
  // 1. load validator keys (bandersnatch, ed25519, bls)
  // 2. allow the validator to specify metadata.
  // 3. if we have validator keys, we should start the authorship module.
  // NOTE: use trivialSeed to derive validator keys is safe
  // because the authorship keys are only initialized when devValidatorIndex is specified (development mode),
  // and trivial seeds are appropriate for test validators as defined in JIP-5.
  const validatorIndex = config.devValidatorIndex ?? "all";
  const authorshipKeys = {
    keys:
      validatorIndex === "all"
        ? Array.from({ length: chainSpec.validatorsCount })
            .map((_, i) => trivialSeed(tryAsU32(i)))
            .map((seed) => ({
              bandersnatch: deriveBandersnatchSecretKey(seed, blake2b),
              ed25519: deriveEd25519SecretKey(seed, blake2b),
            }))
        : [
            {
              bandersnatch: deriveBandersnatchSecretKey(trivialSeed(tryAsU32(validatorIndex)), blake2b),
              ed25519: deriveEd25519SecretKey(trivialSeed(tryAsU32(validatorIndex)), blake2b),
            },
          ],
  };

  const { networkingParams, authorshipParams } = isInMemory
    ? (() => {
        const [tx, rx] = DirectPort.pair();

        return {
          networkingParams: { isInMemory, rootDb, authorshipPort: tx },
          authorshipParams: { isInMemory, rootDb, networkingPort: rx },
        };
      })()
    : (() => {
        const [tx, rx] = ThreadPort.pair(chainSpec);

        return {
          networkingParams: { isInMemory, rootDb, authorshipPort: tx },
          authorshipParams: { isInMemory, rootDb, networkingPort: rx },
        };
      })();

  // Networking initialization (before authorship so we can relay tickets)
  const { closeNetwork } = await initNetwork(
    importer,
    networkingParams,
    baseConfig,
    genesisHeaderHash,
    config.network,
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

```
