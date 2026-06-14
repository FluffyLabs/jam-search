---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L93-L188
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: bab59d651a19fd435f38e255faee8abc3b455612c27c0a7b144223cd54ef7243
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 93–188)

```typescript
    importBlock: async (blockView: BlockView): Promise<Result<StateRootHash, string>> => {
      if (runningNode === null) {
        return Result.error("node not running", () => "Fuzzer: node not running when importing block");
      }
      const importResult = await runningNode.importBlock(blockView);
      return importResult;
    },
    getBestStateRootHash: async (): Promise<StateRootHash> => {
      if (runningNode === null) {
        return Bytes.zero(HASH_SIZE).asOpaque();
      }
      return runningNode.getBestStateRootHash();
    },
    getPostSerializedState: async (hash: HeaderHash): Promise<StateEntries | null> => {
      if (runningNode === null) {
        return null;
      }
      return runningNode.getStateEntries(hash);
    },
    resetState: async (
      header: Header,
      state: StateEntries,
      ancestry: [HeaderHash, TimeSlot][],
    ): Promise<StateRootHash> => {
      if (runningNode !== null) {
        const finish = runningNode.close();
        runningNode = null;
        await finish;
      }

      const buildNode = (databaseBasePath: string | undefined) => {
        const isPersistent = databaseBasePath !== undefined;
        return mainImporter(
          {
            ...config,
            node: {
              ...config.node,
              databaseBasePath,
              chainSpec: {
                ...config.node.chainSpec,
                genesisHeader: Encoder.encodeObject(Header.Codec, header, chainSpec),
                genesisState: new Map(state),
              },
            },
            ancestry,
            network: null,
          },
          withRelPath,
          {
            initGenesisFromAncestry: fuzzConfig.initGenesisFromAncestry,
            // Hybrid keeps leaf sets in RAM, so they must be windowed exactly
            // like the in-memory backend; only the large values live on disk.
            dummyFinalityDepth: 20,
            pruneBlocks: true,
            // Long full-spec sessions accumulate a large, never-pruned values db.
            // Syncing lets the OS reclaim dirty mmap pages, and compression (full
            // spec only, where values are big) bounds its on-disk/page-cache size.
            // Tiny stays uncompressed since its db is small and speed matters more.
            ephemeral: isPersistent,
            stateBackend: isPersistent ? hybridStateBackend : "lmdb",
          },
        );
      };

      if (fuzzDbBase !== undefined) {
        // Each reset starts a fresh session from the genesis the fuzzer just sent,
        // so the on-disk db must be empty: otherwise initializeDatabase sees an
        // already-initialized db and silently resumes the previous run's state.
        await wipeFuzzDb(fuzzDbBase);
        try {
          runningNode = await buildNode(fuzzDbBase);
          return await runningNode.getBestStateRootHash();
        } catch (e) {
          // A partially-opened db may leak on failure; acceptable for this degraded fallback (proper cleanup belongs in mainImporter).
          logger.warn`Failed to open persistent fuzz db at ${fuzzDbBase}, falling back to in-memory: ${e}`;
          runningNode = null;
        }
      }

      runningNode = await buildNode(undefined);
      return await runningNode.getBestStateRootHash();
    },
  });

  return () => {
    closeFuzzTarget();
    if (fuzzDbBase !== undefined) {
      // best-effort cleanup on shutdown; ignore failures (dir may already be gone).
      wipeFuzzDb(fuzzDbBase).catch(() => {});
    }
  };
}

function isValidStateBackend(val: string): val is StateBackend {
  return FUZZ_DB_OPTIONS.indexOf(val) !== -1;
}
```
