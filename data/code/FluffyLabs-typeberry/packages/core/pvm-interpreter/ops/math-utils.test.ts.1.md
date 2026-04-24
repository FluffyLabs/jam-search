---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-utils.test.ts#L155-L311
title: packages/core/pvm-interpreter/ops/math-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 368ee170848cd623c3f894d2ff78a21c7f743999260a4145c0c03248f882b2b1
language: typescript
---
`packages/core/pvm-interpreter/ops/math-utils.test.ts` (lines 155–311)

```typescript
      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive and negative numbers", () => {
      const a = MAX_VALUE_I64;
      const b = -MAX_VALUE_I64;
      const expectedResult = 4611686018427387904n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big negative and positive numbers", () => {
      const a = -MAX_VALUE_I64;
      const b = MAX_VALUE_I64;
      const expectedResult = 4611686018427387904n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big negative numbers", () => {
      const a = -MAX_VALUE_I64;
      const b = -MAX_VALUE_I64;
      const expectedResult = 0x4000000000000000n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("mulUpperSU", () => {
    it("should multiply two positive numbers", () => {
      const a = 5n;
      const b = 6n;
      const expectedResult = 0n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply negative and positive numbers", () => {
      const a = -5n;
      const b = 6n;
      const expectedResult = -1n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply positive and negative numbers", () => {
      const a = 5n;
      const b = -6n;
      const expectedResult = 4n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two negative numbers", () => {
      const a = -5n;
      const b = -6n;
      const expectedResult = -5n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive numbers", () => {
      const a = MAX_VALUE_I64;
      const b = MAX_VALUE_I64;
      const expectedResult = 0x4000000000000000n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive and negative numbers", () => {
      const a = 2n ** 60n;
      const b = -(2n ** 60n);
      const expectedResult = 0xf00000000000000n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big negative and positive numbers", () => {
      const a = -(2n ** 60n);
      const b = 2n ** 60n;
      const expectedResult = -(2n ** 56n);

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big negative numbers", () => {
      const a = -(2n ** 60n);
      const b = -(2n ** 60n);
      const expectedResult = -0xf00000000000000n;

      const result = mulUpperSU(a, b);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("mulUpperSS", () => {
    it("should multiply two positive numbers", () => {
      const a = 5n;
      const b = 6n;
      const expectedResult = 0n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply negative and positive numbers", () => {
      const a = -5n;
      const b = 6n;
      const expectedResult = -1n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply positive and negative numbers", () => {
      const a = 5n;
      const b = -6n;
      const expectedResult = -1n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two negative numbers", () => {
      const a = -5n;
      const b = -6n;
      const expectedResult = 0n;

      const result = mulUpperSS(a, b);

      assert.strictEqual(result, expectedResult);
    });

```
