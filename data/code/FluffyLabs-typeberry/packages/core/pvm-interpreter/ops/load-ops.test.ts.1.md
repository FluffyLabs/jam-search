---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/load-ops.test.ts#L88-L168
title: packages/core/pvm-interpreter/ops/load-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 41fc3a130bacdb24edc01f27e76986a251f9b402336fc2dc9918c7043f3e6774
language: typescript
---
`packages/core/pvm-interpreter/ops/load-ops.test.ts` (lines 88–168)

```typescript
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedValue = 61183n;

      loadOps.loadU16(address, registerIndex);

      assert.deepStrictEqual(registers.getI64(registerIndex), expectedValue);
      assert.deepStrictEqual(registers.getU64(registerIndex), expectedValue);
    });

    it("should load u32 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xff, 0xee, 0xdd, 0x0c]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedValue = 215871231n;

      loadOps.loadU32(address, registerIndex);

      assert.deepStrictEqual(registers.getI64(registerIndex), expectedValue);
      assert.deepStrictEqual(registers.getU64(registerIndex), expectedValue);
    });

    it("should load u64 from memory to register (negative number)", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedSignedValue = -1n;
      const expectedUnsignedValue = 2n ** 64n - 1n;

      loadOps.loadU64(address, registerIndex);

      assert.deepStrictEqual(registers.getI64(registerIndex), expectedSignedValue);
      assert.deepStrictEqual(registers.getU64(registerIndex), expectedUnsignedValue);
    });

    it("should load u64 from memory to register", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99, 0x08]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedValue = 0x08_99_aa_bb_cc_dd_ee_ffn;

      loadOps.loadU64(address, registerIndex);

      assert.deepStrictEqual(registers.getI64(registerIndex), expectedValue);
      assert.deepStrictEqual(registers.getU64(registerIndex), expectedValue);
    });
  });

  describe("load (I8, I16 and I32)", () => {
    it("should load i8 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xcc, 0xff, 0xff, 0xff]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedSignedValue = -52n;
      const expectedUnsignedValue = 18446744073709551564n;

      loadOps.loadI8(address, registerIndex);

      assert.deepStrictEqual(registers.getU64(registerIndex), expectedUnsignedValue);
      assert.deepStrictEqual(registers.getI64(registerIndex), expectedSignedValue);
    });

    it("should load i16 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xcc, 0xdd, 0xff, 0xff]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedSignedValue = -8756n;
      const expectedUnsignedValue = 18446744073709542860n;

      loadOps.loadI16(address, registerIndex);

      assert.deepStrictEqual(registers.getU64(registerIndex), expectedUnsignedValue);
      assert.deepStrictEqual(registers.getI64(registerIndex), expectedSignedValue);
    });

    it("should load i32 from memory to register and extend the number to the register size", () => {
      const address = tryAsMemoryIndex(1 + RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
      const data = new Uint8Array([0x11, 0xcc, 0xdd, 0xff, 0xff]);
      const { loadOps, registers, registerIndex } = prepareLoadData(address, data);
      const expectedSignedValue = -8756n;
      const expectedUnsignedValue = 18446744073709542860n;

```
