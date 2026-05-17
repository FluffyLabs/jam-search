---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/run.ts#L130-L262'
title: bench/run.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 1
chunk_total: 3
content_sha: e46f837596293c78a4dbc6066de3dd1b23717687d59b780da4735967a19d90ba
language: typescript
---
`bench/run.ts` (lines 130–262)

```typescript
    throw new Error(`No samples collected for benchmark: ${name}`);
  }

  const med = median(samples);
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const p95 = percentile(samples, 95);

  return { name, medianMs: med, minMs: min, maxMs: max, p95Ms: p95, samples };
}

function formatResult(r: BenchResult): string {
  return `  ${r.name.padEnd(40)} median=${r.medianMs.toFixed(1)}ms  min=${r.minMs.toFixed(1)}ms  max=${r.maxMs.toFixed(1)}ms  p95=${r.p95Ms.toFixed(1)}ms`;
}

// ---- Fibonacci micro-benchmark ----

// A compact PVM program that computes fibonacci(reg[7]).
// Register 7 is the input (which fibonacci number to compute).
const FIB_PROGRAM = [
  0, 0, 33, 51, 8, 1, 51, 9, 1, 40, 3, 0, 149, 119, 255, 81, 7, 12, 100, 138, 200, 152, 8, 100, 169, 40, 243, 100, 135,
  51, 8, 51, 9, 1, 50, 0, 73, 147, 82, 213, 0,
];

// Each fib(n) loop iteration uses ~8 gas, so n must be large to stress the interpreter.
const FIB_CASES: Array<{ name: string; n: number; gas: bigint }> = [
  { name: "fib(10k)", n: 10_000, gas: 1_000_000n },
  { name: "fib(100k)", n: 100_000, gas: 10_000_000n },
  { name: "fib(1M)", n: 1_000_000, gas: 100_000_000n },
  { name: "fib(10M)", n: 10_000_000, gas: 1_000_000_000n },
];

function benchFibonacci(pvm: PvmApi): BenchResult[] {
  const { prepareProgram, runProgram, InputKind, HasMetadata } = pvm;
  const results: BenchResult[] = [];

  for (const { name, n, gas } of FIB_CASES) {
    const registers = [4294901760n, 0n, 0n, 0n, 0n, 0n, 0n, BigInt(n), 0n, 0n, 0n, 0n, 0n];

    const result = benchRun(name, () => {
      const exe = prepareProgram(InputKind.Generic, HasMetadata.No, FIB_PROGRAM, registers, [], [], [], 16);
      runProgram(exe, gas, 0, false, false);
    });

    console.log(formatResult(result));
    results.push(result);
  }

  return results;
}

// ---- Trace benchmarks ----

function benchTraces(dir: string, pvm: PvmApi): BenchResult[] {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".log"))
    .sort();

  if (files.length === 0) {
    console.log("  No trace files found.");
    return [];
  }

  console.log(`  Found ${files.length} trace files.`);
  const results: BenchResult[] = [];

  for (const file of files) {
    const filePath = join(dir, file);
    const name = basename(file, ".log");

    const result = benchRun(name, () => {
      replayTraceFile(filePath, {
        logs: false,
        hasMetadata: pvm.HasMetadata.Yes,
        verify: false,
        tracer: new NoOpTracer(),
        useBlockGas: values["block-gas"],
        pvm,
      });
    });

    console.log(formatResult(result));
    results.push(result);
  }

  return results;
}

// ---- W3F benchmarks ----

type W3fTest = {
  name: string;
  "initial-regs": (bigint | number)[];
  "initial-pc": number;
  "initial-page-map": Array<{ address: number; length: number; "is-writable": boolean }>;
  "initial-memory": Array<{ address: number; contents: number[] }>;
  "initial-gas": bigint | number;
  program: number[];
};

function benchW3f(dir: string, pvm: PvmApi): BenchResult | null {
  const { prepareProgram, runProgram, InputKind, HasMetadata } = pvm;

  let files: string[];
  try {
    files = readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();
  } catch {
    console.log("  W3F directory not accessible.");
    return null;
  }

  if (files.length === 0) {
    console.log("  No W3F test files found.");
    return null;
  }

  console.log(`  Found ${files.length} W3F test files.`);

  // Pre-parse all test data
  const tests: W3fTest[] = [];
  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    tests.push(JSON.parse(content));
  }

  const result = benchRun("w3f-all", () => {
    for (const data of tests) {
      const pageMap = (data["initial-page-map"] || []).map((p: W3fTest["initial-page-map"][0]) => ({
        ...p,
        access: p["is-writable"] ? 2 : 1,
      }));
```
