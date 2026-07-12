---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/common.ts#L282-L389
title: bin/test-runner/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 575bee083ef9aa78700653da4d82997d1eedf0aeefd34926ad406cc3673f89e1
language: typescript
---
`bin/test-runner/common.ts` (lines 282–389)

```typescript
      accepted === undefined ||
      // 2. No explicit `accepted` for the file kind is defined
      accepted[testFileContent.kind] === undefined ||
      // 3. If the list is defined, we make sure that the path is on that list.
      (accepted[testFileContent.kind] ?? []).some((x) => absolutePath.includes(x));

    const testVariants = prepareTest(runners, testFileContent, testFilePath, absolutePath, {
      pvms,
      accumulateSequentially,
    });
    for (const test of testVariants) {
      test.shouldSkip = !isAccepted;
      tests.push(test);
    }
  }

  // aggregate the tests by their runner.
  const aggregated = new Map<string, TestAndRunner<unknown>[]>();
  for (const test of tests) {
    const sameRunner = aggregated.get(test.runner) ?? [];
    sameRunner.push(test);
    aggregated.set(test.runner, sameRunner);
  }

  const pathToReplace = new RegExp(`.*${directoryToScan}/`);

  logger.info`Running ${tests.length} tests.`;
  // run in parallel and generate results.
  for (const [testGroupName, testRunners] of aggregated.entries()) {
    // split large suites into parts
    const batchSize = 50;
    const totalBatches = Math.ceil(testRunners.length / batchSize);
    for (let i = 0; i < totalBatches; i += 1) {
      // NOTE: we use `setImmediate` here, to make sure to start each suite
      // separately (faster feedback in the console when running tests).
      setImmediate(() => {
        const testName = `${testGroupName} tests [${i + 1}/${totalBatches}]`;
        logger.info`Running ${testName}`;
        const timeout = 5 * 60 * 1000;
        test.describe(
          testName,
          {
            concurrency: 100,
            timeout,
          },
          () => {
            const runnersBatch = testRunners.slice(i * batchSize, (i + 1) * batchSize);
            for (const runner of runnersBatch) {
              const fileName = runner.file.replace(pathToReplace, "");
              const testCase = `${runner.variant}` !== "" ? `[${runner.variant}] ${fileName}` : fileName;
              if (runner.shouldSkip) {
                test.it.skip(testCase, runner.test);
              } else {
                test.it(testCase, { timeout }, runner.test);
              }
            }
          },
        );
      });
    }
  }

  return "Tests registered successfully";
}

async function scanDir(relPath: string, dir: string, filePatterns: string[]): Promise<string[]> {
  try {
    const files = await fs.readdir(dir.startsWith("/") ? dir : `${relPath}/${dir}`, {
      recursive: true,
    });
    return files.filter((f) => filePatterns.some((pattern) => f.endsWith(pattern))).map((f) => `${dir}/${f}`);
  } catch (e) {
    logger.error`Unable to find test vectors in ${relPath}/${dir}: ${e}`;
    return [];
  }
}

type TestAndRunner<V> = {
  shouldSkip: boolean;
  runner: string;
  file: string;
  variant: V;
  test: (ctx: TestContext) => Promise<void>;
};

function prepareTest<T, V>(
  runners: Runner<T, V>[],
  testContent: testFile.Content,
  fileName: string,
  fullPath: string,
  globalOptions: GlobalsOptions,
): TestAndRunner<V>[] {
  const errors: [string, unknown][] = [];
  const handleError = (name: string, e: unknown) => errors.push([name, e]);
  // NOTE This is not safe, but if the test does not specify
  // variants it means it doesn't care about them.
  const noneVariant = "" as V;
  const matchingRunners: TestAndRunner<V>[] = [];

  // Find the first runner that is able to parse the input data.
  for (const { path, parsers, run, variants, chainSpecs } of runners) {
    // NOTE: this `if` statement is intended to speed up parsing of the test files
    // instead of trying each and every runner, we make sure that the absolute
    // path to the file includes each part of our "test path" definition.
    if (!path.split("/").every((pathPart) => fullPath.includes(pathPart))) {
      continue;
    }
    const specs = chainSpecs.length > 0 ? chainSpecs : [tinyChainSpec];
```
