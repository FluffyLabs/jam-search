---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/invoke.test.ts#L112-L224
title: packages/jam/jam-host-calls/refine/invoke.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: f26f181d2f3a6421db7de410bda69a88df982b5893bd338cf4c8a691c7545521
language: typescript
---
`packages/jam/jam-host-calls/refine/invoke.test.ts` (lines 112–224)

```typescript
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), HostCallResult.WHO);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });

  it("should return `who` if machine is not found (machine id is not valid)", async () => {
    const [refine, machineId] = await prepareMachine({
      status: Status.OK,
    });

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId + 1n);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), HostCallResult.WHO);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });

  it("should run the machine and finish with `host` status", async () => {
    const hostCallIndex = tryAsU64(10);
    const [refine, machineId] = await prepareMachine({
      status: Status.HOST,
      hostCallIndex,
    });

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), tryAsU64(Status.HOST));
    assert.deepStrictEqual(registers.get(RESULT_REG_2), hostCallIndex);
  });

  it("should run the machine and finish with `fault` status", async () => {
    const address = tryAsU64(2 ** 20);
    const [refine, machineId] = await prepareMachine({
      status: Status.FAULT,
      address,
    });

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), tryAsU64(Status.FAULT));
    assert.deepStrictEqual(registers.get(RESULT_REG_2), address);
  });

  it("should run the machine and finish with `oog` status", async () => {
    const [refine, machineId] = await prepareMachine({
      status: Status.OOG,
    });

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), tryAsU64(Status.OOG));
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });

  it("should run the machine and finish with `panic` status", async () => {
    const [refine, machineId] = await prepareMachine({
      status: Status.PANIC,
    });

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

```
