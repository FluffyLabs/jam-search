---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/program-decoder/mask.test.ts#L1-L122
title: packages/core/pvm-interpreter/program-decoder/mask.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 209b8aa904eca013cb5cc210f4f9907ee5e9aa1b7e49092a9f2d3b077dd19929
language: typescript
---
`packages/core/pvm-interpreter/program-decoder/mask.test.ts` (lines 1–122)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { BitVec } from "@typeberry/bytes";
import { Mask } from "./mask.js";

describe("Mask", () => {
  describe("isInstruction", () => {
    it("should return true (single byte)", () => {
      const input = [0b0000_0001];

      const index = 0;
      const expectedResult = true;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 3));

      const result = mask.isInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return false (single byte)", () => {
      const input = [0b0000_0001];
      const index = 1;
      const expectedResult = false;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 3));

      const result = mask.isInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return true (2 bytes)", () => {
      const input = [0x0, 0b0000_0001];
      const index = 8;
      const expectedResult = true;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 11));

      const result = mask.isInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return false (2 bytes)", () => {
      const input = [0xff, 0b0000_0001];
      const index = 10;
      const expectedResult = false;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 11));

      const result = mask.isInstruction(index);

      assert.strictEqual(result, expectedResult);
    });
  });

  describe("getNoOfBytesToNextInstruction", () => {
    it("should return distance to the end of program", () => {
      const input = [0b0000_0001];
      const index = 1;
      const expectedResult = 2;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 3));

      const result = mask.getNoOfBytesToNextInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return distance to the next instruction in single byte", () => {
      const input = [0b0000_1001];
      const index = 1;
      const expectedResult = 2;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 8));

      const result = mask.getNoOfBytesToNextInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return 0 if the bit value is 1", () => {
      const input = [0b0000_0001];
      const index = 0;
      const expectedResult = 0;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 3));

      const result = mask.getNoOfBytesToNextInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return number of 0s between two 1 in 2 bytes", () => {
      const input = [0b0001_1001, 0b0001_1000];
      const index = 5;
      const expectedResult = 6;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 16));

      const result = mask.getNoOfBytesToNextInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return distance to the end of program", () => {
      const input = [0b0001_1001];
      const index = 5;
      const expectedResult = 3;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), 8));

      const result = mask.getNoOfBytesToNextInstruction(index);

      assert.strictEqual(result, expectedResult);
    });

    it("should return MAX_INSTRUCTION_DISTANCE = 24 if the real distance is longer", () => {
      const input = [0b0000_0001, 0b0000_0000, 0b0000_0000, 0b1000_0000];
      const index = 1;
      const expectedResult = 25;
      const mask = Mask.new(BitVec.fromBlob(new Uint8Array(input), input.length * 8));

      const result = mask.getNoOfBytesToNextInstruction(index);

      assert.strictEqual(result, expectedResult);
    });
  });
});
```
