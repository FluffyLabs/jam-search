---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/block-verifier.test.ts#L1-L112
title: packages/jam/transition/block-verifier.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: cbca7545c3c69129935c20de7da5b31eb87ebe9d95e248929824593946be1593
language: typescript
---
`packages/jam/transition/block-verifier.test.ts` (lines 1–112)

```typescript
import { describe, it } from "node:test";
import {
  Block,
  type BlockView,
  type ExtrinsicHash,
  Header,
  type HeaderHash,
  type StateRootHash,
  type TimeSlot,
  tryAsTimeSlot,
} from "@typeberry/block";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { Bytes } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { InMemoryBlocks } from "@typeberry/database";
import { Blake2b, HASH_SIZE, keccak, WithHash } from "@typeberry/hash";
import { deepEqual, Result } from "@typeberry/utils";
import { BlockVerifier, BlockVerifierError } from "./block-verifier.js";
import { TransitionHasher } from "./hasher.js";

const DEFAULT_HEADER_HASH = Bytes.fill(HASH_SIZE, 1).asOpaque<HeaderHash>();
const DEFAULT_EXTRINSIC_HASH = Bytes.fill(HASH_SIZE, 2).asOpaque<ExtrinsicHash>();
const DEFAULT_STATE_ROOT = Bytes.fill(HASH_SIZE, 10).asOpaque<StateRootHash>();
const DEFAULT_TIME_SLOT = tryAsTimeSlot(1);

describe("Block Verifier", async () => {
  const spec = tinyChainSpec;
  const hasher = TransitionHasher.new(await keccak.KeccakHasher.create(), await Blake2b.createHasher());

  const toBlockView = (block: Block): BlockView => {
    const encodedBlock = Encoder.encodeObject(Block.Codec, block, spec);
    const blockView = Decoder.decodeObject(Block.Codec.View, encodedBlock, spec);
    return blockView;
  };

  const prepareBlocksDb = (
    db: InMemoryBlocks,
    {
      headerHash,
      timeSlot,
      stateRootHash,
      prepareStateRoot = false,
    }: {
      headerHash?: HeaderHash;
      timeSlot?: TimeSlot;
      stateRootHash?: StateRootHash;
      prepareStateRoot?: boolean;
    } = {},
  ) => {
    const baseBlock = testBlockView().materialize();
    const timeSlotIndex = timeSlot ?? DEFAULT_TIME_SLOT;
    const header = Header.create({ ...baseBlock.header, timeSlotIndex });
    const block = Block.create({ ...baseBlock, header });
    const blockView = toBlockView(block);
    const headerHashOrDefault = headerHash ?? DEFAULT_HEADER_HASH;
    const stateRoot = stateRootHash ?? DEFAULT_STATE_ROOT;
    db.insertBlock(WithHash.new(headerHashOrDefault, blockView));
    if (prepareStateRoot) {
      db.setPostStateRoot(headerHashOrDefault, stateRoot);
    }
    db.setBestHeaderHash(headerHashOrDefault);
  };

  const prepareBlock = ({
    parentHash,
    timeSlot,
    priorStateRootHash,
    correctExtrinsic = true,
  }: {
    parentHash?: HeaderHash;
    timeSlot?: TimeSlot;
    priorStateRootHash?: StateRootHash;
    correctExtrinsic?: boolean;
  } = {}) => {
    const block = testBlockView().materialize();

    const extrinsicHash = correctExtrinsic
      ? hasher.extrinsic(testBlockView().extrinsic.view()).hash
      : DEFAULT_EXTRINSIC_HASH;

    const header = Header.create({
      ...block.header,
      timeSlotIndex: timeSlot ?? tryAsTimeSlot(DEFAULT_TIME_SLOT + 1),
      parentHeaderHash: parentHash ?? DEFAULT_HEADER_HASH,
      priorStateRoot: priorStateRootHash ?? DEFAULT_STATE_ROOT,
      extrinsicHash,
    });

    return Block.create({ ...block, header });
  };

  it("should return ParentNotFound error if parent block is not found", async () => {
    const blocksDb = InMemoryBlocks.new();
    prepareBlocksDb(blocksDb, { headerHash: Bytes.fill(HASH_SIZE, 7).asOpaque() });
    const blockVerifier = BlockVerifier.new(hasher, blocksDb);
    const block = prepareBlock({ parentHash: Bytes.fill(HASH_SIZE, 8).asOpaque() });

    const result = await blockVerifier.verifyBlock(toBlockView(block));

    deepEqual(
      result,
      Result.error(
        BlockVerifierError.ParentNotFound,
        () => "Parent 0x0808080808080808080808080808080808080808080808080808080808080808 not found",
      ),
    );
  });

  it("should return InvalidTimeSlot error if current block is older than parent block", async () => {
    const timeSlot = tryAsTimeSlot(42);
    const blocksDb = InMemoryBlocks.new();
```
