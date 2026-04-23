---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/index.test.ts#L1-L64
title: packages/workers/api/index.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6b4a672743b28c5256425f420aa88d5e157e504f667523fb214d48f8b54181e8
language: typescript
---
`packages/workers/api/index.test.ts` (lines 1–64)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { codec } from "@typeberry/codec";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { Channel } from "./channel.js";
import { DirectPort } from "./port.js";
import { createProtocol } from "./protocol.js";

const protocol = createProtocol("testproto", {
  toWorker: {
    finish: {
      request: codec.nothing,
      response: codec.nothing,
    },
  },
  fromWorker: {
    generatedBlock: {
      request: codec.u64,
      response: codec.bool,
    },
  },
});

describe("Workers Channels", () => {
  it("should create connected channels and send on finished", async () => {
    const [txPort, rxPort] = DirectPort.pair();
    const rx = Channel.rx(protocol, rxPort);

    let onFinishedReceived = 0;
    rx.setOnFinish(async () => {
      onFinishedReceived++;
    });

    const tx = Channel.tx(protocol, txPort);
    assert.strictEqual(onFinishedReceived, 0);

    // when
    await tx.sendFinish();

    // then
    assert.strictEqual(onFinishedReceived, 1);
  });

  it("should create connected channels and send parameter", async () => {
    const [txPort, rxPort] = DirectPort.pair();
    const tx = Channel.tx(protocol, txPort);

    const blocksReceived: U64[] = [];
    tx.setOnGeneratedBlock(async (block) => {
      blocksReceived.push(block);
      return true;
    });

    const rx = Channel.rx(protocol, rxPort);
    assert.deepStrictEqual(blocksReceived, []);

    // when
    const response = await rx.sendGeneratedBlock(tryAsU64(15));

    // then
    assert.deepStrictEqual(blocksReceived, [15n]);
    assert.strictEqual(response, true);
  });
});
```
