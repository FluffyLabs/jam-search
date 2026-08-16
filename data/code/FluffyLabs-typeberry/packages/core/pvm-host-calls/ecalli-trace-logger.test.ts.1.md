---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-trace-logger.test.ts#L114-L231
title: packages/core/pvm-host-calls/ecalli-trace-logger.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 4db0e49ebb5b6dc29274be67d935de6c4113fff277838e485a40790f79ebbd95
language: typescript
---
`packages/core/pvm-host-calls/ecalli-trace-logger.test.ts` (lines 114–231)

```typescript
    it("handles no non-zero registers", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map());

      logger.logEcalli(tryAsHostCallIndex(0), 0, tryAsSmallGas(100), regs);

      assert.strictEqual(lines[0], "ecalli=0 pc=0 gas=100 ");
    });
  });

  describe("logMemRead", () => {
    it("formats memory read", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logMemRead(0x1000, 4, "0x01020304");

      assert.strictEqual(lines[0], "memread 0x00001000 len=4 -> 0x01020304");
    });
  });

  describe("logMemWrite", () => {
    it("formats memory write", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logMemWrite(0x2000, 2, "0xffee");

      assert.strictEqual(lines[0], "memwrite 0x00002000 len=2 <- 0xffee");
    });
  });

  describe("logSetReg", () => {
    it("formats register write with padded index", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logSetReg(0, 0x100n);

      assert.strictEqual(lines[0], "setreg r00 <- 0x100");
    });

    it("formats two-digit register index", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logSetReg(12, 0x4n);

      assert.strictEqual(lines[0], "setreg r12 <- 0x4");
    });
  });

  describe("logSetGas", () => {
    it("formats gas write", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      logger.logSetGas(tryAsSmallGas(9950));

      assert.strictEqual(lines[0], "setgas <- 9950");
    });
  });

  describe("logHostActions", () => {
    it("logs actions in correct order: reads, writes, regs, gas", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const tracker = new IoTraceTracker();
      tracker.memWrite(tryAsU32(0x2000), new Uint8Array([0xab]));
      tracker.memRead(tryAsU32(0x1000), new Uint8Array([0xcd]));
      tracker.setReg(0, tryAsU64(0x100n));

      logger.logHostActions(tracker, tryAsSmallGas(10000), tryAsSmallGas(9950));

      assert.strictEqual(lines.length, 4);
      assert.strictEqual(lines[0], "memread 0x00001000 len=1 -> 0xcd");
      assert.strictEqual(lines[1], "memwrite 0x00002000 len=1 <- 0xab");
      assert.strictEqual(lines[2], "setreg r00 <- 0x100");
      assert.strictEqual(lines[3], "setgas <- 9950");
    });

    it("sorts reads by address", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const tracker = new IoTraceTracker();
      tracker.memRead(tryAsU32(0x2000), new Uint8Array([0x01]));
      tracker.memRead(tryAsU32(0x1000), new Uint8Array([0x02]));

      logger.logHostActions(tracker, tryAsSmallGas(100), tryAsSmallGas(100));

      assert.strictEqual(lines[0], "memread 0x00001000 len=1 -> 0x02");
      assert.strictEqual(lines[1], "memread 0x00002000 len=1 -> 0x01");
    });

    it("skips setgas if unchanged", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const tracker = new IoTraceTracker();

      logger.logHostActions(tracker, tryAsSmallGas(100), tryAsSmallGas(100));

      assert.strictEqual(lines.length, 0);
    });
  });

  describe("termination logging", () => {
    it("logs HALT", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map([[0, 0x100n]]));
      logger.logHalt(42, tryAsSmallGas(9920), regs);

```
