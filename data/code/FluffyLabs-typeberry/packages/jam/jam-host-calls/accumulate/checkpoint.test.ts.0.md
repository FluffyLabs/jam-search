---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/checkpoint.test.ts#L1-L31
title: packages/jam/jam-host-calls/accumulate/checkpoint.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 27438b8a3e36b66242e9a6ea10840baecbe3823097994123f896b1073b59f636
language: typescript
---
`packages/jam/jam-host-calls/accumulate/checkpoint.test.ts` (lines 1–31)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { HostCallRegisters } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { Checkpoint } from "./checkpoint.js";

const REGISTER = 7;

describe("HostCalls: Checkpoint", () => {
  it("should write U64 gas to register and checkpoint the state", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const checkpoint = Checkpoint.new(serviceId, accumulate);

    const counter = gasCounter(tryAsGas(2n ** 42n - 1n));
    const regs = HostCallRegisters.empty();

    assert.deepStrictEqual(regs.get(REGISTER), 0n);
    assert.deepStrictEqual(accumulate.checkpointCalled, 0);

    // when
    await checkpoint.execute(counter, regs);

    // then
    assert.deepStrictEqual(regs.get(REGISTER), 2n ** 42n - 1n);
    assert.deepStrictEqual(accumulate.checkpointCalled, 1);
  });
});
```
