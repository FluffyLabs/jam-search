---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-importer.ts#L98-L136
title: packages/jam/node/main-importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: b729b8ce20d4ec673de1527d99d38ed026ccdd2cee63e06af5c1963274de7281
language: typescript
---
`packages/jam/node/main-importer.ts` (lines 98–136)

```typescript
  logger.info`🛢️ Opening database at ${dbPath}`;
  const rootDb = workerConfig.openDatabase({ readonly: false });
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
