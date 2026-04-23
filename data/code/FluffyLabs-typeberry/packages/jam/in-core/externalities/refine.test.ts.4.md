---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.test.ts#L405-L431
title: packages/jam/in-core/externalities/refine.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 21de32f18cb5b672c38101235b06491418c711f192c83f81af4f5dd9e17c0f7e
language: typescript
---
`packages/jam/in-core/externalities/refine.test.ts` (lines 405–431)

```typescript
      const result = await ext.machineInvoke(machineId, tryAsBigGas(1000n), regs);

      assert.strictEqual(result.isOk, true);
      // Registers should be returned (TRAP doesn't modify registers)
      assert.strictEqual(result.ok.registers.get(0), tryAsU64(0xdeadbeefn));
      assert.strictEqual(result.ok.registers.get(5), tryAsU64(0xcafebaben));
    });

    it("should return remaining gas after execution", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(0));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;

      const regs = emptyRegisters();
      const result = await ext.machineInvoke(machineId, tryAsBigGas(1000n), regs);

      assert.strictEqual(result.isOk, true);
      // TRAP costs 1 gas, so remaining should be 999
      const remaining = Number(result.ok.gas);
      assert.ok(remaining < 1000);
      assert.ok(remaining >= 0);
    });
  });
});
```
