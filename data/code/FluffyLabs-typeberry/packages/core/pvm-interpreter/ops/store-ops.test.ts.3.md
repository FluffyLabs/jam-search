---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/store-ops.test.ts#L266-L282
title: packages/core/pvm-interpreter/ops/store-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 8aca3291226b1276328cb3d1fc7e5e25ccc533f0b0008ffe1be8e6aad1cf1d1c
language: typescript
---
`packages/core/pvm-interpreter/ops/store-ops.test.ts` (lines 266–282)

```typescript
      assert.deepStrictEqual(page, expectedPage);
    });

    it("should store u64 number", () => {
      const valueToStore = 0xfe_dc_ba_98n;
      const addressImmediateValue = 1n + 16n * BigInt(PAGE_SIZE);
      const addressRegisterValue = 1n;
      const { storeOps, valueRegisterIndex, addressImmediate, address, memory, expectedPage, addressRegisterIndex } =
        prepareStoreIndData(valueToStore, 8, addressRegisterValue, addressImmediateValue);

      storeOps.storeIndU64(valueRegisterIndex, addressRegisterIndex, addressImmediate);

      const page = memory.getPageDump(getPageNumber(address));
      assert.deepStrictEqual(page, expectedPage);
    });
  });
});
```
