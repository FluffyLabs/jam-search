---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L88-L182
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 4
content_sha: a19f88466b20172957955c5de8c18d13cfe2fbdbd5eb41a8c3b8c68106470ed2
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 88–182)

```typescript
    throw new Error(`JAM_FUZZ_DB must be one of: ${FUZZ_DB_OPTIONS} (got: "${rawFuzzDb}").`);
  }
  if (fuzzDbBase !== undefined) {
    logger.info`🗄️ Fuzz persistent backend: ${hybridStateBackend}.`;
  }

  let runningNode: NodeApi | null = null;
  // The fjall keyspace is opened once per fuzz session and reused on every
  // reset, because opening it is the slow part.
  let fjallKeyspace: FjallRoot | null = null;
  // Track how many times resetState has been called for periodic fjall keyspace rebuilds.
  let resetCount = 0;
  // Set when close() starts. Guards resetState so a fuzz command arriving
  // mid-shutdown can't build a fresh node that close() then orphans.
  let isClosing = false;
  let activeReset: Promise<StateRootHash> | null = null;

  const chainSpec = getChainSpec(config.node.flavor);

  const closeFuzzTarget = startFuzzTarget(fuzzConfig.version, fuzzConfig.socket, {
    ...getFuzzDetails(),
    chainSpec,
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
    resetState: (header: Header, state: StateEntries, ancestry: [HeaderHash, TimeSlot][]): Promise<StateRootHash> => {
      const reset = (async () => {
        if (isClosing) {
          return Bytes.zero(HASH_SIZE).asOpaque();
        }
        if (runningNode !== null) {
          const finish = runningNode.close();
          runningNode = null;
          await finish;
        }

        // Increment reset counter for periodic fjall session rebuilds.
        resetCount++;

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
              // The on-disk fuzz db is throwaway (we wipe it), so open it ephemeral and
              // skip the fsync, we do not need durability here. On full spec ephemeral
              // also turns on compression further down, so the big values do not grow the
              // db too much. Tiny stays uncompressed, its db is small and speed matters more.
              ephemeral: isPersistent,
              stateBackend: isPersistent ? hybridStateBackend : "fjall",
              // Reuse the keyspace for both fjall backends. Nothing to pass for
              // the in-memory fallback.
              sharedFjallKeyspace: fjallKeyspace ?? undefined,
            },
          );
        };

        if (fuzzDbBase !== undefined) {
          try {
            const fjallKeyspacePath = withRelPath(fuzzDbBase);
```
