---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-utils.test.ts#L302-L455
title: packages/core/pvm-interpreter/ops/math-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 16e283a55452579b4a0921f50f7491cbb0e040c1f36e185d2ae7fa0c27b601de
language: typescript
---
`packages/core/pvm-interpreter/ops/math-utils.test.ts` (lines 302–455)

```typescript
    it("should multiply two negative numbers", () => {
      const a = -5n;
      const b = -6n;
      const expectedResult = 0n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive numbers", () => {
      const a = 2n ** 60n;
      const b = 2n ** 60n;
      const expectedResult = 2n ** 56n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive and negative numbers", () => {
      const a = 2n ** 60n;
      const b = -(2n ** 60n);
      const expectedResult = -0x100000000000000n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big negative and positive numbers", () => {
      const a = -(2n ** 60n);
      const b = 2n ** 60n;
      const expectedResult = -0x100000000000000n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big negative numbers", () => {
      const a = -(2n ** 60n);
      const b = -(2n ** 60n);
      const expectedResult = 2n ** 56n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("unsignedRightShiftBigInt", () => {
    it("0 >>> 5 === 0", () => {
      const value = 0n;
      const shift = 5n;
      const expectedResult = 0n;

      const result = unsignedRightShiftBigInt(value, shift);

      assert.deepStrictEqual(result, expectedResult);
    });

    it("-5 >>> 0 === 2 ** 64 - 5", () => {
      const value = -5n;
      const shift = 0n;
      const expectedResult = 2n ** 64n - 5n;

      const result = unsignedRightShiftBigInt(value, shift);

      assert.deepStrictEqual(result, expectedResult);
    });

    it("5 >>> 0 === 5", () => {
      const value = 5n;
      const shift = 0n;
      const expectedResult = 5n;

      const result = unsignedRightShiftBigInt(value, shift);

      assert.deepStrictEqual(result, expectedResult);
    });

    it("1 >>> 5 === 0", () => {
      const value = 1n;
      const shift = 5n;
      const expectedResult = 0n;

      const result = unsignedRightShiftBigInt(value, shift);

      assert.deepStrictEqual(result, expectedResult);
    });

    it("0xffff_ffff_ffff_ffff >>> 20 === 0x0000_0fff_ffff_ffff", () => {
      const value = 0xffff_ffff_ffff_ffffn;
      const shift = 20n;
      const expectedResult = 0x0000_0fff_ffff_ffffn;

      const result = unsignedRightShiftBigInt(value, shift);

      assert.deepStrictEqual(result, expectedResult);
    });

    describe("addWithOverflowU64", () => {
      it("5 + 5 === 10", () => {
        const value1 = 5n;
        const value2 = 5n;
        const expectedResult = 10n;

        const result = addWithOverflowU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });

      it("5 + 2 ** 64 === 5", () => {
        const value1 = 5n;
        const value2 = 2n ** 64n;
        const expectedResult = 5n;

        const result = addWithOverflowU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });
    });

    describe("subU64", () => {
      it("2 - 5 === 2 ** 64 - 3", () => {
        const value1 = 2n;
        const value2 = 5n;
        const expectedResult = 2n ** 64n - 3n;

        const result = subU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });

      it("5 - 2 === 3", () => {
        const value1 = 5n;
        const value2 = 2n;
        const expectedResult = 3n;

        const result = subU64(value1, value2);

        assert.deepStrictEqual(result, expectedResult);
      });
    });

    describe("mulU64", () => {
      it("5 * 5 === 25", () => {
        const value1 = 5n;
        const value2 = 5n;
        const expectedResult = 25n;

        const result = mulU64(value1, value2);

```
