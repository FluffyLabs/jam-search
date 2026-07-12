---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/test/test-trace-format.ts#L93-L206
title: test/test-trace-format.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 1
chunk_total: 3
content_sha: 643a7f1790adbd8c98a7fe500f2bf1ede9fbdbb43921c44c113acab1ea0b296b
language: typescript
---
`test/test-trace-format.ts` (lines 93–206)

```typescript
// Test: PANIC with non-zero argument
{
  const input = ["program 0x00", "start pc=0 gas=100", "PANIC=42 pc=10 gas=0"].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.termination.panicArg, 42, "panic arg 42");
  assert.strictEqual(trace.termination.registers.size, 0, "no registers");

  console.log("PASS: PANIC=42");
}

// Test: OOG termination
{
  const input = ["program 0x00", "start pc=0 gas=100", "OOG pc=99 gas=0"].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.termination.type, "OOG", "OOG type");
  assert.strictEqual(trace.termination.gas, 0n, "OOG gas is 0");

  console.log("PASS: OOG");
}

// Test: lines with log prefixes are handled (extractPayload)
{
  const input = [
    "TRACE [ecalli] program 0xaa",
    "TRACE [ecalli] start pc=0 gas=500 r00=0x1",
    "TRACE [ecalli] HALT pc=10 gas=400",
  ].join("\n");

  const trace = parseTrace(input);
  assert.deepStrictEqual(Array.from(trace.program), [0xaa], "prefixed program");
  assert.strictEqual(trace.start.registers.get(0), 0x1n, "prefixed start r00");
  assert.strictEqual(trace.termination.type, "HALT", "prefixed halt");

  console.log("PASS: log-prefixed lines");
}

// Test: comment lines are ignored
{
  const input = [
    "comment implementation typeberry 0.8.3",
    "comment chain-id fluffy-testnet",
    "program 0xbb",
    "comment accumulate",
    "start pc=0 gas=100",
    "HALT pc=5 gas=90",
  ].join("\n");

  const trace = parseTrace(input);
  assert.deepStrictEqual(Array.from(trace.program), [0xbb], "comment lines ignored");

  console.log("PASS: comment lines ignored");
}

// Test: zero-padded register indices in register dump
{
  const input = ["program 0x00", "start pc=0 gas=100 r00=0xff r12=0x1", "HALT pc=5 gas=90 r00=0xff r12=0x1"].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.start.registers.get(0), 0xffn, "r00 parsed");
  assert.strictEqual(trace.start.registers.get(12), 0x1n, "r12 parsed");

  console.log("PASS: zero-padded register indices");
}

// Test: empty register dump (all zeros)
{
  const input = ["program 0x00", "start pc=0 gas=100", "HALT pc=5 gas=90"].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.start.registers.size, 0, "empty register dump");
  assert.strictEqual(trace.termination.registers.size, 0, "empty termination registers");

  console.log("PASS: empty register dump");
}

// Test: multiple ecalli entries
{
  const input = [
    "program 0x00",
    "start pc=0 gas=10000",
    "ecalli=1 pc=10 gas=9000 r00=0x1",
    "setreg r00 <- 0x2",
    "ecalli=2 pc=20 gas=8000 r00=0x2",
    "memwrite 0x00001000 len=1 <- 0xff",
    "setgas <- 7900",
    "HALT pc=30 gas=7800",
  ].join("\n");

  const trace = parseTrace(input);
  assert.strictEqual(trace.ecalliEntries.length, 2, "two ecalli entries");
  assert.strictEqual(trace.ecalliEntries[0].index, 1, "first ecalli index");
  assert.strictEqual(trace.ecalliEntries[0].setRegs.length, 1, "first ecalli setregs");
  assert.strictEqual(trace.ecalliEntries[0].setGas, undefined, "first ecalli no setgas");
  assert.strictEqual(trace.ecalliEntries[1].index, 2, "second ecalli index");
  assert.strictEqual(trace.ecalliEntries[1].memWrites.length, 1, "second ecalli memwrites");
  assert.strictEqual(trace.ecalliEntries[1].setGas, 7900n, "second ecalli setgas");

  console.log("PASS: multiple ecalli entries");
}

// Test: missing program throws
assert.throws(() => parseTrace("start pc=0 gas=100\nHALT pc=5 gas=90"), /Missing program/, "missing program");
console.log("PASS: missing program throws");

// Test: missing start throws
assert.throws(() => parseTrace("program 0x00\nHALT pc=5 gas=90"), /Missing start/, "missing start");
console.log("PASS: missing start throws");

// Test: missing termination throws
assert.throws(() => parseTrace("program 0x00\nstart pc=0 gas=100"), /Missing termination/, "missing termination");
console.log("PASS: missing termination throws");

```
