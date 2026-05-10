---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-trace-logger.test.ts#L1-L119
title: packages/core/pvm-host-calls/ecalli-trace-logger.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 3
content_sha: 2f32e3bb2b037ab1b01e09fedcde80264bce50b3000f75cc965bd2a9be155adb
language: typescript
---
`packages/core/pvm-host-calls/ecalli-trace-logger.test.ts` (lines 1–119)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { NO_OF_REGISTERS, REGISTER_BYTE_SIZE, tryAsSmallGas } from "@typeberry/pvm-interface";
import { EcalliTraceLogger, IoTraceTracker } from "./ecalli-trace-logger.js";
import { tryAsHostCallIndex } from "./host-call-handler.js";
import { HostCallRegisters } from "./host-call-registers.js";

/** Helper to create HostCallRegisters with specific values set. */
function createRegisters(values: Map<number, bigint>): HostCallRegisters {
  const bytes = new Uint8Array(NO_OF_REGISTERS * REGISTER_BYTE_SIZE);
  const view = new DataView(bytes.buffer);
  for (const [idx, value] of values) {
    view.setBigUint64(idx * REGISTER_BYTE_SIZE, value, true);
  }
  return HostCallRegisters.fromRaw(bytes);
}

describe("IoTraceLogger", () => {
  describe("logProgram", () => {
    it("formats program blob as hex", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logProgram(new Uint8Array([0x01, 0x02, 0xaa, 0xbb]), new Uint8Array());

      assert.strictEqual(lines.length, 1);
      assert.strictEqual(lines[0], "program 0x0102aabb");
    });

    it("handles empty program", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logProgram(new Uint8Array([]), new Uint8Array());

      assert.strictEqual(lines[0], "program 0x");
    });

    it("logs args as initial memory write", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logProgram(new Uint8Array([0x01]), new Uint8Array([0x00, 0x01, 0x02]));

      assert.strictEqual(lines.length, 2);
      assert.strictEqual(lines[0], "program 0x01");
      assert.strictEqual(lines[1], "memwrite 0xfeff0000 len=3 <- 0x000102");
    });
  });

  describe("logStart", () => {
    it("formats start with register dump", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(
        new Map<number, bigint>([
          [7, 0x10n],
          [9, 0x10000n],
        ]),
      );

      logger.logStart(0, tryAsSmallGas(10000), regs);

      assert.strictEqual(lines[0], "start pc=0 gas=10000 r07=0x10 r09=0x10000");
    });

    it("handles no non-zero registers", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map());

      logger.logStart(42, tryAsSmallGas(5000), regs);

      assert.strictEqual(lines[0], "start pc=42 gas=5000 ");
    });
  });

  describe("logEcalli", () => {
    it("formats ecalli with register dump", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(
        new Map<number, bigint>([
          [1, 0x1n],
          [3, 0x1000n],
        ]),
      );

      logger.logEcalli(tryAsHostCallIndex(10), 42, tryAsSmallGas(10000), regs);

      assert.strictEqual(lines[0], "ecalli=10 pc=42 gas=10000 r01=0x1 r03=0x1000");
    });

    it("omits zero registers", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(
        new Map<number, bigint>([
          [0, 0n],
          [1, 1n],
        ]),
      );

      logger.logEcalli(tryAsHostCallIndex(5), 0, tryAsSmallGas(5000), regs);

      assert.strictEqual(lines[0], "ecalli=5 pc=0 gas=5000 r01=0x1");
    });

    it("handles no non-zero registers", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map());

```
