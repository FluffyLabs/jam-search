---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bench/run.ts#L1-L137'
title: bench/run.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 3
content_sha: f1ef290fc9dda0ec9f9ad39a686996f43507983410936b23638d637e2257b09b
language: typescript
---
`bench/run.ts` (lines 1–137)

```typescript
#!/usr/bin/env node

/**
 * PVM Interpreter Benchmark Suite
 *
 * Runs ecalli trace replays and W3F test vectors, measuring execution time.
 *
 * Usage:
 *   tsx bench/run.ts [--traces <dir>] [--w3f <dir>] [--iterations <n>] [--warmup <n>]
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { parseArgs } from "node:util";
import "json-bigint-patch";

import type { PvmApi } from "../bin/src/trace-replay.js";
import { replayTraceFile } from "../bin/src/trace-replay.js";
import { NoOpTracer } from "../bin/src/tracer.js";
import * as wasmPvm from "../build/release.js";

// ---- CLI ----

const { values } = parseArgs({
  options: {
    traces: { type: "string", default: "" },
    w3f: { type: "string", default: "" },
    iterations: { type: "string", default: "5" },
    warmup: { type: "string", default: "1" },
    output: { type: "string", default: "" },
    "block-gas": { type: "boolean", default: false },
    portable: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help) {
  console.log(`Usage: tsx bench/run.ts [options]

Options:
  --traces <dir>      Directory with ecalli trace .log files
  --w3f <dir>         Directory with W3F test vector .json files
  --iterations <n>    Number of timed iterations (default: 5)
  --warmup <n>        Number of warmup iterations (default: 1)
  --output <file>     Write JSON results to file
  --portable          Use portable JS build instead of WASM
  -h, --help          Show this help`);
  process.exit(0);
}

const ITERATIONS = parseInt(values.iterations ?? "5", 10);
const WARMUP = parseInt(values.warmup ?? "1", 10);

// Validate iterations and warmup
if (!Number.isInteger(ITERATIONS) || ITERATIONS < 1) {
  console.error(`Error: Invalid iterations value: ${values.iterations}. Must be an integer >= 1.`);
  process.exit(1);
}
if (!Number.isInteger(WARMUP) || WARMUP < 0 || WARMUP >= ITERATIONS) {
  console.error(
    `Error: Invalid warmup value: ${values.warmup}. Must be an integer >= 0 and < iterations (${ITERATIONS}).`,
  );
  process.exit(1);
}

// ---- Load PVM API ----

async function loadPvm(): Promise<PvmApi> {
  if (values.portable) {
    // The portable build exposes the same API surface but has different nominal types.
    return (await import("../dist/build/js/portable-bundle.js")) as unknown as PvmApi;
  }
  return wasmPvm;
}

// ---- Types ----

type BenchResult = {
  name: string;
  medianMs: number;
  minMs: number;
  maxMs: number;
  p95Ms: number;
  samples: number[];
};

type SuiteResult = {
  timestamp: string;
  fibonacci: BenchResult[];
  traces: BenchResult[];
  w3f: BenchResult | null;
  summary: {
    fibonacciMedianMs: Record<string, number>;
    totalTraceMedianMs: number;
    w3fMedianMs: number | null;
  };
};

// ---- Helpers ----

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function benchRun(name: string, fn: () => void): BenchResult {
  // warmup
  for (let i = 0; i < WARMUP; i++) {
    fn();
  }

  const samples: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    fn();
    const elapsed = performance.now() - start;
    samples.push(elapsed);
  }

  // Guard against empty samples
  if (samples.length === 0) {
    throw new Error(`No samples collected for benchmark: ${name}`);
  }

  const med = median(samples);
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const p95 = percentile(samples, 95);

```
