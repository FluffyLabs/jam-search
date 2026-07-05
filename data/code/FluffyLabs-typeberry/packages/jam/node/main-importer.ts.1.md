---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-importer.ts#L95-L166
title: packages/jam/node/main-importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: ffeb1cfef5ae21e267729024d4d6bfa9dc3370da6dd05c817e305e9be24cf29a
language: typescript
---
`packages/jam/node/main-importer.ts` (lines 95–166)

```typescript
          workerParams,
        })
      : dbBackend === "lmdb-hybrid" || dbBackend === "fjall-hybrid"
        ? await HybridWorkerConfig.new({
            nodeName,
            chainSpec,
            blake2b,
            dbPath,
            workerParams,
            ephemeral,
            compression,
            backend: dbBackend === "lmdb-hybrid" ? "lmdb" : "fjall",
            sharedFjallSession: options.sharedFjallSession,
          })
        : dbBackend === "fjall"
          ? FjallWorkerConfig.new({
              nodeName,
              chainSpec,
              blake2b,
              dbPath,
              workerParams,
              ephemeral,
            })
          : LmdbWorkerConfig.new({
              nodeName,
              chainSpec,
              blake2b,
              dbPath,
              workerParams,
              ephemeral,
            });

  // Initialize the database with genesis state and block if there isn't one.
  logger.info`🛢️ Opening database at ${dbPath}`;
  const rootDb = await workerConfig.openDatabase({ readonly: false });
  await initializeDatabase(chainSpec, blake2b, genesisHeaderHash, rootDb, config.node.chainSpec, config.ancestry, {
    initGenesisFromAncestry: options.initGenesisFromAncestry,
  });
  await rootDb.close();

  const { db, importer } = await createImporter(workerConfig, {
    initGenesisFromAncestry: options.initGenesisFromAncestry,
  });
  await importer.prepareForNextEpoch();

  const api: NodeApi = {
    chainSpec,
    async importBlock(block: BlockView): Promise<Result<StateRootHash, string>> {
      const res = await importer.importBlockWithStateRoot(block);
      if (res.isOk) {
        return res;
      }
      const errMsg = resultToString(res);
      return Result.error(errMsg, () => errMsg);
    },
    async getStateEntries(hash: HeaderHash) {
      return importer.getStateEntries(hash);
    },
    async getBestStateRootHash() {
      return importer.getBestStateRootHash() ?? zeroHash;
    },
    async close() {
      logger.log`[main] ⏳ Closing importer`;
      await importer.close();
      logger.log`[main] 🛢️ Closing database`;
      await db.close();
      logger.info`[main] ✅ Done.`;
    },
  };

  return api;
}
```
