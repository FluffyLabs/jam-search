---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L89-L180
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: a015f589d2982b90c444dafe29eccdb5df72fa1a375e3c73033e2c079d9ad0bf
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 89–180)

```typescript
    throw new Error(`JAM_FUZZ_DB must be one of: ${FUZZ_DB_OPTIONS} (got: "${rawFuzzDb}").`);
  }
  if (fuzzDbBase !== undefined) {
    logger.info`🗄️ Fuzz persistent backend: ${hybridStateBackend}.`;
  }

  let runningNode: NodeApi | null = null;
  // The fjall values keyspace is opened once per fuzz session and reused on
  // every reset, because opening it is the slow part. Only the in-memory blocks
  // and leaf sets are rebuilt for each vector. fjall-hybrid only.
  let fjallSession: FjallValuesSession | null = null;
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
              stateBackend: isPersistent ? hybridStateBackend : "lmdb",
              // Reuse the session keyspace (fjall-hybrid only, other backends
              // ignore it). Nothing to pass for the in-memory fallback.
              sharedFjallSession: isPersistent ? (fjallSession ?? undefined) : undefined,
            },
          );
        };

        if (fuzzDbBase !== undefined) {
          try {
            if (hybridStateBackend === FUZZ_DB_FJALL) {
              // fjall-hybrid: open the values keyspace once and reuse it on every
```
