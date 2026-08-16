---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/bit-utils.test.ts#L1-L133
title: packages/core/pvm-interpreter/ops/bit-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4fba5a3004ef2e3bc8bb0467430a507f85a8bb555bebc1d5ac006fd025e201cc
language: typescript
---
`packages/core/pvm-interpreter/ops/bit-utils.test.ts` (lines 1–133)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { clz64, countBits32, countBits64, ctz32, ctz64 } from "./bit-utils.js";

describe("bit-utils", () => {
  describe("countBits32", () => {
    it("should correctly count 1 in number", () => {
      const value = 1;
      const expectedResult = 1;

      const result = countBits32(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count 1 in number (max value)", () => {
      const value = 0xffffffff;
      const expectedResult = 32;

      const result = countBits32(value);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("countBits64", () => {
    it("should correctly count 1 in bigint", () => {
      const value = 1n;
      const expectedResult = 1;

      const result = countBits64(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count 1 in bigint (max value)", () => {
      const value = 0xffffffff_ffffffffn;
      const expectedResult = 64;

      const result = countBits64(value);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("clzBigInt", () => {
    it("should correctly count leading 0 in bigint (min value)", () => {
      const value = 0n;
      const expectedResult = 64;

      const result = clz64(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count leading 0 in bigint (max value)", () => {
      const value = 2n ** 64n - 1n;
      const expectedResult = 0;

      const result = clz64(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count leading 0 in bigint (negative value)", () => {
      const value = -1n;
      const expectedResult = 0;

      const result = clz64(value);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("ctz32", () => {
    it("should correctly count trailing 0 in number (min value)", () => {
      const value = 0;
      const expectedResult = 32;

      const result = ctz32(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count trailing 0 in number (max value)", () => {
      const value = 2 ** 32 - 1;
      const expectedResult = 0;

      const result = ctz32(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count trailing 0 in number", () => {
      const value = 2 ** 31;
      const expectedResult = 31;

      const result = ctz32(value);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("ctz64", () => {
    it("should correctly count trailing 0 in bigint (min value)", () => {
      const value = 0n;
      const expectedResult = 64;

      const result = ctz64(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count trailing 0 in bigint (max value)", () => {
      const value = 2n ** 64n - 1n;
      const expectedResult = 0;

      const result = ctz64(value);

      assert.strictEqual(result, expectedResult);
    });

    it("should correctly count trailing 0 in bigint", () => {
      const value = 2n ** 63n;
      const expectedResult = 63;

      const result = ctz64(value);

      assert.strictEqual(result, expectedResult);
    });
  });
});
```
