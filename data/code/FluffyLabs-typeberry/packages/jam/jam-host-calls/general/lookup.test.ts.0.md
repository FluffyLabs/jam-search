---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/lookup.test.ts#L1-L105
title: packages/jam/jam-host-calls/general/lookup.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 0e71e90a52f223356bd48e1677c3d507084b32aa95b98f3f02798854b0922cba
language: typescript
---
`packages/jam/jam-host-calls/general/lookup.test.ts` (lines 1–105)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { type ServiceId, tryAsServiceId } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Blake2b, type Blake2bHash } from "@typeberry/hash";
import { tryAsU64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter";
import { MemoryBuilder, tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { TestAccounts } from "../externalities/test-accounts.js";
import { Lookup } from "./lookup.js";
import { HostCallResult } from "./results.js";

let blake2b: Blake2b;
let HASH: Blake2bHash;

before(async () => {
  blake2b = await Blake2b.createHasher();
  HASH = blake2b.hashBytes(BytesBlob.blobFromString("hello world"));
});

const gas = gasCounter(tryAsGas(0));

const SERVICE_ID_REG = 7;
const RESULT_REG = SERVICE_ID_REG;
const HASH_ADDRESS_REG = 8;
const DEST_ADDRESS_REG = 9;
const PREIMAGE_OFFSET_REG = 10;
const PREIMAGE_LENGTH_TO_WRITE_REG = 11;

const PREIMAGE_BLOB = BytesBlob.blobFromString("hello world");
const DESTINATION_MEM_ADDRESS = 2 ** 22;
const PREIMAGE_HASH_ADDRESS = 2 ** 16;

function prepareRegsAndMemory(
  serviceId: ServiceId,
  key: Blake2bHash,
  {
    skipKey = false,
    skipValue = false,
    preimageOffset = 0,
    preimageLength = 0,
  }: { skipKey?: boolean; skipValue?: boolean; preimageOffset?: number; preimageLength?: number } = {},
) {
  const registers = HostCallRegisters.empty();
  registers.set(SERVICE_ID_REG, tryAsU64(serviceId));
  registers.set(HASH_ADDRESS_REG, tryAsU64(PREIMAGE_HASH_ADDRESS));
  registers.set(DEST_ADDRESS_REG, tryAsU64(DESTINATION_MEM_ADDRESS));
  registers.set(PREIMAGE_OFFSET_REG, tryAsU64(preimageOffset));
  registers.set(PREIMAGE_LENGTH_TO_WRITE_REG, tryAsU64(preimageLength));

  const builder = new MemoryBuilder();
  if (!skipKey) {
    builder.setReadablePages(
      tryAsMemoryIndex(PREIMAGE_HASH_ADDRESS),
      tryAsMemoryIndex(PREIMAGE_HASH_ADDRESS + PAGE_SIZE),
      key.raw,
    );
  }
  if (!skipValue) {
    builder.setWriteablePages(
      tryAsMemoryIndex(DESTINATION_MEM_ADDRESS),
      tryAsMemoryIndex(DESTINATION_MEM_ADDRESS + PAGE_SIZE),
    );
  }
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}

describe("HostCalls: Lookup", () => {
  it("should fail gracefully if account doesn't exist", async () => {
    const currentServiceId = tryAsServiceId(15_000);
    const accounts = new TestAccounts(currentServiceId);
    const lookup = Lookup.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const { registers, memory } = prepareRegsAndMemory(serviceId, HASH);

    // serviceId out of range
    registers.set(SERVICE_ID_REG, tryAsU64(2n ** 32n));
    const result = await lookup.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(SERVICE_ID_REG), HostCallResult.NONE);
  });

  it("should fail gracefully if preimage doesn't exist", async () => {
    const currentServiceId = tryAsServiceId(15_000);
    const accounts = new TestAccounts(currentServiceId);
    const lookup = Lookup.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const { registers, memory } = prepareRegsAndMemory(serviceId, HASH);

    accounts.preimages.set(null, serviceId, HASH);
    const result = await lookup.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(SERVICE_ID_REG), HostCallResult.NONE);
  });

```
