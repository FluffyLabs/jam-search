---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/machine.test.ts#L89-L110
title: packages/jam/jam-host-calls/refine/machine.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 897022a7e81ecf727d6d8f08772693b2c39f10132b6e5f2dfd3e9b30a58ef0e5
language: typescript
---
`packages/jam/jam-host-calls/refine/machine.test.ts` (lines 89–110)

```typescript
    const result = await machine.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
  });

  it("should return HUH when code is invalid", async () => {
    const refine = new TestRefineExt();
    const machine = Machine.new(refine);
    machine.currentServiceId = tryAsServiceId(10_000);
    const code = BytesBlob.blobFromString("invalid PVM code");
    const programCounter = tryAsProgramCounter(5);
    const { registers, memory } = prepareRegsAndMemory(code, programCounter);

    // when
    const result = await machine.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });
});
```
