---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L96-L170
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 4bccd03925ad6d00bafab5823415c1a5a5c31a522dbfca332eb72fa084918a00
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 96–170)

```typescript
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
            stateBackend: isPersistent ? "hybrid" : "lmdb",
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
```
