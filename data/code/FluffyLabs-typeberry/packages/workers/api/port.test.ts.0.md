---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/port.test.ts#L1-L32
title: packages/workers/api/port.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 1cf80eb9894f9d540a4f62b42b37f3d2abb88e3f70c7b9a289cae93713a7e497
language: typescript
---
`packages/workers/api/port.test.ts` (lines 1–32)

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
});
```
