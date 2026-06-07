---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/recent-history.test.ts#L98-L171
title: packages/jam/transition/recent-history.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c617c5ef12ae72d0fbf5bc9c307e93b152eaa06ddc27258142ee989a623cd689
language: typescript
---
`packages/jam/transition/recent-history.test.ts` (lines 98–171)

```typescript
        ].map((x) => [x.workPackageHash, x]),
      ),
    };
    const stateUpdate = recentHistory.transition(input);
    const state = copyAndUpdateState(recentHistory.state, stateUpdate);

    const recentBlocks = state.recentBlocks;
    assert.deepStrictEqual(recentBlocks.blocks.length, 2);
    assert.deepStrictEqual(
      recentBlocks.blocks[0],
      BlockState.create({
        ...firstBlock,
        // note we fill it up from the input
        postStateRoot: partialInput.priorStateRoot,
      }),
    );
    assert.deepStrictEqual(recentBlocks.accumulationLog, {
      peaks: [null, Bytes.parseBytes("0x6ac9e94853a54beddd428600d8dd68f9c67ea0850f6d9407812a48c71e9f6958", HASH_SIZE)],
    });
    assert.deepStrictEqual(
      recentBlocks.blocks[1],
      BlockState.create({
        headerHash: input.headerHash,
        accumulationResult: Bytes.parseBytes(
          "0x6ac9e94853a54beddd428600d8dd68f9c67ea0850f6d9407812a48c71e9f6958",
          HASH_SIZE,
        ),
        postStateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
        reported: input.workPackages,
      }),
    );
  });

  it("should only keep 8 entries", async () => {
    let input!: RecentHistoryInput;
    const initialState: BlocksState = asOpaqueType([]);
    let state = asRecentHistory(initialState);

    for (let i = 0; i < 10; i++) {
      const recentHistory = new RecentHistory(await hasher, state);
      const id = (x: number) => 10 * i + x;
      const partialInput: RecentHistoryPartialInput = {
        priorStateRoot: Bytes.fill(HASH_SIZE, 1).asOpaque(),
      };
      const partialUpdate = recentHistory.partialTransition(partialInput);
      input = {
        partial: partialUpdate,
        headerHash: Bytes.fill(HASH_SIZE, id(2)).asOpaque(),
        accumulateRoot: Bytes.fill(HASH_SIZE, id(3)).asOpaque(),
        workPackages: HashDictionary.fromEntries(
          [
            {
              workPackageHash: Bytes.fill(HASH_SIZE, id(4)).asOpaque(),
              segmentTreeRoot: Bytes.fill(HASH_SIZE, id(5)).asOpaque(),
            },
          ].map((x) => [x.workPackageHash, x]),
        ),
      };
      const stateUpdate = recentHistory.transition(input);
      state = copyAndUpdateState(recentHistory.state, stateUpdate);
    }

    const recentBlocks = state.recentBlocks;
    assert.deepStrictEqual(recentBlocks.blocks.length, 8);
    assert.deepStrictEqual(recentBlocks.accumulationLog, {
      peaks: [
        null,
        Bytes.parseBytes("0xf2b82ebf240c42d9a13a3282f81bc914af9795b8d376fee5ffa70271ad027ef6", HASH_SIZE),
        null,
        Bytes.parseBytes("0x9db02578e7a12b19a574f27104e51df3dbcce55d37611fac0abb5da9bd0f5b97", HASH_SIZE),
      ],
    });
  });
});
```
