---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/port.test.ts#L1-L70
title: packages/workers/api-node/port.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 156330b1325fe0288375d3f9668f529f4a989eddd3dc75066d6b970a4a3fa79e
language: typescript
---
`packages/workers/api-node/port.test.ts` (lines 1–70)

```typescript
import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { setTimeout } from "node:timers/promises";
import { MessageChannel } from "node:worker_threads";
import { codec } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import type { Envelope } from "@typeberry/workers-api";
import { ThreadPort } from "./port.js";

const spec = tinyChainSpec;

describe("ThreadPort", () => {
  let channel: MessageChannel;
  beforeEach(() => {
    channel = new MessageChannel();
  });

  afterEach(() => {
    channel.port1.close();
    channel.port2.close();
  });

  it("should successfuly send messages", async () => {
    const tx = ThreadPort.new(spec, channel.port1);
    const rx = ThreadPort.new(spec, channel.port2);

    let received: Envelope<U32> | null = null;
    // attach listener
    rx.on("hello", codec.varU32, (msg) => {
      received = msg;
    });
    assert.strictEqual(received, null);

    // send some message
    tx.postMessage("hello", codec.varU32, {
      responseId: "10",
      data: tryAsU32(42),
    });

    await setTimeout(1_000);

    assert.deepStrictEqual(received, {
      responseId: "10",
      data: tryAsU32(42),
    });
  });

  it("should deliver messages sent before the listener is attached", async () => {
    const tx = ThreadPort.new(spec, channel.port1);
    const rx = ThreadPort.new(spec, channel.port2);

    tx.postMessage("hello", codec.varU32, {
      responseId: "10",
      data: tryAsU32(42),
    });

    await setTimeout(10);

    let received: Envelope<U32> | null = null;
    rx.on("hello", codec.varU32, (msg) => {
      received = msg;
    });

    assert.deepStrictEqual(received, {
      responseId: "10",
      data: tryAsU32(42),
    });
  });
});
```
