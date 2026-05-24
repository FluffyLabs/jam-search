---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L96-L167
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 42ef16638e8575dc73d125660d7fa5c9d8d5bd94d0dfd2c6f9b480ffb58ef7ac
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 96–167)

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
        // Enable state/blocks pruning only when running in memory.
        // For disk backend, we store everything.
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
            dummyFinalityDepth: isPersistent ? 0 : 10_000,
            pruneBlocks: !isPersistent,
            // The fuzz db is wiped on every reset, so durability is pointless:
            // skip fsync + compression to cut the per-block leaf write cost.
            ephemeralDb: isPersistent,
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
