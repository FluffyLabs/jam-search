---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/load-ops.test.ts#L330-L345
title: packages/core/pvm-interpreter/ops/load-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 4
chunk_total: 5
content_sha: 56d837ee13aade5454835b18be37582522f08750b93f0764a23a26ddcea2aeea
language: typescript
---
`packages/core/pvm-interpreter/ops/load-ops.test.ts` (lines 330–345)

```typescript
      const { loadOps, registers, resultRegisterIndex, addressRegisterIndex, immediate } = prepareLoadIndData(
        address,
        data,
        1n + 16n * BigInt(PAGE_SIZE),
        1n,
      );
      const expectedSignedValue = -1n;
      const expectedUnsignedValue = 2n ** 64n - 1n;

      loadOps.loadIndU64(resultRegisterIndex, addressRegisterIndex, immediate);

      assert.deepStrictEqual(registers.getU64(resultRegisterIndex), expectedUnsignedValue);
      assert.deepStrictEqual(registers.getI64(resultRegisterIndex), expectedSignedValue);
    });
  });
});
```
