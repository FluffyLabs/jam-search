---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-utils.test.ts#L448-L504
title: packages/core/pvm-interpreter/ops/math-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 4
content_sha: d1102adebded6a77c3052a1a36ea6696346d8a864f7c85655b1882941060cb1c
language: typescript
---
`packages/core/pvm-interpreter/ops/math-utils.test.ts` (lines 448–504)

```typescript
    describe("mulU64", () => {
      it("5 * 5 === 25", () => {
        const value1 = 5n;
        const value2 = 5n;
        const expectedResult = 25n;

        const result = mulU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });

      it("2 ** 63 * 2 === 0", () => {
        const value1 = 2n ** 63n;
        const value2 = 2n;
        const expectedResult = 0n;

        const result = mulU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });

      it("2 ** 63 * (2 ** 63 + 1) === 2 ** 63 * 2 ** 63 + 2 ** 63 === 2 ** 63", () => {
        const value1 = 2n ** 63n;
        const value2 = 2n ** 63n + 1n;
        const expectedResult = 2n ** 63n;

        const result = mulU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });
    });

    describe("min/max", () => {
      it("should correctly calculate min value", () => {
        const a = -10n;
        const b = 11n;
        const c = 0n;
        const expectedResult = a;

        const result = minBigInt(a, b, c);

        assert.strictEqual(result, expectedResult);
      });

      it("should correctly calculate max value", () => {
        const a = -10n;
        const b = 11n;
        const c = 0n;
        const expectedResult = b;

        const result = maxBigInt(a, b, c);

        assert.strictEqual(result, expectedResult);
      });
    });
  });
});
```
