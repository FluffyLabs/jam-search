---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/block-verifier.test.ts#L106-L206
title: packages/jam/transition/block-verifier.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: cfe4f027346027a9b155ec5ce494450bfa24241ebd2683a2108e0751f0f4f1ae
language: typescript
---
`packages/jam/transition/block-verifier.test.ts` (lines 106–206)

```typescript
      ),
    );
  });

  it("should return InvalidTimeSlot error if current block is older than parent block", async () => {
    const timeSlot = tryAsTimeSlot(42);
    const blocksDb = InMemoryBlocks.new();
    prepareBlocksDb(blocksDb, { timeSlot });
    const blockVerifier = BlockVerifier.new(hasher, blocksDb);
    const block = prepareBlock({ timeSlot: tryAsTimeSlot(timeSlot - 2) });

    const result = await blockVerifier.verifyBlock(toBlockView(block));

    deepEqual(
      result,
      Result.error(BlockVerifierError.InvalidTimeSlot, () => "Invalid time slot index: 40, expected > 42"),
    );
  });

  it("should return InvalidExtrinsic error if current block extrinsic hash is incorrect", async () => {
    const blocksDb = InMemoryBlocks.new();
    prepareBlocksDb(blocksDb);
    const blockVerifier = BlockVerifier.new(hasher, blocksDb);
    const block = prepareBlock({ correctExtrinsic: false });

    const result = await blockVerifier.verifyBlock(toBlockView(block));

    deepEqual(
      result,
      Result.error(
        BlockVerifierError.InvalidExtrinsic,
        () =>
          "Invalid extrinsic hash: 0x0202020202020202020202020202020202020202020202020202020202020202, expected 0x0377c11c61a370e532ce1b18a652aecdd060a3a3a257d53dac8f8e1cb32dea98",
      ),
    );
  });

  it("should return StateRootNotFound error if posterior state root of parent hash is not set", async () => {
    const blocksDb = InMemoryBlocks.new();
    prepareBlocksDb(blocksDb, {
      stateRootHash: Bytes.fill(HASH_SIZE, 6).asOpaque(),
      prepareStateRoot: false,
    });
    const blockVerifier = BlockVerifier.new(hasher, blocksDb);

    const block = prepareBlock({
      priorStateRootHash: Bytes.fill(HASH_SIZE, 7).asOpaque(),
      correctExtrinsic: true,
    });

    const result = await blockVerifier.verifyBlock(toBlockView(block));

    deepEqual(
      result,
      Result.error(
        BlockVerifierError.StateRootNotFound,
        () => "Posterior state root 0x0101010101010101010101010101010101010101010101010101010101010101 not found",
      ),
    );
  });

  it("should return InvalidStateRoot error if current block priorStateRoot hash is not the same as posterior state root", async () => {
    const blocksDb = InMemoryBlocks.new();
    prepareBlocksDb(blocksDb, {
      stateRootHash: Bytes.fill(HASH_SIZE, 6).asOpaque(),
      prepareStateRoot: true,
    });
    const blockVerifier = BlockVerifier.new(hasher, blocksDb);

    const block = prepareBlock({
      priorStateRootHash: Bytes.fill(HASH_SIZE, 7).asOpaque(),
      correctExtrinsic: true,
    });

    const result = await blockVerifier.verifyBlock(toBlockView(block));

    deepEqual(
      result,
      Result.error(
        BlockVerifierError.InvalidStateRoot,
        () =>
          "Invalid prior state root: 0x0707070707070707070707070707070707070707070707070707070707070707, expected 0x0606060606060606060606060606060606060606060606060606060606060606 (ours)",
      ),
    );
  });

  it("should return valid header hash if all checks pass", async () => {
    const blocksDb = InMemoryBlocks.new();
    prepareBlocksDb(blocksDb, { prepareStateRoot: true });
    const blockVerifier = BlockVerifier.new(hasher, blocksDb);

    const block = prepareBlock({
      correctExtrinsic: true,
    });

    const result = await blockVerifier.verifyBlock(toBlockView(block));

    const expectedResult = "0x81201f77f6a370731846cae2cbe3cf462c05feacebc3c546347fa4e442fd4fad";
    deepEqual(result, Result.ok(Bytes.parseBytes(expectedResult, HASH_SIZE).asOpaque()));
  });
});
```
