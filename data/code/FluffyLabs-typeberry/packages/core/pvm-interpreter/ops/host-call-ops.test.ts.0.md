---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/host-call-ops.test.ts#L1-L35
title: packages/core/pvm-interpreter/ops/host-call-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 3e9cbaf9bce15f22581d7f35933e6301afe6e64fac1e09019d2b8d9f26de9eae
language: typescript
---
`packages/core/pvm-interpreter/ops/host-call-ops.test.ts` (lines 1–35)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import { InstructionResult } from "../instruction-result.js";
import { Result } from "../result.js";
import { bigintToUint8ArrayLE } from "../test-utils.js";
import { HostCallOps } from "./host-call-ops.js";

describe("HostCallOps", () => {
  function prepareData(immediateValue: bigint) {
    const instructionResult = new InstructionResult();
    const hostCallOps = HostCallOps.new(instructionResult);
    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(immediateValue));

    return { hostCallOps, instructionResult, immediate };
  }

  it("should set correct status", () => {
    const { hostCallOps, instructionResult, immediate } = prepareData(0n);

    hostCallOps.hostCall(immediate);

    assert.strictEqual(instructionResult.status, Result.HOST);
  });

  it("should set correct exitParam", () => {
    const value = 0x7f;
    const { hostCallOps, instructionResult, immediate } = prepareData(BigInt(value));

    hostCallOps.hostCall(immediate);

    assert.strictEqual(instructionResult.exitParam, value);
  });
});
```
