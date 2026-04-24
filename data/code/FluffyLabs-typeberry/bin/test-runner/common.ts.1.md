---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/common.ts#L151-L285
title: bin/test-runner/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 009410ba61db3003e5542c9e31317fa1bc197aad3a92f0d0de0d55f617d3cef9
language: typescript
---
`bin/test-runner/common.ts` (lines 151–285)

```typescript
                               Available: ${ALL_PVMS.join(", ")}
                               Default: all PVMs

  --accumulate-sequentially    Run accumulation sequentially instead of in parallel.
                               Default: false

  -h, --help                   Show this help message.

Examples:
  test-runner                           Run all tests with all PVMs
  test-runner --pvm ananas              Run tests with ananas PVM only
  test-runner --accumulate-sequentially Run tests with sequential accumulation
  test-runner test.json                 Run specific test file
`;

export function parseArgs(argv: string[]) {
  const parsed = minimist(argv, {
    boolean: [ACCUMULATE_SEQUENTIALLY_OPTION, HELP_OPTION],
    alias: { h: HELP_OPTION },
    default: { [ACCUMULATE_SEQUENTIALLY_OPTION]: false },
  });

  const shouldShowHelp = getBooleanOption(parsed[HELP_OPTION]);

  if (shouldShowHelp) {
    console.log(HELP_MESSAGE);
    process.exit(0);
  }

  const pvms = getPvms(parsed[PVM_OPTION]);
  const accumulateSequentially = getBooleanOption(parsed[ACCUMULATE_SEQUENTIALLY_OPTION]);

  return {
    initialFiles: parsed._,
    pvms,
    accumulateSequentially,
  };

  function getBooleanOption(value: unknown): boolean {
    if (value === true) {
      return true;
    }

    return false;
  }

  function getPvms(parsed: string | undefined): SelectedPvm[] {
    const allPvms = ALL_PVMS.slice();

    if (parsed === undefined) {
      return allPvms;
    }

    const opts = parsed.split(",").map((x) => x.trim());
    const result: SelectedPvm[] = [];
    for (const o of opts) {
      const pvm = allPvms.find((p) => p === o);
      if (pvm !== undefined) {
        result.push(pvm);
      } else {
        throw new Error(`Unknown pvm value: ${o}. Use one of ${allPvms.join(", ")}.`);
      }
    }
    return result;
  }
}

export async function main(
  runners: Runner<unknown, unknown>[],
  directoryToScan: string,
  {
    initialFiles,
    pvms,
    accumulateSequentially,
    patterns = [testFile.bin, testFile.json],
    accepted,
    ignored,
  }: {
    initialFiles: string[];
    pvms: SelectedPvm[];
    accumulateSequentially: boolean;
    patterns?: (testFile.bin | testFile.json)[];
    accepted?: {
      [testFile.bin]?: string[];
      [testFile.json]?: string[];
    };
    ignored?: string[];
  },
) {
  await initWasm();
  const relPath = `${import.meta.dirname}/../..`;
  const tests: TestAndRunner<unknown>[] = [];
  const ignoredPatterns = ignored ?? [];

  let testFiles = initialFiles;
  if (initialFiles.length === 0) {
    // scan the given directory for fallback tests
    testFiles = await scanDir(relPath, directoryToScan, patterns);
  }

  logger.info`Preparing tests for ${testFiles.length} files.`;
  for (const testFilePath of testFiles) {
    const absolutePath = path.resolve(`${relPath}/${testFilePath}`);

    if (ignoredPatterns.some((x) => absolutePath.includes(x))) {
      if (testFiles.length === 1) {
        logger.info`Executing ignored file, because it was explicitly requested: ${absolutePath}`;
      } else {
        logger.log`Ignoring: ${absolutePath}`;
        continue;
      }
    }

    let testFileContent: testFile.Content;
    if (absolutePath.endsWith(testFile.bin)) {
      const content: Buffer = await fs.readFile(absolutePath);
      testFileContent = {
        kind: testFile.bin,
        content: new Uint8Array(content),
      };
    } else {
      const content = await fs.readFile(absolutePath, "utf8");
      testFileContent = {
        kind: testFile.json,
        content: JSON.parse(content),
      };
    }

    // we accept a test file when:
    // 1. No explicit `accepted` is defined
    const isAccepted =
      accepted === undefined ||
      // 2. No explicit `accepted` for the file kind is defined
      accepted[testFileContent.kind] === undefined ||
      // 3. If the list is defined, we make sure that the path is on that list.
```
