---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/port.test.ts#L1-L77
title: packages/workers/api/port.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4c0339b31c249bd7a8fe31694c65f0ea201373da25fde61b065b840967efc8ba
language: typescript
---
`packages/workers/api/port.test.ts` (lines 1–77)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { codec } from "@typeberry/codec";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { DirectPort, type Envelope } from "./port.js";

describe("DirectPort", () => {
  it("should communicate over direct port", () => {
    const [txPort, rxPort] = DirectPort.pair();
    let receivedMessage: Envelope<U32> | null = null;
    rxPort.on("hello", codec.u32, (msg) => {
      receivedMessage = msg;
    });
    assert.deepStrictEqual(receivedMessage, null);

    txPort.postMessage("nothello", codec.nothing, {
      responseId: "10",
      data: undefined,
    });
    assert.deepStrictEqual(receivedMessage, null);

    txPort.postMessage("hello", codec.u32, {
      responseId: "10",
      data: tryAsU32(10),
    });

    assert.deepStrictEqual(receivedMessage, {
      responseId: "10",
      data: tryAsU32(10),
    });
  });

  it("should deliver messages sent before the listener is attached", () => {
    const [txPort, rxPort] = DirectPort.pair();

    txPort.postMessage("hello", codec.u32, {
      responseId: "10",
      data: tryAsU32(10),
    });

    let receivedMessage: Envelope<U32> | null = null;
    rxPort.on("hello", codec.u32, (msg) => {
      receivedMessage = msg;
    });

    assert.deepStrictEqual(receivedMessage, {
      responseId: "10",
      data: tryAsU32(10),
    });
  });

  it("should not let the sender consume its own pending message", () => {
    const [txPort, rxPort] = DirectPort.pair();

    txPort.postMessage("hello", codec.u32, {
      responseId: "10",
      data: tryAsU32(10),
    });

    let senderMessage: Envelope<U32> | null = null;
    txPort.on("hello", codec.u32, (msg) => {
      senderMessage = msg;
    });

    assert.deepStrictEqual(senderMessage, null);

    let receiverMessage: Envelope<U32> | null = null;
    rxPort.on("hello", codec.u32, (msg) => {
      receiverMessage = msg;
    });

    assert.deepStrictEqual(receiverMessage, {
      responseId: "10",
      data: tryAsU32(10),
    });
  });
});
```
