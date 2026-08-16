---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-utils.test.ts#L1-L162
title: packages/core/pvm-interpreter/ops/math-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 66495454088ae31b460fe325fd9b62f3b36c5879e97013b8091368f8c18853c1
language: typescript
---
`packages/core/pvm-interpreter/ops/math-utils.test.ts` (lines 1–162)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { MAX_VALUE_U32 } from "@typeberry/numbers";
import { MAX_VALUE_I64 } from "./math-consts.js";
import {
  addWithOverflowU32,
  addWithOverflowU64,
  maxBigInt,
  minBigInt,
  mulLowerUnsignedU32,
  mulU64,
  mulUpperSS,
  mulUpperSU,
  mulUpperUU,
  subU32,
  subU64,
  unsignedRightShiftBigInt,
} from "./math-utils.js";

describe("math-utils", () => {
  describe("addWithOverflow", () => {
    it("should add two numbers without overflow", () => {
      const a = 5;
      const b = 6;
      const expectedResult = 11;

      const result = addWithOverflowU32(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should add two numbers (big and small) without overflow", () => {
      const a = MAX_VALUE_U32;
      const b = 6;
      const expectedResult = 5;

      const result = addWithOverflowU32(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should add two numbers with overflow", () => {
      const a = 2 ** 31 + 5;
      const b = 2 ** 31 + 6;
      const expectedResult = 11;

      const result = addWithOverflowU32(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should add max values with overflow", () => {
      const a = MAX_VALUE_U32;
      const b = MAX_VALUE_U32;
      const expectedResult = MAX_VALUE_U32 - 1;

      const result = addWithOverflowU32(a, b);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("sub", () => {
    it("should subtract two numbers without overflow", () => {
      const a = 6;
      const b = 5;
      const expectedResult = 1;

      const result = subU32(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should subtract two numbers with overflow", () => {
      const a = 5;
      const b = 6;
      const expectedResult = MAX_VALUE_U32;

      const result = subU32(a, b);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("mulUnsigned", () => {
    it("should multiply two numbers without overflow", () => {
      const a = 5;
      const b = 6;
      const expectedResult = 30;

      const result = mulLowerUnsignedU32(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two numbers with overflow", () => {
      const a = 2 ** 17 + 1;
      const b = 2 ** 18;
      const expectedResult = 262144;

      const result = mulLowerUnsignedU32(a, b);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("mulUpperUU", () => {
    it("should multiply two positive numbers", () => {
      const a = 5n;
      const b = 6n;
      const expectedResult = 0n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply negative and positive numbers", () => {
      const a = -5n;
      const b = 6n;
      const expectedResult = 5n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply positive and negative numbers", () => {
      const a = 5n;
      const b = -6n;
      const expectedResult = 4n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two negative numbers", () => {
      const a = -5n;
      const b = -6n;
      const expectedResult = 0xfffffffffffffff5n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive numbers", () => {
      const a = MAX_VALUE_I64;
      const b = MAX_VALUE_I64;
      const expectedResult = 0x4000000000000000n;

      const result = mulUpperUU(a, b);

      assert.strictEqual(result, expectedResult);
    });

    it("should multiply two big positive and negative numbers", () => {
      const a = MAX_VALUE_I64;
      const b = -MAX_VALUE_I64;
      const expectedResult = 4611686018427387904n;

```
