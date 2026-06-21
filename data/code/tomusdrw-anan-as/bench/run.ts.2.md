---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/run.ts#L258-L377'
title: bench/run.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 52cd0153eb65f6395464c8a6de5d9e19c3c6948f05110286a113ef99ec8f1c4c
language: typescript
---
`bench/run.ts` (lines 258–377)

```typescript
    for (const data of tests) {
      const pageMap = (data["initial-page-map"] || []).map((p: W3fTest["initial-page-map"][0]) => ({
        ...p,
        access: p["is-writable"] ? 2 : 1,
      }));
      const memory = (data["initial-memory"] || []).map((c: W3fTest["initial-memory"][0]) => ({
        address: c.address,
        data: c.contents || [],
      }));
      const registers = (data["initial-regs"] || []).map((x: bigint | number) => BigInt(x));
      const gas = BigInt(data["initial-gas"] || 10000);
      const pc = data["initial-pc"] || 0;

      const exe = prepareProgram(
        InputKind.Generic,
        HasMetadata.No,
        data.program,
        registers,
        pageMap,
        memory,
        [],
        16,
        values["block-gas"],
      );
      runProgram(exe, gas, pc, false, false);
    }
  });

  console.log(formatResult(result));
  return result;
}

// ---- Main ----

async function main() {
  const pvm = await loadPvm();
  const mode = values.portable ? "portable JS" : "interpreter";
  console.log(`\nPVM Benchmark [${mode}] (${ITERATIONS} iterations, ${WARMUP} warmup)\n`);

  const suiteResult: SuiteResult = {
    timestamp: new Date().toISOString(),
    fibonacci: [],
    traces: [],
    w3f: null,
    summary: {
      fibonacciMedianMs: {},
      totalTraceMedianMs: 0,
      w3fMedianMs: null,
    },
  };

  // Fibonacci micro-benchmarks
  console.log("Fibonacci micro-benchmarks:");
  suiteResult.fibonacci = benchFibonacci(pvm);
  for (const r of suiteResult.fibonacci) {
    suiteResult.summary.fibonacciMedianMs[r.name] = r.medianMs;
  }
  console.log();

  // Trace benchmarks
  const traceDirs = [values.traces, "./bench/traces"].filter(Boolean);

  let traceDir: string | null = null;
  for (const d of traceDirs) {
    const resolved = resolve(d);
    if (existsSync(resolved)) {
      traceDir = resolved;
      break;
    }
  }

  if (traceDir) {
    console.log(`Trace replays (${traceDir}):`);
    suiteResult.traces = benchTraces(traceDir, pvm);
    suiteResult.summary.totalTraceMedianMs = suiteResult.traces.reduce((sum, r) => sum + r.medianMs, 0);
    console.log(`\n  TOTAL trace median: ${suiteResult.summary.totalTraceMedianMs.toFixed(1)}ms\n`);
  } else {
    console.log("No trace directory found. Skipping trace benchmarks.");
  }

  // W3F benchmarks
  const w3fDirs = [values.w3f, "./test/gas-cost-tests"].filter(Boolean);

  let w3fDir: string | null = null;
  for (const d of w3fDirs) {
    const resolved = resolve(d);
    if (existsSync(resolved)) {
      w3fDir = resolved;
      break;
    }
  }

  if (w3fDir) {
    console.log(`W3F test vectors (${w3fDir}):`);
    suiteResult.w3f = benchW3f(w3fDir, pvm);
    suiteResult.summary.w3fMedianMs = suiteResult.w3f?.medianMs ?? null;
    console.log();
  } else {
    console.log("No W3F directory found. Skipping W3F benchmarks.");
  }

  // Summary
  console.log("=== Summary ===");
  for (const [name, ms] of Object.entries(suiteResult.summary.fibonacciMedianMs)) {
    console.log(`  ${name.padEnd(22)} ${ms.toFixed(1)}ms`);
  }
  console.log(`  Trace total median:  ${suiteResult.summary.totalTraceMedianMs.toFixed(1)}ms`);
  if (suiteResult.summary.w3fMedianMs !== null) {
    console.log(`  W3F suite median:    ${suiteResult.summary.w3fMedianMs.toFixed(1)}ms`);
  }

  // Output JSON
  if (values.output) {
    const outputPath = resolve(values.output);
    writeFileSync(outputPath, JSON.stringify(suiteResult, null, 2));
    console.log(`\nResults written to ${outputPath}`);
  }
}

main();
```
