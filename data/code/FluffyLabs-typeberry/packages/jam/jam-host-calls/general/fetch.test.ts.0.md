---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L1-L92
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 7
content_sha: e815c4626ea86210246c5bedc66f0e9b90a16d0b0d2822b2ae11c9ac3225d698
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 1–92)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { type EntropyHash, tryAsServiceId } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder, tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/memory/memory-consts.js";
import { Fetch, FetchContext, FetchKind, type IAccumulateFetch, type IRefineFetch } from "./fetch.js";
import { HostCallResult } from "./results.js";

describe("Fetch", () => {
  const IN_OUT_REG = 7;
  const gas = gasCounter(tryAsGas(0));

  it("should return PvmExecution.Panic if memory write fails", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([1, 2, 3]);
    const fetchMock = new RefineFetchMock();
    fetchMock.constantsResponse = blob;

    const badOffset = tryAsU64(0xfffff);

    const registers = HostCallRegisters.empty();
    registers.set(IN_OUT_REG, badOffset);
    registers.set(8, tryAsU64(0));
    registers.set(9, tryAsU64(blob.length));
    registers.set(10, tryAsU64(FetchKind.Constants));

    const builder = new MemoryBuilder();
    // do not define any writable memory!
    const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, PvmExecution.Panic);
  });

  it("should write empty result and set IN_OUT_REG to NONE if fetch returns null", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const fetchMock = new RefineFetchMock();
    // oneWorkItem returns null when the work item index has no mock response registered

    const blob = BytesBlob.blobFromNumbers([]);
    const { registers, memory, readBack } = prepareRegsAndMemory(blob, FetchKind.OneWorkItem);
    // set work item index to one that has no response → oneWorkItem returns null
    registers.set(11, tryAsU64(999));
    fetchMock.oneWorkItemResponses.set("999", null);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.strictEqual(registers.get(IN_OUT_REG), HostCallResult.NONE);
    // nothing written
    assert.deepStrictEqual(readBack(), new Uint8Array());
  });

  it("should write nothing if offset >= blob length", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([1, 2, 3]);
    const fetchMock = new RefineFetchMock();
    fetchMock.constantsResponse = blob;

    const { registers, memory, readBack } = prepareRegsAndMemory(blob, FetchKind.Constants, 5, 2);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), tryAsU64(blob.length));
    assert.deepStrictEqual(readBack(), Uint8Array.from([0, 0, 0]));
  });

  it("should clamp offset + length to blob end", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([9, 8, 7, 6, 5]);
    const fetchMock = new RefineFetchMock();
    fetchMock.constantsResponse = blob;

    const { registers, memory, readBack } = prepareRegsAndMemory(blob, FetchKind.Constants, 3, 10);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), tryAsU64(blob.length));

```
