---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-importer.ts#L95-L125
title: packages/jam/node/main-importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 364d8ab7afc0a40ac11b0d3d3a7c90f2c7f4173fa81e4702a6b91235e4a18605
language: typescript
---
`packages/jam/node/main-importer.ts` (lines 95–125)

```typescript
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
