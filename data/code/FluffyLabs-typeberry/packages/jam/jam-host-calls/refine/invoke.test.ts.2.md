---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/invoke.test.ts#L219-L249
title: packages/jam/jam-host-calls/refine/invoke.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: d23540e39ce901b66e2ae38afb91476e2b9dff98f161f1c721bc1794eb29c303
language: typescript
---
`packages/jam/jam-host-calls/refine/invoke.test.ts` (lines 219–249)

```typescript
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), tryAsU64(Status.PANIC));
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });

  it("should run the machine and finish with `halt` status", async () => {
    const [refine, machineId] = await prepareMachine({
      status: Status.HALT,
    });

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), tryAsU64(Status.HALT));
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });
});
```
