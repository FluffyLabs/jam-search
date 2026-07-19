---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/compare.ts#L359-L410'
title: bench/compare.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 76cdad7462c0dd850783d5e9adba97bdee067d08d20dd7c34a47493c77b419cc
language: typescript
---
`bench/compare.ts` (lines 359–410)

```typescript
  // Fibonacci summary rows
  for (const c of fibAll) {
    md += `| **${c.name}** | ${c.baselineMs.toFixed(1)}ms | ${c.currentMs.toFixed(1)}ms | ${sign(c.diffPercent)}${c.diffPercent.toFixed(1)}% |\n`;
  }

  md += `| **Trace total** | ${base.summary.totalTraceMedianMs.toFixed(1)}ms | ${current.summary.totalTraceMedianMs.toFixed(1)}ms | ${sign(totalDiffMs)}${totalDiffMs.toFixed(1)}ms (${sign(totalDiffPct)}${totalDiffPct.toFixed(1)}%) |\n`;

  if (base.w3f && current.w3f) {
    const w3fDiff = current.w3f.medianMs - base.w3f.medianMs;
    const w3fPct = base.w3f.medianMs === 0 ? 0 : (w3fDiff / base.w3f.medianMs) * 100;
    md += `| **W3F suite** | ${base.w3f.medianMs.toFixed(1)}ms | ${current.w3f.medianMs.toFixed(1)}ms | ${sign(w3fDiff)}${w3fDiff.toFixed(1)}ms (${sign(w3fPct)}${w3fPct.toFixed(1)}%) |\n`;
  }

  // Regressions (combined)
  const allRegs = [...fibRegs, ...regs];
  if (allRegs.length > 0) {
    md += "\n<details><summary>Regressions (worst first)</summary>\n\n";
    md += "| Benchmark | Baseline | Current | Change |\n";
    md += "|-----------|----------|---------|--------|\n";
    for (const r of allRegs) {
      md += `| ${r.name} | ${r.baselineMs.toFixed(1)}ms | ${r.currentMs.toFixed(1)}ms | +${r.diffPercent.toFixed(1)}% |\n`;
    }
    md += "\n</details>\n";
  }

  // Improvements (combined)
  const allImps = [...fibImps, ...imps];
  if (allImps.length > 0) {
    md += "\n<details><summary>Improvements</summary>\n\n";
    md += "| Benchmark | Baseline | Current | Change |\n";
    md += "|-----------|----------|---------|--------|\n";
    for (const i of allImps) {
      md += `| ${i.name} | ${i.baselineMs.toFixed(1)}ms | ${i.currentMs.toFixed(1)}ms | ${i.diffPercent.toFixed(1)}% |\n`;
    }
    md += "\n</details>\n";
  }

  // All traces
  if (all.length > 0) {
    const sorted = [...all].sort((a, b) => Math.abs(b.diffPercent) - Math.abs(a.diffPercent));
    md += "\n<details><summary>All traces</summary>\n\n";
    md += "| Trace | Baseline | Current | Change |\n";
    md += "|-------|----------|---------|--------|\n";
    for (const c of sorted) {
      const icon = c.status === "regression" ? ":warning:" : c.status === "improvement" ? ":white_check_mark:" : "";
      md += `| ${icon} ${c.name} | ${c.baselineMs.toFixed(1)}ms | ${c.currentMs.toFixed(1)}ms | ${sign(c.diffPercent)}${c.diffPercent.toFixed(1)}% |\n`;
    }
    md += "\n</details>\n";
  }

  return md;
}
```
