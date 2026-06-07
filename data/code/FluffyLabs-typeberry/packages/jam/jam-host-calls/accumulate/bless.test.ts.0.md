---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/bless.test.ts#L1-L101
title: packages/jam/jam-host-calls/accumulate/bless.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 8fb3bd478fd31cedb05261a90b6755c86e40a6186f86134cccae6323ada6e812
language: typescript
---
`packages/jam/jam-host-calls/accumulate/bless.test.ts` (lines 1–101)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type ServiceGas, type ServiceId, tryAsServiceGas, tryAsServiceId } from "@typeberry/block";
import { codec, Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { MAX_VALUE_U64, tryAsU64, type U64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { MemoryBuilder, tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/memory/memory-consts.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { codecPerCore, type PerCore, tryAsPerCore } from "@typeberry/state";
import { deepEqual, Result } from "@typeberry/utils";
import { UpdatePrivilegesError } from "../externalities/partial-state.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Bless } from "./bless.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;
const MANAGER_REG = 7;
const AUTHORIZATION_REG = 8;
const VALIDATOR_REG = 9;
const REGISTRAR_REG = 10;
const DICTIONARY_START = 11;
const DICTIONARY_COUNT = 12;

function prepareServiceGasMap() {
  const entries: [ServiceId, ServiceGas][] = [];
  entries.push([tryAsServiceId(10_000), tryAsServiceGas(15_000)]);
  entries.push([tryAsServiceId(20_000), tryAsServiceGas(15_000)]);
  return entries;
}

function prepareAuthorizers() {
  const authorizers: ServiceId[] = [];
  authorizers.push(tryAsServiceId(10));
  authorizers.push(tryAsServiceId(15));
  return tryAsPerCore(authorizers, tinyChainSpec);
}

function prepareRegsAndMemory(
  entries: [ServiceId, ServiceGas][],
  authorizerData: PerCore<ServiceId>,
  {
    skipDictionary = false,
    skipAuth = false,
    manager,
    validator,
    registrar,
  }: { skipDictionary?: boolean; skipAuth?: boolean; manager?: U64; validator?: U64; registrar?: U64 } = {},
) {
  const memAuthStart = 2 ** 24;
  const memStart = 2 ** 16;
  const registers = HostCallRegisters.empty();
  registers.set(MANAGER_REG, manager ?? tryAsU64(5));
  registers.set(AUTHORIZATION_REG, tryAsU64(memAuthStart));
  registers.set(VALIDATOR_REG, validator ?? tryAsU64(20));
  registers.set(REGISTRAR_REG, registrar ?? tryAsU64(42));
  registers.set(DICTIONARY_START, tryAsU64(memStart));
  registers.set(DICTIONARY_COUNT, tryAsU64(entries.length));

  const builder = new MemoryBuilder();

  const encoder = Encoder.create();
  for (const [k, v] of entries) {
    encoder.i32(k);
    encoder.i64(v);
  }
  const data = encoder.viewResult();

  if (!skipDictionary) {
    builder.setReadablePages(tryAsMemoryIndex(memStart), tryAsMemoryIndex(memStart + PAGE_SIZE), data.raw);
  }

  const dataAuth = Encoder.encodeObject(codecPerCore(codec.u32.asOpaque<ServiceId>()), authorizerData, tinyChainSpec);
  if (!skipAuth) {
    builder.setReadablePages(tryAsMemoryIndex(memAuthStart), tryAsMemoryIndex(memAuthStart + PAGE_SIZE), dataAuth.raw);
  }

  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}
describe("HostCalls: Bless", () => {
  it("should set new privileged services and auto-accumulate services", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers);

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
```
