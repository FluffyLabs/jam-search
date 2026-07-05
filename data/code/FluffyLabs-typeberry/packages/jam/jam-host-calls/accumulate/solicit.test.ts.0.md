---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/solicit.test.ts#L1-L98
title: packages/jam/jam-host-calls/accumulate/solicit.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 10df104e54a6ea57e9f3853be5fe05e4edf83a0a0df04a061ef82cc6e332c35e
language: typescript
---
`packages/jam/jam-host-calls/accumulate/solicit.test.ts` (lines 1–98)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type CodeHash, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { MemoryBuilder, tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { Result } from "@typeberry/utils";
import { RequestPreimageError } from "../externalities/partial-state.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Solicit } from "./solicit.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;
const HASH_START_REG = 7;
const LENGTH_REG = 8;

function prepareRegsAndMemory(
  preimageHash: CodeHash,
  preimageLength: U64,
  { skipPreimageHash = false }: { skipPreimageHash?: boolean } = {},
) {
  const memStart = 2 ** 16;
  const registers = HostCallRegisters.empty();
  registers.set(HASH_START_REG, tryAsU64(memStart));
  registers.set(LENGTH_REG, preimageLength);

  const builder = new MemoryBuilder();

  if (!skipPreimageHash) {
    builder.setReadablePages(tryAsMemoryIndex(memStart), tryAsMemoryIndex(memStart + PAGE_SIZE), preimageHash.raw);
  }
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}

describe("HostCalls: Solicit", () => {
  it("should request a preimage hash", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const solicit = Solicit.new(currentServiceId, accumulate);
    const { registers, memory } = prepareRegsAndMemory(Bytes.fill(HASH_SIZE, 0x69).asOpaque(), tryAsU64(4_096));

    // when
    await solicit.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.requestPreimageData, [[Bytes.fill(HASH_SIZE, 0x69), 4_096n]]);
  });

  it("should fail if hash not available", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const solicit = Solicit.new(currentServiceId, accumulate);
    const { registers, memory } = prepareRegsAndMemory(Bytes.fill(HASH_SIZE, 0x69).asOpaque(), tryAsU64(4_096), {
      skipPreimageHash: true,
    });

    // when
    const result = await solicit.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.requestPreimageData, []);
  });

  it("should fail if already requested", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const solicit = Solicit.new(currentServiceId, accumulate);

    accumulate.requestPreimageResponse = Result.error(
      RequestPreimageError.AlreadyRequested,
      () => "Test: preimage already requested for solicit",
    );
    const { registers, memory } = prepareRegsAndMemory(Bytes.fill(HASH_SIZE, 0x69).asOpaque(), tryAsU64(4_096));

    // when
    await solicit.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.requestPreimageData, [[Bytes.fill(HASH_SIZE, 0x69), 4_096n]]);
  });

  it("should fail if already available", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
```
