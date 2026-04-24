---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/generator.test.ts#L206-L280
title: packages/workers/block-authorship/generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 36fefe100203a7081fcfcf0c354bea04414df8c1aca1c26a3f591684df4e8ce5
language: typescript
---
`packages/workers/block-authorship/generator.test.ts` (lines 206–280)

```typescript
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = Generator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(1);

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot);

      const expectedBlock = createExpectedBlock({
        timeSlot,
        validatorIndex,
        extrinsicHash: block.header.extrinsicHash,
      });

      deepEqual(block, expectedBlock);
    });

    it("should create block with epoch marker at epoch boundary", async () => {
      // tinyChainSpec.epochLength = 12, so:
      // - timeslot 11 is last slot of epoch 0
      // - timeslot 12 is first slot of epoch 1
      const lastSlotOfEpoch0 = tinyChainSpec.epochLength - 1;
      const firstSlotOfEpoch1 = tinyChainSpec.epochLength;

      const state = createMockState(lastSlotOfEpoch0);
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = Generator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
        keccakHasher,
        blake2b,
        blocks: blocksDb,
        states: statesDb,
      });

      const validatorIndex = tryAsValidatorIndex(0);
      const timeSlot = tryAsTimeSlot(firstSlotOfEpoch1);

      const block = await generator.nextBlock(validatorIndex, MOCK_BANDERSNATCH_SECRET, MOCK_SEAL_PAYLOAD, timeSlot);

      const expectedEpochMarker = EpochMarker.create({
        entropy: MOCK_ENTROPY_0,
        ticketsEntropy: MOCK_ENTROPY_1,
        validators: asKnownSize(
          validatorDataArray.map((v) =>
            ValidatorKeys.create({
              bandersnatch: v.bandersnatch,
              ed25519: v.ed25519,
            }),
          ),
        ),
      });

      const expectedBlock = createExpectedBlock({
        timeSlot,
        validatorIndex,
        extrinsicHash: block.header.extrinsicHash,
        epochMarker: expectedEpochMarker,
      });

      deepEqual(block, expectedBlock);
    });
  });
});
```
