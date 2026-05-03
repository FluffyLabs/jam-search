---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/compare.ts#L133-L254'
title: bench/compare.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 1
chunk_total: 4
content_sha: b769beb5e858653b2be889336be3ce9bc91a4850615a28f973a9d2ad05c1eaca
language: typescript
---
`bench/compare.ts` (lines 133–254)

```typescript
      status = "regression";
      regressions.push({
        name,
        baselineMs: baseline.medianMs,
        currentMs: current.medianMs,
        diffMs,
        diffPercent,
        status,
      });
    } else if (diffPercent < -threshold) {
      status = "improvement";
      improvements.push({
        name,
        baselineMs: baseline.medianMs,
        currentMs: current.medianMs,
        diffMs,
        diffPercent,
        status,
      });
    }

    comparisons.push({ name, baselineMs: baseline.medianMs, currentMs: current.medianMs, diffMs, diffPercent, status });
  }

  regressions.sort((a, b) => b.diffPercent - a.diffPercent);
  improvements.sort((a, b) => a.diffPercent - b.diffPercent);

  return { comparisons, regressions, improvements };
}

// Compare fibonacci benchmarks
function getFibResult(): ComparisonResult {
  if (baselineSuite.fibonacci && resultsSuite.fibonacci) {
    return compareBenchmarks(baselineSuite.fibonacci, resultsSuite.fibonacci, threshold);
  }
  const comparisons: Comparison[] = [];
  const regressions: Comparison[] = [];
  const improvements: Comparison[] = [];

  // Baseline has fibonacci but results don't - mark as missing
  if (baselineSuite.fibonacci) {
    for (const fib of baselineSuite.fibonacci) {
      const comparison: Comparison = {
        name: fib.name,
        baselineMs: fib.medianMs,
        currentMs: 0,
        diffMs: -fib.medianMs,
        diffPercent: Number.NEGATIVE_INFINITY,
        status: "regression",
      };
      comparisons.push(comparison);
      regressions.push(comparison);
    }
  }

  // Results has fibonacci but baseline doesn't - mark as new
  if (resultsSuite.fibonacci) {
    for (const fib of resultsSuite.fibonacci) {
      const comparison: Comparison = {
        name: fib.name,
        baselineMs: 0,
        currentMs: fib.medianMs,
        diffMs: fib.medianMs,
        diffPercent: Number.POSITIVE_INFINITY,
        status: "improvement",
      };
      comparisons.push(comparison);
      improvements.push(comparison);
    }
  }

  return { comparisons, regressions, improvements };
}

const fibResult = getFibResult();
const fibComparisons = fibResult.comparisons;
const fibRegressions = fibResult.regressions;
const fibImprovements = fibResult.improvements;
// Compare traces
const traceResult = compareBenchmarks(baselineSuite.traces, resultsSuite.traces, threshold, true);
const comparisons = traceResult.comparisons;
const regressions = traceResult.regressions;
const improvements = traceResult.improvements;

// Print results
console.log("\n=== Benchmark Comparison ===\n");
console.log(`Baseline: ${baselineSuite.timestamp}`);
console.log(`Results:  ${resultsSuite.timestamp}`);
console.log(`Threshold: ${threshold}%\n`);

console.log("--- Summary ---\n");

// Fibonacci summary
if (fibComparisons.length > 0) {
  console.log("Fibonacci benchmarks:");
  for (const c of fibComparisons) {
    const sign = c.diffMs >= 0 ? "+" : "";
    console.log(
      `  ${c.name.padEnd(20)} ${c.baselineMs.toFixed(1)}ms -> ${c.currentMs.toFixed(1)}ms  (${sign}${c.diffPercent.toFixed(1)}%)`,
    );
  }
  console.log();
}

console.log(
  `Total trace time: ${baselineSuite.summary.totalTraceMedianMs.toFixed(1)}ms -> ${resultsSuite.summary.totalTraceMedianMs.toFixed(1)}ms`,
);
const totalDiff = resultsSuite.summary.totalTraceMedianMs - baselineSuite.summary.totalTraceMedianMs;

// Guard against division by zero
let totalDiffPercent: number;
if (baselineSuite.summary.totalTraceMedianMs === 0) {
  totalDiffPercent = totalDiff === 0 ? 0 : totalDiff > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
} else {
  totalDiffPercent = (totalDiff / baselineSuite.summary.totalTraceMedianMs) * 100;
}
console.log(`Difference:     ${totalDiff >= 0 ? "+" : ""}${totalDiff.toFixed(1)}ms (${totalDiffPercent.toFixed(2)}%)`);

if (baselineSuite.w3f && resultsSuite.w3f) {
  const w3fDiff = resultsSuite.w3f.medianMs - baselineSuite.w3f.medianMs;

  // Guard against division by zero
```
