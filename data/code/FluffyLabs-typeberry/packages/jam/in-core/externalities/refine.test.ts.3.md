---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.test.ts#L306-L409
title: packages/jam/in-core/externalities/refine.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 368dab88b4ad4613c8933d01da0520e46e227c82b853e8a93ff78e220dbb7456
language: typescript
---
`packages/jam/in-core/externalities/refine.test.ts` (lines 306–409)

```typescript
      const result = await ext.machineExpunge(machineId);

      assert.strictEqual(result.isOk, true);
      // PC should be 10 since we initialized with PC=10
      assert.strictEqual(result.ok, tryAsProgramCounter(10));
    });

    it("should return NoMachineError for non-existent machine", async () => {
      const ext = createExt();
      const result = await ext.machineExpunge(tryAsMachineId(999));

      assert.strictEqual(result.isError, true);
    });

    it("should not allow double expunge", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(0));

      assert.strictEqual(initResult.isOk, true);
      const machineId = initResult.ok;

      const r1 = await ext.machineExpunge(machineId);
      assert.strictEqual(r1.isOk, true);

      const r2 = await ext.machineExpunge(machineId);
      assert.strictEqual(r2.isError, true);
    });

    it("should remove exact machine from multiple and return its program counter (10)", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      await ext.machineInit(code, tryAsProgramCounter(0));
      const initResult = await ext.machineInit(code, tryAsProgramCounter(10));
      await ext.machineInit(code, tryAsProgramCounter(20));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;
      const result = await ext.machineExpunge(machineId);

      assert.strictEqual(result.isOk, true);
      // PC should be 10 since we initialized with PC=10
      assert.strictEqual(result.ok, tryAsProgramCounter(10));
    });
  });

  describe("machineInvoke", () => {
    it("should return NoMachineError for non-existent machine", async () => {
      const ext = createExt();
      const regs = emptyRegisters();

      const result = await ext.machineInvoke(tryAsMachineId(999), tryAsBigGas(1000n), regs);

      assert.strictEqual(result.isError, true);
    });

    it("should execute inner PVM and return PANIC for TRAP instruction", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(0));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;

      const regs = emptyRegisters();
      const result = await ext.machineInvoke(machineId, tryAsBigGas(1000n), regs);

      assert.strictEqual(result.isOk, true);
      assert.strictEqual(result.ok.result.status, Status.PANIC);
    });

    it("should return OOG when gas is exhausted", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(0));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;

      const regs = emptyRegisters();
      // With 0 gas, should immediately OOG
      const result = await ext.machineInvoke(machineId, tryAsBigGas(0n), regs);

      assert.strictEqual(result.isOk, true);
      assert.strictEqual(result.ok.result.status, Status.OOG);
    });

    it("should pass registers to inner PVM and return them back", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(0));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;

      const regs = emptyRegisters();
      regs.set(0, tryAsU64(0xdeadbeefn));
      regs.set(5, tryAsU64(0xcafebaben));

      const result = await ext.machineInvoke(machineId, tryAsBigGas(1000n), regs);

      assert.strictEqual(result.isOk, true);
      // Registers should be returned (TRAP doesn't modify registers)
      assert.strictEqual(result.ok.registers.get(0), tryAsU64(0xdeadbeefn));
```
