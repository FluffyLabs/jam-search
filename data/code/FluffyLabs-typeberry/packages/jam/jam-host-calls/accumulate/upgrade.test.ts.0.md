---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/upgrade.test.ts#L1-L85
title: packages/jam/jam-host-calls/accumulate/upgrade.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 200c732c1c7d6f696da103c69f3d6e628ad87f1bb58a1ded69964ca9acac2c73
language: typescript
---
`packages/jam/jam-host-calls/accumulate/upgrade.test.ts` (lines 1–85)

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
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Upgrade } from "./upgrade.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;
const CODE_HASH_START_REG = 7;
const GAS_REG = 8;
const BALANCE_REG = 9;

function prepareRegsAndMemory(
  codeHash: CodeHash,
  gas: U64,
  balance: U64,
  { skipCodeHash = false }: { skipCodeHash?: boolean } = {},
) {
  const memStart = 2 ** 16;
  const registers = HostCallRegisters.empty();
  registers.set(CODE_HASH_START_REG, tryAsU64(memStart));
  registers.set(GAS_REG, gas);
  registers.set(BALANCE_REG, balance);

  const builder = new MemoryBuilder();

  if (!skipCodeHash) {
    builder.setReadablePages(tryAsMemoryIndex(memStart), tryAsMemoryIndex(memStart + PAGE_SIZE), codeHash.raw);
  }
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}

describe("HostCalls: Upgrade", () => {
  it("should upgrade a service", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const upgrade = Upgrade.new(currentServiceId, accumulate);
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
    );

    // when
    await upgrade.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.upgradeData, [[Bytes.fill(HASH_SIZE, 0x69), 2n ** 40n, 2n ** 50n]]);
  });

  it("should fail when code not readable", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const upgrade = Upgrade.new(currentServiceId, accumulate);

    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
      { skipCodeHash: true },
    );

    // when
    const result = await upgrade.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.upgradeData, []);
  });
});
```
