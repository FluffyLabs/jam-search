---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L93-L206
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 4
content_sha: fda61a4572f0d4b68bcb80e0424f6bbc93046a21e4b9853db84aeabc4e63b6d2
language: typescript
---
`packages/jam/node/main.ts` (lines 93–206)

```typescript
  // NOTE [ToDr] even though, we should be closing the database here,
  // it seems that opening it in the main thread for writing, and later
  // in the importer thread, causes issues. Everything works fine though,
  // if we DO NOT close the database (I guess it's process-shared?)
  // await rootDb.close();

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
```
