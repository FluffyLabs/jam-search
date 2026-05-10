---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/pages.test.ts#L1-L129
title: packages/jam/jam-host-calls/refine/pages.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 66aad4a41ce9679fb3e33f579f082a2cb5c2b4008c979cb9c0a8ec81474ea327
language: typescript
---
`packages/jam/jam-host-calls/refine/pages.test.ts` (lines 1–129)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder, tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter";
import { OK, Result } from "@typeberry/utils";
import {
  type MachineId,
  PagesError,
  toMemoryOperation,
  tryAsMachineId,
} from "../externalities/refine-externalities.js";
import { TestRefineExt } from "../externalities/refine-externalities.test.js";
import { HostCallResult } from "../general/results.js";
import { Pages } from "./pages.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;

function prepareRegsAndMemory(machineId: MachineId, pageStart: U64, pageCount: U64, requestType: U64) {
  const registers = HostCallRegisters.empty();
  registers.set(7, machineId);
  registers.set(8, pageStart);
  registers.set(9, pageCount);
  registers.set(10, requestType);

  const builder = new MemoryBuilder();
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));

  return {
    registers,
    memory,
  };
}

function prepareTest(
  result: Result<OK, PagesError>,
  machineId: number,
  pageStart: number,
  pageCount: number,
  requestType: number,
) {
  const refine = new TestRefineExt();
  const pages = Pages.new(refine);
  pages.currentServiceId = tryAsServiceId(10_000);
  const machineIndex = tryAsMachineId(machineId);
  const start = tryAsU64(pageStart);
  const count = tryAsU64(pageCount);
  const type = tryAsU64(requestType);
  const { registers, memory } = prepareRegsAndMemory(machineIndex, start, count, type);
  refine.machinePagesData.set(result, machineIndex, start, count, toMemoryOperation(type));

  return {
    pages,
    registers,
    memory,
    refine,
  };
}

describe("HostCalls: Pages", () => {
  it("Should return OK and Void memory", async () => {
    const { pages, registers } = prepareTest(Result.ok(OK), 10_000, 10_000, 5, 0);

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("Should return OK and set Read-only and Zeroed memory", async () => {
    const { pages, registers } = prepareTest(Result.ok(OK), 10_000, 10_000, 5, 1);

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("Should return OK and set Read-write and Zeroed memory", async () => {
    const { pages, registers } = prepareTest(Result.ok(OK), 10_000, 10_000, 5, 2);

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("Should return OK and set Read-only and preserve memory", async () => {
    const { pages, registers } = prepareTest(Result.ok(OK), 10_000, 10_000, 5, 3);

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("Should return OK and set Read-write and preserve memory", async () => {
    const { pages, registers } = prepareTest(Result.ok(OK), 10_000, 10_000, 5, 4);

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("Should return WHO when machine is unknown", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.NoMachine, () => "Test: error occurred"),
      1,
      10_000,
      5,
      0,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
  });

```
