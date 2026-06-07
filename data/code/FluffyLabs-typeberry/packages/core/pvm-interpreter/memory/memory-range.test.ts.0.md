---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-range.test.ts#L1-L118
title: packages/core/pvm-interpreter/memory/memory-range.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 0b493443e0340380c2ee7f0cb279ad5b4c5f8cde8ffbd4a13ab73252efe83a9e
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-range.test.ts` (lines 1–118)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { MEMORY_SIZE } from "@typeberry/pvm-interface";
import { PAGE_SIZE } from "./memory-consts.js";
import { tryAsMemoryIndex } from "./memory-index.js";
import { MemoryRange } from "./memory-range.js";

describe("MemoryRange", () => {
  describe("create", () => {
    it("should create a MemoryRange from addresses", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const expectedEnd = tryAsMemoryIndex(2 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.start, start);
      assert.strictEqual(memoryRange.end, expectedEnd);
    });

    it("should create a MemoryRange from starting point and length", () => {
      const start = tryAsMemoryIndex(1);
      const length = PAGE_SIZE;

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.start, start);
      assert.strictEqual(memoryRange.end, start + PAGE_SIZE);
    });
  });

  describe("isEmpty", () => {
    it("should return true for an empty range", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = 0;

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isEmpty(), true);
    });

    it("should return false for a non-empty range", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isEmpty(), false);
    });

    it("should return false for full range", () => {
      const start = tryAsMemoryIndex(0);
      const length = MEMORY_SIZE;

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isEmpty(), false);
    });
  });

  describe("isWrapped", () => {
    it("should return true for a wrapped range", () => {
      const start = tryAsMemoryIndex(2 * PAGE_SIZE);
      const length = MEMORY_SIZE - 5;

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isWrapped(), true);
    });

    it("should return false for a non-wrapped range", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isWrapped(), false);
    });
  });

  describe("isInRange", () => {
    it("should return true for a point in range (non-wrapped)", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE + 1;
      const address = tryAsMemoryIndex(2 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), true);
    });

    it("should return true for a point in range (wrapped)", () => {
      const start = tryAsMemoryIndex(3 * PAGE_SIZE);
      const length = MEMORY_SIZE - PAGE_SIZE;
      const address = tryAsMemoryIndex(4 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), true);
    });

    it("should return false for a point not in range (non-wrapped)", () => {
      const start = tryAsMemoryIndex(1 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const address = tryAsMemoryIndex(3 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

      assert.strictEqual(memoryRange.isInRange(address), false);
    });

    it("should return false for a point not in range (wrapped)", () => {
      const start = tryAsMemoryIndex(3 * PAGE_SIZE);
      const length = PAGE_SIZE;
      const address = tryAsMemoryIndex(2 * PAGE_SIZE);

      const memoryRange = MemoryRange.fromStartAndLength(start, length);

```
