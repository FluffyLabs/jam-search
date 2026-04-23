---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/designate.test.ts#L1-L98
title: packages/jam/jam-host-calls/accumulate/designate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5abf2ee3320c28afb29ce9b153e682676668cbe6716f3612a349c07dca2c7bdd
language: typescript
---
`packages/jam/jam-host-calls/accumulate/designate.test.ts` (lines 1–98)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, BLS_KEY_BYTES, ED25519_KEY_BYTES } from "@typeberry/crypto";
import { tryAsU64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { MemoryBuilder, tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/memory/memory-consts.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { VALIDATOR_META_BYTES, ValidatorData } from "@typeberry/state";
import { Result } from "@typeberry/utils";
import { UnprivilegedError } from "../externalities/partial-state.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Designate } from "./designate.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;
const VALIDATORS_DATA_START_REG = 7;

function prepareRegsAndMemory(
  validators: ValidatorData[],
  { skipValidators = false }: { skipValidators?: boolean } = {},
) {
  const memStart = 2 ** 16;
  const registers = HostCallRegisters.empty();
  registers.set(VALIDATORS_DATA_START_REG, tryAsU64(memStart));

  const builder = new MemoryBuilder();

  while (validators.length < tinyChainSpec.validatorsCount) {
    validators.push(
      ValidatorData.create({
        ed25519: Bytes.fill(ED25519_KEY_BYTES, 0).asOpaque(),
        bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 0).asOpaque(),
        bls: Bytes.fill(BLS_KEY_BYTES, 0).asOpaque(),
        metadata: Bytes.fill(VALIDATOR_META_BYTES, 0),
      }),
    );
  }

  const encoder = Encoder.create();
  encoder.sequenceFixLen(ValidatorData.Codec, validators);
  const data = encoder.viewResult();

  if (!skipValidators) {
    builder.setReadablePages(tryAsMemoryIndex(memStart), tryAsMemoryIndex(memStart + PAGE_SIZE), data.raw);
  }
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers: registers,
    memory,
  };
}

describe("HostCalls: Designate", () => {
  it("should fail when no data in memory", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const designate = Designate.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory([], { skipValidators: true });

    // when
    const result = await designate.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.validatorsData.length, 0);
  });

  it("should designate new validator set", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const designate = Designate.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory([
      ValidatorData.create({
        ed25519: Bytes.fill(ED25519_KEY_BYTES, 1).asOpaque(),
        bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 1).asOpaque(),
        bls: Bytes.fill(BLS_KEY_BYTES, 1).asOpaque(),
        metadata: Bytes.fill(VALIDATOR_META_BYTES, 1),
      }),
      ValidatorData.create({
        ed25519: Bytes.fill(ED25519_KEY_BYTES, 2).asOpaque(),
        bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 2).asOpaque(),
        bls: Bytes.fill(BLS_KEY_BYTES, 2).asOpaque(),
        metadata: Bytes.fill(VALIDATOR_META_BYTES, 2),
      }),
    ]);

    // when
    await designate.execute(gas, registers, memory);

    // then
```
