---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/index.ts#L1-L121
title: packages/misc/benchmark/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 2
content_sha: f086ab6ee911a573521b97daba480c5fb9bb2f0742d3e21e1811aae2200baf55
language: typescript
---
`packages/misc/benchmark/index.ts` (lines 1–121)

```typescript
import fs from "node:fs";
import path from "node:path";
import { Logger } from "@typeberry/logger";
import chalk from "chalk";
import { formatResults } from "./format.js";
import { BENCHMARKS_DIR, DIST_DIR, EXPECTED_DIR_NAME, OUTPUT_DIR_NAME } from "./setup.js";
import type { BennyOps, BennyResults, ComparisonResult, ErrorResult, OkResult, Result } from "./types.js";

const commitHash = process.env.GITHUB_SHA;
const logger = Logger.new(import.meta.filename, "benchmarks");

runAllBenchmarks().catch((e: Error) => {
  logger.error`${e.message}`;
  logger.error`Cause: ${e.cause}`;
  logger.error`Stack: ${e.stack ?? ""}`;
  process.exit(-1);
});

async function runAllBenchmarks() {
  // We are going to run all benchmarks in our benchmark folder.
  const benchmarksPath = BENCHMARKS_DIR;
  const distPath = path.resolve(`${DIST_DIR}/benchmarks`);
  fs.mkdirSync(distPath, {
    recursive: true,
  });
  const benchmarks = fs.readdirSync(benchmarksPath);

  const results = new Map<string, Result>();
  const promises: Promise<void>[] = [];

  for (const benchmark of benchmarks) {
    const benchPath = `${benchmarksPath}/${benchmark}`;
    if (fs.statSync(benchPath).isDirectory()) {
      const files = fs.readdirSync(benchPath);
      for (const file of files) {
        const isTs = path.extname(file) === ".ts";
        if (isTs) {
          promises.push(
            runBenchmark(benchPath, file).then((res: Result) => {
              results.set(`${benchmark}/${file}`, res);
            }),
          );
        } else {
          logger.warn`Ignoring ${benchPath}/${file}`;
        }
      }
    }
  }

  await Promise.all(promises);

  // dump raw JSON
  fs.writeFileSync(`${distPath}/results.json`, JSON.stringify(Object.fromEntries(results.entries()), null, 2));

  // create a textual summary (github comment)
  const txt = formatResults(results, commitHash);
  fs.writeFileSync(`${distPath}/results.txt`, txt);

  // print summary
  logger.log`Summary:`;
  for (const [file, diffs] of results.entries()) {
    for (const [idx, diff] of diffs.diff.entries()) {
      logger.log`${file}[${idx}]: ${"err" in diff ? chalk.red.bold(diff.err) : chalk.green("OK")}`;
    }
  }

  const errorKeys: string[] = [];
  for (const [key, res] of Array.from(results.entries())) {
    if (res.diff.find((e: OkResult | ErrorResult) => "err" in e) !== undefined) {
      errorKeys.push(key);
    }
  }
  const hasErrors = errorKeys.length > 0;

  if (hasErrors) {
    const error = new Error(`${errorKeys.length} errors while running benchmarks. Exiting.`);
    error.cause = errorKeys.join(", ");
    throw error;
  }
}

async function runBenchmark(benchPath: string, fileName: string): Promise<Result> {
  const filePath = `${benchPath}/${fileName}`;
  const fileNameNoExt = path.basename(fileName, path.extname(fileName));
  logger.log`Running ${filePath}`;
  const run = await import(path.resolve(filePath));
  await run.default();

  logger.log`Compare with expected results.`;
  const outputPath = `${benchPath}/${OUTPUT_DIR_NAME}/${fileNameNoExt}.json`;
  const expectedPath = `${benchPath}/${EXPECTED_DIR_NAME}/${fileNameNoExt}.json`;

  const currentResults = JSON.parse(fs.readFileSync(outputPath).toString());
  const expectedContent = tryReadFile(expectedPath);
  if (expectedContent !== null) {
    const previousResults = JSON.parse(expectedContent.toString());
    return {
      diff: compareResults(currentResults, previousResults),
      current: currentResults,
    };
  }

  // If the expected directory does not exist, just compare with itself.
  return {
    diff: compareResults(currentResults, currentResults),
    current: currentResults,
  };
}

function tryReadFile(p: string) {
  try {
    return fs.readFileSync(p);
  } catch {
    return null;
  }
}

function compareResults(currentResults: BennyResults, expectedResults: BennyResults): ComparisonResult {
  const curr = currentResults.results;
  let prev = expectedResults.results;

```
