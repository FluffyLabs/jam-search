---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/test/test-trace-format.ts#L1-L98'
title: test/test-trace-format.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 3
content_sha: d98097a722992dff6116e77c76c101c433a9b4be85429eb89149d78619640df6
language: typescript
---
`test/test-trace-format.ts` (lines 1–98)

```typescript
#!/usr/bin/env node

import * as assert from "node:assert";
import { parseTrace } from "../bin/src/trace-parse.js";

// Test: round-trip parse of a spec-compliant trace
{
  const input = [
    "program 0x0102aabbccddeeff",
    "memwrite 0x00001000 len=8 <- 0x0000000000000001",
    "start pc=0 gas=10000 r07=0x10 r09=0x10000",
    "",
    "ecalli=10 pc=42 gas=9980 r01=0x1 r03=0x1000",
    "memread 0x00001000 len=4 -> 0x01020304",
    "memread 0x00001020 len=8 -> 0x0000000000000040",
    "memwrite 0x00002000 len=2 <- 0xffee",
    "setreg r00 <- 0x100",
    "setreg r02 <- 0x4",
    "setgas <- 9950",
    "",
    "HALT pc=42 gas=9920 r00=0x100 r02=0x4",
  ].join("\n");

  const trace = parseTrace(input);

  // Program
  assert.deepStrictEqual(Array.from(trace.program), [0x01, 0x02, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff], "program bytes");

  // Initial memwrite
  assert.strictEqual(trace.initialMemWrites.length, 1, "one initial memwrite");
  assert.strictEqual(trace.initialMemWrites[0].address, 0x00001000, "memwrite address");
  assert.strictEqual(trace.initialMemWrites[0].data.length, 8, "memwrite data length");

  // Start
  assert.strictEqual(trace.start.pc, 0, "start pc");
  assert.strictEqual(trace.start.gas, 10000n, "start gas");
  assert.strictEqual(trace.start.registers.get(7), 0x10n, "start r07");
  assert.strictEqual(trace.start.registers.get(9), 0x10000n, "start r09");
  assert.strictEqual(trace.start.registers.has(0), false, "start r00 omitted (zero)");

  // Ecalli
  assert.strictEqual(trace.ecalliEntries.length, 1, "one ecalli");
  const ecalli = trace.ecalliEntries[0];
  assert.strictEqual(ecalli.index, 10, "ecalli index");
  assert.strictEqual(ecalli.pc, 42, "ecalli pc");
  assert.strictEqual(ecalli.gas, 9980n, "ecalli gas");
  assert.strictEqual(ecalli.registers.get(1), 0x1n, "ecalli r01");
  assert.strictEqual(ecalli.registers.get(3), 0x1000n, "ecalli r03");

  // Memreads
  assert.strictEqual(ecalli.memReads.length, 2, "two memreads");
  assert.strictEqual(ecalli.memReads[0].address, 0x00001000, "memread 0 address");
  assert.strictEqual(ecalli.memReads[0].data.length, 4, "memread 0 length");
  assert.strictEqual(ecalli.memReads[1].address, 0x00001020, "memread 1 address");

  // Memwrites
  assert.strictEqual(ecalli.memWrites.length, 1, "one ecalli memwrite");
  assert.strictEqual(ecalli.memWrites[0].address, 0x00002000, "ecalli memwrite address");

  // Setregs
  assert.strictEqual(ecalli.setRegs.length, 2, "two setregs");
  assert.strictEqual(ecalli.setRegs[0].index, 0, "setreg 0 index");
  assert.strictEqual(ecalli.setRegs[0].value, 0x100n, "setreg 0 value");
  assert.strictEqual(ecalli.setRegs[1].index, 2, "setreg 1 index");
  assert.strictEqual(ecalli.setRegs[1].value, 0x4n, "setreg 1 value");

  // Setgas
  assert.strictEqual(ecalli.setGas, 9950n, "setgas");

  // Termination
  assert.strictEqual(trace.termination.type, "HALT", "termination type");
  assert.strictEqual(trace.termination.pc, 42, "termination pc");
  assert.strictEqual(trace.termination.gas, 9920n, "termination gas");
  assert.strictEqual(trace.termination.registers.get(0), 0x100n, "termination r00");
  assert.strictEqual(trace.termination.registers.get(2), 0x4n, "termination r02");

  console.log("PASS: spec example round-trip");
}

// Test: PANIC=0 (argument must always be present)
{
  const input = ["program 0x00", "start pc=0 gas=100", "PANIC=0 pc=5 gas=50 r00=0x1"].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.termination.type, "PANIC", "panic type");
  assert.strictEqual(trace.termination.panicArg, 0, "panic arg is 0");
  assert.strictEqual(trace.termination.pc, 5, "panic pc");
  assert.strictEqual(trace.termination.gas, 50n, "panic gas");

  console.log("PASS: PANIC=0");
}

// Test: PANIC with non-zero argument
{
  const input = ["program 0x00", "start pc=0 gas=100", "PANIC=42 pc=10 gas=0"].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.termination.panicArg, 42, "panic arg 42");
```
