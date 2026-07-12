---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/query.test.ts#L1-L103
title: packages/jam/jam-host-calls/accumulate/query.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 25b8fc0eb8b8dcb838b6613dca2ddeac0a87b7e3546586a33a1d68dba4a0dce4
language: typescript
---
`packages/jam/jam-host-calls/accumulate/query.test.ts` (lines 1–103)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU32, tryAsU64, type U32 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder, tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { type PreimageStatus, PreimageStatusKind } from "../externalities/partial-state.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Query } from "./query.js";

const gas = gasCounter(tryAsGas(0));
const HASH_START_REG = 7;
const LENGTH_REG = 8;
const RESULT_REG_1 = 7;
const RESULT_REG_2 = 8;
const UPPER_BITS_SHIFT = 32n;

function prepareRegsAndMemory(
  hashStart: U32,
  length: U32,
  data: BytesBlob,
  { registerMemory = true }: { registerMemory?: boolean } = {},
) {
  const registers = HostCallRegisters.empty();
  registers.set(HASH_START_REG, tryAsU64(hashStart));
  registers.set(LENGTH_REG, tryAsU64(length));

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

describe("HostCalls: Query", () => {
  it("should return panic if memory is unreadable", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const query = Query.new(currentServiceId, accumulate);

    const w7 = tryAsU64(2 ** 16);
    const w8 = tryAsU64(0);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    accumulate.checkPreimageStatusResponse = null;

    const { registers, memory } = prepareRegsAndMemory(tryAsU32(Number(w7)), tryAsU32(Number(w8)), data, {
      registerMemory: false,
    });

    // when
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), w7);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });

  it("should return none if preimage is not found", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const query = Query.new(currentServiceId, accumulate);

    const w7 = tryAsU64(2 ** 16);
    const w8 = tryAsU64(32);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    accumulate.checkPreimageStatusResponse = null;

    const { registers, memory } = prepareRegsAndMemory(tryAsU32(Number(w7)), tryAsU32(Number(w8)), data);

    // when
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), HostCallResult.NONE);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), 0n);
    assert.deepStrictEqual(accumulate.checkPreimageStatusData, [[Bytes.fill(HASH_SIZE, 0xaa), w8]]);
  });

  it("should return requested if preimage is requested", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const query = Query.new(currentServiceId, accumulate);

    const w7 = tryAsU64(2 ** 16);
    const w8 = tryAsU64(32);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    const status: PreimageStatus = {
      status: PreimageStatusKind.Requested,
    };
    accumulate.checkPreimageStatusResponse = status;

```
