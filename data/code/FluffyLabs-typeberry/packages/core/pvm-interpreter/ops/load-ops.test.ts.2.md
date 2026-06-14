---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/load-ops.test.ts#L164-L253
title: packages/core/pvm-interpreter/ops/load-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 5
content_sha: fba417760929e633762511515eeb492d3d5493020d18842b2797c81d8a1eb5d0
language: typescript
---
`packages/core/pvm-interpreter/ops/load-ops.test.ts` (lines 164–253)

```typescript
      const data = new Uint8Array([0x11, 0xcc, 0xdd, 0xff, 0xff]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedSignedValue = -8756n;
      const expectedUnsignedValue = 18446744073709542860n;

      loadOps.loadI32(address, registerIndex);

      assert.deepStrictEqual(registers.getU64(registerIndex), expectedUnsignedValue);
      assert.deepStrictEqual(registers.getI64(registerIndex), expectedSignedValue);
    });
  });

  function prepareLoadIndData(address: MemoryIndex, data: Uint8Array, registerValue: bigint, immediateValue: bigint) {
    const instructionResult = new InstructionResult();

    const memory = new MemoryBuilder()
      .setWriteablePages(getStartPageIndex(address), tryAsMemoryIndex(getStartPageIndex(address) + PAGE_SIZE), data)
      .finalize(tryAsMemoryIndex(20 * PAGE_SIZE), tryAsSbrkIndex(30 * PAGE_SIZE));
    const registers = Registers.empty();
    const loadOps = LoadOps.new(registers, memory, instructionResult);
    const addressRegisterIndex = 1;
    const resultRegisterIndex = 0;
    registers.setU64(addressRegisterIndex, registerValue);

    const immediate = ImmediateDecoder.new();
    immediate.setBytes(bigintToUint8ArrayLE(immediateValue));

    return {
      loadOps,
      registers,
      addressRegisterIndex,
      resultRegisterIndex,
      immediate,
    };
  }

  describe("loadInd (I8 I16 and I32)", () => {
    it("should load i8 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0x11, 0xcc, 0xff, 0xff, 0xff]);
      const { loadOps, registers, resultRegisterIndex, addressRegisterIndex, immediate } = prepareLoadIndData(
        address,
        data,
        1n + 16n * BigInt(PAGE_SIZE),
        1n,
      );
      const expectedSignedValue = -52n;
      const expectedUnsignedValue = 18446744073709551564n;

      loadOps.loadIndI8(resultRegisterIndex, addressRegisterIndex, immediate);

      assert.deepStrictEqual(registers.getU64(resultRegisterIndex), expectedUnsignedValue);
      assert.deepStrictEqual(registers.getI64(resultRegisterIndex), expectedSignedValue);
    });

    it("should load i16 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0x11, 0xcc, 0xdd, 0xff, 0xff]);
      const { loadOps, registers, resultRegisterIndex, addressRegisterIndex, immediate } = prepareLoadIndData(
        address,
        data,
        1n + 16n * BigInt(PAGE_SIZE),
        1n,
      );
      const expectedSignedValue = -8756n;
      const expectedUnsignedValue = 18446744073709542860n;
      const immediateDecoder = ImmediateDecoder.new();
      immediateDecoder.setBytes(new Uint8Array([1]));

      loadOps.loadIndI16(resultRegisterIndex, addressRegisterIndex, immediate);

      assert.deepStrictEqual(registers.getU64(resultRegisterIndex), expectedUnsignedValue);
      assert.deepStrictEqual(registers.getI64(resultRegisterIndex), expectedSignedValue);
    });

    it("should load i32 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0x11, 0xcc, 0xdd, 0xff, 0xff]);
      const { loadOps, registers, resultRegisterIndex, addressRegisterIndex, immediate } = prepareLoadIndData(
        address,
        data,
        1n + 16n * BigInt(PAGE_SIZE),
        1n,
      );
      const expectedSignedValue = -8756n;
      const expectedUnsignedValue = 18446744073709542860n;

      loadOps.loadIndI32(resultRegisterIndex, addressRegisterIndex, immediate);

      assert.deepStrictEqual(registers.getU64(resultRegisterIndex), expectedUnsignedValue);
```
