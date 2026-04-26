---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/compare.ts#L249-L363'
title: bench/compare.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 7ef18af39018543e9fd56527c3194d327c41738c636e8b436637a9c79837ab13
language: typescript
---
`bench/compare.ts` (lines 249–363)

```typescript
console.log(`Difference:     ${totalDiff >= 0 ? "+" : ""}${totalDiff.toFixed(1)}ms (${totalDiffPercent.toFixed(2)}%)`);

if (baselineSuite.w3f && resultsSuite.w3f) {
  const w3fDiff = resultsSuite.w3f.medianMs - baselineSuite.w3f.medianMs;

  // Guard against division by zero
  let w3fDiffPercent: number;
  if (baselineSuite.w3f.medianMs === 0) {
    w3fDiffPercent = w3fDiff === 0 ? 0 : w3fDiff > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else {
    w3fDiffPercent = (w3fDiff / baselineSuite.w3f.medianMs) * 100;
  }
  console.log(
    `\nW3F suite:      ${baselineSuite.w3f.medianMs.toFixed(1)}ms -> ${resultsSuite.w3f.medianMs.toFixed(1)}ms`,
  );
  console.log(`Difference:     ${w3fDiff >= 0 ? "+" : ""}${w3fDiff.toFixed(1)}ms (${w3fDiffPercent.toFixed(2)}%)`);
}

const allRegressions = regressions.length + fibRegressions.length;
const allImprovements = improvements.length + fibImprovements.length;
console.log(`\nRegressions: ${allRegressions}`);
console.log(`Improvements: ${allImprovements}`);

if (regressions.length > 0) {
  console.log("\n--- Regressions (worst first) ---\n");
  for (const r of regressions) {
    console.log(`  ${r.name.padEnd(40)} ${r.currentMs.toFixed(1).padStart(8)}ms  (+${r.diffPercent.toFixed(1)}%)`);
  }
}

if (improvements.length > 0) {
  console.log("\n--- Improvements ---\n");
  for (const i of improvements) {
    console.log(`  ${i.name.padEnd(40)} ${i.currentMs.toFixed(1).padStart(8)}ms  (${i.diffPercent.toFixed(1)}%)`);
  }
}

if (values.verbose && comparisons.length > 0) {
  console.log("\n--- All Traces ---\n");
  comparisons.sort((a, b) => Math.abs(b.diffPercent) - Math.abs(a.diffPercent));
  for (const c of comparisons) {
    const sign = c.diffMs >= 0 ? "+" : "";
    const marker = c.status === "regression" ? "⚠️" : c.status === "improvement" ? "✓" : " ";
    console.log(
      `  ${marker} ${c.name.padEnd(40)} ${c.baselineMs.toFixed(1).padStart(7)}ms -> ${c.currentMs.toFixed(1).padStart(7)}ms  (${sign}${c.diffPercent.toFixed(1)}%)`,
    );
  }
}

// Write markdown report
if (values.markdown) {
  const md = formatMarkdown(
    baselineSuite,
    resultsSuite,
    comparisons,
    regressions,
    improvements,
    fibComparisons,
    fibRegressions,
    fibImprovements,
    totalDiff,
    totalDiffPercent,
    threshold,
  );
  writeFileSync(resolve(values.markdown), md);
  console.log(`\nMarkdown report written to ${values.markdown}`);
}

// Exit code
if (allRegressions > 0) {
  console.log("\n❌ FAILED: Regressions detected above threshold\n");
  process.exit(1);
} else if (allImprovements > 0) {
  console.log("\n✅ PASSED: No regressions (improvements detected)\n");
  process.exit(0);
} else {
  console.log("\n✅ PASSED: No regressions or improvements beyond threshold\n");
  process.exit(0);
}

function formatMarkdown(
  base: SuiteResult,
  current: SuiteResult,
  all: Comparison[],
  regs: Comparison[],
  imps: Comparison[],
  fibAll: Comparison[],
  fibRegs: Comparison[],
  fibImps: Comparison[],
  totalDiffMs: number,
  totalDiffPct: number,
  thresh: number,
): string {
  const sign = (n: number) => (n >= 0 ? "+" : "");
  const totalRegs = regs.length + fibRegs.length;
  const totalImps = imps.length + fibImps.length;
  const status =
    totalRegs > 0
      ? `### :warning: ${totalRegs} regression(s) detected (>${thresh}% threshold)`
      : totalImps > 0
        ? "### :white_check_mark: No regressions (improvements detected)"
        : "### :white_check_mark: No significant changes";

  let md = "## Benchmark Results\n\n";
  md += `${status}\n\n`;

  // Summary table
  md += "| Metric | Baseline | Current | Change |\n";
  md += "|--------|----------|---------|--------|\n";

  // Fibonacci summary rows
  for (const c of fibAll) {
    md += `| **${c.name}** | ${c.baselineMs.toFixed(1)}ms | ${c.currentMs.toFixed(1)}ms | ${sign(c.diffPercent)}${c.diffPercent.toFixed(1)}% |\n`;
  }

```
