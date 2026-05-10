---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-128-block-request.test.ts#L1-L54
title: packages/jam/jamnp-s/protocol/ce-128-block-request.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 5d2a65b99edc581aeb44633902c1b33575bc658d16861c4bf82a334637783584
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-128-block-request.test.ts` (lines 1–54)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import type { BlockView, HeaderHash } from "@typeberry/block";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b } from "@typeberry/hash";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { OK } from "@typeberry/utils";
import { ClientHandler, Direction, ServerHandler, STREAM_KIND } from "./ce-128-block-request.js";
import type { StreamId } from "./stream.js";
import { testClientServer } from "./test-utils.js";

let HEADER_HASH: HeaderHash;

before(async () => {
  const blake2b = await Blake2b.createHasher();
  HEADER_HASH = blake2b.hashString("0x7e1b07b8039cf840d51c4825362948c8ecb8fce1d290f705c269b6bcc7992731").asOpaque();
});

const MAX_BLOCKS = tryAsU32(10);
const TEST_BLOCK_VIEW = testBlockView();

describe("CE 128: Block Request", () => {
  it("sends a block request and receives a sequence of blocks", async () => {
    const handlers = testClientServer();

    handlers.server.registerHandlers(ServerHandler.new(tinyChainSpec, getBlockSequence));
    handlers.client.registerHandlers(ClientHandler.new(tinyChainSpec));

    const receivedData: BlockView[] = await new Promise((resolve) => {
      handlers.client.withNewStream(STREAM_KIND, (handler: ClientHandler, sender) => {
        (async () => {
          const blocks = await handler.requestBlockSequence(sender, HEADER_HASH, Direction.DescIncl, MAX_BLOCKS);
          resolve(blocks);
        })();
        return OK;
      });
    });

    assert.deepStrictEqual(
      `${receivedData.map((x) => x.encoded())}`,
      `${[TEST_BLOCK_VIEW, TEST_BLOCK_VIEW].map((x) => x.encoded())}`,
    );
  });
});

const getBlockSequence = (
  _streamId: StreamId,
  _hash: HeaderHash,
  _direction: Direction,
  _maxBlocks: U32,
): BlockView[] => {
  return [TEST_BLOCK_VIEW, TEST_BLOCK_VIEW];
};
```
