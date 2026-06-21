---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/yield.test.ts#L1-L77
title: packages/jam/jam-host-calls/accumulate/yield.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: ba0ffb783f42358e05b4173a382ca5b4d6b460870d1b6ac2064ac290b8b9c48b
language: typescript
---
`packages/jam/jam-host-calls/accumulate/yield.test.ts` (lines 1–77)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU32, tryAsU64, type U32 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder, tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Yield } from "./yield.js";

const gas = gasCounter(tryAsGas(0));
const HASH_START_REG = 7;
const RESULT_REG = 7;

function prepareRegsAndMemory(
  hashStart: U32,
  data: BytesBlob,
  { registerMemory = true }: { registerMemory?: boolean } = {},
) {
  const registers = HostCallRegisters.empty();
  registers.set(HASH_START_REG, tryAsU64(hashStart));

  const builder = new MemoryBuilder();
  if (registerMemory) {
    builder.setReadablePages(tryAsMemoryIndex(hashStart), tryAsMemoryIndex(hashStart + PAGE_SIZE), data.raw);
  }

  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}

describe("HostCalls: Yield", () => {
  it("should return panic if memory is unreadable", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const yieldHostCall = Yield.new(currentServiceId, accumulate); // yield is a reserved keyword

    const hashStart = tryAsU32(2 ** 16);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();

    const { registers, memory } = prepareRegsAndMemory(hashStart, data, { registerMemory: false });

    // when
    const result = await yieldHostCall.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(hashStart));
    assert.deepStrictEqual(accumulate.yieldHash, null);
  });

  it("should return status OK and yield hash", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const yieldHostCall = Yield.new(currentServiceId, accumulate);

    const hashStart = tryAsU32(2 ** 16);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();

    const { registers, memory } = prepareRegsAndMemory(hashStart, data);

    // when
    const result = await yieldHostCall.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.yieldHash, data);
  });
});
```
