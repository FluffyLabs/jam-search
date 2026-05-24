---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/historical-lookup.test.ts#L1-L96
title: packages/jam/jam-host-calls/refine/historical-lookup.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 7e9837b93ab63cecec0e773906e37125fc2cb1f583b12ad2308caf68765b4f37
language: typescript
---
`packages/jam/jam-host-calls/refine/historical-lookup.test.ts` (lines 1–96)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type ServiceId, tryAsServiceId } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import type { Blake2bHash } from "@typeberry/hash";
import { tryAsU64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { MemoryBuilder, tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { TestRefineExt } from "../externalities/refine-externalities.test.js";
import { HostCallResult } from "../general/results.js";
import { HistoricalLookup } from "./historical-lookup.js";

const gas = gasCounter(tryAsGas(0));
const SERVICE_ID_REG = 7;
const RESULT_REG = SERVICE_ID_REG;
const HASH_START_REG = 8;
const DEST_START_REG = 9;
const DEST_OFFSET_REG = 10;
const DEST_LEN_REG = 11;

function prepareRegsAndMemory(
  serviceId: ServiceId,
  hash: Blake2bHash,
  offset: number,
  destinationLength: number,
  { skipHash = false, writableMemory = true }: { skipHash?: boolean; writableMemory?: boolean } = {},
) {
  const hashAddress = 2 ** 16;
  const memStart = 2 ** 20;
  const registers = HostCallRegisters.empty();
  registers.set(SERVICE_ID_REG, tryAsU64(serviceId));
  registers.set(HASH_START_REG, tryAsU64(hashAddress));
  registers.set(DEST_START_REG, tryAsU64(memStart));
  registers.set(DEST_OFFSET_REG, tryAsU64(offset));
  registers.set(DEST_LEN_REG, tryAsU64(destinationLength));

  const builder = new MemoryBuilder();
  if (!skipHash) {
    builder.setReadablePages(tryAsMemoryIndex(hashAddress), tryAsMemoryIndex(hashAddress + PAGE_SIZE), hash.raw);
  }
  if (writableMemory) {
    builder.setWriteablePages(tryAsMemoryIndex(memStart), tryAsMemoryIndex(memStart + PAGE_SIZE));
  }
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
    readResult: () => {
      const result = new Uint8Array(destinationLength);
      assert.strictEqual(memory.loadInto(result, tryAsU64(memStart)).isOk, true);
      return BytesBlob.blobFrom(result);
    },
  };
}

describe("HostCalls: Historical Lookup", () => {
  it("should lookup key from an account", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory, readResult } = prepareRegsAndMemory(serviceId, hash, 0, 64);
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(data.length));
    assert.deepStrictEqual(
      readResult().toString(),
      "0x68656c6c6f20776f726c640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should lookup key longer than destination", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory, readResult } = prepareRegsAndMemory(serviceId, hash, 0, 3);
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(data.length));
```
