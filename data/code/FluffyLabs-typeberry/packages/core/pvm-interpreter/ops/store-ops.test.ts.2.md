---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/store-ops.test.ts#L186-L272
title: packages/core/pvm-interpreter/ops/store-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 4
content_sha: d60d72c1023dff5090000a475a34f4b2b3c8c6d2369b5d7fae05a58c6c517d7d
language: typescript
---
`packages/core/pvm-interpreter/ops/store-ops.test.ts` (lines 186–272)

```typescript
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u16 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueImmediate, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 2, addressRegisterValue, addressImmediateValue);

      storeOps.storeImmediateIndU16(addressRegisterIndex, addressImmediate, valueImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u32 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueImmediate, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 4, addressRegisterValue, addressImmediateValue);

      storeOps.storeImmediateIndU32(addressRegisterIndex, addressImmediate, valueImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u64 number", () => {
      const valueToStore = -19088744n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueImmediate, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 8, addressRegisterValue, addressImmediateValue);

      storeOps.storeImmediateIndU64(addressRegisterIndex, addressImmediate, valueImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });
  });

  describe("storeInd (U8, U16 U32 and U64)", () => {
    it("should store u8 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueRegisterIndex, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 1, addressRegisterValue, addressImmediateValue);

      storeOps.storeIndU8(valueRegisterIndex, addressRegisterIndex, addressImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u16 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueRegisterIndex, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 2, addressRegisterValue, addressImmediateValue);

      storeOps.storeIndU16(valueRegisterIndex, addressRegisterIndex, addressImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u32 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueRegisterIndex, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 4, addressRegisterValue, addressImmediateValue);

      storeOps.storeIndU32(valueRegisterIndex, addressRegisterIndex, addressImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u64 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
```
