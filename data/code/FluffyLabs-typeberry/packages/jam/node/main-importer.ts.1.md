---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-importer.ts#L98-L139
title: packages/jam/node/main-importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: cfdc7b96cd86b30cb4e10ad89c587c39818edbab453ad7eb9321f6a0f7711c8b
language: typescript
---
`packages/jam/node/main-importer.ts` (lines 98–139)

```typescript
            sharedFjallKeyspace: options.sharedFjallKeyspace,
          });

  // Initialize the database with genesis state and block if there isn't one.
  logger.info`🛢️ Opening database at ${dbPath}`;
  const rootDb = await workerConfig.openDatabase({ readonly: false });
  await initializeDatabase(chainSpec, blake2b, genesisHeaderHash, rootDb, config.node.chainSpec, config.ancestry, {
    initGenesisFromAncestry: options.initGenesisFromAncestry,
  });
  const { db, importer } = await createImporter(workerConfig, {
    initGenesisFromAncestry: options.initGenesisFromAncestry,
    db: rootDb,
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
