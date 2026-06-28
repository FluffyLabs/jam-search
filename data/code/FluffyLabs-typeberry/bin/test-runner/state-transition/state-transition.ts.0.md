---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/state-transition/state-transition.ts#L1-L96
title: bin/test-runner/state-transition/state-transition.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: f42d004d9b6c92dd9e409cc9487addd0973e11d4e26a98db719c553348a3633c
language: typescript
---
`bin/test-runner/state-transition/state-transition.ts` (lines 1–96)

```typescript
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { Block, emptyBlock } from "@typeberry/block";
import { Decoder, Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import { InMemoryBlocks } from "@typeberry/database";
import { Blake2b, keccak, WithHash } from "@typeberry/hash";
import { serializeStateUpdate } from "@typeberry/state-merkleization";
import { StateTransition, StateTransitionGenesis } from "@typeberry/state-vectors";
import { TransitionHasher } from "@typeberry/transition";
import { BlockVerifier } from "@typeberry/transition/block-verifier.js";
import { DbHeaderChain, OnChain } from "@typeberry/transition/chain-stf.js";
import { deepEqual, resultToString } from "@typeberry/utils";
import { type RunOptions, type SelectedPvm, selectedPvmToBackend } from "../common.js";
import { loadState } from "./state-loader.js";

const keccakHasher = keccak.KeccakHasher.create();

const cachedBlocks = new Map<string, Block[]>();
function loadBlocks(testPath: string, spec: ChainSpec) {
  const dir = path.dirname(testPath);
  const fromCache = cachedBlocks.get(dir);
  if (fromCache !== undefined) {
    return fromCache;
  }

  const blocks: Block[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".bin")) {
      continue;
    }
    const data = fs.readFileSync(path.join(dir, file));
    try {
      if (file.endsWith("genesis.bin")) {
        const genesis = Decoder.decodeObject(StateTransitionGenesis.Codec, data, spec);
        const genesisBlock = Block.create({ header: genesis.header, extrinsic: emptyBlock().extrinsic });
        blocks.push(genesisBlock);
      } else {
        const test = Decoder.decodeObject(StateTransition.Codec, data, spec);
        blocks.push(test.block.materialize());
      }
    } catch {
      // some blocks might be invalid, but that's fine. We just ignore them.
    }
  }

  blocks.sort((a, b) => a.header.timeSlotIndex - b.header.timeSlotIndex);
  cachedBlocks.set(dir, blocks);
  return blocks;
}

function blockAsView(spec: ChainSpec, block: Block) {
  const encodedBlock = Encoder.encodeObject(Block.Codec, block, spec);
  const blockView = Decoder.decodeObject(Block.Codec.View, encodedBlock, spec);
  return blockView;
}

export async function runStateTransition(testContent: StateTransition, options: RunOptions, variant: SelectedPvm) {
  const pvm = selectedPvmToBackend(variant);
  const blake2b = await Blake2b.createHasher();
  const spec = options.chainSpec;
  const preState = loadState(spec, blake2b, testContent.pre_state.keyvals);
  const postState = loadState(spec, blake2b, testContent.post_state.keyvals);

  const preStateRoot = preState.backend.getRootHash(blake2b);
  const postStateRoot = postState.backend.getRootHash(blake2b);

  const blockView = testContent.block;
  const allBlocks = loadBlocks(options.path, spec);
  const timeStotIndex = testContent.block.header.view().timeSlotIndex.materialize();
  const myBlockIndex = allBlocks.findIndex(({ header }) => header.timeSlotIndex === timeStotIndex);
  const previousBlocks = allBlocks.slice(0, myBlockIndex);

  const hasher = TransitionHasher.new(await keccakHasher, blake2b);

  const blocksDb = InMemoryBlocks.fromBlocks(
    previousBlocks.map((block) => {
      const blockView = blockAsView(spec, block);
      const headerHash = hasher.header(blockView.header.view());
      return WithHash.new(headerHash.hash, blockView);
    }),
  );

  const stf = OnChain.assemble({
    chainSpec: spec,
    state: preState,
    hasher,
    options: { pvm, accumulateSequentially: options.accumulateSequentially },
    headerChain: DbHeaderChain.new(blocksDb),
  });

  // verify that we compute the state root exactly the same.
  assert.deepStrictEqual(testContent.pre_state.state_root.toString(), preStateRoot.toString());
  assert.deepStrictEqual(testContent.post_state.state_root.toString(), postStateRoot.toString());

```
