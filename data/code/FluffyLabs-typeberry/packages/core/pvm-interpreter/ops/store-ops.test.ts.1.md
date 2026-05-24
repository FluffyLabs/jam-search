---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/store-ops.test.ts#L90-L192
title: packages/core/pvm-interpreter/ops/store-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 4
content_sha: d32efb7276fbecb9050e87761626c713b64bfea5e2adbeb3b3ff934db029afaa
language: typescript
---
`packages/core/pvm-interpreter/ops/store-ops.test.ts` (lines 90–192)

```typescript
  describe("storeImmediate (U8, U16 U32 and U64)", () => {
    it("should store u8 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, immediate, address, memory, expectedPage } = prepareStoreData(valueToStore, 1);

      storeOps.storeImmediateU8(address, immediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u16 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, immediate, address, memory, expectedPage } = prepareStoreData(valueToStore, 2);

      storeOps.storeImmediateU16(address, immediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u32 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const { storeOps, immediate, address, memory, expectedPage } = prepareStoreData(valueToStore, 4);

      storeOps.storeImmediateU32(address, immediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u64 number", () => {
      const valueToStore = -19088744n;
      const { storeOps, immediate, address, memory, expectedPage } = prepareStoreData(valueToStore, 8);

      storeOps.storeImmediateU64(address, immediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });
  });

  function prepareStoreIndData(
    valueToStore: bigint,
    noOfBytes: 1 | 2 | 4 | 8,
    addressRegisterValue: bigint,
    addressImmediateValue: bigint,
  ) {
    const instructionResult = new InstructionResult();
    const regs = Registers.empty();
    const address = tryAsMemoryIndex(Number(addressRegisterValue + addressImmediateValue));
    const addressRegisterIndex = 0;
    const valueRegisterIndex = 1;
    regs.setU64(valueRegisterIndex, valueToStore);
    regs.setU64(addressRegisterIndex, addressRegisterValue);
    const initialMemory = new Uint8Array(32);
    initialMemory.fill(0x1);
    const memory = new MemoryBuilder()
      .setWriteablePages(
        getStartPageIndex(address),
        tryAsMemoryIndex(getStartPageIndex(address) + PAGE_SIZE),
        initialMemory,
      )
      .finalize(tryAsMemoryIndex(20 * PAGE_SIZE), tryAsSbrkIndex(30 * PAGE_SIZE));
    const storeOps = StoreOps.new(regs, memory, instructionResult);
    const expectedPage = getExpectedPage(address, bigintToUint8ArrayLE(valueToStore, noOfBytes), 32);

    const valueImmediate = ImmediateDecoder.new();
    valueImmediate.setBytes(bigintToUint8ArrayLE(valueToStore, noOfBytes));

    const addressImmediate = ImmediateDecoder.new();
    addressImmediate.setBytes(bigintToUint8ArrayLE(addressImmediateValue));

    return {
      storeOps,
      address,
      valueRegisterIndex,
      addressRegisterIndex,
      memory,
      expectedPage,
      valueImmediate,
      addressImmediate,
    };
  }

  describe("storeImmediateInd (U8, U16 U32 and U64)", () => {
    it("should store u8 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueImmediate, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 1, addressRegisterValue, addressImmediateValue);

      storeOps.storeImmediateIndU8(addressRegisterIndex, addressImmediate, valueImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u16 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
```
