---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/host-call-memory.test.ts#L1-L124
title: packages/core/pvm-host-calls/host-call-memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 05d24324c85e79567ada367100024ce9cc05676f89e4c9b4a5baecdb5751da5d
language: typescript
---
`packages/core/pvm-host-calls/host-call-memory.test.ts` (lines 1–124)

```typescript
import { beforeEach, describe, it } from "node:test";
import { tryAsU32, tryAsU64, type U32 } from "@typeberry/numbers";
import {
  getPageStartAddress,
  type IMemory,
  MAX_MEMORY_INDEX,
  MEMORY_SIZE,
  type PageFault,
} from "@typeberry/pvm-interface";
import { deepEqual, OK, Result } from "@typeberry/utils";
import { HostCallMemory } from "./host-call-memory.js";

class FakeMemory implements IMemory {
  store(address: U32, bytes: Uint8Array): Result<OK, PageFault> {
    const pageStart = getPageStartAddress(tryAsU32((address + bytes.length) % 2 ** 32));
    return Result.error(
      { address: tryAsU32(pageStart) },
      () => `Page fault: attempted to access reserved page ${pageStart}`,
    );
  }

  read(address: U32, result: Uint8Array): Result<OK, PageFault> {
    const pageStart = getPageStartAddress(tryAsU32((address + result.length) % 2 ** 32));
    return Result.error(
      { address: tryAsU32(pageStart) },
      () => `Page fault: attempted to access reserved page ${pageStart}`,
    );
  }
}

describe("HostCallMemory", () => {
  let memory: FakeMemory;
  let hostCallMemory: HostCallMemory;

  beforeEach(() => {
    memory = new FakeMemory();
    hostCallMemory = HostCallMemory.new(memory);
  });

  describe("storeFrom", () => {
    it("should always allow 0-length bytes", () => {
      const bytes = new Uint8Array([]);
      const address = tryAsU64(2 ** 40);

      const result = hostCallMemory.storeFrom(address, bytes);

      deepEqual(result, Result.ok(OK));
    });

    it("should pass through the result of the underlying memory's storeFrom method", () => {
      const bytes = new Uint8Array([1, 2, 3, 4]);
      const address = tryAsU64(0);

      const result = hostCallMemory.storeFrom(address, bytes);

      deepEqual(
        result,
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });

    it("should return OutOfBounds error when address + length exceeds MEMORY_SIZE", () => {
      const address = tryAsU64(MEMORY_SIZE - 2);
      const bytes = new Uint8Array([1, 2, 3]);

      const result = hostCallMemory.storeFrom(address, bytes);

      deepEqual(
        result,
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });

    it("should wrap address when exceeds MAX_MEMORY_INDEX and throw", () => {
      const address = tryAsU64(MAX_MEMORY_INDEX + 1);
      const bytes = new Uint8Array([1, 2, 3]);

      const res = hostCallMemory.storeFrom(address, bytes);

      deepEqual(
        res,
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });
  });

  describe("loadInto", () => {
    it("should always allow 0-length bytes", () => {
      const bytes = new Uint8Array([]);
      const address = tryAsU64(2 ** 40);

      const result = hostCallMemory.loadInto(bytes, address);

      deepEqual(result, Result.ok(OK));
    });

    it("should pass through the result of the underlying memory's loadInto method", () => {
      const bytes = new Uint8Array([1, 2, 3, 4]);
      const address = tryAsU64(0);

      const result = hostCallMemory.loadInto(bytes, address);

      deepEqual(
        result,
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });

    it("should return OutOfBounds error when address + length exceeds MEMORY_SIZE", () => {
      const address = tryAsU64(MEMORY_SIZE - 2);
      const result = new Uint8Array(3);

      const res = hostCallMemory.loadInto(result, address);

      deepEqual(
        res,
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });

    it("should wrap address when exceeds MAX_MEMORY_INDEX and throw", () => {
      const address = tryAsU64(MAX_MEMORY_INDEX + 1);
      const result = new Uint8Array([1, 2, 3]);

```
