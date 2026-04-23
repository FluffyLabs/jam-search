---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-trace-logger.test.ts#L226-L320
title: packages/core/pvm-host-calls/ecalli-trace-logger.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 213cd44a7d262438bc0c237f9d016c35400840a357ecab3c95cf0decfe25a77a
language: typescript
---
`packages/core/pvm-host-calls/ecalli-trace-logger.test.ts` (lines 226–320)

```typescript
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map([[0, 0x100n]]));
      logger.logHalt(42, tryAsSmallGas(9920), regs);

      assert.strictEqual(lines[0], "HALT pc=42 gas=9920 r00=0x100");
    });

    it("logs OOG", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map());
      logger.logOog(100, tryAsSmallGas(0), regs);

      assert.strictEqual(lines[0], "OOG pc=100 gas=0 ");
    });

    it("logs PANIC with argument", () => {
      const lines: string[] = [];
      const logger = EcalliTraceLogger.new((line: string) => lines.push(line));

      const regs = createRegisters(new Map());
      logger.logPanic(1, 50, tryAsSmallGas(500), regs);

      assert.strictEqual(lines[0], "PANIC=1 pc=50 gas=500 ");
    });
  });

  describe("noop logger", () => {
    it("does not throw and produces no output", () => {
      const logger = EcalliTraceLogger.noop();

      logger.logContext("test");
      logger.logProgram(new Uint8Array([1, 2, 3]), new Uint8Array());
      logger.logSetGas(tryAsSmallGas(100));
    });

    it("returns null tracker", () => {
      const logger = EcalliTraceLogger.noop();
      const tracker = logger.tracker();

      assert.strictEqual(tracker, null);
    });
  });

  describe("IoTraceTracker", () => {
    it("tracks memory reads", () => {
      const tracker = new IoTraceTracker();

      tracker.memRead(tryAsU32(0x1000), new Uint8Array([0x01, 0x02]));
      tracker.memRead(tryAsU32(0x2000), new Uint8Array([0x03]));

      assert.strictEqual(tracker.reads.length, 2);
      assert.strictEqual(tracker.reads[0].address, 0x1000);
      assert.strictEqual(tracker.reads[0].hex, "0x0102");
    });

    it("tracks memory writes", () => {
      const tracker = new IoTraceTracker();

      tracker.memWrite(tryAsU32(0x3000), new Uint8Array([0xaa, 0xbb]));

      assert.strictEqual(tracker.writes.length, 1);
      assert.strictEqual(tracker.writes[0].address, 0x3000);
      assert.strictEqual(tracker.writes[0].hex, "0xaabb");
    });

    it("tracks register writes", () => {
      const tracker = new IoTraceTracker();

      tracker.setReg(5, tryAsU64(0x42n));
      tracker.setReg(7, tryAsU64(0x100n));

      assert.strictEqual(tracker.registers.size, 2);
      assert.strictEqual(tracker.registers.get(5), tryAsU64(0x42n));
      assert.strictEqual(tracker.registers.get(7), tryAsU64(0x100n));
    });

    it("clears all tracked data", () => {
      const tracker = new IoTraceTracker();

      tracker.memRead(tryAsU32(0x1000), new Uint8Array([0x01]));
      tracker.memWrite(tryAsU32(0x2000), new Uint8Array([0x02]));
      tracker.setReg(0, tryAsU64(0x100n));

      tracker.clear();

      assert.strictEqual(tracker.reads.length, 0);
      assert.strictEqual(tracker.writes.length, 0);
      assert.strictEqual(tracker.registers.size, 0);
    });
  });
});
```
