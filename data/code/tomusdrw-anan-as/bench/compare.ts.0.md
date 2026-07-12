---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/compare.ts#L1-L141'
title: bench/compare.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 4
content_sha: 836b4216e1710af1dcec5fb782c55edda891f8fadb56fe922f7eaf1d4fe8c686
language: typescript
---
`bench/compare.ts` (lines 1–141)

```typescript
#!/usr/bin/env node
/**
 * Benchmark Comparison Tool
 *
 * Compares two benchmark result JSON files and reports regressions/improvements.
 *
 * Usage:
 *   tsx bench/compare.ts <baseline.json> <results.json> [--threshold <percent>]
 *
 * Options:
 *   --threshold <n>   Regression threshold as percentage (default: 5%)
 *   --verbose         Show detailed per-trace comparison
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  options: {
    threshold: { type: "string", short: "t", default: "5" },
    verbose: { type: "boolean", short: "v", default: false },
    markdown: { type: "string", short: "m", default: "" },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help || positionals.length < 2) {
  console.log(`Usage: tsx bench/compare.ts <baseline.json> <results.json> [options]

Options:
  -t, --threshold <n>   Regression threshold as percentage (default: 5%)
  -v, --verbose         Show detailed per-trace comparison
  -h, --help           Show this help`);
  process.exit(0);
}

const [baselinePath, resultsPath] = positionals;
const threshold = parseFloat(values.threshold ?? "5");

// Validate threshold
if (!Number.isFinite(threshold) || threshold < 0) {
  console.error(`Error: Invalid threshold value: ${values.threshold}. Must be a non-negative number.`);
  process.exit(1);
}
const baselineFile = resolve(baselinePath);
const resultsFile = resolve(resultsPath);

if (!existsSync(baselineFile)) {
  console.error(`Error: Baseline file not found: ${baselineFile}`);
  process.exit(1);
}

if (!existsSync(resultsFile)) {
  console.error(`Error: Results file not found: ${resultsFile}`);
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(baselineFile, "utf-8"));
const results = JSON.parse(readFileSync(resultsFile, "utf-8"));

type TraceResult = {
  name: string;
  medianMs: number;
  minMs: number;
  maxMs: number;
  p95Ms: number;
};

type SuiteResult = {
  timestamp: string;
  fibonacci?: TraceResult[];
  traces: TraceResult[];
  w3f: TraceResult | null;
  summary: {
    fibonacciMedianMs?: Record<string, number>;
    totalTraceMedianMs: number;
    w3fMedianMs: number | null;
  };
};

const baselineSuite = baseline as SuiteResult;
const resultsSuite = results as SuiteResult;

interface Comparison {
  name: string;
  baselineMs: number;
  currentMs: number;
  diffMs: number;
  diffPercent: number;
  status: "improvement" | "regression" | "neutral";
}

interface ComparisonResult {
  comparisons: Comparison[];
  regressions: Comparison[];
  improvements: Comparison[];
}

function compareBenchmarks(
  baselineItems: TraceResult[],
  currentItems: TraceResult[],
  threshold: number,
  warnOnMissing = false,
): ComparisonResult {
  const baselineMap = new Map(baselineItems.map((t) => [t.name, t]));
  const currentMap = new Map(currentItems.map((t) => [t.name, t]));

  const comparisons: Comparison[] = [];
  const regressions: Comparison[] = [];
  const improvements: Comparison[] = [];

  for (const [name, baseline] of baselineMap) {
    const current = currentMap.get(name);
    if (!current) {
      if (warnOnMissing) {
        console.warn(`Warning: No results for ${name}, skipping`);
      }
      continue;
    }

    const diffMs = current.medianMs - baseline.medianMs;
    let diffPercent: number;
    if (baseline.medianMs === 0) {
      diffPercent = diffMs === 0 ? 0 : diffMs > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else {
      diffPercent = (diffMs / baseline.medianMs) * 100;
    }

    let status: "improvement" | "regression" | "neutral" = "neutral";
    if (diffPercent > threshold) {
      status = "regression";
      regressions.push({
        name,
        baselineMs: baseline.medianMs,
        currentMs: current.medianMs,
        diffMs,
        diffPercent,
        status,
      });
```
