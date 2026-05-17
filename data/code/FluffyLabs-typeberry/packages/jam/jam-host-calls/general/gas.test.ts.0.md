---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/gas.test.ts#L1-L43
title: packages/jam/jam-host-calls/general/gas.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 504a6177648affdfc2a811326e72c3f990b6e5dc9b4c3b065deccd38f8686762
language: typescript
---
`packages/jam/jam-host-calls/general/gas.test.ts` (lines 1–43)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { HostCallRegisters } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter";
import { GasHostCall } from "./gas.js";

const REGISTER = 7;

describe("HostCalls: Gas", () => {
  it("should write U32 gas to register", () => {
    const currentServiceId = tryAsServiceId(10_000);
    const gas = GasHostCall.new(currentServiceId);

    const counter = gasCounter(tryAsGas(10_000));
    const regs = HostCallRegisters.empty();

    assert.deepStrictEqual(regs.get(REGISTER), 0n);

    // when
    gas.execute(counter, regs);

    // then
    assert.deepStrictEqual(regs.get(REGISTER), 10_000n);
  });

  it("should write U64 gas to register", () => {
    const currentServiceId = tryAsServiceId(10_000);
    const gas = GasHostCall.new(currentServiceId);

    const counter = gasCounter(tryAsGas(2n ** 64n - 1n));
    const regs = HostCallRegisters.empty();

    assert.deepStrictEqual(regs.get(REGISTER), 0n);

    // when
    gas.execute(counter, regs);

    // then
    assert.deepStrictEqual(regs.get(REGISTER), 2n ** 64n - 1n);
  });
});
```
