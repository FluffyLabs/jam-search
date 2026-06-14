---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/eject.test.ts#L1-L103
title: packages/jam/jam-host-calls/accumulate/eject.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 30673646dc84343420054233d94d9e162d716faf59c65b9c1bf310c689bf3e20
language: typescript
---
`packages/jam/jam-host-calls/accumulate/eject.test.ts` (lines 1–103)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type ServiceId, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { MemoryBuilder } from "@typeberry/pvm-interpreter";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { deepEqual, OK, Result } from "@typeberry/utils";
import { EjectError } from "../externalities/partial-state.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Eject } from "./eject.js";

const RESULT_REG = 7;
const SOURCE_REG = 7;
const HASH_START_REG = 8;

function prepareRegsAndMemory(
  source: ServiceId,
  hash: Bytes<HASH_SIZE>,
  { skipHash = false }: { skipHash?: boolean } = {},
) {
  const hashStart = 2 ** 16;
  const registers = HostCallRegisters.empty();
  registers.set(SOURCE_REG, tryAsU64(source));
  registers.set(HASH_START_REG, tryAsU64(hashStart));

  const builder = new MemoryBuilder();
  if (!skipHash) {
    builder.setReadablePages(tryAsMemoryIndex(hashStart), tryAsMemoryIndex(hashStart + PAGE_SIZE), hash.raw);
  }

  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}

const gas = gasCounter(tryAsGas(10_000));

describe("HostCalls: Eject", () => {
  it("should eject the account and transfer the funds", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const eject = Eject.new(serviceId, accumulate);
    const sourceServiceId = tryAsServiceId(15_000);
    const hash = Bytes.fill(HASH_SIZE, 5);

    const { registers, memory } = prepareRegsAndMemory(sourceServiceId, hash);

    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.ejectData, [[sourceServiceId, hash]]);
    assert.deepStrictEqual(accumulate.ejectReturnValue, Result.ok(OK));
  });

  it("should fail if there is no memory for hash", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const eject = Eject.new(serviceId, accumulate);
    const sourceServiceId = tryAsServiceId(15_000);
    const hash = Bytes.fill(HASH_SIZE, 5);

    const { registers, memory } = prepareRegsAndMemory(sourceServiceId, hash, { skipHash: true });

    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.ejectData, []);
  });

  it("should fail if destination does not exist", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const eject = Eject.new(serviceId, accumulate);
    const sourceServiceId = tryAsServiceId(15_000);
    const hash = Bytes.fill(HASH_SIZE, 5);
    accumulate.ejectReturnValue = Result.error(
      EjectError.InvalidService,
      () => "Test: destination service does not exist for eject",
    );

    const { registers, memory } = prepareRegsAndMemory(sourceServiceId, hash);

    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
```
